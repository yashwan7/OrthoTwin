import React, { useState } from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  FileSearch,
  ArrowRight,
  ShieldAlert,
  TrendingUp,
  Zap,
  Eye,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DiseaseSeverity, TriagePriority } from '../../types';

// ─── Severity Color Mappings (Bone & Vermilion System) ────────────────────────

const severityPill: Record<DiseaseSeverity, string> = {
  None:     'bg-[#ECE6DB] text-[#5A534A] border-[#D8CDBB]',
  Mild:     'bg-[#DCE7D6] text-[#2B5236] border-[#BED2B5]',
  Moderate: 'bg-[#F5E5C2] text-[#6F4600] border-[#E8D19F]',
  Severe:   'bg-[#F6D8CF] text-[#8E2C18] border-[#E59A85]',
};

const severityDot: Record<DiseaseSeverity, string> = {
  None:     'bg-[#6B635A]',
  Mild:     'bg-[#3F6B4A]',
  Moderate: 'bg-[#C98A1B]',
  Severe:   'bg-[#B83C25]',
};

const priorityConfig: Record<TriagePriority, { label: string; text: string; bg: string; border: string; icon: React.ElementType }> = {
  Urgent:  { label: 'URGENT',  text: 'text-[#8E2C18]', bg: 'bg-[#FDF2EE]', border: 'border-[#E59A85]', icon: AlertTriangle  },
  High:    { label: 'HIGH',    text: 'text-[#6F4600]', bg: 'bg-[#FEF9EE]', border: 'border-[#E8D19F]', icon: TrendingUp     },
  Routine: { label: 'ROUTINE', text: 'text-[#2B5236]', bg: 'bg-[#F2F7F0]', border: 'border-[#BED2B5]', icon: Clock          },
  Monitor: { label: 'MONITOR', text: 'text-[#5A534A]', bg: 'bg-[#FAF9F5]', border: 'border-[#D8CDBB]', icon: Eye            },
};

// ─── Complexity Score Ring ───────────────────────────────────────────────────

const ComplexityRing: React.FC<{ score: number }> = ({ score }) => {
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color  = score >= 75 ? '#B83C25' : score >= 50 ? '#C98A1B' : '#3F6B4A';

  return (
    <svg width={136} height={136} className="shrink-0">
      <circle cx={68} cy={68} r={radius} fill="none" stroke="#E2D9CB" strokeWidth={11} />
      <circle
        cx={68} cy={68} r={radius} fill="none"
        stroke={color} strokeWidth={11}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="50%" y="45%" dominantBaseline="middle" textAnchor="middle" fill="#2B2723" fontSize={24} fontWeight="bold" fontFamily="IBM Plex Mono">
        {score}
      </text>
      <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fill="#6B635A" fontSize={9} fontFamily="IBM Plex Mono" letterSpacing="0.08em">
        COMPLEXITY
      </text>
    </svg>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const ClinicalTriageView: React.FC = () => {
  const { triage, patient, setActiveStep } = useOrthoTwin();
  const [expandedId, setExpandedId] = useState<string | null>('ds_01');

  const priority = priorityConfig[triage.triage_priority];
  const PriorityIcon = priority.icon;

  const flagged  = triage.disease_signs.filter(s => s.flaggedForReview);
  const routine  = triage.disease_signs.filter(s => !s.flaggedForReview);

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-10">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#B83C25] text-xs font-semibold uppercase tracking-wider font-mono mb-1">
            <span className="live w-2 h-2 rounded-full bg-[#B83C25]" />
            AI Disease Detection & Clinical Prioritisation
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2723] tracking-tight">
            Case Prioritisation & Disease Signs
          </h2>
          <p className="text-[#5A534A] text-xs sm:text-sm mt-0.5">
            Automated analysis of CT imaging identifying anatomical pathology and ordering cases by surgical urgency.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveStep('upload')}
            className="btn btn-ghost text-xs"
          >
            <FileSearch size={14} />
            <span>Inspect CT Studies</span>
          </button>
          <button
            onClick={() => setActiveStep('reports')}
            className="btn btn-primary text-xs shadow-md"
          >
            <span>Full Surgical Plan</span>
            <span className="arr">→</span>
          </button>
        </div>
      </div>

      {/* ── Priority Banner + Score ──────────────────────────────────────────── */}
      <div className={`${priority.bg} border ${priority.border} rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm`}>
        {/* Score Ring */}
        <ComplexityRing score={triage.complexity_score} />

        {/* Priority Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#FFFFFF] border ${priority.border} ${priority.text} shadow-xs font-mono`}>
              <PriorityIcon size={14} />
              {priority.label} PRIORITY
            </span>
            <span className="text-xs font-mono bg-[#FFFFFF] text-[#2B2723] px-3 py-1 rounded-full border border-[#E2D9CB]">
              Patient: {patient.name} ({patient.patient_id})
            </span>
            <span className="text-xs font-mono text-[#6B635A]">
              Analysis generated: {triage.generated_at}
            </span>
          </div>

          <div className="text-[#2B2723] font-bold text-base flex items-center gap-2">
            <Zap size={16} className="text-[#B83C25] shrink-0" />
            <span>Recommended Procedure: <strong className="text-[#B83C25] ml-1">{triage.recommended_intervention}</strong></span>
          </div>

          <div className="text-[#5A534A] text-xs font-mono flex items-center gap-2">
            <Clock size={13} className="text-[#6B635A] shrink-0" />
            <span>Consult timeframe: <strong className="text-[#2B2723] ml-1">{triage.time_to_consult}</strong></span>
          </div>

          <p className="text-[#5A534A] text-xs leading-relaxed bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl p-4 font-mono">
            {triage.ai_summary}
          </p>
        </div>
      </div>

      {/* ── Findings & Prioritisation Breakdown ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT: Flagged Findings (7 cols) */}
        <div className="xl:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#8E2C18] uppercase tracking-wider font-mono px-1">
            <span className="flex items-center gap-2">
              <AlertTriangle size={14} />
              {flagged.length} Findings Flagged for Immediate Surgeon Review
            </span>
            <span className="text-[#6B635A]">Click finding to inspect</span>
          </div>

          {flagged.map(sign => (
            <div
              key={sign.id}
              onClick={() => setExpandedId(expandedId === sign.id ? null : sign.id)}
              className={`bg-[#FFFFFF] border rounded-2xl p-4 sm:p-5 cursor-pointer transition-all hover:border-[#B83C25] shadow-xs ${
                expandedId === sign.id ? 'border-[#B83C25] ring-2 ring-[#F2CDC1]' : 'border-[#E2D9CB]'
              }`}
            >
              {/* Row Summary */}
              <div className="flex items-start gap-3.5">
                <span className={`w-3 h-3 rounded-full mt-1 shrink-0 ${severityDot[sign.severity]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[#2B2723] font-bold text-sm sm:text-base">{sign.name}</span>
                    <div className="flex items-center gap-2">
                      {sign.walchClass && (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF1DF] text-[#6F4600] border border-[#E8D19F]">
                          {sign.walchClass}
                        </span>
                      )}
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${severityPill[sign.severity]}`}>
                        {sign.severity}
                      </span>
                      {expandedId === sign.id ? <ChevronUp size={16} className="text-[#6B635A]" /> : <ChevronDown size={16} className="text-[#6B635A]" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[#5A534A] font-mono flex-wrap">
                    <strong className="text-[#2B2723]">{sign.value}</strong>
                    <span>·</span>
                    <span>{sign.category}</span>
                    <span>·</span>
                    <span>AI Confidence: <strong className="text-[#3F6B4A]">{(sign.confidence * 100).toFixed(0)}%</strong></span>
                  </div>
                </div>
              </div>

              {/* Expanded Detail */}
              {expandedId === sign.id && (
                <div className="mt-3.5 pt-3.5 border-t border-[#EEE7DB] text-xs text-[#5A534A] leading-relaxed bg-[#FAF9F5] -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 rounded-b-2xl">
                  <span className="text-[#8E2C18] font-mono uppercase text-[10px] tracking-wider block font-bold mb-1">
                    Clinical Decision Significance
                  </span>
                  {sign.clinicalNote}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: Distribution & Quick Workflows (5 cols) */}
        <div className="xl:col-span-5 space-y-5">

          {/* Finding Distribution */}
          <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl p-5 shadow-xs space-y-3.5">
            <h4 className="text-xs font-bold text-[#2B2723] uppercase font-mono tracking-wider flex items-center gap-2">
              <Activity size={14} className="text-[#B83C25]" /> Severity Breakdown
            </h4>
            {(['Severe', 'Moderate', 'Mild', 'None'] as DiseaseSeverity[]).map(sev => {
              const count = triage.disease_signs.filter(s => s.severity === sev).length;
              const pct   = triage.disease_signs.length ? (count / triage.disease_signs.length) * 100 : 0;
              return (
                <div key={sev} className="flex items-center gap-3 text-xs">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${severityDot[sev]}`} />
                  <span className="text-[#5A534A] font-medium w-20 shrink-0">{sev}</span>
                  <div className="flex-1 bg-[#F0E8DB] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${severityDot[sev]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[#2B2723] font-bold text-xs w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Additional Findings */}
          <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#2B2723] uppercase font-mono tracking-wider flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#3F6B4A]" /> Non-Critical Observed Findings
            </h4>
            {routine.map(sign => (
              <div key={sign.id} className="flex items-start gap-2.5 text-xs p-2.5 rounded-xl bg-[#FAF9F5] border border-[#EEE7DB]">
                <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${severityDot[sign.severity]}`} />
                <div>
                  <div className="text-[#2B2723] font-semibold">{sign.name}</div>
                  <div className="text-[#6B635A] font-mono text-[11px]">{sign.value} · {sign.category}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="bg-[#ECE6DB] border border-[#DCD2C2] rounded-3xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-[#B83C25] uppercase font-mono tracking-wider">
              Surgeon Action Checklist
            </h4>
            <div className="space-y-2">
              {[
                { label: 'Examine 3D Shoulder Digital Twin', step: 'reconstruction' as const },
                { label: 'Verify Glenoid Vault AI Segmentation', step: 'segmentation' as const },
                { label: 'Open Vendor-Neutral Implant Planning', step: 'planning' as const },
                { label: 'Simulate Articulation & Impingement Risk', step: 'simulation' as const },
              ].map(({ label, step }) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F5] text-[#2B2723] hover:text-[#B83C25] border border-[#E2D9CB] hover:border-[#B83C25] text-xs font-semibold flex items-center justify-between transition shadow-2xs group"
                >
                  <span>{label}</span>
                  <span className="arr text-xs">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Regulatory Disclaimer ── */}
      <div className="bg-[#FAF9F5] border border-[#E2D9CB] p-4 rounded-2xl text-xs flex items-start gap-3 shadow-xs">
        <ShieldAlert size={16} className="text-[#B83C25] shrink-0 mt-0.5" />
        <p className="text-[#6B635A] font-mono text-[11px] leading-relaxed">
          CLINICAL DECISION SUPPORT ONLY — All AI-detected disease findings must be reviewed and confirmed by a qualified
          orthopedic surgeon before any surgical execution. This tool assists case scheduling and surgical simulation;
          it does not replace certified radiological review.
        </p>
      </div>
    </div>
  );
};
