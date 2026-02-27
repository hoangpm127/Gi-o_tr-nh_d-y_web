const fs = require('fs');
const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Web Builder Foundation – Giáo trình giảng viên</title>
  <style>
    :root {
      --primary: #6c63ff; --secondary: #ff6584; --accent: #43e97b;
      --dark: #0f0f1a; --card: #16213e; --card2: #1a1a35;
      --text: #dde1f0; --muted: #8888aa; --white: #ffffff;
      --yellow: #ffd166; --cyan: #06d6a0; --orange: #f77f00; --red: #ef4444;
      --radius: 14px; --shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--dark); color: var(--text); min-height: 100vh; }
    header {
      background: linear-gradient(135deg, #1a1040 0%, #2d1b69 50%, #1a2a4a 100%);
      padding: 48px 60px 44px; text-align: center;
      border-bottom: 1px solid rgba(108,99,255,0.3); position: relative; overflow: hidden;
    }
    header::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 70%); pointer-events: none; }
    .badge { display: inline-block; background: rgba(108,99,255,0.2); border: 1px solid rgba(108,99,255,0.5); border-radius: 20px; padding: 4px 18px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; color: #a5b4fc; }
    header h1 { font-size: 2.4rem; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    header .subtitle { margin-top: 10px; font-size: 1rem; color: rgba(255,255,255,0.6); }
    .meta-row { display: flex; justify-content: center; gap: 12px; margin-top: 22px; flex-wrap: wrap; }
    .meta-chip { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 6px 18px; font-size: 13px; color: rgba(255,255,255,0.8); }
    .philosophy-bar { max-width: 720px; margin: 28px auto 0; background: rgba(6,214,160,0.08); border: 1px solid rgba(6,214,160,0.25); border-radius: 12px; padding: 14px 20px; font-size: .9rem; color: var(--cyan); line-height: 1.6; }
    .philosophy-bar strong { color: #fff; }
    nav { background: rgba(22,33,62,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: center; gap: 4px; padding: 10px 20px; flex-wrap: wrap; position: sticky; top: 0; z-index: 100; }
    nav a { text-decoration: none; color: var(--muted); font-size: 13px; font-weight: 600; padding: 7px 14px; border-radius: 8px; transition: all .2s; border: 1px solid transparent; }
    nav a:hover { background: rgba(108,99,255,0.15); color: #fff; border-color: rgba(108,99,255,0.3); }
    nav a.active { background: var(--primary); color: #fff; }
    main { max-width: 1060px; margin: 0 auto; padding: 52px 24px 100px; }
    .session { margin-bottom: 80px; scroll-margin-top: 70px; }
    .session-header { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 32px; }
    .session-badge { min-width: 64px; height: 64px; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 800; font-size: .75rem; letter-spacing: 1px; text-transform: uppercase; color: #fff; flex-shrink: 0; }
    .session-badge .sn { font-size: 1.6rem; font-weight: 900; line-height: 1; }
    .s1 .session-badge { background: linear-gradient(135deg,#6c63ff,#a855f7); }
    .s2 .session-badge { background: linear-gradient(135deg,#f77f00,#f59e0b); }
    .s3 .session-badge { background: linear-gradient(135deg,#06d6a0,#0891b2); }
    .s4 .session-badge { background: linear-gradient(135deg,#ec4899,#8b5cf6); }
    .s5 .session-badge { background: linear-gradient(135deg,#ef4444,#f97316); }
    .session-title { font-size: 1.5rem; font-weight: 800; color: var(--white); }
    .session-sub { font-size: .9rem; color: var(--muted); margin-top: 4px; }
    .session-model { display: inline-block; margin-top: 10px; background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.3); border-radius: 8px; padding: 6px 14px; font-size: .82rem; color: #c4b5fd; }
    .session-model strong { color: #fff; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 18px; }
    .card-wide { grid-column: span 2; }
    @media(max-width:700px){ .card-wide { grid-column: span 1; } }
    .card { background: var(--card); border: 1px solid rgba(255,255,255,0.07); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: transform .2s, box-shadow .2s; }
    .card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.5); }
    .card-header { padding: 14px 18px 12px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .card-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
    .card-tag { margin-left: auto; font-size: 11px; padding: 2px 10px; border-radius: 10px; font-weight: 600; }
    .t-mental { background: rgba(108,99,255,0.2); color: #a5b4fc; }
    .t-flow   { background: rgba(247,127,0,0.2);  color: #fdba74; }
    .t-ai     { background: rgba(168,85,247,0.2); color: #d8b4fe; }
    .t-practice{ background: rgba(6,214,160,0.2); color: #6ee7b7; }
    .t-warn   { background: rgba(239,68,68,0.2);  color: #fca5a5; }
    .t-tip    { background: rgba(255,209,102,0.2);color: #fcd34d; }
    .t-timeline{ background: rgba(99,102,241,0.15);color: #818cf8; }
    .card-body { padding: 18px 18px 20px; }
    .card-body h3 { font-size: 1.05rem; font-weight: 800; color: var(--white); margin-bottom: 12px; line-height: 1.3; }
    .card-practice { background: linear-gradient(135deg, rgba(6,214,160,0.06), rgba(6,145,178,0.08)); border-color: rgba(6,214,160,0.25); }
    .card-practice .card-header { background: linear-gradient(90deg, rgba(6,214,160,0.15), transparent); border-bottom-color: rgba(6,214,160,0.15); }
    .card-security { background: linear-gradient(135deg, rgba(239,68,68,0.06), rgba(245,158,11,0.06)); border-color: rgba(239,68,68,0.25); }
    .card-security .card-header { background: linear-gradient(90deg, rgba(239,68,68,0.12), transparent); border-bottom-color: rgba(239,68,68,0.15); }
    .bullet { list-style: none; }
    .bullet li { padding: 5px 0 5px 20px; position: relative; font-size: .9rem; color: var(--text); line-height: 1.6; }
    .bullet li::before { content: '\\25B8'; position: absolute; left: 0; color: var(--primary); }
    .bullet li strong { color: var(--white); }
    .note { background: rgba(108,99,255,0.1); border-left: 3px solid var(--primary); border-radius: 0 8px 8px 0; padding: 10px 14px; font-size: .86rem; color: var(--muted); margin-top: 12px; }
    .note strong { color: #a5b4fc; }
    .warn { background: rgba(239,68,68,0.1); border-left: 3px solid var(--red); border-radius: 0 8px 8px 0; padding: 10px 14px; font-size: .86rem; color: #fca5a5; margin-top: 12px; }
    .warn strong { color: #f87171; }
    .insight { background: rgba(255,209,102,0.08); border-left: 3px solid var(--yellow); border-radius: 0 8px 8px 0; padding: 10px 14px; font-size: .86rem; color: #fcd34d; margin-top: 12px; }
    code { font-family: 'Cascadia Code','Consolas',monospace; font-size: .85em; background: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 4px; color: #a5b4fc; }
    .code-block { font-family: 'Cascadia Code','Consolas',monospace; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px 16px; font-size: .83rem; color: #a5b4fc; line-height: 1.75; overflow-x: auto; margin-top: 10px; white-space: pre; }
    .kw  { color: #e96c8f; } .str { color: #86efac; } .num { color: var(--yellow); } .cmt { color: #4b5563; font-style: italic; }
    .diagram { background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px; margin-top: 12px; text-align: center; }
    .d-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 5px 0; flex-wrap: wrap; }
    .d-box { padding: 7px 16px; border-radius: 8px; font-weight: 700; font-size: .82rem; }
    .d-arr { color: var(--muted); font-size: 1rem; }
    .b-ui    { background: rgba(108,99,255,0.25); color: #c4b5fd; border: 1px solid rgba(108,99,255,0.4); }
    .b-logic { background: rgba(255,209,102,0.18); color: #fcd34d; border: 1px solid rgba(255,209,102,0.3); }
    .b-data  { background: rgba(6,214,160,0.18);  color: #6ee7b7; border: 1px solid rgba(6,214,160,0.3); }
    .b-state { background: rgba(233,108,143,0.18); color: #f9a8d4; border: 1px solid rgba(233,108,143,0.3); }
    .b-act   { background: rgba(99,102,241,0.2);  color: #a5b4fc; border: 1px solid rgba(99,102,241,0.4); }
    .tree { font-family: 'Cascadia Code','Consolas',monospace; font-size: .85rem; line-height: 1.9; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 14px 18px; margin-top: 10px; }
    .t-root { color: var(--yellow); font-weight: 700; } .t-dir { color: #a5b4fc; }
    .steps { list-style: none; counter-reset: step; }
    .steps li { counter-increment: step; padding: 9px 0 9px 40px; position: relative; font-size: .9rem; border-bottom: 1px solid rgba(255,255,255,0.05); line-height: 1.5; }
    .steps li:last-child { border-bottom: none; }
    .steps li::before { content: counter(step); position: absolute; left: 0; width: 26px; height: 26px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; }
    .checklist { list-style: none; margin-top: 8px; }
    .checklist li { padding: 6px 0 6px 28px; position: relative; font-size: .9rem; }
    .checklist li::before { content: '\\2610'; position: absolute; left: 0; color: var(--cyan); font-size: 1rem; }
    .prompt-box { background: rgba(0,0,0,0.45); border: 1px solid rgba(108,99,255,0.35); border-radius: 10px; padding: 14px 16px; margin-top: 10px; font-size: .85rem; line-height: 1.7; color: #c4b5fd; }
    .prompt-label { font-size: .7rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--primary); font-weight: 700; margin-bottom: 8px; }
    .gv-note { background: rgba(255,209,102,0.06); border: 1px dashed rgba(255,209,102,0.3); border-radius: 10px; padding: 14px 16px; margin-top: 14px; font-size: .86rem; color: #fcd34d; line-height: 1.6; }
    .gv-label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; opacity: .7; display: block; }
    .timeline { position: relative; padding-left: 24px; margin-top: 12px; }
    .timeline::before { content: ''; position: absolute; left: 6px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--primary), transparent); }
    .tl { position: relative; margin-bottom: 12px; }
    .tl::before { content: ''; position: absolute; left: -20px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: var(--primary); border: 2px solid var(--dark); }
    .tl-t { font-size: .75rem; color: var(--primary); font-weight: 700; margin-bottom: 2px; }
    .tl-c { font-size: .88rem; color: var(--text); line-height: 1.5; }
    .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .tag-pill { padding: 5px 12px; border-radius: 8px; font-size: .82rem; display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); }
    .compare { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
    .cmp { background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px 12px; font-size: .84rem; line-height: 1.5; }
    .cmp .cmp-label { font-size: .72rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
    .cmp-bad  { border-left: 3px solid rgba(239,68,68,0.6); } .cmp-good { border-left: 3px solid rgba(6,214,160,0.6); }
    .cmp-bad  .cmp-label { color: #f87171; } .cmp-good .cmp-label { color: var(--cyan); }
    .mental-model-banner { background: linear-gradient(135deg, rgba(108,99,255,0.12), rgba(168,85,247,0.1)); border: 1px solid rgba(108,99,255,0.3); border-radius: 12px; padding: 18px 20px; margin-bottom: 14px; }
    .mm-label { font-size: .72rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #a5b4fc; margin-bottom: 8px; }
    .mm-content { font-size: 1.05rem; color: var(--white); font-weight: 600; line-height: 1.6; }
    .security-item { display: flex; gap: 12px; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .security-item:last-child { border-bottom: none; }
    .sec-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }
    .sec-title { font-size: .9rem; font-weight: 700; color: var(--white); margin-bottom: 3px; }
    .sec-desc  { font-size: .82rem; color: var(--muted); line-height: 1.5; }
    .sec-signal { font-size: .78rem; color: #f87171; margin-top: 4px; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(108,99,255,0.3), transparent); margin: 64px 0; }
    footer { text-align: center; padding: 40px 24px; color: var(--muted); font-size: .86rem; border-top: 1px solid rgba(255,255,255,0.05); }
    footer strong { color: var(--primary); }
    ::-webkit-scrollbar { width: 7px; } ::-webkit-scrollbar-track { background: var(--dark); } ::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.35); border-radius: 4px; }
    .pill { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: .78rem; font-weight: 700; margin-right: 4px; }
  </style>
</head>
<body>
<header>
  <div class="badge">📘 Tài liệu dành cho giảng viên</div>
  <h1>🎓 Web Builder Foundation</h1>
  <div class="subtitle">AI-Supported · 5 Buổi × 2 tiếng · Project xuyên suốt: Task Manager</div>
  <div class="meta-row">
    <div class="meta-chip">🧠 Mental model first</div>
    <div class="meta-chip">🤖 AI làm code, người hiểu hệ thống</div>
    <div class="meta-chip">🔍 Test, debug, mở rộng</div>
    <div class="meta-chip">🚀 Deploy thật</div>
  </div>
  <div class="philosophy-bar">
    <strong>Triết lý giảng dạy:</strong> Không dạy syntax. Dạy <em>cách nhìn</em> — học sinh hiểu hệ thống hoạt động như thế nào, biết đặt câu hỏi đúng cho AI, và biết khi nào AI đang sai.
  </div>
</header>

<nav>
  <a href="#overview">Tổng quan</a>
  <a href="#s1">Buổi 1</a>
  <a href="#s2">Buổi 2</a>
  <a href="#s3">Buổi 3</a>
  <a href="#s4">Buổi 4</a>
  <a href="#s5">Buổi 5</a>
</nav>

<main>
<!-- OVERVIEW -->
<section id="overview" style="scroll-margin-top:70px;margin-bottom:60px;">
  <h2 style="font-size:1.3rem;font-weight:800;color:var(--white);margin-bottom:20px;">📊 Lộ trình 5 buổi</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:14px;margin-bottom:32px;">
    <a href="#s1" style="text-decoration:none;background:var(--card);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px;text-align:center;display:block;color:inherit;">
      <div style="font-size:1.8rem;margin-bottom:8px;">🌐</div>
      <div style="font-weight:700;color:#fff;font-size:.9rem;">Buổi 1</div>
      <div style="color:var(--muted);font-size:.78rem;margin-top:4px;">Web = 3 tầng</div>
      <div style="margin-top:8px;font-size:.75rem;color:#a5b4fc;">UI + Logic + Data</div>
    </a>
    <a href="#s2" style="text-decoration:none;background:var(--card);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px;text-align:center;display:block;color:inherit;">
      <div style="font-size:1.8rem;margin-bottom:8px;">⚡</div>
      <div style="font-weight:700;color:#fff;font-size:.9rem;">Buổi 2</div>
      <div style="color:var(--muted);font-size:.78rem;margin-top:4px;">Tương tác</div>
      <div style="margin-top:8px;font-size:.75rem;color:#fdba74;">Action → State → UI</div>
    </a>
    <a href="#s3" style="text-decoration:none;background:var(--card);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px;text-align:center;display:block;color:inherit;">
      <div style="font-size:1.8rem;margin-bottom:8px;">💾</div>
      <div style="font-weight:700;color:#fff;font-size:.9rem;">Buổi 3</div>
      <div style="color:var(--muted);font-size:.78rem;margin-top:4px;">Lưu trữ</div>
      <div style="margin-top:8px;font-size:.75rem;color:#6ee7b7;">RAM vs Persistence</div>
    </a>
    <a href="#s4" style="text-decoration:none;background:var(--card);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px;text-align:center;display:block;color:inherit;">
      <div style="font-size:1.8rem;margin-bottom:8px;">✨</div>
      <div style="font-weight:700;color:#fff;font-size:.9rem;">Buổi 4</div>
      <div style="color:var(--muted);font-size:.78rem;margin-top:4px;">Code sạch</div>
      <div style="margin-top:8px;font-size:.75rem;color:#d8b4fe;">Người đọc được</div>
    </a>
    <a href="#s5" style="text-decoration:none;background:var(--card);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px;text-align:center;display:block;color:inherit;">
      <div style="font-size:1.8rem;margin-bottom:8px;">🚀</div>
      <div style="font-weight:700;color:#fff;font-size:.9rem;">Buổi 5</div>
      <div style="color:var(--muted);font-size:.78rem;margin-top:4px;">Deploy</div>
      <div style="margin-top:8px;font-size:.75rem;color:#fca5a5;">Nhà kho → Cửa hàng</div>
    </a>
  </div>
  <div class="diagram" style="max-width:100%;">
    <div style="color:var(--muted);font-size:.75rem;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;font-weight:700;">Mỗi buổi = 1 mental model cốt lõi</div>
    <div class="d-row">
      <div class="d-box b-ui">UI Tĩnh</div><div class="d-arr">→</div>
      <div class="d-box b-act">Tương tác</div><div class="d-arr">→</div>
      <div class="d-box b-data">Lưu trữ</div><div class="d-arr">→</div>
      <div class="d-box b-logic">Code sạch</div><div class="d-arr">→</div>
      <div class="d-box b-state">⚠️ Security</div><div class="d-arr">→</div>
      <div class="d-box" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.4);">🚀 Deploy</div>
    </div>
  </div>
</section>
<div class="divider"></div>

<!-- ═══ BUỔI 1 ═══ -->
<section class="session s1" id="s1">
  <div class="session-header">
    <div class="session-badge"><span class="sn">1</span>Buổi</div>
    <div class="session-info">
      <div class="session-title">🌐 Web là gì?</div>
      <div class="session-sub">Build giao diện tĩnh đầu tiên bằng AI</div>
      <div class="session-model">🧠 <strong>Mental model:</strong> Web = UI + Logic + Data — thiếu 1 trong 3 → không thành hệ thống</div>
    </div>
  </div>
  <div class="cards-grid">
    <!-- Timeline -->
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Timeline</span><span class="card-tag t-timeline">120 phút</span></div>
      <div class="card-body">
        <h3>⏱️ Kế hoạch buổi 1</h3>
        <div class="timeline">
          <div class="tl"><div class="tl-t">0 – 10 phút</div><div class="tl-c"><strong>Câu hỏi mở:</strong> "Theo bạn, 1 trang web được tạo ra từ những gì?" — Ghi nhận câu trả lời học sinh lên bảng, không sửa</div></div>
          <div class="tl"><div class="tl-t">10 – 25 phút</div><div class="tl-c"><strong>Mental model:</strong> Web = UI + Logic + Data. Dùng ví dụ Facebook, Shopee để học sinh nhận ra 3 tầng</div></div>
          <div class="tl"><div class="tl-t">25 – 40 phút</div><div class="tl-c"><strong>Project intro:</strong> Task Manager — data model, user flow, module hóa (không code, chỉ vẽ)</div></div>
          <div class="tl"><div class="tl-t">40 – 50 phút</div><div class="tl-c"><strong>Prompt engineering:</strong> Cách ra lệnh cho AI đúng. So sánh prompt tốt vs xấu</div></div>
          <div class="tl"><div class="tl-t">50 – 55 phút</div><div class="tl-c">Break ☕</div></div>
          <div class="tl"><div class="tl-t">55 – 110 phút</div><div class="tl-c"><strong>Thực hành:</strong> Học sinh tự prompt AI → nhận HTML/CSS → chạy trên browser → phân tích code</div></div>
          <div class="tl"><div class="tl-t">110 – 120 phút</div><div class="tl-c"><strong>Tổng kết:</strong> Hỏi lại mental model. Preview buổi 2 (thêm JavaScript)</div></div>
        </div>
      </div>
    </div>
    <!-- Mental Model -->
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Slide cốt lõi</span><span class="card-tag t-mental">Mental Model</span></div>
      <div class="card-body">
        <div class="mental-model-banner">
          <div class="mm-label">🧠 1 câu học sinh phải nhớ sau buổi này</div>
          <div class="mm-content">"Web không phải là trang HTML đẹp. Web là UI + Logic + Data phối hợp với nhau. Thiếu 1 trong 3 → không thành hệ thống."</div>
        </div>
        <div class="diagram">
          <div class="d-row">
            <div class="d-box b-ui" style="padding:12px 24px;font-size:.9rem;">🎨 UI<br/><small style="opacity:.7;">Giao diện</small></div>
            <div style="font-size:1.4rem;color:rgba(255,255,255,0.2);">+</div>
            <div class="d-box b-logic" style="padding:12px 24px;font-size:.9rem;">⚡ Logic<br/><small style="opacity:.7;">Xử lý</small></div>
            <div style="font-size:1.4rem;color:rgba(255,255,255,0.2);">+</div>
            <div class="d-box b-data" style="padding:12px 24px;font-size:.9rem;">💾 Data<br/><small style="opacity:.7;">Dữ liệu</small></div>
          </div>
        </div>
        <div class="note"><strong>💬 Ví dụ thực tế:</strong> Shopee có UI (giao diện mua hàng), Logic (kiểm tra tồn kho, tính giá), Data (sản phẩm, user, đơn hàng). Trang HTML thuần chỉ có UI → không phải app.</div>
        <div class="gv-note">
          <span class="gv-label">📝 Ghi chú giảng viên</span>
          Sau khi giải thích, quay lại bảng — nhìn vào câu trả lời ban đầu của học sinh và hỏi: "Bây giờ bạn nhìn lại câu trả lời lúc đầu, bạn muốn bổ sung gì không?" Tạo cảm giác "aha moment".
        </div>
      </div>
    </div>
    <!-- Data Model -->
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 3</span><span class="card-tag t-mental">Tư duy</span></div>
      <div class="card-body">
        <h3>📋 Task Manager – Data trông như thế nào?</h3>
        <div class="code-block"><span class="str">"id"</span>: <span class="num">1706234567890</span>,
<span class="str">"title"</span>: <span class="str">"Học cách dùng AI"</span>,
<span class="str">"completed"</span>: <span class="kw">false</span></div>
        <ul class="bullet" style="margin-top:12px;">
          <li><strong>id</strong>: số duy nhất — để tìm đúng task khi xóa</li>
          <li><strong>title</strong>: nội dung task</li>
          <li><strong>completed</strong>: đúng/sai — phản ánh trạng thái</li>
        </ul>
        <div class="note"><strong>❓ Hỏi học sinh:</strong> "Nếu muốn thêm tính năng deadline, cần thêm field gì vào đây?"</div>
      </div>
    </div>
    <!-- Module hóa -->
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 4</span><span class="card-tag t-mental">Architecture</span></div>
      <div class="card-body">
        <h3>🧩 Chia nhỏ = dễ kiểm soát</h3>
        <p style="color:var(--muted);font-size:.87rem;margin-bottom:10px;">Thay vì 1 file làm tất cả → chia thành các phần độc lập:</p>
        <div class="tree">
          <span class="t-root">App</span>
├── <span class="t-dir">TaskForm</span>   ← nhập &amp; gửi task
├── <span class="t-dir">TaskList</span>   ← danh sách tất cả
└── <span class="t-dir">TaskItem</span>   ← 1 task đơn lẻ</div>
        <div class="note"><strong>🧠 Tư duy Lego:</strong> Mỗi mảnh làm đúng 1 việc. Có thể thay, sửa, bỏ từng mảnh mà không phá cả hệ thống.</div>
      </div>
    </div>
    <!-- Prompt Engineering -->
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Slide 5</span><span class="card-tag t-ai">AI Prompt</span></div>
      <div class="card-body">
        <h3>🤖 Prompt AI đúng cách — đây là kỹ năng thật</h3>
        <div class="compare">
          <div class="cmp cmp-bad">
            <div class="cmp-label">❌ Prompt xấu</div>
            Làm cho tôi 1 trang web quản lý task.
            <div class="warn" style="margin-top:8px;font-size:.8rem;">AI sẽ tự quyết định mọi thứ → output có thể rất khác kỳ vọng</div>
          </div>
          <div class="cmp cmp-good">
            <div class="cmp-label">✅ Prompt tốt</div>
            Tôi đang học lập trình web. Tạo giao diện HTML + CSS cho Task Manager: (1) Header "My Tasks". (2) Form: input + nút "Add". (3) List: mỗi task có checkbox + text + nút xóa. Chỉ HTML/CSS, semantic HTML, responsive. Giải thích từng section.
          </div>
        </div>
        <div class="tag-row">
          <div class="tag-pill">👤 Nói rõ bạn là ai</div>
          <div class="tag-pill">📌 Context rõ ràng</div>
          <div class="tag-pill">📋 Yêu cầu từng bước</div>
          <div class="tag-pill">🎯 Giới hạn phạm vi</div>
          <div class="tag-pill">🗣️ Yêu cầu giải thích</div>
        </div>
        <div class="gv-note">
          <span class="gv-label">📝 Ghi chú giảng viên</span>
          Cho học sinh thử gửi cả 2 prompt rồi so sánh output. Học sinh tự nhận ra sự khác biệt mà không cần giảng viên giải thích thêm.
        </div>
      </div>
    </div>
    <!-- Thực hành -->
    <div class="card card-practice card-wide">
      <div class="card-header"><span class="card-label" style="color:var(--cyan);">Thực hành</span><span class="card-tag t-practice">60 phút</span></div>
      <div class="card-body">
        <h3 style="color:var(--cyan);">💻 Build giao diện Task Manager bằng AI</h3>
        <ol class="steps">
          <li>Tạo folder <code>task-manager/</code> → file <code>index.html</code></li>
          <li>Viết prompt theo khung ở Slide 5, gửi cho AI</li>
          <li>Copy code vào file, mở bằng browser (Live Server)</li>
          <li>Đọc code AI tạo ra — hỏi AI giải thích từng phần không hiểu</li>
          <li>Tự thay đổi 1 thứ nhỏ: màu nút, font, padding — để hiểu CSS hoạt động</li>
          <li>Test trên mobile view (DevTools → Toggle device)</li>
        </ol>
        <div class="prompt-box">
          <div class="prompt-label">💬 Prompt mẫu cho học sinh dùng ngay</div>
          Tôi đang học lập trình web từ đầu. Hãy tạo giao diện HTML + CSS cho ứng dụng Task Manager gồm: (1) Header với tiêu đề "My Tasks". (2) Form nhập task: input text placeholder "Add a new task..." và button "Add". (3) Danh sách task mẫu: mỗi task có checkbox, text, button "Delete". Yêu cầu: dùng semantic HTML5, CSS Flexbox, responsive, màu chủ đạo #6c63ff, font system-ui. Giải thích từng phần của code.
        </div>
        <div class="gv-note">
          <span class="gv-label">📝 Ghi chú giảng viên</span>
          <strong>Phút 0–10:</strong> Setup VS Code + Live Server. Demo cách mở file HTML.<br/>
          <strong>Phút 10–40:</strong> Học sinh tự làm, GV đi vòng hỗ trợ. Hỏi: "Dòng CSS này làm gì?"<br/>
          <strong>Phút 40–55:</strong> 2–3 học sinh demo. Hỏi: "Phần nào là UI? Phần nào sẽ là Data?"<br/>
          <strong>Phút 55–60:</strong> Tổng kết mental model. Preview buổi 2.
        </div>
        <ul class="checklist" style="margin-top:14px;">
          <li>Browser hiển thị giao diện Task Manager</li>
          <li>Có form nhập + danh sách task mẫu</li>
          <li>Responsive không vỡ layout trên mobile</li>
          <li>Học sinh giải thích được ít nhất 3 dòng CSS</li>
        </ul>
      </div>
    </div>
  </div>
</section>
<div class="divider"></div>

<!-- ═══ BUỔI 2 ═══ -->
<section class="session s2" id="s2">
  <div class="session-header">
    <div class="session-badge"><span class="sn">2</span>Buổi</div>
    <div class="session-info">
      <div class="session-title">⚡ State &amp; Tương tác</div>
      <div class="session-sub">Làm web phản ứng với người dùng — CRUD</div>
      <div class="session-model">🧠 <strong>Mental model:</strong> Mọi tương tác = Action → State thay đổi → UI tự cập nhật</div>
    </div>
  </div>
  <div class="cards-grid">
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Timeline</span><span class="card-tag t-timeline">120 phút</span></div>
      <div class="card-body">
        <h3>⏱️ Kế hoạch buổi 2</h3>
        <div class="timeline">
          <div class="tl"><div class="tl-t">0 – 10 phút</div><div class="tl-c"><strong>Câu hỏi mở:</strong> "Nếu bạn thêm task vào danh sách, điều gì xảy ra trong máy tính?" — Không có câu trả lời sai</div></div>
          <div class="tl"><div class="tl-t">10 – 30 phút</div><div class="tl-c"><strong>Mental model:</strong> State = bộ nhớ của app. Action → update state → re-render UI. Demo live đơn giản</div></div>
          <div class="tl"><div class="tl-t">30 – 50 phút</div><div class="tl-c"><strong>CRUD concept:</strong> Giải thích 4 thao tác, map vào Task Manager. AI generate code mẫu, GV giải thích flow</div></div>
          <div class="tl"><div class="tl-t">50 – 55 phút</div><div class="tl-c">Break ☕</div></div>
          <div class="tl"><div class="tl-t">55 – 110 phút</div><div class="tl-c"><strong>Thực hành:</strong> Thêm JS vào project buổi 1. Test từng chức năng trong browser</div></div>
          <div class="tl"><div class="tl-t">110 – 120 phút</div><div class="tl-c"><strong>Tổng kết:</strong> Hỏi "Refresh thì sao?" → tạo cliffhanger cho buổi 3</div></div>
        </div>
      </div>
    </div>
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Slide cốt lõi</span><span class="card-tag t-mental">Mental Model</span></div>
      <div class="card-body">
        <div class="mental-model-banner">
          <div class="mm-label">🧠 1 câu học sinh phải nhớ sau buổi này</div>
          <div class="mm-content">"Mọi tương tác trong web đều theo 1 chiều: User làm gì đó → State thay đổi → UI tự vẽ lại. Không có ngoại lệ."</div>
        </div>
        <div class="diagram">
          <div class="d-row">
            <div class="d-box b-act">👆 User Action</div>
            <div class="d-arr">→</div>
            <div class="d-box b-state">🔄 Update State</div>
            <div class="d-arr">→</div>
            <div class="d-box b-ui">🎨 Re-render UI</div>
          </div>
        </div>
        <div class="note"><strong>💡 Tại sao 1 chiều?</strong> Khi UI sai → tìm ngay state. Khi state sai → tìm action. Debug trở nên đơn giản hơn nhiều.</div>
        <div class="note"><strong>🔍 Ví dụ thực tế:</strong> Bấm "Add" → JS thêm vào mảng tasks (state) → hàm render vẽ lại danh sách (UI). Đây là toàn bộ cơ chế.</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 3</span><span class="card-tag t-mental">Khái niệm</span></div>
      <div class="card-body">
        <h3>🔧 CRUD = 4 thao tác của mọi app</h3>
        <div class="tag-row">
          <div class="tag-pill" style="background:rgba(6,214,160,0.1);border-color:rgba(6,214,160,0.2);">➕ <strong>C</strong>reate</div>
          <div class="tag-pill" style="background:rgba(108,99,255,0.1);border-color:rgba(108,99,255,0.2);">📋 <strong>R</strong>ead</div>
          <div class="tag-pill" style="background:rgba(255,209,102,0.1);border-color:rgba(255,209,102,0.2);">✏️ <strong>U</strong>pdate</div>
          <div class="tag-pill" style="background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.2);">🗑️ <strong>D</strong>elete</div>
        </div>
        <ul class="bullet" style="margin-top:12px;">
          <li>Task Manager là ví dụ CRUD hoàn hảo</li>
          <li>Instagram, Shopee, Gmail — tất cả đều là CRUD mở rộng</li>
          <li>Hiểu CRUD = hiểu 80% ứng dụng thực tế</li>
        </ul>
        <div class="note"><strong>❓ Hỏi học sinh:</strong> "Tính năng 'đánh dấu hoàn thành' thuộc loại nào trong CRUD?"</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 4</span><span class="card-tag t-warn">Lỗi thường gặp</span></div>
      <div class="card-body">
        <h3>🐛 3 lỗi hay gặp nhất</h3>
        <div class="compare" style="grid-template-columns:1fr;">
          <div class="cmp cmp-bad"><div class="cmp-label">❌ Quên gọi render()</div>Task đã thêm vào mảng nhưng màn hình không thay đổi</div>
          <div class="cmp cmp-bad" style="margin-top:8px;"><div class="cmp-label">❌ State sai chỗ</div>Để tasks trong TaskForm → TaskList không đọc được</div>
          <div class="cmp cmp-bad" style="margin-top:8px;"><div class="cmp-label">❌ querySelector sai</div><code>#taskList</code> vs <code>.taskList</code> → trả về null → crash</div>
        </div>
        <div class="insight">💡 <strong>Cách debug nhanh:</strong> F12 → Console → <code>console.log(tasks)</code> sau mỗi action. Nếu state đúng nhưng UI sai → vấn đề ở render.</div>
      </div>
    </div>
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Slide 5</span><span class="card-tag t-flow">Code Flow</span></div>
      <div class="card-body">
        <h3>💻 Cách AI generate CRUD — GV giải thích live</h3>
        <div class="code-block"><span class="cmt">// State — mảng lưu tất cả tasks</span>
<span class="kw">let</span> tasks = [];

<span class="cmt">// CREATE</span>
<span class="kw">function</span> <span class="str">addTask</span>(title) {
  tasks.push({ id: Date.now(), title, completed: <span class="kw">false</span> });
  render(); <span class="cmt">// ← bắt buộc gọi sau mỗi thay đổi</span>
}

<span class="cmt">// DELETE</span>
<span class="kw">function</span> <span class="str">deleteTask</span>(id) {
  tasks = tasks.filter(t =&gt; t.id !== id);
  render();
}

<span class="cmt">// UPDATE (toggle)</span>
<span class="kw">function</span> <span class="str">toggleTask</span>(id) {
  tasks = tasks.map(t =&gt;
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  render();
}</div>
        <div class="note"><strong>Pattern nhận biết:</strong> Mỗi function đều kết thúc bằng <code>render()</code>. Nếu quên → UI không cập nhật. Đây là lỗi số 1 của người mới.</div>
        <div class="gv-note">
          <span class="gv-label">📝 Ghi chú giảng viên</span>
          Không cần học sinh hiểu từng dòng. Chỉ cần họ thấy <strong>pattern</strong>: thay đổi → render. Hỏi: "Tại sao 3 function đều có <code>render()</code> ở cuối?" — Để học sinh tự trả lời.
        </div>
      </div>
    </div>
    <div class="card card-practice card-wide">
      <div class="card-header"><span class="card-label" style="color:var(--cyan);">Thực hành</span><span class="card-tag t-practice">55 phút</span></div>
      <div class="card-body">
        <h3 style="color:var(--cyan);">💻 Thêm CRUD vào Task Manager</h3>
        <ol class="steps">
          <li>Mở project buổi 1 — tạo thêm file <code>app.js</code></li>
          <li>Prompt AI: "Thêm JavaScript CRUD cho Task Manager này, giải thích từng function"</li>
          <li>Test từng chức năng: <strong>Add</strong> → thêm task, <strong>Checkbox</strong> → gạch qua, <strong>Delete</strong> → biến mất</li>
          <li>Mở DevTools Console, gõ <code>tasks</code> → xem state trực tiếp</li>
          <li>Phá thử: xóa dòng <code>render()</code> → thấy UI không cập nhật → hiểu tại sao</li>
          <li>Test edge case: nhập rỗng → nên bị chặn</li>
        </ol>
        <div class="prompt-box">
          <div class="prompt-label">💬 Prompt mẫu</div>
          Đây là HTML Task Manager của tôi [paste code]. Hãy thêm JavaScript để thực hiện CRUD: (1) addTask(title) thêm task vào mảng tasks, (2) deleteTask(id) xóa task, (3) toggleTask(id) đổi trạng thái completed, (4) render() vẽ lại danh sách. Kết nối form submit với addTask. Giải thích từng dòng quan trọng.
        </div>
        <div class="gv-note">
          <span class="gv-label">📝 Ghi chú giảng viên</span>
          <strong>Bài test hiểu bài:</strong> Cuối buổi, hỏi "Nếu nhấn Add nhưng task không hiện ra, bạn kiểm tra gì đầu tiên?" — Câu trả lời đúng: kiểm tra state trong console, rồi kiểm tra render() có được gọi không.<br/><br/>
          <strong>Cliffhanger:</strong> Nhờ 1 học sinh refresh trang → hỏi lớp "Sao task biến mất?" → tạo động lực cho buổi 3.
        </div>
        <ul class="checklist" style="margin-top:14px;">
          <li>Add task hoạt động, task hiện ra ngay</li>
          <li>Tick checkbox → task có text gạch ngang</li>
          <li>Nhấn Delete → task biến khỏi danh sách</li>
          <li>Console hiển thị đúng state sau mỗi action</li>
        </ul>
      </div>
    </div>
  </div>
</section>
<div class="divider"></div>

<!-- ═══ BUỔI 3 ═══ -->
<section class="session s3" id="s3">
  <div class="session-header">
    <div class="session-badge"><span class="sn">3</span>Buổi</div>
    <div class="session-info">
      <div class="session-title">💾 Data Persistence</div>
      <div class="session-sub">Dữ liệu không được chết khi reload</div>
      <div class="session-model">🧠 <strong>Mental model:</strong> State sống trong RAM → tắt là mất. Persistence = ghi ra nơi bền vững</div>
    </div>
  </div>
  <div class="cards-grid">
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Timeline</span><span class="card-tag t-timeline">120 phút</span></div>
      <div class="card-body">
        <h3>⏱️ Kế hoạch buổi 3</h3>
        <div class="timeline">
          <div class="tl"><div class="tl-t">0 – 10 phút</div><div class="tl-c"><strong>Recap cliffhanger:</strong> "Tại sao refresh là mất data?" — Học sinh trả lời, không thuyết trình</div></div>
          <div class="tl"><div class="tl-t">10 – 25 phút</div><div class="tl-c"><strong>Mental model:</strong> RAM vs Disk. State là bộ nhớ tạm. Persistence là bộ nhớ dài hạn. Vẽ sơ đồ</div></div>
          <div class="tl"><div class="tl-t">25 – 45 phút</div><div class="tl-c"><strong>localStorage concept:</strong> Dùng DevTools Application tab TRƯỚC khi code — học sinh thấy data lưu thực tế</div></div>
          <div class="tl"><div class="tl-t">45 – 50 phút</div><div class="tl-c">Break ☕</div></div>
          <div class="tl"><div class="tl-t">50 – 110 phút</div><div class="tl-c"><strong>Thực hành:</strong> Thêm localStorage. Test refresh. Debug bằng DevTools</div></div>
          <div class="tl"><div class="tl-t">110 – 120 phút</div><div class="tl-c"><strong>Tổng kết:</strong> "localStorage có giới hạn gì?" → tạo tư duy mở rộng lên database</div></div>
        </div>
      </div>
    </div>
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Slide cốt lõi</span><span class="card-tag t-mental">Mental Model</span></div>
      <div class="card-body">
        <div class="mental-model-banner">
          <div class="mm-label">🧠 1 câu học sinh phải nhớ sau buổi này</div>
          <div class="mm-content">"State = RAM = tắt là mất. Persistence = ghi ra ngoài RAM. localStorage là cách đơn giản nhất — nhưng chỉ lưu được ở 1 máy."</div>
        </div>
        <div class="diagram">
          <div class="d-row">
            <div class="d-box b-state">State (RAM)<br/><small>Nhanh, tạm thời</small></div>
            <div class="d-arr">↔</div>
            <div class="d-box b-data">localStorage<br/><small>Bền, 1 thiết bị</small></div>
            <div class="d-arr">↔</div>
            <div class="d-box b-logic">Database<br/><small>Bền, nhiều thiết bị</small></div>
          </div>
        </div>
        <div class="note"><strong>🔍 Mỗi tầng phù hợp với gì?</strong><br/>localStorage → app cá nhân, không cần đăng nhập<br/>Database → nhiều user, nhiều thiết bị, cần đồng bộ</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 3</span><span class="card-tag t-flow">localStorage</span></div>
      <div class="card-body">
        <h3>🗂️ localStorage — 3 điều cần biết</h3>
        <ul class="bullet">
          <li>Chỉ lưu được <strong>string</strong> — phải convert</li>
          <li>Max ~5MB — đủ cho app nhỏ</li>
          <li>Sống trên trình duyệt — không mất khi refresh</li>
        </ul>
        <div class="code-block"><span class="cmt">// Lưu (object → string)</span>
localStorage.setItem(<span class="str">'tasks'</span>, JSON.stringify(tasks));

<span class="cmt">// Đọc (string → object)</span>
<span class="kw">const</span> saved = localStorage.getItem(<span class="str">'tasks'</span>);
<span class="kw">const</span> tasks = saved ? JSON.parse(saved) : [];</div>
        <div class="warn"><strong>⚠️ Bug số 1:</strong> <code>JSON.parse(null)</code> → lỗi ngay. Luôn kiểm tra <code>saved !== null</code> trước khi parse.</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 4</span><span class="card-tag t-tip">DevTools</span></div>
      <div class="card-body">
        <h3>🔍 Xem localStorage bằng DevTools</h3>
        <ol class="steps">
          <li>F12 → tab <strong>Application</strong></li>
          <li>Sidebar trái: <strong>Local Storage</strong> → <code>localhost:5500</code></li>
          <li>Thấy key <code>tasks</code> và value JSON</li>
          <li>Click phải → Delete để test reload từ đầu</li>
        </ol>
        <div class="insight">💡 <strong>Cách dạy tốt nhất:</strong> Mở DevTools TRƯỚC khi code — để học sinh thấy localStorage thay đổi theo thời gian thực khi thêm/xóa task.</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 5</span><span class="card-tag t-warn">Giới hạn</span></div>
      <div class="card-body">
        <h3>⚠️ localStorage không phải database</h3>
        <ul class="bullet">
          <li>Chỉ 1 người dùng, 1 thiết bị</li>
          <li>Người dùng có thể xóa bất kỳ lúc nào</li>
          <li>Không thể chia sẻ data giữa user</li>
          <li>Không có backup — mất là mất thật</li>
          <li>Không phù hợp lưu thông tin nhạy cảm</li>
        </ul>
        <div class="note"><strong>🔮 Bước tiếp theo:</strong> Khi cần nhiều user hoặc nhiều thiết bị → cần database + server (học ở khóa nâng cao).</div>
      </div>
    </div>
    <div class="card card-practice card-wide">
      <div class="card-header"><span class="card-label" style="color:var(--cyan);">Thực hành</span><span class="card-tag t-practice">60 phút</span></div>
      <div class="card-body">
        <h3 style="color:var(--cyan);">💻 Thêm localStorage vào Task Manager</h3>
        <ol class="steps">
          <li>Mở project buổi 2, mở đồng thời DevTools → Application → Local Storage</li>
          <li>Prompt AI: "Thêm localStorage vào app, xử lý cả trường hợp lần đầu chạy"</li>
          <li>Chạy app → thêm task → quan sát localStorage thay đổi thời gian thực</li>
          <li>Refresh page → kiểm tra task còn không</li>
          <li>Mở tab mới cùng URL → data có sync không? (Không — đây là giới hạn)</li>
          <li>Xóa localStorage thủ công qua DevTools → thấy app về trạng thái ban đầu</li>
        </ol>
        <div class="prompt-box">
          <div class="prompt-label">💬 Prompt mẫu</div>
          Thêm localStorage persistence vào Task Manager: (1) Ghi tasks vào localStorage sau mỗi thay đổi. (2) Đọc tasks từ localStorage khi app khởi động — nếu chưa có thì dùng mảng rỗng. (3) Tạo 2 helper functions: saveTasks() và loadTasks(). Giải thích lý do xử lý null check.
        </div>
        <div class="gv-note">
          <span class="gv-label">📝 Ghi chú giảng viên</span>
          <strong>Trick hay:</strong> Mở 2 tab cùng app — thêm task ở tab 1 → refresh tab 2 → chỉ thấy data khi refresh, không sync real-time. Dùng điều này để giải thích localStorage vs Database.<br/><br/>
          <strong>Câu hỏi kết buổi:</strong> "Nếu 2 người dùng cùng app này, họ có thấy task của nhau không? Tại sao?"
        </div>
        <ul class="checklist" style="margin-top:14px;">
          <li>Refresh page → task vẫn còn</li>
          <li>DevTools hiển thị đúng JSON trong Local Storage</li>
          <li>Xóa hết task → localStorage cũng rỗng</li>
          <li>Học sinh giải thích được tại sao cần JSON.parse/stringify</li>
        </ul>
      </div>
    </div>
  </div>
</section>
<div class="divider"></div>

<!-- ═══ BUỔI 4 ═══ -->
<section class="session s4" id="s4">
  <div class="session-header">
    <div class="session-badge"><span class="sn">4</span>Buổi</div>
    <div class="session-info">
      <div class="session-title">✨ Clean Code &amp; UX</div>
      <div class="session-sub">Từ "code chạy được" lên "sản phẩm thật"</div>
      <div class="session-model">🧠 <strong>Mental model:</strong> Code tốt = người khác đọc hiểu được sau 1 tuần — kể cả bản thân mình</div>
    </div>
  </div>
  <div class="cards-grid">
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Timeline</span><span class="card-tag t-timeline">120 phút</span></div>
      <div class="card-body">
        <h3>⏱️ Kế hoạch buổi 4</h3>
        <div class="timeline">
          <div class="tl"><div class="tl-t">0 – 10 phút</div><div class="tl-c"><strong>Câu hỏi mở:</strong> "Code chạy được là code tốt không?" — Học sinh tranh luận</div></div>
          <div class="tl"><div class="tl-t">10 – 30 phút</div><div class="tl-c"><strong>Mental model:</strong> Code tốt = người đọc hiểu. Xem code cũ 1 tuần trước — có hiểu không? Đây là test thật</div></div>
          <div class="tl"><div class="tl-t">30 – 50 phút</div><div class="tl-c"><strong>UX cơ bản:</strong> 4 điều tối thiểu. Dùng AI review UX — nhận gợi ý cụ thể</div></div>
          <div class="tl"><div class="tl-t">50 – 55 phút</div><div class="tl-c">Break ☕</div></div>
          <div class="tl"><div class="tl-t">55 – 110 phút</div><div class="tl-c"><strong>Thực hành:</strong> Dùng AI review code, thêm UX, refactor nhẹ</div></div>
          <div class="tl"><div class="tl-t">110 – 120 phút</div><div class="tl-c"><strong>Tổng kết:</strong> "App đã sẵn sàng để người khác dùng chưa?" → Preview buổi 5 (security + deploy)</div></div>
        </div>
      </div>
    </div>
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Slide cốt lõi</span><span class="card-tag t-mental">Mental Model</span></div>
      <div class="card-body">
        <div class="mental-model-banner">
          <div class="mm-label">🧠 1 câu học sinh phải nhớ sau buổi này</div>
          <div class="mm-content">"Code tốt không phải code ngắn nhất hay chạy nhanh nhất. Code tốt là code mà người khác — hoặc chính bạn sau 1 tuần — đọc và hiểu ngay không cần giải thích."</div>
        </div>
        <div class="compare">
          <div class="cmp cmp-bad">
            <div class="cmp-label">❌ Code khó đọc</div>
            <code>const x = t.filter(i =&gt; !i.c);</code><br/>
            <small style="opacity:.6;">x là gì? t là gì? c là gì?</small>
          </div>
          <div class="cmp cmp-good">
            <div class="cmp-label">✅ Code dễ đọc</div>
            <code>const pending = tasks.filter(t =&gt; !t.completed);</code><br/>
            <small style="opacity:.6;">Đọc 1 lần là hiểu ngay</small>
          </div>
        </div>
        <div class="note"><strong>Quy tắc đặt tên:</strong> Biến = danh từ mô tả nội dung. Function = động từ mô tả hành động. Tránh: <code>data</code>, <code>x</code>, <code>temp</code>, <code>item</code>.</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 3</span><span class="card-tag t-flow">UX</span></div>
      <div class="card-body">
        <h3>👤 UX là gì? — 4 điều tối thiểu</h3>
        <ul class="bullet">
          <li>🚫 <strong>Không cho nhập rỗng</strong> — validate trước khi xử lý</li>
          <li>📭 <strong>Empty state</strong> — "Chưa có task nào" thay vì danh sách trắng</li>
          <li>✅ <strong>Feedback ngay</strong> — sau khi thêm: input tự xóa</li>
          <li>❓ <strong>Confirm xóa</strong> — tránh lỡ tay</li>
        </ul>
        <div class="note"><strong>💡 Nguyên lý:</strong> User không đọc hướng dẫn. App phải tự hướng dẫn user qua từng bước. Nếu cần hướng dẫn → UI đang sai.</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 4</span><span class="card-tag t-mental">Structure</span></div>
      <div class="card-body">
        <h3>📁 Tổ chức file rõ ràng</h3>
        <div class="tree">
          <span class="t-root">task-manager/</span>
├── index.html
├── <span class="t-dir">style.css</span>
├── <span style="color:#fcd34d;">app.js</span>        ← logic chính
└── <span style="color:var(--cyan);">storage.js</span>  ← localStorage helpers</div>
        <div class="note"><strong>Quy tắc:</strong> Mỗi file = 1 trách nhiệm. <code>storage.js</code> chỉ lo lưu/đọc. <code>app.js</code> chỉ lo logic. Không lẫn lộn.</div>
      </div>
    </div>
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Slide 5</span><span class="card-tag t-ai">AI Review</span></div>
      <div class="card-body">
        <h3>🤖 Dùng AI làm senior reviewer — không phải coder</h3>
        <div class="compare">
          <div class="cmp cmp-bad">
            <div class="cmp-label">❌ Dùng AI sai cách</div>
            "Viết lại code này cho tôi"<br/>
            <small style="opacity:.6;">Nhận code mới → không hiểu → phụ thuộc mãi</small>
          </div>
          <div class="cmp cmp-good">
            <div class="cmp-label">✅ Dùng AI đúng cách</div>
            "Review code này — chỉ ra vấn đề và giải thích tại sao"<br/>
            <small style="opacity:.6;">Nhận feedback → tự sửa → học được nguyên nhân</small>
          </div>
        </div>
        <div class="prompt-box" style="margin-top:14px;">
          <div class="prompt-label">💬 Prompt review code chuẩn</div>
          Review đoạn JavaScript này cho tôi. Tôi cần biết: (1) Tên biến/function có mô tả rõ không? (2) Có đoạn logic nào lặp lại nên tách ra function không? (3) Có lỗi tiềm ẩn nào không rõ ràng không? (4) Nếu người khác đọc code này lần đầu, họ sẽ bị mắc kẹt ở đâu? Đừng viết lại code — chỉ giải thích vấn đề.
        </div>
        <div class="gv-note">
          <span class="gv-label">📝 Ghi chú giảng viên</span>
          Nhấn mạnh: <strong>Mục tiêu không phải nhận code đẹp hơn từ AI. Mục tiêu là hiểu TẠI SAO code cũ chưa tốt.</strong> Học sinh phải tự sửa ít nhất 1 vấn đề mà không hỏi AI.
        </div>
      </div>
    </div>
    <div class="card card-practice card-wide">
      <div class="card-header"><span class="card-label" style="color:var(--cyan);">Thực hành</span><span class="card-tag t-practice">55 phút</span></div>
      <div class="card-body">
        <h3 style="color:var(--cyan);">💻 Nâng cấp app lên chuẩn sản phẩm</h3>
        <ol class="steps">
          <li>Paste code vào AI với prompt review ở Slide 5 — đọc kỹ phản hồi</li>
          <li>Thêm validation: không cho submit task rỗng hoặc chỉ có dấu cách</li>
          <li>Thêm empty state: khi tasks = [] hiện thông báo "Chưa có task nào 🎉"</li>
          <li>Sau khi thêm task: input tự clear, tự focus lại để nhập tiếp</li>
          <li>Tự sửa ít nhất 1 vấn đề AI chỉ ra mà không hỏi lại AI</li>
          <li>Tách localStorage code ra file <code>storage.js</code> riêng</li>
        </ol>
        <div class="gv-note">
          <span class="gv-label">📝 Ghi chú giảng viên</span>
          <strong>Bài test cuối buổi:</strong> "Đưa máy tính cho người ngồi bên cạnh, để họ dùng app 2 phút. Liệt kê những gì họ thấy khó hiểu hoặc bị lỗi."<br/>
          Đây là usability test đơn giản nhất — và thường tìm ra bug mà học sinh không ngờ tới.
        </div>
        <ul class="checklist" style="margin-top:14px;">
          <li>Không thể add task rỗng</li>
          <li>Hiển thị thông báo khi danh sách trống</li>
          <li>Input tự clear sau khi add thành công</li>
          <li>localStorage code tách riêng file</li>
          <li>Học sinh giải thích được ít nhất 1 refactor họ làm</li>
        </ul>
      </div>
    </div>
  </div>
</section>
<div class="divider"></div>

<!-- ═══ BUỔI 5 ═══ -->
<section class="session s5" id="s5">
  <div class="session-header">
    <div class="session-badge"><span class="sn">5</span>Buổi</div>
    <div class="session-info">
      <div class="session-title">🚀 Deploy &amp; Hoàn thiện</div>
      <div class="session-sub">Security check → Deploy thật → Demo cuối khóa</div>
      <div class="session-model">🧠 <strong>Mental model:</strong> Dev = nhà kho (mình biết). Production = cửa hàng thật (ai cũng vào được). Trước khi mở cửa → phải kiểm tra kỹ</div>
    </div>
  </div>
  <div class="cards-grid">
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Timeline</span><span class="card-tag t-timeline">120 phút</span></div>
      <div class="card-body">
        <h3>⏱️ Kế hoạch buổi 5</h3>
        <div class="timeline">
          <div class="tl"><div class="tl-t">0 – 10 phút</div><div class="tl-c"><strong>Câu hỏi mở:</strong> "App bạn làm giờ có thể share link cho bạn bè dùng chưa? Cần thêm gì?" — Học sinh tự nhận ra gap</div></div>
          <div class="tl"><div class="tl-t">10 – 25 phút</div><div class="tl-c"><strong>Dev vs Production:</strong> Nhà kho vs cửa hàng. Khi mở cửa → phải tính đến người lạ vào</div></div>
          <div class="tl"><div class="tl-t">25 – 55 phút</div><div class="tl-c"><strong>⚠️ Invisible Risks:</strong> Những thứ AI không nhắc — security, data leaks, edge cases. Thảo luận, không code</div></div>
          <div class="tl"><div class="tl-t">55 – 65 phút</div><div class="tl-c">Break ☕ + Pre-deploy checklist</div></div>
          <div class="tl"><div class="tl-t">65 – 90 phút</div><div class="tl-c"><strong>Deploy thực hành:</strong> GitHub → Vercel → nhận URL thật</div></div>
          <div class="tl"><div class="tl-t">90 – 110 phút</div><div class="tl-c"><strong>Demo cuối khóa:</strong> Mỗi học sinh 5 phút — demo live + giải thích hệ thống</div></div>
          <div class="tl"><div class="tl-t">110 – 120 phút</div><div class="tl-c"><strong>Tổng kết:</strong> Recap 5 mental models. Con đường tiếp theo</div></div>
        </div>
      </div>
    </div>
    <div class="card card-wide">
      <div class="card-header"><span class="card-label">Slide cốt lõi</span><span class="card-tag t-mental">Mental Model</span></div>
      <div class="card-body">
        <div class="mental-model-banner">
          <div class="mm-label">🧠 1 câu học sinh phải nhớ sau buổi này</div>
          <div class="mm-content">"Dev = nhà kho: chỉ mình biết, có thể bừa bộn. Production = cửa hàng thật: ai cũng vào được — phải đảm bảo mọi thứ an toàn trước khi mở cửa."</div>
        </div>
        <div class="diagram">
          <div class="d-row">
            <div class="d-box b-act" style="padding:14px 24px;font-size:.9rem;">💻 localhost<br/><small style="opacity:.7;">Dev — chỉ mình biết</small></div>
            <div class="d-arr" style="font-size:1.5rem;">→</div>
            <div class="d-box b-data" style="padding:14px 24px;font-size:.9rem;">🌐 vercel.app<br/><small style="opacity:.7;">Production — ai cũng vào được</small></div>
          </div>
        </div>
        <div class="warn"><strong>⚠️ Sự khác biệt quan trọng nhất:</strong> Trên localhost, chỉ bạn dùng → ít rủi ro. Trên production, người lạ vào → có thể nhập bất kỳ thứ gì, cố ý phá, tìm lỗ hổng.</div>
      </div>
    </div>
    <!-- ⚠️ INVISIBLE RISKS -->
    <div class="card card-security card-wide">
      <div class="card-header">
        <span class="card-label" style="color:#f87171;">⚠️ Invisible Risks</span>
        <span class="card-tag t-warn">Trước khi Deploy</span>
      </div>
      <div class="card-body">
        <h3 style="color:#fca5a5;">🔒 Những thứ AI không nhắc — nhưng có thể phá hỏng sản phẩm</h3>
        <p style="color:var(--muted);font-size:.87rem;margin-bottom:16px;">AI generate code theo <em>happy path</em> — người dùng làm đúng như mong muốn. Nhưng ngoài đời, người dùng sẽ làm mọi thứ bạn không ngờ tới.</p>
        <div class="security-item">
          <div class="sec-icon">🔑</div>
          <div>
            <div class="sec-title">API Key / Secret bị lộ</div>
            <div class="sec-desc">Nếu dùng API bên thứ 3 (AI, maps, payment...) và paste API key trực tiếp vào code frontend → bất kỳ ai cũng đọc được khi View Source.</div>
            <div class="sec-signal">🔍 Cách phát hiện: GitHub có tool scan tự động. Key bị dùng ngay khi push lên public repo.</div>
            <div class="note" style="margin-top:6px;font-size:.82rem;"><strong>Rule:</strong> API key chỉ sống trên server, không bao giờ trong file JS frontend.</div>
          </div>
        </div>
        <div class="security-item">
          <div class="sec-icon">💉</div>
          <div>
            <div class="sec-title">XSS — Cross-Site Scripting</div>
            <div class="sec-desc">Nếu dùng <code>innerHTML = userInput</code> trực tiếp → người dùng có thể nhập script và code đó chạy trong browser của người khác.</div>
            <div class="sec-signal">🔍 Cách test: Nhập <code>&lt;b&gt;Bold&lt;/b&gt;</code> vào input — nếu text thật sự in đậm → app đang dính XSS.</div>
            <div class="note" style="margin-top:6px;font-size:.82rem;"><strong>Rule:</strong> Dùng <code>textContent</code> thay <code>innerHTML</code> cho user input.</div>
          </div>
        </div>
        <div class="security-item">
          <div class="sec-icon">🔐</div>
          <div>
            <div class="sec-title">Logic phân quyền sai</div>
            <div class="sec-desc">Nếu app có nhiều user — user A có thể đọc/sửa/xóa data của user B không? Lỗi này chỉ phát hiện khi có người thử cố ý.</div>
            <div class="sec-signal">🔍 Cách phát hiện: Đăng nhập 2 tài khoản, kiểm tra có thấy data của nhau không.</div>
          </div>
        </div>
        <div class="security-item">
          <div class="sec-icon">💥</div>
          <div>
            <div class="sec-title">Race Condition &amp; Load cao</div>
            <div class="sec-desc">App chạy tốt khi 1 người dùng — nhưng 1000 người bấm cùng lúc? Database bị overwrite, số liệu sai. Không test được qua browser đơn giản.</div>
            <div class="sec-signal">🔍 Chỉ phát hiện khi có load test hoặc production traffic thật.</div>
          </div>
        </div>
        <div class="security-item">
          <div class="sec-icon">☁️</div>
          <div>
            <div class="sec-title">Không có backup</div>
            <div class="sec-desc">Database, server sập → mất toàn bộ data. Nhiều startup mất năm trời data vì quên setup backup tự động.</div>
            <div class="sec-signal">🔍 Câu hỏi trước deploy: "Nếu server chết ngay hôm nay, data được recover về thời điểm nào gần nhất?"</div>
          </div>
        </div>
        <div class="security-item" style="border-bottom:none;">
          <div class="sec-icon">🌐</div>
          <div>
            <div class="sec-title">CORS &amp; Config môi trường sai</div>
            <div class="sec-desc">Code chạy tốt trên localhost nhưng lỗi trên production vì CORS sai, biến môi trường (PORT, DATABASE_URL) khác nhau.</div>
            <div class="sec-signal">🔍 Hay gặp: Error 403, API không gọi được sau deploy dù hoạt động tốt local.</div>
          </div>
        </div>
        <div class="gv-note" style="margin-top:16px;">
          <span class="gv-label">📝 Ghi chú giảng viên — Cách dạy phần này</span>
          <strong>Không cần dạy cách fix</strong> — chỉ cần học sinh biết những thứ này tồn tại. Mục tiêu là tạo ra <em>mental habit</em>: trước khi deploy, tự hỏi <strong>"Nếu có người muốn phá app này, họ sẽ thử gì đầu tiên?"</strong><br/><br/>
          Đây là câu hỏi mà AI không bao giờ tự hỏi thay bạn — vì AI generate code theo happy path.
        </div>
      </div>
    </div>
    <!-- Checklist -->
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 6</span><span class="card-tag t-tip">Checklist</span></div>
      <div class="card-body">
        <h3>✅ Pre-deploy checklist</h3>
        <ul class="checklist">
          <li>CRUD hoạt động đầy đủ</li>
          <li>Data không mất sau refresh</li>
          <li>Không có lỗi đỏ trong Console (F12)</li>
          <li>UI responsive, không vỡ mobile</li>
          <li>Validation: không nhập rỗng</li>
          <li>Empty state khi danh sách trống</li>
          <li>Không có API key trong code frontend</li>
          <li>Input user được escape (không dùng innerHTML trực tiếp)</li>
          <li>README.md đủ để người khác chạy được</li>
        </ul>
      </div>
    </div>
    <!-- Deploy Vercel -->
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 7</span><span class="card-tag t-flow">Deploy</span></div>
      <div class="card-body">
        <h3>⚡ Deploy lên Vercel — 5 bước</h3>
        <ol class="steps">
          <li>Tạo repo trên <strong>github.com</strong>, push code lên</li>
          <li>Vào <strong>vercel.com</strong>, đăng nhập bằng GitHub</li>
          <li>Click "New Project" → chọn repo</li>
          <li>Vercel auto detect → click <strong>Deploy</strong></li>
          <li>Nhận URL: <code>project-name.vercel.app</code></li>
        </ol>
        <div class="note"><strong>Auto-deploy:</strong> Mỗi lần push code mới lên GitHub → Vercel tự deploy lại. Không cần làm gì thêm.</div>
        <div class="insight">💡 HTTPS miễn phí, custom domain được, free tier đủ dùng cho demo.</div>
      </div>
    </div>
    <!-- README -->
    <div class="card">
      <div class="card-header"><span class="card-label">Slide 8</span><span class="card-tag t-ai">README</span></div>
      <div class="card-body">
        <h3>📝 Dùng AI viết README</h3>
        <div class="prompt-box">
          <div class="prompt-label">💬 Prompt mẫu</div>
          Viết README.md cho Task Manager Web: HTML/CSS/JS thuần, localStorage. Tính năng: thêm/xóa/tick task. Gồm: mô tả ngắn, tính năng, cách chạy, link demo [URL]. Tiếng Việt, ngắn gọn.
        </div>
        <ul class="bullet" style="margin-top:12px;">
          <li>Mô tả project là gì</li>
          <li>Cách clone và chạy local</li>
          <li>Link demo (Vercel URL)</li>
          <li>Tính năng chính</li>
        </ul>
      </div>
    </div>
    <!-- Demo cuối khóa -->
    <div class="card card-practice card-wide">
      <div class="card-header"><span class="card-label" style="color:var(--cyan);">Demo cuối khóa</span><span class="card-tag t-practice">20 phút</span></div>
      <div class="card-body">
        <h3 style="color:var(--cyan);">🎤 Học sinh trình bày — 5 phút/người</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:14px;">
          <div>
            <p style="color:var(--yellow);font-weight:700;font-size:.85rem;margin-bottom:10px;text-transform:uppercase;">🗣️ Phải trình bày được</p>
            <ul class="bullet">
              <li>Demo live trên Vercel URL</li>
              <li>"App này hoạt động theo mô hình gì?" (UI/Logic/Data)</li>
              <li>"Khi user bấm Add, điều gì xảy ra?" (Action → State → UI)</li>
              <li>"Tại sao data không mất khi refresh?"</li>
              <li>"Điều gì sẽ xảy ra nếu deploy cho 1000 người dùng?"</li>
            </ul>
          </div>
          <div>
            <p style="color:var(--cyan);font-weight:700;font-size:.85rem;margin-bottom:10px;text-transform:uppercase;">📊 Tiêu chí đánh giá</p>
            <ul class="checklist">
              <li>App chạy được trên URL thật</li>
              <li>Giải thích được 5 mental models</li>
              <li>Có ý thức về giới hạn &amp; rủi ro</li>
              <li>Biết bước tiếp theo muốn làm gì</li>
            </ul>
          </div>
        </div>
        <div class="gv-note" style="margin-top:16px;">
          <span class="gv-label">📝 Ghi chú giảng viên — Tổng kết khóa</span>
          Recap lại 5 mental models theo thứ tự. Nhấn mạnh: <strong>Đây không phải khóa học code — đây là khóa học tư duy hệ thống có AI hỗ trợ.</strong><br/><br/>
          Học sinh không cần thuộc syntax. Họ cần biết: Web là gì, tương tác là gì, dữ liệu sống ở đâu, code tốt trông như thế nào, và production khác gì với localhost.<br/><br/>
          Bước tiếp theo: API Integration, Authentication, Database thật (khóa nâng cao).
        </div>
      </div>
    </div>
  </div>
</section>
<div class="divider"></div>

<!-- TỔNG KẾT -->
<section style="scroll-margin-top:70px;margin-bottom:60px;">
  <h2 style="font-size:1.3rem;font-weight:800;color:var(--white);margin-bottom:20px;">📊 Tóm tắt 5 mental models</h2>
  <div style="overflow-x:auto;">
    <table style="width:100%;border-collapse:collapse;font-size:.87rem;">
      <thead>
        <tr style="background:rgba(108,99,255,0.15);text-align:left;">
          <th style="padding:12px 16px;color:var(--white);font-weight:700;border-bottom:1px solid rgba(255,255,255,0.08);">Buổi</th>
          <th style="padding:12px 16px;color:var(--white);font-weight:700;border-bottom:1px solid rgba(255,255,255,0.08);">Mental Model</th>
          <th style="padding:12px 16px;color:var(--white);font-weight:700;border-bottom:1px solid rgba(255,255,255,0.08);">Học sinh làm được gì</th>
          <th style="padding:12px 16px;color:var(--white);font-weight:700;border-bottom:1px solid rgba(255,255,255,0.08);">AI dùng để làm gì</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
          <td style="padding:12px 16px;"><span class="pill" style="background:rgba(108,99,255,0.25);color:#c4b5fd;">Buổi 1</span></td>
          <td style="padding:12px 16px;color:var(--white);">Web = UI + Logic + Data</td>
          <td style="padding:12px 16px;color:var(--muted);">Giao diện Task Manager tĩnh</td>
          <td style="padding:12px 16px;color:var(--muted);">Generate HTML/CSS</td>
        </tr>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
          <td style="padding:12px 16px;"><span class="pill" style="background:rgba(247,127,0,0.2);color:#fdba74;">Buổi 2</span></td>
          <td style="padding:12px 16px;color:var(--white);">Action → State → UI</td>
          <td style="padding:12px 16px;color:var(--muted);">CRUD hoạt động hoàn chỉnh</td>
          <td style="padding:12px 16px;color:var(--muted);">Generate logic JS</td>
        </tr>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
          <td style="padding:12px 16px;"><span class="pill" style="background:rgba(6,214,160,0.18);color:#6ee7b7;">Buổi 3</span></td>
          <td style="padding:12px 16px;color:var(--white);">RAM mất khi tắt — cần persistence</td>
          <td style="padding:12px 16px;color:var(--muted);">Data không mất sau refresh</td>
          <td style="padding:12px 16px;color:var(--muted);">Thêm localStorage</td>
        </tr>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
          <td style="padding:12px 16px;"><span class="pill" style="background:rgba(236,72,153,0.18);color:#f9a8d4;">Buổi 4</span></td>
          <td style="padding:12px 16px;color:var(--white);">Code tốt = người đọc được</td>
          <td style="padding:12px 16px;color:var(--muted);">App có UX, code rõ ràng</td>
          <td style="padding:12px 16px;color:var(--muted);">Review &amp; gợi ý cải tiến</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;"><span class="pill" style="background:rgba(239,68,68,0.18);color:#fca5a5;">Buổi 5</span></td>
          <td style="padding:12px 16px;color:var(--white);">Dev ≠ Production + Invisible Risks</td>
          <td style="padding:12px 16px;color:var(--muted);">App live trên internet</td>
          <td style="padding:12px 16px;color:var(--muted);">Viết README, checklist</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
</main>

<footer>
  <p>📘 <strong>Web Builder Foundation – AI-Supported</strong></p>
  <p style="margin-top:6px;opacity:.5;">Tài liệu dành cho giảng viên · 5 Buổi × 2 tiếng · Triết lý: Mental model first, AI làm code, người hiểu hệ thống</p>
</footer>

<script>
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector('nav a[href="#' + e.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.2, rootMargin: '-60px 0px -65% 0px' });
  sections.forEach(s => io.observe(s));
</script>
</body>
</html>`;

fs.writeFileSync('d:/Gi\u00e1o_tr\u00ecnh_d\u1ea1y_web/index.html', html, 'utf8');
console.log('Done:', fs.statSync('d:/Gi\u00e1o_tr\u00ecnh_d\u1ea1y_web/index.html').size, 'bytes');
