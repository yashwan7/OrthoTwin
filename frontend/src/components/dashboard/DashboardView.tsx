import React from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { WorkflowStepId } from '../../types';
import {
  User,
  Calendar,
  Building2,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  PlayCircle,
  AlertTriangle,
  Stethoscope,
  Zap,
  FolderPlus,
  Layers,
  Box,
  Sliders,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { patient, setActiveStep, loadDemoPatient, triage, ctUploaded } = useOrthoTwin();

  const stages = [
    { num: '01', id: 'upload' as WorkflowStepId, title: 'Bring in approved studies', desc: 'DICOM CT series & radiographs uploaded and validated. 240 slices indexed.', status: 'Complete' },
    { num: '02', id: 'segmentation' as WorkflowStepId, title: 'Build the digital twin', desc: 'Multi-label deep-learning isolates humerus, scapula, and glenoid surface.', status: 'Complete' },
    { num: '03', id: 'triage' as WorkflowStepId, title: 'Flag possible signs', desc: 'Posterior bone loss, joint collapse, retroversion, and humeral migration detected.', status: 'Complete' },
    { num: '04', id: 'planning' as WorkflowStepId, title: 'Prioritise & plan', desc: 'Cases ordered by clinical urgency. Patient-specific implant planning active.', status: 'Active' },
  ];

  return (
    <div className="space-y-10 max-w-[1360px] mx-auto pb-10">
      {/* ── HERO SECTION (Exact Reference Direction) ── */}
      <section className="bg-[#ECE6DB] border border-[#DCD2C2] rounded-[32px] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-[#D8CDBB] rounded-full text-xs font-semibold tracking-wider uppercase text-[#5A534A] bg-[#FAF9F5]">
              <span className="live w-2 h-2 rounded-full bg-[#3F6B4A] inline-block" />
              <span>Shoulder surgical planning · Decision support</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#2B2723] leading-[1.06] tracking-tight">
              See the <span className="mark">whole shoulder</span> before the first incision.
            </h1>

            <p className="text-[#5A534A] text-base sm:text-lg leading-relaxed max-w-xl">
              OrthoTwin builds a patient-specific digital twin from approved imaging and clinical data,
              points out possible signs of disease, and moves the cases that need attention to the top of the list.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <button
                onClick={() => setActiveStep('triage')}
                className="btn btn-primary shadow-lg"
              >
                <span>Open case prioritisation</span>
                <span className="arr">→</span>
              </button>

              <button
                onClick={loadDemoPatient}
                className="btn btn-ghost"
              >
                <PlayCircle size={17} />
                <span>Reload Demo Case ({patient.patient_id})</span>
              </button>
            </div>

            <p className="text-xs text-[#6B635A] max-w-lg font-mono">
              Works with studies from any vendor. A clinician reviews every finding before any decision is made.
            </p>
          </div>

          {/* Hero Right Visual: Illustrative Radiograph & Floating Findings */}
          <div className="lg:col-span-5 relative bg-[#FAF9F5] border border-[#E2D9CB] rounded-3xl p-5 shadow-md">
            <div className="flex justify-between items-center font-mono text-[11px] text-[#5A534A] pb-3 border-b border-[#E2D9CB]">
              <span>CASE {patient.patient_id} · RIGHT SHOULDER</span>
              <span className="flex items-center gap-1.5 text-[#3F6B4A] font-semibold">
                <span className="live w-2 h-2 rounded-full bg-[#3F6B4A]" />
                TRIAGED: URGENT
              </span>
            </div>

            <div className="relative py-4 flex items-center justify-center">
              {/* Illustrative shoulder anatomy diagram */}
              <svg viewBox="0 0 420 340" className="w-full h-auto max-h-[280px]">
                <defs>
                  <pattern id="trab" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M0 10 L10 0" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1" />
                  </pattern>
                </defs>
                {/* Clavicle */}
                <path d="M30 60 C120 30 220 20 320 35 L322 55 C226 42 136 60 36 90 Z" fill="#D8D0C2" stroke="#9A8F80" strokeWidth="2" />
                {/* Scapula Body */}
                <path d="M220 130 C260 150 310 190 330 270 C310 300 250 310 200 280 C180 230 190 170 220 130 Z" fill="#D8D0C2" stroke="#9A8F80" strokeWidth="2" />
                {/* Glenoid Articular Surface */}
                <ellipse cx="230" cy="180" rx="10" ry="36" transform="rotate(8 230 180)" fill="#CFC6B6" stroke="#9A8F80" strokeWidth="2" />
                {/* Humeral Head */}
                <circle cx="160" cy="185" r="54" fill="#E4DDD1" stroke="#9A8F80" strokeWidth="2" />
                <circle cx="160" cy="185" r="54" fill="url(#trab)" />
                {/* Digital Twin Planned Contour */}
                <circle cx="160" cy="185" r="62" fill="none" stroke="#3F6B4A" strokeWidth="2" strokeDasharray="6 6" />
                <path d="M220 145 C250 160 290 200 305 270" fill="none" stroke="#3F6B4A" strokeWidth="2" strokeDasharray="6 6" />
                {/* Warning flags */}
                <circle cx="230" cy="180" r="7" fill="#B83C25" />
                <circle cx="160" cy="140" r="7" fill="#C98A1B" />
              </svg>

              <div className="scanline" />

              {/* Floating tags */}
              <div className="absolute top-4 left-2 bg-[#FFFFFF] border border-[#E2D9CB] rounded-full px-3 py-1.5 text-[11px] font-medium text-[#2B2723] shadow-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B83C25] inline-block" />
                Walch B2 Posterior Wear (-14.2°)
              </div>
              <div className="absolute bottom-6 right-2 bg-[#FFFFFF] border border-[#E2D9CB] rounded-full px-3 py-1.5 text-[11px] font-medium text-[#2B2723] shadow-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3F6B4A] inline-block" />
                Digital Twin Built · Review Suggested
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#5A534A] font-mono border-t border-[#E2D9CB]">
              <span>Confidence: 94.2%</span>
              <button onClick={() => setActiveStep('reconstruction')} className="text-[#B83C25] font-semibold hover:underline">
                View 3D Twin →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPPORTED INPUTS STRIP (Reference Styling) ── */}
      <section className="border-y border-[#DDD3C4] bg-[#EFE9DF] py-3.5 -mx-3 sm:-mx-6 px-4 overflow-x-auto">
        <div className="flex items-center justify-center gap-8 font-mono text-xs sm:text-sm text-[#4F483F] whitespace-nowrap min-w-max mx-auto">
          <span>DICOM CT</span><span className="text-[#B83C25] font-bold">/</span>
          <span>MRI</span><span className="text-[#B83C25] font-bold">/</span>
          <span>Plain Radiographs</span><span className="text-[#B83C25] font-bold">/</span>
          <span>Bone Density & Cysts</span><span className="text-[#B83C25] font-bold">/</span>
          <span>Range of Motion</span><span className="text-[#B83C25] font-bold">/</span>
          <span>Surgical History</span><span className="text-[#B83C25] font-bold">/</span>
          <span>Post-Op Deviation Matrix</span>
        </div>
      </section>

      {/* ── CLINICAL PRIORITISATION WORKLIST ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Explanation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="font-mono text-xs tracking-widest text-[#B83C25] font-semibold uppercase">
            PRIORITISATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2B2723] leading-tight tracking-tight">
            The list answers one question: who is next?
          </h2>
          <p className="text-[#5A534A] text-base leading-relaxed">
            Each case carries a priority, the finding that raised it, and the reasons in plain words.
            Reorder, override or dismiss; the clinician always has the last say.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveStep('triage')}
              className="btn btn-ghost"
            >
              <span>Examine full triage breakdown</span>
              <span className="arr">→</span>
            </button>
          </div>
        </div>

        {/* Right Worklist Card (Exact Reference Look & Feel) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex justify-between items-center px-3 py-2 font-mono text-xs text-[#6B635A] tracking-wider border-b border-[#EEE7DB]">
            <span>WORKLIST · SURGICAL QUEUE</span>
            <span>SORTED BY URGENCY SCORE</span>
          </div>

          {/* Active Case (Current Patient) */}
          <div
            onClick={() => setActiveStep('triage')}
            className="worklist-row flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FDF2EE] border border-[#F2CDC1] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#F6D8CF] text-[#8E2C18] text-xs font-bold font-mono">
                Urgent
              </span>
              <div>
                <h4 className="font-bold text-sm text-[#2B2723]">
                  {patient.patient_id} ({patient.name}) · Walch B2 Glenoid Deficit (23%)
                </h4>
                <p className="text-xs text-[#5A534A] mt-0.5 font-mono">
                  Waiting 2 days · CT Thin Slice · Retroversion -14.2°
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-24 h-2 rounded-full bg-[#F0E8DB] overflow-hidden">
                <div className="h-full bg-[#B83C25] rounded-full" style={{ width: `${triage.complexity_score}%` }} />
              </div>
              <span className="font-mono text-xs font-bold text-[#B83C25]">{triage.complexity_score}%</span>
            </div>
          </div>

          {/* Sample Queued Case 2 */}
          <div className="worklist-row flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-[#FAF9F5] border border-transparent hover:border-[#EEE7DB] transition">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#F6D8CF] text-[#8E2C18] text-xs font-bold font-mono">
                Urgent
              </span>
              <div>
                <h4 className="font-semibold text-sm text-[#2B2723]">
                  Case ORT-0412 · Possible full-thickness rotator cuff tear
                </h4>
                <p className="text-xs text-[#5A534A] mt-0.5 font-mono">
                  Waiting 3 days · MRI + Radiographs · Acromiohumeral &lt; 5mm
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-24 h-2 rounded-full bg-[#F0E8DB] overflow-hidden">
                <div className="h-full bg-[#B83C25] rounded-full" style={{ width: '84%' }} />
              </div>
              <span className="font-mono text-xs font-bold text-[#B83C25]">84%</span>
            </div>
          </div>

          {/* Sample Queued Case 3 */}
          <div className="worklist-row flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-[#FAF9F5] border border-transparent hover:border-[#EEE7DB] transition">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#F5E5C2] text-[#6F4600] text-xs font-bold font-mono">
                Soon
              </span>
              <div>
                <h4 className="font-semibold text-sm text-[#2B2723]">
                  Case ORT-0398 · Moderate glenohumeral osteoarthritis
                </h4>
                <p className="text-xs text-[#5A534A] mt-0.5 font-mono">
                  Waiting 6 days · CT + Range of Motion notes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-24 h-2 rounded-full bg-[#F0E8DB] overflow-hidden">
                <div className="h-full bg-[#C98A1B] rounded-full" style={{ width: '58%' }} />
              </div>
              <span className="font-mono text-xs font-bold text-[#C98A1B]">58%</span>
            </div>
          </div>

          {/* Sample Queued Case 4 */}
          <div className="worklist-row flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-[#FAF9F5] border border-transparent hover:border-[#EEE7DB] transition">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#DCE7D6] text-[#2B5236] text-xs font-bold font-mono">
                Routine
              </span>
              <div>
                <h4 className="font-semibold text-sm text-[#2B2723]">
                  Case ORT-0391 · Mild impingement / conservative therapy
                </h4>
                <p className="text-xs text-[#5A534A] mt-0.5 font-mono">
                  Waiting 9 days · Radiographs · Intact vault
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-24 h-2 rounded-full bg-[#F0E8DB] overflow-hidden">
                <div className="h-full bg-[#3F6B4A] rounded-full" style={{ width: '22%' }} />
              </div>
              <span className="font-mono text-xs font-bold text-[#3F6B4A]">22%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4-STEP PIPELINE: FROM SCAN TO SHORTLIST ── */}
      <section className="space-y-6 pt-4">
        <div>
          <div className="font-mono text-xs tracking-widest text-[#B83C25] font-semibold uppercase">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2B2723] tracking-tight mt-1">
            From scan to shortlist in four quiet steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stages.map((st) => (
            <div
              key={st.num}
              onClick={() => setActiveStep(st.id)}
              className="step-card flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFE6D6] flex items-center justify-center text-[#B83C25] font-bold font-mono text-base group-hover:bg-[#F2CDC1] transition">
                    {st.num}
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#3F6B4A] bg-[#DCE7D6] px-2.5 py-0.5 rounded-full">
                    {st.status}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-[#2B2723] mt-5 tracking-tight group-hover:text-[#B83C25] transition">
                  {st.title}
                </h3>
                <p className="text-[#5A534A] text-xs leading-relaxed mt-2">
                  {st.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#E4DCCF] flex items-center justify-between text-xs text-[#B83C25] font-semibold">
                <span>Open module</span>
                <span className="arr">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRINCIPLES SECTION (From Reference) ── */}
      <section className="bg-[#FAF9F5] border border-[#E2D9CB] rounded-3xl p-8 sm:p-10 space-y-6">
        <div>
          <div className="font-mono text-xs tracking-widest text-[#B83C25] font-semibold uppercase">
            PRINCIPLES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2723] tracking-tight mt-1">
            Built to support the surgeon, not to replace the judgement.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
          <div className="space-y-2">
            <div className="h-0.5 bg-[#D8CDBB] w-full" />
            <h4 className="font-bold text-base text-[#2B2723] pt-2">Vendor-neutral</h4>
            <p className="text-xs text-[#5A534A] leading-relaxed">
              Scans and records from any scanner or system can be used. Your planning does not depend on one manufacturer.
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-0.5 bg-[#D8CDBB] w-full" />
            <h4 className="font-bold text-base text-[#2B2723] pt-2">Findings you can inspect</h4>
            <p className="text-xs text-[#5A534A] leading-relaxed">
              Every flag points to the region of the image and the measurement behind it, so it can be agreed with, adjusted or dismissed.
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-0.5 bg-[#D8CDBB] w-full" />
            <h4 className="font-bold text-base text-[#2B2723] pt-2">The clinician decides</h4>
            <p className="text-xs text-[#5A534A] leading-relaxed">
              OrthoTwin suggests an order for review. It does not diagnose, and no finding is final until a clinician signs it off.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
