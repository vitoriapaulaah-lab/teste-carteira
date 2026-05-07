(() => {
  const { useState, useEffect, useRef } = React;
  const {
    X,
    CheckCircle,
    AlertTriangle,
    FileText,
    PlusCircle,
    Lock,
    Home
  } = window.AppIcons;

const Modal = ({ isOpen, onClose, title, children, icon: Icon, colorClass, desktopFullScreen = false }) => {
  if (!isOpen) return null;
  const modalPaddingClass = desktopFullScreen ? 'md:p-0' : 'md:p-6';
  const modalPanelClass = desktopFullScreen
    ? 'md:h-screen md:max-h-screen md:max-w-none md:rounded-none md:mt-0'
    : 'md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-2xl md:mt-0 md:rounded-t-2xl';

  return (
    <div className={`app-modal fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 pb-0 ${modalPaddingClass}`} role="dialog" aria-modal="true">
      <div className="app-modal-overlay absolute inset-0 bg-brand-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`app-modal-panel relative w-full h-full bg-white shadow-2xl flex flex-col overflow-hidden modal-animate mt-12 rounded-t-2xl ${modalPanelClass}`}>
        <div className="w-full flex justify-center pt-3 pb-1 md:hidden bg-white" onClick={onClose}><div className="w-12 h-1.5 bg-slate-200 rounded-full"></div></div>
        <div className="app-modal-header flex items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-white z-20">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg text-white flex-shrink-0 ${colorClass}`}><Icon size={24} /></div>
            <h3 className="text-lg md:text-2xl font-bold text-brand-900 leading-tight">{title}</h3>
          </div>
          <button onClick={onClose} className="app-icon-button p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors border border-slate-200 flex-shrink-0 ml-2" aria-label="Fechar modal"><X size={20} /></button>
        </div>
        <div className="app-modal-body p-4 md:p-8 overflow-y-auto flex-1 hide-scrollbar bg-slate-50/50">{children}</div>
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
    <div className="app-interaction-modal fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
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
const FloatingActionButton = ({ onAdminAccess, isAdmin }) => {
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
    <div id="floating-action-button-root" className="app-fab fixed bottom-6 right-6 z-[45] flex flex-col items-end font-sans">
      <div className={`flex flex-col gap-3 mb-4 items-end transition-all duration-300 transform ${isFabOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <button type="button" onClick={handleAdminAccess} className="app-fab-action flex items-center gap-3 hover:scale-105 transition-transform group">
          <span className="bg-white text-slate-700 border border-slate-100 text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap group-hover:text-brand-700">
            {primaryActionLabel}
          </span>
          <div className="w-12 h-12 rounded-full bg-white text-brand-600 shadow-md flex items-center justify-center border border-slate-100 group-hover:bg-brand-50 transition-colors">
            <PrimaryActionIcon size={20} />
          </div>
        </button>

        <button type="button" onClick={handleGoHome} className="app-fab-action flex items-center gap-3 hover:scale-105 transition-transform group">
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
        className={`app-fab-main w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center border outline-none hover:scale-105 active:scale-95 ${
          isFabOpen
            ? 'bg-brand-600 text-white border-brand-600 opacity-100'
            : 'bg-white text-brand-600 border-slate-200 opacity-60 hover:opacity-100 focus:opacity-100'
        }`}
        title="1 clique para abrir o menu | 2 cliques para voltar ao início"
      >
        <div className={`transition-transform duration-300 ${isFabOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isFabOpen ? <X size={28} /> : <PlusCircle size={30} />}
        </div>
      </button>
    </div>
  );
};

  window.AppComponents = {
    Modal,
    InteractionModal,
    FloatingActionButton
  };
})();
