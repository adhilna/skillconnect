import React, { useState, useEffect } from 'react';
import api from '../../../../../api/api';
import {
    Calendar,
    FileText,
    Clock,
    CheckCircle,
    X,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

const ProjectContext = ({
    orderType,
    orderId,
    token,
    project,
    budget,
    deadline,
    status,
}) => {
    const [contract, setContract] = useState(null); // Full contract object or null
    const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState('planning');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Workflow steps (same as your existing list)
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

    // Fetch contract data on mount or when conversationId changes
    useEffect(() => {
        if (!orderType || !orderId) return;

        setLoading(true);
        setError(null);

        api
            .get(`/api/v1/messaging/contracts/?order_type=${orderType}&order_id=${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.data.length > 0) {
                    const c = res.data[0];
                    setContract(c);
                    setCurrentWorkflowStatus(c.workflow_status || 'planning');
                } else {
                    setContract(null);
                    setCurrentWorkflowStatus('planning');
                }
            })
            .catch((err) => {
                setError('Failed to load contract data.');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [orderType, orderId, token]);

    // Open / close modal handlers
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Accept contract API call
    const handleAcceptContract = () => {
        if (!contract) return;

        // determine order_type/order_id from existing contract
        let order_type = null;
        let order_id = null;

        if (contract.service_order) {
            order_type = 'service';
            order_id = contract.service_order; // this is likely the ID
        } else if (contract.proposal_order) {
            order_type = 'proposal';
            order_id = contract.proposal_order;
        }

        api.patch(
            `/api/v1/messaging/contracts/${contract.id}/`,
            {
                status: 'accepted',
                order_type,
                order_id
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(res => {
                setContract(res.data);
                setCurrentWorkflowStatus(res.data.workflow_status || 'planning');
                setIsModalOpen(false);
            })
            .catch(err => {
                alert('Failed to accept contract. Please try again.');
                console.error(err);
            });
    };


    // Reject contract API call
    const handleRejectContract = () => {
        if (!contract) return;

        api
            .patch(
                `/api/v1/messaging/contracts/${contract.id}/`,
                { status: 'rejected' },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                setContract(res.data);
                setCurrentWorkflowStatus(res.data.workflow_status || 'planning');
                setIsModalOpen(false);
            })
            .catch((err) => {
                alert('Failed to reject contract. Please try again.');
                console.error(err);
            });
    };

    // Render progress bar for workflow steps
    const renderProgressBar = () => {
        const currentIndex = workflowSteps.findIndex(
            (s) => s.value === currentWorkflowStatus
        );

        return (
            <div className="w-full mt-3 mb-1 px-2 select-none">
                <div className="flex items-center justify-between">
                    {workflowSteps.map((step, idx) => (
                        <div
                            key={step.value}
                            className="flex items-center flex-grow last:flex-grow-0"
                        >
                            {/* Step dot */}
                            <div
                                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 transition-colors duration-200 ${idx < currentIndex
                                    ? 'bg-green-500 border-green-400 text-white'
                                    : idx === currentIndex
                                        ? 'bg-yellow-400 border-yellow-300 text-gray-900'
                                        : 'bg-gray-800 border-gray-600 text-gray-500'
                                    }`}
                                title={step.label}
                            >
                                {idx + 1}
                            </div>

                            {/* Connector line unless last */}
                            {idx !== workflowSteps.length - 1 && (
                                <div
                                    className={`flex-grow h-1 mx-1 rounded-sm ${idx < currentIndex ? 'bg-green-400' : 'bg-gray-700'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Labels below */}
                <div className="flex justify-between mt-1 px-[6px] text-[10px] text-gray-400">
                    {workflowSteps.map((step) => (
                        <div
                            key={step.value}
                            className="text-center w-6 truncate"
                            title={step.label}
                        >
                            {step.label}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render the main area content depending on the contract state
    const renderCenterContent = () => {
        if (loading) {
            return (
                <div className="text-center text-gray-400 mt-4">Loading contract data...</div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-red-500 mt-4">{error}</div>
            );
        }

        if (!contract) {
            return (
                <div className="text-center mt-2 italic text-gray-300">
                    No contract available.
                </div>
            );
        }

        const contractStatus = contract.status;

        if (contractStatus === 'pending') {
            return (
                <>
                    <div className="flex justify-center mt-2">
                        <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg flex items-center gap-2">
                            <Clock size={16} />
                            <span className="text-sm font-medium">Contract Pending</span>
                        </div>
                    </div>

                    {/* Button to view contract details */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={openModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <FileText size={16} />
                            View Contract
                        </button>
                    </div>
                </>
            );
        }

        if (contractStatus === 'accepted') {
            return (
                <div className="flex flex-col items-center mt-2 gap-2 w-full">
                    <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Contract Accepted</span>
                        </div>
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="text-green-300 hover:text-green-200 transition-colors p-1 rounded"
                            title={isMinimized ? 'Expand details' : 'Minimize details'}
                        >
                            {isMinimized ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </button>
                    </div>

                    {!isMinimized && (
                        <>
                            {renderProgressBar()}

                            {/* Contract details summary */}
                            <div className="mt-3 bg-gray-900 p-3 rounded-lg w-full max-w-xl space-y-2 text-sm text-gray-300">
                                <div>
                                    <strong>Amount: </strong>${contract.amount}
                                </div>
                                <div>
                                    <strong>Deadline: </strong>
                                    {contract.deadline
                                        ? new Date(contract.deadline).toLocaleDateString()
                                        : '-'}
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

                    {isMinimized && (
                        <div className="text-xs text-gray-400 mt-1">
                            Current: {workflowSteps.find((s) => s.value === currentWorkflowStatus)?.label}
                        </div>
                    )}
                </div>
            );
        }

        if (contractStatus === 'rejected') {
            return (
                <>
                    <div className="flex justify-center mt-2">
                        <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg flex items-center gap-2">
                            <X size={16} />
                            <span className="text-sm font-medium">Contract Rejected</span>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={openModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <FileText size={16} />
                            View Contract
                        </button>
                    </div>
                </>
            );
        }

        return (
            <div className="text-center text-gray-400 mt-4">
                Unknown contract status: {contractStatus}
            </div>
        );
    };

    return (
        <>
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-3 m-4 mb-2 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{project || 'Project'}</h4>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-300'
                            : status === 'Review'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}
                    >
                        {status || 'In Progress'}
                    </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-green-400 font-medium">{budget || '$-'}</span>
                    <div className="flex items-center text-gray-400">
                        <Calendar size={12} className="mr-1" />
                        {deadline ? new Date(deadline).toLocaleDateString() : '—'}
                    </div>
                </div>

                {/* Main contract status UI */}
                {renderCenterContent()}
            </div>

            {/* Contract Details Modal */}
            {isModalOpen && contract && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-white font-medium text-lg">Contract Details</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4 text-gray-200">
                            <div>
                                <label className="block text-white text-sm font-medium mb-1">Contract Amount</label>
                                <div className="px-3 py-2 bg-gray-700 rounded">${contract.amount}</div>
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-1">Project Deadline</label>
                                <div className="px-3 py-2 bg-gray-700 rounded">
                                    {contract.deadline ? new Date(contract.deadline).toLocaleDateString() : '-'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-1">Contract Terms</label>
                                <div className="px-3 py-2 bg-gray-700 rounded whitespace-pre-wrap">{contract.terms || '-'}</div>
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-1">Milestones</label>
                                <div className="px-3 py-2 bg-gray-700 rounded whitespace-pre-wrap">{contract.milestones || '-'}</div>
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-1">Contract Status</label>
                                <div className="flex items-center gap-2">
                                    {contract.status === 'pending' && (
                                        <div className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded text-sm">Pending Acceptance</div>
                                    )}
                                    {contract.status === 'accepted' && (
                                        <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded text-sm">Accepted</div>
                                    )}
                                    {contract.status === 'rejected' && (
                                        <div className="bg-red-500/20 text-red-300 px-3 py-1 rounded text-sm">Rejected</div>
                                    )}
                                </div>
                            </div>

                            {/* Accept / Reject buttons only when pending */}
                            {contract.status === 'pending' && (
                                <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
                                    <button
                                        onClick={handleAcceptContract}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={handleRejectContract}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                            {/* Show progress bar if accepted */}
                            {contract.status === 'accepted' && (
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
