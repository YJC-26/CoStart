import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0A0A0F", surface: "#12121A", surface2: "#1A1A24", surface3: "#22222E",
  border: "#2A2A3A", borderLight: "#363648",
  text: "#F0EFE8", textSub: "#8A8A9A", textMuted: "#4A4A5A",
  accent: "#7B61FF", accentSoft: "rgba(123,97,255,0.12)", accentBorder: "rgba(123,97,255,0.3)", accentGlow: "rgba(123,97,255,0.15)",
  green: "#00E5A0", greenSoft: "rgba(0,229,160,0.1)", greenBorder: "rgba(0,229,160,0.3)",
  orange: "#FF8A3D", orangeSoft: "rgba(255,138,61,0.1)", orangeBorder: "rgba(255,138,61,0.3)",
  red: "#FF4D6A", redSoft: "rgba(255,77,106,0.1)", redBorder: "rgba(255,77,106,0.3)",
  blue: "#3D9BFF", blueSoft: "rgba(61,155,255,0.1)",
  shadow: "0 8px 32px rgba(0,0,0,0.4)",
};

const MOCK_MESSAGES = [
  { id: 1, from: "김철수 대표", channel: "kakao", preview: "다음 주 화요일 미팅 가능하신가요? 계약 관련해서 얘기 나누고 싶어요.", time: "10:23", urgent: true, done: false, tags: ["미팅", "계약"], amount: null, autoCategory: "urgent" },
  { id: 2, from: "박지영 (클라이언트)", channel: "email", preview: "수정사항 3가지 보내드립니다. 이번 주 금요일까지 반영 부탁드려요.", time: "09:45", urgent: true, done: false, tags: ["수정", "마감"], amount: null, autoCategory: "urgent" },
  { id: 3, from: "이민준 팀장", channel: "sms", preview: "내일 오전 10시 팀 회의 있습니다. 자료 준비해주세요.", time: "어제", urgent: false, done: false, tags: ["회의"], amount: null, autoCategory: "normal" },
  { id: 4, from: "A유통 담당자", channel: "kakao", preview: "이번 달 납품가 kg당 500원 인상됩니다. 다음 주부터 적용이에요.", time: "어제", urgent: false, done: true, tags: ["납품", "가격"], amount: "500원/kg", autoCategory: "normal" },
  { id: 5, from: "세무사 김OO", channel: "email", preview: "부가세 신고 마감이 이번 달 25일입니다. 자료 준비해주세요.", time: "2일 전", urgent: false, done: false, tags: ["세금", "마감"], amount: null, autoCategory: "normal" },
];

const MOCK_TODOS = [
  { id: 1, text: "김철수 대표 미팅 일정 확인 후 답변", from: "김철수 대표", date: "오늘", priority: "high", done: false },
  { id: 2, text: "박지영 클라이언트 수정사항 3가지 반영", from: "박지영", date: "금요일", priority: "high", done: false },
  { id: 3, text: "팀 회의 자료 준비", from: "이민준 팀장", date: "내일 오전 10시 전", priority: "medium", done: false },
  { id: 4, text: "부가세 신고 자료 세무사에게 전달", from: "세무사 김OO", date: "25일 전", priority: "medium", done: false },
  { id: 5, text: "A유통 납품가 인상 원가 재계산", from: "A유통", date: "이번 주", priority: "low", done: true },
];

const AUTO_PROCESSED = [
  { id: "a1", from: "쿠팡 파트너스", type: "광고", action: "자동 무시", channel: "email", reason: "광고·스팸으로 분류" },
  { id: "a2", from: "네이버 카페", type: "알림", action: "자동 무시", channel: "email", reason: "단순 알림으로 분류" },
  { id: "a3", from: "이민준 팀장", type: "완료", action: "완료 처리", channel: "sms", reason: "완료 표현 감지" },
  { id: "a4", from: "택배 알림", type: "참고", action: "참고함 이동", channel: "sms", reason: "배송 알림으로 분류" },
  { id: "a5", from: "박지영 클라이언트", type: "업무", action: "할 일 자동 생성", channel: "kakao", reason: "마감일 + 요청사항 감지" },
];

const AMBIGUOUS_INIT = [
  { id: "b1", from: "고등학교 동창 김민수", channel: "kakao", preview: "형 요즘 뭐해? 한번 봐야하는데 ㅋㅋ 그리고 아 맞다 저번에 말한 거 어떻게 됐어?", aiGuess: "참고용", confidence: 45, reason: "지인 연락이지만 업무 관련 가능성 있음", decided: null },
  { id: "b2", from: "프리랜서 커뮤니티", channel: "email", preview: "공동 프로젝트 참여 의향이 있으신가요? 관심 있으시면 연락 주세요.", aiGuess: "업무 연락", confidence: 68, reason: "프로젝트 참여 요청이지만 불분명", decided: null },
  { id: "b3", from: "건물주 이OO", channel: "sms", preview: "임대료 관련해서 잠깐 통화 가능할까요?", aiGuess: "업무 연락", confidence: 78, reason: "금전 관련이나 개인/업무 경계 불명확", decided: null },
];

const CHANNELS = {
  kakao: { label: "카카오톡", color: "#FEE500", textColor: "#3C1E1E", emoji: "💬" },
  email: { label: "이메일", color: C.blue, textColor: "#fff", emoji: "✉️" },
  sms: { label: "문자", color: C.green, textColor: "#000", emoji: "📱" },
};

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}

// ── Login ──────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [hovered, setHovered] = useState(null);
  const isMobile = useIsMobile();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${C.greenSoft} 0%, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: isMobile ? "100%" : "440px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: `linear-gradient(135deg, ${C.accent}, #5B3FFF)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px ${C.accentGlow}` }}>
              <span style={{ color: "#fff", fontSize: "20px", fontWeight: "900", fontFamily: "'Outfit', sans-serif" }}>O</span>
            </div>
            <div>
              <div style={{ fontSize: "26px", fontWeight: "900", color: C.text, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.04em", lineHeight: 1 }}>O2-Do</div>
              <div style={{ fontSize: "11px", color: C.accent, fontWeight: "600", letterSpacing: "0.1em", fontFamily: "'Outfit', sans-serif" }}>AI ASSISTANT</div>
            </div>
          </div>
          <h1 style={{ fontSize: isMobile ? "26px" : "32px", fontWeight: "800", color: C.text, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em", lineHeight: "1.2", marginBottom: "12px" }}>
            연락이 오면<br />
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.green})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI가 알아서 처리해요</span>
          </h1>
          <p style={{ fontSize: "14px", color: C.textSub, lineHeight: "1.7" }}>문자·카톡·이메일을 붙여넣으면<br />AI가 분석하고 할 일을 만들어줘요</p>
        </div>

        <div style={{ background: C.surface, borderRadius: "20px", border: `1px solid ${C.border}`, padding: "32px", boxShadow: C.shadow }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: C.text, fontFamily: "'Outfit', sans-serif", marginBottom: "6px" }}>시작하기</h2>
          <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "24px" }}>소셜 계정으로 간편하게 로그인하세요</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            <button onMouseEnter={() => setHovered("google")} onMouseLeave={() => setHovered(null)} onClick={() => onLogin("google")} style={{ width: "100%", padding: "14px 18px", borderRadius: "12px", cursor: "pointer", border: `1.5px solid ${hovered === "google" ? "#4285F4" : C.border}`, background: hovered === "google" ? "rgba(66,133,244,0.08)" : C.surface2, display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s", transform: hovered === "google" ? "translateY(-1px)" : "none" }}>
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
          <p style={{ fontSize: "11px", color: C.textMuted, textAlign: "center", lineHeight: "1.7" }}>계속 진행하면 <span style={{ color: C.accent, cursor: "pointer" }}>이용약관</span>과 <span style={{ color: C.accent, cursor: "pointer" }}>개인정보처리방침</span>에 동의합니다</p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
          {[{ emoji: "🤖", text: "90% 자동 처리" }, { emoji: "📋", text: "하루 한번 요약" }, { emoji: "✍️", text: "답장 초안 작성" }].map((f, i) => (
            <div key={i} style={{ flex: 1, padding: "12px 8px", borderRadius: "10px", background: C.surface, border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>{f.emoji}</div>
              <div style={{ fontSize: "10px", color: C.textMuted, lineHeight: "1.4" }}>{f.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Onboarding ─────────────────────────────────────────────────
function OnboardingPage({ onDone }) {
  const [selected, setSelected] = useState(null);
  const TYPES = [
    { id: "freelancer", emoji: "💻", title: "프리랜서", desc: "클라이언트 피드백, 계약, 미팅 연락을 AI가 정리해줘요", color: C.accent, soft: C.accentSoft, border: C.accentBorder },
    { id: "business", emoji: "🏪", title: "1인 사업자", desc: "거래처, 고객, 세금 관련 연락을 AI가 알아서 처리해줘요", color: C.orange, soft: C.orangeSoft, border: C.orangeBorder },
    { id: "worker", emoji: "💼", title: "직장인", desc: "업무 이메일, 팀 메시지를 AI가 요약하고 할 일을 만들어줘요", color: C.green, soft: C.greenSoft, border: C.greenBorder },
    { id: "etc", emoji: "✨", title: "기타", desc: "어떤 연락이든 AI가 분석하고 정리해드려요", color: C.blue, soft: C.blueSoft, border: "rgba(61,155,255,0.3)" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${C.accent}, #5B3FFF)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "17px", fontWeight: "900", fontFamily: "'Outfit', sans-serif" }}>O</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "900", color: C.text, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.04em" }}>O2-Do</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: C.text, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em", marginBottom: "8px" }}>어떤 분이세요?</h1>
          <p style={{ fontSize: "14px", color: C.textSub }}>상황에 맞게 AI를 최적화해드릴게요</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {TYPES.map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)} style={{ padding: "20px", borderRadius: "14px", cursor: "pointer", textAlign: "left", border: `1.5px solid ${selected === t.id ? t.border : C.border}`, background: selected === t.id ? t.soft : C.surface, transition: "all 0.2s", transform: selected === t.id ? "translateX(4px)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: t.soft, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{t.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: selected === t.id ? t.color : C.text, fontFamily: "'Outfit', sans-serif", marginBottom: "3px" }}>{t.title}</div>
                  <div style={{ fontSize: "12px", color: C.textSub, lineHeight: "1.5" }}>{t.desc}</div>
                </div>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${selected === t.id ? t.color : C.border}`, background: selected === t.id ? t.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                  {selected === t.id && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff" }} />}
                </div>
              </div>
            </button>
          ))}
        </div>
        <button onClick={() => selected && onDone(selected)} disabled={!selected} style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "none", background: selected ? `linear-gradient(135deg, ${C.accent}, #5B3FFF)` : C.surface2, color: selected ? "#fff" : C.textMuted, fontSize: "15px", fontWeight: "700", fontFamily: "'Outfit', sans-serif", cursor: selected ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: selected ? `0 8px 24px ${C.accentGlow}` : "none" }}>시작하기 →</button>
      </div>
    </div>
  );
}

// ── Daily Summary Modal ────────────────────────────────────────
function DailySummaryModal({ onClose, ambiguous, onDecide }) {
  const [current, setCurrent] = useState(0);
  const [decisions, setDecisions] = useState({});
  const remaining = ambiguous.filter(a => decisions[a.id] === undefined);
  const total = ambiguous.length;
  const done = total - remaining.length;

  const decide = (id, choice) => {
    const newD = { ...decisions, [id]: choice };
    setDecisions(newD);
    if (current < ambiguous.length - 1) setCurrent(c => c + 1);
  };

  const item = ambiguous[current];
  const ch = CHANNELS[item?.channel];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "480px", background: C.surface, borderRadius: "20px", border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadow }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, background: C.accentSoft }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: "800", color: C.accent, fontFamily: "'Outfit', sans-serif" }}>⚡ 오늘의 빠른 확인</div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>×</button>
          </div>
          <p style={{ fontSize: "13px", color: C.textSub, marginBottom: "14px" }}>AI가 판단하기 애매한 연락 {total}개예요. 30초면 끝나요!</p>

          {/* Progress bar */}
          <div style={{ height: "4px", background: C.surface3, borderRadius: "2px" }}>
            <div style={{ height: "100%", width: `${(done / total) * 100}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.green})`, borderRadius: "2px", transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "6px", fontFamily: "'Outfit', sans-serif" }}>{done} / {total} 완료</div>
        </div>

        {done < total && item ? (
          <div style={{ padding: "24px" }}>
            {/* AI 분류 결과 */}
            <div style={{ padding: "16px", borderRadius: "12px", background: C.surface2, border: `1px solid ${C.border}`, marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: C.accentSoft, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: C.accent }}>{item.from[0]}</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: C.text, fontFamily: "'Outfit', sans-serif" }}>{item.from}</div>
                    <div style={{ fontSize: "11px", color: C.textMuted }}>{ch?.emoji} {ch?.label}</div>
                  </div>
                </div>
                {/* 신뢰도 */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "10px", color: C.textMuted, marginBottom: "3px" }}>AI 확신도</div>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: item.confidence > 70 ? C.green : item.confidence > 50 ? C.orange : C.red, fontFamily: "'Outfit', sans-serif" }}>{item.confidence}%</div>
                </div>
              </div>
              <div style={{ fontSize: "13px", color: C.textSub, lineHeight: "1.6", marginBottom: "12px" }}>{item.preview}</div>
              <div style={{ padding: "10px 12px", borderRadius: "8px", background: C.accentSoft, border: `1px solid ${C.accentBorder}` }}>
                <div style={{ fontSize: "11px", color: C.accent, fontWeight: "700", marginBottom: "4px", fontFamily: "'Outfit', sans-serif" }}>🤖 AI 판단</div>
                <div style={{ fontSize: "12px", color: C.text }}><b>{item.aiGuess}</b> — {item.reason}</div>
              </div>
            </div>

            {/* 선택 버튼 */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "10px", textAlign: "center" }}>이 연락을 어떻게 처리할까요?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                <button onClick={() => decide(item.id, "work_urgent")} style={{ padding: "12px", borderRadius: "10px", border: `1px solid ${C.redBorder}`, background: C.redSoft, color: C.red, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>🔴 긴급 업무</button>
                <button onClick={() => decide(item.id, "work_normal")} style={{ padding: "12px", borderRadius: "10px", border: `1px solid ${C.orangeBorder}`, background: C.orangeSoft, color: C.orange, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>🟡 일반 업무</button>
                <button onClick={() => decide(item.id, "reference")} style={{ padding: "12px", borderRadius: "10px", border: `1px solid ${C.border}`, background: C.surface2, color: C.textSub, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>📋 참고용</button>
                <button onClick={() => decide(item.id, "ignore")} style={{ padding: "12px", borderRadius: "10px", border: `1px solid ${C.border}`, background: C.surface2, color: C.textMuted, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>🚫 무시</button>
              </div>
            </div>

            {/* 건너뛰기 */}
            <button onClick={() => decide(item.id, "skip")} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "transparent", color: C.textMuted, fontSize: "12px", cursor: "pointer" }}>나중에 결정하기</button>
          </div>
        ) : (
          // 완료 화면
          <div style={{ padding: "32px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: C.text, fontFamily: "'Outfit', sans-serif", marginBottom: "8px" }}>완료했어요!</div>
            <div style={{ fontSize: "13px", color: C.textSub, lineHeight: "1.7", marginBottom: "24px" }}>
              AI가 선택을 기억해서<br />다음부터 비슷한 연락은 자동으로 처리해요
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
              {Object.values(decisions).map((d, i) => (
                <div key={i} style={{ padding: "4px 10px", borderRadius: "20px", background: d === "work_urgent" ? C.redSoft : d === "work_normal" ? C.orangeSoft : d === "ignore" ? C.surface3 : C.accentSoft, color: d === "work_urgent" ? C.red : d === "work_normal" ? C.orange : d === "ignore" ? C.textMuted : C.accent, fontSize: "11px", fontWeight: "700" }}>
                  {d === "work_urgent" ? "긴급" : d === "work_normal" ? "업무" : d === "reference" ? "참고" : d === "ignore" ? "무시" : "나중에"}
                </div>
              ))}
            </div>
            <button onClick={() => { onDecide(decisions); onClose(); }} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: `linear-gradient(135deg, ${C.accent}, #5B3FFF)`, color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>적용하고 닫기</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────
function MainApp({ userType, onLogout }) {
  const [page, setPage] = useState("home");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [todos, setTodos] = useState(MOCK_TODOS);
  const [ambiguous, setAmbiguous] = useState(AMBIGUOUS_INIT);
  const [selected, setSelected] = useState(null);
  const [pasteText, setPasteText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const isMobile = useIsMobile();

  const urgentCount = messages.filter(m => m.urgent && !m.done).length;
  const todoCount = todos.filter(t => !t.done).length;
  const ambiguousCount = ambiguous.filter(a => a.decided === null).length;

  const PRIORITY = { high: { color: C.red, label: "긴급" }, medium: { color: C.orange, label: "보통" }, low: { color: C.textMuted, label: "낮음" } };

  const analyze = () => {
    if (!pasteText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzed({
        from: "김철수 대표", channel: "kakao",
        autoCategory: "urgent",
        summary: "미팅 요청 — 계약 관련 논의",
        priority: "urgent", date: "다음 주 화요일",
        confidence: 92,
        reason: "마감일 + 미팅 요청 + 계약 키워드 감지",
        todos: ["미팅 가능 여부 확인 후 답변", "계약 관련 자료 준비"],
        reply: "안녕하세요 김철수 대표님,\n\n다음 주 화요일 미팅 가능합니다. 오전 10시나 오후 2시 중 편하신 시간으로 알려주시면 확정하겠습니다.\n\n감사합니다.",
        tags: ["미팅", "계약", "긴급"],
      });
      setAnalyzing(false);
    }, 2000);
  };

  const saveAnalyzed = () => {
    if (!analyzed) return;
    const newMsg = { id: Date.now(), from: analyzed.from, channel: "kakao", preview: pasteText.slice(0, 60), time: "방금", urgent: analyzed.priority === "urgent", done: false, tags: analyzed.tags, amount: null, autoCategory: analyzed.autoCategory };
    const newTodos = analyzed.todos.map((t, i) => ({ id: Date.now() + i, text: t, from: analyzed.from, date: analyzed.date, priority: analyzed.priority === "urgent" ? "high" : "medium", done: false }));
    setMessages(p => [newMsg, ...p]);
    setTodos(p => [...newTodos, ...p]);
    setPasteText(""); setAnalyzed(null); setPage("home");
  };

  const handleDecisions = (decisions) => {
    setAmbiguous(prev => prev.map(a => decisions[a.id] !== undefined ? { ...a, decided: decisions[a.id] } : a));
  };

  const NAV = [
    { id: "home", label: "홈", emoji: "⚡" },
    { id: "inbox", label: "연락함", emoji: "📨" },
    { id: "paste", label: "분석", emoji: "🤖" },
    { id: "todos", label: "할 일", emoji: "✅" },
    { id: "contacts", label: "연락처", emoji: "👤" },
  ];

  const getCategoryColor = (cat) => ({ urgent: C.red, normal: C.orange, reference: C.textMuted, ignore: C.surface3 }[cat] || C.textMuted);
  const getCategoryLabel = (cat) => ({ urgent: "긴급", normal: "업무", reference: "참고", ignore: "무시" }[cat] || "미분류");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden" }}>

      {showSummary && <DailySummaryModal onClose={() => setShowSummary(false)} ambiguous={ambiguous} onDecide={handleDecisions} />}

      {/* Top bar */}
      <div style={{ padding: isMobile ? "14px 16px" : "14px 24px", borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: `linear-gradient(135deg, ${C.accent}, #5B3FFF)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: "900", fontFamily: "'Outfit', sans-serif" }}>O</span>
          </div>
          <span style={{ fontSize: "17px", fontWeight: "900", color: C.text, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.04em" }}>O2-Do</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {ambiguousCount > 0 && (
            <button onClick={() => setShowSummary(true)} style={{ padding: "6px 12px", borderRadius: "20px", background: C.orangeSoft, border: `1px solid ${C.orangeBorder}`, color: C.orange, fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: "5px" }}>
              ⚡ 확인 필요 {ambiguousCount}개
            </button>
          )}
          {urgentCount > 0 && (
            <div style={{ padding: "4px 10px", borderRadius: "20px", background: C.redSoft, border: `1px solid ${C.redBorder}`, fontSize: "11px", fontWeight: "700", color: C.red, fontFamily: "'Outfit', sans-serif" }}>긴급 {urgentCount}</div>
          )}
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: C.accentSoft, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", cursor: "pointer" }} onClick={onLogout}>👤</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>

        {/* Desktop sidebar */}
        {!isMobile && (
          <div style={{ width: "200px", borderRight: `1px solid ${C.border}`, background: C.surface, display: "flex", flexDirection: "column", flexShrink: 0 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setSelected(null); setAnalyzed(null); }} style={{ width: "100%", padding: "13px 16px", textAlign: "left", cursor: "pointer", border: "none", background: page === n.id ? C.accentSoft : "transparent", borderLeft: `3px solid ${page === n.id ? C.accent : "transparent"}`, display: "flex", alignItems: "center", gap: "10px", transition: "all 0.15s" }}>
                <span style={{ fontSize: "16px" }}>{n.emoji}</span>
                <span style={{ fontSize: "13px", fontWeight: page === n.id ? "700" : "500", color: page === n.id ? C.accent : C.textSub }}>{n.label}</span>
                {n.id === "inbox" && urgentCount > 0 && <div style={{ marginLeft: "auto", width: "18px", height: "18px", borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: "#fff" }}>{urgentCount}</div>}
                {n.id === "todos" && todoCount > 0 && <div style={{ marginLeft: "auto", width: "18px", height: "18px", borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: "#fff" }}>{todoCount}</div>}
              </button>
            ))}
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* ── HOME ── */}
          {page === "home" && (
            <div style={{ padding: isMobile ? "20px 16px" : "28px 32px" }}>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "22px", fontWeight: "800", color: C.text, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em", marginBottom: "4px" }}>좋은 하루예요 👋</h1>
                <p style={{ fontSize: "13px", color: C.textSub }}>오늘 AI가 {AUTO_PROCESSED.length}개를 자동 처리했어요</p>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
                {[
                  { label: "자동 처리됨", value: AUTO_PROCESSED.length, color: C.green, icon: "🤖" },
                  { label: "확인 필요", value: ambiguousCount, color: C.orange, icon: "⚡" },
                  { label: "남은 할 일", value: todoCount, color: C.accent, icon: "✅" },
                  { label: "긴급 연락", value: urgentCount, color: C.red, icon: "🔴" },
                ].map((s, i) => (
                  <div key={i} style={{ padding: "16px", borderRadius: "14px", background: C.surface, border: `1px solid ${C.border}`, cursor: s.label === "확인 필요" ? "pointer" : "default" }} onClick={s.label === "확인 필요" ? () => setShowSummary(true) : undefined}>
                    <div style={{ fontSize: "20px", marginBottom: "6px" }}>{s.icon}</div>
                    <div style={{ fontSize: "26px", fontWeight: "800", color: s.color, fontFamily: "'Outfit', sans-serif", marginBottom: "4px" }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: C.textSub }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* 확인 필요 배너 */}
              {ambiguousCount > 0 && (
                <div onClick={() => setShowSummary(true)} style={{ padding: "16px 20px", borderRadius: "14px", background: C.orangeSoft, border: `1px solid ${C.orangeBorder}`, marginBottom: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>⚡</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: C.text, fontFamily: "'Outfit', sans-serif", marginBottom: "3px" }}>애매한 연락 {ambiguousCount}개 — 30초만요!</div>
                    <div style={{ fontSize: "12px", color: C.textSub }}>AI가 판단하기 어려운 연락이에요. 한 번만 알려주시면 다음부터 자동 처리돼요</div>
                  </div>
                  <div style={{ fontSize: "18px", color: C.orange }}>→</div>
                </div>
              )}

              {/* 오늘 자동 처리된 내역 */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: C.green, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px" }}>🤖 오늘 자동 처리됨</div>
                <div style={{ background: C.surface, borderRadius: "14px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  {AUTO_PROCESSED.map((ap, i) => (
                    <div key={ap.id} style={{ padding: "12px 16px", borderBottom: i < AUTO_PROCESSED.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: C.textSub, flexShrink: 0 }}>{ap.from[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "12px", fontWeight: "600", color: C.text }}>{ap.from}</div>
                        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "1px" }}>{ap.reason}</div>
                      </div>
                      <span style={{ padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", background: ap.action === "자동 무시" ? C.surface3 : ap.action === "완료 처리" ? C.greenSoft : ap.action === "할 일 자동 생성" ? C.accentSoft : C.surface2, color: ap.action === "자동 무시" ? C.textMuted : ap.action === "완료 처리" ? C.green : ap.action === "할 일 자동 생성" ? C.accent : C.textSub, flexShrink: 0 }}>{ap.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 빠른 붙여넣기 */}
              <div onClick={() => setPage("paste")} style={{ padding: "18px 20px", borderRadius: "14px", background: C.accentSoft, border: `1px solid ${C.accentBorder}`, marginBottom: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🤖</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: C.text, fontFamily: "'Outfit', sans-serif", marginBottom: "3px" }}>연락 내용 붙여넣기</div>
                  <div style={{ fontSize: "12px", color: C.textSub }}>문자·카톡·이메일을 붙여넣으면 AI가 분석해요</div>
                </div>
                <div style={{ fontSize: "18px", color: C.accent }}>→</div>
              </div>

              {/* 긴급 연락 */}
              {urgentCount > 0 && (
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: C.red, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>🔴 긴급 처리 필요</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {messages.filter(m => m.urgent && !m.done).map(msg => (
                      <div key={msg.id} onClick={() => { setSelected(msg); setPage("inbox"); }} style={{ padding: "14px 16px", borderRadius: "12px", background: C.surface, border: `1px solid ${C.redBorder}`, cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: C.text }}>{msg.from}</div>
                          <span style={{ padding: "2px 8px", borderRadius: "20px", background: C.redSoft, color: C.red, fontSize: "10px", fontWeight: "700" }}>{CHANNELS[msg.channel]?.emoji} {CHANNELS[msg.channel]?.label}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: C.textSub, lineHeight: "1.5" }}>{msg.preview}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── INBOX ── */}
          {page === "inbox" && (
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ width: isMobile ? "100%" : "320px", borderRight: isMobile ? "none" : `1px solid ${C.border}`, display: isMobile && selected ? "none" : "flex", flexDirection: "column" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: C.text, fontFamily: "'Outfit', sans-serif" }}>연락함</div>
                  <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>총 {messages.length}개</div>
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {messages.map(msg => {
                    const ch = CHANNELS[msg.channel];
                    return (
                      <div key={msg.id} onClick={() => setSelected(msg)} style={{ padding: "14px 20px", cursor: "pointer", borderBottom: `1px solid ${C.border}`, background: selected?.id === msg.id ? C.accentSoft : "transparent", opacity: msg.done ? 0.5 : 1, transition: "all 0.15s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: C.accentSoft, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: C.accent, flexShrink: 0 }}>{msg.from[0]}</div>
                            <div style={{ fontSize: "13px", fontWeight: "700", color: C.text, display: "flex", alignItems: "center", gap: "5px" }}>
                              {msg.from}
                              {msg.urgent && !msg.done && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.red }} />}
                            </div>
                          </div>
                          <div style={{ fontSize: "10px", color: C.textMuted }}>{msg.time}</div>
                        </div>
                        <div style={{ fontSize: "12px", color: C.textSub, lineHeight: "1.5", paddingLeft: "36px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.preview}</div>
                        <div style={{ display: "flex", gap: "4px", paddingLeft: "36px", marginTop: "6px" }}>
                          <span style={{ padding: "2px 7px", borderRadius: "20px", background: `${ch?.color}20`, color: ch?.color === "#FEE500" ? "#8B7000" : ch?.color, fontSize: "10px", fontWeight: "600" }}>{ch?.emoji} {ch?.label}</span>
                          <span style={{ padding: "2px 7px", borderRadius: "20px", background: `${getCategoryColor(msg.autoCategory)}15`, color: getCategoryColor(msg.autoCategory), fontSize: "10px", fontWeight: "600" }}>{getCategoryLabel(msg.autoCategory)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selected && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "12px" }}>
                    {isMobile && <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>← 뒤로</button>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: C.text, fontFamily: "'Outfit', sans-serif" }}>{selected.from}</div>
                      <div style={{ fontSize: "11px", color: C.textMuted }}>{CHANNELS[selected.channel]?.emoji} {CHANNELS[selected.channel]?.label} · {selected.time}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                    <div style={{ background: C.surface2, borderRadius: "12px", padding: "16px", marginBottom: "20px", border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: "14px", color: C.text, lineHeight: "1.75" }}>{selected.preview}</div>
                    </div>
                    <div style={{ background: C.accentSoft, borderRadius: "12px", border: `1px solid ${C.accentBorder}`, overflow: "hidden", marginBottom: "16px" }}>
                      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>🤖</span>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI 분석</span>
                        <span style={{ marginLeft: "auto", padding: "2px 8px", borderRadius: "20px", background: `${getCategoryColor(selected.autoCategory)}20`, color: getCategoryColor(selected.autoCategory), fontSize: "10px", fontWeight: "700" }}>{getCategoryLabel(selected.autoCategory)}</span>
                      </div>
                      <div style={{ padding: "16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
                          {[{ label: "유형", value: selected.tags.join(", ") }, { label: "중요도", value: selected.urgent ? "🔴 긴급" : "🟡 보통" }, selected.amount && { label: "금액", value: selected.amount }].filter(Boolean).map((item, i) => (
                            <div key={i} style={{ display: "flex", gap: "12px" }}>
                              <span style={{ fontSize: "11px", fontWeight: "700", color: C.textMuted, width: "60px", flexShrink: 0, fontFamily: "'Outfit', sans-serif" }}>{item.label}</span>
                              <span style={{ fontSize: "13px", color: C.text }}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => setShowReply(!showReply)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1px solid ${C.accentBorder}`, background: "transparent", color: C.accent, fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>✍️ 답장 초안</button>
                          <button onClick={() => setMessages(p => p.map(m => m.id === selected.id ? { ...m, done: true } : m))} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: C.accent, color: "#fff", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>✅ 완료</button>
                        </div>
                        {showReply && (
                          <div style={{ marginTop: "12px", padding: "14px", borderRadius: "10px", background: C.surface, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: "11px", fontWeight: "700", color: C.textMuted, marginBottom: "8px", fontFamily: "'Outfit', sans-serif" }}>AI 답장 초안</div>
                            <div style={{ fontSize: "13px", color: C.text, lineHeight: "1.75" }}>안녕하세요,<br /><br />말씀해주신 내용 잘 확인했습니다. 검토 후 연락드리겠습니다.<br /><br />감사합니다.</div>
                            <button style={{ marginTop: "10px", width: "100%", padding: "8px", borderRadius: "8px", border: `1px solid ${C.border}`, background: "transparent", color: C.textSub, fontSize: "12px", cursor: "pointer" }}>📋 복사하기</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!selected && !isMobile && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
                  <div style={{ fontSize: "40px" }}>📨</div>
                  <div style={{ fontSize: "14px", color: C.textMuted }}>연락을 선택해주세요</div>
                </div>
              )}
            </div>
          )}

          {/* ── PASTE ── */}
          {page === "paste" && (
            <div style={{ padding: isMobile ? "20px 16px" : "28px 32px", maxWidth: "640px" }}>
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em", marginBottom: "6px" }}>연락 내용 분석</h2>
                <p style={{ fontSize: "13px", color: C.textSub }}>문자·카톡·이메일을 붙여넣으면 AI가 자동으로 분류하고 처리해요</p>
              </div>

              <textarea value={pasteText} onChange={e => setPasteText(e.target.value)} placeholder={"내용을 여기에 붙여넣으세요\n\n예시:\n김철수: 다음 주 화요일 미팅 가능하신가요?\n          계약 관련해서 얘기 나누고 싶어요."} style={{ width: "100%", minHeight: "180px", padding: "16px", borderRadius: "14px", border: `1.5px solid ${pasteText ? C.accentBorder : C.border}`, background: C.surface, color: C.text, fontSize: "14px", lineHeight: "1.75", resize: "none", outline: "none", marginBottom: "12px", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = C.accentBorder}
                onBlur={e => e.target.style.borderColor = pasteText ? C.accentBorder : C.border} />

              <button onClick={analyze} disabled={!pasteText.trim() || analyzing} style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "none", background: pasteText.trim() ? `linear-gradient(135deg, ${C.accent}, #5B3FFF)` : C.surface2, color: pasteText.trim() ? "#fff" : C.textMuted, fontSize: "14px", fontWeight: "700", cursor: pasteText.trim() ? "pointer" : "not-allowed", fontFamily: "'Outfit', sans-serif", marginBottom: "24px", transition: "all 0.2s", boxShadow: pasteText.trim() ? `0 8px 24px ${C.accentGlow}` : "none" }}>
                {analyzing ? "🤖 AI가 분석 중..." : "🤖 AI 자동 분석"}
              </button>

              {analyzed && (
                <div style={{ background: C.surface, borderRadius: "16px", border: `1.5px solid ${C.accentBorder}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", background: C.accentSoft, borderBottom: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>✨</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: C.accent, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI 분석 완료</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", color: C.textMuted }}>확신도</span>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: C.green, fontFamily: "'Outfit', sans-serif" }}>{analyzed.confidence}%</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    {/* 자동 분류 결과 */}
                    <div style={{ padding: "12px 14px", borderRadius: "10px", background: analyzed.priority === "urgent" ? C.redSoft : C.orangeSoft, border: `1px solid ${analyzed.priority === "urgent" ? C.redBorder : C.orangeBorder}`, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "20px" }}>{analyzed.priority === "urgent" ? "🔴" : "🟡"}</span>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: C.text }}>{analyzed.priority === "urgent" ? "긴급 업무 연락" : "일반 업무 연락"} — 자동 분류됨</div>
                        <div style={{ fontSize: "11px", color: C.textSub, marginTop: "2px" }}>{analyzed.reason}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
                      {[{ label: "발신자", value: analyzed.from }, { label: "요약", value: analyzed.summary }, { label: "일정", value: analyzed.date }].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "14px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: C.textMuted, width: "55px", flexShrink: 0, fontFamily: "'Outfit', sans-serif", paddingTop: "2px" }}>{item.label}</span>
                          <span style={{ fontSize: "13px", color: C.text, lineHeight: "1.6" }}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: C.textMuted, fontFamily: "'Outfit', sans-serif", marginBottom: "8px" }}>자동 생성될 할 일</div>
                      {analyzed.todos.map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", padding: "8px 0", borderBottom: i < analyzed.todos.length - 1 ? `1px solid ${C.border}` : "none" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accent, flexShrink: 0 }} />
                          <span style={{ fontSize: "13px", color: C.text }}>{t}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: "14px", borderRadius: "10px", background: C.surface2, border: `1px solid ${C.border}`, marginBottom: "16px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: C.textMuted, fontFamily: "'Outfit', sans-serif", marginBottom: "8px" }}>AI 답장 초안</div>
                      <div style={{ fontSize: "13px", color: C.text, lineHeight: "1.75", whiteSpace: "pre-line" }}>{analyzed.reply}</div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => { setPasteText(""); setAnalyzed(null); }} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: `1px solid ${C.border}`, background: "transparent", color: C.textSub, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>다시 분석</button>
                      <button onClick={saveAnalyzed} style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "none", background: `linear-gradient(135deg, ${C.accent}, #5B3FFF)`, color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>저장 + 할 일 추가 →</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TODOS ── */}
          {page === "todos" && (
            <div style={{ padding: isMobile ? "20px 16px" : "28px 32px" }}>
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em", marginBottom: "4px" }}>할 일</h2>
                <p style={{ fontSize: "13px", color: C.textSub }}>남은 {todoCount}개 · AI가 자동으로 생성했어요</p>
              </div>
              {["high", "medium", "low"].map(priority => {
                const items = todos.filter(t => t.priority === priority);
                if (items.length === 0) return null;
                const p = PRIORITY[priority];
                return (
                  <div key={priority} style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: p.color, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>{p.label}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {items.map(todo => (
                        <div key={todo.id} style={{ padding: "14px 16px", borderRadius: "12px", background: C.surface, border: `1px solid ${todo.done ? C.border : p.color + "30"}`, display: "flex", gap: "12px", alignItems: "flex-start", opacity: todo.done ? 0.5 : 1, transition: "all 0.2s" }}>
                          <button onClick={() => setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, done: !t.done } : t))} style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${todo.done ? C.green : p.color}`, background: todo.done ? C.green : "transparent", cursor: "pointer", flexShrink: 0, marginTop: "1px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                            {todo.done && <span style={{ fontSize: "10px", color: "#000", fontWeight: "900" }}>✓</span>}
                          </button>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "13px", color: todo.done ? C.textMuted : C.text, textDecoration: todo.done ? "line-through" : "none", lineHeight: "1.5" }}>{todo.text}</div>
                            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>{todo.from} · {todo.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── CONTACTS ── */}
          {page === "contacts" && (
            <div style={{ padding: isMobile ? "20px 16px" : "28px 32px" }}>
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: C.text, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em", marginBottom: "4px" }}>연락처</h2>
                <p style={{ fontSize: "13px", color: C.textSub }}>AI가 자동으로 수집한 연락처예요</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[...new Map(messages.map(m => [m.from, m])).values()].map((msg, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderRadius: "12px", background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.accentBorder}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: C.accentSoft, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", color: C.accent, flexShrink: 0 }}>{msg.from[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: C.text }}>{msg.from}</div>
                      <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{CHANNELS[msg.channel]?.emoji} {CHANNELS[msg.channel]?.label} · 마지막 연락 {msg.time}</div>
                    </div>
                    <span style={{ padding: "3px 8px", borderRadius: "20px", background: `${getCategoryColor(msg.autoCategory)}15`, color: getCategoryColor(msg.autoCategory), fontSize: "10px", fontWeight: "700" }}>{getCategoryLabel(msg.autoCategory)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      {isMobile && (
        <div style={{ borderTop: `1px solid ${C.border}`, background: C.surface, display: "flex", flexShrink: 0 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setSelected(null); setAnalyzed(null); }} style={{ flex: 1, padding: "10px 4px", border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <div style={{ position: "relative" }}>
                <span style={{ fontSize: "20px" }}>{n.emoji}</span>
                {n.id === "inbox" && urgentCount > 0 && <div style={{ position: "absolute", top: "-2px", right: "-4px", width: "14px", height: "14px", borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: "700", color: "#fff" }}>{urgentCount}</div>}
              </div>
              <span style={{ fontSize: "10px", fontWeight: page === n.id ? "700" : "400", color: page === n.id ? C.accent : C.textMuted }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const [stage, setStage] = useState("login");
  const [userType, setUserType] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; font-family: 'Pretendard', sans-serif; }
        input::placeholder, textarea::placeholder { color: ${C.textMuted}; }
        button { outline: none; font-family: 'Pretendard', sans-serif; }
        textarea { font-family: 'Pretendard', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
      `}</style>
      {stage === "login" && <LoginPage onLogin={() => setStage("onboarding")} />}
      {stage === "onboarding" && <OnboardingPage onDone={type => { setUserType(type); setStage("app"); }} />}
      {stage === "app" && <MainApp userType={userType} onLogout={() => setStage("login")} />}
    </>
  );
}
