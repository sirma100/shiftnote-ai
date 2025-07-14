import { AppData, User, ShiftNote, Template } from '@/types';

// In-memory storage for serverless environments
let memoryDb: AppData | null = null;

// Default templates
const DEFAULT_TEMPLATES: Template[] = [
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
];

// Initialize database
function initDatabase(): AppData {
  if (memoryDb) {
    return memoryDb;
  }

  // Try to load from environment variable (for basic persistence)
  const envData = process.env.DATABASE_DATA;
  if (envData) {
    try {
      memoryDb = JSON.parse(envData);
      if (memoryDb) {
        return memoryDb;
      }
    } catch (error) {
      console.error('Failed to parse database from environment:', error);
    }
  }

  // Initialize with default data
  memoryDb = {
    users: [],
    notes: [],
    templates: DEFAULT_TEMPLATES,
  };

  return memoryDb;
}

// Get database
function getDatabase(): AppData {
  return initDatabase();
}

// Save to environment (for basic session persistence)
function saveDatabase(data: AppData): void {
  memoryDb = data;
  // In a real app, you'd save to a cloud database here
  // For now, we'll just keep it in memory for the session
}

// User operations
export const userDb = {
  findByEmail: (email: string): User | null => {
    const data = getDatabase();
    return data.users.find(user => user.email === email) || null;
  },

  findById: (id: string): User | null => {
    const data = getDatabase();
    return data.users.find(user => user.id === id) || null;
  },

  create: (user: Omit<User, 'id'>): User => {
    const data = getDatabase();
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...user,
    };
    data.users.push(newUser);
    saveDatabase(data);
    return newUser;
  },

  update: (id: string, updates: Partial<User>): User | null => {
    const data = getDatabase();
    const userIndex = data.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    data.users[userIndex] = { ...data.users[userIndex], ...updates };
    saveDatabase(data);
    return data.users[userIndex];
  },

  incrementUsage: (id: string): void => {
    const data = getDatabase();
    const userIndex = data.users.findIndex(user => user.id === id);
    if (userIndex === -1) return;
    
    const today = new Date().toISOString().split('T')[0];
    const user = data.users[userIndex];
    
    if (user.lastUsageDate !== today) {
      user.usageToday = 0;
      user.lastUsageDate = today;
    }
    
    user.usageToday++;
    saveDatabase(data);
  },

  updateSubscription: (id: string, subscription: 'free' | 'pro'): User | null => {
    const data = getDatabase();
    const userIndex = data.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    data.users[userIndex].subscription = subscription;
    saveDatabase(data);
    return data.users[userIndex];
  },

  findByCustomerId: (customerId: string): User | null => {
    const data = getDatabase();
    return data.users.find(user => user.stripeCustomerId === customerId) || null;
  },
};

// Notes operations
export const noteDb = {
  create: (note: Omit<ShiftNote, 'id'>): ShiftNote => {
    const data = getDatabase();
    const newNote: ShiftNote = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...note,
    };
    data.notes.push(newNote);
    saveDatabase(data);
    return newNote;
  },

  findByUserId: (userId: string, limit: number = 5): ShiftNote[] => {
    const data = getDatabase();
    return data.notes
      .filter(note => note.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  findById: (id: string): ShiftNote | null => {
    const data = getDatabase();
    return data.notes.find(note => note.id === id) || null;
  },
};

// Template operations
export const templateDb = {
  findAll: (): Template[] => {
    const data = getDatabase();
    return data.templates;
  },

  findById: (id: string): Template | null => {
    const data = getDatabase();
    return data.templates.find(template => template.id === id) || null;
  },
};
