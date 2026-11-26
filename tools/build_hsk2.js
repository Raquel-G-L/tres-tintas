/* Genera data/hsk2.json y js/hsk2-data.js a partir de la lista HSK 2 (2.0)
   de drkameleon/complete-hsk-vocabulary (MIT), reutilizando las glosas
   en español de HSK 1 y añadiendo las nuevas.

   Uso: node tools/build_hsk2.js
*/
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SOURCE = process.argv[2] && !process.argv[2].startsWith("--")
  ? process.argv[2]
  : "C:\\Windows\\Temp\\opencode\\hsk2.json";
const HSK1 = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "hsk1.json"), "utf8"));
const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"));

const esByChar = {};
HSK1.words.forEach((w) => { esByChar[w.char] = w.es; });

/* Glosas nuevas y correcciones (se amplía hasta cubrir las 297 palabras) */
const ES = {
  "吧": "partícula de sugerencia", "白": "blanco", "百": "cien", "帮助": "ayudar",
  "报纸": "periódico", "比": "comparar; más que", "便宜": "barato", "别": "no (prohibitivo)",
  "唱歌": "cantar", "出": "salir", "穿": "llevar (ropa)", "船": "barco", "次": "vez; siguiente",
  "从": "desde; de", "错": "incorrecto; error", "打篮球": "jugar al baloncesto", "大家": "todos",
  "但是": "pero", "到": "llegar", "得": "obtener; complemento", "弟弟": "hermano menor",
  "第一": "primero", "懂": "entender", "房间": "habitación", "非常": "muy; muchísimo",
  "服务员": "camarero", "高": "alto", "告诉": "decir; informar", "哥哥": "hermano mayor",
  "给": "dar", "公共汽车": "autobús", "公斤": "kilogramo", "公司": "empresa", "贵": "caro",
  "还": "todavía; también", "孩子": "niño", "好吃": "delicioso", "号": "número (de día)",
  "黑": "negro", "红": "rojo", "欢迎": "dar la bienvenida", "回答": "responder",
  "机场": "aeropuerto", "鸡蛋": "huevo", "件": "clasificador de prendas y cosas",
  "教室": "aula", "介绍": "presentar", "姐姐": "hermana mayor", "近": "cerca", "进": "entrar",
  "就": "entonces; justo", "觉得": "pensar; sentir", "咖啡": "café", "开始": "empezar",
  "考试": "examen", "可能": "quizá; posible", "可以": "poder", "课": "clase; asignatura",
  "快": "rápido", "快乐": "feliz", "累": "cansado", "离": "lejos de; salir", "两": "dos",
  "路": "camino; ruta", "旅游": "viajar; turismo", "卖": "vender", "慢": "lento", "忙": "ocupado",
  "每": "cada", "妹妹": "hermana menor", "门": "puerta", "男人": "hombre", "您": "usted",
  "牛奶": "leche", "女人": "mujer", "旁边": "al lado", "跑步": "correr", "票": "billete; entrada",
  "妻子": "esposa", "起床": "levantarse", "千": "mil", "晴": "despejado", "去年": "el año pasado",
  "让": "permitir; dejar", "上班": "ir al trabajo", "身体": "cuerpo", "生病": "enfermarse",
  "生日": "cumpleaños", "时间": "tiempo", "事情": "cosa; asunto", "手表": "reloj de pulsera",
  "手机": "móvil", "送": "enviar; regalar", "所以": "por eso", "它": "ello; it", "踢": "patear",
  "题": "tema; pregunta de examen", "跳舞": "bailar", "外": "fuera", "完": "terminar", "玩": "jugar",
  "晚上": "noche", "为": "para; por", "问": "preguntar", "问题": "pregunta; problema",
  "希望": "esperar; desear", "洗": "lavar", "西瓜": "sandía", "向": "hacia", "小时": "hora (duración)",
  "笑": "reír", "新": "nuevo", "姓": "apellido", "休息": "descansar", "雪": "nieve",
  "颜色": "color", "眼睛": "ojo", "羊肉": "cordero", "药": "medicina", "要": "querer; necesitar",
  "也": "también", "一起": "juntos", "已经": "ya", "意思": "significado; idea", "因为": "porque",
  "阴": "nublado", "游泳": "nadar", "右边": "derecha", "鱼": "pez; pescado", "元": "yuan (moneda)",
  "远": "lejos", "运动": "hacer ejercicio; deporte", "再": "otra vez", "早上": "mañana temprano",
  "张": "clasificador de láminas y billetes", "长": "largo", "丈夫": "marido", "找": "buscar",
  "着": "partícula aspectual", "真": "realmente", "正在": "estar haciendo", "知道": "saber",
  "准备": "preparar; preparación", "自行车": "bicicleta", "走": "caminar; ir a pie", "最": "el más",
  "左边": "izquierda",
};
const PINYIN = {
  "吧": "ba", "白": "bái", "百": "bǎi", "比": "bǐ", "便宜": "pián yi", "别": "bié",
  "错": "cuò", "得": "de", "都": "dōu", "读": "dú", "高": "gāo", "告诉": "gào su",
  "给": "gěi", "还": "hái", "黑": "hēi", "红": "hóng", "几": "jǐ", "就": "jiù",
  "累": "lèi", "离": "lí", "路": "lù", "慢": "màn", "忙": "máng", "门": "mén",
  "那": "nà", "能": "néng", "年": "nián", "钱": "qián", "晴": "qíng", "让": "ràng",
  "日": "rì", "三": "sān", "上": "shàng",  "什么": "shén me", "水": "shuǐ",
  "听": "tīng", "为": "wèi", "笑": "xiào", "新": "xīn", "姓": "xìng", "雪": "xuě",
  "药": "yào", "要": "yào", "也": "yě", "元": "yuán", "鱼": "yú", "长": "cháng",
  "着": "zhe", "最": "zuì", "坐": "zuò", "阴": "yīn", "号": "hào", "件": "jiàn",
  "鹹": "xián", "妻子": "qī zi", "身体": "shēn tǐ", "时间": "shí jiān", "事情": "shì qing",
  "手表": "shǒu biǎo", "手机": "shǒu jī", "生日": "shēng rì", "生病": "shēng bìng",
  "夏天": "xià tiān", "冬天": "dōng tiān", "院子": "yuàn zi", "菜单": "cài dān",
};

const missing = [];
const words = source.map((w, i) => {
  const f = w.f[0];
  const char = w.s;
  const es = ES[char] || esByChar[char] || null;
  if (!es) missing.push(`${i + 1}. ${char} | ${PINYIN[char] || f.i.y} | ${f.m[0]}`);
  return {
    id: i + 1,
    char,
    pinyin: PINYIN[char] || f.i.y,
    en: f.m[0],
    es,
    radical: w.r,
    freq: w.q,
  };
});

if (process.argv.includes("--missing")) {
  console.log(missing.join("\n"));
  console.log(`\nFaltan ${missing.length} traducciones.`);
  process.exit(0);
}

const unresolved = words.filter((w) => !w.es);
if (unresolved.length) {
  console.error(`Aún faltan ${unresolved.length} glosas. Ejecuta con --missing para verlas.`);
  process.exit(1);
}

const payload = {
  source: "https://github.com/drkameleon/complete-hsk-vocabulary (MIT) — wordlists/inclusive/old/2.min.json",
  level: "HSK 2 (2.0)",
  count: words.length,
  words,
};
fs.writeFileSync(path.join(ROOT, "data", "hsk2.json"), JSON.stringify(payload, null, 2), "utf8");
fs.writeFileSync(path.join(ROOT, "js", "hsk2-data.js"), "window.POLY_HSK2 = " + JSON.stringify(payload) + ";\n", "utf8");
console.log(`Escritos HSK2 con ${words.length} palabras.`);
