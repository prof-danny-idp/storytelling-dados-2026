/* Abertura 3D "Da pedra à luz": a norma é uma estela de pedra num salão em penumbra; seus requisitos
   (4 + 6 unidades, de DADOS.experimento.criterios) destacam-se, alinham-se em duas fileiras e se tornam verificáveis
   à medida que a luz aumenta. Geometria real (Three.js). Sem partículas. */
(function () {
  var C = (window.CenaAbertura = {});
  var T_FIM = 8.2, st = null;

  C.iniciar = function (canvas, rotulosEl) {
    if (st) return true;
    if (!U.webgl() || !window.CenaComum) return false;
    var T = window.THREE, K = window.CenaComum, crit = DADOS.experimento.criterios;
    var XE = -1.7, nA = crit[0].unidades, nB = crit[1].unidades, total = nA + nB;
    var renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true }); } catch (e) { return false; }
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    var scene = new T.Scene(); scene.background = new T.Color(0x0c0e10); scene.fog = new T.Fog(0x0c0e10, 16, 44);
    var cam = new T.PerspectiveCamera(30, 1.7, 0.1, 90);
    var M = K.materiais(T);

    var hemi = new T.HemisphereLight(0x9fb4c4, 0x24201b, 0.28); scene.add(hemi);
    var chave = new T.SpotLight(0xffd9a3, 0, 70, 0.52, 0.8, 1.1);
    chave.position.set(11, 9, 6); chave.target.position.set(1.5, 0.8, 0);
    chave.castShadow = true; chave.shadow.mapSize.set(1024, 1024); chave.shadow.bias = -0.0004; chave.shadow.camera.near = 4; chave.shadow.camera.far = 40;
    scene.add(chave); scene.add(chave.target);
    var frente = new T.DirectionalLight(0xaec4d6, 0.0); frente.position.set(-3, 3, 14); scene.add(frente);

    /* salão: piso, parede do fundo com fresta, parede lateral */
    var piso = new T.Mesh(new T.PlaneGeometry(120, 120), M.piso); piso.rotation.x = -Math.PI / 2; piso.receiveShadow = true; scene.add(piso);
    var fundo = new T.Group(); scene.add(fundo);
    var fr = { x: 4.4, w: 1.3 };
    var paredeE = K.caixa(T, (fr.x - fr.w / 2) + 30, 16, 1.2, M.parede, ((fr.x - fr.w / 2) - 30) / 2, 8, -10);
    var paredeD = K.caixa(T, 30, 16, 1.2, M.parede, fr.x + fr.w / 2 + 15, 8, -10);
    var verga = K.caixa(T, fr.w, 10.5, 1.2, M.parede, fr.x, 10.75, -10);
    var soleira = K.caixa(T, 0.01, 0.01, 0.01, M.parede, fr.x, 0, -10);
    fundo.add(paredeE, paredeD, verga, soleira);
    var ceu = new T.Mesh(new T.PlaneGeometry(fr.w, 5.5), new T.MeshBasicMaterial({ color: 0xffefd2, fog: false }));
    ceu.position.set(fr.x, 2.75, -9.38); scene.add(ceu);
    var lateral = K.caixa(T, 1.2, 16, 40, M.parede, -13, 8, -2); scene.add(lateral);

    /* norma */
    var estela = K.estela(T, M, nA, nB); estela.position.set(XE, 0, 0); estela.rotation.y = 0.16; scene.add(estela);

    /* requisitos: duas fileiras sobre réguas de latão (critério A ao fundo, critério B à frente) */
    var placas = [], ZA = -2.6, ZB = 1.2, X0A = 1.6, X0B = 0.5, PAS = 1.25, ELEV = 0.55;
    [ZA, ZB].forEach(function (z, gi) {
      var n = gi === 0 ? nA : nB, x0 = gi === 0 ? X0A : X0B;
      var el = gi === 0 ? ELEV : 0;
      if (gi === 0) { var pod = K.laje(T, (n - 1) * PAS + 2.0, ELEV, 1.6, 0.05, M.basalto); pod.position.set(x0 + (n - 1) * PAS / 2, ELEV / 2, z); scene.add(pod); }
      var regua = K.caixa(T, (n - 1) * PAS + 1.6, 0.05, 0.16, M.latao, x0 + (n - 1) * PAS / 2, el + 0.025, z + 0.5); regua.castShadow = false; scene.add(regua);
      for (var i = 0; i < n; i++) {
        var soco = K.laje(T, 1.1, 0.14, 0.42, 0.03, M.basalto); soco.position.set(x0 + i * PAS, el + 0.07, z); scene.add(soco);
      }
    });
    for (var k = 0; k < total; k++) {
      var g = k < nA ? 0 : 1, idx = g === 0 ? k : k - nA;
      var P = K.placa(T, M, g === 0 ? M.teal : M.indigo, 1);
      var rg = estela.userData.ranhuras[k];
      P.userData = {
        abertura: P.userData.abertura,
        fim: new T.Vector3((g === 0 ? X0A : X0B) + idx * PAS, (g === 0 ? ELEV : 0) + 0.14 + 0.75, g === 0 ? ZA : ZB),
        ini: new T.Vector3(XE, rg.y, 0.7), atraso: k * 0.22, yaw: g === 0 ? 0.06 : -0.06
      };
      P.scale.setScalar(0.001); scene.add(P); placas.push(P);
    }
    var ancoras = {
      norma: new T.Vector3(XE + 1.7, 6.2, 0),
      a: new T.Vector3(X0A + (nA - 1) * PAS / 2, ELEV + 2.7, ZA),
      b: new T.Vector3(X0B + (nB - 1) * PAS / 2, 2.0, ZB)
    };
    var els = {};
    if (rotulosEl) rotulosEl.querySelectorAll(".rotulo").forEach(function (e) { els[e.getAttribute("data-r")] = e; });

    st = { T: T, renderer: renderer, scene: scene, cam: cam, canvas: canvas, estela: estela, placas: placas, chave: chave, hemi: hemi, frente: frente, ceu: ceu,
      ancoras: ancoras, els: els, t: 0, ativo: false, visivel: false, px: 0, py: 0, raf: 0, relogio: new T.Clock() };
    canvas.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      st.px = (e.clientX - r.left) / r.width - 0.5; st.py = (e.clientY - r.top) / r.height - 0.5;
      if (!st.ativo && st.visivel) desenhar();
    });
    window.addEventListener("resize", function () { if (st.visivel) desenhar(); });
    if (U.reduzido()) st.t = T_FIM;
    return true;
  };

  function aplicar(t) {
    var x = st, T = x.T;
    var luz = U.ease(t / 6.0);
    x.chave.intensity = 0.6 + 2.6 * luz; x.hemi.intensity = 0.2 + 0.25 * luz; x.frente.intensity = 0.08 + 0.3 * luz;
    x.estela.userData.ranhuras.forEach(function (r, i) {
      var p = U.ease((t - 1.0 - i * 0.12) / 0.8);
      r.mat.emissiveIntensity = 0.75 * p;
    });
    x.placas.forEach(function (P) {
      var u = P.userData, p = U.ease((t - 2.2 - u.atraso) / 1.5);
      if (p <= 0.001) { P.scale.setScalar(0.001); return; }
      var arco = Math.sin(Math.PI * p) * 0.9;
      P.position.set(U.lerp(u.ini.x, u.fim.x, p), U.lerp(u.ini.y, u.fim.y, p) + arco, U.lerp(u.ini.z, u.fim.z, p));
      P.rotation.y = U.lerp(1.0, u.yaw, p); P.scale.setScalar(U.lerp(0.3, 1, p));
      var ab = U.ease((t - 4.8 - u.atraso * 0.5) / 1.0);
      P.userData.abertura.emissiveIntensity = 1.1 * ab;
    });
    var on = t >= 5.4;
    ["norma", "a", "b"].forEach(function (k) { if (x.els[k]) x.els[k].classList.toggle("is-on", on || (k === "norma" && t > 1.4)); });
  }

  function desenhar() {
    var x = st; if (!x) return;
    if (!U.ajustar(x.renderer, x.cam, x.canvas)) return;
    aplicar(x.t);
    var w = x.canvas.clientWidth, h = x.canvas.clientHeight, larga = w >= 900;
    var p = U.ease(x.t / 6.4), k = 0;
    /* câmera: parte de baixo e perto da estela (peso) e abre para o conjunto */
    var ax = larga ? 5.6 : 4.6, ay = larga ? 4.2 : 4.6, az = larga ? 24 : 26;
    x.cam.position.set(U.lerp(0.4, ax, p) + x.px * 1.2 + k, U.lerp(1.1, ay, p) - x.py * 0.7, U.lerp(10.5, az, p));
    x.cam.lookAt(U.lerp(-1.7, 2.5, p), U.lerp(3.4, 2.7, p), 0);
    if (larga) x.cam.setViewOffset(w, h, -w * 0.2, 0, w, h); else x.cam.clearViewOffset();
    x.renderer.render(x.scene, x.cam);
    ["norma", "a", "b"].forEach(function (key) {
      var e = x.els[key]; if (!e) return;
      var v = x.ancoras[key].clone().project(x.cam);
      e.style.left = ((v.x * 0.5 + 0.5) * w) + "px"; e.style.top = ((-v.y * 0.5 + 0.5) * h) + "px";
    });
  }

  function laco() {
    var x = st; if (!x || !x.ativo) return;
    var dt = Math.min(x.relogio.getDelta(), 0.05);
    x.t += dt;
    desenhar();
    if (x.t >= T_FIM) { x.ativo = false; return; } /* cena concluída: sem laço contínuo */
    x.raf = requestAnimationFrame(laco);
  }

  C.visivel = function (v) {
    if (!st) return;
    st.visivel = v;
    if (v && !st.ativo && !U.reduzido() && st.t < T_FIM) { st.ativo = true; st.relogio.getDelta(); st.raf = requestAnimationFrame(laco); }
    else if (!v) { st.ativo = false; cancelAnimationFrame(st.raf); }
    if (v) desenhar();
  };
  C.reiniciar = function () {
    if (!st) return;
    st.t = U.reduzido() ? T_FIM : 0;
    if (st.visivel && !st.ativo && !U.reduzido()) C.visivel(true);
    desenhar();
  };
  C.pular = function () { if (st) { st.t = T_FIM; desenhar(); } };
  C.movimentoMudou = function () {
    if (!st) return;
    if (U.reduzido()) { st.t = T_FIM; st.ativo = false; cancelAnimationFrame(st.raf); desenhar(); }
    else if (st.visivel) { st.ativo = false; C.visivel(true); }
  };
  C.estado = function () { return st ? { t: st.t, fim: T_FIM, ativo: st.ativo } : null; };
})();
