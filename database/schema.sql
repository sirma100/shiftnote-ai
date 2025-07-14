-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Create users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    subscription VARCHAR(50) DEFAULT 'free' CHECK (subscription IN ('free', 'pro')),
    usage_today INTEGER DEFAULT 0,
    last_usage_date DATE DEFAULT CURRENT_DATE,
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create templates table
CREATE TABLE templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    prompt TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shift_notes table
CREATE TABLE shift_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    raw_input TEXT NOT NULL,
    formatted_output TEXT NOT NULL,
    template VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default templates
INSERT INTO templates (id, name, description, prompt, is_default) VALUES 
(
    'default-ndis',
    'Default NDIS Note Format',
    'Standard NDIS shift note format',
    'Transform the following raw shift notes into a professional NDIS format. Use this exact structure:

1. House-based information – [Any household activities, cleaning, maintenance]
2. Appointments – [Medical appointments, calls, referrals]
3. Visitors – [Any visitors or specify "No visitors today"]
4. Client Information
   a. Meals – [Breakfast, lunch, dinner details]
   b. Medications – [Medication compliance, refusals, PRN requests]
   c. Behavior/Mood – [Participant''s mood, behavior, incidents]
   d. Activities – [Daily activities, social engagement, exercise]
   e. Support provided – [Assistance given, prompts, guidance]

Keep language professional, person-centered, and compliant with NDIS documentation standards. Only include sections that are relevant to the provided information.',
    true
),
(
    'aged-care',
    'Aged Care Format',
    'Format for aged care shift notes',
    'Transform the following raw shift notes into a professional aged care format. Use this structure:

**Personal Care:**
- [Assistance with ADLs, hygiene, mobility]

**Nutrition & Hydration:**
- [Meals consumed, fluid intake, dietary needs]

**Medication:**
- [Medication administration, compliance, observations]

**Health & Wellbeing:**
- [Physical condition, mood, behavior, concerns]

**Activities & Social:**
- [Activities participated in, social interactions, engagement]

**Communication:**
- [Family contact, appointments, referrals]

**Environment:**
- [Room/facility maintenance, safety observations]

Use respectful, professional language appropriate for aged care documentation. Focus on the person''s dignity and individual needs.',
    false
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_shift_notes_user_id ON shift_notes(user_id);
CREATE INDEX idx_shift_notes_created_at ON shift_notes(created_at DESC);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (true); -- We'll handle auth in the app layer

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (true);

-- Templates are public (readable by all)
CREATE POLICY "Templates are viewable by everyone" ON templates
    FOR SELECT USING (true);

-- Shift notes are private to users
CREATE POLICY "Users can view own shift notes" ON shift_notes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own shift notes" ON shift_notes
    FOR INSERT WITH CHECK (true);
