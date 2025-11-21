import React, { useState } from 'react';
import { Calendar, FileText, Clock, CheckCircle, X, ChevronDown, ChevronUp, Minimize2 } from 'lucide-react';


const ProjectContext = ({
    project,
    // budget,
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
    const [selectedTerms, setSelectedTerms] = useState('custom');
    const [selectedMilestones, setSelectedMilestones] = useState('custom');
    const [errors, setErrors] = useState({});

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
        setContractForm({ amount: '', deadline: '', terms: '', milestones: '' });
        setSelectedTerms('custom');
        setSelectedMilestones('custom');
        setErrors({});
    };

    const handleInputChange = (field, value) => {
        setContractForm(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
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
                    <span className="text-green-400 font-medium">{contract?.amount || 'N/A'}</span>
                    <div className="flex items-center text-gray-400">
                        <Calendar size={15} className="mr-1" />
                        {contractForm.deadline}
                    </div>
                </div>
                {renderCenterContent()}
            </div>
            {/* Contract Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                            {/* Amount */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Contract Amount <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={contractForm.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    placeholder="$5,000"
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                />
                                {errors.amount && (
                                    <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
                                )}
                            </div>

                            {/* Deadline */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Project Deadline <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={contractForm.deadline}
                                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                />
                                {errors.deadline && (
                                    <p className="text-red-400 text-xs mt-1">{errors.deadline}</p>
                                )}
                            </div>

                            {/* Project Milestones with Templates */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Project Milestones
                                </label>

                                {/* Template selector pills */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedMilestones('ms1');
                                            handleInputChange('milestones', 'Milestone 1 — Design & Planning: 30% — Due: [date]\nMilestone 2 — Development: 50% — Due: [date]\nMilestone 3 — Final Delivery: 20% — Due: [date]');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedMilestones === 'ms1'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        3-Phase (30/50/20)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedMilestones('ms2');
                                            handleInputChange('milestones', 'Milestone 1 — Prototype & Design: 40% — Due: [date]\nMilestone 2 — Final Development & Delivery: 60% — Due: [date]');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedMilestones === 'ms2'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        2-Phase (40/60)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedMilestones('ms3');
                                            handleInputChange('milestones', 'Milestone 1 — Initial Work: 50% — Due: [date]\nMilestone 2 — Final Delivery: 50% — Due: [date]');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedMilestones === 'ms3'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        2-Phase Equal (50/50)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedMilestones('ms4');
                                            handleInputChange('milestones', 'Milestone 1 — Week 1: 25% — Due: [date]\nMilestone 2 — Week 2: 25% — Due: [date]\nMilestone 3 — Week 3: 25% — Due: [date]\nMilestone 4 — Week 4: 25% — Due: [date]');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedMilestones === 'ms4'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        4 Weekly (25% each)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedMilestones('ms5');
                                            handleInputChange('milestones', 'Single milestone: Full payment upon project completion (100%) — Due: [date]');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedMilestones === 'ms5'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Single (100%)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedMilestones('ms6');
                                            handleInputChange('milestones', 'Milestone 1 — Advance: 20% — Due: [date]\nMilestone 2 — Mid-project: 30% — Due: [date]\nMilestone 3 — Near completion: 30% — Due: [date]\nMilestone 4 — Final delivery: 20% — Due: [date]');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedMilestones === 'ms6'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        4-Phase (20/30/30/20)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedMilestones('custom');
                                            handleInputChange('milestones', '');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedMilestones === 'custom'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Custom
                                    </button>
                                </div>

                                <textarea
                                    value={contractForm.milestones}
                                    onChange={(e) => handleInputChange('milestones', e.target.value)}
                                    placeholder="Key deliverables and timeline milestones"
                                    rows={4}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                                />
                            </div>

                            {/* Payment Terms with Templates */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Payment Terms
                                </label>

                                {/* Template selector pills */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTerms('terms1');
                                            handleInputChange('terms', 'Payment split as per milestones above. Each milestone payment due within 3 business days of milestone completion and approval. Includes 2 rounds of revisions per milestone.');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedTerms === 'terms1'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Milestone-Based Payment
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTerms('terms2');
                                            handleInputChange('terms', 'Initial advance payment required before work begins. Remaining balance split across milestones. Payment terms: Net 5 days from invoice. Late payments subject to 2% monthly interest.');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedTerms === 'terms2'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Advance + Milestones
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTerms('terms3');
                                            handleInputChange('terms', 'Fixed price contract. Payment tied to milestone completion. Includes design, development, testing, and 1 month post-launch support. Source files and documentation provided upon final payment.');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedTerms === 'terms3'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Fixed Price Contract
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTerms('terms4');
                                            handleInputChange('terms', 'Hourly billing at agreed rate. Weekly invoices sent every Monday for previous week. Payment due within 7 days. Includes detailed time logs and progress reports. Overtime (>40hrs/week) billed at 1.5x rate.');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedTerms === 'terms4'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Hourly/Time-Based
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTerms('terms5');
                                            handleInputChange('terms', 'Monthly retainer model. Fixed monthly fee covers up to [X] hours of work. Additional hours billed at [rate]. Unused hours do not roll over. 30-day notice required for cancellation.');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedTerms === 'terms5'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Monthly Retainer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTerms('terms6');
                                            handleInputChange('terms', 'Payment upon completion. Full amount due within 7 days of final delivery and client approval. Includes unlimited revisions during development phase. Final source files released after payment clearance.');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedTerms === 'terms6'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Pay on Completion
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTerms('terms7');
                                            handleInputChange('terms', '50% upfront deposit required to commence work. Remaining 50% due before final delivery. Includes 3 revision rounds. Rush delivery (under 2 weeks) incurs 25% surcharge. Payment via bank transfer or approved payment processor.');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedTerms === 'terms7'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        50/50 Split
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTerms('custom');
                                            handleInputChange('terms', '');
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${selectedTerms === 'custom'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Custom
                                    </button>
                                </div>

                                <textarea
                                    value={contractForm.terms}
                                    onChange={(e) => handleInputChange('terms', e.target.value)}
                                    placeholder="Payment terms, deliverables, revisions, etc."
                                    rows={4}
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