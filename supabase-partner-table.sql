-- Create partner_submissions table for the "Become a Partner" form
CREATE TABLE IF NOT EXISTS partner_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_type VARCHAR(20) NOT NULL CHECK (business_type IN ('studio', 'retreat', 'both')),
  business_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  website VARCHAR(500),
  social_handles JSONB DEFAULT '{}',
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  yoga_styles TEXT[] DEFAULT '{}',
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_partner_submissions_status ON partner_submissions(status);
CREATE INDEX IF NOT EXISTS idx_partner_submissions_business_type ON partner_submissions(business_type);
CREATE INDEX IF NOT EXISTS idx_partner_submissions_city ON partner_submissions(city);
CREATE INDEX IF NOT EXISTS idx_partner_submissions_submitted_at ON partner_submissions(submitted_at);

-- Enable Row Level Security (RLS)
ALTER TABLE partner_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (submit applications)
CREATE POLICY "Anyone can submit partner applications" ON partner_submissions
  FOR INSERT WITH CHECK (true);

-- Create policy to allow only authenticated users to read (for admin purposes)
-- You may want to modify this based on your admin setup
CREATE POLICY "Only authenticated users can read partner submissions" ON partner_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow only authenticated users to update (for admin purposes)
CREATE POLICY "Only authenticated users can update partner submissions" ON partner_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE partner_submissions IS 'Stores partner application submissions from the "Become a Partner" form';
COMMENT ON COLUMN partner_submissions.business_type IS 'Type of business: studio, retreat, or both';
COMMENT ON COLUMN partner_submissions.social_handles IS 'JSON object containing social media handles';
COMMENT ON COLUMN partner_submissions.yoga_styles IS 'Array of yoga styles offered';
COMMENT ON COLUMN partner_submissions.status IS 'Application status: pending, approved, or rejected'; 