import React from 'react';
import { Calendar, FileText, Clock, CheckCircle, X, ChevronDown, ChevronUp, Minimize2 } from 'lucide-react';
// import api from '../../../../../api/api';

const ProjectContext = ({
    project,
    budget,
    status,

    contract,
    currentWorkflowStatus,
    loadingContract,
    error,
    contractForm,
    setContractForm,
    isModalOpen,
    setIsModalOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    isMinimized,
    setIsMinimized,
    handleSendContract,
    handleStatusUpdate,
}) => {

    // Workflow steps
    const workflowSteps = [
        { value: 'planning', label: 'Planning' },
        { value: 'advance', label: 'Advance Payment' },
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'milestone-1', label: 'Milestone 1' },
        { value: 'revision', label: 'Revision' },
        { value: 'final-review', label: 'Final Review' },
        { value: 'completed', label: 'Completed' },
        { value: 'paid', label: 'Paid' }
    ];


    const handleMakeContract = () => setIsModalOpen(true);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setContractForm({
            amount: '',
            deadline: '',
            terms: '',
            milestones: ''
        });
    };

    const handleInputChange = (field, value) => {
        setContractForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Progress visual (10 steps)
    const renderProgressBar = () => {
        const currentIndex = workflowSteps.findIndex(
            (s) => s.value === currentWorkflowStatus
        );

        return (
            <div className="w-full mt-3 mb-1 px-2 select-none">

                {/* Steps (dots and connectors) */}
                <div className="flex items-center justify-between">

                    {workflowSteps.map((step, idx) => (
                        <div key={step.value} className="flex items-center flex-grow last:flex-grow-0">

                            {/* Step dot */}
                            <div
                                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 transition-colors duration-200
                ${idx < currentIndex
                                        ? 'bg-green-500 border-green-400 text-white'
                                        : idx === currentIndex
                                            ? 'bg-yellow-400 border-yellow-300 text-gray-900'
                                            : 'bg-gray-800 border-gray-600 text-gray-500'
                                    }
              `}
                                title={step.label}
                            >
                                {idx + 1}
                            </div>

                            {/* Connector line, except after last dot */}
                            {idx !== workflowSteps.length - 1 && (
                                <div
                                    className={`flex-grow h-1 mx-1 rounded-sm
                  ${idx < currentIndex ? 'bg-green-400' : 'bg-gray-700'}
                `}
                                />
                            )}

                        </div>
                    ))}

                </div>

                {/* Labels below dots */}
                <div className="flex justify-between mt-1 px-[6px] text-[10px] text-gray-400">
                    {workflowSteps.map((step) => (
                        <div key={step.value} className="text-center w-6 truncate" title={step.label}>
                            {step.label}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Center area
    const renderCenterContent = () => {
        if (loadingContract) {
            return <div className="text-center text-gray-400 mt-4">Loading contract data...</div>;
        }
        if (error) {
            return <div className="text-center text-red-500 mt-4">{error}</div>;
        }
        if (!contract) {
            // No contract
            return (
                <div className="flex justify-center mt-2">
                    <button
                        onClick={handleMakeContract}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <FileText size={16} />
                        Make Contract
                    </button>
                </div>
            );
        }

        const contractStatus = contract.status;

        if (contractStatus === 'pending') {
            return (
                <div className="flex justify-center mt-2">
                    <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg flex items-center gap-2">
                        <Clock size={16} />
                        <span className="text-sm font-medium">Contract Pending</span>
                    </div>
                </div>
            );
        }
        if (contractStatus === 'accepted') {
            return (
                <div className="flex flex-col items-center mt-2 gap-2">
                    <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Contract Accepted</span>
                        </div>
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="text-green-300 hover:text-green-200 transition-colors p-1 rounded"
                            title={isMinimized ? "Expand details" : "Minimize details"}
                        >
                            {isMinimized ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </button>
                    </div>

                    {/* Collapsible progress section */}
                    {!isMinimized && (
                        <>
                            {/* Progress bar and status */}
                            {renderProgressBar()}

                            {/* Workflow status dropdown */}
                            <div className="relative mt-2">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm hover:bg-purple-500/30 transition-colors"
                                >
                                    <span>Status: {workflowSteps.find(s => s.value === currentWorkflowStatus)?.label}</span>
                                    <ChevronDown size={14} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-40">
                                        {workflowSteps.map((step) => (
                                            <button
                                                key={step.value}
                                                onClick={() => handleStatusUpdate(step.value)}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${currentWorkflowStatus === step.value
                                                    ? 'bg-purple-500/20 text-purple-300'
                                                    : 'text-gray-300'
                                                    }`}
                                            >
                                                {step.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Contract details */}
                            <div className="mt-3 bg-gray-900 p-3 rounded-lg w-full max-w-xl space-y-2 text-sm text-gray-300">
                                <div>
                                    <strong>Amount: </strong>${contract.amount}
                                </div>
                                <div>
                                    <strong>Deadline: </strong>
                                    {new Date(contract.deadline).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>Terms: </strong>
                                    <pre className="whitespace-pre-wrap">{contract.terms || '-'}</pre>
                                </div>
                                <div>
                                    <strong>Milestones: </strong>
                                    <pre className="whitespace-pre-wrap">{contract.milestones || '-'}</pre>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Minimized status indicator */}
                    {isMinimized && (
                        <div className="text-xs text-gray-400 mt-1">
                            Current: {workflowSteps.find(s => s.value === currentWorkflowStatus)?.label}
                        </div>
                    )}
                </div>
            );
        }
        if (contract === 'rejected') {
            return (
                <div className="flex justify-center mt-2">
                    <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg flex items-center gap-2">
                        <X size={16} />
                        <span className="text-sm font-medium">Contract Rejected</span>
                    </div>
                </div>
            );
        }
        return (
            <div className="flex justify-center mt-2">
                <span className="text-gray-400">Unknown contract status.</span>
            </div>
        );
    };

    return (
        <>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3 m-4 mb-2">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{project || "Sample Project"}</h4>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${(status || 'In Progress') === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-300'
                            : (status || 'In Progress') === 'Review'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}
                    >
                        {status || 'In Progress'}
                    </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-green-400 font-medium">{budget || '$5,000'}</span>
                    <div className="flex items-center text-gray-400">
                        <Calendar size={15} className="mr-1" />
                        {contractForm.deadline}
                    </div>
                </div>
                {renderCenterContent()}
            </div>
            {/* Contract Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-white font-medium text-lg">Create Contract</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Contract Amount
                                </label>
                                <input
                                    type="text"
                                    value={contractForm.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    placeholder="$5,000"
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Project Deadline
                                </label>
                                <input
                                    type="date"
                                    value={contractForm.deadline}
                                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Contract Terms
                                </label>
                                <textarea
                                    value={contractForm.terms}
                                    onChange={(e) => handleInputChange('terms', e.target.value)}
                                    placeholder="Payment terms, deliverables, revisions, etc."
                                    rows={4}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Project Milestones
                                </label>
                                <textarea
                                    value={contractForm.milestones}
                                    onChange={(e) => handleInputChange('milestones', e.target.value)}
                                    placeholder="Key deliverables and timeline milestones"
                                    rows={3}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-700">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendContract}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Send Contract
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectContext;