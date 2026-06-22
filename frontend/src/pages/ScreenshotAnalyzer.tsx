import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWorker } from 'tesseract.js';
import { askGemini, type GeminiError } from '../api/gemini';
import { searchErrors } from '../api/devfix';
import ErrorCard from '../components/ErrorCard';
import type { TechError } from '../types';

type Stage = 'idle' | 'ocr' | 'ai' | 'searching' | 'done';

// ── Keyword extractor ─────────────────────────────────────────────────────────
const ERROR_PATTERNS: { pattern: RegExp; keyword: string }[] = [
  { pattern: /JAVA_HOME/i,                               keyword: 'JAVA_HOME' },
  { pattern: /java.*not recognized/i,                    keyword: 'java not recognized' },
  { pattern: /NullPointerException/i,                    keyword: 'NullPointerException' },
  { pattern: /OutOfMemoryError/i,                        keyword: 'OutOfMemoryError' },
  { pattern: /StackOverflow/i,                           keyword: 'StackOverflow' },
  { pattern: /port.*already.*use/i,                      keyword: 'port already in use' },
  { pattern: /Connection refused/i,                      keyword: 'connection refused' },
  { pattern: /BUILD FAIL/i,                              keyword: 'BUILD FAILED' },
  { pattern: /mvn.*not recognized/i,                     keyword: 'mvn not recognized' },
  { pattern: /npm.*not recognized/i,                     keyword: 'npm not recognized' },
  { pattern: /Cannot connect.*[Dd]ocker|docker daemon/i, keyword: 'docker daemon' },
  { pattern: /Cannot find module/i,                      keyword: 'module not found' },
  { pattern: /merge conflict/i,                          keyword: 'merge conflict' },
  { pattern: /table.*doesn.*exist/i,                     keyword: 'table does not exist' },
  { pattern: /No qualifying bean/i,                      keyword: 'spring bean not found' },
];

function extractKeywords(text: string): string[] {
  const found: string[] = [];
  for (const { pattern, keyword } of ERROR_PATTERNS) {
    if (pattern.test(text)) found.push(keyword);
  }
  const codes = text.match(/[A-Z][A-Z_]{3,}/g) ?? [];
  codes.forEach(c => { if (!found.includes(c)) found.push(c); });
  if (found.length === 0) {
    const words = text.match(/\b[a-zA-Z]{4,}\b/g) ?? [];
    found.push(...words.slice(0, 5));
  }
  return [...new Set(found)];
}

export default function ScreenshotAnalyzer() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [stage,       setStage]       = useState<Stage>('idle');
  const [preview,     setPreview]     = useState<string | null>(null);
  const [ocrText,     setOcrText]     = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [aiAnswer,    setAiAnswer]    = useState('');
  const [results,     setResults]     = useState<TechError[]>([]);
  const [error,       setError]       = useState('');
  const [isDragging,  setIsDragging]  = useState(false);



  const processImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    setError('');
    setResults([]);
    setOcrText('');
    setAiAnswer('');
    setOcrProgress(0);

    const url = URL.createObjectURL(file);
    setPreview(url);
    setStage('ocr');

    try {
      // ── Step 1: OCR ───────────────────────────────────────────────────────
      const worker = await createWorker('eng', 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const extractedText = text.trim();
      setOcrText(extractedText);
      setOcrProgress(100);

      if (!extractedText) {
        setError('Could not extract any text from the image. Try a clearer screenshot.');
        setStage('idle');
        return;
      }

      // ── Step 2: Gemini AI analysis ────────────────────────────────────────
      setStage('ai');
      try {
        const prompt = `I extracted the following text from a developer's error screenshot using OCR:\n\n${extractedText.slice(0, 1500)}`;
        const answer = await askGemini(prompt);
        setAiAnswer(answer);
      } catch (aiErr) {
        const e = aiErr as GeminiError;
        // Non-fatal: continue to KB search
        setError(`AI analysis failed (${e?.message ?? 'unknown error'}). Showing KB results only.`);
      }

      // ── Step 3: KB search ─────────────────────────────────────────────────
      setStage('searching');
      const keywords = extractKeywords(extractedText);
      const allResults: TechError[] = [];
      const seen = new Set<number>();

      for (const kw of keywords.slice(0, 5)) {
        try {
          const res = await searchErrors(kw);
          for (const r of res) {
            if (!seen.has(r.id)) { seen.add(r.id); allResults.push(r); }
          }
        } catch { /* continue */ }
      }

      setResults(allResults);
      setStage('done');

    } catch (err) {
      console.error(err);
      setError('OCR failed. Please try a clearer screenshot.');
      setStage('idle');
    }
  };

  const handleFile = (file: File) => processImage(file);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const reset = () => {
    setStage('idle'); setPreview(null); setOcrText(''); setAiAnswer('');
    setOcrProgress(0); setResults([]); setError('');
  };

  // Render AI response text
  const formatAIResponse = (text: string) =>
    text.split('\n').map((line, i) => {
      if (/^\*\*(.+)\*\*$/.test(line.trim())) {
        return <div key={i} style={{ fontWeight: 700, marginTop: 14, marginBottom: 4, color: 'var(--accent)' }}>{line.replace(/\*\*/g, '')}</div>;
      }
      if (/^\d+\./.test(line)) {
        return <div key={i} style={{ paddingLeft: 16, marginBottom: 5, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{line}</div>;
      }
      if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
      return <div key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 4 }}>{line}</div>;
    });

  const isProcessing = stage === 'ocr' || stage === 'ai' || stage === 'searching';

  return (
    <div className="container page">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>📸 Screenshot Analyzer</h1>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(124,58,237,0.2))',
              color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)',
            }}>OCR + AI</span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Upload a screenshot of your error — OCR extracts the text, then the AI diagnoses it and finds a fix.
          </p>
        </div>


        {/* How it works */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { n: '1', label: 'Upload screenshot' },
            { n: '2', label: 'OCR reads text' },
            { n: '3', label: 'AI diagnoses' },
            { n: '4', label: 'Fix is shown' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 140 }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(59,130,246,0.15)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
              }}>{s.n}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        {stage === 'idle' && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 14, padding: '60px 24px', textAlign: 'center', cursor: 'pointer',
              background: isDragging ? 'rgba(59,130,246,0.05)' : 'var(--bg-secondary)',
              transition: 'all 0.2s', marginBottom: 20,
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📸</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Drop your screenshot here</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
              or click to browse — supports PNG, JPG, WEBP
            </div>
            <button className="btn btn-primary" style={{ padding: '10px 24px' }}
              onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
              📁 Choose Screenshot
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        )}

        {/* Warnings / errors */}
        {error && <div className="auth-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

        {/* Processing states */}
        {isProcessing && (
          <div style={{ marginBottom: 24 }}>
            {preview && (
              <div style={{ marginBottom: 16 }}>
                <img src={preview} alt="Uploaded screenshot"
                  style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 10, border: '1px solid var(--border)', objectFit: 'contain' }} />
              </div>
            )}

            {stage === 'ocr' && (
              <div className="card">
                <div style={{ fontWeight: 600, marginBottom: 10 }}>🔍 Reading text from image... {ocrProgress}%</div>
                <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${ocrProgress}%`,
                    background: 'linear-gradient(90deg, var(--accent), #7c3aed)',
                    borderRadius: 999, transition: 'width 0.3s',
                  }} />
                </div>
              </div>
            )}

            {stage === 'ai' && (
              <div className="card" style={{ textAlign: 'center', padding: 28 }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>🤖</div>
                <div style={{ fontWeight: 600 }}>The AI is analyzing the error...</div>
              </div>
            )}

            {stage === 'searching' && (
              <div className="card">
                <div style={{ fontWeight: 600 }}>🔎 Searching knowledge base for matching fixes...</div>
              </div>
            )}
          </div>
        )}

        {/* Done state */}
        {stage === 'done' && (
          <div>
            {/* Image + OCR text */}
            {preview && (
              <div style={{ marginBottom: 16 }}>
                <img src={preview} alt="Uploaded screenshot"
                  style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 10, border: '1px solid var(--border)', objectFit: 'contain' }} />
              </div>
            )}

            {ocrText && (
              <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  📄 Text extracted from screenshot:
                </div>
                <pre style={{
                  fontFamily: 'JetBrains Mono', fontSize: '0.8rem',
                  color: 'var(--text-secondary)', whiteSpace: 'pre-wrap',
                  maxHeight: 150, overflow: 'auto', margin: 0, lineHeight: 1.7,
                }}>
                  {ocrText.slice(0, 800)}{ocrText.length > 800 ? '…' : ''}
                </pre>
              </div>
            )}

            {/* AI analysis */}
            {aiAnswer && (
              <div className="card" style={{ marginBottom: 20, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.2rem' }}>🤖</span>
                  <span style={{ fontWeight: 700 }}>AI Diagnosis</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Powered by OpenRouter</span>
                </div>
                <div style={{ lineHeight: 1.75 }}>{formatAIResponse(aiAnswer)}</div>
              </div>
            )}

            {/* KB Results */}
            {results.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div className="section-header" style={{ marginBottom: 12 }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>
                    ✅ {results.length} related fix{results.length > 1 ? 'es' : ''} in Knowledge Base
                  </h2>
                </div>
                <div className="grid grid-2">
                  {results.map(err => (
                    <ErrorCard key={err.id} error={err} onClick={() => navigate(`/errors/${err.id}`)} />
                  ))}
                </div>
              </div>
            )}

            {/* No results at all */}
            {!aiAnswer && results.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>No matching fix found</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 16 }}>
                  The extracted text didn't match our knowledge base. Try pasting the error manually.
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => navigate('/analyze')}>🔬 Paste Error Log →</button>
                  <button className="btn btn-outline" onClick={() => navigate('/ai')}>🤖 AI Troubleshooter →</button>
                </div>
              </div>
            )}

            <button className="btn btn-outline" onClick={reset} style={{ marginTop: 8 }}>
              ← Try Another Screenshot
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
