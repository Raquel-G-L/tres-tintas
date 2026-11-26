/* =========================================================
   Libreta de caligrafía: orden de trazos, práctica y derivados
   - Chino / kanji: Hanzi Writer (CDN)
   - Hangul: trails SVG propios
   ========================================================= */
window.PolyWriting = (function () {
  const CHARS = {
    zh: [
      { char: "人", reading: "rén", meaning: "persona", radical: "人", strokes: 2, note: "A la izquierda de otros caracteres se convierte en 亻.", derivatives: [["从", "cóng", "seguir"], ["众", "zhòng", "multitud"], ["休", "xiū", "descansar"], ["你", "nǐ", "tú"]] },
      { char: "口", reading: "kǒu", meaning: "boca / abertura", radical: "口", strokes: 3, note: "El radical 口 aparece en casi todas las palabras relacionadas con la boca.", derivatives: [["吃", "chī", "comer"], ["叫", "jiào", "llamarse"], ["问", "wèn", "preguntar"], ["品", "pǐn", "producto"]] },
      { char: "日", reading: "rì", meaning: "sol / día", radical: "日", strokes: 4, note: "Dentro de una sílaba, 日 suele indicar tiempo o luz.", derivatives: [["明", "míng", "brillante"], ["星", "xīng", "estrella"], ["时", "shí", "tiempo"], ["早", "zǎo", "temprano"]] },
      { char: "月", reading: "yuè", meaning: "luna / mes", radical: "月", strokes: 4, note: "Como radical a la izquierda (月) aparece en palabras del cuerpo.", derivatives: [["明", "míng", "brillante"], ["朋", "péng", "amigo"], ["脸", "liǎn", "cara"]] },
      { char: "木", reading: "mù", meaning: "madera / árbol", radical: "木", strokes: 4, note: "Uno de los radicales más productivos: 木 → 林 → 森.", derivatives: [["林", "lín", "bosque"], ["森", "sēn", "selva"], ["树", "shù", "árbol"], ["休", "xiū", "descansar"]] },
      { char: "水", reading: "shuǐ", meaning: "agua", radical: "水", strokes: 4, note: "El radical 氵 (tres gotas) deriva de 水.", derivatives: [["河", "hé", "río"], ["海", "hǎi", "mar"], ["泉", "quán", "manantial"]] },
      { char: "火", reading: "huǒ", meaning: "fuego", radical: "火", strokes: 4, note: "Como radical izquierdo se escribe 火 o 灬 abajo.", derivatives: [["炎", "yán", "llama"], ["灯", "dēng", "lámpara"], ["烧", "shāo", "arder"]] },
      { char: "山", reading: "shān", meaning: "montaña", radical: "山", strokes: 3, note: "La forma primitiva imitaba tres picos.", derivatives: [["出", "chū", "salir"], ["岛", "dǎo", "isla"], ["岩", "yán", "roca"]] },
      { char: "女", reading: "nǚ", meaning: "mujer", radical: "女", strokes: 3, note: "El radical 女 aparece en muchos apellidos y palabras de parentesco.", derivatives: [["好", "hǎo", "bueno"], ["妈", "mā", "mamá"], ["姐", "jiě", "hermana"]] },
      { char: "子", reading: "zǐ", meaning: "niño / semilla", radical: "子", strokes: 3, note: "También funciona como sufijo de persona o cosa pequeña.", derivatives: [["好", "hǎo", "bueno"], ["学", "xué", "estudiar"], ["字", "zì", "carácter"]] },
      { char: "好", reading: "hǎo", meaning: "bueno / gustar", radical: "女", strokes: 6, note: "Compuesto por 女 (mujer) + 子 (niño): «bueno».",
        derivatives: [["你好", "nǐ hǎo", "hola"], ["好吃", "hǎochī", "delicioso"], ["好事", "hǎoshì", "buena acción"]] },
      { char: "明", reading: "míng", meaning: "brillante / claro", radical: "日", strokes: 8, note: "Compuesto por 日 (sol) + 月 (luna): «brillante».",
        derivatives: [["明天", "míngtiān", "mañana"], ["明白", "míngbai", "entender"], ["光明", "guāngmíng", "luminoso"]] },
    ],
    ja: [
      { char: "日", reading: "にち / じつ", meaning: "sol / día", radical: "日", strokes: 4, note: "Kanji de uso cotidiano: aparece en días de la semana.", derivatives: [["明日", "あした", "mañana"], ["日曜日", "にちようび", "domingo"], ["日本", "にほん", "Japón"]] },
      { char: "月", reading: "げつ / つき", meaning: "luna / mes", radical: "月", strokes: 4, note: "También da nombre al lunes: 月曜日.", derivatives: [["月曜日", "げつようび", "lunes"], ["一月", "いちがつ", "enero"], ["月光", "げっこう", "luz de luna"]] },
      { char: "山", reading: "さん / やま", meaning: "montaña", radical: "山", strokes: 3, note: "Su forma representa tres cumbres.", derivatives: [["火山", "かざん", "volcán"], ["登山", "とざん", "montañismo"], ["山田", "やまだ", "Yamada"]] },
      { char: "水", reading: "すい / みず", meaning: "agua", radical: "水", strokes: 4, note: "El radical 氵 deriva de este kanji.", derivatives: [["水曜日", "すいようび", "miércoles"], ["水泳", "すいえい", "natación"], ["果汁", "かじゅう", "zumo"]] },
      { char: "火", reading: "か / ひ", meaning: "fuego", radical: "火", strokes: 4, note: "El martes es 火曜日, «día del fuego».", derivatives: [["火曜日", "かようび", "martes"], ["花火", "はなび", "fuegos artificiales"], ["火山", "かざん", "volcán"]] },
      { char: "木", reading: "もく / き", meaning: "madera / árbol", radical: "木", strokes: 4, note: "El jueves es 木曜日, «día de la madera».", derivatives: [["木曜日", "もくようび", "jueves"], ["森林", "しんりん", "bosque"], ["木材", "もくざい", "madera"]] },
      { char: "人", reading: "じん / ひと", meaning: "persona", radical: "人", strokes: 2, note: "El radical 亻 se usa en la mayoría de kanji de personas.", derivatives: [["人口", "じんこう", "población"], ["大人", "おとな", "adulto"], ["人気", "にんき", "popularidad"]] },
      { char: "口", reading: "こう / くち", meaning: "boca / abertura", radical: "口", strokes: 3, note: "Aparece en kanji relacionados con hablar y comer.", derivatives: [["人口", "じんこう", "población"], ["口笛", "くちぶえ", "silbidito"], ["口紅", "くちべに", "pintalabios"]] },
      { char: "田", reading: "た / たん", meaning: "campo / arrozal", radical: "田", strokes: 5, note: "Un cuadrado dividido en cuatro: campos cultivados.", derivatives: [["田舎", "いなか", "campo / pueblo"], ["水田", "すいでん", "arrozal"], ["田んぼ", "たんぼ", "arrozal"]] },
      { char: "雨", reading: "う / あめ", meaning: "lluvia", radical: "雨", strokes: 8, note: "Las cuatro gotas interiores son la parte inferior.", derivatives: [["雨傘", "あまがさ", "paraguas"], ["雨天", "うてん", "día lluvioso"], ["大雨", "おおあめ", "lluvia fuerte"]] },
      { char: "学", reading: "がく / まな", meaning: "estudiar / aprendizaje", radical: "子", strokes: 8, note: "La parte superior es una simplificación de 学 («escuela»).", derivatives: [["学校", "がっこう", "escuela"], ["学生", "がくせい", "estudiante"], ["大学", "だいがく", "universidad"]] },
      { char: "生", reading: "せい / い", meaning: "vida / nacer", radical: "生", strokes: 5, note: "También significa «crudo» en algunos compuestos.", derivatives: [["学生", "がくせい", "estudiante"], ["先生", "せんせい", "profesor"], ["生活", "せいかつ", "vida / estilo de vida"]] },
    ],
    ko: [
      { char: "ㄱ", reading: "giyeok", meaning: "primera consonante (g/k)", radical: "ㄱ", strokes: 2, note: "Se escribe de arriba abajo: primero la horizontal, luego la vertical.", derivatives: [["가", "ga", "ir / centro"], ["고", "go", "así / alto"], ["국", "guk", "sopa / país"]] },
      { char: "ㄴ", reading: "nieun", meaning: "segunda consonante (n)", radical: "ㄴ", strokes: 1, note: "Un solo trazo: baja y gira a la derecha.", derivatives: [["나", "na", "yo (informal)"], ["노", "no", "canción"], ["눈", "nun", "ojo / nieve"]] },
      { char: "ㄷ", reading: "digeut", meaning: "tercera consonante (d/t)", radical: "ㄷ", strokes: 3, note: "Arriba, izquierda y abajo, en ese orden.", derivatives: [["다", "da", "todo / hacer"], ["두", "du", "dos / cabeza"], ["닫다", "datda", "cerrar"]] },
      { char: "ㄹ", reading: "rieul", meaning: "cuarta consonante (r/l)", radical: "ㄹ", strokes: 5, note: "Cinco trazos: alterna horizontales y verticales.", derivatives: [["라", "ra", "la (sílaba)"], ["리", "ri", "ri (sílaba)"], ["물", "mul", "agua"]] },
      { char: "ㅁ", reading: "mieum", meaning: "quinta consonante (m)", radical: "ㅁ", strokes: 3, note: "Primero la horizontal superior, luego los laterales y la base.", derivatives: [["마", "ma", "¿qué? / caballo"], ["맛", "mat", "sabor"], ["문", "mun", "puerta"]] },
      { char: "ㅂ", reading: "bieup", meaning: "sexta consonante (b/p)", radical: "ㅂ", strokes: 4, note: "Dos verticales, una horizontal media y la base.", derivatives: [["바", "ba", "bar / mar"], ["보", "bo", "ver"], ["밥", "bap", "arroz"]] },
      { char: "ㅅ", reading: "siot", meaning: "séptima consonante (s)", radical: "ㅅ", strokes: 2, note: "Dos diagonales desde el mismo punto superior.", derivatives: [["사", "sa", "comprar / cuatro"], ["서", "seo", "escribir / oeste"], ["소", "so", "vaca / pequeño"]] },
      { char: "ㅇ", reading: "ieung", meaning: "octava consonante (silent ng)", radical: "ㅇ", strokes: 1, note: "Un círculo en sentido horario. Al inicio de sílaba no suena.", derivatives: [["아", "a", "ah / niño"], ["오", "o", "cinco / venir"], ["안", "an", "no / dentro"]] },
      { char: "ㅈ", reading: "jiet", meaning: "novena consonante (j)", radical: "ㅈ", strokes: 3, note: "Una horizontal y dos diagonales como ㅅ.", derivatives: [["자", "ja", "dormir / uno mismo"], ["주", "ju", "semana / dar"], ["지", "ji", "tierra / saber"]] },
      { char: "ㅊ", reading: "chiet", meaning: "décima consonante (ch)", radical: "ㅊ", strokes: 4, note: "Es ㅈ con un trazo corto encima.", derivatives: [["차", "cha", "té / coche"], ["초", "cho", "primero / vela"], ["치", "chi", "diente / golpear"]] },
      { char: "ㅋ", reading: "kieuk", meaning: "consonante aspirada (k)", radical: "ㅋ", strokes: 3, note: "Como ㄱ con una barra corta en el centro.", derivatives: [["카", "ka", "ka (sílaba)"], ["코", "ko", "nariz"], ["크다", "keuda", "grande"]] },
      { char: "ㅌ", reading: "tieut", meaning: "consonante aspirada (t)", radical: "ㅌ", strokes: 4, note: "Como ㄷ con una barra corta en el centro.", derivatives: [["타", "ta", "montar / quemar"], ["토", "to", "tierra / conejo"], ["트", "teu", "teu (sílaba)"]] },
      { char: "ㅍ", reading: "pieup", meaning: "consonante aspirada (p)", radical: "ㅍ", strokes: 4, note: "Dos horizontales y dos verticales que las unen.", derivatives: [["파", "pa", "verde / ola"], ["포", "po", "puerto"], ["피", "pi", "sangre / pelo"]] },
      { char: "ㅎ", reading: "hieut", meaning: "consonante (h)", radical: "ㅎ", strokes: 3, note: "Dos horizontales y un trazo vertical descendente.", derivatives: [["하", "ha", "hacer / verano"], ["호", "ho", "lago / bueno"], ["한", "han", "coreano / uno"]] },
      { char: "ㅏ", reading: "a", meaning: "vowel a", radical: "ㅏ", strokes: 2, note: "Vertical y una barra corta hacia la derecha.", derivatives: [["가", "ga", "ir"], ["나", "na", "yo"], ["사", "sa", "cuatro"]] },
      { char: "ㅓ", reading: "eo", meaning: "vowel eo", radical: "ㅓ", strokes: 2, note: "Barra corta a la izquierda y vertical.", derivatives: [["거", "geo", "cosa / allí"], ["너", "neo", "tú"], ["서", "seo", "escribir"]] },
      { char: "ㅗ", reading: "o", meaning: "vowel o", radical: "ㅗ", strokes: 2, note: "Horizontal y un trazo corto hacia arriba.", derivatives: [["고", "go", "así / alto"], ["노", "no", "canción"], ["보", "bo", "ver"]] },
      { char: "ㅜ", reading: "u", meaning: "vowel u", radical: "ㅜ", strokes: 2, note: "Vertical corto y horizontal en la base.", derivatives: [["구", "gu", "nueve / bola"], ["누", "nu", "quien"], ["주", "ju", "semana"]] },
      { char: "ㅡ", reading: "eu", meaning: "vowel eu", radical: "ㅡ", strokes: 1, note: "Un único trazo horizontal.", derivatives: [["그", "geu", "eso / él"], ["느", "neu", "sentir"], ["쓰", "sseu", "escribir"]] },
      { char: "ㅣ", reading: "i", meaning: "vowel i", radical: "ㅣ", strokes: 1, note: "Un único trazo vertical.", derivatives: [["기", "gi", "energía / semana"], ["미", "mi", "belleza / aún no"], ["시", "si", "tiempo / poema"]] },
    ],
  };

  // Trazos en un lienzo 100×100 para el hangul (path SVG)
  const HANGUL_STROKES = {
    "ㄱ": ["M22 26 L78 26", "M78 26 L78 78"],
    "ㄴ": ["M28 22 L28 78 L80 78"],
    "ㄷ": ["M20 26 L82 26", "M24 26 L24 78", "M24 78 L82 78"],
    "ㄹ": ["M20 24 L80 24", "M80 24 L80 48", "M80 48 L22 48", "M22 48 L22 78", "M22 78 L82 78"],
    "ㅁ": ["M22 24 L80 24", "M22 24 L22 78", "M80 24 L80 78 L22 78"],
    "ㅂ": ["M24 22 L24 80", "M78 22 L78 80", "M24 42 L78 42", "M24 80 L78 80"],
    "ㅅ": ["M50 20 L20 80", "M50 20 L82 80"],
    "ㅇ": ["M50 18 A32 32 0 1 0 50.1 18"],
    "ㅈ": ["M20 26 L80 26", "M50 26 L22 80", "M50 26 L80 80"],
    "ㅊ": ["M50 12 L50 20", "M20 30 L80 30", "M50 30 L22 82", "M50 30 L80 82"],
    "ㅋ": ["M20 26 L80 26", "M78 26 L78 78", "M48 52 L78 52"],
    "ㅌ": ["M20 26 L80 26", "M78 26 L78 78", "M26 50 L70 50", "M26 78 L78 78"],
    "ㅍ": ["M20 24 L82 24", "M20 78 L82 78", "M30 24 L30 78", "M72 24 L72 78"],
    "ㅎ": ["M20 26 L80 26", "M20 52 L80 52", "M50 52 L50 82"],
    "ㅏ": ["M35 18 L35 82", "M35 50 L78 50"],
    "ㅑ": ["M35 18 L35 82", "M35 38 L76 38", "M35 62 L76 62"],
    "ㅓ": ["M22 50 L65 50", "M65 18 L65 82"],
    "ㅕ": ["M24 38 L64 38", "M24 62 L64 62", "M64 18 L64 82"],
    "ㅗ": ["M18 50 L82 50", "M50 50 L50 18"],
    "ㅛ": ["M18 62 L82 62", "M35 62 L35 18", "M65 62 L65 18"],
    "ㅜ": ["M50 18 L50 50", "M18 50 L82 50"],
    "ㅠ": ["M35 18 L35 50", "M65 18 L65 50", "M18 50 L82 50"],
    "ㅡ": ["M18 50 L82 50"],
    "ㅣ": ["M50 18 L50 82"],
  };

  function get(langId) {
    return CHARS[langId] || [];
  }

  function find(langId, char) {
    return get(langId).find((c) => c.char === char) || null;
  }

  function strokesFor(entry) {
    return HANGUL_STROKES[entry.char] || [];
  }

  /* Monta el area de practica. Devuelve un controlador. */
  function mount(container, langId, entry, onProgress) {
    container.innerHTML = "";
    if (langId === "ko") return mountHangul(container, entry, onProgress);
    return mountHanzi(container, langId, entry, onProgress);
  }

  function mountHanzi(container, langId, entry, onProgress) {
    const el = document.createElement("div");
    el.className = "writing-canvas";
    container.appendChild(el);

    if (!window.HanziWriter) {
      el.innerHTML = `<div class="writing-fallback"><span>${entry.char}</span><p>Se necesita internet para cargar los trazos animados de este carácter.</p></div>`;
      return {
        animate() {}, practice() {}, show() {}, reset() {}, destroy() {},
        available: false,
      };
    }

    const options = {
      width: 320,
      height: 320,
      padding: 26,
      showOutline: true,
      showCharacter: true,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 420,
      strokeColor: "#2b3149",
      outlineColor: "#cbd2e6",
      highlightColor: "#5558d8",
      drawingColor: "#5558d8",
      onLoadCharDataError: () => {
        el.innerHTML = `<div class="writing-fallback"><span>${entry.char}</span><p>No hay datos de trazos disponibles para este carácter.</p></div>`;
      },
    };
    if (langId === "ja") {
      options.charDataLoader = (ch, onLoad, onError) => {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data-jp@0/${encodeURIComponent(ch)}.json`)
          .then((res) => res.json())
          .then(onLoad)
          .catch(onError);
      };
    }

    let writer = null;
    try {
      writer = window.HanziWriter.create(el, entry.char, options);
    } catch (_) {
      el.innerHTML = `<div class="writing-fallback"><span>${entry.char}</span><p>No se pudo iniciar el lienzo de escritura.</p></div>`;
      return { animate() {}, practice() {}, show() {}, reset() {}, destroy() {}, available: false };
    }

    let destroyed = false;
    return {
      available: true,
      animate() {
        if (destroyed) return;
        writer.showCharacter({ duration: 0 });
        writer.animateCharacter({ onComplete: () => onProgress && onProgress("Trazos completados") });
        onProgress && onProgress("Animando trazos…");
      },
      practice() {
        if (destroyed) return;
        writer.quiz({
          leniency: 1,
          showHintAfterMisses: 2,
          onMistake: () => onProgress && onProgress("Trazo incorrecto, mira la guía"),
          onCorrectStroke: (data) => onProgress && onProgress(`Correcto · quedan ${data.strokesRemaining} trazos`),
          onComplete: ({ totalMistakes }) => onProgress && onProgress(`¡Terminado! ${totalMistakes} fallos`),
        });
        onProgress && onProgress("Modo práctica: dibuja el carácter");
      },
      show() {
        if (destroyed) return;
        writer.showCharacter();
        onProgress && onProgress("Carácter mostrado");
      },
      reset() {
        if (destroyed) return;
        writer.hideCharacter();
        writer.showCharacter();
        onProgress && onProgress("Lienzo reiniciado");
      },
      destroy() {
        destroyed = true;
        el.innerHTML = "";
      },
    };
  }

  function mountHangul(container, entry, onProgress) {
    const paths = strokesFor(entry);
    const el = document.createElement("div");
    el.className = "writing-canvas writing-hangul";
    el.dataset.mode = "view";
    el.innerHTML = `<svg viewBox="0 0 100 100" class="hangul-svg" aria-label="Trazos de ${entry.char}">
      <g class="hangul-guide">${paths.map((d, i) => `<path class="hangul-stroke" d="${d}" style="--delay:${(i * 0.7).toFixed(2)}s" />`).join("")}</g>
      <g class="hangul-ink"></g>
    </svg>`;
    container.appendChild(el);

    const svg = el.querySelector("svg");
    const ink = el.querySelector(".hangul-ink");
    let drawing = false;
    let current = null;

    const point = (ev) => {
      const rect = svg.getBoundingClientRect();
      return `${(((ev.clientX - rect.left) / rect.width) * 100).toFixed(1)} ${(((ev.clientY - rect.top) / rect.height) * 100).toFixed(1)}`;
    };

    svg.addEventListener("pointerdown", (ev) => {
      if (el.dataset.mode !== "practice") return;
      drawing = true;
      svg.setPointerCapture(ev.pointerId);
      current = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      current.setAttribute("points", point(ev));
      current.setAttribute("class", "user-stroke");
      ink.appendChild(current);
    });
    svg.addEventListener("pointermove", (ev) => {
      if (!drawing || !current) return;
      current.setAttribute("points", current.getAttribute("points") + " " + point(ev));
    });
    const finish = () => { drawing = false; current = null; };
    svg.addEventListener("pointerup", finish);
    svg.addEventListener("pointercancel", finish);

    let timers = [];
    return {
      available: true,
      animate() {
        el.dataset.mode = "view";
        ink.innerHTML = "";
        timers.forEach(clearTimeout);
        timers = [];
        el.querySelectorAll(".hangul-stroke").forEach((p) => {
          p.style.animation = "none";
          void p.getBoundingClientRect();
          p.style.animation = "";
        });
        paths.forEach((_, i) => timers.push(setTimeout(() => {
          onProgress && onProgress(`Trazo ${i + 1} de ${paths.length}`);
        }, i * 700)));
        timers.push(setTimeout(() => onProgress && onProgress("Trazos completados"), paths.length * 700));
        onProgress && onProgress("Animando trazos…");
      },
      practice() {
        timers.forEach(clearTimeout);
        timers = [];
        el.dataset.mode = "practice";
        ink.innerHTML = "";
        onProgress && onProgress("Modo práctica: dibuja sobre la guía");
      },
      show() {
        timers.forEach(clearTimeout);
        timers = [];
        el.dataset.mode = "view";
        ink.innerHTML = "";
        onProgress && onProgress("Carácter mostrado");
      },
      reset() {
        timers.forEach(clearTimeout);
        timers = [];
        ink.innerHTML = "";
        el.dataset.mode = "view";
        onProgress && onProgress("Lienzo reiniciado");
      },
      destroy() {
        timers.forEach(clearTimeout);
        el.innerHTML = "";
      },
    };
  }

  return { get, find, strokesFor, mount };
})();
