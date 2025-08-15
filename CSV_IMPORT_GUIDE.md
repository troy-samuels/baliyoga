# 📊 CSV Import Guide for Bali Yoga Directory

This guide explains how to import your data into the Supabase database.

## 🚀 Quick Start

### Prerequisites
1. **CSV file** with your data (13 basic columns)
2. **Environment variables** set up (`.env.local`)
3. **Node.js** installed on your system

### Method 1: Using Node.js Script (Recommended)

1. **Install dependencies:**
```bash
npm install csv-parser
```

2. **Place your CSV file** in the project directory (e.g., `yoga-data.csv`)

3. **Run the import script:**
```bash
npm run import-csv yoga-data.csv
```

### Method 2: Supabase Dashboard

1. **Go to Supabase Dashboard** → Your Project → Table Editor
2. **Select table** `v3_bali_yoga_studios_and_retreats`
3. **Click "Insert"** → "Import data from CSV"
4. **Upload CSV** and map columns
5. **Preview and import**

## 📋 CSV Format Requirements

### Required Columns
Your CSV should have these column headers (case-sensitive):

#### Basic Information
- `id` (integer)
- `name` (text)
- `city` (text)
- `address` (text)
- `phone_number` (text)
- `website` (text)
- `category_name` (text)
- `review_score` (decimal)
- `review_count` (integer)
- `images` (JSON array or single URL)
- `opening_hours` (JSON)
- `description` (text)
- `postcode` (text)

### Sample CSV Row
```csv
id,name,city,address,phone_number,website,category_name,review_score,review_count,images,opening_hours,description,postcode
1,The Yoga Barn,Ubud,"Jl. Monkey Forest Rd",+62 361 971236,https://theyogabarn.com,Yoga studio,4.5,150,"[""https://example.com/image1.jpg""]","{""monday"": ""6:00-21:00""}","A beautiful yoga studio in Ubud",80571
```

## 🔧 Data Format Examples

### Images Field
```csv
# Single image (as string)
images: "https://example.com/image.jpg"

# Multiple images (as JSON array)
images: ["https://example.com/image1.jpg","https://example.com/image2.jpg"]
```

### Opening Hours Field
```csv
# JSON format for opening hours
opening_hours: {"monday":"6:00-21:00","tuesday":"6:00-21:00","wednesday":"6:00-21:00"}
```

### Review Score
```csv
# Decimal rating (0.0 to 5.0)
review_score: 4.5
```

## 🛠️ Troubleshooting

### Common Issues

**1. Import Script Fails**
```bash
# Check if csv-parser is installed
npm list csv-parser

# Install if missing
npm install csv-parser
```

**2. JSON Fields Not Working**
- Use proper JSON format: `{"key":"value"}`
- Escape quotes in CSV: `"{""key"":""value""}"`
- For arrays: `["item1","item2"]`

**3. Special Characters in CSV**
- Escape quotes: `"The \"Best\" Studio"`
- Use UTF-8 encoding for international characters

### Validation Script

Run this to check your CSV format:
```bash
node -e "
const csv = require('csv-parser');
const fs = require('fs');
let rowCount = 0;
fs.createReadStream('your-file.csv')
  .pipe(csv())
  .on('data', (row) => {
    rowCount++;
    if (rowCount === 1) {
      console.log('First row columns:', Object.keys(row));
    }
  })
  .on('end', () => console.log('Total rows:', rowCount));
"
```

## 📈 After Import

### Verify Import Success
```sql
-- Check total records
SELECT COUNT(*) FROM v3_bali_yoga_studios_and_retreats;

-- Check data coverage
SELECT 
  COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as with_names,
  COUNT(CASE WHEN city IS NOT NULL THEN 1 END) as with_cities,
  COUNT(CASE WHEN images IS NOT NULL THEN 1 END) as with_images
FROM v3_bali_yoga_studios_and_retreats;
```

### Test Your Import
After import, check your studios and retreats pages to see the new data!

## 🚨 Backup Recommendation

**Before importing**, backup your current data:
```bash
# Export current data from Supabase dashboard
# Or create a backup table
CREATE TABLE v3_bali_yoga_studios_and_retreats_backup AS 
SELECT * FROM v3_bali_yoga_studios_and_retreats;
```

## 📞 Need Help?

If you encounter issues:
1. **Check the console output** for specific error messages
2. **Verify CSV format** against the examples above
3. **Test with a small sample** (5-10 rows) first
4. **Check Supabase logs** in the dashboard

The import script handles most data format variations automatically, but following these guidelines ensures the smoothest import process. 