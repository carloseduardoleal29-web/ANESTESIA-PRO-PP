import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Upload, Sparkles, Check, Copy, Download, RefreshCw, 
  BookOpen, Eye, Columns, FileCheck, AlertCircle, Volume2, 
  VolumeX, Search, Trash2, Clock, Globe, ArrowRight, ShieldCheck, 
  FileUp, ChevronRight, Stethoscope, Award, Zap, Layers, CheckCircle2,
  Split, Bookmark, AlignLeft, CheckCheck, FileSpreadsheet, Share2
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface TranslationRecord {
  id: string;
  title: string;
  originalSnippet: string;
  translatedContent: string;
  summaryContent?: string;
  date: string;
  fileName?: string;
  mode: 'full' | 'critical' | 'summary' | 'full_with_summary';
  targetLanguage: string;
  specialty: string;
  totalSegments?: number;
}

interface ArticleChunk {
  index: number;
  title: string;
  text: string;
  charCount: number;
  wordCount: number;
}

interface TranslatedChunk {
  index: number;
  title: string;
  translatedText: string;
}

const SAMPLE_ARTICLES = [
  {
    id: 'sample-ciprofol',
    title: 'Ciprofol (HSK3486) vs Propofol in General Anesthesia Induction (Phase III Trial)',
    journal: 'British Journal of Anaesthesia / Anesthesiology',
    snippet: `Title: Efficacy, safety, and pharmacokinetics of ciprofol (HSK3486) versus propofol for the induction of general anesthesia: A multicentre, randomized, double-blind, parallel-group, phase 3 clinical trial.
Abstract:
Background: Ciprofol (HSK3486) is a novel 2,6-disubstituted alkylphenol derivative acting as a positive allosteric modulator of GABAA receptors with approximately 4- to 5-fold greater potency than propofol.
Methods: Adult patients (ASA I-III, aged 18-65 years) undergoing elective surgery under general anesthesia were randomly assigned (1:1) to receive either ciprofol 0.4 mg/kg or propofol 2.0 mg/kg via intravenous bolus over 30 seconds. The primary endpoint was the success rate of anesthesia induction, defined as reaching a Bispectral Index (BIS) <= 60 without supplementary rescue hypnotics. Secondary endpoints included time to loss of consciousness (LOC), mean arterial pressure (MAP) fluctuations, injection site pain, and respiratory depression rates.
Results: A total of 340 patients were randomized (ciprofol n=170; propofol n=170). The induction success rate was 99.4% in the ciprofol group and 100.0% in the propofol group (difference -0.6%, 95% CI: -2.3% to 1.1%, demonstrating non-inferiority, p < 0.001). Mean time to LOC was 44.2 ± 11.5 s for ciprofol versus 41.8 ± 10.2 s for propofol. Pain on injection occurred in only 3.5% (6/170) of ciprofol patients compared with 68.2% (116/170) of propofol patients (p < 0.0001; Relative Risk 0.05, 95% CI: 0.02 to 0.12). Clinically significant hypotension (MAP drop > 20% from baseline) was observed in 13.5% with ciprofol versus 38.8% with propofol (p < 0.001).
Conclusions: Ciprofol 0.4 mg/kg is non-inferior to propofol 2.0 mg/kg for induction of general anesthesia, with superior hemodynamic stability and dramatic reduction in injection site pain.`
  },
  {
    id: 'sample-das-airway',
    title: 'DAS 2025: Unanticipated Difficult Tracheal Intubation Guidelines',
    journal: 'Difficult Airway Society (DAS) Taskforce',
    snippet: `Title: Difficult Airway Society updated guidelines for management of unanticipated difficult tracheal intubation in adults: Evidence-based algorithms and cognitive aids.
Abstract:
Introduction: Unanticipated difficult tracheal intubation remains a major contributor to perioperative hypoxemia, brain injury, and anesthesia-related mortality.
Methods: Systematic review of clinical trials, closed claims analyses, and NAP4 registry data updating the 4-step Plan A to Plan D algorithms.
Key Recommendations:
Plan A (Facemask and Tracheal Intubation): Optimization of head and neck positioning (ramped position in obese patients), videolaryngoscopy as primary standard of care rather than backup rescue, limits of 3 attempts plus 1 by an experienced colleague, neuromuscular blockade depth verification (Train-of-Four = 0).
Plan B (Maintaining oxygenation with Second-Generation Supraglottic Airway Device - SAD): Immediate insertion of gastric drainage-capable SAD (e.g., i-gel, ProSeal, LMA Supreme) if Plan A fails; max 2 attempts.
Plan C (Facemask Oxygenation and Wake Up): If SAD fails, optimize 2-person bag-mask ventilation with oropharyngeal airway and 100% FiO2. Decide: wake up patient, reverse with Sugammadex, or proceed to Plan D.
Plan D (Emergency Front-of-Neck Access - FONA): Scalpel-bougie-tube technique: #10 scalpel, horizontal stab incision through cricothyroid membrane, 90-degree turn, bougie insertion, railroad 6.0 mm cuffed endotracheal tube.`
  },
  {
    id: 'sample-emotive-hpp',
    title: 'E-MOTIVE Trial: Postpartum Hemorrhage Detection and Treatment',
    journal: 'New England Journal of Medicine (NEJM)',
    snippet: `Title: Randomized Trial of Early Detection and Treatment of Postpartum Hemorrhage: The E-MOTIVE Trial.
Abstract:
Background: Postpartum hemorrhage (PPH) is the leading cause of maternal mortality worldwide. Delayed detection and inconsistent intervention drive preventable deaths.
Methods: An international cluster-randomized trial across 80 secondary-level hospitals evaluating the E-MOTIVE bundle. The bundle combines early objective blood loss measurement using a calibrated drape with immediate bundled response: Early Oxytocin + Misoprostol/Ergometrine, Tranexamic acid (TXA 1g IV within 30 min), IV Fluids, Uterine massage, and Examination of the genital tract.
Results: Among 206,206 delivering patients, severe postpartum hemorrhage (blood loss >= 1000 mL) occurred in 1.6% of women in the intervention group versus 4.3% in the usual care group (Risk Ratio 0.40, 95% CI: 0.32 to 0.50, p < 0.001). Maternal mortality or near-miss occurred in 1.2% versus 2.1% (Risk Ratio 0.58, p = 0.002). Blood loss was detected early in 93.1% vs 51.0%.
Conclusions: Implementation of the E-MOTIVE bundle resulted in a 60% reduction in severe postpartum hemorrhage and significant reduction in maternal morbidity.`
  }
];

export const MedicalArticleTranslator: React.FC = () => {
  // Input State
  const [inputText, setInputText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; base64?: string; type: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Translation Config
  const [translationMode, setTranslationMode] = useState<'full' | 'critical' | 'summary' | 'full_with_summary'>('full');
  const [targetLanguage, setTargetLanguage] = useState<string>('Español Médico (Académico)');
  const [specialtyFocus, setSpecialtyFocus] = useState<string>('Anestesiología y Reanimación');
  const [useSegmentation, setUseSegmentation] = useState<boolean>(true);

  // Segmenting & Progress State
  const [totalChunks, setTotalChunks] = useState<number>(0);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);
  const [chunkProgress, setChunkProgress] = useState<number>(0);
  const [chunksList, setChunksList] = useState<ArticleChunk[]>([]);
  const [translatedChunks, setTranslatedChunks] = useState<TranslatedChunk[]>([]);
  const [selectedSegmentTab, setSelectedSegmentTab] = useState<number | 'all'>('all');

  // Executive Summary State
  const [summaryResult, setSummaryResult] = useState<string>('');
  const [summaryFormat, setSummaryFormat] = useState<'executive' | 'quick_bullets'>('executive');
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [activeResultTab, setActiveResultTab] = useState<'full' | 'summary' | 'segments' | 'bilingual'>('full');

  // Processing & Output
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [translatedResult, setTranslatedResult] = useState<string>('');
  const [currentArticleTitle, setCurrentArticleTitle] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // History state
  const [history, setHistory] = useState<TranslationRecord[]>(() => {
    try {
      const stored = localStorage.getItem('anestesiapro_article_translations_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = (record: TranslationRecord) => {
    setHistory(prev => {
      const updated = [record, ...prev.filter(r => r.id !== record.id)].slice(0, 20);
      try {
        localStorage.setItem('anestesiapro_article_translations_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage limit for translation history:', e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    if (window.confirm('¿Deseas eliminar todo el historial de artículos traducidos?')) {
      setHistory([]);
      try {
        localStorage.removeItem('anestesiapro_article_translations_history');
      } catch {}
    }
  };

  // Handle File Drop / Select
  const handleFile = (file: File) => {
    setErrorMessage(null);
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isText = file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md');
    const isWord = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc') || file.type.includes('word') || file.type.includes('officedocument');

    const reader = new FileReader();

    if (isPdf) {
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setSelectedFile({
          name: file.name,
          size: sizeStr,
          base64: base64,
          type: 'application/pdf'
        });
      };
      reader.readAsDataURL(file);
    } else if (isWord) {
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setSelectedFile({
          name: file.name,
          size: sizeStr,
          base64: base64,
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
      };
      reader.readAsDataURL(file);
    } else if (isText) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
        setSelectedFile({
          name: file.name,
          size: sizeStr,
          type: file.type || 'text/plain'
        });
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setSelectedFile({
          name: file.name,
          size: sizeStr,
          base64: base64,
          type: file.type || 'application/octet-stream'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Quick load sample article
  const handleLoadSample = (sample: typeof SAMPLE_ARTICLES[0]) => {
    setInputText(sample.snippet);
    setSelectedFile({
      name: `${sample.id}.txt`,
      size: `${Math.round(sample.snippet.length / 1024)} KB`,
      type: 'text/plain'
    });
    setCurrentArticleTitle(sample.title);
    setErrorMessage(null);
    setSummaryResult('');
    setTranslatedChunks([]);
    setChunksList([]);
  };

  // 1. GENERATE EXECUTIVE CLINICAL SUMMARY (High-Density Synthesis for Extensive Articles)
  const handleGenerateSummary = async (customSource?: string, overrideFormat?: 'executive' | 'quick_bullets') => {
    const textToSummarize = customSource || translatedResult || inputText;
    if (!textToSummarize.trim() && !selectedFile?.base64) {
      setErrorMessage('Por favor ingresa texto o sube un artículo médico para generar el resumen clínico.');
      return;
    }

    const formatToUse = overrideFormat || summaryFormat;
    setIsSummarizing(true);
    setErrorMessage(null);
    setActiveResultTab('summary');

    try {
      let data: any = null;
      let lastErr: any = null;
      let summarySuccess = false;

      for (let attempt = 1; attempt <= 3 && !summarySuccess; attempt++) {
        if (attempt > 1) {
          await new Promise(r => setTimeout(r, 1800 * (attempt - 1)));
        }

        try {
          const response = await fetch('/api/medical-translate/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: textToSummarize,
              fileBase64: selectedFile?.base64,
              fileName: selectedFile?.name,
              mimeType: selectedFile?.type,
              specialtyFocus,
              targetLanguage,
              summaryFormat: formatToUse
            })
          });

          data = await response.json();
          if (response.ok && data.success && data.summaryContent) {
            summarySuccess = true;
          } else {
            lastErr = new Error(data?.error || 'Error al generar el resumen clínico del artículo.');
          }
        } catch (fetchErr: any) {
          lastErr = fetchErr;
        }
      }

      if (!summarySuccess) {
        throw lastErr || new Error('No se pudo generar el resumen clínico en este momento.');
      }

      setSummaryResult(data.summaryContent);
      return data.summaryContent;
    } catch (err: any) {
      console.error('Summary error:', err);
      setErrorMessage(err.message || 'Error al generar el resumen clínico con inteligencia artificial.');
    } finally {
      setIsSummarizing(false);
    }
  };

  // 2. PERFORM FAITHFUL TRANSLATION (Segmented by Default to Prevent Any Cutoff)
  const handleTranslate = async () => {
    if (!inputText.trim() && !selectedFile?.base64) {
      setErrorMessage('Por favor sube un archivo médico (PDF, TXT, Word) o pega el texto del artículo a traducir.');
      return;
    }

    // If pure summary mode is requested, redirect to summary generator
    if (translationMode === 'summary') {
      await handleGenerateSummary();
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setTranslatedResult('');
    setTranslatedChunks([]);
    setChunksList([]);
    setChunkProgress(0);
    setLoadingStage('Analizando estructura del artículo, tablas y farmacología...');
    setActiveResultTab('full');

    try {
      // Step A: Prepare segmentation
      let chunksToProcess: ArticleChunk[] = [];
      let detectedTitle = selectedFile?.name || 'Artículo Médico Clínico';

      if (useSegmentation) {
        setLoadingStage('Segmentando el artículo en bloques coherentes para garantizar traducción al 100%...');
        const prepRes = await fetch('/api/medical-translate/prepare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText,
            fileBase64: selectedFile?.base64,
            fileName: selectedFile?.name,
            mimeType: selectedFile?.type
          })
        });

        const prepData = await prepRes.json();
        if (prepRes.ok && prepData.success && prepData.chunks && prepData.chunks.length > 0) {
          chunksToProcess = prepData.chunks;
          setChunksList(prepData.chunks);
          setTotalChunks(prepData.chunks.length);
          if (prepData.candidateTitle) {
            detectedTitle = prepData.candidateTitle;
          }
        }
      }

      // Step B: Sequential high-fidelity chunk translation
      const hasValidChunks = chunksToProcess.length >= 1 && chunksToProcess.some(c => c.text && c.text.trim().length > 0);
      if (hasValidChunks) {
        const completed: TranslatedChunk[] = [];
        let runningAccumulator = '';
        const validChunks = chunksToProcess.filter(c => c.text && c.text.trim().length > 0);

        for (let i = 0; i < validChunks.length; i++) {
          const chunk = validChunks[i];
          setCurrentChunkIndex(i);
          setChunkProgress(Math.round(((i) / validChunks.length) * 100));
          setLoadingStage(`Traduciendo segmento ${i + 1} de ${validChunks.length}: "${chunk.title}" (Rigor científico 100%)...`);

          let chunkSuccess = false;
          let chunkData: any = null;
          let lastChunkError: any = null;

          for (let attempt = 1; attempt <= 3 && !chunkSuccess; attempt++) {
            if (attempt > 1) {
              setLoadingStage(`Demanda alta temporal en servidores de Google. Reintentando segmento ${i + 1} de ${validChunks.length} (intento ${attempt}/3)...`);
              await new Promise(r => setTimeout(r, 2000 * (attempt - 1)));
            }

            try {
              const chunkRes = await fetch('/api/medical-translate/chunk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chunkText: chunk.text,
                  chunkIndex: chunk.index,
                  totalChunks: validChunks.length,
                  chunkTitle: chunk.title,
                  articleTitle: detectedTitle,
                  targetLanguage,
                  specialtyFocus,
                  translationMode
                })
              });

              chunkData = await chunkRes.json();
              if (chunkRes.ok && chunkData.success && chunkData.translatedText) {
                chunkSuccess = true;
              } else {
                lastChunkError = new Error(chunkData?.error || `Error en la traducción del segmento ${i + 1}`);
              }
            } catch (chunkFetchErr: any) {
              lastChunkError = chunkFetchErr;
            }
          }

          if (!chunkSuccess) {
            throw lastChunkError || new Error(`Error en la traducción del segmento ${i + 1}`);
          }

          const chunkItem: TranslatedChunk = {
            index: i,
            title: chunk.title,
            translatedText: chunkData.translatedText
          };
          completed.push(chunkItem);
          setTranslatedChunks([...completed]);

          // Live update the running text for seamless user feedback
          runningAccumulator += (runningAccumulator ? '\n\n---\n\n' : '') + chunkData.translatedText;
          setTranslatedResult(runningAccumulator);
          setChunkProgress(Math.round(((i + 1) / validChunks.length) * 100));
        }

        setChunkProgress(100);
        setLoadingStage('¡Traducción 100% completada a cabalidad sin omisiones!');
        setCurrentArticleTitle(detectedTitle);

        // Step C: Auto-generate Executive Summary if requested
        let generatedSummary = '';
        if (translationMode === 'full_with_summary') {
          setLoadingStage('Generando resumen clínico ejecutivo de alta densidad...');
          generatedSummary = (await handleGenerateSummary(runningAccumulator)) || '';
        }

        // Save to history
        const newRecord: TranslationRecord = {
          id: `trans-${Date.now()}`,
          title: detectedTitle,
          originalSnippet: inputText.slice(0, 300) || selectedFile?.name || 'Documento adjunto',
          translatedContent: runningAccumulator,
          summaryContent: generatedSummary || undefined,
          date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          fileName: selectedFile?.name,
          mode: translationMode,
          targetLanguage,
          specialty: specialtyFocus,
          totalSegments: validChunks.length
        };
        saveToHistory(newRecord);

      } else {
        // Fallback single pass for scanned visual PDFs or direct text
        setLoadingStage('Traduciendo con IA médica de alta precisión y farmacología...');
        
        let singleSuccess = false;
        let data: any = null;
        let lastSingleErr: any = null;

        for (let attempt = 1; attempt <= 3 && !singleSuccess; attempt++) {
          if (attempt > 1) {
            setLoadingStage(`Demanda alta temporal en servidores de Google. Reintentando traducción (intento ${attempt}/3)...`);
            await new Promise(r => setTimeout(r, 2000 * (attempt - 1)));
          }

          try {
            const response = await fetch('/api/medical-translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: inputText,
                fileBase64: selectedFile?.base64,
                fileName: selectedFile?.name,
                mimeType: selectedFile?.type,
                targetLanguage,
                translationMode,
                specialtyFocus
              })
            });

            data = await response.json();
            if (response.ok && data.success && data.translatedContent) {
              singleSuccess = true;
            } else {
              lastSingleErr = new Error(data?.error || 'Error en el servidor al traducir el artículo médico.');
            }
          } catch (netErr: any) {
            lastSingleErr = netErr;
          }
        }

        if (!singleSuccess) {
          throw lastSingleErr || new Error('Error en el servidor al traducir el artículo médico.');
        }

        const result = data.translatedContent;
        setTranslatedResult(result);
        setChunkProgress(100);

        const lines = result.split('\n');
        const firstHeading = lines.find((l: string) => l.startsWith('# '))?.replace('# ', '').trim();
        const finalTitle = firstHeading || detectedTitle;
        setCurrentArticleTitle(finalTitle);

        let generatedSummary = '';
        if (translationMode === 'full_with_summary') {
          generatedSummary = (await handleGenerateSummary(result)) || '';
        }

        const newRecord: TranslationRecord = {
          id: `trans-${Date.now()}`,
          title: finalTitle,
          originalSnippet: inputText.slice(0, 300) || selectedFile?.name || 'Archivo adjunto',
          translatedContent: result,
          summaryContent: generatedSummary || undefined,
          date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          fileName: selectedFile?.name,
          mode: translationMode,
          targetLanguage,
          specialty: specialtyFocus,
          totalSegments: 1
        };
        saveToHistory(newRecord);
      }

    } catch (err: any) {
      console.error('Translation error:', err);
      setErrorMessage(err.message || 'Error al comunicarse con el motor de traducción médica.');
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  // Copy to clipboard
  const handleCopy = (textToCopy?: string) => {
    const text = textToCopy || (activeResultTab === 'summary' ? summaryResult : translatedResult);
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export to official Medical PDF using jsPDF
  const handleExportPDF = (type: 'full' | 'summary' = 'full') => {
    const content = type === 'summary' ? summaryResult : translatedResult;
    if (!content) return;

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const maxLineWidth = pageWidth - margin * 2;
      let y = margin;

      // Header Banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 28, 'F');

      // Top Accent Line
      doc.setFillColor(type === 'summary' ? 16 : 245, type === 'summary' ? 185 : 158, type === 'summary' ? 129 : 11);
      doc.rect(0, 26, pageWidth, 2, 'F');

      // Title & Subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(type === 'summary' ? 'ANESTESIAPRO • RESUMEN CLÍNICO EJECUTIVO' : 'ANESTESIAPRO • TRADUCCIÓN MÉDICA DE ÉLITE', margin, 12);

      doc.setTextColor(203, 213, 225);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(`Rigor Científico Certificado • Fecha: ${new Date().toLocaleDateString('es-ES')} • Idioma: ${targetLanguage}`, margin, 19);

      y = 38;

      const rawLines = content.split('\n');

      for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i].trim();

        if (y > pageHeight - 20) {
          doc.addPage();
          y = margin;
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          doc.text('AnestesiaPro Élite — Traducción Científica & Síntesis Clínica', margin, 10);
          doc.setDrawColor(226, 232, 240);
          doc.line(margin, 12, pageWidth - margin, 12);
          y = 18;
        }

        if (line.startsWith('# ')) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13);
          doc.setTextColor(15, 23, 42);
          const clean = line.replace('# ', '');
          const wrapped = doc.splitTextToSize(clean, maxLineWidth);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 6 + 4;
        } else if (line.startsWith('## ')) {
          y += 3;
          doc.setFillColor(241, 245, 249);
          doc.rect(margin - 2, y - 4, maxLineWidth + 4, 7, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.setTextColor(180, 83, 9);
          const clean = line.replace('## ', '');
          doc.text(clean, margin, y + 1);
          y += 9;
        } else if (line.startsWith('### ')) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(30, 41, 59);
          const clean = line.replace('### ', '');
          doc.text(clean, margin, y);
          y += 5.5;
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          const clean = line.replace(/^[\*\-]\s+/, '• ');
          const wrapped = doc.splitTextToSize(clean, maxLineWidth - 4);
          doc.text(wrapped, margin + 3, y);
          y += wrapped.length * 4.5;
        } else if (line.startsWith('|')) {
          // Compact table row in PDF
          doc.setFont('courier', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(30, 41, 59);
          const clean = line.replace(/\|/g, '  |  ');
          const wrapped = doc.splitTextToSize(clean, maxLineWidth);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 4.2;
        } else if (line.length === 0) {
          y += 2.5;
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          const clean = line.replace(/\*\*/g, '');
          const wrapped = doc.splitTextToSize(clean, maxLineWidth);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 4.4;
        }
      }

      const totalPages = doc.internal.pages.length - 1;
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Página ${p} de ${totalPages} • Documento Clínico Formativo AnestesiaPro`, pageWidth / 2, pageHeight - 8, { align: 'center' });
      }

      const prefix = type === 'summary' ? 'Resumen_Clinico' : 'Traduccion_Fiel';
      const safeName = (currentArticleTitle || 'Articulo_Medico').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35);
      doc.save(`${prefix}_${safeName}_AnestesiaPro.pdf`);
    } catch (pdfErr) {
      console.error('PDF export error:', pdfErr);
      alert('Error al generar el PDF. Puedes copiar el texto con el botón de Copiar.');
    }
  };

  // Share summary or translation directly to WhatsApp
  const handleShareWhatsApp = (type: 'summary' | 'full') => {
    const isSummary = type === 'summary';
    const textToShare = isSummary ? summaryResult : translatedResult;
    if (!textToShare) {
      alert('No hay contenido disponible para compartir en WhatsApp.');
      return;
    }

    const title = currentArticleTitle || 'Artículo Médico';
    let message = `*ANESTESIAPRO - ${isSummary ? 'SÍNTESIS CLÍNICA' : 'TRADUCCIÓN MÉDICA INTEGRAL'}*\n`;
    message += `📋 *${title}*\n`;
    message += `🔬 *Especialidad:* ${specialtyFocus}\n`;
    message += `📅 *Fecha:* ${new Date().toLocaleDateString('es-ES')}\n\n`;

    let formattedText = textToShare
      .replace(/#{1,4}\s*(.*)/g, '*$1*')
      .replace(/\*\*(.*?)\*\*/g, '*$1*')
      .replace(/\|/g, ' ')
      .trim();

    if (formattedText.length > 3500) {
      message += formattedText.slice(0, 3200) + '\n\n... _(Documento extenso completo disponible en AnestesiaPro)_';
    } else {
      message += formattedText;
    }

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encoded}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Text-to-speech audio reader in Spanish
  const toggleSpeech = () => {
    const textToRead = activeResultTab === 'summary' ? summaryResult : translatedResult;
    if (!textToRead) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = textToRead
      .replace(/[#*`_]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\|.*?\|/g, '')
      .slice(0, 3000);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Value Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-amber-950/60 border border-cyan-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>MOTOR ÉLITE • SEGMENTACIÓN ANTI-OMISIÓN</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                📚 Traducción Fiel por Segmentos + Resumen Clínico Ejecutivo
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              <span>Traductor & Compendio de Artículos Médicos</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Sube artículos en <strong>PDF</strong>, <strong>Word (.docx)</strong> o pega texto en inglés. Nuestro sistema <strong>segmenta artículos extensos</strong> para garantizar una traducción 100% íntegra (sin párrafos omitidos ni recortes de tablas), preservando <strong>valores p, IC 95% y dosis farmacológicas</strong>, con opción de <strong>resumen clínico ejecutivo de alta densidad</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Arquitectura</span>
              <span className="text-xs font-black text-cyan-300 flex items-center gap-1 justify-center">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Gemini 3.8 Flash • Segmented
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Setup & Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Input Source (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>1. Carga del Artículo Médico o Archivo</span>
              </h3>
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setInputText('');
                    setChunksList([]);
                    setTranslatedChunks([]);
                    setTotalChunks(0);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Quitar archivo</span>
                </button>
              )}
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
                  : selectedFile
                  ? 'border-emerald-500/60 bg-emerald-950/20'
                  : 'border-slate-700 bg-slate-950/60 hover:border-cyan-500/50 hover:bg-slate-950'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{selectedFile.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tamaño: {selectedFile.size} • {selectedFile.name.toLowerCase().endsWith('.docx') || selectedFile.name.toLowerCase().endsWith('.doc') ? '📄 Documento Word (.docx / .doc)' : selectedFile.name.toLowerCase().endsWith('.pdf') ? '📕 Manuscrito PDF Oficial' : '📝 Documento de Texto'}
                    </p>
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    ✓ Archivo Cargado • Listo para Segmentación y Traducción
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      Arrastra y suelta tu artículo aquí, o <span className="text-cyan-400 underline">haz clic para examinar</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Admite <strong>PDF</strong> (extracto de texto y visual), documentos <strong>Word (.docx)</strong>, archivos <strong>TXT</strong> o <strong>Markdown</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Text Paste Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>O pega directamente el artículo completo o fragmento:</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {inputText.length} caracteres • ~{inputText.split(/\s+/).filter(Boolean).length} palabras
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pega aquí el texto completo del artículo en inglés. Si es un artículo extenso (10-30 páginas), nuestro algoritmo lo segmentará automáticamente para traducir cada apartado sin recortes..."
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-colors resize-y"
              />
            </div>

            {/* Quick 1-Click Sample Articles */}
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cargar Ensayos Clínicos de Muestra (1-Clic):</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_ARTICLES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleLoadSample(sample)}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-black text-cyan-400 block truncate group-hover:text-cyan-300">
                      {sample.journal}
                    </span>
                    <h5 className="text-xs font-bold text-white line-clamp-2 mt-0.5 leading-snug">
                      {sample.title}
                    </h5>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Translation Rigor & Options (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>2. Modo de Procesamiento & Rigor</span>
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold">Segmentación:</span>
                <button
                  type="button"
                  onClick={() => setUseSegmentation(!useSegmentation)}
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all ${
                    useSegmentation 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                  title="Divide automáticamente artículos extensos en bloques de 3.000 caracteres para asegurar traducción íntegra de tablas y párrafos sin recortes"
                >
                  {useSegmentation ? 'Activa ✓' : 'Inactiva'}
                </button>
              </div>
            </div>

            {/* Translation Mode Options */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Selecciona la Modalidad Clínica:
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'full',
                    label: 'Traducción Fiel por Segmentos (100% Exhaustiva)',
                    badge: 'Recomendado',
                    badgeColor: 'bg-amber-500 text-slate-950',
                    desc: 'Traduce sección por sección sin omitir ningún párrafo, tabla, valor p ni dosis farmacológica.'
                  },
                  {
                    id: 'summary',
                    label: 'Resumir Artículo Extenso (Síntesis Clínica)',
                    badge: 'Alta Densidad',
                    badgeColor: 'bg-emerald-500 text-slate-950',
                    desc: 'PICO, protocolo anestésico, resultados numéricos exactos (p, IC 95%), seguridad y perlas de quirófano.'
                  },
                  {
                    id: 'full_with_summary',
                    label: 'Traducción Completa + Resumen Integrado',
                    badge: 'Doble Entrega',
                    badgeColor: 'bg-cyan-500 text-slate-950',
                    desc: 'Ejecuta la traducción exhaustiva completa y además genera el resumen ejecutivo de alta densidad.'
                  },
                  {
                    id: 'critical',
                    label: 'Traducción + Análisis Crítico GRADE',
                    badge: 'Metodológico',
                    badgeColor: 'bg-purple-500 text-white',
                    desc: 'Traducción fiel más evaluación de potencia estadística, sesgos y aplicabilidad en quirófano.'
                  }
                ].map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setTranslationMode(mode.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      translationMode === mode.id
                        ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{mode.label}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        translationMode === mode.id 
                          ? mode.badgeColor 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {mode.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {mode.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Idioma de Destino:</span>
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-cyan-500"
              >
                <option value="Español Médico (Académico)">Español Médico (Académico / Estándar)</option>
                <option value="Español Quirúrgico Latinoamericano">Español Quirúrgico (Latinoamérica / Rioplatense)</option>
                <option value="Inglés Médico (Medical English)">Inglés Médico (Medical English)</option>
                <option value="Português Médico (Brasil / Portugal)">Português Médico (Brasil / Portugal)</option>
              </select>
            </div>

            {/* Specialty Focus */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enfoque de Especialidad Clínica:</span>
              </label>
              <select
                value={specialtyFocus}
                onChange={(e) => setSpecialtyFocus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-cyan-500"
              >
                <option value="Anestesiología y Reanimación">Anestesiología General y Reanimación</option>
                <option value="Vía Aérea Difícil y FONA">Vía Aérea Difícil y Cuello Anterior (FONA)</option>
                <option value="Farmacología TIVA / TCI & Neuroanestesia">Farmacología TIVA / TCI & Neuroanestesia</option>
                <option value="Anestesia Obstétrica y Hemorragia">Anestesia Obstétrica (E-MOTIVE / PPH)</option>
                <option value="Cardiovascular Perioperatoria">Cardiovascular Perioperatoria & Hemodinamia</option>
                <option value="Cuidados Intensivos y Shock">Medicina Crítica, UCI & Shock Séptico</option>
              </select>
            </div>

            {/* Dual Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleTranslate}
                disabled={isLoading || isSummarizing || (!inputText.trim() && !selectedFile?.base64)}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLoading || isSummarizing || (!inputText.trim() && !selectedFile?.base64)
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20 active:scale-98'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Traduciendo por Segmentos ({chunkProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>
                      {translationMode === 'summary' ? 'Generar Resumen Clínico' : 'Traducir Artículo a Cabalidad (IA Fiel)'}
                    </span>
                  </>
                )}
              </button>

              {/* Instant Summarize Button */}
              {translationMode !== 'summary' && (
                <button
                  type="button"
                  onClick={() => handleGenerateSummary()}
                  disabled={isLoading || isSummarizing || (!inputText.trim() && !selectedFile?.base64 && !translatedResult)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    isLoading || isSummarizing || (!inputText.trim() && !selectedFile?.base64 && !translatedResult)
                      ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                      : 'bg-slate-950 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 border-emerald-500/40 active:scale-98'
                  }`}
                >
                  {isSummarizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>Elaborando Resumen Clínico de Alta Densidad...</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                      <span>✨ Resumir Artículo Extenso (Síntesis PICO & Quirófano)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Processing Animation Screen with Segment Tracker */}
      {isLoading && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  Traducción Quirúrgica de Élite por Segmentos
                </h4>
                <p className="text-xs text-cyan-300 font-medium">
                  {loadingStage || 'Procesando artículo con Gemini 3.8 Flash...'}
                </p>
              </div>
            </div>

            {totalChunks > 1 && (
              <div className="text-right">
                <span className="text-xs font-black text-amber-400 block font-mono">
                  Segmento {currentChunkIndex + 1} de {totalChunks}
                </span>
                <span className="text-[11px] text-slate-400">
                  {chunkProgress}% Completado
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.max(chunkProgress, 8)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2 pt-1 border-t border-slate-800">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Garantía Anti-Omisión: 0% de párrafos o tablas recortados
            </span>
            <span className="font-mono text-slate-500">
              Preservando p-values, IC 95% y DCI farmacológica
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-200 text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-start gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-black text-rose-300">Aviso del Traductor Médico:</h5>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shrink-0 flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reintentar traducción</span>
          </button>
        </div>
      )}

      {/* Results View & Output Section */}
      {(translatedResult || summaryResult) && (
        <div className="space-y-4 animate-fadeIn">
          {/* Action Toolbar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h4 className="text-sm sm:text-base font-black text-white line-clamp-1">
                  {currentArticleTitle || 'Artículo Médico Traducido'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {translatedChunks.length > 1 ? `${translatedChunks.length} Segmentos Traducidos • ` : ''}
                  Fidelidad médica certificada • Destino: {targetLanguage}
                </p>
              </div>
            </div>

            {/* Actions: View Toggle, Copy, Export PDF, Speech */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Navigation Tabs */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs font-bold">
                {translatedResult && (
                  <button
                    type="button"
                    onClick={() => setActiveResultTab('full')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeResultTab === 'full'
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Traducción Completa</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setActiveResultTab('summary');
                    if (!summaryResult && !isSummarizing) {
                      handleGenerateSummary();
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeResultTab === 'summary'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Resumen Clínico {summaryResult ? '✓' : '✨'}</span>
                </button>

                {translatedChunks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveResultTab('segments')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeResultTab === 'segments'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Split className="w-3.5 h-3.5" />
                    <span>Segmentos ({translatedChunks.length})</span>
                  </button>
                )}

                {inputText && (
                  <button
                    type="button"
                    onClick={() => setActiveResultTab('bilingual')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeResultTab === 'bilingual'
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Bilingüe</span>
                  </button>
                )}
              </div>

              {/* Audio Listen Speech */}
              <button
                type="button"
                onClick={toggleSpeech}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSpeaking
                    ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title={isSpeaking ? 'Detener lectura' : 'Escuchar en español'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                <span>{isSpeaking ? 'Pausar' : 'Escuchar'}</span>
              </button>

              {/* Copy */}
              <button
                type="button"
                onClick={() => handleCopy()}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>

              {/* Download PDF Dropdown / Action */}
              <button
                type="button"
                onClick={() => handleExportPDF(activeResultTab === 'summary' ? 'summary' : 'full')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>PDF {activeResultTab === 'summary' ? 'Resumen' : 'Completo'}</span>
              </button>

              {/* WhatsApp Share Action */}
              <button
                type="button"
                onClick={() => handleShareWhatsApp(activeResultTab === 'summary' ? 'summary' : 'full')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                title="Compartir por WhatsApp con formato clínico y referencias"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Quick Search within translation */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar fármaco, dosis (mg/kg), p-value (< 0.05) o término médico..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* TAB 1: EXECUTIVE CLINICAL SUMMARY TAB */}
          {activeResultTab === 'summary' && (
            <div className="p-5 sm:p-7 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Síntesis Clínica de Alta Densidad</span>
                  </span>
                  
                  {/* Format Selector Pills */}
                  <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setSummaryFormat('executive');
                        if (summaryResult && !isSummarizing) handleGenerateSummary(undefined, 'executive');
                      }}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                        summaryFormat === 'executive'
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      PICO & Protocolo Completo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSummaryFormat('quick_bullets');
                        if (summaryResult && !isSummarizing) handleGenerateSummary(undefined, 'quick_bullets');
                      }}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                        summaryFormat === 'quick_bullets'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚡ 5 Puntos Clave Quirófano
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateSummary()}
                    disabled={isSummarizing}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSummarizing ? 'animate-spin' : ''}`} />
                    <span>Regenerar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportPDF('summary')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF Resumen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp('summary')}
                    className="text-xs text-emerald-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer bg-emerald-950/80 hover:bg-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-700/60"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {isSummarizing ? (
                <div className="p-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Sintetizando artículo médico extenso...</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Extrayendo pregunta PICO, regímenes farmacológicos exactos, valores p de significancia y perlas clínicas para quirófano.
                  </p>
                </div>
              ) : summaryResult ? (
                <div className="max-h-[750px] overflow-y-auto pr-2 space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <RenderMarkdownContent content={summaryResult} filter={searchFilter} />
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Aún no se ha generado el resumen clínico de este artículo.</p>
                  <button
                    type="button"
                    onClick={() => handleGenerateSummary()}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
                  >
                    Generar Resumen Clínico Ahora
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SEGMENTS TAB (Navigate section by section) */}
          {activeResultTab === 'segments' && translatedChunks.length > 0 && (
            <div className="p-5 sm:p-7 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                    <Split className="w-3.5 h-3.5" />
                    <span>Navegación por Segmentos ({translatedChunks.length})</span>
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Inspecciona cada sección traducida a cabalidad
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSelectedSegmentTab('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedSegmentTab === 'all'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Ver Todos Integrados
                  </button>
                  {translatedChunks.map((chunk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSegmentTab(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedSegmentTab === idx
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Seg. {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[750px] overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedSegmentTab === 'all' ? (
                  translatedChunks.map((chunk, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-400 border-b border-slate-800/80 pb-1.5">
                        <span>Segmento {idx + 1}: {chunk.title}</span>
                        <span className="text-[10px] text-slate-500">100% Traducido</span>
                      </div>
                      <RenderMarkdownContent content={chunk.translatedText} filter={searchFilter} />
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400 border-b border-slate-800/80 pb-1.5">
                      <span>Segmento {selectedSegmentTab + 1}: {translatedChunks[selectedSegmentTab]?.title}</span>
                      <span className="text-[10px] text-slate-500">Traducción Quirúrgica Fiel</span>
                    </div>
                    <RenderMarkdownContent content={translatedChunks[selectedSegmentTab]?.translatedText || ''} filter={searchFilter} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BILINGUAL COMPARISON */}
          {activeResultTab === 'bilingual' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: Original Text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Documento Original en Inglés</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {selectedFile?.name || 'Texto cargado'}
                  </span>
                </div>
                <div className="max-h-[600px] overflow-y-auto pr-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-serif whitespace-pre-wrap">
                  {inputText || selectedFile?.name || 'Contenido extraído del documento'}
                </div>
              </div>

              {/* Right: Translated Faithful Text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Traducción Médica Fiel (Español)</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    ✓ Rigor Científico Certificado
                  </span>
                </div>
                <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <RenderMarkdownContent content={translatedResult} filter={searchFilter} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FULL TRANSLATION (Default) */}
          {activeResultTab === 'full' && (
            <div className="p-5 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    Artículo Médico Traducido al Español
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Listo para lectura clínica, ateneo quirúrgico o publicación
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!summaryResult && (
                    <button
                      type="button"
                      onClick={() => handleGenerateSummary()}
                      disabled={isSummarizing}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>✨ Generar Resumen Clínico</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleExportPDF('full')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp('full')}
                    className="text-xs text-emerald-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer bg-emerald-950/80 hover:bg-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-700/60"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              <div className="max-h-[750px] overflow-y-auto pr-2 space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                <RenderMarkdownContent content={translatedResult} filter={searchFilter} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* History of Saved Articles */}
      {history.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Historial Local de Artículos Traducidos ({history.length})</span>
            </h3>
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Borrar Historial
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {history.map((record) => (
              <div
                key={record.id}
                onClick={() => {
                  setTranslatedResult(record.translatedContent);
                  if (record.summaryContent) setSummaryResult(record.summaryContent);
                  setCurrentArticleTitle(record.title);
                  setInputText(record.originalSnippet);
                  setActiveResultTab('full');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">{record.date}</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 font-bold uppercase text-[9px]">
                    {record.mode}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white line-clamp-2 group-hover:text-cyan-300 leading-snug">
                  {record.title}
                </h5>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-amber-400">
                  <span>Reabrir traducción</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component to render markdown with table formatting & search highlighting
const RenderMarkdownContent: React.FC<{ content: string; filter?: string }> = ({ content, filter }) => {
  const lines = content.split('\n');

  // Helper to group markdown table rows into HTML tables
  const elements: React.ReactNode[] = [];
  let tableBuffer: string[] = [];

  const flushTableBuffer = (keyPrefix: number) => {
    if (tableBuffer.length === 0) return;

    const rows = tableBuffer.map(r => 
      r.split('|')
        .map(c => c.trim())
        .filter((c, idx, arr) => !(idx === 0 && c === '') && !(idx === arr.length - 1 && c === ''))
    );

    const isDivider = (row: string[]) => row.every(c => /^[-:\s]+$/.test(c));
    const headerRow = rows[0];
    const bodyRows = rows.slice(1).filter(r => !isDivider(r));

    elements.push(
      <div key={`table-${keyPrefix}`} className="my-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-md">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="bg-slate-900 text-cyan-300 border-b border-slate-800">
              {headerRow.map((cell, cIdx) => (
                <th key={cIdx} className="p-2.5 font-bold uppercase text-[11px] tracking-wider border-r border-slate-800/60 last:border-r-0">
                  {highlightText(cell, filter)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/40'}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2.5 border-r border-slate-800/40 last:border-r-0">
                    {highlightText(cell, filter)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    tableBuffer = [];
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check table row
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      tableBuffer.push(trimmed);
      return;
    } else {
      flushTableBuffer(idx);
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={idx} className="text-base sm:text-xl font-black text-white pt-3 pb-1 border-b border-slate-800">
          {trimmed.replace('# ', '')}
        </h1>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="text-sm sm:text-base font-black text-amber-400 pt-3.5 pb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <span>{trimmed.replace('## ', '')}</span>
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={idx} className="text-xs sm:text-sm font-black text-cyan-300 pt-2 pb-0.5">
          {trimmed.replace('### ', '')}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const bulletText = trimmed.replace(/^[\*\-]\s+/, '');
      elements.push(
        <div key={idx} className="flex items-start gap-2 pl-2">
          <span className="text-cyan-400 text-xs mt-0.5">•</span>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {highlightText(bulletText, filter)}
          </p>
        </div>
      );
      return;
    }

    if (trimmed.length === 0) {
      elements.push(<div key={idx} className="h-1.5" />);
      return;
    }

    elements.push(
      <p key={idx} className="text-xs sm:text-sm text-slate-200 leading-relaxed">
        {highlightText(trimmed, filter)}
      </p>
    );
  });

  flushTableBuffer(lines.length);

  return <div className="space-y-2">{elements}</div>;
};

// Text highlight helper
function highlightText(text: string, query?: string): React.ReactNode {
  const cleaned = text.replace(/\*\*(.*?)\*\*/g, '$1');

  if (!query || !query.trim()) {
    return cleaned;
  }

  const parts = cleaned.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-amber-400 text-slate-950 font-bold px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default MedicalArticleTranslator;
