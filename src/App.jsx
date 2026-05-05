import { useState } from "react"
import { supabase } from './supabase'
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

// ── Fields (expanded) ──────────────────────────────────────────
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
  { id: "space", label: "우주·항공", emoji: "🚀" },
  { id: "bio", label: "바이오·의료", emoji: "🧬" },
  { id: "energy", label: "에너지·클린테크", emoji: "⚡" },
  { id: "other", label: "기타", emoji: "✦" },
];

// ── Mock workspace data ────────────────────────────────────────
const MOCK_PREVIOUS_WORK = {
  idea: "반려동물 건강 관리 IoT 디바이스 앱",
  field: "hardware",
  lastActive: "2시간 전",
};

// ── Login Page ─────────────────────────────────────────────────
function LoginPage({ isDark, T, onLogin }) {
  const [hovered, setHovered] = useState(null);

  // 로그인 시 이전 작업 있으면 workspace로, 없으면 idea input으로
  const handleLogin = (provider) => {
    const hasPreviousWork = Math.random() > 0.5; // Mock: 50% 확률로 이전 작업 있음
    onLogin(provider, hasPreviousWork ? MOCK_PREVIOUS_WORK : null);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", transition: "background 0.3s", position: "relative", overflow: "hidden" }}>

      {/* BG glow */}
      <div style={{ position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${T.accentSoft} 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-200px", left: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${isDark ? "rgba(34,197,94,0.05)" : "rgba(34,197,94,0.06)"} 0%, transparent 65%)`, pointerEvents: "none" }} />

      {/* Left — branding */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "460px" }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "72px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(245,166,35,0.35)" }}>
              <span style={{ color: "#000", fontSize: "18px", fontWeight: "800" }}>C</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "800", color: T.text, letterSpacing: "-0.03em" }}>CoStart</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 4vw, 54px)", fontWeight: "800", color: T.text, lineHeight: "1.15", letterSpacing: "-0.03em", marginBottom: "18px" }}>
            AI 팀과 함께<br />
            <span style={{ color: T.accent }}>창업을 시작하세요</span>
          </h1>

          <p style={{ fontSize: "16px", color: T.textSub, lineHeight: "1.75", marginBottom: "52px" }}>
            기획·마케팅·개발·재무 AI 전문가가 팀을 꾸려<br />
            함께 일해드려요. 아이디어만 있으면 돼요.
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

      {/* Right — login card */}
      <div style={{ width: "460px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <div style={{ background: T.surface, borderRadius: "20px", border: `1px solid ${T.border}`, padding: "36px", boxShadow: T.shadow, transition: "all 0.3s" }}>

            <h2 style={{ fontSize: "22px", fontWeight: "800", color: T.text, letterSpacing: "-0.02em", marginBottom: "6px" }}>로그인 / 회원가입</h2>
            <p style={{ fontSize: "13px", color: T.textSub, marginBottom: "28px", lineHeight: "1.6" }}>소셜 계정으로 간편하게 시작하세요</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              {/* Google */}
              <button
                onMouseEnter={() => setHovered("google")}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleLogin("google")}
                style={{
                  width: "100%", padding: "14px 18px", borderRadius: "12px", cursor: "pointer",
                  border: `1.5px solid ${hovered === "google" ? "#4285F4" : T.border}`,
                  background: hovered === "google" ? (isDark ? "rgba(66,133,244,0.1)" : "rgba(66,133,244,0.06)") : T.surface2,
                  display: "flex", alignItems: "center", gap: "12px",
                  transition: "all 0.2s",
                  transform: hovered === "google" ? "translateY(-2px)" : "none",
                  boxShadow: hovered === "google" ? "0 8px 20px rgba(66,133,244,0.15)" : "none",
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
              <button
                onMouseEnter={() => setHovered("kakao")}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleLogin("kakao")}
                style={{
                  width: "100%", padding: "14px 18px", borderRadius: "12px", cursor: "pointer",
                  border: `1.5px solid ${hovered === "kakao" ? "#D4BC00" : "#FEE500"}`,
                  background: "#FEE500",
                  display: "flex", alignItems: "center", gap: "12px",
                  transition: "all 0.2s",
                  transform: hovered === "kakao" ? "translateY(-2px)" : "none",
                  boxShadow: hovered === "kakao" ? "0 8px 20px rgba(254,229,0,0.4)" : "none",
                }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 3C6.477 3 2 6.477 2 10.857c0 2.762 1.731 5.193 4.337 6.637L5.3 21l4.868-2.857c.594.082 1.203.124 1.832.124 5.523 0 10-3.477 10-7.857C22 6.477 17.523 3 12 3z" fill="#3C1E1E"/>
                </svg>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#3C1E1E" }}>카카오로 계속하기</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" }}>
                <div style={{ flex: 1, height: "1px", background: T.border }} />
                <span style={{ fontSize: "11px", color: T.textMuted }}>또는</span>
                <div style={{ flex: 1, height: "1px", background: T.border }} />
              </div>

              {/* Email */}
              <button
                onMouseEnter={() => setHovered("email")}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleLogin("email")}
                style={{
                  width: "100%", padding: "14px 18px", borderRadius: "12px", cursor: "pointer",
                  border: `1.5px solid ${hovered === "email" ? T.accentBorder : T.border}`,
                  background: hovered === "email" ? T.accentSoft : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  transition: "all 0.2s",
                }}>
                <span style={{ fontSize: "16px" }}>✉️</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: T.textSub }}>이메일로 계속하기</span>
              </button>
            </div>

            <p style={{ fontSize: "11px", color: T.textMuted, textAlign: "center", lineHeight: "1.7", marginTop: "20px" }}>
              계속 진행하면 <span style={{ color: T.accent, cursor: "pointer" }}>이용약관</span>과{" "}
              <span style={{ color: T.accent, cursor: "pointer" }}>개인정보처리방침</span>에 동의합니다
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
            {[{ dot: "#22C55E", label: "서버 정상" }, { dot: T.accent, label: "베타 서비스" }].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot }} />
                <span style={{ fontSize: "11px", color: T.textMuted }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Idea Input Page ────────────────────────────────────────────
function IdeaInputPage({ isDark, T, user, onSubmit }) {
  const [idea, setIdea] = useState("");
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!idea.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit(idea, selectedField); }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, transition: "background 0.3s" }}>

      {/* Top nav */}
      <div style={{ padding: "16px 32px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: T.surface, position: "sticky", top: 0, zIndex: 50, transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#000", fontSize: "16px", fontWeight: "800" }}>C</span>
          </div>
          <span style={{ fontSize: "18px", fontWeight: "800", color: T.text, letterSpacing: "-0.03em" }}>CoStart</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: T.accentSoft, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: T.accent }}>
            {user?.name?.[0] || "U"}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "52px 24px 80px" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: T.accent, textTransform: "uppercase", marginBottom: "10px" }}>새 프로젝트 시작</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "800", color: T.text, letterSpacing: "-0.03em", marginBottom: "10px", lineHeight: "1.2" }}>
            어떤 아이디어로 시작할까요?
          </h1>
          <p style={{ fontSize: "15px", color: T.textSub, lineHeight: "1.7" }}>
            아이디어를 입력하면 AI 팀이 구성되어 함께 일을 시작해요
          </p>
        </div>

        {/* Idea input */}
        <div style={{ background: T.surface, borderRadius: "16px", border: `1.5px solid ${idea ? T.accentBorder : T.border}`, padding: "20px", marginBottom: "28px", transition: "all 0.2s", boxShadow: idea ? `0 0 0 3px ${T.accentSoft}` : "none" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: T.textMuted, textTransform: "uppercase", marginBottom: "10px" }}>창업 아이디어</div>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="예: 반려동물 건강 관리 IoT 디바이스와 앱 서비스&#10;&#10;어떤 아이디어든 괜찮아요. 간단하게 적어주세요."
            style={{
              width: "100%", border: "none", resize: "none", outline: "none",
              background: "transparent", color: T.text,
              fontSize: "15px", lineHeight: "1.75", minHeight: "120px",
            }}
          />
        </div>

        {/* Field selection */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: T.text, marginBottom: "14px" }}>
            분야 선택 <span style={{ fontSize: "12px", fontWeight: "400", color: T.textMuted }}>(선택사항 · 선택 시 분야 전문 AI 에이전트가 추가돼요)</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "8px" }}>
            {FIELDS.map(f => (
              <button key={f.id} onClick={() => setSelectedField(selectedField === f.id ? null : f.id)} style={{
                padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                border: `1.5px solid ${selectedField === f.id ? T.accent : T.border}`,
                background: selectedField === f.id ? T.accentSoft : T.surface,
                color: selectedField === f.id ? T.accent : T.textSub,
                fontSize: "13px", fontWeight: selectedField === f.id ? "700" : "500",
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: "7px", textAlign: "left",
              }}>
                <span style={{ fontSize: "16px" }}>{f.emoji}</span>
                <span style={{ lineHeight: "1.3" }}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button onClick={handleSubmit} disabled={!idea.trim() || loading} style={{
          width: "100%", padding: "16px", borderRadius: "12px", border: "none",
          background: !idea.trim() ? T.surface2 : T.accent,
          color: !idea.trim() ? T.textMuted : "#000",
          fontSize: "15px", fontWeight: "800", letterSpacing: "-0.01em",
          cursor: !idea.trim() ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          boxShadow: idea.trim() ? "0 8px 24px rgba(245,166,35,0.3)" : "none",
        }}>
          {loading ? "AI 팀 구성 중..." : "🚀 AI 팀 꾸리고 시작하기"}
        </button>

        {/* Recent projects (mock) */}
        <div style={{ marginTop: "48px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: T.textSub, marginBottom: "14px" }}>최근 프로젝트</div>
          <div style={{ background: T.surface, borderRadius: "12px", border: `1px solid ${T.border}`, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.accentBorder}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
            onClick={() => onSubmit(MOCK_PREVIOUS_WORK.idea, MOCK_PREVIOUS_WORK.field)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: T.accentSoft, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🔧</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: T.text }}>{MOCK_PREVIOUS_WORK.idea}</div>
                <div style={{ fontSize: "12px", color: T.textMuted, marginTop: "2px" }}>마지막 활동 {MOCK_PREVIOUS_WORK.lastActive}</div>
              </div>
            </div>
            <div style={{ fontSize: "12px", color: T.accent, fontWeight: "600" }}>이어서 →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Workspace Page ─────────────────────────────────────────────
function WorkspacePage({ isDark, T, idea, field, user, onNewProject }) {
  const [activeTab, setActiveTab] = useState("ai"); // ai | team
  const [activeAgent, setActiveAgent] = useState("planner");
  const [aiMessages, setAiMessages] = useState({
    planner: [{ role: "assistant", content: `안녕하세요! AI 기획자예요.\n\n**"${idea}"** 아이디어로 창업을 시작하시는군요! 사업 전략과 기획 측면에서 도와드릴게요.\n\n아래 빠른 질문을 눌러보거나 직접 질문해주세요 😊` }],
    marketer: [{ role: "assistant", content: `안녕하세요! AI 마케터예요.\n\n**"${idea}"** 의 마케팅 전략을 함께 세워봐요. 타겟 고객 분석부터 런칭 전략까지 도와드릴게요.` }],
    developer: [{ role: "assistant", content: `안녕하세요! AI 개발자예요.\n\n**"${idea}"** 의 기술 구현을 도와드릴게요. MVP 설계, 기술 스택 선택, 개발 로드맵을 함께 만들어봐요.` }],
    finance: [{ role: "assistant", content: `안녕하세요! AI 재무전문가예요.\n\n**"${idea}"** 의 재무 계획을 세워봐요. 초기 비용부터 손익분기점까지 분석해드릴게요.` }],
  });
  const [teamMessages, setTeamMessages] = useState([
    { id: 1, sender: "이준", avatar: "이", content: "오늘 마케팅 예산 검토해봤는데 초기엔 100만원으로 시작하는 게 좋을 것 같아요", time: "10:23", isMe: true },
    { id: 2, sender: "AI 재무전문가", avatar: "💰", content: "100만원 예산으로 퍼포먼스 마케팅 집행 시 예상 ROAS 분석을 해드릴까요?", time: "10:24", isAI: true, color: "#5B9BD5" },
    { id: 3, sender: "김지훈", avatar: "김", content: "좋아요! 그리고 MVP 개발 일정도 공유드릴게요. 다음 주 중으로 와이어프레임 완성 예정이에요", time: "10:26", isMe: false },
    { id: 4, sender: "AI 기획자", avatar: "📋", content: "MVP 와이어프레임 완성 후 사용자 테스트 계획도 함께 세워드릴게요", time: "10:26", isAI: true, color: "#F5A623" },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [teamInput, setTeamInput] = useState("");
  const [docs, setDocs] = useState([]);
  const [showDocs, setShowDocs] = useState(false);

  const AGENTS = [
    { id: "planner", name: "AI 기획자", emoji: "📋", color: "#F5A623", colorSoft: "rgba(245,166,35,0.12)" },
    { id: "marketer", name: "AI 마케터", emoji: "📣", color: "#B57BFF", colorSoft: "rgba(181,123,255,0.12)" },
    { id: "developer", name: "AI 개발자", emoji: "💻", color: "#22C55E", colorSoft: "rgba(34,197,94,0.12)" },
    { id: "finance", name: "AI 재무", emoji: "💰", color: "#5B9BD5", colorSoft: "rgba(91,155,213,0.12)" },
  ];

  const QUICK = {
    planner: ["사업계획서 초안 작성", "시장 규모 분석", "경쟁사 분석", "비즈니스 모델 설계"],
    marketer: ["타겟 고객 분석", "마케팅 전략 수립", "SNS 전략 기획", "런칭 캠페인 기획"],
    developer: ["MVP 기능 명세 작성", "기술 스택 추천", "개발 로드맵", "시스템 아키텍처"],
    finance: ["초기 비용 계산", "손익분기점 분석", "수익 모델 정리", "투자 유치 전략"],
  };

  const currentAgent = AGENTS.find(a => a.id === activeAgent);
  const currentAiMsgs = aiMessages[activeAgent] || [];

  const sendAiMessage = (text) => {
    const msg = text || aiInput.trim();
    if (!msg) return;
    setAiInput("");
    const updated = { ...aiMessages, [activeAgent]: [...currentAiMsgs, { role: "user", content: msg }] };
    setAiMessages(updated);

    setTimeout(() => {
      const reply = `**${msg}** 에 대해 분석해드릴게요.\n\n${currentAgent.name} 관점에서 **"${idea}"** 아이디어를 검토하면:\n\n- 핵심 포인트 1: 시장 진입 전략이 중요해요\n- 핵심 포인트 2: 초기 타겟을 좁게 잡는 것이 효과적이에요\n- 핵심 포인트 3: 빠른 MVP 검증이 필요해요\n\n더 구체적인 내용이 필요하시면 말씀해주세요!`;
      setAiMessages(prev => ({ ...prev, [activeAgent]: [...prev[activeAgent], { role: "assistant", content: reply }] }));
      if (msg.includes("작성") || msg.includes("분석") || msg.includes("계획")) {
        setDocs(p => [{ agent: currentAgent.name, emoji: currentAgent.emoji, title: msg, content: reply, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) }, ...p]);
      }
    }, 800);
  };

  const sendTeamMessage = () => {
    if (!teamInput.trim()) return;
    const msg = teamInput.trim();
    setTeamInput("");
    const newMsg = { id: Date.now(), sender: user?.name || "나", avatar: (user?.name || "나")[0], content: msg, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), isMe: true };
    setTeamMessages(p => [...p, newMsg]);
    setTimeout(() => {
      const aiReply = { id: Date.now() + 1, sender: "AI 기획자", avatar: "📋", content: `"${msg}" 내용을 분석했어요. 관련 전략을 업데이트해드릴까요?`, time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), isAI: true, color: "#F5A623" };
      setTeamMessages(p => [...p, aiReply]);
    }, 1000);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: T.bg, transition: "background 0.3s" }}>

      {/* Top bar */}
      <div style={{ padding: "12px 24px", borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#000", fontSize: "14px", fontWeight: "800" }}>C</span>
            </div>
            <span style={{ fontSize: "16px", fontWeight: "800", color: T.text, letterSpacing: "-0.03em" }}>CoStart</span>
          </div>
          <div style={{ height: "16px", width: "1px", background: T.border }} />
          <div style={{ fontSize: "13px", color: T.textSub, maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{idea}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setShowDocs(p => !p)} style={{
            padding: "7px 14px", borderRadius: "8px", cursor: "pointer",
            border: `1px solid ${showDocs ? T.accentBorder : T.border}`,
            background: showDocs ? T.accentSoft : "transparent",
            color: showDocs ? T.accent : T.textSub,
            fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px",
          }}>
            📄 문서 {docs.length > 0 && <span style={{ background: T.accent, color: "#000", borderRadius: "8px", padding: "1px 6px", fontSize: "10px", fontWeight: "700" }}>{docs.length}</span>}
          </button>
          <button onClick={onNewProject} style={{ padding: "7px 14px", borderRadius: "8px", cursor: "pointer", border: `1px solid ${T.border}`, background: "transparent", color: T.textSub, fontSize: "12px", fontWeight: "600" }}>+ 새 프로젝트</button>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: T.accentSoft, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: T.accent }}>
            {user?.name?.[0] || "U"}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left sidebar — agents */}
        <div style={{ width: "200px", borderRight: `1px solid ${T.border}`, background: T.surface, display: "flex", flexDirection: "column", flexShrink: 0, transition: "all 0.3s" }}>

          {/* Tab switcher */}
          <div style={{ padding: "12px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", background: T.surface2, borderRadius: "8px", padding: "3px", gap: "2px" }}>
              {[{ id: "ai", label: "AI 팀" }, { id: "team", label: "팀 채팅" }].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  flex: 1, padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer",
                  background: activeTab === t.id ? T.surface : "transparent",
                  color: activeTab === t.id ? T.text : T.textMuted,
                  fontSize: "11px", fontWeight: "700", transition: "all 0.15s",
                  boxShadow: activeTab === t.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {activeTab === "ai" && (
            <div style={{ flex: 1, overflowY: "auto" }}>
              {AGENTS.map(agent => (
                <button key={agent.id} onClick={() => setActiveAgent(agent.id)} style={{
                  width: "100%", padding: "12px 14px", textAlign: "left", cursor: "pointer", border: "none",
                  background: activeAgent === agent.id ? T.surface2 : "transparent",
                  borderLeft: `3px solid ${activeAgent === agent.id ? agent.color : "transparent"}`,
                  transition: "all 0.15s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: agent.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{agent.emoji}</div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: activeAgent === agent.id ? "700" : "500", color: activeAgent === agent.id ? agent.color : T.textSub }}>{agent.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.green }} />
                        <span style={{ fontSize: "10px", color: T.textMuted }}>온라인</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === "team" && (
            <div style={{ flex: 1, overflowY: "auto" }}>
              {[
                { name: "이준", avatar: "이", role: "대표", color: T.accentSoft },
                { name: "김지훈", avatar: "김", role: "개발자", color: "rgba(34,197,94,0.12)" },
              ].map((m, i) => (
                <div key={i} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: T.text, flexShrink: 0 }}>{m.avatar}</div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: T.text }}>{m.name}</div>
                    <div style={{ fontSize: "10px", color: T.textMuted }}>{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Chat header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, transition: "all 0.3s" }}>
            {activeTab === "ai" ? (
              <>
                <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: currentAgent.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{currentAgent.emoji}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: T.text }}>{currentAgent.name}</div>
                  <div style={{ fontSize: "12px", color: T.textMuted }}>전용 AI 에이전트 · 언제든 질문하세요</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "22px" }}>👥</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: T.text }}>팀 채팅</div>
                  <div style={{ fontSize: "12px", color: T.textMuted }}>팀원 대화를 AI가 실시간으로 분석해요</div>
                </div>
              </>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>

            {activeTab === "ai" && currentAiMsgs.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: currentAgent.colorSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{currentAgent.emoji}</div>
                )}
                <div style={{
                  maxWidth: "75%", padding: "12px 14px", borderRadius: msg.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                  background: msg.role === "user" ? T.accentSoft : T.surface2,
                  border: `1px solid ${msg.role === "user" ? T.accentBorder : T.border}`,
                }}>
                  {msg.content.split('\n').map((line, j) => {
                    if (line.startsWith('**') && line.endsWith('**')) return <div key={j} style={{ fontSize: "13px", fontWeight: "700", color: T.text, marginBottom: "4px" }}>{line.slice(2, -2)}</div>;
                    if (line.startsWith('- ')) return <div key={j} style={{ fontSize: "13px", color: T.textSub, lineHeight: "1.7", paddingLeft: "12px", position: "relative" }}><span style={{ position: "absolute", left: "2px", color: T.accent }}>·</span>{line.slice(2)}</div>;
                    const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<b style="color:${T.text}">${m}</b>`);
                    return line ? <div key={j} style={{ fontSize: "13px", color: T.textSub, lineHeight: "1.75" }} dangerouslySetInnerHTML={{ __html: bold }} /> : <div key={j} style={{ height: "4px" }} />;
                  })}
                </div>
              </div>
            ))}

            {activeTab === "team" && teamMessages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", gap: "10px", flexDirection: msg.isMe ? "row-reverse" : "row", alignItems: "flex-start" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: msg.isAI ? `${msg.color}20` : T.surface3, border: msg.isAI ? `1px solid ${msg.color}40` : `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: msg.isAI ? "14px" : "11px", fontWeight: "700", color: msg.isAI ? msg.color : T.text, flexShrink: 0 }}>{msg.avatar}</div>
                <div style={{ maxWidth: "70%" }}>
                  <div style={{ fontSize: "10px", color: T.textMuted, marginBottom: "4px", textAlign: msg.isMe ? "right" : "left" }}>{msg.sender} · {msg.time}</div>
                  <div style={{ padding: "10px 14px", borderRadius: msg.isMe ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: msg.isMe ? T.accentSoft : msg.isAI ? `${msg.color}12` : T.surface2, border: `1px solid ${msg.isMe ? T.accentBorder : msg.isAI ? `${msg.color}30` : T.border}` }}>
                    <span style={{ fontSize: "13px", color: T.text, lineHeight: "1.7" }}>{msg.content}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick prompts (AI tab only, first message) */}
          {activeTab === "ai" && currentAiMsgs.length <= 1 && (
            <div style={{ padding: "0 20px 10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {(QUICK[activeAgent] || []).map((q, i) => (
                <button key={i} onClick={() => sendAiMessage(q)} style={{
                  padding: "7px 14px", borderRadius: "20px", cursor: "pointer",
                  border: `1px solid ${currentAgent.color}40`, background: currentAgent.colorSoft,
                  color: currentAgent.color, fontSize: "12px", fontWeight: "600", transition: "all 0.15s",
                }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: "10px", background: T.surface, transition: "all 0.3s" }}>
            <input
              value={activeTab === "ai" ? aiInput : teamInput}
              onChange={e => activeTab === "ai" ? setAiInput(e.target.value) : setTeamInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { activeTab === "ai" ? sendAiMessage() : sendTeamMessage(); } }}
              placeholder={activeTab === "ai" ? `${currentAgent.name}에게 질문하세요...` : "팀원에게 메시지 보내기..."}
              style={{ flex: 1, padding: "11px 16px", borderRadius: "10px", border: `1.5px solid ${T.border}`, background: T.surface2, color: T.text, fontSize: "14px", outline: "none", transition: "all 0.2s" }}
              onFocus={e => e.target.style.borderColor = activeTab === "ai" ? currentAgent.color + "60" : T.accentBorder}
              onBlur={e => e.target.style.borderColor = T.border}
            />
            <button
              onClick={() => activeTab === "ai" ? sendAiMessage() : sendTeamMessage()}
              style={{ padding: "11px 18px", borderRadius: "10px", border: "none", background: activeTab === "ai" ? currentAgent.color : T.accent, color: "#000", fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.15s" }}>
              전송
            </button>
          </div>
        </div>

        {/* Docs panel */}
        {showDocs && (
          <div style={{ width: "320px", borderLeft: `1px solid ${T.border}`, background: T.surface, flexShrink: 0, display: "flex", flexDirection: "column", transition: "all 0.3s" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: T.text }}>생성된 문서 ({docs.length})</div>
              <button onClick={() => setShowDocs(false)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
              {docs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: T.textMuted, fontSize: "13px", lineHeight: "1.7" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>📄</div>
                  AI에게 문서 작성을<br />요청하면 여기 저장돼요
                </div>
              ) : docs.map((doc, i) => (
                <div key={i} style={{ padding: "12px", borderRadius: "10px", border: `1px solid ${T.border}`, marginBottom: "8px", background: T.surface2, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = T.accentBorder}
                  onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
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
  const [page, setPage] = useState("login"); // login | idea | workspace
  const [user, setUser] = useState(null);
  const [idea, setIdea] = useState("");
  const [field, setField] = useState(null);

  const T = getTheme(isDark);

  const handleLogin = (provider, previousWork) => {
    setUser({ name: "이준", provider });
    if (previousWork) {
      setIdea(previousWork.idea);
      setField(previousWork.field);
      setPage("workspace");
    } else {
      setPage("idea");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Pretendard', -apple-system, sans-serif; }
        body { background: ${T.bg}; }
        input::placeholder, textarea::placeholder { color: ${T.textMuted}; }
        button { font-family: 'Pretendard', -apple-system, sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>

      {/* Dark/Light toggle — global */}
      <button onClick={() => setIsDark(p => !p)} style={{
        position: "fixed", top: "16px", right: page === "login" ? "16px" : "80px", zIndex: 1000,
        width: "40px", height: "40px", borderRadius: "10px",
        border: `1px solid ${T.border}`, background: T.surface,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "16px", boxShadow: T.shadow, transition: "all 0.2s",
      }}>
        {isDark ? "☀️" : "🌙"}
      </button>

      {page === "login" && <LoginPage isDark={isDark} T={T} onLogin={handleLogin} />}
      {page === "idea" && <IdeaInputPage isDark={isDark} T={T} user={user} onSubmit={(i, f) => { setIdea(i); setField(f); setPage("workspace"); }} />}
      {page === "workspace" && <WorkspacePage isDark={isDark} T={T} idea={idea} field={field} user={user} onNewProject={() => setPage("idea")} />}
    </>
  );
}
