import React, { useState } from 'react';
import {
  Mic,
  ShieldCheck,
  Globe,
  GraduationCap,
  MapPin,
  Languages,
  TrendingUp,
  FileCheck2,
  Users,
} from 'lucide-react';
import {
  INITIAL_CANDIDATES,
  INITIAL_INVENTORY,
  INITIAL_RFQS,
  INITIAL_TRANSACTIONS,
  MSME_PROFILE,
  SKILL_GAPS,
} from './data/mockData';
import { InventoryItem, Language, OndcRfq, SkillCandidate, Transaction } from './types';
import { VoiceCopilotTab } from './components/VoiceCopilotTab';
import { CreditScoreTab } from './components/CreditScoreTab';
import { OndcStoreTab } from './components/OndcStoreTab';
import { SkillBridgeTab } from './components/SkillBridgeTab';
import { InvoiceModal } from './components/InvoiceModal';

type TabKey = 'voice' | 'credit' | 'ondc' | 'skillbridge';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('voice');
  const [lang, setLang] = useState<Language>('en');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [rfqs, setRfqs] = useState<OndcRfq[]>(INITIAL_RFQS);
  const [candidates, setCandidates] = useState<SkillCandidate[]>(INITIAL_CANDIDATES);
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);

    // Sync inventory dynamically
    if (tx.type === 'sale' || tx.type === 'purchase') {
      setInventory((prev) =>
        prev.map((item) => {
          if (
            item.hsnCode === tx.hsnCode ||
            item.name.toLowerCase().includes(tx.item.toLowerCase().split(' ')[0])
          ) {
            const delta = tx.type === 'sale' ? -tx.quantity : tx.quantity;
            return { ...item, stock: Math.max(0, item.stock + delta) };
          }
          return item;
        })
      );
    }
  };

  const handleToggleOndc = (id: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ondcListed: !item.ondcListed } : item))
    );
  };

  const handleSendQuote = (id: string) => {
    setRfqs((prev) => prev.map((r) => (r.id === id ? { ...r, quoted: true } : r)));
  };

  const handleAssignCandidate = (id: string) => {
    const vcId = `MP-ITI-${Math.floor(10000 + Math.random() * 89999)}`;
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, assigned: true, credentialId: vcId } : c))
    );
  };

  const totalSales = transactions
    .filter((t) => t.type === 'sale')
    .reduce((acc, t) => acc + t.totalAmount, 0);
  const trustScore = Math.min(
    890,
    685 + Math.min(180, transactions.length * 18 + Math.floor(totalSales / 25000) * 6)
  );
  const assignedCount = candidates.filter((c) => c.assigned).length;

  const tabs: { key: TabKey; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    {
      key: 'voice',
      labelEn: 'Voice MSME Copilot',
      labelHi: 'वॉइस MSME कोपायलट',
      icon: <Mic className="h-4 w-4" />,
    },
    {
      key: 'credit',
      labelEn: 'Cash-Flow Credit',
      labelHi: 'कैश-फ्लो क्रेडिट',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      key: 'ondc',
      labelEn: 'ONDC B2B Store',
      labelHi: 'ONDC B2B बाज़ार',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: 'skillbridge',
      labelEn: 'Indore–MP SkillBridge',
      labelHi: 'इंदौर–MP स्किलब्रिज',
      icon: <GraduationCap className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-14">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-extrabold text-white shadow-sm">
              उ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                  UdyogMitra <span className="text-orange-600">MP</span>
                </h1>
                <span className="hidden rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-800 sm:inline-block">
                  The Rise of New India
                </span>
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3 text-orange-500" />
                {MSME_PROFILE.name} • Pithampur Sector-3, Indore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang((l) => (l === 'en' ? 'hi' : 'en'))}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <Languages className="h-4 w-4 text-orange-600" />
              {lang === 'en' ? 'हिंदी में देखें' : 'Switch to English'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {/* Live KPI Strip */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{lang === 'hi' ? 'कुल सत्यापित बिक्री' : 'Verified Sales (Nov)'}</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-slate-900">
              ₹{totalSales.toLocaleString('en-IN')}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-emerald-700">
              +18% vs Oct • GST Ready
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{lang === 'hi' ? 'उद्योग-ट्रस्ट स्कोर' : 'UdyogTrust Score'}</span>
              <ShieldCheck className="h-4 w-4 text-orange-600" />
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-slate-900">
              {trustScore} <span className="text-xs font-semibold text-slate-400">/ 900</span>
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-orange-600">
              OCEN Pre-Approved Active
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{lang === 'hi' ? 'GST चालान जनरेट' : 'Digital GST Invoices'}</span>
              <FileCheck2 className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-slate-900">{transactions.length}</p>
            <p className="mt-0.5 text-[11px] font-medium text-indigo-600">
              Zero manual ERP entry
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{lang === 'hi' ? 'स्थानीय ITI अप्रेंटिस' : 'Local ITI Apprentices'}</span>
              <Users className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-slate-900">
              {assignedCount}{' '}
              <span className="text-xs font-semibold text-slate-400">
                / {candidates.length} Matched
              </span>
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
              Indore–Pithampur–Dewas Belt
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        {activeTab === 'voice' && (
          <VoiceCopilotTab
            lang={lang}
            transactions={transactions}
            inventory={inventory}
            onAddTransaction={handleAddTransaction}
            onSelectInvoice={setSelectedInvoice}
          />
        )}
        {activeTab === 'credit' && <CreditScoreTab transactions={transactions} />}
        {activeTab === 'ondc' && (
          <OndcStoreTab
            inventory={inventory}
            rfqs={rfqs}
            onToggleOndc={handleToggleOndc}
            onSendQuote={handleSendQuote}
          />
        )}
        {activeTab === 'skillbridge' && (
          <SkillBridgeTab
            gaps={SKILL_GAPS}
            candidates={candidates}
            onAssignCandidate={handleAssignCandidate}
          />
        )}
      </main>

      {/* Printable GST Invoice Modal */}
      <InvoiceModal transaction={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
    </div>
  );
}
