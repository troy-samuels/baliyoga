-- Create wishlist table for user favorites
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('studio', 'retreat')),
    item_data JSONB NOT NULL, -- Store the complete item data for quick access
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure unique combination of user and item
    UNIQUE(user_id, item_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_item_type ON public.wishlists(item_type);
CREATE INDEX IF NOT EXISTS idx_wishlists_created_at ON public.wishlists(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own wishlist items
CREATE POLICY "Users can view own wishlist items" ON public.wishlists
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own wishlist items
CREATE POLICY "Users can insert own wishlist items" ON public.wishlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own wishlist items
CREATE POLICY "Users can update own wishlist items" ON public.wishlists
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own wishlist items
CREATE POLICY "Users can delete own wishlist items" ON public.wishlists
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_wishlists_updated_at
    BEFORE UPDATE ON public.wishlists
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.wishlists TO authenticated;
GRANT ALL ON public.wishlists TO service_role;

-- Example item_data structure:
-- {
--   "id": "studio-123",
--   "name": "Serenity Yoga Studio",
--   "slug": "serenity-yoga-studio",
--   "image": "https://example.com/image.jpg",
--   "location": "Ubud",
--   "rating": 4.8,
--   "type": "studio",
--   "styles": ["Hatha", "Vinyasa"],
--   "phone_number": "+62 361 123 4567",
--   "website": "https://example.com"
-- } 