/* OS Dashboard — vanilla JS. Everything calls the real API. */
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

async function api(path, opts = {}) {
  const r = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || `HTTP ${r.status}`);
  }
  const ct = r.headers.get("content-type") || "";
  return ct.includes("json") ? r.json() : r.text();
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  $("#toasts").appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

/* Tiny markdown renderer: bold, bullets, headers, code */
function md(src) {
  let h = esc(src);
  h = h.replace(/^### (.*)$/gm, "<h4>$1</h4>").replace(/^## (.*)$/gm, "<h3>$1</h3>");
  h = h.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  const lines = h.split("\n");
  let out = "", inUl = false;
  for (const ln of lines) {
    const m = ln.match(/^\s*[-•] (.*)/);
    if (m) { if (!inUl) { out += "<ul>"; inUl = true; } out += `<li>${m[1]}</li>`; }
    else { if (inUl) { out += "</ul>"; inUl = false; } out += ln.trim() ? `<p>${ln}</p>` : ""; }
  }
  if (inUl) out += "</ul>";
  return out || "<p></p>";
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function relTime(ts) {
  if (!ts) return "never";
  const s = (Date.now() - ts * 1000) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/* tolerant relative time: epoch seconds, epoch ms, or ISO strings */
function relTimeAny(v) {
  if (v == null || v === "") return "";
  let ms = NaN;
  if (typeof v === "number") ms = v < 1e12 ? v * 1000 : v;
  else if (/^\d+(\.\d+)?$/.test(String(v).trim())) { const n = parseFloat(v); ms = n < 1e12 ? n * 1000 : n; }
  else ms = Date.parse(v);
  if (isNaN(ms)) return "";
  const s = (Date.now() - ms) / 1000;
  if (s < 0) return "just now";
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return new Date(ms).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

/* ---------------- theme (light / dark / system) ---------------- */
function applyTheme(opt) {
  let theme = opt;
  if (opt === "system") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
  $("#theme-toggle").textContent = theme === "dark" ? "🌙" : "☀️";
  $$("#theme-seg button").forEach((b) => b.classList.toggle("active", b.dataset.themeOpt === opt));
  try { localStorage.setItem("os-theme", opt); } catch {}
}
$("#theme-toggle").addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme;
  applyTheme(cur === "dark" ? "light" : "dark");
});
$$("#theme-seg button").forEach((b) => b.addEventListener("click", () => applyTheme(b.dataset.themeOpt)));
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  let saved = "light";
  try { saved = localStorage.getItem("os-theme") || "light"; } catch {}
  if (saved === "system") applyTheme("system");
});
(function initTheme() {
  let saved = "light";
  try { saved = localStorage.getItem("os-theme") || "light"; } catch {}
  applyTheme(saved);
})();

/* ---------------- nav ---------------- */
const loaders = {};
$$("#nav .nav-item").forEach((b) =>
  b.addEventListener("click", () => { document.body.classList.remove("nav-open"); switchView(b.dataset.view); })
);
function switchView(name) {
  if (name === "connectors") { openSettings("connectors"); return; }
  $$("#nav .nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  if (loaders[name]) loaders[name]();
}
$("#grid-btn").addEventListener("click", () => openSettings("connectors"));
$(".gear").addEventListener("click", () => openSettings("general"));
$(".avatar-sm").addEventListener("click", () => openSettings("general"));
$("#menu-btn").addEventListener("click", () => document.body.classList.toggle("nav-open"));
$("#nav-scrim").addEventListener("click", () => document.body.classList.remove("nav-open"));

/* ---------------- me / greeting ---------------- */
async function loadMe() {
  try {
    const me = await api("/api/me");
    $("#user-name").textContent = me.name;
    $("#user-mode").textContent = me.mode + " ▾";
    $("#greet-title").textContent = `${me.greeting}, ${me.name} ${me.greeting.includes("morning") ? "☀️" : "👋"}`;
    if (!me.model_ok) toast("Language model unreachable — tool commands still work.");
  } catch { /* offline-ish; keep defaults */ }
}

async function refreshBadges() {
  try {
    const t = await api("/api/tasks");
    if ($("#badge-tasks")) $("#badge-tasks").textContent = t.open || "";
    const w = await api("/api/watchers");
    if ($("#badge-watchers")) $("#badge-watchers").textContent = w.suggestions.length || "";
  } catch {}
  try {
    const com = await api("/api/v1/commitments?status=active");
    if ($("#badge-commitments")) $("#badge-commitments").textContent = com.commitments ? (com.commitments.length || "") : "";
  } catch {}
  try {
    const app = await api("/api/v1/approvals");
    if ($("#badge-approvals")) $("#badge-approvals").textContent = app.pending_approvals ? (app.pending_approvals.length || "") : "";
  } catch {}
  try {
    const ag = await api("/api/v1/agents");
    if ($("#badge-agents")) $("#badge-agents").textContent = ag.agent_runs ? (ag.agent_runs.filter(r => r.status === "RUNNING").length || "") : "";
  } catch {}
}

/* ---------------- chat ---------------- */
const messagesEl = $("#messages");
let currentApproval = null;
const approvalVersions = {};

function hideHero() { $("#hero").style.display = "none"; }
function showHero() { $("#hero").style.display = ""; }
$("#hero-new").addEventListener("click", () => {
  messagesEl.innerHTML = "";
  showHero();
  $("#chat-input").focus();
});

function addUserMsg(text) {
  hideHero();
  const el = document.createElement("div");
  el.className = "msg-user";
  el.innerHTML = `<div><div class="bubble">${esc(text)}</div>
    <div class="ts" style="font-size:11px;color:var(--muted);text-align:right;margin-top:4px">${now()}</div></div>
    <div class="avatar">S</div>`;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addOsMsg() {
  const el = document.createElement("div");
  el.className = "msg-os";
  el.innerHTML = `<div class="msg-os-head"><img src="/static/logo.png" alt=""><b>OS</b><span class="ts">${now()}</span></div>
    <div class="msg-os-body"><span class="typing">thinking…</span></div>`;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return el.querySelector(".msg-os-body");
}

function extractHashtags(text) {
  const m = text.match(/#\w+/g);
  return m ? [...new Set(m)] : [];
}

function draftCardHTML(approval) {
  const tags = extractHashtags(approval.draft);
  const thumbs = ["Just<br>Ship It.", "Progress<br>> Perfection", "Build<br>Ship<br>Learn"].map(
    (t, i) => `<div class="thumb" style="background:linear-gradient(135deg,${["#2b3a67,#e07a5f", "#3d348b,#f6bd60", "#14213d,#fca311"][i]})">${t}</div>`
  ).join("");
  return `<div class="draft-card">
    <div class="draft-head"><span class="li-ico">in</span><b>LinkedIn Post Draft</b>
      <span class="persona-badge">🧬 Persona: Builder ▾</span></div>
    <div class="draft-body">${esc(approval.draft).replace(/\n\n/g, "</p><p>").replace(/^/, "<p>").replace(/$/, "</p>")}</div>
    ${tags.length ? `<div class="hashtags">${tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
    <div class="draft-images">${thumbs}<button class="thumb add" data-addimg>＋ Add image</button></div>
    <div class="feedback-row">
      <button data-fb="I like this writing style — remember it">👍 Like style</button>
      <button data-fb="Not this tone — rewrite the linkedin draft in a different tone">👎 Not this tone</button>
      <button data-fb="Make the linkedin draft shorter">✎ Make shorter</button>
      <button data-fb="Rewrite the linkedin draft with a completely different tone">✦ Different tone</button>
      <button data-fb="">⋯</button>
    </div>
  </div>`;
}

function bindCardButtons(scope) {
  scope.querySelectorAll("[data-fb]").forEach((b) =>
    b.addEventListener("click", () => { if (b.dataset.fb) sendMessage(b.dataset.fb); })
  );
  const add = scope.querySelector("[data-addimg]");
  if (add) add.addEventListener("click", () => $("#file-input").click());
}

function showApprovalRail(approval) {
  currentApproval = approval;
  const v = (approvalVersions[approval.id] = (approvalVersions[approval.id] || 0) + 1);
  $("#approval-ver").textContent = `v1.${v - 1}`;
  $("#approval-card").hidden = false;
}

async function refreshApprovalRail() {
  try {
    const { pending } = await api("/api/approvals");
    if (pending.length) showApprovalRail(pending[pending.length - 1]);
    else { $("#approval-card").hidden = true; currentApproval = null; }
  } catch {}
}

async function sendMessage(text) {
  text = text.trim();
  if (!text) return;
  addUserMsg(text);
  $("#chat-input").value = "";
  const body = addOsMsg();
  let full = "";
  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const parts = buf.split("\n\n");
      buf = parts.pop();
      for (const p of parts) {
        const line = p.trim();
        if (!line.startsWith("data:")) continue;
        const ev = JSON.parse(line.slice(5));
        if (ev.t === "token") { full += ev.d; body.innerHTML = md(full); }
        else if (ev.t === "done") {
          body.innerHTML = md(ev.main || ev.full);
          (ev.notes || []).forEach((n) => toast("Heads up: " + n));
          if (ev.execution) {
            const wrap = document.createElement("div");
            wrap.innerHTML = executionCardHTML(ev.execution, ev.action_approval);
            body.appendChild(wrap.firstChild);
            bindExecutionCard(body, ev);
          }
          if (ev.approval) {
            const card = document.createElement("div");
            card.innerHTML = draftCardHTML(ev.approval);
            body.appendChild(card.firstChild);
            bindCardButtons(body);
            showApprovalRail(ev.approval);
          }
        }
      }
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  } catch (e) {
    body.innerHTML = `<p>Couldn't reach the OS engine: ${esc(e.message)}</p>`;
  }
  messagesEl.scrollTop = messagesEl.scrollHeight;
  refreshBadges();
}

$("#send-btn").addEventListener("click", () => sendMessage($("#chat-input").value));
$("#chat-input").addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(e.target.value); });
$$(".quick-actions button").forEach((b) => b.addEventListener("click", () => {
  const qa = b.dataset.qa;
  if (qa === "newtask") { switchView("tasks"); $("#task-add").hidden = false; $("#task-input").focus(); }
  else if (qa === "draft") { switchView("chat"); sendMessage("Draft a linkedin post about shipping early"); }
  else if (qa === "plan") { switchView("chat"); sendMessage("Plan my day"); }
  else if (qa === "code") { switchView("chat"); $("#chat-input").value = "Analyze this code: "; $("#chat-input").focus(); }
  else { switchView("chat"); $("#chat-input").focus(); }
}));

/* approval rail actions */
$("#approval-close").addEventListener("click", () => { $("#approval-card").hidden = true; });
$("#btn-approve").addEventListener("click", async () => {
  if (!currentApproval) return;
  try {
    const r = await api(`/api/approvals/${currentApproval.id}/approve`, { method: "POST" });
    addOsMsg().innerHTML = md(r.text);
    toast("Approved ✓");
  } catch (e) { toast("Approve failed: " + e.message); }
  refreshApprovalRail(); refreshBadges();
});
$("#btn-discard").addEventListener("click", async () => {
  if (!currentApproval) return;
  try {
    const r = await api(`/api/approvals/${currentApproval.id}/reject`, { method: "POST" });
    addOsMsg().innerHTML = md(r.text);
    toast("Discarded");
  } catch (e) { toast("Discard failed: " + e.message); }
  refreshApprovalRail(); refreshBadges();
});
$("#btn-edit").addEventListener("click", () => {
  if (!currentApproval) return;
  $("#edit-text").value = currentApproval.draft;
  $("#edit-modal").hidden = false;
});
$("#edit-cancel").addEventListener("click", () => { $("#edit-modal").hidden = true; });
$("#edit-save").addEventListener("click", async () => {
  if (!currentApproval) return;
  const draft = $("#edit-text").value.trim();
  if (!draft) return;
  $("#edit-modal").hidden = true;
  try {
    const r = await api(`/api/approvals/${currentApproval.id}/edit`, {
      method: "POST", body: JSON.stringify({ draft }),
    });
    const body = addOsMsg();
    body.innerHTML = md(r.text);
    if (r.approval) {
      const card = document.createElement("div");
      card.innerHTML = draftCardHTML(r.approval);
      body.appendChild(card.firstChild);
      bindCardButtons(body);
      showApprovalRail(r.approval);
    }
    toast("New version created — needs approval again");
  } catch (e) { toast("Edit failed: " + e.message); }
  refreshApprovalRail();
});
$("#li-connect").addEventListener("click", () => openSettings("connectors"));

/* mic + attach */
$("#mic-btn").addEventListener("click", () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { toast("Voice input isn't supported in this browser."); return; }
  const rec = new SR();
  rec.lang = "en-US";
  toast("Listening… speak now");
  rec.onresult = (e) => { $("#chat-input").value = e.results[0][0].transcript; };
  rec.onerror = () => toast("Mic unavailable.");
  rec.start();
});
$("#attach-btn").addEventListener("click", () => $("#file-input").click());
$("#file-input").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const fd = new FormData();
  fd.append("file", f);
  try {
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await r.json();
    $("#chat-input").value += ` [attached: ${j.name}]`;
    toast("Attached " + j.name);
  } catch { toast("Upload failed."); }
  e.target.value = "";
});
/* ---------------- execution cards ---------------- */
function executionCardHTML(exec, approval) {
  const st = exec.status;
  const label = exec.label || exec.action || "Execution";
  let inner = "";
  if (st === "needs_connection") {
    inner = `<div class="exec-card needs-conn">
      <div class="exec-head">🔌 ${esc(exec.connector_name || exec.connector_id || "Connector")} isn't connected yet</div>
      <p class="muted">I can ${esc(label)} as soon as it's connected.</p>
      ${exec.connector_id ? `<p><button class="btn-primary" data-open-conn="${esc(exec.connector_id)}">Connect ${esc(exec.connector_name || exec.connector_id)} →</button></p>` : ""}
    </div>`;
  } else if (st === "needs_info") {
    inner = `<div class="exec-card needs-info">
      <div class="exec-head">⏳ One more thing</div>
      <p>${esc(label)}</p>
    </div>`;
  } else if (st === "error") {
    inner = `<div class="exec-card err">
      <div class="exec-head">❌ ${esc(label)}</div>
      <p class="muted">${esc(exec.error || "Something went wrong.")}</p>
    </div>`;
  } else if (st === "done") {
    const res = exec.result;
    const resText = res && typeof res === "object"
      ? (res.summary || res.text || JSON.stringify(res).slice(0, 300))
      : String(res || "");
    inner = `<div class="exec-card done">
      <div class="exec-head">✅ ${esc(label)}</div>
      ${resText ? `<p>${esc(resText)}</p>` : ""}
    </div>`;
  } else { // pending_approval and anything else
    inner = `<div class="exec-card pending">
      <div class="exec-head">⏳ ${esc(label)}</div>
      ${exec.summary ? `<p class="muted">${esc(exec.summary)}</p>` : ""}
    </div>`;
  }
  const ap = approval ? `
    <div class="exec-card approval">
      <div class="exec-head">🔒 Approval needed</div>
      <div class="aa-row"><span class="muted" style="font-size:12.5px">${esc(approval.summary || approval.label || "")}</span></div>
      <div class="btn-row">
        <button class="btn-primary" data-act-approve="${esc(approval.id)}">Approve &amp; run</button>
        <button class="btn-ghost" data-act-reject="${esc(approval.id)}">Reject</button>
      </div>
    </div>` : "";
  return inner + ap;
}

function bindExecutionCard(scope, ev) {
  scope.querySelectorAll("[data-open-conn]").forEach((b) =>
    b.addEventListener("click", () => { openSettings("connectors"); openConnectorDetail(b.dataset.openConn); })
  );
  scope.querySelectorAll("[data-act-approve]").forEach((b) =>
    b.addEventListener("click", () => approveActionById(b.dataset.actApprove, scope)));
  scope.querySelectorAll("[data-act-reject]").forEach((b) =>
    b.addEventListener("click", () => rejectActionById(b.dataset.actReject, scope)));
}

async function approveActionById(id, scope) {
  try {
    const r = await api(`/api/actions/${id}/approve`, { method: "POST" });
    toast("Approved ✓");
    const body = addOsMsg();
    body.innerHTML = md("Done: " + (r.result && (r.result.summary || r.result.text) || "approved action ran."));
  } catch (e) { toast("Approve failed: " + e.message); }
  refreshApprovalRail(); refreshBadges(); refreshPerms();
}
async function rejectActionById(id, scope) {
  try {
    await api(`/api/actions/${id}/reject`, { method: "POST" });
    toast("Rejected — nothing ran.");
  } catch (e) { toast("Reject failed: " + e.message); }
  refreshApprovalRail(); refreshBadges(); refreshPerms();
}

/* ---------------- tasks ---------------- */
let taskTab = "all", allTasks = [];
loaders.tasks = loadTasks;
async function loadTasks() {
  try { allTasks = (await api("/api/tasks")).tasks; } catch { allTasks = []; }
  renderTasks();
}
function taskDone(t) { return t.status === "DONE" || t.status === "completed"; }
function renderTasks() {
  const list = $("#task-list");
  let rows = allTasks;
  if (taskTab === "completed") rows = allTasks.filter(taskDone);
  else if (taskTab !== "all") rows = allTasks.filter((t) => !taskDone(t));
  list.innerHTML = rows.length ? rows.map((t) => {
    const done = taskDone(t);
    return `
    <div class="row-card ${done ? "done" : ""}">
      <button class="task-check ${done ? "done" : ""}" data-task-toggle="${t.id}" aria-label="toggle">${done ? "✓" : ""}</button>
      <span class="grow">${esc(t.title)}</span>
      <span class="tag ${done ? "done" : "pending"}">${done ? "done" : "open"}</span>
      <button class="mini-btn" data-task-del="${t.id}">Remove</button>
    </div>`;}).join("")
    : `<div class="empty">${taskTab === "completed" ? "Nothing completed yet — your wins will land here." : taskTab === "upcoming" ? "No upcoming tasks. Due dates aren't tracked yet — open tasks land here and in Today." : "No tasks. Hit “＋ New Task” to add your first one."}</div>`;
  list.querySelectorAll("[data-task-toggle]").forEach((b) => b.addEventListener("click", async () => {
    const t = allTasks.find((x) => String(x.id) === b.dataset.taskToggle);
    await api(`/api/tasks/${b.dataset.taskToggle}`, {
      method: "PUT", body: JSON.stringify({ status: t && taskDone(t) ? "PENDING" : "DONE" }),
    }).catch((e) => toast("Update failed: " + e.message));
    loadTasks(); refreshBadges();
  }));
  list.querySelectorAll("[data-task-del]").forEach((b) => b.addEventListener("click", async () => {
    await api(`/api/tasks/${b.dataset.taskDel}`, { method: "DELETE" }).catch((e) => toast("Delete failed: " + e.message));
    loadTasks(); refreshBadges();
  }));
}
$$("#task-tabs .tab").forEach((b) => b.addEventListener("click", () => {
  taskTab = b.dataset.tab;
  $$("#task-tabs .tab").forEach((x) => x.classList.toggle("active", x === b));
  renderTasks();
}));
$("#task-new-btn").addEventListener("click", () => {
  $("#task-add").hidden = !$("#task-add").hidden;
  if (!$("#task-add").hidden) $("#task-input").focus();
});
async function addTask() {
  const title = $("#task-input").value.trim();
  if (!title) return;
  try {
    await api("/api/tasks", { method: "POST", body: JSON.stringify({ title }) });
    $("#task-input").value = "";
    $("#task-add").hidden = true;
    toast("Task added");
  } catch (e) { toast("Add failed: " + e.message); }
  loadTasks(); refreshBadges();
}
$("#task-add-btn").addEventListener("click", addTask);
$("#task-input").addEventListener("keydown", (e) => { if (e.key === "Enter") addTask(); });

/* ---------------- calendar ---------------- */
let calTab = "week", calCursor = new Date(), calEvents = [], calConnected = false;
loaders.calendar = loadCalendar;
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function calKeyLocal(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function parseEvDate(e) { const d = new Date(e.start || e.date); return isNaN(d) ? null : d; }
function evTime(e) { const d = new Date(e.start); return isNaN(d) ? "" : d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
async function loadCalendar() {
  try {
    const r = await api("/api/calendar");
    calConnected = r.connected;
    calEvents = r.events || [];
  } catch { calConnected = false; calEvents = []; }
  renderCalendar();
}
function renderCalendar() {
  const wrap = $("#calendar-body");
  if (!calConnected) {
    wrap.innerHTML = `<div class="empty">Calendar isn't connected yet — nothing to show here. <button class="btn-primary" id="cal-connect">Connect Google Calendar</button></div>`;
    $("#cal-connect").addEventListener("click", () => openConnectorDetail("google_calendar"));
    return;
  }
  const byDate = {};
  calEvents.forEach((e) => {
    const d = parseEvDate(e);
    if (!d) return;
    const k = calKeyLocal(d);
    (byDate[k] = byDate[k] || []).push(e);
  });
  if (calTab === "day") {
    const k = calKeyLocal(calCursor);
    const evs = (byDate[k] || []).sort((a, b) => String(a.start).localeCompare(String(b.start)));
    $("#cal-month").textContent = calCursor.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
    wrap.innerHTML = evs.length ? `<div class="list">` + evs.map((e, i) => `
      <div class="row-card"><div class="cal-event ev-c${i % 5}" style="margin:0;min-width:160px"><b>${esc(e.title)}</b><span class="ev-time">${esc(evTime(e))}</span></div>
      <span class="grow muted">${e.end ? "ends " + esc(evTime({ start: e.end })) : ""}</span></div>`).join("") + `</div>`
      : `<div class="empty">Nothing scheduled for this day.</div>`;
  } else if (calTab === "week") {
    const start = new Date(calCursor);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    $("#cal-month").textContent = `${start.toLocaleDateString([], { month: "long", day: "numeric" })} – ${new Date(start.getTime() + 6 * 864e5).toLocaleDateString([], { month: "long", day: "numeric" })}`;
    const todayK = calKeyLocal(new Date());
    wrap.innerHTML = `<div class="week-strip">` + Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(d.getDate() + i);
      const k = calKeyLocal(d);
      const evs = byDate[k] || [];
      return `<div class="day-col ${k === todayK ? "today" : ""}">
        <div class="day-name">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</div>
        <div class="day-num">${d.getDate()}</div>
        ${evs.slice(0, 4).map((e, j) => `<div class="cal-event ev-c${j % 5}"><b>${esc(e.title)}</b><span class="ev-time">${esc(evTime(e))}</span></div>`).join("")}
        ${evs.length > 4 ? `<div class="muted">+${evs.length - 4} more</div>` : ""}
      </div>`;
    }).join("") + `</div>`;
  } else {
    const y = calCursor.getFullYear(), m = calCursor.getMonth();
    $("#cal-month").textContent = `${MONTHS[m]} ${y}`;
    const first = new Date(y, m, 1);
    const lead = (first.getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    const days = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d));
    const todayK = calKeyLocal(new Date());
    wrap.innerHTML = `<div class="month-grid">` + cells.map((d) => {
      if (!d) return `<div class="month-cell dim"></div>`;
      const k = calKeyLocal(d);
      const n = (byDate[k] || []).length;
      return `<div class="month-cell ${k === todayK ? "today" : ""}"><b>${d.getDate()}</b><div>${n ? `<span class="ev-dot"></span><span class="muted">${n} event${n > 1 ? "s" : ""}</span>` : ""}</div></div>`;
    }).join("") + `</div>`;
  }
}
$$("#cal-tabs .tab").forEach((b) => b.addEventListener("click", () => {
  calTab = b.dataset.tab;
  $$("#cal-tabs .tab").forEach((x) => x.classList.toggle("active", x === b));
  renderCalendar();
}));
$("#cal-prev").addEventListener("click", () => {
  if (calTab === "month") calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() - 1, 1);
  else calCursor.setDate(calCursor.getDate() - 7);
  renderCalendar();
});
$("#cal-next").addEventListener("click", () => {
  if (calTab === "month") calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() + 1, 1);
  else calCursor.setDate(calCursor.getDate() + 7);
  renderCalendar();
});
$("#cal-add").addEventListener("click", () => {
  switchView("chat");
  $("#chat-input").value = "Schedule ";
  $("#chat-input").focus();
});

/* ---------------- projects ---------------- */
const PROJ_ICONS = [["💻","blue"],["✒️","purple"],["🔍","green"],["🎨","pink"],["⚡","orange"]];
let allProjects = [];
loaders.projects = loadProjects;
async function loadProjects() {
  try { allProjects = (await api("/api/projects")).projects || []; } catch { allProjects = []; }
  renderProjects();
}
function renderProjects() {
  const g = $("#project-grid");
  g.innerHTML = allProjects.length ? allProjects.map((p, i) => {
    const [ico, cls] = PROJ_ICONS[i % PROJ_ICONS.length];
    return `<div class="proj-card">
      <button class="proj-menu" data-proj-ask="${esc(p.title)}" aria-label="options">⋯</button>
      <div class="proj-ico ${cls}">${ico}</div>
      <h4>${esc(p.title)}</h4>
      <p>${esc(p.description || "")}</p>
    </div>`;
  }).join("") : `<div class="empty">No projects yet. Start one from the chat.</div>`;
  g.querySelectorAll("[data-proj-ask]").forEach((b) => b.addEventListener("click", () => {
    switchView("chat");
    sendMessage(`Tell me about my project: ${b.dataset.projAsk}`);
  }));
}
$("#proj-new").addEventListener("click", () => {
  switchView("chat");
  $("#chat-input").value = "Help me start a new project: ";
  $("#chat-input").focus();
});

/* ---------------- memory ---------------- */
let memTab = "all", allMemories = [];
loaders.memory = loadMemories;
async function loadMemories() {
  try { allMemories = (await api("/api/memory")).memories; } catch { allMemories = []; }
  renderMemories();
}
function renderMemories() {
  const list = $("#memory-list");
  const rows = memTab === "all" ? allMemories : allMemories.filter((m) =>
    String(m.memory_type || m.type || m.key || "").toLowerCase().includes(memTab));
  list.innerHTML = rows.length ? rows.map((m) => `
    <div class="mem-row">
      <div class="mem-ico">🧠</div>
      <div class="grow"><b>${esc(m.key)}</b><div style="font-size:13px;color:var(--ink-2)">${esc(String(m.value)).slice(0, 120)}</div></div>
      <span class="mem-time">${esc(relTimeAny(m.updated_at))}</span>
      <button class="mini-btn" data-mem-del="${esc(m.key)}">Forget</button>
    </div>`).join("") : `<div class="empty">No memories here yet. Things you ask me to remember will land here.</div>`;
  list.querySelectorAll("[data-mem-del]").forEach((b) => b.addEventListener("click", async () => {
    await api(`/api/memory/${encodeURIComponent(b.dataset.memDel)}`, { method: "DELETE" }).catch((e) => toast("Forget failed: " + e.message));
    toast("Forgotten");
    loadMemories();
  }));
}
$$("#memory-tabs .tab").forEach((b) => b.addEventListener("click", () => {
  memTab = b.dataset.tab;
  $$("#memory-tabs .tab").forEach((x) => x.classList.toggle("active", x === b));
  renderMemories();
}));

/* ---------------- skills ---------------- */
let skillTab = "all", allSkills = [];
loaders.skills = loadSkills;
async function loadSkills() {
  try { allSkills = (await api("/api/skills")).skills; } catch { allSkills = []; }
  renderSkills();
}
function skillIcon(s) {
  const c = String(s.category || "").toLowerCase();
  if (c.includes("dev")) return ["💻", "blue"];
  if (c.includes("content")) return ["✒️", "purple"];
  if (c.includes("research")) return ["🔍", "green"];
  if (c.includes("auto")) return ["⚡", "orange"];
  return ["🛠️", "pink"];
}
function renderSkills() {
  const g = $("#skill-grid");
  const rows = skillTab === "all" ? allSkills : allSkills.filter((s) =>
    String(s.category || "").toLowerCase().includes(skillTab));
  g.innerHTML = rows.length ? rows.map((s) => {
    const [ico, cls] = skillIcon(s);
    return `<button class="skill-card" data-skill="${esc(s.name)}">
      <span class="proj-menu" aria-label="options">⋯</span>
      <div class="skill-ico ${cls}">${ico}</div>
      <h4>${esc(s.name)}</h4>
      <p>${esc(s.description || "")}</p>
      <div class="skill-meta"><span class="pill">${esc(s.category || "general")}</span>${s.enabled ? `<span class="pill pill-ok">enabled</span>` : ""}</div>
    </button>`;
  }).join("") : `<div class="empty">No skills in this lane yet.</div>`;
  g.querySelectorAll("[data-skill]").forEach((b) => b.addEventListener("click", () => {
    switchView("chat");
    sendMessage(`Use the ${b.dataset.skill} skill`);
  }));
}
$$("#skill-tabs .tab").forEach((b) => b.addEventListener("click", () => {
  skillTab = b.dataset.tab;
  $$("#skill-tabs .tab").forEach((x) => x.classList.toggle("active", x === b));
  renderSkills();
}));

/* ---------------- watchers ---------------- */
const WATCH_ICONS = { gmail: ["📧", "red"], gcal: ["📅", "blue"], weather: ["🌤️", "orange"], github: ["🐙", "purple"], telegram: ["✈️", "blue"] };
loaders.watchers = loadWatchers;
async function loadWatchers() {
  let list = [];
  try { list = (await api("/api/watchers")).suggestions || []; } catch {}
  const wrap = $("#watcher-list");
  wrap.innerHTML = list.length ? list.map((s) => {
    const [ico, cls] = WATCH_ICONS[s.kind] || ["🔔", "purple"];
    return `<div class="watcher-row">
      <div class="watcher-ico ${cls}">${ico}</div>
      <div class="grow"><b>${esc(s.title)}</b><div class="muted">${esc(s.text)}</div></div>
      <button class="link-btn" data-dismiss="${s.id}">Dismiss</button>
    </div>`;
  }).join("") : `<div class="empty">No suggestions right now — watchers will nudge you here when something needs attention.</div>`;
  wrap.querySelectorAll("[data-dismiss]").forEach((b) => b.addEventListener("click", async () => {
    await api(`/api/watchers/${b.dataset.dismiss}`, { method: "DELETE" }).catch(() => {});
    loadWatchers(); refreshBadges();
  }));
}

/* ---------------- files ---------------- */
let fileTab = "all", allFiles = [], filesRoot = "";
loaders.files = loadFiles;
async function loadFiles() {
  try {
    const r = await api("/api/files");
    allFiles = r.files || [];
    filesRoot = r.root || "";
  } catch { allFiles = []; }
  $("#files-root").textContent = filesRoot ? `Workspace: ${filesRoot}` : "";
  renderFiles();
}
function fileName(f) { const p = f.path || f.name || ""; return p.split("/").pop(); }
function fileCat(f) {
  const n = fileName(f).toLowerCase();
  if (/\.(png|jpe?g|gif|webp|svg)$/.test(n)) return "images";
  if (/\.(pdf|docx?|txt|md|xlsx?|csv)$/.test(n)) return "docs";
  return "other";
}
function fileIcon(f) {
  const c = fileCat(f), n = fileName(f).toLowerCase();
  if (c === "images") return ["🖼️", "pink"];
  if (/\.pdf$/.test(n)) return ["📕", "red"];
  if (/\.(xlsx?|csv)$/.test(n)) return ["📗", "green"];
  return ["📄", "blue"];
}
function fmtSize(b) {
  if (!b) return "";
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}
function renderFiles() {
  const g = $("#file-list");
  const rows = fileTab === "all" ? allFiles : allFiles.filter((f) => fileCat(f) === fileTab);
  g.innerHTML = rows.length ? rows.map((f) => {
    const [ico, cls] = fileIcon(f);
    const name = fileName(f);
    return `<div class="file-card">
      <div class="file-ico ${cls}">${ico}</div>
      <b title="${esc(f.path || "")}">${esc(name)}</b>
      <span class="muted">${f.type === "dir" ? "folder" : esc(fmtSize(f.size))}</span>
      ${f.type !== "dir" ? `<a class="mini-btn" style="display:inline-block;text-decoration:none" href="/api/files/download?path=${encodeURIComponent(f.path)}" download="${esc(name)}">Download</a>` : ""}
    </div>`;
  }).join("") : `<div class="empty">No files here yet. Upload something with the button above.</div>`;
}
$$("#file-tabs .tab").forEach((b) => b.addEventListener("click", () => {
  fileTab = b.dataset.tab;
  $$("#file-tabs .tab").forEach((x) => x.classList.toggle("active", x === b));
  renderFiles();
}));
$("#files-upload").addEventListener("click", () => $("#upload-input").click());
$("#upload-input").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const fd = new FormData();
  fd.append("file", f);
  try {
    await fetch("/api/upload", { method: "POST", body: fd });
    toast("Uploaded " + f.name);
    loadFiles();
  } catch { toast("Upload failed."); }
  e.target.value = "";
});

/* ---------------- analytics ---------------- */
loaders.analytics = loadAnalytics;
async function loadAnalytics() {
  let a = {};
  try { a = await api("/api/analytics"); } catch {}
  const tiles = [
    ["📅", "blue", a.events ?? 0, "Events logged"],
    ["✅", "green", a.tasks_done ?? 0, "Tasks done"],
    ["🔔", "purple", a.approvals_approved ?? 0, "Approvals granted"],
    ["🧠", "orange", a.memories ?? 0, "Memories stored"],
  ];
  $("#analytics-tiles").innerHTML = tiles.map(([ico, cls, num, lbl]) => `
    <div class="tile"><div class="tile-ico ${cls}">${ico}</div>
    <div><div class="tile-num">${esc(num)}</div><div class="tile-lbl">${esc(lbl)}</div></div></div>`).join("");
  const keys = ["events", "tasks_open", "tasks_done", "memories", "approvals_approved"];
  const vals = keys.map((k) => a[k] ?? 0);
  const max = Math.max(1, ...vals);
  $("#chart-bars").innerHTML = `<div class="bars">` + keys.map((k, i) => `
    <div class="bar-col"><div class="bar" style="height:${Math.round((vals[i] / max) * 100)}%"></div>
    <div class="bar-lbl">${k.split("_")[0]}</div></div>`).join("") + `</div>`;
  const open = a.tasks_open ?? 0, done = a.tasks_done ?? 0, tot = Math.max(1, open + done);
  const pct = Math.round((done / tot) * 100);
  const circ = 2 * Math.PI * 54;
  $("#chart-donut").innerHTML = `<div class="donut-wrap">
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r="54" fill="none" stroke="var(--line)" stroke-width="14"/>
      <circle cx="65" cy="65" r="54" fill="none" stroke="url(#dg)" stroke-width="14" stroke-linecap="round"
        stroke-dasharray="${(pct / 100) * circ} ${circ}" transform="rotate(-90 65 65)"/>
      <defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#6d5ef0"/></linearGradient></defs>
      <text x="65" y="72" text-anchor="middle" font-size="20" font-weight="800" fill="var(--ink)">${pct}%</text>
    </svg>
    <div class="donut-legend">
      <div><span class="legend-dot" style="background:#8b5cf6"></span>Completed — ${done}</div>
      <div><span class="legend-dot" style="background:var(--line)"></span>Open — ${open}</div>
    </div></div>`;
}

/* ---------------- settings + connectors ---------------- */
function openSettings(tab = "general") {
  $("#settings-modal").hidden = false;
  switchSettingsTab(tab);
}
$("#settings-close").addEventListener("click", () => { $("#settings-modal").hidden = true; });
$("#settings-modal").addEventListener("click", (e) => { if (e.target === $("#settings-modal")) $("#settings-modal").hidden = true; });
$$(".sm-nav-item").forEach((b) => b.addEventListener("click", () => switchSettingsTab(b.dataset.dtab)));
function switchSettingsTab(name) {
  $$(".sm-nav-item").forEach((b) => b.classList.toggle("active", b.dataset.dtab === name));
  $$(".dtab").forEach((t) => t.classList.toggle("active", t.id === `dtab-${name}`));
  if (name === "connectors") loadConnectors();
  if (name === "general") loadGeneral();
}
async function loadGeneral() {
  try {
    const me = await api("/api/me");
    $("#set-model").textContent = me.model ? `${me.model} · local` : "Local";
    const pill = $("#set-model-pill");
    pill.textContent = me.model_ok ? "online" : "offline";
    pill.className = "pill " + (me.model_ok ? "pill-ok" : "pill-err");
  } catch {}
}
$("#revoke-all").addEventListener("click", async () => {
  if (!confirm("Disconnect every connector and delete all stored credentials?")) return;
  try {
    const { connectors } = await api("/api/connectors");
    for (const c of connectors.filter((c) => c.state !== "available")) {
      await api(`/api/connectors/${c.id}/revoke`, { method: "DELETE" }).catch(() => {});
    }
    toast("Everything revoked");
  } catch (e) { toast("Revoke failed: " + e.message); }
  loadConnectors($("#conn-search").value);
});

let connCatalog = [];
async function loadConnectors(q = "") {
  $("#conn-list-view").hidden = false;
  $("#conn-detail-view").hidden = true;
  try {
    connCatalog = (await api("/api/connectors")).connectors;
  } catch { connCatalog = []; }
  const filt = (c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.tagline.toLowerCase().includes(q.toLowerCase());
  const conn = connCatalog.filter((c) => c.state === "connected" && filt(c));
  const avail = connCatalog.filter((c) => c.state !== "connected" && filt(c));
  const row = (c) => `
    <button class="conn-row" data-conn="${esc(c.id)}">
      <div class="conn-ico" style="background:${c.color}">${c.icon}</div>
      <div class="conn-meta"><b>${esc(c.name)}</b><p>${esc(c.tagline)}</p></div>
      <div class="conn-right">
        ${c.state === "connected" ? `<span class="pill pill-ok">Connected</span>` : `<span class="pill">Available</span>`}
        <span class="conn-chev">›</span>
      </div>
    </button>`;
  $("#conn-connected").innerHTML = conn.length ? conn.map(row).join("")
    : `<div class="conn-empty">Nothing connected yet. Grant access below to unlock automations.</div>`;
  $("#conn-available").innerHTML = avail.length ? avail.map(row).join("")
    : `<div class="conn-empty">No matches.</div>`;
  $$("#dtab-connectors [data-conn]").forEach((b) =>
    b.addEventListener("click", () => openConnectorDetail(b.dataset.conn))
  );
}
$("#conn-search").addEventListener("input", (e) => loadConnectors(e.target.value));
$("#conn-back").addEventListener("click", () => {
  $("#conn-detail-view").hidden = true;
  $("#conn-list-view").hidden = false;
});

async function openConnectorDetail(id) {
  const c = await api(`/api/connectors/${id}`).catch((e) => { toast("Failed to load: " + e.message); return null; });
  if (!c) return;
  $("#conn-list-view").hidden = true;
  const view = $("#conn-detail-view");
  view.hidden = false;
  const d = $("#conn-detail");
  const st = c.state;
  const pill = st === "connected" ? `<span class="pill pill-ok">Connected</span>`
    : st === "granted" ? `<span class="pill pill-granted">Permission granted</span>`
    : st === "setup_error" ? `<span class="pill pill-err">Setup error</span>`
    : st === "denied" ? `<span class="pill">Denied</span>`
    : `<span class="pill">Available</span>`;
  let statusNote = "";
  if (st === "connected") statusNote = `<div class="callout ok">Connected — reads run now, writes ask for your approval first.</div>`;
  else if (st === "granted" && !c.has_credentials) statusNote = `<div class="callout warn">Permission granted. Add your credentials below to go live.</div>`;
  else if (st === "granted" && c.has_credentials && c.needs_oauth) statusNote = `<div class="callout warn">Credentials saved. Press “Connect with Google” to sign in.</div>`;
  else if (st === "granted") statusNote = `<div class="callout warn">Credentials saved. Run a health check to verify.</div>`;
  else if (st === "setup_error") statusNote = `<div class="callout err">The last health check failed: ${esc(c.health_msg || "unknown error")}. Re-enter credentials or reconnect.</div>`;
  else if (st === "denied") statusNote = `<div class="callout warn">Permission denied. Grant it again to reconnect.</div>`;

  const scopes = (c.scopes || []).map((s) => `<li>${esc(s)}</li>`).join("");
  const setupSteps = (c.setup_steps || []).map((s, i) => `<li>${i + 1}. ${esc(s)}</li>`).join("");
  const credFields = (c.cred_fields || []).map((f) => `
    <label>${esc(f.label || f.key)}<input type="${f.secret ? "password" : "text"}" data-cred="${esc(f.key)}" placeholder="${esc(f.placeholder || "")}" autocomplete="off"></label>`).join("");
  const defaults = (c.defaults || []).map((f) => `
    <label>${esc(f.label || f.key)}<input type="text" data-def="${esc(f.key)}" value="${esc(f.value || "")}" placeholder="${esc(f.placeholder || "")}"></label>`).join("");
  const isOAuth = c.auth_kind === "google_oauth" || c.auth_kind === "microsoft_oauth";
  const provider = c.auth_kind === "microsoft_oauth" ? "Microsoft" : "Google";
  const gLogo = `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>`;
  const msLogo = `<svg width="18" height="18" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10.5v10.5H1z"/><path fill="#81bc06" d="M12.5 1H23v10.5H12.5z"/><path fill="#05a6f0" d="M1 12.5h10.5V23H1z"/><path fill="#ffba08" d="M12.5 12.5H23V23H12.5z"/></svg>`;
  const logo = c.auth_kind === "microsoft_oauth" ? msLogo : gLogo;
  const authHTML = isOAuth
    ? `${c.needs_oauth
      ? `<div class="btn-row"><button class="btn-oauth" id="cd-oauth">${logo}<span>Sign in with ${provider}</span></button></div>
         <p class="muted small" style="margin-top:8px">OAuth signs you in at ${provider} — OS only stores the tokens, encrypted on this machine.</p>`
      : `<div class="callout ok">Signed in with ${provider} ✓</div>
         <div class="btn-row" style="margin-top:8px"><button class="btn-ghost" id="cd-oauth-again">Switch ${provider} account</button></div>`}
       ${credFields ? `<h4 style="margin:14px 0 6px">OAuth app credentials</h4><div class="cred-form">${credFields}
       <div class="btn-row"><button class="btn-primary" id="cd-save-creds">Save credentials</button></div></div>` : ""}`
    : `<div class="cred-form">${credFields || '<p class="muted">No credentials needed for this connector.</p>'}
       ${credFields ? `<div class="btn-row"><button class="btn-primary" id="cd-save-creds">Save credentials</button></div>` : ""}</div>`;
  const grantBtn = (st === "available" || st === "denied") ? `<button class="btn-primary" id="cd-connect">Grant permission</button>` : "";
  const revokeSmall = st === "granted" ? `<button class="btn-ghost" id="cd-revoke">Revoke permission</button>` : "";
  const tryHTML = (c.try_it || []).map((t) => `<button class="try-chip" data-try="${esc(t)}">${esc(t)}</button>`).join("");
  const actionsHTML = (c.actions || []).map((a) => `<li>🔧 <b>${esc(a.label || a.name)}</b> <span class="muted">${esc(a.description || "")}</span></li>`).join("");

  d.innerHTML = `
    <div class="cd-head">
      <div class="conn-ico lg" style="background:${c.color}">${c.icon}</div>
      <div class="grow"><h3>${esc(c.name)}</h3><p class="muted">${esc(c.tagline)}</p></div>
      ${pill}
    </div>
    ${statusNote}
    ${c.note ? `<div class="callout ok">${esc(c.note)}</div>` : ""}
    <div class="cd-tabs">
      <button class="cd-tab active" data-cdtab="permissions">Permissions</button>
      <button class="cd-tab" data-cdtab="setup">Setup</button>
      <button class="cd-tab" data-cdtab="defaults">Defaults</button>
      <button class="cd-tab" data-cdtab="try">Try it</button>
    </div>
    <div class="cd-panel active" data-cdpanel="permissions">
      <h4 style="margin:6px 0">What this connector can do</h4>
      <ul class="scope-list">${scopes || '<li class="muted">No special permissions listed.</li>'}</ul>
      ${grantBtn}${revokeSmall}
    </div>
    <div class="cd-panel" data-cdpanel="setup">
      <h4 style="margin:6px 0">Setup</h4>
      <ol class="setup-steps">${setupSteps || "<li>Follow the connector's own setup docs, then add credentials below.</li>"}</ol>
      ${authHTML}
      <div class="btn-row"><button class="btn-ghost" id="cd-test">🧪 Run health check</button></div>
    </div>
    <div class="cd-panel" data-cdpanel="defaults">
      <h4 style="margin:6px 0">Defaults</h4>
      ${defaults ? `<div class="cred-form">${defaults}<div class="btn-row"><button class="btn-primary" id="cd-save-defaults">Save defaults</button></div></div>`
        : `<p class="muted">No defaults for this connector.</p>`}
    </div>
    <div class="cd-panel" data-cdpanel="try">
      <h4 style="margin:6px 0">Try it</h4>
      <p class="muted small">Reads run now. Anything that writes asks for approval first.</p>
      <div class="try-list">${tryHTML || '<span class="muted">No quick examples for this connector.</span>'}</div>
      ${actionsHTML ? `<h4 style="margin:14px 0 4px">Available actions</h4><ul class="action-list">${actionsHTML}</ul>` : ""}
    </div>
    ${st !== "available" ? `<button class="revoke-big" id="cd-revoke-big">Disconnect ${esc(c.name)}</button>` : ""}
  `;
  d.querySelectorAll(".cd-tab").forEach((t) => t.addEventListener("click", () => {
    d.querySelectorAll(".cd-tab").forEach((x) => x.classList.toggle("active", x === t));
    d.querySelectorAll(".cd-panel").forEach((p) => p.classList.toggle("active", p.dataset.cdpanel === t.dataset.cdtab));
  }));
  d.querySelector("#cd-connect")?.addEventListener("click", async () => {
    await api(`/api/connectors/${id}/grant`, { method: "POST" }).catch((e) => toast("Grant failed: " + e.message));
    toast("Permission granted — add credentials in Setup");
    openConnectorDetail(id); loadConnectors($("#conn-search").value);
  });
  const doRevoke = async () => {
    if (!confirm(`Disconnect ${c.name}?`)) return;
    await api(`/api/connectors/${id}/revoke`, { method: "POST" }).catch((e) => toast("Revoke failed: " + e.message));
    toast("Disconnected");
    openConnectorDetail(id); loadConnectors($("#conn-search").value); refreshBadges();
  };
  d.querySelector("#cd-revoke")?.addEventListener("click", doRevoke);
  d.querySelector("#cd-revoke-big")?.addEventListener("click", doRevoke);
  const doOAuth = async () => {
    try {
      const r = await api(`/api/connectors/${id}/oauth/start`);
      if (r.url) startOAuth(id, r.url, provider);
      else toast(r.detail || `OAuth not ready — save your ${provider} Client ID and Secret first.`);
    } catch (e) { toast("OAuth failed to start: " + e.message); }
  };
  d.querySelector("#cd-oauth")?.addEventListener("click", doOAuth);
  d.querySelector("#cd-oauth-again")?.addEventListener("click", doOAuth);
  d.querySelector("#cd-save-creds")?.addEventListener("click", async () => {
    const vals = {};
    d.querySelectorAll("[data-cred]").forEach((i) => { vals[i.dataset.cred] = i.value; });
    try {
      await api(`/api/connectors/${id}/credentials`, { method: "POST", body: JSON.stringify({ label: c.name, fields: vals }) });
      toast("Credentials saved — running health check…");
    } catch (e) { toast("Save failed: " + e.message); return; }
    openConnectorDetail(id); loadConnectors($("#conn-search").value);
  });
  d.querySelector("#cd-test")?.addEventListener("click", async () => {
    try {
      const r = await api(`/api/connectors/${id}/test`, { method: "POST" });
      const msg = r.status && r.status.health_msg;
      toast(r.ok ? "Health check passed ✓" : "Health check failed: " + (msg || "unknown"));
    } catch (e) { toast("Health check failed: " + e.message); }
    openConnectorDetail(id); loadConnectors($("#conn-search").value);
  });
  d.querySelector("#cd-save-defaults")?.addEventListener("click", async () => {
    const vals = {};
    d.querySelectorAll("[data-def]").forEach((i) => { if (i.value) vals[i.dataset.def] = i.value; });
    await api(`/api/connectors/${id}/settings`, { method: "POST", body: JSON.stringify({ settings: vals }) }).catch((e) => toast("Save failed: " + e.message));
    toast("Defaults saved");
  });
  d.querySelectorAll("[data-try]").forEach((b) => b.addEventListener("click", () => {
    $("#settings-modal").hidden = true;
    switchView("chat");
    sendMessage(b.dataset.try);
  }));
}

function startOAuth(id, url, provider) {
  const w = window.open(url, "oauth", "width=520,height=640");
  const onMsg = (e) => {
    if (e.data && (e.data.oauth_done || e.data.type === "oauth-done")) {
      window.removeEventListener("message", onMsg);
      w && w.close();
      toast(`${provider || "Google"} connected ✓`);
      openConnectorDetail(id); loadConnectors($("#conn-search").value);
    }
  };
  window.addEventListener("message", onMsg);
}

/* ---------------- permission modal (connector write approvals) ---------------- */
let pendingPerms = [];
async function refreshPerms() {
  try { pendingPerms = (await api("/api/actions/pending")).pending; } catch { pendingPerms = []; }
  const row = $("#perm-row");
  if (pendingPerms.length) {
    row.hidden = false;
    $("#perm-count").textContent = `${pendingPerms.length} waiting`;
  } else row.hidden = true;
}
$("#perm-banner").addEventListener("click", async () => {
  if (!pendingPerms.length) return;
  const p = pendingPerms[0];
  let scopes = [];
  try { scopes = (await api(`/api/connectors/${p.connector_id}`)).scopes || []; } catch {}
  $("#perm-title").textContent = `${p.connector_name || p.connector_id} — ${p.label}`;
  $("#perm-sub").textContent = p.summary || "OS is asking your permission. It will only use what you allow, and you can revoke anytime.";
  $("#perm-scopes").innerHTML = (scopes.length ? scopes : Object.entries(p.params || {}).map(([k, v]) => `${k}: ${v}`))
    .map((s) => `<label><input type="checkbox" checked disabled> ${esc(s)}</label>`).join("");
  $("#perm-modal").hidden = false;
});
$("#perm-deny").addEventListener("click", () => { $("#perm-modal").hidden = true; });
$("#perm-allow").addEventListener("click", async () => {
  const p = pendingPerms[0];
  $("#perm-modal").hidden = true;
  await api(`/api/actions/${p.id}/approve`, { method: "POST" }).catch((e) => toast("Approve failed: " + e.message));
  toast("Approved ✓");
  refreshPerms(); loadConnectors($("#conn-search").value); refreshBadges();
});

/* ---------------- credential modal ---------------- */
let credTarget = null;
async function openCredModal(connId, credGroup) {
  credTarget = { connId, credGroup };
  const c = await api(`/api/connectors/${connId}`);
  $("#cred-title").textContent = `Connect ${c.name}`;
  const fields = (c.cred_fields || []).filter((f) =>
    !credGroup || !f.group || f.group === credGroup);
  $("#cred-fields").innerHTML = fields.map((f) => `
    <label>${esc(f.label || f.key)}
      <input type="${f.secret ? "password" : "text"}" data-cf="${esc(f.key)}" placeholder="${esc(f.placeholder || "")}" autocomplete="off">
    </label>`).join("") || `<p class="muted">No credentials needed.</p>`;
  $("#cred-modal").hidden = false;
}
$("#cred-cancel").addEventListener("click", () => { $("#cred-modal").hidden = true; });
$("#cred-save").addEventListener("click", async () => {
  const vals = {};
  $("#cred-fields").querySelectorAll("[data-cf]").forEach((i) => { vals[i.dataset.cf] = i.value; });
  $("#cred-modal").hidden = true;
  try {
    await api(`/api/connectors/${credTarget.connId}/credentials`, {
      method: "POST", body: JSON.stringify({ label: credTarget.connId, fields: vals }),
    });
    toast("Credentials saved — running health check…");
  } catch (e) { toast("Save failed: " + e.message); }
  refreshBadges();
});

/* ---------------- command palette ---------------- */
const PALETTE = [
  ["💬", "New chat", "Start a fresh conversation", "N", () => { messagesEl.innerHTML = ""; showHero(); switchView("chat"); }],
  ["✨", "Plan my day", "Send prompt", "P", () => sendMessage("Plan my day")],
  ["✒️", "Draft a LinkedIn post", "Send prompt", "", () => sendMessage("Draft a linkedin post about shipping early")],
  ["☑️", "Go to Tasks", "Navigate", "T", () => switchView("tasks")],
  ["📅", "Go to Calendar", "Navigate", "C", () => switchView("calendar")],
  ["📁", "Go to Projects", "Navigate", "", () => switchView("projects")],
  ["🧠", "Go to Memory", "Navigate", "M", () => switchView("memory")],
  ["🔌", "Connectors", "Settings", "G", () => openSettings("connectors")],
  ["⚙️", "Settings", "Open settings", "", () => openSettings("general")],
  ["🌙", "Toggle theme", "Light / dark", "", () => { const cur = document.documentElement.dataset.theme; applyTheme(cur === "dark" ? "light" : "dark"); }],
  ["🔗", "Connect Google", "OAuth", "", () => openSettings("connectors")],
];
function renderPalette(q = "") {
  const r = $("#palette-results");
  const items = PALETTE.filter((p) => (p[1] + " " + p[2]).toLowerCase().includes(q.toLowerCase()));
  r.innerHTML = items.length ? items.map((p) => `
    <button class="palette-item" data-pal="${PALETTE.indexOf(p)}">
      <span class="palette-ico pink">${p[0]}</span>
      <span class="grow"><b>${esc(p[1])}</b><small>${esc(p[2])}</small></span>
      ${p[3] ? `<span class="palette-hint">${esc(p[3])}</span>` : ""}
    </button>`).join("") : `<div class="empty">No matches.</div>`;
  r.querySelectorAll("[data-pal]").forEach((b) => b.addEventListener("click", () => {
    $("#palette").hidden = true;
    PALETTE[parseInt(b.dataset.pal, 10)][4]();
  }));
}
function openPalette() {
  $("#palette").hidden = false;
  $("#palette-input").value = "";
  renderPalette();
  setTimeout(() => $("#palette-input").focus(), 30);
}
$("#palette").addEventListener("click", (e) => { if (e.target === $("#palette")) $("#palette").hidden = true; });
$("#palette-input").addEventListener("input", (e) => renderPalette(e.target.value));
$("#open-palette").addEventListener("click", openPalette);
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
  if (e.key === "Escape") { $("#palette").hidden = true; $("#settings-modal").hidden = true; }
});

/* ---------------- boot ---------------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#boot").classList.add("done");
    setTimeout(() => $("#boot").remove(), 600);
  }, 900);
});

/* ---------------- first-run onboarding: Google sign-in ---------------- */
function onboardDone() {
  try { localStorage.setItem("os-onboarded", "1"); } catch {}
  $("#onboard-modal").hidden = true;
}
async function maybeOnboard() {
  let ob = null;
  try { ob = await api("/api/onboarding"); } catch { return; }
  if (!ob.needs_google) return;
  try { if (localStorage.getItem("os-onboarded")) return; } catch {}
  // resume at step 2 if the OAuth app credentials are already saved
  if (ob.google_configured) {
    $("#ob-step-setup").hidden = true;
    $("#ob-step-signin").hidden = false;
  }
  $("#onboard-modal").hidden = false;
}
$("#ob-save").addEventListener("click", async () => {
  const cid = $("#ob-client-id").value.trim(), sec = $("#ob-client-secret").value.trim();
  if (!cid || !sec) { toast("Paste both the Client ID and the Client Secret."); return; }
  try {
    await api("/api/connectors/google_calendar/grant", { method: "POST" });
    await api("/api/connectors/google_calendar/credentials", {
      method: "POST",
      body: JSON.stringify({ label: "Google", fields: { client_id: cid, client_secret: sec } }),
    });
  } catch (e) { toast("Save failed: " + e.message); return; }
  $("#ob-step-setup").hidden = true;
  $("#ob-step-signin").hidden = false;
  toast("Saved — now sign in with Google.");
});
$("#ob-google").addEventListener("click", async () => {
  try {
    const r = await api("/api/connectors/google_calendar/oauth/start");
    if (!r.url) { toast(r.detail || "OAuth not ready yet."); return; }
    const w = window.open(r.url, "oauth", "width=520,height=640");
    const onMsg = (e) => {
      if (e.data && (e.data.oauth_done || e.data.type === "oauth-done")) {
        window.removeEventListener("message", onMsg);
        w && w.close();
        onboardDone();
        toast("Google connected ✓ — Calendar, Gmail, Drive, Sheets, YouTube are live.");
        refreshBadges();
      }
    };
    window.addEventListener("message", onMsg);
  } catch (e) { toast("OAuth failed to start: " + e.message); }
});
$("#ob-skip").addEventListener("click", () => { onboardDone(); toast("Skipped — connect Google anytime from Connectors."); });

/* ---------------- computer (OpenMuse port) ---------------- */
function pillFor(status) {
  const map = { succeeded: "ok", running: "info", failed: "bad", timed_out: "warn", interrupted: "warn" };
  return `<span class="pill ${map[status] || "info"}">${esc(status)}</span>`;
}
async function loadComputer() {
  try {
    const s = await api("/api/om/computer");
    $("#comp-status").innerHTML =
      `<b>Mode:</b> ${esc(s.mode)} &nbsp; <b>Status:</b> ${esc(s.status)} &nbsp; <b>Workspace:</b> ${esc(s.workspacePath)}` +
      (s.message ? `<br><span class="muted">${esc(s.message)}</span>` : "");
    $("#comp-receipts").innerHTML = s.commands.length ? s.commands.map((c) => `
      <details class="receipt">
        <summary>${pillFor(c.status)} <code>${esc(c.command.slice(0, 80))}</code>
          <span class="muted">· exit ${c.exitCode ?? "–"}</span></summary>
        ${c.stdout ? `<div class="muted small">stdout</div><pre class="code wrap">${esc(c.stdout.slice(0, 4000))}</pre>` : ""}
        ${c.stderr ? `<div class="muted small">stderr</div><pre class="code wrap">${esc(c.stderr.slice(0, 4000))}</pre>` : ""}
      </details>`).join("") : `<p class="muted">No commands yet.</p>`;
    compListFiles($("#comp-path").value || "/workspace");
  } catch (e) { $("#comp-status").textContent = "Computer unavailable: " + e.message; }
}
async function compListFiles(path) {
  try {
    const d = await api(`/api/om/computer/files?path=${encodeURIComponent(path)}`);
    $("#comp-path").value = d.path;
    $("#comp-files").innerHTML = d.entries.map((e) => `
      <div class="row gap"><span>${e.dir ? "📁" : "📄"}</span>
        <button class="link-btn grow" data-p="${esc(d.path === "/workspace" ? "" : d.path)}/${esc(e.name)}"
          style="text-align:left">${esc(e.name)}</button>
        ${e.dir ? "" : `<span class="muted small">${e.size} B</span>`}
      </div>`).join("") || `<p class="muted">Empty folder.</p>`;
    $$("#comp-files [data-p]").forEach((b) => b.addEventListener("click", () => compOpenPath(b.dataset.p)));
  } catch (e) { $("#comp-files").innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
}
async function compOpenPath(p) {
  if (p.endsWith("/")) return compListFiles(p);
  try {
    const f = await api("/api/om/computer/files/read", { method: "POST", body: JSON.stringify({ path: p }) });
    $("#comp-editor").hidden = false;
    $("#comp-edit-path").textContent = f.path;
    $("#comp-text").value = f.text;
  } catch (e) {
    // maybe a directory
    compListFiles(p);
  }
}
$("#comp-run").addEventListener("click", async () => {
  const cmd = $("#comp-cmd").value.trim();
  if (!cmd) return;
  $("#comp-run").disabled = true;
  try {
    await api("/api/om/computer/commands", { method: "POST",
      body: JSON.stringify({ command: cmd, cwd: $("#comp-cwd").value || "/workspace" }) });
    $("#comp-cmd").value = "";
    toast("Command finished — receipt saved.");
  } catch (e) { toast("Command failed: " + e.message); }
  $("#comp-run").disabled = false;
  loadComputer();
});
$("#comp-cmd").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#comp-run").click(); });
$("#comp-start").addEventListener("click", async () => { try { await api("/api/om/computer/start", { method: "POST" }); toast("Computer started."); } catch (e) { toast(e.message); } loadComputer(); });
$("#comp-stop").addEventListener("click", async () => { try { await api("/api/om/computer/stop", { method: "POST" }); toast("Computer stopped."); } catch (e) { toast(e.message); } loadComputer(); });
$("#comp-ls").addEventListener("click", () => compListFiles($("#comp-path").value || "/workspace"));
$("#comp-mkdir").addEventListener("click", async () => {
  const p = prompt("New folder path:", ($("#comp-path").value || "/workspace") + "/");
  if (!p) return;
  try { await api("/api/om/computer/files/mkdir", { method: "POST", body: JSON.stringify({ path: p }) }); compListFiles($("#comp-path").value); }
  catch (e) { toast(e.message); }
});
$("#comp-save").addEventListener("click", async () => {
  try {
    await api("/api/om/computer/files/write", { method: "POST",
      body: JSON.stringify({ path: $("#comp-edit-path").textContent, text: $("#comp-text").value }) });
    toast("Saved.");
    compListFiles($("#comp-path").value);
  } catch (e) { toast("Save failed: " + e.message); }
});
loaders.computer = loadComputer;

/* ---------------- browser (OpenMuse port) ---------------- */
let brCurrent = null;
async function loadBrowser() {
  try {
    const list = await api("/api/om/browsers");
    $("#br-list").innerHTML = list.length ? list.map((s) => `
      <div class="row gap">
        ${pillFor(s.status === "active" ? "succeeded" : s.status === "error" ? "failed" : "running")}
        <div class="grow"><b>${esc(s.title)}</b><br><span class="muted small">${esc(s.url)}</span></div>
        <button class="btn-ghost btn-auto" data-act="read" data-id="${s.id}">Read</button>
        <button class="btn-ghost btn-auto" data-act="nav" data-id="${s.id}">Go to…</button>
        <button class="btn-ghost btn-auto" data-act="del" data-id="${s.id}">✕</button>
      </div>`).join("") : `<p class="muted">No sessions yet. Open a page above.</p>`;
    $$("#br-list [data-act]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.id, act = b.dataset.act;
      if (act === "read") brRead(id);
      else if (act === "del") brDelete(id);
      else if (act === "nav") {
        const url = prompt("Navigate to URL:");
        if (url) api(`/api/om/browsers/${id}/navigate`, { method: "POST", body: JSON.stringify({ url }) }).then(loadBrowser).catch((e) => toast(e.message));
      }
    }));
  } catch (e) { $("#br-list").innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
}
$("#br-open").addEventListener("click", async () => {
  const url = $("#br-url").value.trim();
  if (!url) return;
  try {
    const s = await api("/api/om/browsers", { method: "POST", body: JSON.stringify({ url }) });
    $("#br-url").value = "";
    toast(`Session opened (${s.engine}).`);
    loadBrowser();
    brRead(s.id);
  } catch (e) { toast("Could not open: " + e.message); }
});
async function brRead(id) {
  brCurrent = id;
  try {
    const p = await api(`/api/om/browsers/${id}/read`, { method: "POST" });
    $("#br-read-card").hidden = false;
    $("#br-read-title").textContent = p.title || p.url;
    $("#br-text").textContent = p.text + (p.truncated ? "\n…[truncated]" : "");
    $("#br-shot-wrap").innerHTML = "";
    $("#br-console-wrap").hidden = true;
  } catch (e) { toast("Read failed: " + e.message); }
}
async function brDelete(id) {
  try { await api(`/api/om/browsers/${id}`, { method: "DELETE" }); loadBrowser(); }
  catch (e) { toast(e.message); }
}
$("#br-shot").addEventListener("click", async () => {
  if (!brCurrent) return;
  try {
    const r = await fetch(`/api/om/browsers/${brCurrent}/screenshot`);
    if (!r.ok) throw new Error(await r.text());
    const blob = await r.blob();
    $("#br-shot-wrap").innerHTML = `<img src="${URL.createObjectURL(blob)}" alt="screenshot" />`;
  } catch (e) { toast("Screenshot failed: " + e.message); }
});
$("#br-close").addEventListener("click", async () => {
  if (!brCurrent) return;
  try { await api(`/api/om/browsers/${brCurrent}/close`, { method: "POST" }); toast("Session closed."); loadBrowser(); }
  catch (e) { toast(e.message); }
});
$("#br-console").addEventListener("click", async () => {
  if (!brCurrent) return;
  try {
    const c = await api(`/api/om/browsers/${brCurrent}/console`);
    $("#br-console-wrap").hidden = false;
    $("#br-console-text").textContent = c.logs.length
      ? c.logs.map((l) => `[${l.type}] ${l.text}`).join("\n")
      : "(no console messages captured yet — interact with the page, then click Console again)";
  } catch (e) { toast("Console failed: " + e.message); }
});
$("#br-pdf").addEventListener("click", async () => {
  if (!brCurrent) return;
  try {
    const r = await fetch(`/api/om/browsers/${brCurrent}/pdf`);
    if (!r.ok) throw new Error(await r.text());
    const blob = await r.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `browser-${brCurrent}.pdf`;
    a.click();
    toast("PDF downloaded.");
  } catch (e) { toast("PDF failed: " + e.message); }
});
loaders.browser = loadBrowser;

/* ---------------- activity (OpenMuse port) ---------------- */
const ACT_COLORS = { planned: "info", running: "ok", paused: "warn", done: "ok", cancelled: "", failed: "bad" };
async function loadActivity() {
  try {
    const runs = await api("/api/om/activity/runs");
    $("#act-runs").innerHTML = runs.length ? runs.map((r) => `
      <div class="card"><div class="row gap">
        <span class="pill ${ACT_COLORS[r.status] || ""}">${esc(r.status)}</span>
        <strong class="grow">${esc(r.title)}</strong>
        <span class="muted small">${r.plan.filter((s) => s.status === "done").length}/${r.plan.length} steps</span>
        ${r.receipt && r.receipt.retry ? `<span class="muted small" title="Automatic retry policy">🔁 ${r.receipt.retry.count}/${r.receipt.retry.max}${r.receipt.retry.next_at ? ` · next in ${Math.max(0, Math.round(r.receipt.retry.next_at - Date.now() / 1000))}s` : ""}</span>` : ""}
      </div>
      <div class="stack" style="margin:8px 0">${r.plan.map((s, i) => `
        <div class="row gap"><span>${s.status === "done" ? "✅" : s.status === "failed" ? "❌" : s.status === "running" ? "▶️" : "⬜"}</span>
          <span class="grow">${esc(s.name)}</span>
          ${r.status === "running" || r.status === "planned" ? `
            <button class="btn-ghost btn-auto" data-run="${r.id}" data-step="${i}" data-to="done">Done</button>
            <button class="btn-ghost btn-auto" data-run="${r.id}" data-step="${i}" data-to="failed">Fail</button>` : ""}
        </div>`).join("")}</div>
      <div class="row gap">
        ${r.status === "planned" ? `<button class="btn-ghost btn-auto" data-tr="${r.id}" data-to="running">▶ Start</button>` : ""}
        ${r.status === "running" ? `<button class="btn-ghost btn-auto" data-tr="${r.id}" data-to="paused">⏸ Pause</button>` : ""}
        ${r.status === "paused" ? `<button class="btn-ghost btn-auto" data-tr="${r.id}" data-to="running">▶ Resume</button>` : ""}
        ${r.status === "failed" ? `<button class="btn-ghost btn-auto" data-tr="${r.id}" data-to="running">↻ Retry</button>` : ""}
        ${r.status === "running" ? `<button class="btn-ghost btn-auto" data-tr="${r.id}" data-to="done">✔ Finish</button>` : ""}
        ${!["done", "cancelled"].includes(r.status) ? `<button class="btn-ghost btn-auto" data-tr="${r.id}" data-to="cancelled">✕ Cancel</button>` : ""}
        <button class="btn-ghost btn-auto" data-delrun="${r.id}">Delete</button>
      </div></div>`).join("") : `<p class="muted">No runs yet.</p>`;
    $$("#act-runs [data-tr]").forEach((b) => b.addEventListener("click", async () => {
      try { await api(`/api/om/activity/runs/${b.dataset.tr}/transition`, { method: "POST", body: JSON.stringify({ to: b.dataset.to }) }); loadActivity(); }
      catch (e) { toast(e.message); }
    }));
    $$("#act-runs [data-step]").forEach((b) => b.addEventListener("click", async () => {
      try { await api(`/api/om/activity/runs/${b.dataset.run}/steps`, { method: "POST", body: JSON.stringify({ index: +b.dataset.step, status: b.dataset.to }) }); loadActivity(); }
      catch (e) { toast(e.message); }
    }));
    $$("#act-runs [data-delrun]").forEach((b) => b.addEventListener("click", async () => {
      if (!confirm("Delete this run?")) return;
      await api(`/api/om/activity/runs/${b.dataset.delrun}`, { method: "DELETE" }); loadActivity();
    }));
  } catch (e) { $("#act-runs").innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
  loadIdeas(); loadGoals();
}
$("#act-new").addEventListener("click", async () => {
  const title = prompt("Run title:");
  if (!title) return;
  const steps = (prompt("Steps (comma separated):") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const rp = prompt("Auto-retry? Format: retries x base-seconds, e.g. 3x60 (Enter to skip):") || "";
  let retry_policy = null;
  const m = rp.match(/(\d+)\s*x\s*(\d+)/i);
  if (m) retry_policy = { max_retries: +m[1], backoff_s: +m[2] };
  try { await api("/api/om/activity/runs", { method: "POST", body: JSON.stringify({ title, steps, retry_policy }) }); loadActivity(); }
  catch (e) { toast(e.message); }
});
async function loadIdeas() {
  try {
    const ideas = await api("/api/om/ideas");
    $("#idea-list").innerHTML = ideas.length ? ideas.map((i) => `
      <div class="row gap"><span class="pill ${i.status === "new" ? "info" : i.status === "accepted" ? "ok" : ""}">${esc(i.status)}</span>
        <div class="grow"><b>${esc(i.title)}</b>${i.prompt ? `<br><span class="muted small">${esc(i.prompt)}</span>` : ""}</div>
        ${i.status === "new" ? `<button class="btn-ghost btn-auto" data-accept="${i.id}">Accept → goal</button>
          <button class="btn-ghost btn-auto" data-dismiss="${i.id}">Dismiss</button>` : ""}
        <button class="btn-ghost btn-auto" data-delidea="${i.id}">✕</button>
      </div>`).join("") : `<p class="muted">No ideas yet.</p>`;
    $$("#idea-list [data-accept]").forEach((b) => b.addEventListener("click", async () => {
      await api(`/api/om/ideas/${b.dataset.accept}/accept`, { method: "POST" }); loadActivity(); toast("Idea accepted → goal created.");
    }));
    $$("#idea-list [data-dismiss]").forEach((b) => b.addEventListener("click", async () => {
      await api(`/api/om/ideas/${b.dataset.dismiss}`, { method: "PATCH", body: JSON.stringify({ status: "dismissed" }) }); loadActivity();
    }));
    $$("#idea-list [data-delidea]").forEach((b) => b.addEventListener("click", async () => {
      await api(`/api/om/ideas/${b.dataset.delidea}`, { method: "DELETE" }); loadActivity();
    }));
  } catch (e) { $("#idea-list").innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
  loadMailRules();
}
/* ---------------- mail rules ---------------- */
async function loadMailRules() {
  try {
    const st = await api("/api/om/activity/mail-rules/gmail-status");
    $("#mail-status").textContent = st.connected ? `✅ ${st.detail}` : `⚠️ ${st.detail}`;
  } catch (e) { $("#mail-status").textContent = "could not check"; }
  try {
    const rules = await api("/api/om/activity/mail-rules");
    $("#mail-rules").innerHTML = rules.length ? rules.map((r) => `
      <div class="row gap"><span class="pill">🔎</span>
        <div class="grow"><b>${esc(r.name)}</b> <span class="muted small">${esc(r.kind)} · query: ${esc(r.query || "—")}</span><br>
        <span class="muted small">keywords: ${r.keywords.map(esc).join(", ")}</span></div>
        <button class="btn-ghost btn-auto" data-mrdel="${r.id}">✕</button>
      </div>`).join("") : `<p class="muted">No rules yet. Add starter rules or create your own.</p>`;
    $$("#mail-rules [data-mrdel]").forEach((b) => b.addEventListener("click", async () => {
      await api(`/api/om/activity/mail-rules/${b.dataset.mrdel}`, { method: "DELETE" });
      loadMailRules();
    }));
  } catch (e) { $("#mail-rules").innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
}
$("#mail-seed").addEventListener("click", async () => {
  try { await api("/api/om/activity/mail-rules/seed", { method: "POST" }); toast("Starter rules added."); loadMailRules(); }
  catch (e) { toast(e.message); }
});
$("#mrule-add").addEventListener("click", async () => {
  const name = $("#mrule-name").value.trim();
  const query = $("#mrule-query").value.trim();
  const keywords = $("#mrule-kw").value.split(",").map((s) => s.trim()).filter(Boolean);
  if (!name || !keywords.length) { toast("Name + at least one keyword needed."); return; }
  try {
    await api("/api/om/activity/mail-rules", { method: "POST", body: JSON.stringify({ name, query, keywords }) });
    $("#mrule-name").value = $("#mrule-query").value = $("#mrule-kw").value = "";
    loadMailRules();
  } catch (e) { toast(e.message); }
});
$("#mail-scan").addEventListener("click", async () => {
  try {
    toast("Scanning Gmail…");
    const r = await api("/api/om/activity/mail-rules/scan", { method: "POST" });
    const n = r.created.filter((c) => c.idea_id).length;
    toast(`Scanned ${r.scanned} emails — ${n} new idea draft${n === 1 ? "" : "s"}.`);
    loadActivity();
  } catch (e) { toast("Scan failed: " + e.message); }
});
$("#idea-add").addEventListener("click", async () => {
  const title = $("#idea-title").value.trim();
  if (!title) return;
  await api("/api/om/ideas", { method: "POST", body: JSON.stringify({ title }) });
  $("#idea-title").value = ""; loadIdeas();
});
async function loadGoals() {
  try {
    const goals = await api("/api/om/goals");
    $("#goal-list").innerHTML = goals.length ? goals.map((g) => `
      <div class="card"><div class="row gap">
        <span class="pill ${g.status === "active" ? "ok" : ""}">${esc(g.status)}</span>
        <strong class="grow">${esc(g.title)}</strong>
        ${g.status === "active" ? `<button class="btn-ghost btn-auto" data-goaldone="${g.id}">✔ Done</button>` : ""}
      </div>
      <div class="stack" style="margin:8px 0">${g.milestones.map((m) => `
        <div class="row gap"><input type="checkbox" data-ms="${m.id}" ${m.done ? "checked" : ""} />
          <span class="grow" style="${m.done ? "text-decoration:line-through" : ""}">${esc(m.title)}</span></div>`).join("")}</div>
      <div class="row gap"><input class="grow" placeholder="Add milestone…" data-msinput="${g.id}" />
        <button class="btn-ghost btn-auto" data-msadd="${g.id}">Add</button></div>
      </div>`).join("") : `<p class="muted">No goals yet.</p>`;
    $$("#goal-list [data-ms]").forEach((c) => c.addEventListener("change", async () => {
      await api(`/api/om/milestones/${c.dataset.ms}`, { method: "PATCH", body: JSON.stringify({ done: c.checked }) }); loadGoals();
    }));
    $$("#goal-list [data-msadd]").forEach((b) => b.addEventListener("click", async () => {
      const inp = document.querySelector(`[data-msinput="${b.dataset.msadd}"]`);
      if (!inp.value.trim()) return;
      await api(`/api/om/goals/${b.dataset.msadd}/milestones`, { method: "POST", body: JSON.stringify({ title: inp.value.trim() }) });
      loadGoals();
    }));
    $$("#goal-list [data-goaldone]").forEach((b) => b.addEventListener("click", async () => {
      await api(`/api/om/goals/${b.dataset.goaldone}`, { method: "PATCH", body: JSON.stringify({ status: "done" }) }); loadGoals();
    }));
  } catch (e) { $("#goal-list").innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
}
$("#goal-add").addEventListener("click", async () => {
  const title = $("#goal-title").value.trim();
  if (!title) return;
  await api("/api/om/goals", { method: "POST", body: JSON.stringify({ title }) });
  $("#goal-title").value = ""; loadGoals();
});
loaders.activity = loadActivity;

/* ---------------- finance (OpenMuse port) ---------------- */
function inr(n) { return "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 }); }
async function loadFinance() {
  try {
    const reps = await api("/api/om/finance/reports");
    $("#fin-reports").innerHTML = reps.length ? reps.map((r) => {
      const s = r.report.summary || {};
      return `<div class="card"><div class="row gap">
        <strong class="grow">📊 ${esc(r.name)}</strong>
        <span class="muted small">${new Date(r.created_at * 1000).toLocaleDateString()}</span>
        <button class="btn-ghost btn-auto" data-findel="${r.id}">Delete</button></div>
      <div class="row gap" style="margin:10px 0">
        <div class="tile"><div><div class="tile-num" style="color:#157347">${inr(s.total_in || 0)}</div><div class="tile-lbl">In</div></div>
        <div class="tile"><div><div class="tile-num" style="color:#b42318">${inr(s.total_out || 0)}</div><div class="tile-lbl">Out</div></div>
        <div class="tile"><div><div class="tile-num">${inr(s.net || 0)}</div><div class="tile-lbl">Net</div></div>
        <div class="tile"><div><div class="tile-num">${s.transactions || 0}</div><div class="tile-lbl">Transactions</div></div>
      </div>
      ${(s.by_category || []).length ? `<div class="card-title">By category</div>` +
        s.by_category.map((c) => `<div class="row gap"><span class="grow">${esc(c.category)}</span><b>${inr(c.spent)}</b></div>`).join("") : ""}
      ${(s.top_merchants || []).length ? `<div class="card-title" style="margin-top:8px">Top merchants</div>` +
        s.top_merchants.slice(0, 5).map((m) => `<div class="row gap"><span class="grow muted small">${esc(m.merchant)}</span><b>${inr(m.spent)}</b></div>`).join("") : ""}
      </div>`;
    }).join("") : `<p class="muted">No reports yet — upload a CSV above.</p>`;
    $$("#fin-reports [data-findel]").forEach((b) => b.addEventListener("click", async () => {
      if (!confirm("Delete this report?")) return;
      await api(`/api/om/finance/reports/${b.dataset.findel}`, { method: "DELETE" }); loadFinance();
    }));
  } catch (e) { $("#fin-reports").innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
}
$("#fin-file").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const fd = new FormData();
  fd.append("file", f);
  try {
    const r = await fetch("/api/om/finance/upload", { method: "POST", body: fd });
    if (!r.ok) throw new Error(await r.text());
    toast("Report ready.");
  } catch (err) { toast("Upload failed: " + err.message); }
  e.target.value = ""; loadFinance();
});
loaders.finance = loadFinance;

/* ---------------- documents (OpenMuse port) ---------------- */
let docCurrent = null;
async function loadDocuments() {
  try {
    const docs = await api("/api/om/documents");
    $("#doc-list").innerHTML = docs.length ? docs.map((d) => `
      <div class="row gap"><span>📄</span>
        <div class="grow"><b>${esc(d.name)}</b><br>
          <span class="muted small">${(d.size / 1024).toFixed(1)} KB · ${esc(d.source)} · ${new Date(d.created_at * 1000).toLocaleDateString()}</span></div>
        <button class="btn-ghost btn-auto" data-docopen="${d.id}">Open</button>
      </div>`).join("") : `<p class="muted">No documents yet — upload a PDF above.</p>`;
    $$("#doc-list [data-docopen]").forEach((b) => b.addEventListener("click", () => openDoc(b.dataset.docopen)));
  } catch (e) { $("#doc-list").innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
}
$("#doc-file").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const fd = new FormData();
  fd.append("file", f);
  try {
    const r = await fetch("/api/om/documents/upload", { method: "POST", body: fd });
    if (!r.ok) throw new Error(await r.text());
    toast("PDF uploaded.");
  } catch (err) { toast("Upload failed: " + err.message); }
  e.target.value = ""; loadDocuments();
});
async function openDoc(id) {
  docCurrent = id;
  try {
    const info = await api(`/api/om/documents/${id}/info`);
    $("#doc-detail").hidden = false;
    $("#doc-textout").hidden = true;
    $("#doc-detail-title").textContent = `${info.name} — ${info.pages} page(s), ${info.fields.length} field(s)`;
    $("#doc-fields").innerHTML = info.fields.length ? info.fields.map((f, i) => `
      <div class="row gap"><span class="grow"><b>${esc(f.name)}</b> <span class="muted small">(${esc(f.type)})</span></span>
        <input data-fname="${esc(f.name)}" value="${esc(f.value)}" placeholder="value…" style="width:14rem" /></div>`
    ).join("") : `<p class="muted">No fillable fields in this PDF.</p>`;
    $("#doc-detail").scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (e) { toast(e.message); }
}
$("#doc-fill").addEventListener("click", async () => {
  if (!docCurrent) return;
  const values = {};
  $$("#doc-fields [data-fname]").forEach((i) => { if (i.value) values[i.dataset.fname] = i.value; });
  try {
    const r = await api(`/api/om/documents/${docCurrent}/fill`, { method: "POST", body: JSON.stringify({ values }) });
    toast(`Filled ${r.filled} field(s) — saved as "${r.name}".`);
    loadDocuments(); openDoc(r.id);
  } catch (e) { toast("Fill failed: " + e.message); }
});
$("#doc-download").addEventListener("click", () => { if (docCurrent) window.open(`/api/om/documents/${docCurrent}/file`); });
$("#doc-text").addEventListener("click", async () => {
  if (!docCurrent) return;
  try {
    const t = await api(`/api/om/documents/${docCurrent}/text?page=0`);
    $("#doc-textout").hidden = false;
    const src = t.source === "ocr" ? " (read with OCR — scanned page)" : t.text ? "" : " (no text on this page" + (t.ocr_available ? "" : "; OCR tools not installed") + ")";
    $("#doc-textout").textContent = t.text + (t.truncated ? "\n…[truncated]" : "") + src;
  } catch (e) { toast(e.message); }
});
$("#doc-del").addEventListener("click", async () => {
  if (!docCurrent || !confirm("Delete this document?")) return;
  await api(`/api/om/documents/${docCurrent}`, { method: "DELETE" });
  docCurrent = null; $("#doc-detail").hidden = true; loadDocuments();
});
loaders.documents = loadDocuments;

/* ---------------- threads (OpenMuse port) ---------------- */
let thrCurrent = null, thrShowArchived = false;
async function loadThreads() {
  try {
    const list = await api(`/api/om/threads?archived=${thrShowArchived ? "1" : "0"}`);
    $("#thr-arch-toggle").textContent = thrShowArchived ? "Active" : "Archived";
    $("#thr-list").innerHTML = list.length ? list.map((t) => `
      <button class="btn-ghost" data-thr="${t.id}" style="text-align:left;${thrCurrent === t.id ? "border-color:var(--accent)" : ""}">
        <b>${esc(t.title)}</b><br><span class="muted small">${t.message_count} msgs</span>
      </button>`).join("") : `<p class="muted">No threads.</p>`;
    $$("#thr-list [data-thr]").forEach((b) => b.addEventListener("click", () => openThread(b.dataset.thr)));
    if (thrCurrent) openThread(thrCurrent, true);
  } catch (e) { $("#thr-list").innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
}
async function openThread(id, silent) {
  thrCurrent = id;
  try {
    const t = await api(`/api/om/threads/${id}`);
    $("#thr-detail").hidden = false;
    $("#thr-title").textContent = t.title + (t.archived ? " (archived)" : "");
    $("#thr-archive").textContent = t.archived ? "Restore" : "Archive";
    $("#thr-msgs").innerHTML = t.messages.map((m) => `
      <div class="row gap"><span class="pill ${m.role === "user" ? "info" : "ok"}">${esc(m.role)}</span>
        <div class="grow">${esc(m.content)}</div></div>`).join("") || `<p class="muted">No messages yet.</p>`;
    if (!silent) loadThreads();
  } catch (e) { toast(e.message); }
}
$("#thr-new").addEventListener("click", async () => {
  const title = prompt("Thread title:") || "New conversation";
  const t = await api("/api/om/threads", { method: "POST", body: JSON.stringify({ title }) });
  thrCurrent = t.id; loadThreads(); openThread(t.id, true);
});
$("#thr-arch-toggle").addEventListener("click", () => { thrShowArchived = !thrShowArchived; thrCurrent = null; $("#thr-detail").hidden = true; loadThreads(); });
$("#thr-send").addEventListener("click", async () => {
  const v = $("#thr-input").value.trim();
  if (!v || !thrCurrent) return;
  await api(`/api/om/threads/${thrCurrent}/messages`, { method: "POST", body: JSON.stringify({ role: "user", content: v }) });
  $("#thr-input").value = ""; openThread(thrCurrent, true);
});
$("#thr-input").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#thr-send").click(); });
$("#thr-rename").addEventListener("click", async () => {
  if (!thrCurrent) return;
  const title = prompt("New title:");
  if (!title) return;
  await api(`/api/om/threads/${thrCurrent}`, { method: "PATCH", body: JSON.stringify({ title }) });
  openThread(thrCurrent, true); loadThreads();
});
$("#thr-replay").addEventListener("click", async () => {
  if (!thrCurrent) return;
  const t = await api(`/api/om/threads/${thrCurrent}/replay`, { method: "POST" });
  thrCurrent = t.id; toast("Replayed into a new thread."); loadThreads(); openThread(t.id, true);
});
$("#thr-archive").addEventListener("click", async () => {
  if (!thrCurrent) return;
  const t = await api(`/api/om/threads/${thrCurrent}`);
  await api(`/api/om/threads/${thrCurrent}/${t.archived ? "restore" : "archive"}`, { method: "POST" });
  thrCurrent = null; $("#thr-detail").hidden = true; loadThreads();
});
$("#thr-del").addEventListener("click", async () => {
  if (!thrCurrent || !confirm("Delete this thread?")) return;
  await api(`/api/om/threads/${thrCurrent}`, { method: "DELETE" });
  thrCurrent = null; $("#thr-detail").hidden = true; loadThreads();
});
loaders.threads = loadThreads;

/* ---------------- notifications (OpenMuse port) ---------------- */
async function loadNotifications() {
  try {
    const items = await api("/api/om/notifications");
    $("#notif-list").innerHTML = items.length ? items.map((n) => `
      <div class="card" style="${n.read ? "opacity:.65" : ""}"><div class="row gap">
        ${n.read ? "" : `<span class="pill info">new</span>`}
        <div class="grow"><b>${esc(n.title)}</b>
          ${n.body ? `<br><span class="muted">${esc(n.body)}</span>` : ""}
          <br><span class="muted small">${esc(n.source || "os")} · ${new Date(n.created_at * 1000).toLocaleString()}</span></div>
        ${n.link ? `<a class="btn-ghost btn-auto" href="${esc(n.link)}">Open</a>` : ""}
        ${n.read ? "" : `<button class="btn-ghost btn-auto" data-nread="${n.id}">Mark read</button>`}
        <button class="btn-ghost btn-auto" data-ndel="${n.id}">✕</button>
      </div></div>`).join("") : `<p class="muted">Inbox zero. 🎉</p>`;
    $$("#notif-list [data-nread]").forEach((b) => b.addEventListener("click", async () => {
      await api(`/api/om/notifications/${b.dataset.nread}/read`, { method: "POST" });
      loadNotifications(); refreshNotifBadge();
    }));
    $$("#notif-list [data-ndel]").forEach((b) => b.addEventListener("click", async () => {
      await api(`/api/om/notifications/${b.dataset.ndel}`, { method: "DELETE" });
      loadNotifications(); refreshNotifBadge();
    }));
  } catch (e) { $("#notif-list").innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
}
async function refreshNotifBadge() {
  try {
    const { unread } = await api("/api/om/notifications/unread-count");
    const el = $("#badge-notif");
    el.textContent = unread > 0 ? unread : "";
    el.style.display = unread > 0 ? "" : "none";
  } catch { /* ignore */ }
}
$("#notif-readall").addEventListener("click", async () => {
  await api("/api/om/notifications/read-all", { method: "POST" });
  loadNotifications(); refreshNotifBadge();
});
$("#notif-clear").addEventListener("click", async () => {
  await api("/api/om/notifications/clear-read", { method: "POST" });
  loadNotifications(); refreshNotifBadge();
});
async function loadTgStatus() {
  try {
    const s = await api("/api/om/notifications/telegram-status");
    $("#tg-status").textContent = s.connected ? `✅ ${s.detail}` : `⚠️ ${s.detail}`;
  } catch (e) { $("#tg-status").textContent = "could not check"; }
}
$("#tg-send").addEventListener("click", async () => {
  const title = $("#tg-title").value.trim() || "OS test ping";
  try {
    const r = await api("/api/om/notifications", { method: "POST", body: JSON.stringify({ title, source: "inbox-test", telegram: true }) });
    if (r.telegram && r.telegram.sent) toast("Sent to Telegram ✅ (also saved in inbox).");
    else toast("Saved in inbox, but Telegram failed: " + ((r.telegram && r.telegram.reason) || "unknown"));
    loadNotifications(); refreshNotifBadge();
  } catch (e) { toast("Send failed: " + e.message); }
});
loaders.notifications = (...a) => { loadTgStatus(); return loadNotifications(...a); };

/* =============================================================================
   OS V1 CONTROL PLANE LOADERS & ACTIONS
   ============================================================================= */

async function completeTask(taskId) {
  try {
    const res = await api(`/api/v1/tasks/${taskId}/complete`, {
      method: "POST",
      body: JSON.stringify({ receipt: { verified_by: "ui_user", timestamp: new Date().toISOString() } })
    });
    if (res.verified) toast("Task verified & completed ✓");
    else toast("Task moved to " + res.status + " (" + res.message + ")");
    loadHome();
    if (loaders.plan) loaders.plan();
    refreshBadges();
  } catch (e) {
    toast("Completion error: " + e.message);
  }
}

async function approveAction(approvalId, args) {
  try {
    const res = await api(`/api/v1/approvals/${approvalId}/approve`, {
      method: "POST",
      body: JSON.stringify({ arguments: args })
    });
    if (res.ok) toast("Action approved and cryptographic hash verified ✓");
    loadHome();
    if (loaders.approvals) loaders.approvals();
    refreshBadges();
  } catch (e) {
    toast("Approval error: " + e.message);
  }
}

async function rejectAction(approvalId) {
  const reason = prompt("Enter reason for rejection (optional):", "Rejected by user");
  if (reason === null) return;
  try {
    const res = await api(`/api/v1/approvals/${approvalId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason: reason })
    });
    if (res.ok) toast("Action rejected");
    loadHome();
    if (loaders.approvals) loaders.approvals();
    refreshBadges();
  } catch (e) {
    toast("Reject error: " + e.message);
  }
}

/* ---------------- Home View ---------------- */
async function loadHome() {
  try {
    const data = await api("/api/v1/home");
    const greeting = data.greeting || data.now?.greeting;
    if (greeting) {
      const gEl = $("#home-greeting");
      if (gEl) gEl.textContent = greeting;
    }

    // Next action
    const nextEl = $("#home-next-action");
    if (nextEl) {
      const active = (data.now && data.now.id) ? data.now : (data.now?.active_task || data.now?.next_recommended_task);
      if (active) {
        const estMin = active.estimated_minutes || active.estimated_duration_minutes || 60;
        nextEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
            <div style="flex:1;">
              <div style="font-size:16px;font-weight:700;margin-bottom:6px;">${esc(active.title)}</div>
              <div class="muted small" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                <span class="pill info">${esc(active.status || 'READY')}</span>
                <span>Priority: <b>${active.priority || 50}</b></span>
                <span>Est: <b>${estMin}m</b></span>
                ${active.deadline ? `<span>Target: <b>${new Date(active.deadline).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</b></span>` : ""}
              </div>
              ${active.reason ? `<div class="muted small" style="margin-top:4px;">💡 ${esc(active.reason)}</div>` : ""}
            </div>
            <div>
              <button class="btn-primary btn-auto" data-task-complete="${active.id}">✓ Complete</button>
            </div>
          </div>
        `;
        const compBtn = nextEl.querySelector("[data-task-complete]");
        if (compBtn) compBtn.addEventListener("click", () => completeTask(active.id));
      } else {
        nextEl.innerHTML = `<p class="muted">No immediate action required. All scheduled items clear! 🚀</p>`;
      }
    }

    // Today's scheduled work
    const planEl = $("#home-plan-list");
    if (planEl) {
      const items = Array.isArray(data.today_plan) ? data.today_plan : (data.today_plan?.items || []);
      if (items.length) {
        planEl.innerHTML = items.map(it => {
          const rawStart = it.start || it.scheduled_start;
          const rawEnd = it.end || it.scheduled_end;
          const start = rawStart ? new Date(rawStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--";
          const end = rawEnd ? new Date(rawEnd).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--";
          const tTitle = it.title || it.task_title || "Work slot";
          const tId = it.task_id || it.id;
          return `
            <div class="card" style="padding:10px 14px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <span class="badge" style="margin-right:8px;background:var(--bg-subtle, #2a2b36);">${start} - ${end}</span>
                <b>${esc(tTitle)}</b>
                ${it.reason ? `<div class="muted small" style="margin-top:2px;">${esc(it.reason)}</div>` : ""}
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="pill ${it.status === 'COMPLETED' ? 'success' : 'info'}">${it.status || 'PLANNED'}</span>
                ${it.status !== 'COMPLETED' && tId ? `<button class="btn-ghost btn-auto" data-task-complete="${tId}">✓</button>` : ""}
              </div>
            </div>
          `;
        }).join("");
        planEl.querySelectorAll("[data-task-complete]").forEach(b => {
          b.addEventListener("click", () => completeTask(b.dataset.taskComplete));
        });
      } else {
        planEl.innerHTML = `<p class="muted">No work slots scheduled for today. Click "⚡ Replan Day" to allocate tasks.</p>`;
      }
    }

    // Waiting list
    const waitEl = $("#home-waiting-list");
    if (waitEl) {
      const waiting = data.waiting || [];
      if (waiting.length) {
        waitEl.innerHTML = waiting.map(w => `
          <div class="card" style="padding:8px 12px;margin-bottom:6px;">
            <b>${esc(w.title)}</b>
            <div class="muted small">${esc(w.waiting_for || w.description || "Waiting on external dependency")}</div>
          </div>
        `).join("");
      } else {
        waitEl.innerHTML = `<p class="muted">Nothing currently waiting.</p>`;
      }
    }

    // Blocked list
    const blockEl = $("#home-blocked-list");
    if (blockEl) {
      const blocked = data.blocked || [];
      if (blocked.length) {
        blockEl.innerHTML = blocked.map(b => `
          <div class="card" style="padding:8px 12px;margin-bottom:6px;border-left:3px solid #ef4444;">
            <b>${esc(b.title)}</b>
            <div class="muted small">${esc(b.blocker || b.description || "Blocked · Requires resolution")}</div>
          </div>
        `).join("");
      } else {
        blockEl.innerHTML = `<p class="muted">No blocked items. 🛡️</p>`;
      }
    }

    // Upcoming deadlines
    const dlEl = $("#home-deadlines-list");
    if (dlEl) {
      const dls = data.upcoming_deadlines || [];
      if (dls.length) {
        dlEl.innerHTML = dls.map(d => {
          const target = d.deadline ? new Date(d.deadline) : null;
          const diffDays = target ? Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24)) : null;
          return `
            <div class="card" style="padding:8px 12px;margin-bottom:6px;border-left:3px solid #f59e0b;">
              <div style="display:flex;justify-content:space-between;">
                <b>${esc(d.title)}</b>
                <span class="pill warn">${diffDays !== null ? (diffDays <= 0 ? 'Due Today' : `${diffDays}d left`) : 'Deadline'}</span>
              </div>
              <div class="muted small">${target ? target.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}</div>
            </div>
          `;
        }).join("");
      } else {
        dlEl.innerHTML = `<p class="muted">No urgent deadlines.</p>`;
      }
    }

    // Specialized workers / agents
    const agEl = $("#home-agents-list");
    if (agEl) {
      const agents = data.active_agents || data.specialized_agents || [];
      if (agents.length) {
        agEl.innerHTML = agents.slice(0, 4).map(ag => {
          const type = (ag.agent_type || "worker").toUpperCase();
          const label = ag.instruction || ag.workflow || "Worker task";
          return `
            <div class="card" style="padding:8px 12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <span class="pill" style="font-weight:600;margin-right:6px;">${esc(type)}</span>
                <span class="small">${esc(label.slice(0, 45) + (label.length > 45 ? '...' : ''))}</span>
              </div>
              <span class="pill ${ag.status === 'COMPLETED' ? 'success' : (ag.status === 'FAILED' ? 'danger' : 'info')}">${ag.status}</span>
            </div>
          `;
        }).join("");
      } else {
        agEl.innerHTML = `<p class="muted">No active agent runs.</p>`;
      }
    }

    // Governance & approvals
    const appEl = $("#home-approvals-list");
    if (appEl) {
      const apps = data.pending_approvals || data.governance?.pending_approvals || [];
      if (apps.length) {
        appEl.innerHTML = apps.map(ap => {
          const tool = ap.tool || ap.tool_name || "Action";
          return `
            <div class="card" style="padding:10px 14px;margin-bottom:8px;border-left:3px solid ${ap.risk_level === 'HIGH' ? '#ef4444' : '#f59e0b'};">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
                <div>
                  <b>${esc(tool)}</b>
                  <span class="pill ${ap.risk_level === 'HIGH' ? 'danger' : 'warn'}" style="margin-left:6px;">${ap.risk_level}</span>
                </div>
                <div style="display:flex;gap:6px;">
                  <button class="btn-primary btn-auto" data-appr-btn="${ap.approval_id}">Approve</button>
                  <button class="btn-ghost btn-auto" data-rej-btn="${ap.approval_id}">Reject</button>
                </div>
              </div>
              <pre style="background:rgba(0,0,0,0.15);padding:6px;border-radius:4px;font-size:11px;overflow-x:auto;">${esc(JSON.stringify(ap.arguments, null, 2))}</pre>
            </div>
          `;
        }).join("");
        appEl.querySelectorAll("[data-appr-btn]").forEach(b => {
          const apId = b.dataset.apprBtn;
          const match = apps.find(x => x.approval_id === apId);
          b.addEventListener("click", () => approveAction(apId, match ? match.arguments : {}));
        });
        appEl.querySelectorAll("[data-rej-btn]").forEach(b => {
          b.addEventListener("click", () => rejectAction(b.dataset.rejBtn));
        });
      } else {
        appEl.innerHTML = `<p class="muted">No governance approvals pending. 🛡️</p>`;
      }
    }

    // Operational activity log
    const actEl = $("#home-activity-list");
    if (actEl) {
      const acts = data.recent_activity || [];
      if (acts.length) {
        actEl.innerHTML = acts.slice(0, 10).map(a => `
          <div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid var(--border-subtle, rgba(255,255,255,0.06));">
            <span style="font-size:16px;">⚡</span>
            <div style="flex:1;">
              <div><b>${esc(a.activity_type)}</b>: ${esc(a.description || "")}</div>
              <div class="muted small">${relTimeAny(a.created_at)}</div>
            </div>
          </div>
        `).join("");
      } else {
        actEl.innerHTML = `<p class="muted">No recent activity logged.</p>`;
      }
    }
  } catch (e) {
    console.error("loadHome error:", e);
  }
}

/* ---------------- Commitments View ---------------- */
async function loadCommitments() {
  const el = $("#commitments-list");
  if (!el) return;
  try {
    const res = await api("/api/v1/commitments");
    const list = res.commitments || [];
    if (!list.length) {
      el.innerHTML = `<p class="muted">No commitments recorded yet. Click "+ New Commitment" to create one.</p>`;
      return;
    }
    el.innerHTML = list.map(c => `
      <div class="card" style="padding:14px;margin-bottom:10px;border-left:3px solid var(--accent, #7c5cf6);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div style="font-weight:700;font-size:16px;">${esc(c.title)}</div>
            ${c.description ? `<p class="muted" style="margin:4px 0 8px;">${esc(c.description)}</p>` : ""}
            <div class="muted small" style="display:flex;gap:12px;margin-top:4px;flex-wrap:wrap;">
              <span>Status: <b class="pill info">${c.status}</b></span>
              <span>Priority: <b>${c.priority}</b></span>
              ${c.deadline ? `<span>Target Deadline: <b>${new Date(c.deadline).toLocaleString()}</b></span>` : ""}
            </div>
          </div>
          <div>
            <span class="pill ${c.status === 'FULFILLED' ? 'success' : 'warn'}">${c.status}</span>
          </div>
        </div>
      </div>
    `).join("");
  } catch (e) {
    el.innerHTML = `<p class="muted">Error loading commitments: ${esc(e.message)}</p>`;
  }
}

/* ---------------- Plan View ---------------- */
async function loadPlan() {
  const el = $("#plan-full-list");
  if (!el) return;
  try {
    const res = await api("/api/v1/plan");
    const items = res.items || [];
    if (!items.length) {
      el.innerHTML = `<p class="muted">No execution plan active for today. Click "⚡ Recalculate Plan" to generate one based on current commitments, tasks, and calendar constraints.</p>`;
      return;
    }
    el.innerHTML = `
      <div class="muted small" style="margin-bottom:12px;">Plan ID: <code>${res.plan?.id || ""}</code> · Target Date: <b>${res.plan?.plan_date || "Today"}</b></div>
      ${items.map(it => {
        const start = it.scheduled_start ? new Date(it.scheduled_start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--";
        const end = it.scheduled_end ? new Date(it.scheduled_end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--";
        return `
          <div class="card" style="padding:12px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <span class="badge" style="margin-right:10px;font-size:13px;padding:4px 8px;">${start} — ${end}</span>
              <b style="font-size:15px;">${esc(it.task_title || "Work slot")}</b>
              ${it.reason ? `<div class="muted small" style="margin-top:4px;">💡 ${esc(it.reason)}</div>` : ""}
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span class="pill ${it.status === 'COMPLETED' ? 'success' : 'info'}">${it.status}</span>
              ${it.status !== 'COMPLETED' ? `<button class="btn-primary btn-auto" data-task-complete="${it.task_id}">✓ Complete</button>` : ""}
            </div>
          </div>
        `;
      }).join("")}
    `;
    el.querySelectorAll("[data-task-complete]").forEach(b => {
      b.addEventListener("click", () => completeTask(b.dataset.taskComplete));
    });
  } catch (e) {
    el.innerHTML = `<p class="muted">Error loading plan: ${esc(e.message)}</p>`;
  }
}

/* ---------------- Agents View ---------------- */
async function loadAgents() {
  const el = $("#agents-full-list");
  if (!el) return;
  try {
    const res = await api("/api/v1/agents");
    const runs = res.agent_runs || [];
    if (!runs.length) {
      el.innerHTML = `<p class="muted">No specialized worker runs recorded yet. Launch OpenCode, Browser Use, or Researcher using the button above.</p>`;
      return;
    }
    el.innerHTML = runs.map(r => `
      <div class="card" style="padding:14px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <span class="badge" style="background:#7c5cf6;color:#fff;margin-right:8px;">${esc(r.agent_type.toUpperCase())}</span>
            <b style="font-size:15px;">${esc(r.instruction || "Worker instruction")}</b>
            <div class="muted small" style="margin-top:6px;">
              Run ID: <code>${r.id}</code> · Started: <b>${relTimeAny(r.started_at)}</b>
            </div>
          </div>
          <span class="pill ${r.status === 'COMPLETED' ? 'success' : (r.status === 'FAILED' ? 'danger' : 'info')}">${r.status}</span>
        </div>
        ${r.artifacts && Object.keys(r.artifacts).length ? `
          <div style="margin-top:10px;background:rgba(0,0,0,0.18);padding:8px 12px;border-radius:6px;">
            <div class="muted small" style="margin-bottom:4px;font-weight:600;">Worker Output & Evidence:</div>
            <pre style="margin:0;font-size:11px;overflow-x:auto;">${esc(JSON.stringify(r.artifacts, null, 2))}</pre>
          </div>
        ` : ""}
      </div>
    `).join("");
  } catch (e) {
    el.innerHTML = `<p class="muted">Error loading agents: ${esc(e.message)}</p>`;
  }
}

/* ---------------- Approvals View ---------------- */
async function loadApprovals() {
  const el = $("#approvals-full-list");
  if (!el) return;
  try {
    const res = await api("/api/v1/approvals");
    const apps = res.pending_approvals || [];
    if (!apps.length) {
      el.innerHTML = `<p class="muted">All operations governed and verified. Zero pending approvals. 🛡️</p>`;
      return;
    }
    el.innerHTML = apps.map(ap => `
      <div class="card" style="padding:14px;margin-bottom:12px;border-left:4px solid ${ap.risk_level === 'HIGH' ? '#ef4444' : '#f59e0b'};">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <div>
            <b style="font-size:16px;">${esc(ap.tool_name)}</b>
            <span class="pill ${ap.risk_level === 'HIGH' ? 'danger' : 'warn'}" style="margin-left:8px;">${ap.risk_level} RISK</span>
            <div class="muted small" style="margin-top:4px;">
              Approval ID: <code>${ap.approval_id}</code> · Requested: <b>${relTimeAny(ap.requested_at)}</b>
            </div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn-primary btn-auto" data-appr-btn="${ap.approval_id}">Approve Action</button>
            <button class="btn-ghost btn-auto" data-rej-btn="${ap.approval_id}">Reject</button>
          </div>
        </div>
        <div style="margin-top:8px;">
          <div class="muted small" style="margin-bottom:4px;font-weight:600;">Bound Parameters & Cryptographic Hash:</div>
          <div class="small" style="margin-bottom:4px;">Hash: <code>${esc(ap.arguments_hash)}</code></div>
          <pre style="background:rgba(0,0,0,0.2);padding:8px 12px;border-radius:6px;font-size:12px;overflow-x:auto;">${esc(JSON.stringify(ap.arguments, null, 2))}</pre>
        </div>
      </div>
    `).join("");
    el.querySelectorAll("[data-appr-btn]").forEach(b => {
      const apId = b.dataset.apprBtn;
      const match = apps.find(x => x.approval_id === apId);
      b.addEventListener("click", () => approveAction(apId, match ? match.arguments : {}));
    });
    el.querySelectorAll("[data-rej-btn]").forEach(b => {
      b.addEventListener("click", () => rejectAction(b.dataset.rejBtn));
    });
  } catch (e) {
    el.innerHTML = `<p class="muted">Error loading approvals: ${esc(e.message)}</p>`;
  }
}

/* ---------------- People View ---------------- */
async function loadPeople() {
  const el = $("#people-full-list");
  if (!el) return;
  try {
    const res = await api("/api/v1/people");
    const list = res.people || [];
    if (!list.length) {
      el.innerHTML = `<p class="muted">No people registered yet. Click "+ Add Person" above to add contacts.</p>`;
      return;
    }
    el.innerHTML = list.map(p => `
      <div class="card" style="padding:12px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <b style="font-size:15px;">${esc(p.name)}</b>
          ${p.email ? `<div class="muted small">${esc(p.email)}</div>` : ""}
        </div>
        <span class="pill info">Contact</span>
      </div>
    `).join("");
  } catch (e) {
    el.innerHTML = `<p class="muted">Error loading people: ${esc(e.message)}</p>`;
  }
}

/* ---------------- Event Listeners for V1 Views ---------------- */
$("#btn-home-replan")?.addEventListener("click", async () => {
  try {
    await api("/api/v1/plan/generate", { method: "POST" });
    toast("Execution plan recalculated! ⚡");
    loadHome();
  } catch (e) {
    toast("Replan error: " + e.message);
  }
});

$("#btn-home-sync")?.addEventListener("click", async () => {
  const subject = prompt("Simulate incoming message subject:", "Urgent: review Q3 architecture deck before Friday");
  if (subject === null) return;
  try {
    const res = await api("/api/v1/ingest", {
      method: "POST",
      body: JSON.stringify({
        source_type: "gmail",
        subject: subject,
        body: "Please review and approve the updated architectural diagrams by Friday 5 PM.",
      })
    });
    toast(`Ingested (${res.status}): ${res.commitment ? res.commitment.title : res.reason}`);
    loadHome();
    refreshBadges();
  } catch (e) {
    toast("Ingest failed: " + e.message);
  }
});

$("#btn-view-plan-all")?.addEventListener("click", () => switchView("plan"));

$("#btn-new-commitment")?.addEventListener("click", async () => {
  const title = prompt("Commitment title / promise:");
  if (!title) return;
  const dl = prompt("Deadline (e.g. 2026-10-15 or leave blank):", "");
  try {
    await api("/api/v1/commitments", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        deadline: dl ? new Date(dl).toISOString() : null,
        priority: 70
      })
    });
    toast("Commitment created ✓");
    loadCommitments();
    refreshBadges();
  } catch (e) {
    toast("Failed: " + e.message);
  }
});

$("#btn-plan-generate")?.addEventListener("click", async () => {
  try {
    await api("/api/v1/plan/generate", { method: "POST" });
    toast("Plan refreshed ✓");
    loadPlan();
  } catch (e) {
    toast("Plan error: " + e.message);
  }
});

const dispatchWorkerHandler = async () => {
  const type = prompt("Choose worker type (coding, browser, research):", "coding");
  if (!type) return;
  const instruction = prompt("Worker task instruction:", type === "coding" ? "Fix formatting in file and run tests" : "Extract key findings");
  if (!instruction) return;
  try {
    toast("Dispatching specialized worker...");
    const res = await api("/api/v1/agents/dispatch", {
      method: "POST",
      body: JSON.stringify({ agent_type: type.trim().toLowerCase(), instruction: instruction })
    });
    toast(`Worker finished: ${res.result?.status || 'OK'}`);
    loadAgents();
    loadHome();
    refreshBadges();
  } catch (e) {
    toast("Worker error: " + e.message);
  }
};
$("#btn-dispatch-modal")?.addEventListener("click", dispatchWorkerHandler);
$("#btn-agents-launch")?.addEventListener("click", dispatchWorkerHandler);

$("#btn-new-person")?.addEventListener("click", async () => {
  const name = prompt("Person name:");
  if (!name) return;
  const email = prompt("Email (optional):", "");
  try {
    await api("/api/v1/people", {
      method: "POST",
      body: JSON.stringify({ name: name, email: email || null })
    });
    toast("Person added ✓");
    loadPeople();
  } catch (e) {
    toast("Failed: " + e.message);
  }
});

loaders.home = loadHome;
loaders.commitments = loadCommitments;
loaders.plan = loadPlan;
loaders.agents = loadAgents;
loaders.approvals = loadApprovals;
loaders.people = loadPeople;

/* ---------------- init ---------------- */
loadMe();
refreshBadges();
refreshApprovalRail();
refreshPerms();
maybeOnboard();
setInterval(refreshApprovalRail, 15000);
setInterval(refreshPerms, 20000);
setInterval(refreshNotifBadge, 30000);
refreshNotifBadge();
switchView("home");

/* ---------------- PWA: service worker ---------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/static/sw.js").catch(() => {});
  });
}
