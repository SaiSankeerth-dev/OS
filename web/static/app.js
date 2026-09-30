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
    $("#badge-tasks").textContent = t.open || "";
    const w = await api("/api/watchers");
    $("#badge-watchers").textContent = w.suggestions.length || "";
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
$$("#chips button").forEach((b) => b.addEventListener("click", () => { if (b.dataset.chip) sendMessage(b.dataset.chip); }));
$$("#action-cards .acard").forEach((b) => b.addEventListener("click", () => sendMessage(b.dataset.prompt)));
$$(".rel-action").forEach((b) => b.addEventListener("click", () => sendMessage(b.dataset.rel)));
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

/* ---------------- init ---------------- */
loadMe();
refreshBadges();
refreshApprovalRail();
refreshPerms();
maybeOnboard();
setInterval(refreshApprovalRail, 15000);
setInterval(refreshPerms, 20000);
switchView("chat");
