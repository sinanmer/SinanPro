
export interface PasswordEntry {
  id: string;
  platform: string;
  username: string;
  password: string;
  description: string;
  createdAt: number;
}

export type ViewState = 'SETUP' | 'LOGIN' | 'DASHBOARD';
