/* =========================================================
   Progreso del alumno (por cuenta, con soporte para invitado)
   ========================================================= */
window.PolyProgress = (function () {
  const PREFIX = "tres-tintas_progress_";
  const GUEST_ID = "guest";

  const empty = () => ({ completed: {}, answers: {}, favorites: [], lastLesson: null, xp: 0 });

  function keyFor(userId) {
    return PREFIX + (userId || GUEST_ID);
  }

  function get(userId) {
    try {
      const raw = localStorage.getItem(keyFor(userId));
      if (!raw) return empty();
      return Object.assign(empty(), JSON.parse(raw));
    } catch (_) {
      return empty();
    }
  }

  function save(userId, state) {
    localStorage.setItem(keyFor(userId), JSON.stringify(state));
  }

  function mergeGuest(userId) {
    if (!userId) return;
    const guest = get(GUEST_ID);
    const own = get(userId);
    let changed = false;
    Object.keys(guest.completed).forEach((id) => {
      if (!own.completed[id]) { own.completed[id] = guest.completed[id]; changed = true; }
    });
    Object.keys(guest.answers).forEach((id) => {
      if (!own.answers[id]) { own.answers[id] = guest.answers[id]; changed = true; }
    });
    guest.favorites.forEach((id) => {
      if (!own.favorites.includes(id)) { own.favorites.push(id); changed = true; }
    });
    if (guest.lastLesson && !own.lastLesson) { own.lastLesson = guest.lastLesson; changed = true; }
    own.xp = (own.xp || 0) + (changed ? guest.xp || 0 : 0);
    if (changed) save(userId, own);
    localStorage.removeItem(keyFor(GUEST_ID));
  }

  function recordQuiz(userId, lesson, answers, correctCount) {
    const state = get(userId);
    state.answers[lesson.id] = answers;
    const passed = correctCount === lesson.quiz.length;
    if (passed && !state.completed[lesson.id]) {
      state.completed[lesson.id] = {
        score: correctCount,
        total: lesson.quiz.length,
        date: new Date().toISOString(),
      };
      state.xp = (state.xp || 0) + 50;
    }
    state.lastLesson = lesson.id;
    save(userId, state);
    return { passed, state };
  }

  function isCompleted(userId, lessonId) {
    return Boolean(get(userId).completed[lessonId]);
  }

  function toggleFavorite(userId, lessonId) {
    const state = get(userId);
    const index = state.favorites.indexOf(lessonId);
    if (index >= 0) state.favorites.splice(index, 1);
    else state.favorites.push(lessonId);
    save(userId, state);
    return index < 0;
  }

  function setLastLesson(userId, lessonId) {
    const state = get(userId);
    state.lastLesson = lessonId;
    save(userId, state);
  }

  function stats(userId) {
    const state = get(userId);
    const all = window.POLY_DATA.allLessons;
    const byLang = {};
    let completed = 0;
    all.forEach((lesson) => {
      const done = Boolean(state.completed[lesson.id]);
      if (done) completed++;
      if (!byLang[lesson.langId]) byLang[lesson.langId] = { done: 0, total: 0 };
      byLang[lesson.langId].total++;
      if (done) byLang[lesson.langId].done++;
    });
    return {
      completed,
      total: all.length,
      percent: Math.round((completed / all.length) * 100),
      xp: state.xp || 0,
      favorites: state.favorites.length,
      byLang,
      state,
    };
  }

  return { get, save, mergeGuest, recordQuiz, isCompleted, toggleFavorite, setLastLesson, stats, GUEST_ID };
})();
