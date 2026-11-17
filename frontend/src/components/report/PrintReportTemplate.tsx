import React from 'react';
import { SurgicalReport } from '../../types';
import { ShieldAlert, CheckCircle2, Building2, Calendar, User, FileText, AlertTriangle, Stethoscope } from 'lucide-react';

interface PrintReportTemplateProps {
  report: SurgicalReport;
}

export const PrintReportTemplate: React.FC<PrintReportTemplateProps> = ({ report }) => {
  return (
    <div id="orthotwin-report-content" className="bg-[#FAF9F5] text-[#2B2723] p-6 sm:p-10 border border-[#E2D9CB] rounded-3xl space-y-6 shadow-sm">
      {/* Report Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9CB] pb-6">
        <div className="flex items-center gap-3.5">
          {/* Logo mark */}
          <svg width="40" height="40" viewBox="0 0 38 38" aria-hidden="true" className="shrink-0">
            <circle cx="17" cy="19" r="12" fill="#F2CDC1" stroke="#B83C25" strokeWidth="2"></circle>
            <path d="M24 5 L33 5 L33 14" fill="none" stroke="#2B2723" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path>
            <circle cx="17" cy="19" r="3.5" fill="#B83C25"></circle>
          </svg>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#2B2723] tracking-tight">OrthoTwin — Surgical & Prioritisation Report</h1>
            <p className="text-xs text-[#B83C25] font-mono font-bold">
              Patient-Specific Pre-Operative Digital Twin Assessment
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right font-mono text-xs text-[#6B635A]">
          <div>Report ID: <strong className="text-[#2B2723]">{report.report_id}</strong></div>
          <div>Generated: {report.generated_at}</div>
        </div>
      </div>

      {/* Patient & Surgical Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2D9CB] shadow-2xs">
          <span className="text-[10px] text-[#6B635A] uppercase font-mono block">Patient Name / ID</span>
          <strong className="text-[#2B2723] text-sm block mt-0.5">{report.patient.name}</strong>
          <span className="text-xs font-mono text-[#B83C25] font-semibold">{report.patient.patient_id}</span>
        </div>

        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2D9CB] shadow-2xs">
          <span className="text-[10px] text-[#6B635A] uppercase font-mono block">Demographics</span>
          <strong className="text-[#2B2723] text-sm block mt-0.5">{report.patient.age} Yrs / {report.patient.sex}</strong>
          <span className="text-xs text-[#5A534A] font-mono">Scan: {report.patient.scan_date}</span>
        </div>

        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2D9CB] shadow-2xs">
          <span className="text-[10px] text-[#6B635A] uppercase font-mono block">Surgical Procedure</span>
          <strong className="text-[#B83C25] text-xs block mt-0.5 font-bold">{report.patient.procedure}</strong>
          <span className="text-xs text-[#5A534A] font-mono">Shoulder Joint</span>
        </div>

        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2D9CB] shadow-2xs">
          <span className="text-[10px] text-[#6B635A] uppercase font-mono block">Clinical Institution</span>
          <strong className="text-[#2B2723] text-xs block mt-0.5">{report.patient.hospital}</strong>
          <span className="text-xs text-[#3F6B4A] font-mono font-semibold">CT Thin Slice Validated</span>
        </div>
      </div>

      {/* Structured Executive Summary */}
      <div className="bg-[#FFFFFF] border border-[#E2D9CB] p-5 rounded-2xl space-y-2 shadow-2xs">
        <h3 className="text-xs font-bold text-[#B83C25] uppercase font-mono tracking-wider flex items-center gap-2">
          <FileText size={15} /> Executive Clinical Summary
        </h3>
        <p className="text-[#5A534A] text-xs sm:text-sm leading-relaxed font-sans">
          {report.summary}
        </p>
      </div>

      {/* ── AI Clinical Triage Section ── */}
      {report.triage && (
        <div className="bg-[#FDF2EE] border border-[#F2CDC1] p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#8E2C18] uppercase font-mono tracking-wider flex items-center gap-2">
              <Stethoscope size={15} /> AI Disease Detection & Clinical Prioritisation
            </h3>
            <span className="text-xs font-mono font-bold px-3 py-0.5 rounded-full bg-[#F6D8CF] text-[#8E2C18] border border-[#E59A85] flex items-center gap-1">
              <AlertTriangle size={12} /> {report.triage.triage_priority} — Complexity {report.triage.complexity_score}/100
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E2D9CB]">
              <span className="text-[#6B635A] block text-[10px]">Triage Priority</span>
              <span className="text-[#8E2C18] font-bold text-sm">{report.triage.triage_priority}</span>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E2D9CB]">
              <span className="text-[#6B635A] block text-[10px]">Consult Timeframe</span>
              <span className="text-[#2B2723] font-mono font-bold text-sm">{report.triage.time_to_consult}</span>
            </div>
            <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E2D9CB]">
              <span className="text-[#6B635A] block text-[10px]">Flagged Pathologies</span>
              <span className="text-[#B83C25] font-mono font-bold text-sm">
                {report.triage.disease_signs.filter(s => s.flaggedForReview).length} of {report.triage.disease_signs.length}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {report.triage.disease_signs.filter(s => s.flaggedForReview).map(sign => (
              <div key={sign.id} className="flex items-start gap-2.5 bg-[#FFFFFF] border border-[#E2D9CB] p-3 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 bg-[#B83C25]" />
                <div className="flex-1">
                  <span className="text-[#2B2723] font-bold">{sign.name}</span>
                  {sign.walchClass && <span className="ml-2 text-[#6F4600] font-mono font-bold text-[11px]">({sign.walchClass})</span>}
                  <span className="ml-2 text-[#D8CDBB]">—</span>
                  <span className="ml-1 text-[#5A534A] font-semibold">{sign.value}</span>
                  <div className="text-[#6B635A] text-[11px] mt-0.5 font-mono">{sign.clinicalNote}</div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F6D8CF] text-[#8E2C18] border border-[#E59A85]">
                  {sign.severity}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[#5A534A] text-xs font-mono leading-relaxed bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E2D9CB]">
            {report.triage.ai_summary}
          </p>
        </div>
      )}

      {/* 2-Column Section: Anatomical Analysis & Implant Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Anatomical Measurements */}
        <div className="bg-[#FFFFFF] border border-[#E2D9CB] p-5 rounded-2xl space-y-3 shadow-2xs">
          <h3 className="text-xs font-bold text-[#2B2723] uppercase font-mono tracking-wider border-b border-[#EEE7DB] pb-2">
            Anatomical Analysis
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
              <span className="text-[#6B635A] block text-[10px]">Glenoid Inclination</span>
              <span className="text-[#2B2723] font-mono font-bold text-base">{report.measurements.glenoid_inclination}°</span>
            </div>
            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
              <span className="text-[#6B635A] block text-[10px]">Glenoid Version</span>
              <span className="text-[#2B2723] font-mono font-bold text-base">{report.measurements.glenoid_version}°</span>
            </div>
            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
              <span className="text-[#6B635A] block text-[10px]">Humeral Head Diam</span>
              <span className="text-[#2B2723] font-mono font-bold text-base">{report.measurements.humeral_head_diameter} mm</span>
            </div>
            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
              <span className="text-[#6B635A] block text-[10px]">Humeral Offset</span>
              <span className="text-[#2B2723] font-mono font-bold text-base">{report.measurements.humeral_offset} mm</span>
            </div>
          </div>
        </div>

        {/* Implant Planning Specifications */}
        <div className="bg-[#FFFFFF] border border-[#E2D9CB] p-5 rounded-2xl space-y-3 shadow-2xs">
          <h3 className="text-xs font-bold text-[#2B2723] uppercase font-mono tracking-wider border-b border-[#EEE7DB] pb-2">
            Confirmed Implant Placement
          </h3>
          <div className="space-y-2 text-xs">
            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB] flex justify-between">
              <span className="text-[#5A534A]">Selected System</span>
              <span className="text-[#B83C25] font-bold">{report.implant.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E2D9CB]">
                <span className="text-[#6B635A] block text-[10px]">Glenosphere</span>
                <span className="text-[#2B2723] font-mono font-bold text-xs">{report.planned_pose.glenosphere_size_mm} mm</span>
              </div>
              <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E2D9CB]">
                <span className="text-[#6B635A] block text-[10px]">Target Incl</span>
                <span className="text-[#2B2723] font-mono font-bold text-xs">{report.planned_pose.inclination_deg}°</span>
              </div>
              <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E2D9CB]">
                <span className="text-[#6B635A] block text-[10px]">Target Vers</span>
                <span className="text-[#2B2723] font-mono font-bold text-xs">{report.planned_pose.version_deg}°</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kinematic Simulation Results */}
      <div className="bg-[#FFFFFF] border border-[#E2D9CB] p-5 rounded-2xl space-y-3 shadow-2xs">
        <h3 className="text-xs font-bold text-[#2B2723] uppercase font-mono tracking-wider border-b border-[#EEE7DB] pb-2">
          Biomechanical Simulation Outcomes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
            <span className="text-[#6B635A] block text-[10px]">Max Abduction</span>
            <span className="text-[#2B2723] font-mono font-bold text-base">{report.simulation.max_abduction}°</span>
          </div>
          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
            <span className="text-[#6B635A] block text-[10px]">Notch Clearance</span>
            <span className="text-[#2B2723] font-mono font-bold text-base">{report.simulation.scapular_notch_clearance_mm} mm</span>
          </div>
          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
            <span className="text-[#6B635A] block text-[10px]">Impingement Risk</span>
            <span className="text-[#3F6B4A] font-bold text-xs">{report.simulation.impingement_status}</span>
          </div>
          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2D9CB]">
            <span className="text-[#6B635A] block text-[10px]">Stability Score</span>
            <span className="text-[#3F6B4A] font-mono font-bold text-base">{report.simulation.joint_stability_score}%</span>
          </div>
        </div>
      </div>

      {/* Regulatory & Research Disclaimer */}
      <div className="bg-[#FAF9F5] border border-[#E2D9CB] p-4 rounded-2xl text-xs flex items-start gap-3">
        <ShieldAlert size={18} className="text-[#B83C25] shrink-0 mt-0.5" />
        <p className="text-[#6B635A] font-mono text-[11px] leading-relaxed">
          {report.disclaimer}
        </p>
      </div>
    </div>
  );
};
