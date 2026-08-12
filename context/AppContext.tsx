'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Contact, DashboardStats, User } from '@/lib/types';

interface AppContextType {
  contacts: Contact[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  user: User | null;
  fetchContacts: (search?: string) => Promise<void>;
  addContact: (contact: any) => Promise<boolean>;
  updateContactStatus: (id: string, status: any) => Promise<boolean>;
  deleteContact: (id: string) => Promise<boolean>;
  searchMessages: (keyword: string) => Promise<any[]>;
  fetchEmails: () => Promise<string[]>;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchContacts = async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = search ? `/api/contacts?search=${encodeURIComponent(search)}` : '/api/contacts';
      const response = await fetch(url);
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Failed to fetch contacts');
      
      setContacts(result.data || []);
      if (result.data) {
        setStats({
          total: result.data.length,
          new: result.data.filter((c: Contact) => c.status === 'new').length,
          read: result.data.filter((c: Contact) => c.status === 'read').length,
          replied: result.data.filter((c: Contact) => c.status === 'replied').length,
          archived: result.data.filter((c: Contact) => c.status === 'archived').length,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      
      if (!response.ok) throw new Error('Failed to add contact');
      
      await fetchContacts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: Contact['status']): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      await fetchContacts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete contact');
      
      await fetchContacts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const searchMessages = async (keyword: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/contacts/search/${encodeURIComponent(keyword)}`);
      const result = await response.json();
      
      if (!response.ok) throw new Error('Failed to search messages');
      
      return result.messages || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchEmails = async (): Promise<string[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/contacts/emails');
      const result = await response.json();
      
      if (!response.ok) throw new Error('Failed to fetch emails');
      
      return result.emails || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const value = {
    contacts,
    stats,
    loading,
    error,
    user,
    fetchContacts,
    addContact,
    updateContactStatus,
    deleteContact,
    searchMessages,
    fetchEmails,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}