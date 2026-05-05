import { useState, useRef, useEffect } from "react";

// ── Theme ──────────────────────────────────────────────────────
const getTheme = (isDark) => ({
  bg: isDark ? "#111111" : "#F8F8F6",
  surface: isDark ? "#1C1C1C" : "#FFFFFF",
  surface2: isDark ? "#242424" : "#F2F2F0",
  surface3: isDark ? "#2C2C2C" : "#EAEAE8",
  border: isDark ? "#303030" : "#E4E4E0",
  borderStrong: isDark ? "#404040" : "#CECECA",
  text: isDark ? "#F2F2F0" : "#111111",
  textSub: isDark ? "#909088" : "#5A5A54",
  textMuted: isDark ? "#505048" : "#AAAAAA",
  accent: "#F5A623",
  accentSoft: isDark ? "rgba(245,166,35,0.12)" : "rgba(245,166,35,0.1)",
  accentBorder: "rgba(245,166,35,0.3)",
  green: "#22C55E",
  greenSoft: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)",
  shadow: isDark ? "0 24px 60px rgba(0,0,0,0.5)" : "0 24px 60px rgba(0,0,0,0.08)",
});

// ── Fields ─────────────────────────────────────────────────────
const FIELDS = [
  { id: "it", label: "IT·소프트웨어", emoji: "💻" },
  { id: "hardware", label: "하드웨어·IoT", emoji: "🔧" },
  { id: "ai", label: "AI·머신러닝", emoji: "🤖" },
  { id: "content", label: "콘텐츠·미디어", emoji: "🎬" },
  { id: "food", label: "푸드·음료", emoji: "🍽️" },
  { id: "fashion", label: "패션·뷰티", emoji: "👗" },
  { id: "health", label: "헬스·웰니스", emoji: "🏃" },
  { id: "education", label: "교육·에듀테크", emoji: "📚" },
  { id: "fintech", label: "금융·핀테크", emoji: "💳" },
  { id: "ecommerce", label: "커머스·유통", emoji: "🛒" },
  { id: "realestate", label: "부동산·인테리어", emoji: "🏠" },
  { id: "travel", label: "여행·레저", emoji: "✈️" },
  { id: "social", label: "소셜임팩트·환경", emoji: "🌱" },
  { id: "manufacturing", label: "제조·소재", emoji: "🏭" },
  { id: "entertainment", label: "엔터·게임", emoji: "🎮" },
  { id: "pet", label: "반려동물", emoji: "🐾" },
  { id: "sports", label: "스포츠·피트니스", emoji: "⚽" },
  { id: "culture", label: "문화·예술", emoji: "🎨" },
  { id: "agriculture", label: "농업·푸드테크", emoji: "🌾" },
  { id: "mobility", label: "모빌리티·물류", emoji: "🚗" },
  { id: "bio", label: "바이오·의료", emoji: "🧬" },
  { id: "energy", label: "에너지·클린테크", emoji: "⚡" },
  { id: "space", label: "우주·항공", emoji: "🚀" },
  { id: "other", label: "기타", emoji: "✦" },
];

const MOCK_PREVIOUS_WORK = {
  idea: "반려동물 건강 관리 IoT 디바이스 앱",
  field: "hardware",
  lastActive: "2시간 전",
};

const AGENTS = [
  { id: "planner", name: "AI 기획자", emoji: "📋", color: "#F5A623", colorSoft: "rgba(245,166,35,0.12)", systemPrompt: (idea) => `당신은 경험 많은 스타트업 기획자입니다. 사용자의 창업 아이디어 "${idea}"에 대해 전략적 조언을 해주세요. 친근하고 실용적으로 답해주세요. 문서 생성 요청 시 마크다운 형식으로 작성해주세요. 항상 한국어로 답변하세요.` },
  { id: "marketer", name: "AI 마케터", emoji: "📣", color: "#B57BFF", colorSoft: "rgba(181,123,255,0.12)", systemPrompt: (idea) => `당신은 디지털 마케팅 전문가입니다. 사용자의 창업 아이디어 "${idea}"의 마케팅 전략을 도와주세요. 타겟 고객 분석, 마케팅 채널, 성장 전략에 대해 구체적으로 조언해주세요. 항상 한국어로 답변하세요.` },
  { id: "developer", name: "AI 개발자", emoji: "💻", color: "#22C55E", colorSoft: "rgba(34,197,94,0.12)", systemPrompt: (idea) => `당신은 풀스택 개발자이자 CTO 경험자입니다. 사용자의 창업 아이디어 "${idea}"의 기술적 구현을 도와주세요. MVP 설계, 기술 스택, 개발 로드맵에 대해 구체적으로 조언해주세요. 항상 한국어로 답변하세요.` },
  { id: "finance", name: "AI 재무", emoji: "💰", color: "#5B9BD5", colorSoft: "rgba(91,155,213,0.12)", systemPrompt: (idea) => `당신은 스타트업 CFO 경험자입니다. 사용자의 창업 아이디어 "${idea}"의 재무 계획을 도와주세요. 초기 비용, 수익 모델, 손익분기점에 대해 구체적으로 조언해주세요. 항상 한국어로 답변하세요.` },
];

const QUICK = {
  planner: ["사업계획서 초안 작성", "시장 규모 분석", "경쟁사 분석", "비즈니스 모델 설계"],
  marketer: ["타겟 고객 분석", "마케팅 전략 수립", "SNS 전략 기획", "런칭 캠페인 기획"],
  developer: ["MVP 기능 명세 작성", "기술 스택 추천", "개발 로드맵", "시스템 아키텍처"],
  finance: ["초기 비용 계산", "손익분기점 분석", "수익 모델 정리", "투자 유치 전략"],
};

// ── Responsive hook ────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ── Markdown renderer ──────────────────────────────────────────
function renderMd(text, T) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <div key={i} style={{ fontSize: "13px", fontWeight: "700", color: "#F5A623", margin: "10px 0 3px" }}>{line.slice(4)}</div>;
    if (line.startsWith('## ')) return <div key={i} style={{ fontSize: "15px", fontWeight: "800", color: T.text, margin: "14px 0 5px" }}>{line.slice(3)}</div>;
    if (line.startsWith('# ')) return <div key={i} style={{ fontSize: "17px", fontWeight: "800", color: T.text, margin: "18px 0 7px" }}>{line.slice(2)}</div>;
    if (line.startsWith('- ') || line.startsWith('• ')) return <div key={i} style={{ fontSize: "13px", color: T.textSub, lineHeight: "1.7", paddingLeft: "14px", position: "relative" }}><span style={{ position: "absolute", left: "3px", color: "#F5A623" }}>·</span>{line.slice(2)}</div>;
    if (line === '') return <div key={i} style={{ height: "5px" }} />;
    const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<b style="color:${T.text};font-weight:700">${m}</b>`);
    return <div key={i} style={{ fontSize: "13px", color: T.textSub, lineHeight: "1.8" }} dangerouslySetInnerHTML={{ __html: bold }} />;
  });
}

// ── Login Page ─────────────────────────────────────────────────
function LoginPage({ isDark, T, isMobile, onLogin }) {
  const [hovered, setHovered] = useState(null);

  const handleLogin = (provider) => {
    const hasPrev = Math.random() > 0.5;
    onLogin(provider, hasPrev ? MOCK_PREVIOUS_WORK : null);
  };

  const LoginCard = () => (
    <div style={{ background: T.surface, borderRadius: "20px", border: `1px solid ${T.border}`, padding: isMobile ? "28px 24px" : "36px", boxShadow: T.shadow, width: "100%", maxWidth: isMobile ? "100%" : "380px" }}>
      {isMobile && (
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#000", fontSize: "18px", fontWeight: "800" }}>C</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "800", color: T.text, letterSpacing: "-0.03em" }}>CoStart</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: T.text, letterSpacing: "-0.03em", lineHeight: "1.2", marginBottom: "8px" }}>
            AI 팀과 함께<br /><span style={{ color: T.accent }}>창업을 시작하세요</span>
          </h1>
          <p style={{ fontSize: "14px", color: T.textSub, lineHeight: "1.6" }}>아이디어만 있으면 돼요</p>
        </div>
      )}

      <h2 style={{ fontSize: "20px", fontWeight: "800", color: T.text, letterSpacing: "-0.02em", marginBottom: "5px" }}>로그인 / 회원가입</h2>
      <p style={{ fontSize: "13px", color: T.textSub, marginBottom: "24px" }}>소셜 계정으로 간편하게 시작하세요</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {/* Google */}
        <button onMouseEnter={() => setHovered("google")} onMouseLeave={() => setHovered(null)} onClick={() => handleLogin("google")} style={{
          width: "100%", padding: "14px 18px", borderRadius: "12px", cursor: "pointer",
          border: `1.5px solid ${hovered === "google" ? "#4285F4" : T.border}`,
          background: hovered === "google" ? (isDark ? "rgba(66,133,244,0.1)" : "rgba(66,133,244,0.06)") : T.surface2,
          display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s",
          transform: hovered === "google" ? "translateY(-1px)" : "none",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span style={{ fontSize: "14px", fontWeight: "600", color: T.text }}>Google로 계속하기</span>
        </button>

        {/* Kakao */}
        <button onMouseEnter={() => setHovered("kakao")} onMouseLeave={() => setHovered(null)} onClick={() => handleLogin("kakao")} style={{
          width: "100%", padding: "14px 18px", borderRadius: "12px", cursor: "pointer",
          border: `1.5px solid ${hovered === "kakao" ? "#D4BC00" : "#FEE500"}`,
          background: "#FEE500", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s",
          transform: hovered === "kakao" ? "translateY(-1px)" : "none",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 3C6.477 3 2 6.477 2 10.857c0 2.762 1.731 5.193 4.337 6.637L5.3 21l4.868-2.857c.594.082 1.203.124 1.832.124 5.523 0 10-3.477 10-7.857C22 6.477 17.523 3 12 3z" fill="#3C1E1E"/>
          </svg>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#3C1E1E" }}>카카오로 계속하기</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", background: T.border }} />
          <span style={{ fontSize: "11px", color: T.textMuted }}>또는</span>
          <div style={{ flex: 1, height: "1px", background: T.border }} />
        </div>

        {/* Email */}
        <button onMouseEnter={() => setHovered("email")} onMouseLeave={() => setHovered(null)} onClick={() => handleLogin("email")} style={{
          width: "100%", padding: "14px 18px", borderRadius: "12px", cursor: "pointer",
          border: `1.5px solid ${hovered === "email" ? T.accentBorder : T.border}`,
          background: hovered === "email" ? T.accentSoft : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s",
        }}>
          <span style={{ fontSize: "15px" }}>✉️</span>
          <span style={{ fontSize: "14px", fontWeight: "600", color: T.textSub }}>이메일로 계속하기</span>
        </button>
      </div>

      <p style={{ fontSize: "11px", color: T.textMuted, textAlign: "center", lineHeight: "1.7" }}>
        계속 진행하면 <span style={{ color: T.accent, cursor: "pointer" }}>이용약관</span>과{" "}
        <span style={{ color: T.accent, cursor: "pointer" }}>개인정보처리방침</span>에 동의합니다
      </p>
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, padding: "24px 16px 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 100 }}>
          <ThemeToggle isDark={isDark} T={T} />
        </div>
        <LoginCard />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 100 }}><ThemeToggle isDark={isDark} T={T} /></div>
      <div style={{ position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${T.accentSoft} 0%, transparent 65%)`, pointerEvents: "none" }} />

      {/* Left */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "460px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "72px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(245,166,35,0.35)" }}>
              <span style={{ color: "#000", fontSize: "18px", fontWeight: "800" }}>C</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "800", color: T.text, letterSpacing: "-0.03em" }}>CoStart</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 4vw, 54px)", fontWeight: "800", color: T.text, lineHeight: "1.15", letterSpacing: "-0.03em", marginBottom: "18px" }}>
            AI 팀과 함께<br /><span style={{ color: T.accent }}>창업을 시작하세요</span>
          </h1>
          <p style={{ fontSize: "16px", color: T.textSub, lineHeight: "1.75", marginBottom: "48px" }}>
            기획·마케팅·개발·재무 AI 전문가가 팀을 꾸려<br />함께 일해드려요. 아이디어만 있으면 돼요.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {[
              { emoji: "🤖", title: "AI 팀 자동 구성", desc: "분야별 맞춤 에이전트가 팀을 이뤄요" },
              { emoji: "💬", title: "실시간 협업 채팅", desc: "팀원 대화를 AI가 자동으로 분석·업데이트해요" },
              { emoji: "📄", title: "문서 자동 생성", desc: "대화 기반으로 사업계획서가 만들어져요" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: T.surface2, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{f.emoji}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: T.text, marginBottom: "2px" }}>{f.title}</div>
                  <div style={{ fontSize: "13px", color: T.textSub }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ width: "460px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", position: "relative", zIndex: 1 }}>
        <LoginCard />
      </div>
    </div>
  );
}

// ── Theme Toggle ───────────────────────────────────────────────
function ThemeToggle({ isDark, T, setIsDark }) {
  return (
    <button onClick={() => setIsDark && setIsDark(p => !p)} style={{
      width: "40px", height: "40px", borderRadius: "10px",
      border: `1px solid ${T.border}`, background: T.surface,
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "16px", boxShadow: T.shadow,
    }}>{isDark ? "☀️" : "🌙"}</button>
  );
}

// ── Idea Input Page ────────────────────────────────────────────
function IdeaInputPage({ isDark, T, isMobile, user, onSubmit }) {
  const [idea, setIdea] = useState("");
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      {/* Nav */}
      <div style={{ padding: isMobile ? "14px 16px" : "14px 24px", borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#000", fontSize: "15px", fontWeight: "800" }}>C</span>
          </div>
          <span style={{ fontSize: "17px", fontWeight: "800", color: T.text, letterSpacing: "-0.03em" }}>CoStart</span>
        </div>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: T.accentSoft, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: T.accent }}>
          {user?.name?.[0] || "U"}
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: isMobile ? "28px 16px 80px" : "52px 24px 80px" }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: T.accent, textTransform: "uppercase", marginBottom: "8px" }}>새 프로젝트</div>
          <h1 style={{ fontSize: isMobile ? "26px" : "36px", fontWeight: "800", color: T.text, letterSpacing: "-0.03em", marginBottom: "8px", lineHeight: "1.2" }}>
            어떤 아이디어로 시작할까요?
          </h1>
          <p style={{ fontSize: "14px", color: T.textSub, lineHeight: "1.7" }}>아이디어를 입력하면 AI 팀이 구성돼요</p>
        </div>

        {/* Idea input */}
        <div style={{ background: T.surface, borderRadius: "14px", border: `1.5px solid ${idea ? T.accentBorder : T.border}`, padding: "18px", marginBottom: "20px", transition: "all 0.2s", boxShadow: idea ? `0 0 0 3px ${T.accentSoft}` : "none" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: T.textMuted, textTransform: "uppercase", marginBottom: "10px" }}>창업 아이디어</div>
          <textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="예: 반려동물 건강 관리 IoT 디바이스와 앱 서비스" style={{ width: "100%", border: "none", resize: "none", outline: "none", background: "transparent", color: T.text, fontSize: "15px", lineHeight: "1.75", minHeight: "100px" }} />
        </div>

        {/* Field selection */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: T.text, marginBottom: "12px" }}>
            분야 선택 <span style={{ fontSize: "11px", fontWeight: "400", color: T.textMuted }}>(선택사항)</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" }}>
            {FIELDS.map(f => (
              <button key={f.id} onClick={() => setSelectedField(selectedField === f.id ? null : f.id)} style={{
                padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                border: `1.5px solid ${selectedField === f.id ? T.accent : T.border}`,
                background: selectedField === f.id ? T.accentSoft : T.surface,
                color: selectedField === f.id ? T.accent : T.textSub,
                fontSize: "12px", fontWeight: selectedField === f.id ? "700" : "500",
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px", textAlign: "left",
              }}>
                <span style={{ fontSize: "14px" }}>{f.emoji}</span>
                <span style={{ lineHeight: "1.3", fontSize: isMobile ? "11px" : "12px" }}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button onClick={() => { if (!idea.trim()) return; setLoading(true); setTimeout(() => { setLoading(false); onSubmit(idea, selectedField); }, 1000); }} disabled={!idea.trim() || loading} style={{
          width: "100%", padding: "16px", borderRadius: "12px", border: "none",
          background: !idea.trim() ? T.surface2 : T.accent,
          color: !idea.trim() ? T.textMuted : "#000",
          fontSize: "15px", fontWeight: "800", letterSpacing: "-0.01em",
          cursor: !idea.trim() ? "not-allowed" : "pointer", transition: "all 0.2s",
          boxShadow: idea.trim() ? "0 8px 24px rgba(245,166,35,0.3)" : "none",
        }}>
          {loading ? "AI 팀 구성 중..." : "🚀 AI 팀 꾸리고 시작하기"}
        </button>

        {/* Recent */}
        <div style={{ marginTop: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: T.textSub, marginBottom: "12px" }}>최근 프로젝트</div>
          <div style={{ background: T.surface, borderRadius: "12px", border: `1px solid ${T.border}`, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            onClick={() => onSubmit(MOCK_PREVIOUS_WORK.idea, MOCK_PREVIOUS_WORK.field)}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: T.accentSoft, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>🔧</div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: T.text }}>{MOCK_PREVIOUS_WORK.idea}</div>
                <div style={{ fontSize: "11px", color: T.textMuted, marginTop: "2px" }}>마지막 활동 {MOCK_PREVIOUS_WORK.lastActive}</div>
              </div>
            </div>
            <div style={{ fontSize: "12px", color: T.accent, fontWeight: "600", flexShrink: 0, marginLeft: "8px" }}>이어서 →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Workspace Page ─────────────────────────────────────────────
function WorkspacePage({ isDark, T, isMobile, idea, user, onNewProject }) {
  const [activeAgent, setActiveAgent] = useState("planner");
  const [activeTab, setActiveTab] = useState("ai");
  const [showAgents, setShowAgents] = useState(false);
  const [aiMessages, setAiMessages] = useState({
    planner: [{ role: "assistant", content: `안녕하세요! AI 기획자예요.\n\n**"${idea}"** 아이디어로 창업을 시작하시는군요! 사업 전략과 기획 측면에서 도와드릴게요.\n\n아래 빠른 질문을 눌러보거나 직접 질문해주세요 😊` }],
    marketer: [{ role: "assistant", content: `안녕하세요! AI 마케터예요.\n\n**"${idea}"** 의 마케팅 전략을 함께 세워봐요.` }],
    developer: [{ role: "assistant", content: `안녕하세요! AI 개발자예요.\n\n**"${idea}"** 의 기술 구현을 도와드릴게요.` }],
    finance: [{ role: "assistant", content: `안녕하세요! AI 재무전문가예요.\n\n**"${idea}"** 의 재무 계획을 세워봐요.` }],
  });
  const [teamMessages, setTeamMessages] = useState([
    { id: 1, sender: "이준", avatar: "이", content: "오늘 마케팅 예산 검토해봤는데 초기엔 100만원으로 시작하는 게 좋을 것 같아요", time: "10:23", isMe: true },
    { id: 2, sender: "AI 재무전문가", avatar: "💰", content: "100만원 예산으로 퍼포먼스 마케팅 집행 시 예상 ROAS 분석을 해드릴까요?", time: "10:24", isAI: true, color: "#5B9BD5" },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [teamInput, setTeamInput] = useState("");
  const [docs, setDocs] = useState([]);
  const [showDocs, setShowDocs] = useState(false);
  const bottomRef = useRef(null);

  const currentAgent = AGENTS.find(a => a.id === activeAgent);
  const currentMsgs = aiMessages[activeAgent] || [];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages, teamMessages, activeAgent, activeTab]);

  const sendAi = (text) => {
    const msg = text || aiInput.trim();
    if (!msg) return;
    setAiInput("");
    setAiMessages(prev => ({ ...prev, [activeAgent]: [...prev[activeAgent], { role: "user", content: msg }] }));
    setTimeout(() => {
      const reply = `**${msg}**에 대한 ${currentAgent.name}의 분석이에요.\n\n- 핵심 포인트 1: 시장 진입 전략이 중요해요\n- 핵심 포인트 2: 초기 타겟을 좁게 잡는 것이 효과적이에요\n- 핵심 포인트 3: 빠른 MVP 검증이 필요해요\n\n더 구체적인 내용이 필요하시면 말씀해주세요!`;
      setAiMessages(prev => ({ ...prev, [activeAgent]: [...prev[activeAgent], { role: "assistant", content: reply }] }));
      if (msg.includes("작성") || msg.includes("분석") || msg.includes("계획")) {
        setDocs(p => [{ agent: currentAgent.name, emoji: currentAgent.emoji, title: msg, content: reply, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) }, ...p]);
      }
    }, 800);
  };

  const sendTeam = () => {
    if (!teamInput.trim()) return;
    const msg = teamInput.trim();
    setTeamInput("");
    setTeamMessages(p => [...p, { id: Date.now(), sender: user?.name || "나", avatar: (user?.name || "나")[0], content: msg, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), isMe: true }]);
    setTimeout(() => {
      setTeamMessages(p => [...p, { id: Date.now() + 1, sender: "AI 기획자", avatar: "📋", content: `"${msg}" 관련 전략을 업데이트해드릴까요?`, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), isAI: true, color: "#F5A623" }]);
    }, 1000);
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: T.bg }}>
        {/* Mobile top bar */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={() => setShowAgents(!showAgents)} style={{ width: "32px", height: "32px", borderRadius: "8px", background: currentAgent.colorSoft, border: `1px solid ${currentAgent.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", cursor: "pointer" }}>{currentAgent.emoji}</button>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: T.text }}>{currentAgent.name}</div>
              <div style={{ fontSize: "10px", color: T.textMuted, maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{idea}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setShowDocs(p => !p)} style={{ padding: "6px 10px", borderRadius: "8px", border: `1px solid ${T.border}`, background: "transparent", color: T.textSub, fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>
              📄 {docs.length > 0 ? docs.length : ""}
            </button>
            <button onClick={onNewProject} style={{ padding: "6px 10px", borderRadius: "8px", border: `1px solid ${T.border}`, background: "transparent", color: T.textSub, fontSize: "11px", cursor: "pointer" }}>+ 새 프로젝트</button>
          </div>
        </div>

        {/* Agent selector overlay */}
        {showAgents && (
          <div style={{ position: "absolute", top: "60px", left: 0, right: 0, background: T.surface, borderBottom: `1px solid ${T.border}`, zIndex: 100, padding: "8px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {AGENTS.map(a => (
                <button key={a.id} onClick={() => { setActiveAgent(a.id); setActiveTab("ai"); setShowAgents(false); }} style={{
                  padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${activeAgent === a.id ? a.color : T.border}`,
                  background: activeAgent === a.id ? a.colorSoft : T.surface2,
                  display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
                }}>
                  <span style={{ fontSize: "18px" }}>{a.emoji}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: activeAgent === a.id ? a.color : T.textSub }}>{a.name}</span>
                </button>
              ))}
              <button onClick={() => { setActiveTab("team"); setShowAgents(false); }} style={{
                padding: "10px 12px", borderRadius: "10px", border: `1.5px solid ${activeTab === "team" ? T.accent : T.border}`,
                background: activeTab === "team" ? T.accentSoft : T.surface2,
                display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", gridColumn: "span 2",
              }}>
                <span style={{ fontSize: "18px" }}>👥</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: activeTab === "team" ? T.accent : T.textSub }}>팀 채팅</span>
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {activeTab === "ai" && currentMsgs.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
              {msg.role === "assistant" && (
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: currentAgent.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{currentAgent.emoji}</div>
              )}
              <div style={{ maxWidth: "80%", padding: "10px 13px", borderRadius: msg.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: msg.role === "user" ? T.accentSoft : T.surface, border: `1px solid ${msg.role === "user" ? T.accentBorder : T.border}` }}>
                {msg.role === "assistant" ? renderMd(msg.content, T) : <span style={{ fontSize: "13px", color: T.text, lineHeight: "1.7" }}>{msg.content}</span>}
              </div>
            </div>
          ))}

          {activeTab === "team" && teamMessages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: "8px", flexDirection: msg.isMe ? "row-reverse" : "row", alignItems: "flex-start" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: msg.isAI ? `${msg.color}20` : T.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: msg.isAI ? "14px" : "11px", fontWeight: "700", color: msg.isAI ? msg.color : T.text, flexShrink: 0 }}>{msg.avatar}</div>
              <div style={{ maxWidth: "78%" }}>
                <div style={{ fontSize: "10px", color: T.textMuted, marginBottom: "3px", textAlign: msg.isMe ? "right" : "left" }}>{msg.sender} · {msg.time}</div>
                <div style={{ padding: "10px 13px", borderRadius: msg.isMe ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: msg.isMe ? T.accentSoft : msg.isAI ? `${msg.color}12` : T.surface, border: `1px solid ${msg.isMe ? T.accentBorder : msg.isAI ? `${msg.color}30` : T.border}` }}>
                  <span style={{ fontSize: "13px", color: T.text, lineHeight: "1.7" }}>{msg.content}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Quick prompts */}
          {activeTab === "ai" && currentMsgs.length <= 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
              {(QUICK[activeAgent] || []).map((q, i) => (
                <button key={i} onClick={() => sendAi(q)} style={{ padding: "7px 12px", borderRadius: "20px", cursor: "pointer", border: `1px solid ${currentAgent.color}40`, background: currentAgent.colorSoft, color: currentAgent.color, fontSize: "12px", fontWeight: "600" }}>{q}</button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}`, background: T.surface, display: "flex", gap: "8px" }}>
          <input
            value={activeTab === "ai" ? aiInput : teamInput}
            onChange={e => activeTab === "ai" ? setAiInput(e.target.value) : setTeamInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") activeTab === "ai" ? sendAi() : sendTeam(); }}
            placeholder={activeTab === "ai" ? `${currentAgent.name}에게 질문...` : "팀원에게 메시지..."}
            style={{ flex: 1, padding: "11px 14px", borderRadius: "10px", border: `1.5px solid ${T.border}`, background: T.surface2, color: T.text, fontSize: "14px", outline: "none" }}
          />
          <button onClick={() => activeTab === "ai" ? sendAi() : sendTeam()} style={{ padding: "11px 16px", borderRadius: "10px", border: "none", background: activeTab === "ai" ? currentAgent.color : T.accent, color: "#000", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>전송</button>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{ padding: "12px 24px", borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#000", fontSize: "14px", fontWeight: "800" }}>C</span>
            </div>
            <span style={{ fontSize: "16px", fontWeight: "800", color: T.text, letterSpacing: "-0.03em" }}>CoStart</span>
          </div>
          <div style={{ height: "16px", width: "1px", background: T.border }} />
          <div style={{ fontSize: "13px", color: T.textSub, maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{idea}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setShowDocs(p => !p)} style={{ padding: "7px 14px", borderRadius: "8px", cursor: "pointer", border: `1px solid ${showDocs ? T.accentBorder : T.border}`, background: showDocs ? T.accentSoft : "transparent", color: showDocs ? T.accent : T.textSub, fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
            📄 문서 {docs.length > 0 && <span style={{ background: T.accent, color: "#000", borderRadius: "8px", padding: "1px 6px", fontSize: "10px", fontWeight: "700" }}>{docs.length}</span>}
          </button>
          <button onClick={onNewProject} style={{ padding: "7px 14px", borderRadius: "8px", cursor: "pointer", border: `1px solid ${T.border}`, background: "transparent", color: T.textSub, fontSize: "12px", fontWeight: "600" }}>+ 새 프로젝트</button>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: T.accentSoft, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: T.accent }}>{user?.name?.[0] || "U"}</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: "200px", borderRight: `1px solid ${T.border}`, background: T.surface, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "10px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", background: T.surface2, borderRadius: "8px", padding: "3px", gap: "2px" }}>
              {[{ id: "ai", label: "AI 팀" }, { id: "team", label: "팀 채팅" }].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer", background: activeTab === t.id ? T.surface : "transparent", color: activeTab === t.id ? T.text : T.textMuted, fontSize: "11px", fontWeight: "700" }}>{t.label}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {activeTab === "ai" && AGENTS.map(a => (
              <button key={a.id} onClick={() => setActiveAgent(a.id)} style={{ width: "100%", padding: "12px 14px", textAlign: "left", cursor: "pointer", border: "none", background: activeAgent === a.id ? T.surface2 : "transparent", borderLeft: `3px solid ${activeAgent === a.id ? a.color : "transparent"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: a.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>{a.emoji}</div>
                  <span style={{ fontSize: "12px", fontWeight: activeAgent === a.id ? "700" : "500", color: activeAgent === a.id ? a.color : T.textSub }}>{a.name}</span>
                </div>
              </button>
            ))}
            {activeTab === "team" && [{ name: user?.name || "나", avatar: (user?.name || "나")[0], role: "대표" }, { name: "김지훈", avatar: "김", role: "개발자" }].map((m, i) => (
              <div key={i} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: T.text }}>{m.avatar}</div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: T.text }}>{m.name}</div>
                  <div style={{ fontSize: "10px", color: T.textMuted }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            {activeTab === "ai" ? (
              <>
                <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: currentAgent.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{currentAgent.emoji}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: T.text }}>{currentAgent.name}</div>
                  <div style={{ fontSize: "11px", color: T.textMuted }}>전용 AI 에이전트</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "22px" }}>👥</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: T.text }}>팀 채팅</div>
                  <div style={{ fontSize: "11px", color: T.textMuted }}>팀원 대화를 AI가 실시간으로 분석해요</div>
                </div>
              </>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {activeTab === "ai" && currentMsgs.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                {msg.role === "assistant" && <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: currentAgent.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{currentAgent.emoji}</div>}
                <div style={{ maxWidth: "75%", padding: "12px 14px", borderRadius: msg.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: msg.role === "user" ? T.accentSoft : T.surface2, border: `1px solid ${msg.role === "user" ? T.accentBorder : T.border}` }}>
                  {msg.role === "assistant" ? renderMd(msg.content, T) : <span style={{ fontSize: "13px", color: T.text, lineHeight: "1.7" }}>{msg.content}</span>}
                </div>
              </div>
            ))}

            {activeTab === "team" && teamMessages.map(msg => (
              <div key={msg.id} style={{ display: "flex", gap: "10px", flexDirection: msg.isMe ? "row-reverse" : "row", alignItems: "flex-start" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: msg.isAI ? `${msg.color}20` : T.surface3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: msg.isAI ? "14px" : "11px", fontWeight: "700", color: msg.isAI ? msg.color : T.text, flexShrink: 0 }}>{msg.avatar}</div>
                <div style={{ maxWidth: "70%" }}>
                  <div style={{ fontSize: "10px", color: T.textMuted, marginBottom: "4px", textAlign: msg.isMe ? "right" : "left" }}>{msg.sender} · {msg.time}</div>
                  <div style={{ padding: "10px 14px", borderRadius: msg.isMe ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: msg.isMe ? T.accentSoft : msg.isAI ? `${msg.color}12` : T.surface2, border: `1px solid ${msg.isMe ? T.accentBorder : msg.isAI ? `${msg.color}30` : T.border}` }}>
                    <span style={{ fontSize: "13px", color: T.text, lineHeight: "1.7" }}>{msg.content}</span>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === "ai" && currentMsgs.length <= 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {(QUICK[activeAgent] || []).map((q, i) => (
                  <button key={i} onClick={() => sendAi(q)} style={{ padding: "7px 14px", borderRadius: "20px", cursor: "pointer", border: `1px solid ${currentAgent.color}40`, background: currentAgent.colorSoft, color: currentAgent.color, fontSize: "12px", fontWeight: "600" }}>{q}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: "10px", background: T.surface }}>
            <input value={activeTab === "ai" ? aiInput : teamInput} onChange={e => activeTab === "ai" ? setAiInput(e.target.value) : setTeamInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) activeTab === "ai" ? sendAi() : sendTeam(); }} placeholder={activeTab === "ai" ? `${currentAgent.name}에게 질문하세요...` : "팀원에게 메시지 보내기..."} style={{ flex: 1, padding: "11px 16px", borderRadius: "10px", border: `1.5px solid ${T.border}`, background: T.surface2, color: T.text, fontSize: "14px", outline: "none" }} onFocus={e => e.target.style.borderColor = activeTab === "ai" ? currentAgent.color + "60" : T.accentBorder} onBlur={e => e.target.style.borderColor = T.border} />
            <button onClick={() => activeTab === "ai" ? sendAi() : sendTeam()} style={{ padding: "11px 18px", borderRadius: "10px", border: "none", background: activeTab === "ai" ? currentAgent.color : T.accent, color: "#000", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>전송</button>
          </div>
        </div>

        {/* Docs panel */}
        {showDocs && (
          <div style={{ width: "300px", borderLeft: `1px solid ${T.border}`, background: T.surface, flexShrink: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: T.text }}>문서 ({docs.length})</div>
              <button onClick={() => setShowDocs(false)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: "18px" }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
              {docs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: T.textMuted, fontSize: "13px", lineHeight: "1.7" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>📄</div>
                  AI에게 문서 작성을<br />요청하면 여기 저장돼요
                </div>
              ) : docs.map((doc, i) => (
                <div key={i} style={{ padding: "12px", borderRadius: "10px", border: `1px solid ${T.border}`, marginBottom: "8px", background: T.surface2, cursor: "pointer" }}>
                  <div style={{ fontSize: "16px", marginBottom: "6px" }}>{doc.emoji}</div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: T.text, marginBottom: "3px" }}>{doc.title}</div>
                  <div style={{ fontSize: "10px", color: T.textMuted }}>{doc.agent} · {doc.time}</div>
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
  const [isDark, setIsDark] = useState(true);
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [idea, setIdea] = useState("");
  const [field, setField] = useState(null);
  const isMobile = useIsMobile();
  const T = getTheme(isDark);

  const handleLogin = (provider, previousWork) => {
    setUser({ name: "이준", provider });
    if (previousWork) { setIdea(previousWork.idea); setField(previousWork.field); setPage("workspace"); }
    else setPage("idea");
  };

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Pretendard', -apple-system, sans-serif; }
        body { background: ${T.bg}; }
        input::placeholder, textarea::placeholder { color: ${T.textMuted}; }
        button { font-family: 'Pretendard', -apple-system, sans-serif; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
      `}</style>

      {/* Global theme toggle */}
      {page !== "workspace" && (
        <button onClick={() => setIsDark(p => !p)} style={{ position: "fixed", top: "16px", right: "16px", zIndex: 1000, width: "40px", height: "40px", borderRadius: "10px", border: `1px solid ${T.border}`, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
          {isDark ? "☀️" : "🌙"}
        </button>
      )}

      {page === "login" && <LoginPage isDark={isDark} T={T} isMobile={isMobile} onLogin={handleLogin} />}
      {page === "idea" && <IdeaInputPage isDark={isDark} T={T} isMobile={isMobile} user={user} onSubmit={(i, f) => { setIdea(i); setField(f); setPage("workspace"); }} />}
      {page === "workspace" && <WorkspacePage isDark={isDark} T={T} isMobile={isMobile} idea={idea} field={field} user={user} onNewProject={() => setPage("idea")} />}
    </>
  );
}

