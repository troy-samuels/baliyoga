-- Create featured listings table for weekly rotation system
CREATE TABLE IF NOT EXISTS public.featured_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('studio', 'retreat')),
    item_data JSONB NOT NULL, -- Store complete item data for quick access
    priority INTEGER DEFAULT 0 NOT NULL, -- Higher priority = more likely to be featured
    is_eligible BOOLEAN DEFAULT TRUE NOT NULL, -- Can this item be featured?
    is_manually_featured BOOLEAN DEFAULT FALSE NOT NULL, -- Admin manually set as featured
    last_featured_at TIMESTAMP WITH TIME ZONE,
    featured_count INTEGER DEFAULT 0 NOT NULL, -- How many times it's been featured
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure unique item per type
    UNIQUE(item_id, item_type)
);

-- Create weekly featured rotations table
CREATE TABLE IF NOT EXISTS public.weekly_featured_rotations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    week_start_date DATE NOT NULL, -- Monday of the week
    week_end_date DATE NOT NULL, -- Sunday of the week
    featured_studios JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of studio IDs
    featured_retreats JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of retreat IDs
    rotation_algorithm TEXT DEFAULT 'balanced' NOT NULL, -- Algorithm used for selection
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure one rotation per week
    UNIQUE(week_start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_featured_listings_item_id ON public.featured_listings(item_id);
CREATE INDEX IF NOT EXISTS idx_featured_listings_item_type ON public.featured_listings(item_type);
CREATE INDEX IF NOT EXISTS idx_featured_listings_priority ON public.featured_listings(priority DESC);
CREATE INDEX IF NOT EXISTS idx_featured_listings_is_eligible ON public.featured_listings(is_eligible);
CREATE INDEX IF NOT EXISTS idx_featured_listings_last_featured ON public.featured_listings(last_featured_at);
CREATE INDEX IF NOT EXISTS idx_weekly_rotations_week ON public.weekly_featured_rotations(week_start_date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.featured_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_featured_rotations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for featured listings
-- Allow public read access to featured listings
CREATE POLICY "Allow public read access to featured listings" ON public.featured_listings
    FOR SELECT USING (true);

-- Only service role can insert/update featured listings
CREATE POLICY "Only service role can manage featured listings" ON public.featured_listings
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for weekly rotations
-- Allow public read access to current week's rotation
CREATE POLICY "Allow public read access to weekly rotations" ON public.weekly_featured_rotations
    FOR SELECT USING (true);

-- Only service role can manage rotations
CREATE POLICY "Only service role can manage weekly rotations" ON public.weekly_featured_rotations
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_featured_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_featured_listings_updated_at
    BEFORE UPDATE ON public.featured_listings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_featured_listings_updated_at();

-- Function to get current week's featured items
CREATE OR REPLACE FUNCTION public.get_current_weekly_featured()
RETURNS TABLE (
    week_start DATE,
    week_end DATE,
    featured_studios JSONB,
    featured_retreats JSONB,
    studios_data JSONB,
    retreats_data JSONB
) AS $$
DECLARE
    current_monday DATE;
    current_sunday DATE;
    rotation_record RECORD;
    studios_array JSONB;
    retreats_array JSONB;
BEGIN
    -- Calculate current week (Monday to Sunday)
    current_monday := DATE_TRUNC('week', CURRENT_DATE)::DATE + 1; -- +1 because week starts on Monday
    current_sunday := current_monday + 6;
    
    -- Get current week's rotation
    SELECT * INTO rotation_record
    FROM public.weekly_featured_rotations
    WHERE week_start_date = current_monday;
    
    -- If no rotation exists for current week, return empty
    IF rotation_record IS NULL THEN
        RETURN QUERY SELECT 
            current_monday,
            current_sunday,
            '[]'::jsonb,
            '[]'::jsonb,
            '[]'::jsonb,
            '[]'::jsonb;
        RETURN;
    END IF;
    
    -- Get full data for featured studios
    SELECT COALESCE(jsonb_agg(fl.item_data), '[]'::jsonb) INTO studios_array
    FROM public.featured_listings fl
    WHERE fl.item_type = 'studio' 
    AND fl.item_id = ANY(
        SELECT jsonb_array_elements_text(rotation_record.featured_studios)
    );
    
    -- Get full data for featured retreats
    SELECT COALESCE(jsonb_agg(fl.item_data), '[]'::jsonb) INTO retreats_array
    FROM public.featured_listings fl
    WHERE fl.item_type = 'retreat' 
    AND fl.item_id = ANY(
        SELECT jsonb_array_elements_text(rotation_record.featured_retreats)
    );
    
    RETURN QUERY SELECT 
        rotation_record.week_start_date,
        rotation_record.week_end_date,
        rotation_record.featured_studios,
        rotation_record.featured_retreats,
        studios_array,
        retreats_array;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if an item is currently featured
CREATE OR REPLACE FUNCTION public.is_currently_featured(p_item_id TEXT, p_item_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    current_monday DATE;
    is_featured BOOLEAN := FALSE;
BEGIN
    -- Calculate current week (Monday to Sunday)
    current_monday := DATE_TRUNC('week', CURRENT_DATE)::DATE + 1;
    
    -- Check if item is in current week's featured list
    SELECT EXISTS(
        SELECT 1 
        FROM public.weekly_featured_rotations wfr
        WHERE wfr.week_start_date = current_monday
        AND (
            (p_item_type = 'studio' AND wfr.featured_studios ? p_item_id) OR
            (p_item_type = 'retreat' AND wfr.featured_retreats ? p_item_id)
        )
    ) INTO is_featured;
    
    RETURN is_featured;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate weekly featured rotation
CREATE OR REPLACE FUNCTION public.generate_weekly_featured_rotation(
    p_week_start DATE DEFAULT NULL,
    p_studios_count INTEGER DEFAULT 3,
    p_retreats_count INTEGER DEFAULT 3
)
RETURNS JSONB AS $$
DECLARE
    week_start DATE;
    week_end DATE;
    selected_studios JSONB;
    selected_retreats JSONB;
    result JSONB;
BEGIN
    -- Use provided date or calculate current Monday
    IF p_week_start IS NULL THEN
        week_start := DATE_TRUNC('week', CURRENT_DATE)::DATE + 1;
    ELSE
        week_start := p_week_start;
    END IF;
    
    week_end := week_start + 6;
    
    -- Select studios using balanced algorithm
    WITH eligible_studios AS (
        SELECT 
            fl.item_id,
            fl.item_data,
            fl.priority,
            fl.last_featured_at,
            fl.featured_count,
            -- Calculate score: priority + recency bonus - frequency penalty
            (
                fl.priority + 
                CASE 
                    WHEN fl.last_featured_at IS NULL THEN 100
                    ELSE GREATEST(0, 50 - EXTRACT(DAYS FROM NOW() - fl.last_featured_at))
                END -
                (fl.featured_count * 10)
            ) AS selection_score
        FROM public.featured_listings fl
        WHERE fl.item_type = 'studio' 
        AND fl.is_eligible = true
        AND (fl.last_featured_at IS NULL OR fl.last_featured_at < week_start - INTERVAL '2 weeks')
        ORDER BY selection_score DESC, RANDOM()
        LIMIT p_studios_count
    )
    SELECT jsonb_agg(item_id) INTO selected_studios
    FROM eligible_studios;
    
    -- Select retreats using same algorithm
    WITH eligible_retreats AS (
        SELECT 
            fl.item_id,
            fl.item_data,
            fl.priority,
            fl.last_featured_at,
            fl.featured_count,
            -- Calculate score: priority + recency bonus - frequency penalty
            (
                fl.priority + 
                CASE 
                    WHEN fl.last_featured_at IS NULL THEN 100
                    ELSE GREATEST(0, 50 - EXTRACT(DAYS FROM NOW() - fl.last_featured_at))
                END -
                (fl.featured_count * 10)
            ) AS selection_score
        FROM public.featured_listings fl
        WHERE fl.item_type = 'retreat' 
        AND fl.is_eligible = true
        AND (fl.last_featured_at IS NULL OR fl.last_featured_at < week_start - INTERVAL '2 weeks')
        ORDER BY selection_score DESC, RANDOM()
        LIMIT p_retreats_count
    )
    SELECT jsonb_agg(item_id) INTO selected_retreats
    FROM eligible_retreats;
    
    -- Ensure we have arrays even if empty
    selected_studios := COALESCE(selected_studios, '[]'::jsonb);
    selected_retreats := COALESCE(selected_retreats, '[]'::jsonb);
    
    -- Insert or update the weekly rotation
    INSERT INTO public.weekly_featured_rotations (
        week_start_date,
        week_end_date,
        featured_studios,
        featured_retreats,
        rotation_algorithm
    ) VALUES (
        week_start,
        week_end,
        selected_studios,
        selected_retreats,
        'balanced'
    )
    ON CONFLICT (week_start_date) 
    DO UPDATE SET
        featured_studios = EXCLUDED.featured_studios,
        featured_retreats = EXCLUDED.featured_retreats,
        rotation_algorithm = EXCLUDED.rotation_algorithm;
    
    -- Update featured counts and last_featured_at for selected items
    UPDATE public.featured_listings 
    SET 
        featured_count = featured_count + 1,
        last_featured_at = week_start
    WHERE item_id = ANY(
        SELECT jsonb_array_elements_text(selected_studios || selected_retreats)
    );
    
    -- Return the result
    result := jsonb_build_object(
        'week_start', week_start,
        'week_end', week_end,
        'featured_studios', selected_studios,
        'featured_retreats', selected_retreats,
        'studios_count', jsonb_array_length(selected_studios),
        'retreats_count', jsonb_array_length(selected_retreats)
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add item to featured pool
CREATE OR REPLACE FUNCTION public.add_to_featured_pool(
    p_item_id TEXT,
    p_item_type TEXT,
    p_item_data JSONB,
    p_priority INTEGER DEFAULT 0
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO public.featured_listings (
        item_id,
        item_type,
        item_data,
        priority,
        is_eligible
    ) VALUES (
        p_item_id,
        p_item_type,
        p_item_data,
        p_priority,
        true
    )
    ON CONFLICT (item_id, item_type)
    DO UPDATE SET
        item_data = EXCLUDED.item_data,
        priority = EXCLUDED.priority,
        is_eligible = true,
        updated_at = TIMEZONE('utc'::text, NOW());
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON public.featured_listings TO anon;
GRANT SELECT ON public.featured_listings TO authenticated;
GRANT ALL ON public.featured_listings TO service_role;

GRANT SELECT ON public.weekly_featured_rotations TO anon;
GRANT SELECT ON public.weekly_featured_rotations TO authenticated;
GRANT ALL ON public.weekly_featured_rotations TO service_role;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_current_weekly_featured() TO anon;
GRANT EXECUTE ON FUNCTION public.get_current_weekly_featured() TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_currently_featured(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.is_currently_featured(TEXT, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION public.generate_weekly_featured_rotation(DATE, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.add_to_featured_pool(TEXT, TEXT, JSONB, INTEGER) TO service_role;

-- Create view for admin management
CREATE OR REPLACE VIEW public.featured_listings_admin AS
SELECT 
    fl.*,
    CASE 
        WHEN fl.last_featured_at IS NULL THEN 'Never featured'
        ELSE 'Last featured ' || fl.last_featured_at::TEXT
    END as last_featured_display,
    public.is_currently_featured(fl.item_id, fl.item_type) as is_currently_featured
FROM public.featured_listings fl
ORDER BY fl.priority DESC, fl.last_featured_at ASC NULLS FIRST;

-- Grant access to the admin view
GRANT SELECT ON public.featured_listings_admin TO authenticated;
GRANT SELECT ON public.featured_listings_admin TO service_role;