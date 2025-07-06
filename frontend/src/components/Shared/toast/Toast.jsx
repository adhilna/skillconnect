import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100);
      setProgress(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 150);
  };

  const getToastConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle />,
          background: 'bg-gradient-to-r from-emerald-500/15 to-green-500/15',
          border: 'border-emerald-400/25',
          iconColor: 'text-emerald-400',
          textColor: 'text-emerald-50',
          progressColor: 'bg-gradient-to-r from-emerald-400 to-green-400',
          shadowColor: 'shadow-emerald-500/15'
        };
      case 'error':
        return {
          icon: <AlertCircle />,
          background: 'bg-gradient-to-r from-red-500/15 to-rose-500/15',
          border: 'border-red-400/25',
          iconColor: 'text-red-400',
          textColor: 'text-red-50',
          progressColor: 'bg-gradient-to-r from-red-400 to-rose-400',
          shadowColor: 'shadow-red-500/15'
        };
      case 'warning':
        return {
          icon: <AlertTriangle />,
          background: 'bg-gradient-to-r from-amber-500/15 to-yellow-500/15',
          border: 'border-amber-400/25',
          iconColor: 'text-amber-400',
          textColor: 'text-amber-50',
          progressColor: 'bg-gradient-to-r from-amber-400 to-yellow-400',
          shadowColor: 'shadow-amber-500/15'
        };
      default: // info
        return {
          icon: <Info />,
          background: 'bg-gradient-to-r from-blue-500/15 to-indigo-500/15',
          border: 'border-blue-400/25',
          iconColor: 'text-blue-400',
          textColor: 'text-blue-50',
          progressColor: 'bg-gradient-to-r from-blue-400 to-indigo-400',
          shadowColor: 'shadow-blue-500/15'
        };
    }
  };

  const config = getToastConfig();

  return (
    <div
      className={`
        transform transition-all duration-150 ease-out
        ${isExiting 
          ? 'translate-x-full opacity-0 scale-95' 
          : 'translate-x-0 opacity-100 scale-100'
        }
        hover:scale-[1.01] hover:shadow-lg
      `}
    >
      <div className={`
        relative overflow-hidden rounded-lg border backdrop-blur-sm
        ${config.background} ${config.border} ${config.shadowColor}
        shadow-md hover:shadow-lg transition-all duration-150
        w-72 sm:w-80 md:w-96
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/3 before:to-transparent before:pointer-events-none
      `}>
        
        {/* Main content */}
        <div className="relative p-3">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`
              flex-shrink-0 p-1 rounded-md bg-white/5
              ${config.iconColor} transition-colors duration-150
            `}>
              {React.cloneElement(config.icon, { size: 18 })}
            </div>
            
            {/* Message content */}
            <div className="flex-1 min-w-0">
              <p className={`
                ${config.textColor} text-sm font-medium leading-relaxed
                break-words
              `}>
                {toast.message}
              </p>
            </div>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className={`
                flex-shrink-0 p-1 rounded-md text-white/50 hover:text-white 
                hover:bg-white/10 transition-all duration-150 
                focus:outline-none focus:ring-1 focus:ring-white/20
              `}
              aria-label="Close toast"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
          <div 
            className={`
              h-full ${config.progressColor} transition-all duration-75 ease-linear
            `}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Toast Container for positioning
const ToastContainer = ({ children }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-full">
      {children}
    </div>
  );
};

export { Toast, ToastContainer };