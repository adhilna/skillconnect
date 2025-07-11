import React from 'react';
import { Toast } from './Toast';

const ToastContainer = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast toast={toast} onRemove={onRemove} />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
