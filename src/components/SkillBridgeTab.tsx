import React from 'react';
import {
  GraduationCap,
  MapPin,
  Award,
  CheckCircle2,
  Sparkles,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { SkillCandidate, SkillGap } from '../types';

interface Props {
  gaps: SkillGap[];
  candidates: SkillCandidate[];
  onAssignCandidate: (id: string) => void;
}

export const SkillBridgeTab: React.FC<Props> = ({ gaps, candidates, onAssignCandidate }) => {
  const assignedCount = candidates.filter((c) => c.assigned).length;

  return (
    <div className="space-y-6">
      {/* AI-Detected Shop-Floor Skill Gaps */}
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
              <Sparkles className="h-3.5 w-3.5" /> AI-Detected Shop-Floor Talent Gaps
            </span>
            <h2 className="mt-2 text-lg font-extrabold text-slate-900">
              Hyper-Local SkillBridge: Indore–Pithampur–Dewas ITI &amp; Polytechnic Pipeline
            </h2>
            <p className="text-xs text-slate-600">
              Automatically translates your rising order volume into 2-week NAPS-subsidized micro-apprenticeships for local MP youth — stopping forced metro migration.
            </p>
          </div>
          <div className="rounded-xl bg-white px-4 py-2.5 text-right shadow-sm">
            <p className="text-xs text-slate-500">Active Apprentices</p>
            <p className="text-xl font-extrabold text-emerald-700">{assignedCount} Hired</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {gaps.map((gap) => (
            <div key={gap.id} className="rounded-xl border border-orange-200/70 bg-white p-4">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    gap.urgency === 'High'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {gap.urgency} Priority
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {gap.durationWeeks}-Week Sprint
                </span>
              </div>
              <p className="mt-2 text-sm font-bold text-slate-900">{gap.role}</p>
              <p className="mt-1 text-xs text-slate-500">{gap.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Matched Local Candidates */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            Verified Local Candidates (Within 25 km of Pithampur Sector-3)
          </h3>
          <span className="text-xs font-semibold text-emerald-700">
            NAPS Govt. Stipend Support Eligible (Up to ₹1,500/mo DBT)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                cand.assigned ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-slate-900">{cand.name}</h4>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      {cand.matchScore}% Match
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-indigo-700">{cand.institute}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" /> {cand.trade}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-orange-500" /> {cand.distanceKm} km away
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Stipend</p>
                  <p className="text-sm font-extrabold text-slate-900">
                    ₹{cand.stipendExpected.toLocaleString('en-IN')}/mo
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {cand.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3.5">
                <span className="text-xs text-slate-500">{cand.availability}</span>

                {cand.assigned ? (
                  <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="h-4 w-4" />
                    Onboarded • VC #{cand.credentialId}
                  </div>
                ) : (
                  <button
                    onClick={() => onAssignCandidate(cand.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-600"
                  >
                    <Award className="h-3.5 w-3.5" />
                    Assign 2-Week Micro-Apprenticeship
                  </button>
                )}
              </div>

              {cand.assigned && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50/80 px-3 py-2 text-xs text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    Digital Skill India / DigiLocker Verifiable Credential draft issued &amp; NAPS stipend workflow triggered.
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
