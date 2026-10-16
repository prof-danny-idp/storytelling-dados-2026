/* Painéis de Resultados (Recall_item, Cobertura_evidência, Precisão_evidência) e Síntese.
   Cada métrica responde a uma pergunta e usa uma forma própria: pontos por item (Recall), pilhas por repetição (Cobertura),
   barras proporcionais ao nº de evidências reportadas (Precisão). Todos os números derivam de window.DADOS. */
(function () {
  var G = (window.Graficos = {});
  var D = window.DADOS, I = D.instituicoes, ORD = D.ordem, REP = D.repeticoes;
  var f = U.fmt, p = U.pct, esc = U.esc;
  var COMP_POR_REP = 14; /* componentes esperados por repetição: 140 ÷ 10 (Tabela 3) */
  var FUNDO = { recall: "var(--f-recall)", cobertura: "var(--f-cobertura)", precisao: "var(--f-precisao)" };
  var LUZ = { recall: "var(--l-recall)", cobertura: "var(--l-cobertura)", precisao: "var(--l-precisao)" };

  function soma(a) { return a.reduce(function (s, v) { return s + v; }, 0); }
  function fim(txt) { return /[.!?]$/.test(txt.trim()) ? txt.trim() : txt.trim() + "."; }

  function faixa(chave, pergunta, definicao, extra) {
    var m = U.metricas[chave];
    return '<div class="faixa" style="--fundo:' + FUNDO[chave] + ';--luz:' + LUZ[chave] + '"><div class="faixa__in">' +
      '<div><p class="sobretitulo">Pergunta ' + ({ recall: 1, cobertura: 2, precisao: 3 })[chave] + ' de 3</p><h2>' + esc(m.nome) + '</h2><p class="pergunta-m">' + esc(pergunta) + '</p></div>' +
      '<div class="definicao"><strong>Definição na pesquisa</strong>' + esc(fim(definicao)) + (extra && definicao.indexOf(extra.replace(/\.$/, '')) < 0 ? '<br><span class="sec">' + esc(extra) + '</span>' : '') + '</div></div></div>';
  }

  /* Recall_item: 10 repetições (linhas) × 10 itens (pontos) por instituição */
  function pontos(linhas, cor, rotulo) {
    var c = 14, w = 10 * c, h = linhas.length * c, out = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(rotulo) + '" focusable="false">';
    linhas.forEach(function (n, r) {
      for (var j = 0; j < 10; j++) {
        var cx = j * c + c / 2, cy = r * c + c / 2;
        out += j < n ? '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="' + cor + '"/>'
                     : '<circle cx="' + cx + '" cy="' + cy + '" r="4.2" fill="none" stroke="#5c656c" stroke-width="1.3"/>';
      }
    });
    return out + '</svg>';
  }
  /* Cobertura: uma pilha de 14 componentes por repetição (coluna); a pilha cresce de baixo para cima */
  function pilhas(linhas, cor, rotulo) {
    var cw = 12, ch = 9, gx = 3, gy = 2, W = 10 * (cw + gx) - gx, H = COMP_POR_REP * (ch + gy) - gy;
    var out = '<svg viewBox="0 0 ' + W + ' ' + (H + 16) + '" role="img" aria-label="' + esc(rotulo) + '" focusable="false">';
    linhas.forEach(function (n, r) {
      for (var j = 0; j < COMP_POR_REP; j++) {
        var y = H - (j + 1) * (ch + gy) + gy, x = r * (cw + gx);
        out += j < n ? '<rect x="' + x + '" y="' + y + '" width="' + cw + '" height="' + ch + '" fill="' + cor + '"/>'
                     : '<rect x="' + (x + 0.6) + '" y="' + (y + 0.6) + '" width="' + (cw - 1.2) + '" height="' + (ch - 1.2) + '" fill="none" stroke="#5c656c" stroke-width="1"/>';
      }
      out += '<text x="' + (r * (cw + gx) + cw / 2) + '" y="' + (H + 12) + '" text-anchor="middle" font-family="Plex Mono, monospace" font-size="7" fill="#5c656c">' + r + '</text>';
    });
    return out + '</svg>';
  }

  function painelRecall() {
    var m = U.metricas.recall;
    var html = '<div class="painel">' + faixa("recall", "Os itens normativos esperados foram identificados como atendidos?", D.definicoes.Recall_item, "FNR_item = 1 − Recall_item.") +
      '<div class="corpo-painel" style="--c:' + m.cor + '"><div class="multiplos">';
    ORD.forEach(function (k) {
      var d = I[k], r = REP[k];
      html += '<div class="multiplo"><h3>' + k + '</h3><div class="valor">' + p(d.recall_item) + '</div>' +
        '<div class="fracao">' + d.itens_satisfeitos + '/' + d.itens_esperados + ' itens · FNR_item ' + p(d.fnr_item) + '</div>' +
        '<p class="leg">Repetições sem omissão: ' + esc(d.recall_estatisticas.repeticoes_sem_omissao) + '</p>' +
        pontos(r.itens, m.cor, k + ': ' + d.itens_satisfeitos + ' de ' + d.itens_esperados + ' itens satisfeitos, por repetição') + '</div>';
    });
    html += '</div>' +
      '<ul class="chave" style="--c:' + m.cor + '"><li><i style="background:' + m.cor + ';border-radius:50%"></i>item satisfeito</li><li><i style="border-radius:50%"></i>item não satisfeito</li><li>Cada linha é uma repetição (Rep. 0 a Rep. 9); cada ponto, um dos 10 itens.</li></ul>' +
      '<div class="leitura-grafico"><div><h3>O que os dados mostram</h3><p>Em STF, TJDFT e TST, os 10 itens foram satisfeitos nas 10 repetições. No CNJ, 93 de 100 itens foram satisfeitos; as omissões ocorreram nas repetições 2, 3 e 4 (7, 9 e 7 itens de 10).</p></div>' +
      '<div><h3>Onde estão as omissões do CNJ</h3><p>Recall médio por critério no CNJ: <strong>IN84-27-CAPUT ' + p(I.CNJ.recall_por_criterio["IN84-27-CAPUT"].media) + '</strong> e <strong>PNTP-12.1-12.2-SIC ' + p(I.CNJ.recall_por_criterio["PNTP-12.1-12.2-SIC"].media) + '</strong>. As omissões concentram-se no critério do SIC.</p></div></div>' +
      '<p class="nota">A posição do item não satisfeito dentro da repetição não consta nas fontes; o gráfico preenche da esquerda para a direita e mostra apenas a contagem por repetição.</p>' +
      '<div class="proximo"><span></span><a class="botao botao--primario" href="#resultados/cobertura">Próxima pergunta: Cobertura_evidência →</a></div></div></div>';
    return html;
  }

  function painelCobertura() {
    var m = U.metricas.cobertura, avisos = [];
    var html = '<div class="painel">' + faixa("cobertura", "Das evidências de referência, quantas foram localizadas e salvas?", D.definicoes.Cobertura_evidencia_texto_exibicao, "Não é o Recall_item (que mede itens/requisitos).") +
      '<div class="corpo-painel" style="--c:' + m.cor + '"><div class="multiplos">';
    ORD.forEach(function (k) {
      var d = I[k], linhas = REP[k].cobertura.map(function (v) { return Math.round(v / 100 * COMP_POR_REP); });
      var total = soma(linhas);
      if (total !== d.componentes_encontrados) avisos.push(k + ': soma por repetição ' + total + ' ≠ ' + d.componentes_encontrados);
      html += '<div class="multiplo"><h3>' + k + '</h3><div class="valor">' + p(d.cobertura_evidencia) + '</div>' +
        '<div class="fracao">' + d.componentes_encontrados + '/' + d.componentes_esperados + ' componentes</div>' +
        pilhas(linhas, m.cor, k + ': ' + d.componentes_encontrados + ' de ' + d.componentes_esperados + ' componentes de evidência localizados, por repetição') + '</div>';
    });
    html += '</div>' +
      '<ul class="chave" style="--c:' + m.cor + '"><li><i style="background:' + m.cor + '"></i>componente localizado e salvo</li><li><i></i>componente esperado não localizado</li><li>Cada coluna é uma repetição (0 a 9); cada pilha tem os 14 componentes esperados.</li></ul>' +
      '<div class="leitura-grafico"><div><h3>O que os dados mostram</h3><p>STF, TJDFT e TST localizaram os 140 componentes esperados (14 por repetição). O CNJ localizou 133 de 140: 11 de 14 nas repetições 2 e 4 e 13 de 14 na repetição 3.</p></div>' +
      '<div><h3>Como interpretar</h3><p>Cobertura de 100% indica que os componentes previstos no gabarito foram encontrados; <strong>não</strong> informa se tudo o que foi reportado tem correspondência com o gabarito. Essa é a pergunta da métrica seguinte.</p></div></div>' +
      '<p class="nota">A posição do componente não localizado não consta nas fontes; as pilhas crescem de baixo para cima.' +
      (avisos.length ? ' <strong>Atenção — inconsistência detectada:</strong> ' + esc(avisos.join('; ')) : '') + '</p>' +
      '<div class="proximo"><a class="botao" href="#resultados/recall">← Recall_item</a><a class="botao botao--primario" href="#resultados/precisao">Próxima pergunta: Precisão_evidência →</a></div></div></div>';
    return html;
  }

  function painelPrecisao() {
    var m = U.metricas.precisao, max = Math.max.apply(null, ORD.map(function (k) { return I[k].evidencias_reportadas; }));
    var html = '<div class="painel">' + faixa("precisao", "Das evidências reportadas, quantas têm correspondência direta com o gabarito?", D.definicoes.Precisao_evidencia, D.definicoes.ressalva) +
      '<div class="corpo-painel" style="--c:' + m.cor + '"><div class="barras">';
    ORD.forEach(function (k) {
      var d = I[k], larg = 100 * d.evidencias_reportadas / max, pc = 100 * d.evidencias_com_correspondencia / d.evidencias_reportadas;
      html += '<div class="barra-linha"><h3>' + k + '</h3><div>' +
        '<div style="display:flex;align-items:baseline;gap:18px;flex-wrap:wrap"><span class="valor">' + p(d.precisao_evidencia) + '</span>' +
        '<span class="fracao">' + d.evidencias_com_correspondencia + '/' + d.evidencias_reportadas + ' evidências reportadas · amplitude entre repetições ' + f(d.precisao_amplitude_pp) + ' p.p.</span></div>' +
        '<div class="barra" style="width:' + larg.toFixed(2) + '%" role="img" aria-label="' + k + ': ' + d.evidencias_com_correspondencia + ' com correspondência direta e ' + (d.evidencias_reportadas - d.evidencias_com_correspondencia) + ' sem correspondência direta, de ' + d.evidencias_reportadas + ' reportadas">' +
        '<span class="barra__c" style="width:' + pc.toFixed(2) + '%"></span><span class="barra__s"></span></div></div></div>';
    });
    html += '</div><ul class="chave" style="--c:' + m.cor + '"><li><i style="background:' + m.cor + '"></i>com correspondência direta</li><li><i style="background:repeating-linear-gradient(45deg,#e6e2d8,#e6e2d8 3px,#8c8573 3px,#8c8573 4px);border-color:#8c8573"></i>sem correspondência direta</li><li>O comprimento total da barra é proporcional ao número de evidências reportadas (máx. ' + max + ').</li></ul>' +
      '<div class="leitura-grafico"><div><h3>Como interpretar</h3><p>A parte hachurada <strong>não</strong> significa evidência falsa: significa que não houve correspondência direta com o gabarito positivo fechado. A leitura crítica dessas evidências cabe à pessoa auditora.</p></div>' +
      '<div><h3>Como foi calculada</h3><p>Contagens agregadas (numerador ÷ denominador somados nas 10 repetições), não média de percentuais.</p></div></div>' +
      '<div class="tabela-rolavel"><table class="tabela"><caption>Sensibilidade ao limiar de correspondência textual — Precisão_evidência (%)</caption><thead><tr><th>Instituição</th>' +
      D.sensibilidade.limiares.map(function (l) { return '<th class="num">' + f(l, 2) + '</th>'; }).join('') + '<th class="num">Variação máx. (p.p.)</th></tr></thead><tbody>' +
      ORD.map(function (k) {
        return '<tr><th scope="row">' + k + '</th>' + D.sensibilidade[k].map(function (v) { return '<td class="num">' + f(v, 2) + '</td>'; }).join('') +
          '<td class="num">' + f(D.sensibilidade.variacao_maxima_pp[k], 2) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="nota"><strong>Por que 0,75.</strong> O limiar de correspondência textual foi fixado em 0,75, acima da faixa de similaridade (cerca de 0,6 a 0,7) em que nomes de peças distintas com prefixo comum, como “Relatório de Gestão” e “Relatório de Auditoria”, tendem a se confundir.<br>' +
      '<strong>Teste de sensibilidade.</strong> O framework foi avaliado também com 0,80, 0,85 e 0,90, mantidas constantes as demais condições: Recall_item e Cobertura_evidência não se alteraram, e a Precisão_evidência variou apenas no CNJ (−0,93 p.p.) e no TST (−0,23 p.p.), na passagem de 0,75 para 0,80. O resultado vale apenas para as condições analisadas.</p>' +
      '<div class="proximo"><a class="botao" href="#resultados/cobertura">← Cobertura_evidência</a><a class="botao botao--primario" href="#resultados/sintese">Ler a síntese interpretativa →</a></div></div></div>';
    return html;
  }

  function painelSintese() {
    var tj = I.TJDFT, cnj = I.CNJ, tres100 = ORD.filter(function (k) { return I[k].recall_item === 100; });
    return '<div class="painel sintese">' +
      '<div class="faixa faixa--sintese"><div class="faixa__in"><div><p class="sobretitulo">Síntese interpretativa</p><h2>100% não é o mesmo que evidência perfeita</h2></div>' +
      '<p class="achado">' + tres100.join(', ') + ' alcançaram Recall_item e Cobertura_evidência de 100%; ainda assim, entre essas instituições a Precisão_evidência variou de ' +
        p(Math.min.apply(null, tres100.map(function (k) { return I[k].precisao_evidencia; }))) + ' a ' +
        p(Math.max.apply(null, tres100.map(function (k) { return I[k].precisao_evidencia; }))) + '.</p></div></div>' +
      '<div class="corpo-painel"><div class="tres">' +
      '<div style="--c:' + U.metricas.recall.cor + '"><div><p class="sobretitulo" style="color:var(--m-recall)">1 · Os itens foram atendidos?</p><h3>Sim, com uma exceção</h3></div><p>' + tres100.length + ' de 4 instituições com Recall_item de 100% nas 10 repetições. No CNJ, ' + p(cnj.recall_item) + ' (' + cnj.itens_satisfeitos + '/' + cnj.itens_esperados + ').</p></div>' +
      '<div style="--c:' + U.metricas.cobertura.cor + '"><div><p class="sobretitulo" style="color:var(--m-cobertura)">2 · As evidências esperadas foram achadas?</p><h3>Sim, com a mesma exceção</h3></div><p>Cobertura_evidência de 100% em ' + tres100.length + ' instituições; no CNJ, ' + cnj.componentes_encontrados + '/' + cnj.componentes_esperados + ' (' + p(cnj.cobertura_evidencia) + ').</p></div>' +
      '<div style="--c:' + U.metricas.precisao.cor + '"><div><p class="sobretitulo" style="color:var(--m-precisao)">3 · O que foi reportado confere?</p><h3>Depende do gabarito</h3></div><p>' + tj.evidencias_com_correspondencia + ' de ' + tj.evidencias_reportadas + ' evidências do TJDFT têm correspondência direta com o gabarito (' + p(tj.precisao_evidencia) + '). As demais, sem correspondência direta, exigem leitura humana.</p></div></div>' +
      '<div class="limites-duas"><div class="limites"><h3>Um caso que pede olhar humano</h3><p>' + esc(D.caso_cnj.cnj_omissao) + ' <span style="color:var(--mudo)">(' + esc(D.caso_cnj.fonte) + ')</span></p></div>' +
      '<div class="limites"><h3>Limites da leitura</h3><ul>' +
      '<li>Resultados descritivos, sem teste de significância e sem generalização para o Poder Judiciário brasileiro.</li>' +
      '<li>Um modelo (' + esc(D.experimento.modelo) + ', Reasoning = ' + esc(D.experimento.reasoning) + '), quatro instituições, ' + D.experimento.execucoes_total + ' execuções e dois critérios normativos.</li>' +
      '<li>A precisão depende do gabarito positivo fechado: evidência sem correspondência direta não é automaticamente falsa.</li>' +
      '<li>A arquitetura apoia a auditoria de conformidade; não a substitui nem certifica conformidade por conta própria.</li></ul></div></div>' +
      '<div class="proximo"><a class="botao" href="#resultados/precisao">← Precisão_evidência</a><a class="botao botao--primario" href="#execucoes">Explorar as 40 execuções →</a></div></div></div>';
  }

  G.render = function () {
    document.getElementById("p-recall").innerHTML = painelRecall();
    document.getElementById("p-cobertura").innerHTML = painelCobertura();
    document.getElementById("p-precisao").innerHTML = painelPrecisao();
    document.getElementById("p-sintese").innerHTML = painelSintese();
  };
})();
