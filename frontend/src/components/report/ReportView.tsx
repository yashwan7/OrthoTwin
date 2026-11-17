import React from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { PrintReportTemplate } from './PrintReportTemplate';
import { Download, Printer, FileText, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const ReportView: React.FC = () => {
  const { generateReportData } = useOrthoTwin();
  const report = generateReportData();

  const handleExportPDF = async () => {
    const element = document.getElementById('orthotwin-report-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#FAF9F5' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`OrthoTwin_Surgical_Report_${report.patient.patient_id}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `OrthoTwin_Plan_${report.patient.patient_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E2D9CB] p-5 sm:p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2B2723] tracking-tight flex items-center gap-2">
            <FileText size={22} className="text-[#B83C25] shrink-0" /> Surgical Digital Twin & Prioritisation Report
          </h2>
          <p className="text-[#5A534A] text-xs sm:text-sm mt-0.5">
            Structured clinical decision-support document in PDF, JSON, or printable clinical template format.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadJSON}
            className="btn btn-ghost text-xs"
          >
            <Download size={14} />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn btn-ghost text-xs"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="btn btn-primary text-xs shadow-md"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Embedded Printable Report Component */}
      <PrintReportTemplate report={report} />
    </div>
  );
};
