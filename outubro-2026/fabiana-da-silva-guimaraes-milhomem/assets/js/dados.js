/* gerado por scripts/gerar_dados.py a partir de dados/evidencia_lab.json */
window.DADOS = {
 "experimento": {
  "execucoes_total": 40,
  "instituicoes": [
   "CNJ",
   "STF",
   "TJDFT",
   "TST"
  ],
  "repeticoes_por_instituicao": 10,
  "modelo": "openai/gpt-4.1",
  "reasoning": "None",
  "itens_por_execucao": 10,
  "criterios": [
   {
    "id": "IN84-27-CAPUT",
    "unidades": 4,
    "descricao": "Art. 27 da Instrução Normativa TCU nº 84/2020"
   },
   {
    "id": "PNTP-12.1-12.2-SIC",
    "unidades": 6,
    "descricao": "Subitens 12.1 e 12.2 do item 12 do Programa Nacional de Transparência Pública"
   }
  ],
  "fonte": "Tabela 1, seção 4.1.1"
 },
 "definicoes": {
  "Recall_item": "itens esperados pelo gabarito efetivamente satisfeitos ÷ itens esperados (nível item/peça; unidade primária). Não é medida de acurácia.",
  "FNR_item": "1 − Recall_item (proporção de itens esperados não satisfeitos). Não é taxa de falso negativo clássica.",
  "Precisao_evidencia": "evidências reportadas com correspondência direta com o gabarito ÷ evidências reportadas (nível evidência/componente).",
  "Cobertura_evidencia": "componentes de evidência esperados localizados ÷ componentes esperados.",
  "agregacao": "Métricas de evidência agregadas por contagem (numeradores/denominadores), não por média de percentuais.",
  "ressalva": "O gabarito é referência positiva fechada: evidência sem correspondência direta NÃO equivale a evidência falsa.",
  "fonte": "Seções 3.3.1, 3.3.2 e 4.1.3",
  "Cobertura_evidencia_texto_exibicao": "Proporção dos componentes de evidência esperados localizados e salvos: entre os componentes necessários previstos no gabarito, quantos o framework localizou e salvou como evidência. Não é o Recall_item (que mede itens/requisitos)."
 },
 "instituicoes": {
  "CNJ": {
   "recall_item": 93.0,
   "fnr_item": 7.0,
   "itens_satisfeitos": 93,
   "itens_esperados": 100,
   "precisao_evidencia": 71.6,
   "precisao_evidencia_2casas": 71.63,
   "cobertura_evidencia": 95.0,
   "evidencias_com_correspondencia": 154,
   "evidencias_reportadas": 215,
   "componentes_encontrados": 133,
   "componentes_esperados": 140,
   "recall_estatisticas": {
    "n": 10,
    "media": 93.0,
    "mediana": 100.0,
    "dp_amostral_pp": 12.52,
    "minimo": 70.0,
    "maximo": 100.0,
    "repeticoes_sem_omissao": "7/10"
   },
   "precisao_amplitude_pp": 22.1,
   "recall_por_criterio": {
    "IN84-27-CAPUT": {
     "media": 100.0,
     "mediana": 100.0,
     "dp_pp": 0.0
    },
    "PNTP-12.1-12.2-SIC": {
     "media": 88.3,
     "mediana": 100.0,
     "dp_pp": 20.86
    }
   },
   "fonte": "Tabelas 2, 3, 5, 6, 7, 8, 9"
  },
  "STF": {
   "recall_item": 100.0,
   "fnr_item": 0.0,
   "itens_satisfeitos": 100,
   "itens_esperados": 100,
   "precisao_evidencia": 58.6,
   "precisao_evidencia_2casas": 58.62,
   "cobertura_evidencia": 100.0,
   "evidencias_com_correspondencia": 153,
   "evidencias_reportadas": 261,
   "componentes_encontrados": 140,
   "componentes_esperados": 140,
   "recall_estatisticas": {
    "n": 10,
    "media": 100.0,
    "mediana": 100.0,
    "dp_amostral_pp": 0.0,
    "minimo": 100.0,
    "maximo": 100.0,
    "repeticoes_sem_omissao": "10/10"
   },
   "precisao_amplitude_pp": 7.7,
   "recall_por_criterio": {
    "IN84-27-CAPUT": {
     "media": 100.0,
     "mediana": 100.0,
     "dp_pp": 0.0
    },
    "PNTP-12.1-12.2-SIC": {
     "media": 100.0,
     "mediana": 100.0,
     "dp_pp": 0.0
    }
   },
   "fonte": "Tabelas 2, 3, 5, 6, 7, 8, 9"
  },
  "TJDFT": {
   "recall_item": 100.0,
   "fnr_item": 0.0,
   "itens_satisfeitos": 100,
   "itens_esperados": 100,
   "precisao_evidencia": 39.0,
   "precisao_evidencia_2casas": 38.97,
   "cobertura_evidencia": 100.0,
   "evidencias_com_correspondencia": 166,
   "evidencias_reportadas": 426,
   "componentes_encontrados": 140,
   "componentes_esperados": 140,
   "recall_estatisticas": {
    "n": 10,
    "media": 100.0,
    "mediana": 100.0,
    "dp_amostral_pp": 0.0,
    "minimo": 100.0,
    "maximo": 100.0,
    "repeticoes_sem_omissao": "10/10"
   },
   "precisao_amplitude_pp": 8.1,
   "recall_por_criterio": {
    "IN84-27-CAPUT": {
     "media": 100.0,
     "mediana": 100.0,
     "dp_pp": 0.0
    },
    "PNTP-12.1-12.2-SIC": {
     "media": 100.0,
     "mediana": 100.0,
     "dp_pp": 0.0
    }
   },
   "fonte": "Tabelas 2, 3, 5, 6, 7, 8, 9"
  },
  "TST": {
   "recall_item": 100.0,
   "fnr_item": 0.0,
   "itens_satisfeitos": 100,
   "itens_esperados": 100,
   "precisao_evidencia": 46.0,
   "precisao_evidencia_2casas": 46.0,
   "cobertura_evidencia": 100.0,
   "evidencias_com_correspondencia": 201,
   "evidencias_reportadas": 437,
   "componentes_encontrados": 140,
   "componentes_esperados": 140,
   "recall_estatisticas": {
    "n": 10,
    "media": 100.0,
    "mediana": 100.0,
    "dp_amostral_pp": 0.0,
    "minimo": 100.0,
    "maximo": 100.0,
    "repeticoes_sem_omissao": "10/10"
   },
   "precisao_amplitude_pp": 12.7,
   "recall_por_criterio": {
    "IN84-27-CAPUT": {
     "media": 100.0,
     "mediana": 100.0,
     "dp_pp": 0.0
    },
    "PNTP-12.1-12.2-SIC": {
     "media": 100.0,
     "mediana": 100.0,
     "dp_pp": 0.0
    }
   },
   "fonte": "Tabelas 2, 3, 5, 6, 7, 8, 9"
  }
 },
 "ordem": [
  "CNJ",
  "STF",
  "TJDFT",
  "TST"
 ],
 "repeticoes": {
  "CNJ": {
   "recall": [
    100.0,
    100.0,
    70.0,
    90.0,
    70.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0
   ],
   "precisao": [
    70.8,
    79.2,
    57.9,
    57.1,
    63.2,
    79.2,
    76.2,
    75.0,
    72.7,
    75.0
   ],
   "itens": [
    10,
    10,
    7,
    9,
    7,
    10,
    10,
    10,
    10,
    10
   ],
   "cobertura": [
    100.0,
    100.0,
    78.6,
    92.9,
    78.6,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0
   ],
   "fnr": [
    0.0,
    0.0,
    30.0,
    10.0,
    30.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0
   ],
   "recall_criterio": {
    "IN84-27-CAPUT": [
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0
    ],
    "PNTP-12.1-12.2-SIC": [
     100.0,
     100.0,
     50.0,
     83.3,
     50.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0
    ]
   }
  },
  "STF": {
   "recall": [
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0
   ],
   "precisao": [
    61.5,
    57.7,
    57.7,
    57.7,
    57.7,
    61.5,
    59.3,
    57.7,
    53.8,
    61.5
   ],
   "itens": [
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10
   ],
   "cobertura": [
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0
   ],
   "fnr": [
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0
   ],
   "recall_criterio": {
    "IN84-27-CAPUT": [
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0
    ],
    "PNTP-12.1-12.2-SIC": [
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0
    ]
   }
  },
  "TJDFT": {
   "recall": [
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0
   ],
   "precisao": [
    44.7,
    36.6,
    36.6,
    43.5,
    43.5,
    36.6,
    36.6,
    36.6,
    36.6,
    36.6
   ],
   "itens": [
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10
   ],
   "cobertura": [
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0
   ],
   "fnr": [
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0
   ],
   "recall_criterio": {
    "IN84-27-CAPUT": [
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0
    ],
    "PNTP-12.1-12.2-SIC": [
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0
    ]
   }
  },
  "TST": {
   "recall": [
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0
   ],
   "precisao": [
    54.0,
    41.3,
    41.3,
    42.2,
    44.7,
    50.0,
    46.8,
    45.8,
    54.0,
    43.5
   ],
   "itens": [
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10
   ],
   "cobertura": [
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0,
    100.0
   ],
   "fnr": [
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0
   ],
   "recall_criterio": {
    "IN84-27-CAPUT": [
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0
    ],
    "PNTP-12.1-12.2-SIC": [
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0,
     100.0
    ]
   }
  }
 },
 "fontes_por_serie": {
  "recall": "Tabela 5 (estatísticas) e texto 4.1.4 / Figura 1; valores por repetição conferidos no pipeline (origem: pipeline)",
  "precisao": "Tabela 6, seção 4.1.4",
  "itens": "origem: pipeline (comparativo.html, 'Desempenho por repetição'); soma CNJ = 93, coerente com Tabela 2",
  "cobertura": "origem: pipeline (comparativo.html); texto 4.1.4 confirma que a queda do CNJ ocorre nas repetições com omissão. STF/TJDFT/TST = 100,0% em todas as repetições (Tabela 3 e seção 4.1.4)",
  "fnr": "origem: pipeline (comparativo.html, \"Desempenho por repetição\"); = 100 − Recall_item em todas as 40 execuções",
  "criterio": "origem: pipeline (comparativo.html, \"Variabilidade por critério\"); IN84-27-CAPUT = 4 unidades, PNTP-12.1-12.2-SIC = 6 unidades"
 },
 "indisponivel": "indisponível na fonte: Tabelas 1–9 e comparativo só trazem o agregado das 10 repetições (ex.: 166/426 no TJDFT).",
 "indexacao": "Rep. 0 a Rep. 9, como na Tabela 6 e no texto da seção 4.1.4 (equivale à 1ª a 10ª execução).",
 "sensibilidade": {
  "limiares": [
   0.75,
   0.8,
   0.85,
   0.9
  ],
  "CNJ": [
   71.63,
   70.7,
   70.7,
   70.7
  ],
  "STF": [
   58.62,
   58.62,
   58.62,
   58.62
  ],
  "TJDFT": [
   38.97,
   38.97,
   38.97,
   38.97
  ],
  "TST": [
   46.0,
   45.77,
   45.77,
   45.77
  ],
  "variacao_maxima_pp": {
   "CNJ": -0.93,
   "STF": 0.0,
   "TJDFT": 0.0,
   "TST": -0.23
  },
  "fonte": "Tabela 4, seção 4.1.3. Recall_item, FNR_item e Cobertura invariantes nos 4 limiares."
 },
 "operacional": {
  "custo_total_usd": 6.8452,
  "chamadas_llm": 166,
  "tokens_prompt": 2774251,
  "tokens_completion": 162086,
  "nota": "Dimensão complementar, agregada (sem desagregação por instituição); não é métrica de qualidade normativa. Custo, chamadas e tokens constam do texto da seção 4.1.6; a Tabela 9 traz apenas duração, retry e erro.",
  "fonte_custo": "Seção 4.1.6 (texto)"
 },
 "portais": {
  "descricao": "Portais de transparência navegados pelo framework (navegação automatizada orientada pelos critérios normativos). Busca externa disponível como fallback, não acionada nas execuções avaliadas (seção 3.2.4).",
  "status_verificacao": "URLs lidas exclusivamente de orgaos/CNJ.yaml, orgaos/STF.yaml, orgaos/TJDFT.yaml e orgaos/TST.yaml (decisão da autora). orgao_config.yaml é desconsiderado para esta finalidade. Sites não acessados ao vivo.",
  "instituicoes": {
   "CNJ": {
    "nome": "Conselho Nacional de Justiça",
    "portal_raiz": "https://www.cnj.jus.br",
    "transparencia_base": "/transparencia-cnj",
    "hub_configurado": "https://www.cnj.jus.br/sobre-o-cnj/auditoria/processo-de-contas-anual/",
    "dominio_confirmado_nos_registros": "www.cnj.jus.br",
    "origem": "orgaos/CNJ.yaml (campos portal_root_url e hub_transparencia_url)",
    "exibir": {
     "portal_institucional": "https://www.cnj.jus.br",
     "hub_yaml": "https://www.cnj.jus.br/sobre-o-cnj/auditoria/processo-de-contas-anual/"
    }
   },
   "STF": {
    "nome": "Supremo Tribunal Federal",
    "portal_raiz": "https://portal.stf.jus.br",
    "transparencia_base": "/transparencia",
    "hub_configurado": "https://portal.stf.jus.br/transparencia/",
    "dominio_confirmado_nos_registros": "portal.stf.jus.br (também cms.stf.jus.br, www.stf.jus.br, egesp-portal.stf.jus.br, egesp-servidor.stf.jus.br)",
    "origem": "orgaos/STF.yaml (campos portal_root_url e hub_transparencia_url)",
    "exibir": {
     "portal_institucional": "https://portal.stf.jus.br",
     "hub_yaml": "https://portal.stf.jus.br/transparencia/"
    }
   },
   "TJDFT": {
    "nome": "Tribunal de Justiça do Distrito Federal e dos Territórios",
    "portal_raiz": "https://www.tjdft.jus.br",
    "transparencia_base": "/transparencia",
    "hub_configurado": "https://www.tjdft.jus.br/transparencia/auditoria-e-prestacao-de-contas/prestacao-de-contas/processo-de-contas-anual",
    "dominio_confirmado_nos_registros": "www.tjdft.jus.br (1 menção a siex.tjdft.jus.br)",
    "origem": "orgaos/TJDFT.yaml (campos portal_root_url e hub_transparencia_url)",
    "exibir": {
     "portal_institucional": "https://www.tjdft.jus.br",
     "hub_yaml": "https://www.tjdft.jus.br/transparencia/auditoria-e-prestacao-de-contas/prestacao-de-contas/processo-de-contas-anual"
    }
   },
   "TST": {
    "nome": "Tribunal Superior do Trabalho",
    "portal_raiz": "https://www.tst.jus.br",
    "transparencia_base": "/transparencia",
    "hub_configurado": "https://www.tst.jus.br/transparencia1",
    "dominio_confirmado_nos_registros": "www.tst.jus.br (também juslaboris.tst.jus.br)",
    "origem": "orgaos/TST.yaml (campos portal_root_url e hub_transparencia_url)",
    "exibir": {
     "portal_institucional": "https://www.tst.jus.br",
     "hub_yaml": "https://www.tst.jus.br/transparencia1"
    }
   }
  },
  "data_coleta": {
   "texto_exibicao": "Execuções realizadas em 07–08/09/2026.",
   "natureza": "período das execuções do framework (registros do lote); NÃO é data de acesso individual a cada URL, que não consta nos registros.",
   "origem": "resultados_respostas.jsonl (batch_id Etapa2_GPT4-1_10repeticoes) e nomes dos relatórios por repetição"
  }
 },
 "verificacao_cnj": {
  "origem": "relatório do pipeline (comparativo.html, 'Desempenho por repetição'); não publicados nas tabelas da dissertação",
  "verificacoes": [
   "Soma de itens satisfeitos por repetição = 93, igual à Tabela 2 (93/100).",
   "Recall por repetição (70,0%; 90,0%; 70,0%) igual ao texto 4.1.4 e à Figura 1 da dissertação.",
   "Recall por critério na tabela do pipeline: IN84 100% em todas; PNTP 50,0%, 83,3%, 50,0% nas reps 2, 3, 4 = 3/6, 5/6, 3/6, o que com 4/4 de IN84 dá 7/10, 9/10, 7/10.",
   "Cobertura 78,6% = 11/14; 92,9% = 13/14; 14 componentes esperados por repetição × 10 = 140; 14×7 + 11 + 13 + 11 = 133, igual à Tabela 3 (133/140)."
  ],
  "limitacao": "Não existe arquivo original de pontuação por repetição além do comparativo.html; a verificação é por consistência aritmética e cruzamento com a dissertação, não por recomputação a partir dos relatórios brutos.",
  "rotulo_obrigatorio": "Dados complementares do comparativo HTML do pipeline (comparativo.html); não constam das tabelas da dissertação. Conferidos por consistência aritmética com os agregados da dissertação; não houve recomputação independente a partir dos dados brutos.",
  "onde_exibir": "seção Metodologia e nota de rastreabilidade do painel das repetições"
 },
 "caso_cnj": {
  "cnj_omissao": "No item da unidade responsável pelo SIC, o sistema reportou https://www.cnj.jus.br/acesso-a-informacao/ e o gabarito previa https://www.cnj.jus.br/ouvidoria-cnj/. Evidência real da instituição, sem correspondência com a referência específica; exige verificação humana. Os 7 itens omitidos concentram-se no CNJ/PNTP-12.1-12.2-SIC.",
  "fonte": "Seção 4.1.6"
 }
};
