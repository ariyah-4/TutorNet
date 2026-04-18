import { useState, useEffect, useCallback, useMemo, useRef } from "react";

/* ─── Fonts ──────────────────────────────────────────────────────────────────*/
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

/* ─── Imperial Topaz Palette — Warm Parchment Light Theme ───────────────────*/
// Aged parchment, linen, cognac, candlelight — lets the topaz glow warmly
const T = {
  // Core Topaz
  topaz:        "#C4721F",   // Imperial topaz — richer on light bg
  topazLight:   "#E8954A",   // Hover highlight
  topazDark:    "#9A5510",   // Pressed / deep
  topazDim:     "#C4721F18", // Translucent topaz tint
  topazGlow:    "#C4721F30",

  // Backgrounds — warm parchment scale
  bg:           "#F5EFE4",   // Warm linen / parchment
  surface:      "#FDFAF4",   // Cream white card surface
  surface2:     "#EDE4D3",   // Slightly deeper warm sand
  surface3:     "#E2D5BF",   // Hover / pressed warm tan

  // Borders
  border:       "#C4721F18",
  border2:      "#C4721F30",
  borderHover:  "#C4721F66",

  // Text — dark warm browns (high contrast on parchment)
  text:         "#2C1E0F",   // Deep espresso brown
  textSoft:     "#4A3420",   // Medium warm brown
  muted:        "#8C7055",   // Warm taupe
  mutedLight:   "#B09070",   // Light warm tan

  // Status colors — warm-toned & readable on light bg
  green:        "#3D7A45",
  greenDim:     "#3D7A4518",
  blue:         "#2E6E99",
  blueDim:      "#2E6E9918",
  rose:         "#B84A35",
  roseDim:      "#B84A3518",
  gold:         "#A07B10",
  goldDim:      "#A07B1018",

  // Course accent palette
  courses: [
    { bg: "#C4721F", dark: "#9A5510" },
    { bg: "#2E6E99", dark: "#1A4D70" },
    { bg: "#B84A35", dark: "#8A2E1F" },
    { bg: "#3D7A45", dark: "#235A2A" },
    { bg: "#A07B10", dark: "#785A08" },
    { bg: "#7B5EA8", dark: "#5A3E88" },
  ],
};

/* ─── Global CSS ─────────────────────────────────────────────────────────────*/
const GLOBAL_CSS = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${T.bg}; color: ${T.text}; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.surface3}; border-radius: 99px; }
  ::selection { background: ${T.topazGlow}; color: ${T.topazLight}; }
  input, textarea, select { outline: none; font-family: 'DM Sans', sans-serif; }
  input::placeholder, textarea::placeholder { color: ${T.muted}; }
  button { font-family: 'DM Sans', sans-serif; cursor: pointer; }
  select option { background: ${T.surface2}; color: ${T.text}; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  @keyframes shimmer { 0%{background-position:-400px 0;} 100%{background-position:400px 0;} }
  @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  @keyframes slideIn { from{transform:translateX(-100%);} to{transform:translateX(0);} }
  .fade-up { animation: fadeUp 0.4s cubic-bezier(.4,0,.2,1) both; }
  .fade-in { animation: fadeIn 0.3s ease both; }
  .nav-item:hover { background: ${T.topazDim} !important; color: ${T.topazLight} !important; }
  .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 40px ${T.topazDim}; border-color: ${T.border2} !important; }
  .btn-primary:hover { background: ${T.topazLight} !important; box-shadow: 0 4px 20px ${T.topazGlow}; }
  .btn-ghost:hover { background: ${T.surface2} !important; border-color: ${T.border2} !important; }
  .lesson-row:hover { background: ${T.surface3} !important; border-color: ${T.border2} !important; }
  .shimmer { background: linear-gradient(90deg, ${T.surface} 25%, ${T.surface2} 50%, ${T.surface} 75%); background-size: 400px 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
  @media (max-width: 768px) {
    .desktop-only { display: none !important; }
    .mobile-grid { grid-template-columns: 1fr !important; }
    .mobile-pad { padding: 16px !important; }
    .mobile-stats { grid-template-columns: 1fr 1fr !important; }
  }
  @media (min-width: 769px) { .mobile-only { display: none !important; } }
`;

/* ─── Seed Data ──────────────────────────────────────────────────────────────*/
const SEED_COURSES = [
  {
    id: 1, tutorId: 1, colorIdx: 0,
    title: "Advanced Linear Algebra", category: "Mathematics",
    description: "Deep dive into vector spaces, eigenvalues, and real-world applications in data science.",
    students: 42, rating: 4.9, totalLessons: 12, deadline: "2026-03-15",
    lessons: [
      { id: 1, type: "video",  title: "Vector Spaces Introduction",    duration: "18:22", done: true,  order: 1 },
      { id: 2, type: "text",   title: "Subspaces & Bases",             content: "A subspace H of Rⁿ satisfies three conditions: it contains the zero vector, is closed under addition, and closed under scalar multiplication. Every basis of a subspace has the same number of elements — this number is the dimension of H.", done: true,  order: 2 },
      { id: 3, type: "video",  title: "Eigenvalues & Eigenvectors",    duration: "24:10", done: true,  order: 3 },
      { id: 4, type: "text",   title: "The Spectral Theorem",          content: "The Spectral Theorem states that every symmetric matrix is diagonalizable by an orthogonal matrix. This has profound implications for principal component analysis (PCA) in machine learning.", done: false, order: 4 },
      { id: 5, type: "quiz",   title: "Mid-Course Assessment",         questions: 3,  done: false, order: 5 },
      { id: 6, type: "video",  title: "Singular Value Decomposition",  duration: "31:05", done: false, order: 6 },
    ],
    enrolled: true,
  },
  {
    id: 2, tutorId: 2, colorIdx: 1,
    title: "Machine Learning Fundamentals", category: "Computer Science",
    description: "Hands-on ML with Python, sklearn, PyTorch, and real-world datasets from Kaggle.",
    students: 118, rating: 4.8, totalLessons: 10, deadline: "2026-04-01",
    lessons: [
      { id: 1, type: "video",  title: "What is Machine Learning?",     duration: "12:05", done: true,  order: 1 },
      { id: 2, type: "text",   title: "Supervised vs Unsupervised",    content: "Supervised learning maps inputs to outputs using labeled training data. Unsupervised learning discovers hidden structure in unlabeled data. Semi-supervised combines both approaches.", done: false, order: 2 },
      { id: 3, type: "quiz",   title: "Concepts Check",                questions: 3,  done: false, order: 3 },
      { id: 4, type: "video",  title: "Linear Regression Deep Dive",   duration: "22:40", done: false, order: 4 },
    ],
    enrolled: true,
  },
  {
    id: 3, tutorId: 1, colorIdx: 2,
    title: "Classical Rhetoric", category: "Humanities",
    description: "Aristotle to Cicero — master persuasion through logos, ethos, and pathos.",
    students: 29, rating: 4.7, totalLessons: 8, deadline: "2026-03-28",
    lessons: [
      { id: 1, type: "video",  title: "Origins of Rhetoric",           duration: "21:40", done: false, order: 1 },
      { id: 2, type: "text",   title: "The Three Appeals",             content: "Aristotle identified three modes of persuasion: logos (logical argument), ethos (credibility of speaker), and pathos (emotional appeal). Effective rhetoric balances all three.", done: false, order: 2 },
    ],
    enrolled: false,
  },
  {
    id: 4, tutorId: 2, colorIdx: 3,
    title: "Organic Chemistry I", category: "Sciences",
    description: "Mechanisms, nomenclature, and stereochemistry. Build an intuitive model of molecular behavior.",
    students: 67, rating: 4.6, totalLessons: 14, deadline: "2026-05-10",
    lessons: [
      { id: 1, type: "video",  title: "Atomic Structure Review",       duration: "16:00", done: false, order: 1 },
      { id: 2, type: "quiz",   title: "Nomenclature Quiz",             questions: 3,  done: false, order: 2 },
    ],
    enrolled: false,
  },
  {
    id: 5, tutorId: 1, colorIdx: 4,
    title: "Financial Modeling", category: "Business",
    description: "Build DCF models, LBO analysis, and valuation frameworks used at top investment banks.",
    students: 85, rating: 4.9, totalLessons: 11, deadline: "2026-04-20",
    lessons: [
      { id: 1, type: "video",  title: "Time Value of Money",           duration: "19:30", done: false, order: 1 },
      { id: 2, type: "text",   title: "DCF Framework",                 content: "A Discounted Cash Flow model values a company by projecting future free cash flows and discounting them back to present value using the Weighted Average Cost of Capital (WACC).", done: false, order: 2 },
    ],
    enrolled: false,
  },
];

const SEED_MESSAGES = [
  { id: 1, from: "tutor", tutorId: 1, courseId: 1, text: "Great progress on eigenvalues! The SVD section is next — it's challenging but rewarding.", time: "10:30 AM", date: "Today" },
  { id: 2, from: "student", tutorId: 1, courseId: 1, text: "Thank you! I had a question about diagonalization — does it always exist?", time: "10:45 AM", date: "Today" },
  { id: 3, from: "tutor", tutorId: 1, courseId: 1, text: "Good question! Not always — only when the matrix has n linearly independent eigenvectors.", time: "11:02 AM", date: "Today" },
  { id: 4, from: "tutor", tutorId: 2, courseId: 2, text: "Assignment 1 is due Friday. Start with the sklearn notebook linked in Lesson 4.", time: "Yesterday", date: "Yesterday" },
];

const TUTORS = [
  { id: 1, name: "Dr. Elena Voss",    avatar: "EV", specialty: "Mathematics & Humanities",  courses: 3, students: 156, rating: 4.9 },
  { id: 2, name: "Prof. James Okoro", avatar: "JO", specialty: "Computer Science & Sciences", courses: 2, students: 185, rating: 4.7 },
];

const QUIZ_BANK = [
  { q: "What is the rank of a matrix?", opts: ["Number of rows", "Number of non-zero rows in RREF", "The determinant", "The trace"], correct: 1 },
  { q: "An eigenvalue of the identity matrix is:", opts: ["0", "−1", "1", "Undefined"], correct: 2 },
  { q: "If Ax = λx, then x is called:", opts: ["A scalar multiple", "An eigenvector", "A null vector", "A basis vector"], correct: 1 },
];

const CATEGORIES = ["All", "Mathematics", "Computer Science", "Humanities", "Sciences", "Business"];

/* ─── Utility Helpers ────────────────────────────────────────────────────────*/
const getProgress = (course) => {
  if (!course.lessons?.length) return 0;
  return Math.round(course.lessons.filter(l => l.done).length / course.lessons.length * 100);
};
const getCourseColor = (course) => T.courses[course.colorIdx ?? 0].bg;
const daysUntil = (dateStr) => {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

/* ─── Primitive UI Components ────────────────────────────────────────────────*/
function Badge({ text, color = T.topaz, small }) {
  return (
    <span style={{
      background: color + "1A", color, border: `1px solid ${color}44`,
      borderRadius: 4, padding: small ? "1px 6px" : "3px 9px",
      fontSize: small ? 10 : 11, fontWeight: 600, letterSpacing: 0.4,
      display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

function Avatar({ initials, size = 36, bg = T.topaz, style: sx }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${bg}, ${bg}AA)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.36,
      flexShrink: 0, letterSpacing: -0.5, ...sx,
    }}>{initials}</div>
  );
}

function ProgressBar({ pct, color = T.topaz, height = 6, animated }) {
  return (
    <div style={{ background: T.surface3, borderRadius: 99, height, overflow: "hidden", width: "100%" }}>
      <div style={{
        width: `${pct}%`, height: "100%", borderRadius: 99,
        background: `linear-gradient(90deg, ${color}CC, ${color})`,
        transition: animated ? "width 1s cubic-bezier(.4,0,.2,1)" : "none",
        boxShadow: `0 0 8px ${color}44`,
      }} />
    </div>
  );
}

function Btn({ children, variant = "primary", size = "md", onClick, disabled, style: sx }) {
  const base = {
    border: "none", borderRadius: 8, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.18s", display: "inline-flex", alignItems: "center", gap: 6,
    fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
    padding: size === "sm" ? "6px 13px" : size === "lg" ? "13px 28px" : "9px 18px",
    opacity: disabled ? 0.45 : 1,
  };
  const variants = {
    primary: { background: T.topaz, color: "#0A0806", className: "btn-primary" },
    ghost:   { background: "transparent", color: T.textSoft, border: `1px solid ${T.border2}`, className: "btn-ghost" },
    danger:  { background: T.roseDim, color: T.rose, border: `1px solid ${T.rose}33` },
    success: { background: T.greenDim, color: T.green, border: `1px solid ${T.green}33` },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button className={v.className || ""} onClick={disabled ? undefined : onClick}
      style={{ ...base, ...v, ...sx }}>{children}</button>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", multiline, rows = 3, style: sx }) {
  const inputStyle = {
    background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 8,
    padding: "10px 14px", color: T.text, fontSize: 14, width: "100%",
    transition: "border 0.2s", ...sx,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase" }}>{label}</label>}
      {multiline
        ? <textarea style={{ ...inputStyle, height: rows * 28, resize: "vertical" }} value={value} onChange={onChange} placeholder={placeholder}
            onFocus={e => e.target.style.borderColor = T.topaz} onBlur={e => e.target.style.borderColor = T.border2} />
        : <input style={inputStyle} type={type} value={value} onChange={onChange} placeholder={placeholder}
            onFocus={e => e.target.style.borderColor = T.topaz} onBlur={e => e.target.style.borderColor = T.border2} />
      }
    </div>
  );
}

function Skeleton({ w = "100%", h = 20 }) {
  return <div className="shimmer" style={{ width: w, height: h }} />;
}

function EmptyState({ icon, title, sub, action }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }} className="fade-up">
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 600, color: T.textSoft, marginBottom: 8 }}>{title}</div>
      <div style={{ color: T.muted, fontSize: 14, marginBottom: 24 }}>{sub}</div>
      {action}
    </div>
  );
}

function StatCard({ label, value, sub, color = T.topaz, icon }) {
  return (
    <div style={{ background: T.surface, borderRadius: 14, padding: "20px 22px", border: `1px solid ${color}22`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 12, right: 16, fontSize: 22, opacity: 0.15 }}>{icon}</div>
      <div style={{ color: T.muted, fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 30, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color: T.mutedLight, fontSize: 12, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function Notification({ text, type = "info", onDismiss }) {
  const colors = { info: T.blue, success: T.green, warning: T.topaz, error: T.rose };
  const c = colors[type];
  return (
    <div className="fade-up" style={{ background: c + "18", border: `1px solid ${c}33`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: c, flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13, color: T.textSoft }}>{text}</div>
      {onDismiss && <button onClick={onDismiss} style={{ background: "none", border: "none", color: T.muted, fontSize: 16, cursor: "pointer" }}>×</button>}
    </div>
  );
}

/* ─── Modal Wrapper ──────────────────────────────────────────────────────────*/
function Modal({ children, onClose, maxWidth = 560 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div className="fade-in" onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "#000000CC", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} className="fade-up"
        style={{ background: T.surface, borderRadius: 20, width: "100%", maxWidth, maxHeight: "90vh", overflow: "auto", border: `1px solid ${T.border2}` }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Quiz Modal ─────────────────────────────────────────────────────────────*/
function QuizModal({ lesson, onClose, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const total = Math.min(QUIZ_BANK.length, lesson.questions || 3);
  const score = Object.entries(answers).filter(([qi, a]) => QUIZ_BANK[parseInt(qi)]?.correct === a).length;
  const pct = Math.round(score / total * 100);

  return (
    <Modal onClose={onClose} maxWidth={520}>
      <div style={{ padding: "24px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, fontWeight: 600 }}>{lesson.title}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, fontSize: 22, cursor: "pointer" }}>×</button>
      </div>
      <div style={{ padding: 28 }}>
        {submitted ? (
          <div style={{ textAlign: "center" }} className="fade-up">
            <div style={{ fontSize: 52, marginBottom: 16 }}>{pct >= 70 ? "🏆" : "📖"}</div>
            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
              {pct >= 70 ? "Well Done!" : "Keep Practising"}
            </div>
            <div style={{ color: T.muted, marginBottom: 24 }}>You scored <span style={{ color: T.topaz, fontWeight: 700 }}>{score}/{total}</span> ({pct}%)</div>
            <div style={{ marginBottom: 28 }}><ProgressBar pct={pct} color={pct >= 70 ? T.green : T.topaz} height={10} animated /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[["Correct", score, T.green], ["Wrong", total - score, T.rose], ["Score", `${pct}%`, T.topaz]].map(([k, v, c]) => (
                <div key={k} style={{ background: T.surface2, borderRadius: 10, padding: "14px 10px" }}>
                  <div style={{ color: T.muted, fontSize: 11, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
                </div>
              ))}
            </div>
            <Btn onClick={() => { if (pct >= 50) onComplete(); onClose(); }} size="lg">{pct >= 70 ? "Claim Progress ✓" : "Close"}</Btn>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 13 }}>
              <span style={{ color: T.muted }}>Question {step + 1} of {total}</span>
              <span style={{ color: T.topaz, fontWeight: 600 }}>{Math.round((Object.keys(answers).length / total) * 100)}% answered</span>
            </div>
            <ProgressBar pct={(step / total) * 100} color={T.topaz} height={4} />
            <div style={{ marginTop: 24, marginBottom: 20 }}>
              <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.7, color: T.textSoft }}>{QUIZ_BANK[step]?.q}</p>
            </div>
            <div style={{ display: "grid", gap: 10, marginBottom: 28 }}>
              {QUIZ_BANK[step]?.opts.map((opt, i) => (
                <div key={i} onClick={() => setAnswers(a => ({ ...a, [step]: i }))}
                  style={{ padding: "13px 16px", borderRadius: 10, border: `2px solid ${answers[step] === i ? T.topaz : T.border2}`, background: answers[step] === i ? T.topazDim : "transparent", cursor: "pointer", fontSize: 14, transition: "all 0.15s", color: answers[step] === i ? T.topazLight : T.textSoft }}>
                  <span style={{ color: T.muted, marginRight: 10, fontSize: 12 }}>{String.fromCharCode(65 + i)}.</span>{opt}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Btn variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Btn>
              {step < total - 1
                ? <Btn onClick={() => setStep(s => s + 1)} disabled={answers[step] === undefined}>Next →</Btn>
                : <Btn onClick={() => setSubmitted(true)} disabled={answers[step] === undefined}>Submit Quiz</Btn>
              }
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ─── Lesson Viewer Modal ────────────────────────────────────────────────────*/
function LessonViewer({ lesson, onClose, onComplete }) {
  const [quizOpen, setQuizOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    if (playing && lesson.type === "video") {
      const interval = setInterval(() => {
        setVideoProgress(p => { if (p >= 100) { clearInterval(interval); return 100; } return p + 0.5; });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [playing, lesson.type]);

  if (quizOpen) return <QuizModal lesson={lesson} onClose={() => setQuizOpen(false)} onComplete={onComplete} />;

  return (
    <Modal onClose={onClose} maxWidth={660}>
      <div style={{ padding: "20px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 18 }}>{lesson.type === "video" ? "▶" : lesson.type === "quiz" ? "✏️" : "📄"}</div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 19, fontWeight: 600 }}>{lesson.title}</div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 2, textTransform: "capitalize" }}>{lesson.type} lesson</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, fontSize: 22, cursor: "pointer" }}>×</button>
      </div>
      <div style={{ padding: 28 }}>
        {lesson.type === "video" && (
          <div>
            <div style={{ background: "#000", borderRadius: 12, aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 16, position: "relative", overflow: "hidden", border: `1px solid ${T.border2}` }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${T.topaz}08 0%, transparent 70%)` }} />
              <div onClick={() => setPlaying(p => !p)}
                style={{ width: 64, height: 64, borderRadius: "50%", background: playing ? T.topazDim : T.topaz, border: `3px solid ${T.topaz}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", transition: "all 0.2s", color: playing ? T.topaz : "#0A0806" }}>
                {playing ? "⏸" : "▶"}
              </div>
              {playing && <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}><ProgressBar pct={videoProgress} color={T.topaz} height={4} /></div>}
              <div style={{ color: T.muted, fontSize: 13, marginTop: 12 }}>{playing ? "Playing..." : `Duration: ${lesson.duration}`}</div>
            </div>
            {videoProgress === 100 && <Notification text="Video complete! Mark lesson as done below." type="success" />}
          </div>
        )}
        {lesson.type === "text" && (
          <div>
            <div style={{ background: T.surface2, borderRadius: 12, padding: "20px 24px", marginBottom: 20, border: `1px solid ${T.border}` }}>
              <p style={{ color: T.textSoft, lineHeight: 1.85, fontSize: 15 }}>{lesson.content}</p>
            </div>
            <div style={{ background: T.topazDim, borderRadius: 10, padding: "14px 18px", border: `1px solid ${T.border2}`, marginBottom: 20 }}>
              <div style={{ color: T.topaz, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, marginBottom: 10 }}>KEY TAKEAWAYS</div>
              {["Understand the core definition and implications", "Apply the concept through the worked examples", "Prepare notes for the upcoming quiz"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 8, color: T.textSoft, fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: T.topaz }}>◆</span>{t}
                </div>
              ))}
            </div>
          </div>
        )}
        {lesson.type === "quiz" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>✏️</div>
            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Ready to test your knowledge?</div>
            <div style={{ color: T.muted, marginBottom: 28 }}>{lesson.questions} questions · Multiple choice</div>
          </div>
        )}
        {lesson.done
          ? <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.green, fontWeight: 600, padding: "10px 0" }}>✓ Lesson Completed</div>
          : lesson.type === "quiz"
            ? <Btn size="lg" onClick={() => setQuizOpen(true)}>Start Quiz →</Btn>
            : <Btn size="lg" onClick={onComplete} disabled={lesson.type === "video" && videoProgress < 50}>
                {lesson.type === "video" && videoProgress < 50 ? "Watch to 50% to complete" : "Mark as Complete ✓"}
              </Btn>
        }
      </div>
    </Modal>
  );
}

/* ─── Course Card ────────────────────────────────────────────────────────────*/
function CourseCard({ course, onClick, showEnroll, onEnroll }) {
  const color = getCourseColor(course);
  const pct = getProgress(course);
  const days = daysUntil(course.deadline);

  return (
    <div className="card-hover" onClick={onClick}
      style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
      {/* Color band */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <Badge text={course.category} color={color} />
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.gold, fontSize: 12 }}>★ {course.rating}</div>
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 19, fontWeight: 600, marginBottom: 6, lineHeight: 1.3, color: T.text }}>{course.title}</div>
        <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{course.description}</p>

        {course.enrolled && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: T.muted }}>{course.lessons.filter(l => l.done).length}/{course.lessons.length} lessons</span>
              <span style={{ color, fontWeight: 600 }}>{pct}%</span>
            </div>
            <ProgressBar pct={pct} color={color} height={5} animated />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10, color: T.muted, fontSize: 12 }}>
            <span>👥 {fmt(course.students)}</span>
            <span>📚 {course.lessons.length} lessons</span>
          </div>
          {showEnroll
            ? <Btn variant="primary" size="sm" onClick={e => { e.stopPropagation(); onEnroll(course.id); }}>Enroll Free</Btn>
            : days !== undefined && <Badge text={days > 0 ? `${days}d left` : "Past due"} color={days > 7 ? T.green : days > 0 ? T.topaz : T.rose} small />
          }
        </div>
      </div>
    </div>
  );
}

/* ─── Tutor: Course Builder ───────────────────────────────────────────────────*/
function CourseBuilder({ onSave, onCancel, initial }) {
  const [form, setForm] = useState(initial || { title: "", category: "Mathematics", description: "", colorIdx: 0 });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fade-up" style={{ background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 16, padding: 28 }}>
      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 600, marginBottom: 24 }}>{initial ? "Edit Course" : "Create New Course"}</div>
      <div style={{ display: "grid", gap: 16 }}>
        <Input label="Course Title" value={form.title} onChange={set("title")} placeholder="e.g. Advanced Linear Algebra" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Category</label>
            <select style={{ background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 14, width: "100%" }} value={form.category} onChange={set("category")}>
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Deadline</label>
            <input type="date" style={{ background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 14, width: "100%", colorScheme: "dark" }} value={form.deadline || ""} onChange={set("deadline")} />
          </div>
        </div>
        <Input label="Description" value={form.description} onChange={set("description")} placeholder="What will students learn?" multiline rows={3} />
        <div>
          <label style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Course Color</label>
          <div style={{ display: "flex", gap: 10 }}>
            {T.courses.map((c, i) => (
              <div key={i} onClick={() => setForm(f => ({ ...f, colorIdx: i }))}
                style={{ width: 30, height: 30, borderRadius: "50%", background: c.bg, cursor: "pointer", border: `3px solid ${form.colorIdx === i ? T.text : "transparent"}`, transition: "border 0.15s", boxShadow: form.colorIdx === i ? `0 0 10px ${c.bg}66` : "none" }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <Btn onClick={() => form.title && onSave(form)}>Save Course</Btn>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      </div>
    </div>
  );
}

/* ─── Tutor: Lesson Manager ───────────────────────────────────────────────────*/
function LessonManager({ course, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ type: "video", title: "", duration: "", content: "", questions: "5" });

  const typeColors = { video: T.blue, text: T.green, quiz: T.rose };
  const typeIcons  = { video: "▶", text: "📄", quiz: "✏️" };

  const addLesson = () => {
    if (!form.title) return;
    const lesson = { id: Date.now(), type: form.type, title: form.title, done: false, order: course.lessons.length + 1,
      ...(form.type === "video" ? { duration: form.duration || "10:00" } : form.type === "text" ? { content: form.content } : { questions: parseInt(form.questions) || 5 }) };
    onUpdate({ ...course, lessons: [...course.lessons, lesson] });
    setAdding(false); setForm({ type: "video", title: "", duration: "", content: "", questions: "5" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 18, fontWeight: 600 }}>Lessons ({course.lessons.length})</div>
        {!adding && <Btn size="sm" onClick={() => setAdding(true)}>+ Add Lesson</Btn>}
      </div>
      <div style={{ display: "grid", gap: 8, marginBottom: adding ? 16 : 0 }}>
        {course.lessons.length === 0 && !adding && (
          <EmptyState icon="📚" title="No lessons yet" sub="Add your first lesson to get started" action={<Btn onClick={() => setAdding(true)}>Add Lesson</Btn>} />
        )}
        {course.lessons.map((l) => (
          <div key={l.id} className="lesson-row"
            style={{ background: T.surface2, borderRadius: 10, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${T.border}`, transition: "all 0.15s" }}>
            <span style={{ color: typeColors[l.type], fontSize: 16 }}>{typeIcons[l.type]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{l.title}</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{l.type === "video" ? l.duration : l.type === "quiz" ? `${l.questions} questions` : "Reading"}</div>
            </div>
            <Badge text={l.type} color={typeColors[l.type]} small />
            <button onClick={() => onUpdate({ ...course, lessons: course.lessons.filter(x => x.id !== l.id) })}
              style={{ background: "none", border: "none", color: T.rose, fontSize: 18, cursor: "pointer", padding: "2px 6px", opacity: 0.7 }}>×</button>
          </div>
        ))}
      </div>
      {adding && (
        <div className="fade-up" style={{ background: T.surface2, borderRadius: 12, padding: 20, border: `1px solid ${T.border2}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ color: T.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Type</label>
              <select style={{ background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 14, width: "100%" }}
                value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="video">Video Lecture</option>
                <option value="text">Text Lesson</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Lesson title" />
            {form.type === "video" && <Input label="Duration (mm:ss)" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="18:30" />}
            {form.type === "quiz"  && <Input label="Number of Questions" value={form.questions} onChange={e => setForm(f => ({ ...f, questions: e.target.value }))} type="number" />}
            {form.type === "text"  && <div style={{ gridColumn: "1/-1" }}><Input label="Content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} multiline rows={4} placeholder="Lesson content..." /></div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}><Btn size="sm" onClick={addLesson}>Add Lesson</Btn><Btn variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Btn></div>
        </div>
      )}
    </div>
  );
}

/* ─── Tutor: Gradebook ────────────────────────────────────────────────────────*/
function Gradebook({ courses }) {
  const students = [
    { name: "Alex Singh",   avatar: "AS", scores: { 1: 87, 2: 91 } },
    { name: "Maria Chen",   avatar: "MC", scores: { 1: 74, 2: 83 } },
    { name: "James Okafor", avatar: "JO", scores: { 1: 95 } },
    { name: "Sara Müller",  avatar: "SM", scores: { 2: 68 } },
  ];
  const myCourses = courses.filter(c => c.tutorId === 1).slice(0, 3);

  return (
    <div className="fade-up">
      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 26, fontWeight: 700, marginBottom: 24, color: T.text }}>Gradebook</div>
      <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: `200px ${myCourses.map(() => "1fr").join(" ")} 80px`, background: T.surface2, padding: "14px 20px", gap: 16, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ color: T.muted, fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>STUDENT</div>
          {myCourses.map(c => <div key={c.id} style={{ color: T.muted, fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>{c.title.split(" ").slice(0, 2).join(" ")}</div>)}
          <div style={{ color: T.muted, fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>AVG</div>
        </div>
        {students.map((s, i) => {
          const avg = Math.round(Object.values(s.scores).reduce((a, b) => a + b, 0) / Object.values(s.scores).length);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: `200px ${myCourses.map(() => "1fr").join(" ")} 80px`, padding: "14px 20px", gap: 16, borderBottom: `1px solid ${T.border}`, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initials={s.avatar} size={30} bg={T.courses[i].bg} />
                <span style={{ fontSize: 14 }}>{s.name}</span>
              </div>
              {myCourses.map(c => (
                <div key={c.id} style={{ fontSize: 14, color: s.scores[c.id] ? (s.scores[c.id] >= 80 ? T.green : s.scores[c.id] >= 60 ? T.topaz : T.rose) : T.muted }}>
                  {s.scores[c.id] ? `${s.scores[c.id]}%` : "—"}
                </div>
              ))}
              <div style={{ fontWeight: 700, color: avg >= 80 ? T.green : avg >= 60 ? T.topaz : T.rose, fontSize: 14 }}>{avg}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Tutor: Analytics ────────────────────────────────────────────────────────*/
function Analytics({ courses }) {
  const myCourses = courses.filter(c => c.tutorId === 1);
  const weekData = [
    { day: "Mon", views: 24 }, { day: "Tue", views: 38 }, { day: "Wed", views: 31 },
    { day: "Thu", views: 55 }, { day: "Fri", views: 42 }, { day: "Sat", views: 18 }, { day: "Sun", views: 12 },
  ];
  const max = Math.max(...weekData.map(d => d.views));

  return (
    <div className="fade-up">
      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 26, fontWeight: 700, marginBottom: 24 }}>Analytics</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }} className="mobile-grid">
        <StatCard label="TOTAL STUDENTS" value={fmt(myCourses.reduce((a, c) => a + c.students, 0))} sub="Across all courses" color={T.topaz} icon="👥" />
        <StatCard label="AVG RATING" value="4.85 ★" sub="Based on 127 reviews" color={T.gold} icon="⭐" />
      </div>

      {/* Weekly views bar chart */}
      <div style={{ background: T.surface, borderRadius: 16, padding: 24, border: `1px solid ${T.border}`, marginBottom: 24 }}>
        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Weekly Lesson Views</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
          {weekData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ color: T.muted, fontSize: 11 }}>{d.views}</div>
              <div style={{ width: "100%", background: `linear-gradient(180deg, ${T.topaz}, ${T.topazDark})`, borderRadius: "4px 4px 0 0", height: `${(d.views / max) * 90}px`, transition: "height 0.6s ease", boxShadow: `0 0 12px ${T.topazDim}` }} />
              <div style={{ color: T.muted, fontSize: 11 }}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Course performance */}
      <div style={{ background: T.surface, borderRadius: 16, padding: 24, border: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Course Performance</div>
        {myCourses.map(c => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: getCourseColor(c), flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{c.title}</div>
              <ProgressBar pct={Math.round((c.students / 120) * 100)} color={getCourseColor(c)} height={5} animated />
            </div>
            <div style={{ color: getCourseColor(c), fontWeight: 700, fontSize: 14, minWidth: 40, textAlign: "right" }}>{c.students}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tutor Dashboard ─────────────────────────────────────────────────────────*/
function TutorDashboard({ courses, onUpdateCourse, messages }) {
  const [section, setSection] = useState("overview");
  const [selectedId, setSelectedId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Alex Singh submitted Quiz 1 in Linear Algebra", type: "info" },
    { id: 2, text: "New enrollment: Maria Chen joined ML Fundamentals", type: "success" },
  ]);

  const myCourses = useMemo(() => courses.filter(c => c.tutorId === 1), [courses]);
  const totalStudents = useMemo(() => myCourses.reduce((a, c) => a + c.students, 0), [myCourses]);

  const saveCourse = useCallback((form) => {
    const existing = courses.find(c => c.id === form.id);
    if (existing) { onUpdateCourse({ ...existing, ...form }); }
    else { onUpdateCourse({ id: Date.now(), tutorId: 1, lessons: [], students: 0, rating: 0, enrolled: false, deadline: "2026-06-01", ...form }); }
    setCreating(false);
  }, [courses, onUpdateCourse]);

  if (creating) return (
    <div style={{ padding: "32px 36px" }} className="mobile-pad">
      <button onClick={() => setCreating(false)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", marginBottom: 20, fontSize: 13 }}>← Back</button>
      <CourseBuilder onSave={saveCourse} onCancel={() => setCreating(false)} />
    </div>
  );

  if (selectedId) {
    const course = courses.find(c => c.id === selectedId);
    if (!course) { setSelectedId(null); return null; }
    const color = getCourseColor(course);
    return (
      <div style={{ padding: "32px 36px" }} className="mobile-pad fade-in">
        <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", marginBottom: 20, fontSize: 13 }}>← All Courses</button>
        <div style={{ background: T.surface, borderRadius: 18, overflow: "hidden", border: `1px solid ${color}33`, marginBottom: 24 }}>
          <div style={{ height: 6, background: `linear-gradient(90deg, ${color}, ${color}55)` }} />
          <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <Badge text={course.category} color={color} />
              <Badge text={`★ ${course.rating}`} color={T.gold} />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{course.title}</div>
            <p style={{ color: T.muted, lineHeight: 1.6, marginBottom: 20 }}>{course.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }} className="mobile-stats">
              {[["Students", course.students, T.topaz], ["Lessons", course.lessons.length, T.blue], ["Rating", `${course.rating} ★`, T.gold]].map(([k, v, c]) => (
                <div key={k} style={{ background: T.surface2, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ color: T.muted, fontSize: 11, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <LessonManager course={course} onUpdate={onUpdateCourse} />
      </div>
    );
  }

  const sections = [
    { id: "overview", label: "Overview" }, { id: "analytics", label: "Analytics" }, { id: "gradebook", label: "Gradebook" },
  ];

  return (
    <div style={{ padding: "32px 36px" }} className="mobile-pad">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ color: T.muted, fontSize: 13, marginBottom: 4 }}>Good day,</div>
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 34, fontWeight: 700, lineHeight: 1 }}>Dr. Elena Voss</div>
        </div>
        <Btn onClick={() => setCreating(true)} size="lg">+ New Course</Btn>
      </div>

      {/* Notifications */}
      {notifications.map(n => <Notification key={n.id} text={n.text} type={n.type} onDismiss={() => setNotifications(ns => ns.filter(x => x.id !== n.id))} />)}
      {notifications.length > 0 && <div style={{ marginBottom: 20 }} />}

      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 2, marginBottom: 28, background: T.surface, borderRadius: 10, padding: 4, width: "fit-content", border: `1px solid ${T.border}` }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ padding: "8px 18px", borderRadius: 7, border: "none", background: section === s.id ? T.topaz : "transparent", color: section === s.id ? "#0A0806" : T.muted, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>{s.label}</button>
        ))}
      </div>

      {section === "overview" && (
        <div className="fade-up">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }} className="mobile-stats">
            <StatCard label="MY COURSES" value={myCourses.length} color={T.topaz} icon="📚" />
            <StatCard label="TOTAL STUDENTS" value={fmt(totalStudents)} color={T.blue} icon="👥" />
            <StatCard label="NEW MESSAGES" value={messages.filter(m => m.tutorId === 1 && m.from === "student").length} color={T.rose} icon="💬" />
            <StatCard label="AVG RATING" value="4.85★" color={T.gold} icon="⭐" />
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, fontWeight: 600, marginBottom: 16 }}>My Courses</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="mobile-grid">
            {myCourses.map(c => <CourseCard key={c.id} course={c} onClick={() => setSelectedId(c.id)} />)}
          </div>
        </div>
      )}
      {section === "analytics" && <Analytics courses={courses} />}
      {section === "gradebook" && <Gradebook courses={courses} />}
    </div>
  );
}

/* ─── Student Dashboard ───────────────────────────────────────────────────────*/
function StudentDashboard({ courses, onUpdateCourse, messages, onSendMessage }) {
  const [section, setSection] = useState("courses");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [msgText, setMsgText] = useState("");
  const [submitText, setSubmitText] = useState("");
  const [submittingId, setSubmittingId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [certCourse, setCertCourse] = useState(null);
  const msgEndRef = useRef(null);

  const enrolled = useMemo(() => courses.filter(c => c.enrolled), [courses]);
  const catalog   = useMemo(() => courses.filter(c => !c.enrolled && (filterCat === "All" || c.category === filterCat) && (c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))), [courses, filterCat, search]);

  const completeLesson = useCallback((courseId, lessonId) => {
    const course = courses.find(c => c.id === courseId);
    const updated = { ...course, lessons: course.lessons.map(l => l.id === lessonId ? { ...l, done: true } : l) };
    onUpdateCourse(updated);
    // Check for completion
    const newPct = getProgress(updated);
    if (newPct === 100) setTimeout(() => setCertCourse(updated), 400);
  }, [courses, onUpdateCourse]);

  const enroll = useCallback((courseId) => {
    onUpdateCourse({ ...courses.find(c => c.id === courseId), enrolled: true });
    setSection("courses");
  }, [courses, onUpdateCourse]);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const navSections = [
    { id: "courses", icon: "📚", label: "My Courses" },
    { id: "catalog", icon: "🔍", label: "Catalog" },
    { id: "progress", icon: "📈", label: "Progress" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "submit", icon: "📤", label: "Submit" },
  ];

  return (
    <div style={{ padding: "32px 36px" }} className="mobile-pad">
      {selectedLesson && (
        <LessonViewer lesson={selectedLesson} onClose={() => setSelectedLesson(null)}
          onComplete={() => { completeLesson(selectedId, selectedLesson.id); setSelectedLesson(null); }} />
      )}

      {/* Certificate modal */}
      {certCourse && (
        <Modal onClose={() => setCertCourse(null)} maxWidth={460}>
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎓</div>
            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 28, fontWeight: 700, marginBottom: 8, color: T.topaz }}>Course Complete!</div>
            <p style={{ color: T.textSoft, lineHeight: 1.7, marginBottom: 24 }}>Congratulations on completing <strong>{certCourse.title}</strong>. Your certificate is ready.</p>
            <div style={{ border: `2px solid ${T.topaz}44`, borderRadius: 12, padding: "20px 28px", marginBottom: 24, background: T.topazDim }}>
              <div style={{ color: T.muted, fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>CERTIFICATE OF COMPLETION</div>
              <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, fontWeight: 600, fontStyle: "italic", color: T.topazLight }}>Alex Singh</div>
              <div style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>{certCourse.title}</div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn onClick={() => setCertCourse(null)}>Download Certificate</Btn>
              <Btn variant="ghost" onClick={() => setCertCourse(null)}>Close</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 2, marginBottom: 28, background: T.surface, borderRadius: 10, padding: 4, border: `1px solid ${T.border}`, overflowX: "auto" }}>
        {navSections.map(s => (
          <button key={s.id} onClick={() => { setSection(s.id); setSelectedId(null); }}
            style={{ padding: "8px 16px", borderRadius: 7, border: "none", background: section === s.id ? T.topaz : "transparent", color: section === s.id ? "#0A0806" : T.muted, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="desktop-only">{s.icon}</span>{s.label}
          </button>
        ))}
      </div>

      {/* ── MY COURSES ── */}
      {section === "courses" && !selectedId && (
        <div className="fade-up">
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 30, fontWeight: 700, marginBottom: 6 }}>My Learning</div>
          <div style={{ color: T.muted, marginBottom: 28 }}>{enrolled.length} enrolled courses · {enrolled.reduce((a, c) => a + c.lessons.filter(l => l.done).length, 0)} lessons completed</div>
          {enrolled.length === 0
            ? <EmptyState icon="📚" title="No courses yet" sub="Browse the catalog to find your first course" action={<Btn onClick={() => setSection("catalog")}>Browse Catalog</Btn>} />
            : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="mobile-grid">
                {enrolled.map(c => <CourseCard key={c.id} course={c} onClick={() => setSelectedId(c.id)} />)}
              </div>
          }
        </div>
      )}

      {/* ── COURSE DETAIL ── */}
      {section === "courses" && selectedId && (() => {
        const course = courses.find(c => c.id === selectedId);
        if (!course) return null;
        const color = getCourseColor(course);
        const pct = getProgress(course);
        const tutor = TUTORS.find(t => t.id === course.tutorId);
        return (
          <div className="fade-in">
            <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", marginBottom: 20, fontSize: 13 }}>← My Courses</button>
            <div style={{ background: T.surface, borderRadius: 18, overflow: "hidden", border: `1px solid ${color}33`, marginBottom: 24 }}>
              <div style={{ height: 6, background: `linear-gradient(90deg, ${color}, ${color}55)` }} />
              <div style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}><Badge text={course.category} color={color} /></div>
                    <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 26, fontWeight: 700 }}>{course.title}</div>
                    <div style={{ color: T.muted, marginTop: 4, fontSize: 13 }}>by {tutor?.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 36, fontWeight: 700, color, lineHeight: 1 }}>{pct}%</div>
                    <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>Complete</div>
                  </div>
                </div>
                <div style={{ marginTop: 20 }}><ProgressBar pct={pct} color={color} height={8} animated /></div>
              </div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {course.lessons.map((lesson, i) => (
                <div key={lesson.id} className="lesson-row" onClick={() => setSelectedLesson(lesson)}
                  style={{ background: T.surface, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: `1px solid ${lesson.done ? color + "44" : T.border}`, cursor: "pointer", transition: "all 0.18s" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: lesson.done ? color : T.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 700, color: lesson.done ? "#0A0806" : T.muted, border: `2px solid ${lesson.done ? color : T.border2}` }}>
                    {lesson.done ? "✓" : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{lesson.title}</div>
                    <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>{lesson.type === "video" ? `▶ ${lesson.duration}` : lesson.type === "quiz" ? `✏️ ${lesson.questions} questions` : "📄 Reading"}</div>
                  </div>
                  {lesson.done && <Badge text="Done" color={T.green} small />}
                  <span style={{ color: T.muted, fontSize: 18 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── CATALOG ── */}
      {section === "catalog" && (
        <div className="fade-up">
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 30, fontWeight: 700, marginBottom: 20 }}>Course Catalog</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <input style={{ background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 14, flex: 1, minWidth: 200 }}
              value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search courses..." />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setFilterCat(c)}
                  style={{ padding: "8px 14px", borderRadius: 7, border: `1px solid ${filterCat === c ? T.topaz : T.border2}`, background: filterCat === c ? T.topazDim : "transparent", color: filterCat === c ? T.topaz : T.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{c}</button>
              ))}
            </div>
          </div>
          {catalog.length === 0
            ? <EmptyState icon="🔍" title="No courses found" sub="Try a different search or category" />
            : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="mobile-grid">
                {catalog.map(c => <CourseCard key={c.id} course={c} showEnroll onClick={() => {}} onEnroll={enroll} />)}
              </div>
          }
        </div>
      )}

      {/* ── PROGRESS ── */}
      {section === "progress" && (
        <div className="fade-up">
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Your Progress</div>
          <div style={{ color: T.muted, marginBottom: 28 }}>Track your learning journey across all enrolled courses</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28 }} className="mobile-stats">
            <StatCard label="LESSONS DONE" value={enrolled.reduce((a, c) => a + c.lessons.filter(l => l.done).length, 0)} color={T.green} icon="✓" />
            <StatCard label="COURSES ENROLLED" value={enrolled.length} color={T.topaz} icon="📚" />
            <StatCard label="OVERALL PROGRESS" value={`${enrolled.length ? Math.round(enrolled.reduce((a, c) => a + getProgress(c), 0) / enrolled.length) : 0}%`} color={T.blue} icon="📈" />
          </div>
          {enrolled.length === 0
            ? <EmptyState icon="📈" title="Nothing to track yet" sub="Enroll in a course to see your progress" action={<Btn onClick={() => setSection("catalog")}>Explore Courses</Btn>} />
            : enrolled.map(course => {
                const pct = getProgress(course);
                const color = getCourseColor(course);
                return (
                  <div key={course.id} style={{ background: T.surface, borderRadius: 16, padding: 24, border: `1px solid ${color}22`, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}><Badge text={course.category} color={color} /></div>
                        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 18, fontWeight: 600 }}>{course.title}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 34, fontWeight: 700, color, lineHeight: 1 }}>{pct}%</div>
                        <div style={{ color: T.muted, fontSize: 12 }}>{course.lessons.filter(l => l.done).length}/{course.lessons.length} lessons</div>
                      </div>
                    </div>
                    <ProgressBar pct={pct} color={color} height={10} animated />
                    {course.deadline && (
                      <div style={{ marginTop: 12 }}>
                        <Badge text={`Deadline: ${daysUntil(course.deadline)} days remaining`} color={daysUntil(course.deadline) > 7 ? T.green : T.rose} />
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
                      {[["Videos", "video", T.blue], ["Readings", "text", T.green], ["Quizzes", "quiz", T.rose]].map(([k, type, c]) => (
                        <div key={k} style={{ background: T.surface2, borderRadius: 8, padding: "10px 14px" }}>
                          <div style={{ color: T.muted, fontSize: 11, marginBottom: 4 }}>{k}</div>
                          <div style={{ fontWeight: 700, color: c, fontSize: 15 }}>
                            {course.lessons.filter(l => l.type === type && l.done).length}/{course.lessons.filter(l => l.type === type).length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
          }
        </div>
      )}

      {/* ── MESSAGES ── */}
      {section === "messages" && (
        <div className="fade-up">
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 30, fontWeight: 700, marginBottom: 24 }}>Messages</div>
          {enrolled.length === 0
            ? <EmptyState icon="💬" title="No conversations yet" sub="Enroll in a course to message your tutor" />
            : enrolled.map(course => {
                const tutor = TUTORS.find(t => t.id === course.tutorId);
                const courseMessages = messages.filter(m => m.courseId === course.id);
                const color = getCourseColor(course);
                return (
                  <div key={course.id} style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, marginBottom: 16, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12, background: T.surface2 }}>
                      <Avatar initials={tutor?.avatar || "?"} size={38} bg={color} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{tutor?.name}</div>
                        <div style={{ color: T.muted, fontSize: 12 }}>{course.title}</div>
                      </div>
                      <div style={{ marginLeft: "auto" }}><Badge text="Online" color={T.green} small /></div>
                    </div>
                    <div style={{ padding: "16px 20px", minHeight: 100, maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                      {courseMessages.length === 0 && <div style={{ color: T.muted, fontSize: 13, textAlign: "center", padding: "20px 0" }}>No messages yet. Say hello! 👋</div>}
                      {courseMessages.map(msg => (
                        <div key={msg.id} style={{ display: "flex", gap: 10, justifyContent: msg.from === "student" ? "flex-end" : "flex-start" }}>
                          {msg.from === "tutor" && <Avatar initials={tutor?.avatar || "?"} size={26} bg={color} />}
                          <div style={{ maxWidth: "72%", background: msg.from === "student" ? T.topazDim : T.surface2, borderRadius: 12, padding: "10px 14px", border: `1px solid ${msg.from === "student" ? T.topaz + "44" : T.border}` }}>
                            <div style={{ fontSize: 13, lineHeight: 1.6, color: T.textSoft }}>{msg.text}</div>
                            <div style={{ color: T.muted, fontSize: 10, marginTop: 4 }}>{msg.time}</div>
                          </div>
                        </div>
                      ))}
                      <div ref={msgEndRef} />
                    </div>
                    <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
                      <input style={{ background: T.surface2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, flex: 1 }}
                        value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && msgText.trim()) { onSendMessage(course.id, msgText); setMsgText(""); } }}
                        placeholder="Type a message… (Enter to send)" />
                      <Btn size="sm" onClick={() => { if (msgText.trim()) { onSendMessage(course.id, msgText); setMsgText(""); } }}>Send</Btn>
                    </div>
                  </div>
                );
              })
          }
        </div>
      )}

      {/* ── SUBMIT ── */}
      {section === "submit" && (
        <div className="fade-up">
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Submissions</div>
          <div style={{ color: T.muted, marginBottom: 28 }}>Submit assignments and track your submission history</div>
          {enrolled.length === 0
            ? <EmptyState icon="📤" title="Nothing to submit" sub="Enroll in a course first" />
            : enrolled.map(course => {
                const color = getCourseColor(course);
                const mySubs = submissions.filter(s => s.courseId === course.id);
                return (
                  <div key={course.id} style={{ background: T.surface, borderRadius: 16, padding: 24, border: `1px solid ${T.border}`, marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}><Badge text={course.category} color={color} /></div>
                    <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, fontWeight: 600, marginBottom: 16 }}>{course.title}</div>
                    {mySubs.map((s, i) => (
                      <div key={i} style={{ background: T.greenDim, borderRadius: 10, padding: "12px 16px", marginBottom: 10, border: `1px solid ${T.green}33` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>✓ Submitted</span>
                          <span style={{ color: T.muted, fontSize: 12 }}>{s.time}</span>
                        </div>
                        <div style={{ fontSize: 13, color: T.textSoft }}>{s.text}</div>
                        {s.file && <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>📎 {s.file}</div>}
                      </div>
                    ))}
                    {submittingId === course.id ? (
                      <div className="fade-up">
                        <Input label="Assignment notes / text submission" value={submitText} onChange={e => setSubmitText(e.target.value)} multiline rows={4} placeholder="Describe your work, paste code, or add notes…" />
                        <div style={{ background: T.surface2, border: `2px dashed ${T.border2}`, borderRadius: 10, padding: "20px", textAlign: "center", margin: "12px 0", cursor: "pointer" }}
                          onClick={() => alert("File picker — connect to backend storage")}>
                          <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>
                          <div style={{ color: T.muted, fontSize: 13 }}>Click to attach a file</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Btn onClick={() => { if (submitText.trim()) { setSubmissions(s => [...s, { courseId: course.id, text: submitText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]); setSubmitText(""); setSubmittingId(null); } }}>Submit Assignment</Btn>
                          <Btn variant="ghost" onClick={() => setSubmittingId(null)}>Cancel</Btn>
                        </div>
                      </div>
                    ) : (
                      <Btn onClick={() => setSubmittingId(course.id)}>+ New Submission</Btn>
                    )}
                  </div>
                );
              })
          }
        </div>
      )}
    </div>
  );
}

/* ─── Settings Page ───────────────────────────────────────────────────────────*/
function Settings({ role, onRoleChange, currentUser, onLogout }) {
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const nameParts = (currentUser?.name || "").split(" ");

  return (
    <div style={{ padding: "32px 36px" }} className="mobile-pad fade-in">
      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 30, fontWeight: 700, marginBottom: 28 }}>Settings</div>

      {[
        { title: "Profile", children: (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="mobile-grid">
              <Input label="First Name" value={nameParts[0] || ""} onChange={() => {}} />
              <Input label="Last Name"  value={nameParts.slice(1).join(" ") || ""} onChange={() => {}} />
            </div>
            <Input label="Email" value={currentUser?.email || ""} onChange={() => {}} />
            <Input label="Bio" value={role === "tutor" ? "Professor of Mathematics and Classical Studies." : "Lifelong learner. Interested in ML and finance."} onChange={() => {}} multiline rows={2} />
          </div>
        )},
        { title: "Account", children: (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "14px 16px", background: T.surface2, borderRadius: 10, border: `1px solid ${T.border}` }}>
              <Avatar initials={currentUser?.avatar || "?"} size={40} bg={role === "tutor" ? T.topaz : T.blue} />
              <div>
                <div style={{ fontWeight: 600 }}>{currentUser?.name}</div>
                <div style={{ color: T.muted, fontSize: 12, textTransform: "capitalize" }}>{role} Account · {currentUser?.email}</div>
              </div>
            </div>
            <Btn variant="danger" onClick={onLogout}>Sign Out of TutorNet</Btn>
          </div>
        )},
        { title: "Notifications", children: (
          <div style={{ display: "grid", gap: 14 }}>
            {[["email", "Email notifications"], ["push", "Push notifications"], ["weekly", "Weekly digest"]].map(([k, label]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: T.textSoft }}>{label}</span>
                <div onClick={() => setNotifs(n => ({ ...n, [k]: !n[k] }))}
                  style={{ width: 44, height: 24, borderRadius: 99, background: notifs[k] ? T.topaz : T.surface3, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ position: "absolute", top: 3, left: notifs[k] ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px #0004" }} />
                </div>
              </div>
            ))}
          </div>
        )},
      ].map(({ title, children }) => (
        <div key={title} style={{ background: T.surface, borderRadius: 16, padding: 24, border: `1px solid ${T.border}`, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 18, fontWeight: 600, marginBottom: 18 }}>{title}</div>
          {children}
        </div>
      ))}

      <Btn size="lg" onClick={save}>{saved ? "✓ Saved!" : "Save Changes"}</Btn>
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────────*/
function Sidebar({ role, page, onPage, onRoleChange, mobileOpen, onMobileClose, currentUser, onLogout }) {
  const tutorNav  = [["dashboard","📊","Dashboard"],["messages","💬","Messages"],["settings","⚙️","Settings"]];
  const studentNav = [["dashboard","🏠","Dashboard"],["settings","⚙️","Settings"]];
  const nav = role === "tutor" ? tutorNav : studentNav;

  const style = {
    width: 220, minHeight: "100vh", background: T.surface, borderRight: `1px solid ${T.border}`,
    display: "flex", flexDirection: "column", padding: "28px 0", flexShrink: 0, position: "relative", zIndex: 50,
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="mobile-only" onClick={onMobileClose} style={{ position: "fixed", inset: 0, background: "#000A", zIndex: 49 }} />}

      <div style={{ ...style, ...(mobileOpen ? { position: "fixed", left: 0, top: 0, animation: "slideIn 0.25s ease" } : {}) }} className={mobileOpen ? "" : "desktop-only"}>
        {/* Logo */}
        <div style={{ padding: "0 24px 32px", fontFamily: "'Cormorant Garamond'", fontSize: 28, fontWeight: 700, color: T.topaz, letterSpacing: -0.5 }}>
          TutorNet<span style={{ color: T.muted, fontSize: 14, fontWeight: 400, marginLeft: 4, fontFamily: "'DM Sans'" }}>β</span>
        </div>

        {/* Role badge (read-only after login) */}
        <div style={{ margin: "0 16px 24px", background: T.topazDim, borderRadius: 8, padding: "8px 14px", border: `1px solid ${T.border2}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>{role === "tutor" ? "📚" : "🎓"}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.topaz, textTransform: "capitalize" }}>{role} Account</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {nav.map(([id, icon, label]) => (
            <div key={id} className="nav-item" onClick={() => { onPage(id); onMobileClose(); }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 24px", cursor: "pointer", borderLeft: `3px solid ${page === id ? T.topaz : "transparent"}`, background: page === id ? T.topazDim : "transparent", color: page === id ? T.topaz : T.muted, fontSize: 14, fontWeight: 500, transition: "all 0.18s", userSelect: "none" }}>
              <span style={{ fontSize: 16 }}>{icon}</span>{label}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.border}`, margin: "0 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Avatar initials={currentUser?.avatar || (role === "tutor" ? "EV" : "AS")} size={34} bg={role === "tutor" ? T.topaz : T.blue} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{currentUser?.name || (role === "tutor" ? "Dr. Elena Voss" : "Alex Singh")}</div>
              <div style={{ color: T.muted, fontSize: 11, textTransform: "capitalize" }}>{role}</div>
            </div>
          </div>
          {onLogout && <Btn variant="ghost" size="sm" onClick={onLogout} style={{ width: "100%", justifyContent: "center", fontSize: 12 }}>Sign Out</Btn>}
        </div>
      </div>
    </>
  );
}

/* ─── Topbar ─────────────────────────────────────────────────────────────────*/
function Topbar({ page, role, unread, onMenuOpen }) {
  const titles = { dashboard: role === "tutor" ? "Tutor Hub" : "My Learning", messages: "Messages", settings: "Settings" };
  return (
    <div style={{ padding: "18px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: T.bg, position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button className="mobile-only" onClick={onMenuOpen}
          style={{ background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text, fontSize: 16 }}>☰</button>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 700 }}>{titles[page] || "TutorNet"}</div>
          <div style={{ color: T.muted, fontSize: 12 }}>Friday, February 20, 2026</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {unread > 0 && <div style={{ background: T.topaz, color: "#0A0806", borderRadius: 99, fontSize: 11, fontWeight: 700, padding: "3px 8px" }}>{unread} new</div>}
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.surface, border: `1px solid ${T.border2}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, position: "relative" }}>
          🔔
          {unread > 0 && <div style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: T.topaz, border: `2px solid ${T.bg}` }} />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AUTH SYSTEM
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Persistent user store backed by localStorage ───────────────────────── */
// Seed users — only written once, never overwritten on subsequent loads
const SEED_USERS = [
  { id: 1,  email: "elena@tutornet.edu",   password: "Tutor@123",  role: "tutor",   name: "Dr. Elena Voss",    avatar: "EV", approved: true  },
  { id: 2,  email: "james@tutornet.edu",   password: "Tutor@456",  role: "tutor",   name: "Prof. James Okoro", avatar: "JO", approved: true  },
  { id: 3,  email: "alex@student.edu",   password: "Student@1",  role: "student", name: "Alex Singh",        avatar: "AS", approved: true  },
  { id: 4,  email: "maria@student.edu",  password: "Student@2",  role: "student", name: "Maria Chen",        avatar: "MC", approved: true  },
  { id: 5,  email: "pending@tutornet.edu", password: "Tutor@789",  role: "tutor",   name: "Dr. Pending User",  avatar: "PU", approved: false },
  { id: 99, email: "admin@tutornet.edu",   password: "Admin@2026", role: "admin",   name: "Platform Admin",    avatar: "PA", approved: true  },
];

// Load from localStorage, falling back to seed data on first ever run
const loadUsers = () => {
  try {
    const stored = localStorage.getItem("tutornet_users");
    if (stored) return JSON.parse(stored);
  } catch {}
  // First run — seed and persist
  localStorage.setItem("tutornet_users", JSON.stringify(SEED_USERS));
  return SEED_USERS;
};

const saveUsers = (users) => {
  try { localStorage.setItem("tutornet_users", JSON.stringify(users)); } catch {}
};

// Live in-memory array, always in sync with localStorage
let MOCK_USERS = loadUsers();

// Helper: add a new user and persist immediately
const persistUser = (user) => {
  MOCK_USERS = [...MOCK_USERS, user];
  saveUsers(MOCK_USERS);
};

// Helper: update an existing user and persist
const persistUserUpdate = (id, changes) => {
  MOCK_USERS = MOCK_USERS.map(u => u.id === id ? { ...u, ...changes } : u);
  saveUsers(MOCK_USERS);
};

/* ─── Validation helpers ─────────────────────────────────────────────────── */
const VALIDATORS = {
  email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)  ? "" : "Enter a valid email address",
  password: v => v.length >= 8                          ? "" : "Password must be at least 8 characters",
  strongPw: v => /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(v) ? "" : "Must have 8+ chars, one uppercase & one number",
  name:     v => v.trim().length >= 2                   ? "" : "Full name is required (min 2 characters)",
  subject:  v => v.trim().length >= 2                   ? "" : "Subject / specialty is required",
  studentId:v => /^[A-Za-z0-9]{4,12}$/.test(v)         ? "" : "Student ID: 4–12 alphanumeric characters",
  required: v => v.trim().length > 0                    ? "" : "This field is required",
};

function useForm(initial) {
  const [values,  setValues]  = useState(initial);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const set  = (k) => (e) => setValues(v => ({ ...v, [k]: e.target.value }));
  const blur = (k, validator) => () => {
    setTouched(t => ({ ...t, [k]: true }));
    if (validator) setErrors(e => ({ ...e, [k]: validator(values[k]) }));
  };
  const validate = (rules) => {
    const errs = {};
    Object.entries(rules).forEach(([k, fn]) => { errs[k] = fn(values[k] || ""); });
    setErrors(errs); setTouched(Object.fromEntries(Object.keys(rules).map(k => [k, true])));
    return Object.values(errs).every(e => !e);
  };
  return { values, errors, touched, set, blur, validate, setValues };
}

/* ─── Shared Auth Input ──────────────────────────────────────────────────── */
function AuthInput({ label, type = "text", value, onChange, onBlur, error, placeholder, icon }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: T.textSoft, letterSpacing: 0.4 }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>{icon}</span>}
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder}
          style={{
            width: "100%", padding: `11px ${isPassword ? 42 : 14}px 11px ${icon ? 40 : 14}px`,
            background: T.surface, border: `1.5px solid ${error ? T.rose : T.border2}`,
            borderRadius: 10, color: T.text, fontSize: 14, transition: "border 0.2s", boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = error ? T.rose : T.topaz}
          onBlur2={e => e.target.style.borderColor = error ? T.rose : T.border2}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.muted, fontSize: 15, padding: 0 }}>
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && <div style={{ color: T.rose, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>⚠ {error}</div>}
    </div>
  );
}

/* ─── Password Strength Meter ────────────────────────────────────────────── */
function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters",    ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number",           ok: /[0-9]/.test(password) },
    { label: "Special char",     ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["#B84A35", "#B84A35", "#A07B10", "#3D7A45", "#3D7A45"];
  const labels = ["", "Weak", "Weak", "Fair", "Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= score ? colors[score] : T.surface3, transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {checks.map(c => (
            <span key={c.label} style={{ fontSize: 10, color: c.ok ? T.green : T.muted, display: "flex", alignItems: "center", gap: 3 }}>
              {c.ok ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: colors[score] }}>{labels[score]}</span>}
      </div>
    </div>
  );
}

/* ─── Role Selector Card ─────────────────────────────────────────────────── */
function RoleCard({ role: r, selected, onSelect }) {
  const config = {
    student: { icon: "🎓", title: "Student",  desc: "Browse courses, track progress, submit assignments", color: T.blue  },
    tutor:   { icon: "📚", title: "Tutor",    desc: "Create courses, manage lessons, track your students", color: T.topaz },
    admin:   { icon: "🛡️",  title: "Admin",   desc: "Manage users, courses, and platform settings",       color: T.rose  },
  };
  const c = config[r];
  return (
    <div onClick={() => onSelect(r)}
      style={{ background: selected ? c.color + "15" : T.surface, border: `2px solid ${selected ? c.color : T.border2}`, borderRadius: 14, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = c.color + "66"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = T.border2; }}>
      <div style={{ fontSize: 30, marginBottom: 10 }}>{c.icon}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: selected ? c.color : T.text, marginBottom: 6 }}>{c.title}</div>
      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{c.desc}</div>
      {selected && <div style={{ marginTop: 10, width: 20, height: 20, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "10px auto 0", color: "#fff", fontSize: 12 }}>✓</div>}
    </div>
  );
}

/* ─── Login Form ─────────────────────────────────────────────────────────── */
function LoginForm({ selectedRole, onLogin, onSwitch }) {
  const form = useForm({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const rules = {
    email:    VALIDATORS.email,
    password: VALIDATORS.password,
  };

  // Role-specific demo credential hints
  const hints = {
    student: { email: "alex@student.edu",   password: "Student@1"  },
    tutor:   { email: "elena@tutornet.edu",   password: "Tutor@123"  },
    admin:   { email: "admin@tutornet.edu",   password: "Admin@2026" },
  };

  const handleSubmit = () => {
    if (!form.validate(rules)) return;
    setLoading(true); setError("");
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === form.values.email && u.password === form.values.password && u.role === selectedRole);
      if (!user) { setError("Invalid email or password for this role."); setLoading(false); return; }
      if (!user.approved) { setError("Your account is pending admin approval."); setLoading(false); return; }
      // In production: POST /api/auth/login → receive JWT → store in httpOnly cookie
      onLogin(user);
    }, 900);
  };

  return (
    <div className="fade-up" style={{ display: "grid", gap: 18 }}>
      {error && <Notification text={error} type="error" onDismiss={() => setError("")} />}
      <AuthInput label="Email Address" type="email" icon="✉️"
        value={form.values.email} onChange={form.set("email")} onBlur={form.blur("email", VALIDATORS.email)}
        error={form.touched.email && form.errors.email} placeholder={hints[selectedRole]?.email} />
      <AuthInput label="Password" type="password" icon="🔒"
        value={form.values.password} onChange={form.set("password")} onBlur={form.blur("password", VALIDATORS.password)}
        error={form.touched.password && form.errors.password} placeholder="••••••••" />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontSize: 13, color: T.topaz, cursor: "pointer", fontWeight: 600 }}>Forgot password?</span>
      </div>

      {/* Demo hint */}
      <div style={{ background: T.topazDim, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>DEMO CREDENTIALS</div>
        <div style={{ fontSize: 12, color: T.textSoft }}>
          📧 <span style={{ fontFamily: "monospace", color: T.topaz }}>{hints[selectedRole]?.email}</span>
          {"  "}🔑 <span style={{ fontFamily: "monospace", color: T.topaz }}>{hints[selectedRole]?.password}</span>
        </div>
      </div>

      <Btn size="lg" onClick={handleSubmit} style={{ width: "100%", justifyContent: "center" }}>
        {loading ? <span style={{ display: "inline-block", width: 16, height: 16, border: `2px solid #fff4`, borderTop: `2px solid #fff`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
      </Btn>
      {selectedRole !== "admin" && (
        <div style={{ textAlign: "center", fontSize: 13, color: T.muted }}>
          Don't have an account?{" "}
          <span style={{ color: T.topaz, fontWeight: 600, cursor: "pointer" }} onClick={onSwitch}>Create one →</span>
        </div>
      )}
    </div>
  );
}

/* ─── Register Form ──────────────────────────────────────────────────────── */
function RegisterForm({ selectedRole, onRegister, onSwitch }) {
  const form = useForm({ name: "", email: "", password: "", confirm: "", studentId: "", subject: "", agree: false });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const baseRules = { name: VALIDATORS.name, email: VALIDATORS.email, password: VALIDATORS.strongPw };
  const studentRules = { ...baseRules, studentId: VALIDATORS.studentId };
  const tutorRules   = { ...baseRules, subject: VALIDATORS.subject };
  const rules = selectedRole === "student" ? studentRules : tutorRules;

  const handleSubmit = () => {
    if (!form.values.agree) { setError("You must agree to the Terms of Service."); return; }
    if (form.values.password !== form.values.confirm) { setError("Passwords do not match."); return; }
    if (!form.validate(rules)) return;
    if (MOCK_USERS.find(u => u.email === form.values.email)) { setError("An account with this email already exists."); return; }
    setLoading(true); setError("");
    setTimeout(() => {
      const newUser = {
        id: Date.now(), email: form.values.email, password: form.values.password,
        role: selectedRole, name: form.values.name,
        avatar: form.values.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase(),
        approved: selectedRole === "student", // tutors need admin approval
        ...(selectedRole === "student" ? { studentId: form.values.studentId } : { subject: form.values.subject }),
      };
      persistUser(newUser);
      if (selectedRole === "tutor") {
        setLoading(false);
        setError(""); 
        // show approval pending instead of logging in
        onRegister(null, "pending");
      } else {
        onRegister(newUser);
      }
    }, 900);
  };

  return (
    <div className="fade-up" style={{ display: "grid", gap: 16 }}>
      {error && <Notification text={error} type="error" onDismiss={() => setError("")} />}
      <AuthInput label="Full Name" icon="👤"
        value={form.values.name} onChange={form.set("name")} onBlur={form.blur("name", VALIDATORS.name)}
        error={form.touched.name && form.errors.name} placeholder="Your full name" />
      <AuthInput label="Email Address" type="email" icon="✉️"
        value={form.values.email} onChange={form.set("email")} onBlur={form.blur("email", VALIDATORS.email)}
        error={form.touched.email && form.errors.email} placeholder="you@example.com" />
      {selectedRole === "student" && (
        <AuthInput label="Student ID" icon="🪪"
          value={form.values.studentId} onChange={form.set("studentId")} onBlur={form.blur("studentId", VALIDATORS.studentId)}
          error={form.touched.studentId && form.errors.studentId} placeholder="e.g. STU20240012" />
      )}
      {selectedRole === "tutor" && (
        <AuthInput label="Subject / Specialty" icon="🎓"
          value={form.values.subject} onChange={form.set("subject")} onBlur={form.blur("subject", VALIDATORS.subject)}
          error={form.touched.subject && form.errors.subject} placeholder="e.g. Mathematics, Computer Science" />
      )}
      <div>
        <AuthInput label="Password" type="password" icon="🔒"
          value={form.values.password} onChange={form.set("password")} onBlur={form.blur("password", VALIDATORS.strongPw)}
          error={form.touched.password && form.errors.password} placeholder="Create a strong password" />
        <PasswordStrength password={form.values.password} />
      </div>
      <AuthInput label="Confirm Password" type="password" icon="🔒"
        value={form.values.confirm} onChange={form.set("confirm")}
        error={form.values.confirm && form.values.confirm !== form.values.password ? "Passwords do not match" : ""}
        placeholder="Repeat your password" />

      {/* Terms */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <input type="checkbox" checked={form.values.agree} onChange={e => form.setValues(v => ({ ...v, agree: e.target.checked }))}
          style={{ marginTop: 3, accentColor: T.topaz, width: 16, height: 16, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
          I agree to the <span style={{ color: T.topaz, cursor: "pointer" }}>Terms of Service</span> and <span style={{ color: T.topaz, cursor: "pointer" }}>Privacy Policy</span>
          {selectedRole === "tutor" && <span style={{ color: T.rose }}> · Tutor accounts require admin approval before activation.</span>}
        </span>
      </div>

      <Btn size="lg" onClick={handleSubmit} style={{ width: "100%", justifyContent: "center" }}>
        {loading
          ? <span style={{ display: "inline-block", width: 16, height: 16, border: `2px solid #fff4`, borderTop: `2px solid #fff`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          : selectedRole === "tutor" ? "Apply as Tutor" : "Create Student Account"}
      </Btn>
      <div style={{ textAlign: "center", fontSize: 13, color: T.muted }}>
        Already have an account?{" "}
        <span style={{ color: T.topaz, fontWeight: 600, cursor: "pointer" }} onClick={onSwitch}>Sign in →</span>
      </div>
    </div>
  );
}

/* ─── Auth Page (Landing + Login / Register) ─────────────────────────────── */
function AuthPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState("student");
  const [authMode,     setAuthMode]     = useState("login");   // "login" | "register" | "pending"

  const handleLogin    = (user)          => onLogin(user);
  const handleRegister = (user, status)  => { if (status === "pending") { setAuthMode("pending"); } else { onLogin(user); } };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "stretch" }}>
      {/* Left decorative panel */}
      <div className="desktop-only" style={{ width: "42%", background: `linear-gradient(160deg, ${T.topaz} 0%, ${T.topazDark} 60%, #2C1E0F 100%)`, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 48px", position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80,  right: -80,  width: 300, height: 300, borderRadius: "50%", background: "#ffffff08" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "#ffffff06" }} />
        <div style={{ position: "absolute", top: "40%", left: "30%", width: 180, height: 180, borderRadius: "50%", background: "#ffffff05" }} />

        <div>
          <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 42, fontWeight: 700, color: "#fff", letterSpacing: -1, marginBottom: 16, lineHeight: 1.1 }}>TutorNet</div>
          <div style={{ color: "#ffffff99", fontSize: 15, lineHeight: 1.8 }}>The intelligent platform for tutors and students to connect, learn, and grow.</div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          {[
            { icon: "🎓", stat: "2,400+", label: "Active Students"  },
            { icon: "📚", stat: "180+",   label: "Courses Published" },
            { icon: "⭐", stat: "4.9",    label: "Average Rating"    },
          ].map(s => (
            <div key={s.stat} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ffffff18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.stat}</div>
                <div style={{ color: "#ffffff88", fontSize: 13 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ color: "#ffffff44", fontSize: 12 }}>© 2026 TutorNet · All rights reserved</div>
      </div>

      {/* Right: Auth panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 480 }} className="fade-up">

          {/* Mobile logo */}
          <div className="mobile-only" style={{ fontFamily: "'Cormorant Garamond'", fontSize: 32, fontWeight: 700, color: T.topaz, textAlign: "center", marginBottom: 28 }}>TutorNet</div>

          {authMode === "pending" ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>⏳</div>
              <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Application Submitted!</div>
              <p style={{ color: T.muted, lineHeight: 1.7, marginBottom: 28 }}>Your tutor account is pending admin review. You'll receive an email once approved — usually within 24 hours.</p>
              <Btn onClick={() => { setAuthMode("login"); setSelectedRole("student"); }}>Back to Sign In</Btn>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 30, fontWeight: 700, marginBottom: 4 }}>
                  {authMode === "login" ? "Welcome back" : "Create your account"}
                </div>
                <div style={{ color: T.muted, fontSize: 14 }}>
                  {authMode === "login" ? "Sign in to continue to TutorNet" : "Join TutorNet — it's free to get started"}
                </div>
              </div>

              {/* Role selector */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: 0.5, marginBottom: 10 }}>I AM A</div>
                <div style={{ display: "grid", gridTemplateColumns: authMode === "login" ? "1fr 1fr 1fr" : "1fr 1fr", gap: 10 }}>
                  {(authMode === "login" ? ["student","tutor","admin"] : ["student","tutor"]).map(r => (
                    <RoleCard key={r} role={r} selected={selectedRole === r} onSelect={setSelectedRole} />
                  ))}
                </div>
              </div>

              <div style={{ background: T.surface, borderRadius: 16, padding: "28px 28px", border: `1px solid ${T.border2}`, boxShadow: `0 4px 24px ${T.topazDim}` }}>
                {authMode === "login"
                  ? <LoginForm    selectedRole={selectedRole} onLogin={handleLogin}    onSwitch={() => setAuthMode("register")} />
                  : <RegisterForm selectedRole={selectedRole} onRegister={handleRegister} onSwitch={() => setAuthMode("login")} />
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */
function AdminDashboard({ courses, onUpdateCourse, onLogout }) {
  const [section,    setSection]    = useState("overview");
  const [users,      setUsers]      = useState(MOCK_USERS.filter(u => u.role !== "admin"));
  const [filterRole, setFilterRole] = useState("all");
  const [search,     setSearch]     = useState("");
  const [toast,      setToast]      = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const approveUser  = (id) => { setUsers(us => us.map(u => u.id === id ? { ...u, approved: true  } : u)); persistUserUpdate(id, { approved: true });  showToast(`${users.find(x => x.id === id)?.name} approved successfully`); };
  const suspendUser  = (id) => { const u = users.find(x => x.id === id); const next = !u?.suspended; setUsers(us => us.map(u => u.id === id ? { ...u, suspended: next } : u)); persistUserUpdate(id, { suspended: next }); showToast("User status updated"); };
  const deleteUser   = (id) => { if (!window.confirm("Remove this user permanently?")) return; setUsers(us => us.filter(u => u.id !== id)); showToast("User removed", "error"); };
  const deleteCourse = (id) => { if (!window.confirm("Delete this course?")) return; onUpdateCourse({ id, _delete: true }); showToast("Course deleted", "error"); };

  const filtered = users.filter(u =>
    (filterRole === "all" || u.role === filterRole) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    students: users.filter(u => u.role === "student").length,
    tutors:   users.filter(u => u.role === "tutor" && u.approved).length,
    pending:  users.filter(u => u.role === "tutor" && !u.approved).length,
    courses:  courses.length,
  };

  const roleColors = { student: T.blue, tutor: T.topaz, admin: T.rose };

  const sections = [
    { id: "overview", icon: "📊", label: "Overview"   },
    { id: "users",    icon: "👥", label: "Users"       },
    { id: "courses",  icon: "📚", label: "Courses"     },
    { id: "pending",  icon: "⏳", label: `Pending (${stats.pending})` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex" }}>
      {/* Toast */}
      {toast && (
        <div className="fade-up" style={{ position: "fixed", top: 24, right: 24, zIndex: 999, background: toast.type === "error" ? T.roseDim : T.greenDim, border: `1px solid ${toast.type === "error" ? T.rose : T.green}44`, borderRadius: 10, padding: "12px 18px", fontSize: 14, color: toast.type === "error" ? T.rose : T.green, fontWeight: 600 }}>
          {toast.type === "error" ? "✗ " : "✓ "}{toast.msg}
        </div>
      )}

      {/* Admin Sidebar */}
      <div style={{ width: 230, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "28px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 24px 8px", fontFamily: "'Cormorant Garamond'", fontSize: 26, fontWeight: 700, color: T.topaz }}>TutorNet</div>
        <div style={{ padding: "0 24px 28px", fontSize: 11, fontWeight: 700, color: T.rose, letterSpacing: 1 }}>ADMIN PANEL</div>
        <nav style={{ flex: 1 }}>
          {sections.map(s => (
            <div key={s.id} className="nav-item" onClick={() => setSection(s.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 24px", cursor: "pointer", borderLeft: `3px solid ${section === s.id ? T.topaz : "transparent"}`, background: section === s.id ? T.topazDim : "transparent", color: section === s.id ? T.topaz : T.muted, fontSize: 14, fontWeight: 500, transition: "all 0.18s" }}>
              <span>{s.icon}</span>{s.label}
              {s.id === "pending" && stats.pending > 0 && <span style={{ marginLeft: "auto", background: T.rose, color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>{stats.pending}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Avatar initials="PA" size={34} bg={T.rose} />
            <div><div style={{ fontSize: 13, fontWeight: 600 }}>Platform Admin</div><div style={{ color: T.muted, fontSize: 11 }}>Super Admin</div></div>
          </div>
          <Btn variant="ghost" size="sm" onClick={onLogout} style={{ width: "100%", justifyContent: "center" }}>Sign Out</Btn>
        </div>
      </div>

      {/* Admin Main */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "20px 32px", borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 700 }}>
              {sections.find(s => s.id === section)?.label || "Admin"}
            </div>
            <div style={{ color: T.muted, fontSize: 12 }}>TutorNet Administration · Feb 20, 2026</div>
          </div>
          <Badge text="Admin Access" color={T.rose} />
        </div>

        <div style={{ padding: "32px" }}>

          {/* ── OVERVIEW ── */}
          {section === "overview" && (
            <div className="fade-up">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
                <StatCard label="TOTAL STUDENTS" value={stats.students}  color={T.blue}  icon="🎓" />
                <StatCard label="ACTIVE TUTORS"  value={stats.tutors}    color={T.topaz} icon="📚" />
                <StatCard label="TOTAL COURSES"  value={stats.courses}   color={T.green} icon="📖" sub="Across all tutors" />
                <StatCard label="PENDING TUTORS" value={stats.pending}   color={T.rose}  icon="⏳" sub="Awaiting approval" />
              </div>

              {/* Recent activity */}
              <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Recent Activity</div>
              <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                {[
                  { icon: "👤", text: "New tutor application: Dr. Pending User", time: "2 min ago",  type: "warning" },
                  { icon: "📚", text: "New course published: Financial Modeling",  time: "1 hr ago",  type: "success" },
                  { icon: "🎓", text: "Student registered: Maria Chen",             time: "3 hrs ago", type: "info"    },
                  { icon: "⭐", text: "Course rated 5★: Machine Learning Fundamentals", time: "5 hrs ago", type: "success" },
                  { icon: "🚩", text: "Content flagged for review in Classical Rhetoric", time: "1 day ago", type: "error" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{a.icon}</div>
                    <div style={{ flex: 1, fontSize: 14, color: T.textSoft }}>{a.text}</div>
                    <div style={{ color: T.muted, fontSize: 12, whiteSpace: "nowrap" }}>{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {section === "users" && (
            <div className="fade-up">
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <input style={{ background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 14, flex: 1, minWidth: 200 }}
                  value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search users by name or email…" />
                {["all","student","tutor"].map(r => (
                  <button key={r} onClick={() => setFilterRole(r)}
                    style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${filterRole === r ? T.topaz : T.border2}`, background: filterRole === r ? T.topazDim : "transparent", color: filterRole === r ? T.topaz : T.muted, fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>{r === "all" ? "All Users" : r + "s"}</button>
                ))}
              </div>
              <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 120px", padding: "12px 20px", background: T.surface2, borderBottom: `1px solid ${T.border}`, gap: 12 }}>
                  {["Name","Email","Role","Status","Joined","Actions"].map(h => <div key={h} style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: 0.5 }}>{h.toUpperCase()}</div>)}
                </div>
                {filtered.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: T.muted }}>No users found</div>}
                {filtered.map((u, i) => (
                  <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 120px", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none", gap: 12, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={u.avatar} size={30} bg={roleColors[u.role] || T.topaz} />
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{u.name}</span>
                    </div>
                    <div style={{ fontSize: 13, color: T.muted }}>{u.email}</div>
                    <Badge text={u.role} color={roleColors[u.role] || T.muted} small />
                    <div>
                      {u.suspended
                        ? <Badge text="Suspended" color={T.rose} small />
                        : u.approved
                          ? <Badge text="Active" color={T.green} small />
                          : <Badge text="Pending" color={T.gold} small />}
                    </div>
                    <div style={{ fontSize: 12, color: T.muted }}>Jan 2026</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => suspendUser(u.id)} title={u.suspended ? "Unsuspend" : "Suspend"}
                        style={{ background: T.goldDim, border: `1px solid ${T.gold}44`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12, color: T.gold }}>
                        {u.suspended ? "↩" : "⏸"}
                      </button>
                      <button onClick={() => deleteUser(u.id)} title="Remove user"
                        style={{ background: T.roseDim, border: `1px solid ${T.rose}44`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12, color: T.rose }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── COURSES ── */}
          {section === "courses" && (
            <div className="fade-up">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {courses.map(c => {
                  const color = getCourseColor(c);
                  const tutor = TUTORS.find(t => t.id === c.tutorId);
                  return (
                    <div key={c.id} style={{ background: T.surface, borderRadius: 14, padding: 20, border: `1px solid ${color}22` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <Badge text={c.category} color={color} />
                        <span style={{ color: T.gold, fontSize: 12 }}>★ {c.rating}</span>
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
                      <div style={{ color: T.muted, fontSize: 12, marginBottom: 14 }}>by {tutor?.name} · {c.students} students · {c.lessons.length} lessons</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Badge text="Published" color={T.green} small />
                        <button onClick={() => deleteCourse(c.id)}
                          style={{ marginLeft: "auto", background: T.roseDim, border: `1px solid ${T.rose}44`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: T.rose }}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── PENDING TUTORS ── */}
          {section === "pending" && (
            <div className="fade-up">
              {stats.pending === 0 ? (
                <EmptyState icon="✅" title="All clear!" sub="No pending tutor applications" />
              ) : (
                users.filter(u => u.role === "tutor" && !u.approved).map(u => (
                  <div key={u.id} style={{ background: T.surface, borderRadius: 14, padding: 22, border: `1px solid ${T.gold}33`, marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                      <Avatar initials={u.avatar} size={48} bg={T.topaz} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{u.name}</div>
                        <div style={{ color: T.muted, fontSize: 13, marginBottom: 4 }}>✉️ {u.email}</div>
                        {u.subject && <div style={{ color: T.muted, fontSize: 13, marginBottom: 10 }}>🎓 {u.subject}</div>}
                        <Badge text="Pending Approval" color={T.gold} />
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Btn variant="success" size="sm" onClick={() => approveUser(u.id)}>✓ Approve</Btn>
                        <Btn variant="danger"  size="sm" onClick={() => deleteUser(u.id)}>✕ Reject</Btn>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ─── Root App ────────────────────────────────────────────────────────────────*/
export default function App() {
  // Restore session from localStorage so refresh doesn't log the user out
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("tutornet_session");
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Re-validate against current user store (handles suspension/deletion)
      const fresh = MOCK_USERS.find(u => u.id === parsed.id && u.email === parsed.email);
      return (fresh && fresh.approved && !fresh.suspended) ? fresh : null;
    } catch { return null; }
  });
  const [page,        setPage]        = useState("dashboard");
  const [courses,     setCourses]     = useState(SEED_COURSES);
  const [messages,    setMessages]    = useState(SEED_MESSAGES);
  const [mobileNav,   setMobileNav]   = useState(false);

  const updateCourse = useCallback((updated) => {
    if (updated._delete) { setCourses(cs => cs.filter(c => c.id !== updated.id)); return; }
    setCourses(cs => cs.some(c => c.id === updated.id) ? cs.map(c => c.id === updated.id ? updated : c) : [...cs, updated]);
  }, []);

  const sendMessage = useCallback((courseId, text) => {
    setMessages(ms => [...ms, {
      id: Date.now(), from: "student",
      tutorId: courses.find(c => c.id === courseId)?.tutorId,
      courseId, text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: "Today",
    }]);
  }, [courses]);

  const handleLogin  = useCallback((user) => {
    try { localStorage.setItem("tutornet_session", JSON.stringify(user)); } catch {}
    setCurrentUser(user); setPage("dashboard");
  }, []);
  const handleLogout = useCallback(() => {
    try { localStorage.removeItem("tutornet_session"); } catch {}
    setCurrentUser(null); setPage("dashboard");
  }, []);

  // Determine the "role" used by existing sidebar (tutor/student) from the logged-in user
  const role = currentUser?.role || "student";

  // Sync sidebar role toggle with the logged in user role
  const changeRole = useCallback((r) => {
    // Only allow role switching if not actually logged in (demo mode removed — in real app remove this)
    setPage("dashboard");
  }, []);

  const unread = messages.filter(m => m.from === "tutor").length;

  // ── Not logged in → show auth page
  if (!currentUser) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <AuthPage onLogin={handleLogin} />
      </>
    );
  }

  // ── Admin → show admin dashboard
  if (currentUser.role === "admin") {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <AdminDashboard courses={courses} onUpdateCourse={updateCourse} onLogout={handleLogout} />
      </>
    );
  }

  // ── Tutor / Student → existing platform
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
        <Sidebar role={role} page={page} onPage={setPage} onRoleChange={changeRole} mobileOpen={mobileNav} onMobileClose={() => setMobileNav(false)} currentUser={currentUser} onLogout={handleLogout} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "auto" }}>
          <Topbar page={page} role={role} unread={unread} onMenuOpen={() => setMobileNav(true)} />
          <div style={{ flex: 1 }}>
            {page === "dashboard" && role === "tutor"   && <TutorDashboard   courses={courses} onUpdateCourse={updateCourse} messages={messages} />}
            {page === "dashboard" && role === "student" && <StudentDashboard courses={courses} onUpdateCourse={updateCourse} messages={messages} onSendMessage={sendMessage} />}
            {page === "messages"  && role === "tutor"   && (
              <div style={{ padding: "32px 36px" }} className="mobile-pad fade-in">
                <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 30, fontWeight: 700, marginBottom: 24 }}>Student Messages</div>
                {messages.filter(m => m.tutorId === 1 && m.from === "student").map(msg => {
                  const course = courses.find(c => c.id === msg.courseId);
                  return (
                    <div key={msg.id} style={{ background: T.surface, borderRadius: 12, padding: "16px 20px", border: `1px solid ${T.border}`, marginBottom: 12, display: "flex", gap: 14 }}>
                      <Avatar initials="AS" size={36} bg={T.blue} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>Alex Singh</span>
                          <span style={{ color: T.muted, fontSize: 12 }}>{msg.time}</span>
                        </div>
                        <div style={{ color: T.muted, fontSize: 12, marginBottom: 6 }}>Re: {course?.title}</div>
                        <div style={{ fontSize: 14, color: T.textSoft }}>{msg.text}</div>
                        <div style={{ marginTop: 10 }}><Btn size="sm" variant="ghost">Reply</Btn></div>
                      </div>
                    </div>
                  );
                })}
                {messages.filter(m => m.tutorId === 1 && m.from === "student").length === 0 && (
                  <EmptyState icon="💬" title="No messages yet" sub="Students will appear here once they message you" />
                )}
              </div>
            )}
            {page === "settings" && <Settings role={role} onRoleChange={changeRole} currentUser={currentUser} onLogout={handleLogout} />}
          </div>
        </div>
      </div>
    </>
  );
}
