import fs from 'fs';
import path from 'path';
import { AppData, User, ShiftNote, Template } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

// Initialize database with default templates
const DEFAULT_DATA: AppData = {
  users: [],
  notes: [],
  templates: [
    {
      id: 'default-ndis',
      name: 'Default NDIS Note Format',
      description: 'Standard NDIS shift note format',
      prompt: `Transform the following raw shift notes into a professional NDIS format. Use this exact structure:

1. House-based information – [Any household activities, cleaning, maintenance]
2. Appointments – [Medical appointments, calls, referrals]
3. Visitors – [Any visitors or specify "No visitors today"]
4. Client Information
   a. Meals – [Breakfast, lunch, dinner details]
   b. Medications – [Medication compliance, refusals, PRN requests]
   c. Behavior/Mood – [Participant's mood, behavior, incidents]
   d. Activities – [Daily activities, social engagement, exercise]
   e. Support provided – [Assistance given, prompts, guidance]

Keep language professional, person-centered, and compliant with NDIS documentation standards. Only include sections that are relevant to the provided information.`,
      isDefault: true,
    },
    {
      id: 'aged-care',
      name: 'Aged Care Format',
      description: 'Format for aged care shift notes',
      prompt: `Transform the following raw shift notes into a professional aged care format. Use this structure:

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

Use respectful, professional language appropriate for aged care documentation. Focus on the person's dignity and individual needs.`,
      isDefault: false,
    },
  ],
};

// Ensure database file exists
function ensureDatabase(): void {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

// Read database
function readDatabase(): AppData {
  ensureDatabase();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Write database
function writeDatabase(data: AppData): void {
  ensureDatabase();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// User operations
export const userDb = {
  findByEmail: (email: string): User | null => {
    const data = readDatabase();
    return data.users.find(user => user.email === email) || null;
  },

  findById: (id: string): User | null => {
    const data = readDatabase();
    return data.users.find(user => user.id === id) || null;
  },

  create: (user: Omit<User, 'id'>): User => {
    const data = readDatabase();
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...user,
    };
    data.users.push(newUser);
    writeDatabase(data);
    return newUser;
  },

  update: (id: string, updates: Partial<User>): User | null => {
    const data = readDatabase();
    const userIndex = data.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    data.users[userIndex] = { ...data.users[userIndex], ...updates };
    writeDatabase(data);
    return data.users[userIndex];
  },

  incrementUsage: (id: string): void => {
    const data = readDatabase();
    const userIndex = data.users.findIndex(user => user.id === id);
    if (userIndex === -1) return;
    
    const today = new Date().toISOString().split('T')[0];
    const user = data.users[userIndex];
    
    if (user.lastUsageDate !== today) {
      user.usageToday = 0;
      user.lastUsageDate = today;
    }
    
    user.usageToday++;
    writeDatabase(data);
  },

  updateSubscription: (id: string, subscription: 'free' | 'pro'): User | null => {
    const data = readDatabase();
    const userIndex = data.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    data.users[userIndex].subscription = subscription;
    writeDatabase(data);
    return data.users[userIndex];
  },

  findByCustomerId: (customerId: string): User | null => {
    const data = readDatabase();
    return data.users.find(user => user.stripeCustomerId === customerId) || null;
  },
};

// Notes operations
export const noteDb = {
  create: (note: Omit<ShiftNote, 'id'>): ShiftNote => {
    const data = readDatabase();
    const newNote: ShiftNote = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...note,
    };
    data.notes.push(newNote);
    writeDatabase(data);
    return newNote;
  },

  findByUserId: (userId: string, limit: number = 5): ShiftNote[] => {
    const data = readDatabase();
    return data.notes
      .filter(note => note.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  findById: (id: string): ShiftNote | null => {
    const data = readDatabase();
    return data.notes.find(note => note.id === id) || null;
  },
};

// Template operations
export const templateDb = {
  findAll: (): Template[] => {
    const data = readDatabase();
    return data.templates;
  },

  findById: (id: string): Template | null => {
    const data = readDatabase();
    return data.templates.find(template => template.id === id) || null;
  },
};
