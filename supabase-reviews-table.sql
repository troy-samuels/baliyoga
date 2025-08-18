-- Create reviews table for studio and retreat reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('studio', 'retreat')),
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    helpful_count INTEGER DEFAULT 0 NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE NOT NULL,
    verification_token TEXT,
    moderation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Ensure one review per email per item
    UNIQUE(item_id, user_email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_item_id ON public.reviews(item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_item_type ON public.reviews(item_type);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_helpful_count ON public.reviews(helpful_count DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON public.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_is_verified ON public.reviews(is_verified);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_verification_token ON public.reviews(verification_token);

-- Create table for review helpfulness votes
CREATE TABLE IF NOT EXISTS public.review_helpfulness (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_ip TEXT NOT NULL,
    user_fingerprint TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- One vote per review per user (using IP + fingerprint for anonymous users)
    UNIQUE(review_id, user_ip, user_fingerprint)
);

-- Create index for review helpfulness
CREATE INDEX IF NOT EXISTS idx_review_helpfulness_review_id ON public.review_helpfulness(review_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpfulness ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reviews
-- Allow public read access to approved and verified reviews
CREATE POLICY "Allow public read access to approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true AND is_verified = true);

-- Allow anyone to insert reviews (will need verification)
CREATE POLICY "Allow public insert of reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

-- Only service role can update review verification and approval status
CREATE POLICY "Only service role can update review status" ON public.reviews
    FOR UPDATE USING (auth.role() = 'service_role');

-- Allow review authors to update their own unverified reviews (limited fields)
CREATE POLICY "Authors can update own unverified reviews" ON public.reviews
    FOR UPDATE USING (
        is_verified = false AND 
        user_email = current_setting('request.jwt.claims', true)::json->>'email'
    );

-- Create RLS policies for review helpfulness
-- Allow public read access
CREATE POLICY "Allow public read access to review helpfulness" ON public.review_helpfulness
    FOR SELECT USING (true);

-- Allow public insert of helpfulness votes
CREATE POLICY "Allow public insert of helpfulness votes" ON public.review_helpfulness
    FOR INSERT WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_reviews_updated_at();

-- Function to increment helpful count when someone votes
CREATE OR REPLACE FUNCTION public.increment_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.reviews 
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update helpful count
CREATE TRIGGER handle_review_helpful_increment
    AFTER INSERT ON public.review_helpfulness
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_review_helpful_count();

-- Function to decrement helpful count when vote is removed
CREATE OR REPLACE FUNCTION public.decrement_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.reviews 
    SET helpful_count = GREATEST(helpful_count - 1, 0)
    WHERE id = OLD.review_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update helpful count on delete
CREATE TRIGGER handle_review_helpful_decrement
    AFTER DELETE ON public.review_helpfulness
    FOR EACH ROW
    EXECUTE FUNCTION public.decrement_review_helpful_count();

-- Function to verify a review using token
CREATE OR REPLACE FUNCTION public.verify_review(p_token TEXT)
RETURNS boolean AS $$
DECLARE
    review_found boolean := false;
BEGIN
    UPDATE public.reviews 
    SET 
        is_verified = true,
        verified_at = TIMEZONE('utc'::text, NOW()),
        verification_token = NULL
    WHERE verification_token = p_token
    AND is_verified = false;
    
    GET DIAGNOSTICS review_found = FOUND;
    RETURN review_found;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve/reject a review (for moderation)
CREATE OR REPLACE FUNCTION public.moderate_review(
    p_review_id UUID, 
    p_approved BOOLEAN, 
    p_notes TEXT DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
    review_found boolean := false;
BEGIN
    UPDATE public.reviews 
    SET 
        is_approved = p_approved,
        approved_at = CASE WHEN p_approved THEN TIMEZONE('utc'::text, NOW()) ELSE NULL END,
        moderation_notes = p_notes
    WHERE id = p_review_id
    AND is_verified = true;
    
    GET DIAGNOSTICS review_found = FOUND;
    RETURN review_found;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get review statistics for an item
CREATE OR REPLACE FUNCTION public.get_review_stats(p_item_id TEXT)
RETURNS TABLE (
    average_rating NUMERIC,
    total_reviews INTEGER,
    rating_distribution JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH review_stats AS (
        SELECT 
            AVG(rating::NUMERIC) as avg_rating,
            COUNT(*)::INTEGER as total_count,
            jsonb_object_agg(
                rating::TEXT, 
                count::INTEGER
            ) as distribution
        FROM (
            SELECT 
                rating,
                COUNT(*) as count
            FROM public.reviews 
            WHERE item_id = p_item_id 
            AND is_approved = true 
            AND is_verified = true
            GROUP BY rating
        ) rating_counts
    )
    SELECT 
        ROUND(avg_rating, 1) as average_rating,
        total_count as total_reviews,
        COALESCE(distribution, '{}'::jsonb) as rating_distribution
    FROM review_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON public.reviews TO anon;
GRANT INSERT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

GRANT SELECT ON public.review_helpfulness TO anon;
GRANT INSERT ON public.review_helpfulness TO anon;
GRANT ALL ON public.review_helpfulness TO authenticated;
GRANT ALL ON public.review_helpfulness TO service_role;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.verify_review(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.moderate_review(UUID, BOOLEAN, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_review_stats(TEXT) TO anon;

-- Create view for public review display (approved and verified only)
CREATE OR REPLACE VIEW public.public_reviews AS
SELECT 
    id,
    item_id,
    item_type,
    user_name,
    rating,
    title,
    content,
    helpful_count,
    created_at,
    verified_at
FROM public.reviews
WHERE is_approved = true AND is_verified = true
ORDER BY helpful_count DESC, created_at DESC;

-- Create view for admin moderation
CREATE OR REPLACE VIEW public.reviews_moderation AS
SELECT 
    id,
    item_id,
    item_type,
    user_email,
    user_name,
    rating,
    title,
    content,
    helpful_count,
    is_verified,
    is_approved,
    moderation_notes,
    created_at,
    verified_at,
    approved_at
FROM public.reviews
ORDER BY 
    CASE WHEN is_verified AND NOT is_approved THEN 0 ELSE 1 END,
    created_at DESC;

-- Grant access to views
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;
GRANT SELECT ON public.reviews_moderation TO authenticated;
GRANT SELECT ON public.reviews_moderation TO service_role;