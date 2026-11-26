/* Genera data/hsk1.json a partir de la lista HSK 1 (2.0) de
   drkameleon/complete-hsk-vocabulary (MIT), con glosas en español.

   Uso:
     1) descargar wordlists/inclusive/old/1.min.json a C:\Windows\Temp\opencode\hsk1.json
     2) node tools/build_hsk1.js
*/
const fs = require("fs");
const path = require("path");

const SOURCE = process.argv[2] || "C:\\Windows\\Temp\\opencode\\hsk1.json";
const OUT = path.join(__dirname, "..", "data", "hsk1.json");

const ES = [
  "amar; gustar", "ocho", "papá", "taza; vaso", "Pekín", "cuaderno; raíz", "no; negación", "de nada",
  "plato; comida", "té", "comer", "taxi", "llamar por teléfono", "grande", "de (partícula posesiva)",
  "hora; punto", "ordenador", "televisión", "película", "cosas; este y oeste", "todos; ambos", "leer",
  "lo siento; perdón", "mucho; muchos", "cuánto; cuántos", "hijo", "dos", "restaurante", "avión", "minuto",
  "contento; feliz", "clasificador general", "trabajar; trabajo", "perro", "chino (idioma)", "bueno; bien",
  "beber", "y; con", "muy", "detrás; parte trasera", "volver; regresar", "saber hacer; poder",
  "estación de tren", "cuántos; varios", "casa; familia", "llamarse; gritar", "hoy", "nueve", "abrir",
  "mirar; ver", "ver; divisar", "clasificador; trozo; yuan", "venir", "profesor", "marca de acción completada",
  "frío", "dentro", "cero", "seis", "mamá", "partícula de pregunta", "comprar", "gato", "no; no haber",
  "no importa; de nada", "arroz cocido", "nombre", "mañana", "cuál; dónde", "aquel; eso", "partícula «¿y…?»",
  "poder; ser capaz", "tú", "año", "hija", "amigo", "bonito; guapa", "manzana", "siete", "delante",
  "dinero", "por favor", "ir", "caliente; calor", "persona; gente", "conocer", "día; sol", "tres",
  "tienda", "arriba; subir", "mañana (antes del mediodía)", "poco; pocos", "qué", "diez", "momento; tiempo",
  "ser", "libro", "quién", "agua", "fruta", "dormir", "hablar", "cuatro", "años (de edad)", "él",
  "ella", "demasiado; muy", "tiempo atmosférico", "escuchar", "compañero de clase", "hola (teléfono)",
  "yo", "nosotros", "cinco", "gustar; querer", "abajo; bajar", "tarde", "llover", "señor; profesor",
  "ahora", "pensar; querer", "pequeño", "señorita", "algunos; unos cuantos", "escribir", "gracias",
  "semana", "estudiante", "estudiar; aprender", "escuela", "uno", "ropa", "médico", "hospital", "silla",
  "tener; haber", "luna; mes", "adiós", "estar; en", "cómo", "cómo; qué tal", "este; esta", "China",
  "mediodía", "vivir; alojarse", "mesa", "carácter; letra", "ayer", "sentarse", "hacer",
];

const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
if (source.length !== ES.length) {
  throw new Error(`El source tiene ${source.length} palabras y el mapa español ${ES.length}. Revisa la correspondencia.`);
}

const words = source.map((w, i) => {
  const f = w.f[0];
  return {
    id: i + 1,
    char: w.s,
    pinyin: f.i.y,
    en: f.m[0],
    es: ES[i],
    radical: w.r,
    freq: w.q,
  };
});

const payload = {
  source: "https://github.com/drkameleon/complete-hsk-vocabulary (MIT) — wordlists/inclusive/old/1.min.json",
  level: "HSK 1 (2.0)",
  count: words.length,
  words,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(payload, null, 2), "utf8");
const jsOut = path.join(__dirname, "..", "js", "hsk1-data.js");
fs.writeFileSync(jsOut, "window.POLY_HSK1 = " + JSON.stringify(payload) + ";\n", "utf8");
console.log(`Escritos ${OUT} y ${jsOut} con ${words.length} palabras.`);
