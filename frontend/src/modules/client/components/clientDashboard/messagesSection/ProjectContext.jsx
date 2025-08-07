import React, { useState } from 'react';
import {
    Calendar, FileText, Clock, CheckCircle, X, ChevronDown
} from 'lucide-react';

const ProjectContext = ({ project, budget, deadline, status }) => {
    // Mock contract state - null = no contract, other values as strings
    const [contract, setContract] = useState('null'); // null | 'pending' | 'accepted' | 'rejected'
    const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState('planning');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const workflowSteps = [
        { value: 'planning', label: 'Planning' },
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'started', label: 'Started' },
        { value: 'milestone-1', label: 'Milestone 1' },
        { value: 'review', label: 'Review' },
        { value: 'completed', label: 'Completed' },
        { value: 'paid', label: 'Paid' },
    ];

    // Mock contract data (simulate loaded from API)
    const mockContractData = {
        amount: '$5,000',
        deadline: '2025-09-15',
        terms: 'Payment upon milestones completion, 2 revisions included.',
        milestones: '1. Design (2 weeks), 2. Development (4 weeks), 3. Testing (1 week)',
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleAcceptContract = () => {
        setContract('accepted');
        setIsModalOpen(false);
    };

    const handleRejectContract = () => {
        setContract('rejected');
        setIsModalOpen(false);
    };

    // Read-only progress bar for client
    const renderProgressBar = () => {
        const currentIndex = workflowSteps.findIndex(s => s.value === currentWorkflowStatus);

        return (
            <div className="w-full mt-3 mb-1 px-2 select-none">
                <div className="flex items-center justify-between">
                    {workflowSteps.map((step, idx) => (
                        <div key={step.value} className="flex items-center flex-grow last:flex-grow-0">
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
                            {idx !== workflowSteps.length - 1 && (
                                <div
                                    className={`flex-grow h-1 mx-1 rounded-sm ${idx < currentIndex ? 'bg-green-400' : 'bg-gray-700'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
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


    const renderContractSection = () => {
        if (!contract) {
            return (
                <div className="text-center mt-2 italic text-gray-300">
                    No contract accepted yet.
                </div>
            );
        }

        return (
            <div className="flex justify-center mt-2">
                <button
                    onClick={openModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <FileText size={16} />
                    View Contract
                </button>
            </div>
        );
    };

    return (
        <>
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-3 m-4 mb-2">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{project}</h4>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-300'
                            : status === 'Review'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}
                    >
                        {status}
                    </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-green-400 font-medium">{budget}</span>
                    <div className="flex items-center text-gray-400">
                        <Calendar size={12} className="mr-1" />
                        {deadline ? new Date(deadline).toLocaleDateString() : '—'}
                    </div>
                </div>

                {/* Contract section */}
                {renderContractSection()}
            </div>

            {/* Contract Modal (read-only) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-white font-medium text-lg">Contract Details</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4 text-gray-200">

                            {/* Contract Amount */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-1">Contract Amount</label>
                                <div className="px-3 py-2 bg-gray-700 rounded">{mockContractData.amount}</div>
                            </div>

                            {/* Deadline */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-1">Project Deadline</label>
                                <div className="px-3 py-2 bg-gray-700 rounded">{mockContractData.deadline}</div>
                            </div>

                            {/* Terms */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-1">Contract Terms</label>
                                <div className="px-3 py-2 bg-gray-700 rounded whitespace-pre-wrap">{mockContractData.terms}</div>
                            </div>

                            {/* Milestones */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-1">Milestones</label>
                                <div className="px-3 py-2 bg-gray-700 rounded whitespace-pre-wrap">{mockContractData.milestones}</div>
                            </div>

                            {/* Contract Status */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-1">Contract Status</label>
                                <div className="flex items-center gap-2">
                                    {contract === 'pending' && (
                                        <div className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded text-sm">Pending Acceptance</div>
                                    )}
                                    {contract === 'accepted' && (
                                        <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded text-sm">Accepted</div>
                                    )}
                                    {contract === 'rejected' && (
                                        <div className="bg-red-500/20 text-red-300 px-3 py-1 rounded text-sm">Rejected</div>
                                    )}
                                </div>
                            </div>

                            {/* Accept / Reject Buttons when pending */}
                            {contract === 'pending' && (
                                <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
                                    <button
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium"
                                        onClick={handleAcceptContract}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium"
                                        onClick={handleRejectContract}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                            {/* Show progress bar if accepted */}
                            {contract === 'accepted' && (
                                <div className="mt-6">
                                    <h4 className="text-white text-sm font-semibold mb-2">Project Progress</h4>
                                    {renderProgressBar()}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectContext;
