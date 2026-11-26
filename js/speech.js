/* =========================================================
   Pronunciación: archivos MP3 reales + Web Speech API como reserva
   ========================================================= */
window.PolySpeech = (function () {
  let activeButton = null;
  let audioEl = null;

  function supported() {
    return typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined";
  }

  function clearButton() {
    if (activeButton) activeButton.classList.remove("speaking");
    activeButton = null;
  }

  function stop() {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    if (supported()) window.speechSynthesis.cancel();
    clearButton();
  }

  /* Reproduce un MP3. Si falla, intenta la síntesis de voz del sistema. */
  function playFile(url, button, fallbackText, fallbackLang) {
    stop();
    if (!audioEl) audioEl = new Audio();
    audioEl.src = url;
    audioEl.preload = "auto";

    if (button) {
      activeButton = button;
      button.classList.add("speaking");
    }
    audioEl.onended = clearButton;
    audioEl.onerror = () => {
      clearButton();
      if (fallbackText) speak(fallbackText, fallbackLang, button);
      else if (window.PolyApp && PolyApp.toast) PolyApp.toast("No se pudo cargar el audio.", "error");
    };

    const promise = audioEl.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {
        clearButton();
        if (fallbackText) speak(fallbackText, fallbackLang, button);
      });
    }
  }

  function speak(text, langVoice, button) {
    if (!supported()) {
      if (window.PolyApp && PolyApp.toast) PolyApp.toast("Tu navegador no admite síntesis de voz.", "error");
      return;
    }
    stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langVoice;
    utterance.rate = 0.85;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang && v.lang.replace("_", "-").toLowerCase().startsWith(langVoice.toLowerCase().slice(0, 2)));
    if (match) utterance.voice = match;

    if (button) {
      activeButton = button;
      button.classList.add("speaking");
    }
    utterance.onend = utterance.onerror = () => {
      if (button) button.classList.remove("speaking");
      if (activeButton === button) activeButton = null;
    };
    window.speechSynthesis.speak(utterance);
  }

  return { speak, playFile, stop, supported };
})();
