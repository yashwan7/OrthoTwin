import React, { useState, useRef, useCallback } from 'react';
import { useOrthoTwin } from '../../context/OrthoTwinContext';
import { SliceViewer2D } from './SliceViewer2D';
import {
  UploadCloud, FileCheck, Play, FolderPlus, ArrowRight,
  CheckCircle2, X, FileImage, AlertCircle, Eye, Activity, ShieldAlert, Sparkles, Layers
} from 'lucide-react';
import { predictMedicalImage } from '../../services/api';

interface UploadedFile {
  fileObj?: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string | null;
}

const ACCEPTED = '.dcm,.nii,.zip,.png,.jpg,.jpeg,.tiff,.tif,.nii.gz';

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isImageType = (file: File) =>
  file.type.startsWith('image/') ||
  /\.(png|jpg|jpeg|tiff?|bmp)$/i.test(file.name);

export const CTUploadView: React.FC = () => {
  const { setActiveStep, loadDemoPatient, ctUploaded, setCtUploaded } = useOrthoTwin();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mlResult, setMlResult] = useState<any | null>(null);
  const [activeCamTab, setActiveCamTab] = useState<'overlay' | 'heatmap' | 'original'>('overlay');
  const [dragActive, setDragActive]     = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [previewFile, setPreviewFile]   = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── File ingestion ─────────────────────────────────────────────────── */
  const ingestFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const processed: UploadedFile[] = arr.map(f => ({
      fileObj: f,
      name: f.name,
      size: f.size,
      type: f.type,
      previewUrl: isImageType(f) ? URL.createObjectURL(f) : null,
    }));
    setUploadedFiles(prev => {
      prev.forEach(p => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
      return processed;
    });
    if (processed.length > 0 && processed[0].previewUrl) {
      setPreviewFile(processed[0]);
    }
    setCtUploaded(true);
  }, [setCtUploaded]);

  /* ── Drag handlers ──────────────────────────────────────────────────── */
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = ()                   => setDragActive(false);
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false);
    if (e.dataTransfer.files.length) ingestFiles(e.dataTransfer.files);
  };

  /* ── Input handler ──────────────────────────────────────────────────── */
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) ingestFiles(e.target.files);
  };

  /* ── Remove a file ──────────────────────────────────────────────────── */
  const removeFile = (name: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => {
        if (f.name === name && f.previewUrl) URL.revokeObjectURL(f.previewUrl);
        return f.name !== name;
      });
      if (updated.length === 0) setCtUploaded(false);
      return updated;
    });
    if (previewFile?.name === name) setPreviewFile(null);
  };

  /* ── Processing ─────────────────────────────────────────────────────── */
  const handleStartProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); setActiveStep('segmentation'); }, 1200);
  };

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const file = previewFile?.fileObj || (uploadedFiles[0]?.fileObj as File) || new File(["dummy"], "scan.png", { type: "image/png" });
      const res = await predictMedicalImage(file);
      setMlResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileIcon = (f: UploadedFile) => {
    if (f.previewUrl) return <img src={f.previewUrl} alt={f.name} className="w-9 h-9 rounded-lg object-cover border border-[#E2D9CB]" />;
    return <FileImage size={20} className="text-[#6B635A]" />;
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-10">
      {/* Header */}
      <div>
        <div className="font-mono text-xs tracking-widest text-[#B83C25] font-semibold uppercase mb-1">
          STEP 01 · IMAGING INGESTION
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2723] tracking-tight">
          Upload Patient CT & Medical Imaging Data
        </h2>
        <p className="text-[#5A534A] text-xs sm:text-sm mt-0.5">
          Upload DICOM series, NIfTI volumes, ZIP archives, or standard radiographs to initiate
          patient-specific 3D shoulder reconstruction and AI disease analysis.
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── LEFT: Upload Zone + File List (6 cols) ─────────────────────── */}
        <div className="lg:col-span-6 space-y-4">

          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED}
            className="hidden"
            onChange={onFileInputChange}
          />

          {/* Drop Zone (Bone & Vermilion) */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[220px] cursor-pointer select-none shadow-xs ${
              dragActive
                ? 'border-[#B83C25] bg-[#FDF2EE] scale-[1.01]'
                : ctUploaded && uploadedFiles.length > 0
                ? 'border-[#B83C25]/60 bg-[#FFFFFF] hover:border-[#B83C25]'
                : 'border-[#D8CDBB] bg-[#FFFFFF] hover:border-[#B83C25] hover:bg-[#FAF9F5]'
            }`}
          >
            {ctUploaded && uploadedFiles.length > 0 ? (
              <div className="space-y-2 pointer-events-none">
                <div className="w-14 h-14 rounded-2xl bg-[#DCE7D6] border border-[#BED2B5] flex items-center justify-center text-[#2B5236] mx-auto shadow-sm">
                  <FileCheck size={26} />
                </div>
                <p className="text-[#2B2723] font-bold text-base">{uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} loaded</p>
                <p className="text-[#6B635A] text-xs">Click or drag additional slices to expand series</p>
              </div>
            ) : (
              <div className="space-y-3 pointer-events-none">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto transition-colors ${
                  dragActive ? 'bg-[#F6D8CF] border-[#E59A85] text-[#8E2C18]' : 'bg-[#EFE6D6] border-[#D8CDBB] text-[#B83C25]'
                }`}>
                  <UploadCloud size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-[#2B2723] text-base">
                    {dragActive ? 'Drop medical imaging files here…' : 'Drag & Drop or Click to Browse'}
                  </h3>
                  <p className="text-[#6B635A] text-xs mt-1 font-mono">
                    .dcm · .nii · .nii.gz · .zip · .png · .jpg · .tiff (up to 500 MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Uploaded File List */}
          {uploadedFiles.length > 0 && (
            <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAF9F5] border-b border-[#E2D9CB]">
                <span className="text-xs font-bold text-[#2B2723] flex items-center gap-2 font-mono">
                  <CheckCircle2 size={13} className="text-[#3F6B4A]" />
                  Uploaded Studies ({uploadedFiles.length})
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setUploadedFiles([]); setCtUploaded(false); setPreviewFile(null); }}
                  className="text-[11px] text-[#8E2C18] hover:underline font-mono font-semibold"
                >
                  Clear all
                </button>
              </div>
              <ul className="max-h-52 overflow-y-auto divide-y divide-[#EEE7DB]">
                {uploadedFiles.map(f => (
                  <li key={f.name} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAF9F5] transition group">
                    {fileIcon(f)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#2B2723] truncate font-semibold">{f.name}</p>
                      <p className="text-[10px] text-[#6B635A] font-mono">{formatBytes(f.size)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                      {f.previewUrl && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setPreviewFile(f); }}
                          className="p-1 rounded-lg hover:bg-[#ECE6DB] text-[#5A534A] hover:text-[#B83C25]"
                          title="Preview Image"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(f.name); }}
                        className="p-1 rounded-lg hover:bg-[#F6D8CF] text-[#8E2C18]"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Demo Dataset Action */}
          <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div>
              <span className="font-bold text-[#2B2723] text-xs block">Need a test dataset?</span>
              <span className="text-[#5A534A] text-[11px]">Load synthetic 240-slice shoulder CT study instantly</span>
            </div>
            <button
              onClick={loadDemoPatient}
              className="btn btn-ghost text-xs"
            >
              <FolderPlus size={14} />
              <span>Load Demo CT</span>
            </button>
          </div>

          {/* Action Buttons: AI Prioritization & Segmentation */}
          <div className="space-y-2.5">
            <button
              disabled={!ctUploaded || isAnalyzing}
              onClick={handleRunAIAnalysis}
              className="w-full btn btn-primary py-3 text-sm shadow-md disabled:opacity-40 disabled:cursor-not-allowed bg-[#B83C25] hover:bg-[#A3341F] text-white flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Deep Residual Network & Grad-CAM…</span>
                </>
              ) : (
                <>
                  <Activity size={16} />
                  <span>Run AI Disease Analysis & Prioritisation</span>
                  <span className="arr">→</span>
                </>
              )}
            </button>

            <button
              disabled={!ctUploaded || isProcessing}
              onClick={handleStartProcessing}
              className="w-full btn btn-ghost py-2.5 text-xs border border-[#D8CDBB] bg-[#FFFFFF] hover:bg-[#FAF9F5] text-[#2B2723] flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#2B2723] border-t-transparent rounded-full animate-spin" />
                  <span>Reconstructing 3D Shoulder…</span>
                </>
              ) : (
                <>
                  <Layers size={14} className="text-[#3F6B4A]" />
                  <span>Proceed to 3D Digital Twin & Surgical Planning</span>
                  <span className="arr">→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Image Preview, Grad-CAM, or 2D Slice Viewer (6 cols) ─── */}
        <div className="lg:col-span-6 space-y-4">
          {mlResult ? (
            <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl overflow-hidden shadow-sm p-5 space-y-4">
              {/* Prioritization Banner */}
              <div
                className="p-4 rounded-2xl border flex items-start justify-between gap-4"
                style={{
                  backgroundColor: mlResult.priority === 'HIGH PRIORITY' ? '#FDF2EE' : '#FEF9EE',
                  borderColor: mlResult.priority_color || '#B83C25'
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="live w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mlResult.priority_color }} />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: mlResult.priority_color }}>
                      {mlResult.priority} · {mlResult.confidence_score}% CONFIDENCE
                    </span>
                  </div>
                  <p className="text-xs text-[#2B2723] font-medium leading-relaxed">
                    {mlResult.priority_reason}
                  </p>
                </div>
                <button
                  onClick={() => setActiveStep('triage')}
                  className="btn btn-ghost text-xs px-3 py-1.5 shrink-0 bg-[#FFFFFF] border border-[#D8CDBB] hover:border-[#B83C25]"
                >
                  View Worklist →
                </button>
              </div>

              {/* Grad-CAM Explainability Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2B2723]">
                    <Sparkles size={14} className="text-[#B83C25]" />
                    <span>Grad-CAM Explainable AI Attention ({mlResult.top_finding?.class_name})</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#ECE6DB] p-0.5 rounded-lg text-[10px] font-mono">
                    <button
                      onClick={() => setActiveCamTab('overlay')}
                      className={`px-2 py-0.5 rounded-md transition ${activeCamTab === 'overlay' ? 'bg-[#FFFFFF] text-[#2B2723] font-bold shadow-xs' : 'text-[#6B635A]'}`}
                    >
                      Overlay
                    </button>
                    <button
                      onClick={() => setActiveCamTab('heatmap')}
                      className={`px-2 py-0.5 rounded-md transition ${activeCamTab === 'heatmap' ? 'bg-[#FFFFFF] text-[#2B2723] font-bold shadow-xs' : 'text-[#6B635A]'}`}
                    >
                      Heatmap
                    </button>
                    <button
                      onClick={() => setActiveCamTab('original')}
                      className={`px-2 py-0.5 rounded-md transition ${activeCamTab === 'original' ? 'bg-[#FFFFFF] text-[#2B2723] font-bold shadow-xs' : 'text-[#6B635A]'}`}
                    >
                      Original
                    </button>
                  </div>
                </div>

                {/* Visualizer Frame */}
                <div className="relative rounded-2xl overflow-hidden bg-[#2B2723] aspect-[4/3] flex items-center justify-center border border-[#E2D9CB]">
                  {mlResult.gradcam?.overlay_base64 && activeCamTab === 'overlay' ? (
                    <img src={mlResult.gradcam.overlay_base64} alt="Grad-CAM Overlay" className="w-full h-full object-contain" />
                  ) : mlResult.gradcam?.heatmap_base64 && activeCamTab === 'heatmap' ? (
                    <img src={mlResult.gradcam.heatmap_base64} alt="Attention Heatmap" className="w-full h-full object-contain" />
                  ) : previewFile?.previewUrl ? (
                    <img src={previewFile.previewUrl} alt="Original Scan" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center p-6 text-[#A89F91]">
                      <Activity size={32} className="mx-auto mb-2 text-[#B83C25]" />
                      <p className="text-xs font-mono">Simulated ResNet-14 Feature Heatmap Overlay</p>
                    </div>
                  )}

                  {/* Gradient Legend */}
                  <div className="absolute bottom-2 left-2 bg-[#2B2723]/80 backdrop-blur-sm border border-[#5A534A] px-2.5 py-1 rounded-lg flex items-center gap-2 text-[10px] font-mono text-[#F6F3EE]">
                    <span>Low Focus</span>
                    <div className="w-16 h-2 rounded-full bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600" />
                    <span>High Activation</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#6B635A] font-mono italic">
                  * Heatmap shows model attention gradients on Layer 4 residual features, not confirmed pathological margins.
                </p>
              </div>

              {/* Detected Probabilities Grid */}
              <div>
                <div className="text-xs font-mono font-bold text-[#2B2723] mb-2 flex items-center justify-between">
                  <span>Thoracic Findings (14 NIH Categories)</span>
                  <span className="text-[10px] text-[#6B635A]">ROC-AUC 0.7576</span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {mlResult.predictions?.slice(0, 6).map((p: any) => (
                    <div key={p.class_name} className="p-2 rounded-xl bg-[#FAF9F5] border border-[#E2D9CB] flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-[#2B2723] truncate">{p.class_name}</span>
                        <span className="font-mono text-[10px] font-bold" style={{ color: p.detected ? '#B83C25' : '#5A534A' }}>
                          {p.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E2D9CB] h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, p.percentage)}%`,
                            backgroundColor: p.severity_tier === 'HIGH' ? '#B83C25' : '#C98A1B'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : previewFile?.previewUrl ? (
            <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-3 bg-[#FAF9F5] border-b border-[#E2D9CB]">
                <span className="text-xs font-bold text-[#2B2723] flex items-center gap-2 font-mono">
                  <Eye size={14} className="text-[#B83C25]" /> Study Preview — {previewFile.name}
                </span>
                <button onClick={() => setPreviewFile(null)} className="text-[#6B635A] hover:text-[#2B2723] transition">
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center justify-center bg-[#ECE6DB] min-h-[340px] p-4">
                <img
                  src={previewFile.previewUrl}
                  alt={previewFile.name}
                  className="max-h-[380px] max-w-full object-contain rounded-xl shadow-md"
                />
              </div>
              <div className="px-5 py-2.5 bg-[#FAF9F5] border-t border-[#E2D9CB] flex items-center gap-4 text-xs font-mono text-[#5A534A]">
                <span>File: {previewFile.name}</span>
                <span>·</span>
                <span>Size: {formatBytes(previewFile.size)}</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E2D9CB] rounded-3xl p-5 shadow-sm">
              <SliceViewer2D />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
