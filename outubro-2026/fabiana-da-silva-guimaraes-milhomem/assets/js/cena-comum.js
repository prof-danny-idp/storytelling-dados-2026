/* Biblioteca de cena compartilhada: materiais, texturas procedurais, peças bisotadas, agente de IA e pessoa auditora.
   Direção de arte "Da pedra à luz" (docs/REVISAO_DIRECAO_DE_ARTE.md). Sem partículas nem brilhos decorativos:
   a única emissão é a do que representa verificação (aberturas dos requisitos) e a lente do agente. */
(function () {
  var K = (window.CenaComum = {});

  /* textura procedural de grão (pedra): evita superfícies chapadas */
  K.grao = function (T, base, amp, tam, estrias, rep) {
    var c = document.createElement("canvas"); c.width = c.height = tam || 256;
    var x = c.getContext("2d"), w = c.width, i, n;
    x.fillStyle = base; x.fillRect(0, 0, w, w);
    var seed = 7; function r() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    n = w * w / 6;
    for (i = 0; i < n; i++) {
      var v = Math.round((r() - 0.5) * 2 * amp), a = 0.35 + r() * 0.4;
      x.fillStyle = v > 0 ? "rgba(255,255,255," + (a * v / 255 * 2.2).toFixed(3) + ")" : "rgba(0,0,0," + (a * -v / 255 * 2.2).toFixed(3) + ")";
      x.fillRect(r() * w, r() * w, 1 + r() * 1.2, 1 + r() * 1.2);
    }
    if (estrias) {
      for (i = 0; i < 26; i++) {
        x.strokeStyle = "rgba(" + (r() > 0.5 ? "255,255,255" : "0,0,0") + "," + (0.025 + r() * 0.04).toFixed(3) + ")";
        x.lineWidth = 1 + r() * 2.5; x.beginPath();
        var y0 = r() * w; x.moveTo(0, y0); x.bezierCurveTo(w * 0.3, y0 + (r() - 0.5) * 18, w * 0.7, y0 + (r() - 0.5) * 18, w, y0 + (r() - 0.5) * 10); x.stroke();
      }
    }
    var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.encoding = T.sRGBEncoding;
    if (rep) t.repeat.set(rep[0], rep[1]);
    t.anisotropy = 4; return t;
  };

  K.materiais = function (T) {
    var P = function (o) { return new T.MeshStandardMaterial(o); };
    return {
      basalto: P({ color: 0x3a4148, roughness: 0.82, map: K.grao(T, "#ffffff", 30, 256, true) }),
      parede: P({ color: 0x30363c, roughness: 0.9, map: K.grao(T, "#ffffff", 22, 256, true, [10, 4]) }),
      piso: P({ color: 0x2b3137, roughness: 0.78, map: K.grao(T, "#ffffff", 24, 256, true, [30, 30]) }),
      calcario: P({ color: 0xcdc6b6, roughness: 0.9, map: K.grao(T, "#ffffff", 30, 256, true) }),
      calcarioEsc: P({ color: 0xb9b1a0, roughness: 0.92, map: K.grao(T, "#ffffff", 34, 256, true) }),
      latao: P({ color: 0xc8993a, roughness: 0.36, metalness: 0.7 }),
      grafite: P({ color: 0x20252a, roughness: 0.55, metalness: 0.35 }),
      ceramica: P({ color: 0xf1f0ec, roughness: 0.3 }),
      visor: P({ color: 0x0c1417, roughness: 0.15, metalness: 0.4 }),
      lente: P({ color: 0x0c3a3b, emissive: 0x39c2b8, emissiveIntensity: 0.85, roughness: 0.2 }),
      teal: P({ color: 0x1f7a7e, roughness: 0.5 }),
      indigo: P({ color: 0x5565ad, roughness: 0.5 }),
      ferrugem: P({ color: 0xb85a30, roughness: 0.55 }),
      papel: P({ color: 0xeee9dc, roughness: 0.9 }),
      vidro: new T.MeshStandardMaterial({ color: 0xcfe3e6, transparent: true, opacity: 0.22, roughness: 0.08, metalness: 0.1, depthWrite: false }),
      pele: P({ color: 0xb98563, roughness: 0.75 }),
      cabelo: P({ color: 0x1d1a19, roughness: 0.8 }),
      roupa: P({ color: 0x2f4a58, roughness: 0.8 })
    };
  };

  /* caixa bisotada: dá "peso" e arestas que pegam luz (nada de caixas de aresta viva) */
  K.laje = function (T, w, h, d, b, mat) {
    b = Math.min(b, w / 2.2, h / 2.2, d / 2.2);
    var s = new T.Shape(), x = w / 2 - b, y = h / 2 - b;
    s.moveTo(-x, -y); s.lineTo(x, -y); s.lineTo(x, y); s.lineTo(-x, y); s.closePath();
    var g = new T.ExtrudeGeometry(s, { depth: Math.max(0.0001, d - 2 * b), bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelOffset: 0, bevelSegments: 2, curveSegments: 1 });
    g.translate(0, 0, -(d - 2 * b) / 2);
    var m = new T.Mesh(g, mat); m.castShadow = true; m.receiveShadow = true; return m;
  };
  K.caixa = function (T, w, h, d, mat, x, y, z) {
    var m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x || 0, y || 0, z || 0);
    m.castShadow = true; m.receiveShadow = true; return m;
  };
  /* moldura com abertura (portal): formato exterior e interior arbitrários */
  K.moldura = function (T, ext, int, prof, mat) {
    var s = new T.Shape(ext), h = (int instanceof T.Path) ? int : new T.Path(int); s.holes.push(h);
    var g = new T.ExtrudeGeometry(s, { depth: prof, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2, curveSegments: 18 });
    g.translate(0, 0, -prof / 2);
    var m = new T.Mesh(g, mat); m.castShadow = true; m.receiveShadow = true; return m;
  };
  function poly(pts) { return pts.map(function (p) { return new window.THREE.Vector2(p[0], p[1]); }); }
  K.poly = poly;

  /* requisito verificável: placa bisotada + borda colorida + abertura de latão (o "verificável") */
  K.placa = function (T, M, corMat, esc) {
    var g = new T.Group();
    g.add(K.laje(T, 0.95, 1.5, 0.14, 0.035, M.calcario));
    var topo = K.laje(T, 0.95, 0.16, 0.17, 0.03, corMat); topo.position.set(0, 0.66, 0); g.add(topo);
    for (var q = 0; q < 3; q++) {
      var l = K.caixa(T, 0.52 - q * 0.08, 0.035, 0.012, M.grafite, -0.12 - q * 0.04, 0.3 - q * 0.17, 0.077); l.castShadow = false; g.add(l);
    }
    var aro = new T.Mesh(new T.TorusGeometry(0.15, 0.028, 10, 36), M.latao); aro.position.set(0, -0.38, 0.08); aro.castShadow = true; g.add(aro);
    var nuc = new T.Mesh(new T.CircleGeometry(0.12, 24), new T.MeshStandardMaterial({ color: 0x3a3320, emissive: 0xffc860, emissiveIntensity: 0, roughness: 0.6 }));
    nuc.position.set(0, -0.38, 0.075); g.add(nuc);
    g.userData.abertura = nuc.material;
    if (esc) g.scale.setScalar(esc);
    return g;
  };

  /* estela da norma: monólito bisotado com painel de basalto embutido; requisitos = ranhuras (cor = critério) */
  K.estela = function (T, M, nA, nB) {
    var g = new T.Group(), total = nA + nB;
    var base = K.laje(T, 3.2, 0.34, 1.7, 0.05, M.basalto); base.position.y = 0.17; g.add(base);
    var corpo = K.laje(T, 2.5, 6.4, 0.9, 0.07, M.calcario); corpo.position.y = 0.34 + 3.2; g.add(corpo);
    var cap = K.laje(T, 2.62, 0.14, 1.02, 0.04, M.latao); cap.position.y = 0.34 + 6.4 + 0.07; g.add(cap);
    /* cabeçalho gravado (abstrato) */
    var faixa = K.laje(T, 1.9, 0.16, 0.05, 0.015, M.latao); faixa.position.set(0, 6.05, 0.45); g.add(faixa);
    for (var i = 0; i < 3; i++) {
      var l = K.caixa(T, 1.9 - i * 0.5, 0.05, 0.02, M.calcarioEsc, -0.0 - i * 0.12 - 0.0, 5.7 - i * 0.16, 0.46); l.position.x = -0.95 + (1.9 - i * 0.5) / 2; l.castShadow = false; g.add(l);
    }
    var painel = K.laje(T, 1.95, 4.3, 0.06, 0.02, M.grafite); painel.position.set(0, 3.1, 0.45); g.add(painel);
    g.userData.ranhuras = [];
    for (var k = 0; k < total; k++) {
      var y = 4.95 - k * 0.4, cor = k < nA ? 0x14a39a : 0x5a6cdc;
      var mat = new T.MeshStandardMaterial({ color: 0x3a4148, roughness: 0.6, emissive: cor, emissiveIntensity: 0 });
      var r = K.caixa(T, 1.55, 0.15, 0.04, mat, 0, y + 0.0, 0.5); r.castShadow = false;
      g.add(r); g.userData.ranhuras.push({ mat: mat, y: y, cor: cor, grupo: k < nA ? 0 : 1 });
    }
    return g;
  };

  /* agente de IA generativa (recorrente): cerâmica branca + lente. Nunca decide: só localiza e organiza */
  K.robo = function (T, M) {
    var g = new T.Group(), P = function (geo, mat, x, y, z) { var m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
    P(new T.CapsuleGeometry(0.34, 0.5, 6, 18), M.ceramica, 0, 1.0, 0);
    var cab = P(new T.SphereGeometry(0.31, 28, 18), M.ceramica, 0, 1.78, 0); cab.scale.set(1.05, 0.86, 1);
    var vis = P(new T.SphereGeometry(0.235, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), M.visor, 0, 1.78, 0.04);
    vis.rotation.x = Math.PI / 2; vis.scale.set(1, 0.7, 1); vis.position.z = 0.14;
    P(new T.CircleGeometry(0.085, 24), M.lente, 0, 1.79, 0.337);
    P(new T.CylinderGeometry(0.012, 0.012, 0.3, 8), M.grafite, 0.12, 2.15, 0);
    P(new T.SphereGeometry(0.045, 12, 8), M.lente, 0.12, 2.32, 0);
    var anel = P(new T.TorusGeometry(0.4, 0.035, 10, 36), M.grafite, 0, 0.38, 0); anel.rotation.x = Math.PI / 2;
    P(new T.CylinderGeometry(0.2, 0.34, 0.28, 24), M.ceramica, 0, 0.52, 0);
    function braco(lado) {
      var b = new T.Group(); b.position.set(0.44 * lado, 1.28, 0); g.add(b);
      var o = new T.Mesh(new T.SphereGeometry(0.1, 14, 10), M.grafite); o.castShadow = true; b.add(o);
      var u = new T.Mesh(new T.CapsuleGeometry(0.07, 0.34, 4, 10), M.ceramica); u.position.set(0.04 * lado, -0.23, 0.04); u.rotation.x = -0.35; u.castShadow = true; b.add(u);
      var a = new T.Mesh(new T.CapsuleGeometry(0.06, 0.32, 4, 10), M.ceramica); a.position.set(0.05 * lado, -0.42, 0.28); a.rotation.x = -1.15; a.castShadow = true; b.add(a);
      return b;
    }
    g.userData.bracos = [braco(1), braco(-1)];
    return g;
  };

  /* pessoa auditora: figura estilizada, material próprio (argila/roupa), lente de leitura crítica */
  K.pessoa = function (T, M) {
    var g = new T.Group(), P = function (geo, mat, x, y, z) { var m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
    P(new T.CapsuleGeometry(0.19, 0.72, 6, 16), M.roupa, -0.15, 0.62, 0);
    P(new T.CapsuleGeometry(0.19, 0.72, 6, 16), M.roupa, 0.15, 0.62, 0);
    var torso = P(new T.CapsuleGeometry(0.34, 0.62, 8, 20), M.roupa, 0, 1.55, 0); torso.scale.set(1.12, 1, 0.78);
    P(new T.CylinderGeometry(0.09, 0.11, 0.14, 12), M.pele, 0, 2.18, 0);
    P(new T.SphereGeometry(0.255, 28, 20), M.pele, 0, 2.42, 0);
    var cab = P(new T.SphereGeometry(0.27, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.58), M.cabelo, 0, 2.45, -0.02); cab.rotation.x = -0.25;
    P(new T.SphereGeometry(0.1, 12, 8), M.roupa, 0.44, 1.9, 0);
    P(new T.SphereGeometry(0.1, 12, 8), M.roupa, -0.44, 1.9, 0);
    var ce = P(new T.CapsuleGeometry(0.075, 0.5, 4, 10), M.roupa, -0.52, 1.55, 0.05); ce.rotation.x = -0.2;
    var cd = P(new T.CapsuleGeometry(0.075, 0.48, 4, 10), M.roupa, 0.56, 1.6, 0.34); cd.rotation.set(-1.15, 0, -0.15);
    var lente = new T.Group(); lente.position.set(0.6, 1.55, 0.82); g.add(lente);
    var aro = new T.Mesh(new T.TorusGeometry(0.32, 0.04, 12, 40), M.latao); aro.castShadow = true; lente.add(aro);
    var disco = new T.Mesh(new T.CircleGeometry(0.3, 32), M.vidro); lente.add(disco);
    var cabo = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.5, 8), M.latao); cabo.position.set(-0.2, -0.45, 0); cabo.rotation.z = -0.45; lente.add(cabo);
    lente.rotation.x = -0.9;
    g.userData.lente = lente;
    return g;
  };
})();
