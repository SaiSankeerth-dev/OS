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

/* ---------------- theme ---------------- */
$("#theme-toggle").addEventListener("click", () => {
  const html = document.documentElement;
  const dark = html.dataset.theme !== "dark";
  html.dataset.theme = dark ? "dark" : "light";
  $("#theme-toggle").textContent = dark ? "🌙" : "☀️";
});

/* ---------------- nav ---------------- */
const loaders = {};
$$("#nav .nav-item").forEach((b) =>
  b.addEventListener("click", () => switchView(b.dataset.view))
);
function switchView(name) {
  if (name === "connectors") { openSettings("connectors"); return; }
  $$("#nav .nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  if (loaders[name]) loaders[name]();
}
$("#grid-btn").addEventListener("click", () => openSettings("connectors"));

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

function addUserMsg(text) {
  const el = document.createElement("div");
  el.className = "msg-user";
  el.innerHTML = `<div class="bubble">${esc(text)}</div><div class="avatar">S</div>
    <div class="ts" style="font-size:11px;color:var(--muted)">${now()}</div>`;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addOsMsg() {
  const el = document.createElement("div");
  el.className = "msg-os";
  el.innerHTML = `<div class="msg-os-head"><div class="os-ico">🌀</div><b>OS</b><span class="ts">${now()}</span></div>
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
  const thumbs = ["Just\\nShip It.", "Progress\\n> Perfection", "Build\\nShip\\nLearn"].map(
    (t, i) => `<div class="thumb" style="background:linear-gradient(135deg,${["#2b3a67,#e07a5f", "#3d348b,#f6bd60", "#14213d,#fca311"][i]})">${t.replace(/\\n/g, "<br>")}</div>`
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
  // only bump display version on edit; keep simple counter per approval id chain
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
  if (qa === "newtask") { switchView("tasks"); $("#task-input").focus(); }
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

/* ---------------- tasks ---------------- */
loaders.tasks = async () => {
  const { tasks } = await api("/api/tasks");
  const el = $("#task-list");
  el.innerHTML = tasks.length ? "" : `<div class="empty">No tasks yet. Add one above.</div>`;
  for (const t of tasks) {
    const row = document.createElement("div");
    row.className = "row-card" + (t.status === "DONE" ? " done" : "");
    row.innerHTML = `<input type="checkbox" class="checkbox" ${t.status === "DONE" ? "checked" : ""}>
      <div class="grow">${esc(t.title)}</div>
      <span class="tag ${t.status.toLowerCase()}">${t.status}</span>
      <button class="mini-btn">Remove</button>`;
    row.querySelector(".checkbox").addEventListener("change", async (e) => {
      await api(`/api/tasks/${t.id}`, { method: "PATCH", body: JSON.stringify({ status: e.target.checked ? "DONE" : "PENDING" }) });
      loaders.tasks(); refreshBadges();
    });
    row.querySelector(".mini-btn").addEventListener("click", async () => {
      await api(`/api/tasks/${t.id}`, { method: "DELETE" });
      loaders.tasks(); refreshBadges();
    });
    el.appendChild(row);
  }
};
$("#task-add-btn").addEventListener("click", async () => {
  const v = $("#task-input").value.trim();
  if (!v) return;
  await api("/api/tasks", { method: "POST", body: JSON.stringify({ title: v }) });
  $("#task-input").value = "";
  loaders.tasks(); refreshBadges(); toast("Task added");
});
$("#task-input").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#task-add-btn").click(); });

/* ---------------- calendar ---------------- */
loaders.calendar = async () => {
  const cal = await api("/api/calendar");
  $("#calendar-body").innerHTML = cal.connected
    ? `<div class="empty">Connected ✓ — no events in the next 7 days.</div>`
    : `<div class="empty"><h3>Calendar isn't connected</h3>
       <p>Connect Google Calendar to see your day here. OS will ask your permission first.</p>
       <button class="btn-primary" id="cal-connect">Connect Google Calendar</button></div>`;
  const b = $("#cal-connect");
  if (b) b.addEventListener("click", () => switchView("connectors"));
};

/* ---------------- projects ---------------- */
loaders.projects = async () => {
  const { projects } = await api("/api/projects");
  const el = $("#project-grid");
  el.innerHTML = projects.length ? "" : `<div class="empty">No projects found.</div>`;
  for (const p of projects) {
    const c = document.createElement("div");
    c.className = "card";
    c.innerHTML = `<h4>${esc(p.title)}</h4><p class="muted">${esc(p.description)}</p>`;
    el.appendChild(c);
  }
};

/* ---------------- memory ---------------- */
loaders.memory = async () => {
  const { memories } = await api("/api/memory");
  const el = $("#memory-list");
  el.innerHTML = memories.length ? "" : `<div class="empty">Nothing remembered yet. Tell OS something with "remember that…".</div>`;
  for (const m of memories) {
    const row = document.createElement("div");
    row.className = "row-card";
    row.innerHTML = `<div class="grow"><b>${esc(m.key)}</b><div class="muted">${esc(m.value)}</div></div>
      <span class="tag pending">${esc(m.type || "")}</span><button class="mini-btn">Forget</button>`;
    row.querySelector(".mini-btn").addEventListener("click", async () => {
      await api(`/api/memory/${encodeURIComponent(m.key)}`, { method: "DELETE" });
      loaders.memory(); toast("Forgotten");
    });
    el.appendChild(row);
  }
};

/* ---------------- skills ---------------- */
loaders.skills = async () => {
  const { skills } = await api("/api/skills");
  const el = $("#skill-grid");
  el.innerHTML = "";
  for (const s of skills) {
    const c = document.createElement("div");
    c.className = "card";
    c.innerHTML = `<h4>🛠 ${esc(s.name)}</h4><p class="muted">${esc(s.description || "")}</p>
      <div class="kv"><span>Category</span><b>${esc(s.category || "—")}</b></div>
      <div class="kv"><span>Mode</span><b>${esc(s.mode || "—")}</b></div>`;
    el.appendChild(c);
  }
};

/* ---------------- watchers ---------------- */
loaders.watchers = async () => {
  const { suggestions } = await api("/api/watchers");
  const el = $("#watcher-list");
  el.innerHTML = suggestions.length ? "" : `<div class="empty">All quiet. OS will nudge you here when it notices something.</div>`;
  for (const s of suggestions) {
    const row = document.createElement("div");
    row.className = "row-card";
    row.innerHTML = `<div class="grow"><b>💡 ${esc(s.kind)}</b><div>${esc(s.text)}</div></div>
      <button class="mini-btn">Dismiss</button>`;
    row.querySelector(".mini-btn").addEventListener("click", async () => {
      await api(`/api/watchers/${s.id}/seen`, { method: "POST" });
      loaders.watchers(); refreshBadges();
    });
    el.appendChild(row);
  }
};

/* ---------------- files ---------------- */
loaders.files = async () => {
  const { root, files } = await api("/api/files");
  $("#files-root").textContent = root;
  const el = $("#file-list");
  el.innerHTML = "";
  for (const f of files.slice(0, 200)) {
    const row = document.createElement("div");
    row.className = "row-card";
    const isDir = f.type === "dir";
    row.innerHTML = `<div class="grow">${isDir ? "📁" : "📄"} ${esc(f.path)}
      ${f.size != null ? `<span class="muted"> · ${(f.size / 1024).toFixed(1)} KB</span>` : ""}</div>
      ${isDir ? "" : `<button class="mini-btn">Download</button>`}`;
    if (!isDir) row.querySelector(".mini-btn").addEventListener("click", () => {
      window.open(`/api/files/download?path=${encodeURIComponent(f.path)}`, "_blank");
    });
    el.appendChild(row);
  }
};

/* ---------------- analytics ---------------- */
loaders.analytics = async () => {
  const a = await api("/api/analytics");
  const stats = [
    [a.approvals_approved, "Approvals granted"],
    [a.approvals_rejected, "Approvals rejected"],
    [a.approvals_expired, "Approvals expired"],
    [a.memories, "Memories stored"],
    [a.tasks_open, "Open tasks"],
    [a.tasks_done, "Tasks done"],
    [a.events, "Events logged"],
  ];
  $("#analytics-grid").innerHTML = stats.map(([n, l]) =>
    `<div class="stat"><div class="num">${n}</div><div class="lbl">${l}</div></div>`).join("");
};

/* ---------------- settings modal + connectors (v2) ---------------- */
let connectors = [];
let connQuery = "";
let detailId = null;
let permTarget = null;

const STATE_META = {
  available: ["Available", "pill"],
  granted: ["Permission granted", "pill pill-granted"],
  connected: ["Connected", "pill pill-ok"],
  setup_error: ["Setup failed", "pill pill-err"],
  denied: ["Denied", "pill"],
};
const stateLabel = (c) => (STATE_META[c.state] || ["—", "pill"])[0];
const statePill = (c) => (STATE_META[c.state] || ["—", "pill"])[1];

function openSettings(tab) {
  $("#settings-modal").hidden = false;
  switchDTab(tab || "connectors");
  if ((tab || "connectors") === "connectors") { showConnList(); loadConnectors(); }
  if (tab === "general") loadGeneral();
}
function closeSettings() { $("#settings-modal").hidden = true; }
function switchDTab(name) {
  $$(".sm-nav-item").forEach((b) => b.classList.toggle("active", b.dataset.dtab === name));
  $$(".dtab").forEach((s) => s.classList.toggle("active", s.id === "dtab-" + name));
}
$$(".sm-nav-item").forEach((b) => b.addEventListener("click", () => {
  switchDTab(b.dataset.dtab);
  if (b.dataset.dtab === "connectors") { showConnList(); loadConnectors(); }
  if (b.dataset.dtab === "general") loadGeneral();
}));
$("#settings-close").addEventListener("click", closeSettings);
$("#settings-modal").addEventListener("click", (e) => { if (e.target.id === "settings-modal") closeSettings(); });
$("#set-theme").addEventListener("click", () => $("#theme-toggle").click());
$("#revoke-all").addEventListener("click", async () => {
  if (!confirm("Revoke ALL connectors and delete every stored credential?")) return;
  for (const c of connectors) { try { await api(`/api/connectors/${c.id}/revoke`, { method: "POST" }); } catch {} }
  loadConnectors(); refreshChips(); toast("Everything revoked");
});
window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "oauth-done") {
    toast(`${e.data.connector || "Service"} connected ✓`);
    loadConnectors();
    if (detailId) openConnectorDetail(detailId);
    refreshChips();
  }
});

async function loadGeneral() {
  try {
    const me = await api("/api/me");
    $("#set-model").textContent = me.model_ok ? "Local Ollama — reachable" : "Local Ollama — unreachable";
    $("#set-model-pill").textContent = me.model_ok ? "ok" : "offline";
    $("#set-model-pill").className = "pill " + (me.model_ok ? "pill-ok" : "pill-err");
  } catch {}
}

async function loadConnectors() {
  try {
    const { connectors: list } = await api("/api/connectors");
    connectors = list;
    renderConnectorList();
    if (detailId) renderConnectorDetail();
  } catch (e) { toast("Couldn't load connectors: " + e.message); }
}

function connRow(c) {
  const [label, pill] = [stateLabel(c), statePill(c)];
  const right = c.state === "connected"
    ? `<span class="${pill}">${label}</span><span class="conn-chev">›</span>`
    : `<button class="btn-primary btn-sm" data-conn="${c.id}" data-act="connect">Connect</button>`;
  return `<button class="conn-row" data-conn="${c.id}" data-act="open">
    <div class="conn-ico" style="background:${esc(c.color)}">${esc(c.icon || c.name.trim()[0])}</div>
    <div class="conn-meta"><b>${esc(c.name)}</b><p>${esc(c.tagline)}</p></div>
    <div class="conn-right">${right}</div>
  </button>`;
}

function renderConnectorList() {
  const q = connQuery;
  const list = connectors.filter((c) =>
    !q || (c.name + " " + c.tagline + " " + (c.category || "")).toLowerCase().includes(q));
  const conn = list.filter((c) => c.state === "connected");
  const avail = list.filter((c) => c.state !== "connected");
  $("#conn-connected").innerHTML = conn.length
    ? conn.map(connRow).join("")
    : `<div class="conn-empty">Nothing connected yet — pick one below to get started.</div>`;
  $("#conn-available").innerHTML = avail.length
    ? avail.map(connRow).join("")
    : `<div class="conn-empty">No connectors match “${esc(connQuery)}”.</div>`;
  bindConnRows($("#dtab-connectors"));
}
$("#conn-search").addEventListener("input", (e) => { connQuery = e.target.value.toLowerCase(); renderConnectorList(); });

function bindConnRows(scope) {
  scope.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", async (e) => {
    e.stopPropagation();
    const c = connectors.find((x) => x.id === b.dataset.conn);
    if (!c) return;
    const act = b.dataset.act;
    if (act === "connect") openPermModal(c);
    else if (act === "open") openConnectorDetail(c.id);
  }));
}

function showConnList() {
  detailId = null;
  $("#conn-detail-view").hidden = true;
  $("#conn-list-view").hidden = false;
}
$("#conn-back").addEventListener("click", showConnList);

function openConnectorDetail(id) {
  detailId = id;
  $("#conn-list-view").hidden = true;
  $("#conn-detail-view").hidden = false;
  renderConnectorDetail();
}

function relTime(ts) {
  if (!ts) return "never";
  const s = (Date.now() - ts * 1000) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function renderConnectorDetail() {
  const c = connectors.find((x) => x.id === detailId);
  if (!c) return;
  const el = $("#conn-detail");
  const [label, pill] = [stateLabel(c), statePill(c)];

  const credFormHTML = `<div class="cred-form" id="cd-credform">
      ${c.cred_fields.map((f) => `<label><b>${esc(f.label)}</b>
        <input data-key="${esc(f.key)}" type="${f.secret ? "password" : "text"}" autocomplete="off"
               placeholder="${esc(f.placeholder || f.help || "")}">
        ${f.help ? `<span class="muted small">${esc(f.help)}</span>` : ""}</label>`).join("")}
      <button class="btn-primary" id="cd-save-creds">Save &amp; test connection</button>
    </div>`;
  let authHTML = "";
  if (c.state === "available") {
    authHTML = `<button class="btn-primary" id="cd-connect">Connect ${esc(c.name)}</button>`;
  } else if (c.auth_kind === "google_oauth" && c.needs_oauth) {
    authHTML = `${c.has_credentials ? "" : credFormHTML}
      <button class="btn-primary" id="cd-google">🔑 Connect with Google</button>
      <p class="muted small">Sign in with your Google account in a popup. OS only gets the scopes you granted above.</p>`;
  } else if (!c.has_credentials) {
    authHTML = credFormHTML;
  }

  const statusNote = c.state === "setup_error" && c.health_msg
    ? `<div class="callout err">⚠️ ${esc(c.health_msg)}</div>` : "";
  const noteCls = /paid|review|approval|limited/i.test(c.note || "") ? "callout warn" : "callout ok";

  el.innerHTML = `
    <div class="cd-head">
      <div class="conn-ico lg" style="background:${esc(c.color)}">${esc(c.icon || c.name.trim()[0])}</div>
      <div class="grow"><h3>${esc(c.name)}</h3><p class="muted">${esc(c.tagline)}</p></div>
      <span class="${pill}">${label}</span>
    </div>
    ${statusNote}
    <div class="callout ${c.has_credentials ? "ok" : "warn"}">
      ${c.has_credentials ? "🔒 Credentials saved &amp; encrypted on this machine." : "🔓 No credentials saved yet."}
      ${c.health_at ? ` Last checked ${relTime(c.health_at)}.` : ""}
      ${c.last_used_at ? ` Last used ${relTime(c.last_used_at)}.` : ""}
    </div>

    <h4>Permissions</h4>
    <ul class="scope-list">${c.scopes.map((s) => `<li>✓ ${esc(s)}</li>`).join("")}</ul>
    ${c.state === "available" ? "" : `<div class="btn-row"><button class="btn-ghost" id="cd-revoke">Revoke access</button></div>`}

    <h4>Setup</h4>
    <div class="callout ${noteCls}">${esc(c.note || "")} ${c.docs_url ? `<a href="${esc(c.docs_url)}" target="_blank" rel="noopener">Docs ↗</a>` : ""}</div>
    <ol class="setup-steps">${c.setup_steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    ${authHTML}

    ${c.has_credentials ? `<div class="btn-row">
      <button class="btn-ghost" id="cd-test">↻ Test connection</button>
      <button class="btn-danger-ghost" id="cd-revoke2">Revoke &amp; delete credentials</button>
    </div>` : ""}

    ${c.has_credentials && c.defaults && c.defaults.length ? `<h4>Defaults</h4>
      <div class="cred-form" id="cd-defaults">
      ${c.defaults.map((d) => `<label><b>${esc(d.label)}</b>
        <input data-key="${esc(d.key)}" placeholder="${esc(d.placeholder || "")}"></label>`).join("")}
      <button class="btn-ghost" id="cd-save-defaults">Save defaults</button>
      </div>` : ""}

    ${c.try_it && c.try_it.length ? `<h4>Try it</h4>
      <p class="muted small">Send one of these in chat — OS does the real thing.</p>
      <div class="try-list">${c.try_it.map((t) =>
        `<button class="try-chip" data-try="${esc(t)}">“${esc(t)}”</button>`).join("")}</div>` : ""}

    ${c.has_credentials && c.actions && c.actions.length ? `<h4>What OS can do here</h4>
      <ul class="action-list">${c.actions.map((a) =>
        `<li><b>${esc(a.label)}</b><span class="muted small"> — ${esc(a.description)}</span>
         ${a.needs_approval ? `<span class="pill pill-granted">asks approval</span>` : `<span class="pill">reads only</span>`}</li>`).join("")}</ul>` : ""}
  `;

  const rerender = () => loadConnectors();
  const q = (s) => el.querySelector(s);
  if (q("#cd-connect")) q("#cd-connect").addEventListener("click", () => openPermModal(c));
  if (q("#cd-google")) q("#cd-google").addEventListener("click", async () => {
    try {
      const r = await api(`/api/connectors/${c.id}/oauth/start`);
      window.open(r.url, "_blank", "width=520,height=680");
    } catch (e) { toast("Couldn't start Google sign-in: " + e.message); }
  });
  if (q("#cd-save-creds")) q("#cd-save-creds").addEventListener("click", async () => {
    const fields = {};
    el.querySelectorAll("#cd-credform input").forEach((i) => { fields[i.dataset.key] = i.value; });
    if (Object.values(fields).some((v) => !v.trim())) { toast("Fill every field"); return; }
    try {
      const r = await api(`/api/connectors/${c.id}/credentials`, {
        method: "POST", body: JSON.stringify({ label: c.name, fields }),
      });
      toast(r.status.state === "connected" ? `${c.name} connected ✓` : `Saved — ${r.status.health_msg || r.status.state}`);
    } catch (e) { toast("Couldn't save: " + e.message); }
    rerender(); refreshChips();
  });
  const doRevoke = async () => {
    if (!confirm(`Revoke OS access to ${c.name}?`)) return;
    await api(`/api/connectors/${c.id}/revoke`, { method: "POST" });
    toast(`${c.name} revoked`); rerender(); refreshChips();
  };
  if (q("#cd-revoke")) q("#cd-revoke").addEventListener("click", doRevoke);
  if (q("#cd-revoke2")) q("#cd-revoke2").addEventListener("click", doRevoke);
  if (q("#cd-test")) q("#cd-test").addEventListener("click", async () => {
    const r = await api(`/api/connectors/${c.id}/test`, { method: "POST" });
    toast(r.status.state === "connected" ? "Connection healthy ✓" : `Failed: ${r.status.health_msg}`);
    rerender();
  });
  if (q("#cd-save-defaults")) q("#cd-save-defaults").addEventListener("click", async () => {
    const defaults = {};
    el.querySelectorAll("#cd-defaults input").forEach((i) => { if (i.value.trim()) defaults[i.dataset.key] = i.value.trim(); });
    await api(`/api/connectors/${c.id}/settings`, { method: "POST", body: JSON.stringify({ settings: defaults }) });
    toast("Defaults saved");
  });
  // prefill saved defaults
  if (c.has_credentials && c.defaults && c.defaults.length) {
    api(`/api/connectors/${c.id}/settings`).then((s) => {
      const saved = s.settings || {};
      el.querySelectorAll("#cd-defaults input").forEach((i) => { if (saved[i.dataset.key]) i.value = saved[i.dataset.key]; });
    }).catch(() => {});
  }
  el.querySelectorAll("[data-try]").forEach((b) => b.addEventListener("click", () => {
    closeSettings(); switchView("chat"); sendMessage(b.dataset.try);
  }));
}

/* permission ask */
function openPermModal(c) {
  permTarget = c;
  $("#perm-title").textContent = `Connect ${c.name}?`;
  $("#perm-sub").textContent = "OS will only ever use what you check below.";
  $("#perm-scopes").innerHTML = c.scopes.map((s) =>
    `<label><input type="checkbox" checked value="${esc(s)}"> ${esc(s)}</label>`).join("");
  $("#perm-modal").hidden = false;
}
$("#perm-deny").addEventListener("click", async () => {
  if (permTarget) await api(`/api/connectors/${permTarget.id}/deny`, { method: "POST" });
  $("#perm-modal").hidden = true; permTarget = null;
  loadConnectors(); toast("Denied — nothing was shared");
});
$("#perm-allow").addEventListener("click", async () => {
  const scopes = $$("#perm-scopes input:checked").map((i) => i.value);
  if (!scopes.length) { toast("Grant at least one permission"); return; }
  const target = permTarget;
  await api(`/api/connectors/${target.id}/grant`, {
    method: "POST", body: JSON.stringify({ scopes }),
  });
  $("#perm-modal").hidden = true; permTarget = null;
  toast(`${target.name}: permission granted`);
  loadConnectors();
  openConnectorDetail(target.id);
});

/* ---------------- execution cards in chat ---------------- */
function executionCardHTML(ex, approval) {
  const st = ex.status;
  if (st === "needs_connection") {
    const cid = ex.connector_id, c = connectors.find((x) => x.id === cid);
    const name = c ? c.name : ex.service;
    return `<div class="exec-card needs-conn">
      <div class="exec-head">🔌 <b>${esc(name)}</b> isn't connected</div>
      <p>${esc(ex.error || "")}</p>
      <button class="btn-primary btn-sm" data-exec-conn="${esc(cid)}">Connect ${esc(name)}</button>
    </div>`;
  }
  if (st === "needs_info") {
    return `<div class="exec-card needs-info">
      <div class="exec-head">🤔 <b>One thing missing</b></div>
      <p>To ${esc(ex.label || "do that")} I still need: <b>${esc((ex.missing || []).join(", "))}</b>.</p>
    </div>`;
  }
  if (st === "pending_approval") {
    const a = approval || {};
    const params = a.params || {};
    const rows = Object.entries(params).map(([k, v]) =>
      `<div class="kv"><span>${esc(k)}</span><b>${esc(String(v)).slice(0, 80)}</b></div>`).join("");
    return `<div class="exec-card pending">
      <div class="exec-head">🛡 <b>Waiting for approval</b></div>
      <p><b>${esc(ex.label || "")}</b> — on <b>${esc(ex.service || "")}</b>. Nothing has run yet.</p>
      ${rows ? `<div class="exec-params">${rows}</div>` : ""}
      <div class="btn-row">
        <button class="btn-primary btn-sm" data-exec-approve="${esc(a.id || "")}">Approve &amp; run</button>
        <button class="btn-danger-ghost btn-sm" data-exec-reject="${esc(a.id || "")}">Reject</button>
      </div>
    </div>`;
  }
  if (st === "done") {
    return `<div class="exec-card done">
      <div class="exec-head">✅ <b>${esc(ex.label || "Done")}</b></div>
      ${ex.summary ? `<p>${esc(ex.summary)}</p>` : ""}
    </div>`;
  }
  return `<div class="exec-card err">
    <div class="exec-head">⚠️ <b>Couldn't do that</b></div>
    <p>${esc(ex.error || "Unknown error")}</p>
  </div>`;
}

function bindExecutionCard(scope, ev) {
  scope.querySelectorAll("[data-exec-conn]").forEach((b) => b.addEventListener("click", () => {
    openSettings("connectors"); openConnectorDetail(b.dataset.execConn);
  }));
  scope.querySelectorAll("[data-exec-approve]").forEach((b) => b.addEventListener("click", async () => {
    try {
      const r = await api(`/api/actions/${b.dataset.execApprove}/approve`, { method: "POST" });
      b.closest(".exec-card").outerHTML = executionCardHTML({ status: "done", label: r.label || "Approved", summary: r.summary }, null);
      toast("Approved — ran ✓");
    } catch (e) { toast("Approve failed: " + e.message); }
    refreshActionRail();
  }));
  scope.querySelectorAll("[data-exec-reject]").forEach((b) => b.addEventListener("click", async () => {
    try {
      await api(`/api/actions/${b.dataset.execReject}/reject`, { method: "POST" });
      b.closest(".exec-card").outerHTML = `<div class="exec-card err"><div class="exec-head">🗑 <b>Rejected</b></div><p>Nothing ran.</p></div>`;
      toast("Rejected — nothing ran");
    } catch (e) { toast("Reject failed: " + e.message); }
    refreshActionRail();
  }));
}

/* ---------------- connector action approval rail ---------------- */
async function refreshActionRail() {
  try {
    const { pending } = await api("/api/actions/pending");
    const card = $("#action-approval-card");
    if (!pending.length) { card.hidden = true; return; }
    card.hidden = false;
    const a = pending[pending.length - 1];
    const rows = Object.entries(a.params || {}).map(([k, v]) =>
      `<div class="kv"><span>${esc(k)}</span><b>${esc(String(v)).slice(0, 80)}</b></div>`).join("");
    $("#action-approval-body").innerHTML = `
      <div class="aa-row"><b>${esc(a.connector_name || a.connector_id)}</b>
        <span class="pill pill-granted">${esc(a.action_label)}</span></div>
      <p class="muted">${esc(a.summary)}</p>
      ${rows ? `<div class="exec-params">${rows}</div>` : ""}
      <div class="btn-row">
        <button class="btn-primary btn-sm" data-aa="approve" data-aid="${a.id}">Approve &amp; run</button>
        <button class="btn-danger-ghost btn-sm" data-aa="reject" data-aid="${a.id}">Reject</button>
      </div>`;
  } catch {}
}
$("#action-approval-card").addEventListener("click", async (e) => {
  const b = e.target.closest("[data-aa]");
  if (!b) return;
  if (b.id === "action-approval-close") { $("#action-approval-card").hidden = true; return; }
  const aid = b.dataset.aid;
  try {
    if (b.dataset.aa === "approve") {
      await api(`/api/actions/${aid}/approve`, { method: "POST" });
      toast("Approved — ran ✓");
    } else {
      await api(`/api/actions/${aid}/reject`, { method: "POST" });
      toast("Rejected — nothing ran");
    }
  } catch (err) { toast("Failed: " + err.message); }
  refreshActionRail();
});
$("#action-approval-close").addEventListener("click", () => { $("#action-approval-card").hidden = true; });

/* ---------------- smart chips from connected connectors ---------------- */
async function refreshChips() {
  try {
    const { connectors: list } = await api("/api/connectors");
    connectors = list;
    const cmds = [];
    for (const c of list) {
      if (c.state === "connected" && c.try_it && c.try_it.length) cmds.push(c.try_it[0]);
      if (cmds.length >= 4) break;
    }
    const el = $("#chips");
    if (!cmds.length) return; // keep the defaults in HTML
    el.innerHTML = cmds.map((cmd) =>
      `<button data-chip="${esc(cmd)}">${esc(cmd.length > 34 ? cmd.slice(0, 33) + "…" : cmd)}</button>`).join("");
    el.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => { if (b.dataset.chip) sendMessage(b.dataset.chip); }));
  } catch {}
}

/* ---------------- OAuth callback page ---------------- */

/* ---------------- command palette ---------------- */
const paletteItems = [
  ["💬 Go to Chat", "chat"], ["☑ Go to Tasks", "tasks"], ["📅 Go to Calendar", "calendar"],
  ["📁 Go to Projects", "projects"], ["🧠 Go to Memory", "memory"], ["🛠 Go to Skills", "skills"],
  ["🔔 Go to Watchers", "watchers"], ["🗂 Go to Files", "files"], ["📊 Go to Analytics", "analytics"],
  ["🔌 Go to Connectors", "connectors"],
  ["✒ Draft a LinkedIn post", null, "draft a linkedin post about shipping early"],
  ["🧠 Remember something", null, null, "remember that "],
];
function openPalette() {
  $("#palette").hidden = false;
  $("#palette-input").value = "";
  renderPalette("");
  setTimeout(() => $("#palette-input").focus(), 30);
}
function renderPalette(q) {
  const el = $("#palette-results");
  el.innerHTML = "";
  for (const [label, view, prompt, prefill] of paletteItems) {
    if (q && !label.toLowerCase().includes(q.toLowerCase())) continue;
    const b = document.createElement("button");
    b.className = "palette-item";
    b.textContent = label;
    b.addEventListener("click", () => {
      $("#palette").hidden = true;
      if (view) switchView(view);
      else if (prompt) { switchView("chat"); sendMessage(prompt); }
      else if (prefill) { switchView("chat"); $("#chat-input").value = prefill; $("#chat-input").focus(); }
    });
    el.appendChild(b);
  }
}
$("#open-palette").addEventListener("click", openPalette);
$("#palette-input").addEventListener("input", (e) => renderPalette(e.target.value));
$("#palette").addEventListener("click", (e) => { if (e.target.id === "palette") $("#palette").hidden = true; });
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
  if (e.key === "Escape") $$(".modal-backdrop").forEach((m) => (m.hidden = true));
});

/* ---------------- boot ---------------- */
loadMe();
refreshBadges();
refreshApprovalRail();
refreshActionRail();
refreshChips();
setInterval(() => { refreshBadges(); refreshActionRail(); }, 30000);
