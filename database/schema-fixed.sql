-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  subscription VARCHAR(10) NOT NULL DEFAULT 'free' CHECK (subscription IN ('free', 'pro')),
  usage_today INTEGER NOT NULL DEFAULT 0,
  last_usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false
);

-- Create shift_notes table
CREATE TABLE shift_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  raw_input TEXT NOT NULL,
  formatted_output TEXT NOT NULL,
  template VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX idx_shift_notes_user_id ON shift_notes(user_id);
CREATE INDEX idx_shift_notes_created_at ON shift_notes(created_at);

-- Insert default templates with proper UUIDs
INSERT INTO templates (id, name, description, prompt, is_default) VALUES
(gen_random_uuid(), 'NDIS Support Worker', 'Standard NDIS support worker shift note template', 'You are a professional NDIS support worker assistant. Convert the following rough notes into a professional, detailed shift note. Focus on:

1. Clear documentation of support activities
2. Participant engagement and responses
3. Any incidents or concerns
4. Goal progress and achievements
5. Professional, person-centered language
6. Compliance with NDIS standards

Format the output as a structured shift note with appropriate sections and professional language.

Raw notes: {input}
Client: {client}

Please format this into a professional shift note.', true),

(gen_random_uuid(), 'Healthcare Assistant', 'Healthcare/medical assistant shift note template', 'You are a healthcare assistant documentation specialist. Convert the following rough notes into a professional healthcare shift note. Focus on:

1. Patient care activities performed
2. Patient responses and condition
3. Any concerns or incidents
4. Medication administration (if applicable)
5. Professional medical terminology
6. Compliance with healthcare standards

Format the output as a structured healthcare shift note with appropriate sections and professional language.

Raw notes: {input}
Patient: {client}

Please format this into a professional healthcare shift note.', false),

(gen_random_uuid(), 'Aged Care Worker', 'Aged care facility shift note template', 'You are an aged care documentation specialist. Convert the following rough notes into a professional aged care shift note. Focus on:

1. Resident care activities and assistance provided
2. Resident wellbeing and engagement
3. Any incidents or changes in condition
4. Social activities and interactions
5. Professional, respectful language
6. Compliance with aged care standards

Format the output as a structured aged care shift note with appropriate sections and professional language.

Raw notes: {input}
Resident: {client}

Please format this into a professional aged care shift note.', false),

(gen_random_uuid(), 'Disability Support Worker', 'General disability support worker template', 'You are a disability support worker documentation specialist. Convert the following rough notes into a professional shift note. Focus on:

1. Support activities provided
2. Individual responses and engagement
3. Skill development and goal progress
4. Any incidents or concerns
5. Person-centered, respectful language
6. Compliance with disability support standards

Format the output as a structured shift note with appropriate sections and professional language.

Raw notes: {input}
Individual: {client}

Please format this into a professional disability support shift note.', false);
