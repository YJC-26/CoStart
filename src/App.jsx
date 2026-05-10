import { useState, useRef, useEffect } from "react";
import { saveBusinessProfile, getBusinessProfile, saveContact, getContacts, saveTodo, getTodos, updateTodo } from './supabase';
const C = {
  bg: "#F7F6F3", surface: "#FFFFFF", surface2: "#F2F2F0", surface3: "#EAEAE8",
  border: "#E4E4E0", text: "#111111", textSub: "#5A5A54", textMuted: "#AAAAAA",
  accent: "#F5A623", accentSoft: "rgba(245,166,35,0.1)", accentBorder: "rgba(245,166,35,0.3)",
  blue: "#3B82F6", blueSoft: "rgba(59,130,246,0.1)", blueBorder: "rgba(59,130,246,0.3)",
  green: "#22C55E", greenSoft: "rgba(34,197,94,0.1)", greenBorder: "rgba(34,197,94,0.3)",
  error: "#DC2626", errorBg: "#FEF2F2", shadow: "0 4px 24px rgba(0,0,0,0.06)",
};

const INDUSTRIES = [
  { id: "food", label: "요식업·카페", emoji: "🍽️" }, { id: "retail", label: "소매·유통", emoji: "🛒" },
  { id: "it", label: "IT·소프트웨어", emoji: "💻" }, { id: "content", label: "콘텐츠·미디어", emoji: "🎬" },
  { id: "education", label: "교육·강의", emoji: "📚" }, { id: "beauty", label: "뷰티·헬스", emoji: "💄" },
  { id: "construction", label: "건설·인테리어", emoji: "🏗️" }, { id: "logistics", label: "물류·배송", emoji: "🚚" },
  { id: "finance", label: "금융·보험", emoji: "💰" }, { id: "consulting", label: "컨설팅·전문직", emoji: "📋" },
  { id: "manufacturing", label: "제조·생산", emoji: "🏭" }, { id: "ecommerce", label: "이커머스", emoji: "📦" },
  { id: "pet", label: "반려동물", emoji: "🐾" }, { id: "travel", label: "여행·레저", emoji: "✈️" },
  { id: "other", label: "기타", emoji: "✦" },
];

const INTEREST_FIELDS = [
  { id: "it", label: "IT·앱·소프트웨어", emoji: "💻" }, { id: "food", label: "푸드·음료·카페", emoji: "🍽️" },
  { id: "content", label: "콘텐츠·유튜브", emoji: "🎬" }, { id: "retail", label: "소매·이커머스", emoji: "🛒" },
  { id: "education", label: "교육·코칭", emoji: "📚" }, { id: "beauty", label: "뷰티·패션", emoji: "💄" },
  { id: "health", label: "헬스·웰니스", emoji: "🏃" }, { id: "hardware", label: "하드웨어·제조", emoji: "🔧" },
  { id: "finance", label: "금융·핀테크", emoji: "💰" }, { id: "social", label: "소셜임팩트", emoji: "🌱" },
  { id: "pet", label: "반려동물", emoji: "🐾" }, { id: "other", label: "아직 모르겠어요", emoji: "🤔" },
];

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
const Err = ({ msg }) => msg ? <div style={{ marginTop: "8px", fontSize: "12px", color: C.error }}>⚠ {msg}</div> : null;
const SLabel = ({ children, required }) => (
  <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: C.textMuted, textTransform: "uppercase", marginBottom: "10px" }}>
    {children}{required && <span style={{ color: C.error }}> *</span>}
  </div>
);
const Input = ({ value, onChange, placeholder, hasError }) => (
  <input value={value} onChange={onChange} placeholder={placeholder} style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: `1.5px solid ${hasError ? C.error : C.border}`, background: hasError ? C.errorBg : C.surface, color: C.text, fontSize: "15px", outline: "none" }}
    onFocus={e => e.target.style.borderColor = hasError ? C.error : C.text}
    onBlur={e => e.target.style.borderColor = hasError ? C.error : C.border} />
);
const NavBtns = ({ step, total, onPrev, onNext, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
    {step > 0 ? <button onClick={onPrev} style={{ padding: "10px 18px", borderRadius: "8px", border: `1.5px solid ${C.border}`, background: C.surface, color: C.textSub, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>← 이전</button> : <div />}
    <button onClick={onNext} style={{ padding: "13px 24px", borderRadius: "10px", border: "none", background: color, color: color === C.accent ? "#000" : "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
      {step < total - 1 ? "다음 →" : "시작하기 🚀"}
    </button>
  </div>
);

// ── Login ──────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [hovered, setHovered] = useState(null);
  const isMobile = window.innerWidth < 768;

  const Card = () => (
    <div style={{ background: C.surface, borderRadius: "20px", border: `1px solid ${C.border}`, padding: isMobile ? "28px 24px" : "36px", boxShadow: C.shadow, width: "100%", maxWidth: isMobile ? "100%" : "380px" }}>
      {isMobile && (
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "17px", fontWeight: "800" }}>C</span>
            </div>
            <span style={{ fontSize: "19px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em" }}>CoStart</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em", lineHeight: "1.2", marginBottom: "8px" }}>AI 팀과 함께<br /><span style={{ color: C.accent }}>창업을 시작하세요</span></h1>
          <p style={{ fontSize: "13px", color: C.textSub }}>사업자·창업 준비자 맞춤 AI 팀</p>
        </div>
      )}
      <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, letterSpacing: "-0.02em", marginBottom: "5px" }}>로그인 / 회원가입</h2>
      <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "24px" }}>소셜 계정으로 간편하게 시작하세요</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <button onMouseEnter={() => setHovered("google")} onMouseLeave={() => setHovered(null)} onClick={() => onLogin("google")} style={{ width: "100%", padding: "14px 18px", borderRadius: "12px", cursor: "pointer", border: `1.5px solid ${hovered === "google" ? "#4285F4" : C.border}`, background: hovered === "google" ? "rgba(66,133,244,0.06)" : C.surface2, display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s", transform: hovered === "google" ? "translateY(-1px)" : "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <span style={{ fontSize: "14px", fontWeight: "600", color: C.text }}>Google로 계속하기</span>
        </button>
        <button onMouseEnter={() => setHovered("kakao")} onMouseLeave={() => setHovered(null)} onClick={() => onLogin("kakao")} style={{ width: "100%", padding: "14px 18px", borderRadius: "12px", cursor: "pointer", border: `1.5px solid ${hovered === "kakao" ? "#D4BC00" : "#FEE500"}`, background: "#FEE500", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s", transform: hovered === "kakao" ? "translateY(-1px)" : "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 3C6.477 3 2 6.477 2 10.857c0 2.762 1.731 5.193 4.337 6.637L5.3 21l4.868-2.857c.594.082 1.203.124 1.832.124 5.523 0 10-3.477 10-7.857C22 6.477 17.523 3 12 3z" fill="#3C1E1E"/></svg>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#3C1E1E" }}>카카오로 계속하기</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", background: C.border }} />
          <span style={{ fontSize: "11px", color: C.textMuted }}>또는</span>
          <div style={{ flex: 1, height: "1px", background: C.border }} />
        </div>
        <button onMouseEnter={() => setHovered("email")} onMouseLeave={() => setHovered(null)} onClick={() => onLogin("email")} style={{ width: "100%", padding: "14px 18px", borderRadius: "12px", cursor: "pointer", border: `1.5px solid ${hovered === "email" ? C.accentBorder : C.border}`, background: hovered === "email" ? C.accentSoft : "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s" }}>
          <span style={{ fontSize: "15px" }}>✉️</span>
          <span style={{ fontSize: "14px", fontWeight: "600", color: C.textSub }}>이메일로 계속하기</span>
        </button>
      </div>
      <p style={{ fontSize: "11px", color: C.textMuted, textAlign: "center", lineHeight: "1.7" }}>
        계속 진행하면 <span style={{ color: C.accent, cursor: "pointer" }}>이용약관</span>과 <span style={{ color: C.accent, cursor: "pointer" }}>개인정보처리방침</span>에 동의합니다
      </p>
    </div>
  );

  if (isMobile) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <Card />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: "-150px", right: "-150px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "460px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "64px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: C.text, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
              <span style={{ color: "#fff", fontSize: "18px", fontWeight: "800" }}>C</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em" }}>CoStart</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px,4vw,52px)", fontWeight: "800", color: C.text, lineHeight: "1.15", letterSpacing: "-0.03em", marginBottom: "18px" }}>AI 팀과 함께<br /><span style={{ color: C.accent }}>창업을 시작하세요</span></h1>
          <p style={{ fontSize: "16px", color: C.textSub, lineHeight: "1.75", marginBottom: "48px" }}>사업자와 창업 준비자를 위한<br />맞춤형 AI 팀 플랫폼이에요</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {[{ emoji: "🏪", title: "기존 사업자", desc: "재무·세무·마케팅·CS를 AI가 함께 처리해요" }, { emoji: "🚀", title: "창업 준비자", desc: "아이디어 검증부터 사업 시작까지 길라잡이" }, { emoji: "💬", title: "연락 관리", desc: "문자·카톡·이메일을 AI가 자동 분석·정리해요" }].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0, boxShadow: C.shadow }}>{f.emoji}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: C.text, marginBottom: "2px" }}>{f.title}</div>
                  <div style={{ fontSize: "13px", color: C.textSub }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: "460px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", position: "relative", zIndex: 1 }}>
        <Card />
      </div>
    </div>
  );
}

// ── Type Selection ─────────────────────────────────────────────
function TypeSelection({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const types = [
    { id: "owner", emoji: "🏪", title: "기존 사업자", desc: "이미 사업을 운영 중이에요.\nAI가 재무·마케팅·CS 등 업무를 함께 처리해드려요.", color: C.accent, colorSoft: C.accentSoft, colorBorder: C.accentBorder, tags: ["재무 관리", "고객 응대", "세무 처리", "연락 관리"] },
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
            <button key={t.id} onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)} onClick={() => onSelect(t.id)} style={{ padding: "24px", borderRadius: "16px", cursor: "pointer", textAlign: "left", border: `2px solid ${hovered === t.id ? t.color : C.border}`, background: hovered === t.id ? t.colorSoft : C.surface, transition: "all 0.2s", transform: hovered === t.id ? "translateY(-2px)" : "none", boxShadow: hovered === t.id ? `0 8px 24px ${t.colorSoft}` : C.shadow }}>
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
    { id: "finance", label: "재무·자금 관리", emoji: "💰" }, { id: "tax", label: "세금·세무 처리", emoji: "📊" },
    { id: "marketing", label: "마케팅·홍보", emoji: "📣" }, { id: "cs", label: "고객 응대·CS", emoji: "🎧" },
    { id: "contract", label: "계약·법무", emoji: "⚖️" }, { id: "hr", label: "인사·채용", emoji: "👥" },
    { id: "operations", label: "운영 효율화", emoji: "⚙️" }, { id: "growth", label: "매출 성장 전략", emoji: "📈" },
  ];
  const toggle = (id) => setConcerns(p => p.includes(id) ? p.filter(c => c !== id) : p.length < 4 ? [...p, id] : p);
  const clrErr = (k) => setErrors(p => { const n = { ...p }; delete n[k]; return n; });
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
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: "15px", fontWeight: "800" }}>C</span></div>
          <span style={{ fontSize: "17px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em" }}>CoStart</span>
          <span style={{ marginLeft: "auto", fontSize: "11px", color: C.accent, fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: C.accentSoft, border: `1px solid ${C.accentBorder}` }}>🏪 기존 사업자</span>
        </div>
        <div style={{ background: C.surface, borderRadius: "16px", border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadow }}>
          <div style={{ height: "3px", background: C.border }}><div style={{ height: "100%", width: `${((step + 1) / steps.length) * 100}%`, background: C.accent, transition: "width 0.4s ease" }} /></div>
          <div style={{ padding: "20px 24px 28px" }}>
            <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "6px" }}>{step + 1} / {steps.length}</div>
            {step === 0 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>어떤 업종으로 운영 중이세요?</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>업종에 맞는 AI 팀을 구성해드려요</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
                {INDUSTRIES.map(ind => <button key={ind.id} onClick={() => { setIndustry(ind.id); clrErr("industry"); }} style={{ padding: "10px 12px", borderRadius: "10px", cursor: "pointer", border: `1.5px solid ${industry === ind.id ? C.accent : C.border}`, background: industry === ind.id ? C.accentSoft : C.surface, color: industry === ind.id ? C.accent : C.textSub, fontSize: "12px", fontWeight: industry === ind.id ? "700" : "500", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "7px" }}><span style={{ fontSize: "16px" }}>{ind.emoji}</span><span>{ind.label}</span></button>)}
              </div>
              <Err msg={errors.industry} />
            </>}
            {step === 1 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>사업 규모를 알려주세요</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>규모에 맞는 조언을 드릴게요</p>
              <div style={{ marginBottom: "18px" }}>
                <SLabel required>월 매출 규모</SLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {["500만원 미만", "500만~2,000만원", "2,000만~5,000만원", "5,000만원 이상"].map(r => <button key={r} onClick={() => { setRevenue(r); clrErr("revenue"); }} style={{ padding: "13px 16px", borderRadius: "10px", cursor: "pointer", textAlign: "left", border: `1.5px solid ${revenue === r ? C.accent : C.border}`, background: revenue === r ? C.accentSoft : C.surface, color: C.text, fontSize: "14px", fontWeight: revenue === r ? "700" : "400", transition: "all 0.15s" }}>{r}</button>)}
                </div>
                <Err msg={errors.revenue} />
              </div>
              <div>
                <SLabel required>직원 수 (본인 포함)</SLabel>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["1명 (혼자)", "2~5명", "6~10명", "10명 이상"].map(e => <button key={e} onClick={() => { setEmployees(e); clrErr("employees"); }} style={{ padding: "9px 16px", borderRadius: "8px", cursor: "pointer", border: `1.5px solid ${employees === e ? C.accent : C.border}`, background: employees === e ? C.accentSoft : C.surface, color: employees === e ? C.accent : C.textSub, fontSize: "13px", fontWeight: "600", transition: "all 0.15s" }}>{e}</button>)}
                </div>
                <Err msg={errors.employees} />
              </div>
            </>}
            {step === 2 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>어떤 부분이 가장 힘드세요?</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>최대 4개 · AI 팀이 집중적으로 도와드릴게요</p>
              {concerns.length > 0 && <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>{concerns.map(c => { const f = CONCERNS.find(x => x.id === c); return <span key={c} style={{ padding: "4px 10px", borderRadius: "20px", background: C.accentSoft, color: C.accent, fontSize: "11px", fontWeight: "700", border: `1px solid ${C.accentBorder}` }}>{f?.emoji} {f?.label}</span>; })}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {CONCERNS.map(c => <button key={c.id} onClick={() => { toggle(c.id); clrErr("concerns"); }} style={{ padding: "12px", borderRadius: "10px", cursor: "pointer", textAlign: "left", border: `1.5px solid ${concerns.includes(c.id) ? C.accent : C.border}`, background: concerns.includes(c.id) ? C.accentSoft : C.surface, transition: "all 0.15s" }}><div style={{ fontSize: "20px", marginBottom: "5px" }}>{c.emoji}</div><div style={{ fontSize: "12px", fontWeight: "600", color: concerns.includes(c.id) ? C.accent : C.text }}>{c.label}</div></button>)}
              </div>
              <Err msg={errors.concerns} />
            </>}
            {step === 3 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>프로필을 완성해주세요</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>AI 팀이 맞춤 서비스를 제공해드릴게요</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                <div><SLabel required>이름 또는 닉네임</SLabel><Input value={name} onChange={e => { setName(e.target.value); if (e.target.value.trim()) clrErr("name"); }} placeholder="홍길동" hasError={!!errors.name} /><Err msg={errors.name} /></div>
                <div><SLabel>사업체명 (선택)</SLabel><Input value={bizName} onChange={e => setBizName(e.target.value)} placeholder="예: 홍길동 카페" hasError={false} /></div>
              </div>
              <div style={{ padding: "16px", borderRadius: "12px", background: C.accentSoft, border: `1px solid ${C.accentBorder}` }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>구성될 AI 팀</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {[...concerns.map(c => OWNER_AGENTS[c]).filter(Boolean), OWNER_AGENTS.planner].map((a, i) => <span key={i} style={{ padding: "5px 12px", borderRadius: "20px", background: C.surface, border: `1px solid ${C.accentBorder}`, fontSize: "12px", fontWeight: "600", color: C.text }}>{a.emoji} {a.name}</span>)}
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
  const clrErr = (k) => setErrors(p => { const n = { ...p }; delete n[k]; return n; });
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
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: "15px", fontWeight: "800" }}>C</span></div>
          <span style={{ fontSize: "17px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em" }}>CoStart</span>
          <span style={{ marginLeft: "auto", fontSize: "11px", color: C.blue, fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: C.blueSoft, border: `1px solid ${C.blueBorder}` }}>🚀 창업 준비자</span>
        </div>
        <div style={{ background: C.surface, borderRadius: "16px", border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadow }}>
          <div style={{ height: "3px", background: C.border }}><div style={{ height: "100%", width: `${((step + 1) / steps.length) * 100}%`, background: C.blue, transition: "width 0.4s ease" }} /></div>
          <div style={{ padding: "20px 24px 28px" }}>
            <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "6px" }}>{step + 1} / {steps.length}</div>
            {step === 0 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>어떤 분야에 관심 있으세요?</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>분야에 맞는 AI 팀과 조언을 드릴게요</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
                {INTEREST_FIELDS.map(f => <button key={f.id} onClick={() => { setField(f.id); clrErr("field"); }} style={{ padding: "10px 12px", borderRadius: "10px", cursor: "pointer", border: `1.5px solid ${field === f.id ? C.blue : C.border}`, background: field === f.id ? C.blueSoft : C.surface, color: field === f.id ? C.blue : C.textSub, fontSize: "12px", fontWeight: field === f.id ? "700" : "500", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "7px" }}><span style={{ fontSize: "16px" }}>{f.emoji}</span><span>{f.label}</span></button>)}
              </div>
              <Err msg={errors.field} />
            </>}
            {step === 1 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>아이디어가 있으신가요?</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>없어도 괜찮아요. AI가 도와드릴게요 😊</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {[{ val: true, emoji: "💡", title: "네, 아이디어가 있어요", desc: "아이디어를 검증하고 발전시켜 드릴게요" }, { val: false, emoji: "🤔", title: "아직 없어요", desc: "관심 분야에서 좋은 아이디어를 찾아드릴게요" }].map(opt => (
                  <button key={String(opt.val)} onClick={() => { setHasIdea(opt.val); clrErr("hasIdea"); }} style={{ padding: "16px", borderRadius: "12px", cursor: "pointer", textAlign: "left", border: `1.5px solid ${hasIdea === opt.val ? C.blue : C.border}`, background: hasIdea === opt.val ? C.blueSoft : C.surface, transition: "all 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "24px" }}>{opt.emoji}</span>
                      <div><div style={{ fontSize: "14px", fontWeight: "700", color: C.text, marginBottom: "3px" }}>{opt.title}</div><div style={{ fontSize: "12px", color: C.textSub }}>{opt.desc}</div></div>
                    </div>
                  </button>
                ))}
              </div>
              <Err msg={errors.hasIdea} />
              {hasIdea === true && <>
                <SLabel>아이디어를 간단히 적어주세요 (선택)</SLabel>
                <textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="예: 반려동물 건강 관리 앱" style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: `1.5px solid ${C.border}`, background: C.surface, color: C.text, fontSize: "14px", outline: "none", resize: "none", minHeight: "80px", lineHeight: "1.6" }} onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = C.border} />
              </>}
            </>}
            {step === 2 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>현재 어느 단계에 계세요?</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>단계에 맞는 가이드를 드릴게요</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
                {[{ val: "idea", label: "아이디어만 있어요", desc: "검증부터 시작해요", emoji: "💡" }, { val: "research", label: "시장조사 중이에요", desc: "분석과 전략을 잡아드릴게요", emoji: "🔍" }, { val: "planning", label: "사업계획 수립 중이에요", desc: "계획을 구체화해드릴게요", emoji: "📋" }, { val: "ready", label: "곧 시작할 준비가 됐어요", desc: "실행 단계로 넘어가요", emoji: "🚀" }].map(s => (
                  <button key={s.val} onClick={() => { setReadyStage(s.val); clrErr("readyStage"); }} style={{ padding: "14px 16px", borderRadius: "10px", cursor: "pointer", textAlign: "left", border: `1.5px solid ${readyStage === s.val ? C.blue : C.border}`, background: readyStage === s.val ? C.blueSoft : C.surface, transition: "all 0.15s", display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "20px" }}>{s.emoji}</span>
                    <div><div style={{ fontSize: "14px", fontWeight: "600", color: C.text }}>{s.label}</div><div style={{ fontSize: "12px", color: C.textSub, marginTop: "2px" }}>{s.desc}</div></div>
                  </button>
                ))}
              </div>
              <Err msg={errors.readyStage} />
              <SLabel>초기 자본 규모 (선택)</SLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {["없음", "500만원 미만", "500만~2,000만원", "2,000만원 이상"].map(c => <button key={c} onClick={() => setCapital(c)} style={{ padding: "8px 14px", borderRadius: "8px", cursor: "pointer", border: `1.5px solid ${capital === c ? C.blue : C.border}`, background: capital === c ? C.blueSoft : C.surface, color: capital === c ? C.blue : C.textSub, fontSize: "13px", fontWeight: "600", transition: "all 0.15s" }}>{c}</button>)}
              </div>
            </>}
            {step === 3 && <>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>프로필을 완성해주세요</h2>
              <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "18px" }}>AI 팀이 맞춤 가이드를 드릴게요</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                <div><SLabel required>이름 또는 닉네임</SLabel><Input value={name} onChange={e => { setName(e.target.value); if (e.target.value.trim()) clrErr("name"); }} placeholder="홍길동" hasError={!!errors.name} /><Err msg={errors.name} /></div>
                <div><SLabel>현재 직업 (선택)</SLabel><Input value={job} onChange={e => setJob(e.target.value)} placeholder="예: 직장인, 학생, 프리랜서" hasError={false} /></div>
              </div>
              <div style={{ padding: "16px", borderRadius: "12px", background: C.blueSoft, border: `1px solid ${C.blueBorder}` }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: C.blue, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>구성될 AI 팀</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {Object.values(STARTUP_AGENTS).filter(a => a.id !== "validator" || hasIdea).map((a, i) => <span key={i} style={{ padding: "5px 12px", borderRadius: "20px", background: C.surface, border: `1px solid ${C.blueBorder}`, fontSize: "12px", fontWeight: "600", color: C.text }}>{a.emoji} {a.name}</span>)}
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

// ── Contact Manager ────────────────────────────────────────────
function ContactManager({ profile, userId }) {
  const [contacts, setContacts] = useState([
    { id: 1, name: "김철수 대표", company: "A유통", lastMsg: "다음 주 화요일 미팅 가능한가요?", date: "오늘 10:23", type: "거래처", unread: true, amount: "500만원", tags: ["미팅", "계약"] },
    { id: 2, name: "이영희 팀장", company: "B마케팅", lastMsg: "광고 제안서 보내드렸습니다", date: "어제", type: "파트너", unread: false, amount: null, tags: ["마케팅"] },
    { id: 3, name: "박민준 고객", company: null, lastMsg: "환불 요청드립니다", date: "2일 전", type: "고객", unread: true, amount: "32,000원", tags: ["환불", "CS"] },
  ]);
  const [selected, setSelected] = useState(null);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(null);
  const [todos, setTodos] = useState([
    { id: 1, text: "A유통 미팅 일정 확인", done: false, contact: "김철수 대표", date: "다음 주 화요일" },
    { id: 2, text: "광고 제안서 검토", done: false, contact: "이영희 팀장", date: "이번 주" },
    { id: 3, text: "환불 처리", done: false, contact: "박민준 고객", date: "오늘" },
  ]);
  const TC = { "거래처": { color: C.accent, soft: C.accentSoft, border: C.accentBorder }, "파트너": { color: C.blue, soft: C.blueSoft, border: C.blueBorder }, "고객": { color: C.green, soft: C.greenSoft, border: C.greenBorder } };

  const analyze = () => {
    if (!pasteText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzed({ summary: "A유통 김철수 대표 미팅 요청", contact: "김철수 대표 (A유통)", type: "미팅 요청", date: "다음 주 화요일", action: "미팅 일정 확인 및 답변 필요", tags: ["미팅", "거래처"] });
      setAnalyzing(false);
    }, 1500);
  };

  const save = async () => {
    if (!analyzed) return;
    const newTodo = { id: Date.now(), text: analyzed.action, done: false, contact: analyzed.contact, date: analyzed.date || "확인 필요" };
    setTodos(p => [...p, newTodo]);
    
    // Supabase에 할 일 저장
    if (userId) {
      await saveTodo(userId, { text: analyzed.action, contact: analyzed.contact, date: analyzed.date || "확인 필요" });
    }
    
    setPasteText(""); setAnalyzed(null); setShowPaste(false);
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* 연락처 목록 */}
      <div style={{ width: "260px", borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, background: C.surface }}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: "13px", fontWeight: "700", color: C.text }}>연락 관리</div><div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>총 {contacts.length}개</div></div>
          <button onClick={() => setShowPaste(true)} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: C.accent, color: "#000", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>+ 추가</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {contacts.map(c => {
            const tc = TC[c.type] || TC["거래처"];
            return (
              <div key={c.id} onClick={() => { setSelected(c); setShowPaste(false); }} style={{ padding: "12px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}`, background: selected?.id === c.id ? C.surface2 : "transparent", transition: "background 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: tc.soft, border: `1px solid ${tc.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: tc.color, flexShrink: 0 }}>{c.name[0]}</div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: C.text, display: "flex", alignItems: "center", gap: "5px" }}>{c.name}{c.unread && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accent }} />}</div>
                      {c.company && <div style={{ fontSize: "10px", color: C.textMuted }}>{c.company}</div>}
                    </div>
                  </div>
                  <div style={{ fontSize: "10px", color: C.textMuted }}>{c.date}</div>
                </div>
                <div style={{ fontSize: "11px", color: C.textSub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: "38px" }}>{c.lastMsg}</div>
                <div style={{ display: "flex", gap: "4px", paddingLeft: "38px", marginTop: "5px" }}>
                  {c.tags.map((tag, i) => <span key={i} style={{ padding: "2px 6px", borderRadius: "20px", background: tc.soft, color: tc.color, fontSize: "10px", fontWeight: "600" }}>{tag}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 가운데 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {showPaste ? (
          <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: C.text, marginBottom: "4px" }}>연락 내용 분석</div>
                <div style={{ fontSize: "13px", color: C.textSub }}>문자·카톡·이메일 내용을 붙여넣으면 AI가 자동으로 분석해요</div>
              </div>
              <button onClick={() => { setShowPaste(false); setPasteText(""); setAnalyzed(null); }} style={{ padding: "7px 14px", borderRadius: "8px", border: `1px solid ${C.border}`, background: "transparent", color: C.textSub, fontSize: "12px", cursor: "pointer" }}>취소</button>
            </div>
            <textarea value={pasteText} onChange={e => setPasteText(e.target.value)} placeholder={"문자, 카톡, 이메일 내용을 여기에 붙여넣으세요\n\n예시:\n김철수: 다음 주 화요일 미팅 가능한가요?\n나: 네 가능합니다"} style={{ width: "100%", minHeight: "160px", padding: "16px", borderRadius: "12px", border: `1.5px solid ${C.border}`, background: C.surface, color: C.text, fontSize: "14px", lineHeight: "1.7", resize: "none", outline: "none", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
            <button onClick={analyze} disabled={!pasteText.trim() || analyzing} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: pasteText.trim() ? C.accent : C.border, color: pasteText.trim() ? "#000" : C.textMuted, fontSize: "14px", fontWeight: "700", cursor: pasteText.trim() ? "pointer" : "not-allowed", marginBottom: "20px" }}>
              {analyzing ? "AI가 분석 중..." : "🤖 AI 자동 분석"}
            </button>
            {analyzed && (
              <div style={{ background: C.surface, borderRadius: "14px", border: `1.5px solid ${C.accentBorder}`, overflow: "hidden" }}>
                <div style={{ padding: "12px 18px", background: C.accentSoft, borderBottom: `1px solid ${C.accentBorder}` }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>✦ AI 분석 결과</div>
                </div>
                <div style={{ padding: "18px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
                    {[{ label: "요약", value: analyzed.summary }, { label: "연락처", value: analyzed.contact }, { label: "유형", value: analyzed.type }, analyzed.date && { label: "일정", value: analyzed.date }, { label: "필요한 조치", value: analyzed.action }].filter(Boolean).map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: C.textMuted, width: "75px", flexShrink: 0 }}>{item.label}</span>
                        <span style={{ fontSize: "13px", color: C.text, fontWeight: item.label === "필요한 조치" ? "700" : "400" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {analyzed.tags.map((tag, i) => <span key={i} style={{ padding: "4px 10px", borderRadius: "20px", background: C.accentSoft, color: C.accent, fontSize: "11px", fontWeight: "700", border: `1px solid ${C.accentBorder}` }}>{tag}</span>)}
                  </div>
                  <button onClick={save} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: C.text, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>저장하고 할 일 추가 →</button>
                </div>
              </div>
            )}
          </div>
        ) : selected ? (
          <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: TC[selected.type]?.soft, border: `1.5px solid ${TC[selected.type]?.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", color: TC[selected.type]?.color }}>{selected.name[0]}</div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: C.text }}>{selected.name}</div>
                {selected.company && <div style={{ fontSize: "13px", color: C.textSub }}>{selected.company}</div>}
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: TC[selected.type]?.soft, color: TC[selected.type]?.color, fontWeight: "700", border: `1px solid ${TC[selected.type]?.border}` }}>{selected.type}</span>
              </div>
            </div>
            <div style={{ background: C.surface, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "16px", marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>최근 연락</div>
              <div style={{ fontSize: "14px", color: C.text, lineHeight: "1.7", marginBottom: "8px" }}>{selected.lastMsg}</div>
              {selected.amount && <div style={{ fontSize: "13px", color: C.accent, fontWeight: "700" }}>관련 금액: {selected.amount}</div>}
              <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px" }}>{selected.date}</div>
            </div>
            <div style={{ background: C.surface, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>관련 할 일</div>
              {todos.filter(t => t.contact === selected.name).map(todo => (
                <div key={todo.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                  <button onClick={() => setTodos(p => p.map(t => t.id === todo.id ? { ...t, done: !t.done } : t))} style={{ width: "18px", height: "18px", borderRadius: "50%", border: `1.5px solid ${todo.done ? C.text : C.border}`, background: todo.done ? C.text : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#fff", cursor: "pointer", flexShrink: 0, marginTop: "2px" }}>{todo.done ? "✓" : ""}</button>
                  <div><div style={{ fontSize: "13px", color: todo.done ? C.textMuted : C.text, textDecoration: todo.done ? "line-through" : "none" }}>{todo.text}</div><div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>{todo.date}</div></div>
                </div>
              ))}
              {todos.filter(t => t.contact === selected.name).length === 0 && <div style={{ fontSize: "13px", color: C.textMuted, textAlign: "center", padding: "16px 0" }}>관련 할 일이 없어요</div>}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "40px" }}>💬</div>
            <div style={{ fontSize: "14px", color: C.textMuted, textAlign: "center", lineHeight: "1.7" }}>연락처를 선택하거나<br />새 연락을 추가해보세요</div>
            <button onClick={() => setShowPaste(true)} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: C.accent, color: "#000", fontSize: "13px", fontWeight: "700", cursor: "pointer", marginTop: "8px" }}>+ 연락 내용 붙여넣기</button>
          </div>
        )}
      </div>

      {/* 할 일 목록 */}
      <div style={{ width: "220px", borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, background: C.surface }}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: C.text }}>할 일</div>
          <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>{todos.filter(t => !t.done).length}개 남음</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
          {todos.map(todo => (
            <div key={todo.id} style={{ padding: "10px 12px", borderRadius: "10px", border: `1px solid ${C.border}`, marginBottom: "8px", background: todo.done ? C.surface2 : C.surface }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <button onClick={() => setTodos(p => p.map(t => t.id === todo.id ? { ...t, done: !t.done } : t))} style={{ width: "17px", height: "17px", borderRadius: "50%", border: `1.5px solid ${todo.done ? C.text : C.border}`, background: todo.done ? C.text : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#fff", cursor: "pointer", flexShrink: 0, marginTop: "1px" }}>{todo.done ? "✓" : ""}</button>
                <div>
                  <div style={{ fontSize: "12px", color: todo.done ? C.textMuted : C.text, textDecoration: todo.done ? "line-through" : "none", lineHeight: "1.5" }}>{todo.text}</div>
                  <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "3px" }}>{todo.contact} · {todo.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Workspace ──────────────────────────────────────────────────
function Workspace({ profile, userId, onReset }) {
  // Supabase에서 데이터 불러오기
  useEffect(() => {
    if (!userId) return;
    // 할 일 불러오기
    getTodos(userId).then(data => {
      if (data.length > 0) setTodos(data.map(t => ({ ...t, text: t.text, contact: t.contact_name, date: t.date })));
    });
    // 연락처 불러오기  
    getContacts(userId).then(data => {
      if (data.length > 0) setContacts(data.map(c => ({ ...c, lastMsg: c.last_message, type: c.type || "거래처", tags: c.tags || [], unread: c.unread || false })));
    });
  }, [userId]);
  const isOwner = profile.type === "owner";
  const themeColor = isOwner ? C.accent : C.blue;
  const themeSoft = isOwner ? C.accentSoft : C.blueSoft;
  const themeBorder = isOwner ? C.accentBorder : C.blueBorder;
  const agents = isOwner
    ? [...profile.concerns.map(c => OWNER_AGENTS[c]).filter(Boolean), OWNER_AGENTS.planner]
    : Object.values(STARTUP_AGENTS).filter(a => a.id !== "validator" || profile.hasIdea);

  const [sideTab, setSideTab] = useState("ai"); // "ai" | "contacts"
  const [activeAgent, setActiveAgent] = useState(agents[0]?.id);
  const [messages, setMessages] = useState(() => {
    const init = {};
    agents.forEach(a => { init[a.id] = [{ role: "assistant", content: `안녕하세요! 저는 **${a.name}**이에요.\n\n${isOwner ? `${profile.bizName ? `**${profile.bizName}**의 ` : ""}${a.desc} 관련해서 도와드릴게요.` : `${profile.idea ? `**"${profile.idea}"** 아이디어의 ` : ""}${a.desc} 측면에서 창업을 도와드릴게요.`}\n\n아래 빠른 질문을 눌러보거나 직접 물어보세요 😊` }]; });
    return init;
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [showDocs, setShowDocs] = useState(false);
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
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: "800" }}>C</span>
          </div>
          <span style={{ fontSize: "16px", fontWeight: "800", color: C.text, letterSpacing: "-0.03em" }}>CoStart</span>
          <span style={{ fontSize: "11px", color: themeColor, fontWeight: "700", padding: "3px 8px", borderRadius: "20px", background: themeSoft, border: `1px solid ${themeBorder}` }}>
            {isOwner ? "🏪 사업자" : "🚀 창업 준비"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {sideTab === "ai" && (
            <button onClick={() => setShowDocs(p => !p)} style={{ padding: "7px 12px", borderRadius: "8px", cursor: "pointer", border: `1px solid ${showDocs ? themeBorder : C.border}`, background: showDocs ? themeSoft : "transparent", color: showDocs ? themeColor : C.textSub, fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
              📄 {docs.length > 0 && <span style={{ background: themeColor, color: isOwner ? "#000" : "#fff", borderRadius: "8px", padding: "1px 6px", fontSize: "10px", fontWeight: "700" }}>{docs.length}</span>}
            </button>
          )}
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: themeSoft, border: `1px solid ${themeBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: themeColor }}>{profile.name[0]}</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{ width: "200px", borderRight: `1px solid ${C.border}`, background: C.surface, display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* 탭 전환 — 사업자만 연락 관리 탭 보임 */}
          <div style={{ padding: "10px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", background: C.surface2, borderRadius: "8px", padding: "3px", gap: "2px" }}>
              <button onClick={() => setSideTab("ai")} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer", background: sideTab === "ai" ? C.surface : "transparent", color: sideTab === "ai" ? C.text : C.textMuted, fontSize: "11px", fontWeight: "700", boxShadow: sideTab === "ai" ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>AI 팀</button>
              {isOwner && (
                <button onClick={() => setSideTab("contacts")} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer", background: sideTab === "contacts" ? C.surface : "transparent", color: sideTab === "contacts" ? C.text : C.textMuted, fontSize: "11px", fontWeight: "700", boxShadow: sideTab === "contacts" ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>연락 관리</button>
              )}
            </div>
          </div>

          {/* AI 팀 목록 */}
          {sideTab === "ai" && (
            <div style={{ flex: 1, overflowY: "auto" }}>
              {agents.map(a => (
                <button key={a.id} onClick={() => setActiveAgent(a.id)} style={{ width: "100%", padding: "12px 14px", textAlign: "left", cursor: "pointer", border: "none", background: activeAgent === a.id ? C.surface2 : "transparent", borderLeft: `3px solid ${activeAgent === a.id ? a.color : "transparent"}`, transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: a.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>{a.emoji}</div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: activeAgent === a.id ? "700" : "500", color: activeAgent === a.id ? a.color : C.textSub }}>{a.name}</div>
                      <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "1px" }}>{a.desc.slice(0, 14)}...</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 연락 관리 선택 시 안내 */}
          {sideTab === "contacts" && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: C.textMuted, textAlign: "center", lineHeight: "1.6" }}>연락처 목록과<br />할 일을 관리하세요</div>
            </div>
          )}

          <div style={{ padding: "12px", borderTop: `1px solid ${C.border}` }}>
            <button onClick={onReset} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: "11px", cursor: "pointer" }}>← 처음으로</button>
          </div>
        </div>

        {/* 메인 영역 */}
        {sideTab === "contacts" ? (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <ContactManager profile={profile} userId={userId} />
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* 에이전트 헤더 */}
            {currentAgent && (
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

            {/* 메시지 */}
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
              {currentMsgs.length <= 1 && currentAgent && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                  {currentAgent.quickPrompts.map((q, i) => (
                    <button key={i} onClick={() => send(q)} style={{ padding: "7px 13px", borderRadius: "20px", cursor: "pointer", border: `1px solid ${currentAgent.color}40`, background: currentAgent.colorSoft, color: currentAgent.color, fontSize: "12px", fontWeight: "600" }}>{q}</button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* 입력창 */}
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, background: C.surface, display: "flex", gap: "10px" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) send(); }} placeholder={`${currentAgent?.name}에게 질문하세요...`} style={{ flex: 1, padding: "11px 16px", borderRadius: "10px", border: `1.5px solid ${C.border}`, background: C.surface2, color: C.text, fontSize: "14px", outline: "none" }} onFocus={e => e.target.style.borderColor = currentAgent?.color + "60"} onBlur={e => e.target.style.borderColor = C.border} />
              <button onClick={() => send()} style={{ padding: "11px 18px", borderRadius: "10px", border: "none", background: themeColor, color: isOwner ? "#000" : "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>전송</button>
            </div>
          </div>
        )}

        {/* 문서 패널 */}
        {showDocs && sideTab === "ai" && (
          <div style={{ width: "260px", borderLeft: `1px solid ${C.border}`, background: C.surface, flexShrink: 0, display: "flex", flexDirection: "column" }}>
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
  const [stage, setStage] = useState("login");
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);

  // 로그인 처리 (임시 - 실제 로그인 연동 전)
  const handleLogin = async (provider) => {
    // 임시 userId 생성 (실제 로그인 연동 후 교체)
    const tempUserId = "temp-" + Math.random().toString(36).slice(2);
    setUserId(tempUserId);

    // 이전 프로필 확인
    const existing = await getBusinessProfile(tempUserId);
    if (existing) {
      setProfile(existing);
      setStage("workspace");
    } else {
      setStage("type");
    }
  };

  // 온보딩 완료 시 Supabase에 저장
  const handleOnboardingDone = async (p) => {
    setProfile(p);
    if (userId) {
      await saveBusinessProfile(userId, p);
    }
    setStage("workspace");
  };

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
      {stage === "login" && <LoginPage onLogin={handleLogin} />}
      {stage === "type" && <TypeSelection onSelect={type => setStage(type === "owner" ? "owner" : "startup")} />}
      {stage === "owner" && <OwnerOnboarding onDone={handleOnboardingDone} />}
      {stage === "startup" && <StartupOnboarding onDone={handleOnboardingDone} />}
      {stage === "workspace" && profile && <Workspace profile={profile} userId={userId} onReset={() => { setProfile(null); setStage("login"); }} />}
    </>
  );
}

