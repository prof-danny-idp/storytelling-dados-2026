/* Aplicação: roteamento por hash, estações da metodologia, parâmetros, fontes e ciclo de vida das cenas 3D. */
(function () {
  var D = window.DADOS, esc = U.esc, f = U.fmt;
  var VISTAS = ["inicio", "metodologia", "resultados", "execucoes", "fontes"];
  var ABAS = ["recall", "cobertura", "precisao", "sintese"];
  var estado = { vista: "inicio", aba: "recall" };
  var play = null;

  /* ---------------- conteúdo das sete estações ---------------- */
  var c = D.experimento.criterios;
  var ESTACOES = [
    { t: "Norma e requisitos verificáveis", s: "A obrigação normativa, de pedra, ganha requisitos que podem ser verificados.", quem: "Pesquisadora · representação declarativa",
      d: "A norma fornece os critérios da auditoria. Seus trechos relevantes foram representados de forma declarativa como requisitos verificáveis: " + c.length + " critérios normativos, " +
        c[0].unidades + " + " + c[1].unidades + " = " + D.experimento.itens_por_execucao + " itens por execução (" + c[0].id + " e " + c[1].id + ").",
      nao: "A norma não é “lida” por um mecanismo automático de interpretação normativa: os critérios são definidos antes da coleta." },
    { t: "Quatro portais institucionais", s: "Os mesmos critérios atravessam quatro portais, cada qual com sua estrutura.", quem: "Entrada · CNJ, STF, TJDFT e TST",
      d: "O mesmo conjunto de critérios é aplicado a quatro portais de transparência. A estrutura e a apresentação das informações variam entre as instituições; a avaliação, não.",
      nao: "A pesquisa trata apenas de informações públicas disponíveis nos portais. Nenhuma base privada é acessada." },
    { t: "Coleta orientada por IA generativa", s: "O agente localiza e organiza páginas e documentos públicos. Não decide.", quem: "IA generativa · " + D.experimento.modelo,
      d: "O modelo percorre os portais orientado pelos critérios, localiza páginas, documentos e registros e os salva como evidências, vinculadas aos requisitos.",
      nao: "A IA localiza, coleta e organiza evidências. Ela não declara conformidade nem toma decisões institucionais." },
    { t: "Organização das evidências", s: "Cada evidência reportada fica vinculada ao requisito que pretende demonstrar.", quem: "Saída da coleta",
      d: "As evidências reportadas são organizadas em um conjunto estruturado, cada uma associada ao requisito que pretende demonstrar. Esse conjunto é o objeto da comparação seguinte.",
      nao: "Reportar uma evidência não equivale a validá-la: a validação depende do gabarito e da leitura humana." },
    { t: "Comparação determinística com o gabarito", s: "O gabarito fica em câmara fechada, independente do modelo; uma rotina determinística compara.", quem: "Rotina determinística · separada do LLM",
      d: "O gabarito positivo fechado foi elaborado pela pesquisadora e revisado por três especialistas em auditoria governamental do TJDFT. Uma rotina determinística compara as evidências reportadas com ele, por correspondência de URLs normalizadas e limiar de correspondência textual de 0,75 (sensibilidade de 0,80 a 0,90).",
      nao: "O gabarito não foi produzido pelo LLM, e a comparação não é uma segunda opinião do modelo. Evidência sem correspondência direta não é automaticamente falsa." },
    { t: "Métricas", s: "Três instrumentos, três perguntas: itens, componentes e correspondência direta.", quem: "Resultado da comparação",
      d: "Três métricas respondem a perguntas diferentes: Recall_item (os itens esperados foram identificados como atendidos?), Cobertura_evidência (os componentes de evidência esperados foram localizados e salvos?) e Precisão_evidência (as evidências reportadas têm correspondência direta com o gabarito?).",
      nao: "Nenhuma das três é uma medida de acurácia nem uma certificação de conformidade." },
    { t: "Interpretação humana", s: "A pessoa auditora lê criticamente os resultados. A decisão continua sendo humana.", quem: "Pessoa auditora",
      d: "Os resultados são lidos criticamente, com supervisão humana, para avaliar a adequação das evidências — inclusive aquelas sem correspondência direta com o gabarito.",
      nao: "A arquitetura apoia a auditoria de conformidade; não substitui o julgamento profissional nem elimina a supervisão humana." }
  ];
  /* Transcrição da narração do filme (versão incorporada à prévia V4; texto de roteiro/NARRACAO_FILME_v3.md) */
  var NARRACAO = "Auditar a transparência pública é encontrar evidências que possam ser examinadas. A obrigação normativa se traduz em requisitos objetivos e rastreáveis: dez itens, de dois critérios, verificados a cada execução. Os mesmos critérios foram aplicados a quatro instituições: CNJ, STF, TJDFT e TST, dez execuções cada, quarenta ao todo. A inteligência artificial generativa localiza e organiza as evidências por requisito. Ela não decide se a obrigação foi cumprida. Um gabarito independente, revisado por três especialistas do TJDFT, é confrontado com as evidências por uma rotina determinística. Evidência sem correspondência direta não é, por isso, necessariamente falsa. A evidência precisa ser rastreável. A IA localiza. O método compara. A pessoa auditora decide.";

  /* ---------------- roteamento ---------------- */
  function ler() {
    var h = (location.hash || "#inicio").replace(/^#/, "").split("/");
    var v = h[0];
    if (ABAS.indexOf(v) >= 0) { return { vista: "resultados", aba: v }; } /* compatibilidade: #recall */
    if (VISTAS.indexOf(v) < 0) v = "inicio";
    var aba = v === "resultados" && ABAS.indexOf(h[1]) >= 0 ? h[1] : "recall";
    return { vista: v, aba: aba };
  }
  function aplicar(primeira) {
    var r = ler(), mudouVista = r.vista !== estado.vista || primeira;
    estado.vista = r.vista; estado.aba = r.aba;
    document.body.setAttribute("data-vista", r.vista);
    document.querySelectorAll(".vista").forEach(function (s) { s.hidden = s.dataset.vista !== r.vista; });
    document.querySelectorAll(".menu a").forEach(function (a) {
      if (a.dataset.vista === r.vista) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    document.querySelectorAll(".aba").forEach(function (b) {
      var s = b.dataset.aba === r.aba; b.setAttribute("aria-selected", s); b.tabIndex = s ? 0 : -1;
    });
    document.querySelectorAll("[data-painel]").forEach(function (p) { p.hidden = p.dataset.painel !== r.aba; });
    var titulos = { inicio: "Início", metodologia: "Metodologia", resultados: "Resultados", execucoes: "40 execuções", fontes: "Fontes" };
    document.title = titulos[r.vista] + " · Auditoria normativa assistida por IA generativa · Milhomem (2026)";
    if (window.CenaAbertura) CenaAbertura.visivel(r.vista === "inicio");
    if (window.CenaArq) CenaArq.visivel(r.vista === "metodologia");
    if (r.vista !== "metodologia") pararPlay();
    if (mudouVista && !primeira) { window.scrollTo(0, 0); var t = document.querySelector('.vista[data-vista="' + r.vista + '"] h1'); if (t) { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); } }
  }

  /* ---------------- metodologia ---------------- */
  function estacoes() {
    var ol = document.getElementById("estacoes");
    ol.innerHTML = ESTACOES.map(function (e, i) {
      return '<li><button type="button" data-i="' + i + '"><span class="n">' + String(i + 1).padStart(2, "0") + '</span><span class="t">' + esc(e.t) + '</span></button></li>';
    }).join("");
    ol.addEventListener("click", function (ev) {
      var b = ev.target.closest("button"); if (!b) return;
      pararPlay(); irEstacao(Number(b.dataset.i));
    });
    document.getElementById("arq-ant").addEventListener("click", function () { pararPlay(); irEstacao(atual() - 1); });
    document.getElementById("arq-prox").addEventListener("click", function () { pararPlay(); irEstacao(atual() + 1); });
    document.getElementById("arq-play").addEventListener("click", function () {
      if (play) { pararPlay(); return; }
      if (atual() >= ESTACOES.length - 1) irEstacao(0); /* ao fim, reproduzir recomeça do início */
      iniciarPlay();
    });
    document.getElementById("cinema-prev3d").addEventListener("click", function () {
      garantirVisivel(); irEstacao(0);
    });
    document.getElementById("transcricao-texto").textContent = NARRACAO;
    var vid = document.getElementById("cinema-video"), erro = document.getElementById("cinema-erro");
    if (vid && erro) {
      var falhou = function () { erro.hidden = false; };
      vid.addEventListener("error", falhou);
      var src = vid.querySelector("source"); if (src) src.addEventListener("error", falhou);
    }
    irEstacao(0, true);
  }
  function garantirVisivel() {
    var el = document.getElementById("arquitetura"); if (!el) return;
    var r = el.getBoundingClientRect(), h = window.innerHeight;
    if (r.top < 0 || r.bottom > h + 2) el.scrollIntoView({ block: "start", behavior: U.reduzido() ? "auto" : "smooth" });
  }
  var _atual = 0;
  function atual() { return _atual; }
  function irEstacao(i, imediato) {
    i = U.clamp(i, 0, ESTACOES.length - 1); _atual = i;
    if (!imediato) garantirVisivel();
    document.querySelectorAll("#estacoes button").forEach(function (b) {
      if (Number(b.dataset.i) === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    var e = ESTACOES[i];
    var lg = document.getElementById("legenda-estacao");
    if (lg) lg.innerHTML = '<span class="n">Estação ' + (i + 1) + ' de ' + ESTACOES.length + ' · ' + esc(e.quem) + '</span><strong>' + esc(e.t) + '</strong><span class="q">' + esc(e.s) + '</span>';
    document.getElementById("detalhe-estacao").innerHTML =
      '<div><p class="quem">Estação ' + (i + 1) + ' de ' + ESTACOES.length + ' · ' + esc(e.quem) + '</p><h2>' + esc(e.t) + '</h2><p>' + esc(e.d) + '</p></div>' +
      '<div class="nao"><strong>O que esta estação não é</strong>' + esc(e.nao) + '</div>';
    if (window.CenaArq) CenaArq.ir(i, imediato);
    document.getElementById("arq-ant").disabled = i === 0;
    document.getElementById("arq-prox").disabled = i === ESTACOES.length - 1;
  }
  function iniciarPlay() {
    garantirVisivel();
    var b = document.getElementById("arq-play");
    b.setAttribute("aria-pressed", "true"); b.textContent = "Pausar percurso";
    play = setInterval(function () {
      if (atual() >= ESTACOES.length - 1) { pararPlay(); return; }
      irEstacao(atual() + 1);
    }, 6500);
  }
  function pararPlay() {
    if (play) { clearInterval(play); play = null; }
    var b = document.getElementById("arq-play");
    if (b) { b.setAttribute("aria-pressed", "false"); b.textContent = "Reproduzir percurso"; }
  }

  function parametros() {
    var e = D.experimento;
    document.getElementById("tabela-criterios").innerHTML =
      '<table class="tabela"><caption>Critérios normativos</caption><thead><tr><th>Critério</th><th class="num">Unidades</th></tr></thead><tbody>' +
      e.criterios.map(function (k) { return '<tr><td><strong>' + esc(k.id) + '</strong><br><span style="color:var(--tinta-2)">' + esc(k.descricao) + '</span></td><td class="num">' + k.unidades + '</td></tr>'; }).join("") +
      '<tr><th>Itens por execução</th><td class="num">' + e.itens_por_execucao + '</td></tr></tbody></table>';
    document.getElementById("tabela-parametros").innerHTML =
      '<table class="tabela"><caption>Desenho do experimento</caption><tbody>' +
      '<tr><th>Instituições</th><td>' + e.instituicoes.join(", ") + '</td></tr>' +
      '<tr><th>Repetições por instituição</th><td>' + e.repeticoes_por_instituicao + '</td></tr>' +
      '<tr><th>Execuções</th><td>' + e.execucoes_total + '</td></tr>' +
      '<tr><th>Modelo</th><td><code>' + esc(e.modelo) + '</code> · Reasoning = ' + esc(e.reasoning) + '</td></tr>' +
      '<tr><th>Período das execuções</th><td>' + esc(D.portais.data_coleta.texto_exibicao.replace("Execuções realizadas em ", "")) + '</td></tr></tbody></table>';
    var o = D.operacional;
    function dado(r, v) { return '<div><dt>' + r + '</dt><dd>' + v + '</dd></div>'; }
    document.getElementById("nota-operacional").innerHTML =
      '<strong class="operacional__t">Dimensão operacional (complementar, agregada)</strong>' +
      '<dl class="operacional__dados">' +
      dado("Custo total", "US$ " + f(o.custo_total_usd, 4)) + dado("Chamadas ao modelo", o.chamadas_llm) +
      dado("Tokens de entrada", o.tokens_prompt.toLocaleString("pt-BR")) + dado("Tokens de saída", o.tokens_completion.toLocaleString("pt-BR")) + '</dl>' +
      '<span class="operacional__n">Valores agregados, sem desagregação por instituição; não são métrica de qualidade normativa.</span>';
  }

  /* ---------------- fontes ---------------- */
  function fontes() {
    var P = D.portais.instituicoes;
    document.getElementById("conteudo-fontes").innerHTML =
      '<div class="fontes-bloco"><h2>Portais e hubs por instituição</h2><p>' + esc(D.portais.descricao.replace(/\s*\(seção 3\.2\.4\)/, "")) + '</p><ul class="lista-portais">' +
      D.ordem.map(function (k) {
        var p = P[k];
        return '<li><strong>' + k + ' — ' + esc(p.nome) + '</strong><br>Portal: <a href="' + esc(p.exibir.portal_institucional) + '" rel="noopener">' + esc(p.exibir.portal_institucional) + '</a><br>' +
          'Hub de transparência configurado: <a href="' + esc(p.exibir.hub_yaml) + '" rel="noopener">' + esc(p.exibir.hub_yaml) + '</a><br><span style="color:var(--mudo)">Origem: ' + esc(p.origem) + '</span></li>';
      }).join("") + '</ul><p class="nota">Sites não acessados ao vivo. Execuções e coletas realizadas em ' + esc(D.portais.data_coleta.texto_exibicao.replace("Execuções realizadas em ", "").replace(/\.$/, "")) + ', período das execuções do framework (registros do lote); NÃO é data de acesso individual a cada URL.</p></div>';
  }

  /* ---------------- movimento ---------------- */
  function movimento() {
    var b = document.getElementById("btn-movimento"), t = document.getElementById("btn-movimento-txt");
    var salvo = null; try { salvo = localStorage.getItem("reduzir-movimento"); } catch (e) {}
    function set(on, persistir) {
      document.documentElement.classList.toggle("reduzir-movimento", on);
      b.setAttribute("aria-pressed", String(on)); t.textContent = on ? "Movimento reduzido" : "Reduzir movimento";
      if (persistir) { try { localStorage.setItem("reduzir-movimento", on ? "1" : "0"); } catch (e) {} }
      if (on) pararPlay();
      if (window.CenaAbertura) CenaAbertura.movimentoMudou();
      if (window.CenaArq) CenaArq.movimentoMudou();
    }
    if (salvo === "1") set(true, false);
    b.addEventListener("click", function () { set(b.getAttribute("aria-pressed") !== "true", true); });
  }

  /* ---------------- abas (teclado) ---------------- */
  function abas() {
    var lista = document.querySelector(".subnav");
    lista.addEventListener("click", function (ev) {
      var b = ev.target.closest(".aba"); if (!b) return;
      location.hash = "#resultados" + (b.dataset.aba === "recall" ? "" : "/" + b.dataset.aba);
    });
    lista.addEventListener("keydown", function (ev) {
      var i = ABAS.indexOf(estado.aba), n = i;
      if (ev.key === "ArrowRight") n = (i + 1) % ABAS.length; else if (ev.key === "ArrowLeft") n = (i + ABAS.length - 1) % ABAS.length;
      else if (ev.key === "Home") n = 0; else if (ev.key === "End") n = ABAS.length - 1; else return;
      ev.preventDefault();
      location.hash = "#resultados" + (ABAS[n] === "recall" ? "" : "/" + ABAS[n]);
      setTimeout(function () { var el = document.getElementById("aba-" + ABAS[n]); if (el) el.focus(); }, 0);
    });
  }

  /* ---------------- abertura ---------------- */
  function abertura() {
    var cv = document.getElementById("cv-abertura"), ok = false;
    if (U.webgl()) ok = CenaAbertura.iniciar(cv, document.getElementById("rotulos-abertura"));
    if (!ok) {
      document.getElementById("sem-webgl-abertura").hidden = false;
      document.getElementById("rotulos-abertura").hidden = true;
      cv.hidden = true;
      document.querySelector(".palco__controles").hidden = true;
    } else {
      document.getElementById("abertura-pular").addEventListener("click", function () { CenaAbertura.pular(); });
      document.getElementById("abertura-reiniciar").addEventListener("click", function () { CenaAbertura.reiniciar(); });
    }
    var ok2 = false, cva = document.getElementById("cv-arq");
    if (U.webgl()) ok2 = CenaArq.iniciar(cva);
    if (!ok2) {
      document.getElementById("sem-webgl-arq").hidden = false; cva.hidden = true;
    }
  }

  function iniciar() {
    var d = D.experimento;
    document.getElementById("res-crit").textContent = d.criterios.length;
    document.getElementById("res-inst").textContent = d.instituicoes.length;
    document.getElementById("res-itens").textContent = d.itens_por_execucao;
    document.getElementById("res-exec").textContent = d.execucoes_total;
    Graficos.render(); MapaExec.iniciar(); parametros(); fontes(); abas(); movimento();
    if (!window.THREE) window.__SEM_WEBGL = true;
    estacoes(); abertura();
    window.addEventListener("hashchange", function () { aplicar(false); });
    aplicar(true);
    irEstacao(0, true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();

  /* gancho de teste/diagnóstico (somente leitura) */
  window.__site = { estado: function () { return { vista: estado.vista, aba: estado.aba, estacao: _atual }; } };
})();
