import { supabase } from './supabase';
import { User, ShiftNote, Template } from '@/types';

// User operations
export const userDb = {
  findByEmail: async (email: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        password: data.password,
        subscription: data.subscription as 'free' | 'pro',
        usageToday: data.usage_today,
        lastUsageDate: data.last_usage_date,
        stripeCustomerId: data.stripe_customer_id,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  },

  findById: async (id: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        password: data.password,
        subscription: data.subscription as 'free' | 'pro',
        usageToday: data.usage_today,
        lastUsageDate: data.last_usage_date,
        stripeCustomerId: data.stripe_customer_id,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  },

  create: async (user: Omit<User, 'id'>): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: user.email,
          password: user.password,
          subscription: user.subscription || 'free',
          usage_today: user.usageToday || 0,
          last_usage_date: user.lastUsageDate || new Date().toISOString().split('T')[0],
          stripe_customer_id: user.stripeCustomerId || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        password: data.password,
        subscription: data.subscription as 'free' | 'pro',
        usageToday: data.usage_today,
        lastUsageDate: data.last_usage_date,
        stripeCustomerId: data.stripe_customer_id,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  update: async (id: string, updates: Partial<User>): Promise<User | null> => {
    try {
      const updateData: any = {};
      
      if (updates.email) updateData.email = updates.email;
      if (updates.password) updateData.password = updates.password;
      if (updates.subscription) updateData.subscription = updates.subscription;
      if (updates.usageToday !== undefined) updateData.usage_today = updates.usageToday;
      if (updates.lastUsageDate) updateData.last_usage_date = updates.lastUsageDate;
      if (updates.stripeCustomerId !== undefined) updateData.stripe_customer_id = updates.stripeCustomerId;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        password: data.password,
        subscription: data.subscription as 'free' | 'pro',
        usageToday: data.usage_today,
        lastUsageDate: data.last_usage_date,
        stripeCustomerId: data.stripe_customer_id,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  incrementUsage: async (id: string): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current user
      const user = await userDb.findById(id);
      if (!user) return;

      let newUsageToday = user.usageToday;
      
      // Reset usage if it's a new day
      if (user.lastUsageDate !== today) {
        newUsageToday = 0;
      }
      
      // Increment usage
      newUsageToday++;

      await supabase
        .from('users')
        .update({
          usage_today: newUsageToday,
          last_usage_date: today,
        })
        .eq('id', id);
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  },

  updateSubscription: async (id: string, subscription: 'free' | 'pro'): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ subscription })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        password: data.password,
        subscription: data.subscription as 'free' | 'pro',
        usageToday: data.usage_today,
        lastUsageDate: data.last_usage_date,
        stripeCustomerId: data.stripe_customer_id,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error updating subscription:', error);
      return null;
    }
  },

  findByCustomerId: async (customerId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        password: data.password,
        subscription: data.subscription as 'free' | 'pro',
        usageToday: data.usage_today,
        lastUsageDate: data.last_usage_date,
        stripeCustomerId: data.stripe_customer_id,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error finding user by customer ID:', error);
      return null;
    }
  },
};

// Notes operations
export const noteDb = {
  create: async (note: Omit<ShiftNote, 'id'>): Promise<ShiftNote> => {
    try {
      const { data, error } = await supabase
        .from('shift_notes')
        .insert({
          user_id: note.userId,
          raw_input: note.rawInput,
          formatted_output: note.formattedOutput,
          template: note.template,
          client_name: note.clientName || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        userId: data.user_id,
        rawInput: data.raw_input,
        formattedOutput: data.formatted_output,
        template: data.template,
        clientName: data.client_name,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  findByUserId: async (userId: string, limit: number = 5): Promise<ShiftNote[]> => {
    try {
      const { data, error } = await supabase
        .from('shift_notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data.map(note => ({
        id: note.id,
        userId: note.user_id,
        rawInput: note.raw_input,
        formattedOutput: note.formatted_output,
        template: note.template,
        clientName: note.client_name,
        createdAt: note.created_at,
      }));
    } catch (error) {
      console.error('Error finding notes by user ID:', error);
      return [];
    }
  },

  findById: async (id: string): Promise<ShiftNote | null> => {
    try {
      const { data, error } = await supabase
        .from('shift_notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        userId: data.user_id,
        rawInput: data.raw_input,
        formattedOutput: data.formatted_output,
        template: data.template,
        clientName: data.client_name,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error finding note by ID:', error);
      return null;
    }
  },
};

// Template operations
export const templateDb = {
  findAll: async (): Promise<Template[]> => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        prompt: template.prompt,
        isDefault: template.is_default,
      }));
    } catch (error) {
      console.error('Error finding templates:', error);
      return [];
    }
  },

  findById: async (id: string): Promise<Template | null> => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        prompt: data.prompt,
        isDefault: data.is_default,
      };
    } catch (error) {
      console.error('Error finding template by ID:', error);
      return null;
    }
  },
};
