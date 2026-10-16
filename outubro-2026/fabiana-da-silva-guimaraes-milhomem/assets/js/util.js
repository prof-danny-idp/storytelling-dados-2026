/* Utilitários compartilhados. Scripts clássicos (funcionam em file://). */
(function () {
  var U = (window.U = {});
  U.fmt = function (v, c) { c = c == null ? 1 : c; return Number(v).toFixed(c).replace(".", ","); };
  U.pct = function (v, c) { return U.fmt(v, c) + "%"; };
  U.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  };
  U.reduzido = function () {
    return document.documentElement.classList.contains("reduzir-movimento") ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  U.webgl = function () {
    try {
      if (window.__SEM_WEBGL) return false;
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && window.THREE && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { return false; }
  };
  U.ease = function (t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  U.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  U.lerp = function (a, b, t) { return a + (b - a) * t; };
  U.metricas = {
    recall: { nome: "Recall_item", cor: "#1f6b6f" },
    cobertura: { nome: "Cobertura_evidência", cor: "#4a5a9c" },
    precisao: { nome: "Precisão_evidência", cor: "#a4522b" }
  };
  /* ajusta o canvas ao contêiner (sem zoom nem scale()) */
  U.ajustar = function (renderer, camera, canvas) {
    var p = canvas.parentElement, w = p.clientWidth, h = p.clientHeight;
    if (!w || !h) return false;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (canvas.__w !== w || canvas.__h !== h || canvas.__d !== dpr) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      canvas.__w = w; canvas.__h = h; canvas.__d = dpr;
    }
    return true;
  };
})();
