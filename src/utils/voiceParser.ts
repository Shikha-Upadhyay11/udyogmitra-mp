import { Transaction, TransactionType } from '../types';

export interface ParsedVoiceResult {
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
  confidence: number;
}

/**
 * Deterministic Hinglish / Hindi / English MSME voice parser.
 * Works 100% offline with zero latency so live hackathon demos never break.
 */
export function parseVoiceCommand(rawText: string): ParsedVoiceResult {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // 1. Detect transaction type
  let type: TransactionType = 'sale';
  if (
    lower.includes('payment') ||
    lower.includes('aa gaya') ||
    lower.includes('aaya') ||
    lower.includes('received') ||
    lower.includes('mila')
  ) {
    type = 'payment';
  } else if (
    lower.includes('kharid') ||
    lower.includes('bought') ||
    lower.includes('purchase') ||
    lower.includes('mangwaya') ||
    lower.includes(' se ')
  ) {
    type = 'purchase';
  }

  // 2. Extract amount (supports 85000, 85,000, 85k, 1.5 lakh)
  let baseAmount = 25000;
  const amountMatches = [
    ...text.matchAll(/(?:₹|rs\.?\s*)?(\d{1,3}(?:,\d{2,3})+|\d+(?:\.\d+)?)\s*(k|hazaar|hazar|lakh|lac|rupaye|rupees|rs)?/gi),
  ];

  let bestAmount = 0;
  for (const m of amountMatches) {
    const rawNum = parseFloat(m[1].replace(/,/g, ''));
    const suffix = (m[2] || '').toLowerCase();
    let val = rawNum;
    if (suffix === 'k' || suffix === 'hazaar' || suffix === 'hazar') val = rawNum * 1000;
    if (suffix === 'lakh' || suffix === 'lac') val = rawNum * 100000;
    // Ignore small numbers that are likely quantity or credit days (like 30 din or 500 pcs)
    if (val >= 1000 && val > bestAmount) {
      bestAmount = val;
    }
  }
  if (bestAmount > 0) baseAmount = Math.round(bestAmount);

  // 3. Extract quantity + unit
  let quantity = 1;
  let unit = 'pcs';
  const qtyMatch = text.match(/\b(\d{1,4})\s*(kg|pcs|pieces|gear|flange|steel|box|carton|units|shafts?|rods?)?/i);
  if (qtyMatch) {
    const q = parseInt(qtyMatch[1], 10);
    if (q > 0 && q !== baseAmount && q <= 5000) {
      quantity = q;
      const u = (qtyMatch[2] || '').toLowerCase();
      if (u === 'kg') unit = 'kg';
      else if (u === 'box' || u === 'carton') unit = 'boxes';
      else unit = 'pcs';
    }
  }

  // 4. Extract party name
  let party = 'Indore Local Trade Partner';
  const koMatch = text.match(/^([A-Za-z0-9\s.&-]+?)\s+(?:ko|se|ka)\b/i);
  const toMatch = text.match(/\b(?:to|from)\s+([A-Za-z0-9\s.&-]+?)(?:\s+for|\s+via|\s+of|,|$)/i);
  if (koMatch && koMatch[1].trim().length > 2) {
    party = koMatch[1].trim();
  } else if (toMatch && toMatch[1].trim().length > 2) {
    party = toMatch[1].trim();
  }

  // 5. Infer location from party/text
  let location = 'Indore, MP';
  if (lower.includes('pithampur')) location = 'Pithampur, MP';
  else if (lower.includes('dewas')) location = 'Dewas, MP';
  else if (lower.includes('ujjain')) location = 'Ujjain, MP';
  else if (lower.includes('sanwer')) location = 'Sanwer Road, Indore';
  else if (lower.includes('bhopal')) location = 'Bhopal, MP';

  // 6. Infer item & HSN
  let item = type === 'payment' ? 'Outstanding Ledger Settlement' : 'Industrial Machined Components';
  let hsnCode = type === 'payment' ? '9999' : '8483';
  if (lower.includes('gear') || lower.includes('shaft')) {
    item = 'CNC Machined Gear Shafts';
    hsnCode = '8483';
  } else if (lower.includes('steel') || lower.includes('rod') || lower.includes('en-24')) {
    item = 'EN-24 Alloy Steel Rods';
    hsnCode = '7228';
  } else if (lower.includes('flange') || lower.includes('hydraulic')) {
    item = 'Hydraulic Coupler Flanges';
    hsnCode = '8481';
  } else if (lower.includes('insert') || lower.includes('carbide')) {
    item = 'Carbide CNC Turning Inserts';
    hsnCode = '8209';
  }

  // 7. Payment mode & credit days
  let paymentMode: 'UPI' | 'Cash' | 'Credit' | 'NEFT' = 'UPI';
  let creditDays: number | undefined;
  let status: 'Paid' | 'Pending' = 'Paid';

  const creditMatch = lower.match(/(\d+)\s*(?:din|days?)\s*(?:udhaar|udhar|credit)?/);
  if (lower.includes('udhaar') || lower.includes('udhar') || lower.includes('credit') || creditMatch) {
    paymentMode = 'Credit';
    creditDays = creditMatch ? parseInt(creditMatch[1], 10) : 30;
    status = 'Pending';
  } else if (lower.includes('cash') || lower.includes('nagad')) {
    paymentMode = 'Cash';
  } else if (lower.includes('neft') || lower.includes('rtgs') || lower.includes('bank')) {
    paymentMode = 'NEFT';
  } else {
    paymentMode = 'UPI';
  }

  // 8. Calculate GST (18% split 9% CGST + 9% SGST for MP intrastate; 0% on payment receipt)
  const gstRate = type === 'payment' ? 0 : 0.09;
  const cgst = Math.round(baseAmount * gstRate);
  const sgst = Math.round(baseAmount * gstRate);
  const totalAmount = baseAmount + cgst + sgst;

  return {
    type,
    party,
    location,
    item,
    quantity: type === 'payment' ? 1 : quantity,
    unit: type === 'payment' ? 'lot' : unit,
    hsnCode,
    baseAmount,
    cgst,
    sgst,
    totalAmount,
    paymentMode,
    creditDays,
    status,
    confidence: 0.96,
  };
}

export function buildTransactionFromParsed(
  parsed: ParsedVoiceResult,
  source: 'Voice AI' | 'Bill OCR',
  rawTranscript?: string
): Transaction {
  const randomSeq = Math.floor(413 + Math.random() * 500);
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `tx-${Date.now()}`,
    invoiceNo: `MP-2026-0${randomSeq}`,
    date: today,
    type: parsed.type,
    party: parsed.party,
    location: parsed.location,
    item: parsed.item,
    quantity: parsed.quantity,
    unit: parsed.unit,
    hsnCode: parsed.hsnCode,
    baseAmount: parsed.baseAmount,
    cgst: parsed.cgst,
    sgst: parsed.sgst,
    totalAmount: parsed.totalAmount,
    paymentMode: parsed.paymentMode,
    creditDays: parsed.creditDays,
    status: parsed.status,
    source,
    rawTranscript,
  };
}
