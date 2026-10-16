/* Área "40 execuções": mapa de calor 4 × 10 + tabelas + painel contextual, com seleção integrada.
   Dados: DADOS.repeticoes (Rep. 0–9). Escala por métrica = intervalo observado; não é limiar de desempenho. */
(function () {
  var M = (window.MapaExec = {});
  var D = window.DADOS, ORD = D.ordem, REP = D.repeticoes, I = D.instituicoes;
  var f = U.fmt, esc = U.esc;
  var S = { metrica: "recall", inst: "CNJ", rep: 2, estreito: false };
  var SERIE = { recall: "recall", cobertura: "cobertura", precisao: "precisao" };
  var BASE = [244, 240, 232];

  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function dominio(m) {
    var v = [];
    ORD.forEach(function (k) { REP[k][SERIE[m]].forEach(function (x) { v.push(x); }); });
    return [Math.min.apply(null, v), Math.max.apply(null, v)];
  }
  function cor(m, v) {
    var d = dominio(m), alvo = hex(U.metricas[m].cor);
    var t = d[1] === d[0] ? 1 : (v - d[0]) / (d[1] - d[0]);
    t = 0.12 + 0.88 * U.clamp(t, 0, 1);
    var rgb = [0, 1, 2].map(function (i) { return Math.round(BASE[i] + (alvo[i] - BASE[i]) * t); });
    var lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return { bg: "rgb(" + rgb.join(",") + ")", fg: lum > 0.56 ? "#1c2226" : "#ffffff" };
  }
  function rotuloVal(v) { return v % 1 === 0 ? String(v) : f(v, 1); }

  function legenda() {
    var d = dominio(S.metrica), c0 = cor(S.metrica, d[0]).bg, c1 = cor(S.metrica, d[1]).bg;
    document.getElementById("legenda-mapa").innerHTML =
      '<strong>' + esc(U.metricas[S.metrica].nome) + ' (%)</strong>' +
      '<div class="legenda__barra" style="background:linear-gradient(90deg,' + c0 + ',' + c1 + ')"></div>' +
      '<div class="legenda__escala"><span>' + rotuloVal(d[0]) + '%</span><span>' + rotuloVal(d[1]) + '%</span></div>' +
      '<span>Escala relativa ao intervalo observado nas 40 execuções; as cores não indicam classificação de desempenho.</span>';
  }

  function mapa() {
    var el = document.getElementById("mapa"), m = S.metrica, e = S.estreito;
    var linhas = e ? D.repeticoes.CNJ.recall.map(function (_, i) { return i; }) : ORD;
    var cols = e ? ORD : D.repeticoes.CNJ.recall.map(function (_, i) { return i; });
    el.style.gridTemplateColumns = (e ? "3.2rem" : "4.6rem") + " repeat(" + cols.length + ", minmax(0,1fr))";
    var h = '<div role="row" style="display:contents"><span role="columnheader" class="mapa__cab" style="cursor:default"></span>';
    cols.forEach(function (c) {
      h += '<button role="columnheader" type="button" class="mapa__cab" data-col="' + c + '" aria-pressed="' + (e ? S.inst === c : S.rep === c) + '" aria-label="' + (e ? esc(c) : 'Repetição ' + c) + '">' + (e ? c : 'Rep. ' + c) + '</button>';
    });
    h += '</div>';
    linhas.forEach(function (l) {
      var inst = e ? null : l, rep = e ? l : null;
      h += '<div role="row" style="display:contents"><button role="rowheader" type="button" class="mapa__rot" data-lin="' + l + '" aria-pressed="' + (e ? S.rep === rep : S.inst === inst) + '" aria-label="' + (e ? 'Repetição ' + l : esc(l)) + '">' + (e ? 'Rep. ' + l : l) + '</button>';
      cols.forEach(function (c) {
        var k = e ? c : l, r = e ? l : c, v = REP[k][SERIE[m]][r];
        var sel = S.inst === k && S.rep === r;
        var cc = v == null ? null : cor(m, v);
        h += '<button role="gridcell" type="button" class="mapa__celula' + (v == null ? ' sem-dado' : '') +
          (S.inst === k ? ' is-linha' : '') + (S.rep === r ? ' is-coluna' : '') + '" data-inst="' + k + '" data-rep="' + r + '" aria-selected="' + sel + '" tabindex="' + (sel ? 0 : -1) + '"' +
          ' style="' + (cc ? '--bg:' + cc.bg + ';--fg:' + cc.fg : '') + '" aria-label="' + esc(k) + ', repetição ' + r + ', ' + esc(U.metricas[m].nome) + ': ' + (v == null ? 'sem dado' : f(v, 1) + '%') + '">' +
          (v == null ? '—' : rotuloVal(v)) + '</button>';
      });
      h += '</div>';
    });
    el.innerHTML = h;
    if (!el.querySelector('[tabindex="0"]')) { var p = el.querySelector(".mapa__celula"); if (p) p.tabIndex = 0; }
  }

  function tabela() {
    var r = REP, mt = U.metricas;
    var resumo = '<div class="tabela-rolavel"><table class="tabela"><caption>Resumo por instituição (10 repetições)</caption><thead><tr><th>Instituição</th><th class="num">Recall_item</th><th class="num">Cobertura_evidência</th><th class="num">Precisão_evidência</th></tr></thead><tbody>' +
      ORD.map(function (k) {
        var d = I[k];
        return '<tr class="' + (S.inst === k ? 'is-sel' : '') + '"><th scope="row"><button type="button" class="linha-btn" data-sel-inst="' + k + '" aria-pressed="' + (S.inst === k) + '">' + k + '</button></th>' +
          '<td class="num">' + f(d.recall_item) + '% <small>(' + d.itens_satisfeitos + '/' + d.itens_esperados + ')</small></td>' +
          '<td class="num">' + f(d.cobertura_evidencia) + '% <small>(' + d.componentes_encontrados + '/' + d.componentes_esperados + ')</small></td>' +
          '<td class="num">' + f(d.precisao_evidencia) + '% <small>(' + d.evidencias_com_correspondencia + '/' + d.evidencias_reportadas + ')</small></td></tr>';
      }).join('') + '</tbody></table></div>';
    var detalhe = '';
    if (S.inst) {
      var k = S.inst;
      detalhe = '<div class="tabela-rolavel" style="margin-top:22px"><table class="tabela"><caption>' + esc(k) + ' — por repetição</caption><thead><tr><th>Rep.</th><th class="num">Itens (de 10)</th><th class="num">Recall_item</th><th class="num">Cobertura_evidência</th><th class="num">Precisão_evidência</th></tr></thead><tbody>' +
        r[k].recall.map(function (_, i) {
          return '<tr class="' + (S.rep === i ? 'is-sel' : '') + '"><th scope="row"><button type="button" class="linha-btn" data-sel-rep="' + i + '" aria-pressed="' + (S.rep === i) + '">Rep. ' + i + '</button></th>' +
            '<td class="num">' + r[k].itens[i] + '</td><td class="num">' + f(r[k].recall[i]) + '%</td><td class="num">' + f(r[k].cobertura[i]) + '%</td><td class="num">' + f(r[k].precisao[i]) + '%</td></tr>';
        }).join('') + '</tbody></table></div>';
    } else if (S.rep != null) {
      detalhe = '<div class="tabela-rolavel" style="margin-top:22px"><table class="tabela"><caption>Repetição ' + S.rep + ' — por instituição</caption><thead><tr><th>Instituição</th><th class="num">Itens (de 10)</th><th class="num">Recall_item</th><th class="num">Cobertura_evidência</th><th class="num">Precisão_evidência</th></tr></thead><tbody>' +
        ORD.map(function (k) {
          return '<tr><th scope="row"><button type="button" class="linha-btn" data-sel-cell="' + k + '">' + k + '</button></th><td class="num">' + r[k].itens[S.rep] + '</td><td class="num">' + f(r[k].recall[S.rep]) + '%</td><td class="num">' + f(r[k].cobertura[S.rep]) + '%</td><td class="num">' + f(r[k].precisao[S.rep]) + '%</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    document.getElementById("tabela-exec").innerHTML = resumo + detalhe;
  }

  function painel() {
    var el = document.getElementById("painel-exec"), k = S.inst, n = S.rep, r = REP;
    if (!k && n == null) {
      el.innerHTML = '<h3>Nenhuma seleção</h3><p class="vazio">Escolha uma célula, uma instituição ou uma repetição no mapa.</p>'; return;
    }
    if (k && n != null) {
      var cr = r[k].recall_criterio;
      el.innerHTML = '<p class="sobretitulo">Execução selecionada</p><h3>' + esc(k) + ' · Rep. ' + n + '</h3>' +
        '<dl><dt>Itens satisfeitos</dt><dd>' + r[k].itens[n] + ' de 10</dd>' +
        '<dt>Recall_item</dt><dd>' + f(r[k].recall[n]) + '%</dd>' +
        '<dt>FNR_item</dt><dd>' + f(r[k].fnr[n]) + '%</dd>' +
        '<dt>Cobertura_evidência</dt><dd>' + f(r[k].cobertura[n]) + '%</dd>' +
        '<dt>Precisão_evidência</dt><dd>' + f(r[k].precisao[n]) + '%</dd>' +
        '<dt>Recall · IN84-27-CAPUT</dt><dd>' + f(cr["IN84-27-CAPUT"][n]) + '%</dd>' +
        '<dt>Recall · PNTP-12.1-12.2-SIC</dt><dd>' + f(cr["PNTP-12.1-12.2-SIC"][n]) + '%</dd></dl>' +
        '<p class="vazio" style="margin-top:12px;font-size:.84rem">Contagem de evidências reportadas/corretas por repetição: não disponível nas fontes.</p>';
    } else if (k) {
      var d = I[k], pr = r[k].precisao;
      el.innerHTML = '<p class="sobretitulo">Instituição selecionada</p><h3>' + esc(k) + '</h3>' +
        '<dl><dt>Recall_item</dt><dd>' + f(d.recall_item) + '% (' + d.itens_satisfeitos + '/' + d.itens_esperados + ')</dd>' +
        '<dt>Cobertura_evidência</dt><dd>' + f(d.cobertura_evidencia) + '% (' + d.componentes_encontrados + '/' + d.componentes_esperados + ')</dd>' +
        '<dt>Precisão_evidência</dt><dd>' + f(d.precisao_evidencia) + '% (' + d.evidencias_com_correspondencia + '/' + d.evidencias_reportadas + ')</dd>' +
        '<dt>Precisão: mínimo–máximo</dt><dd>' + f(Math.min.apply(null, pr)) + '–' + f(Math.max.apply(null, pr)) + '%</dd>' +
        '<dt>Repetições sem omissão</dt><dd>' + esc(d.recall_estatisticas.repeticoes_sem_omissao) + '</dd></dl>';
    } else {
      el.innerHTML = '<p class="sobretitulo">Repetição selecionada</p><h3>Rep. ' + n + '</h3><dl>' +
        ORD.map(function (kk) {
          return '<dt>' + kk + '</dt><dd>' + f(r[kk][SERIE[S.metrica]][n]) + '%</dd>';
        }).join('') + '</dl><p class="vazio" style="margin-top:12px;font-size:.84rem">Métrica exibida: ' + esc(U.metricas[S.metrica].nome) + '.</p>';
    }
  }

  function notas() {
    document.getElementById("nota-exec").innerHTML =
      'Rep. 0 a Rep. 9 equivale à 1ª a 10ª execução. STF, TJDFT e TST tiveram 100% de Cobertura_evidência em todas as repetições. ' +
      'As séries por repetição do CNJ vêm do relatório do pipeline (comparativo.html) e não constam da dissertação; foram conferidas por consistência aritmética com os agregados, sem recomputação independente a partir dos dados brutos. ' +
      'A contagem de evidências por repetição não está disponível na fonte, que traz apenas o agregado das 10 repetições (ex.: 166/426 no TJDFT). ' +
      'Resultados descritivos; sem inferência estatística.';
  }

  function tudo() { legenda(); mapa(); tabela(); painel(); }
  function foco(k, r) {
    var c = document.querySelector('.mapa__celula[data-inst="' + k + '"][data-rep="' + r + '"]');
    if (c) c.focus();
  }

  M.iniciar = function () {
    var q = window.matchMedia("(max-width: 700px)");
    S.estreito = q.matches;
    var mapaEl = document.getElementById("mapa");
    q.addEventListener ? q.addEventListener("change", function (e) { S.estreito = e.matches; tudo(); }) : q.addListener(function (e) { S.estreito = e.matches; tudo(); });
    document.querySelectorAll('input[name="metrica"]').forEach(function (inp) {
      inp.addEventListener("change", function () { if (inp.checked) { S.metrica = inp.value; tudo(); } });
    });
    mapaEl.addEventListener("click", function (ev) {
      var b = ev.target.closest("button"); if (!b) return;
      if (b.classList.contains("mapa__celula")) { S.inst = b.dataset.inst; S.rep = Number(b.dataset.rep); }
      else if (b.classList.contains("mapa__rot")) {
        if (S.estreito) { S.rep = Number(b.dataset.lin); S.inst = null; }
        else { S.inst = b.dataset.lin; S.rep = null; }
      } else if (b.classList.contains("mapa__cab") && b.dataset.col != null) {
        if (S.estreito) { S.inst = b.dataset.col; S.rep = null; } else { S.rep = Number(b.dataset.col); S.inst = null; }
      }
      tudo();
    });
    mapaEl.addEventListener("keydown", function (ev) {
      var c = ev.target.closest(".mapa__celula"); if (!c) return;
      var k = c.dataset.inst, r = Number(c.dataset.rep), i = ORD.indexOf(k);
      var nr = REP[k].recall.length, dI = 0, dR = 0;
      if (ev.key === "ArrowRight") { S.estreito ? dI = 1 : dR = 1; }
      else if (ev.key === "ArrowLeft") { S.estreito ? dI = -1 : dR = -1; }
      else if (ev.key === "ArrowDown") { S.estreito ? dR = 1 : dI = 1; }
      else if (ev.key === "ArrowUp") { S.estreito ? dR = -1 : dI = -1; }
      else if (ev.key === "Home") { S.estreito ? (i = 0) : (r = 0); }
      else if (ev.key === "End") { S.estreito ? (i = ORD.length - 1) : (r = nr - 1); }
      else if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); S.inst = k; S.rep = r; tudo(); foco(k, r); return; }
      else return;
      ev.preventDefault();
      i = U.clamp(i + dI, 0, ORD.length - 1); r = U.clamp(r + dR, 0, nr - 1);
      S.inst = ORD[i]; S.rep = r; tudo(); foco(S.inst, r);
    });
    document.getElementById("tabela-exec").addEventListener("click", function (ev) {
      var b = ev.target.closest("button"); if (!b) return;
      if (b.dataset.selInst) { S.inst = b.dataset.selInst; if (S.rep == null) S.rep = 0; }
      else if (b.dataset.selRep != null) { S.rep = Number(b.dataset.selRep); }
      else if (b.dataset.selCell) { S.inst = b.dataset.selCell; }
      tudo();
    });
    tudo(); notas();
  };
  M.estado = function () { return { metrica: S.metrica, inst: S.inst, rep: S.rep, estreito: S.estreito }; };
})();
