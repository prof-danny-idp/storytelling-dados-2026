/* Percurso 3D pelas sete estações da metodologia, "Da pedra à luz": cada estação é um ambiente com luz,
   material e enquadramento próprios; a luz cresce da penumbra do salão à luz do dia da interpretação humana.
   Atores com material próprio: agente de IA (cerâmica branca + lente), rotina determinística (latão, mecânica),
   gabarito (câmara fechada, âmbar, sem ligação com o agente), pessoa auditora (argila/roupa).
   Nenhum percentual ou valor de resultado é representado. */
(function () {
  var A = (window.CenaArq = {});
  var st = null, ESP = 40, N = 7;

  /* ambiente por estação: fundo/névoa, hemisfério, luz-chave (posição relativa), luz local opcional */
  var AMB = [
    { bg: 0x0c0e10, fn: 20, ff: 60, hs: 0x9fb4c4, hi: 0.28, kc: 0xffd9a3, ki: 2.4, kp: [9, 9, 7], pt: null },
    { bg: 0x14181b, fn: 22, ff: 70, hs: 0xb4c2cc, hi: 0.38, kc: 0xfff0d8, ki: 2.4, kp: [-6, 10, 9], pt: null },
    { bg: 0x081316, fn: 18, ff: 55, hs: 0x7fb7c4, hi: 0.34, kc: 0xcfeaff, ki: 2.0, kp: [3, 11, 6], pt: { c: 0x37c7bd, i: 1.3, p: [0, 3, 2.5] } },
    { bg: 0x16191b, fn: 24, ff: 70, hs: 0xc4c8c8, hi: 0.4, kc: 0xfff4e0, ki: 1.9, kp: [2, 8, 12], pt: null },
    { bg: 0x14161a, fn: 22, ff: 66, hs: 0xb8c0cc, hi: 0.36, kc: 0xf0f2ff, ki: 1.8, kp: [-7, 9, 8], pt: { c: 0xffb347, i: 1.5, p: [7.4, 2.4, 0] } },
    { bg: 0x23272b, fn: 26, ff: 80, hs: 0xdde4ea, hi: 0.42, kc: 0xffffff, ki: 1.6, kp: [4, 11, 9], pt: null },
    { bg: 0x3a3d3f, fn: 30, ff: 90, hs: 0xf4eee2, hi: 0.5, kc: 0xfff2dc, ki: 1.7, kp: [6, 10, 8], pt: null }
  ];
  /* câmera por estação: posição e alvo relativos ao centro da estação */
  var CAM = [
    { p: [2.2, 2.9, 15.0], a: [0.4, 2.6, 0], w: 7.4 },
    { p: [0.0, 3.2, 14.0], a: [0.0, 1.9, 0], w: 9.2 },
    { p: [5.0, 4.4, 10.5], a: [1.2, 1.3, 0], w: 8.0 },
    { p: [0.0, 2.8, 13.5], a: [-0.2, 2.2, -1.5], w: 9.0 },
    { p: [-0.5, 5.2, 15.0], a: [-0.2, 1.5, 0], w: 11.2 },
    { p: [0.0, 2.6, 13.0], a: [0.0, 1.6, 0], w: 7.6 },
    { p: [3.0, 3.6, 12.0], a: [0.2, 1.7, 0], w: 8.2 }
  ];

  function ctexHachura(T) {
    var c = document.createElement("canvas"); c.width = c.height = 64;
    var x = c.getContext("2d"); x.fillStyle = "#e6e2d8"; x.fillRect(0, 0, 64, 64);
    x.strokeStyle = "#8c8573"; x.lineWidth = 3;
    for (var i = -64; i < 128; i += 12) { x.beginPath(); x.moveTo(i, 64); x.lineTo(i + 64, 0); x.stroke(); }
    var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(3, 1); t.encoding = T.sRGBEncoding; return t;
  }

  A.iniciar = function (canvas) {
    if (st) return true;
    if (!U.webgl() || !window.CenaComum) return false;
    var T = window.THREE, K = window.CenaComum, renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true }); } catch (e) { return false; }
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95;
    var scene = new T.Scene(); scene.background = new T.Color(AMB[0].bg); scene.fog = new T.Fog(AMB[0].bg, AMB[0].fn, AMB[0].ff);
    var cam = new T.PerspectiveCamera(34, 2.2, 0.1, 140);
    var M = K.materiais(T);
    var hemi = new T.HemisphereLight(AMB[0].hs, 0x1d1a16, AMB[0].hi); scene.add(hemi);
    var chave = new T.SpotLight(AMB[0].kc, AMB[0].ki, 90, 0.5, 0.8, 1.1);
    chave.castShadow = true; chave.shadow.mapSize.set(1024, 1024); chave.shadow.bias = -0.0004; chave.shadow.camera.near = 4; chave.shadow.camera.far = 60;
    scene.add(chave); scene.add(chave.target);
    var local = new T.PointLight(0xffffff, 0, 16, 1.6); scene.add(local);

    var piso = new T.Mesh(new T.PlaneGeometry(400, 80), M.piso); piso.rotation.x = -Math.PI / 2; piso.position.set(120, -0.3, 0); piso.receiveShadow = true; scene.add(piso);

    var animados = [], grupos = [];
    function nova(i, matPlat, larg) {
      var g = new T.Group(); g.position.set(i * ESP, 0, 0); scene.add(g); grupos.push(g);
      var plat = K.laje(T, larg || 22, 0.3, 14, 0.05, matPlat); plat.position.set(0, -0.15, 0); g.add(plat);
      var fundo = K.caixa(T, 30, 12, 0.6, M.parede, 0, 5.7, -7.8); g.add(fundo);
      return g;
    }
    function fila(g, x0, z, n, cor, passo, elev) {
      var el = elev || 0;
      if (elev) { var pod = K.laje(T, (n - 1) * passo + 2.0, el, 1.6, 0.05, M.basalto); pod.position.set(x0 + (n - 1) * passo / 2, el / 2, z); g.add(pod); }
      var reg = K.caixa(T, (n - 1) * passo + 1.6, 0.05, 0.16, M.latao, x0 + (n - 1) * passo / 2, el + 0.025, z + 0.5); reg.castShadow = false; g.add(reg);
      var out = [];
      for (var i = 0; i < n; i++) {
        var soco = K.laje(T, 1.1, 0.14, 0.42, 0.03, M.basalto); soco.position.set(x0 + i * passo, el + 0.07, z); g.add(soco);
        var P = K.placa(T, M, cor); P.position.set(x0 + i * passo, el + 0.89, z); P.userData.abertura.emissiveIntensity = 1.0; g.add(P); out.push(P);
      }
      return out;
    }

    /* 0 · norma → requisitos verificáveis */
    (function () {
      var g = nova(0, M.basalto), nA = DADOS.experimento.criterios[0].unidades, nB = DADOS.experimento.criterios[1].unidades;
      var e = K.estela(T, M, nA, nB); e.position.set(-4.2, 0, 0); e.rotation.y = 0.14; g.add(e);
      e.userData.ranhuras.forEach(function (r) { r.mat.emissiveIntensity = 0.75; });
      fila(g, -0.2, -2.6, nA, M.teal, 1.25, 0.55);
      fila(g, -1.3, 1.2, nB, M.indigo, 1.25, 0);
    })();

    /* 1 · quatro portais institucionais, critérios comuns (formas abstratas; nenhum portal real é reproduzido) */
    (function () {
      var g = nova(1, M.calcarioEsc), R = K.poly;
      var mats = [M.calcario, M.calcarioEsc, M.calcario, M.calcarioEsc];
      var arco = new T.Path(); arco.moveTo(-0.95, 0); arco.lineTo(-0.95, 2.1); arco.absarc(0, 2.1, 0.95, Math.PI, 0, true); arco.lineTo(0.95, 0); arco.lineTo(-0.95, 0);
      var a = K.moldura(T, R([[-1.5, 0], [1.5, 0], [1.5, 3.7], [-1.5, 3.7]]), arco, 0.9, mats[0]); a.position.set(-5.6, 0, -0.4); g.add(a);
      var b = K.moldura(T, R([[-1.7, 0], [1.7, 0], [1.7, 3.3], [-1.7, 3.3]]), R([[-1.05, 0], [1.05, 0], [1.05, 2.5], [-1.05, 2.5]]), 0.8, mats[1]); b.position.set(-1.9, 0, 0.4); g.add(b);
      var cx = 1.9;
      [-1.1, 1.1].forEach(function (dx) { var pl = K.laje(T, 0.7, 4.4, 0.8, 0.05, mats[2]); pl.position.set(cx + dx, 2.2, -0.4); g.add(pl); });
      var vg = K.laje(T, 3.2, 0.5, 1.0, 0.05, mats[2]); vg.position.set(cx, 4.2, -0.4); g.add(vg);
      var esc = R([[-1.7, 0], [1.7, 0], [1.7, 2.0], [1.1, 2.0], [1.1, 3.2], [0.5, 3.2], [0.5, 3.9], [-0.5, 3.9], [-0.5, 3.2], [-1.1, 3.2], [-1.1, 2.0], [-1.7, 2.0]]);
      var d = K.moldura(T, esc, R([[-0.7, 0], [0.7, 0], [0.7, 1.7], [-0.7, 1.7]]), 0.8, mats[3]); d.position.set(5.6, 0, 0.4); g.add(d);
      /* régua comum: o mesmo conjunto de critérios atravessa os quatro portais */
      g.add(K.caixa(T, 15.5, 0.08, 0.08, M.latao, 0, 1.15, 2.4));
      [-7.4, 7.4].forEach(function (x) { g.add(K.caixa(T, 0.1, 1.25, 0.1, M.latao, x, 0.62, 2.4)); });
      [-5.6, -1.9, 1.9, 5.6].forEach(function (x) {
        var t1 = K.laje(T, 0.55, 0.8, 0.08, 0.02, M.teal); t1.position.set(x - 0.4, 0.8, 2.6); g.add(t1);
        var t2 = K.laje(T, 0.55, 0.8, 0.08, 0.02, M.indigo); t2.position.set(x + 0.4, 0.8, 2.6); g.add(t2);
      });
    })();

    /* 2 · coleta orientada por IA generativa: o agente localiza e organiza; não decide */
    var agente;
    (function () {
      var g = nova(2, M.grafite);
      var anel = new T.Mesh(new T.RingGeometry(3.0, 3.12, 64), new T.MeshBasicMaterial({ color: 0x37c7bd, side: T.DoubleSide }));
      anel.rotation.x = -Math.PI / 2; anel.position.y = 0.01; g.add(anel);
      agente = K.robo(T, M); agente.scale.setScalar(1.45); agente.position.set(0, 0.2, 0); g.add(agente);
      animados.push(function (t) { agente.position.y = 0.2 + Math.sin(t * 1.2) * 0.07; });
      var pos = [[-5.6, -1.6], [-3.9, 2.2], [-1.6, -3.0], [2.8, 2.9], [4.9, -2.2], [5.8, 1.4]];
      pos.forEach(function (q, i) {
        var f = K.laje(T, 1.05, 0.03, 1.35, 0.01, M.papel); f.position.set(q[0], 0.03 + i * 0.002, q[1]); f.rotation.y = i * 0.8; g.add(f);
        var pts = [new T.Vector3(q[0], 0.1, q[1]), new T.Vector3(q[0] * 0.5, 1.3, q[1] * 0.5 + 0.6), new T.Vector3(0, 2.6, 0.5)];
        var geo = new T.BufferGeometry().setFromPoints(new T.QuadraticBezierCurve3(pts[0], pts[1], pts[2]).getPoints(24));
        var l = new T.Line(geo, new T.LineDashedMaterial({ color: 0x37c7bd, dashSize: 0.16, gapSize: 0.12 })); l.computeLineDistances(); g.add(l);
      });
      [[-2.4, 1.9, 1.5], [2.2, 2.2, -1.1], [-0.4, 2.9, 2.1]].forEach(function (q, i) {
        var f = K.laje(T, 0.9, 0.03, 1.15, 0.01, M.papel); f.position.set(q[0], q[1], q[2]); f.rotation.set(0.5, i * 0.7, 0.2); g.add(f);
        animados.push(function (t) { f.position.y = q[1] + Math.sin(t * 1.1 + i) * 0.1; });
      });
      var cx = K.laje(T, 2.4, 0.4, 1.6, 0.04, M.basalto); cx.position.set(8.2, 0.2, 0); g.add(cx);
      for (var s = 0; s < 4; s++) { var f2 = K.laje(T, 1.2, 0.03, 1.5, 0.01, M.papel); f2.position.set(8.2, 0.42 + s * 0.04, 0); f2.rotation.y = s * 0.12; g.add(f2); }
    })();

    /* 3 · organização das evidências: arquivo alinhado aos requisitos */
    (function () {
      var g = nova(3, M.calcarioEsc), nA = DADOS.experimento.criterios[0].unidades, nB = DADOS.experimento.criterios[1].unidades, n = nA + nB;
      var W = n * 1.3, x0 = -W / 2;
      var fundo = K.laje(T, W + 0.5, 4.6, 0.3, 0.04, M.grafite); fundo.position.set(0, 2.5, -2.2); g.add(fundo);
      for (var i = 0; i <= n; i++) { var dv = K.caixa(T, 0.07, 3.9, 1.1, M.calcario, x0 + i * 1.3, 2.35, -1.7); g.add(dv); }
      for (var j = 0; j <= 3; j++) { var hz = K.caixa(T, W + 0.1, 0.07, 1.1, M.calcario, 0, 0.4 + j * 1.3, -1.7); g.add(hz); }
      for (var c = 0; c < n; c++) {
        var cx = x0 + 0.65 + c * 1.3;
        var cap = K.laje(T, 1.1, 0.2, 0.2, 0.03, c < nA ? M.teal : M.indigo); cap.position.set(cx, 4.55, -1.15); g.add(cap);
        for (var r = 0; r < 2; r++) { var f = K.laje(T, 0.9, 1.0, 0.05, 0.015, M.papel); f.position.set(cx, 0.48 + 0.5 + r * 1.3, -1.35); g.add(f); }
      }
      var mesa = K.laje(T, 6.0, 0.14, 1.8, 0.04, M.basalto); mesa.position.set(-1.5, 0.9, 2.4); g.add(mesa);
      [-4.2, 1.2].forEach(function (x) { [1.8, 3.0].forEach(function (z) { g.add(K.caixa(T, 0.12, 0.9, 0.12, M.basalto, x, 0.45, z)); }); });
      for (var s = 0; s < 3; s++) { var fm = K.laje(T, 1.0, 0.03, 1.3, 0.01, M.papel); fm.position.set(-3.6 + s * 0.2, 1.0 + s * 0.035, 2.4); fm.rotation.y = s * 0.18; g.add(fm); }
      var rb = K.robo(T, M); rb.scale.setScalar(1.1); rb.position.set(0.4, 0.95, 2.4); rb.rotation.y = -0.5; g.add(rb);
    })();

    /* 4 · gabarito independente × comparação determinística */
    (function () {
      var g = nova(4, M.calcario, 24);
      /* lado do modelo: evidências reportadas e o agente ao fundo */
      var pl = K.laje(T, 3.2, 0.5, 2.4, 0.05, M.basalto); pl.position.set(-6.8, 0.25, 0); g.add(pl);
      [-0.8, 0, 0.8, 1.6].forEach(function (z, i) {
        var f = K.laje(T, 1.3, 0.03, 0.8, 0.01, M.papel); f.position.set(-6.8, 0.54 + i * 0.045, z - 0.4); f.rotation.y = (i - 1.5) * 0.12; g.add(f);
        var bd = K.caixa(T, 1.3, 0.05, 0.06, i < 2 ? M.teal : M.indigo, -6.8, 0.58 + i * 0.045, z - 0.78); g.add(bd);
      });
      var rb = K.robo(T, M); rb.scale.setScalar(1.0); rb.position.set(-8.9, 0, -2.4); rb.rotation.y = 0.7; g.add(rb);
      /* rotina determinística: pórtico de latão com régua de comparação */
      [-1.9, 1.9].forEach(function (z) { g.add(K.caixa(T, 0.24, 3.0, 0.24, M.latao, -3.2, 1.5, z)); });
      g.add(K.caixa(T, 0.3, 0.3, 4.3, M.latao, -3.2, 3.0, 0));
      var cur = K.caixa(T, 0.5, 0.6, 0.6, M.grafite, -3.2, 2.55, 0.5); g.add(cur);
      g.add(K.caixa(T, 0.06, 1.6, 0.06, M.latao, -3.2, 1.7, 0.5));
      var trilho = K.caixa(T, 5.2, 0.05, 0.12, M.latao, -5.3, 0.03, -0.9); trilho.castShadow = false; g.add(trilho);
      /* pares com correspondência: linha contínua; sem correspondência: linha tracejada que termina em anel vazio */
      function seg(a, b, cor, tr) {
        var geo = new T.BufferGeometry().setFromPoints([new T.Vector3(a[0], a[1], a[2]), new T.Vector3(b[0], b[1], b[2])]);
        var l = new T.Line(geo, tr ? new T.LineDashedMaterial({ color: cor, dashSize: 0.18, gapSize: 0.14 }) : new T.LineBasicMaterial({ color: cor }));
        if (tr) l.computeLineDistances(); g.add(l);
      }
      [-1.2, -0.4, 0.4].forEach(function (z) { seg([-6.8, 0.8, z - 0.4], [-3.2, 1.2, z * 0.7], 0x39b8b0, false); seg([-3.2, 1.2, z * 0.7], [7.0, 1.0, z * 0.9], 0x39b8b0, false); });
      seg([-6.8, 0.8, 1.2], [-4.6, 0.8, 1.2], 0x8b949b, true);
      var ar = new T.Mesh(new T.RingGeometry(0.16, 0.23, 24), new T.MeshBasicMaterial({ color: 0x8b949b, side: T.DoubleSide }));
      ar.position.set(-4.4, 0.8, 1.2); ar.rotation.y = Math.PI / 2; g.add(ar);
      /* barreira: o gabarito fica em câmara fechada, sem ligação com o agente; a única passagem é a comparação */
      var par = K.moldura(T, K.poly([[-3.2, 0], [3.2, 0], [3.2, 3.4], [-3.2, 3.4]]), K.poly([[-0.9, 0.5], [1.7, 0.5], [1.7, 1.6], [-0.9, 1.6]]), 0.5, M.basalto);
      par.rotation.y = Math.PI / 2; par.position.set(2.0, 0, 0); g.add(par);
      var cam = K.laje(T, 4.2, 0.4, 4.0, 0.05, M.basalto); cam.position.set(7.4, 0.2, 0); g.add(cam);
      [[-2, -2], [2, -2], [-2, 2], [2, 2]].forEach(function (q) { g.add(K.caixa(T, 0.14, 3.0, 0.14, M.latao, 7.4 + q[0], 1.9, q[1])); });
      var cx = K.caixa(T, 4.2, 3.0, 4.0, M.vidro, 7.4, 1.9, 0); cx.castShadow = false; g.add(cx);
      g.add(K.caixa(T, 4.3, 0.14, 4.1, M.latao, 7.4, 3.45, 0));
      [-1.2, -0.4, 0.4, 1.2].forEach(function (z, i) {
        var f = K.laje(T, 1.2, 0.04, 0.7, 0.01, M.papel); f.position.set(7.4, 0.5 + i * 0.05, z); g.add(f);
        g.add(K.caixa(T, 1.2, 0.05, 0.05, M.latao, 7.4, 0.55 + i * 0.05, z - 0.35));
      });
    })();

    /* 5 · métricas: três instrumentos, sem valores */
    (function () {
      var g = nova(5, M.calcario);
      var hat = new T.MeshStandardMaterial({ map: ctexHachura(T), roughness: 0.9 });
      [-4.4, 0, 4.4].forEach(function (x) { var pl = K.laje(T, 2.8, 0.5, 2.0, 0.05, M.basalto); pl.position.set(x, 0.25, 0); g.add(pl); g.add(K.caixa(T, 1.6, 0.05, 0.05, M.latao, x, 0.52, 1.05)); });
      var col = new T.Mesh(new T.CylinderGeometry(0.62, 0.62, 3.4, 40), M.teal); col.position.set(-4.4, 2.2, 0); col.castShadow = col.receiveShadow = true; g.add(col);
      for (var i = 0; i <= 10; i++) { var an = new T.Mesh(new T.TorusGeometry(0.64, 0.02, 8, 40), M.latao); an.rotation.x = Math.PI / 2; an.position.set(-4.4, 0.5 + i * 0.34, 0); g.add(an); }
      for (var k = 0; k < 14; k++) { var ds = new T.Mesh(new T.CylinderGeometry(0.95, 0.95, 0.16, 40), M.indigo); ds.position.set(0, 0.6 + k * 0.2, 0); ds.castShadow = ds.receiveShadow = true; g.add(ds); }
      var b1 = K.laje(T, 2.0, 0.7, 0.9, 0.04, M.ferrugem); b1.position.set(3.55, 0.95, 0); g.add(b1);
      var b2 = K.laje(T, 1.2, 0.7, 0.9, 0.04, hat); b2.position.set(5.05, 0.95, 0); g.add(b2);
      g.add(K.caixa(T, 3.4, 0.06, 0.06, M.latao, 4.25, 1.55, 0.55));
    })();

    /* 6 · interpretação humana: a pessoa auditora, à luz do dia */
    var pessoa;
    (function () {
      var g = nova(6, M.calcario);
      var jan = new T.Mesh(new T.PlaneGeometry(5.5, 7), new T.MeshBasicMaterial({ color: 0xfff6e4, fog: false })); jan.position.set(-1.0, 4.2, -7.45); g.add(jan);
      var mesa = K.laje(T, 6.0, 0.16, 2.4, 0.04, M.basalto); mesa.position.set(0, 1.0, 0.2); g.add(mesa);
      [-2.7, 2.7].forEach(function (x) { [-0.7, 1.1].forEach(function (z) { g.add(K.caixa(T, 0.14, 1.0, 0.14, M.basalto, x, 0.5, z)); }); });
      for (var i = 0; i < 4; i++) { var f = K.laje(T, 1.2, 0.03, 1.6, 0.01, M.papel); f.position.set(-1.6 + i * 0.5, 1.1 + i * 0.035, 0.3); f.rotation.y = i * 0.16 - 0.2; g.add(f); }
      pessoa = K.pessoa(T, M); pessoa.position.set(0.4, 0, -1.3); pessoa.scale.setScalar(1.2); pessoa.rotation.y = -0.15; g.add(pessoa);
      var lt = pessoa.userData.lente;
      animados.push(function (t) { lt.position.x = 0.6 + Math.sin(t * 0.6) * 0.18; });
      var rb = K.robo(T, M); rb.scale.setScalar(0.95); rb.position.set(-5.6, 0, -2.4); rb.rotation.y = 0.8; g.add(rb);
      var tr = [[2.2, -1.2], [3.0, -1.2], [3.8, -1.2]].map(function (q, i) { return [q, [M.teal, M.indigo, M.ferrugem][i]]; });
      tr.forEach(function (o) { var m = K.laje(T, 0.55, 1.2, 0.5, 0.04, o[1]); m.position.set(o[0][0] + 1.6, 0.6, o[0][1] + 0.4); g.add(m); });
    })();

    st = { T: T, renderer: renderer, scene: scene, cam: cam, canvas: canvas, animados: animados, chave: chave, hemi: hemi, local: local,
      atual: 0, de: 0, tmov: 1, t: 0, ativo: false, visivel: false, px: 0, py: 0, raf: 0, relogio: new T.Clock(), cb: null,
      pos: new T.Vector3(), alvo: new T.Vector3(), ambDe: null, cor: new T.Color() };
    placarCamera(0, st.pos, st.alvo);
    var LAB = [
      [0, "A norma", -4.2 + 1.6, 6.2, 0], [0, "Requisitos verificáveis", 3.2, 3.0, 0.6],
      [1, "CNJ", -5.6, 4.1, -0.4], [1, "STF", -1.9, 3.7, 0.4], [1, "TJDFT", 1.9, 4.8, -0.4], [1, "TST", 5.6, 4.3, 0.4],
      [1, "Mesmos critérios nos quatro portais", 0, 1.9, 2.4],
      [2, "Agente de IA generativa", 0, 3.8, 0.4], [2, "Páginas e documentos públicos", -4.8, 0.9, -1.0],
      [3, "Evidências vinculadas aos requisitos", 0, 5.0, -1.5],
      [4, "Evidências reportadas", -6.8, 2.5, 0], [4, "Rotina determinística", -3.2, 3.7, 0], [4, "Gabarito · câmara independente", 7.4, 3.9, 0],
      [4, "Sem correspondência direta", -4.4, 1.3, 1.2],
      [5, "Recall_item", -4.4, 5.0, 0], [5, "Cobertura_evidência", 0, 3.6, 0], [5, "Precisão_evidência", 4.25, 2.1, 0],
      [6, "Pessoa auditora · interpretação crítica", 0.4, 3.9, -1.3]
    ];
    var rot = document.createElement("div"); rot.className = "rotulos"; rot.setAttribute("aria-hidden", "true");
    canvas.parentElement.appendChild(rot);
    st.rotulos = LAB.map(function (l) {
      var e = document.createElement("span"); e.className = "rotulo"; e.textContent = l[1]; rot.appendChild(e);
      return { e: e, est: l[0], p: new T.Vector3(l[0] * ESP + l[2], l[3], l[4]) };
    });
    canvas.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      st.px = (e.clientX - r.left) / r.width - 0.5; st.py = (e.clientY - r.top) / r.height - 0.5;
      if (!st.ativo && st.visivel) desenhar();
    });
    window.addEventListener("resize", function () { if (st.visivel) desenhar(); });
    ambienteInicial(); st.wAtual = CAM[0].w; st.tIni = performance.now();
    return true;
  };

  function placarCamera(i, pos, alvo) {
    var c = CAM[i], x = i * ESP;
    pos.set(x + c.p[0], c.p[1], c.p[2]); alvo.set(x + c.a[0], c.a[1], c.a[2]);
  }
  /* parâmetros de ambiente da estação i (valores absolutos, prontos para mistura) */
  function paramsDe(i) {
    var T = st.T, a = AMB[i], x = i * ESP;
    return { bg: new T.Color(a.bg), hs: new T.Color(a.hs), kc: new T.Color(a.kc), fn: a.fn, ff: a.ff, hi: a.hi, ki: a.ki,
      kp: [x + a.kp[0], a.kp[1], a.kp[2]], tx: x,
      pt: a.pt ? { c: new T.Color(a.pt.c), i: a.pt.i, p: [x + a.pt.p[0], a.pt.p[1], a.pt.p[2]] } : null };
  }
  function mistura(A, B, k) {
    function m(u, v) { return u + (v - u) * k; }
    var pa = A.pt, pb = B.pt, ref = pb || pa, P = {
      bg: A.bg.clone().lerp(B.bg, k), hs: A.hs.clone().lerp(B.hs, k), kc: A.kc.clone().lerp(B.kc, k),
      fn: m(A.fn, B.fn), ff: m(A.ff, B.ff), hi: m(A.hi, B.hi), ki: m(A.ki, B.ki), tx: m(A.tx, B.tx),
      kp: [m(A.kp[0], B.kp[0]), m(A.kp[1], B.kp[1]), m(A.kp[2], B.kp[2])], pt: null };
    if (ref) {
      var pos = pa && pb ? [m(pa.p[0], pb.p[0]), m(pa.p[1], pb.p[1]), m(pa.p[2], pb.p[2])] : ref.p;
      P.pt = { c: pa && pb ? pa.c.clone().lerp(pb.c, k) : ref.c, i: m(pa ? pa.i : 0, pb ? pb.i : 0), p: pos };
    }
    return P;
  }
  function aplicarAmbiente(P) {
    var x = st;
    x.scene.background.copy(P.bg); x.scene.fog.color.copy(P.bg); x.scene.fog.near = P.fn; x.scene.fog.far = P.ff;
    x.hemi.color.copy(P.hs); x.hemi.intensity = P.hi;
    x.chave.color.copy(P.kc); x.chave.intensity = P.ki; x.chave.position.set(P.kp[0], P.kp[1], P.kp[2]); x.chave.target.position.set(P.tx, 0.5, 0);
    if (P.pt) { x.local.color.copy(P.pt.c); x.local.intensity = P.pt.i; x.local.position.set(P.pt.p[0], P.pt.p[1], P.pt.p[2]); } else x.local.intensity = 0;
  }
  function ambienteInicial() { st.ambDe = st.ambPara = st.cur = paramsDe(0); aplicarAmbiente(st.cur); }

  A.ir = function (i, imediato) {
    if (!st) return;
    i = U.clamp(i, 0, N - 1);
    /* ponto de partida = estado interpolado atual (evita saltos se a navegação ocorrer durante uma transição) */
    st.camDe = { pos: st.pos.clone(), alvo: st.alvo.clone(), w: st.wAtual };
    st.ambDe = st.cur; st.ambPara = paramsDe(i);
    st.atual = i;
    st.tIni = performance.now();
    st.tmov = (imediato || U.reduzido()) ? 1 : 0;
    if (st.cb) st.cb(i);
    if (st.visivel && !st.ativo) desenhar();
    if (st.visivel && st.tmov < 1 && !st.ativo && !U.reduzido()) { st.ativo = true; st.relogio.getDelta(); st.raf = requestAnimationFrame(laco); }
  };
  A.atual = function () { return st ? st.atual : 0; };
  A.aoMudar = function (cb) { if (st) st.cb = cb; };
  A.estado = function () { return st ? { atual: st.atual, tmov: st.tmov, w: st.canvas.clientWidth, h: st.canvas.clientHeight } : null; };

  function desenhar() {
    var x = st; if (!x) return;
    if (!U.ajustar(x.renderer, x.cam, x.canvas)) return;
    var k = U.ease(x.tmov), pf = new x.T.Vector3(), af = new x.T.Vector3(), wf = CAM[x.atual].w;
    placarCamera(x.atual, pf, af);
    if (x.camDe && x.tmov < 1) {
      x.pos.lerpVectors(x.camDe.pos, pf, k); x.alvo.lerpVectors(x.camDe.alvo, af, k); x.wAtual = U.lerp(x.camDe.w, wf, k);
    } else { x.pos.copy(pf); x.alvo.copy(af); x.wAtual = wf; }
    x.cur = x.tmov < 1 ? mistura(x.ambDe, x.ambPara, k) : x.ambPara;
    aplicarAmbiente(x.cur);
    if (!U.reduzido()) x.animados.forEach(function (f) { f(x.t); });
    /* enquadramento: a câmera recua o necessário para que a largura útil da estação caiba no palco, qualquer que seja a proporção */
    var asp = x.canvas.clientWidth / Math.max(1, x.canvas.clientHeight), tanV = Math.tan(x.cam.fov * Math.PI / 360);
    var base = x.pos.distanceTo(x.alvo), precisa = (x.wAtual * 1.1) / (tanV * asp), f = U.clamp(precisa / base, 1, 3);
    var px = x.alvo.x + (x.pos.x - x.alvo.x) * f, py = x.alvo.y + (x.pos.y - x.alvo.y) * f, pz = x.alvo.z + (x.pos.z - x.alvo.z) * f;
    x.cam.position.set(px + x.px * 1.0, py - x.py * 0.6, pz);
    x.cam.lookAt(x.alvo);
    x.renderer.render(x.scene, x.cam);
    var w = x.canvas.clientWidth, h = x.canvas.clientHeight, pronto = x.tmov > 0.55;
    x.rotulos.forEach(function (r) {
      var on = pronto && r.est === x.atual;
      r.e.classList.toggle("is-on", on);
      if (!on) return;
      var v = r.p.clone().project(x.cam);
      r.e.style.left = ((v.x * 0.5 + 0.5) * w) + "px"; r.e.style.top = ((-v.y * 0.5 + 0.5) * h) + "px";
    });
  }

  function laco() {
    var x = st; if (!x || !x.ativo) return;
    var dt = Math.min(x.relogio.getDelta(), 0.05);
    x.t += dt;
    /* transição medida em tempo real (não em quadros): termina em ~1,6 s mesmo em renderizadores lentos */
    if (x.tmov < 1) x.tmov = Math.min(1, (performance.now() - x.tIni) / 1600);
    desenhar();
    if (x.tmov >= 1 && x.parar) { x.ativo = false; return; }
    x.raf = requestAnimationFrame(laco);
  }

  A.visivel = function (v) {
    if (!st) return;
    st.visivel = v;
    if (v && !st.ativo && !U.reduzido()) { st.ativo = true; st.relogio.getDelta(); st.raf = requestAnimationFrame(laco); }
    else if (!v) { st.ativo = false; cancelAnimationFrame(st.raf); }
    if (v) desenhar();
  };
  A.movimentoMudou = function () {
    if (!st) return;
    if (U.reduzido()) { st.ativo = false; cancelAnimationFrame(st.raf); st.tmov = 1; desenhar(); }
    else if (st.visivel) { st.ativo = false; A.visivel(true); }
  };
  A.total = N;
})();
