-- CSV Import Script for Supabase
-- This script helps import enriched data from CSV to your Supabase table

-- Step 1: Create a temporary table to import CSV data
CREATE TEMP TABLE temp_csv_import (
    id INTEGER,
    name TEXT,
    city TEXT,
    address TEXT,
    phone_number TEXT,
    website TEXT,
    category_name TEXT,
    review_score DECIMAL,
    review_count INTEGER,
    images JSONB,
    opening_hours JSONB,
    description TEXT,
    postcode TEXT
);

-- Step 2: Import CSV data into temporary table
-- Note: You'll need to use the Supabase dashboard or a tool like psql for this
-- In Supabase dashboard SQL editor, you can use:
-- COPY temp_csv_import FROM '/path/to/your/file.csv' WITH CSV HEADER;

-- Step 3: Update existing records with data
UPDATE v3_bali_yoga_studios_and_retreats 
SET 
    name = COALESCE(temp.name, v3_bali_yoga_studios_and_retreats.name),
    city = COALESCE(temp.city, v3_bali_yoga_studios_and_retreats.city),
    address = COALESCE(temp.address, v3_bali_yoga_studios_and_retreats.address),
    phone_number = COALESCE(temp.phone_number, v3_bali_yoga_studios_and_retreats.phone_number),
    website = COALESCE(temp.website, v3_bali_yoga_studios_and_retreats.website),
    category_name = COALESCE(temp.category_name, v3_bali_yoga_studios_and_retreats.category_name),
    review_score = COALESCE(temp.review_score, v3_bali_yoga_studios_and_retreats.review_score),
    review_count = COALESCE(temp.review_count, v3_bali_yoga_studios_and_retreats.review_count),
    images = COALESCE(temp.images, v3_bali_yoga_studios_and_retreats.images),
    opening_hours = COALESCE(temp.opening_hours, v3_bali_yoga_studios_and_retreats.opening_hours),
    description = COALESCE(temp.description, v3_bali_yoga_studios_and_retreats.description),
    postcode = COALESCE(temp.postcode, v3_bali_yoga_studios_and_retreats.postcode)
FROM temp_csv_import temp
WHERE v3_bali_yoga_studios_and_retreats.id = temp.id;

-- Step 4: Insert new records that don't exist yet
INSERT INTO v3_bali_yoga_studios_and_retreats 
SELECT * FROM temp_csv_import temp
WHERE NOT EXISTS (
    SELECT 1 FROM v3_bali_yoga_studios_and_retreats 
    WHERE id = temp.id
);

-- Step 5: Clean up temporary table
DROP TABLE temp_csv_import;

-- Step 6: Verify the import
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as records_with_names,
    COUNT(CASE WHEN city IS NOT NULL THEN 1 END) as records_with_cities,
    COUNT(CASE WHEN images IS NOT NULL THEN 1 END) as records_with_images
FROM v3_bali_yoga_studios_and_retreats; 