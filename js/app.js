import { units, missions } from "../data/content.js";
import { loadProgress, saveProgress, addXP, practiceToday } from "./storage.js";

const state = { progress: loadProgress(), route: "home" };

const screen = document.querySelector("#screen");
const toast = document.querySelector("#toast");

function esc(s) { return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])) }
function notify(text) {
  toast.textContent = text; toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}
function headerStats() {
  document.querySelector("#streakValue").textContent = state.progress.streak;
  document.querySelector("#xpValue").textContent = state.progress.xp;
}
function commit() { saveProgress(state.progress); headerStats() }

function renderHome() {
  const p = state.progress;
  const dailyDone = p.missionProgress.tuning >= 2;
  screen.innerHTML = `
    <section class="hero">
      <div class="eyebrow">Tu actividad de hoy</div>
      <h1>Entrena tu voz, como un Profesional</h1>
      <p>${p.streak ? `Vas ${p.streak} día${p.streak === 1 ? "" : "s"} de racha  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
              viewBox="0 0 24 24">
              <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
              <path
                d="M17.55 7.17c-.29-.19-.65-.22-.97-.08-.31.14-.53.44-.58.78 0 .01-.08.57-.38 1.28-.06-.81-.27-1.69-.73-2.6-1.07-2.14-4.2-4.29-4.33-4.38a1 1 0 0 0-1.04-.04c-.33.18-.53.54-.52.92 0 .02.02 1.83-2.48 4.33C4.22 9.68 3 12.19 3 14.64 3 18.12 5.46 22 9 22c.38 0 .73-.21.89-.55s.13-.74-.09-1.05c-1.2-1.6-1.04-3.09-.55-4.21C9.95 19.75 12.09 22 15 22s6-1.96 6-7.5c0-4.98-3.31-7.24-3.45-7.33M15 20c-2.39 0-4-2.61-4-6.5 0-.39-.23-.75-.59-.91a1 1 0 0 0-.41-.09c-.24 0-.47.08-.66.25-1.28 1.12-2.99 3.64-2.3 6.49-1.23-1.02-2.05-2.9-2.05-4.59 0-1.9 1.02-3.93 2.94-5.85 1.59-1.59 2.36-2.99 2.73-4.03.91.76 1.99 1.78 2.44 2.69.72 1.43.71 2.87-.03 4.66-.16.39-.06.85.26 1.13s.78.33 1.15.12c1.65-.93 2.53-2.36 3-3.49.71.9 1.51 2.42 1.51 4.62 0 5.1-3.06 5.5-4 5.5Z">
              </path>
            </svg>. ¡No la pierdas!` : "Empieza hoy y construye tu primera racha."}</p>
      <button class="btn btn-primary" data-action="continue">Seguir entrenamiento →</button>
    </section>

    <div class="section-title"><h2><svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
fill="currentColor" viewBox="0 0 24 24" >
<!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
<path d="M14.59 6.59c-.78.78-.78 2.05 0 2.83s2.05.78 2.83 0 .78-2.05 0-2.83-2.05-.78-2.83 0M5 16c-2 1-2 5-2 5s3 0 5-2z"></path><path d="M21 2h-3.69c-2.4 0-4.66.94-6.36 2.64L8.69 6.9a8.4 8.4 0 0 0-6.24 1.27c-.25.17-.41.44-.44.73s.08.59.29.81l12 12c.2.2.45.29.71.29s.51-.1.71-.29c1.9-1.9 1.6-5.08 1.38-6.38l2.28-2.28c1.7-1.7 2.64-3.96 2.64-6.36V3c0-.55-.45-1-1-1Zm-1 4.69c0 1.87-.73 3.63-2.05 4.95l-2.66 2.66c-.25.25-.35.61-.26.95.19.79.45 2.78-.17 4.2L4.65 9.24c2.11-.89 3.94-.32 4.03-.29.36.12.76.03 1.02-.24l2.66-2.66A6.96 6.96 0 0 1 17.31 4H20z"></path>
</svg> Misiones de hoy</h2><span class="muted">${dailyDone ? "Completadas" : "En progreso"}</span></div>
    <div class="mission-grid">${missions.map(m => {
    const val = p.missionProgress[m.id] || 0, pct = Math.min(100, val / m.target * 100);
    return `<div class="card mission"><div class="mission-icon">${m.icon}</div><div class="mission-info"><strong>${m.title}</strong><span class="muted">${Math.min(val, m.target)}/${m.target} · +${m.reward} XP</span><div class="progress"><span style="width:${pct}%"></span></div></div></div>`
  }).join("")}</div>

    <div class="section-title"><h2><svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
fill="currentColor" viewBox="0 0 24 24" >
<!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
<path d="M16 11a1 1 0 1 0 0 2 1 1 0 1 0 0-2m2-2a1 1 0 1 0 0 2 1 1 0 1 0 0-2m-2-2a1 1 0 1 0 0 2 1 1 0 1 0 0-2m-2 2a1 1 0 1 0 0 2 1 1 0 1 0 0-2M8 8a2 2 0 1 0 0 4 2 2 0 1 0 0-4"></path><path d="M17 4H7C4.24 4 2 6.24 2 9v7.88a3.124 3.124 0 0 0 5.33 2.21l1.96-1.96c1.45-1.45 3.97-1.45 5.41 0l1.96 1.96c.59.59 1.37.91 2.21.91 1.72 0 3.12-1.4 3.12-3.12V9c0-2.76-2.24-5-5-5Zm3 12.88a1.118 1.118 0 0 1-1.91.79l-1.96-1.96c-1.1-1.1-2.56-1.71-4.12-1.71s-3.02.61-4.12 1.71l-1.96 1.96a1.118 1.118 0 0 1-1.91-.79V9c0-1.65 1.35-3 3-3h10c1.65 0 3 1.35 3 3v7.88Z"></path>
</svg> Tu progreso</h2></div>
    <div class="card"><strong><svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
fill="currentColor" viewBox="0 0 24 24" >
<!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
<path d="M16 2a5.995 5.995 0 0 0-5.97 6.59l-7.21 8.56c-.67.8-.62 1.96.12 2.7l1.2 1.2c.39.39.9.59 1.41.59.46 0 .91-.16 1.29-.47l8.56-7.21a5.99 5.99 0 0 0 4.84-1.73c1.13-1.14 1.75-2.65 1.75-4.24s-.62-3.1-1.76-4.25a6 6 0 0 0-4.24-1.75ZM5.56 19.64l-1.2-1.2 6.71-7.96 2.46 2.46-7.96 6.71Zm9.81-7.69-3.32-3.32c-.03-.2-.05-.41-.05-.63 0-.9.31-1.74.85-2.44l5.59 5.59c-.7.54-1.55.85-2.44.85-.22 0-.44-.02-.63-.05m3.78-1.51-5.59-5.59C14.26 4.31 15.11 4 16 4c1.07 0 2.07.42 2.83 1.16C19.58 5.92 20 6.93 20 8c0 .9-.31 1.74-.85 2.44"></path>
</svg> Nivel ${p.level}</strong><p class="muted">${p.xp % 100} / 100 XP para el siguiente nivel</p><div class="progress"><span style="width:${p.xp % 100}%"></span></div></div>
  `;
}

function renderLearn() {
  screen.innerHTML = `
    <div class="section-title"><h2>Ruta de aprendizaje</h2><span class="muted">Nivel ${state.progress.level}</span></div>
    <div class="route">${units.map((u, i) => `
      <div class="card unit ${i > 1 ? "locked" : ""}">
        <div class="unit-dot">${i + 1}</div>
        <h3>${u.title}</h3><div class="muted">${u.subtitle}</div>
        <div class="lesson-row">${u.lessons.map(l => `<button class="lesson" data-lesson="${l.id}">${l.title} · ${l.xp} XP</button>`).join("")}</div>
      </div>`).join("")}</div>
  `;
}

function renderMissions() {
  const p = state.progress;
  screen.innerHTML = `
    <div class="section-title"><h2>Misiones diarias</h2><span class="muted">Renuevan cada día</span></div>
    <div class="mission-grid">${missions.map(m => {
    const val = p.missionProgress[m.id] || 0, done = val >= m.target;
    return `<div class="card mission"><div class="mission-icon">${done ? "✅" : m.icon}</div><div class="mission-info"><strong>${m.title}</strong><span class="muted">${Math.min(val, m.target)}/${m.target} · recompensa +${m.reward} XP</span><div class="progress"><span style="width:${Math.min(100, val / m.target * 100)}%"></span></div></div></div>`
  }).join("")}</div>
    <div class="section-title"><h2>🛡️ Reserva de racha</h2></div>
    <div class="card"><strong>${p.streakFreeze} reservas disponibles</strong><p class="muted">Protegen tu racha cuando no puedes practicar. En este MVP se consumen automáticamente si hay un salto de días.</p></div>
  `;
}

function renderProfile() {
  const p = state.progress;
  screen.innerHTML = `
    <div class="hero"><div class="eyebrow">Tu perfil</div><h1>🎤 Cantante en desarrollo</h1><p>Nivel ${p.level} · ${p.xp} XP acumulados</p></div>
    <div class="section-title"><h2>Estadísticas</h2></div>
    <div class="profile-stat">
      <div class="card"><strong>🔥 ${p.streak}</strong><span class="muted">Racha</span></div>
      <div class="card"><strong>⚡ ${p.xp}</strong><span class="muted">XP</span></div>
      <div class="card"><strong>🏆 ${p.achievements.length}</strong><span class="muted">Logros</span></div>
    </div>
    <div class="section-title"><h2>Logros</h2></div>
    <div class="card"><p>${p.achievements.length ? p.achievements.map(a => `🏅 ${esc(a)}`).join("<br>") : "Completa ejercicios para desbloquear tus primeros logros."}</p></div>
  `;
}

function findLesson(id) {
  for (const u of units) { const l = u.lessons.find(x => x.id === id); if (l) return l }
}
function renderLesson(id) {
  const l = findLesson(id);
  if (!l) return go("learn");
  if (l.type === "pitch" || l.type === "breathing") renderPitchLesson(l);
  else renderChoiceLesson(l);
}

function beginSession(l) {
  const practiced = practiceToday(state.progress);
  if (practiced && state.progress.streak === 1) notify("🔥 ¡Primera racha activada!");
  state.progress.missionProgress.tuning += 1;
  state.progress.missionProgress.warmup += l.type === "breathing" ? 1 : 0;
  addXP(state.progress, l.xp);
  if (!state.progress.achievements.includes("Primera sesión")) state.progress.achievements.push("Primera sesión");
  if (state.progress.streak >= 7 && !state.progress.achievements.includes("Racha de 7 días")) state.progress.achievements.push("Racha de 7 días");
  commit();
}

function renderChoiceLesson(l) {
  screen.innerHTML = `
    <div class="lesson-header"><button class="back" data-action="back">←</button><div><strong>${esc(l.title)}</strong><div class="muted">+${l.xp} XP</div></div></div>
    <div class="exercise">
      <div class="eyebrow">Escucha y responde</div>
      <h1>¿Qué nota escuchaste?</h1>
      <div class="note">♪</div><p class="instruction">Imagina que escuchas una nota y selecciona la respuesta.</p>
      <div class="choice-grid">
        ${["DO", "MI", "SOL", "LA"].map(x => `<button class="choice" data-choice="${x}">${x}</button>`).join("")}
      </div>
    </div>`;
  document.querySelectorAll("[data-choice]").forEach(b => b.onclick = () => {
    const correct = b.dataset.choice === "LA";
    b.classList.add(correct ? "correct" : "wrong");
    if (correct) {
      document.querySelectorAll("[data-choice]").forEach(x => x.disabled = true);
      setTimeout(() => { beginSession(l); renderResult(l, 92) }, 450);
    } else notify("Casi. Inténtalo otra vez.");
  });
}

function renderPitchLesson(l) {
  let detector = null;
  let active = false;
  let samples = [];

  screen.innerHTML = `
    <div class="lesson-header">
      <button class="back" data-action="back">←</button>
      <div>
        <strong>${esc(l.title)}</strong>
        <div class="muted">Hasta +${l.xp} XP</div>
      </div>
    </div>

    <div class="exercise pitch-exercise">
      <div class="eyebrow">${l.type === "breathing" ? "Técnica vocal" : "Afinación en tiempo real"}</div>
      <h1>${l.type === "breathing" ? "Respira y prepara tu voz" : "Canta LA4"}</h1>

      <div class="target-note">${l.type === "breathing" ? "🫁" : "LA4"}</div>

      <p class="instruction">
        ${l.type === "breathing"
      ? "Inhala durante 4 segundos y exhala durante 6 segundos."
      : "Activa el micrófono y mantén la nota LA4 (440 Hz)."}
      </p>

      ${l.type === "pitch" ? `
        <div class="pitch-card">
          <div class="pitch-reading">
            <strong id="detectedNote">—</strong>
            <span id="frequencyReadout">Esperando voz…</span>
          </div>

          <div class="tuner">
            <div class="tuner-line"></div>
            <div class="tuner-center"></div>
            <div class="tuner-needle" id="tunerNeedle"></div>
          </div>

          <div class="pitch-score">
            <span id="liveScore">0</span>%
            <small id="pitchLabel">Sin señal</small>
          </div>
        </div>
      ` : ""}

      <button class="mic" id="mic">🎤</button>

      <button class="btn btn-primary" id="startPitch">
        ${l.type === "breathing" ? "Comenzar" : "Activar micrófono"}
      </button>

      <button class="btn btn-light hidden" id="finishPitch">
        Finalizar ejercicio
      </button>

      <p class="muted" id="micStatus">Listo para comenzar.</p>
    </div>
  `;

  const mic = document.querySelector("#mic");
  const status = document.querySelector("#micStatus");

  const stopDetector = () => {
    active = false;
    mic.classList.remove("listening");
    if (detector) detector.stop();
    detector = null;
  };

  document.querySelector("#startPitch").onclick = async () => {
    if (l.type === "breathing") {
      mic.classList.add("listening");
      status.textContent = "Inhala…";

      setTimeout(() => {
        status.textContent = "Exhala lentamente…";
      }, 4000);

      setTimeout(() => {
        mic.classList.remove("listening");
        beginSession(l);
        renderResult(l, 96);
      }, 10000);

      return;
    }

    try {
      status.textContent = "Conectando micrófono…";

      detector = new PitchDetector();
      active = true;
      mic.classList.add("listening");

      await detector.start((frequency) => {
        if (!active) return;

        const note = frequencyToNote(frequency);
        const result = evaluatePitch(frequency, 440);

        if (!note) return;

        document.querySelector("#detectedNote").textContent = note.name;

        document.querySelector("#frequencyReadout").textContent =
          `${Math.round(frequency)} Hz · ${result.cents > 0 ? "+" : ""}${result.cents} cents`;

        document.querySelector("#liveScore").textContent = result.score;
        document.querySelector("#pitchLabel").textContent = result.label;

        const position = Math.max(-55, Math.min(55, result.cents / 2));
        document.querySelector("#tunerNeedle").style.transform =
          `translateX(${position}px)`;

        if (result.score >= 50) samples.push(result.score);
      });

      status.textContent = "🎤 Micrófono activo. Canta LA4.";
      document.querySelector("#startPitch").classList.add("hidden");
      document.querySelector("#finishPitch").classList.remove("hidden");

    } catch (error) {
      stopDetector();
      status.textContent =
        "No se pudo acceder al micrófono. Usa localhost o HTTPS y acepta el permiso.";
    }
  };

  document.querySelector("#finishPitch").onclick = () => {
    stopDetector();

    const finalScore = samples.length
      ? Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length)
      : 0;

    // Conserva beginSession() y todas las variables originales.
    // La XP actual de la lección sigue siendo manejada por el sistema existente.
    beginSession(l);
    renderResult(l, finalScore);
  };
}


function renderResult(l, score) {
  screen.innerHTML = `
    <div class="result">
      <div class="eyebrow">Sesión completada</div>
      <h1>¡Muy bien! 🎉</h1>
      <div class="score">${score}%</div>
      <p>Has completado <strong>${esc(l.title)}</strong>.</p>
      <p class="xp-badge">⚡ +${l.xp} XP</p>
      <br><br><button class="btn btn-primary" data-action="continue">Continuar →</button>
    </div>`;
}

function go(route) {
  state.route = route;
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.route === route));
  if (route === "home") renderHome();
  if (route === "learn") renderLearn();
  if (route === "missions") renderMissions();
  if (route === "profile") renderProfile();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", e => {
  const nav = e.target.closest("[data-route]");
  if (nav) return go(nav.dataset.route);
  const lesson = e.target.closest("[data-lesson]");
  if (lesson) return renderLesson(lesson.dataset.lesson);
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (action === "back") return go("learn");
  if (action === "continue") return go("learn");
});

headerStats(); go("home");