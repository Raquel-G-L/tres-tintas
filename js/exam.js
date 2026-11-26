/* =========================================================
   Preparación de exámenes HSK 1 y HSK 2
   - Vocabulario oficial (listas MIT) con glosas en español
   - Tarjetas Leitner, tests, escucha, lectura y simulacros
   ========================================================= */
window.PolyExam = (function () {
  const REGISTRY = window.POLY_EXAM_LEVELS || [];
  const FALLBACK_LEVELS = ["hsk1", "hsk2", "jlpt-n5", "topik-1"];
  const LEVELS = REGISTRY.length ? REGISTRY.map((r) => r.id) : FALLBACK_LEVELS;
  const PREFIX = "tres-tintas_srs_";
  const INTERVALS = [0, 1, 2, 4, 7, 15, 30];
  const GUEST = "guest";

  const ALL_DATA = window.POLY_EXAM_DATA || {};
  const DATASETS = {};
  const LEVEL_META = {};
  REGISTRY.forEach((r) => {
    DATASETS[r.id] = () => ALL_DATA[r.id];
    LEVEL_META[r.id] = r;
  });
  // Compatibilidad si aún no se generó el archivo unificado
  [["hsk1", "POLY_HSK1", { name: "HSK 1", lang: "zh", voice: "zh-CN", dir: "zh", levelKey: "hsk1" }],
   ["hsk2", "POLY_HSK2", { name: "HSK 2", lang: "zh", voice: "zh-CN", dir: "zh", levelKey: "hsk2" }],
   ["jlpt-n5", "POLY_JLPT_N5", { name: "JLPT N5", lang: "ja", voice: "ja-JP", dir: "ja", levelKey: "n5" }],
   ["topik-1", "POLY_TOPIK_1", { name: "TOPIK 1", lang: "ko", voice: "ko-KR", dir: "ko", levelKey: "topik1" }]
  ].forEach(([id, globalName, meta]) => {
    if (!DATASETS[id]) {
      DATASETS[id] = () => window[globalName];
      LEVEL_META[id] = meta;
    }
  });
  const levelMeta = (level = "hsk1") => LEVEL_META[level] || LEVEL_META.hsk1;
  const dataset = (level) => (DATASETS[level] || DATASETS.hsk1)();
  const words = (level = "hsk1") => {
    const d = dataset(level);
    return d && d.words ? d.words : [];
  };
  const find = (id, level = "hsk1") => words(level).find((w) => w.id === Number(id)) || null;
  const audioPath = (w, level = "hsk1") => {
    const m = levelMeta(level);
    return `assets/audio/clips/${m.dir}/${level}/w${w.id}.mp3`;
  };
  const keyFor = (userId, level) => PREFIX + (userId || GUEST) + "_" + level;

  function get(userId, level = "hsk1") {
    try {
      const raw = localStorage.getItem(keyFor(userId, level));
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }
  function save(userId, level, data) {
    localStorage.setItem(keyFor(userId, level), JSON.stringify(data));
  }
  function review(userId, wordId, correct, level = "hsk1") {
    const data = get(userId, level);
    const id = String(wordId);
    const card = data[id] || { box: 0, due: 0, seen: 0, correct: 0, wrong: 0 };
    card.seen++;
    if (correct) {
      card.correct++;
      card.box = Math.min(card.box + 1, INTERVALS.length - 1);
    } else {
      card.wrong++;
      card.box = 0;
    }
    card.due = Date.now() + INTERVALS[card.box] * 86400000;
    data[id] = card;
    save(userId, level, data);
    return card;
  }
  function reset(userId, level = "hsk1") {
    localStorage.removeItem(keyFor(userId, level));
  }
  function stats(userId, level = "hsk1") {
    const data = get(userId, level);
    let seen = 0, mastered = 0, due = 0, totalCorrect = 0, totalWrong = 0;
    words(level).forEach((w) => {
      const c = data[String(w.id)];
      if (!c) return;
      if (c.seen) seen++;
      if (c.box >= 4) mastered++;
      if (c.due <= Date.now()) due++;
      totalCorrect += c.correct || 0;
      totalWrong += c.wrong || 0;
    });
    return { seen, mastered, due, totalCorrect, totalWrong, total: words(level).length };
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function studyQueue(userId, limit, level = "hsk1") {
    const data = get(userId, level);
    const all = words(level);
    const due = all.filter((w) => {
      const c = data[String(w.id)];
      return !c || c.due <= Date.now();
    });
    return shuffle(due.length ? due : all).slice(0, limit || (due.length ? due.length : all.length));
  }

  function makeQuiz(count, level = "hsk1") {
    const pool = shuffle(words(level));
    const n = Math.min(count || 10, pool.length);
    const questions = [];
    for (let i = 0; i < n; i++) {
      const w = pool[i];
      const reversed = Math.random() < 0.4;
      const distractors = shuffle(words(level).filter((x) => x.id !== w.id)).slice(0, 3);
      const options = shuffle([w].concat(distractors));
      questions.push({
        type: "vocab",
        wordId: w.id,
        reversed,
        prompt: reversed ? w.es.split(";")[0] : w.char,
        pinyin: reversed ? "" : w.pinyin,
        options: options.map((o) => ({ id: o.id, label: reversed ? o.char : o.es.split(";")[0] })),
        answer: options.findIndex((o) => o.id === w.id),
      });
    }
    return questions;
  }

  function makeListening(count, level = "hsk1") {
    const pool = shuffle(words(level));
    const n = Math.min(count || 10, pool.length);
    return pool.slice(0, n).map((w) => {
      const distractors = shuffle(words(level).filter((x) => x.id !== w.id)).slice(0, 3);
      const options = shuffle([w].concat(distractors));
      return {
        type: "listening",
        wordId: w.id,
        level,
        audio: audioPath(w, level),
        options: options.map((o) => ({ id: o.id, label: o.char })),
        answer: options.findIndex((o) => o.id === w.id),
      };
    });
  }

  const READING = {
    hsk1: [
      { text: "我叫小明，我是学生。", pinyin: "Wǒ jiào Xiǎomíng, wǒ shì xuésheng.", question: "¿Qué es 小明?", options: ["学生", "老师", "医生", "爸爸"], answer: 0, explain: "«我是学生» = soy estudiante." },
      { text: "今天天气很好。", pinyin: "Jīntiān tiānqì hěn hǎo.", question: "¿Cómo está el tiempo hoy?", options: ["很好", "很冷", "下雨", "很贵"], answer: 0, explain: "天气很好 = el tiempo está muy bien." },
      { text: "我爸爸是医生。", pinyin: "Wǒ bàba shì yīshēng.", question: "¿Quién es médico?", options: ["我爸爸", "我学生", "我老师", "我朋友"], answer: 0, explain: "爸爸 = padre; 医生 = médico." },
      { text: "我要一杯茶。", pinyin: "Wǒ yào yī bēi chá.", question: "¿Qué quiere la persona?", options: ["茶", "米饭", "苹果", "水果"], answer: 0, explain: "要 = querer; 茶 = té." },
      { text: "电脑在桌子上。", pinyin: "Diànnǎo zài zhuōzi shàng.", question: "¿Dónde está el ordenador?", options: ["桌子上", "椅子下", "家里", "学校"], answer: 0, explain: "在…上 = sobre; 桌子 = mesa." },
      { text: "现在八点。", pinyin: "Xiànzài bā diǎn.", question: "¿Qué hora es?", options: ["八点", "八岁", "八个", "八年"], answer: 0, explain: "点 indica la hora; 岁 la edad." },
      { text: "我喜欢看电影。", pinyin: "Wǒ xǐhuan kàn diànyǐng.", question: "¿Qué le gusta hacer?", options: ["看电影", "看电视", "看书", "睡觉"], answer: 0, explain: "喜欢 = gustar; 看电影 = ver películas." },
      { text: "他是我的朋友。", pinyin: "Tā shì wǒ de péngyou.", question: "¿Quién es él?", options: ["我的朋友", "我的爸爸", "我的老师", "我的同学"], answer: 0, explain: "的 indica posesión: 我的朋友 = mi amigo." },
      { text: "我去商店买苹果。", pinyin: "Wǒ qù shāngdiàn mǎi píngguǒ.", question: "¿Adónde va?", options: ["商店", "医院", "学校", "火车站"], answer: 0, explain: "去 = ir; 商店 = tienda." },
      { text: "这件衣服太贵了。", pinyin: "Zhè jiàn yīfu tài guì le.", question: "¿Cómo es la ropa?", options: ["太贵了", "太便宜了", "很漂亮", "很小"], answer: 0, explain: "太…了 = demasiado…; 贵 = caro." },
      { text: "你好吗？——我很好，谢谢。", pinyin: "Nǐ hǎo ma? — Wǒ hěn hǎo, xièxie.", question: "¿Cómo está la persona?", options: ["很好", "很冷", "很小", "很贵"], answer: 0, explain: "吗 convierte la frase en pregunta." },
      { text: "对不起！——没关系。", pinyin: "Duìbuqǐ! — Méi guānxi.", question: "¿Qué se responde a «perdón»?", options: ["没关系", "不客气", "谢谢", "再见"], answer: 0, explain: "没关系 = no importa." },
      { text: "我每天七点去学校。", pinyin: "Wǒ měitiān qī diǎn qù xuéxiào.", question: "¿A qué hora va al colegio?", options: ["七点", "七岁", "七个", "七年"], answer: 0, explain: "七点 = las siete." },
      { text: "她是我妈妈。", pinyin: "Tā shì wǒ māma.", question: "¿Quién es ella?", options: ["我妈妈", "我爸爸", "我女儿", "我小姐"], answer: 0, explain: "她 = ella; 妈妈 = mamá." },
      { text: "苹果是水果。", pinyin: "Píngguǒ shì shuǐguǒ.", question: "¿Qué es la manzana?", options: ["水果", "米饭", "茶", "菜"], answer: 0, explain: "苹果 = manzana; 水果 = fruta." },
    ],
    hsk2: [
      { text: "我昨天生病了，所以没有去上班。", pinyin: "Wǒ zuótiān shēngbìng le, suǒyǐ méiyǒu qù shàngbān.", question: "¿Por qué no fue al trabajo?", options: ["Porque estaba enfermo", "Porque llovía", "Porque era domingo", "Porque no tenía dinero"], answer: 0, explain: "生病 = enfermarse; 所以 = por eso." },
      { text: "他每天坐公共汽车去公司。", pinyin: "Tā měitiān zuò gōnggòng qìchē qù gōngsī.", question: "¿Cómo va a la empresa?", options: ["En autobús", "En taxi", "En bicicleta", "Caminando"], answer: 0, explain: "公共汽车 = autobús; 公司 = empresa." },
      { text: "这家饭馆的菜很好吃，但是有点贵。", pinyin: "Zhè jiā fànguǎn de cài hěn hǎochī, dànshì yǒudiǎn guì.", question: "¿Cómo es la comida?", options: ["Rica pero cara", "Mala y barata", "Rica y barata", "Fría"], answer: 0, explain: "但是 = pero; 贵 = caro." },
      { text: "我想买一件新衣服，但是钱不够。", pinyin: "Wǒ xiǎng mǎi yī jiàn xīn yīfu, dànshì qián bù gòu.", question: "¿Qué quiere comprar?", options: ["Una prenda nueva", "Un móvil", "Una bicicleta", "Un libro"], answer: 0, explain: "新衣服 = ropa nueva." },
      { text: "我的手机在桌子上面。", pinyin: "Wǒ de shǒujī zài zhuōzi shàngmiàn.", question: "¿Dónde está el móvil?", options: ["Sobre la mesa", "En la silla", "En la bolsa", "En la cama"], answer: 0, explain: "手机 = móvil; 上面 = encima." },
      { text: "她正在洗衣服。", pinyin: "Tā zhèngzài xǐ yīfu.", question: "¿Qué está haciendo?", options: ["Lavando ropa", "Cantando", "Durmiendo", "Haciendo ejercicio"], answer: 0, explain: "正在 = estar haciendo; 洗 = lavar." },
      { text: "弟弟喜欢打篮球，姐姐喜欢跳舞。", pinyin: "Dìdi xǐhuan dǎ lánqiú, jiějie xǐhuan tiàowǔ.", question: "¿Qué le gusta a la hermana mayor?", options: ["Bailar", "Jugar al baloncesto", "Nadar", "Correr"], answer: 0, explain: "姐姐 = hermana mayor; 跳舞 = bailar." },
      { text: "明天我和朋友一起去看电影。", pinyin: "Míngtiān wǒ hé péngyou yīqǐ qù kàn diànyǐng.", question: "¿Qué hará mañana?", options: ["Ir al cine con amigos", "Ir al aeropuerto", "Visitar a sus padres", "Quedarse en casa"], answer: 0, explain: "一起 = juntos; 看电影 = ver una película." },
      { text: "请问，机场离这里远吗？", pinyin: "Qǐngwèn, jīchǎng lí zhèlǐ yuǎn ma?", question: "¿Qué pregunta la persona?", options: ["Si el aeropuerto está lejos", "Si hay un taxi", "La hora del vuelo", "El precio del billete"], answer: 0, explain: "离…远 = estar lejos de." },
      { text: "我的生日是五月一号。", pinyin: "Wǒ de shēngrì shì wǔ yuè yī hào.", question: "¿Cuándo es su cumpleaños?", options: ["El 1 de mayo", "El 5 de enero", "El 1 de marzo", "Hoy"], answer: 0, explain: "生日 = cumpleaños; 号 = día del mes." },
      { text: "他已经起床了，但是还没有吃饭。", pinyin: "Tā yǐjīng qǐchuáng le, dànshì hái méiyǒu chīfàn.", question: "¿Qué ha hecho ya?", options: ["Levantarse", "Comer", "Salir", "Dormirse"], answer: 0, explain: "已经 = ya; 起床 = levantarse." },
      { text: "这件衣服太贵了，能便宜一点吗？", pinyin: "Zhè jiàn yīfu tài guì le, néng piányi yīdiǎn ma?", question: "¿Qué quiere el cliente?", options: ["Un descuento", "Otra talla", "Devolverla", "Pagar con tarjeta"], answer: 0, explain: "便宜 = barato." },
      { text: "我每天工作八小时。", pinyin: "Wǒ měitiān gōngzuò bā xiǎoshí.", question: "¿Cuántas horas trabaja?", options: ["Ocho", "Cinco", "Diez", "Dos"], answer: 0, explain: "小时 = hora (duración)." },
      { text: "医生说要吃药，多休息。", pinyin: "Yīshēng shuō yào chī yào, duō xiūxi.", question: "¿Qué recomienda el médico?", options: ["Tomar medicina y descansar", "Hacer ejercicio", "Viajar", "Comer fruta"], answer: 0, explain: "药 = medicina; 休息 = descansar." },
      { text: "我不会游泳，但是我会跑步。", pinyin: "Wǒ bù huì yóuyǒng, dànshì wǒ huì pǎobù.", question: "¿Qué sabe hacer?", options: ["Correr", "Nadar", "Bailar", "Cantar"], answer: 0, explain: "会 = saber hacer; 跑步 = correr." },
    ],
    "jlpt-n5": [
      { text: "私は学生です。", pinyin: "Watashi wa gakusei desu.", question: "¿Qué es el hablante?", options: ["Estudiante", "Profesor", "Médico", "Empleado"], answer: 0, explain: "学生 (gakusei) = estudiante." },
      { text: "今日はいい天気です。", pinyin: "Kyō wa ii tenki desu.", question: "¿Cómo está el tiempo?", options: ["Bueno", "Malo", "Lluvioso", "Frío"], answer: 0, explain: "いい天気 = buen tiempo." },
      { text: "本を読みます。", pinyin: "Hon o yomimasu.", question: "¿Qué hace?", options: ["Leer un libro", "Ver la tele", "Cantar", "Correr"], answer: 0, explain: "本を読む = leer un libro." },
      { text: "水を飲みます。", pinyin: "Mizu o nomimasu.", question: "¿Qué bebe?", options: ["Agua", "Té", "Leche", "Café"], answer: 0, explain: "水 (mizu) = agua." },
      { text: "駅で電車に乗ります。", pinyin: "Eki de densha ni norimasu.", question: "¿Dónde toma el tren?", options: ["En la estación", "En la escuela", "En la tienda", "En casa"], answer: 0, explain: "駅 (eki) = estación." },
      { text: "友達と映画を見ます。", pinyin: "Tomodachi to eiga o mimasu.", question: "¿Con quién ve la película?", options: ["Con un amigo", "Con el profesor", "Con su padre", "Con su madre"], answer: 0, explain: "友達 (tomodachi) = amigo." },
      { text: "これはりんごです。", pinyin: "Kore wa ringo desu.", question: "¿Qué es esto?", options: ["Una manzana", "Un plátano", "Un libro", "Un coche"], answer: 0, explain: "りんご (ringo) = manzana." },
      { text: "朝ご飯を食べます。", pinyin: "Asagohan o tabemasu.", question: "¿Qué comida es?", options: ["Desayuno", "Comida", "Cena", "Un dulce"], answer: 0, explain: "朝ご飯 = desayuno." },
      { text: "私は日本語を勉強します。", pinyin: "Watashi wa Nihongo o benkyō shimasu.", question: "¿Qué estudia?", options: ["Japonés", "Inglés", "Matemáticas", "Historia"], answer: 0, explain: "日本語 (Nihongo) = japonés." },
      { text: "明日は日曜日です。", pinyin: "Ashita wa nichiyōbi desu.", question: "¿Qué día es mañana?", options: ["Domingo", "Lunes", "Martes", "Viernes"], answer: 0, explain: "日曜日 (nichiyōbi) = domingo." },
    ],
    "topik-1": [
      { text: "저는 학생입니다.", pinyin: "Jeoneun haksaeng-imnida.", question: "¿Qué es el hablante?", options: ["Estudiante", "Profesor", "Médico", "Empleado"], answer: 0, explain: "학생 (haksaeng) = estudiante." },
      { text: "오늘 날씨가 좋습니다.", pinyin: "Oneul nalssiga jotdeumnida.", question: "¿Cómo está el tiempo?", options: ["Bueno", "Malo", "Lluvioso", "Frío"], answer: 0, explain: "좋다 (jota) = bueno." },
      { text: "물을 마십니다.", pinyin: "Mureul masimnida.", question: "¿Qué bebe?", options: ["Agua", "Té", "Leche", "Café"], answer: 0, explain: "물 (mul) = agua." },
      { text: "학교에 갑니다.", pinyin: "Hakgyoe gamnida.", question: "¿Adónde va?", options: ["A la escuela", "Al hospital", "A la tienda", "A la estación"], answer: 0, explain: "학교 (hakgyo) = escuela." },
      { text: "책을 읽습니다.", pinyin: "Chaegeul ikseumnida.", question: "¿Qué hace?", options: ["Lee un libro", "Ve la tele", "Canta", "Corre"], answer: 0, explain: "책을 읽다 = leer un libro." },
      { text: "친구와 영화를 봅니다.", pinyin: "Chinguwa yeonghwareul bomnida.", question: "¿Con quién ve la película?", options: ["Con un amigo", "Con el profesor", "Con su padre", "Con su madre"], answer: 0, explain: "친구 (chingu) = amigo." },
      { text: "이것은 사과입니다.", pinyin: "Igeosun sagwa-imnida.", question: "¿Qué es esto?", options: ["Una manzana", "Un plátano", "Un libro", "Un coche"], answer: 0, explain: "사과 (sagwa) = manzana." },
      { text: "아침을 먹습니다.", pinyin: "Achimeul meokseumnida.", question: "¿Qué comida es?", options: ["Desayuno", "Comida", "Cena", "Un dulce"], answer: 0, explain: "아침 (achim) = mañana/desayuno." },
      { text: "한국어를 공부합니다.", pinyin: "Hangugeoreul gongbuhamnida.", question: "¿Qué estudia?", options: ["Coreano", "Inglés", "Matemáticas", "Historia"], answer: 0, explain: "한국어 (hangugeo) = coreano." },
      { text: "내일은 일요일입니다.", pinyin: "Naireun iryoil-imnida.", question: "¿Qué día es mañana?", options: ["Domingo", "Lunes", "Martes", "Viernes"], answer: 0, explain: "일요일 (iryoil) = domingo." },
    ],
  };

  function makeReading(count, level = "hsk1") {
    const curated = READING[level];
    if (curated) {
      return shuffle(curated).slice(0, Math.min(count || 10, curated.length)).map((r, i) => ({
        type: "reading", id: i + 1, text: r.text, pinyin: r.pinyin,
        question: r.question,
        options: r.options.map((label, oi) => ({ id: oi, label })),
        answer: r.answer, explain: r.explain,
      }));
    }
    // Niveles sin textos redactados: se genera una pregunta de comprensión
    // a partir de la palabra y, si existe, de su frase de ejemplo.
    const pool = shuffle(words(level)).slice(0, count || 10);
    return pool.map((w, i) => {
      const distractors = shuffle(words(level).filter((x) => x.id !== w.id)).slice(0, 3);
      const options = shuffle([w].concat(distractors));
      return {
        type: "reading", id: i + 1,
        text: w.example || w.char,
        pinyin: w.reading || w.romaji || w.pinyin || "",
        question: `¿Qué significa «${w.char}»?`,
        options: options.map((o) => ({ id: o.id, label: o.es.split(";")[0] })),
        answer: options.findIndex((o) => o.id === w.id),
        explain: `${w.char} · ${w.es}`,
      };
    });
  }

  /* Simulacro reducido: vocabulario + escucha + lectura, con preguntas mezcladas */
  function makeMock(count, level = "hsk1") {
    const n = Math.min(count || 20, 30);
    const perType = Math.floor(n / 3);
    const parts = [
      ...makeQuiz(perType, level),
      ...makeListening(perType, level),
      ...makeReading(n - perType * 2, level),
    ];
    return shuffle(parts);
  }

  return { LEVELS, levelMeta, words, find, audioPath, get, review, reset, stats, studyQueue, makeQuiz, makeListening, makeReading, makeMock };
})();
