/* =========================================================
   Tres Tintas — aplicación (SPA sin dependencias)
   ========================================================= */
(function () {
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);

  const D = window.POLY_DATA;
  const A = window.PolyAuth;
  const P = window.PolyProgress;
  const R = window.PolyResources;
  const S = window.PolySpeech;

  const state = {
    route: [],
    user: A.currentUser(),
    theme: localStorage.getItem("tres-tintas_theme") || "light",
    authMode: null,
    authError: "",
    menuOpen: false,
    quizAnswers: {},
    quizChecked: {},
    examLevel: "hsk1",
    examMode: "cards",
    examMock: null,
    examMockAnswers: {},
    examMockChecked: false,
    examMockSummary: null,
    examMockEndsAt: 0,
    examMockTimer: null,
    examQueue: [],
    examIndex: 0,
    examFlipped: false,
    examQuiz: null,
    examQuizAnswers: {},
    examQuizChecked: false,
    examListening: null,
    examListeningAnswers: {},
    examListeningChecked: false,
    examReading: null,
    examReadingAnswers: {},
    examReadingChecked: false,
    examSearch: "",
    writingFilterCompleted: false,
    lessonPage: 0,
    langPickerOpen: false,
  };

  let writingController = null;
  const uid = () => (state.user ? state.user.id : P.GUEST_ID);
  const appEl = document.getElementById("app");
  const modalRoot = document.getElementById("modal-root");
  const toastRoot = document.getElementById("toast-root");

  function toast(message, type) {
    const el = document.createElement("div");
    el.className = "toast " + (type || "");
    el.textContent = message;
    toastRoot.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(20px)";
      el.style.transition = "0.25s";
      setTimeout(() => el.remove(), 260);
    }, 3200);
  }

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    return raw ? raw.split("/").filter(Boolean) : [];
  }

  function go(path) {
    location.hash = path.startsWith("/") ? path : "/" + path;
  }

  /* ---------------- Header ---------------- */
  function headerHtml() {
    const user = state.user;
    const route = state.route.join("/");
    const nav = [
      { href: "/", label: "Inicio", active: route === "" },
      { href: "/resources", label: "Recursos", active: route.startsWith("resources") },
      { href: "/writing", label: "Caligrafía", active: route.startsWith("writing") },
      { href: "/exams", label: "Exámenes", active: route.startsWith("exam") },
      { href: "/progress", label: "Mi progreso", active: route.startsWith("progress") },
    ];
    return `<header class="site-header">
      <div class="header-inner">
        <a class="brand" href="#/" aria-label="Tres Tintas, inicio">
          <span class="brand-mark">墨</span>
          <span class="brand-text"><span class="brand-name">Tres Tintas</span><br><span class="brand-sub">chino · japonés · coreano</span></span>
        </a>
        <nav class="main-nav">
          ${nav.map((n) => `<a class="nav-link ${n.active ? "active" : ""}" href="#${n.href}">${n.label}</a>`).join("")}
        </nav>
        <div class="header-actions">
          <button class="icon-btn" data-action="theme" title="Cambiar tema" aria-label="Cambiar tema">${state.theme === "dark"
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'}</button>
          ${user ? `
            <div class="user-chip-wrap">
              <button class="user-chip" data-action="toggle-menu" aria-expanded="${state.menuOpen}">
                <span class="avatar">${E(user.name.charAt(0).toUpperCase())}</span>
                <span class="user-name">${E(user.name)}</span>
                <span class="small muted">▾</span>
              </button>
              ${state.menuOpen ? `<div class="menu-dropdown">
                <button class="menu-item" data-action="nav" data-href="#/progress">📊 Mi progreso</button>
                <button class="menu-item" data-action="nav" data-href="#/resources">⬇️ Recursos</button>
                <div class="menu-sep"></div>
                <button class="menu-item danger" data-action="logout">🚪 Cerrar sesión</button>
              </div>` : ""}
            </div>` : `
            <button class="btn btn-ghost btn-small" data-action="open-auth">Entrar</button>`}
        </div>
      </div>
    </header>`;
  }

  function githubLink() {
    return '<a class="footer-github" href="https://github.com/Raquel-G-L" target="_blank" rel="noopener" aria-label="GitHub de RG">'
      + '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.01c-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.68 5.4-5.24 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg></a>';
  }

  function footerHtml() {
    return `<footer class="site-footer">
      <strong>Tres Tintas</strong> · Aprende chino, japonés y coreano a tu ritmo.<br>
      © 2026 · Contenido educativo · <a href="#/about">Fuentes y licencias</a> · <button class="footer-link" data-action="scroll-top">Volver arriba ↑</button><br>
      Creado con cariño por RG · ${githubLink()}<br>
      Las cuentas se guardan solo en este navegador (modo demostración).
    </footer>`;
  }

  function aboutHtml() {
    return `<main class="page"><div class="container">
      <div class="breadcrumb"><a href="#/">Inicio</a><span class="breadcrumb-sep">/</span><span>Fuentes y licencias</span></div>
      <div class="section-head"><div><span class="eyebrow">Créditos</span><h1 class="h1">Fuentes y licencias</h1><p class="lead">Tres Tintas se ha construido con datos abiertos y herramientas gratuitas.</p></div></div>
      <div class="resource-grid">
        <div class="resource-card"><h3>HSK</h3><p>Listas de vocabulario de <a href="https://github.com/drkameleon/complete-hsk-vocabulary" target="_blank" rel="noopener">complete-hsk-vocabulary</a> (MIT).</p></div>
        <div class="resource-card"><h3>JLPT</h3><p>Listas y ejemplos de <a href="https://github.com/evanclan/OpenJLPT" target="_blank" rel="noopener">OpenJLPT</a> (CC BY-SA 4.0).</p></div>
        <div class="resource-card"><h3>TOPIK</h3><p>Lista de <a href="https://github.com/julienshim/combined_korean_vocabulary_list" target="_blank" rel="noopener">combined_korean_vocabulary_list</a> (MIT) y diccionario <a href="https://github.com/kenantang/Dictionary-MKG" target="_blank" rel="noopener">Dictionary-MKG</a>.</p></div>
        <div class="resource-card"><h3>Caligrafía y audio</h3><p>Trazos con <a href="https://hanziwriter.org/" target="_blank" rel="noopener">Hanzi Writer</a> (MIT) y voz con <a href="https://pypi.org/project/edge-tts/" target="_blank" rel="noopener">Edge TTS</a>.</p></div>
      </div>
      <section class="section"><div class="tip-box">Creado con cariño por RG · ${githubLink()}. Las traducciones se generaron y guardaron localmente; la web no depende de servicios externos para mostrarlas.</div></section>
    </div></main>`;
  }

  /* ---------------- Home ---------------- */
  function homeHtml() {
    const stats = P.stats(uid());
    const last = state.route.length === 0 && stats.state.lastLesson ? D.findLesson(stats.state.lastLesson) : null;
    return `<main class="page"><div class="container">
      <section class="hero">
        <div class="hero-inner">
          <span class="hero-badge">🎓 HSK · JLPT · TOPIK · ${PolyExam.LEVELS.length} niveles · ${D.allLessons.length} lecciones</span>
          <h1 class="hero-title">Habla <span>chino, japonés y coreano</span> desde cero.</h1>
          <p class="hero-sub">Temario organizado por los exámenes oficiales (HSK, JLPT y TOPIK), con pronunciación real, caligrafía y recursos descargables.</p>
          <div class="hero-actions">
            <button class="btn btn-hero" data-action="choose-language">🚀 Empezar a aprender</button>
          </div>
          <div class="hero-stats">
            <div><div class="stat-value">${D.allLessons.length}</div><div class="stat-label">lecciones</div></div>
            <div><div class="stat-value">17</div><div class="stat-label">niveles oficiales</div></div>
            <div><div class="stat-value">25.025</div><div class="stat-label">palabras de examen</div></div>
          </div>
        </div>
      </section>

      ${last ? `<section class="section">
        <div class="section-head"><div><span class="eyebrow">Siguiendo por aquí</span><h2 class="h2">Continúa donde lo dejaste</h2></div></div>
        <a class="quick-card" href="#/lesson/${last.id}" style="max-width:520px">
          <span class="quick-icon">▶️</span>
          <div><h4>${E(last.title)}</h4><p>${E(D.findLanguage(last.langId).name)} · ${E(last.desc)}</p></div>
        </a>
      </section>` : ""}

      <section class="section">
        <div class="section-head"><div><span class="eyebrow">Elige tu idioma</span><h2 class="h2">Tres caminos, un mismo objetivo</h2><p class="lead">Cada idioma sigue su examen oficial: HSK para el chino, JLPT para el japonés y TOPIK para el coreano.</p></div></div>
        <div class="lang-grid">
          ${D.languages.map((lang) => {
            const s = stats.byLang[lang.id] || { done: 0, total: 0 };
            const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
            return `<a class="lang-card" href="#/lang/${lang.id}" style="--lang-color:${lang.color}">
              <span class="card-arrow">→</span>
              <span class="lang-icon">${lang.emoji}</span>
              <div><h3 class="lang-card-title">${lang.name}</h3><span class="lang-native">${lang.native}</span></div>
              <span class="lang-meta">${lang.levels.length} niveles ${lang.exam.name} · ${s.total} lecciones · ${lang.flag}</span>
              <div class="lang-progress">
                <div class="progress-label"><span>Tu avance</span><span>${s.done}/${s.total}</span></div>
                <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
              </div>
            </a>`;
          }).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><div><span class="eyebrow">Cómo funciona</span><h2 class="h2">De cero a examen en tres pasos</h2></div></div>
        <div class="quick-grid">
          <div class="quick-card"><span class="quick-icon">1️⃣</span><div><h4>Elige tu idioma y nivel</h4><p>Cada nivel sigue un examen oficial y muestra lo que deberías saber hacer.</p></div></div>
          <div class="quick-card"><span class="quick-icon">2️⃣</span><div><h4>Estudia y escucha</h4><p>Lee la lección, repite con el audio y practica los trazos en la libreta.</p></div></div>
          <div class="quick-card"><span class="quick-icon">3️⃣</span><div><h4>Practica y descarga</h4><p>Tarjetas, tests y simulacros; guarda las fichas desde Recursos.</p></div></div>
        </div>
      </section>
    </div></main>`;
  }

  /* ---------------- Language ---------------- */
  function languageHtml(langId, levelKey) {
    const lang = D.findLanguage(langId);
    if (!lang) return notFoundHtml();
    const level = lang.levels.find((l) => l.key === levelKey) || lang.levels[0];
    const pageSize = 24;
    const pages = Math.max(1, Math.ceil(level.lessons.length / pageSize));
    const page = Math.min(state.lessonPage, pages - 1);
    const shown = level.lessons.slice(page * pageSize, (page + 1) * pageSize);
    const stats = P.stats(uid());
    return `<main class="page"><div class="container" style="--lang-color:${lang.color}">
      <div class="breadcrumb"><a href="#/">Inicio</a><span class="breadcrumb-sep">/</span><span>${E(lang.name)}</span></div>
      <div class="lang-header">
        <span class="lang-header-icon">${lang.emoji}</span>
        <div><h1>${lang.name} <span class="muted">${lang.native}</span></h1><p>${lang.flag} ${lang.levels.length} niveles · ${lang.levels.reduce((n, l) => n + l.lessons.length, 0)} lecciones · pronunciación incluida</p>
        <span class="badge-done" style="background:var(--primary-soft);color:var(--primary);display:inline-block;margin-top:6px">🎓 ${lang.exam.name} · ${E(lang.exam.desc)}</span></div>
      </div>
      <div class="tip-box" style="margin-bottom:20px"><strong>Ruta oficial:</strong> este temario sigue los niveles del ${lang.exam.name} (${E(lang.exam.full)}). Cada nivel indica qué deberías ser capaz de hacer y cuántas palabras se esperan en ese nivel.</div>
      <div class="level-tabs" role="tablist">
        ${lang.levels.map((l) => `<a class="level-tab ${l.key === level.key ? "active" : ""}" href="#/lang/${lang.id}/${l.key}">
          ${l.icon} ${l.name} <span class="tab-count">${(stats.byLang[lang.id] && stats.byLang[lang.id].done) || 0}/${l.lessons.length}</span>
        </a>`).join("")}
      </div>
      <div class="section-head"><div><h2 class="h2">${level.icon} Nivel ${level.name}</h2><p class="lead">${E(level.desc)}</p>
        <p class="small muted" style="margin-top:6px"><strong>Objetivo ${lang.exam.name}:</strong> ${E(level.canDo)} <span class="badge-done" style="background:var(--surface-2);color:var(--muted);margin-left:6px">≈ ${level.vocabTarget.toLocaleString("es-ES")} palabras</span></p></div></div>
      ${(() => {
        const examId = PolyExam.LEVELS.find((id) => {
          const m = PolyExam.levelMeta(id);
          return m.lang === lang.id && m.levelKey === level.key;
        });
        if (!examId) return "";
        const meta = PolyExam.levelMeta(examId);
        return `<div style="margin:-6px 0 20px"><a class="btn btn-primary" href="#/exam/${lang.id}/${examId}">🎓 Preparación ${E(meta.name)} completa: ${PolyExam.words(examId).length} palabras + tarjetas + simulacro →</a></div>`;
      })()}
      <div class="lesson-grid">
        ${shown.map((les, i) => {
          const done = P.isCompleted(uid(), les.id);
          return `<article class="lesson-card ${done ? "completed" : ""}">
            <div class="lesson-top"><span class="lesson-num">Lección ${page * pageSize + i + 1}</span>${done ? '<span class="badge-done">✓ Completada</span>' : ""}</div>
            <h3 class="lesson-title">${E(les.title)}</h3>
            <p class="lesson-desc">${E(les.desc)}</p>
            <div class="lesson-meta"><span>📝 ${les.vocab.length} palabras</span><span>💬 ${les.phrases.length} frases</span><span>❓ ${les.quiz.length} preguntas</span></div>
            <div class="lesson-actions"><a class="btn btn-primary btn-small" href="#/lesson/${les.id}">${done ? "Repasar" : "Empezar"} →</a></div>
          </article>`;
        }).join("")}
      </div>
      ${pages > 1 ? `<div class="writing-controls" style="margin-top:22px">
        <button class="btn btn-ghost btn-small" data-action="lesson-page" data-page="${page - 1}" ${page === 0 ? "disabled" : ""}>← Anterior</button>
        <span class="small muted">Página ${page + 1} de ${pages} · ${level.lessons.length} lecciones</span>
        <button class="btn btn-ghost btn-small" data-action="lesson-page" data-page="${page + 1}" ${page === pages - 1 ? "disabled" : ""}>Siguiente →</button>
      </div>` : ""}
      <section class="section">
        <div class="tip-box"><strong>Material para imprimir:</strong> la guía PDF/TXT de ${level.name.toLowerCase()} y el vocabulario CSV están en <a href="#/resources">Recursos</a>.</div>
      </section>
    </div></main>`;
  }

  /* ---------------- Lesson ---------------- */
  function lessonHtml(lessonId) {
    const lesson = D.findLesson(lessonId);
    if (!lesson) return notFoundHtml();
    const lang = D.findLanguage(lesson.langId);
    const level = lang.levels.find((l) => l.key === lesson.levelKey);
    const all = D.allLessons;
    const index = all.findIndex((l) => l.id === lesson.id);
    const prev = all[index - 1];
    const next = all[index + 1];
    const done = P.isCompleted(uid(), lesson.id);
    const favorite = P.get(uid()).favorites.includes(lesson.id);
    const answers = state.quizAnswers[lesson.id] || {};
    const checked = state.quizChecked[lesson.id] || false;
    let correct = 0;
    lesson.quiz.forEach((q, i) => { if (answers[i] === q.answer) correct++; });

    return `<main class="page"><div class="container" style="--lang-color:${lang.color}">
      <div class="breadcrumb">
        <a href="#/">Inicio</a><span class="breadcrumb-sep">/</span>
        <a href="#/lang/${lang.id}">${E(lang.name)}</a><span class="breadcrumb-sep">/</span>
        <span>${E(lesson.title)}</span>
      </div>
      <div class="lesson-layout">
        <div class="lesson-main">
          <section class="lesson-hero" data-char="${E(lesson.char)}">
            <span class="tag-pill">${lang.emoji} ${E(lang.name)}</span>
            <span class="tag-pill">${E(lang.native)}</span>
            <h1>${E(lesson.title)}</h1>
            <p>${E(lesson.desc)}</p>
            <div class="lesson-hero-tags"><span class="tag-pill">🎓 ${E(level ? level.name : lang.exam.name)}</span><span class="tag-pill">${lesson.vocab.length} palabras</span><span class="tag-pill">${lesson.phrases.length} frases</span><span class="tag-pill">${lesson.quiz.length} preguntas</span>${done ? '<span class="tag-pill" style="background:rgba(79,224,168,.25)">✓ Completada</span>' : ""}</div>
          </section>

          <section class="panel">
            <div class="panel-head"><h2>📘 Teoría y ejemplos</h2></div>
            <div class="panel-body flush">
              ${lesson.theory.map((block) => `<div class="theory-block">
                <div class="theory-title">${E(block.title)}</div>
                <p class="theory-text">${E(block.text)}</p>
                <div class="example-box">${block.examples.map((ex) => `<div class="example-row">
                  <span class="example-term">${E(ex.t)}</span><span class="example-reading">${E(ex.r)}</span><span class="example-meaning">${E(ex.m)}</span>
                </div>`).join("")}</div>
              </div>`).join("")}
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><h2>📝 Vocabulario</h2><span class="small muted">Pulsa 🔊 para escuchar</span></div>
            <div class="panel-body flush">
              <table class="vocab-table">
                <thead><tr><th>Término</th><th>Lectura</th><th>Significado</th><th></th></tr></thead>
                <tbody>${lesson.vocab.map((w, i) => `<tr>
                  <td class="vocab-term">${E(w.t)}</td><td class="vocab-reading">${E(w.r)}</td><td class="vocab-meaning">${E(w.m)}</td>
                  <td><button class="speak-btn" data-action="speak" data-src="${w.audio || `assets/audio/clips/${lang.id}/${lesson.id}/v${i}.mp3`}" data-text="${E(w.t)}" data-lang="${lang.voice}" title="Escuchar palabra">🔊</button></td>
                </tr>`).join("")}</tbody>
              </table>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><h2>💬 Frases útiles</h2></div>
            <div class="phrase-list">${lesson.phrases.map((p, i) => `<div class="phrase-item">
              <span class="phrase-index">${i + 1}</span>
              <div class="phrase-body"><div class="phrase-text">${E(p.t)}</div><div class="phrase-reading">${E(p.r)}</div><div class="phrase-meaning">${E(p.m)}</div></div>
              <button class="speak-btn" data-action="speak" data-src="${p.audio || `assets/audio/clips/${lang.id}/${lesson.id}/p${i}.mp3`}" data-text="${E(p.t)}" data-lang="${lang.voice}" title="Escuchar frase">🔊</button>
            </div>`).join("")}</div>
          </section>

          <section class="panel">
            <div class="panel-head"><h2>❓ Comprueba lo aprendido</h2><span class="small muted">${checked ? `${correct}/${lesson.quiz.length} aciertos` : `${lesson.quiz.length} preguntas`}</span></div>
            <div>
              ${lesson.quiz.map((q, qi) => {
                const sel = answers[qi];
                return `<div class="quiz-card">
                  <div class="quiz-question"><span class="quiz-num">${qi + 1}.</span><span>${E(q.question)}</span></div>
                  <div class="quiz-options">${q.options.map((opt, oi) => {
                    let cls = "";
                    if (checked) {
                      if (oi === q.answer) cls = "correct";
                      else if (sel === oi) cls = "wrong";
                    } else if (sel === oi) cls = "correct";
                    return `<button class="quiz-option ${cls}" data-action="select-option" data-q="${qi}" data-o="${oi}" ${checked ? "disabled" : ""}>
                      <span class="opt-key">${String.fromCharCode(65 + oi)}</span>${E(opt)}
                    </button>`;
                  }).join("")}</div>
                  ${checked ? `<div class="quiz-feedback ${sel === q.answer ? "ok" : "no"}">${sel === q.answer ? "✓ Correcto. " : "✗ Respuesta: " + String.fromCharCode(65 + q.answer) + ". "}${E(q.explain)}</div>` : ""}
                </div>`;
              }).join("")}
              <div class="panel-body">
                <div class="quiz-actions">
                  ${checked ? `<span class="quiz-score">${correct === lesson.quiz.length ? "🎉 ¡Lección completada! +50 XP" : `Has acertado ${correct} de ${lesson.quiz.length}.`}</span>
                    <button class="btn btn-ghost btn-small" data-action="retry-quiz">↻ Intentar de nuevo</button>`
                    : `<button class="btn btn-primary" data-action="check-quiz">Comprobar respuestas</button>
                       <span class="small muted">Debes acertar todas para completar la lección.</span>`}
                </div>
                ${checked && correct !== lesson.quiz.length ? `<p class="small muted" style="margin:10px 0 0">Revisa las explicaciones y vuelve a intentarlo.</p>` : ""}
                ${!state.user ? `<p class="small muted" style="margin:12px 0 0">Tu avance se guarda en este navegador. <button class="switch-link" data-action="open-auth" data-mode="register">Crea una cuenta</button> para conservarlo siempre.</p>` : ""}
              </div>
            </div>
          </section>
        </div>

        <aside class="lesson-side">
          <div class="panel">
            <div class="panel-head"><h2>⬇️ Recursos</h2></div>
            <div class="panel-body">
              <div class="download-list">
                <button class="download-item" data-action="lesson-pdf"><span class="download-icon pdf">PDF</span><span class="download-info"><span class="download-label">Ficha de la lección</span><span class="download-desc">Teoría, vocab. y frases</span></span><span>↓</span></button>
                <button class="download-item" data-action="lesson-txt"><span class="download-icon txt">TXT</span><span class="download-info"><span class="download-label">Ficha en texto</span><span class="download-desc">Compatible con cualquier editor</span></span><span>↓</span></button>
                <a class="download-item" href="${lesson.audio}" download><span class="download-icon mp3">MP3</span><span class="download-info"><span class="download-label">Pronunciación</span><span class="download-desc">Audio de vocabulario y frases</span></span><span>↓</span></a>
              </div>
              <p class="small muted" style="margin:12px 0 0">Escucha cada palabra con el botón 🔊 de la tabla.</p>
              <div style="margin-top:12px;border-top:1px solid var(--border);padding-top:12px">
                <div class="download-label" style="margin-bottom:7px">▶️ Pronunciación completa</div>
                <audio controls preload="none" src="${lesson.audio}" style="width:100%;min-width:0">Tu navegador no admite audio.</audio>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-body">
              <button class="btn ${favorite ? "btn-primary" : "btn-ghost"} btn-block btn-small" data-action="favorite">${favorite ? "★ En favoritos" : "☆ Añadir a favoritos"}</button>
            </div>
          </div>
          <div class="tip-box"><strong>Consejo:</strong> repite cada palabra en voz alta después de escucharla. La repetición espaciada funciona mejor que la lectura pasiva.</div>
          <div class="panel">
            <div class="panel-body">
              <div class="lesson-meta" style="margin-bottom:8px">Navegación de lecciones</div>
              ${prev ? `<a class="btn btn-ghost btn-block btn-small" href="#/lesson/${prev.id}" style="margin-bottom:7px">← ${E(prev.title)}</a>` : ""}
              ${next ? `<a class="btn btn-ghost btn-block btn-small" href="#/lesson/${next.id}">${E(next.title)} →</a>` : ""}
            </div>
          </div>
        </aside>
      </div>
    </div></main>`;
  }

  /* ---------------- Resources ---------------- */
  function resourcesHtml() {
    return `<main class="page"><div class="container">
      <div class="breadcrumb"><a href="#/">Inicio</a><span class="breadcrumb-sep">/</span><span>Recursos</span></div>
      <div class="section-head"><div><span class="eyebrow">Biblioteca</span><h1 class="h1">Descarga y estudia sin conexión</h1><p class="lead">Fichas en PDF, apuntes en TXT, listas de vocabulario en CSV y pronunciación en MP3. Todo se genera desde la propia página.</p></div></div>
      <div class="tip-box" style="margin-bottom:24px"><strong>Nota:</strong> los PDF se generan en tu navegador (necesitan internet la primera vez para cargar las librerías). Si no hay conexión, la descarga se convierte automáticamente en TXT.</div>
      <div class="resource-grid">
        ${D.languages.map((lang) => `<div class="resource-card" style="--lang-color:${lang.color}">
          <h3>${lang.emoji} ${lang.name} · ${lang.native}</h3>
          <p>Guías completas por nivel con todas las lecciones, ejemplos, vocabulario, frases y respuestas.</p>
          ${lang.levels.map((level) => `<div style="border-top:1px solid var(--border);padding-top:11px">
            <div style="font-size:13px;font-weight:700;margin-bottom:7px">${level.icon} ${level.name} <span class="small muted">(${level.lessons.length} lecciones)</span></div>
            <div class="lesson-actions">
              <button class="btn btn-primary btn-small" data-action="guide-pdf" data-lang="${lang.id}" data-level="${level.key}">PDF</button>
              <button class="btn btn-ghost btn-small" data-action="guide-txt" data-lang="${lang.id}" data-level="${level.key}">TXT</button>
              <a class="btn btn-ghost btn-small" href="#/lang/${lang.id}/${level.key}">Ver lecciones</a>
            </div>
          </div>`).join("")}
          <div style="border-top:1px solid var(--border);padding-top:11px">
            <button class="btn btn-ghost btn-block btn-small" data-action="vocab-csv" data-lang="${lang.id}">⬇️ Vocabulario completo (CSV)</button>
          </div>
        </div>`).join("")}
      </div>
      <section class="section">
        <div class="section-head"><div><span class="eyebrow">Audio</span><h2 class="h2">Pronunciación MP3</h2><p class="lead">Cada lección incluye un audio con su vocabulario y frases. Encuéntralo en el panel «Recursos» de cada lección y en la ficha lateral.</p></div></div>
        <div class="resource-grid">
          ${D.languages.map((lang) => `<div class="resource-card">
            <h3>${lang.emoji} ${lang.name}</h3>
            <p>${lang.levels.reduce((n, l) => n + l.lessons.length, 0)} archivos MP3, uno por lección, con pronunciación en ${lang.name.toLowerCase()}.</p>
            <div class="resource-formats"><span class="format-chip">MP3</span><span class="format-chip">${lang.levels.length} niveles</span><span class="format-chip">Pronunciación real</span></div>
            <a class="btn btn-ghost btn-small" href="#/lang/${lang.id}">Explorar lecciones →</a>
          </div>`).join("")}
        </div>
      </section>
      <section class="section">
        <div class="section-head"><div><span class="eyebrow">Listas de examen</span><h2 class="h2">Vocabulario HSK, JLPT y TOPIK</h2>
          <p class="lead">17 niveles con glosas en español. TXT para leer, CSV para hojas de cálculo y TSV para importar en Anki.</p></div></div>
        <div class="resource-grid">
          ${PolyExam.LEVELS.map((id) => {
            const m = PolyExam.levelMeta(id);
            return `<div class="resource-card">
              <h3>${E(m.name)}</h3>
              <p>${PolyExam.words(id).length.toLocaleString("es-ES")} palabras · ${E(POLY_DATA.findLanguage(m.lang).name)}</p>
              <div class="lesson-actions">
                <button class="btn btn-ghost btn-small" data-action="hsk-txt" data-level="${id}">TXT</button>
                <button class="btn btn-ghost btn-small" data-action="hsk-csv" data-level="${id}">CSV</button>
                <button class="btn btn-ghost btn-small" data-action="hsk-anki" data-level="${id}">Anki</button>
                <a class="btn btn-primary btn-small" href="#/exam/${m.lang}/${id}">Practicar</a>
              </div>
            </div>`;
          }).join("")}
        </div>
      </section>
    </div></main>`;
  }

  /* ---------------- Exámenes: vista general ---------------- */
  function examsHtml() {
    const systems = [
      { key: "hsk", name: "HSK", lang: "zh", emoji: "🏮", desc: "Chino mandarín" },
      { key: "jlpt", name: "JLPT", lang: "ja", emoji: "🌸", desc: "Japonés" },
      { key: "topik", name: "TOPIK", lang: "ko", emoji: "🌺", desc: "Coreano" },
    ];
    return `<main class="page"><div class="container">
      <div class="breadcrumb"><a href="#/">Inicio</a><span class="breadcrumb-sep">/</span><span>Exámenes</span></div>
      <div class="section-head"><div><span class="eyebrow">Preparación oficial</span><h1 class="h1">Elige tu examen</h1>
        <p class="lead">Cada sistema tiene sus propios niveles, vocabulario y ejercicios. Entra en un nivel para practicar con tarjetas, test, escucha, lectura y simulacros.</p></div></div>
      <div class="lang-grid">
        ${systems.map((s) => {
          const levels = PolyExam.LEVELS.filter((id) => id.startsWith(s.key));
          return `<div class="resource-card" style="--lang-color:${POLY_DATA.findLanguage(s.lang).color}">
            <h3>${s.emoji} ${s.name}</h3>
            <p>${s.desc} · ${levels.length} niveles · ${levels.reduce((n, id) => n + PolyExam.words(id).length, 0).toLocaleString("es-ES")} palabras</p>
            <div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:6px">
              ${levels.map((id) => `<a class="btn btn-ghost btn-small" href="#/exam/${s.lang}/${id}">${E(PolyExam.levelMeta(id).name)}</a>`).join("")}
            </div>
            <a class="btn btn-primary btn-small" href="#/exam/${s.lang}/${levels[0]}">Empezar ${s.name} →</a>
          </div>`;
        }).join("")}
      </div>
      <section class="section">
        <div class="tip-box"><strong>¿Buscas las listas para descargar?</strong> Están todas en <a href="#/resources">Recursos</a>, en un solo lugar.</div>
      </section>
    </div></main>`;
  }

  /* ---------------- Exam preparation ---------------- */
  function ensureExamQueue() {
    if (!state.examQueue.length) state.examQueue = PolyExam.studyQueue(uid(), 20, state.examLevel);
  }

  function mockQuestionHtml(q, i, answers, checked) {
    const sel = answers[i];
    const label = q.type === "listening" ? "🎧 Escuchar" : q.type === "reading" ? "📖 Lectura" : "📝 Vocabulario";
    const w = q.wordId ? PolyExam.find(q.wordId, state.examLevel) : null;
    const audio = q.type === "listening"
      ? `<button class="btn btn-ghost btn-small" data-action="speak" data-src="${q.audio}" data-text="${E(w ? w.char : "")}" data-lang="${PolyExam.levelMeta(state.examLevel).voice}">🔊 Reproducir</button>`
      : "";
    const text = q.type === "reading"
      ? `<div class="reading-text">${E(q.text)}</div><div class="reading-pinyin">${E(q.pinyin)}</div>`
      : "";
    const prompt = q.type === "reading"
      ? E(q.question)
      : q.type === "listening"
        ? "Elige el carácter que oyes"
        : q.reversed ? `¿Qué significa «${E(q.prompt)}»?` : "¿Qué significa este carácter?";
    const char = q.type === "vocab" && !q.reversed
      ? `<div class="exam-character small-char">${E(q.prompt)}</div>` : "";
    const options = q.options.map((o, oi) => {
      let cls = "";
      if (checked) {
        if (oi === q.answer) cls = "correct";
        else if (sel === oi) cls = "wrong";
      } else if (sel === oi) cls = "correct";
      return `<button class="quiz-option ${cls}" data-action="exam-mock-select" data-q="${i}" data-o="${oi}" ${checked ? "disabled" : ""}>
        <span class="opt-key">${String.fromCharCode(65 + oi)}</span><span class="${q.type === "listening" ? "vocab-term" : ""}">${E(o.label)}</span></button>`;
    }).join("");
    const feedback = checked
      ? `<div class="quiz-feedback ${sel === q.answer ? "ok" : "no"}">${sel === q.answer ? "✓ " : "✗ "}${w ? E(w.char) + " · " + E(w.pinyin) + " · " + E(w.es) : E(q.explain || "")}</div>`
      : "";
    return `<div class="quiz-card">
      <div class="quiz-question"><span class="quiz-num">${i + 1}.</span><span class="small muted">${label}</span>${audio}</div>
      ${text}${char}<div style="margin-top:10px">${prompt}</div>
      <div class="quiz-options">${options}</div>${feedback}
    </div>`;
  }

  function submitMock() {
    if (!state.examMock || state.examMockChecked) return;
    if (state.examMockTimer) { clearInterval(state.examMockTimer); state.examMockTimer = null; }
    let correct = 0;
    const byType = { vocab: [0, 0], listening: [0, 0], reading: [0, 0] };
    state.examMock.forEach((q, i) => {
      const ok = state.examMockAnswers[i] === q.answer;
      if (ok) { correct++; byType[q.type][0]++; }
      byType[q.type][1]++;
      if (q.wordId) PolyExam.review(uid(), q.wordId, ok, state.examLevel);
    });
    state.examMockChecked = true;
    state.examMockSummary = { correct, byType };
    toast(`Simulacro: ${correct}/${state.examMock.length} aciertos`, correct / state.examMock.length >= 0.7 ? "success" : "error");
    render();
  }

  function examHtml(levelKey) {
    const level = PolyExam.LEVELS.includes(levelKey) ? levelKey : "hsk1";
    const meta = PolyExam.levelMeta(level);
    const system = level.startsWith("hsk") ? "hsk" : level.startsWith("jlpt") ? "jlpt" : "topik";
    state.examLevel = level;
    const words = PolyExam.words(level);
    const stats = PolyExam.stats(uid(), level);
    ensureExamQueue();
    const modes = [
      ["cards", "🗂️ Tarjetas"],
      ["test", "📝 Test"],
      ["mock", "🎓 Simulacro"],
      ["listening", "🎧 Escuchar"],
      ["reading", "📖 Leer"],
      ["list", `📜 Lista ${words.length}`],
    ];
    let panel = "";

    if (state.examMode === "cards") {
      const w = state.examQueue[state.examIndex];
      if (!w) {
        panel = `<div class="empty-state"><span class="empty-icon">🎉</span><h3>Cola terminada</h3><p>Has repasado ${state.examQueue.length} tarjetas. Vuelve más tarde o reinicia la cola.</p>
          <button class="btn btn-primary" data-action="exam-new-queue">🔄 Nueva cola</button></div>`;
      } else {
        const card = PolyExam.get(uid(), state.examLevel)[String(w.id)];
        panel = `<div style="text-align:center;padding:12px 0">
          <div class="progress-label" style="max-width:420px;margin:0 auto 10px"><span>Tarjeta ${state.examIndex + 1} de ${state.examQueue.length}</span><span>${stats.mastered}/${stats.total} dominadas</span></div>
          <div class="progress-track" style="max-width:420px;margin:0 auto 24px"><div class="progress-fill" style="width:${Math.round((state.examIndex / state.examQueue.length) * 100)}%"></div></div>
          <div class="exam-card">
            <div class="exam-character">${E(w.char)}</div>
            <div class="exam-pinyin">${E(w.pinyin)}</div>
            <div class="exam-meaning ${state.examFlipped ? "" : "is-hidden"}">${E(w.es)}</div>
            ${state.examFlipped ? "" : '<div class="exam-hint">Pulsa «Ver significado» para comprobar</div>'}
          </div>
          <div class="writing-controls" style="margin-top:18px">
            <button class="btn btn-ghost btn-small" data-action="speak" data-src="${PolyExam.audioPath(w, state.examLevel)}" data-text="${E(w.char)}" data-lang="${PolyExam.levelMeta(state.examLevel).voice}">🔊 Escuchar</button>
            ${state.examFlipped
              ? `<button class="btn btn-ghost" data-action="exam-review" data-correct="false">✗ Difícil</button>
                 <button class="btn btn-primary" data-action="exam-review" data-correct="true">✓ Fácil</button>`
              : `<button class="btn btn-primary" data-action="exam-flip">Ver significado</button>`}
          </div>
          ${card ? `<p class="small muted" style="margin-top:14px">Caja ${card.box} · vistos ${card.seen} · aciertos ${card.correct} · fallos ${card.wrong}</p>` : '<p class="small muted" style="margin-top:14px">Tarjeta nueva</p>'}
        </div>`;
      }
    } else if (state.examMode === "test") {
      if (!state.examQuiz) {
        panel = `<div class="empty-state"><span class="empty-icon">📝</span><h3>Test de 10 preguntas</h3><p>Preguntas de opción múltiple con las 150 palabras del nivel. Cada respuesta actualiza tus tarjetas.</p><button class="btn btn-primary" data-action="exam-new-quiz">Empezar test</button></div>`;
      } else {
        const qs = state.examQuiz;
        let correct = 0;
        qs.forEach((q, i) => { if (state.examQuizAnswers[i] === q.answer) correct++; });
        panel = qs.map((q, i) => {
          const sel = state.examQuizAnswers[i];
          const original = PolyExam.find(q.wordId, state.examLevel);
          return `<div class="quiz-card">
            <div class="quiz-question"><span class="quiz-num">${i + 1}.</span><span>${q.reversed ? '¿Qué significa «' + E(q.prompt) + '»?' : '¿Qué significa este carácter?'}</span>
              ${q.pinyin ? `<span class="exam-pinyin" style="margin-left:auto">${E(q.pinyin)}</span>` : ""}</div>
            ${!q.reversed ? `<div class="exam-character small-char">${E(q.prompt)}</div>` : ""}
            <div class="quiz-options">${q.options.map((o, oi) => {
              let cls = "";
              if (state.examQuizChecked) {
                if (oi === q.answer) cls = "correct";
                else if (sel === oi) cls = "wrong";
              } else if (sel === oi) cls = "correct";
              return `<button class="quiz-option ${cls}" data-action="exam-quiz-select" data-q="${i}" data-o="${oi}" ${state.examQuizChecked ? "disabled" : ""}>
                <span class="opt-key">${String.fromCharCode(65 + oi)}</span>${E(o.label)}</button>`;
            }).join("")}</div>
            ${state.examQuizChecked ? `<div class="quiz-feedback ${sel === q.answer ? "ok" : "no"}">${sel === q.answer ? "✓ " : "✗ Respuesta correcta: " + E(q.options[q.answer].label) + ". "}${E(original.char)} · ${E(original.pinyin)} · ${E(original.es)}</div>` : ""}
          </div>`;
        }).join("") + `<div class="panel-body">
          ${state.examQuizChecked
            ? `<div class="quiz-actions"><span class="quiz-score">${correct}/10 aciertos</span><button class="btn btn-ghost btn-small" data-action="exam-new-quiz">↻ Otro test</button></div>`
            : `<div class="quiz-actions"><button class="btn btn-primary" data-action="exam-quiz-check">Comprobar respuestas</button></div>`}
        </div>`;
      }
    } else if (state.examMode === "listening") {
      if (!state.examListening) {
        panel = `<div class="empty-state"><span class="empty-icon">🎧</span><h3>Comprensión auditiva</h3><p>Escucha 10 palabras del HSK 1 y elige el carácter correcto. Cada respuesta cuenta para tus tarjetas.</p><button class="btn btn-primary" data-action="exam-new-listening">Empezar ejercicio</button></div>`;
      } else {
        const qs = state.examListening;
        let correct = 0;
        qs.forEach((q, i) => { if (state.examListeningAnswers[i] === q.answer) correct++; });
        panel = qs.map((q, i) => {
          const sel = state.examListeningAnswers[i];
          const w = PolyExam.find(q.wordId, state.examLevel);
          return `<div class="quiz-card">
            <div class="quiz-question"><span class="quiz-num">${i + 1}.</span><span>Escucha y elige el carácter correcto</span>
              <button class="btn btn-ghost btn-small" data-action="speak" data-src="${q.audio}" data-text="${E(w.char)}" data-lang="${PolyExam.levelMeta(state.examLevel).voice}" style="margin-left:auto">🔊 Reproducir</button></div>
            <div class="quiz-options">${q.options.map((o, oi) => {
              let cls = "";
              if (state.examListeningChecked) {
                if (oi === q.answer) cls = "correct";
                else if (sel === oi) cls = "wrong";
              } else if (sel === oi) cls = "correct";
              return `<button class="quiz-option ${cls}" data-action="exam-listening-select" data-q="${i}" data-o="${oi}" ${state.examListeningChecked ? "disabled" : ""}>
                <span class="opt-key">${String.fromCharCode(65 + oi)}</span><span class="vocab-term">${E(o.label)}</span></button>`;
            }).join("")}</div>
            ${state.examListeningChecked ? `<div class="quiz-feedback ${sel === q.answer ? "ok" : "no"}">${E(w.char)} · ${E(w.pinyin)} · ${E(w.es)}</div>` : ""}
          </div>`;
        }).join("") + `<div class="panel-body">${state.examListeningChecked
          ? `<div class="quiz-actions"><span class="quiz-score">${correct}/10 aciertos</span><button class="btn btn-ghost btn-small" data-action="exam-new-listening">↻ Otro ejercicio</button></div>`
          : `<div class="quiz-actions"><button class="btn btn-primary" data-action="exam-listening-check">Comprobar respuestas</button></div>`}</div>`;
      }
    } else if (state.examMode === "reading") {
      if (!state.examReading) {
        panel = `<div class="empty-state"><span class="empty-icon">📖</span><h3>Comprensión lectora</h3><p>15 textos breves con vocabulario HSK 1 y preguntas de comprensión.</p><button class="btn btn-primary" data-action="exam-new-reading">Empezar ejercicio</button></div>`;
      } else {
        const qs = state.examReading;
        let correct = 0;
        qs.forEach((q, i) => { if (state.examReadingAnswers[i] === q.answer) correct++; });
        panel = qs.map((q, i) => {
          const sel = state.examReadingAnswers[i];
          return `<div class="quiz-card">
            <div class="reading-text">${E(q.text)}</div>
            <div class="reading-pinyin">${E(q.pinyin)}</div>
            <div class="quiz-question" style="margin-top:12px"><span class="quiz-num">${i + 1}.</span><span>${E(q.question)}</span></div>
            <div class="quiz-options">${q.options.map((o, oi) => {
              let cls = "";
              if (state.examReadingChecked) {
                if (oi === q.answer) cls = "correct";
                else if (sel === oi) cls = "wrong";
              } else if (sel === oi) cls = "correct";
              return `<button class="quiz-option ${cls}" data-action="exam-reading-select" data-q="${i}" data-o="${oi}" ${state.examReadingChecked ? "disabled" : ""}>
                <span class="opt-key">${String.fromCharCode(65 + oi)}</span>${E(o.label)}</button>`;
            }).join("")}</div>
            ${state.examReadingChecked ? `<div class="quiz-feedback ${sel === q.answer ? "ok" : "no"}">${sel === q.answer ? "✓ " : "✗ "}${E(q.explain)}</div>` : ""}
          </div>`;
        }).join("") + `<div class="panel-body">${state.examReadingChecked
          ? `<div class="quiz-actions"><span class="quiz-score">${correct}/${qs.length} aciertos</span><button class="btn btn-ghost btn-small" data-action="exam-new-reading">↻ Otro ejercicio</button></div>`
          : `<div class="quiz-actions"><button class="btn btn-primary" data-action="exam-reading-check">Comprobar respuestas</button></div>`}</div>`;
      }
    } else if (state.examMode === "mock") {
      if (!state.examMock) {
        panel = `<div class="empty-state"><span class="empty-icon">🎓</span><h3>Simulacro ${level.toUpperCase()}</h3>
          <p>20 preguntas mezcladas de vocabulario, escucha y lectura, con 10 minutos de tiempo, como en un examen real. Al terminar verás tu nota por apartados.</p>
          <button class="btn btn-primary" data-action="exam-mock-start">Iniciar simulacro</button></div>`;
      } else {
        const qs = state.examMock;
        const summary = state.examMockSummary;
        const timeLeft = Math.max(0, state.examMockEndsAt - Date.now());
        panel = `<div class="mock-header">
            <span><strong>Simulacro ${level.toUpperCase()}</strong> · ${qs.length} preguntas</span>
            <span id="exam-timer" class="mock-timer">${String(Math.floor(timeLeft / 60000)).padStart(2, "0")}:${String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, "0")}</span>
            ${state.examMockChecked ? "" : '<button class="btn btn-ghost btn-small" data-action="exam-mock-submit">Entregar</button>'}
          </div>`
          + (summary ? `<div class="tip-box" style="margin:14px 20px"><strong>Resultado: ${summary.correct}/${qs.length} aciertos</strong><br>
              Vocabulario ${summary.byType.vocab[0]}/${summary.byType.vocab[1]} · Escucha ${summary.byType.listening[0]}/${summary.byType.listening[1]} · Lectura ${summary.byType.reading[0]}/${summary.byType.reading[1]}
              <div style="margin-top:10px"><button class="btn btn-primary btn-small" data-action="exam-mock-start">↻ Repetir simulacro</button></div></div>` : "")
          + qs.map((q, i) => mockQuestionHtml(q, i, state.examMockAnswers, state.examMockChecked)).join("");
      }
    } else {
      panel = `<div class="panel-body">
        <input class="input" id="exam-search" placeholder="Buscar por carácter, pinyin o significado…" autocomplete="off" style="margin-bottom:12px">
        <div style="max-height:620px;overflow:auto">
          <table class="vocab-table" id="exam-list"><thead><tr><th>#</th><th>Palabra</th><th>Lectura</th><th>Significado</th><th></th></tr></thead><tbody>
          ${words.map((w) => {
            const card = PolyExam.get(uid(), state.examLevel)[String(w.id)];
            const badge = card ? (card.box >= 4 ? '<span class="badge-done">✓</span>' : `<span class="small muted">c${card.box}</span>`) : "";
            const reading = w.reading || w.romaji || w.pinyin || "";
            return `<tr data-row="${E(w.char + " " + reading + " " + w.es)}"><td class="small muted">${w.id}</td><td class="vocab-term">${E(w.char)}</td><td class="vocab-reading">${E(reading)}</td><td class="vocab-meaning">${E(w.es)}</td>
              <td style="white-space:nowrap">${badge} <button class="speak-btn" data-action="speak" data-src="${PolyExam.audioPath(w, state.examLevel)}" data-text="${E(w.char)}" data-lang="${meta.voice}" title="Escuchar">🔊</button></td></tr>`;
          }).join("")}
          </tbody></table>
        </div>
      </div>`;
    }

    return `<main class="page"><div class="container" style="--lang-color:#d7493f">
      <div class="breadcrumb"><a href="#/">Inicio</a><span class="breadcrumb-sep">/</span><a href="#/exams">Exámenes</a><span class="breadcrumb-sep">/</span><span>${E(meta.name)}</span></div>
      <div class="section-head"><div><span class="eyebrow">Preparación oficial</span><h1 class="h1">${E(meta.name)} · ${words.length} palabras</h1>
        <p class="lead">Practica con tarjetas, test, escucha, lectura y simulacro con temporizador. Las listas descargables están en Recursos.</p></div></div>
      <div class="level-tabs" style="margin-bottom:18px">
        ${PolyExam.LEVELS.filter((id) => id.startsWith(system)).map((id) => `<a class="level-tab ${level === id ? "active" : ""}" href="#/exam/${PolyExam.levelMeta(id).lang}/${id}">${E(PolyExam.levelMeta(id).name)}</a>`).join("")}
        <a class="level-tab" href="#/exams">↔ Otro examen</a>
      </div>
      <div class="tip-box" style="margin-bottom:18px"><strong>Fuente:</strong> ${E(meta.source || "lista pública de vocabulario")}. Las glosas en español se generaron y guardaron localmente.</div>
      <div class="quick-grid" style="margin-bottom:20px">
        <div class="quick-card"><span class="quick-icon">👀</span><div><h4>${stats.seen} vistas</h4><p>palabras repasadas al menos una vez</p></div></div>
        <div class="quick-card"><span class="quick-icon">🎯</span><div><h4>${stats.mastered} dominadas</h4><p>en las cajas superiores de repetición</p></div></div>
        <div class="quick-card"><span class="quick-icon">⏰</span><div><h4>${stats.due} pendientes</h4><p>para repasar hoy</p></div></div>
      </div>
      <div class="level-tabs">${modes.map(([id, label]) => `<button class="level-tab ${state.examMode === id ? "active" : ""}" data-action="exam-mode" data-mode="${id}">${label}</button>`).join("")}</div>
      <div class="writing-layout">
        <section class="panel">${panel}</section>
        <aside class="writing-side">
          <div class="panel"><div class="panel-body">
            <div class="download-label" style="margin-bottom:7px">Listas de este nivel</div>
            <p class="small muted" style="margin:0">TXT, CSV y TSV para Anki disponibles en <a href="#/resources">Recursos</a>.</p>
          </div></div>
          <div class="panel"><div class="panel-body">
            <div class="download-label" style="margin-bottom:7px">Cómo funciona el repaso</div>
            <p class="small muted" style="margin:0">Cada acierto sube de caja y aparece más tarde (1, 2, 4, 7, 15 días). Si fallas, vuelve a la primera caja. Las tarjetas y tus resultados se guardan en tu cuenta.</p>
            <div style="height:10px"></div>
            <button class="btn btn-ghost btn-block btn-small" data-action="exam-reset">↺ Reiniciar mi progreso ${level.toUpperCase()}</button>
          </div></div>
        </aside>
      </div>
    </div></main>`;
  }

  /* ---------------- Writing notebook ---------------- */
  function writingCharHref(langId, char) {
    return `#/writing/${langId}/${encodeURIComponent(char)}`;
  }

  function writingSources(langId) {
    const lang = D.findLanguage(langId);
    if (!lang) return {};
    const map = {};
    PolyWriting.get(langId).forEach((entry) => {
      let found = null;
      for (const lesson of D.allLessons) {
        if (lesson.langId !== langId) continue;
        const texts = [];
        lesson.vocab.forEach((w) => texts.push(w.t));
        lesson.phrases.forEach((p) => texts.push(p.t));
        lesson.theory.forEach((b) => b.examples.forEach((ex) => texts.push(ex.t)));
        if (texts.includes(entry.char) || texts.some((t) => t.includes(entry.char))) {
          found = lesson;
          break;
        }
      }
      if (found) {
        const lvl = lang.levels.find((l) => l.key === found.levelKey);
        map[entry.char] = {
          lessonId: found.id,
          lessonTitle: found.title,
          levelName: lvl ? lvl.name : "",
          order: D.allLessons.indexOf(found),
        };
      }
    });
    return map;
  }

  function writingGroups(langId) {
    const sources = writingSources(langId);
    const groups = new Map();
    PolyWriting.get(langId).forEach((entry) => {
      const src = sources[entry.char];
      const key = src ? `${src.levelName} · ${src.lessonTitle}` : (langId === "ko" ? "Hangul básico" : "Radicales base");
      if (!groups.has(key)) {
        groups.set(key, {
          title: key,
          order: src ? src.order : 9999,
          lessonId: src ? src.lessonId : null,
          entries: [],
        });
      }
      groups.get(key).entries.push({ entry, src });
    });
    return Array.from(groups.values()).sort((a, b) => a.order - b.order);
  }

  function writingHtml(langId, charParam) {
    if (!langId) {
      return `<main class="page"><div class="container">
        <div class="breadcrumb"><a href="#/">Inicio</a><span class="breadcrumb-sep">/</span><span>Caligrafía</span></div>
        <div class="section-head"><div><span class="eyebrow">Libreta de escritura</span><h1 class="h1">Aprende a escribir los caracteres</h1><p class="lead">Orden de trazos animado, práctica dibujando con el dedo o el ratón y caracteres derivados del mismo radical.</p></div></div>
        <div class="writing-tabs" style="margin-bottom:22px">
          ${D.languages.map((lang) => `<a class="writing-tab" href="#/writing/${lang.id}">${lang.emoji} ${E(lang.name)}</a>`).join("")}
        </div>
        <div class="quick-grid">
          ${D.languages.map((lang) => `<a class="quick-card" href="#/writing/${lang.id}" style="--lang-color:${lang.color}">
            <span class="quick-icon" style="background:color-mix(in srgb, ${lang.color} 15%, transparent);color:${lang.color}">${lang.emoji}</span>
            <div><h4>${E(lang.name)} · ${lang.native}</h4><p>${PolyWriting.get(lang.id).length} caracteres para practicar con sus derivados.</p></div>
          </a>`).join("")}
        </div>
      </div></main>`;
    }

    const lang = D.findLanguage(langId);
    if (!lang) return notFoundHtml();
    const entries = PolyWriting.get(langId);
    const char = charParam ? decodeURIComponent(charParam) : null;
    const entry = char ? PolyWriting.find(langId, char) : null;
    const groups = writingGroups(langId);

    const tabs = `<div class="writing-tabs">
      <a class="writing-tab ${!char ? "active" : ""}" href="#/writing/${lang.id}">Todos</a>
      ${entries.map((e) => `<a class="writing-tab ${char === e.char ? "active" : ""}" href="${writingCharHref(lang.id, e.char)}">${E(e.char)}</a>`).join("")}
    </div>`;

    if (!entry) {
      return `<main class="page"><div class="container" style="--lang-color:${lang.color}">
        <div class="breadcrumb"><a href="#/">Inicio</a><span class="breadcrumb-sep">/</span><a href="#/writing">Caligrafía</a><span class="breadcrumb-sep">/</span><span>${E(lang.name)}</span></div>
        <div class="lang-header"><span class="lang-header-icon">${lang.emoji}</span><div><h1>Libreta de ${E(lang.name)}</h1><p>Los caracteres están ordenados por lección, igual que los vas aprendiendo en el temario.</p></div>
          <button class="btn ${state.writingFilterCompleted ? "btn-primary" : "btn-ghost"} btn-small" data-action="writing-filter">${state.writingFilterCompleted ? "✓ Solo completadas" : "Filtrar: solo completadas"}</button>
        </div>
        ${tabs}
        ${groups.map((g) => {
          const items = g.entries.filter(({ src }) => !state.writingFilterCompleted || (src && P.isCompleted(uid(), src.lessonId)));
          if (!items.length) return "";
          return `<section class="writing-group">
            <div class="writing-group-head"><h2 class="h3">${E(g.title)}</h2>
              ${g.lessonId && !state.writingFilterCompleted ? `<a class="small muted" href="#/lesson/${g.lessonId}">Ver lección →</a>` : ""}
            </div>
            <div class="char-grid">${items.map(({ entry: e, src }) => {
              const done = src && P.isCompleted(uid(), src.lessonId);
              return `<a class="char-card ${done ? "completed" : ""}" href="${writingCharHref(lang.id, e.char)}">
                <span class="char-big">${E(e.char)}</span>
                <div class="char-card-meaning">${E(e.meaning)}</div>
                <div class="char-card-meta">${E(e.reading)} · ${e.strokes} trazos</div>
                <div class="char-card-source">${done ? "✓ aprendida" : (src ? "por estrenar" : "base")}</div>
              </a>`;
            }).join("")}</div>
          </section>`;
        }).join("")}
        ${state.writingFilterCompleted && !groups.some((g) => g.entries.some(({ src }) => src && P.isCompleted(uid(), src.lessonId))) ? '<div class="empty-state"><h3>Aún no hay caracteres de lecciones completadas</h3><p>Completa una lección o desactiva el filtro.</p></div>' : ""}
      </div></main>`;
    }

    return `<main class="page"><div class="container" style="--lang-color:${lang.color}">
      <div class="breadcrumb"><a href="#/">Inicio</a><span class="breadcrumb-sep">/</span><a href="#/writing">Caligrafía</a><span class="breadcrumb-sep">/</span><a href="#/writing/${lang.id}">${E(lang.name)}</a><span class="breadcrumb-sep">/</span><span>${E(entry.char)}</span></div>
      <div class="lang-header"><span class="lang-header-icon">${lang.emoji}</span><div><h1>Escribir «${E(entry.char)}»</h1><p>${E(lang.name)} · ${E(entry.meaning)} · ${E(entry.reading)}</p></div></div>
      ${tabs}
      <div class="writing-layout">
        <div class="writing-main">
          <section class="panel">
            <div class="panel-head"><h2>✍️ Orden de trazos</h2><span class="small muted">${entry.strokes} trazos</span></div>
            <div class="panel-body paper-stage">
              <div id="writing-canvas"></div>
              <div class="writing-controls">
                <button class="btn btn-primary btn-small" data-action="writing-animate">▶ Ver trazos</button>
                <button class="btn btn-ghost btn-small" data-action="writing-practice">✏️ Practicar</button>
                <button class="btn btn-ghost btn-small" data-action="writing-reset">👁 Mostrar / reiniciar</button>
              </div>
              <div class="writing-status" id="writing-status">${langId === "ko" ? "Arrastra el dedo o el ratón sobre la cuadrícula en modo práctica." : "Pulsa «Ver trazos» para ver el orden o «Practicar» para dibujarlo."}</div>
            </div>
          </section>
          <section class="panel">
            <div class="panel-body note-box"><strong>Cómo se compone:</strong> ${E(entry.note)}</div>
          </section>
          <section class="panel">
            <div class="panel-head"><h2>📄 Cuaderno tianzige</h2><span class="small muted">Vista previa</span></div>
            <div class="panel-body">
              <div id="worksheet-preview"></div>
              <p class="small muted" style="margin:12px 0 0">Las primeras filas muestran el carácter en claro para calcarlo; las últimas están vacías para escribirlo de memoria. El archivo se guarda en la carpeta de descargas de tu navegador.</p>
            </div>
          </section>
        </div>
        <aside class="writing-side">
          <div class="panel">
            <div class="panel-head"><h2>📋 Ficha del carácter</h2></div>
            <div class="panel-body flush"><div style="padding:0 20px 14px">
              <div class="info-row"><span>Carácter</span><span style="font-size:24px">${E(entry.char)}</span></div>
              <div class="info-row"><span>Significado</span><span>${E(entry.meaning)}</span></div>
              <div class="info-row"><span>Lectura</span><span>${E(entry.reading)}</span></div>
              <div class="info-row"><span>Radical</span><span>${E(entry.radical)}</span></div>
              <div class="info-row"><span>Trazos</span><span>${entry.strokes}</span></div>
              ${groups.find((g) => g.entries.some(({ entry: e }) => e.char === entry.char) && g.lessonId)
                ? `<div class="info-row"><span>Lección</span><a href="#/lesson/${groups.find((g) => g.entries.some(({ entry: e }) => e.char === entry.char) && g.lessonId).lessonId}">${E(groups.find((g) => g.entries.some(({ entry: e }) => e.char === entry.char) && g.lessonId).title)} →</a></div>`
                : ""}
            </div></div>
          </div>
          <div class="panel">
            <div class="panel-head"><h2>🌱 Derivados</h2></div>
            <div class="panel-body flush"><div style="padding:0 20px 14px">
              ${entry.derivatives.map((d) => {
                const known = PolyWriting.find(lang.id, d[0]);
                const inner = `<div class="deriv-char">${E(d[0])}</div><div class="deriv-body"><div class="deriv-reading">${E(d[1])}</div><div class="deriv-meaning">${E(d[2])}</div></div>`;
                return known
                  ? `<a class="deriv-item" href="${writingCharHref(lang.id, d[0])}">${inner}<span class="muted">→</span></a>`
                  : `<div class="deriv-item">${inner}</div>`;
              }).join("")}
            </div></div>
          </div>
          <div class="panel">
            <div class="panel-body">
              <div class="download-label" style="margin-bottom:9px">Lleva tu práctica contigo</div>
              <div class="download-list">
                <button class="download-item" data-action="writing-sheet-pdf"><span class="download-icon pdf">PDF</span><span class="download-info"><span class="download-label">Cuaderno tianzige</span><span class="download-desc">3 filas guiadas + 2 vacías</span></span><span>↓</span></button>
                <button class="download-item" data-action="writing-sheet-txt"><span class="download-icon txt">TXT</span><span class="download-info"><span class="download-label">Plantilla en texto</span><span class="download-desc">Datos y derivados</span></span><span>↓</span></button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div></main>`;
  }

  /* ---------------- Progress ---------------- */
  function progressHtml() {
    const stats = P.stats(uid());
    const stateData = stats.state;
    const completedList = D.allLessons.filter((l) => stateData.completed[l.id]);
    const favorites = D.allLessons.filter((l) => stateData.favorites.includes(l.id));
    return `<main class="page"><div class="container">
      <div class="breadcrumb"><a href="#/">Inicio</a><span class="breadcrumb-sep">/</span><span>Mi progreso</span></div>
      <div class="section-head"><div><span class="eyebrow">Tu seguimiento</span><h1 class="h1">Tu progreso</h1><p class="lead">${state.user ? `Sesión de ${E(state.user.name)}.` : "Estás usando el modo invitado. Crea una cuenta para guardar tu avance en este navegador."}</p></div>
        ${!state.user ? '<button class="btn btn-primary" data-action="open-auth" data-mode="register">Crear cuenta</button>' : ""}
      </div>
      <div class="quick-grid">
        <div class="quick-card"><span class="quick-icon">✅</span><div><h4>${stats.completed} / ${stats.total}</h4><p>lecciones completadas</p></div></div>
        <div class="quick-card"><span class="quick-icon">⚡</span><div><h4>${stats.xp} XP</h4><p>puntos acumulados</p></div></div>
        <div class="quick-card"><span class="quick-icon">★</span><div><h4>${stats.favorites}</h4><p>lecciones favoritas</p></div></div>
      </div>
      <section class="section">
        <div class="section-head"><div><h2 class="h2">Avance por idioma</h2></div></div>
        <div class="resource-grid">
          ${D.languages.map((lang) => {
            const s = stats.byLang[lang.id] || { done: 0, total: 0 };
            const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
            return `<div class="resource-card" style="--lang-color:${lang.color}">
              <h3>${lang.emoji} ${lang.name}</h3>
              <p class="small muted">${lang.exam.name} · ${lang.levels.length} niveles oficiales</p>
              <div class="progress-label"><span>${s.done} de ${s.total} lecciones</span><span>${pct}%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
              <a class="btn btn-ghost btn-small" href="#/lang/${lang.id}">Continuar →</a>
            </div>`;
          }).join("")}
        </div>
      </section>
      <section class="section">
        <div class="section-head"><div><h2 class="h2">Lecciones completadas</h2></div></div>
        ${completedList.length ? `<div class="lesson-grid">${completedList.map((l) => `<article class="lesson-card completed">
          <span class="lesson-num">${E(D.findLanguage(l.langId).name)}</span>
          <h3 class="lesson-title">${E(l.title)}</h3>
          <p class="lesson-desc">Completada el ${new Date(stateData.completed[l.id].date).toLocaleDateString("es-ES")} · ${stateData.completed[l.id].score}/${stateData.completed[l.id].total}</p>
          <a class="btn btn-ghost btn-small" href="#/lesson/${l.id}">Repasar →</a>
        </article>`).join("")}</div>` : `<div class="empty-state"><span class="empty-icon">🌱</span><h3>Aún no hay lecciones completadas</h3><p>Responde correctamente el cuestionario de una lección para empezar.</p></div>`}
      </section>
      ${favorites.length ? `<section class="section">
        <div class="section-head"><div><h2 class="h2">Favoritos</h2></div></div>
        <div class="lesson-grid">${favorites.map((l) => `<article class="lesson-card"><span class="lesson-num">★ Favorito</span><h3 class="lesson-title">${E(l.title)}</h3><a class="btn btn-ghost btn-small" href="#/lesson/${l.id}">Abrir →</a></article>`).join("")}</div>
      </section>` : ""}
    </div></main>`;
  }

  function notFoundHtml() {
    return `<main class="page"><div class="container"><div class="empty-state"><span class="empty-icon">🔍</span><h3>Página no encontrada</h3><p>El contenido que buscas no existe.</p><a class="btn btn-primary" href="#/">Volver al inicio</a></div></div></main>`;
  }

  /* ---------------- Auth modal ---------------- */
  function renderModal() {
    if (state.langPickerOpen) {
      modalRoot.innerHTML = `<div class="modal-overlay" data-action="overlay">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Elige un idioma">
          <div class="modal-head">
            <div><h2 class="modal-title">¿Con qué idioma empiezas?</h2>
            <p class="modal-sub">Elige uno para ir a sus lecciones y niveles.</p></div>
            <button class="modal-close" data-action="close-auth" aria-label="Cerrar">✕</button>
          </div>
          <div class="modal-body">
            <div class="language-picker">
              ${D.languages.map((lang) => `<button class="language-picker-btn" data-action="lang-choice" data-href="#/lang/${lang.id}" style="--lang-color:${lang.color}">
                <span class="language-picker-icon">${lang.emoji}</span>
                <span><strong>${E(lang.name)}</strong><small>${E(lang.native)} · ${lang.levels.length} niveles</small></span>
                <span class="muted">→</span>
              </button>`).join("")}
            </div>
          </div>
        </div>
      </div>`;
      return;
    }
    if (state.authMode === null) {
      modalRoot.innerHTML = "";
      return;
    }
    const register = state.authMode === "register";
    modalRoot.innerHTML = `<div class="modal-overlay" data-action="overlay">
      <div class="modal" role="dialog" aria-modal="true" aria-label="${register ? "Crear cuenta" : "Iniciar sesión"}">
        <div class="modal-head">
          <div><h2 class="modal-title">${register ? "Crea tu cuenta" : "Bienvenido de nuevo"}</h2>
          <p class="modal-sub">${register ? "Guarda tu progreso y tus lecciones favoritas." : "Continúa donde lo dejaste."}</p></div>
          <button class="modal-close" data-action="close-auth" aria-label="Cerrar">✕</button>
        </div>
        <form id="auth-form" novalidate>
          <div class="modal-body">
            ${register ? '<div class="field"><label class="field-label" for="auth-name">Nombre</label><input class="input" id="auth-name" name="name" autocomplete="name" placeholder="Tu nombre" required></div>' : ""}
            <div class="field"><label class="field-label" for="auth-email">Correo electrónico</label><input class="input" id="auth-email" name="email" type="email" autocomplete="email" placeholder="tu@correo.com" required></div>
            <div class="field"><label class="field-label" for="auth-password">Contraseña</label><input class="input" id="auth-password" name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" placeholder="Mínimo 6 caracteres" required></div>
            <p class="form-error">${E(state.authError)}</p>
            <button class="btn btn-primary btn-block" type="submit">${register ? "Crear cuenta" : "Entrar"}</button>
            <p class="modal-note">Tus datos se guardan solo en este navegador (modo demostración).</p>
          </div>
        </form>
        <div class="modal-foot">
          <div class="auth-switch">${register ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}
            <button class="switch-link" data-action="auth-choose" data-mode="${register ? "login" : "register"}">${register ? "Inicia sesión" : "Regístrate gratis"}</button>
          </div>
        </div>
      </div>
    </div>`;
    const first = modalRoot.querySelector(register ? "#auth-name" : "#auth-email");
    if (first) first.focus();
  }

  /* ---------------- Render ---------------- */
  function render() {
    document.documentElement.dataset.theme = state.theme;
    if (state.examMockTimer && !(state.route[0] === "exam" && state.examMode === "mock" && state.examMock && !state.examMockChecked)) {
      clearInterval(state.examMockTimer);
      state.examMockTimer = null;
    }
    if (writingController) { writingController.destroy(); writingController = null; }
    const [a, b] = state.route;
    let content;
    if (!a) content = homeHtml();
    else if (a === "lang") content = languageHtml(b, state.route[2]);
    else if (a === "lesson") content = lessonHtml(b);
    else if (a === "resources") content = resourcesHtml();
    else if (a === "about") content = aboutHtml();
    else if (a === "exams") content = examsHtml();
    else if (a === "exam") content = examHtml(state.route[2] || state.route[1]);
    else if (a === "writing") content = writingHtml(b, state.route[2]);
    else if (a === "progress") content = progressHtml();
    else content = notFoundHtml();
    appEl.innerHTML = headerHtml() + content + footerHtml();
    if (a === "writing" && state.route[2]) {
      const langId = b;
      const entry = PolyWriting.find(langId, decodeURIComponent(state.route[2]));
      const mountEl = document.getElementById("writing-canvas");
      if (entry && mountEl) {
        writingController = PolyWriting.mount(mountEl, langId, entry, (msg) => {
          const status = document.getElementById("writing-status");
          if (status) status.textContent = msg;
        });
      }
      const previewEl = document.getElementById("worksheet-preview");
      if (entry && previewEl) R.renderWorksheetPreview(entry, D.findLanguage(langId), previewEl);
    }
    renderModal();
  }

  /* ---------------- Events ---------------- */
  document.addEventListener("click", (ev) => {
    const target = ev.target.closest("[data-action]");
    if (!target) {
      if (state.menuOpen) { state.menuOpen = false; render(); }
      return;
    }
    const action = target.dataset.action;
    const lessonId = state.route[0] === "lesson" ? state.route[1] : null;
    const lesson = lessonId ? D.findLesson(lessonId) : null;
    const lang = lesson ? D.findLanguage(lesson.langId) : null;
    const examCard = state.route[0] === "exam" ? state.examQueue[state.examIndex] : null;
    const writingLang = state.route[0] === "writing" ? D.findLanguage(state.route[1]) : null;
    const writingEntry = writingLang && state.route[2]
      ? PolyWriting.find(state.route[1], decodeURIComponent(state.route[2]))
      : null;

    switch (action) {
      case "nav":
        state.menuOpen = false;
        state.langPickerOpen = false;
        renderModal();
        go(target.dataset.href.replace(/^#/, ""));
        break;
      case "choose-language":
        state.langPickerOpen = true;
        renderModal();
        break;
      case "lang-choice":
        state.langPickerOpen = false;
        renderModal();
        go(target.dataset.href.replace(/^#/, ""));
        break;
      case "scroll-top":
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "theme":
        state.theme = state.theme === "dark" ? "light" : "dark";
        localStorage.setItem("tres-tintas_theme", state.theme);
        render();
        break;
      case "toggle-menu":
        state.menuOpen = !state.menuOpen;
        render();
        break;
      case "open-auth":
        state.authMode = "login";
        state.authError = "";
        state.menuOpen = false;
        renderModal();
        break;
      case "auth-choose":
        state.authMode = target.dataset.mode;
        state.authError = "";
        renderModal();
        break;
      case "close-auth":
      case "overlay":
        if (action === "overlay" && ev.target !== target) return;
        state.authMode = null;
        state.authError = "";
        state.langPickerOpen = false;
        renderModal();
        break;
      case "logout":
        A.logout();
        state.user = null;
        state.menuOpen = false;
        go("/");
        toast("Sesión cerrada.");
        break;
      case "speak":
        if (target.dataset.src) S.playFile(target.dataset.src, target, target.dataset.text, target.dataset.lang);
        else S.speak(target.dataset.text, target.dataset.lang, target);
        break;
      case "select-option": {
        if (!lesson) break;
        const qi = Number(target.dataset.q);
        if (!state.quizAnswers[lesson.id]) state.quizAnswers[lesson.id] = {};
        state.quizAnswers[lesson.id][qi] = Number(target.dataset.o);
        render();
        break;
      }
      case "check-quiz": {
        if (!lesson) break;
        const answers = state.quizAnswers[lesson.id] || {};
        let correct = 0;
        lesson.quiz.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
        state.quizChecked[lesson.id] = true;
        const res = P.recordQuiz(uid(), lesson, answers, correct);
        if (res.passed) toast("¡Lección completada! +50 XP 🎉", "success");
        else toast(`Has acertado ${correct} de ${lesson.quiz.length}.`, "error");
        render();
        break;
      }
      case "retry-quiz":
        if (!lesson) break;
        delete state.quizChecked[lesson.id];
        delete state.quizAnswers[lesson.id];
        render();
        break;
      case "favorite":
        if (!lesson) break;
        const added = P.toggleFavorite(uid(), lesson.id);
        toast(added ? "Añadido a favoritos ★" : "Eliminado de favoritos", "success");
        render();
        break;
      case "lesson-pdf":
        R.downloadLessonPdf(lesson, lang);
        break;
      case "lesson-txt":
        R.downloadLessonTxt(lesson, lang);
        break;
      case "guide-pdf": {
        const gLang = D.findLanguage(target.dataset.lang);
        const gLevel = gLang.levels.find((l) => l.key === target.dataset.level);
        R.downloadGuidePdf(gLang, gLevel);
        break;
      }
      case "guide-txt": {
        const gLang = D.findLanguage(target.dataset.lang);
        const gLevel = gLang.levels.find((l) => l.key === target.dataset.level);
        R.downloadGuideTxt(gLang, gLevel);
        break;
      }
      case "vocab-csv":
        R.downloadVocabCsv(D.findLanguage(target.dataset.lang));
        break;
      case "writing-animate":
        if (writingController) writingController.animate();
        break;
      case "writing-practice":
        if (writingController) writingController.practice();
        break;
      case "lesson-page":
        state.lessonPage = Math.max(0, Number(target.dataset.page));
        render();
        break;
      case "writing-filter":
        state.writingFilterCompleted = !state.writingFilterCompleted;
        render();
        break;
      case "writing-reset":
        if (writingController) writingController.reset();
        break;
      case "writing-sheet-pdf":
        if (writingEntry && writingLang) R.downloadWritingPdf(writingEntry, writingLang);
        break;
      case "writing-sheet-txt":
        if (writingEntry && writingLang) R.downloadWritingTxt(writingEntry, writingLang);
        break;
      case "exam-mode":
        state.examMode = target.dataset.mode;
        state.examFlipped = false;
        if (state.examMode === "cards") ensureExamQueue();
        if (state.examMode === "test" && !state.examQuiz) {
          state.examQuiz = PolyExam.makeQuiz(10, state.examLevel);
          state.examQuizAnswers = {};
          state.examQuizChecked = false;
        }
        render();
        break;
      case "exam-flip":
        state.examFlipped = true;
        render();
        break;
      case "exam-review":
        if (!examCard) break;
        PolyExam.review(uid(), examCard.id, target.dataset.correct === "true", state.examLevel);
        state.examIndex++;
        state.examFlipped = false;
        render();
        break;
      case "exam-new-queue":
        state.examQueue = [];
        state.examIndex = 0;
        ensureExamQueue();
        render();
        break;
      case "exam-new-quiz":
        state.examQuiz = PolyExam.makeQuiz(10, state.examLevel);
        state.examQuizAnswers = {};
        state.examQuizChecked = false;
        render();
        break;
      case "exam-quiz-select":
        state.examQuizAnswers[Number(target.dataset.q)] = Number(target.dataset.o);
        render();
        break;
      case "exam-quiz-check": {
        if (!state.examQuiz) break;
        let correct = 0;
        state.examQuiz.forEach((q, i) => {
          const ok = state.examQuizAnswers[i] === q.answer;
          if (ok) correct++;
          PolyExam.review(uid(), q.wordId, ok, state.examLevel);
        });
        state.examQuizChecked = true;
        toast(`Test terminado: ${correct}/10 aciertos`, correct >= 8 ? "success" : "error");
        render();
        break;
      }
      case "exam-new-listening":
        state.examListening = PolyExam.makeListening(10, state.examLevel);
        state.examListeningAnswers = {};
        state.examListeningChecked = false;
        render();
        break;
      case "exam-listening-select":
        state.examListeningAnswers[Number(target.dataset.q)] = Number(target.dataset.o);
        render();
        break;
      case "exam-listening-check": {
        if (!state.examListening) break;
        let correct = 0;
        state.examListening.forEach((q, i) => {
          const ok = state.examListeningAnswers[i] === q.answer;
          if (ok) correct++;
          PolyExam.review(uid(), q.wordId, ok, state.examLevel);
        });
        state.examListeningChecked = true;
        toast(`Escucha: ${correct}/10 aciertos`, correct >= 8 ? "success" : "error");
        render();
        break;
      }
      case "exam-new-reading":
        state.examReading = PolyExam.makeReading(10, state.examLevel);
        state.examReadingAnswers = {};
        state.examReadingChecked = false;
        render();
        break;
      case "exam-reading-select":
        state.examReadingAnswers[Number(target.dataset.q)] = Number(target.dataset.o);
        render();
        break;
      case "exam-reading-check": {
        if (!state.examReading) break;
        let correct = 0;
        state.examReading.forEach((q, i) => { if (state.examReadingAnswers[i] === q.answer) correct++; });
        state.examReadingChecked = true;
        toast(`Lectura: ${correct}/${state.examReading.length} aciertos`, correct >= 8 ? "success" : "error");
        render();
        break;
      }
      case "exam-mock-start":
        state.examMock = PolyExam.makeMock(20, state.examLevel);
        state.examMockAnswers = {};
        state.examMockChecked = false;
        state.examMockSummary = null;
        state.examMockEndsAt = Date.now() + 10 * 60000;
        render();
        if (state.examMockTimer) clearInterval(state.examMockTimer);
        state.examMockTimer = setInterval(() => {
          const left = state.examMockEndsAt - Date.now();
          const el = document.getElementById("exam-timer");
          if (el) el.textContent = `${String(Math.max(0, Math.floor(left / 60000))).padStart(2, "0")}:${String(Math.max(0, Math.floor((left % 60000) / 1000))).padStart(2, "0")}`;
          if (left <= 0) submitMock();
        }, 500);
        break;
      case "exam-mock-select":
        state.examMockAnswers[Number(target.dataset.q)] = Number(target.dataset.o);
        render();
        break;
      case "exam-mock-submit":
        submitMock();
        break;
      case "exam-reset":
        if (!window.confirm(`¿Borrar todo tu progreso de repaso ${state.examLevel.toUpperCase()}?`)) break;
        PolyExam.reset(uid(), state.examLevel);
        state.examQueue = [];
        state.examIndex = 0;
        state.examFlipped = false;
        state.examQuiz = null;
        state.examListening = null;
        state.examReading = null;
        ensureExamQueue();
        render();
        toast(`Progreso ${state.examLevel.toUpperCase()} reiniciado.`);
        break;
      case "hsk-txt":
        R.downloadHskTxt(target.dataset.level || state.examLevel);
        break;
      case "hsk-csv":
        R.downloadHskCsv(target.dataset.level || state.examLevel);
        break;
      case "hsk-anki":
        R.downloadHskAnki(target.dataset.level || state.examLevel);
        break;
    }
  });

  document.addEventListener("input", (ev) => {
    if (ev.target.id !== "exam-search") return;
    const term = ev.target.value.trim().toLocaleLowerCase();
    document.querySelectorAll("#exam-list tr[data-row]").forEach((tr) => {
      tr.style.display = tr.dataset.row.toLocaleLowerCase().includes(term) ? "" : "none";
    });
  });

  document.addEventListener("submit", (ev) => {
    if (ev.target.id !== "auth-form") return;
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const data = {
      name: fd.get("name") || "",
      email: fd.get("email") || "",
      password: fd.get("password") || "",
    };
    const result = state.authMode === "register" ? A.register(data) : A.login(data.email, data.password);
    if (!result.ok) {
      state.authError = result.error;
      renderModal();
      return;
    }
    P.mergeGuest(result.user.id);
    state.user = result.user;
    state.authMode = null;
    state.authError = "";
    renderModal();
    render();
    toast(`¡Hola, ${result.user.name}! 👋`, "success");
  });

  window.addEventListener("hashchange", () => {
    if (S.supported()) S.stop();
    state.route = parseHash();
    state.menuOpen = false;
    state.lessonPage = 0;
    if (state.route[0] === "exam") {
      const routeLevel = state.route[2] || state.route[1];
      const nextLevel = PolyExam.LEVELS.includes(routeLevel) ? routeLevel : "hsk1";
      if (nextLevel !== state.examLevel) {
        state.examLevel = nextLevel;
        state.examQueue = [];
        state.examIndex = 0;
        state.examQuiz = null;
        state.examListening = null;
        state.examReading = null;
        state.examMock = null;
        state.examMockChecked = false;
        state.examMode = "cards";
      }
    }
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  });

  /* ---------------- Init ---------------- */
  state.route = parseHash();
  if (S.supported()) window.speechSynthesis.getVoices();
  render();

  window.PolyApp = { toast, go, render, state };
})();
