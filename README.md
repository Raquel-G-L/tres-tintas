# Tres Tintas 🖋️🇨🇳🇯🇵🇰🇷

[![Estado: en construcción](https://img.shields.io/badge/estado-en%20construcción-orange)]()
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)]()
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)]()

> 🚧 **Proyecto en construcción.** Está en desarrollo activo: puede haber cambios y partes pendientes de pulir.

Web educativa para aprender **chino, japonés y coreano** con lecciones integradas, pronunciación y recursos descargables (PDF, TXT, CSV y MP3). Pensada para crecer también como app.

## 🚧 Estado actual

Ya funcionan las lecciones, los 17 niveles de examen (HSK, JLPT y TOPIK), la pronunciación en MP3, las descargas y la libreta de caligrafía. Pendiente:

- Subida de los MP3 al repositorio (pendiente: por ahora la pronunciación no está disponible en la versión de GitHub; se añadirá en commits posteriores).
- Backend real para cuentas y progreso (ahora se guarda en `localStorage`).
- Revisión de las glosas generadas con traducción automática.
- Pruebas en móvil y publicación de una demo en vivo.

## Cómo abrirla

Opción más sencilla: abre `index.html` con doble clic en tu navegador.

Opción recomendada (evita limitaciones de `file://` en algunos navegadores):

```bash
cd tres-tintas
python -m http.server 8000
```

Después visita `http://localhost:8000`.

## Qué incluye

- **Temario basado en exámenes reales**: **HSK 1–6** (chino), **JLPT N5–N1** (japonés) y **TOPIK 1–6** (coreano). 17 niveles oficiales y **1.293 lecciones**: las lecciones escritas a mano y, además, bloques generados de 20 palabras que cubren **todo el vocabulario oficial** de cada nivel (se muestran paginadas). Cada nivel indica qué deberías ser capaz de hacer.
- **Preparación de exámenes** (`#/exam/<idioma>/<nivel>`): **17 niveles completos** — HSK 1-6, JLPT N5-N1 y TOPIK 1-6 — con **25.025 palabras** en total. Cada nivel tiene tarjetas de repetición espaciada (Leitner), test, comprensión auditiva, comprensión lectora, **simulacro de 20 preguntas con temporizador de 10 minutos** y descargas TXT/CSV/TSV para Anki.
- Cada lección contiene: teoría con ejemplos, tabla de vocabulario, frases útiles, botones de escucha y un cuestionario de 3 preguntas con explicaciones.
- **Pronunciación**: **25.820 MP3 sueltos** (uno por palabra y frase, incluidas las 25.025 palabras de examen) para los botones 🔊, **1.293 MP3 de lección** con reproductor integrado y descarga, y Web Speech API solo como reserva. Los bloques generados reutilizan los MP3 de las listas de examen para cada palabra. Funciona sin necesidad de instalar voces en el sistema.
- **Descargas**:
  - `PDF`: ficha de lección o guía completa de un nivel (se genera en el navegador).
  - `TXT`: apuntes en texto plano, con vocabulario, frases y respuestas.
  - `CSV`: vocabulario completo de un idioma (ideal para Anki/Excel).
  - `MP3`: pronunciación de cada lección.
- **Libreta de caligrafía** (`#/writing`): 44 caracteres (12 chinos, 12 kanji y 20 jamos coreanos) con orden de trazos animado, modo práctica para dibujar, ficha del carácter y derivados. Incluye un **cuaderno tianzige descargable** con 3 filas guiadas (carácter en claro para calcar) y 2 filas vacías para escribir de memoria, con vista previa en pantalla y versión TXT.
- **Cuentas y progreso**: registro, inicio de sesión, lecciones completadas, XP, favoritos y «continúa donde lo dejaste».
- Diseño responsive y modo claro/oscuro.

## Estructura

```
tres-tintas/
├── index.html                  Punto de entrada
├── data/hsk1.json              Lista HSK 1 (150 palabras) con glosas en español
├── data/hsk2.json              Lista HSK 2 (297 palabras) con glosas en español
├── data/jlpt-n5.json … n1.json Listas JLPT N5-N1
├── data/topik-1.json … 6.json  Listas TOPIK 1-6
├── data/exam-levels.json       Registro de los 17 niveles
├── css/styles.css              Diseño, temas y responsive
├── js/
│   ├── data.js                 Contenido de las 42 lecciones y niveles oficiales
│   ├── auth.js                 Cuentas (localStorage)
│   ├── progress.js             Progreso, XP y favoritos
│   ├── speech.js               Pronunciación en página
│   ├── resources.js            Generación de PDF/TXT/CSV
│   ├── writing.js              Trazos, práctica y derivados
│   ├── hsk1-data.js            Lista HSK 1 generada (window.POLY_HSK1)
│   ├── hsk2-data.js            Lista HSK 2 generada (window.POLY_HSK2)
│   ├── exam-data-all.js        Las 17 listas + registro (window.POLY_EXAM_DATA)
│   ├── exam.js                 Repaso espaciado, tests y simulacros de los 17 niveles
│   └── app.js                  Rutas e interfaz
├── assets/audio/
│   ├── manifest.json           Texto de los 42 MP3 de lección
│   ├── clips.json              Texto de los 25.819 MP3 por palabra/frase
│   ├── zh/ a1.mp3 … d3.mp3
│   ├── ja/ a1.mp3 … d1.mp3
│   ├── ko/ a1.mp3 … d3.mp3
│   └── clips/<idioma>/<leccion>/ v0.mp3, v1.mp3…, p0.mp3, p1.mp3…
└── tools/
    ├── export_audio_manifest.js
    ├── generar_audio.py
    ├── build_hsk1.js           Convierte la lista HSK 1 en JSON + JS
    ├── build_hsk2.js           Convierte la lista HSK 2 en JSON + JS
    ├── build_exam_lists.py     Convierte JLPT N5 y TOPIK 1 (script previo)
    ├── build_all_lists.py      Genera las 17 listas + exam-data-all.js
    ├── build_lessons.py        Genera los bloques hasta cubrir todo el vocabulario
    ├── export_used_words.js    Palabras ya usadas en las lecciones escritas
    └── generar_audio_fast.py   Generación paralela de todos los MP3
```

## Dónde está cada cosa

La interfaz evita duplicados: cada función vive en un solo sitio.

| Sección | Qué contiene |
| --- | --- |
| **Inicio** | Resumen, idiomas y cómo funciona. |
| **Idiomas** | Niveles y lecciones de cada idioma. |
| **Exámenes** | Vista general de HSK, JLPT y TOPIK; dentro, tarjetas, test, escucha, lectura y simulacro por nivel. |
| **Caligrafía** | Trazos, práctica y cuadernos de escritura. |
| **Recursos** | **Todas** las descargas: guías PDF/TXT, CSV, listas de examen TXT/CSV/TSV y audios. |
| **Mi progreso** | Estadísticas, lecciones completadas y favoritos. |

Los botones de descarga que había en las páginas de idioma y de examen se sustituyeron por enlaces a Recursos. En la lección solo quedan las descargas específicas de esa lección y su reproductor de audio.

## Cuentas: importante

Las cuentas funcionan **solo en el navegador/dispositivo actual** (`localStorage`). Son ideales para una demo o para usarla sin servidor, pero **no son seguridad de producción**: otra persona con acceso al navegador podría ver los datos, y el progreso no se sincroniza entre dispositivos.

Para un despliegue real, sustituye `js/auth.js` y `js/progress.js` por un backend (Supabase, Firebase o una API propia). El resto de la aplicación no depende de la implementación de esos módulos.

## Regenerar el audio

Los MP3 se generaron con [gTTS](https://pypi.org/project/gTTS/) y, para las listas grandes, con [Edge TTS](https://pypi.org/project/edge-tts/) de Microsoft (voices `zh-CN-XiaoxiaoNeural`, `ja-JP-NanamiNeural`, `ko-KR-SunHiNeural`). Si cambias el vocabulario en `js/data.js`:

```bash
node tools/export_audio_manifest.js
python -m pip install gTTS
python tools/generar_audio.py
```

El script omite los archivos que ya existen. Para regenerar uno, bórralo antes.

## Añadir o editar contenido

Todo el contenido está en `js/data.js` con un formato compacto:

- `V([...])` → vocabulario: `[término, lectura, significado]`.
- `T([...])` → teoría: `[título, texto, [[ejemplo, lectura, significado], …]]`.
- `Q([...])` → cuestionario: `[pregunta, [opciones…], índice_respuesta, explicación]`.
- `lesson(id, title, desc, char, theory, vocab, phrases, quiz)`.

El `id` debe tener el formato `zh-a1`, `ja-b2`, `ko-c3` (idioma + nivel + número). El audio se busca automáticamente en `assets/audio/<idioma>/<nivel><numero>.mp3`.

## Sistema de exámenes

El temario no usa niveles genéricos, sino los marcos oficiales. En `js/data.js`, `EXAM_LEVELS` define cada nivel con su descripción, un descriptor «puedo hacer…», el objetivo aproximado de vocabulario y las lecciones que lo componen. `EXAMS` contiene el nombre y la denominación oficial de cada prueba.

| Idioma | Sistema | Niveles |
| --- | --- | --- |
| Chino | HSK (Hanyu Shuiping Kaoshi) | 1, 2, 3, 4, 5 y 6 |
| Japonés | JLPT (Japanese Language Proficiency Test) | N5, N4, N3, N2 y N1 |
| Coreano | TOPIK (Test of Proficiency in Korean) | 1, 2, 3, 4, 5 y 6 |

Los objetivos de vocabulario son orientativos (el temario incluido es una selección didáctica, no la lista oficial completa). Para reordenar lecciones, basta con cambiar los ids en `EXAM_LEVELS`.

## Preparación de exámenes

Ruta `#/exam/<idioma>/<nivel>`. Hay **17 niveles** disponibles desde el selector de la página y desde cada nivel del temario:

- **Chino**: HSK 1 (150), HSK 2 (297), HSK 3 (595), HSK 4 (1.193), HSK 5 (2.491) y HSK 6 (4.991 palabras).
- **Japonés**: JLPT N5 (674), N4 (630), N3 (1.659), N2 (1.778) y N1 (3.070 palabras).
- **Coreano**: TOPIK 1 (300), 2 (1.663), 3 (2.014), 4 (2.015), 5 (752) y 6 (753 palabras).

Cada entrada incluye lectura, frecuencia y glosa en español. Los niveles con texto propio tienen 10 textos de lectura redactados; en el resto la lectura se genera a partir del vocabulario y sus frases de ejemplo.

- **Tarjetas Leitner**: cada acierto sube de caja (1, 2, 4, 7, 15 y 30 días); cada fallo vuelve a la caja 0. Se guarda por cuenta en `localStorage` (`tres-tintas_srs_<usuario>_<nivel>`).
- **Test**: 10 preguntas de opción múltiple (carácter → español y español → carácter). Cada respuesta actualiza las tarjetas.
- **Escuchar**: 10 palabras en MP3; hay que elegir el carácter oído. También actualiza las tarjetas.
- **Leer**: 15 textos breves construidos con vocabulario del nivel y preguntas de comprensión.
- **Simulacro**: 20 preguntas mezcladas (vocabulario, escucha y lectura), **10 minutos de tiempo** y nota desglosada por apartados. Las respuestas de vocabulario y escucha actualizan las tarjetas.
- **Lista**: buscador y botón 🔊 con MP3 propio para cada palabra.
- **Descargas**: TXT, CSV (con frecuencia y radical) y TSV importable en Anki.

**Fuentes y licencias**: [drkameleon/complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) (MIT) para HSK; [OpenJLPT](https://github.com/evanclan/OpenJLPT) (CC BY-SA 4.0) para JLPT; [combined_korean_vocabulary_list](https://github.com/julienshim/combined_korean_vocabulary_list) (MIT) para TOPIK.

**Glosas en español**: se generaron con traducción automática y, cuando el servicio externo bloqueó las peticiones, se completaron con diccionarios abiertos locales: [spanish-english-json](https://github.com/fufu70/spanish-english-json) para HSK/JLPT y [Dictionary-MKG](https://github.com/kenantang/Dictionary-MKG) (coreano→español) para TOPIK, más los hanja convertidos con OpenCC. Resultado: **23.816 de 25.025 palabras traducidas (95 %)**; el resto son sobre todo nombres propios y términos raros. Nada de esto se consulta en tiempo de uso: la web lee los JSON guardados. Para regenerar:

```bash
curl -o C:\Windows\Temp\opencode\hsk1.json https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/wordlists/inclusive/old/1.min.json
curl -o C:\Windows\Temp\opencode\hsk2.json https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/wordlists/inclusive/old/2.min.json
node tools/build_hsk1.js
node tools/build_hsk2.js
python tools/build_exam_lists.py
python tools/build_all_lists.py
node tools/export_used_words.js
python tools/build_lessons.py
python tools/local_translate.py
python tools/translate_topik_hanja.py
python tools/translate_topik_dict.py
node tools/export_audio_manifest.js
python tools/generar_audio_edge.py

# Si el proveedor limita las peticiones (HTTP 429), usa Edge TTS:
pip install edge-tts
python tools/generar_audio_edge.py
```

Los scripts de traducción local leen los archivos descargados en `C:\Windows\Temp\opencode\` (`en-es-words.json`, `sentences.json`, `ko_es.json`); las rutas se pueden cambiar al inicio de cada script. `translate_topik_hanja.py` necesita `pip install opencc-python-reimplemented`.

**Importante**: las listas cubren vocabulario, pero aprobar el examen exige también gramática y comprensión real. El simulacro es reducido (20 preguntas) frente al examen oficial; esta preparación complementa las lecciones, no las sustituye.

## Libreta de caligrafía

Se abre desde el menú «Caligrafía». En los caracteres chinos y kanji los trazos se animan con [Hanzi Writer](https://hanziwriter.org/) (los datos de kanji se cargan desde `hanzi-writer-data-jp` en jsDelivr). En el hangul los trazos son SVG propios incluidos en `js/writing.js`, así que funcionan sin conexión.

Cada carácter muestra: significado, lectura, radical, número de trazos, nota sobre su composición y una lista de derivados (pulsables si también están en la libreta). Los controles permiten ver la animación, dibujar con ratón/dedo sobre la guía, mostrar el carácter y reiniciar. La hoja imprimible incluye una cuadrícula 田字格 para copiar el carácter.

Para añadir caracteres, edita los arrays `CHARS` y `HANGUL_STROKES` en `js/writing.js`. Los caracteres chinos/kanji necesitan datos de trazos en Hanzi Writer; los jamos coreanos necesitan sus `path` SVG en un lienzo 100×100.

## Notas

- **Dónde se guardan las descargas**: el navegador decide la carpeta (por defecto, la configurada en su configuración de descargas; en este equipo estaba el Escritorio). La página solo puede proponer el nombre del archivo, no elegir la ruta. Si quieres que todo caiga dentro de la carpeta del proyecto, cambia en Brave/Chrome: Ajustes → Descargas → Ubicación → `D:\1. Documentos (D)\PROYECTOS\tres-tintas`.
- Los PDF y la animación de trazos chinos/kanji necesitan cargar librerías desde jsDelivr. Si no hay internet, las descargas se convierten en TXT y el hangul sigue funcionando igual.
- La pronunciación se reproduce desde MP3 incluidos, así que no depende de las voces instaladas en Windows/macOS/Linux. La síntesis de voz del sistema se usa solo como último recurso.
- Contenido creado con fines educativos.
