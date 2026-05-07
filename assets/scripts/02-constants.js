(() => {
const SECTORS = ['Administrativo', 'Comercial', 'RH', 'Compras', 'Diretoria', 'Engenharia e PD&I', 'Produção', 'Financeiro', 'Almoxarifado'];
const TARGET_SECTORS = ['Administrativo', 'Comercial', 'Produção', 'Almoxarifado', 'Compras', 'Automação', 'Engenharia e PD&I', 'Financeiro', 'Jurídico'];
const LOGO_URL = 'https://res.cloudinary.com/dbnyxxhe3/image/upload/v1772102800/02_Prancheta_1_ksm9oj.png';

const INITIAL_FORM_DATA = {
  type: 'Evento',
  department: 'RH',
  classification: 'Geral',
  title: '',
  description: '',
  startTime: '09:00',
  endTime: '10:00',
  location: '',
  targetRoles: '',
  hasPeriod: false,
  hasDateRange: false,
  endDate: '',
  originalDate: '',
  newDate: '',
  file: null
};

const CHANGE_DATE_TYPES = ['Alteração de Folga', 'Troca de Feriado'];

// --- FERIADOS PADRÃO (Sempre visíveis como base) ---
const MOCK_HOLIDAYS = [
  { id: 'm1', date: '2026-01-01', name: 'Ano Novo', type: 'nacional' },
  { id: 'm2', date: '2026-02-17', name: 'Carnaval', type: 'nacional' },
  { id: 'm3', date: '2026-03-25', name: 'Data Magna do Ceará', type: 'estadual' },
  { id: 'm4', date: '2026-04-03', name: 'Sexta-feira Santa', type: 'nacional' },
  { id: 'm5', date: '2026-04-21', name: 'Tiradentes', type: 'nacional' },
  { id: 'm6', date: '2026-05-01', name: 'Dia do Trabalhador', type: 'nacional' },
  { id: 'm7', date: '2026-06-04', name: 'Corpus Christi', type: 'nacional' },
  { id: 'm8', date: '2026-09-07', name: 'Independência do Brasil', type: 'nacional' },
  { id: 'm9', date: '2026-10-12', name: 'Nossa Sr.a Aparecida', type: 'nacional' },
  { id: 'm10', date: '2026-10-15', name: 'Emancipação de Caucaia', type: 'municipal' },
  { id: 'm11', date: '2026-11-02', name: 'Finados', type: 'nacional' },
  { id: 'm12', date: '2026-11-15', name: 'Proclamação da República', type: 'nacional' },
  { id: 'm13', date: '2026-12-08', name: 'Nossa Sr.a da Conceição', type: 'municipal' },
  { id: 'm14', date: '2026-12-25', name: 'Natal', type: 'nacional' },
];

// --- FERIADOS QUE DESCONTAM DIAS ÚTEIS NO CÁLCULO DE PROGRESSO ---
// Base 2026 Caucaia/CE: segunda a sexta, descontando apenas feriados em dias úteis.
// Pontos facultativos/emendas, como Carnaval, não entram neste cálculo.
const BUSINESS_DAY_HOLIDAYS_BY_YEAR = {
  2026: [
    '2026-01-01',
    '2026-03-19',
    '2026-03-25',
    '2026-04-03',
    '2026-04-21',
    '2026-05-01',
    '2026-06-04',
    '2026-09-07',
    '2026-10-12',
    '2026-10-15',
    '2026-11-02',
    '2026-11-20',
    '2026-12-08',
    '2026-12-25',
  ],
};

const OPERATIONAL_FLOW_STAGES = [
  { name: 'Comercial', description: 'Entrada do projeto, alinhamento inicial e dados de venda.' },
  { name: 'Engenharia e PD&I', description: 'Estruturação técnica, projeto e validações necessárias.' },
  { name: 'Produção', description: 'Execução, fabricação, montagem ou preparação operacional.' },
  { name: 'Financeiro', description: 'Faturamento, conferências e controles de fechamento.' },
  { name: 'Entrega', description: 'Conclusão, envio, instalação ou acompanhamento final.' },
];

  window.AppConstants = {
    SECTORS,
    TARGET_SECTORS,
    LOGO_URL,
    INITIAL_FORM_DATA,
    CHANGE_DATE_TYPES,
    MOCK_HOLIDAYS,
    BUSINESS_DAY_HOLIDAYS_BY_YEAR,
    OPERATIONAL_FLOW_STAGES
  };
})();
