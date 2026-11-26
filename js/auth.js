/* =========================================================
   Cuentas de usuario (demo local)
   Guardadas en localStorage del navegador.
   AVISO: esto NO es seguridad de producción: las cuentas solo
   existen en este dispositivo/navegador. Para un despliegue real,
   sustituye este módulo por un backend (Supabase/Firebase/API propia).
   ========================================================= */
window.PolyAuth = (function () {
  const USERS_KEY = "tres-tintas_users_v1";
  const SESSION_KEY = "tres-tintas_session_v1";

  // Hash determinista y sin dependencias. Solo para separar contraseñas
  // en almacenamiento local; NO sustituye a un hash criptográfico en servidor.
  function hash(value) {
    let h1 = 0x811c9dc5, h2 = 0x01000193;
    const salted = "tres-tintas::" + value;
    for (let i = 0; i < salted.length; i++) {
      const c = salted.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
      h2 = Math.imul(h2 + c + i, 2246822519) >>> 0;
    }
    return h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0");
  }

  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  function getUsers() {
    return read(USERS_KEY, []);
  }

  function publicUser(user) {
    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  }

  function register({ name, email, password }) {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    if (cleanName.length < 2) return { ok: false, error: "Escribe un nombre de al menos 2 caracteres." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return { ok: false, error: "Introduce un correo electrónico válido." };
    if ((password || "").length < 6) return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };

    const users = getUsers();
    if (users.some((u) => u.email === cleanEmail)) {
      return { ok: false, error: "Ya existe una cuenta con ese correo electrónico." };
    }

    const user = {
      id: "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: cleanName,
      email: cleanEmail,
      passwordHash: hash(password),
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    write(USERS_KEY, users);
    write(SESSION_KEY, user.id);
    return { ok: true, user: publicUser(user) };
  }

  function login(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const users = getUsers();
    const user = users.find((u) => u.email === cleanEmail);
    if (!user || user.passwordHash !== hash(password || "")) {
      return { ok: false, error: "Correo o contraseña incorrectos." };
    }
    write(SESSION_KEY, user.id);
    return { ok: true, user: publicUser(user) };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function currentUser() {
    const id = read(SESSION_KEY, null);
    if (!id) return null;
    const user = getUsers().find((u) => u.id === id);
    return publicUser(user);
  }

  return { register, login, logout, currentUser };
})();
