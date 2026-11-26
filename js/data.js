/* =========================================================
   Contenido del curso — 3 idiomas × 3 niveles
   Formato compacto: [término, lectura, significado]
   ========================================================= */
window.POLY_DATA = (function () {
  const V = (rows) => rows.map(([t, r, m]) => ({ t, r, m }));
  const Q = (rows) => rows.map(([question, options, answer, explain]) => ({ question, options, answer, explain }));
  const T = (rows) => rows.map(([title, text, examples]) => ({ title, text, examples: V(examples) }));

  const lesson = (id, title, desc, char, theory, vocab, phrases, quiz) => ({
    id,
    title,
    desc,
    char,
    theory: T(theory),
    vocab: V(vocab),
    phrases: V(phrases),
    quiz: Q(quiz),
    audio: `assets/audio/${id.split('-')[0]}/${id.split('-')[1]}.mp3`,
  });

  const languages = [
    {
      id: "zh",
      name: "Chino",
      native: "中文",
      flag: "🇨🇳",
      emoji: "🏮",
      color: "#d7493f",
      voice: "zh-CN",
      levels: [
        {
          key: "a",
          name: "Principiante",
          icon: "🌱",
          desc: "Empieza desde cero: saludos, números y comida.",
          lessons: [
            lesson(
              "zh-a1", "Saludos y presentaciones", "Tu primera conversación en chino mandarín.", "你",
              [
                ["Caracteres, pinyin y tonos", "El chino se escribe con caracteres (汉字, hànzì). El pinyin es la transcripción al alfabeto latino que te ayuda a pronunciar. Cada sílaba tiene uno de cuatro tonos: ¯ (alto), ˊ (ascendente), ˇ (cayente-ascendente) y ˋ (descendente).", [["你", "nǐ", "tú (3.º tono)"], ["好", "hǎo", "bueno (3.º tono)"], ["妈", "mā", "mamá (1.º tono)"]]],
                ["Ser y llamarse", "El verbo 是 (shì) significa «ser», mientras que 叫 (jiào) se usa para «llamarse». El orden de las palabras es similar al español: sujeto + verbo + complemento.", [["我是学生。", "Wǒ shì xuésheng.", "Soy estudiante."], ["我叫安娜。", "Wǒ jiào Ānnà.", "Me llamo Ana."]]],
              ],
              [["你", "nǐ", "tú"], ["好", "hǎo", "bueno"], ["您好", "nín hǎo", "hola (formal)"], ["我", "wǒ", "yo"], ["是", "shì", "ser"], ["名字", "míngzi", "nombre"], ["叫", "jiào", "llamarse"], ["再见", "zàijiàn", "adiós"], ["朋友", "péngyou", "amigo"], ["谢谢", "xièxie", "gracias"]],
              [["你好！", "Nǐ hǎo!", "¡Hola!"], ["我叫安娜。", "Wǒ jiào Ānnà.", "Me llamo Ana."], ["你叫什么名字？", "Nǐ jiào shénme míngzi?", "¿Cómo te llamas?"], ["很高兴认识你。", "Hěn gāoxìng rènshi nǐ.", "Mucho gusto en conocerte."]],
              [["¿Cómo se dice «gracias» en chino?", ["再见", "谢谢", "你好"], 1, "谢谢 (xièxie) significa «gracias»."], ["Completa: 我 ___ 安娜。", ["是", "叫", "好"], 1, "Se usa 叫 (jiào) para decir el nombre: 我叫安娜。"], ["¿Cómo preguntas «¿Cómo te llamas?»", ["你好吗？", "你叫什么名字？", "你是谁？"], 1, "你叫什么名字？ literally «¿tú te llamas qué nombre?»."]]
            ),
            lesson(
              "zh-a2", "Números y tiempo", "Del 1 al 10, los días y la hora.", "今",
              [
                ["Los números del 1 al 10", "Los números son monosílabos y se escriben con un solo carácter. Para contar cosas se suele usar el clasificador 个 (gè) antes del sustantivo.", [["一", "yī", "uno"], ["二", "èr", "dos"], ["十", "shí", "diez"], ["三个苹果", "sān gè píngguǒ", "tres manzanas"]]],
                ["Hoy, mañana y ayer", "El tiempo se indica con palabras de lugar temporal que van antes del verbo: 今天 (hoy), 明天 (mañana), 昨天 (ayer). 星期 (xīngqī) es «semana».", [["今天", "jīntiān", "hoy"], ["明天", "míngtiān", "mañana"], ["星期几？", "xīngqī jǐ?", "¿qué día de la semana?"]]],
              ],
              [["一", "yī", "uno"], ["二", "èr", "dos"], ["三", "sān", "tres"], ["四", "sì", "cuatro"], ["五", "wǔ", "cinco"], ["六", "liù", "seis"], ["七", "qī", "siete"], ["八", "bā", "ocho"], ["九", "jiǔ", "nueve"], ["十", "shí", "diez"], ["今天", "jīntiān", "hoy"], ["明天", "míngtiān", "mañana"], ["昨天", "zuótiān", "ayer"], ["星期", "xīngqī", "semana"], ["点", "diǎn", "hora"]],
              [["今天星期几？", "Jīntiān xīngqī jǐ?", "¿Qué día es hoy?"], ["明天见！", "Míngtiān jiàn!", "¡Hasta mañana!"], ["现在几点？", "Xiànzài jǐ diǎn?", "¿Qué hora es?"], ["八点半。", "Bā diǎn bàn.", "Son las ocho y media."]],
              [["¿Cómo se dice «mañana»?", ["昨天", "今天", "明天"], 2, "明天 (míngtiān) es «mañana»."], ["¿Qué significa 八点?", ["Ocho horas", "Ocho días", "Ocho semanas"], 0, "点 (diǎn) es la hora: 八点 = las ocho."], ["El clasificador más común es…", ["个", "点", "好"], 0, "个 (gè) se usa para contar objetos."]]
            ),
            lesson(
              "zh-a3", "Comida y bebida", "Pide comida y pregunta precios.", "茶",
              [
                ["Comer y beber", "吃 (chī) es «comer» y 喝 (hē) es «beber». El verbo 要 (yào) significa «querer / desear» y es muy útil para pedir.", [["吃", "chī", "comer"], ["喝", "hē", "beber"], ["我要茶。", "Wǒ yào chá.", "Quiero té."]]],
                ["Preguntar el precio", "多少钱 (duōshao qián) significa literalmente «cuánto dinero». 请 (qǐng) se antepone al verbo para pedir algo con cortesía.", [["多少钱？", "Duōshao qián?", "¿Cuánto cuesta?"], ["请给我水。", "Qǐng gěi wǒ shuǐ.", "Dame agua, por favor."]]],
              ],
              [["茶", "chá", "té"], ["水", "shuǐ", "agua"], ["咖啡", "kāfēi", "café"], ["米饭", "mǐfàn", "arroz"], ["面条", "miàntiáo", "fideos"], ["吃", "chī", "comer"], ["喝", "hē", "beber"], ["好吃", "hǎochī", "delicioso"], ["多少钱", "duōshao qián", "¿cuánto cuesta?"], ["请", "qǐng", "por favor"], ["饭店", "fàndiàn", "restaurante"], ["杯子", "bēizi", "taza / vaso"]],
              [["我要一杯茶。", "Wǒ yào yī bēi chá.", "Quiero una taza de té."], ["这个多少钱？", "Zhège duōshao qián?", "¿Cuánto cuesta esto?"], ["很好吃！", "Hěn hǎochī!", "¡Está muy rico!"], ["请给我水，谢谢。", "Qǐng gěi wǒ shuǐ, xièxie.", "Agua, por favor, gracias."]],
              [["¿Cómo se dice «agua»?", ["茶", "水", "咖啡"], 1, "水 (shuǐ) es agua."], ["¿Qué verbo significa «beber»?", ["吃", "喝", "要"], 1, "喝 (hē) es beber; 吃 (chī) es comer."], ["«¿Cuánto cuesta?» se dice…", ["多少钱？", "几点？", "你好吗？"], 0, "多少钱？ se usa para preguntar el precio."]]
            ),
          ],
        },
        {
          key: "b",
          name: "Intermedio",
          icon: "🌿",
          desc: "Rutinas, desplazamientos y compras con seguridad.",
          lessons: [
            lesson(
              "zh-b1", "Rutina y horarios", "Describe tu día a día y tus horarios.", "时",
              [
                ["La estructura temporal", "En chino, el tiempo va antes del verbo: 我 每天早上 七点 起床 (yo / cada mañana / a las siete / me levanto). El orden es: quién → cuándo → qué.", [["每天早上", "měitiān zǎoshang", "cada mañana"], ["七点起床", "qī diǎn qǐchuáng", "levantarse a las siete"]]],
                ["先…然后… (primero… después…)", "Esta estructura sirve para encadenar acciones. 了 (le) al final de la frase indica que una acción se completó o que hay un cambio de estado.", [["先工作，然后学习。", "Xiān gōngzuò, ránhòu xuéxí.", "Primero trabajo, luego estudio."], ["我吃完了。", "Wǒ chī wán le.", "Ya terminé de comer."]]],
              ],
              [["起床", "qǐchuáng", "levantarse"], ["睡觉", "shuìjiào", "dormirse"], ["工作", "gōngzuò", "trabajar"], ["学习", "xuéxí", "estudiar"], ["每天", "měitiān", "cada día"], ["早上", "zǎoshang", "mañana"], ["晚上", "wǎnshang", "noche"], ["时候", "shíhou", "momento"], ["先", "xiān", "primero"], ["然后", "ránhòu", "después"], ["忙", "máng", "ocupado"], ["休息", "xiūxi", "descansar"]],
              [["我每天早上七点起床。", "Wǒ měitiān zǎoshang qī diǎn qǐchuáng.", "Me levanto a las siete cada mañana."], ["你什么时候有空？", "Nǐ shénme shíhou yǒu kòng?", "¿Cuándo tienes tiempo libre?"], ["我先工作，然后学习。", "Wǒ xiān gōngzuò, ránhòu xuéxí.", "Primero trabajo y después estudio."], ["今天我很忙。", "Jīntiān wǒ hěn máng.", "Hoy estoy muy ocupado."]],
              [["¿Dónde va el tiempo en una frase china?", ["Después del verbo", "Antes del verbo", "Al final siempre"], 1, "La expresión de tiempo va antes del verbo."], ["先…然后… significa…", ["Primero… después…", "Aquí… allí…", "Pronto… tarde…"], 0, "Es una estructura para ordenar acciones."], ["¿Qué significa 忙?", ["Ocupado", "Libre", "Cansado"], 0, "忙 (máng) es «ocupado»."]]
            ),
            lesson(
              "zh-b2", "Direcciones y transporte", "Muévete por la ciudad y pregunta el camino.", "路",
              [
                ["Preguntar el camino", "请问 (qǐngwèn) es «perdone, una pregunta». 在哪里 (zài nǎlǐ) significa «¿dónde está?». Se suele anteponer el lugar y después el verbo.", [["请问…", "Qǐngwèn…", "Perdone…"], ["地铁站在哪里？", "Dìtiězhàn zài nǎlǐ?", "¿Dónde está la estación de metro?"]]],
                ["Direcciones básicas", "往 (wǎng) indica dirección («hacia»). 走 (zǒu) es «caminar / ir». 离 (lí) se usa para «estar a distancia de».", [["往左走", "wǎng zuǒ zǒu", "ve hacia la izquierda"], ["离这里远吗？", "Lí zhèlǐ yuǎn ma?", "¿Está lejos de aquí?"]]],
              ],
              [["路", "lù", "calle / camino"], ["车站", "chēzhàn", "estación"], ["地铁", "dìtiě", "metro"], ["公交", "gōngjiāo", "autobús"], ["左边", "zuǒbiān", "izquierda"], ["右边", "yòubiān", "derecha"], ["前面", "qiánmiàn", "delante"], ["后面", "hòumiàn", "detrás"], ["怎么", "zěnme", "cómo"], ["去", "qù", "ir"], ["远", "yuǎn", "lejos"], ["近", "jìn", "cerca"]],
              [["请问，地铁站在哪里？", "Qǐngwèn, dìtiězhàn zài nǎlǐ?", "Perdone, ¿dónde está el metro?"], ["往左走一百米。", "Wǎng zuǒ zǒu yībǎi mǐ.", "Camine cien metros hacia la izquierda."], ["我坐地铁去。", "Wǒ zuò dìtiě qù.", "Voy en metro."], ["离这里远吗？", "Lí zhèlǐ yuǎn ma?", "¿Está lejos de aquí?"]],
              [["¿Cómo se dice «metro»?", ["公交", "地铁", "车站"], 1, "地铁 (dìtiě) es el metro."], ["«Izquierda» es…", ["左边", "右边", "前面"], 0, "左边 (zuǒbiān) es izquierda."], ["¿Qué significa 离这里远吗？", ["¿Está lejos de aquí?", "¿Dónde está?", "¿Cuánto cuesta?"], 0, "Es la pregunta sobre la distancia."]]
            ),
            lesson(
              "zh-b3", "Compras y negociación", "Regatea, paga y prueba ropa.", "买",
              [
                ["Comprar y vender", "买 (mǎi) es «comprar» y 卖 (mài) es «vender». El prefijo 打 (dǎ) en 打折 (dǎzhé) indica «hacer descuento».", [["买", "mǎi", "comprar"], ["卖", "mài", "vender"], ["打折", "dǎzhé", "descuento"]]],
                ["Formas de pago", "一共 (yīgòng) significa «en total». 刷卡 (shuākǎ) es «pagar con tarjeta» y 现金 (xiànjīn) es «efectivo».", [["一共多少钱？", "Yīgòng duōshao qián?", "¿Cuánto es en total?"], ["我能刷卡吗？", "Wǒ néng shuākǎ ma?", "¿Puedo pagar con tarjeta?"]]],
              ],
              [["买", "mǎi", "comprar"], ["卖", "mài", "vender"], ["价格", "jiàgé", "precio"], ["便宜", "piányi", "barato"], ["贵", "guì", "caro"], ["打折", "dǎzhé", "descuento"], ["一共", "yīgòng", "en total"], ["现金", "xiànjīn", "efectivo"], ["刷卡", "shuākǎ", "pagar con tarjeta"], ["商场", "shāngchǎng", "centro comercial"], ["试", "shì", "probarse"], ["合适", "héshì", "adecuado / quedar bien"]],
              [["这个太贵了，能便宜点吗？", "Zhège tài guì le, néng piányi diǎn ma?", "Esto es muy caro, ¿puede abaratarlo?"], ["一共多少钱？", "Yīgòng duōshao qián?", "¿Cuánto es todo?"], ["我可以刷卡吗？", "Wǒ kěyǐ shuākǎ ma?", "¿Puedo pagar con tarjeta?"], ["我想试试这件衣服。", "Wǒ xiǎng shìshi zhè jiàn yīfu.", "Quiero probarme esta ropa."]],
              [["¿Qué significa 打折?", ["Caro", "Descuento", "Efectivo"], 1, "打折 es «hacer un descuento»."], ["«En total» se dice…", ["一共", "一起", "一直"], 0, "一共 (yīgòng) indica el total."], ["¿Cómo pides probarte algo?", ["我想试试。", "我想买。", "我想走。"], 0, "试试 (shìshi) es «probar»."]]
            ),
          ],
        },
        {
          key: "c",
          name: "Experto",
          icon: "🏯",
          desc: "Expresiones idiomáticas, negocios y cultura.",
          lessons: [
            lesson(
              "zh-c1", "成语 y expresiones", "Los refranes de cuatro caracteres.", "成",
              [
                ["Qué son los 成语", "Los 成语 (chéngyǔ) son expresiones fijas de cuatro caracteres, a menudo con un origen histórico. Usarlos bien eleva mucho el nivel de expresión.", [["成语", "chéngyǔ", "expresión idiomática"], ["一举两得", "yī jǔ liǎng dé", "con una acción lograr dos cosas"]]],
                ["Imágenes y significado", "Muchos 成语 provienen de fábulas. 画蛇添足 literalmente «dibujar una serpiente y añadirle patas» significa estropear algo por exceso.", [["画蛇添足", "huà shé tiān zú", "añadir algo innecesario"], ["亡羊补牢", "wáng yáng bǔ láo", "remediar el error a tiempo"]]],
              ],
              [["成语", "chéngyǔ", "refrán de cuatro caracteres"], ["一箭双雕", "yī jiàn shuāng diāo", "matar dos pájaros de un tiro"], ["画蛇添足", "huà shé tiān zú", "estropear por exceso"], ["守株待兔", "shǒu zhū dài tù", "esperar sin hacer nada"], ["井底之蛙", "jǐng dǐ zhī wā", "persona de miras estrechas"], ["亡羊补牢", "wáng yáng bǔ láo", "corregir el error a tiempo"], ["一举两得", "yī jǔ liǎng dé", "dos beneficios con una acción"], ["半途而废", "bàn tú ér fèi", "abandonar a medias"], ["如愿以偿", "rú yuàn yǐ cháng", "conseguir lo deseado"], ["一目了然", "yī mù liǎo rán", "entenderse de un vistazo"]],
              [["做事要持之以恒。", "Zuòshì yào chí zhī yǐ héng.", "Hay que ser persistente en lo que se hace."], ["这一步可谓一箭双雕。", "Zhè yī bù kěwèi yī jiàn shuāng diāo.", "Este paso podría decirse que es «matar dos pájaros»."], ["亡羊补牢，为时未晚。", "Wáng yáng bǔ láo, wéi shí wèi wǎn.", "Nunca es tarde para corregir."], ["他这个人很不简单。", "Tā zhège rén hěn bù jiǎndān.", "Esa persona no es nada simple."]],
              [["¿Cuántos caracteres tiene normalmente un 成语?", ["Dos", "Cuatro", "Ocho"], 1, "Los 成语 suelen tener cuatro caracteres."], ["一箭双雕 es equivalente a…", ["Matar dos pájaros de un tiro", "Llover sobre mojado", "Dar la cara"], 0, "Es la imagen de conseguir dos objetivos con una acción."], ["半途而废 significa…", ["Empezar con entusiasmo", "Abandonar a medias", "Terminar perfecto"], 1, "Describe dejar algo a medio hacer."]]
            ),
            lesson(
              "zh-c2", "Negocios y negociación", "Vocabulario profesional y reuniones.", "商",
              [
                ["Registro formal", "En el ámbito profesional se usa 您 (nín, «usted») y fórmulas como 贵公司 (guì gōngsī, «su estimada empresa»). El tono indirecto es señal de respeto.", [["您", "nín", "usted"], ["贵公司", "guì gōngsī", "su empresa"]]],
                ["Negociar un acuerdo", "合作 (hézuò) es «cooperar», 报价 (bàojià) es «cotizar» y 合同 (hétong) es «contrato». 共赢 (gòngyíng) significa «beneficio mutuo».", [["报价", "bàojià", "cotización"], ["合同", "hétong", "contrato"], ["共赢", "gòngyíng", "ganar-ganar"]]],
              ],
              [["合作", "hézuò", "cooperar"], ["报价", "bàojià", "cotización"], ["合同", "hétong", "contrato"], ["客户", "kèhù", "cliente"], ["市场", "shìchǎng", "mercado"], ["利润", "lìrún", "beneficio"], ["投资", "tóuzī", "invertir"], ["谈判", "tánpàn", "negociar"], ["协议", "xiéyì", "acuerdo"], ["负责人", "fùzérén", "responsable"], ["共赢", "gòngyíng", "beneficio mutuo"], ["长期", "chángqī", "largo plazo"]],
              [["我们希望建立长期合作。", "Wǒmen xīwàng jiànlì chángqī hézuò.", "Esperamos establecer una cooperación a largo plazo."], ["请给我一份详细报价。", "Qǐng gěi wǒ yī fèn xiángxì bàojià.", "Por favor, envíeme una cotización detallada."], ["这个条件我们可以接受。", "Zhège tiáojiàn wǒmen kěyǐ jiēshòu.", "Podemos aceptar esta condición."], ["合同条款需要再确认。", "Hétong tiáokuǎn xūyào zài quèrèn.", "Las cláusulas del contrato requieren nueva confirmación."]],
              [["¿Cómo se dice «contrato»?", ["报价", "合同", "市场"], 1, "合同 (hétong) es contrato."], ["共赢 significa…", ["Competencia", "Beneficio mutuo", "Riesgo"], 1, "Es una relación en la que ambas partes ganan."], ["La forma formal de «usted» es…", ["你", "您", "他"], 1, "您 (nín) es el tratamiento de respeto."]]
            ),
            lesson(
              "zh-c3", "Cultura y literatura", "Poesía, caligrafía y patrimonio.", "文",
              [
                ["Poesía clásica", "La poesía china clásica (古诗, gǔshī) valora la economía de palabras y la 意境 (yìjìng), la «atmósfera poética». Li Bai y Du Fu son poetas fundamentales de la dinastía Tang.", [["诗", "shī", "poesía"], ["意境", "yìjìng", "atmósfera poética"], ["李白", "Lǐ Bái", "poeta de la dinastía Tang"]]],
                ["Artes tradicionales", "书法 (shūfǎ) es la caligrafía y 水墨 (shuǐmò) la pintura a tinta. Ambas buscan expresar el carácter del artista más que la mera forma.", [["书法", "shūfǎ", "caligrafía"], ["水墨", "shuǐmò", "pintura a tinta"]]],
              ],
              [["文化", "wénhuà", "cultura"], ["诗", "shī", "poesía"], ["书法", "shūfǎ", "caligrafía"], ["毛笔", "máobǐ", "pincel"], ["水墨", "shuǐmò", "tinta y agua"], ["古典", "gǔdiǎn", "clásico"], ["小说", "xiǎoshuō", "novela"], ["作者", "zuòzhě", "autor"], ["翻译", "fānyì", "traducir"], ["意境", "yìjìng", "atmósfera poética"], ["传承", "chuánchéng", "transmitir"], ["遗产", "yíchán", "patrimonio"]],
              [["这本书值得一读。", "Zhè běn shū zhídé yī dú.", "Este libro merece ser leído."], ["他的书法很有意境。", "Tā de shūfǎ hěn yǒu yìjìng.", "Su caligrafía tiene mucha atmósfera poética."], ["李白是唐代著名诗人。", "Lǐ Bái shì Tángdài zhùmíng shīrén.", "Li Bai fue un famoso poeta de la dinastía Tang."], ["传统文化需要传承。", "Chuántǒng wénhuà xūyào chuánchéng.", "La cultura tradicional debe transmitirse."]],
              [["¿Qué es la 意境?", ["Un tipo de pincel", "La atmósfera poética", "Una dinastía"], 1, "意境 es la sensación o atmósfera que evoca una obra."], ["¿Cómo se dice «caligrafía»?", ["书法", "小说", "翻译"], 0, "书法 (shūfǎ) es el arte de escribir con pincel."], ["Li Bai pertenece a la dinastía…", ["Song", "Tang", "Ming"], 1, "Li Bai es poeta de la dinastía Tang."]]
            ),
          ],
        },
      ],
    },

    {
      id: "ja",
      name: "Japonés",
      native: "日本語",
      flag: "🇯🇵",
      emoji: "🌸",
      color: "#b4476d",
      voice: "ja-JP",
      levels: [
        {
          key: "a",
          name: "Principiante",
          icon: "🌱",
          desc: "Hiragana, saludos y las primeras palabras.",
          lessons: [
            lesson(
              "ja-a1", "あいさつ · Saludos", "Las expresiones esenciales de cortesía.", "日",
              [
                ["Sílabas y escritura", "El japonés usa tres sistemas: hiragana (fonético), katakana (palabras extranjeras) y kanji (caracteres chinos). こんにちは se escribe en hiragana y significa «hola / buenos días».", [["こんにちは", "kon'nichiwa", "hola"], ["ありがとう", "arigatou", "gracias"], ["すみません", "sumimasen", "perdón"]]],
                ["Los sufijos です y ます", "です (desu) es la forma educada de «ser/estar» y ます (masu) la terminación educada de los verbos. Hacen que la frase suene cortés y natural.", [["そうです。", "Sou desu.", "Así es."], ["食べます。", "Tabemasu.", "Como."]]],
              ],
              [["こんにちは", "kon'nichiwa", "hola"], ["ありがとう", "arigatou", "gracias"], ["すみません", "sumimasen", "perdón / disculpe"], ["はい", "hai", "sí"], ["いいえ", "iie", "no"], ["さようなら", "sayounara", "adiós"], ["おはよう", "ohayou", "buenos días"], ["こんばんは", "konbanwa", "buenas noches"], ["お願いします", "onegaishimasu", "por favor"], ["はじめまして", "hajimemashite", "mucho gusto"]],
              [["こんにちは、はじめまして。", "Kon'nichiwa, hajimemashite.", "Hola, mucho gusto."], ["ありがとうございます。", "Arigatou gozaimasu.", "Muchas gracias."], ["すみません、ちょっと。", "Sumimasen, chotto.", "Disculpe, un momento."], ["よろしくお願いします。", "Yoroshiku onegaishimasu.", "Encantado / le pido consideración."]],
              [["¿Cómo se dice «gracias»?", ["こんにちは", "ありがとう", "すみません"], 1, "ありがとう (arigatou) es «gracias»."], ["¿Qué significa はい?", ["No", "Sí", "Adiós"], 1, "はい (hai) es «sí»."], ["La forma educada de «ser» es…", ["だ", "です", "ある"], 1, "です (desu) es la cópula educada."]]
            ),
            lesson(
              "ja-a2", "数字と時間 · Números y hora", "Del 1 al 10 y preguntar la hora.", "時",
              [
                ["Los números", "Los numerales japoneses tienen forma nativa (ichi, ni, san…) y forma sinojaponesa (ichi, ni, san, shi…). Para la hora se usa la lectura nativa con 時 (ji, «hora»).", [["一", "ichi", "uno"], ["三", "san", "tres"], ["十", "juu", "diez"], ["三時", "san-ji", "las tres"]]],
                ["Preguntar la hora", "今何時ですか (ima nan-ji desu ka) significa «¿qué hora es ahora?». 分 (fun / pun) es el minuto: 九時半 = las nueve y media.", [["今何時ですか。", "Ima nan-ji desu ka?", "¿Qué hora es?"], ["九時半です。", "Ku-ji han desu.", "Son las nueve y media."]]],
              ],
              [["一", "ichi", "uno"], ["二", "ni", "dos"], ["三", "san", "tres"], ["四", "yon / shi", "cuatro"], ["五", "go", "cinco"], ["六", "roku", "seis"], ["七", "nana", "siete"], ["八", "hachi", "ocho"], ["九", "kyuu", "nueve"], ["十", "juu", "diez"], ["今日", "kyou", "hoy"], ["明日", "ashita", "mañana"], ["昨日", "kinou", "ayer"], ["時", "toki / ji", "hora / momento"], ["分", "fun", "minuto"]],
              [["今何時ですか。", "Ima nan-ji desu ka?", "¿Qué hora es ahora?"], ["九時から始まります。", "Ku-ji kara hajimarimasu.", "Empieza a las nueve."], ["明日また会いましょう。", "Ashita mata aimashou.", "Nos vemos mañana."], ["待ってください。", "Matte kudasai.", "Espere, por favor."]],
              [["¿Cómo se dice «mañana»?", ["今日", "昨日", "明日"], 2, "明日 (ashita) es mañana."], ["¿Qué significa 九時?", ["Las nueve", "Nueve días", "Nueve personas"], 0, "時 (ji) indica la hora."], ["¿Cómo preguntas la hora?", ["今何時ですか", "いくらですか", "どこですか"], 0, "Es la pregunta estándar para la hora."]]
            ),
            lesson(
              "ja-a3", "食べ物 · Comida", "Pedir comida y disfrutar de la cocina japonesa.", "食",
              [
                ["Verbos de comida", "食べる (taberu, «comer») y 飲む (nomu, «beber») son verbos en る y う respectivamente. En forma educada: 食べます, 飲みます.", [["食べる", "taberu", "comer"], ["飲む", "nomu", "beber"], ["食べます", "tabemasu", "como (educado)"]]],
                ["Pedir algo", "〜をください (…o kudasai) es «deme…, por favor». いただきます se dice antes de comer y es una forma de agradecimiento.", [["水をください。", "Mizu o kudasai.", "Agua, por favor."], ["いただきます。", "Itadakimasu.", "Buen provecho (antes de comer)"]]],
              ],
              [["水", "mizu", "agua"], ["お茶", "ocha", "té"], ["ご飯", "gohan", "arroz / comida"], ["麺", "men", "fideos"], ["肉", "niku", "carne"], ["魚", "sakana", "pescado"], ["野菜", "yasai", "verduras"], ["美味しい", "oishii", "delicioso"], ["食べる", "taberu", "comer"], ["飲む", "nomu", "beber"], ["いくら", "ikura", "cuánto cuesta"], ["レストラン", "resutoran", "restaurante"]],
              [["水をください。", "Mizu o kudasai.", "Agua, por favor."], ["これは美味しいです。", "Kore wa oishii desu.", "Esto está delicioso."], ["いくらですか。", "Ikura desu ka?", "¿Cuánto cuesta?"], ["いただきます。", "Itadakimasu.", "Buen provecho."]],
              [["¿Cómo se dice «agua»?", ["お茶", "水", "ご飯"], 1, "水 (mizu) es agua."], ["¿Qué significa 美味しい?", ["Delicioso", "Caro", "Frío"], 0, "美味しい (oishii) es «delicioso»."], ["¿Qué se dice antes de comer?", ["さようなら", "いただきます", "こんばんは"], 1, "いただきます es la fórmula tradicional."]]
            ),
          ],
        },
        {
          key: "b",
          name: "Intermedio",
          icon: "🌿",
          desc: "Rutinas, direcciones y compras cotidianas.",
          lessons: [
            lesson(
              "ja-b1", "毎日の生活 · Rutina diaria", "Habla de tu día a día con naturalidad.", "毎",
              [
                ["Partículas de tiempo", "La partícula に (ni) marca el momento concreto: 七時に (a las siete). 毎日 (mainichi) significa «cada día» y va antes del verbo.", [["七時に", "shichi-ji ni", "a las siete"], ["毎日", "mainichi", "cada día"]]],
                ["Verbos y secuencias", "先に (saki ni) es «primero» y それから (sorekara) «después / luego». 〜たいです expresa deseo: 休みたいです («quiero descansar»).", [["先に仕事をします。", "Saki ni shigoto o shimasu.", "Primero trabajo."], ["それから勉強します。", "Sorekara benkyou shimasu.", "Luego estudio."]]],
              ],
              [["起きる", "okiru", "levantarse"], ["寝る", "neru", "dormirse"], ["働く", "hataraku", "trabajar"], ["勉強する", "benkyou suru", "estudiar"], ["毎日", "mainichi", "cada día"], ["朝", "asa", "mañana"], ["夜", "yoru", "noche"], ["忙しい", "isogashii", "ocupado"], ["休む", "yasumu", "descansar"], ["先に", "saki ni", "primero"], ["それから", "sorekara", "después"], ["週末", "shuumatsu", "fin de semana"]],
              [["毎朝七時に起きます。", "Maiasa shichi-ji ni okimasu.", "Me levanto a las siete cada mañana."], ["今忙しいです。", "Ima isogashii desu.", "Ahora estoy ocupado."], ["先に仕事をして、それから勉強します。", "Saki ni shigoto o shite, sorekara benkyou shimasu.", "Primero trabajo y luego estudio."], ["週末はゆっくり休みたいです。", "Shuumatsu wa yukkuri yasumitai desu.", "El fin de semana quiero descansar tranquilo."]],
              [["¿Qué partícula marca la hora exacta?", ["は", "に", "を"], 1, "に se usa para el momento: 七時に."], ["先に significa…", ["Después", "Primero", "Siempre"], 1, "先に indica que algo se hace primero."], ["休みたいです expresa…", ["Obligación", "Deseo", "Pasado"], 1, "La forma 〜たい expresa deseo."]]
            ),
            lesson(
              "ja-b2", "道案内 · Direcciones", "Pregunta y da indicaciones por la ciudad.", "道",
              [
                ["Pedir indicaciones", "すみません、〜はどこですか («disculpe, ¿dónde está…?») es la forma más segura. 駅 (eki) es estación y 電車 (densha) es tren.", [["すみません。", "Sumimasen.", "Disculpe."], ["駅はどこですか。", "Eki wa doko desu ka?", "¿Dónde está la estación?"]]],
                ["Girar y caminar", "左に曲がる (hidari ni magaru, «girar a la izquierda») y 右に曲がる (girar a la derecha). まっすぐ (massugu) es «recto».", [["左に曲がってください。", "Hidari ni magatte kudasai.", "Gire a la izquierda, por favor."], ["まっすぐ行きます。", "Massugu ikimasu.", "Vaya recto."]]],
              ],
              [["道", "michi", "calle / camino"], ["駅", "eki", "estación"], ["電車", "densha", "tren"], ["バス", "basu", "autobús"], ["左", "hidari", "izquierda"], ["右", "migi", "derecha"], ["前", "mae", "delante"], ["後ろ", "ushiro", "detrás"], ["どうやって", "dou yatte", "cómo"], ["行く", "iku", "ir"], ["遠い", "tooi", "lejos"], ["近い", "chikai", "cerca"]],
              [["すみません、駅はどこですか。", "Sumimasen, eki wa doko desu ka?", "Disculpe, ¿dónde está la estación?"], ["左に曲がってください。", "Hidari ni magatte kudasai.", "Gire a la izquierda, por favor."], ["電車で行きます。", "Densha de ikimasu.", "Voy en tren."], ["ここから遠いですか。", "Koko kara tooi desu ka?", "¿Está lejos de aquí?"]],
              [["¿Cómo se dice «estación»?", ["駅", "道", "バス"], 0, "駅 (eki) es la estación."], ["«Izquierda» es…", ["右", "左", "前"], 1, "左 (hidari) es izquierda."], ["¿Qué significa まっすぐ?", ["Recto", "Atrás", "Cerca"], 0, "まっすぐ es «recto / derecho»."]]
            ),
            lesson(
              "ja-b3", "買い物 · Compras", "Pregunta precios, regatea y paga.", "買",
              [
                ["Precios y descuentos", "値段 (nedan) es el precio. 安い (yasui) es «barato» y 高い (takai) «caro / alto». 割引 (waribiki) es el descuento.", [["いくらですか。", "Ikura desu ka?", "¿Cuánto cuesta?"], ["割引がありますか。", "Waribiki ga arimasu ka?", "¿Hay descuento?"]]],
                ["Probarse la ropa", "試着する (shichaku suru) es «probarse ropa». 〜てもいいですか es «¿puedo…?», una estructura muy útil en tiendas.", [["試着してもいいですか。", "Shichaku shite mo ii desu ka?", "¿Puedo probármelo?"], ["似合います。", "Niaimasu.", "Te queda bien."]]],
              ],
              [["買う", "kau", "comprar"], ["売る", "uru", "vender"], ["値段", "nedan", "precio"], ["安い", "yasui", "barato"], ["高い", "takai", "caro"], ["割引", "waribiki", "descuento"], ["合計", "goukei", "total"], ["現金", "genkin", "efectivo"], ["カード", "kaado", "tarjeta"], ["試着", "shichaku", "probarse"], ["店", "mise", "tienda"], ["似合う", "niau", "quedar bien"]],
              [["これはいくらですか。", "Kore wa ikura desu ka?", "¿Cuánto cuesta esto?"], ["少し安くなりませんか。", "Sukoshi yasuku narimasen ka?", "¿No podría bajar un poco?"], ["カードで払えますか。", "Kaado de haraemasu ka?", "¿Puedo pagar con tarjeta?"], ["試着してもいいですか。", "Shichaku shite mo ii desu ka?", "¿Puedo probármelo?"]],
              [["¿Qué significa 割引?", ["Total", "Descuento", "Efectivo"], 1, "割引 (waribiki) es descuento."], ["¿Cómo se dice «caro»?", ["安い", "高い", "新しい"], 1, "高い (takai) es caro o alto."], ["¿Cómo pides probarte algo?", ["試着してもいいですか", "買いました", "行きましょう"], 0, "Es la forma educada de pedir permiso."]]
            ),
          ],
        },
        {
          key: "c",
          name: "Experto",
          icon: "🏯",
          desc: "Keigo, refranes y japonés de negocios.",
          lessons: [
            lesson(
              "ja-c1", "敬語 · Lenguaje honorífico", "Respeto, humildad y cortesía avanzada.", "敬",
              [
                ["Tres tipos de 敬語", "El keigo se divide en 尊敬語 (respeto hacia el interlocutor), 謙譲語 (humildad al hablar de uno mismo) y 丁寧語 (cortesía formal, como です/ます).", [["尊敬語", "sonchougo", "lenguaje de respeto"], ["謙譲語", "kenjougo", "lenguaje humilde"], ["丁寧語", "teineigo", "lenguaje cortés"]]],
                ["Formas honoríficas clave", "いらっしゃる es la forma honorífica de «ir/venir/estar» y おっしゃる la de «decir». いただく es la forma humilde de «recibir».", [["いらっしゃる", "irassharu", "ir/venir (hon.)"], ["おっしゃる", "ossharu", "decir (hon.)"], ["いただく", "itadaku", "recibir (hum.)"]]],
              ],
              [["敬語", "keigo", "lenguaje honorífico"], ["尊敬語", "sonchougo", "respeto"], ["謙譲語", "kenjougo", "humildad"], ["丁寧語", "teineigo", "cortesía"], ["いらっしゃる", "irassharu", "ir/venir (honorífico)"], ["おっしゃる", "ossharu", "decir (honorífico)"], ["いただく", "itadaku", "recibir (humilde)"], ["伺う", "ukagau", "preguntar / visitar (humilde)"], ["申し上げる", "moushiageru", "decir (humilde)"], ["ございます", "gozaimasu", "estar (formal)"], ["恐れ入ります", "osoreirimasu", "le agradezco / perdón"], ["よろしく", "yoroshiku", "atentamente"]],
              [["お待ちしております。", "Omachi shite orimasu.", "Le estamos esperando."], ["お名前を伺ってもよろしいですか。", "Onamae o ukagatte mo yoroshii desu ka?", "¿Podría preguntarle su nombre?"], ["ご不明な点がございましたら、お知らせください。", "Gofumei na ten ga gozaimashitara, oshirase kudasai.", "Si hay algo que no entiende, hágalo saber."], ["恐れ入りますが、お願いいたします。", "Osoreirimasu ga, onegaishimasu.", "Perdone las molestias, le ruego…"]],
              [["¿Qué tipo de keigo se usa para hablar de uno mismo con humildad?", ["尊敬語", "謙譲語", "丁寧語"], 1, "謙譲語 rebaja al hablante para mostrar respeto."], ["いらっしゃる es la forma honorífica de…", ["Comer", "Ir/venir/estar", "Dormir"], 1, "Se usa para las acciones del interlocutor."], ["ございます es la forma formal de…", ["ある / です", "する", "行く"], 0, "Es el equivalente cortés de «estar / existir»."]]
            ),
            lesson(
              "ja-c2", "慣用句とことわざ · Refranes", "Expresiones fijas y sabiduría popular.", "慣",
              [
                ["ことわざ y 慣用句", "Los ことわざ son refranes completos con una enseñanza; los 慣用句 son expresiones fijas cuyo sentido no es literal. Dominarlos marca un nivel avanzado.", [["ことわざ", "kotowaza", "refrán"], ["慣用句", "kan'youku", "expresión idiomática"]]],
                ["Imágenes recurrentes", "七転び八起き («siete caídas, ocho levantadas») indica resiliencia. 急がば回れ («si te apresuras, da un rodeo») aconseja cautela.", [["七転び八起き", "nana korobi ya oki", "caer siete veces, levantarse ocho"], ["急がば回れ", "isogaba maware", "más despacio, más seguro"]]],
              ],
              [["慣用句", "kan'youku", "expresión idiomática"], ["ことわざ", "kotowaza", "refrán"], ["猫に小判", "neko ni koban", "perlas a los cerdos"], ["七転び八起き", "nana korobi ya oki", "resiliencia"], ["井の中の蛙", "i no naka no kawazu", "miras estrechas"], ["急がば回れ", "isogaba maware", "la prudencia"], ["石の上にも三年", "ishi no ue ni mo sannen", "persistencia"], ["千里の道も一歩から", "senri no michi mo ippo kara", "un paso a la vez"], ["両手に花", "ryoute ni hana", "dobler fortuna"], ["目からうろこ", "me kara uroko", "descubrimiento repentino"], ["経験", "keiken", "experiencia"], ["失敗", "shippai", "fracaso"]],
              [["失敗しても、七転び八起きで頑張りましょう。", "Shippai shite mo, nana korobi ya oki de ganbarimashou.", "Aunque falles, sigue adelante con resiliencia."], ["急がば回れ、ゆっくり確認してください。", "Isogaba maware, yukkuri kakunin shite kudasai.", "Más vale despacio: comprueba con calma."], ["千里の道も一歩からです。", "Senri no michi mo ippo kara desu.", "Un viaje de mil li empieza con un paso."], ["新しい環境は目からうろこでした。", "Atarashii kankyou wa me kara uroko deshita.", "El nuevo entorno fue todo un descubrimiento."]],
              [["七転び八起き significa…", ["Caer y rendirse", "Levantarse tras cada caída", "Correr mucho"], 1, "Es un refrán sobre la resiliencia."], ["急がば回れ aconseja…", ["Ir rápido", "Ser prudente", "No preguntar"], 1, "Literalmente «si te apresuras, rodea»."], ["目からうろこ es…", ["Un descubrimiento", "Una tristeza", "Un enfado"], 0, "Describe darse cuenta de algo de repente."]]
            ),
            lesson(
              "ja-c3", "ビジネス日本語 · Negocios", "Reuniones, cotizaciones y contratos.", "社",
              [
                ["El registro profesional", "En el trabajo se usan fórmulas como お世話になっております («gracias por su atención continua») al iniciar correos, y 確認させていただきます para pedir confirmación con humildad.", [["お世話になっております。", "Osewa ni natte orimasu.", "Gracias por su atención."], ["確認させていただきます。", "Kakunin sasete itadakimasu.", "Permítame confirmar."]]],
                ["Vocabulario de negociación", "見積もり (mitsumori) es la cotización, 契約 (keiyaku) el contrato y 交渉 (koushou) la negociación. ウィンウィン es el préstamo de «win-win».", [["見積もり", "mitsumori", "cotización"], ["契約", "keiyaku", "contrato"], ["交渉", "koushou", "negociación"]]],
              ],
              [["会社", "kaisha", "empresa"], ["取引", "torihiki", "trato / operación"], ["見積もり", "mitsumori", "cotización"], ["契約", "keiyaku", "contrato"], ["顧客", "kokyaku", "cliente"], ["市場", "shijou", "mercado"], ["利益", "rieki", "beneficio"], ["投資", "toushi", "inversión"], ["交渉", "koushou", "negociación"], ["契約書", "keiyakusho", "documento del contrato"], ["担当者", "tantousha", "responsable"], ["ウィンウィン", "winwin", "ganar-ganar"]],
              [["長期的な協力関係を築きたいです。", "Choukiteki na kyoryoku kankei o kizukitai desu.", "Queremos construir una relación a largo plazo."], ["詳細な見積もりをお送りください。", "Shousai na mitsumori o o-okuri kudasai.", "Por favor, envíe una cotización detallada."], ["この条件で合意できます。", "Kono jouken de goui dekimasu.", "Podemos llegar a un acuerdo con estas condiciones."], ["契約書の条文を再確認しましょう。", "Keiyakusho joubun o saikakunin shimashou.", "Revisemos de nuevo las cláusulas del contrato."]],
              [["¿Qué es un 見積もり?", ["Un contrato", "Una cotización", "Un cliente"], 1, "見積もり es el presupuesto o cotización."], ["¿Cómo se dice «negociación»?", ["取引", "交渉", "投資"], 1, "交渉 (koushou) es la negociación."], ["契約書 es…", ["El contrato escrito", "La empresa", "El mercado"], 0, "書 significa «documento escrito»."]]
            ),
          ],
        },
      ],
    },

    {
      id: "ko",
      name: "Coreano",
      native: "한국어",
      flag: "🇰🇷",
      emoji: "🌺",
      color: "#3a6fc4",
      voice: "ko-KR",
      levels: [
        {
          key: "a",
          name: "Principiante",
          icon: "🌱",
          desc: "Hangul, saludos y primeras palabras.",
          lessons: [
            lesson(
              "ko-a1", "인사 · Saludos", "Las fórmulas de cortesía esenciales.", "한",
              [
                ["El alfabeto hangul", "El coreano se escribe con hangul, un alfabeto fonético creado en el siglo XV. Cada bloque silábico agrupa dos o tres jamos (letras): ㄱ+ㅏ = 가 (ga).", [["안녕", "annyeong", "hola / paz"], ["감사", "gamsa", "gracias"], ["네", "ne", "sí"]]],
                ["Niveles de cortesía", "La terminación 〜요 (-yo) es la forma educada estándar; 〜습니다 (-seumnida) es más formal. Los saludados cambian según quien se va o se queda.", [["안녕하세요", "annyeonghaseyo", "hola (educado)"], ["감사합니다", "gamsahamnida", "gracias (formal)"]]],
              ],
              [["안녕하세요", "annyeonghaseyo", "hola"], ["감사합니다", "gamsahamnida", "gracias"], ["죄송합니다", "joesonghamnida", "perdón"], ["네", "ne", "sí"], ["아니요", "aniyo", "no"], ["안녕히 가세요", "annyeonghi gaseyo", "adiós (a quien se va)"], ["안녕히 계세요", "annyeonghi gyeseyo", "adiós (a quien se queda)"], ["처음 뵙겠습니다", "cheoeum boepgetseumnida", "mucho gusto"], ["부탁합니다", "butakhamnida", "por favor / le ruego"], ["잘 지내세요?", "jal jinaeseoyo?", "¿cómo está?"]],
              [["안녕하세요! 처음 뵙겠습니다.", "Annyeonghaseyo! Cheoeum boepgetseumnida.", "¡Hola! Mucho gusto."], ["감사합니다.", "Gamsahamnida.", "Gracias."], ["죄송합니다.", "Joesonghamnida.", "Lo siento / perdón."], ["잘 지내세요?", "Jal jinaeseoyo?", "¿Cómo está usted?"]],
              [["¿Cómo se dice «gracias»?", ["안녕하세요", "감사합니다", "죄송합니다"], 1, "감사합니다 (gamsahamnida) significa gracias."], ["¿Qué significa 네?", ["Sí", "No", "Adiós"], 0, "네 (ne) es «sí»."], ["¿Cómo se despide a quien se va?", ["안녕히 가세요", "안녕히 계세요", "처음 뵙겠습니다"], 0, "가다 es «ir», por eso se usa 가세요."]]
            ),
            lesson(
              "ko-a2", "숫자와 시간 · Números y hora", "Números coreanos y preguntar la hora.", "時",
              [
                ["Dos sistemas numéricos", "El coreano tiene números nativos (hana, dul, set…) y sino-coreanos (il, i, sam…). Los nativos se usan para contar objetos; los sino-coreanos para la hora, fechas y dinero.", [["하나", "hana", "uno (nativo)"], ["일", "il", "uno (sino-coreano)"], ["셋", "set", "tres (nativo)"]]],
                ["La hora", "Para la hora se usan los números sino-coreanos con 시 (si, «hora») y 분 (bun, «minuto»). 몇 시예요? es «¿qué hora es?».", [["지금 몇 시예요?", "Jigeum myeot siyeyo?", "¿Qué hora es?"], ["아홉 시", "ahop si", "las nueve"]]],
              ],
              [["하나", "hana", "uno"], ["둘", "dul", "dos"], ["셋", "set", "tres"], ["넷", "net", "cuatro"], ["다섯", "daseot", "cinco"], ["여섯", "yeoseot", "seis"], ["일곱", "ilgop", "siete"], ["여덟", "yeodeol", "ocho"], ["아홉", "ahop", "nueve"], ["열", "yeol", "diez"], ["오늘", "oneul", "hoy"], ["내일", "naeil", "mañana"], ["어제", "eoje", "ayer"], ["시", "si", "hora"], ["분", "bun", "minuto"]],
              [["지금 몇 시예요?", "Jigeum myeot siyeyo?", "¿Qué hora es ahora?"], ["아홉 시에 시작해요.", "Ahop sie sijakhaeyo.", "Empieza a las nueve."], ["내일 또 만나요.", "Naeil tto mannayo.", "Nos vemos mañana."], ["잠깐만 기다려 주세요.", "Jamkkanman gidaryeo juseyo.", "Espere un momento, por favor."]],
              [["¿Cómo se dice «mañana»?", ["어제", "오늘", "내일"], 2, "내일 (naeil) es mañana."], ["¿Qué significa 몇 시예요?", ["¿Qué día es?", "¿Qué hora es?", "¿Cuánto cuesta?"], 1, "Es la pregunta por la hora."], ["El número nativo «tres» es…", ["삼", "셋", "일곱"], 1, "셋 (set) es la forma nativa de tres."]]
            ),
            lesson(
              "ko-a3", "음식 · Comida", "Pedir comida y decir que está rico.", "食",
              [
                ["Verbos de comer y beber", "먹다 (meokda, «comer») y 마시다 (masida, «beber») terminan en 〜요 en forma educada: 먹어요, 마셔요. 주세요 es «deme, por favor».", [["먹다", "meokda", "comer"], ["마시다", "masida", "beber"], ["주세요", "juseyo", "deme, por favor"]]],
                ["Costumbres a la mesa", "잘 먹겠습니다 se dice antes de comer («comeré bien») y 잘 먹었습니다 al terminar («comí bien»). Son fórmulas de agradecimiento muy importantes.", [["잘 먹겠습니다", "jal meokgetseumnida", "buen provecho"], ["맛있어요", "masisseoyo", "está delicioso"]]],
              ],
              [["물", "mul", "agua"], ["차", "cha", "té"], ["밥", "bap", "arroz"], ["라면", "ramyeon", "fideos"], ["고기", "gogi", "carne"], ["생선", "saengseon", "pescado"], ["채소", "chaeso", "verduras"], ["맛있어요", "masisseoyo", "delicioso"], ["먹다", "meokda", "comer"], ["마시다", "masida", "beber"], ["얼마예요", "eolmayeyo", "cuánto cuesta"], ["식당", "sikdang", "restaurante"]],
              [["물 좀 주세요.", "Mul jom juseyo.", "Agua, por favor."], ["이거 정말 맛있어요.", "Igeo jeongmal masisseoyo.", "Esto está realmente delicioso."], ["얼마예요?", "Eolmayeyo?", "¿Cuánto cuesta?"], ["잘 먹겠습니다.", "Jal meokgetseumnida.", "Buen provecho."]],
              [["¿Cómo se dice «agua»?", ["차", "물", "밥"], 1, "물 (mul) es agua."], ["¿Qué significa 맛있어요?", ["Está caro", "Está delicioso", "Está frío"], 1, "맛있어요 es «está sabroso»."], ["¿Qué se dice antes de comer?", ["잘 먹겠습니다", "안녕히 가세요", "감사합니다"], 0, "Es la fórmula tradicional antes de la comida."]]
            ),
          ],
        },
        {
          key: "b",
          name: "Intermedio",
          icon: "🌿",
          desc: "Rutina, direcciones y compras con fluidez.",
          lessons: [
            lesson(
              "ko-b1", "일상 생활 · Rutina diaria", "Describe tu día con naturalidad.", "毎",
              [
                ["Tiempo y partículas", "에 (e) marca el momento: 일곱 시에 («a las siete»). 매일 (maeil) es «cada día» y 〜아요/어요 es la terminación educada del presente.", [["일곱 시에", "ilgop sie", "a las siete"], ["매일", "maeil", "cada día"]]],
                ["Ordenar acciones", "먼저 (meonjeo) es «primero» y 그 다음 (geu daeum) «después». 〜고 싶어요 expresa deseo: 쉬고 싶어요 («quiero descansar»).", [["먼저 일해요.", "Meonjeo ilhaeyo.", "Primero trabajo."], ["쉬고 싶어요.", "Swigo sipeoyo.", "Quiero descansar."]]],
              ],
              [["일어나다", "ireonada", "levantarse"], ["자다", "jada", "dormirse"], ["일하다", "ilhada", "trabajar"], ["공부하다", "gongbuhada", "estudiar"], ["매일", "maeil", "cada día"], ["아침", "achim", "mañana"], ["밤", "bam", "noche"], ["바쁘다", "bappeuda", "ocupado"], ["쉬다", "swida", "descansar"], ["먼저", "meonjeo", "primero"], ["그 다음", "geu daeum", "después"], ["주말", "jumal", "fin de semana"]],
              [["매일 아침 일곱 시에 일어나요.", "Maeil achim ilgop sie ireonayo.", "Me levanto a las siete cada mañana."], ["지금 좀 바빠요.", "Jigeum jom bappayo.", "Ahora estoy un poco ocupado."], ["먼저 일하고 그 다음 공부해요.", "Meonjeo ilhago geu daeum gongbuhaeyo.", "Primero trabajo y luego estudio."], ["주말에는 푹 쉬고 싶어요.", "Jumareneun puk swigo sipeoyo.", "El fin de semana quiero descansar bien."]],
              [["¿Qué partícula indica la hora?", ["은", "에", "를"], 1, "에 marca el tiempo: 일곱 시에."], ["먼저 significa…", ["Después", "Primero", "Nunca"], 1, "Indica la primera acción."], ["쉬고 싶어요 expresa…", ["Deseo", "Obligación", "Pasado"], 0, "〜고 싶어요 es «quiero…»."]]
            ),
            lesson(
              "ko-b2", "길 안내 · Direcciones", "Pregunta y da indicaciones.", "路",
              [
                ["Pedir indicaciones", "실례합니다 («disculpe») es la forma educada de abrir una conversación con un desconocido. 어디에 있어요? es «¿dónde está?».", [["실례합니다.", "Sillyehamnida.", "Disculpe."], ["역이 어디에 있어요?", "Yegi eodie isseoyo?", "¿Dónde está la estación?"]]],
                ["Girar y distancia", "왼쪽 (oenjjok) es izquierda y 오른쪽 (oreunjjok) derecha. 도세요 es «gire» y 멀어요 / 가까워요 indican lejos / cerca.", [["왼쪽으로 도세요.", "Oenjjogeuro doseyo.", "Gire a la izquierda."], ["여기서 멀어요?", "Yeogiseo meoreoyo?", "¿Está lejos de aquí?"]]],
              ],
              [["길", "gil", "calle / camino"], ["역", "yeok", "estación"], ["지하철", "jihacheol", "metro"], ["버스", "beoseu", "autobús"], ["왼쪽", "oenjjok", "izquierda"], ["오른쪽", "oreunjjok", "derecha"], ["앞", "ap", "delante"], ["뒤", "dwi", "detrás"], ["어떻게", "eotteoke", "cómo"], ["가다", "gada", "ir"], ["멀다", "meolda", "lejos"], ["가깝다", "gakkada", "cerca"]],
              [["실례합니다, 역이 어디에 있어요?", "Sillyehamnida, yegi eodie isseoyo?", "Disculpe, ¿dónde está la estación?"], ["왼쪽으로 도세요.", "Oenjjogeuro doseyo.", "Gire a la izquierda."], ["지하철로 가요.", "Jihacheollo gayo.", "Voy en metro."], ["여기서 멀어요?", "Yeogiseo meoreoyo?", "¿Está lejos de aquí?"]],
              [["¿Cómo se dice «metro»?", ["버스", "지하철", "역"], 1, "지하철 (jihacheol) es el metro."], ["«Izquierda» es…", ["오른쪽", "왼쪽", "앞"], 1, "왼쪽 (oenjjok) es izquierda."], ["¿Qué significa 실례합니다?", ["Gracias", "Disculpe", "Hola"], 1, "Es la forma cortés de pedir atención."]]
            ),
            lesson(
              "ko-b3", "쇼핑 · Compras", "Pregunta precios y paga en la tienda.", "買",
              [
                ["Comprar y precios", "사다 (sada, «comprar») y 팔다 (palda, «vender»). 가격 es el precio; 싸다 es «barato» y 비싸다 «caro». 깎아 주세요 es «haga un descuento».", [["얼마예요?", "Eolmayeyo?", "¿Cuánto cuesta?"], ["깎아 주세요.", "Kkaka juseyo.", "Rebaje, por favor."]]],
                ["Probarse y pagar", "입어 보다 (ibe boda) es «probarse ropa». 계산하다 (gyesanhada) es «pagar / hacer la cuenta».", [["입어 봐도 될까요?", "Ibe bwado doelkkayo?", "¿Puedo probármelo?"], ["카드로 계산할게요.", "Kadeuro gyesanhalkkeyo.", "Pagaré con tarjeta."]]],
              ],
              [["사다", "sada", "comprar"], ["팔다", "palda", "vender"], ["가격", "gagyeok", "precio"], ["싸다", "ssada", "barato"], ["비싸다", "bissada", "caro"], ["할인", "halin", "descuento"], ["합계", "hapgye", "total"], ["현금", "hyeongeum", "efectivo"], ["카드", "kadeu", "tarjeta"], ["입어 보다", "ibe boda", "probarse"], ["가게", "gage", "tienda"], ["어울리다", "eoullida", "quedar bien"]],
              [["이거 얼마예요?", "Igeo eolmayeyo?", "¿Cuánto cuesta esto?"], ["조금 깎아 주세요.", "Jogeum kkaka juseyo.", "Un poco más barato, por favor."], ["카드로 계산할 수 있어요?", "Kadeuro gyesanhal su isseoyo?", "¿Puedo pagar con tarjeta?"], ["입어 봐도 될까요?", "Ibe bwado doelkkayo?", "¿Puedo probármelo?"]],
              [["¿Qué significa 비싸다?", ["Barato", "Caro", "Nuevo"], 1, "비싸다 es «caro»."], ["¿Cómo se dice «descuento»?", ["할인", "합계", "현금"], 0, "할인 (halin) es descuento."], ["¿Cómo pides probarte algo?", ["입어 봐도 될까요?", "사고 싶어요", "가요"], 0, "Es la forma educada de pedir permiso."]]
            ),
          ],
        },
        {
          key: "c",
          name: "Experto",
          icon: "🏯",
          desc: "Honoríficos, refranes y coreano de negocios.",
          lessons: [
            lesson(
              "ko-c1", "높임말 · Honoríficos", "El sistema de respeto coreano.", "敬",
              [
                ["존댓말 y 반말", "El coreano distingue entre 존댓말 (lenguaje formal, con 〜습니다/〜요) y 반말 (informal, entre iguales o hacia abajo). Elegir bien es esencial en contextos jerárquicos.", [["존댓말", "jondaenmal", "lenguaje formal"], ["반말", "banmal", "lenguaje informal"], ["높임말", "nopimmal", "honoríficos"]]],
                ["Formas especiales", "Los verbos tienen formas honoríficas propias: 계시다 (estar), 말씀하시다 (decir), 드리다 (dar, humilde) y 여쭙다 (preguntar, humilde).", [["계시다", "gyesida", "estar (hon.)"], ["말씀하시다", "malsseumhasida", "decir (hon.)"], ["드리다", "deurida", "dar (humilde)"]]],
              ],
              [["높임말", "nopimmal", "honoríficos"], ["존댓말", "jondaenmal", "lenguaje formal"], ["반말", "banmal", "lenguaje informal"], ["계시다", "gyesida", "estar (honorífico)"], ["말씀하시다", "malsseumhasida", "decir (honorífico)"], ["드리다", "deurida", "dar (humilde)"], ["여쭙다", "yeojjupda", "preguntar (humilde)"], ["감사드립니다", "gamsadeurimnida", "gracias (muy formal)"], ["실례합니다", "sillyehamnida", "disculpe"], ["기다리시다", "gidarisida", "esperar (honorífico)"], ["알려 주시다", "allyeo jusida", "informar (honorífico)"], ["준비되다", "junbidoeda", "estar listo"]],
              [["사장님께서 오셨습니다.", "Sajangnimkkeseo osyeotseumnida.", "El director ha llegado."], ["이름을 여쭙어도 될까요?", "Ireumeul yeojjubeodo doelkkayo?", "¿Podría preguntarle su nombre?"], ["불편한 점이 있으시면 말씀해 주세요.", "Bulpyeonhan jeomi issusimyeon malsseumhae juseyo.", "Si tiene alguna molestia, dígalo, por favor."], ["기다려 주셔서 감사드립니다.", "Gidaryeo jusyeoseo gamsadeurimnida.", "Gracias por esperar."]],
              [["¿Qué es 존댓말?", ["Lenguaje informal", "Lenguaje formal", "Un refrán"], 1, "Es el registro honorífico / formal."], ["계시다 es la forma honorífica de…", ["Ir", "Estar", "Comer"], 1, "Se usa para «estar» respecto a una persona mayor."], ["여쭙da es la forma humilde de…", ["Preguntar", "Dar", "Dormir"], 0, "Se usa al preguntar algo con respeto."]]
            ),
            lesson(
              "ko-c2", "속담 · Refranes", "La sabiduría popular coreana.", "諺",
              [
                ["Qué son los 속담", "Los 속담 son refranes tradicionales que resumen una enseñanza en pocas palabras. Se usan mucho en conversación y en los medios para dar peso a una idea.", [["속담", "sokdam", "refrán"], ["경험", "gyeongheom", "experiencia"]]],
                ["Refranes frequentes", "시작이 반이다 («empezar es la mitad») anima a comenzar. 소 잃고 외양간 고친다 («perder la vaca y arreglar el establo») describe actuar cuando ya es tarde.", [["시작이 반이다", "sijagi banida", "empezar es la mitad"], ["급할수록 돌아가라", "geupalsurok doragarara", "date prisa despacio"]]],
              ],
              [["속담", "sokdam", "refrán"], ["고생 끝에 낙이 온다", "gosaeng kkeute nagi onda", "después del esfuerzo viene la alegría"], ["시작이 반이다", "sijagi banida", "empezar es la mitad"], ["입에 쓴 약이 몸에 좋다", "ibe sseun yagi mome jokda", "la verdad duele pero sana"], ["소 잃고 외양간 고친다", "so ilgo oeyanggan gochinda", "remediar tarde"], ["산이 높으면 골도 깊다", "sani nop-eumyeon golde gipda", "a mayor altura, mayor dificultad"], ["백 번 듣는 것보다 한 번 보는 것이 낫다", "baek beon deutneun geotboda han beon boneun geosi natda", "ver una vez es mejor que oír cien"], ["급할수록 돌아가라", "geupalsurok doragarara", "la calma es prudencia"], ["천 리 길도 한 걸음부터", "cheon ri gildo han georeumbuteo", "un paso a la vez"], ["경험", "gyeongheom", "experiencia"], ["실패", "silpae", "fracaso"], ["성공", "seonggong", "éxito"]],
              [["시작이 반이니까 일단 해 보세요.", "Sijagi baninikka ildan hae boseyo.", "Empezar es la mitad, así que inténtalo."], ["소 잃고 외양간 고친다라는 말이 있어요.", "So ilgo oeyanggan gochindaraneun mari isseoyo.", "Hay un refrán: «arreglar el establo tras perder la vaca»."], ["급할수록 돌아가라, 천천히 확인하세요.", "Geupalsurok doragarara, cheoncheonhi hwaginhaseyo.", "Si te apresuras, date un rodeo: comprueba despacio."], ["천 리 길도 한 걸음부터입니다.", "Cheon ri gildo han georeumbuteoimnida.", "Un viaje de mil li empieza con un paso."]],
              [["시작이 반이다 significa…", ["Empezar es la mitad", "Nunca empieces", "Es muy difícil"], 0, "Anima a dar el primer paso."], ["소 잃고 외양간 고친다 describe…", ["Prevenir", "Actuar demasiado tarde", "Ganar dinero"], 1, "Es el equivalente a «cerrar la puerta después del robo»."], ["천 리 길도 한 걸음부터 aconseja…", ["Ir deprisa", "Dar un paso cada vez", "No viajar"], 1, "Es la versión coreana del viaje de mil millas."]]
            ),
            lesson(
              "ko-c3", "비즈니스 한국어 · Negocios", "Correos, contratos y reuniones formales.", "社",
              [
                ["Fórmulas de correo", "En el ámbito profesional se abre con 안녕하세요 o 감사드립니다 y se cierra con 감사합니다. 확인 부탁드립니다 es «le pido que lo confirme».", [["확인 부탁드립니다.", "Hwagin butakdeurimnida.", "Le ruego confirmar."], ["검토 후 회신드리겠습니다.", "Geomto hu hoesindeurigetseumnida.", "Responderé tras revisarlo."]]],
                ["Vocabulario de negociación", "견적 (cotización), 계약 (contrato), 협상 (negociación) y 윈윈 (win-win) son términos esenciales. 장기적인 협력 관계 es «relación de cooperación a largo plazo».", [["견적", "gyeonjeok", "cotización"], ["계약", "gyeyak", "contrato"], ["협상", "hyeopsang", "negociación"]]],
              ],
              [["회사", "hoesa", "empresa"], ["거래", "georae", "operación / trato"], ["견적", "gyeonjeok", "cotización"], ["계약", "gyeyak", "contrato"], ["고객", "gogaek", "cliente"], ["시장", "sijang", "mercado"], ["이익", "iik", "beneficio"], ["투자", "tuja", "inversión"], ["협상", "hyeopsang", "negociación"], ["계약서", "gyeyakseo", "contrato escrito"], ["담당자", "damdangja", "responsable"], ["윈윈", "winwin", "ganar-ganar"]],
              [["장기적인 협력 관계를 맺고 싶습니다.", "Janggijeok hyeomnyeok gwangyereul maetgo sipseumnida.", "Queremos establecer una cooperación a largo plazo."], ["자세한 견적서를 보내 주세요.", "Jasaehan gyeonjeokseoreul bonae juseyo.", "Por favor, envíe una cotización detallada."], ["이 조건으로 합의할 수 있습니다.", "I jogeoneuro habuihal su isseumnida.", "Podemos llegar a un acuerdo con estas condiciones."], ["계약서 조항을 다시 확인하겠습니다.", "Gyeyakseo johangeul dasi hwaginhagetseumnida.", "Volveremos a revisar las cláusulas del contrato."]],
              [["¿Qué es un 견적?", ["Un contrato", "Una cotización", "Un cliente"], 1, "견적 (gyeonjeok) es el presupuesto."], ["¿Cómo se dice «negociación»?", ["거래", "협상", "투자"], 1, "협상 (hyeopsang) es la negociación."], ["계약서 es…", ["El contrato escrito", "La empresa", "El mercado"], 0, "서 indica «documento»."]]
            ),
          ],
        },
      ],
    },
  ];

  /* Lecciones adicionales para completar los niveles oficiales */
  const extraLessons = [
    lesson(
      "zh-d1", "Aficiones y tiempo libre", "Habla de lo que te gusta hacer.", "兴",
      [
        ["Gustos y habilidades", "喜欢 (xǐhuan) es «gustar» y 会 (huì) es «saber hacer algo». El verbo 会 va seguido directamente de la acción: 我会打篮球 (wǒ huì dǎ lánqiú, «sé jugar al baloncesto»).", [["喜欢", "xǐhuan", "gustar"], ["会", "huì", "saber hacer"], ["兴趣", "xìngqù", "interés"]]],
        ["Frecuencia", "常常 (chángcháng) es «a menudo», 有时候 (yǒu shíhou) «a veces» y 从来不 (cónglái bù) «nunca». Van antes del verbo.", [["常常", "chángcháng", "a menudo"], ["有时候", "yǒu shíhou", "a veces"], ["从来不", "cónglái bù", "nunca"]]],
      ],
      [["喜欢", "xǐhuan", "gustar"], ["音乐", "yīnyuè", "música"], ["运动", "yùndòng", "deporte"], ["看书", "kàn shū", "leer libros"], ["电影", "diànyǐng", "película"], ["旅行", "lǚxíng", "viajar"], ["会", "huì", "saber hacer"], ["常常", "chángcháng", "a menudo"], ['有时候', 'yǒu shíhou', 'a veces'], ["兴趣", "xìngqù", "interés"]],
      [["你喜欢什么？", "Nǐ xǐhuan shénme?", "¿Qué te gusta?"], ["我喜欢听音乐。", "Wǒ xǐhuan tīng yīnyuè.", "Me gusta escuchar música."], ["我会打篮球。", "Wǒ huì dǎ lánqiú.", "Sé jugar al baloncesto."], ["周末我常常去看电影。", "Zhōumò wǒ chángcháng qù kàn diànyǐng.", "Los fines de semana suelo ir al cine."]],
      [["¿Cómo se dice «me gusta»?", ["喜欢", "会", "常常"], 0, "喜欢 (xǐhuan) es «gustar»."], ["会 significa…", ["Saber hacer", "Querer", "Ir"], 0, "会 indica habilidad adquirida."], ["«A veces» es…", ["常常", "有时候", "从来不"], 1, "有时候 (yǒu shíhou) es «a veces»."]]
    ),
    lesson(
      "zh-d2", "Viajes y hotel", "Reserva habitación y prepara tu viaje.", "店",
      [
        ["Reservar y alojarse", "预订 (yùdìng) es «reservar» y 入住 (rùzhù) «hacer el check-in». 退房 (tuìfáng) es «salir / devolver la habitación».", [["预订", "yùdìng", "reservar"], ["入住", "rùzhù", "check-in"], ["退房", "tuìfáng", "check-out"]]],
        ["De un lugar a otro", "La estructura 从…到… (cóng… dào…) significa «desde… hasta…». 机场 (jīchǎng) es aeropuerto y 票 (piào) es billete.", [["从机场到酒店", "cóng jīchǎng dào jiǔdiàn", "del aeropuerto al hotel"], ["一张票", "yī zhāng piào", "un billete"]]],
      ],
      [["酒店", "jiǔdiàn", "hotel"], ["房间", "fángjiān", "habitación"], ["预订", "yùdìng", "reservar"], ["入住", "rùzhù", "check-in"], ["退房", "tuìfáng", "check-out"], ["护照", "hùzhào", "pasaporte"], ["行李", "xíngli", "equipaje"], ["地图", "dìtú", "mapa"], ["机场", "jīchǎng", "aeropuerto"], ["票", "piào", "billete"]],
      [["我想预订一个房间。", "Wǒ xiǎng yùdìng yī gè fángjiān.", "Quiero reservar una habitación."], ["入住需要护照吗？", "Rùzhù xūyào hùzhào ma?", "¿Necesito el pasaporte para el check-in?"], ["行李可以放在这里吗？", "Xíngli kěyǐ fàng zài zhèlǐ ma?", "¿Puedo dejar el equipaje aquí?"], ["从机场到酒店怎么走？", "Cóng jīchǎng dào jiǔdiàn zěnme zǒu?", "¿Cómo se va del aeropuerto al hotel?"]],
      [["¿Cómo se dice «reservar»?", ["预订", "入住", "退房"], 0, "预订 (yùdìng) es reservar."], ["退房 es…", ["Check-in", "Check-out", "Reserva"], 1, "退房 es devolver la habitación."], ["从…到… significa…", ["Desde… hasta…", "Antes… después…", "Dentro… fuera…"], 0, "Es la estructura para indicar origen y destino."]]
    ),
    lesson(
      "zh-d3", "Opinión y debate", "Expresa tu punto de vista y argumenta.", "观",
      [
        ["Dar una opinión", "认为 (rènwéi) es «opinar / considerar» y 我觉得 (wǒ juéde) «me parece». 观点 (guāndiǎn) es «punto de vista».", [["我认为…", "Wǒ rènwéi…", "Opino que…"], ["我觉得…", "Wǒ juéde…", "Me parece que…"], ["观点", "guāndiǎn", "punto de vista"]]],
        ["Contrastar ideas", "虽然…但是… (suīrán… dànshì…) es «aunque… pero…». 例如 (lìrú) introduce ejemplos.", [["虽然贵，但是好。", "Suīrán guì, dànshì hǎo.", "Aunque es caro, es bueno."], ["例如", "lìrú", "por ejemplo"]]],
      ],
      [["观点", "guāndiǎn", "punto de vista"], ["认为", "rènwéi", "considerar"], ["理由", "lǐyóu", "razón"], ["讨论", "tǎolùn", "debate"], ["同意", "tóngyì", "estar de acuerdo"], ["反对", "fǎnduì", "oponerse"], ["重要", "zhòngyào", "importante"], ["问题", "wèntí", "problema"], ["解决", "jiějué", "resolver"], ["例如", "lìrú", "por ejemplo"]],
      [["我认为这个方案很好。", "Wǒ rènwéi zhège fāng'àn hěn hǎo.", "Opino que este plan es muy bueno."], ["虽然贵，但是质量好。", "Suīrán guì, dànshì zhìliàng hǎo.", "Aunque es caro, la calidad es buena."], ["你同意他的观点吗？", "Nǐ tóngyì tā de guāndiǎn ma?", "¿Estás de acuerdo con su opinión?"], ["例如，可以坐地铁去。", "Lìrú, kěyǐ zuò dìtiě qù.", "Por ejemplo, se puede ir en metro."]],
      [["认为 significa…", ["Opinar", "Dormir", "Comprar"], 0, "认为 se usa para expresar una opinión."], ["«Aunque… pero…» es…", ["因为…所以…", "虽然…但是…", "先…然后…"], 1, "Es la estructura de contraste."], ["«Estar de acuerdo» es…", ["反对", "同意", "讨论"], 1, "同意 (tóngyì) es estar de acuerdo."]]
    ),
    lesson(
      "ja-d1", "文学と評論 · Literatura y crítica", "Expresiones abstractas y análisis literario.", "文",
      [
        ["Conectores avanzados", "〜ので indica causa («porque/así que») y 〜ながら «mientras se hace otra cosa». 〜とはいえ matiza una concesión: «si bien se dice que…».", [["〜ので", "~node", "porque / por eso"], ["〜ながら", "~nagara", "mientras"], ["とはいえ", "to wa ie", "si bien…"]]],
        ["Vocabulario de análisis", "解釈 (kaishaku) es interpretación, 比喩 (hiyu) metáfora y 考察 (kousatsu) análisis. Se usan en textos académicos y reseñas.", [["解釈", "kaishaku", "interpretación"], ["比喩", "hiyu", "metáfora"], ["考察", "kousatsu", "análisis"]]],
      ],
      [["文学", "bungaku", "literatura"], ["小説", "shousetsu", "novela"], ["評論", "hyouron", "crítica"], ["作者", "sakusha", "autor"], ["作品", "sakuhin", "obra"], ["登場人物", "toujou jinbutsu", "personaje"], ["解釈", "kaishaku", "interpretación"], ["比喩", "hiyu", "metáfora"], ["象徴", "shouchou", "símbolo"], ["考察", "kousatsu", "análisis"]],
      [["この小説は戦後を描いています。", "Kono shousetsu wa sengo o egaite imasu.", "Esta novela describe la posguerra."], ["作者の意図を考察する。", "Sakusha no ito o kousatsu suru.", "Analizar la intención del autor."], ["比喩的な表現が印象的です。", "Hiyuteki na hyougen ga inshouteki desu.", "Las expresiones metafóricas son impresionantes."], ["とはいえ、結論は慎重に述べたい。", "To wa ie, ketsuron wa shinchou ni nobetai.", "Dicho esto, quiero expresar la conclusión con cautela."]],
      [["解釈 significa…", ["Interpretación", "Traducción", "Copia"], 0, "解釈 (kaishaku) es interpretar un texto."], ["〜ながら indica…", ["Causa", "Simultaneidad", "Condición"], 1, "Se usa para acciones simultáneas."], ["比喩 es…", ["Metáfora", "Símbolo", "Rima"], 0, "比喩 (hiyu) es una metáfora o comparación."]]
    ),
    lesson(
      "ko-d1", "여행과 숙박 · Viajes y hotel", "Reserva alojamiento y muévete en Corea.", "旅",
      [
        ["Reservar", "예약하다 (yeyak-hada) es «reservar» y 〜(으)려고 indica intención: 방을 예약하려고요 («voy a reservar una habitación»).", [["예약하다", "yeyak-hada", "reservar"], ["체크인", "chekeu-in", "check-in"], ["체크아웃", "chekeu-a-ut", "check-out"]]],
        ["Mostrar documentos", "여권 (yeogwon) es pasaporte. 보여 주세요 es «muéstreme, por favor». 〜아/어서 expresa causa.", [["여권", "yeogwon", "pasaporte"], ["보여 주세요", "boyeo juseyo", "muéstreme, por favor"]]],
      ],
      [["여행", "yeohaeng", "viaje"], ["호텔", "hotel", "hotel"], ["예약", "yeyak", "reserva"], ["체크인", "chekeu-in", "check-in"], ["체크아웃", "chekeu-a-ut", "check-out"], ["여권", "yeogwon", "pasaporte"], ["수하물", "suhamul", "equipaje"], ["지도", "jido", "mapa"], ["공항", "gonghang", "aeropuerto"], ["표", "pyo", "billete"]],
      [["방을 예약하고 싶어요.", "Bangeul yeyakhago sipeoyo.", "Quiero reservar una habitación."], ["여권을 보여 주세요.", "Yeogwoneul boyeo juseyo.", "Muéstreme su pasaporte, por favor."], ["수하물은 여기에 놓아도 돼요?", "Suhamureun yeogie noado dwae yo?", "¿Puedo dejar el equipaje aquí?"], ["공항에서 호텔까지 어떻게 가요?", "Gonghangeseo hotelkkaji eotteoke gayo?", "¿Cómo se va del aeropuerto al hotel?"]],
      [["¿Cómo se dice «reserva»?", ["예약", "여권", "수하물"], 0, "예약 (yeyak) es reservar."], ["여권 es…", ["Mapa", "Pasaporte", "Billete"], 1, "여권 (yeogwon) es el pasaporte."], ["체크아웃 es…", ["Check-in", "Check-out", "Reserva"], 1, "Es la acción de dejar la habitación."]]
    ),
    lesson(
      "ko-d2", "사회와 환경 · Sociedad y medio ambiente", "Habla de medio ambiente y políticas.", "環",
      [
        ["Obligación y causa", "〜아/어야 하다 es «tener que / deber»: 환경을 보호해야 해요 («debemos proteger el ambiente»). 때문에 indica causa: 오염 때문에 («por la contaminación»).", [["보호해야 해요", "boho-haeyo haeyo", "deber proteger"], ["때문에", "ttaemune", "por / a causa de"]]],
        ["Reducir y reciclar", "줄이다 es «reducir», 재활용 es «reciclaje» y 대중교통 «transporte público». Son palabras frecuentes en noticias y textos cívicos.", [["줄이다", "jurida", "reducir"], ["재활용", "jaehwayong", "reciclaje"], ["대중교통", "daejung gyotong", "transporte público"]]],
      ],
      [["환경", "hwan-gyeong", "medio ambiente"], ["오염", "o-yeom", "contaminación"], ["기후", "gi-hu", "clima"], ["자원", "ja-won", "recursos"], ["절약", "jeol-yak", "ahorro"], ["재활용", "jaehwayong", "reciclaje"], ["대중교통", "daejung gyotong", "transporte público"], ["정책", "jeong-chaek", "política"], ["영향", "yeong-hyang", "influencia"], ["개선", "gae-seon", "mejora"]],
      [["환경을 보호해야 합니다.", "Hwan-gyeongeul boho-haeyo hamnida.", "Debemos proteger el medio ambiente."], ["자동차 대신 대중교통을 이용해요.", "Jadongcha daesin daejung gyotongeul iyonghaeyo.", "Uso transporte público en vez de coche."], ["쓰레기를 줄여야 해요.", "Sseuregireul juryeoya haeyo.", "Tenemos que reducir la basura."], ["이 정책은 경제에 영향을 줍니다.", "I jeongchaegen gyeongjeyeongyeongeul jumida.", "Esta política influye en la economía."]],
      [["¿Qué significa 환경?", ["Medio ambiente", "Economía", "Sociedad"], 0, "환경 (hwan-gyeong) es medio ambiente."], ["재활용 es…", ["Contaminación", "Reciclaje", "Ahorro"], 1, "재활용 (jaehwayong) es reciclar."], ["〜아/어야 하다 expresa…", ["Deseo", "Obligación", "Pasado"], 1, "Es una forma de expresar deber o necesidad."]]
    ),
    lesson(
      "ko-d3", "토론과 견해 · Debate y opinión", "Argumenta y contraargumenta con precisión.", "論",
      [
        ["Expresar una opinión", "견해 (gyeon-hae) es «punto de vista» y 〜다고 생각하다 «creo que…». 〜(으)면 indica condición: «si…».", [["견해", "gyeon-hae", "punto de vista"], ["〜다고 생각하다", "~dago saeng-gak-hada", "creer que…"]]],
        ["Contrastar", "반면에 es «por otro lado» y 〜아/어서 también puede dar causa. 동의하다 es «estar de acuerdo» y 반대하다 «oponerse».", [["반면에", "banmyeone", "por otro lado"], ["동의하다", "dong-ui-hada", "estar de acuerdo"], ["반대하다", "ban-dae-hada", "oponerse"]]],
      ],
      [["견해", "gyeon-hae", "punto de vista"], ["토론", "to-ron", "debate"], ["논거", "non-geo", "argumento"], ["동의", "dong-ui", "acuerdo"], ["반대", "ban-dae", "oposición"], ["근거", "geun-geo", "fundamento"], ["결론", "gyeol-ron", "conclusión"], ["문제", "mun-je", "problema"], ["해결", "hae-gyeol", "solución"], ["예시", "ye-si", "ejemplo"]],
      [["제 견해로는 이 방법이 더 효율적입니다.", "Je gyeonhaeroneun i bangbeobi deo hyoyuljeogimnida.", "En mi opinión, este método es más eficiente."], ["반면에 비용이 많이 듭니다.", "Banmyeone biyongi mani deumnida.", "Por otro lado, cuesta mucho."], ["그 의견에 동의합니다.", "Geu uigyeone donguihamnida.", "Estoy de acuerdo con esa opinión."], ["근거를 들어 설명해 주세요.", "Geungeoreul deulo seolmyeonghae juseyo.", "Explíquelo con fundamentos, por favor."]],
      [["견해 significa…", ["Punto de vista", "Noticia", "Receta"], 0, "견해 (gyeon-hae) es opinión o punto de vista."], ["반면에 es…", ["Por ejemplo", "Por otro lado", "Por eso"], 1, "Se usa para contrastar ideas."], ["«Fundamento / base» es…", ["결론", "근거", "문제"], 1, "근거 (geun-geo) es la base de un argumento."]]
    ),

    /* --- Lecciones extra de HSK 1 (vocabulario oficial) --- */
    lesson(
      "zh-e1", "Familia y personas", "Presenta a tu familia y a tus amigos.", "家",
      [
        ["Ser y posesión", "El verbo 是 (shì) es «ser». Para indicar posesión se usa 的 (de) después del poseedor: 我的朋友 (wǒ de péngyou, «mi amigo»). Con pronombres, 的 suele omitirse: 我爸爸 (wǒ bàba).", [["是", "shì", "ser"], ["的", "de", "de (posesivo)"], ["朋友", "péng you", "amigo"]]],
        ["Presentar a alguien", "Para presentar a alguien se usa 这是… (zhè shì…, «esto es…») seguido del nombre o la relación: 这是我的朋友 («este es mi amigo»).", [["这是我的朋友。", "Zhè shì wǒ de péng you.", "Este es mi amigo."], ["他是老师。", "Tā shì lǎo shī.", "Él es profesor."]]],
      ],
      [["爸爸", "bà ba", "papá"], ["妈妈", "mā ma", "mamá"], ["儿子", "ér zi", "hijo"], ["女儿", "nǚ ér", "hija"], ["朋友", "péng you", "amigo"], ["人", "rén", "persona"], ["先生", "xiān sheng", "señor"], ["小姐", "xiǎo jie", "señorita"], ["老师", "lǎo shī", "profesor"], ["学生", "xué sheng", "estudiante"], ["同学", "tóng xué", "compañero de clase"], ["医生", "yī shēng", "médico"]],
      [["这是我的朋友。", "Zhè shì wǒ de péng you.", "Este es mi amigo."], ["他是我爸爸。", "Tā shì wǒ bà ba.", "Él es mi padre."], ["你妈妈好吗？", "Nǐ mā ma hǎo ma?", "¿Cómo está tu madre?"], ["我是学生。", "Wǒ shì xué sheng.", "Soy estudiante."]],
      [["¿Cómo se dice «madre»?", ["爸爸", "妈妈", "女儿"], 1, "妈妈 (mā ma) es mamá."], ["我的朋友 significa…", ["Mi amigo", "Mi hermano", "Mi casa"], 0, "的 indica posesión."], ["¿Cómo presentas a alguien?", ["这是我的朋友。", "我去商店。", "今天星期几？"], 0, "这是… es «esto es…»."]]
    ),
    lesson(
      "zh-e2", "Comida y bebida", "Pide comida y pregunta el precio.", "饭",
      [
        ["Querer algo", "要 (yào) es «querer» y 想 (xiǎng) «querer / desear». Para pedir, 我要… (wǒ yào…) es la forma más directa; 请 (qǐng) añade cortesía.", [["我要茶。", "Wǒ yào chá.", "Quiero té."], ["请给我苹果。", "Qǐng gěi wǒ píngguǒ.", "Deme una manzana, por favor."]]],
        ["Cantidad y precio", "多少 (duōshao) pregunta por una cantidad o un precio. La respuesta usa 块 (kuài) como clasificador de dinero.", [["多少钱？", "Duōshao qián?", "¿Cuánto cuesta?"], ["五块。", "Wǔ kuài.", "Cinco yuanes."]]],
      ],
      [["茶", "chá", "té"], ["菜", "cài", "plato / comida"], ["吃", "chī", "comer"], ["喝", "hē", "beber"], ["米饭", "mǐ fàn", "arroz cocido"], ["水果", "shuǐ guǒ", "fruta"], ["苹果", "píng guǒ", "manzana"], ["饭馆", "fàn guǎn", "restaurante"], ["杯子", "bēi zi", "taza / vaso"], ["钱", "qián", "dinero"], ["东西", "dōng xi", "cosas"], ["块", "kuài", "clasificador / yuan"]],
      [["我要一杯茶。", "Wǒ yào yī bēi chá.", "Quiero una taza de té."], ["你吃什么？", "Nǐ chī shénme?", "¿Qué comes?"], ["这个多少钱？", "Zhège duōshao qián?", "¿Cuánto cuesta esto?"], ["苹果是水果。", "Píngguǒ shì shuǐguǒ.", "La manzana es una fruta."]],
      [["¿Cómo se dice «comer»?", ["吃", "喝", "买"], 0, "吃 (chī) es comer."], ["多少钱？ pregunta…", ["La hora", "El precio", "El nombre"], 1, "Es la pregunta por el precio."], ["«Té» es…", ["茶", "菜", "米饭"], 0, "茶 (chá) es té."]]
    ),
    lesson(
      "zh-e3", "Números y tiempo", "Fechas, horas y edades del HSK 1.", "时",
      [
        ["Números del 1 al 10", "Los numerales son de un carácter. 零 (líng) es cero. Para edades se usa 岁 (suì) y para horas 点 (diǎn).", [["五", "wǔ", "cinco"], ["十岁", "shí suì", "diez años"], ["八点", "bā diǎn", "las ocho"]]],
        ["Preguntar por tiempo", "今天 (jīntiān) hoy, 明天 (míngtiān) mañana y 昨天 (zuótiān) ayer. 星期几 (xīngqī jǐ) pregunta el día de la semana.", [["今天星期几？", "Jīntiān xīngqī jǐ?", "¿Qué día es hoy?"], ["现在几点？", "Xiànzài jǐ diǎn?", "¿Qué hora es?"]]],
      ],
      [["一", "yī", "uno"], ["二", "èr", "dos"], ["三", "sān", "tres"], ["五", "wǔ", "cinco"], ["十", "shí", "diez"], ["零", "líng", "cero"], ["点", "diǎn", "hora"], ["分钟", "fēn zhōng", "minuto"], ["今天", "jīn tiān", "hoy"], ["明天", "míng tiān", "mañana"], ["昨天", "zuó tiān", "ayer"], ["现在", "xiàn zài", "ahora"], ["星期", "xīng qī", "semana"], ["年", "nián", "año"], ["岁", "suì", "años de edad"]],
      [["今天星期几？", "Jīntiān xīngqī jǐ?", "¿Qué día es hoy?"], ["现在几点？", "Xiànzài jǐ diǎn?", "¿Qué hora es ahora?"], ["明天见！", "Míngtiān jiàn!", "¡Hasta mañana!"], ["他今年二十岁。", "Tā jīnnián èrshí suì.", "Él tiene veinte años."]],
      [["¿Cómo se dice «ayer»?", ["今天", "昨天", "明天"], 1, "昨天 (zuótiān) es ayer."], ["¿Cómo preguntas la hora?", ["现在几点？", "多少钱？", "你是谁？"], 0, "点 (diǎn) indica la hora."], ["«Años de edad» es…", ["年", "岁", "月"], 1, "岁 (suì) se usa para la edad."]]
    ),
    lesson(
      "zh-e4", "Casa y objetos", "Di dónde están las cosas.", "里",
      [
        ["La preposición 在", "在 (zài) indica lugar: 在桌子上 («sobre la mesa»). El orden es persona + 在 + lugar.", [["在", "zài", "en / estar"], ["电脑在桌子上。", "Diànnǎo zài zhuōzi shàng.", "El ordenador está sobre la mesa."]]],
        ["Lugares relativos", "上 (shàng) arriba, 下 (xià) abajo y 里 (lǐ) dentro. Se colocan después del sustantivo: 家里 (en casa), 椅子下 (bajo la silla).", [["家里", "jiā lǐ", "en casa"], ["桌子上", "zhuō zi shàng", "sobre la mesa"]]],
      ],
      [["家", "jiā", "casa / familia"], ["椅子", "yǐ zi", "silla"], ["桌子", "zhuō zi", "mesa"], ["电脑", "diàn nǎo", "ordenador"], ["电视", "diàn shì", "televisión"], ["打电话", "dǎ diàn huà", "llamar por teléfono"], ["书", "shū", "libro"], ["衣服", "yī fu", "ropa"], ["杯子", "bēi zi", "taza"], ["里", "lǐ", "dentro"], ["上", "shàng", "arriba"], ["下", "xià", "abajo"]],
      [["电脑在桌子上。", "Diànnǎo zài zhuōzi shàng.", "El ordenador está sobre la mesa."], ["我在家里。", "Wǒ zài jiā lǐ.", "Estoy en casa."], ["请开门。", "Qǐng kāi mén.", "Abra la puerta, por favor."], ["这是我的书。", "Zhè shì wǒ de shū.", "Este es mi libro."]],
      [["¿Dónde está el ordenador?", ["En la mesa", "En el coche", "En la escuela"], 0, "桌子上 = sobre la mesa."], ["«Dentro de casa» es…", ["家里", "家上", "家下"], 0, "里 indica interior."], ["在 indica…", ["Lugar", "Tiempo", "Precio"], 0, "在 se usa para la ubicación."]]
    ),
    lesson(
      "zh-e5", "Estudio y trabajo", "Habla de lo que sabes hacer.", "学",
      [
        ["Saber y poder", "会 (huì) es «saber hacer algo» y 能 (néng) «poder». Se colocan antes del verbo: 我会说汉语 (wǒ huì shuō Hànyǔ).", [["会", "huì", "saber hacer"], ["能", "néng", "poder"], ["我会说汉语。", "Wǒ huì shuō Hànyǔ.", "Sé hablar chino."]]],
        ["Verbos de estudio", "学习 (xuéxí) aprender/estudiar, 工作 (gōngzuò) trabajar, 写 (xiě) escribir y 读 (dú) leer. También funcionan como sustantivos: 我的工作 (mi trabajo).", [["学习", "xué xí", "estudiar"], ["工作", "gōng zuò", "trabajar"]]],
      ],
      [["工作", "gōng zuò", "trabajar / trabajo"], ["学习", "xué xí", "estudiar"], ["学校", "xué xiào", "escuela"], ["老师", "lǎo shī", "profesor"], ["学生", "xué sheng", "estudiante"], ["同学", "tóng xué", "compañero"], ["汉语", "Hàn yǔ", "chino (idioma)"], ["字", "zì", "carácter"], ["写", "xiě", "escribir"], ["读", "dú", "leer"], ["听", "tīng", "escuchar"], ["说话", "shuō huà", "hablar"], ["认识", "rèn shi", "conocer"], ["会", "huì", "saber hacer"]],
      [["我会说汉语。", "Wǒ huì shuō Hànyǔ.", "Sé hablar chino."], ["你在哪儿工作？", "Nǐ zài nǎr gōngzuò?", "¿Dónde trabajas?"], ["我每天写字。", "Wǒ měitiān xiě zì.", "Escribo caracteres cada día."], ["认识你很高兴。", "Rènshi nǐ hěn gāoxìng.", "Mucho gusto en conocerte."]],
      [["会 indica…", ["Habilidad", "Deseo", "Negación"], 0, "会 es saber hacer algo."], ["¿Cómo se dice «leer»?", ["写", "读", "听"], 1, "读 (dú) es leer."], ["汉语 es…", ["Chino", "Japonés", "Coreano"], 0, "汉语 (Hànyǔ) es la lengua china."]]
    ),
    lesson(
      "zh-e6", "Transporte y lugares", "Muévete entre los lugares del HSK 1.", "去",
      [
        ["Ir y venir", "去 (qù) es «ir» y 来 (lái) «venir». 坐 (zuò) es «tomar un medio»: 坐飞机 (zuò fēijī, «ir en avión»).", [["去", "qù", "ir"], ["来", "lái", "venir"], ["坐飞机", "zuò fēi jī", "ir en avión"]]],
        ["Preguntar el lugar", "哪 (nǎ) es «cuál / dónde» y 哪里 (nǎlǐ) «dónde». La estructura 在 + lugar + 吗 sirve para preguntar si algo está allí.", [["你在哪儿？", "Nǐ zài nǎr?", "¿Dónde estás?"], ["火车站在哪里？", "Huǒchēzhàn zài nǎlǐ?", "¿Dónde está la estación?"]]],
      ],
      [["北京", "Běi jīng", "Pekín"], ["中国", "Zhōng guó", "China"], ["火车站", "huǒ chē zhàn", "estación de tren"], ["飞机", "fēi jī", "avión"], ["出租车", "chū zū chē", "taxi"], ["商店", "shāng diàn", "tienda"], ["医院", "yī yuàn", "hospital"], ["来", "lái", "venir"], ["去", "qù", "ir"], ["坐", "zuò", "tomar (transporte)"], ["哪", "nǎ", "cuál / dónde"], ["在", "zài", "en / estar"]],
      [["你去哪儿？", "Nǐ qù nǎr?", "¿Adónde vas?"], ["我坐飞机去北京。", "Wǒ zuò fēijī qù Běijīng.", "Voy a Pekín en avión."], ["火车站在哪里？", "Huǒchēzhàn zài nǎlǐ?", "¿Dónde está la estación de tren?"], ["请来我家。", "Qǐng lái wǒ jiā.", "Ven a mi casa, por favor."]],
      [["¿Cómo se dice «ir»?", ["来", "去", "坐"], 1, "去 (qù) es ir; 来 es venir."], ["«Avión» es…", ["火车站", "飞机", "出租车"], 1, "飞机 (fēijī) es avión."], ["哪 sirve para…", ["Preguntar por un lugar", "Dar las gracias", "Decir la hora"], 0, "哪 / 哪里 pregunta dónde o cuál."]]
    ),
    lesson(
      "zh-e7", "Gustos y descripción", "Describe cómo son las cosas.", "好",
      [
        ["Adjetivos sin 是", "En chino, los adjetivos funcionan como verbos: 天气冷 (tiānqì lěng, «hace frío»). 很 (hěn) es un adverbio de grado que casi siempre se añade para suavizar: 很好 (hěn hǎo).", [["很好", "hěn hǎo", "muy bien"], ["太…了", "tài… le", "demasiado…"]]],
        ["Gustos", "喜欢 (xǐhuan) significa «gustar» y va antes del verbo o sustantivo: 我喜欢看电影 (wǒ xǐhuan kàn diànyǐng).", [["喜欢", "xǐ huan", "gustar"], ["高兴", "gāo xìng", "contento"]]],
      ],
      [["喜欢", "xǐ huan", "gustar"], ["高兴", "gāo xìng", "contento"], ["漂亮", "piào liang", "bonito"], ["好", "hǎo", "bueno"], ["大", "dà", "grande"], ["小", "xiǎo", "pequeño"], ["多", "duō", "mucho"], ["少", "shǎo", "poco"], ["冷", "lěng", "frío"], ["热", "rè", "caliente"], ["睡觉", "shuì jiào", "dormir"], ["太", "tài", "demasiado"], ["很", "hěn", "muy"]],
      [["我很高兴。", "Wǒ hěn gāoxìng.", "Estoy muy contento."], ["今天天气很冷。", "Jīntiān tiānqì hěn lěng.", "Hoy hace mucho frío."], ["这件衣服太贵了。", "Zhè jiàn yīfu tài guì le.", "Esta ropa es demasiado cara."], ["我喜欢看电影。", "Wǒ xǐhuan kàn diànyǐng.", "Me gusta ver películas."]],
      [["¿Cómo se dice «frío»?", ["冷", "热", "大"], 0, "冷 (lěng) es frío."], ["很 se usa para…", ["Negar", "Intensificar", "Preguntar"], 1, "很 (hěn) es adverbio de grado."], ["«Me gusta» es…", ["喜欢", "高兴", "漂亮"], 0, "喜欢 (xǐhuan) es gustar."]]
    ),
    lesson(
      "zh-e8", "Preguntas y cortesía", "Las preguntas y las fórmulas sociales del HSK 1.", "问",
      [
        ["Partículas de pregunta", "吗 (ma) convierte una frase en pregunta: 你好吗？ 呢 (ne) significa «¿y…?»: 你呢？ Las palabras interrogativas (什么, 谁, 怎么, 哪) van donde estaría la respuesta.", [["吗", "ma", "partícula de pregunta"], ["呢", "ne", "¿y…?"], ["什么", "shén me", "qué"]]],
        ["Fórmulas de cortesía", "谢谢 (xièxie) gracias, 不客气 (bù kèqi) de nada, 对不起 (duìbuqǐ) perdón y 没关系 (méi guānxi) no importa. 再见 (zàijiàn) es adiós.", [["谢谢", "xiè xie", "gracias"], ["对不起", "duì bu qǐ", "perdón"], ["没关系", "méi guān xi", "no importa"]]],
      ],
      [["吗", "ma", "partícula de pregunta"], ["呢", "ne", "¿y…?"], ["什么", "shén me", "qué"], ["谁", "shéi", "quién"], ["怎么", "zěn me", "cómo"], ["怎么样", "zěn me yàng", "cómo / qué tal"], ["请", "qǐng", "por favor"], ["谢谢", "xiè xie", "gracias"], ["不客气", "bù kè qi", "de nada"], ["对不起", "duì bu qǐ", "perdón"], ["没关系", "méi guān xi", "no importa"], ["再见", "zài jiàn", "adiós"], ["喂", "wéi", "hola (teléfono)"]],
      [["你好吗？", "Nǐ hǎo ma?", "¿Cómo estás?"], ["他是谁？", "Tā shì shéi?", "¿Quién es él?"], ["这个怎么样？", "Zhège zěnmeyàng?", "¿Qué tal esto?"], ["对不起！——没关系。", "Duìbuqǐ! — Méi guānxi.", "¡Perdón! — No importa."]],
      [["¿Cómo se forma una pregunta con 吗?", ["Al final de la frase", "Al principio", "Después del verbo"], 0, "吗 va al final: 你好吗？"], ["«De nada» es…", ["谢谢", "不客气", "再见"], 1, "不客气 es la respuesta a 谢谢."], ["谁 pregunta por…", ["Una persona", "Una cosa", "Un lugar"], 0, "谁 (shéi) es «quién»."]]
    ),

    /* --- Lecciones extra de HSK 2 (vocabulario oficial) --- */
    lesson(
      "zh-f1", "Familia y cuerpo", "Los miembros de la familia y el cuerpo.", "家",
      [
        ["Familia extensa", "En HSK 2 aparecen los hermanos: 哥哥 (gēge) hermano mayor, 弟弟 (dìdi) menor, 姐姐 (jiějie) hermana mayor y 妹妹 (mèimei) menor. 孩子 (háizi) es «niño».", [["哥哥", "gē ge", "hermano mayor"], ["弟弟", "dì di", "hermano menor"], ["孩子", "hái zi", "niño"]]],
        ["Cuerpo y salud", "身体 (shēntǐ) es el cuerpo y 眼睛 (yǎnjing) los ojos. Los adjetivos 高 (gāo, alto) y 累 (lèi, cansado) funcionan como verbos: 我很累 («estoy cansado»).", [["身体", "shēn tǐ", "cuerpo"], ["眼睛", "yǎn jing", "ojos"], ["累", "lèi", "cansado"]]],
      ],
      [["弟弟", "dì di", "hermano menor"], ["哥哥", "gē ge", "hermano mayor"], ["姐姐", "jiě jie", "hermana mayor"], ["妹妹", "mèi mei", "hermana menor"], ["孩子", "hái zi", "niño"], ["男人", "nán rén", "hombre"], ["女人", "nǚ rén", "mujer"], ["丈夫", "zhàng fu", "marido"], ["妻子", "qī zi", "esposa"], ["身体", "shēn tǐ", "cuerpo"], ["眼睛", "yǎn jing", "ojos"], ["高", "gāo", "alto"]],
      [["我有一个弟弟和一个妹妹。", "Wǒ yǒu yī gè dìdi hé yī gè mèimei.", "Tengo un hermano menor y una hermana menor."], ["她是我妻子。", "Tā shì wǒ qīzi.", "Ella es mi esposa."], ["我的身体很好。", "Wǒ de shēntǐ hěn hǎo.", "Mi salud es buena."], ["今天我很累。", "Jīntiān wǒ hěn lèi.", "Hoy estoy muy cansado."]],
      [["«Hermana mayor» es…", ["姐姐", "妹妹", "哥哥"], 0, "姐姐 (jiějie) es la hermana mayor."], ["眼睛 significa…", ["Ojos", "Cuerpo", "Niño"], 0, "眼睛 (yǎnjing) son los ojos."], ["丈夫 es…", ["Esposa", "Marido", "Hijo"], 1, "丈夫 (zhàngfu) es el marido."]]
    ),
    lesson(
      "zh-f2", "En el restaurante", "Pedir comida y entender un menú.", "馆",
      [
        ["Comida y bebida", "鸡蛋 (jīdàn) huevo, 牛奶 (niúnǎi) leche, 咖啡 (kāfēi) café y 羊肉 (yángròu) cordero. 好吃 (hǎochī) es «delicioso» y se usa como adjetivo: 这个很好吃。", [["鸡蛋", "jī dàn", "huevo"], ["牛奶", "niú nǎi", "leche"], ["好吃", "hǎo chī", "delicioso"]]],
        ["Barato y caro", "便宜 (piányi) es barato y 贵 (guì) caro. 服务员 (fúwùyuán) es el camarero y 饭馆 (fànguǎn) el restaurante.", [["便宜", "pián yi", "barato"], ["贵", "guì", "caro"], ["服务员", "fú wù yuán", "camarero"]]],
      ],
      [["饭馆", "fàn guǎn", "restaurante"], ["服务员", "fú wù yuán", "camarero"], ["便宜", "pián yi", "barato"], ["贵", "guì", "caro"], ["好吃", "hǎo chī", "delicioso"], ["鸡蛋", "jī dàn", "huevo"], ["牛奶", "niú nǎi", "leche"], ["咖啡", "kā fēi", "café"], ["西瓜", "xī guā", "sandía"], ["羊肉", "yáng ròu", "cordero"], ["鱼", "yú", "pescado"], ["菜", "cài", "plato"]],
      [["服务员，我要一杯咖啡。", "Fúwùyuán, wǒ yào yī bēi kāfēi.", "Camarero, quiero un café."], ["这个菜很好吃。", "Zhège cài hěn hǎochī.", "Este plato está muy bueno."], ["太贵了，能便宜一点吗？", "Tài guì le, néng piányi yīdiǎn ma?", "Es muy caro, ¿puede abaratarlo?"], ["我吃鸡蛋，喝牛奶。", "Wǒ chī jīdàn, hē niúnǎi.", "Como huevos y bebo leche."]],
      [["¿Cómo se dice «camarero»?", ["服务员", "饭馆", "鸡蛋"], 0, "服务员 (fúwùyuán) es camarero."], ["便宜 significa…", ["Caro", "Barato", "Delicioso"], 1, "便宜 (piányi) es barato."], ["«Delicioso» es…", ["好吃", "贵", "便宜"], 0, "好吃 (hǎochī) es delicioso."]]
    ),
    lesson(
      "zh-f3", "Transporte y viajes", "Todos los medios de transporte del HSK 2.", "车",
      [
        ["Medios de transporte", "公共汽车 (gōnggòng qìchē) autobús, 出租车 (chūzūchē) taxi, 自行车 (zìxíngchē) bicicleta, 火车 (huǒchē) tren y 飞机 (fēijī) avión. El verbo 坐 (zuò) es «tomar».", [["公共汽车", "gōng gòng qì chē", "autobús"], ["出租车", "chū zū chē", "taxi"], ["自行车", "zì xíng chē", "bicicleta"]]],
        ["Distancias", "离 (lí) indica distancia desde un punto: 离这里很远 («está muy lejos de aquí»). 近 (jìn) es cerca y 远 (yuǎn) lejos.", [["离这里远吗？", "Lí zhèlǐ yuǎn ma?", "¿Está lejos de aquí?"], ["很近", "hěn jìn", "muy cerca"]]],
      ],
      [["公共汽车", "gōng gòng qì chē", "autobús"], ["机场", "jī chǎng", "aeropuerto"], ["飞机", "fēi jī", "avión"], ["火车站", "huǒ chē zhàn", "estación de tren"], ["出租车", "chū zū chē", "taxi"], ["自行车", "zì xíng chē", "bicicleta"], ["船", "chuán", "barco"], ["路", "lù", "camino"], ["离", "lí", "estar a distancia de"], ["远", "yuǎn", "lejos"], ["近", "jìn", "cerca"], ["旅游", "lǚ yóu", "viajar"]],
      [["我坐公共汽车上班。", "Wǒ zuò gōnggòng qìchē shàngbān.", "Voy al trabajo en autobús."], ["机场离这里远吗？", "Jīchǎng lí zhèlǐ yuǎn ma?", "¿Está lejos el aeropuerto?"], ["火车站很近。", "Huǒchēzhàn hěn jìn.", "La estación está muy cerca."], ["我喜欢骑自行车旅游。", "Wǒ xǐhuan qí zìxíngchē lǚyóu.", "Me gusta viajar en bicicleta."]],
      [["¿Cómo se dice «autobús»?", ["出租车", "公共汽车", "飞机"], 1, "公共汽车 (gōnggòng qìchē) es autobús."], ["离…远吗？ pregunta…", ["La distancia", "El precio", "La hora"], 0, "Es la pregunta por la distancia."], ["«Bicicleta» es…", ["火车", "自行车", "船"], 1, "自行车 (zìxíngchē) es bicicleta."]]
    ),
    lesson(
      "zh-f4", "Trabajo y estudios", "La rutina laboral y escolar.", "班",
      [
        ["Ir al trabajo", "上班 (shàngbān) es «ir al trabajo» y 公司 (gōngsī) la empresa. 忙 (máng) es «ocupado» y 休息 (xiūxi) «descansar».", [["上班", "shàng bān", "ir al trabajo"], ["公司", "gōng sī", "empresa"], ["忙", "máng", "ocupado"]]],
        ["Estudiar y examinarse", "课 (kè) es clase/asignatura, 考试 (kǎoshì) examen y 准备 (zhǔnbèi) preparación. 开始 (kāishǐ) es empezar.", [["课", "kè", "clase"], ["考试", "kǎo shì", "examen"], ["准备", "zhǔn bèi", "preparar"]]],
      ],
      [["公司", "gōng sī", "empresa"], ["上班", "shàng bān", "ir al trabajo"], ["工作", "gōng zuò", "trabajar"], ["教室", "jiào shì", "aula"], ["课", "kè", "clase"], ["考试", "kǎo shì", "examen"], ["准备", "zhǔn bèi", "preparar"], ["开始", "kāi shǐ", "empezar"], ["忙", "máng", "ocupado"], ["休息", "xiū xi", "descansar"], ["希望", "xī wàng", "esperar"], ["介绍", "jiè shào", "presentar"]],
      [["我在公司上班。", "Wǒ zài gōngsī shàngbān.", "Trabajo en una empresa."], ["今天我很忙。", "Jīntiān wǒ hěn máng.", "Hoy estoy muy ocupado."], ["考试从九点开始。", "Kǎoshì cóng jiǔ diǎn kāishǐ.", "El examen empieza a las nueve."], ["我准备休息一下。", "Wǒ zhǔnbèi xiūxi yīxià.", "Me dispongo a descansar un momento."]],
      [["¿Cómo se dice «empresa»?", ["教室", "公司", "课"], 1, "公司 (gōngsī) es empresa."], ["忙 significa…", ["Ocupado", "Libre", "Feliz"], 0, "忙 (máng) es ocupado."], ["«Examen» es…", ["课", "考试", "准备"], 1, "考试 (kǎoshì) es examen."]]
    ),
    lesson(
      "zh-f5", "Tiempo y clima", "Hora, fechas y tiempo atmosférico.", "晴",
      [
        ["Unidades de tiempo", "小时 (xiǎoshí) es hora de duración, 时间 (shíjiān) es tiempo en general y 去年 (qùnián) el año pasado. 早上 (zǎoshang) mañana temprano, 中午 (zhōngwǔ) mediodía y 晚上 (wǎnshang) noche.", [["小时", "xiǎo shí", "hora"], ["时间", "shí jiān", "tiempo"], ["去年", "qù nián", "el año pasado"]]],
        ["El clima", "晴 (qíng) despejado, 阴 (yīn) nublado, 雪 (xuě) nieve y 下雨 (xiàyǔ) llover. 天气 (tiānqì) es el tiempo atmosférico.", [["晴", "qíng", "despejado"], ["阴", "yīn", "nublado"], ["下雨", "xià yǔ", "llover"]]],
      ],
      [["去年", "qù nián", "el año pasado"], ["早上", "zǎo shang", "mañana temprano"], ["晚上", "wǎn shang", "noche"], ["中午", "zhōng wǔ", "mediodía"], ["小时", "xiǎo shí", "hora"], ["时间", "shí jiān", "tiempo"], ["天气", "tiān qì", "tiempo atmosférico"], ["晴", "qíng", "despejado"], ["阴", "yīn", "nublado"], ["雪", "xuě", "nieve"], ["下雨", "xià yǔ", "llover"], ["冷", "lěng", "frío"]],
      [["今天天气很好，很晴。", "Jīntiān tiānqì hěn hǎo, hěn qíng.", "Hoy hace buen tiempo, está despejado."], ["昨天晚上下雪了。", "Zuótiān wǎnshang xiàxuě le.", "Anoche nevó."], ["我每天工作八小时。", "Wǒ měitiān gōngzuò bā xiǎoshí.", "Trabajo ocho horas al día."], ["去年冬天很冷。", "Qùnián dōngtiān hěn lěng.", "El invierno pasado fue muy frío."]],
      [["«Despejado» es…", ["阴", "晴", "雪"], 1, "晴 (qíng) es despejado."], ["小时 es…", ["Hora", "Día", "Mes"], 0, "小时 (xiǎoshí) es hora de duración."], ["«Anoche» es…", ["今天早上", "昨天晚上", "明天中午"], 1, "昨天晚上 = anoche."]]
    ),
    lesson(
      "zh-f6", "Deportes y ocio", "Actividades deportivas y diversión.", "运",
      [
        ["Deportes", "打篮球 (dǎ lánqiú) jugar al baloncesto, 跑步 (pǎobù) correr, 游泳 (yóuyǒng) nadar y 跳舞 (tiàowǔ) bailar. El verbo general es 运动 (yùndòng) «hacer ejercicio».", [["打篮球", "dǎ lán qiú", "jugar al baloncesto"], ["跑步", "pǎo bù", "correr"], ["游泳", "yóu yǒng", "nadar"]]],
        ["Cantar y jugar", "唱歌 (chànggē) es cantar y 玩 (wán) jugar. 快乐 (kuàilè) es «feliz» y 快 (kuài) «rápido».", [["唱歌", "chàng gē", "cantar"], ["玩", "wán", "jugar"], ["快乐", "kuài lè", "feliz"]]],
      ],
      [["唱歌", "chàng gē", "cantar"], ["跳舞", "tiào wǔ", "bailar"], ["打篮球", "dǎ lán qiú", "jugar al baloncesto"], ["跑步", "pǎo bù", "correr"], ["游泳", "yóu yǒng", "nadar"], ["踢", "tī", "patear"], ["运动", "yùn dòng", "hacer ejercicio"], ["玩", "wán", "jugar"], ["休息", "xiū xi", "descansar"], ["一起", "yī qǐ", "juntos"], ["快乐", "kuài lè", "feliz"], ["快", "kuài", "rápido"]],
      [["我喜欢打篮球。", "Wǒ xǐhuan dǎ lánqiú.", "Me gusta jugar al baloncesto."], ["我们一起跳舞吧！", "Wǒmen yīqǐ tiàowǔ ba!", "¡Bailamos juntos!"], ["他每天跑步。", "Tā měitiān pǎobù.", "Él corre cada día."], ["祝生日快乐！", "Zhù shēngrì kuàilè!", "¡Feliz cumpleaños!"]],
      [["¿Cómo se dice «nadar»?", ["跑步", "游泳", "跳舞"], 1, "游泳 (yóuyǒng) es nadar."], ["唱歌 es…", ["Bailar", "Cantar", "Correr"], 1, "唱歌 (chànggē) es cantar."], ["一起 significa…", ["Juntos", "Rápido", "Después"], 0, "一起 (yīqǐ) es juntos."]]
    ),
    lesson(
      "zh-f7", "Comunicarse y opinar", "Verbos de decir, preguntar y entender.", "说",
      [
        ["Verbos de comunicación", "告诉 (gàosu) es «decir a alguien», 回答 (huídá) «responder», 问 (wèn) «preguntar» y 介绍 (jièshào) «presentar».", [["告诉", "gào su", "decir a alguien"], ["回答", "huí dá", "responder"], ["问", "wèn", "preguntar"]]],
        ["Entender y opinar", "懂 (dǒng) es entender, 知道 (zhīdào) saber un dato y 觉得 (juéde) «me parece». 意思 (yìsi) es «significado».", [["懂", "dǒng", "entender"], ["知道", "zhī dào", "saber"], ["觉得", "jué de", "parecer"]]],
      ],
      [["告诉", "gào su", "decir a alguien"], ["回答", "huí dá", "responder"], ["问", "wèn", "preguntar"], ["问题", "wèn tí", "pregunta / problema"], ["介绍", "jiè shào", "presentar"], ["认识", "rèn shi", "conocer"], ["知道", "zhī dào", "saber"], ["懂", "dǒng", "entender"], ["觉得", "jué de", "parecer"], ["意思", "yì si", "significado"], ["因为", "yīn wèi", "porque"], ["所以", "suǒ yǐ", "por eso"]],
      [["请告诉我你的名字。", "Qǐng gàosu wǒ nǐ de míngzi.", "Dime tu nombre, por favor."], ["我听懂了。", "Wǒ tīng dǒng le.", "Lo entendí."], ["我觉得这个意思很好。", "Wǒ juéde zhège yìsi hěn hǎo.", "Me parece que esta idea es buena."], ["因为他忙，所以没有来。", "Yīnwèi tā máng, suǒyǐ méiyǒu lái.", "Como estaba ocupado, no vino."]],
      [["¿Cómo se dice «responder»?", ["问", "回答", "告诉"], 1, "回答 (huídá) es responder."], ["懂 significa…", ["Saber un dato", "Entender", "Decir"], 1, "懂 (dǒng) es entender."], ["因为…所以… es…", ["Aunque… pero…", "Porque… por eso…", "Primero… luego…"], 1, "Es la estructura de causa-consecuencia."]]
    ),
    lesson(
      "zh-f8", "Conectores y matices", "Las palabras que unen ideas en HSK 2.", "但",
      [
        ["Causa y contraste", "因为…所以… (yīnwèi… suǒyǐ…) es «porque… por eso…». 但是 (dànshì) es «pero». Estas estructura son esenciales en HSK 2.", [["因为", "yīn wèi", "porque"], ["所以", "suǒ yǐ", "por eso"], ["但是", "dàn shì", "pero"]]],
        ["Aditivos y aspecto", "也 (yě) es «también», 还 (hái) «todavía / además», 再 (zài) «otra vez», 已经 (yǐjīng) «ya» y 正在 (zhèngzài) «estar haciendo».", [["也", "yě", "también"], ["已经", "yǐ jīng", "ya"], ["正在", "zhèng zài", "estar haciendo"]]],
      ],
      [["但是", "dàn shì", "pero"], ["因为", "yīn wèi", "porque"], ["所以", "suǒ yǐ", "por eso"], ["还", "hái", "todavía / además"], ["也", "yě", "también"], ["再", "zài", "otra vez"], ["已经", "yǐ jīng", "ya"], ["正在", "zhèng zài", "estar haciendo"], ["就", "jiù", "entonces"], ["得", "de", "partícula de complemento"], ["让", "ràng", "permitir / dejar"], ["从", "cóng", "desde"]],
      [["我喜欢茶，但是他不喝。", "Wǒ xǐhuan chá, dànshì tā bù hē.", "A mí me gusta el té, pero él no lo bebe."], ["因为下雨，所以我在家。", "Yīnwèi xiàyǔ, suǒyǐ wǒ zài jiā.", "Como llueve, estoy en casa."], ["我已经吃完了。", "Wǒ yǐjīng chī wán le.", "Ya terminé de comer."], ["他正在打电话。", "Tā zhèngzài dǎ diànhuà.", "Está llamando por teléfono."]],
      [["«Pero» es…", ["因为", "但是", "所以"], 1, "但是 (dànshì) es pero."], ["已经 indica…", ["Pasado reciente", "Futuro", "Negación"], 0, "已经 es «ya»."], ["正在 significa…", ["Estar haciendo", "Otra vez", "También"], 0, "正在 marca una acción en curso."]]
    ),
  ];

  const allLessons = [];
  languages.forEach((lang) => {
    lang.levels.forEach((level) => {
      level.lessons.forEach((les) => {
        les.langId = lang.id;
        les.levelKey = level.key;
        allLessons.push(les);
      });
    });
  });
  extraLessons.forEach((les) => {
    les.langId = les.id.split("-")[0];
    les.levelKey = null;
    allLessons.push(les);
  });

  const findLesson = (id) => allLessons.find((l) => l.id === id) || null;
  const findLanguage = (id) => languages.find((l) => l.id === id) || null;

  /* Framework oficial de exámenes: [clave, nombre, icono, descripción, "puedo…", palabras objetivo, lecciones] */
  const EXAMS = {
    zh: { name: "HSK", full: "Hanyu Shuiping Kaoshi", desc: "Examen oficial de chino mandarín" },
    ja: { name: "JLPT", full: "Japanese Language Proficiency Test", desc: "Examen oficial de japonés" },
    ko: { name: "TOPIK", full: "Test of Proficiency in Korean", desc: "Examen oficial de coreano" },
  };

  const EXAM_LEVELS = {
    zh: [
      ["hsk1", "HSK 1", "🌱", "Saludos, números, familia, comida, casa y preguntas básicas.", "Puedo presentarme y mantener conversaciones muy sencillas.", 150, ["zh-a1", "zh-a2", "zh-e1", "zh-e2", "zh-e3", "zh-e4", "zh-e5", "zh-e6", "zh-e7", "zh-e8"]],
      ["hsk2", "HSK 2", "🌿", "Familia, restaurante, transporte, trabajo, clima y conectores.", "Puedo describir mi día a día, pedir comida y explicar causas y contrastes.", 297, ["zh-a3", "zh-b1", "zh-f1", "zh-f2", "zh-f3", "zh-f4", "zh-f5", "zh-f6", "zh-f7", "zh-f8"]],
      ["hsk3", "HSK 3", "🍃", "Direcciones, transporte y situaciones prácticas.", "Puedo desenvolverme en viajes, compras y conversaciones habituales.", 2245, ["zh-b2", "zh-b3"]],
      ["hsk4", "HSK 4", "🌳", "Aficiones, viajes y temas personales.", "Puedo hablar de mis intereses y organizar un viaje.", 3245, ["zh-d1", "zh-d2"]],
      ["hsk5", "HSK 5", "🏯", "Expresiones idiomáticas, negocios y opinión.", "Puedo expresar ideas abstractas y participar en una negociación.", 4306, ["zh-c1", "zh-c2"]],
      ["hsk6", "HSK 6", "🏮", "Cultura, literatura y debate avanzado.", "Puedo comprender textos cultos y argumentar con precisión.", 5000, ["zh-c3", "zh-d3"]],
    ],
    ja: [
      ["n5", "JLPT N5", "🌱", "Saludos, números y kanji más básicos.", "Puedo comprender frases sencillas y usar expresiones cotidianas.", 800, ["ja-a1", "ja-a2"]],
      ["n4", "JLPT N4", "🌿", "Comida, rutina y direcciones.", "Puedo leer textos breves y mantener conversaciones simples.", 1500, ["ja-a3", "ja-b1"]],
      ["n3", "JLPT N3", "🍃", "Compras, giros y situaciones de la vida diaria.", "Puedo entender textos de longitud media y conversaciones naturales.", 3000, ["ja-b2", "ja-b3"]],
      ["n2", "JLPT N2", "🌳", "Keigo, refranes y japonés de negocios.", "Puedo comprender textos concretos y comunicarme con cortesía formal.", 6000, ["ja-c1", "ja-c2"]],
      ["n1", "JLPT N1", "🏯", "Literatura, crítica y textos complejos.", "Puedo leer textos abstractos y expresar matices avanzados.", 10000, ["ja-c3", "ja-d1"]],
    ],
    ko: [
      ["topik1", "TOPIK 1", "🌱", "Saludos, números y comida.", "Puedo entender y usar expresiones básicas para necesidades simples.", 800, ["ko-a1", "ko-a2"]],
      ["topik2", "TOPIK 2", "🌿", "Rutina, direcciones y compras.", "Puedo desenvolverme en situaciones cotidianas y describir mi entorno.", 1500, ["ko-a3", "ko-b1"]],
      ["topik3", "TOPIK 3", "🍃", "Honoríficos, refranes y situaciones sociales.", "Puedo comunicarme con registros formales y entender refranes comunes.", 3000, ["ko-b2", "ko-b3"]],
      ["topik4", "TOPIK 4", "🌳", "Respeto avanzado y viajes.", "Puedo expresar deferencia y gestionar situaciones de viaje.", 4500, ["ko-c1", "ko-d1"]],
      ["topik5", "TOPIK 5", "🏯", "Sociedad, medio ambiente y debate.", "Puedo comprender textos informativos y argumentar con fundamento.", 6000, ["ko-c2", "ko-d2"]],
      ["topik6", "TOPIK 6", "🏮", "Negocios, política y opinión especializada.", "Puedo leer textos complejos y participar en debates especializados.", 8000, ["ko-c3", "ko-d3"]],
    ],
  };

  languages.forEach((lang) => {
    lang.exam = EXAMS[lang.id];
    lang.levels = EXAM_LEVELS[lang.id].map(([key, name, icon, desc, canDo, vocabTarget, ids]) => ({
      key,
      name,
      icon,
      desc,
      canDo,
      vocabTarget,
      lessons: ids.map((id) => {
        const found = findLesson(id);
        if (found) found.levelKey = key;
        return found;
      }).filter(Boolean),
    }));
  });

  const ordered = [];
  languages.forEach((lang) => lang.levels.forEach((level) => level.lessons.forEach((l) => ordered.push(l))));
  allLessons.length = 0;
  allLessons.push(...ordered);

  return { languages, allLessons, findLesson, findLanguage, exams: EXAMS };
})();
