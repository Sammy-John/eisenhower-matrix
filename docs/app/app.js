/* Eisenhower Scratchpad
   - Drag tasks between zones
   - Click task to toggle completed
   - Clear completed removes strikethrough tasks
   - LocalStorage persistence
*/

const STORAGE_KEY = "eisenhower_scratchpad_v1";

const ZONES = ["unassigned", "do", "schedule", "delegate", "eliminate"];

const TAGS = {
  light:   { label: "Light Build",   className: "tag-light" },
  deep:    { label: "Deep Build",    className: "tag-deep" },
  open:    { label: "Open",          className: "tag-open" },
  learning:{ label: "Learning",      className: "tag-learning" },
  planning:{ label: "Planning",      className: "tag-planning" },
};

let state = loadState();

const els = {
  form: document.getElementById("taskForm"),
  tag: document.getElementById("taskTag"),
  text: document.getElementById("taskText"),
  clearBtn: document.getElementById("clearCompletedBtn"),
  zones: [...document.querySelectorAll(".dropzone")],
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.tasks)) return { tasks: [] };

    // Basic hygiene
    parsed.tasks = parsed.tasks
      .filter(t => t && typeof t.id === "string")
      .map(t => ({
        id: t.id,
        text: String(t.text || "").slice(0, 120),
        tag: TAGS[t.tag] ? t.tag : "light",
        zone: ZONES.includes(t.zone) ? t.zone : "unassigned",
        completed: Boolean(t.completed),
        createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now(),
      }));

    return parsed;
  } catch {
    return { tasks: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sortByCreatedAt(a, b) {
  return a.createdAt - b.createdAt;
}

function getTasksInZone(zone) {
  return state.tasks.filter(t => t.zone === zone).sort(sortByCreatedAt);
}

function render() {
  // Clear all zones
  els.zones.forEach(z => (z.innerHTML = ""));

  // Render tasks into their zones
  for (const zone of ZONES) {
    const zoneEl = document.querySelector(`.dropzone[data-zone="${zone}"]`);
    if (!zoneEl) continue;

    const tasks = getTasksInZone(zone);
    if (tasks.length === 0) continue;

    tasks.forEach(task => zoneEl.appendChild(renderTask(task)));
  }
}

function renderTask(task) {
  const wrap = document.createElement("div");
  wrap.className = `task${task.completed ? " completed" : ""}`;
  wrap.draggable = true;
  wrap.dataset.taskId = task.id;

  const main = document.createElement("div");
  main.className = "task-main";

  const badge = document.createElement("span");
  const tagMeta = TAGS[task.tag] || TAGS.light;
  badge.className = `badge ${tagMeta.className}`;
  badge.textContent = tagMeta.label;

  const text = document.createElement("div");
  text.className = "task-text";
  text.textContent = task.text;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const doneBox = document.createElement("div");
  doneBox.className = "done-indicator";
  doneBox.setAttribute("aria-hidden", "true");

  actions.appendChild(doneBox);

  main.appendChild(badge);
  main.appendChild(text);

  wrap.appendChild(main);
  wrap.appendChild(actions);

  // Click toggles completion (but don't interfere with drag start)
  wrap.addEventListener("click", (e) => {
    // If user was dragging, ignore click.
    if (wrap.dataset.dragging === "1") return;
    toggleCompleted(task.id);
  });

  wrap.addEventListener("dragstart", (e) => {
    wrap.dataset.dragging = "1";
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    // Small delay to allow click vs drag
    setTimeout(() => {
      wrap.classList.add("dragging");
    }, 0);
  });

  wrap.addEventListener("dragend", () => {
    wrap.dataset.dragging = "0";
    wrap.classList.remove("dragging");
  });

  return wrap;
}

function addTask(tag, text) {
  const cleaned = text.trim();
  if (!cleaned) return;

  state.tasks.push({
    id: uid(),
    text: cleaned.slice(0, 120),
    tag: TAGS[tag] ? tag : "light",
    zone: "unassigned",
    completed: false,
    createdAt: Date.now(),
  });

  saveState();
  render();
}

function toggleCompleted(taskId) {
  const t = state.tasks.find(x => x.id === taskId);
  if (!t) return;
  t.completed = !t.completed;
  saveState();
  render();
}

function moveTask(taskId, zone) {
  const t = state.tasks.find(x => x.id === taskId);
  if (!t) return;
  if (!ZONES.includes(zone)) return;
  t.zone = zone;
  saveState();
  render();
}

function clearCompleted() {
  const before = state.tasks.length;
  state.tasks = state.tasks.filter(t => !t.completed);
  const after = state.tasks.length;

  if (before !== after) {
    saveState();
    render();
  }
}

/* Dropzone handlers */
function setupDnD() {
  els.zones.forEach(zoneEl => {
    zoneEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      zoneEl.classList.add("drag-over");
      e.dataTransfer.dropEffect = "move";
    });

    zoneEl.addEventListener("dragleave", () => {
      zoneEl.classList.remove("drag-over");
    });

    zoneEl.addEventListener("drop", (e) => {
      e.preventDefault();
      zoneEl.classList.remove("drag-over");
      const taskId = e.dataTransfer.getData("text/plain");
      const zone = zoneEl.dataset.zone;
      if (taskId && zone) moveTask(taskId, zone);
    });
  });
}

/* Form handlers */
els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(els.tag.value, els.text.value);
  els.text.value = "";
  els.text.focus();
});

els.clearBtn.addEventListener("click", () => {
  clearCompleted();
});

/* Init */
setupDnD();
render();
