    const { useState, useMemo, useEffect, useRef } = React;

    // --- CONFIGURAÇÃO DO SUPABASE ---
    const supabaseUrl = 'https://pwmgbaxywvyyfmlkygqr.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bWdiYXh5d3Z5eWZtbGt5Z3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNDI3NDAsImV4cCI6MjA5MjkxODc0MH0.kSYonDj0VBHjMZuVlGeVQjAuMmbEBMQfB4OsBcZOecg';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // --- ÍCONES ---
    const CalendarIcon = ({ size=24, className="", strokeWidth=2 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
    const MapPin = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
    const Briefcase = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    const Flag = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>;
    const Filter = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
    const ChevronRight = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;
    const ChevronLeft = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>;
    const Clock = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    const X = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
    const ArrowRight = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
    const FileText = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
    const DollarSign = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
    const PlusCircle = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
    const Lock = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    const Unlock = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>;
    const Paperclip = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>;
    const Users = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    const LogOut = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    const CheckCircle = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
    const AlertTriangle = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
    const Home = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7"/><path d="M9 22V12h6v10"/><path d="M21 9v13H3V9"/></svg>;
    const Pencil = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
    const Trash2 = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;
    const Cake = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>;
    const Wrench = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.7 6.3a4.5 4.5 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4.5 4.5 0 0 0 5.4-5.4l-3 3-3-3 3-3Z"/></svg>;
    const ShieldCheck = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
    const Layers = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0l8.57-3.91a1 1 0 0 0 0-1.83z"/><path d="m22 12.5-9.17 4.18a2 2 0 0 1-1.66 0L2 12.5"/><path d="m22 17.5-9.17 4.18a2 2 0 0 1-1.66 0L2 17.5"/></svg>;
    const BarChart3 = ({ size=24, className="" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;

    const SECTORS = ['Administrativo', 'Comercial', 'RH', 'Compras', 'Diretoria', 'Engenharia e PD&I', 'Produção', 'Financeiro', 'Almoxarifado'];
    const TARGET_SECTORS = ['Administrativo', 'Comercial', 'Produção', 'Almoxarifado', 'Compras', 'Automação', 'Engenharia e PD&I', 'Financeiro', 'Jurídico'];
    const LOGO_URL = 'https://res.cloudinary.com/dbnyxxhe3/image/upload/v1772102800/02_Prancheta_1_ksm9oj.png';

    const APP_VIEWS = [
      { id: 'dashboard', label: 'Dashboard Semanal', shortLabel: 'Início', icon: Home, description: 'Semana, avisos e indicadores' },
      { id: 'informes', label: 'Informes', shortLabel: 'Informes', icon: FileText, description: 'Comunicados e histórico' },
      { id: 'atividades', label: 'Atividades', shortLabel: 'Tarefas', icon: CheckCircle, description: 'Rotina diária e validações' },
      { id: 'projetos', label: 'Projetos', shortLabel: 'Projetos', icon: Briefcase, description: 'Fluxos, etapas e cascatas' },
      { id: 'aprovacoes', label: 'Aprovações', shortLabel: 'Aprovar', icon: ShieldCheck, description: 'Fila exclusiva do admin', adminOnly: true },
      { id: 'admin-tatico', label: 'Admin Tático', shortLabel: 'Admin', icon: Lock, description: 'Gestão e governança', adminOnly: true },
    ];

    const TASK_STATUS_META = {
      BLOCKED: { label: 'Bloqueada', badge: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400', icon: Lock },
      AVAILABLE: { label: 'Liberada', badge: 'bg-brand-50 text-brand-700 border-brand-100', dot: 'bg-brand-500', icon: Unlock },
      IN_PROGRESS: { label: 'Em andamento', badge: 'bg-cyan-50 text-cyan-700 border-cyan-100', dot: 'bg-cyan-500', icon: Clock },
      SUBMITTED: { label: 'Aguardando aprovação', badge: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500', icon: AlertTriangle },
      REJECTED: { label: 'Reprovada / Ajustar', badge: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500', icon: AlertTriangle },
      APPROVED: { label: 'Aprovada pelo admin', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500', icon: CheckCircle },
      DONE: { label: 'Concluída', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600', icon: CheckCircle },
      CANCELLED: { label: 'Cancelada', badge: 'bg-slate-50 text-slate-400 border-slate-200', dot: 'bg-slate-300', icon: X },
    };

    const DEMO_TACTICAL_PROJECTS = [
      {
        id: 'proj-fluidos-001',
        clientName: 'Cliente demonstrativo',
        name: 'Sistema hidráulico personalizado',
        description: 'Fluxo piloto para validar Comercial → PD&I → Cliente → Produção sem impactar o banco atual.',
        priority: 'Alta',
        status: 'Em andamento',
        ownerSector: 'Comercial',
        deadline: '2026-05-29',
        createdAt: '2026-05-07'
      },
      {
        id: 'proj-automacao-002',
        clientName: 'Cliente interno',
        name: 'Padronização de proposta técnica',
        description: 'Projeto interno para organizar entregáveis, anexos e critérios de aprovação entre setores.',
        priority: 'Média',
        status: 'Planejamento',
        ownerSector: 'Engenharia e PD&I',
        deadline: '2026-06-12',
        createdAt: '2026-05-07'
      }
    ];

    const DEMO_TACTICAL_TASKS = [
      {
        id: 'task-comercial-briefing',
        projectId: 'proj-fluidos-001',
        stage: 'Comercial',
        title: 'Registrar briefing comercial do cliente',
        description: 'Consolidar necessidade, escopo inicial, premissas comerciais e observações do atendimento.',
        assignedSector: 'Comercial',
        assignedTo: 'Equipe Comercial',
        dueDate: '2026-05-11',
        priority: 'Alta',
        status: 'AVAILABLE',
        dependsOn: [],
        evidence: '',
        createdBy: 'Admin'
      },
      {
        id: 'task-pdi-desenho',
        projectId: 'proj-fluidos-001',
        stage: 'PD&I',
        title: 'Desenvolver desenho técnico preliminar',
        description: 'Criar o desenho técnico com base no briefing aprovado pelo admin.',
        assignedSector: 'Engenharia e PD&I',
        assignedTo: 'Responsável técnico',
        dueDate: '2026-05-16',
        priority: 'Alta',
        status: 'BLOCKED',
        dependsOn: ['task-comercial-briefing'],
        evidence: '',
        createdBy: 'Admin'
      },
      {
        id: 'task-pdi-calculos',
        projectId: 'proj-fluidos-001',
        stage: 'PD&I',
        title: 'Realizar cálculos e proposta técnica',
        description: 'Executar cálculos, validar parâmetros de fluido/bomba e montar proposta técnica.',
        assignedSector: 'Engenharia e PD&I',
        assignedTo: 'Engenharia',
        dueDate: '2026-05-22',
        priority: 'Alta',
        status: 'BLOCKED',
        dependsOn: ['task-pdi-desenho'],
        evidence: '',
        createdBy: 'Admin'
      },
      {
        id: 'task-cliente-retorno',
        projectId: 'proj-fluidos-001',
        stage: 'Cliente',
        title: 'Registrar retorno de aprovação do cliente',
        description: 'Informar aprovação, solicitação de revisão ou reprovação da proposta enviada.',
        assignedSector: 'Comercial',
        assignedTo: 'Comercial',
        dueDate: '2026-05-26',
        priority: 'Média',
        status: 'BLOCKED',
        dependsOn: ['task-pdi-calculos'],
        evidence: '',
        createdBy: 'Admin'
      },
      {
        id: 'task-producao-planejamento',
        projectId: 'proj-fluidos-001',
        stage: 'Produção',
        title: 'Liberar planejamento inicial de produção',
        description: 'Criar plano inicial de execução após aprovação do cliente validada pelo admin.',
        assignedSector: 'Produção',
        assignedTo: 'Produção',
        dueDate: '2026-05-29',
        priority: 'Média',
        status: 'BLOCKED',
        dependsOn: ['task-cliente-retorno'],
        evidence: '',
        createdBy: 'Admin'
      },
      {
        id: 'task-template-proposta',
        projectId: 'proj-automacao-002',
        stage: 'Padronização',
        title: 'Mapear campos obrigatórios da proposta técnica',
        description: 'Listar campos essenciais para futuras propostas e aprovações.',
        assignedSector: 'Engenharia e PD&I',
        assignedTo: 'PD&I',
        dueDate: '2026-05-20',
        priority: 'Média',
        status: 'AVAILABLE',
        dependsOn: [],
        evidence: '',
        createdBy: 'Admin'
      }
    ];

    const loadLocalState = (key, fallback) => {
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        console.warn(`Não foi possível carregar ${key} do armazenamento local.`, error);
        return fallback;
      }
    };

    const saveLocalState = (key, value) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Não foi possível salvar ${key} no armazenamento local.`, error);
      }
    };


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

    // --- COMPONENTE MODAL GLOBAL (mantido fora do App para evitar remount/piscada em inputs) ---
    const Modal = ({ isOpen, onClose, title, children, icon: Icon, colorClass, desktopFullScreen = false }) => {
      if (!isOpen) return null;
      const modalPaddingClass = desktopFullScreen ? 'md:p-0' : 'md:p-6';
      const modalPanelClass = desktopFullScreen
        ? 'md:h-screen md:max-h-screen md:max-w-none md:rounded-none md:mt-0'
        : 'md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-2xl md:mt-0 md:rounded-t-2xl';

      return (
        <div className={`fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 pb-0 ${modalPaddingClass}`}>
          <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
          <div className={`relative w-full h-full bg-white shadow-2xl flex flex-col overflow-hidden modal-animate mt-12 rounded-t-2xl ${modalPanelClass}`}>
            <div className="w-full flex justify-center pt-3 pb-1 md:hidden bg-white" onClick={onClose}><div className="w-12 h-1.5 bg-slate-200 rounded-full"></div></div>
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-white z-20">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg text-white flex-shrink-0 ${colorClass}`}><Icon size={24} /></div>
                <h3 className="text-lg md:text-2xl font-bold text-brand-900 leading-tight">{title}</h3>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors border border-slate-200 flex-shrink-0 ml-2"><X size={20} /></button>
            </div>
            <div className="p-4 md:p-8 overflow-y-auto flex-1 hide-scrollbar bg-slate-50/50">{children}</div>
          </div>
        </div>
      );
    };

    const InteractionModal = ({ dialog, onClose, onConfirm, isLoading = false }) => {
      if (!dialog?.isOpen) return null;

      const isConfirm = dialog.variant === 'confirm';
      const variantStyles = {
        success: {
          iconWrap: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          Icon: CheckCircle
        },
        error: {
          iconWrap: 'bg-red-50 text-red-600 border-red-100',
          button: 'bg-red-600 hover:bg-red-700 text-white',
          Icon: X
        },
        warning: {
          iconWrap: 'bg-amber-50 text-amber-600 border-amber-100',
          button: 'bg-red-600 hover:bg-red-700 text-white',
          Icon: AlertTriangle
        },
        info: {
          iconWrap: 'bg-brand-50 text-brand-600 border-brand-100',
          button: 'bg-brand-600 hover:bg-brand-700 text-white',
          Icon: FileText
        },
        confirm: {
          iconWrap: 'bg-amber-50 text-amber-600 border-amber-100',
          button: 'bg-red-600 hover:bg-red-700 text-white',
          Icon: AlertTriangle
        }
      };

      const style = variantStyles[dialog.variant] || variantStyles.info;
      const DialogIcon = dialog.icon || style.Icon;

      return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-sm transition-opacity" onClick={isLoading ? undefined : onClose}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden modal-animate">
            <div className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${style.iconWrap}`}>
                  <DialogIcon size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-xl font-black text-brand-900 leading-tight">
                    {dialog.title}
                  </h3>
                  {dialog.message && (
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mt-2 whitespace-pre-line">
                      {dialog.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 md:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              {isConfirm && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors disabled:opacity-60"
                >
                  {dialog.cancelText || 'Cancelar'}
                </button>
              )}
              <button
                type="button"
                onClick={isConfirm ? onConfirm : onClose}
                disabled={isLoading}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${isConfirm ? variantStyles.confirm.button : style.button}`}
              >
                {isLoading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>}
                {isLoading ? 'Processando...' : (dialog.confirmText || 'Entendi')}
              </button>
            </div>
          </div>
        </div>
      );
    };


    // --- BOTÃO FLUTUANTE GLOBAL ---
    const FloatingActionButton = ({
      onAdminAccess,
      onNavigate,
      onLogout,
      isAdmin,
      user,
      profile,
      currentView,
      navigationItems = []
    }) => {
      const [isFabOpen, setIsFabOpen] = useState(false);
      const clickTimerRef = useRef(null);
      const homeUrl = 'https://maishidrosolucoes-cmyk.github.io/redirecionadormais/';
      const primaryActionLabel = isAdmin ? 'Adicionar evento ou informe' : 'Entrar na conta ADM';
      const PrimaryActionIcon = isAdmin ? PlusCircle : Lock;

      const closeFab = () => {
        setIsFabOpen(false);
      };

      const handleFabClick = (e) => {
        e.preventDefault();

        if (clickTimerRef.current === null) {
          clickTimerRef.current = setTimeout(() => {
            setIsFabOpen(prev => !prev);
            clickTimerRef.current = null;
          }, 250);
        } else {
          clearTimeout(clickTimerRef.current);
          clickTimerRef.current = null;
          window.location.href = homeUrl;
        }
      };

      const handleAdminAccess = () => {
        closeFab();
        onAdminAccess();
      };

      const handleGoHome = () => {
        window.location.href = homeUrl;
      };

      const handleNavigate = (viewId) => {
        closeFab();
        onNavigate(viewId);
      };

      const handleLogoutAction = () => {
        closeFab();
        onLogout();
      };

      useEffect(() => {
        const handleOutsideClick = (e) => {
          const fabRoot = document.getElementById('floating-action-button-root');
          if (isFabOpen && fabRoot && !fabRoot.contains(e.target)) {
            closeFab();
          }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
          document.removeEventListener('click', handleOutsideClick);
          if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current);
          }
        };
      }, [isFabOpen]);

      return (
        <div id="floating-action-button-root" className="fixed bottom-6 right-6 z-[45] flex flex-col items-end font-sans">
          <div className={`flex flex-col gap-3 mb-4 items-end transition-all duration-300 transform max-h-[calc(100vh-7rem)] overflow-y-auto hide-scrollbar pr-1 ${isFabOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className="flex items-center gap-3 hover:scale-105 transition-transform group"
                  aria-current={active ? 'page' : undefined}
                >
                  <span className={`text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap border transition-colors ${
                    active
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-700 border-slate-100 group-hover:text-brand-700'
                  }`}>
                    {item.shortLabel || item.label}
                  </span>
                  <div className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center border transition-colors ${
                    active
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-brand-600 border-slate-100 group-hover:bg-brand-50'
                  }`}>
                    <Icon size={20} />
                  </div>
                </button>
              );
            })}

            {isAdmin && (
              <button type="button" onClick={handleAdminAccess} className="flex items-center gap-3 hover:scale-105 transition-transform group">
                <span className="bg-white text-slate-700 border border-slate-100 text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap group-hover:text-brand-700">
                  {primaryActionLabel}
                </span>
                <div className="w-12 h-12 rounded-full bg-white text-brand-600 shadow-md flex items-center justify-center border border-slate-100 group-hover:bg-brand-50 transition-colors">
                  <PrimaryActionIcon size={20} />
                </div>
              </button>
            )}

            {user ? (
              <button type="button" onClick={handleLogoutAction} className="flex items-center gap-3 hover:scale-105 transition-transform group">
                <span className="bg-white text-amber-700 border border-amber-100 text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap group-hover:bg-amber-50">
                  Sair da conta
                </span>
                <div className="w-12 h-12 rounded-full bg-white text-amber-700 shadow-md flex items-center justify-center border border-amber-100 group-hover:bg-amber-50 transition-colors">
                  <LogOut size={20} />
                </div>
              </button>
            ) : (
              <button type="button" onClick={handleAdminAccess} className="flex items-center gap-3 hover:scale-105 transition-transform group">
                <span className="bg-white text-slate-700 border border-slate-100 text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap group-hover:text-brand-700">
                  {primaryActionLabel}
                </span>
                <div className="w-12 h-12 rounded-full bg-white text-brand-600 shadow-md flex items-center justify-center border border-slate-100 group-hover:bg-brand-50 transition-colors">
                  <PrimaryActionIcon size={20} />
                </div>
              </button>
            )}

            <button type="button" onClick={handleGoHome} className="flex items-center gap-3 hover:scale-105 transition-transform group">
              <span className="bg-slate-800 text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap">
                Voltar para página inicial
              </span>
              <div className="w-12 h-12 rounded-full bg-slate-800 text-white shadow-md flex items-center justify-center group-hover:bg-brand-700 transition-colors">
                <Home size={20} />
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={handleFabClick}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center border outline-none hover:scale-105 active:scale-95 ${
              isFabOpen
                ? 'bg-brand-600 text-white border-brand-600 opacity-100'
                : 'bg-white text-brand-600 border-slate-200 opacity-60 hover:opacity-100 focus:opacity-100'
            }`}
            title="1 clique para abrir o menu | 2 cliques para voltar ao início"
            aria-label={isFabOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isFabOpen}
          >
            <div className={`transition-transform duration-300 ${isFabOpen ? 'rotate-90' : 'rotate-0'}`}>
              {isFabOpen ? <X size={28} /> : <PlusCircle size={30} />}
            </div>
          </button>
        </div>
      );
    };

    function App() {
      // --- ESTADOS (State) ---
      const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' ou 'login'
      const todayDate = new Date(); 
      const [viewDate, setViewDate] = useState(todayDate); 
      const [filter, setFilter] = useState('todos'); 
      
      // Estados de Base de Dados
      const [hrEvents, setHrEvents] = useState([]);
      const [dbHolidays, setDbHolidays] = useState([]);

      // Estados táticos locais da Etapa 1
      // Estes dados permitem testar páginas, status e cascata antes da criação das tabelas definitivas no Supabase.
      const [tacticalProjects, setTacticalProjects] = useState(() => loadLocalState('agendaTaticaProjectsV1', DEMO_TACTICAL_PROJECTS));
      const [tacticalTasks, setTacticalTasks] = useState(() => loadLocalState('agendaTaticaTasksV1', DEMO_TACTICAL_TASKS));
      
      // Estados de Autenticação
      const [user, setUser] = useState(null);
      const [profile, setProfile] = useState(null);
      const [authEmail, setAuthEmail] = useState('');
      const [authPassword, setAuthPassword] = useState('');
      const [isSignUp, setIsSignUp] = useState(false);
      const [authLoading, setAuthLoading] = useState(false);

      // Estados de Modais UI
      const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
      const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
      const [isDayModalOpen, setIsDayModalOpen] = useState(false);
      const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
      const [selectedDay, setSelectedDay] = useState(null);
      const [expandedMonthKey, setExpandedMonthKey] = useState(null);
      const [feedbackDialog, setFeedbackDialog] = useState(null);
      const [confirmDialog, setConfirmDialog] = useState(null);

      // Estado do Formulário de Inserção
      const [adminSelectedDate, setAdminSelectedDate] = useState(null);
      const [editingEventId, setEditingEventId] = useState(null);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });

      const scrollContainerRef = useRef(null);
      const todayRef = useRef(null);
      const adminMonthScrollRefs = useRef([]);
      const currentAdminMonthRef = useRef(null);

      const anyModalOpen = isHolidayModalOpen || isMonthModalOpen || isDayModalOpen || isAdminModalOpen || !!feedbackDialog || !!confirmDialog;

      const clearAdminFormFields = () => {
        setEditingEventId(null);
        setFormData({ ...INITIAL_FORM_DATA });
      };

      const resetAdminForm = () => {
        setAdminSelectedDate(null);
        clearAdminFormFields();
      };

      const closeAdminModal = () => {
        setIsAdminModalOpen(false);
        resetAdminForm();
      };

      const showFeedbackDialog = (variant, title, message) => {
        setFeedbackDialog({ isOpen: true, variant, title, message });
      };

      const closeFeedbackDialog = () => {
        setFeedbackDialog(null);
      };

      const showConfirmDialog = ({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm }) => {
        setConfirmDialog({
          isOpen: true,
          variant: 'confirm',
          title,
          message,
          confirmText,
          cancelText,
          onConfirm
        });
      };

      const closeConfirmDialog = () => {
        if (!isSubmitting) setConfirmDialog(null);
      };

      const handleConfirmDialogAction = async () => {
        if (!confirmDialog?.onConfirm) {
          setConfirmDialog(null);
          return;
        }

        await confirmDialog.onConfirm();
        setConfirmDialog(null);
      };

      const handleAdminDaySelect = (day) => {
        clearAdminFormFields();
        setAdminSelectedDate(day);
      };

      const handleBackToAdminMonths = () => {
        resetAdminForm();
      };

      const toggleTargetSector = (sector) => {
        setFormData(prev => {
          const selectedSectors = prev.targetRoles
            ? prev.targetRoles.split(',').map(item => item.trim()).filter(Boolean)
            : [];
          const nextSectors = selectedSectors.includes(sector)
            ? selectedSectors.filter(item => item !== sector)
            : [...selectedSectors, sector];

          return {
            ...prev,
            targetRoles: nextSectors.join(', ')
          };
        });
      };

      const handleFormTypeChange = (nextType) => {
        setFormData(prev => {
          const usesTime = nextType === 'Evento' || nextType === 'Informe';
          const usesChangeDate = CHANGE_DATE_TYPES.includes(nextType);
          const usesDateRange = !usesChangeDate;

          return {
            ...prev,
            type: nextType,
            classification: nextType === 'Informe' ? (prev.classification || INITIAL_FORM_DATA.classification) : INITIAL_FORM_DATA.classification,
            hasPeriod: nextType === 'Informe' ? prev.hasPeriod : false,
            hasDateRange: usesDateRange ? prev.hasDateRange : false,
            endDate: usesDateRange ? prev.endDate : INITIAL_FORM_DATA.endDate,
            startTime: usesTime ? prev.startTime : INITIAL_FORM_DATA.startTime,
            endTime: usesTime ? prev.endTime : INITIAL_FORM_DATA.endTime,
            location: nextType === 'Evento' ? prev.location : INITIAL_FORM_DATA.location,
            targetRoles: nextType === 'Evento' ? prev.targetRoles : INITIAL_FORM_DATA.targetRoles,
            originalDate: usesChangeDate ? prev.originalDate : INITIAL_FORM_DATA.originalDate,
            newDate: usesChangeDate ? prev.newDate : INITIAL_FORM_DATA.newDate
          };
        });
      };

      const ensureUserProfile = async (currentUser) => {
        if (!currentUser?.id) return null;

        const profilePayload = {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || currentUser.email || 'Usuário',
          department: 'Geral',
          is_admin: false
        };

        const { data, error } = await supabase
          .from('profiles')
          .upsert([profilePayload], { onConflict: 'id', ignoreDuplicates: true })
          .select('*')
          .maybeSingle();

        if (error) {
          console.error('Erro ao garantir perfil do usuário:', error);
          return null;
        }

        return data;
      };

      // --- BUSCA DE DADOS INICIAIS (SUPABASE) ---
      useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        fetchData(); 

        return () => subscription.unsubscribe();
      }, []);

      useEffect(() => {
        document.body.style.overflow = anyModalOpen ? 'hidden' : '';

        return () => {
          document.body.style.overflow = '';
        };
      }, [anyModalOpen]);

      useEffect(() => {
        if (user) {
          const fetchProfile = async () => {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
            if (error) {
              console.error('Erro ao buscar perfil do usuário:', error);
              return;
            }

            if (data) {
              setProfile(data);
            } else {
              const createdProfile = await ensureUserProfile(user);
              if (createdProfile) setProfile(createdProfile);
            }
          };
          fetchProfile();
        } else {
          setProfile(null);
        }
      }, [user]);

      useEffect(() => {
        if (isMonthModalOpen) {
          setExpandedMonthKey(null);
        }
      }, [isMonthModalOpen]);

      useEffect(() => {
        saveLocalState('agendaTaticaProjectsV1', tacticalProjects);
      }, [tacticalProjects]);

      useEffect(() => {
        saveLocalState('agendaTaticaTasksV1', tacticalTasks);
      }, [tacticalTasks]);

      const fetchData = async () => {
        const { data: eventsData, error: eventsError } = await supabase.from('events').select('*');
        if (eventsError) {
          console.error('Erro ao buscar eventos:', eventsError);
        }
        if (eventsData) setHrEvents(eventsData);

        const { data: holidaysData, error: holidaysError } = await supabase.from('holidays').select('*');
        if (holidaysError) {
          console.error('Erro ao buscar feriados:', holidaysError);
        }
        if (holidaysData) setDbHolidays(holidaysData);
      };

      // --- LÓGICA MISTA DE FERIADOS (FIXOS + DB) ---
      const allHolidays = useMemo(() => {
        const combined = [...MOCK_HOLIDAYS];
        dbHolidays.forEach(dbHoliday => {
          const exists = combined.some(h => h.date === dbHoliday.date && h.name === dbHoliday.name);
          if (!exists) {
            combined.push(dbHoliday);
          }
        });
        return combined.sort((a, b) => new Date(a.date) - new Date(b.date));
      }, [dbHolidays]);

      // --- LÓGICA DE AUTENTICAÇÃO ---
      const handleAuth = async (e) => {
        e.preventDefault();
        setAuthLoading(true);

        try {
          if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({ email: authEmail, password: authPassword, options: { data: { full_name: 'Usuário' } } });
            if (error) {
              showFeedbackDialog('error', 'Erro ao criar conta', error.message);
              return;
            }

            if (data?.user) {
              const createdProfile = await ensureUserProfile(data.user);
              if (createdProfile) setProfile(createdProfile);
            }

            showFeedbackDialog('success', 'Conta criada com sucesso', data?.session ? 'Redirecionando para o calendário.' : 'Se a confirmação por e-mail estiver ativa no Supabase, confirme o e-mail antes de fazer login.');
            setIsSignUp(false);
            setCurrentView('dashboard');
            setAuthEmail('');
            setAuthPassword('');
          } else {
            const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
            if (error) {
              showFeedbackDialog('error', 'Erro no login', error.message);
              return;
            }

            if (data?.user) {
              setUser(data.user);
            }

            setCurrentView('dashboard');
            setAuthEmail('');
            setAuthPassword('');

            if (data?.user) {
              ensureUserProfile(data.user)
                .then((existingProfile) => {
                  if (existingProfile) setProfile(existingProfile);
                })
                .catch((profileError) => {
                  console.error('Erro ao carregar perfil após login:', profileError);
                });
            }
          }
        } finally {
          setAuthLoading(false);
        }
      };

      const handleLogout = async () => {
        await supabase.auth.signOut();
        setCurrentView('dashboard');
      };

      // --- LÓGICA DE ADMINISTRAÇÃO (EDITAR / EXCLUIR / SALVAR NO SUPABASE) ---
      const handleEditAdminEvent = (event) => {
        if (!event) return;

        setEditingEventId(event.id);
        setAdminSelectedDate(new Date(event.date + 'T12:00:00'));
        setFormData({
          type: event.type || INITIAL_FORM_DATA.type,
          department: event.department || INITIAL_FORM_DATA.department,
          classification: event.classification || INITIAL_FORM_DATA.classification,
          title: event.title || '',
          description: event.description || '',
          startTime: event.start_time ? event.start_time.substring(0, 5) : INITIAL_FORM_DATA.startTime,
          endTime: event.end_time ? event.end_time.substring(0, 5) : INITIAL_FORM_DATA.endTime,
          location: event.location || '',
          targetRoles: event.target_roles || '',
          hasPeriod: !!event.has_period,
          hasDateRange: !!event.end_date && event.end_date !== event.date,
          endDate: event.end_date || '',
          originalDate: event.original_date || '',
          newDate: event.new_date || '',
          file: null
        });
      };

      const executeDeleteAdminEvent = async (event) => {
        setIsSubmitting(true);

        try {
          const { data: deletedRows, error } = await supabase
            .from('events')
            .delete()
            .eq('id', event.id)
            .select('id');

          if (error) {
            showFeedbackDialog('error', 'Erro ao excluir registro', error.message);
            return;
          }

          if (!deletedRows || deletedRows.length === 0) {
            showFeedbackDialog('error', 'Exclusão não confirmada', 'O Supabase não confirmou a remoção deste registro. Verifique se seu usuário possui permissão administrativa para excluir eventos.');
            fetchData();
            return;
          }

          if (editingEventId === event.id) {
            clearAdminFormFields();
          }

          showFeedbackDialog('success', 'Registro excluído', 'O registro foi excluído com sucesso.');
          fetchData();
        } catch (error) {
          console.error('Erro inesperado ao excluir registro:', error);
          showFeedbackDialog('error', 'Erro inesperado', 'Não foi possível excluir o registro. Verifique o console para mais detalhes.');
        } finally {
          setIsSubmitting(false);
        }
      };

      const handleDeleteAdminEvent = (event) => {
        if (!event?.id || isSubmitting) return;

        showConfirmDialog({
          title: 'Excluir registro?',
          message: `O registro "${event.title}" será removido deste dia. Esta ação não pode ser desfeita.`,
          confirmText: 'Excluir registro',
          cancelText: 'Cancelar',
          onConfirm: () => executeDeleteAdminEvent(event)
        });
      };

      // --- LÓGICA DE ADMINISTRAÇÃO (SALVAR NO SUPABASE) ---
      const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!adminSelectedDate || !formData.title.trim() || isSubmitting) return;
        setIsSubmitting(true);

        try {
          const editingEvent = editingEventId ? hrEvents.find(event => event.id === editingEventId) : null;
          let attachmentPath = editingEvent?.attachment_path || null;
          let hasAttachment = !!editingEvent?.has_attachment;

          if (formData.file) {
            const fileExt = formData.file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('arquivos avisos')
              .upload(`anexos/${fileName}`, formData.file);

            if (uploadError) {
              showFeedbackDialog('error', 'Erro no upload do anexo', uploadError.message);
              return;
            }

            attachmentPath = uploadData.path;
            hasAttachment = true;
          }

          const yyyy = adminSelectedDate.getFullYear();
          const mm = String(adminSelectedDate.getMonth() + 1).padStart(2, '0');
          const dd = String(adminSelectedDate.getDate()).padStart(2, '0');
          const dateString = `${yyyy}-${mm}-${dd}`;
          const isChangeDateType = CHANGE_DATE_TYPES.includes(formData.type);
          const rangeEndDate = !isChangeDateType && formData.hasDateRange ? formData.endDate : null;

          if (!isChangeDateType && formData.hasDateRange && !rangeEndDate) {
            showFeedbackDialog('error', 'Data final obrigatória', 'Informe a data final para registros que duram mais de um dia.');
            return;
          }

          if (rangeEndDate && rangeEndDate < dateString) {
            showFeedbackDialog('error', 'Data final inválida', 'A data final do registro não pode ser anterior à data inicial selecionada.');
            return;
          }

          const eventData = {
            date: dateString,
            title: formData.title,
            description: formData.description,
            type: formData.type,
            department: formData.department,
            has_attachment: hasAttachment,
            attachment_path: attachmentPath,
            created_by: editingEvent?.created_by || user?.id,
            start_time: formData.type === 'Evento' || (formData.type === 'Informe' && formData.hasPeriod) ? formData.startTime : null,
            end_time: formData.type === 'Evento' || (formData.type === 'Informe' && formData.hasPeriod) ? formData.endTime : null,
            location: formData.type === 'Evento' ? formData.location : null,
            target_roles: formData.type === 'Evento' ? formData.targetRoles : null,
            classification: formData.type === 'Informe' ? formData.classification : null,
            has_period: formData.type === 'Informe' ? formData.hasPeriod : false,
            end_date: rangeEndDate,
            original_date: isChangeDateType ? formData.originalDate : null,
            new_date: isChangeDateType ? formData.newDate : null,
          };

          const { error } = editingEventId
            ? await supabase.from('events').update(eventData).eq('id', editingEventId)
            : await supabase.from('events').insert([eventData]);

          if (error) {
            showFeedbackDialog('error', `Erro ao ${editingEventId ? 'atualizar' : 'salvar'} registro`, error.message);
            return;
          }

          showFeedbackDialog('success', editingEventId ? 'Registro atualizado' : 'Registro adicionado', editingEventId ? 'O registro foi atualizado com sucesso.' : 'O novo registro foi salvo com sucesso.');
          clearAdminFormFields();
          fetchData();
        } catch (error) {
          console.error('Erro inesperado ao salvar registro:', error);
          showFeedbackDialog('error', 'Erro inesperado', 'Não foi possível salvar o registro. Verifique o console para mais detalhes.');
        } finally {
          setIsSubmitting(false);
        }
      };

      // --- LÓGICA DE NAVEGAÇÃO UI ---
      const nextWeek = () => { const newDate = new Date(viewDate); newDate.setDate(viewDate.getDate() + 7); setViewDate(newDate); };
      const prevWeek = () => { const newDate = new Date(viewDate); newDate.setDate(viewDate.getDate() - 7); setViewDate(newDate); };
      const goToToday = () => setViewDate(todayDate);
      const openDayDetails = (day) => { setSelectedDay(day); setIsDayModalOpen(true); };
      const openAdminModal = () => {
        resetAdminForm();
        setIsAdminModalOpen(true);
      };
      const scrollAdminMonthDays = (monthIndex, direction) => {
        const container = adminMonthScrollRefs.current[monthIndex];
        if (container) container.scrollBy({ left: direction * 360, behavior: 'smooth' });
      };

      useEffect(() => {
        if (!isAdminModalOpen || adminSelectedDate) return;
        const currentMonthIndex = todayDate.getMonth();

        const timer = setTimeout(() => {
          if (currentAdminMonthRef.current) {
            currentAdminMonthRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          }

          const currentMonthContainer = adminMonthScrollRefs.current[currentMonthIndex];
          const currentDayButton = currentMonthContainer?.querySelector('[data-admin-current-day="true"]');
          if (currentDayButton) {
            currentDayButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }, 350);

        return () => clearTimeout(timer);
      }, [isAdminModalOpen, adminSelectedDate]);

      useEffect(() => {
        if (todayRef.current && scrollContainerRef.current && !isAdminModalOpen && currentView === 'dashboard') {
          const container = scrollContainerRef.current;
          const element = todayRef.current;
          const scrollPosition = element.offsetLeft - (container.offsetWidth / 2) + (element.offsetWidth / 2);
          container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
      }, [viewDate, isAdminModalOpen, currentView]); 

      // --- LÓGICA DE DATAS E PROGRESSO ---
      const isSameDay = (d1, d2) => d1 && d2 && d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
      const parseLocalDate = (dateString) => dateString ? new Date(`${dateString}T12:00:00`) : null;
      const formatDateKey = (date) => {
        if (!date) return '';
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };
      const getDayTimestamp = (date) => date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() : null;
      const isDateWithinRange = (date, startDate, endDate) => {
        const target = getDayTimestamp(date);
        const start = getDayTimestamp(startDate);
        const end = getDayTimestamp(endDate || startDate);

        if (target === null || start === null || end === null) return false;

        return target >= Math.min(start, end) && target <= Math.max(start, end);
      };
      const getEventStartDate = (event) => parseLocalDate(event?.date);
      const getEventEndDate = (event) => parseLocalDate(event?.end_date || event?.date);
      const isEventOnDate = (event, date) => isDateWithinRange(date, getEventStartDate(event), getEventEndDate(event));
      const isEventInMonth = (event, monthDate) => {
        const startDate = getEventStartDate(event);
        const endDate = getEventEndDate(event);
        if (!startDate || !endDate || !monthDate) return false;

        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

        return getDayTimestamp(startDate) <= getDayTimestamp(monthEnd) && getDayTimestamp(endDate) >= getDayTimestamp(monthStart);
      };
      const eventHasDateRange = (event) => !!event?.end_date && event.end_date !== event.date;
      const formatFullDate = (date) => {
        if (!date) return '';
        const formatted = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
      };

      const buildMonthWeeks = (baseDate) => {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let weeks = [], currentWeek = [];
        for (let i = 0; i < new Date(year, month, 1).getDay(); i++) currentWeek.push(null);
        for (let i = 1; i <= daysInMonth; i++) {
          currentWeek.push(new Date(year, month, i));
          if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; }
        }
        if (currentWeek.length > 0) {
          while (currentWeek.length < 7) currentWeek.push(null);
          weeks.push(currentWeek);
        }
        return weeks;
      };

      const yearProgress = useMemo(() => {
        const year = todayDate.getFullYear();
        const msPerDay = 1000 * 60 * 60 * 24;
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);
        const todayOnly = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
        const businessHolidaySet = new Set(
          (BUSINESS_DAY_HOLIDAYS_BY_YEAR[year] || allHolidays.map(h => h.date))
            .filter(Boolean)
        );

        const formatDateKey = (date) => {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };

        const countBusinessDays = (startDate, endDate) => {
          let count = 0;
          const current = new Date(startDate);

          while (current <= endDate) {
            const isWeekday = current.getDay() !== 0 && current.getDay() !== 6;
            const isHoliday = businessHolidaySet.has(formatDateKey(current));

            if (isWeekday && !isHoliday) {
              count++;
            }

            current.setDate(current.getDate() + 1);
          }

          return count;
        };

        const totalDays = countBusinessDays(yearStart, yearEnd);
        const elapsedDays = countBusinessDays(yearStart, todayOnly);
        const elapsedCalendarDays = Math.floor((todayOnly - yearStart) / msPerDay) + 1;
        const elapsedWeeks = Math.ceil(elapsedCalendarDays / 7);

        return {
          elapsedDays,
          totalDays,
          daysPercentage: totalDays > 0 ? ((elapsedDays / totalDays) * 100).toFixed(1) : '0.0',
          elapsedWeeks,
          totalWeeks: 52,
          weeksPercentage: ((elapsedWeeks / 52) * 100).toFixed(1)
        };
      }, [todayDate, allHolidays]);

      const currentWeekNumber = useMemo(() => {
        const days = Math.floor((viewDate - new Date(viewDate.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000));
        return Math.ceil((viewDate.getDay() + 1 + days) / 7);
      }, [viewDate]);

      const monthWeeks = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let weeks = [], currentWeek = [];
        for (let i = 0; i < new Date(year, month, 1).getDay(); i++) currentWeek.push(null);
        for (let i = 1; i <= daysInMonth; i++) {
          currentWeek.push(new Date(year, month, i));
          if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; }
        }
        if (currentWeek.length > 0) {
          while (currentWeek.length < 7) currentWeek.push(null);
          weeks.push(currentWeek);
        }
        return weeks;
      }, [viewDate]);

      const currentWeekDays = useMemo(() => {
        const startDate = new Date(viewDate);
        startDate.setDate(viewDate.getDate() - viewDate.getDay()); 
        return Array.from({length: 7}, (_, i) => { const d = new Date(startDate); d.setDate(startDate.getDate() + i); return d; });
      }, [viewDate]);

      const allYearMonths = useMemo(() => {
        const year = todayDate.getFullYear();
        return Array.from({length: 12}, (_, m) => ({
          name: new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(year, m, 1)),
          days: Array.from({length: new Date(year, m + 1, 0).getDate()}, (_, d) => new Date(year, m, d + 1))
        }));
      }, [todayDate]);

      const futureMonths = useMemo(() => {
        return allYearMonths.filter(month => {
          const monthStart = new Date(month.days[0].getFullYear(), month.days[0].getMonth(), 1);
          const currentMonthStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
          return monthStart >= currentMonthStart;
        });
      }, [allYearMonths, todayDate]);

      const upcomingHolidaysList = useMemo(() => {
        return allHolidays.map(h => ({ ...h, exactDate: new Date(h.date + 'T12:00:00') }))
          .filter(h => h.exactDate >= todayDate || isSameDay(h.exactDate, todayDate))
          .sort((a, b) => a.exactDate - b.exactDate).slice(0, 2).map(h => h.id);
      }, [todayDate, allHolidays]);

      const filteredHolidays = useMemo(() => filter === 'todos' ? allHolidays : allHolidays.filter(h => h.type === filter), [filter, allHolidays]);

      // --- LÓGICA: RESUMO DA SEMANA (DIAS ÚTEIS E FERIADOS) ---
      const currentWeekSummary = useMemo(() => {
        const holidaysThisWeek = allHolidays.filter(h =>
          currentWeekDays.some(d => isSameDay(new Date(h.date + 'T12:00:00'), d))
        );
        const weekdays = currentWeekDays.filter(d => d.getDay() !== 0 && d.getDay() !== 6);
        const holidaysOnWeekdays = holidaysThisWeek.filter(h => {
          const d = new Date(h.date + 'T12:00:00');
          return d.getDay() !== 0 && d.getDay() !== 6;
        });
        const workingDays = weekdays.length - holidaysOnWeekdays.length;

        return {
          holidays: holidaysThisWeek,
          workingDays: workingDays,
          totalWeekdays: weekdays.length
        };
      }, [currentWeekDays, allHolidays]);

      const selectedAdminDayEvents = useMemo(() => {
        if (!adminSelectedDate) return [];

        return hrEvents
          .filter(event => isEventOnDate(event, adminSelectedDate))
          .sort((a, b) => {
            const timeA = a.start_time || '99:99';
            const timeB = b.start_time || '99:99';
            return timeA.localeCompare(timeB);
          });
      }, [adminSelectedDate, hrEvents]);

      // --- LÓGICA TÁTICA DA ETAPA 1 (local, segura e sem quebrar Supabase atual) ---
      const isAdminUser = !!(user && profile?.is_admin);
      const regularEvents = useMemo(() => hrEvents.filter(e => e.type !== 'Faturamento'), [hrEvents]);
      const noticeEvents = useMemo(() => hrEvents.filter(e => e.type === 'Informe'), [hrEvents]);

      const formatShortDate = (dateString) => {
        const parsed = parseLocalDate(dateString);
        return parsed ? parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Sem prazo';
      };

      const getProjectById = (projectId) => tacticalProjects.find(project => project.id === projectId);

      const getTaskById = (taskId, list = tacticalTasks) => list.find(task => task.id === taskId);

      const areDependenciesApproved = (task, list = tacticalTasks) => {
        const dependencies = task?.dependsOn || [];
        if (dependencies.length === 0) return true;
        return dependencies.every(depId => {
          const dependency = getTaskById(depId, list);
          return dependency?.status === 'APPROVED' || dependency?.status === 'DONE';
        });
      };

      const getTaskEffectiveStatus = (task, list = tacticalTasks) => {
        if (!task) return 'BLOCKED';
        if (!areDependenciesApproved(task, list)) return 'BLOCKED';
        if (task.status === 'BLOCKED') return 'AVAILABLE';
        return task.status || 'AVAILABLE';
      };

      const isTaskLate = (task) => {
        const status = getTaskEffectiveStatus(task);
        if (['APPROVED', 'DONE', 'CANCELLED'].includes(status)) return false;
        const dueDate = parseLocalDate(task.dueDate);
        if (!dueDate) return false;
        const todayOnly = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
        return dueDate < todayOnly;
      };

      const getProjectTasks = (projectId) => tacticalTasks.filter(task => task.projectId === projectId);

      const getProjectProgress = (projectId) => {
        const projectTasks = getProjectTasks(projectId);
        if (projectTasks.length === 0) return 0;
        const approvedTasks = projectTasks.filter(task => ['APPROVED', 'DONE'].includes(task.status)).length;
        return Math.round((approvedTasks / projectTasks.length) * 100);
      };

      const releaseDependentTasks = (approvedTaskId, currentList) => {
        return currentList.map(task => {
          const dependsOnApprovedTask = (task.dependsOn || []).includes(approvedTaskId);
          if (!dependsOnApprovedTask) return task;

          const nextTask = { ...task };
          const allDependenciesApproved = (nextTask.dependsOn || []).every(depId => {
            const dependency = currentList.find(item => item.id === depId);
            return dependency?.status === 'APPROVED' || dependency?.status === 'DONE' || depId === approvedTaskId;
          });

          if (allDependenciesApproved && nextTask.status === 'BLOCKED') {
            nextTask.status = 'AVAILABLE';
            nextTask.unlockedAt = new Date().toISOString();
          }

          return nextTask;
        });
      };

      const handleTaskSubmitForApproval = (task) => {
        if (!user) {
          showFeedbackDialog('info', 'Login necessário', 'Entre com sua conta para informar execução de atividades.');
          setCurrentView('login');
          return;
        }

        const effectiveStatus = getTaskEffectiveStatus(task);
        if (effectiveStatus === 'BLOCKED') {
          showFeedbackDialog('error', 'Atividade bloqueada', 'Esta atividade depende de uma etapa anterior aprovada pelo admin.');
          return;
        }

        if (['SUBMITTED', 'APPROVED', 'DONE'].includes(effectiveStatus)) {
          showFeedbackDialog('info', 'Sem ação necessária', 'Esta atividade já foi enviada ou aprovada.');
          return;
        }

        setTacticalTasks(prev => prev.map(item => item.id === task.id ? {
          ...item,
          status: 'SUBMITTED',
          submittedAt: new Date().toISOString(),
          submittedBy: profile?.full_name || user?.email || 'Usuário',
          evidence: item.evidence || 'Execução informada pelo usuário para validação administrativa.'
        } : item));

        showFeedbackDialog('success', 'Atividade enviada', 'A execução foi enviada para análise do admin. A próxima etapa só será liberada após aprovação.');
      };

      const handleAdminApproveTask = (task) => {
        if (!isAdminUser) {
          showFeedbackDialog('error', 'Acesso restrito', 'Somente administradores podem aprovar atividades.');
          return;
        }

        showConfirmDialog({
          title: 'Aprovar atividade?',
          message: `A atividade "${task.title}" será validada oficialmente e poderá liberar a próxima etapa em cascata.`,
          confirmText: 'Aprovar e liberar cascata',
          cancelText: 'Cancelar',
          onConfirm: async () => {
            setTacticalTasks(prev => {
              const approvedList = prev.map(item => item.id === task.id ? {
                ...item,
                status: 'APPROVED',
                approvedAt: new Date().toISOString(),
                approvedBy: profile?.full_name || user?.email || 'Admin'
              } : item);

              return releaseDependentTasks(task.id, approvedList);
            });

            showFeedbackDialog('success', 'Atividade aprovada', 'A tarefa foi validada pelo admin e as dependências foram recalculadas.');
          }
        });
      };

      const handleAdminRejectTask = (task) => {
        if (!isAdminUser) {
          showFeedbackDialog('error', 'Acesso restrito', 'Somente administradores podem reprovar atividades.');
          return;
        }

        showConfirmDialog({
          title: 'Reprovar atividade?',
          message: `A atividade "${task.title}" voltará para ajuste do setor responsável.`,
          confirmText: 'Reprovar',
          cancelText: 'Cancelar',
          onConfirm: async () => {
            setTacticalTasks(prev => prev.map(item => item.id === task.id ? {
              ...item,
              status: 'REJECTED',
              rejectedAt: new Date().toISOString(),
              rejectedBy: profile?.full_name || user?.email || 'Admin',
              rejectionReason: 'Necessita ajuste ou evidência adicional antes da aprovação final.'
            } : item));

            showFeedbackDialog('info', 'Atividade reprovada', 'A atividade voltou para ajuste e não liberou a próxima etapa.');
          }
        });
      };

      const resetTacticalDemo = () => {
        showConfirmDialog({
          title: 'Restaurar fluxo tático demonstrativo?',
          message: 'As atividades locais da Etapa 1 voltarão ao estado inicial. Os registros do calendário no Supabase não serão alterados.',
          confirmText: 'Restaurar',
          cancelText: 'Cancelar',
          onConfirm: async () => {
            setTacticalProjects(DEMO_TACTICAL_PROJECTS);
            setTacticalTasks(DEMO_TACTICAL_TASKS);
            showFeedbackDialog('success', 'Fluxo restaurado', 'O ambiente tático local foi restaurado para novos testes.');
          }
        });
      };

      const tacticalStats = useMemo(() => {
        const pendingApproval = tacticalTasks.filter(task => getTaskEffectiveStatus(task) === 'SUBMITTED').length;
        const blocked = tacticalTasks.filter(task => getTaskEffectiveStatus(task) === 'BLOCKED').length;
        const available = tacticalTasks.filter(task => ['AVAILABLE', 'IN_PROGRESS', 'REJECTED'].includes(getTaskEffectiveStatus(task))).length;
        const approved = tacticalTasks.filter(task => ['APPROVED', 'DONE'].includes(task.status)).length;
        const late = tacticalTasks.filter(task => isTaskLate(task)).length;

        return {
          pendingApproval,
          blocked,
          available,
          approved,
          late,
          totalTasks: tacticalTasks.length,
          totalProjects: tacticalProjects.length
        };
      }, [tacticalTasks, tacticalProjects, todayDate]);

      const visibleNavigationItems = APP_VIEWS.filter(item => !item.adminOnly || isAdminUser);

      // --- COMPONENTES UI ---
      const EventCard = ({ event }) => {
        let borderClass = "border-brand-200";
        let ribbonClass = "bg-brand-500";
        if(event.classification === 'Urgente') { borderClass = "border-red-300"; ribbonClass = "bg-red-500"; }
        if(event.type === 'Alteração de Folga' || event.type === 'Troca de Feriado') { borderClass = "border-amber-300"; ribbonClass = "bg-amber-500"; }
        if(event.type === 'Faturamento') { borderClass = "border-amber-200"; ribbonClass = "bg-amber-400"; }

        const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : '';
        const getAttachmentUrl = () => {
          if (event.has_attachment && event.attachment_path) {
            const { data } = supabase.storage.from('arquivos avisos').getPublicUrl(event.attachment_path);
            return data.publicUrl;
          }
          return null;
        };

        const fileUrl = getAttachmentUrl();
        const eventStartDate = getEventStartDate(event);
        const eventEndDate = getEventEndDate(event);
        const eventDateLabel = eventStartDate
          ? eventHasDateRange(event)
            ? `${eventStartDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} até ${eventEndDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`
            : eventStartDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
          : '';

        return (
          <div className={`bg-white p-4 md:p-6 rounded-xl border ${borderClass} hover:shadow-md transition-all relative overflow-hidden group`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2 ${ribbonClass}`}></div>
            
            <div className="flex justify-between items-start mb-3 pl-2">
              <div>
                <h4 className="font-bold text-brand-900 pr-4 text-base md:text-lg mb-1">{event.title}</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 uppercase tracking-wider">{event.type}</span>
                  {event.type === 'Informe' && event.classification && (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${event.classification === 'Urgente' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-brand-50 text-brand-700 border-brand-200'}`}>
                      {event.classification}
                    </span>
                  )}
                  {event.department && (
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-50 text-brand-700 rounded border border-brand-100 uppercase tracking-wider">
                      {event.department}
                    </span>
                  )}
                </div>
              </div>
              
              {fileUrl && (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-50 hover:bg-brand-50 text-slate-500 hover:text-brand-600 rounded-md border border-slate-200 transition-colors flex-shrink-0" title="Ver Anexo">
                  <Paperclip size={18} />
                </a>
              )}
            </div>
            
            <div className="flex flex-col gap-2.5 text-sm text-slate-600 font-medium pl-2 mt-4">
              {(event.type === 'Evento' || (event.type === 'Informe' && event.has_period) || eventHasDateRange(event)) && (
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 text-xs">
                    <CalendarIcon size={14} className="text-slate-400"/> 
                    {eventDateLabel}
                  </span>
                  {event.start_time && (
                    <span className="flex items-center gap-1.5 bg-brand-50 px-2 py-1 rounded-md border border-brand-100 text-xs text-brand-700 font-bold">
                      <Clock size={14} className="text-brand-400"/> 
                      {formatTime(event.start_time)} {event.end_time ? `- ${formatTime(event.end_time)}` : ''}
                    </span>
                  )}
                </div>
              )}

              {(event.type === 'Alteração de Folga' || event.type === 'Troca de Feriado') && (
                <div className="flex flex-wrap items-center gap-2 bg-amber-50 px-3 py-2 rounded-md border border-amber-100 text-xs w-fit">
                  <span className="text-amber-700 font-bold">De:</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-200">{event.original_date ? event.original_date.split('-').reverse().join('/') : '---'}</span>
                  <ArrowRight size={14} className="text-amber-500 mx-1" />
                  <span className="text-amber-700 font-bold">Para:</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-200 font-bold">{event.new_date ? event.new_date.split('-').reverse().join('/') : '---'}</span>
                </div>
              )}

              {event.type === 'Faturamento' && event.billing_value && (
                <span className="flex items-center gap-2 text-xs font-bold text-amber-700">
                  <DollarSign size={14} className="text-amber-500" /> Valor: {event.billing_value}
                </span>
              )}

              {event.type === 'Evento' && event.location && (
                <span className="flex items-center gap-2 text-xs">
                  <MapPin size={14} className="text-slate-400" /> <span className="text-slate-700">{event.location}</span>
                </span>
              )}
              {event.type === 'Evento' && event.target_roles && (
                <span className="flex items-center gap-2 text-xs">
                  <Users size={14} className="text-slate-400" /> <span className="text-slate-700">Público: {event.target_roles}</span>
                </span>
              )}

              {event.description && (
                <div className="mt-2 text-xs text-slate-500 bg-slate-50/50 p-3 rounded-lg border border-slate-100 italic">
                  {event.description}
                </div>
              )}
            </div>
          </div>
        );
      };

      const FilterButton = ({ id, label, icon: Icon, activeColor }) => {
        const isActive = filter === id;
        return (
          <button onClick={() => setFilter(id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border whitespace-nowrap ${isActive ? `${activeColor} bg-white shadow-sm border-transparent ring-2 ring-slate-200` : 'text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'}`}>
            <Icon size={16} className={isActive ? '' : 'opacity-70'} /> {label}
          </button>
        );
      };

      const ActionCard = ({ title, description, icon: Icon, colorClass, onClick }) => (
        <button onClick={onClick} className="group w-full text-left bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4 min-h-[92px]">
          <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center flex-shrink-0 shadow-sm ${colorClass}`}><Icon size={24} /></div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-bold text-brand-900 leading-tight mb-1">{title}</h3>
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-snug">{description}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors border border-slate-100 flex-shrink-0"><ArrowRight size={18} /></div>
        </button>
      );

      const DonutChart = ({ percentage, color, label, subLabel }) => {
        const radius = 35; const circumference = 2 * Math.PI * radius; const strokeDashoffset = circumference - (percentage / 100) * circumference;
        return (
          <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 w-full">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90"><circle cx="40" cy="40" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="8" /><circle cx="40" cy="40" r={radius} fill="transparent" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" /></svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-bold text-brand-900">{Math.round(percentage)}%</span></div>
            </div>
            <div><p className="text-sm font-bold text-brand-900 mb-1">{label}</p><p className="text-xs font-medium text-slate-500">{subLabel}</p></div>
          </div>
        );
      };

      const PageHeader = ({ title, description, icon: Icon, actions }) => (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm mb-6 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-brand-50"></div>
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon size={22} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-brand-900 tracking-tight">{title}</h2>
                <p className="text-sm text-slate-500 font-medium mt-1 max-w-3xl">{description}</p>
              </div>
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
        </div>
      );

      const StatCard = ({ title, value, description, icon: Icon, tone = 'brand' }) => {
        const toneClasses = {
          brand: 'bg-brand-50 text-brand-700 border-brand-100',
          emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          amber: 'bg-amber-50 text-amber-700 border-amber-100',
          red: 'bg-red-50 text-red-700 border-red-100',
          slate: 'bg-slate-50 text-slate-600 border-slate-200',
          cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100'
        };

        return (
          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                <p className="text-2xl md:text-3xl font-black text-brand-900">{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${toneClasses[tone] || toneClasses.brand}`}>
                <Icon size={20} />
              </div>
            </div>
            {description && <p className="text-xs font-medium text-slate-500 mt-3 leading-relaxed">{description}</p>}
          </div>
        );
      };

      const StatusBadge = ({ status }) => {
        const meta = TASK_STATUS_META[status] || TASK_STATUS_META.BLOCKED;
        const Icon = meta.icon || Clock;

        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${meta.badge}`}>
            <Icon size={12} /> {meta.label}
          </span>
        );
      };

      const ProjectProgressBar = ({ projectId }) => {
        const progress = getProjectProgress(projectId);

        return (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Progresso validado</span>
              <span className="text-xs font-black text-brand-700">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        );
      };

      const NavigationButton = ({ item, compact = false }) => {
        const Icon = item.icon;
        const active = currentView === item.id;

        return (
          <button
            type="button"
            onClick={() => setCurrentView(item.id)}
            className={`${compact ? 'flex-1 min-w-0 px-2 py-2' : 'px-3 py-2'} rounded-xl border text-left transition-all flex items-center gap-2 ${active ? 'bg-brand-600 text-white border-brand-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-100'}`}
            title={item.label}
          >
            <Icon size={compact ? 18 : 16} className="flex-shrink-0" />
            <span className={`${compact ? 'text-[10px]' : 'text-xs'} font-black uppercase tracking-wider truncate`}>
              {compact ? item.shortLabel : item.label}
            </span>
          </button>
        );
      };

      const EmptyState = ({ icon: Icon, title, description, action }) => (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Icon size={28} />
          </div>
          <h3 className="font-black text-brand-900 text-lg">{title}</h3>
          <p className="text-sm text-slate-500 font-medium mt-2 max-w-lg mx-auto">{description}</p>
          {action && <div className="mt-5">{action}</div>}
        </div>
      );

      const AccessRequiredCard = ({ adminOnly = false }) => (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center flex-shrink-0">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="font-black text-brand-900">{adminOnly ? 'Área exclusiva do administrador' : 'Login necessário'}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {adminOnly ? 'Esta página exige um perfil com permissão administrativa.' : 'Entre na sua conta para executar ações, enviar atividades e acompanhar validações.'}
                </p>
              </div>
            </div>
            <button type="button" onClick={() => setCurrentView('login')} className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-black hover:bg-brand-700 transition-colors shadow-sm">
              Acessar conta
            </button>
          </div>
        </div>
      );

      const TaskCard = ({ task, adminMode = false }) => {
        const project = getProjectById(task.projectId);
        const status = getTaskEffectiveStatus(task);
        const dependencies = (task.dependsOn || []).map(depId => getTaskById(depId)).filter(Boolean);
        const late = isTaskLate(task);

        return (
          <div className={`bg-white rounded-2xl border p-4 md:p-5 shadow-sm transition-all hover:shadow-md ${late ? 'border-red-200 ring-1 ring-red-50' : 'border-slate-200'}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <StatusBadge status={status} />
                  {late && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border-red-100"><AlertTriangle size={12} /> Atrasada</span>}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 border-slate-200">{task.priority}</span>
                </div>

                <h3 className="text-base md:text-lg font-black text-brand-900 leading-tight">{task.title}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">{task.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Projeto</p>
                    <p className="text-xs font-bold text-slate-700 truncate">{project?.name || 'Sem projeto'}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Setor</p>
                    <p className="text-xs font-bold text-slate-700 truncate">{task.assignedSector}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Etapa</p>
                    <p className="text-xs font-bold text-slate-700 truncate">{task.stage}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Prazo</p>
                    <p className={`text-xs font-bold truncate ${late ? 'text-red-700' : 'text-slate-700'}`}>{formatShortDate(task.dueDate)}</p>
                  </div>
                </div>

                {dependencies.length > 0 && (
                  <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Dependências de cascata</p>
                    <div className="flex flex-col gap-2">
                      {dependencies.map(dep => (
                        <div key={dep.id} className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-slate-600 truncate">{dep.title}</span>
                          <StatusBadge status={getTaskEffectiveStatus(dep)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {task.rejectionReason && status === 'REJECTED' && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-[10px] font-black text-red-700 uppercase tracking-wider mb-1">Motivo da reprovação</p>
                    <p className="text-xs font-medium text-red-700">{task.rejectionReason}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 md:w-56 flex-shrink-0">
                {!adminMode && (
                  <button
                    type="button"
                    disabled={['BLOCKED', 'SUBMITTED', 'APPROVED', 'DONE'].includes(status)}
                    onClick={() => handleTaskSubmitForApproval(task)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm font-black transition-colors flex items-center justify-center gap-2 ${['BLOCKED', 'SUBMITTED', 'APPROVED', 'DONE'].includes(status) ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'}`}
                  >
                    {status === 'BLOCKED' ? <Lock size={16} /> : <CheckCircle size={16} />}
                    {status === 'BLOCKED' ? 'Aguardando cascata' : status === 'SUBMITTED' ? 'Em análise' : status === 'APPROVED' || status === 'DONE' ? 'Validada' : 'Enviar execução'}
                  </button>
                )}

                {adminMode && (
                  <>
                    <button
                      type="button"
                      disabled={status !== 'SUBMITTED'}
                      onClick={() => handleAdminApproveTask(task)}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm font-black transition-colors flex items-center justify-center gap-2 ${status === 'SUBMITTED' ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                    >
                      <ShieldCheck size={16} /> Aprovar
                    </button>
                    <button
                      type="button"
                      disabled={status !== 'SUBMITTED'}
                      onClick={() => handleAdminRejectTask(task)}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm font-black transition-colors flex items-center justify-center gap-2 ${status === 'SUBMITTED' ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                    >
                      <X size={16} /> Reprovar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      };

      const InformesPage = () => (
        <div className="w-full max-w-screen-2xl mx-auto page-enter">
          <PageHeader
            title="Informes Corporativos"
            description="Histórico organizado dos informes já lançados no calendário atual. A home continua mostrando os avisos principais, e esta página concentra a consulta completa."
            icon={FileText}
            actions={<button type="button" onClick={() => setCurrentView('dashboard')} className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-sm font-black hover:bg-slate-100 transition-colors">Voltar à semana</button>}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Informes" value={noticeEvents.length} description="Registros classificados como informe." icon={FileText} tone="brand" />
            <StatCard title="Urgentes" value={noticeEvents.filter(event => event.classification === 'Urgente').length} description="Comunicados com maior prioridade." icon={AlertTriangle} tone="red" />
            <StatCard title="Com anexos" value={noticeEvents.filter(event => event.has_attachment).length} description="Informes com documentos vinculados." icon={Paperclip} tone="amber" />
          </div>

          <section className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h3 className="text-lg font-black text-brand-900">Todos os informes</h3>
              <span className="bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-brand-100">{noticeEvents.length} item{noticeEvents.length === 1 ? '' : 's'}</span>
            </div>

            <div className="flex flex-col gap-4">
              {noticeEvents.map(event => <EventCard key={event.id} event={event} />)}
              {noticeEvents.length === 0 && (
                <EmptyState icon={FileText} title="Nenhum informe cadastrado" description="Quando o admin lançar informes no painel atual, eles aparecerão automaticamente nesta página." />
              )}
            </div>
          </section>
        </div>
      );

      const ActivitiesPage = () => {
        const sortedTasks = [...tacticalTasks].sort((a, b) => {
          const order = { SUBMITTED: 1, REJECTED: 2, AVAILABLE: 3, IN_PROGRESS: 4, BLOCKED: 5, APPROVED: 6, DONE: 7 };
          return (order[getTaskEffectiveStatus(a)] || 99) - (order[getTaskEffectiveStatus(b)] || 99);
        });

        return (
          <div className="w-full max-w-screen-2xl mx-auto page-enter">
            <PageHeader
              title="Minhas Atividades"
              description="Área diária para acompanhar tarefas liberadas, bloqueadas por cascata, atrasadas ou aguardando validação do admin."
              icon={CheckCircle}
              actions={<button type="button" onClick={resetTacticalDemo} className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-sm font-black hover:bg-slate-100 transition-colors">Restaurar teste</button>}
            />

            {!user && <div className="mb-6"><AccessRequiredCard /></div>}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard title="Liberadas" value={tacticalStats.available} description="Podem ser executadas agora." icon={Unlock} tone="brand" />
              <StatCard title="Bloqueadas" value={tacticalStats.blocked} description="Dependem de aprovação anterior." icon={Lock} tone="slate" />
              <StatCard title="Em aprovação" value={tacticalStats.pendingApproval} description="Aguardando filtro do admin." icon={ShieldCheck} tone="amber" />
              <StatCard title="Atrasadas" value={tacticalStats.late} description="Exigem atenção tática." icon={AlertTriangle} tone="red" />
            </div>

            <div className="flex flex-col gap-4">
              {sortedTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>
        );
      };

      const ProjectsPage = () => (
        <div className="w-full max-w-screen-2xl mx-auto page-enter">
          <PageHeader
            title="Projetos e Cascatas"
            description="Visão dos projetos, etapas entre setores e atividades que só avançam quando o admin valida a etapa anterior."
            icon={Briefcase}
            actions={<button type="button" onClick={() => setCurrentView('atividades')} className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-black hover:bg-brand-700 transition-colors shadow-sm">Ver atividades</button>}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Projetos" value={tacticalStats.totalProjects} description="Projetos táticos ativos na Etapa 1." icon={Briefcase} tone="brand" />
            <StatCard title="Atividades" value={tacticalStats.totalTasks} description="Tarefas ligadas aos projetos." icon={CheckCircle} tone="cyan" />
            <StatCard title="Validadas" value={tacticalStats.approved} description="Conclusões confirmadas pelo admin." icon={ShieldCheck} tone="emerald" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {tacticalProjects.map(project => {
              const projectTasks = getProjectTasks(project.id);
              return (
                <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 md:p-6 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-100">{project.status}</span>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">Prioridade {project.priority}</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-brand-900">{project.name}</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">{project.clientName}</p>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
                        <Layers size={22} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mt-4 leading-relaxed">{project.description}</p>
                    <div className="mt-4">
                      <ProjectProgressBar projectId={project.id} />
                    </div>
                  </div>

                  <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-black text-brand-900 uppercase tracking-wider">Fluxo em cascata</h4>
                      <span className="text-xs font-bold text-slate-400">{projectTasks.length} etapa{projectTasks.length === 1 ? '' : 's'}</span>
                    </div>

                    <div className="space-y-3">
                      {projectTasks.map((task, index) => {
                        const status = getTaskEffectiveStatus(task);
                        const meta = TASK_STATUS_META[status] || TASK_STATUS_META.BLOCKED;
                        return (
                          <div key={task.id} className="relative">
                            {index < projectTasks.length - 1 && <div className="absolute left-4 top-9 bottom-[-16px] w-px bg-slate-200"></div>}
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full ${meta.dot} text-white flex items-center justify-center flex-shrink-0 relative z-10 border-4 border-white shadow-sm`}>
                                <span className="text-[10px] font-black">{index + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0 bg-slate-50 border border-slate-100 rounded-xl p-3">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                  <p className="text-sm font-black text-brand-900 truncate">{task.title}</p>
                                  <StatusBadge status={status} />
                                </div>
                                <p className="text-xs font-medium text-slate-500">{task.assignedSector} · prazo {formatShortDate(task.dueDate)}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

      const ApprovalsPage = () => {
        const pendingTasks = tacticalTasks.filter(task => getTaskEffectiveStatus(task) === 'SUBMITTED');

        return (
          <div className="w-full max-w-screen-2xl mx-auto page-enter">
            <PageHeader
              title="Aprovações do Admin"
              description="Fila onde o administrador valida ou reprova tarefas informadas pelos setores. Só a aprovação administrativa libera a próxima etapa."
              icon={ShieldCheck}
              actions={<button type="button" onClick={() => setCurrentView('admin-tatico')} className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-sm font-black hover:bg-slate-100 transition-colors">Admin tático</button>}
            />

            {!isAdminUser && <div className="mb-6"><AccessRequiredCard adminOnly /></div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard title="Pendentes" value={pendingTasks.length} description="Aguardando decisão do admin." icon={AlertTriangle} tone="amber" />
              <StatCard title="Aprovadas" value={tacticalStats.approved} description="Já liberaram cascata." icon={ShieldCheck} tone="emerald" />
              <StatCard title="Bloqueadas" value={tacticalStats.blocked} description="Ainda aguardam predecessoras." icon={Lock} tone="slate" />
            </div>

            <div className="flex flex-col gap-4">
              {pendingTasks.map(task => <TaskCard key={task.id} task={task} adminMode />)}
              {pendingTasks.length === 0 && (
                <EmptyState icon={ShieldCheck} title="Nenhuma aprovação pendente" description="Quando um usuário enviar uma atividade para validação, ela aparecerá nesta fila administrativa." />
              )}
            </div>
          </div>
        );
      };

      const AdminTacticalPage = () => (
        <div className="w-full max-w-screen-2xl mx-auto page-enter">
          <PageHeader
            title="Central Admin Tática"
            description="Painel de governança para administrar calendário, acompanhar aprovações e preparar a próxima fase com tabelas reais no Supabase."
            icon={Lock}
            actions={
              <>
                <button type="button" onClick={openAdminModal} className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-black hover:bg-brand-700 transition-colors shadow-sm">Gestão do calendário</button>
                <button type="button" onClick={resetTacticalDemo} className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-sm font-black hover:bg-slate-100 transition-colors">Restaurar fluxo</button>
              </>
            }
          />

          {!isAdminUser && <div className="mb-6"><AccessRequiredCard adminOnly /></div>}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Lançamentos" value={regularEvents.length} description="Eventos/informes do calendário." icon={FileText} tone="brand" />
            <StatCard title="Pendências" value={tacticalStats.pendingApproval} description="Atividades para aprovar." icon={ShieldCheck} tone="amber" />
            <StatCard title="Projetos" value={tacticalStats.totalProjects} description="Fluxos táticos preparados." icon={Briefcase} tone="cyan" />
            <StatCard title="Risco" value={tacticalStats.late} description="Atividades atrasadas." icon={AlertTriangle} tone="red" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
              <h3 className="text-lg font-black text-brand-900 mb-4 flex items-center gap-2"><BarChart3 size={20} className="text-brand-600" /> Estado da implantação</h3>
              <div className="space-y-3">
                {[
                  ['Etapa 1', 'Fundação visual e navegação tática', 'Concluída nesta versão'],
                  ['Etapa 2', 'Tabelas Supabase para projetos, tarefas e aprovações', 'Próxima entrega'],
                  ['Etapa 3', 'CRUD real de atividades e projetos pelo admin', 'Após validar a navegação'],
                  ['Etapa 4', 'Cascata real persistida no banco e histórico de aprovações', 'Após aprovar o schema']
                ].map(([phase, title, status]) => (
                  <div key={phase} className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-brand-700 flex items-center justify-center flex-shrink-0 font-black text-xs">{phase.replace('Etapa ', 'E')}</div>
                    <div>
                      <p className="font-black text-brand-900">{title}</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">{status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
              <h3 className="text-lg font-black text-brand-900 mb-4">Ações rápidas</h3>
              <div className="space-y-3">
                <ActionCard title="Calendário atual" description="Criar eventos e informes como já funciona hoje" icon={CalendarIcon} colorClass="bg-gradient-to-br from-brand-500 to-brand-700" onClick={openAdminModal} />
                <ActionCard title="Fila de aprovações" description="Validar atividades enviadas pelos setores" icon={ShieldCheck} colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600" onClick={() => setCurrentView('aprovacoes')} />
                <ActionCard title="Projetos" description="Visualizar cascatas e etapas por setor" icon={Briefcase} colorClass="bg-gradient-to-br from-cyan-500 to-brand-600" onClick={() => setCurrentView('projetos')} />
              </div>
            </div>
          </div>
        </div>
      );

      const renderMainView = () => {
        if (currentView === 'informes') return <InformesPage />;
        if (currentView === 'atividades') return <ActivitiesPage />;
        if (currentView === 'projetos') return <ProjectsPage />;
        if (currentView === 'aprovacoes') return <ApprovalsPage />;
        if (currentView === 'admin-tatico') return <AdminTacticalPage />;
        return null;
      };

      const renderInteractionDialogs = () => (
        <>
          <InteractionModal
            dialog={feedbackDialog}
            onClose={closeFeedbackDialog}
          />
          <InteractionModal
            dialog={confirmDialog}
            onClose={closeConfirmDialog}
            onConfirm={handleConfirmDialogAction}
            isLoading={isSubmitting}
          />
        </>
      );

      // ==========================================
      // VIEW 1: TELA DE LOGIN (PÁGINA COMPLETA)
      // ==========================================
      if (currentView === 'login') {
        return (
          <>
            <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-brand-100 page-enter">
            
            {/* Lado Esquerdo - Branding / Logo da Marca */}
            <div className="w-full md:w-5/12 lg:w-1/2 bg-brand-900 flex flex-col relative overflow-hidden shrink-0 min-h-[30vh] md:min-h-screen">
              {/* Elementos decorativos de fundo para dar tom premium */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 opacity-90"></div>
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-400 opacity-10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 md:p-12 text-center">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="fixed md:absolute top-3 left-3 md:top-8 md:left-8 z-[120] md:z-20 w-10 h-10 md:w-auto md:h-auto text-white/85 hover:text-white flex items-center justify-center md:justify-start gap-2 text-sm font-semibold transition-colors bg-white/10 md:px-4 md:py-2 rounded-full md:rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 shadow-lg md:shadow-none"
                  title="Voltar ao Calendário"
                >
                  <ChevronLeft size={20} className="md:w-4 md:h-4" />
                  <span className="hidden md:inline">Voltar ao Calendário</span>
                </button>
                
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-500">
                  <img src={LOGO_URL} alt="Logo Empresa" className="h-20 md:h-28 object-contain" />
                </div>
                
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">Portal Corporativo</h1>
                <p className="text-brand-100 text-sm md:text-base max-w-md opacity-90">
                  Área restrita para gestão do calendário corporativo, eventos estratégicos e informativos da sua organização.
                </p>
              </div>
            </div>

            {/* Lado Direito - Formulário de Login */}
            <div className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] rounded-t-3xl md:rounded-none -mt-6 md:mt-0">
              <div className="w-full max-w-md">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-900 tracking-tight">
                    {isSignUp ? 'Criar nova conta' : 'Acesso Restrito'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 font-medium">
                    {isSignUp ? 'Preencha os dados abaixo para se cadastrar.' : 'Insira suas credenciais corporativas para entrar.'}
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">E-mail Corporativo</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      </div>
                      <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block pl-10 p-4 outline-none transition-all font-medium shadow-sm placeholder:text-slate-400" placeholder="seu.nome@empresa.com"/>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Senha</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                         <Lock size={18} />
                      </div>
                      <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block pl-10 p-4 outline-none transition-all font-medium shadow-sm placeholder:text-slate-400" placeholder="••••••••"/>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={authLoading} className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-600/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0">
                      {authLoading ? (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processando...</>
                      ) : (
                        isSignUp ? 'Registrar Conta' : 'Acessar Plataforma'
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500 font-medium">
                    {isSignUp ? 'Já possui uma conta?' : 'Primeiro acesso ou precisa gerir?'}
                    <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="ml-1.5 text-brand-600 hover:text-brand-800 font-bold transition-colors outline-none focus:underline">
                      {isSignUp ? 'Fazer Login' : 'Criar Conta'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {renderInteractionDialogs()}
        </>
        );
      }

      // ==========================================
      // VIEW 2: TELA DO PAINEL / CALENDÁRIO
      // ==========================================
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 font-sans selection:bg-brand-100 w-full page-enter">
          
          <header className="bg-white/95 backdrop-blur border-b border-slate-200 px-4 md:px-8 py-3 sticky top-0 z-40 shadow-sm w-full">
            <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between gap-4">

              <div className="flex items-center gap-3 md:gap-5 min-w-0">
                <button type="button" onClick={() => setCurrentView('dashboard')} className="flex items-center gap-3 md:gap-5 min-w-0 text-left group">
                  <img src={LOGO_URL} alt="Logo Empresa" className="h-10 md:h-14 object-contain flex-shrink-0 transition-transform group-hover:scale-[1.02]" />
                  <div className="hidden sm:block pl-3 md:pl-5 border-l border-slate-200 min-w-0">
                    <h1 className="text-sm md:text-base font-bold tracking-tight text-brand-900 leading-tight">Agenda Tática<br/>Corporativa</h1>
                    <p className="hidden lg:block text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">Semana · Atividades · Projetos</p>
                  </div>
                </button>
              </div>

              <div className="hidden md:flex flex-col text-right leading-tight">
                <span className="text-xs font-black text-brand-900 truncate max-w-[18rem]">{user ? (profile?.full_name || user.email) : 'Acesso público'}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {(APP_VIEWS.find(item => item.id === currentView)?.shortLabel || 'Portal')} · {isAdminUser ? 'Administrador' : user ? 'Usuário' : 'Visitante'}
                </span>
              </div>

              <div className="md:hidden flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100 text-[10px] font-black uppercase tracking-wider">
                  {currentView === 'dashboard' ? 'Início' : (APP_VIEWS.find(item => item.id === currentView)?.shortLabel || 'Portal')}
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden p-4 md:p-8 pb-28 md:pb-safe flex flex-col gap-8 w-full">
            {currentView === 'dashboard' ? (
            <div className="w-full max-w-screen-2xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
                
                <div className="lg:col-span-2 space-y-6 md:space-y-8 w-full">
                  <section className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 onClick={() => setIsMonthModalOpen(true)} className="text-lg md:text-xl font-bold text-brand-900 flex items-center gap-2 capitalize cursor-pointer hover:text-brand-600 transition-colors group">
                          <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg group-hover:bg-brand-100 transition-colors"><CalendarIcon size={20} /></div>
                          {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(viewDate)}
                        </h3>
                        <span className="bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold border border-brand-100 uppercase tracking-wider">S-{currentWeekNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={goToToday} className="p-1.5 md:px-3 md:py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 hover:text-brand-600 text-slate-500 transition-colors border border-slate-200 shadow-sm flex items-center gap-2" title="Ir para hoje">
                          <Clock size={20} className="text-brand-500" />
                          <span className="hidden md:inline text-sm font-bold">Hoje</span>
                        </button>
                        <div className="hidden md:flex gap-2">
                          <button onClick={prevWeek} className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 hover:text-brand-600 text-slate-500 transition-colors border border-slate-200 shadow-sm"><ChevronLeft size={20} /></button>
                          <button onClick={nextWeek} className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 hover:text-brand-600 text-slate-500 transition-colors border border-slate-200 shadow-sm"><ChevronRight size={20} /></button>
                        </div>
                      </div>
                    </div>
                    <div ref={scrollContainerRef} className="flex overflow-x-auto hide-scrollbar gap-2 md:gap-4 pt-2 pb-3 md:grid md:grid-cols-7 snap-x snap-mandatory">
                      {currentWeekDays.map((day, index) => {
                        const isActualToday = isSameDay(day, todayDate); 
                        const hasHrEvent = hrEvents.some(e => isEventOnDate(e, day) && e.type !== 'Faturamento');
                        const hasHoliday = allHolidays.some(h => isSameDay(new Date(h.date + 'T12:00:00'), day));
                        return (
                          <div key={index} ref={isActualToday ? todayRef : null} onClick={() => openDayDetails(day)}
                            className={`cursor-pointer snap-center flex-shrink-0 w-20 md:w-auto flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all duration-300 relative ${isActualToday ? 'bg-gradient-to-b from-brand-500 to-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/30 transform scale-[1.05] z-10' : 'bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 hover:-translate-y-0.5'}`}
                          >
                            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1.5 ${isActualToday ? 'text-brand-100' : 'text-slate-400'}`}>{new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(day).replace('.', '')}</span>
                            <span className={`text-2xl md:text-3xl font-black ${isActualToday ? 'text-white' : 'text-brand-900'}`}>{day.getDate()}</span>
                            <div className="absolute bottom-1.5 flex gap-1">
                               {hasHrEvent && <span className={`w-1.5 h-1.5 rounded-full ${isActualToday ? 'bg-white' : 'bg-brand-500'}`}></span>}
                               {hasHoliday && <span className={`w-1.5 h-1.5 rounded-full ${isActualToday ? 'bg-brand-200' : 'bg-emerald-500'}`}></span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* BLOCO 2: MURAL DE RH */}
                  <section className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm w-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-brand-900 flex items-center gap-2"><div className="p-1.5 bg-brand-100 text-brand-600 rounded-lg"><Briefcase size={20} /></div>QUADRO DE AVISOS</h3>
                      <span className="bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-brand-100">{hrEvents.filter(e => e.type !== 'Faturamento').length} Lançamentos</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      {hrEvents.filter(e => e.type !== 'Faturamento').map(event => <EventCard key={event.id} event={event} />)}
                      {hrEvents.filter(e => e.type !== 'Faturamento').length === 0 && (
                        <div className="text-center p-6 text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">Nenhum evento registrado no banco de dados.</div>
                      )}
                    </div>
                  </section>
                </div>

                <div className="w-full flex flex-col gap-6">
                  
                  {/* --- PAINEL: RESUMO DA SEMANA --- */}
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm w-full relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 p-4 text-brand-50 opacity-50 group-hover:scale-110 transition-transform duration-500 z-0">
                      <CalendarIcon size={120} strokeWidth={1} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-brand-900 mb-5 flex items-center gap-2 relative z-10">
                      <Clock size={20} className="text-brand-500" /> Resumo da Semana
                    </h3>
                    
                    <div className="flex flex-col gap-3 relative z-10">
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-brand-500" />
                          <span className="text-sm font-semibold text-slate-600">Dias Úteis</span>
                        </div>
                        <span className="text-lg font-black text-brand-600">
                          {currentWeekSummary.workingDays} <span className="text-xs font-medium text-slate-500">dias</span>
                        </span>
                      </div>
                      
                      <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${currentWeekSummary.holidays.length > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center gap-2">
                          <Flag size={16} className={currentWeekSummary.holidays.length > 0 ? 'text-emerald-500' : 'text-slate-400'} />
                          <span className={`text-sm font-semibold ${currentWeekSummary.holidays.length > 0 ? 'text-emerald-700' : 'text-slate-600'}`}>Feriados</span>
                        </div>
                        <span className={`text-lg font-black ${currentWeekSummary.holidays.length > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {currentWeekSummary.holidays.length}
                        </span>
                      </div>

                      {currentWeekSummary.holidays.length > 0 && (
                        <div className="mt-3 bg-white border border-emerald-100 rounded-lg p-3">
                          <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Detalhe dos Feriados</h4>
                          <div className="space-y-2">
                            {currentWeekSummary.holidays.map(h => {
                              const d = new Date(h.date + 'T12:00:00');
                              const dayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(d).replace('.','');
                              return (
                                <div key={h.id} className="flex items-center gap-2 text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold uppercase w-10 text-center flex-shrink-0">
                                    {dayName}
                                  </span>
                                  <span className="font-semibold text-slate-700 truncate text-xs">{h.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm w-full">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2">
                        <BarChart3 size={20} className="text-brand-500" /> Pulso Tático
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-100 px-2.5 py-1 rounded-full">Etapa 1</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Projetos</p>
                        <p className="text-2xl font-black text-brand-900">{tacticalStats.totalProjects}</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Aprovações</p>
                        <p className="text-2xl font-black text-amber-700">{tacticalStats.pendingApproval}</p>
                      </div>
                      <div className="bg-brand-50 border border-brand-100 rounded-xl p-3">
                        <p className="text-[10px] font-black text-brand-700 uppercase tracking-wider">Liberadas</p>
                        <p className="text-2xl font-black text-brand-700">{tacticalStats.available}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bloqueadas</p>
                        <p className="text-2xl font-black text-slate-700">{tacticalStats.blocked}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setCurrentView('atividades')} className="w-full mt-4 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-black hover:bg-brand-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Abrir rotina tática
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-900 mb-3">Módulos do Sistema</h3>
                    <div className="flex flex-col gap-3">
                      <ActionCard title="Atividades Táticas" description="Tarefas liberadas, bloqueadas e aguardando aprovação" icon={CheckCircle} colorClass="bg-gradient-to-br from-brand-500 to-brand-700" onClick={() => setCurrentView('atividades')} />
                      <ActionCard title="Projetos" description="Fluxos por setor, etapas e dependências em cascata" icon={Briefcase} colorClass="bg-gradient-to-br from-cyan-500 to-brand-600" onClick={() => setCurrentView('projetos')} />
                      {isAdminUser && <ActionCard title="Aprovações" description="Validação administrativa das atividades executadas" icon={ShieldCheck} colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600" onClick={() => setCurrentView('aprovacoes')} />}
                      <ActionCard title="Informes" description="Comunicados corporativos e histórico completo" icon={FileText} colorClass="bg-gradient-to-br from-slate-500 to-slate-700" onClick={() => setCurrentView('informes')} />
                      <ActionCard title="Lista de Feriados" description="Feriados nacionais, estaduais e municipais" icon={Flag} colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600" onClick={() => setIsHolidayModalOpen(true)} />
                      <ActionCard title="Aniversariantes do Mês" description="Colaboradores aniversariantes do mês vigente" icon={Cake} colorClass="bg-gradient-to-br from-pink-500 to-rose-600" onClick={() => showFeedbackDialog('info', 'Aniversariantes do mês', 'Módulo reservado para a visualização dos aniversariantes do mês. A estrutura visual já está preparada para receber os próximos dados.')} />
                      <ActionCard title="Manutenções" description="Programações e avisos de manutenção interna" icon={Wrench} colorClass="bg-gradient-to-br from-amber-500 to-orange-600" onClick={() => showFeedbackDialog('info', 'Manutenções', 'Módulo reservado para programações, avisos e controles de manutenção. A estrutura visual já está preparada para expansão.')} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-200 w-full">
                <h3 className="text-lg font-bold text-brand-900 mb-4 flex items-center gap-2"><Clock size={20} className="text-slate-500" />Progresso do Ano ({todayDate.getFullYear()})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 w-full">
                   <DonutChart percentage={yearProgress.daysPercentage} color="var(--brand-primary, #1E3A8A)" label="Dias Úteis Decorridos" subLabel={`${yearProgress.elapsedDays} de ${yearProgress.totalDays} dias úteis`} />
                   <DonutChart percentage={yearProgress.weeksPercentage} color="var(--brand-accent, #00D4FF)" label="Semanas Decorridas" subLabel={`${yearProgress.elapsedWeeks} de ${yearProgress.totalWeeks} semanas`} />
                </div>
              </div>
            </div>
            ) : renderMainView()}
          </main>


          <FloatingActionButton
            isAdmin={!!(user && profile?.is_admin)}
            user={user}
            profile={profile}
            currentView={currentView}
            navigationItems={visibleNavigationItems}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
            onAdminAccess={() => {
              if (user && profile?.is_admin) {
                setIsAdminModalOpen(true);
              } else {
                setCurrentView('login');
              }
            }}
          />

          {/* ================= MODAIS UI (Paineis secundários) ================= */}

          {/* Modal Feriados */}
          <Modal isOpen={isHolidayModalOpen} onClose={() => setIsHolidayModalOpen(false)} title="Feriados Oficiais" icon={Flag} colorClass="bg-emerald-500">
             <div className="mb-6 overflow-x-auto hide-scrollbar pb-2">
              <div className="flex gap-2 w-max">
                <FilterButton id="todos" label="Todos" icon={Filter} activeColor="text-brand-900" />
                <FilterButton id="nacional" label="Nacional" icon={Flag} activeColor="text-emerald-600" />
                <FilterButton id="estadual" label="Estadual (CE)" icon={MapPin} activeColor="text-brand-600" />
                <FilterButton id="municipal" label="Municipal (Caucaia)" icon={MapPin} activeColor="text-amber-600" />
              </div>
            </div>
             <div className="space-y-3">
              {filteredHolidays.map(holiday => {
                let badgeClass = holiday.type === 'nacional' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : holiday.type === 'estadual' ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-amber-50 text-amber-700 border-amber-200';
                const holidayDate = new Date(holiday.date + 'T12:00:00');
                const isPast = holidayDate < todayDate && !isSameDay(holidayDate, todayDate);
                const isNextHoliday = upcomingHolidaysList.includes(holiday.id);
                return (
                  <div key={holiday.id} className={`flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl border shadow-sm transition-all ${isPast ? 'border-slate-100 opacity-60 bg-slate-50' : 'border-slate-200 hover:shadow-md'} ${isNextHoliday ? 'ring-2 ring-emerald-400 shadow-md' : ''}`}>
                    <div className={`flex flex-col items-center justify-center min-w-[4rem] md:min-w-[4.5rem] p-2 rounded-lg border ${isPast ? 'bg-slate-100 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
                      <span className={`text-[10px] md:text-xs font-bold uppercase ${isPast ? 'text-slate-400 line-through' : 'text-slate-500'}`}>{new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(holidayDate).replace('.','')}</span>
                      <span className={`text-xl md:text-2xl font-black ${isPast ? 'text-slate-400 line-through' : 'text-brand-900'}`}>{holidayDate.getDate()}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5 md:mb-2">
                        <h4 className={`font-bold text-sm md:text-base truncate w-full sm:w-auto ${isPast ? 'text-slate-500 line-through' : 'text-brand-900'}`}>{holiday.name}</h4>
                        {isNextHoliday && <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-widest animate-pulse">Próximo</span>}
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[9px] md:text-[10px] font-bold border uppercase tracking-wider ${badgeClass} ${isPast ? 'opacity-70' : ''}`}>{holiday.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Modal>

          {/* Modal Dia Específico */}
          <Modal isOpen={isDayModalOpen} onClose={() => setIsDayModalOpen(false)} title={formatFullDate(selectedDay)} icon={CalendarIcon} colorClass="bg-brand-500">
            {selectedDay && (() => {
               const dayEvents = hrEvents.filter(e => isEventOnDate(e, selectedDay) && e.type !== 'Faturamento');
               const dayHolidays = allHolidays.filter(h => isSameDay(new Date(h.date + 'T12:00:00'), selectedDay));
               const dayBillings = hrEvents.filter(b => isEventOnDate(b, selectedDay) && b.type === 'Faturamento');
               const hasNothing = dayEvents.length === 0 && dayHolidays.length === 0 && dayBillings.length === 0;

               return (
                 <div className="space-y-8">
                   {hasNothing && (
                     <div className="text-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium flex flex-col items-center justify-center">
                       <Clock size={32} className="text-slate-300 mb-3" /><p>Não há feriados, nem eventos ou faturamentos programados para este dia.</p>
                     </div>
                   )}

                   {dayHolidays.length > 0 && (
                     <div className="bg-emerald-50/50 p-4 md:p-6 rounded-xl border border-emerald-100">
                       <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 flex items-center gap-2"><Flag size={18} /> Feriados neste dia</h4>
                       <div className="space-y-3">
                         {dayHolidays.map(holiday => (
                           <div key={holiday.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-emerald-200 shadow-sm ring-1 ring-emerald-50">
                              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg"><Flag size={20} /></div>
                              <div>
                                <h4 className="font-bold text-brand-900 text-base mb-0.5">{holiday.name}</h4>
                                <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">Feriado {holiday.type}</span>
                              </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {dayEvents.length > 0 && (
                     <div className="bg-brand-50/50 p-4 md:p-6 rounded-xl border border-brand-100">
                       <h4 className="text-sm font-bold text-brand-800 uppercase tracking-wider mb-4 flex items-center gap-2"><Briefcase size={18} /> Lançamentos Internos</h4>
                       <div className="flex flex-col gap-4">
                         {dayEvents.map(event => <EventCard key={event.id} event={event} /> )}
                       </div>
                     </div>
                   )}

                   {dayBillings.length > 0 && (
                     <div className="bg-amber-50/50 p-4 md:p-6 rounded-xl border border-amber-100">
                       <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-4 flex items-center gap-2"><DollarSign size={18} /> Observações de Faturamento</h4>
                       <div className="flex flex-col gap-4">
                         {dayBillings.map(billing => <EventCard key={billing.id} event={billing} /> )}
                       </div>
                     </div>
                   )}
                 </div>
               );
            })()}
          </Modal>

          {/* Modal Mês Estendido */}
          <Modal isOpen={isMonthModalOpen} onClose={() => setIsMonthModalOpen(false)} title={`Visão Mensal: ${todayDate.getFullYear()} - meses futuros`} icon={CalendarIcon} colorClass="bg-brand-600" desktopFullScreen={true}>
            <div className="space-y-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-brand-900">Meses liberados para consulta</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
                      A visão mensal agora mostra o mês atual e os próximos meses do ano, facilitando a navegação sem voltar para meses já encerrados.
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">● Hoje</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Feriado</span>
                    <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">Evento</span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Faturamento</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
                {futureMonths.map((month) => {
                  const monthDate = month.days[0];
                  const monthWeeksList = buildMonthWeeks(monthDate);
                  const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
                  const isExpanded = expandedMonthKey === monthKey;
                  const isCurrentMonth = monthDate.getMonth() === todayDate.getMonth() && monthDate.getFullYear() === todayDate.getFullYear();
                  const monthEvents = hrEvents.filter(e => e.type !== 'Faturamento' && isEventInMonth(e, monthDate)).length;
                  const monthHolidays = allHolidays.filter(h => h.date && new Date(h.date + 'T12:00:00').getMonth() === monthDate.getMonth() && new Date(h.date + 'T12:00:00').getFullYear() === monthDate.getFullYear()).length;
                  const monthBillings = hrEvents.filter(e => e.type === 'Faturamento' && isEventInMonth(e, monthDate)).length;

                  return (
                    <div key={monthKey} className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${isCurrentMonth ? 'border-brand-200 ring-2 ring-brand-100' : 'border-slate-200'} ${isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'}`}>
                      <button
                        type="button"
                        onClick={() => setExpandedMonthKey(isExpanded ? null : monthKey)}
                        className={`w-full p-4 flex items-start justify-between gap-3 text-left transition-colors ${isCurrentMonth ? 'bg-brand-50/60 hover:bg-brand-50 border-brand-100' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}
                      >
                        <div>
                          <h4 className="text-base md:text-lg font-black text-brand-900 capitalize flex items-center gap-2">
                            <CalendarIcon size={18} className={isCurrentMonth ? 'text-brand-600' : 'text-slate-500'} />
                            {month.name}
                          </h4>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{monthDate.getFullYear()}</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="hidden md:flex flex-wrap justify-end gap-1.5 max-w-[260px]">
                            {isCurrentMonth && <span className="px-2 py-0.5 rounded-full bg-brand-600 text-white text-[9px] font-bold uppercase tracking-wider">Mês atual</span>}
                            {monthHolidays > 0 && <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold uppercase tracking-wider">{monthHolidays} feriado(s)</span>}
                            {monthEvents > 0 && <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100 text-[9px] font-bold uppercase tracking-wider">{monthEvents} evento(s)</span>}
                            {monthBillings > 0 && <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-bold uppercase tracking-wider">{monthBillings} fat.</span>}
                          </div>
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${isExpanded ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-500 border-slate-200'}`}>
                            <ChevronRight size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-white">
                          <div className="grid grid-cols-7 bg-white border-b border-slate-100">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                              <div key={day} className="text-center text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2 border-r border-slate-100 last:border-r-0">{day}</div>
                            ))}
                          </div>

                          <div className="flex flex-col">
                            {monthWeeksList.map((week, wIdx) => (
                              <div key={wIdx} className="grid grid-cols-7 border-b border-slate-100 last:border-b-0">
                                {week.map((day, dIdx) => {
                                  if (!day) return <div key={`empty-${wIdx}-${dIdx}`} className="min-h-[62px] md:min-h-[82px] border-r border-slate-100 last:border-r-0 bg-slate-50/50"></div>;

                                  const isActualToday = isSameDay(day, todayDate);
                                  const dayEvents = hrEvents.filter(e => isEventOnDate(e, day) && e.type !== 'Faturamento');
                                  const dayHolidays = allHolidays.filter(h => isSameDay(new Date(h.date + 'T12:00:00'), day));
                                  const dayBillings = hrEvents.filter(b => isEventOnDate(b, day) && b.type === 'Faturamento');

                                  return (
                                    <div key={dIdx} onClick={() => { setIsMonthModalOpen(false); openDayDetails(day); }} className={`min-h-[62px] md:min-h-[82px] p-1.5 md:p-2 border-r border-slate-100 last:border-r-0 flex flex-col transition-all cursor-pointer relative group ${isActualToday ? 'bg-brand-50/60' : 'hover:bg-slate-50'} ${dayHolidays.length > 0 ? 'ring-1 ring-inset ring-emerald-100' : ''}`}>
                                      <div className="flex justify-between items-start mb-1">
                                        <div className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full text-xs md:text-sm font-bold ${isActualToday ? 'bg-brand-600 text-white shadow-sm' : dayHolidays.length > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : dayEvents.length > 0 ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'text-slate-700 group-hover:bg-brand-100 group-hover:text-brand-700'}`}>{day.getDate()}</div>
                                        <div className="flex gap-0.5 md:hidden">
                                          {dayEvents.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>}
                                          {dayHolidays.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                                          {dayBillings.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                                        </div>
                                      </div>

                                      <div className="hidden md:flex flex-col gap-1 w-full overflow-hidden flex-1">
                                        {dayHolidays.length > 0 && dayHolidays.slice(0, 1).map((h, i) => (<div key={`h-${i}`} className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 truncate w-full" title={h.name}>🎌 {h.name}</div>))}
                                        {dayEvents.length > 0 && dayEvents.slice(0, 1).map((e, i) => (<div key={`e-${i}`} className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded border border-brand-100 truncate w-full" title={e.title}>📌 {e.type}</div>))}
                                        {dayBillings.length > 0 && dayBillings.slice(0, 1).map((b, i) => (<div key={`b-${i}`} className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-100 truncate w-full" title="Faturamento">💰 Fat.</div>))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Modal>

          {/* ================= MODAL PAINEL ADMIN (INSERÇÃO NO SUPABASE) ================= */}
          <Modal isOpen={isAdminModalOpen} onClose={closeAdminModal} title="Gestão de Calendário" icon={Briefcase} colorClass="bg-brand-600" desktopFullScreen={true}>
            {!adminSelectedDate ? (
              <div className="space-y-6">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-slate-500 font-medium">Selecione um dia desbloqueado para adicionar um novo registro. Meses encerrados ficam sinalizados e bloqueados para novas edições.</p>
                  <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">🔒 Encerrado</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">🔓 Liberado</span>
                  </div>
                </div>
                {allYearMonths.map((month, mIdx) => {
                  const isPastMonth = mIdx < todayDate.getMonth();
                  const isCurrentMonth = mIdx === todayDate.getMonth();
                  const monthHolidays = allHolidays.filter(h => month.days.some(day => isSameDay(new Date(h.date + 'T12:00:00'), day)));
                  const monthEvents = hrEvents.filter(e => month.days.some(day => isEventOnDate(e, day)) && e.type !== 'Faturamento');
                  const monthBillings = hrEvents.filter(e => month.days.some(day => isEventOnDate(e, day)) && e.type === 'Faturamento');

                  return (
                    <div ref={isCurrentMonth ? currentAdminMonthRef : null} key={mIdx} className={`rounded-xl border shadow-sm overflow-hidden transition-all scroll-mt-6 ${isPastMonth ? 'border-red-100 bg-red-50/70 opacity-80' : isCurrentMonth ? 'bg-white border-brand-200 ring-2 ring-brand-100 shadow-md' : 'bg-white border-slate-200'}`}>
                      <div className={`${isPastMonth ? 'bg-red-50/80 border-red-100' : isCurrentMonth ? 'bg-brand-50 border-brand-100' : 'bg-slate-50 border-slate-200'} border-b px-4 py-3 flex items-center justify-between gap-3`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <h4 className={`font-bold capitalize text-sm md:text-base flex items-center gap-2 ${isPastMonth ? 'text-red-700/80' : 'text-brand-900'}`}><CalendarIcon size={16} className={isPastMonth ? "text-red-400" : "text-brand-500"} /> {month.name}</h4>
                          <div className="hidden md:flex items-center gap-1.5">
                            {isPastMonth ? <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-100/70 text-red-700 border border-red-200 whitespace-nowrap">🔒 Encerrado</span> : <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">🔓 Liberado</span>}
                            {isCurrentMonth && <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-600 text-white border border-brand-600 whitespace-nowrap">Mês atual</span>}
                            {monthHolidays.length > 0 && <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">🎌 {monthHolidays.length} feriado{monthHolidays.length > 1 ? 's' : ''}</span>}
                            {monthEvents.length > 0 && <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100 whitespace-nowrap">📌 {monthEvents.length} registro{monthEvents.length > 1 ? 's' : ''}</span>}
                            {monthBillings.length > 0 && <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 whitespace-nowrap">💰 {monthBillings.length} faturamento{monthBillings.length > 1 ? 's' : ''}</span>}
                          </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                          <button type="button" onClick={() => scrollAdminMonthDays(mIdx, -1)} className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors border border-slate-200 shadow-sm" title="Ver dias anteriores">
                            <ChevronLeft size={16} />
                          </button>
                          <button type="button" onClick={() => scrollAdminMonthDays(mIdx, 1)} className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors border border-slate-200 shadow-sm" title="Ver próximos dias">
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                      <div ref={(el) => adminMonthScrollRefs.current[mIdx] = el} className="flex overflow-x-auto hide-scrollbar p-3 gap-2 md:gap-3">
                        {month.days.map((day, dIdx) => {
                          const dayName = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(day).replace('.', '');
                          const dayHolidays = allHolidays.filter(h => isSameDay(new Date(h.date + 'T12:00:00'), day));
                          const dayEvents = hrEvents.filter(e => isEventOnDate(e, day) && e.type !== 'Faturamento');
                          const dayBillings = hrEvents.filter(e => isEventOnDate(e, day) && e.type === 'Faturamento');
                          const hasHoliday = dayHolidays.length > 0;
                          const hasEvent = dayEvents.length > 0;
                          const hasBilling = dayBillings.length > 0;
                          const hasAnyMarker = hasHoliday || hasEvent || hasBilling;
                          const isTodayDay = isSameDay(day, todayDate);

                          return (
                            <button
                              key={dIdx}
                              type="button"
                              disabled={isPastMonth}
                              data-admin-current-day={isTodayDay ? 'true' : undefined}
                              onClick={() => { if (!isPastMonth) handleAdminDaySelect(day); }}
                              className={`group flex-shrink-0 relative flex flex-col items-center justify-start p-3 w-16 md:w-28 min-h-[84px] md:min-h-[126px] rounded-lg border transition-all duration-200 ${isPastMonth ? 'cursor-not-allowed border-red-100 bg-red-50/60 text-red-500 opacity-80' : `hover:-translate-y-0.5 hover:shadow-md ${hasHoliday ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300' : hasEvent ? 'border-brand-200 bg-brand-50 text-brand-800 hover:border-brand-300' : hasBilling ? 'border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300' : 'border-slate-200 hover:border-brand-400 hover:bg-slate-50 text-slate-600'}`} ${isTodayDay ? 'ring-2 ring-brand-400 shadow-md' : ''}`}
                              title={isPastMonth ? 'Mês encerrado para novas edições ou adições' : hasHoliday ? dayHolidays.map(h => h.name).join(', ') : hasEvent ? dayEvents.map(e => e.title).join(', ') : hasBilling ? 'Faturamento programado' : 'Adicionar registro'}
                            >
                              {isPastMonth && <span className="hidden md:block absolute top-1.5 right-1.5 text-[11px]" aria-hidden="true">🔒</span>}
                              <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">{dayName}</span>
                              <span className="text-lg md:text-2xl font-black leading-none">{day.getDate()}</span>
                              <div className="flex gap-1 md:hidden mt-1">
                                {hasHoliday && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
                                {hasEvent && <span className="w-1.5 h-1.5 bg-brand-500 rounded-full"></span>}
                                {hasBilling && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>}
                              </div>
                              {hasAnyMarker && (
                                <div className="hidden md:flex flex-col gap-1 w-full mt-3">
                                  {hasHoliday && <span className="text-[10px] font-bold px-1.5 py-1 rounded-md bg-white/80 text-emerald-700 border border-emerald-100 truncate">🎌 {dayHolidays[0].name}</span>}
                                  {hasEvent && <span className="text-[10px] font-bold px-1.5 py-1 rounded-md bg-white/80 text-brand-700 border border-brand-100 truncate">📌 {dayEvents[0].type}</span>}
                                  {hasBilling && <span className="text-[10px] font-bold px-1.5 py-1 rounded-md bg-white/80 text-amber-700 border border-amber-100 truncate">💰 Fatur.</span>}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col gap-4 mb-6 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="font-bold text-base md:text-lg text-brand-900">
                      {editingEventId ? 'Editar registro' : 'Registro'} para {adminSelectedDate.getDate()} de {new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(adminSelectedDate)}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Visualize, edite ou exclua registros já marcados para este dia.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {editingEventId && (
                      <button type="button" onClick={clearAdminFormFields} className="px-3 py-2 rounded-lg text-xs md:text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200">
                        Novo registro
                      </button>
                    )}
                    <button type="button" onClick={handleBackToAdminMonths} className="text-xs md:text-sm font-semibold text-brand-600 hover:text-brand-800 px-2 py-2">
                      ← Voltar aos meses
                    </button>
                  </div>
                </div>

                <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-3 md:p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h5 className="text-xs font-black text-brand-900 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={15} className="text-brand-500" /> Registros deste dia
                    </h5>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white text-slate-500 border border-slate-200">
                      {selectedAdminDayEvents.length} item{selectedAdminDayEvents.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {selectedAdminDayEvents.length === 0 ? (
                    <div className="text-center p-4 bg-white border border-dashed border-slate-200 rounded-lg text-sm font-medium text-slate-400">
                      Nenhum registro cadastrado para este dia.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedAdminDayEvents.map(event => (
                        <div key={event.id} className={`bg-white rounded-lg border p-3 transition-all ${editingEventId === event.id ? 'border-brand-300 ring-2 ring-brand-100 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100 uppercase tracking-wider">{event.type}</span>
                                {event.department && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100 uppercase tracking-wider">{event.department}</span>}
                                {event.start_time && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{event.start_time.substring(0, 5)}{event.end_time ? ` - ${event.end_time.substring(0, 5)}` : ''}</span>}
                              </div>
                              <p className="font-bold text-sm text-brand-900 truncate">{event.title}</p>
                              {event.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button type="button" onClick={() => handleEditAdminEvent(event)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-100 transition-colors">
                                <Pencil size={14} /> Editar
                              </button>
                              <button type="button" onClick={() => handleDeleteAdminEvent(event)} disabled={isSubmitting} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors disabled:opacity-50">
                                <Trash2 size={14} /> Excluir
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipo de Registro</label>
                      <select value={formData.type} onChange={(e) => handleFormTypeChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 outline-none font-medium">
                        <option value="Evento">Evento</option>
                        <option value="Informe">Informe</option>
                        <option value="Alteração de Folga">Alteração de Folga</option>
                        <option value="Troca de Feriado">Troca de Feriado</option>
                        <option value="Faturamento">Faturamento (Apenas Visual)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Setor</label>
                      <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 outline-none font-medium">
                        {SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Título / Assunto</label>
                      <input type="text" required placeholder="Ex: Treinamento de Integração" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 outline-none font-medium" />
                    </div>

                    {!CHANGE_DATE_TYPES.includes(formData.type) && (
                      <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <label htmlFor="hasDateRange" className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                            <input
                              type="checkbox"
                              id="hasDateRange"
                              checked={formData.hasDateRange}
                              onChange={(e) => setFormData({...formData, hasDateRange: e.target.checked, endDate: e.target.checked ? formData.endDate : ''})}
                              className="w-4 h-4 text-brand-600 rounded border-slate-300"
                            />
                            Este registro dura mais de um dia?
                          </label>

                          {formData.hasDateRange && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Data final</label>
                              <input
                                type="date"
                                required
                                min={adminSelectedDate ? formatDateKey(adminSelectedDate) : ''}
                                value={formData.endDate}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                className="bg-white border border-slate-200 text-brand-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2 outline-none font-medium"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-2">Quando ativado, o registro aparece automaticamente em todos os dias entre a data inicial selecionada e a data final.</p>
                      </div>
                    )}

                    {formData.type === 'Evento' && (
                      <>
                        <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hora de Início</label><input type="time" required value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg p-2.5 outline-none" /></div>
                        <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hora de Fim</label><input type="time" required value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg p-2.5 outline-none" /></div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Público-Alvo (Setores)</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                            {TARGET_SECTORS.map(sector => {
                              const selectedSectors = formData.targetRoles ? formData.targetRoles.split(',').map(item => item.trim()).filter(Boolean) : [];
                              const isSelected = selectedSectors.includes(sector);

                              return (
                                <button
                                  key={sector}
                                  type="button"
                                  onClick={() => toggleTargetSector(sector)}
                                  className={`text-left px-3 py-2 rounded-lg border text-xs font-bold transition-all ${isSelected ? 'bg-brand-600 text-white border-brand-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-700'}`}
                                  aria-pressed={isSelected}
                                >
                                  {isSelected ? '✓ ' : ''}{sector}
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium mt-2">Selecione um ou mais setores para definir o público-alvo.</p>
                        </div>
                        <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Local do Evento</label><input type="text" placeholder="Ex: Sala de Reuniões 1" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg p-2.5 outline-none" /></div>
                      </>
                    )}

                    {formData.type === 'Informe' && (
                      <>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Classificação do Informe</label>
                          <div className="flex flex-wrap gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                            {['Geral', 'Urgente', 'Específico'].map(cls => (
                              <label key={cls} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                                <input type="radio" name="classification" value={cls} checked={formData.classification === cls} onChange={(e) => setFormData({...formData, classification: e.target.value})} className="w-4 h-4 text-brand-600" />{cls}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="md:col-span-2 flex items-center gap-2 mt-2 mb-1">
                          <input type="checkbox" id="hasPeriod" checked={formData.hasPeriod} onChange={(e) => setFormData({...formData, hasPeriod: e.target.checked})} className="w-4 h-4 text-brand-600 rounded border-slate-300" />
                          <label htmlFor="hasPeriod" className="text-sm font-bold text-slate-700 cursor-pointer">Este informe tem um período específico de duração?</label>
                        </div>
                        {formData.hasPeriod && (
                          <>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hora de Início</label><input type="time" required value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg p-2.5 outline-none" /></div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hora de Fim</label><input type="time" required value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg p-2.5 outline-none" /></div>
                          </>
                        )}
                      </>
                    )}

                    {(formData.type === 'Alteração de Folga' || formData.type === 'Troca de Feriado') && (
                      <>
                        <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Data Original</label><input type="date" required value={formData.originalDate} onChange={(e) => setFormData({...formData, originalDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg p-2.5 outline-none" /></div>
                        <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nova Data</label><input type="date" required value={formData.newDate} onChange={(e) => setFormData({...formData, newDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg p-2.5 outline-none" /></div>
                      </>
                    )}

                    <div className="md:col-span-2 mt-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descrição / Observações</label>
                      <textarea rows="3" placeholder="Detalhes adicionais..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-brand-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-3 outline-none font-medium resize-none"></textarea>
                    </div>

                    <div className="md:col-span-2">
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Anexos (PDF, Imagem, etc)</label>
                       <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
                         <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-lg cursor-pointer transition-colors border border-slate-200 flex-shrink-0">
                           <Paperclip size={16} /> Selecionar Arquivo
                           <input type="file" className="hidden" onChange={(e) => setFormData({...formData, file: e.target.files[0] || null})} />
                         </label>
                         <span className="text-sm font-medium text-slate-400 min-w-0 max-w-full truncate" title={formData.file ? formData.file.name : ''}>
                           {formData.file ? `Arquivo selecionado: ${formData.file.name}` : 'Nenhum arquivo selecionado.'}
                         </span>
                       </div>
                    </div>

                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                    <button type="button" onClick={resetAdminForm} className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                      Cancelar
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50">
                      {isSubmitting ? 'A processar...' : <>{editingEventId ? <Pencil size={16} /> : <PlusCircle size={16} />} {editingEventId ? 'Atualizar Registro' : 'Salvar Registro'}</>}
                    </button>
                  </div>
                </form>

              </div>
            )}
          </Modal>

          {renderInteractionDialogs()}

        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
