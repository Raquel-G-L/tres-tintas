/* =========================================================
   Generación de recursos descargables: TXT, CSV y PDF
   El PDF se genera en el navegador con html2canvas + jsPDF.
   Si las librerías no están disponibles (sin internet), se
   ofrece automáticamente el TXT como alternativa.
   ========================================================= */
window.PolyResources = (function () {
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);

  const safeName = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function toast(msg, type) {
    if (window.PolyApp && PolyApp.toast) PolyApp.toast(msg, type);
  }

  /* ---------- TXT ---------- */
  function buildTxt(lessons, title, subtitle, lang) {
    const lines = [];
    lines.push("============================================");
    lines.push("TRES TINTAS · " + title.toUpperCase());
    lines.push(subtitle);
    lines.push("============================================");
    lines.push("");
    lessons.forEach((lesson, i) => {
      lines.push(`LECCIÓN ${i + 1}: ${lesson.title}`);
      lines.push("-".repeat(48));
      lines.push(lesson.desc);
      lines.push("");
      lesson.theory.forEach((block) => {
        lines.push("[ " + block.title + " ]");
        lines.push(block.text);
        block.examples.forEach((ex) => lines.push(`  • ${ex.t}  (${ex.r}) — ${ex.m}`));
        lines.push("");
      });
      lines.push("VOCABULARIO");
      lesson.vocab.forEach((w) => lines.push(`  ${w.t}\t${w.r}\t${w.m}`));
      lines.push("");
      lines.push("FRASES ÚTILES");
      lesson.phrases.forEach((p, n) => {
        lines.push(`  ${n + 1}. ${p.t}`);
        lines.push(`     ${p.r} — ${p.m}`);
      });
      lines.push("");
      lines.push("CUESTIONARIO");
      lesson.quiz.forEach((q, n) => {
        lines.push(`  ${n + 1}. ${q.question}`);
        q.options.forEach((o, oi) => lines.push(`     ${String.fromCharCode(65 + oi)}) ${o}`));
        lines.push(`     Respuesta: ${String.fromCharCode(65 + q.answer)} — ${q.explain}`);
      });
      lines.push("");
      lines.push("============================================");
      lines.push("");
    });
    lines.push("Tres Tintas — aprende chino, japonés y coreano.");
    lines.push("Recurso generado localmente en tu navegador.");
    return lines.join("\r\n");
  }

  function downloadTxt(lessons, title, subtitle, lang, filename) {
    const text = buildTxt(lessons, title, subtitle, lang);
    triggerDownload(new Blob(["\ufeff" + text], { type: "text/plain;charset=utf-8" }), filename || safeName(title) + ".txt");
    toast("Descarga TXT iniciada.", "success");
  }

  function downloadLessonTxt(lesson, lang) {
    downloadTxt([lesson], lesson.title, `${lang.name} · ${lesson.id.toUpperCase()}`, lang, `${lesson.id}-vocabulario.txt`);
  }

  function downloadGuideTxt(lang, level) {
    downloadTxt(level.lessons, `${lang.name} · ${level.name}`, `${lang.native} · guía completa del nivel`, lang, `${lang.id}-${level.key}-guia.txt`);
  }

  function downloadVocabCsv(lang) {
    const rows = [["idioma", "nivel", "leccion", "termino", "lectura", "significado"]];
    lang.levels.forEach((level) => level.lessons.forEach((lesson) => {
      lesson.vocab.forEach((w) => rows.push([lang.name, level.name, lesson.title, w.t, w.r, w.m]));
    }));
    const csv = "\ufeff" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${lang.id}-vocabulario.csv`);
    toast("CSV de vocabulario descargado.", "success");
  }

  /* ---------- Lista oficial HSK 1 ---------- */
  function downloadHskTxt(level) {
    level = level || "hsk1";
    const w = window.PolyExam.words(level);
    const lines = [
      "============================================",
      `TRES TINTAS · VOCABULARIO ${level.toUpperCase()} (2.0) · ${w.length} PALABRAS`,
      "Fuente: github.com/drkameleon/complete-hsk-vocabulary (MIT)",
      "============================================",
      "",
    ];
    w.forEach((x) => lines.push(`${String(x.id).padStart(3, "0")}. ${x.char}\t${x.pinyin}\t${x.es}`));
    lines.push("", "Glosas en español. Pinyin con tonos diacríticos.");
    triggerDownload(new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/plain;charset=utf-8" }), `${level}-vocabulario.txt`);
    toast("Lista HSK 1 descargada (TXT).", "success");
  }

  function downloadHskCsv(level) {
    level = level || "hsk1";
    const rows = [["id", "caracter", "pinyin", "espanol", "ingles", "radical", "frecuencia"]];
    window.PolyExam.words(level).forEach((w) => rows.push([w.id, w.char, w.pinyin, w.es, w.en, w.radical, w.freq]));
    const csv = "\ufeff" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${level}-vocabulario.csv`);
    toast("Lista HSK 1 descargada (CSV).", "success");
  }

  function downloadHskAnki(level) {
    level = level || "hsk1";
    const lines = window.PolyExam.words(level).map((w) => [w.char, w.pinyin, w.es].join("\t"));
    triggerDownload(new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/tab-separated-values;charset=utf-8" }), `${level}-anki.tsv`);
    toast("Mazo de Anki descargado (TSV).", "success");
  }

  /* ---------- PDF ---------- */
  function printNode(lessons, title, subtitle, lang) {
    const node = document.createElement("div");
    node.style.cssText = "position:fixed;left:-10000px;top:0;width:794px;background:#ffffff;color:#1b2033;" +
      "font-family:'Segoe UI','Microsoft YaHei','Yu Gothic','Malgun Gothic',sans-serif;padding:52px 58px;box-sizing:border-box;";

    const color = lang.color;
    let html = `<div style="border-bottom:4px solid ${color};padding-bottom:18px;margin-bottom:26px;">
      <div style="font-size:12px;letter-spacing:2px;color:${color};font-weight:800;text-transform:uppercase;">TRES TINTAS · ${esc(lang.native)}</div>
      <div style="font-size:30px;font-weight:800;margin-top:7px;">${esc(title)}</div>
      <div style="font-size:14px;color:#6b7288;margin-top:5px;">${esc(subtitle)}</div>
    </div>`;

    lessons.forEach((lesson, i) => {
      html += `<div style="margin-bottom:34px;page-break-inside:avoid;">
        <div style="font-size:11px;letter-spacing:1px;color:${color};font-weight:800;text-transform:uppercase;">Lección ${i + 1}</div>
        <div style="font-size:21px;font-weight:800;margin:4px 0 4px;">${esc(lesson.title)}</div>
        <div style="font-size:13px;color:#6b7288;margin-bottom:16px;">${esc(lesson.desc)}</div>`;

      lesson.theory.forEach((block) => {
        html += `<div style="margin-bottom:14px;">
          <div style="font-size:15px;font-weight:800;border-left:4px solid ${color};padding-left:10px;margin-bottom:6px;">${esc(block.title)}</div>
          <div style="font-size:12px;color:#4b5166;line-height:1.6;">${esc(block.text)}</div>`;
        block.examples.forEach((ex) => {
          html += `<div style="background:#f3f5fa;border-radius:8px;padding:8px 11px;margin-top:6px;font-size:12px;">
            <b style="font-size:14px;">${esc(ex.t)}</b> &nbsp;<span style="color:${color};font-weight:600;">${esc(ex.r)}</span> &nbsp;—&nbsp; ${esc(ex.m)}</div>`;
        });
        html += `</div>`;
      });

      html += `<div style="font-size:15px;font-weight:800;margin:18px 0 8px;">Vocabulario</div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead><tr style="background:#eef0f7;">
          <th style="text-align:left;padding:8px 10px;">Término</th>
          <th style="text-align:left;padding:8px 10px;">Lectura</th>
          <th style="text-align:left;padding:8px 10px;">Significado</th></tr></thead><tbody>`;
      lesson.vocab.forEach((w) => {
        html += `<tr style="border-bottom:1px solid #e6e8f0;"><td style="padding:7px 10px;font-size:15px;font-weight:700;">${esc(w.t)}</td>
          <td style="padding:7px 10px;color:${color};font-weight:600;">${esc(w.r)}</td>
          <td style="padding:7px 10px;color:#5b6278;">${esc(w.m)}</td></tr>`;
      });
      html += `</tbody></table>`;

      html += `<div style="font-size:15px;font-weight:800;margin:18px 0 8px;">Frases útiles</div>`;
      lesson.phrases.forEach((p) => {
        html += `<div style="padding:7px 0;border-bottom:1px solid #eef0f6;">
          <div style="font-size:14px;font-weight:700;">${esc(p.t)}</div>
          <div style="font-size:11px;color:${color};">${esc(p.r)}</div>
          <div style="font-size:12px;color:#5b6278;">${esc(p.m)}</div></div>`;
      });
      html += `</div>`;
    });

    html += `<div style="margin-top:20px;border-top:1px solid #e3e6f0;padding-top:12px;font-size:10px;color:#8a91a6;">
      Generado con Tres Tintas · Recurso para uso personal y educativo.</div>`;

    node.innerHTML = html;
    return node;
  }

  async function downloadPdf(lessons, title, subtitle, lang, filename) {
    if (!window.html2canvas || !window.jspdf) {
      toast("El PDF necesita conexión a internet. Se descargará el TXT en su lugar.", "error");
      downloadTxt(lessons, title, subtitle, lang, (filename || safeName(title)) + ".txt");
      return;
    }
    toast("Generando PDF…");
    const node = printNode(lessons, title, subtitle, lang);
    document.body.appendChild(node);
    try {
      const canvas = await window.html2canvas(node, { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false });
      node.remove();
      const img = canvas.toDataURL("image/png");
      const pdf = new window.jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = 210, pageHeight = 297;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let y = 0;
      let first = true;
      while (y < imgHeight) {
        if (!first) pdf.addPage();
        pdf.addImage(img, "PNG", 0, -y, pageWidth, imgHeight, undefined, "FAST");
        y += pageHeight;
        first = false;
      }
      pdf.save(filename || safeName(title) + ".pdf");
      toast("PDF descargado.", "success");
    } catch (err) {
      node.remove();
      toast("No se pudo generar el PDF. Se descargará el TXT en su lugar.", "error");
      downloadTxt(lessons, title, subtitle, lang, (filename || safeName(title)) + ".txt");
    }
  }

  function downloadLessonPdf(lesson, lang) {
    downloadPdf([lesson], lesson.title, `${lang.name} · ${lesson.id.toUpperCase()}`, lang, `${lesson.id}.pdf`);
  }

  function downloadGuidePdf(lang, level) {
    downloadPdf(level.lessons, `${lang.name} · ${level.name}`, `${lang.native} · guía completa del nivel`, lang, `${lang.id}-${level.key}-guia.pdf`);
  }

  /* ---------- Libreta de caligrafía ---------- */
  /* ---------- Cuaderno de escritura (tianzige) ---------- */
  function tianzigeCell(char, color, size, guided) {
    const s = size || 92;
    const line = `position:absolute;background:${color};`;
    const glyph = guided
      ? `<span style="position:absolute;inset:0;display:grid;place-content:center;font-size:${Math.round(s * 0.66)}px;font-weight:600;color:#aeb6c9;line-height:1;font-family:'Segoe UI','Microsoft YaHei','Yu Gothic','Malgun Gothic',sans-serif;">${esc(char)}</span>`
      : "";
    return `<div style="position:relative;width:${s}px;height:${s}px;border:2px solid ${color};box-sizing:border-box;flex-shrink:0;">
      <div style="${line}left:50%;top:0;bottom:0;width:1px;opacity:.45;"></div>
      <div style="${line}top:50%;left:0;right:0;height:1px;opacity:.45;"></div>
      <div style="${line}left:-25%;top:50%;width:150%;height:1px;opacity:.18;transform:rotate(45deg);"></div>
      <div style="${line}left:-25%;top:50%;width:150%;height:1px;opacity:.18;transform:rotate(-45deg);"></div>
      ${glyph}
    </div>`;
  }

  function worksheetNode(entry, lang, preview) {
    const node = document.createElement("div");
    const color = lang.color;
    const cell = preview ? 54 : 92;
    const guidedRows = preview ? 1 : 3;
    const blankRows = preview ? 1 : 2;
    const row = (guided) => `<div style="display:flex;gap:${preview ? 6 : 10}px;margin-bottom:${preview ? 6 : 10}px;">
      ${Array.from({ length: preview ? 4 : 5 }, () => tianzigeCell(guided ? entry.char : "", color, cell, guided)).join("")}
    </div>`;

    node.style.cssText = preview
      ? `width:100%;background:#fff;color:#1b2033;font-family:'Segoe UI','Microsoft YaHei','Yu Gothic','Malgun Gothic',sans-serif;padding:2px;box-sizing:border-box;overflow:hidden;`
      : `position:fixed;left:-10000px;top:0;width:794px;min-height:1123px;background:#fff;color:#1b2033;font-family:'Segoe UI','Microsoft YaHei','Yu Gothic','Malgun Gothic',sans-serif;padding:42px 54px;box-sizing:border-box;`;

    if (preview) {
      node.innerHTML = `<div style="display:flex;align-items:center;gap:14px;">
        <div style="flex-shrink:0">${tianzigeCell(entry.char, color, 76, true)}</div>
        <div style="flex:1;font-size:12px;line-height:1.6;color:#6b7288;">
          <b style="color:#1b2033;font-size:14px">Cuaderno tianzige</b><br>
          ${entry.strokes} trazos · ${esc(entry.meaning)}<br>
          Filas guiadas para repasar y filas vacías para escribir de memoria.
        </div>
      </div>
      <div style="margin-top:10px">${row(true)}${row(false)}</div>`;
      return node;
    }

    node.innerHTML = `
      <div style="border-bottom:4px solid ${color};padding-bottom:14px;margin-bottom:20px;">
        <div style="font-size:12px;letter-spacing:2px;color:${color};font-weight:800;">TRES TINTAS · CUADERNO DE ESCRITURA TIANZIGE</div>
        <div style="font-size:28px;font-weight:800;margin-top:5px;">${esc(lang.name)} · ${esc(entry.char)}</div>
        <div style="font-size:13px;color:#6b7288;">${esc(entry.meaning)} · ${esc(entry.reading)} · ${entry.strokes} trazos · radical ${esc(entry.radical)}</div>
      </div>

      <div style="display:flex;align-items:center;gap:18px;margin-bottom:20px;">
        ${tianzigeCell(entry.char, color, 86, false)}
        <div style="flex:1;font-size:12px;line-height:1.75;color:#4b5166;">
          <b>Consejo:</b> ${esc(entry.note)}<br>
          Empieza por las filas claras: calca el carácter siguiendo el orden de trazos que ves en la libreta web. Cuando lo domines, rellena las filas vacías sin mirar.
        </div>
      </div>

      <div style="font-size:15px;font-weight:800;margin-bottom:9px;">1. Repasa sobre el carácter claro</div>
      ${Array.from({ length: guidedRows }, () => row(true)).join("")}

      <div style="font-size:15px;font-weight:800;margin:20px 0 9px;">2. Escríbelo de memoria</div>
      ${Array.from({ length: blankRows }, () => row(false)).join("")}

      <div style="margin-top:24px;border-top:1px solid #e3e6f0;padding-top:12px;">
        <div style="font-size:15px;font-weight:800;margin-bottom:6px;">Derivados para seguir practicando</div>
        <div style="font-size:13px;line-height:1.9;">${entry.derivatives.map((d) => `<div><b style="font-size:16px;">${esc(d[0])}</b> &nbsp;<span style="color:${color}">${esc(d[1])}</span> &nbsp;—&nbsp; ${esc(d[2])}</div>`).join("")}</div>
      </div>
      <div style="margin-top:18px;font-size:10px;color:#8a91a6;">Tres Tintas · Generado localmente · Imprime a tamaño real (100 %).</div>`;
    return node;
  }

  function renderWorksheetPreview(entry, lang, container) {
    container.innerHTML = "";
    container.appendChild(worksheetNode(entry, lang, true));
  }

  function writingTxt(entry, lang) {
    const lines = [];
    lines.push("============================================");
    lines.push(`TRES TINTAS · CUADERNO DE ESCRITURA · ${lang.name.toUpperCase()}`);
    lines.push("============================================");
    lines.push("");
    lines.push(`Carácter: ${entry.char}`);
    lines.push(`Significado: ${entry.meaning} · Lectura: ${entry.reading}`);
    lines.push(`Radical: ${entry.radical} · Trazos: ${entry.strokes}`);
    lines.push("");
    lines.push("NOTA: " + entry.note);
    lines.push("");
    lines.push("PLANTILLA (tianzige)");
    lines.push("Filas 1-3: carácter claro para repasar (calca el trazo).");
    lines.push("Filas 4-5: casillas vacías para escribir de memoria.");
    for (let i = 0; i < 5; i++) {
      lines.push("  " + Array.from({ length: 5 }, () => (i < 3 ? "[ " + entry.char + " ]" : "[    ]")).join(" "));
    }
    lines.push("");
    lines.push("DERIVADOS");
    entry.derivatives.forEach((d) => lines.push(`  ${d[0]}  ${d[1]}  —  ${d[2]}`));
    lines.push("");
    lines.push("Abre la libreta en la web para ver el orden de trazos animado.");
    return lines.join("\r\n");
  }

  function downloadWritingTxt(entry, lang) {
    triggerDownload(new Blob(["\ufeff" + writingTxt(entry, lang)], { type: "text/plain;charset=utf-8" }), `${lang.id}-cuaderno-${entry.char}.txt`);
    toast("Plantilla de texto descargada.", "success");
  }

  async function downloadWritingPdf(entry, lang) {
    if (!window.html2canvas || !window.jspdf) {
      toast("El PDF necesita conexión. Se descargará el TXT en su lugar.", "error");
      downloadWritingTxt(entry, lang);
      return;
    }
    toast("Generando cuaderno tianzige…");
    const node = worksheetNode(entry, lang, false);
    document.body.appendChild(node);
    try {
      const canvas = await window.html2canvas(node, { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false });
      node.remove();
      const img = canvas.toDataURL("image/png");
      const pdf = new window.jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = 210, pageHeight = 297;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let y = 0, first = true;
      while (y < imgHeight) {
        if (!first) pdf.addPage();
        pdf.addImage(img, "PNG", 0, -y, pageWidth, imgHeight, undefined, "FAST");
        y += pageHeight;
        first = false;
      }
      pdf.save(`${lang.id}-cuaderno-${entry.char}.pdf`);
      toast("Cuaderno descargado.", "success");
    } catch (_) {
      node.remove();
      toast("No se pudo generar el PDF. Se descargará el TXT.", "error");
      downloadWritingTxt(entry, lang);
    }
  }

  return { downloadLessonTxt, downloadLessonPdf, downloadGuideTxt, downloadGuidePdf, downloadVocabCsv, downloadWritingTxt, downloadWritingPdf, renderWorksheetPreview, downloadHskTxt, downloadHskCsv, downloadHskAnki };
})();
