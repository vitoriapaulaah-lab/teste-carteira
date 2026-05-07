const { useState, useMemo, useEffect, useRef } = React;

const { supabase } = window.AppServices;
const {
  CalendarIcon,
  MapPin,
  Briefcase,
  Flag,
  Filter,
  ChevronRight,
  ChevronLeft,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  PlusCircle,
  Lock,
  Paperclip,
  Users,
  LogOut,
  CheckCircle,
  Pencil,
  Trash2,
  Cake,
  Wrench
} = window.AppIcons;

const {
  Modal,
  InteractionModal,
  FloatingActionButton
} = window.AppComponents;

const {
  SECTORS,
  TARGET_SECTORS,
  LOGO_URL,
  INITIAL_FORM_DATA,
  CHANGE_DATE_TYPES,
  MOCK_HOLIDAYS,
  BUSINESS_DAY_HOLIDAYS_BY_YEAR,
  OPERATIONAL_FLOW_STAGES
} = window.AppConstants;

function App() {
  // --- ESTADOS (State) ---
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' ou 'login'
  const todayDate = new Date(); 
  const [viewDate, setViewDate] = useState(todayDate); 
  const [filter, setFilter] = useState('todos'); 
  const [sectorFilter, setSectorFilter] = useState('todos');
  
  // Estados de Base de Dados
  const [hrEvents, setHrEvents] = useState([]);
  const [dbHolidays, setDbHolidays] = useState([]);
  
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

  // --- LÓGICA: GESTÃO À VISTA / FILTRO SETORIAL ---
  const isDashboardEventVisible = (event) => {
    if (sectorFilter === 'todos') return true;

    const department = (event.department || '').toLowerCase();
    const classification = (event.classification || '').toLowerCase();
    const targetRoles = (event.target_roles || '').toLowerCase();
    const selectedSector = sectorFilter.toLowerCase();

    return (
      department === selectedSector ||
      department === 'geral' ||
      classification === 'geral' ||
      targetRoles.includes(selectedSector)
    );
  };

  const dashboardEvents = useMemo(() => {
    return hrEvents.filter(isDashboardEventVisible);
  }, [hrEvents, sectorFilter]);

  const dashboardAnnouncements = useMemo(() => {
    return dashboardEvents
      .filter(event => event.type !== 'Faturamento')
      .sort((a, b) => {
        const dateA = getEventStartDate(a)?.getTime() || 0;
        const dateB = getEventStartDate(b)?.getTime() || 0;
        const timeA = a.start_time || '99:99';
        const timeB = b.start_time || '99:99';

        if (dateA !== dateB) return dateA - dateB;
        return timeA.localeCompare(timeB);
      });
  }, [dashboardEvents]);

  const dashboardWeekEvents = useMemo(() => {
    return dashboardAnnouncements.filter(event =>
      currentWeekDays.some(day => isEventOnDate(event, day))
    );
  }, [dashboardAnnouncements, currentWeekDays]);

  const urgentDashboardEvents = useMemo(() => {
    return dashboardAnnouncements.filter(event => event.classification === 'Urgente');
  }, [dashboardAnnouncements]);

  const activeDashboardSectors = useMemo(() => {
    const sectors = dashboardAnnouncements
      .map(event => event.department)
      .filter(Boolean);

    return new Set(sectors).size;
  }, [dashboardAnnouncements]);

  const sectorFilterOptions = useMemo(() => {
    return ['todos', ...SECTORS];
  }, []);

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
      <div className={`event-card bg-white p-4 md:p-6 rounded-xl border ${borderClass} hover:shadow-md transition-all relative overflow-hidden group`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2 ${ribbonClass}`}></div>
        
        <div className="flex justify-between items-start mb-3 pl-2">
          <div>
            <h4 className="event-card-title font-bold text-brand-900 pr-4 text-base md:text-lg mb-1">{event.title}</h4>
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
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                event.department && event.department !== 'Geral' && event.classification !== 'Geral'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {event.department && event.department !== 'Geral' && event.classification !== 'Geral' ? 'Setorial' : 'Público'}
              </span>
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
            <div className="event-description mt-2 text-xs text-slate-500 bg-slate-50/50 p-3 rounded-lg border border-slate-100 italic">
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
    <button onClick={onClick} className="action-card group w-full text-left bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4 min-h-[92px]">
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
      <div className="progress-card flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 w-full">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90"><circle cx="40" cy="40" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="8" /><circle cx="40" cy="40" r={radius} fill="transparent" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" /></svg>
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-bold text-brand-900">{Math.round(percentage)}%</span></div>
        </div>
        <div><p className="text-sm font-bold text-brand-900 mb-1">{label}</p><p className="text-xs font-medium text-slate-500">{subLabel}</p></div>
      </div>
    );
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
    <div className="app-shell min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 font-sans selection:bg-brand-100 w-full page-enter">
      
      <header className="app-header bg-white border-b border-slate-200 px-4 md:px-8 py-3 sticky top-0 z-40 shadow-sm w-full">
        <div className="w-full flex items-center justify-between">
          
          <div className="flex items-center gap-3 md:gap-5">
            <img src={LOGO_URL} alt="Logo Empresa" className="h-10 md:h-14 object-contain" />
            <div className="hidden sm:block pl-3 md:pl-5 border-l border-slate-200">
              <h1 className="text-sm md:text-base font-bold tracking-tight text-brand-900 leading-tight">Calendário<br/>Corporativo</h1>
            </div>
          </div>

          {user && (
            <button onClick={handleLogout} className="p-1.5 md:p-2.5 rounded-lg border transition-colors bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 flex items-center gap-2" title="Sair da Conta Admin">
              <LogOut size={18} /> <span className="hidden md:inline text-sm font-bold">Sair</span>
            </button>
          )}
        </div>
      </header>

      <main className="dashboard-main flex-1 overflow-x-hidden p-4 md:p-8 pb-safe flex flex-col gap-8 w-full">
        <div className="dashboard-container w-full max-w-screen-2xl mx-auto">

          <div className="dashboard-layout grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_390px] gap-6 md:gap-8 w-full">
            
            <div className="main-column space-y-6 md:space-y-8 w-full min-w-0">
              <section className="content-card calendar-card bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm w-full">
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
                <div ref={scrollContainerRef} className="calendar-week-strip flex overflow-x-auto hide-scrollbar gap-2 md:gap-4 pt-2 pb-3 md:grid md:grid-cols-7 snap-x snap-mandatory">
                  {currentWeekDays.map((day, index) => {
                    const isActualToday = isSameDay(day, todayDate); 
                    const hasHrEvent = dashboardAnnouncements.some(e => isEventOnDate(e, day) && e.type !== 'Faturamento');
                    const hasHoliday = allHolidays.some(h => isSameDay(new Date(h.date + 'T12:00:00'), day));
                    return (
                      <div key={index} ref={isActualToday ? todayRef : null} onClick={() => openDayDetails(day)}
                        className={`calendar-day-card cursor-pointer snap-center flex-shrink-0 w-20 md:w-auto flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all duration-300 relative ${isActualToday ? 'bg-gradient-to-b from-brand-500 to-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/30 transform scale-[1.05] z-10' : 'bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 hover:-translate-y-0.5'}`}
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
              <section className="content-card notice-board bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm w-full">
                <div className="notice-board-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-brand-900 flex items-center gap-2"><div className="p-1.5 bg-brand-100 text-brand-600 rounded-lg"><Briefcase size={20} /></div>QUADRO DE AVISOS</h3>
                  <span className="self-start sm:self-auto bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-brand-100">{dashboardAnnouncements.length} Lançamentos</span>
                </div>
                <div className="flex flex-col gap-4">
                  {dashboardAnnouncements.map(event => <EventCard key={event.id} event={event} />)}
                  {dashboardAnnouncements.length === 0 && (
                    <div className="text-center p-6 text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">Não há lançamentos para o filtro selecionado.</div>
                  )}
                </div>
              </section>
            </div>

            <aside className="side-panel w-full flex flex-col gap-6">
              
              {/* --- PAINEL: RESUMO DA SEMANA --- */}
              <div className="content-card side-card weekly-summary-card bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm w-full relative overflow-hidden group">
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


              <div className="content-card side-card flow-panel bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm w-full">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2">
                      <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg"><ArrowRight size={18} /></div>
                      Fluxo Operacional
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Estrutura visual preparada para acompanhar projetos em cascata.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200 text-[9px] font-black uppercase tracking-wider">em evolução</span>
                </div>

                <div className="space-y-3">
                  {OPERATIONAL_FLOW_STAGES.map((stage, index) => (
                    <div key={stage.name} className="flow-step flex gap-3 group">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center text-xs font-black">
                          {index + 1}
                        </div>
                        {index < OPERATIONAL_FLOW_STAGES.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1"></div>}
                      </div>
                      <div className="pb-2 min-w-0">
                        <p className="text-sm font-black text-brand-900 leading-tight">{stage.name}</p>
                        <p className="text-xs text-slate-500 font-medium leading-snug mt-0.5 line-clamp-2">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-brand-900 mb-3">Módulos do Sistema</h3>
                <div className="flex flex-col gap-3">
                  <ActionCard title="Lista de Feriados" description="Feriados nacionais, estaduais e municipais" icon={Flag} colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600" onClick={() => setIsHolidayModalOpen(true)} />
                  <ActionCard title="Aniversariantes do Mês" description="Colaboradores aniversariantes do mês vigente" icon={Cake} colorClass="bg-gradient-to-br from-pink-500 to-rose-600" onClick={() => showFeedbackDialog('info', 'Aniversariantes do mês', 'Módulo reservado para a visualização dos aniversariantes do mês. A estrutura visual já está preparada para receber os próximos dados.')} />
                  <ActionCard title="Manutenções" description="Programações e avisos de manutenção interna" icon={Wrench} colorClass="bg-gradient-to-br from-amber-500 to-orange-600" onClick={() => showFeedbackDialog('info', 'Manutenções', 'Módulo reservado para programações, avisos e controles de manutenção. A estrutura visual já está preparada para expansão.')} />
                </div>
              </div>
            </aside>
          </div>
          
          <div className="year-progress-section mt-8 pt-8 border-t border-slate-200 w-full">
            <h3 className="text-lg font-bold text-brand-900 mb-4 flex items-center gap-2"><Clock size={20} className="text-slate-500" />Progresso do Ano ({todayDate.getFullYear()})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 w-full">
               <DonutChart percentage={yearProgress.daysPercentage} color="var(--brand-primary, #1E3A8A)" label="Dias Úteis Decorridos" subLabel={`${yearProgress.elapsedDays} de ${yearProgress.totalDays} dias úteis`} />
               <DonutChart percentage={yearProgress.weeksPercentage} color="var(--brand-accent, #00D4FF)" label="Semanas Decorridas" subLabel={`${yearProgress.elapsedWeeks} de ${yearProgress.totalWeeks} semanas`} />
            </div>
          </div>
        </div>
      </main>


      <FloatingActionButton
        isAdmin={!!(user && profile?.is_admin)}
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
           const dayEvents = dashboardEvents.filter(e => isEventOnDate(e, selectedDay) && e.type !== 'Faturamento');
           const dayHolidays = allHolidays.filter(h => isSameDay(new Date(h.date + 'T12:00:00'), selectedDay));
           const dayBillings = dashboardEvents.filter(b => isEventOnDate(b, selectedDay) && b.type === 'Faturamento');
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

          <div className="month-grid grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
            {futureMonths.map((month) => {
              const monthDate = month.days[0];
              const monthWeeksList = buildMonthWeeks(monthDate);
              const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
              const isExpanded = expandedMonthKey === monthKey;
              const isCurrentMonth = monthDate.getMonth() === todayDate.getMonth() && monthDate.getFullYear() === todayDate.getFullYear();
              const monthEvents = dashboardEvents.filter(e => e.type !== 'Faturamento' && isEventInMonth(e, monthDate)).length;
              const monthHolidays = allHolidays.filter(h => h.date && new Date(h.date + 'T12:00:00').getMonth() === monthDate.getMonth() && new Date(h.date + 'T12:00:00').getFullYear() === monthDate.getFullYear()).length;
              const monthBillings = dashboardEvents.filter(e => e.type === 'Faturamento' && isEventInMonth(e, monthDate)).length;

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
                              const dayEvents = dashboardEvents.filter(e => isEventOnDate(e, day) && e.type !== 'Faturamento');
                              const dayHolidays = allHolidays.filter(h => isSameDay(new Date(h.date + 'T12:00:00'), day));
                              const dayBillings = dashboardEvents.filter(b => isEventOnDate(b, day) && b.type === 'Faturamento');

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
          <div className="admin-months-view space-y-6">
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
                  <div ref={(el) => adminMonthScrollRefs.current[mIdx] = el} className="admin-day-strip flex overflow-x-auto hide-scrollbar p-3 gap-2 md:gap-3">
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
                          className={`admin-day-button group flex-shrink-0 relative flex flex-col items-center justify-start p-3 w-16 md:w-28 min-h-[84px] md:min-h-[126px] rounded-lg border transition-all duration-200 ${isPastMonth ? 'cursor-not-allowed border-red-100 bg-red-50/60 text-red-500 opacity-80' : `hover:-translate-y-0.5 hover:shadow-md ${hasHoliday ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300' : hasEvent ? 'border-brand-200 bg-brand-50 text-brand-800 hover:border-brand-300' : hasBilling ? 'border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300' : 'border-slate-200 hover:border-brand-400 hover:bg-slate-50 text-slate-600'}`} ${isTodayDay ? 'ring-2 ring-brand-400 shadow-md' : ''}`}
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
          <div className="admin-editor-card bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
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

            <form onSubmit={handleFormSubmit} className="admin-form space-y-6">
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

              <div className="admin-form-actions pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
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