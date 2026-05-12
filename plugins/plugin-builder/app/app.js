const summaryView = document.querySelector('[data-view="summary"]');
const detailView = document.querySelector('[data-view="detail"]');
const detailContent = document.querySelector("#detail-content");
const backButton = document.querySelector("#back-button");
const pluginTitle = document.querySelector("#plugin-title");
const pluginDescription = document.querySelector("#plugin-description");
const skillsList = document.querySelector("#skills-list");
const appsList = document.querySelector("#apps-list");
const mcpList = document.querySelector("#mcp-list");
const skillsSection = document.querySelector("#skills-section");
const appsSection = document.querySelector("#apps-section");
const mcpSection = document.querySelector("#mcp-section");
const marketplacesList = document.querySelector("#marketplaces-list");
const localDetails = document.querySelector("#local-details");
const viewButton = document.querySelector("#view-plugin");
const shareButton = document.querySelector("#share-plugin");

const state = {
  detail: null,
  model: readModel(),
};
let nextRpcId = 1;
const pendingRpc = new Map();

function decodePayload(raw) {
  if (raw == null) {
    return null;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return typeof raw === "object" ? raw : null;
}

function modelFromPayload(raw) {
  const payload = decodePayload(raw);
  if (payload == null) {
    return null;
  }
  if (payload.plugin && Array.isArray(payload.skills)) {
    return payload;
  }
  if (payload.structuredContent) {
    return modelFromPayload(payload.structuredContent);
  }
  if (Array.isArray(payload.content)) {
    for (const item of payload.content) {
      const found = modelFromPayload(item?.text ?? item);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function readModel() {
  return (
    modelFromPayload(window.openai?.toolOutput) ??
    modelFromPayload(window.openai?.toolResponseMetadata) ?? {
      plugin: {
        displayName: "Plugin summary unavailable",
        description: "Codex did not receive plugin summary data for this app.",
        viewUrl: null,
        shareUrl: null,
      },
      skills: [],
      apps: [],
      mcpServers: [],
      marketplaces: [],
      localDetails: [],
    }
  );
}

function text(value) {
  return value == null || value === "" ? "Not provided" : String(value);
}

function clear(element) {
  element.innerHTML = "";
}

function sendMcpAppMessage(message) {
  if (window.parent === window) {
    return;
  }
  window.parent.postMessage(message, "*");
}

function requestMcpApp(method, params) {
  const id = nextRpcId;
  nextRpcId += 1;

  const promise = new Promise((resolve, reject) => {
    pendingRpc.set(id, { reject, resolve });
    window.setTimeout(() => {
      const pending = pendingRpc.get(id);
      if (!pending) {
        return;
      }
      pendingRpc.delete(id);
      reject(new Error(`${method} timed out.`));
    }, 5000);
  });

  sendMcpAppMessage({
    id,
    jsonrpc: "2.0",
    method,
    params,
  });
  return promise;
}

function notifyMcpApp(method, params = {}) {
  sendMcpAppMessage({
    jsonrpc: "2.0",
    method,
    params,
  });
}

async function connectMcpApp() {
  try {
    await requestMcpApp("ui/initialize", {
      appCapabilities: {
        availableDisplayModes: ["inline", "fullscreen"],
      },
      appInfo: {
        name: "Plugin Builder",
        version: "0.1.0",
      },
      protocolVersion: "2026-01-26",
    });
    notifyMcpApp("ui/notifications/initialized");
    await requestMcpApp("ui/request-display-mode", {
      mode: "fullscreen",
    });
  } catch {
    // The inline summary remains useful if the host does not open a side panel.
  }
}

function openCodexLink(href) {
  if (typeof href !== "string" || href.length === 0) {
    return;
  }
  window.openai?.openExternal?.({ href });
}

function renderResourceList(element, items, kind) {
  clear(element);

  for (const item of items) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "resource-row";
    button.dataset.kind = kind;
    button.dataset.id = item.id;
    button.innerHTML = [
      `<span class="resource-icon" aria-hidden="true">${resourceIcon(kind)}</span>`,
      `<span class="resource-copy">`,
      `  <span class="resource-name">${escapeHtml(text(item.title))}</span>`,
      `  <span class="resource-summary">${escapeHtml(text(item.summary))}</span>`,
      `</span>`,
      `<span class="resource-chevron" aria-hidden="true">›</span>`,
    ].join("");
    button.addEventListener("click", () => showDetail(kind, item.id));
    element.append(button);
  }
}

function renderMetaList(element, items) {
  clear(element);
  if (items.length === 0) {
    element.append(createEmptyRow("Nothing to show here yet."));
    return;
  }
  for (const item of items) {
    const row = document.createElement("div");
    row.className = "meta-row";
    row.innerHTML = [
      `<span class="meta-copy">`,
      `  <span class="meta-label">${escapeHtml(text(item.label))}</span>`,
      `  <span class="meta-value">${escapeHtml(text(item.value))}</span>`,
      `</span>`,
      `<button class="copy-button" type="button" aria-label="Copy ${escapeHtml(text(item.label))}" title="Copy">`,
      copyIcon(),
      `</button>`,
    ].join("");
    row.querySelector(".copy-button")?.addEventListener("click", () => {
      copyText(text(item.value));
    });
    element.append(row);
  }
}

function renderSummary() {
  state.model = readModel();
  const model = state.model;
  pluginTitle.textContent = text(model.plugin.displayName);
  pluginDescription.textContent = text(model.plugin.description);
  viewButton.disabled = !model.plugin.viewUrl;
  shareButton.disabled = !model.plugin.shareUrl;
  renderResourceSection(skillsSection, skillsList, model.skills, "skills");
  renderResourceSection(appsSection, appsList, model.apps, "apps");
  renderResourceSection(mcpSection, mcpList, model.mcpServers, "mcpServers");
  renderMetaList(marketplacesList, model.marketplaces);
  renderMetaList(localDetails, model.localDetails);
}

function renderResourceSection(section, list, items, kind) {
  section.hidden = items.length === 0;
  if (items.length === 0) {
    clear(list);
    return;
  }
  renderResourceList(list, items, kind);
}

function showDetail(kind, id) {
  const detail =
    kind === "skills"
      ? state.model.skills.find((item) => item.id === id)
      : kind === "apps"
        ? state.model.apps.find((item) => item.id === id)
        : state.model.mcpServers.find((item) => item.id === id);

  if (!detail) {
    return;
  }

  state.detail = { kind, item: detail };
  summaryView.hidden = true;
  detailView.hidden = false;
  detailContent.innerHTML = detailMarkup(state.detail);
}

function hideDetail() {
  state.detail = null;
  detailView.hidden = true;
  summaryView.hidden = false;
}

function detailMarkup(detail) {
  const item = detail.item;
  const title =
    detail.kind === "skills"
      ? escapeHtml(text(item.title))
      : escapeHtml(text(item.title));
  const kicker =
    detail.kind === "skills"
      ? "Skill"
      : detail.kind === "apps"
        ? "Plugin app"
        : "MCP server";
  const blocks =
    detail.kind === "skills"
      ? skillDetailBlocks(item)
      : detail.kind === "apps"
        ? appDetailBlocks(item)
        : mcpDetailBlocks(item);

  return `
    <article class="detail-sheet">
      <header class="detail-header">
        <span class="detail-kicker">${escapeHtml(kicker)}</span>
        <h2 class="detail-title">${title}</h2>
        <p class="detail-copy">${escapeHtml(text(item.summary))}</p>
        ${detail.kind === "skills" ? skillSourceRow(item) : ""}
      </header>
      <div class="detail-sections">${blocks}</div>
    </article>
  `;
}

function skillDetailBlocks(item) {
  const headings =
    item.headings?.length > 0
      ? `<ul>${item.headings
          .map((heading) => `<li>${escapeHtml(text(heading))}</li>`)
          .join("")}</ul>`
      : "<p>No headings detected in this skill body.</p>";
  return [
    detailBlock("Summary", `<p>${escapeHtml(text(item.frontmatterSummary))}</p>`),
    detailBlock("Sections", headings),
    detailBlock("Preview", `<p>${escapeHtml(text(item.preview))}</p>`),
  ].join("");
}

function appDetailBlocks(item) {
  return [
    detailBlock("Definition", `<code class="detail-code">${escapeHtml(text(item.pathLabel))}</code>`),
    detailBlock("App id", `<p>${escapeHtml(text(item.appId))}</p>`),
  ].join("");
}

function mcpDetailBlocks(item) {
  return [
    detailBlock("Definition", `<code class="detail-code">${escapeHtml(text(item.pathLabel))}</code>`),
    detailBlock("Command", `<code class="detail-code">${escapeHtml(text(item.commandLabel))}</code>`),
  ].join("");
}

function detailBlock(title, body) {
  return `
    <section class="detail-block">
      <h3>${escapeHtml(title)}</h3>
      ${body}
    </section>
  `;
}

function skillSourceRow(item) {
  return `
    <div class="source-row">
      <span class="source-label">SKILL.md</span>
      <code class="source-path">${escapeHtml(text(item.pathLabel))}</code>
    </div>
  `;
}

function resourceIcon(kind) {
  if (kind === "skills") {
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M6 4h9l3 3v13H6z"></path>
        <path d="M15 4v4h4"></path>
        <path d="M9 12h6"></path>
        <path d="M9 16h6"></path>
      </svg>
    `;
  }
  if (kind === "apps") {
    return `
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="14" rx="2"></rect>
        <path d="M4 9h16"></path>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="12" r="2.5"></circle>
      <circle cx="18" cy="7" r="2.5"></circle>
      <circle cx="18" cy="17" r="2.5"></circle>
      <path d="m8.2 11 7.3-3"></path>
      <path d="m8.2 13 7.3 3"></path>
    </svg>
  `;
}

function copyIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="11" height="11" rx="2"></rect>
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
    </svg>
  `;
}

async function copyText(value) {
  try {
    await navigator.clipboard?.writeText?.(value);
  } catch {
    // Copy is a convenience affordance; the visible text remains selectable.
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

viewButton.addEventListener("click", () => {
  openCodexLink(state.model.plugin.viewUrl);
});
shareButton.addEventListener("click", () => {
  openCodexLink(state.model.plugin.shareUrl);
});
backButton.addEventListener("click", hideDetail);

window.addEventListener("message", (event) => {
  const message = event.data;
  if (
    !message ||
    message.jsonrpc !== "2.0" ||
    !pendingRpc.has(message.id) ||
    (!("result" in message) && !("error" in message))
  ) {
    return;
  }

  const pending = pendingRpc.get(message.id);
  pendingRpc.delete(message.id);
  if (message.error) {
    pending.reject(new Error(message.error.message || "MCP app request failed."));
    return;
  }
  pending.resolve(message.result || {});
});

window.addEventListener("openai:set_globals", renderSummary);

renderSummary();
connectMcpApp();
