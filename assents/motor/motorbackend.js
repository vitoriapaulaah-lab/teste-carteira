// ==========================================
// motorbackend.js
// CONEXÃO LOCAL (NODE.JS) - SUBSTITUINDO O SUPABASE
// ARQUITETURA: ERP-FIRST com OVERRIDE MANUAL e EXIBIÇÃO TOTAL
// ==========================================

const ITENS_ORDEM = ["BBA/ELET.", "MT", "FLUT.", "M FV.", "AD. FLEX", "AD. RIG.", "FIXADORES", "SIST. ELÉT.", "PEÇAS REP.", "SERV.", "MONT.", "FATUR."];

const OBRAS_2025_AUTORIZADAS = new Set([
  "25206",
  "25241",
  "25214",
  "25230",
  "25242",
  "25127",
  "25187"
]);


const FATURAMENTO_FINANCEIRO_2026 = Object.freeze({
  "721": { data: "08/01/2026", valor: 830929, cliente: "AQUALCULTURA FORTALE" },
  "722": { data: "12/01/2026", valor: 10000, cliente: "TAS BOMBAS" },
  "725": { data: "13/01/2026", valor: 5864.60, cliente: "AQUALCULTURA FORTALE" },
  "726": { data: "26/01/2026", valor: 2861.40, cliente: "AQUISA PARAIPABA" },
  "727": { data: "26/01/2026", valor: 5047.69, cliente: "AQUISA PARAIPABA" },
  "728": { data: "26/01/2026", valor: 10000, cliente: "TAS BOMBAS" },
  "729": { data: "27/01/2026", valor: 13049.30, cliente: "SAMARIA" },
  "731": { data: "27/01/2026", valor: 70000, cliente: "HYPEMIDIA LTDA" },

  "734": { data: "03/02/2026", valor: 17500, cliente: "HYPEMIDIA LTDA" },
  "735": { data: "03/02/2026", valor: 6961.45, cliente: "SAMARIA", contabiliza: false },
  "736": { data: "03/02/2026", valor: 1466.15, cliente: "AQUALCULTURA FORTALE" },
  "737": { data: "03/02/2026", valor: 7572.60, cliente: "SAMARIA CAMAROES" },
  "739": { data: "03/02/2026", valor: 520.25, cliente: "SAMARIA", contabiliza: false },
  "741": { data: "11/02/2026", valor: 7284.39, cliente: "AQUISA BEBERIBE" },
  "742": { data: "13/02/2026", valor: 3050.40, cliente: "AQUISA PARAIPABA" },
  "743": { data: "13/02/2026", valor: 350.33, cliente: "CONSTRUTORA SAMARIA" },
  "744": { data: "25/02/2026", valor: 9915.41, cliente: "CAMAR RN MARICULTURA" },
  "746": { data: "26/02/2026", valor: 10151.44, cliente: "TECNARAO TEC" },
  "747": { data: "27/02/2026", valor: 15629.40, cliente: "LARVIFORT" },
  "748": { data: "27/02/2026", valor: 5240, cliente: "SAMARIA CAMAROES" },
  "749": { data: "27/02/2026", valor: 1133.48, cliente: "NORSAL" },
  "750": { data: "27/02/2026", valor: 3437.71, cliente: "NORSAL" },
  "751": { data: "27/02/2026", valor: 2583.31, cliente: "NORSAL" },

  "752": { data: "04/03/2026", valor: 165.20, cliente: "AQUALCULTURA FORTALE" },
  "753": { data: "04/03/2026", valor: 176.56, cliente: "AQUALCULTURA FORTALE", contabiliza: false },
  "754": { data: "04/03/2026", valor: 9030.45, cliente: "AQUALCULTURA FORTALE" },
  "755": { data: "04/03/2026", valor: 4692.71, cliente: "AQUALCULTURA FORTALE" },
  "756": { data: "04/03/2026", valor: 32886.47, cliente: "AQUALCULTURA FORTALE" },
  "757": { data: "04/03/2026", valor: 15057.90, cliente: "AQUATEC AQUACULTURA" },
  "758": { data: "04/03/2026", valor: 18316.80, cliente: "AQUATEC AQUACULTURA" },
  "759": { data: "04/03/2026", valor: 269614.60, cliente: "SAMARIA CAMAROES" },
  "760": { data: "04/03/2026", valor: 78000.90, cliente: "AQUISA PARAIPABA" },
  "761": { data: "04/03/2026", valor: 5042.11, cliente: "NORSAL" },
  "762": { data: "04/03/2026", valor: 4816.30, cliente: "NORSAL" },
  "767": { data: "11/03/2026", valor: 12000.03, cliente: "AQUISA BEBERIBE" },
  "768": { data: "18/03/2026", valor: 15500.92, cliente: "SAMARIA CAMAROES" },
  "769": { data: "18/03/2026", valor: 12256.60, cliente: "SAMARIA CAMAROES" },
  "770": { data: "20/03/2026", valor: 18443.30, cliente: "AQUISA PARAIPABA" },
  "771": { data: "26/03/2026", valor: 10421.44, cliente: "VARICRED DO NORDESTE" },
  "774": { data: "30/03/2026", valor: 3457.26, cliente: "AGROCOURA AGROPECUÁR", contabiliza: false },
  "775": { data: "31/03/2026", valor: 61081.87, cliente: "AQUISA PARAIPABA" },

  "776": { data: "01/04/2026", valor: 404421, cliente: "SAMARIA CAMAROES LTD" },
  "777": { data: "01/04/2026", valor: 17500.15, cliente: "SAMARIA CAMAROES LTD" },
  "778": { data: "08/04/2026", valor: 2360, cliente: "SAMARIA CAMAROES LTD", contabiliza: false },
  "779": { data: "08/04/2026", valor: 12790, cliente: "SAMARIA CAMAROES LTD", contabiliza: false },
  "780": { data: "10/04/2026", valor: 1501.05, cliente: "CAMAR RN MARICULTURA" },
  "781": { data: "10/04/2026", valor: 5240, cliente: "SAMARIA CAMAROES" },
  "785": { data: "14/04/2026", valor: 50475.33, cliente: "MUCUJO CARCINICULTUR" },
  "786": { data: "17/04/2026", valor: 4167.90, cliente: "AFONSO FRANCA CONSTR", contabiliza: false },
  "787": { data: "17/04/2026", valor: 1374.30, cliente: "AFONSO FRANCA CONSTR", contabiliza: false },
  "788": { data: "23/04/2026", valor: 27000, cliente: "SAMARIA CAMAROES LTD" },
  "789": { data: "23/04/2026", valor: 85730, cliente: "OESTE VERDE PREMOLDA" },
  "790": { data: "24/04/2026", valor: 4109.14, cliente: "AQUISA PARAIPABA" },
  "791": { data: "24/04/2026", valor: 3293.06, cliente: "AQUISA PARAIPABA" },
  "792": { data: "24/04/2026", valor: 4646.25, cliente: "SANTA MARIA AQUACULT" }
});

const MESES_FINANCEIRO_FECHADOS_2026 = new Set([
  "2026-01",
  "2026-02",
  "2026-03",
  "2026-04"
]);

function getSafeId(str) {
  if (!str) return "";
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '_');
}

function parseMoneyFlexible(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;

  let str = String(value).trim();
  if (!str) return 0;

  str = str.replace(/\s/g, '').replace(/[R$r$\u00A0]/g, '');

  if (str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  } else {
    const dotCount = (str.match(/\./g) || []).length;
    if (dotCount > 1) {
      str = str.replace(/\./g, '');
    }
  }

  str = str.replace(/[^\d.-]/g, '');
  const n = parseFloat(str);
  return Number.isFinite(n) ? n : 0;
}

function pickFirstMonetarySourceFlexible(erp, fields) {
  const source = erp && typeof erp === 'object' ? erp : {};
  const keysLower = Object.keys(source).reduce((acc, key) => {
    acc[key.toLowerCase()] = key;
    return acc;
  }, {});

  for (const field of fields) {
    const realKey = keysLower[String(field || '').toLowerCase()];
    if (!realKey) continue;
    const raw = source[realKey];
    if (raw === null || raw === undefined || raw === '') continue;
    const valor = parseMoneyFlexible(raw);
    if (Number.isFinite(valor) && valor > 0) {
      return valor;
    }
  }

  return null;
}

function getValorFinanceiroNF(erp) {
  const camposNFConfiaveis = [
    'vrnota',
    'vr_nota',
    'vr_nota_fiscal',
    'valor_nf',
    'valor_nota',
    'valor_nota_fiscal',
    'vrnf',
    'vlr_nf',
    'vlr_nota',
    'vlr_nota_fiscal'
  ];

  return pickFirstMonetarySourceFlexible(erp, camposNFConfiaveis);
}

function getValorFinanceiroObra(erp) {
  const valorNF = getValorFinanceiroNF(erp);
  if (valorNF !== null) return valorNF;

  const camposFallback = [
    'p_total',
    'valor_total',
    'valor',
    'total',
    'valoritens',
    'valor_itens'
  ];

  const valorFallback = pickFirstMonetarySourceFlexible(erp, camposFallback);
  return valorFallback !== null ? valorFallback : 0;
}

function addUnique(setRef, value) {
  const txt = String(value || '').trim();
  if (txt) setRef.add(txt);
}

function pickFirstNonEmpty(...values) {
  for (const value of values) {
    if (value === 0) return value;
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      return value;
    }
  }
  return "";
}


function normalizeKeyERP(value) {
  return String(value || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeTextERP(value) {
  return String(value || '')
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

function getCampoERP(erp, campos) {
  const source = erp && typeof erp === 'object' ? erp : {};
  const mapa = Object.keys(source).reduce((acc, key) => {
    acc[normalizeKeyERP(key)] = key;
    return acc;
  }, {});

  for (const campo of campos) {
    const realKey = mapa[normalizeKeyERP(campo)];
    if (!realKey) continue;

    const valor = source[realKey];
    if (valor !== null && valor !== undefined && String(valor).trim() !== '') {
      return valor;
    }
  }

  return "";
}

function getObraERP(erp) {
  return pickFirstNonEmpty(getCampoERP(erp, [
    'obra',
    'numero_obra',
    'num_obra',
    'obra_fantasia',
    'numero_fantasia',
    'n_obra',
    'cod_obra'
  ]));
}

function getNumeroPedidoERP(erp) {
  return pickFirstNonEmpty(getCampoERP(erp, [
    'numero_pedido',
    'num_pedido',
    'pedido',
    'numero_do_pedido',
    'n_pedido',
    'cod_pedido'
  ]));
}

function getStatusPedidoERP(erp) {
  return pickFirstNonEmpty(getCampoERP(erp, [
    'status_pedido',
    'status',
    'statuspedido'
  ]));
}

function getSituacaoPedidoERP(erp) {
  return pickFirstNonEmpty(getCampoERP(erp, [
    'situacao_pedido',
    'situação_pedido',
    'situacao',
    'situação'
  ]));
}

function getCondicaoPedidoERP(erp) {
  return pickFirstNonEmpty(getCampoERP(erp, [
    'condicao_pedido',
    'condição_pedido',
    'condicao',
    'condição'
  ]));
}

function getEtapaEfetivaERP(erp) {
  return pickFirstNonEmpty(getCondicaoPedidoERP(erp), erp && erp.etapa);
}

function getDataFaturamentoERP(erp) {
  return pickFirstNonEmpty(
    erp && erp.data_faturam,
    erp && erp.data_faturamento,
    getCampoERP(erp, ['data_faturamento', 'data_faturam', 'dt_faturamento', 'faturamento'])
  );
}

function isPedidoCanceladoERP(erp) {
  const statusPedido = normalizeTextERP(getStatusPedidoERP(erp));
  const etapaEfetiva = normalizeTextERP(getEtapaEfetivaERP(erp));

  if (erp && erp.data_frustrada) return true;
  if (statusPedido === 'C' || statusPedido.includes('CANCEL')) return true;
  if (etapaEfetiva.includes('FRUSTR') || etapaEfetiva.includes('CANCEL')) return true;

  return false;
}

function isPedidoLiquidadoERP(erp) {
  const statusPedido = normalizeTextERP(getStatusPedidoERP(erp));
  return statusPedido === 'L' || statusPedido.includes('LIQUID');
}

function isPedidoAtendidoERP(erp) {
  const situacaoPedido = normalizeTextERP(getSituacaoPedidoERP(erp));
  if (situacaoPedido === 'A' || situacaoPedido.includes('ATEND')) return true;
  return Boolean(erp && erp.data_firmada);
}

function isCondicaoEntregueOuConcluidaERP(erp) {
  const etapaEfetiva = normalizeTextERP(getEtapaEfetivaERP(erp));
  return etapaEfetiva.includes('ENTREG') || etapaEfetiva.includes('CONCLU');
}

function definirStatusPropostaERP(erp, faturamentoFinanceiro) {
  if (isPedidoCanceladoERP(erp)) return "FRUSTRADAS";

  if (
    isPedidoLiquidadoERP(erp) ||
    isFaturamentoFinanceiroContabilizavel(faturamentoFinanceiro) ||
    isCondicaoEntregueOuConcluidaERP(erp) ||
    getDataFaturamentoERP(erp)
  ) {
    return "ENTREGUE";
  }

  if (isPedidoAtendidoERP(erp)) return "FIRMADAS";

  return "ENVIADAS";
}

function normalizarLinhaERP(erp) {
  const source = erp && typeof erp === 'object' ? erp : {};
  const condicao = getCondicaoPedidoERP(source);

  return Object.assign({}, source, {
    obra: pickFirstNonEmpty(getObraERP(source), source.obra),
    numero_pedido: getNumeroPedidoERP(source),
    status_pedido: getStatusPedidoERP(source),
    situacao_pedido: getSituacaoPedidoERP(source),
    condicao_pedido: condicao,
    etapa: pickFirstNonEmpty(condicao, source.etapa),
    nf: pickFirstNonEmpty(source.nf, getCampoERP(source, ['nf', 'nota_fiscal', 'numero_nf', 'nfe'])),
    cliente: pickFirstNonEmpty(source.cliente, getCampoERP(source, ['cliente', 'nome_cliente', 'razao_social'])),
    data_faturamento: pickFirstNonEmpty(source.data_faturamento, getCampoERP(source, ['data_faturamento', 'dt_faturamento'])),
    data_faturam: pickFirstNonEmpty(source.data_faturam, getCampoERP(source, ['data_faturam', 'data_faturamento', 'dt_faturamento'])),
    data_firmada: pickFirstNonEmpty(source.data_firmada, getCampoERP(source, ['data_firmada', 'dt_firmada', 'data_atendida', 'dt_atendida'])),
    data_frustrada: pickFirstNonEmpty(source.data_frustrada, getCampoERP(source, ['data_frustrada', 'dt_frustrada', 'data_cancelamento', 'dt_cancelamento'])),
    data_enviada: pickFirstNonEmpty(source.data_enviada, getCampoERP(source, ['data_enviada', 'dt_enviada', 'data_envio', 'dt_envio'])),
    data_abertura: pickFirstNonEmpty(source.data_abertura, getCampoERP(source, ['data_abertura', 'dt_abertura', 'data_cadastro', 'dt_cadastro'])),
    praz: pickFirstNonEmpty(source.praz, source.pz, getCampoERP(source, ['praz', 'pz', 'prazo', 'dias_prazo'])),
    pz: pickFirstNonEmpty(source.pz, source.praz, getCampoERP(source, ['pz', 'praz', 'prazo', 'dias_prazo']))
  });
}


function buildObservacoesConsolidadas(bloco) {
  const partes = [];

  if (bloco.observacoes.size > 0) {
    partes.push(Array.from(bloco.observacoes).join(" | "));
  }

  if (bloco.nfs.size > 0) {
    partes.push("NF(s): " + Array.from(bloco.nfs).join(" / "));
  }

  if (bloco.itens.size > 0) {
    partes.push("Itens ERP: " + Array.from(bloco.itens).join(" / "));
  }

  return partes.join(" • ");
}

function normalizeDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function normalizeNF(value) {
  return normalizeDigits(value);
}

function getFaturamentoFinanceiroPorNF(value) {
  const nfNormalizada = normalizeNF(value);
  if (!nfNormalizada) return null;
  return FATURAMENTO_FINANCEIRO_2026[nfNormalizada] || null;
}

function isFaturamentoFinanceiroContabilizavel(faturamentoFinanceiro) {
  return Boolean(faturamentoFinanceiro && faturamentoFinanceiro.contabiliza !== false);
}

function isMesFinanceiroFechado2026(value) {
  const mesReferencia = getMonthKeyFromValue(value);
  return MESES_FINANCEIRO_FECHADOS_2026.has(mesReferencia);
}

function deveIgnorarLinhaNoFechamentoFinanceiro(erp) {
  if (!erp) return false;

  const nfNormalizada = normalizeNF(erp.nf);
  if (!nfNormalizada) return false;

  const faturamentoFinanceiro = getFaturamentoFinanceiroPorNF(nfNormalizada);
  if (faturamentoFinanceiro) {
    return !isFaturamentoFinanceiroContabilizavel(faturamentoFinanceiro);
  }

  const dataFaturamentoOriginal = getDataFaturamentoERP(erp);
  return isMesFinanceiroFechado2026(dataFaturamentoOriginal);
}

function extractObraPermitida(value) {
  const txt = String(value || '').trim();
  if (!txt) return null;

  const matches = txt.match(/\d{2}[.,-]?\d{3,}/g);
  if (!matches) return null;

  for (const match of matches) {
    const digits = normalizeDigits(match);
    if (digits.startsWith('26')) {
      return { obraExibicao: match, obraKey: digits };
    }
    if (OBRAS_2025_AUTORIZADAS.has(digits)) {
      return { obraExibicao: match, obraKey: digits };
    }
  }

  return null;
}

function isLinhaCanceladaOuFrustrada(erp) {
  return isPedidoCanceladoERP(erp);
}

function isLinhaFinanceiramenteValida(erp) {
  if (!erp || isLinhaCanceladaOuFrustrada(erp)) return false;

  if (deveIgnorarLinhaNoFechamentoFinanceiro(erp)) return false;

  const nfNormalizada = normalizeNF(erp.nf);
  const temNF = nfNormalizada !== '';
  const faturamentoFinanceiro = getFaturamentoFinanceiroPorNF(erp.nf);
  const temFaturamento = Boolean(isFaturamentoFinanceiroContabilizavel(faturamentoFinanceiro) || getDataFaturamentoERP(erp));

  return temNF && temFaturamento;
}

function getPrioridadeConsolidacaoLinha(item) {
  const erp = item && item.erp ? item.erp : {};
  const statusUp = String((item && item.statusProposta) || '').toUpperCase();

  if (isLinhaFinanceiramenteValida(erp) || statusUp === "ENTREGUE") return 100;
  if (isLinhaCanceladaOuFrustrada(erp)) return 10;
  if (isPedidoAtendidoERP(erp) || statusUp === "FIRMADAS") return 80;
  if (isCondicaoEntregueOuConcluidaERP(erp)) return 70;
  if (erp.data_enviada || statusUp === "ENVIADAS") return 60;
  return 40;
}

function selecionarLinhasParaConsolidacao(grupo) {
  const itens = Array.isArray(grupo && grupo.itens) ? grupo.itens : [];
  if (!itens.length) return [];

  const maiorPrioridade = itens.reduce((maior, item) => {
    return Math.max(maior, getPrioridadeConsolidacaoLinha(item));
  }, 0);

  return itens.filter(item => getPrioridadeConsolidacaoLinha(item) === maiorPrioridade);
}


function parseDataUniversal(value) {
  if (!value) return null;
  if (value instanceof Date) return new Date(value.getTime());
  if (typeof value !== 'string') return null;

  const txt = value.trim();
  if (!txt) return null;

  let m = txt.match(/^(\d{2})\/(\d{2})\/(\d{2,4})$/);
  if (m) {
    const ano = Number(m[3].length === 2 ? `20${m[3]}` : m[3]);
    return new Date(ano, Number(m[2]) - 1, Number(m[1]), 0, 0, 0);
  }

  m = txt.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0);
  }

  const dt = new Date(txt);
  if (!Number.isNaN(dt.getTime())) {
    dt.setHours(12, 0, 0, 0);
    return dt;
  }

  return null;
}

function atualizarMaiorDataFaturamento(bloco, erp, dataFaturamentoPreferencial) {
  const valorOriginal = pickFirstNonEmpty(dataFaturamentoPreferencial, getDataFaturamentoERP(erp));
  const dataNormalizada = parseDataUniversal(String(valorOriginal || '').trim());
  if (!dataNormalizada) return;

  const timestamp = dataNormalizada.getTime();
  if (bloco.maiorDataFaturamentoTs === null || timestamp > bloco.maiorDataFaturamentoTs) {
    bloco.maiorDataFaturamentoTs = timestamp;
    bloco.maiorDataFaturamentoOriginal = valorOriginal;
  }
}

function formatDateToISO(value) {
  const data = parseDataUniversal(String(value || '').trim());
  if (!data) return "";
  const ano = String(data.getFullYear());
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function getMonthKeyFromValue(value) {
  const data = parseDataUniversal(String(value || '').trim());
  if (!data) return "";
  const ano = String(data.getFullYear());
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${ano}-${mes}`;
}

function serializarDetalhesConcluidas(bloco) {
  const detalhes = Array.from(bloco.documentosConcluidos.values()).map(doc => ({
    chave: doc.chave,
    nf: doc.nf,
    data_faturamento: doc.dataFaturamentoIso,
    data_faturamento_original: doc.dataFaturamentoOriginal,
    mes_referencia: doc.mesReferencia,
    valor: doc.valor,
    item: Array.from(doc.itens).join(" / "),
    categoria: Array.from(doc.categorias).join(" / ")
  }));

  const gruposMes = new Map();

  detalhes.forEach(doc => {
    const chaveMes = String(doc.mes_referencia || '').trim();
    if (!chaveMes) return;

    if (!gruposMes.has(chaveMes)) {
      gruposMes.set(chaveMes, {
        mes_referencia: chaveMes,
        valor_total: 0,
        nfs: new Set(),
        itens: new Set(),
        categorias: new Set(),
        data_faturamento_original: doc.data_faturamento_original || doc.data_faturamento || '',
        data_faturamento: doc.data_faturamento || '',
        ultimoTimestamp: parseDataUniversal(String(doc.data_faturamento_original || doc.data_faturamento || '').trim())?.getTime() || 0,
        detalhes_nfs: []
      });
    }

    const grupo = gruposMes.get(chaveMes);
    grupo.valor_total += parseMoneyFlexible(doc.valor);
    addUnique(grupo.nfs, doc.nf);
    addUnique(grupo.itens, doc.item);
    addUnique(grupo.categorias, doc.categoria);
    grupo.detalhes_nfs.push({
      nf: doc.nf,
      valor: parseMoneyFlexible(doc.valor),
      item: doc.item,
      categoria: doc.categoria,
      data_faturamento_original: doc.data_faturamento_original || doc.data_faturamento || '',
      data_faturamento: doc.data_faturamento || ''
    });

    const dataAtual = parseDataUniversal(String(doc.data_faturamento_original || doc.data_faturamento || '').trim());
    const timestampAtual = dataAtual ? dataAtual.getTime() : 0;
    if (timestampAtual > grupo.ultimoTimestamp) {
      grupo.ultimoTimestamp = timestampAtual;
      grupo.data_faturamento_original = doc.data_faturamento_original || doc.data_faturamento || '';
      grupo.data_faturamento = doc.data_faturamento || '';
    }
  });

  const detalhesPorMes = Array.from(gruposMes.values())
    .sort((a, b) => a.ultimoTimestamp - b.ultimoTimestamp)
    .map(grupo => ({
      mes_referencia: grupo.mes_referencia,
      valor_total: grupo.valor_total,
      nf: Array.from(grupo.nfs).join(" / "),
      item: Array.from(grupo.itens).join(" / "),
      categoria: Array.from(grupo.categorias).join(" / "),
      data_faturamento_original: grupo.data_faturamento_original,
      data_faturamento: grupo.data_faturamento,
      detalhes_nfs: grupo.detalhes_nfs
    }));

  return JSON.stringify({
    meta_concluidas_nf: detalhes,
    meta_concluidas_por_mes: detalhesPorMes
  });
}

function criarLinhaBase(item) {
  return [
    item.data_firmada || "", // 0: DATA FIRMADA
    item.obraExibicao || "", // 1: OBRA LIMPA/EXIBIÇÃO
    item.erp.cliente || "", // 2: CLIENTE
    item.valorObra || "", // 3: VALOR
    item.erp.praz || item.erp.pz || "", // 4: DIAS_PRAZO

    // 5 a 16: Itens de controle em branco
    "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A",

    "", // 17: OBSERVAÇÕES
    "{}", // 18: DETALHES JSON
    item.erp.cpmv || 0, // 19: CPMV
    item.erp.item || "", // 20: ITEM
    item.erp.categoria || "", // 21: CATEGORIA

    // 22 a 32: INFORMAÇÕES EXTRAS
    item.statusProposta, // 22: STATUS GERAL DA PROPOSTA
    item.erp.data_abertura || "", // 23: ABERTURA
    item.erp.segmento || "", // 24: SEGMENTO
    item.erp.vendedor || item.erp.responsavel || "", // 25: RESPONSAVEL
    item.erp.complexidade || "", // 26: COMPLEXIDADE
    item.erp.uf || "", // 27: UF
    item.erp.etapa || "", // 28: ETAPA
    item.erp.nf || "", // 29: NF
    item.erp.data_frustrada || "", // 30: FRUSTRADA
    item.erp.data_enviada || "", // 31: ENVIADA
    getDataFaturamentoERP(item.erp) // 32: FATURAMENTO
  ];
}

function consolidarGrupoObra(grupo) {
  const linhasSelecionadas = selecionarLinhasParaConsolidacao(grupo);

  const itemBase = linhasSelecionadas[0] || grupo.itens[0];
  const linha = criarLinhaBase(itemBase);

  const bloco = {
    linha,
    valorTotal: 0,
    itens: new Set(),
    categorias: new Set(),
    nfs: new Set(),
    observacoes: new Set(),
    chavesValorContabilizadas: new Set(),
    maiorDataFaturamentoTs: null,
    maiorDataFaturamentoOriginal: "",
    documentosConcluidos: new Map()
  };

  linhasSelecionadas.forEach(item => {
    const erp = item.erp;
    const nfNormalizada = normalizeNF(erp.nf);
    const faturamentoFinanceiroBruto = item.faturamentoFinanceiro || getFaturamentoFinanceiroPorNF(erp.nf);
    const faturamentoFinanceiro = isFaturamentoFinanceiroContabilizavel(faturamentoFinanceiroBruto) ? faturamentoFinanceiroBruto : null;
    const dataFaturamentoPreferencial = faturamentoFinanceiro ? faturamentoFinanceiro.data : "";
    const valorDocumento = faturamentoFinanceiro
      ? parseMoneyFlexible(faturamentoFinanceiro.valor)
      : parseMoneyFlexible(item.valorNF || 0);
    const chaveValor = nfNormalizada ? `NF:${nfNormalizada}` : `LINHA:${item.sourceIndex}`;

    if (!bloco.chavesValorContabilizadas.has(chaveValor)) {
      bloco.chavesValorContabilizadas.add(chaveValor);
      bloco.valorTotal += parseMoneyFlexible(item.valorContabil);
    }

    bloco.linha[0] = pickFirstNonEmpty(bloco.linha[0], erp.data_firmada);
    bloco.linha[1] = pickFirstNonEmpty(bloco.linha[1], item.obraExibicao);
    bloco.linha[2] = pickFirstNonEmpty(bloco.linha[2], erp.cliente);
    bloco.linha[4] = pickFirstNonEmpty(bloco.linha[4], erp.praz, erp.pz);
    bloco.linha[19] = pickFirstNonEmpty(bloco.linha[19], erp.cpmv || 0);
    bloco.linha[22] = pickFirstNonEmpty(bloco.linha[22], item.statusProposta);
    bloco.linha[23] = pickFirstNonEmpty(bloco.linha[23], erp.data_abertura);
    bloco.linha[24] = pickFirstNonEmpty(bloco.linha[24], erp.segmento);
    bloco.linha[25] = pickFirstNonEmpty(bloco.linha[25], erp.vendedor, erp.responsavel);
    bloco.linha[26] = pickFirstNonEmpty(bloco.linha[26], erp.complexidade);
    bloco.linha[27] = pickFirstNonEmpty(bloco.linha[27], erp.uf);
    bloco.linha[28] = pickFirstNonEmpty(bloco.linha[28], erp.etapa);
    bloco.linha[29] = pickFirstNonEmpty(bloco.linha[29], erp.nf);
    bloco.linha[30] = pickFirstNonEmpty(bloco.linha[30], erp.data_frustrada);
    bloco.linha[31] = pickFirstNonEmpty(bloco.linha[31], erp.data_enviada);
    atualizarMaiorDataFaturamento(bloco, erp, dataFaturamentoPreferencial);

    const dataFaturamentoOriginal = pickFirstNonEmpty(dataFaturamentoPreferencial, getDataFaturamentoERP(erp));
    const dataFaturamentoIso = formatDateToISO(dataFaturamentoOriginal);
    const mesReferencia = getMonthKeyFromValue(dataFaturamentoOriginal);

    if (nfNormalizada && dataFaturamentoIso && valorDocumento > 0) {
      if (!bloco.documentosConcluidos.has(chaveValor)) {
        bloco.documentosConcluidos.set(chaveValor, {
          chave: chaveValor,
          nf: String(erp.nf || '').trim(),
          dataFaturamentoIso,
          dataFaturamentoOriginal,
          mesReferencia,
          valor: valorDocumento,
          itens: new Set(),
          categorias: new Set()
        });
      }

      const detalheDoc = bloco.documentosConcluidos.get(chaveValor);
      detalheDoc.valor = faturamentoFinanceiro ? valorDocumento : Math.max(detalheDoc.valor, valorDocumento);
      addUnique(detalheDoc.itens, erp.item);
      addUnique(detalheDoc.categorias, erp.categoria);

      const dataAtualDoc = parseDataUniversal(detalheDoc.dataFaturamentoOriginal);
      const dataNovaDoc = parseDataUniversal(dataFaturamentoOriginal);
      if (dataNovaDoc && (!dataAtualDoc || dataNovaDoc.getTime() > dataAtualDoc.getTime())) {
        detalheDoc.dataFaturamentoIso = dataFaturamentoIso;
        detalheDoc.dataFaturamentoOriginal = dataFaturamentoOriginal;
        detalheDoc.mesReferencia = mesReferencia;
      }
    }

    addUnique(bloco.itens, erp.item);
    addUnique(bloco.categorias, erp.categoria);
    addUnique(bloco.nfs, erp.nf);
    addUnique(bloco.observacoes, erp.observacoes);
    addUnique(bloco.observacoes, erp.observacao);
    addUnique(bloco.observacoes, erp.obs);
    addUnique(bloco.observacoes, erp.analise);
    if (erp.numero_pedido) addUnique(bloco.observacoes, `Pedido ERP: ${erp.numero_pedido}`);
    if (erp.status_pedido) addUnique(bloco.observacoes, `Status pedido: ${erp.status_pedido}`);
    if (erp.situacao_pedido) addUnique(bloco.observacoes, `Situação pedido: ${erp.situacao_pedido}`);
  });

  bloco.linha[3] = bloco.valorTotal;
  bloco.linha[17] = buildObservacoesConsolidadas(bloco);
  bloco.linha[18] = serializarDetalhesConcluidas(bloco);
  bloco.linha[20] = Array.from(bloco.itens).join(" / ");
  bloco.linha[21] = Array.from(bloco.categorias).join(" / ");
  bloco.linha[29] = Array.from(bloco.nfs).join(" / ");
  bloco.linha[32] = bloco.maiorDataFaturamentoOriginal || bloco.linha[32];

  return bloco.linha;
}

const motorBackend = {

  sincronizarEFetch: async function() {
    try {
      // 1. Conecta no servidor da empresa usando o Túnel Cloudflare (Seguro, HTTPS e Público)
      const response = await fetch('https://bathrooms-estate-implications-dancing.trycloudflare.com/api/carteira');

      if (!response.ok) {
        throw new Error('Erro ao conectar no servidor. Verifique se o túnel e o motor estão rodando.');
      }

      const erpData = await response.json();

      // 2. Prepara o cabeçalho que o script.js espera ler
      const resultado = [
        ["DATA", "OBRA", "CLIENTE", "VALOR", "DIAS PRAZO", ...ITENS_ORDEM, "OBSERVAÇÕES", "DETALHES_JSON", "CPMV", "ITEM", "CATEGORIA"]
      ];

      // Dicionário (memória) para consolidar obras
      const obrasProcessadas = {};

      // 3. Varre os dados do JSON e traduz para a matriz do painel
      if (erpData && erpData.length > 0) {
        erpData.forEach((erpOriginal, sourceIndex) => {
          const erp = normalizarLinhaERP(erpOriginal);
          const obraInfo = extractObraPermitida(erp.obra);
          if (!obraInfo) return;

          if (deveIgnorarLinhaNoFechamentoFinanceiro(erp)) return;

          const faturamentoFinanceiroBruto = getFaturamentoFinanceiroPorNF(erp.nf);
          const faturamentoFinanceiro = isFaturamentoFinanceiroContabilizavel(faturamentoFinanceiroBruto) ? faturamentoFinanceiroBruto : null;
          const valorObra = getValorFinanceiroObra(erp);
          const valorNF = faturamentoFinanceiro ? parseMoneyFlexible(faturamentoFinanceiro.valor) : getValorFinanceiroNF(erp);
          const valorContabil = isLinhaFinanceiramenteValida(erp) && valorNF !== null
            ? valorNF
            : valorObra;

          // Lógica automática para definir o STATUS DA PROPOSTA
          const statusProposta = definirStatusPropostaERP(erp, faturamentoFinanceiro);

          if (!obrasProcessadas[obraInfo.obraKey]) {
            obrasProcessadas[obraInfo.obraKey] = {
              itens: []
            };
          }

          obrasProcessadas[obraInfo.obraKey].itens.push({
            erp,
            valorObra,
            valorNF,
            valorContabil,
            faturamentoFinanceiro,
            statusProposta,
            obraExibicao: obraInfo.obraExibicao,
            sourceIndex
          });
        });

        const listaObras = Object.values(obrasProcessadas).map(consolidarGrupoObra);

        // Ordenação crescente e definitiva
        listaObras.sort((a, b) => {
          return String(a[1] || '').localeCompare(String(b[1] || ''), 'pt-BR', { numeric: true });
        });

        listaObras.forEach(linha => resultado.push(linha));
      }

      return resultado;

    } catch (e) {
      console.error("Erro na comunicação local:", e);
      throw e;
    }
  },

  salvarProjeto: async function(obj) {
    console.log("Simulação local de salvamento:", obj);
    return "✅ (Modo Local) Dados processados na sessão!";
  },

  getResumoGeralObra: async function(numObra) {
    return { encontrado: false };
  },

  getDadosGeralSimplificado: async function(numObra) {
    return null;
  },

  excluirObra: async function(numObra) {
    return "🗑️ (Modo Local) Simulação de exclusão concluída.";
  }
};

window.motorBackend = motorBackend;
