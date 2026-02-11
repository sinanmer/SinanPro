
import { PasswordEntry } from '../types';

const MASTER_KEY_STORAGE = 'kasa_master_key';
const ENTRIES_STORAGE = 'kasa_entries';

// Note: In a production app, we would use window.crypto.subtle for PBKDF2 and AES
// This simulation persists the hash and the data.
export const storageService = {
  hasMasterKey: (): boolean => {
    return !!localStorage.getItem(MASTER_KEY_STORAGE);
  },

  setMasterKey: (key: string) => {
    // Basic hash simulation for demo
    const hashed = btoa(key); 
    localStorage.setItem(MASTER_KEY_STORAGE, hashed);
  },

  validateMasterKey: (key: string): boolean => {
    const stored = localStorage.getItem(MASTER_KEY_STORAGE);
    return btoa(key) === stored;
  },

  getEntries: (): PasswordEntry[] => {
    const raw = localStorage.getItem(ENTRIES_STORAGE);
    return raw ? JSON.parse(raw) : [];
  },

  saveEntries: (entries: PasswordEntry[]) => {
    localStorage.setItem(ENTRIES_STORAGE, JSON.stringify(entries));
  },

  addEntry: (entry: PasswordEntry) => {
    const entries = storageService.getEntries();
    entries.unshift(entry);
    storageService.saveEntries(entries);
  },

  updateEntry: (id: string, updated: Partial<PasswordEntry>) => {
    const entries = storageService.getEntries();
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updated };
      storageService.saveEntries(entries);
    }
  },

  deleteEntry: (id: string) => {
    const entries = storageService.getEntries();
    storageService.saveEntries(entries.filter(e => e.id !== id));
  }
};
