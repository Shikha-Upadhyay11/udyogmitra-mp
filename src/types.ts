export type Language = 'en' | 'hi';

export type TransactionType = 'sale' | 'purchase' | 'payment';

export interface Transaction {
  id: string;
  invoiceNo: string;
  date: string;
  type: TransactionType;
  party: string;
  location: string;
  item: string;
  quantity: number;
  unit: string;
  hsnCode: string;
  baseAmount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  paymentMode: 'UPI' | 'Cash' | 'Credit' | 'NEFT';
  creditDays?: number;
  status: 'Paid' | 'Pending';
  source: 'Voice AI' | 'Bill OCR' | 'Manual';
  rawTranscript?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  hsnCode: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  unitPrice: number;
  ondcListed: boolean;
}

export interface OndcRfq {
  id: string;
  buyer: string;
  city: string;
  item: string;
  quantity: string;
  budget: number;
  deliveryBy: string;
  quoted: boolean;
}

export interface SkillCandidate {
  id: string;
  name: string;
  institute: string;
  trade: string;
  distanceKm: number;
  matchScore: number;
  skills: string[];
  availability: string;
  stipendExpected: number;
  napsEligible: boolean;
  assigned: boolean;
  credentialId?: string;
}

export interface SkillGap {
  id: string;
  role: string;
  reason: string;
  urgency: 'High' | 'Medium';
  durationWeeks: number;
}
