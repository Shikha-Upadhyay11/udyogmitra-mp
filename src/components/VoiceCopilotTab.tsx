import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  FileText,
  Camera,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { InventoryItem, Language, Transaction } from '../types';
import { VOICE_PRESETS } from '../data/mockData';
import {
  buildTransactionFromParsed,
  ParsedVoiceResult,
  parseVoiceCommand,
} from '../utils/voiceParser';

interface Props {
  lang: Language;
  transactions: Transaction[];
  inventory: InventoryItem[];
  onAddTransaction: (tx: Transaction) => void;
  onSelectInvoice: (tx: Transaction) => void;
}

export const VoiceCopilotTab: React.FC<Props> = ({
  lang,
  transactions,
  inventory,
  onAddTransaction,
  onSelectInvoice,
}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedVoiceResult | null>(null);
  const [sourceMode, setSourceMode] = useState<'Voice AI' | 'Bill OCR'>('Voice AI');
  const [ocrScanning, setOcrScanning] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleAnalyze = (text: string, source: 'Voice AI' | 'Bill OCR' = 'Voice AI') => {
    if (!text.trim()) return;
    setTranscript(text);
    setSourceMode(source);
    const result = parseVoiceCommand(text);
    setParsed(result);
  };

  const toggleMicrophone = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus(
        'Browser live mic not supported here — click any Hinglish preset below or type your command!'
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus(
        lang === 'hi'
          ? 'सुन रहे हैं... हिंदी या हिंग्लिश में बोलें (उदा. "पीथमपुर ऑटो को 500 गियर शाफ्ट भेजे 85000 रुपये")'
          : 'Listening in Hindi / Hinglish / English...'
      );
    };

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setTranscript(text);
      if (event.results[0].isFinal) {
        handleAnalyze(text, 'Voice AI');
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceStatus('Mic permission unavailable — use any 1-click Hinglish voice demo below.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const simulateBillOcr = () => {
    setOcrScanning(true);
    setVoiceStatus('Scanning handwritten Parchi / supplier bill with Vision OCR...');
    setTimeout(() => {
      const sampleText =
        'Sanwer Road Alloy Steels se 300 kg EN-24 steel kharida, 45600 via NEFT';
      setOcrScanning(false);
      setVoiceStatus('Handwritten Bill OCR extracted with 97% confidence!');
      handleAnalyze(sampleText, 'Bill OCR');
    }, 900);
  };

  const confirmAndSave = () => {
    if (!parsed) return;
    const tx = buildTransactionFromParsed(parsed, sourceMode, transcript);
    onAddTransaction(tx);
    setParsed(null);
    setTranscript('');
    setVoiceStatus(`Saved ${tx.invoiceNo} — GST Invoice & Cash-Flow Trust Score updated!`);
    onSelectInvoice(tx);
  };

  return (
    <div className="space-y-6">
      {/* Voice + OCR Command Center */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Sparkles className="h-5 w-5 text-orange-500" />
                {lang === 'hi'
                  ? 'वॉइस-फर्स्ट MSME कोपायलट (बोलकर बिल बनाएं)'
                  : 'Voice-First MSME Copilot (Speak → GST Invoice)'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'hi'
                  ? 'हिंदी, हिंग्लिश या इंग्लिश में बोलें — ऑटो GST बिल, स्टॉक और खाता अपडेट होगा।'
                  : 'Speak in Hindi, Hinglish, or English — auto-generates GST invoice, updates stock & credit score.'}
              </p>
            </div>
            <button
              onClick={simulateBillOcr}
              disabled={ocrScanning}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              <Camera className="h-4 w-4" />
              {ocrScanning ? 'Scanning Parchi...' : 'Scan Handwritten Bill (OCR)'}
            </button>
          </div>

          {/* Mic + Input Box */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={toggleMicrophone}
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition ${
                isListening
                  ? 'animate-pulse-ring bg-red-600 hover:bg-red-700'
                  : 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
              }`}
              title="Tap to speak in Hindi or English"
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            <div className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(transcript)}
                  placeholder='e.g. "Pithampur Auto Parts ko 500 gear shafts bheje, 85000 rupaye, 30 din udhaar"'
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <button
                  onClick={() => handleAnalyze(transcript)}
                  className="shrink-0 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Parse AI
                </button>
              </div>
              {voiceStatus && (
                <p className="mt-1.5 text-xs font-medium text-orange-600">{voiceStatus}</p>
              )}
            </div>
          </div>

          {/* 1-Click Voice Presets for Live Demo */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              1-Click Hinglish / Hindi Voice Demos (Try Live):
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {VOICE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleAnalyze(preset.transcript, 'Voice AI')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-orange-300 hover:bg-orange-50/60"
                >
                  <p className="text-xs font-bold text-slate-700">{preset.label}</p>
                  <p className="truncate text-xs text-slate-500">"{preset.transcript}"</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Parsed AI Extraction Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <h3 className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-slate-500">
            <span>AI Structured Extraction</span>
            {parsed && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                {Math.round(parsed.confidence * 100)}% Match
              </span>
            )}
          </h3>

          {!parsed ? (
            <div className="mt-6 flex h-56 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
              <FileText className="h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-600">
                Speak a command or click a demo preset
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Multi-agent NLP extracts Party, HSN, Qty, CGST/SGST (9%+9%), and Credit Terms automatically.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50 p-3.5 text-xs">
                <div>
                  <span className="text-slate-400">Type</span>
                  <p className="font-bold uppercase text-orange-600">{parsed.type}</p>
                </div>
                <div>
                  <span className="text-slate-400">Party</span>
                  <p className="font-bold text-slate-900">{parsed.party}</p>
                </div>
                <div>
                  <span className="text-slate-400">Item &amp; HSN</span>
                  <p className="font-semibold text-slate-800">
                    {parsed.item} ({parsed.hsnCode})
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Quantity</span>
                  <p className="font-semibold text-slate-800">
                    {parsed.quantity} {parsed.unit}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Payment Mode</span>
                  <p className="font-semibold text-slate-800">
                    {parsed.paymentMode}
                    {parsed.creditDays ? ` (${parsed.creditDays}d)` : ''}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">GST Auto-Split</span>
                  <p className="font-semibold text-slate-800">
                    CGST ₹{parsed.cgst.toLocaleString('en-IN')} + SGST ₹
                    {parsed.sgst.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
                <span className="text-xs text-slate-300">Total Invoice Value</span>
                <span className="text-xl font-extrabold">
                  ₹{parsed.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={confirmAndSave}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm, Generate GST Invoice &amp; Sync Ledger
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Ledger + Inventory Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Ledger */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">
              {lang === 'hi' ? 'लाइव डिजिटल खाता एवं GST बिल' : 'Live Digital Khata & GST Invoices'}
            </h3>
            <span className="text-xs font-medium text-slate-500">
              {transactions.length} entries synced
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase text-slate-400">
                  <th className="pb-2.5">Invoice / Date</th>
                  <th className="pb-2.5">Party &amp; Item</th>
                  <th className="pb-2.5">Mode</th>
                  <th className="pb-2.5 text-right">Amount</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70">
                    <td className="py-3">
                      <p className="font-mono text-xs font-bold text-slate-800">{tx.invoiceNo}</p>
                      <p className="text-xs text-slate-400">{tx.date}</p>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        {tx.type === 'sale' && (
                          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        )}
                        {tx.type === 'purchase' && (
                          <ArrowDownLeft className="h-4 w-4 text-rose-600" />
                        )}
                        {tx.type === 'payment' && <Wallet className="h-4 w-4 text-indigo-600" />}
                        <span className="font-semibold text-slate-900">{tx.party}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {tx.item} • {tx.quantity} {tx.unit}
                      </p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          tx.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tx.paymentMode}
                        {tx.creditDays ? ` ${tx.creditDays}d` : ''}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-900">
                      ₹{tx.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onSelectInvoice(tx)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        GST PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <Package className="h-4 w-4 text-indigo-600" />
              Shop-Floor Inventory
            </h3>
          </div>
          <div className="space-y-3">
            {inventory.map((item) => {
              const lowStock = item.stock <= item.reorderLevel;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3.5 ${
                    lowStock ? 'border-amber-300 bg-amber-50/60' : 'border-slate-100 bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="font-mono text-[11px] text-slate-500">
                        SKU: {item.sku} • HSN {item.hsnCode}
                      </p>
                    </div>
                    <span className="text-right text-sm font-extrabold text-slate-900">
                      {item.stock} {item.unit}
                    </span>
                  </div>
                  {lowStock && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-800">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Below reorder level ({item.reorderLevel} {item.unit})
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
