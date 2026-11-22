import React from 'react';
import { Globe, CheckCircle2, Send, Factory, MapPin, Sparkles } from 'lucide-react';
import { InventoryItem, OndcRfq } from '../types';

interface Props {
  inventory: InventoryItem[];
  rfqs: OndcRfq[];
  onToggleOndc: (id: string) => void;
  onSendQuote: (id: string) => void;
}

export const OndcStoreTab: React.FC<Props> = ({
  inventory,
  rfqs,
  onToggleOndc,
  onSendQuote,
}) => {
  const listedCount = inventory.filter((i) => i.ondcListed).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-200">
            <Globe className="h-3.5 w-3.5" /> ONDC B2B Open Network Seller Node
          </span>
          <h2 className="mt-2 text-xl font-extrabold">
            Connect Pithampur Shop-Floor Directly to National B2B Buyers
          </h2>
          <p className="mt-1 text-xs text-indigo-200">
            Publish finished components &amp; idle CNC machine hours to ONDC in 1 click — zero middlemen commissions.
          </p>
        </div>
        <div className="rounded-xl bg-white/10 px-4 py-3 text-right">
          <p className="text-xs text-indigo-200">Active ONDC SKUs</p>
          <p className="text-2xl font-extrabold">{listedCount} Live</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Catalog Publisher */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900">
            <Factory className="h-4 w-4 text-orange-500" />
            1-Click ONDC Catalog Publisher
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Toggle any inventory item to broadcast live availability to verified B2B buyers.
          </p>

          <div className="mt-4 space-y-3">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    ₹{item.unitPrice}/{item.unit} • Stock: {item.stock} {item.unit}
                  </p>
                </div>
                <button
                  onClick={() => onToggleOndc(item.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    item.ondcListed
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.ondcListed ? '● Live on ONDC' : 'Publish'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming RFQs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              AI-Matched B2B Buyer RFQs
            </h3>
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
              {rfqs.filter((r) => !r.quoted).length} New Leads
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-indigo-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">{rfq.buyer}</p>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 shadow-sm">
                        <MapPin className="h-3 w-3 text-orange-500" />
                        {rfq.city}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-indigo-900">{rfq.item}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Qty: <strong>{rfq.quantity}</strong> • Target Delivery:{' '}
                      <strong>{rfq.deliveryBy}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">Est. Order Value</p>
                    <p className="text-lg font-extrabold text-slate-900">
                      ₹{rfq.budget.toLocaleString('en-IN')}
                    </p>
                    <button
                      onClick={() => onSendQuote(rfq.id)}
                      disabled={rfq.quoted}
                      className={`mt-2 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                        rfq.quoted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {rfq.quoted ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Quote Sent
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" /> Send AI Quote
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
