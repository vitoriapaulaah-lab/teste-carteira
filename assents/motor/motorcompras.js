// ==========================================
// motorcompras.js
// MOTOR ISOLADO DE ORDENS DE COMPRA
// Fonte: Google Sheets via Apps Script
// Não interfere no motor principal do ERP.
// ==========================================

(function () {
  const API_URL = "https://script.google.com/macros/s/AKfycbzCwyJ_EfwrlD3gs_5GEmgtzonWlv5dtPEnA5asnUkrcz6LM9rKD5rg1UH4nOo7ss1E/exec";
  const API_LIMIT = 5000;

  let cachePromise = null;
  let cacheCompras = null;
  let cachePorObra = null;

  function normalizeText(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function normalizeUpper(value) {
    return normalizeText(value).toUpperCase();
  }

  function normalizarObraKey(value) {
    const txt = normalizeUpper(value);
    if (!txt) return "";

    const match = txt.match(/(?:OBRA\s*)?(25|26)[\s.,\-]*(\d{3})/);
    if (match) return `${match[1]}${match[2]}`;

    return "";
  }

  function getObraKeyCompra(compra) {
    return normalizarObraKey(compra && compra.ped_cliente) ||
      normalizarObraKey(compra && compra.observacoes) ||
      normalizarObraKey(compra && compra.observacao);
  }

  function parseMoney(value) {
    if (value === null || value === undefined || value === "") return 0;
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;

    let str = String(value).trim();
    if (!str) return 0;

    str = str.replace(/\s/g, "").replace(/[R$r$\u00A0]/g, "");

    if (str.includes(",")) {
      str = str.replace(/\./g, "").replace(",", ".");
    } else {
      const dotCount = (str.match(/\./g) || []).length;
      if (dotCount > 1) str = str.replace(/\./g, "");
    }

    str = str.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(str);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function parseDateValue(value) {
    if (!value) return null;
    if (value instanceof Date) return new Date(value.getTime());

    const txt = String(value).trim();
    if (!txt) return null;

    let m = txt.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);

    m = txt.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 12, 0, 0);

    const dt = new Date(txt);
    if (!Number.isNaN(dt.getTime())) return dt;

    return null;
  }

  function formatDateISO(value) {
    const dt = parseDateValue(value);
    if (!dt) return "";
    const yyyy = String(dt.getFullYear());
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function isCancelada(row, valor) {
    const obs = normalizeUpper(row && (row.observacoes || row.observacao));
    return obs.includes("CANCELAD") || parseMoney(valor) <= 0;
  }

  function sanitizeRow(row) {
    const valor = parseMoney(row && row.valor);
    const totalBruto = parseMoney(row && row.total_bruto);
    const totalIpi = parseMoney(row && row.total_ipi);
    const obraKey = getObraKeyCompra(row);

    return {
      cadastramento: formatDateISO(row && (row.cadastramento || row.cadastro)),
      pednum: String((row && row.pednum) ?? "").trim(),
      fornecedor: String((row && row.fornecedor) ?? "").trim(),
      ped_cliente: String((row && row.ped_cliente) ?? "").trim(),
      valor,
      observacoes: String((row && (row.observacoes || row.observacao)) ?? "").trim(),
      data_entrega: formatDateISO(row && row.data_entrega),
      total_bruto: totalBruto,
      total_ipi: totalIpi,
      nf: String((row && row.nf) ?? "").trim(),
      obra_key: obraKey,
      cancelada: isCancelada(row, valor)
    };
  }

  function fetchJson(url) {
    return fetch(url, { method: "GET", cache: "no-store" })
      .then(resp => {
        if (!resp.ok) throw new Error(`Falha ao buscar compras: HTTP ${resp.status}`);
        return resp.json();
      });
  }

  function fetchJsonp(url) {
    return new Promise((resolve, reject) => {
      const callbackName = `__motorComprasJsonp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      const sep = url.includes("?") ? "&" : "?";
      const script = document.createElement("script");
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("Tempo excedido ao buscar compras."));
      }, 20000);

      function cleanup() {
        clearTimeout(timer);
        try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[callbackName] = payload => {
        cleanup();
        resolve(payload);
      };

      script.onerror = () => {
        cleanup();
        reject(new Error("Falha ao carregar API de compras."));
      };

      script.src = `${url}${sep}callback=${encodeURIComponent(callbackName)}`;
      document.head.appendChild(script);
    });
  }

  async function fetchCompras() {
    if (cacheCompras) return cacheCompras.slice();
    if (cachePromise) return cachePromise;

    const url = `${API_URL}?limit=${API_LIMIT}`;

    cachePromise = fetchJson(url)
      .catch(() => fetchJsonp(url))
      .then(payload => {
        if (!payload || payload.ok === false) {
          throw new Error((payload && payload.error) || "API de compras retornou erro.");
        }

        const data = Array.isArray(payload.data) ? payload.data : [];
        cacheCompras = data.map(sanitizeRow).filter(row => row.pednum || row.obra_key || row.fornecedor);
        cachePorObra = agruparPorObra(cacheCompras);
        return cacheCompras.slice();
      })
      .finally(() => {
        cachePromise = null;
      });

    return cachePromise;
  }

  function agruparPorObra(compras) {
    const grupos = new Map();

    compras.forEach(compra => {
      if (!compra.obra_key) return;

      if (!grupos.has(compra.obra_key)) {
        grupos.set(compra.obra_key, {
          obra_key: compra.obra_key,
          obra_codigo: compra.obra_key.length === 5 ? `${compra.obra_key.slice(0, 2)}.${compra.obra_key.slice(2)}` : compra.obra_key,
          compras: [],
          valorTotal: 0,
          totalBruto: 0,
          totalIpi: 0,
          fornecedores: new Set(),
          notasFiscais: new Set(),
          pedidosOc: new Set(),
          ultimaEntrega: "",
          primeiraCompra: "",
          ultimaCompra: ""
        });
      }

      const grupo = grupos.get(compra.obra_key);
      grupo.compras.push(compra);

      if (!compra.cancelada) {
        grupo.valorTotal += parseMoney(compra.valor);
        grupo.totalBruto += parseMoney(compra.total_bruto);
        grupo.totalIpi += parseMoney(compra.total_ipi);
        if (compra.fornecedor) grupo.fornecedores.add(compra.fornecedor);
        if (compra.nf) grupo.notasFiscais.add(compra.nf);
        if (compra.pednum) grupo.pedidosOc.add(compra.pednum);
      }

      if (compra.data_entrega && (!grupo.ultimaEntrega || compra.data_entrega > grupo.ultimaEntrega)) {
        grupo.ultimaEntrega = compra.data_entrega;
      }

      if (compra.cadastramento) {
        if (!grupo.primeiraCompra || compra.cadastramento < grupo.primeiraCompra) grupo.primeiraCompra = compra.cadastramento;
        if (!grupo.ultimaCompra || compra.cadastramento > grupo.ultimaCompra) grupo.ultimaCompra = compra.cadastramento;
      }
    });

    const result = {};
    grupos.forEach((grupo, key) => {
      grupo.compras.sort((a, b) => {
        const da = a.cadastramento || "";
        const db = b.cadastramento || "";
        if (da !== db) return da.localeCompare(db);
        return String(a.pednum || "").localeCompare(String(b.pednum || ""), undefined, { numeric: true });
      });

      result[key] = {
        obra_key: grupo.obra_key,
        obra_codigo: grupo.obra_codigo,
        compras: grupo.compras,
        valorTotal: grupo.valorTotal,
        totalBruto: grupo.totalBruto,
        totalIpi: grupo.totalIpi,
        fornecedores: Array.from(grupo.fornecedores),
        notasFiscais: Array.from(grupo.notasFiscais),
        pedidosOc: Array.from(grupo.pedidosOc),
        ultimaEntrega: grupo.ultimaEntrega,
        primeiraCompra: grupo.primeiraCompra,
        ultimaCompra: grupo.ultimaCompra,
        qtdValidas: grupo.compras.filter(compra => !compra.cancelada).length,
        qtdCanceladas: grupo.compras.filter(compra => compra.cancelada).length
      };
    });

    return result;
  }

  async function getResumoObra(obraOuKey) {
    await fetchCompras();

    const key = normalizarObraKey(obraOuKey) || String(obraOuKey || "").replace(/\D/g, "");
    if (!key || !cachePorObra || !cachePorObra[key]) {
      return {
        obra_key: key,
        obra_codigo: key && key.length === 5 ? `${key.slice(0, 2)}.${key.slice(2)}` : key,
        compras: [],
        valorTotal: 0,
        totalBruto: 0,
        totalIpi: 0,
        fornecedores: [],
        notasFiscais: [],
        pedidosOc: [],
        ultimaEntrega: "",
        qtdValidas: 0,
        qtdCanceladas: 0
      };
    }

    const resumo = cachePorObra[key];
    return {
      ...resumo,
      compras: resumo.compras.slice(),
      fornecedores: resumo.fornecedores.slice(),
      notasFiscais: resumo.notasFiscais.slice(),
      pedidosOc: resumo.pedidosOc.slice()
    };
  }

  function limparCache() {
    cachePromise = null;
    cacheCompras = null;
    cachePorObra = null;
  }

  window.motorCompras = {
    fetchCompras,
    getResumoObra,
    normalizarObraKey,
    limparCache
  };
})();
