import { useState, useRef, useEffect } from "react";

// ── Design Tokens ──────────────────────────────────────────────
const C = {
  bg: "#F7F6F3",
  surface: "#FFFFFF",
  surface2: "#F2F2F0",
  surface3: "#EAEAE8",
  border: "#E4E4E0",
  text: "#111111",
  textSub: "#5A5A54",
  textMuted: "#AAAAAA",
  accent: "#F5A623",
  accentSoft: "rgba(245,166,35,0.1)",
  accentBorder: "rgba(245,166,35,0.3)",
  blue: "#3B82F6",
  blueSoft: "rgba(59,130,246,0.1)",
  blueBorder: "rgba(59,130,246,0.3)",
  green: "#22C55E",
  greenSoft: "rgba(34,197,94,0.1)",
  error: "#DC2626",
  errorBg: "#FEF2F2",
  shadow: "0 4px 24px rgba(0,0,0,0.06)",
};

// ── 업종 / 분야 데이터 ─────────────────────────────────────────
const INDUSTRIES = [
  { id: "food", label: "요식업·카페", emoji: "🍽️" },
  { id: "retail", label: "소매·유통", emoji: "🛒" },
  { id: "it", label: "IT·소프트웨어", emoji: "💻" },
  { id: "content", label: "콘텐츠·미디어", emoji: "🎬" },
  { id: "education", label: "교육·강의", emoji: "📚" },
  { id: "beauty", label: "뷰티·헬스", emoji: "💄" },
  { id: "construction", label: "건설·인테리어", emoji: "🏗️" },
  { id: "logistics", label: "물류·배송", emoji: "🚚" },
  { id: "finance", label: "금융·보험", emoji: "💰" },
  { id: "consulting", label: "컨설팅·전문직", emoji: "📋" },
  { id: "manufacturing", label: "제조·생산", emoji: "🏭" },
  { id: "ecommerce", label: "이커머스", emoji: "📦" },
  { id: "pet", label: "반려동물", emoji: "🐾" },
  { id: "travel", label: "여행·레저", emoji: "✈️" },
  { id: "other", label: "기타", emoji: "✦" },
];

const INTEREST_FIELDS = [
  { id: "it", label: "IT·앱·소프트웨어", emoji: "💻" },
  { id: "food", label: "푸드·음료·카페", emoji: "🍽️" },
  { id: "content", label: "콘텐츠·유튜브", emoji: "🎬" },
  { id: "retail", label: "소매·이커머스", emoji: "🛒" },
  { id: "education", label: "교육·코칭", emoji: "📚" },
  { id: "beauty", label: "뷰티·패션", emoji: "💄" },
  { id: "health", label: "헬스·웰니스", emoji: "🏃" },
  { id: "hardware", label: "하드웨어·제조", emoji: "🔧" },
  { id: "finance", label: "금융·핀테크", emoji: "💰" },
  { id: "social", label: "소셜임팩트", emoji: "🌱" },
  { id: "pet", label: "반려동물", emoji: "🐾" },
  { id: "other", label: "아직 모르겠어요", emoji: "🤔" },
];

// ── 에이전트 정의 ──────────────────────────────────────────────
const OWNER_AGENTS = {
  finance: { id: "finance", name: "AI 재무", emoji: "💰", color: "#F5A623", colorSoft: "rgba(245,166,35,0.12)", desc: "매출·지출 관리, 현금흐름 분석", quickPrompts: ["이번 달 수익 분석해줘", "비용 절감 방법 알려줘", "현금흐름 계획 짜줘", "손익계산서 만들어줘"] },
  tax: { id: "tax", name: "AI 세무", emoji: "📊", color: "#8B5CF6", colorSoft: "rgba(139,92,246,0.12)", desc: "부가세, 종합소득세, 경비 처리", quickPrompts: ["부가세 신고 방법 알려줘", "경비 처리 가능한 항목은?", "종합소득세 절세 방법", "세금 계산해줘"] },
  marketing: { id: "marketing", name: "AI 마케터", emoji: "📣", color: "#EC4899", colorSoft: "rgba(236,72,153,0.12)", desc: "SNS 전략, 고객 확보, 브랜딩", quickPrompts: ["SNS 마케팅 전략 짜줘", "신규 고객 확보 방법", "브랜딩 방향 잡아줘", "콘텐츠 캘린더 만들어줘"] },
  cs: { id: "cs", name: "AI CS", emoji: "🎧", color: "#06B6D4", colorSoft: "rgba(6,182,212,0.12)", desc: "고객 응대, 불만 처리, 리뷰 관리", quickPrompts: ["고객 불만 답변 작성해줘", "환불 정책 만들어줘", "리뷰 관리 방법", "FAQ 만들어줘"] },
  contract: { id: "contract", name: "AI 법무", emoji: "⚖️", color: "#64748B", colorSoft: "rgba(100,116,139,0.12)", desc: "계약서 검토, 법적 분쟁 대응", quickPrompts: ["계약서 검토해줘", "표준 계약서 만들어줘", "분쟁 대응 방법", "개인정보처리방침 만들어줘"] },
  hr: { id: "hr", name: "AI 인사", emoji: "👥", color: "#10B981", colorSoft: "rgba(16,185,129,0.12)", desc: "채용, 근로계약, 급여 관리", quickPrompts: ["채용 공고 작성해줘", "근로계약서 만들어줘", "급여 계산해줘", "직원 평가 기준 만들어줘"] },
  operations: { id: "operations", name: "AI 운영", emoji: "⚙️", color: "#F59E0B", colorSoft: "rgba(245,158,11,0.12)", desc: "업무 자동화, 프로세스 개선", quickPrompts: ["업무 프로세스 개선해줘", "자동화할 수 있는 업무 찾아줘", "업무 매뉴얼 만들어줘", "생산성 높이는 방법"] },
  growth: { id: "growth", name: "AI 성장전략", emoji: "📈", color: "#EF4444", colorSoft: "rgba(239,68,68,0.12)", desc: "매출 성장, 신규 사업, 확장 전략", quickPrompts: ["매출 성장 전략 짜줘", "신규 사업 아이디어", "경쟁사 분석해줘", "확장 계획 세워줘"] },
  planner: { id: "planner", name: "AI 기획", emoji: "📋", color: "#3B82F6", colorSoft: "rgba(59,130,246,0.12)", desc: "사업 전략, 기획, 의사결정 지원", quickPrompts: ["사업 방향 잡아줘", "SWOT 분석해줘", "올해 목표 세워줘", "의사결정 도와줘"] },
};

const STARTUP_AGENTS = {
  validator: { id: "validator", name: "AI 검증전문가", emoji: "🔍", color: "#8B5CF6", colorSoft: "rgba(139,92,246,0.12)", desc: "아이디어 검증, 시장성 분석", quickPrompts: ["아이디어 검증해줘", "시장성 분석해줘", "경쟁사 조사해줘", "타겟 고객 설정해줘"] },
  planner: { id: "planner", name: "AI 기획자", emoji: "📋", color: "#3B82F6", colorSoft: "rgba(59,130,246,0.12)", desc: "사업계획서, 로드맵 작성", quickPrompts: ["사업계획서 작성해줘", "실행 로드맵 짜줘", "비즈니스 모델 설계해줘", "MVP 기획해줘"] },
  marketer: { id: "marketer", name: "AI 마케터", emoji: "📣", color: "#EC4899", colorSoft: "rgba(236,72,153,0.12)", desc: "초기 마케팅, 고객 확보 전략", quickPrompts: ["첫 고객 확보 방법", "마케팅 전략 짜줘", "SNS 채널 선택해줘", "브랜딩 방향 잡아줘"] },
  finance: { id: "finance", name: "AI 재무", emoji: "💰", color: "#F5A623", colorSoft: "rgba(245,166,35,0.12)", desc: "초기 자본, 수익 모델, 손익 분석", quickPrompts: ["초기 자본 계획 세워줘", "수익 모델 만들어줘", "손익분기점 계산해줘", "투자금 유치 전략"] },
  legal: { id: "legal", name: "AI 법무", emoji: "⚖️", color: "#64748B", colorSoft: "rgba(100,116,139,0.12)", desc: "사업자 등록, 인허가, 계약서", quickPrompts: ["사업자 등록 방법", "필요한 인허가 알려줘", "계약서 만들어줘", "법적 리스크 체크해줘"] },
};

// ── Shared UI ──────────────────────────────────────────────────
const ErrorMsg = ({ msg }) => msg ? <div style={{ marginTop: "8px", fontSize: "12px", color: C.error }}>⚠ {msg}</div> : null;

const SLabel = ({ children, required }) => (
  <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: C.textMuted, textTransform: "uppercase", marginBottom: "10px" }}>
    {children}{required && <span style={{ color: C.error }}> *</span>}
  </div>
);

const StyledInput = ({ value, onChange, placeholder, hasError }) => (
  <input value={value} onChange={onChange} placeholder={placeholder} style={{
    width: "100%", padding: "13px 16px", borderRadius: "10px",
    border: `1.5px solid ${hasError ? C.error : C.border}`,
    background: hasError ? C.errorBg : C.surface,
    color: C.text, fontSize: "15px", outline: "none",
  }}
    onFocus={e => e.target.style.borderColor = hasError ? C.error : C.text}
    onBlur={e => e.target.style.borderColor = hasError ? C.error : C.border}
  />
);

const NavBtns = ({ step, total, onPrev, onNext, color, nextLabel }) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
    {step > 0 ? (
      <button onClick={onPrev} style={{ padding: "10px 18px", borderRadius: "8px", border: `1.5px solid ${C.border}`, background: C.surface, color: C.textSub, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>← 이전</button>
    ) : <div />}
    <button onClick={onNext} style={{ padding: "13px 24px", borderRadius: "10px", border: "none", background: color, color: color === C.accent ? "#000" : "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
      {nextLabel || (step < total - 1 ? "다음 →" : "시작하기 🚀")}
    </button>
  </div>
);

// ── Type Selection ─────────────────────────────────────────────
function TypeSelection({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const types = [
    { id: "owner", emoji: "🏪", title: "기존 사업자", desc: "이미 사업을 운영 중이에요.\nAI가 재무·마케팅·CS 등 업무를 함께 처리해드려요.", color: C.accent, colorSoft: C.accentSoft, colorBorder: C.accentBorder, tags: ["재무 관리", "고객 응대", "세무 처리", "마케팅"] },
    { id: "startup", emoji: "🚀", title: "창업 준비자", desc: "창업을 준비 중이에요.\n아이디어 검증부터 사업 시작까지 길라잡이가 필요해요.", color: C.blue, colorSoft: C.blueSoft, colorBorder: C.blueBorder, tags: ["아이디어 검증", "사업계획서", "초기 자본", "시장조사"] },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "48px", justifyContent: "center" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "18px", fontWeight: "800" }}>C</span>
          </div>
          <span style={{ fontSize: "20px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em" }}>CoStart</span>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em", marginBottom: "10px", textAlign: "center" }}>어떤 분이세요?</h1>
        <p style={{ fontSize: "15px", color: C.textSub, marginBottom: "32px", textAlign: "center" }}>상황에 맞는 AI 팀을 구성해드릴게요</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {types.map(t => (
            <button key={t.id} onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)} onClick={() => onSelect(t.id)} style={{
              padding: "24px", borderRadius: "16px", cursor: "pointer", textAlign: "left",
              border: `2px solid ${hovered === t.id ? t.color : C.border}`,
              background: hovered === t.id ? t.colorSoft : C.surface,
              transition: "all 0.2s", transform: hovered === t.id ? "translateY(-2px)" : "none",
              boxShadow: hovered === t.id ? `0 8px 24px ${t.colorSoft}` : C.shadow,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: t.colorSoft, border: `1.5px solid ${t.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0 }}>{t.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "18px", fontWeight: "800", color: C.text, marginBottom: "6px" }}>{t.title}</div>
                  <div style={{ fontSize: "13px", color: C.textSub, lineHeight: "1.6", marginBottom: "14px", whiteSpace: "pre-line" }}>{t.desc}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {t.tags.map((tag, i) => <span key={i} style={{ padding: "4px 10px", borderRadius: "20px", background: t.colorSoft, color: t.color, fontSize: "11px", fontWeight: "700", border: `1px solid ${t.colorBorder}` }}>{tag}</span>)}
                  </div>
                </div>
                <div style={{ fontSize: "20px", color: hovered === t.id ? t.color : C.textMuted, transition: "all 0.2s" }}>→</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Owner Onboarding ───────────────────────────────────────────
function OwnerOnboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState(null);
  const [revenue, setRevenue] = useState("");
  const [employees, setEmployees] = useState("");
  const [concerns, setConcerns] = useState([]);
  const [name, setName] = useState("");
  const [bizName, setBizName] = useState("");
  const [errors, setErrors] = useState({});

  const CONCERNS = [
    { id: "finance", label: "재무·자금 관리", emoji: "💰" },
    { id: "tax", label: "세금·세무 처리", emoji: "📊" },
    { id: "marketing", label: "마케팅·홍보", emoji: "📣" },
    { id: "cs", label: "고객 응대·CS", emoji: "🎧" },
    { id: "contract", label: "계약·법무", emoji: "⚖️" },
    { id: "hr", label: "인사·채용", emoji: "👥" },
    { id: "operations", label: "운영 효율화", emoji: "⚙️" },
    { id: "growth", label: "매출 성장 전략", emoji: "📈" },
  ];

  const toggleConcern = (id) => setConcerns(p => p.includes(id) ? p.filter(c => c !== id) : p.length < 4 ? [...p, id] : p);
  const clearErr = (k) => setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  const steps = ["업종", "규모", "고민", "프로필"];

  const next = () => {
    if (step === 0 && !industry) { setErrors({ industry: "업종을 선택해주세요." }); return; }
    if (step === 1 && !revenue) { setErrors({ revenue: "매출 규모를 선택해주세요." }); return; }
    if (step === 1 && !employees) { setErrors({ employees: "직원 수를 선택해주세요." }); return; }
    if (step === 2 && concerns.length === 0) { setErrors({ concerns: "최소 1개 선택해주세요." }); return; }
    if (step === 3 && !name.trim()) { setErrors({ name: "이름을 입력해주세요." }); return; }
    setErrors({});
    if (step < steps.length - 1) setStep(s => s + 1);
    else onDone({ type: "owner", industry, revenue, employees, concerns, name, bizName });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "15px", fontWeight: "800" }}>C</span>
          </div>
          <span style={{ fontSize: "17px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em" }}>CoStart</span>
          <span style={{ marginLeft: "auto", fontSize: "11px", color: C.accent, fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: C.accentSoft, border: `1px solid ${C.accentBorder}` }}>🏪 기존 사업자</span>
        </div>

        <div style={{ background: C.surface, borderRadius: "16px", border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadow }}>
          <div style={{ height: "3px", background: C.border }}>
            <div style={{ height: "100%", width: `${((step + 1) / steps.length) * 100}%`, background: C.accent, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ padding: "20px 24px 28px" }}>
            <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "6px" }}>{step + 1} / {steps.length}</div>

            {step === 0 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px", letterSpacing: "-0.02em" }}>어떤 업종으로 운영 중이세요?</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>업종에 맞는 AI 팀을 구성해드려요</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
                {INDUSTRIES.map(ind => (
                  <button key={ind.id} onClick={() => { setIndustry(ind.id); clearErr("industry"); }} style={{ padding: "10px 12px", borderRadius: "10px", cursor: "pointer", border: `1.5px solid ${industry === ind.id ? C.accent : C.border}`, background: industry === ind.id ? C.accentSoft : C.surface, color: industry === ind.id ? C.accent : C.textSub, fontSize: "12px", fontWeight: industry === ind.id ? "700" : "500", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ fontSize: "16px" }}>{ind.emoji}</span><span>{ind.label}</span>
                  </button>
                ))}
              </div>
              <ErrorMsg msg={errors.industry} />
            </>}

            {step === 1 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px", letterSpacing: "-0.02em" }}>사업 규모를 알려주세요</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>규모에 맞는 조언을 드릴게요</p>
              <div style={{ marginBottom: "18px" }}>
                <SLabel required>월 매출 규모</SLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {["500만원 미만", "500만~2,000만원", "2,000만~5,000만원", "5,000만원 이상"].map(r => (
                    <button key={r} onClick={() => { setRevenue(r); clearErr("revenue"); }} style={{ padding: "13px 16px", borderRadius: "10px", cursor: "pointer", textAlign: "left", border: `1.5px solid ${revenue === r ? C.accent : C.border}`, background: revenue === r ? C.accentSoft : C.surface, color: C.text, fontSize: "14px", fontWeight: revenue === r ? "700" : "400", transition: "all 0.15s" }}>{r}</button>
                  ))}
                </div>
                <ErrorMsg msg={errors.revenue} />
              </div>
              <div>
                <SLabel required>직원 수 (본인 포함)</SLabel>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["1명 (혼자)", "2~5명", "6~10명", "10명 이상"].map(e => (
                    <button key={e} onClick={() => { setEmployees(e); clearErr("employees"); }} style={{ padding: "9px 16px", borderRadius: "8px", cursor: "pointer", border: `1.5px solid ${employees === e ? C.accent : C.border}`, background: employees === e ? C.accentSoft : C.surface, color: employees === e ? C.accent : C.textSub, fontSize: "13px", fontWeight: "600", transition: "all 0.15s" }}>{e}</button>
                  ))}
                </div>
                <ErrorMsg msg={errors.employees} />
              </div>
            </>}

            {step === 2 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px", letterSpacing: "-0.02em" }}>어떤 부분이 가장 힘드세요?</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>최대 4개 · AI 팀이 집중적으로 도와드릴게요</p>
              {concerns.length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                  {concerns.map(c => { const f = CONCERNS.find(x => x.id === c); return <span key={c} style={{ padding: "4px 10px", borderRadius: "20px", background: C.accentSoft, color: C.accent, fontSize: "11px", fontWeight: "700", border: `1px solid ${C.accentBorder}` }}>{f?.emoji} {f?.label}</span>; })}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {CONCERNS.map(c => (
                  <button key={c.id} onClick={() => { toggleConcern(c.id); clearErr("concerns"); }} style={{ padding: "12px", borderRadius: "10px", cursor: "pointer", textAlign: "left", border: `1.5px solid ${concerns.includes(c.id) ? C.accent : C.border}`, background: concerns.includes(c.id) ? C.accentSoft : C.surface, transition: "all 0.15s" }}>
                    <div style={{ fontSize: "20px", marginBottom: "5px" }}>{c.emoji}</div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: concerns.includes(c.id) ? C.accent : C.text }}>{c.label}</div>
                  </button>
                ))}
              </div>
              <ErrorMsg msg={errors.concerns} />
            </>}

            {step === 3 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px", letterSpacing: "-0.02em" }}>프로필을 완성해주세요</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>AI 팀이 맞춤 서비스를 제공해드릴게요</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                <div>
                  <SLabel required>이름 또는 닉네임</SLabel>
                  <StyledInput value={name} onChange={e => { setName(e.target.value); if (e.target.value.trim()) clearErr("name"); }} placeholder="홍길동" hasError={!!errors.name} />
                  <ErrorMsg msg={errors.name} />
                </div>
                <div>
                  <SLabel>사업체명 (선택)</SLabel>
                  <StyledInput value={bizName} onChange={e => setBizName(e.target.value)} placeholder="예: 홍길동 카페" hasError={false} />
                </div>
              </div>
              <div style={{ padding: "16px", borderRadius: "12px", background: C.accentSoft, border: `1px solid ${C.accentBorder}` }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>구성될 AI 팀</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {[...concerns.map(c => OWNER_AGENTS[c]).filter(Boolean), OWNER_AGENTS.planner].map((a, i) => (
                    <span key={i} style={{ padding: "5px 12px", borderRadius: "20px", background: C.surface, border: `1px solid ${C.accentBorder}`, fontSize: "12px", fontWeight: "600", color: C.text }}>{a.emoji} {a.name}</span>
                  ))}
                </div>
              </div>
            </>}

            <NavBtns step={step} total={steps.length} onPrev={() => { setErrors({}); setStep(s => s - 1); }} onNext={next} color={C.accent} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Startup Onboarding ─────────────────────────────────────────
function StartupOnboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [field, setField] = useState(null);
  const [hasIdea, setHasIdea] = useState(null);
  const [idea, setIdea] = useState("");
  const [readyStage, setReadyStage] = useState("");
  const [capital, setCapital] = useState("");
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [errors, setErrors] = useState({});

  const clearErr = (k) => setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  const steps = ["관심 분야", "아이디어", "준비 단계", "프로필"];

  const next = () => {
    if (step === 0 && !field) { setErrors({ field: "분야를 선택해주세요." }); return; }
    if (step === 1 && hasIdea === null) { setErrors({ hasIdea: "선택해주세요." }); return; }
    if (step === 2 && !readyStage) { setErrors({ readyStage: "준비 단계를 선택해주세요." }); return; }
    if (step === 3 && !name.trim()) { setErrors({ name: "이름을 입력해주세요." }); return; }
    setErrors({});
    if (step < steps.length - 1) setStep(s => s + 1);
    else onDone({ type: "startup", field, hasIdea, idea, readyStage, capital, name, job });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "15px", fontWeight: "800" }}>C</span>
          </div>
          <span style={{ fontSize: "17px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em" }}>CoStart</span>
          <span style={{ marginLeft: "auto", fontSize: "11px", color: C.blue, fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: C.blueSoft, border: `1px solid ${C.blueBorder}` }}>🚀 창업 준비자</span>
        </div>

        <div style={{ background: C.surface, borderRadius: "16px", border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadow }}>
          <div style={{ height: "3px", background: C.border }}>
            <div style={{ height: "100%", width: `${((step + 1) / steps.length) * 100}%`, background: C.blue, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ padding: "20px 24px 28px" }}>
            <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "6px" }}>{step + 1} / {steps.length}</div>

            {step === 0 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px", letterSpacing: "-0.02em" }}>어떤 분야에 관심 있으세요?</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>분야에 맞는 AI 팀과 조언을 드릴게요</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
                {INTEREST_FIELDS.map(f => (
                  <button key={f.id} onClick={() => { setField(f.id); clearErr("field"); }} style={{ padding: "10px 12px", borderRadius: "10px", cursor: "pointer", border: `1.5px solid ${field === f.id ? C.blue : C.border}`, background: field === f.id ? C.blueSoft : C.surface, color: field === f.id ? C.blue : C.textSub, fontSize: "12px", fontWeight: field === f.id ? "700" : "500", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ fontSize: "16px" }}>{f.emoji}</span><span>{f.label}</span>
                  </button>
                ))}
              </div>
              <ErrorMsg msg={errors.field} />
            </>}

            {step === 1 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px", letterSpacing: "-0.02em" }}>아이디어가 있으신가요?</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>없어도 괜찮아요. AI가 도와드릴게요 😊</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {[{ val: true, emoji: "💡", title: "네, 아이디어가 있어요", desc: "아이디어를 검증하고 발전시켜 드릴게요" }, { val: false, emoji: "🤔", title: "아직 없어요", desc: "관심 분야에서 좋은 아이디어를 찾아드릴게요" }].map(opt => (
                  <button key={String(opt.val)} onClick={() => { setHasIdea(opt.val); clearErr("hasIdea"); }} style={{ padding: "16px", borderRadius: "12px", cursor: "pointer", textAlign: "left", border: `1.5px solid ${hasIdea === opt.val ? C.blue : C.border}`, background: hasIdea === opt.val ? C.blueSoft : C.surface, transition: "all 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "24px" }}>{opt.emoji}</span>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: C.text, marginBottom: "3px" }}>{opt.title}</div>
                        <div style={{ fontSize: "12px", color: C.textSub }}>{opt.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <ErrorMsg msg={errors.hasIdea} />
              {hasIdea === true && (
                <div>
                  <SLabel>아이디어를 간단히 적어주세요 (선택)</SLabel>
                  <textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="예: 반려동물 건강 관리 앱" style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: `1.5px solid ${C.border}`, background: C.surface, color: C.text, fontSize: "14px", outline: "none", resize: "none", minHeight: "80px", lineHeight: "1.6" }} onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
              )}
            </>}

            {step === 2 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px", letterSpacing: "-0.02em" }}>현재 어느 단계에 계세요?</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>단계에 맞는 가이드를 드릴게요</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
                {[{ val: "idea", label: "아이디어만 있어요", desc: "검증부터 시작해요", emoji: "💡" }, { val: "research", label: "시장조사 중이에요", desc: "분석과 전략을 잡아드릴게요", emoji: "🔍" }, { val: "planning", label: "사업계획 수립 중이에요", desc: "계획을 구체화해드릴게요", emoji: "📋" }, { val: "ready", label: "곧 시작할 준비가 됐어요", desc: "실행 단계로 넘어가요", emoji: "🚀" }].map(s => (
                  <button key={s.val} onClick={() => { setReadyStage(s.val); clearErr("readyStage"); }} style={{ padding: "14px 16px", borderRadius: "10px", cursor: "pointer", textAlign: "left", border: `1.5px solid ${readyStage === s.val ? C.blue : C.border}`, background: readyStage === s.val ? C.blueSoft : C.surface, transition: "all 0.15s", display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "20px" }}>{s.emoji}</span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: C.text }}>{s.label}</div>
                      <div style={{ fontSize: "12px", color: C.textSub, marginTop: "2px" }}>{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <ErrorMsg msg={errors.readyStage} />
              <div>
                <SLabel>초기 자본 규모 (선택)</SLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["없음", "500만원 미만", "500만~2,000만원", "2,000만원 이상"].map(c => (
                    <button key={c} onClick={() => setCapital(c)} style={{ padding: "8px 14px", borderRadius: "8px", cursor: "pointer", border: `1.5px solid ${capital === c ? C.blue : C.border}`, background: capital === c ? C.blueSoft : C.surface, color: capital === c ? C.blue : C.textSub, fontSize: "13px", fontWeight: "600", transition: "all 0.15s" }}>{c}</button>
                  ))}
                </div>
              </div>
            </>}

            {step === 3 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px", letterSpacing: "-0.02em" }}>프로필을 완성해주세요</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>AI 팀이 맞춤 가이드를 드릴게요</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                <div>
                  <SLabel required>이름 또는 닉네임</SLabel>
                  <StyledInput value={name} onChange={e => { setName(e.target.value); if (e.target.value.trim()) clearErr("name"); }} placeholder="홍길동" hasError={!!errors.name} />
                  <ErrorMsg msg={errors.name} />
                </div>
                <div>
                  <SLabel>현재 직업 (선택)</SLabel>
                  <StyledInput value={job} onChange={e => setJob(e.target.value)} placeholder="예: 직장인, 학생, 프리랜서" hasError={false} />
                </div>
              </div>
              <div style={{ padding: "16px", borderRadius: "12px", background: C.blueSoft, border: `1px solid ${C.blueBorder}` }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: C.blue, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>구성될 AI 팀</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {Object.values(STARTUP_AGENTS).filter(a => a.id !== "validator" || hasIdea).map((a, i) => (
                    <span key={i} style={{ padding: "5px 12px", borderRadius: "20px", background: C.surface, border: `1px solid ${C.blueBorder}`, fontSize: "12px", fontWeight: "600", color: C.text }}>{a.emoji} {a.name}</span>
                  ))}
                </div>
              </div>
            </>}

            <NavBtns step={step} total={steps.length} onPrev={() => { setErrors({}); setStep(s => s - 1); }} onNext={next} color={C.blue} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Workspace ──────────────────────────────────────────────────
function Workspace({ profile, onReset }) {
  const isOwner = profile.type === "owner";
  const themeColor = isOwner ? C.accent : C.blue;
  const themeSoft = isOwner ? C.accentSoft : C.blueSoft;
  const themeBorder = isOwner ? C.accentBorder : C.blueBorder;

  // 에이전트 구성
  const agents = isOwner
    ? [...profile.concerns.map(c => OWNER_AGENTS[c]).filter(Boolean), OWNER_AGENTS.planner]
    : Object.values(STARTUP_AGENTS).filter(a => a.id !== "validator" || profile.hasIdea);

  const [activeAgent, setActiveAgent] = useState(agents[0]?.id);
  const [messages, setMessages] = useState(() => {
    const init = {};
    agents.forEach(a => {
      init[a.id] = [{
        role: "assistant",
        content: isOwner
          ? `안녕하세요! 저는 **${a.name}**이에요.\n\n${profile.bizName ? `**${profile.bizName}**의 ` : ""}${a.desc} 관련해서 도와드릴게요.\n\n아래 빠른 질문을 눌러보거나 직접 물어보세요 😊`
          : `안녕하세요! 저는 **${a.name}**이에요.\n\n${profile.idea ? `**"${profile.idea}"** 아이디어의 ` : ""}${a.desc} 측면에서 창업을 도와드릴게요.\n\n아래 빠른 질문을 눌러보거나 직접 물어보세요 😊`
      }];
    });
    return init;
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [showDocs, setShowDocs] = useState(false);
  const [showMobileAgents, setShowMobileAgents] = useState(false);
  const bottomRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const currentAgent = agents.find(a => a.id === activeAgent);
  const currentMsgs = messages[activeAgent] || [];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeAgent]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => ({ ...prev, [activeAgent]: [...prev[activeAgent], { role: "user", content: msg }] }));
    setLoading(true);
    setTimeout(() => {
      const reply = `**${msg}**에 대한 ${currentAgent.name}의 분석이에요.\n\n${isOwner ? `${profile.bizName || "사업체"}의 상황을 고려해서` : `${profile.idea ? `"${profile.idea}" 아이디어를 기반으로` : "창업 준비 단계에 맞게"}`} 답변드릴게요.\n\n- 핵심 포인트 1: 지금 당장 실행 가능한 방법부터 시작해요\n- 핵심 포인트 2: 단계적으로 접근하는 게 중요해요\n- 핵심 포인트 3: 데이터를 기반으로 의사결정 해요\n\nAPI 연동 후 실제 AI 답변이 제공돼요 😊`;
      setMessages(prev => ({ ...prev, [activeAgent]: [...prev[activeAgent], { role: "assistant", content: reply }] }));
      setLoading(false);
      if (msg.includes("작성") || msg.includes("만들어") || msg.includes("분석")) {
        setDocs(p => [{ agent: currentAgent.name, emoji: currentAgent.emoji, title: msg, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) }, ...p]);
      }
    }, 800);
  };

  const renderMsg = (content) => content.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) return <div key={i} style={{ fontSize: "13px", fontWeight: "700", color: C.text, marginBottom: "4px" }}>{line.slice(2, -2)}</div>;
    if (line.startsWith('- ')) return <div key={i} style={{ fontSize: "13px", color: C.textSub, lineHeight: "1.7", paddingLeft: "12px", position: "relative" }}><span style={{ position: "absolute", left: "2px", color: themeColor }}>·</span>{line.slice(2)}</div>;
    if (line === '') return <div key={i} style={{ height: "5px" }} />;
    const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<b style="color:${C.text};font-weight:700">${m}</b>`);
    return <div key={i} style={{ fontSize: "13px", color: C.textSub, lineHeight: "1.8" }} dangerouslySetInnerHTML={{ __html: bold }} />;
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bg }}>

      {/* Top bar */}
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isMobile && (
            <button onClick={() => setShowMobileAgents(p => !p)} style={{ width: "34px", height: "34px", borderRadius: "9px", background: currentAgent?.colorSoft, border: `1px solid ${currentAgent?.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", cursor: "pointer" }}>
              {currentAgent?.emoji}
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "14px", fontWeight: "800" }}>C</span>
            </div>
            {!isMobile && <span style={{ fontSize: "16px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em" }}>CoStart</span>}
          </div>
          <span style={{ fontSize: "11px", color: themeColor, fontWeight: "700", padding: "3px 8px", borderRadius: "20px", background: themeSoft, border: `1px solid ${themeBorder}` }}>
            {isOwner ? "🏪 사업자" : "🚀 창업 준비"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setShowDocs(p => !p)} style={{ padding: "7px 12px", borderRadius: "8px", cursor: "pointer", border: `1px solid ${showDocs ? themeBorder : C.border}`, background: showDocs ? themeSoft : "transparent", color: showDocs ? themeColor : C.textSub, fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
            📄 {docs.length > 0 && <span style={{ background: themeColor, color: isOwner ? "#000" : "#fff", borderRadius: "8px", padding: "1px 6px", fontSize: "10px", fontWeight: "700" }}>{docs.length}</span>}
          </button>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: themeSoft, border: `1px solid ${themeBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: themeColor }}>{profile.name[0]}</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* Mobile agent overlay */}
        {isMobile && showMobileAgents && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: C.surface, borderBottom: `1px solid ${C.border}`, zIndex: 100, padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {agents.map(a => (
              <button key={a.id} onClick={() => { setActiveAgent(a.id); setShowMobileAgents(false); }} style={{ padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${activeAgent === a.id ? a.color : C.border}`, background: activeAgent === a.id ? a.colorSoft : C.surface2, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <span style={{ fontSize: "18px" }}>{a.emoji}</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: activeAgent === a.id ? a.color : C.textSub }}>{a.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Desktop sidebar */}
        {!isMobile && (
          <div style={{ width: "210px", borderRight: `1px solid ${C.border}`, background: C.surface, display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", color: C.textMuted, textTransform: "uppercase", marginBottom: "4px" }}>AI 팀</div>
              <div style={{ fontSize: "12px", color: C.textSub }}>{profile.name}님의 전담 팀</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {agents.map(a => (
                <button key={a.id} onClick={() => setActiveAgent(a.id)} style={{ width: "100%", padding: "12px 14px", textAlign: "left", cursor: "pointer", border: "none", background: activeAgent === a.id ? C.surface2 : "transparent", borderLeft: `3px solid ${activeAgent === a.id ? a.color : "transparent"}`, transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: a.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>{a.emoji}</div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: activeAgent === a.id ? "700" : "500", color: activeAgent === a.id ? a.color : C.textSub }}>{a.name}</div>
                      <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "1px", lineHeight: "1.3" }}>{a.desc.slice(0, 16)}...</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
              <button onClick={onReset} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: "11px", cursor: "pointer" }}>← 처음으로</button>
            </div>
          </div>
        )}

        {/* Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Agent header */}
          {!isMobile && currentAgent && (
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: currentAgent.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{currentAgent.emoji}</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: C.text }}>{currentAgent.name}</div>
                <div style={{ fontSize: "12px", color: C.textMuted }}>{currentAgent.desc}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green }} />
                <span style={{ fontSize: "11px", color: C.green, fontWeight: "600" }}>온라인</span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {currentMsgs.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                {msg.role === "assistant" && currentAgent && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: currentAgent.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{currentAgent.emoji}</div>
                )}
                <div style={{ maxWidth: "78%", padding: "11px 14px", borderRadius: msg.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: msg.role === "user" ? themeSoft : C.surface, border: `1px solid ${msg.role === "user" ? themeBorder : C.border}` }}>
                  {msg.role === "assistant" ? renderMsg(msg.content) : <span style={{ fontSize: "13px", color: C.text, lineHeight: "1.7" }}>{msg.content}</span>}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: currentAgent?.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{currentAgent?.emoji}</div>
                <div style={{ display: "flex", gap: "4px", padding: "11px 14px", borderRadius: "4px 14px 14px 14px", background: C.surface, border: `1px solid ${C.border}` }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: currentAgent?.color, animation: "dot 1.2s infinite", animationDelay: `${i*0.15}s` }} />)}
                </div>
              </div>
            )}

            {/* Quick prompts */}
            {currentMsgs.length <= 1 && currentAgent && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                {currentAgent.quickPrompts.map((q, i) => (
                  <button key={i} onClick={() => send(q)} style={{ padding: "7px 13px", borderRadius: "20px", cursor: "pointer", border: `1px solid ${currentAgent.color}40`, background: currentAgent.colorSoft, color: currentAgent.color, fontSize: "12px", fontWeight: "600", transition: "all 0.15s" }}>{q}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, background: C.surface, display: "flex", gap: "10px" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) send(); }} placeholder={`${currentAgent?.name}에게 질문하세요...`} style={{ flex: 1, padding: "11px 16px", borderRadius: "10px", border: `1.5px solid ${C.border}`, background: C.surface2, color: C.text, fontSize: "14px", outline: "none" }} onFocus={e => e.target.style.borderColor = currentAgent?.color + "60" || C.border} onBlur={e => e.target.style.borderColor = C.border} />
            <button onClick={() => send()} style={{ padding: "11px 18px", borderRadius: "10px", border: "none", background: themeColor, color: isOwner ? "#000" : "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>전송</button>
          </div>
        </div>

        {/* Docs panel */}
        {showDocs && !isMobile && (
          <div style={{ width: "280px", borderLeft: `1px solid ${C.border}`, background: C.surface, flexShrink: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: C.text }}>생성된 문서 ({docs.length})</div>
              <button onClick={() => setShowDocs(false)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
              {docs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 16px", color: C.textMuted, fontSize: "13px", lineHeight: "1.7" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>📄</div>
                  AI에게 문서 작성을<br />요청하면 여기 저장돼요
                </div>
              ) : docs.map((doc, i) => (
                <div key={i} style={{ padding: "12px", borderRadius: "10px", border: `1px solid ${C.border}`, marginBottom: "8px", background: C.surface2, cursor: "pointer" }}>
                  <div style={{ fontSize: "16px", marginBottom: "5px" }}>{doc.emoji}</div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: C.text, marginBottom: "3px" }}>{doc.title}</div>
                  <div style={{ fontSize: "10px", color: C.textMuted }}>{doc.agent} · {doc.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const [stage, setStage] = useState("type");
  const [profile, setProfile] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Pretendard', -apple-system, sans-serif; }
        body { background: ${C.bg}; }
        input::placeholder, textarea::placeholder { color: ${C.textMuted}; }
        button { font-family: 'Pretendard', -apple-system, sans-serif; outline: none; }
        @keyframes dot { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
      `}</style>

      {stage === "type" && <TypeSelection onSelect={type => setStage(type === "owner" ? "owner" : "startup")} />}
      {stage === "owner" && <OwnerOnboarding onDone={p => { setProfile(p); setStage("workspace"); }} />}
      {stage === "startup" && <StartupOnboarding onDone={p => { setProfile(p); setStage("workspace"); }} />}
      {stage === "workspace" && profile && <Workspace profile={profile} onReset={() => { setProfile(null); setStage("type"); }} />}
    </>
  );
}

