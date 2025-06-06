
export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference?: string;
  debits: Array<{ account: string; amount: number }>;
  credits: Array<{ account: string; amount: number }>;
  status: 'Draft' | 'Posted';
}
