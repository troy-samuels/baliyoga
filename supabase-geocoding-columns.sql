-- Geocoding Columns for Cached Coordinates
-- Add these columns to the existing v3_bali_yoga_studios_and_retreats table
-- Run these ALTER TABLE commands in Supabase SQL Editor

-- 1. COORDINATE STORAGE
ALTER TABLE v3_bali_yoga_studios_and_retreats
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);

ALTER TABLE v3_bali_yoga_studios_and_retreats
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- 2. GEOCODING METADATA
ALTER TABLE v3_bali_yoga_studios_and_retreats
ADD COLUMN IF NOT EXISTS geocoded_address TEXT;

ALTER TABLE v3_bali_yoga_studios_and_retreats
ADD COLUMN IF NOT EXISTS geocoding_confidence DECIMAL(3, 2);

-- 3. CACHE MANAGEMENT
ALTER TABLE v3_bali_yoga_studios_and_retreats
ADD COLUMN IF NOT EXISTS coordinates_source TEXT DEFAULT 'google_geocoding' CHECK (coordinates_source IN ('google_geocoding', 'static_coordinates', 'manual_entry'));

ALTER TABLE v3_bali_yoga_studios_and_retreats
ADD COLUMN IF NOT EXISTS coordinates_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_coordinates ON v3_bali_yoga_studios_and_retreats (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_coordinates_source ON v3_bali_yoga_studios_and_retreats (coordinates_source);
CREATE INDEX IF NOT EXISTS idx_coordinates_updated ON v3_bali_yoga_studios_and_retreats (coordinates_updated_at);

-- 5. ADD COMMENTS FOR DOCUMENTATION
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.latitude IS 'Precise latitude coordinate from Google Geocoding API (8 decimal places for ~1cm accuracy)';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.longitude IS 'Precise longitude coordinate from Google Geocoding API (8 decimal places for ~1cm accuracy)';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.geocoded_address IS 'Formatted address returned by Google Geocoding API';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.geocoding_confidence IS 'Confidence score from geocoding (0-1, where 1 is highest confidence)';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.coordinates_source IS 'Source of coordinates: google_geocoding, static_coordinates, or manual_entry';
COMMENT ON COLUMN v3_bali_yoga_studios_and_retreats.coordinates_updated_at IS 'Timestamp when coordinates were last updated';

-- 6. CREATE CONSTRAINT FOR COORDINATE PAIRS
-- Ensure both lat and lng are present or both are null
ALTER TABLE v3_bali_yoga_studios_and_retreats
ADD CONSTRAINT chk_coordinates_pair
CHECK ((latitude IS NULL AND longitude IS NULL) OR (latitude IS NOT NULL AND longitude IS NOT NULL));

-- 7. SAMPLE DATA VERIFICATION (Optional - for testing)
-- This query will show entries that need geocoding
-- SELECT id, name, city, address, latitude, longitude, coordinates_source
-- FROM v3_bali_yoga_studios_and_retreats
-- WHERE latitude IS NULL
-- ORDER BY name
-- LIMIT 10;

-- 8. COORDINATE QUALITY CHECK (Optional - for monitoring)
-- This query will show the distribution of coordinate sources
-- SELECT coordinates_source, COUNT(*) as count,
--        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM v3_bali_yoga_studios_and_retreats), 1) as percentage
-- FROM v3_bali_yoga_studios_and_retreats
-- GROUP BY coordinates_source
-- ORDER BY count DESC;