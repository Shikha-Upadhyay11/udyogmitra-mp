import React from 'react';
import { Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Transaction } from '../types';
import { MSME_PROFILE } from '../data/mockData';

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<Props> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Top bar */}
        <div className="no-print flex items-center justify-between border-b bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold">GST-Compliant Tax Invoice (e-Invoice Ready)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice body */}
        <div className="p-6 text-sm text-slate-800">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{MSME_PROFILE.name}</h2>
              <p className="text-slate-600">{MSME_PROFILE.cluster}</p>
              <p className="mt-1 font-mono text-xs text-slate-700">
                GSTIN: <strong>{MSME_PROFILE.gstin}</strong> (State: 23 - Madhya Pradesh)
              </p>
              <p className="font-mono text-xs text-slate-500">Udyam: {MSME_PROFILE.udyamNo}</p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                Tax Invoice
              </span>
              <p className="mt-2 font-mono font-bold text-slate-900">{transaction.invoiceNo}</p>
              <p className="text-xs text-slate-500">Date: {transaction.date}</p>
              <p className="text-xs text-slate-500">
                Mode: {transaction.paymentMode}
                {transaction.creditDays ? ` (${transaction.creditDays} Days Credit)` : ''}
              </p>
            </div>
          </div>

          <div className="my-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                {transaction.type === 'purchase' ? 'Supplier / Vendor' : 'Billed To'}
              </p>
              <p className="mt-0.5 font-bold text-slate-900">{transaction.party}</p>
              <p className="text-xs text-slate-600">{transaction.location}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase text-slate-400">Generated Via</p>
              <p className="mt-0.5 inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                UdyogMitra {transaction.source}
              </p>
              <p className="text-xs text-slate-500">UPI: {MSME_PROFILE.upiId}</p>
            </div>
          </div>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2">Description</th>
                <th className="py-2">HSN</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Taxable Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-medium text-slate-900">{transaction.item}</td>
                <td className="py-3 font-mono text-xs text-slate-600">{transaction.hsnCode}</td>
                <td className="py-3 text-right">
                  {transaction.quantity} {transaction.unit}
                </td>
                <td className="py-3 text-right font-semibold">
                  ₹{transaction.baseAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{transaction.baseAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9%)</span>
                <span>₹{transaction.cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9%)</span>
                <span>₹{transaction.sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-extrabold text-slate-900">
                <span>Grand Total</span>
                <span>₹{transaction.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
            <span>
              Auto-synced to <strong>UdyogTrust Cash-Flow Ledger</strong> &amp; ready for GSTR-1 export.
            </span>
            <span className="font-mono font-bold">IRN-VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
