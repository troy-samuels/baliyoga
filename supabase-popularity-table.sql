-- Create popularity_scores table for tracking wishlist counts
CREATE TABLE IF NOT EXISTS public.popularity_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id TEXT NOT NULL UNIQUE,
    item_type TEXT NOT NULL CHECK (item_type IN ('studio', 'retreat')),
    wishlist_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_popularity_scores_item_id ON public.popularity_scores(item_id);
CREATE INDEX IF NOT EXISTS idx_popularity_scores_item_type ON public.popularity_scores(item_type);
CREATE INDEX IF NOT EXISTS idx_popularity_scores_wishlist_count ON public.popularity_scores(wishlist_count DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.popularity_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - Allow public read access for popularity scores
CREATE POLICY "Allow public read access to popularity scores" ON public.popularity_scores
    FOR SELECT USING (true);

-- Only authenticated users can update popularity scores (for future implementation)
CREATE POLICY "Only authenticated users can update popularity scores" ON public.popularity_scores
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Only service role can insert/delete popularity scores
CREATE POLICY "Only service role can insert popularity scores" ON public.popularity_scores
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service role can delete popularity scores" ON public.popularity_scores
    FOR DELETE USING (auth.role() = 'service_role');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_popularity_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_popularity_scores_updated_at
    BEFORE UPDATE ON public.popularity_scores
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_popularity_updated_at();

-- Function to increment popularity score
CREATE OR REPLACE FUNCTION public.increment_popularity_score(p_item_id TEXT, p_item_type TEXT)
RETURNS void AS $$
BEGIN
    INSERT INTO public.popularity_scores (item_id, item_type, wishlist_count)
    VALUES (p_item_id, p_item_type, 1)
    ON CONFLICT (item_id)
    DO UPDATE SET 
        wishlist_count = popularity_scores.wishlist_count + 1,
        updated_at = TIMEZONE('utc'::text, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement popularity score
CREATE OR REPLACE FUNCTION public.decrement_popularity_score(p_item_id TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.popularity_scores 
    SET 
        wishlist_count = GREATEST(wishlist_count - 1, 0),
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE item_id = p_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON public.popularity_scores TO anon;
GRANT SELECT ON public.popularity_scores TO authenticated;
GRANT ALL ON public.popularity_scores TO service_role;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.increment_popularity_score(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_popularity_score(TEXT) TO authenticated;

-- Create view for easy querying of popular items
CREATE OR REPLACE VIEW public.popular_items AS
SELECT 
    item_id,
    item_type,
    wishlist_count,
    CASE 
        WHEN wishlist_count >= 50 THEN 'Very Popular'
        WHEN wishlist_count >= 20 THEN 'Popular'
        WHEN wishlist_count >= 10 THEN 'Trending'
        WHEN wishlist_count >= 5 THEN 'Rising'
        ELSE 'New'
    END as popularity_tier,
    updated_at
FROM public.popularity_scores
ORDER BY wishlist_count DESC, updated_at DESC;

-- Grant access to the view
GRANT SELECT ON public.popular_items TO anon;
GRANT SELECT ON public.popular_items TO authenticated; 