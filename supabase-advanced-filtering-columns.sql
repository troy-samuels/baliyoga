-- Advanced Filtering Columns for Bali Yoga Directory
-- Run these ALTER TABLE commands in Supabase SQL Editor

-- 1. YOGA STYLES & PRACTICES
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS yoga_styles TEXT[] DEFAULT '{}';

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS meditation_offered BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS breathwork_offered BOOLEAN DEFAULT false;

-- 2. PRICING & BUDGET FILTERS
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS price_range TEXT CHECK (price_range IN ('budget', 'mid-range', 'luxury', 'premium'));

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS drop_in_price_usd INTEGER; -- Price in USD cents

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS monthly_unlimited_price_usd INTEGER; -- Price in USD cents

-- 3. EXPERIENCE LEVEL
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS beginner_friendly BOOLEAN DEFAULT true;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS advanced_classes BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS teacher_training BOOLEAN DEFAULT false;

-- 4. AMENITIES & FACILITIES
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}'; 
-- Examples: ['mat_rental', 'shower', 'changing_room', 'parking', 'cafe', 'shop', 'wifi']

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS outdoor_space BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS air_conditioning BOOLEAN DEFAULT false;

-- 5. LOCATION & ACCESSIBILITY
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS beach_proximity TEXT CHECK (beach_proximity IN ('beachfront', 'walking_distance', 'nearby', 'inland'));

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS rice_field_view BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS jungle_setting BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS accessibility_friendly BOOLEAN DEFAULT false;

-- 6. RETREAT-SPECIFIC COLUMNS
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS retreat_duration_days INTEGER; -- For retreats only

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS accommodation_included BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS meals_included BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS retreat_type TEXT CHECK (retreat_type IN ('wellness', 'detox', 'spiritual', 'adventure', 'luxury', 'budget'));

-- 7. SCHEDULE & AVAILABILITY
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS early_morning_classes BOOLEAN DEFAULT false; -- Before 7 AM

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS evening_classes BOOLEAN DEFAULT false; -- After 6 PM

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS weekend_classes BOOLEAN DEFAULT true;

-- 8. SPECIAL FEATURES
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS sound_healing BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS massage_therapy BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS healthy_food BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS spiritual_ceremonies BOOLEAN DEFAULT false;

-- 9. LANGUAGE & CULTURAL
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS languages_spoken TEXT[] DEFAULT '{"English"}';

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS cultural_immersion BOOLEAN DEFAULT false;

-- 10. BUSINESS INFORMATION
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS verified_business BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS featured_listing BOOLEAN DEFAULT false;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 11. CONTACT & BOOKING
ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS instagram_handle TEXT;

ALTER TABLE v3_bali_yoga_studios_and_retreats 
ADD COLUMN IF NOT EXISTS booking_required BOOLEAN DEFAULT false;

-- Create indexes for better filtering performance
CREATE INDEX IF NOT EXISTS idx_yoga_styles ON v3_bali_yoga_studios_and_retreats USING GIN (yoga_styles);
CREATE INDEX IF NOT EXISTS idx_price_range ON v3_bali_yoga_studios_and_retreats (price_range);
CREATE INDEX IF NOT EXISTS idx_amenities ON v3_bali_yoga_studios_and_retreats USING GIN (amenities);
CREATE INDEX IF NOT EXISTS idx_beginner_friendly ON v3_bali_yoga_studios_and_retreats (beginner_friendly);
CREATE INDEX IF NOT EXISTS idx_beach_proximity ON v3_bali_yoga_studios_and_retreats (beach_proximity);
CREATE INDEX IF NOT EXISTS idx_retreat_duration ON v3_bali_yoga_studios_and_retreats (retreat_duration_days);
CREATE INDEX IF NOT EXISTS idx_featured_listing ON v3_bali_yoga_studios_and_retreats (featured_listing);
CREATE INDEX IF NOT EXISTS idx_verified_business ON v3_bali_yoga_studios_and_retreats (verified_business);

-- Add comments for documentation
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.yoga_styles IS 'Array of yoga styles offered: Hatha, Vinyasa, Yin, Ashtanga, etc.';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.price_range IS 'General price category for filtering';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.drop_in_price_usd IS 'Single class price in USD cents (e.g., 1500 = $15.00)';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.amenities IS 'Array of available amenities and facilities';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.beach_proximity IS 'How close to beach: beachfront, walking_distance, nearby, inland';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.retreat_duration_days IS 'Length of retreat in days (null for studios)';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.languages_spoken IS 'Languages spoken by instructors'; 