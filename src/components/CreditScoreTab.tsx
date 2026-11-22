import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  Landmark,
  Sliders,
} from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

export const CreditScoreTab: React.FC<Props> = ({ transactions }) => {
  const [loanAmount, setLoanAmount] = useState(350000);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [appliedOffer, setAppliedOffer] = useState<string | null>(null);

  const totalSales = transactions
    .filter((t) => t.type === 'sale')
    .reduce((acc, t) => acc + t.totalAmount, 0);
  const digitalCount = transactions.filter((t) => t.paymentMode !== 'Cash').length;

  // Dynamic score that responds live to transactions logged in Tab 1
  const rawScore = 685 + Math.min(180, transactions.length * 18 + Math.floor(totalSales / 25000) * 6);
  const trustScore = Math.min(890, rawScore);
  const maxEligible = Math.round((totalSales * 2.4 + 150000) / 10000) * 10000;

  const monthlyRate = 0.115 / 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  const scorePct = Math.round(((trustScore - 300) / 600) * 100);

  return (
    <div className="space-y-6">
      {/* Top Score + Cashflow Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Account Aggregator + GSTN Verified
            </span>
            <span className="text-xs text-slate-400">Live Score</span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-6xl font-extrabold tracking-tight text-white">{trustScore}</span>
            <span className="mb-2 text-sm font-semibold text-slate-400">/ 900 UdyogTrust</span>
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${scorePct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>300 (Informal)</span>
            <span>650 (Bankable)</span>
            <span>900 (Prime MSME)</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-white/5 p-4 text-xs">
            <div>
              <p className="text-slate-400">Verified Monthly Sales</p>
              <p className="mt-0.5 text-base font-bold text-emerald-300">
                ₹{totalSales.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Digital Trail Ratio</p>
              <p className="mt-0.5 text-base font-bold text-orange-300">
                {Math.round((digitalCount / Math.max(1, transactions.length)) * 100)}% Verified
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-300">
            Every voice invoice &amp; UPI collection automatically strengthens your collateral-free credit profile via India&apos;s OCEN / Account Aggregator rails.
          </p>
        </div>

        {/* Interactive Working Capital Simulator */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Sliders className="h-5 w-5 text-orange-500" />
                Instant Collateral-Free Working Capital (OCEN)
              </h3>
              <p className="text-xs text-slate-500">
                Pre-approved limit based on your live Pithampur GST &amp; UPI cash-flow trail:{' '}
                <strong className="text-emerald-700">
                  Up to ₹{maxEligible.toLocaleString('en-IN')}
                </strong>
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Working Capital Needed</span>
                <span className="font-bold text-slate-900">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
              </label>
              <input
                type="range"
                min={50000}
                max={Math.max(500000, maxEligible)}
                step={25000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="mt-2 w-full accent-orange-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Repayment Tenure</span>
                <span className="font-bold text-slate-900">{tenureMonths} Months</span>
              </label>
              <input
                type="range"
                min={3}
                max={24}
                step={3}
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="mt-2 w-full accent-orange-600"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center">
            <div>
              <p className="text-xs text-slate-500">Est. Interest Rate</p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">11.5% p.a.</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Monthly EMI</p>
              <p className="mt-1 text-lg font-extrabold text-orange-600">
                ₹{emi.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Disbursal Time</p>
              <p className="mt-1 text-lg font-extrabold text-emerald-700">&lt; 15 mins</p>
            </div>
          </div>

          {/* Partner Lenders */}
          <div className="mt-5 space-y-2.5">
            {[
              {
                name: 'SIDBI GST Sahay (MP MSME Priority)',
                rate: '10.8% p.a.',
                tag: 'Zero Collateral • Invoice Financing',
              },
              {
                name: 'MP Finance Corp (MPFC) Udyog Line',
                rate: '11.5% p.a.',
                tag: 'State Interest Subvention Eligible',
              },
            ].map((offer) => (
              <div
                key={offer.name}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{offer.name}</p>
                    <p className="text-xs text-slate-500">
                      {offer.rate} • {offer.tag}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAppliedOffer(offer.name)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    appliedOffer === offer.name
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {appliedOffer === offer.name ? (
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Consent Shared
                    </span>
                  ) : (
                    '1-Click Apply'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why DPI Matters Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-emerald-700" />
          <div>
            <p className="text-sm font-bold text-emerald-950">
              How UdyogMitra Solves MP&apos;s MSME Credit Gap
            </p>
            <p className="text-xs text-emerald-800">
              Instead of waiting months for physical bank audits, everyday Hindi voice invoices build a real-time, tamper-proof cash-flow identity.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm">
          <IndianRupee className="h-3.5 w-3.5" /> OCEN 4.0 Ready
        </span>
      </div>
    </div>
  );
};
