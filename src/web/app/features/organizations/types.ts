export interface Organization {
  id: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
}
