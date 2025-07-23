import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Eye, Clock, DollarSign, X, Users, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import api from '../../../../api/api';

const ProposalsSection = () => {
    const [proposals, setProposals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProposal, setEditingProposal] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        skills_input: [],
        budget_min: '',
        budget_max: '',
        timeline_days: '',
        project_scope: '',
        status: 'open',
        is_urgent: false,
        is_active: true
    });

    const projectScopeOptions = [
        { value: "one_time", label: "One-time" },
        { value: "ongoing", label: "Ongoing" }
    ];

    const statusOptions = [
        { value: "open", label: "Open" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" }
    ];

    const statusColors = {
        open: "bg-blue-500/20 text-blue-400 border-blue-400/20",
        in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-400/20",
        completed: "bg-green-500/20 text-green-400 border-green-400/20",
        cancelled: "bg-red-500/20 text-red-400 border-red-400/20"
    };

    const statusIcons = {
        open: Eye,
        in_progress: Clock,
        completed: CheckCircle,
        cancelled: X
    };

    // Available skills (same as services)
    const availableSkills = [
        "React", "JavaScript", "Python", "Node.js", "CSS", "HTML", "PHP", "WordPress",
        "Copywriting", "Content Writing", "SEO", "Social Media", "Graphic Design",
        "UI/UX Design", "Logo Design", "Photoshop", "Figma", "Vue.js", "Angular",
        "Django", "Flask", "MongoDB", "PostgreSQL", "MySQL", "AWS", "Docker"
    ];

    // Fetch proposals from backend
    const fetchProposals = async () => {
        try {
            const response = await api.get('/api/v1/gigs/proposals/');
            setProposals(response.data.results || response.data || []);
        } catch (err) {
            console.error('Error fetching proposals:', err);
            setError('Failed to load proposals');
        }
    };

    // Fetch categories from backend
    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/v1/core/categories/');
            setCategories(response.data.results || response.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            // Fallback to static list on failure
            setCategories([
                { id: 1, name: "Web Development" },
                { id: 2, name: "Mobile Development" },
                { id: 3, name: "Writing & Translation" },
                { id: 4, name: "Design & Creative" },
                { id: 5, name: "Digital Marketing" },
                { id: 6, name: "Programming & Tech" },
                { id: 7, name: "Business" },
                { id: 8, name: "Lifestyle" },
                { id: 9, name: "Data Science & AI" },
                { id: 10, name: "Video & Animation" },
                { id: 11, name: "Music & Audio" },
                { id: 12, name: "Finance & Accounting" },
                { id: 13, name: "Engineering & Architecture" },
                { id: 14, name: "Education & Training" },
                { id: 15, name: "Legal" }
            ]);
        }
    };

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProposals(), fetchCategories()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleCreateNew = () => {
        setEditingProposal(null);
        setFormData({
            title: '',
            description: '',
            category_id: '',
            skills_input: [],
            budget_min: '',
            budget_max: '',
            timeline_days: '',
            project_scope: '',
            status: 'open',
            is_urgent: false,
            is_active: true
        });
        setShowModal(true);
    };

    const handleEdit = (proposal) => {
        setEditingProposal(proposal);
        setFormData({
            title: proposal.title || '',
            description: proposal.description || '',
            category_id: proposal.category?.id || '',
            skills_input: proposal.skills_output?.map(skill => ({ name: skill.name })) || [],
            budget_min: proposal.budget_min?.toString() || '',
            budget_max: proposal.budget_max?.toString() || '',
            timeline_days: proposal.timeline_days?.toString() || '',
            project_scope: proposal.project_scope || '',
            status: proposal.status || 'open',
            is_urgent: proposal.is_urgent ?? false,
            is_active: proposal.is_active ?? true
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        // 1. Validate input fields
        if (!formData.title || !formData.description || !formData.category_id ||
            !formData.budget_min || !formData.budget_max || !formData.timeline_days) {
            setError('Please fill in all required fields');
            return;
        }

        setSubmitLoading(true);
        setError(null);

        try {
            const submitData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category_id: parseInt(formData.category_id),
                budget_min: parseFloat(formData.budget_min),
                budget_max: parseFloat(formData.budget_max),
                timeline_days: parseInt(formData.timeline_days),
                project_scope: formData.project_scope || null,
                is_urgent: formData.is_urgent,
                is_active: formData.is_active,
                skills_input: formData.skills_input,
            };

            if (editingProposal) {
                submitData.status = formData.status;
            }

            const endpoint = editingProposal
                ? `/api/v1/gigs/proposals/${editingProposal.id}/`
                : `/api/v1/gigs/proposals/`;

            const method = editingProposal ? 'patch' : 'post';

            const response = await api[method](endpoint, submitData);

            const responseData = response.data;

            if (editingProposal) {
                setProposals(proposals.map(proposal =>
                    proposal.id === editingProposal.id ? responseData : proposal
                ));
            } else {
                setProposals([responseData, ...proposals]);
            }

            setShowModal(false);
            setError(null);

        } catch (err) {
            console.error('Error submitting proposal:', err);
            const message =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                'Failed to save proposal. Please try again.';
            setError(message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleSkillToggle = (skillName) => {
        setFormData(prev => {
            const skillExists = prev.skills_input.some(skill => skill.name === skillName);

            if (skillExists) {
                return {
                    ...prev,
                    skills_input: prev.skills_input.filter(skill => skill.name !== skillName)
                };
            } else {
                return {
                    ...prev,
                    skills_input: [...prev.skills_input, { name: skillName }]
                };
            }
        });
    };

    const getStatusIcon = (status) => {
        const IconComponent = statusIcons[status];
        return <IconComponent size={14} />;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-white" size={32} />
                <span className="ml-3 text-white">Loading proposals...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg">
                    {error}
                    <button
                        onClick={() => {
                            setError(null);
                            const loadData = async () => {
                                setLoading(true);
                                await Promise.all([fetchProposals(), fetchCategories()]);
                                setLoading(false);
                            };
                            loadData();
                        }}
                        className="ml-2 underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">My Projects</h3>
                <button
                    onClick={handleCreateNew}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>New Project</span>
                </button>
            </div>

            {proposals.length === 0 ? (
                <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
                    <Briefcase size={48} className="text-white/30 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">No Projects Yet</h4>
                    <p className="text-white/70 mb-6">Post your first project to find talented freelancers</p>
                    <button
                        onClick={handleCreateNew}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                    >
                        Post Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {proposals.map((proposal) => (
                        <div key={proposal.id} className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-all duration-200 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm shadow-lg border ${statusColors[proposal.status]}`}>
                                            <span className="flex items-center space-x-1">
                                                {getStatusIcon(proposal.status)}
                                                <span className="ml-1">{proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1).replace('_', ' ')}</span>
                                            </span>
                                        </span>
                                        {proposal.is_urgent && (
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-600/80 text-white border border-red-400/50 flex items-center backdrop-blur-sm shadow-lg">
                                                <AlertCircle size={12} className="mr-1" />
                                                Urgent
                                            </span>
                                        )}
                                    </div>
                                    <h5 className="text-white font-semibold text-lg mb-2 line-clamp-1">
                                        {proposal.title}
                                    </h5>
                                </div>
                                <button
                                    onClick={() => handleEdit(proposal)}
                                    className="opacity-0 group-hover:opacity-100 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>

                            <p className="text-white/70 text-sm mb-4 line-clamp-3">
                                {proposal.description}
                            </p>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/60">Category:</span>
                                    <span className="text-white">{proposal.category?.name || 'Uncategorized'}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/60 flex items-center">
                                        <DollarSign size={14} className="mr-1" />
                                        Budget:
                                    </span>
                                    <span className="text-green-400 font-semibold">
                                        ${proposal.budget_min} - ${proposal.budget_max}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/60 flex items-center">
                                        <Clock size={14} className="mr-1" />
                                        Timeline:
                                    </span>
                                    <span className="text-white">{proposal.timeline_days} days</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/60">Scope:</span>
                                    <span className="text-white capitalize">{proposal.project_scope?.replace('_', '-')}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/60 flex items-center">
                                        <Users size={14} className="mr-1" />
                                        Applications:
                                    </span>
                                    <span className="text-cyan-400 font-semibold">
                                        {Array.isArray(proposal.applied_freelancers) ? proposal.applied_freelancers.length : 0}
                                    </span>
                                </div>

                                {proposal.selected_freelancer && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/60">Assigned to:</span>
                                        <span className="text-purple-400 font-semibold">{proposal.selected_freelancer}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                                {proposal.skills_output?.slice(0, 3).map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-400/20"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                                {proposal.skills_output?.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-400/20">
                                        +{proposal.skills_output.length - 3} more
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-white/50 text-xs">
                                    Posted: {formatDate(proposal.created_at)}
                                </span>
                                <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                    <Eye size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Proposal Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex items-center justify-between">
                            <h4 className="text-xl font-bold text-white">
                                {editingProposal ? 'Edit Project' : 'Post New Project'}
                            </h4>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {error && (
                                <div className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-white font-medium mb-2">Project Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                                    placeholder="I need a professional website for my business..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-2">Project Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 h-32 resize-none"
                                    placeholder="Describe your project requirements in detail..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-white font-medium mb-2">Category</label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Project Scope</label>
                                    <select
                                        value={formData.project_scope}
                                        onChange={(e) => setFormData({ ...formData, project_scope: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="">Select Scope</option>
                                        {projectScopeOptions.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {editingProposal && (
                                    <div>
                                        <label className="block text-white font-medium mb-2">Project Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-white font-medium mb-2">Min Budget ($)</label>
                                    <input
                                        type="number"
                                        value={formData.budget_min}
                                        onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                                        placeholder="100"
                                        min="10"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Max Budget ($)</label>
                                    <input
                                        type="number"
                                        value={formData.budget_max}
                                        onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                                        placeholder="500"
                                        min="10"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Timeline (days)</label>
                                    <input
                                        type="number"
                                        value={formData.timeline_days}
                                        onChange={(e) => setFormData({ ...formData, timeline_days: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                                        placeholder="14"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-3">Required Skills</label>
                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                    {availableSkills.map((skillName) => (
                                        <button
                                            key={skillName}
                                            type="button"
                                            onClick={() => handleSkillToggle(skillName)}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${formData.skills_input.some(skill => skill.name === skillName)
                                                ? 'bg-cyan-500 text-white'
                                                : 'bg-black/20 border border-white/10 text-white/70 hover:bg-black/30'
                                                }`}
                                        >
                                            {skillName}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="is_urgent"
                                        checked={formData.is_urgent}
                                        onChange={(e) => setFormData({ ...formData, is_urgent: e.target.checked })}
                                        className="w-4 h-4 text-red-600 bg-black/20 border-white/10 rounded focus:ring-red-500"
                                    />
                                    <label htmlFor="is_urgent" className="text-white font-medium flex items-center">
                                        <AlertCircle size={16} className="mr-1 text-red-400" />
                                        Urgent Project
                                    </label>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4 text-cyan-600 bg-black/20 border-white/10 rounded focus:ring-cyan-500"
                                    />
                                    <label htmlFor="is_active" className="text-white font-medium">
                                        Active Project
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={submitLoading}
                                    className="px-6 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitLoading}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {submitLoading && <Loader className="animate-spin" size={16} />}
                                    <span>{editingProposal ? 'Update Project' : 'Post Project'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalsSection;













// const ProposalsSection = () => {
//     const [projects, setProjects] = useState([
//         {
//             id: 1,
//             title: "E-commerce Website Development",
//             description: "Looking for an experienced developer to build a modern e-commerce website with payment integration, inventory management, and admin dashboard. Must have experience with React and Node.js.",
//             category: "Web Development",
//             required_skills: ["React", "Node.js", "JavaScript", "MongoDB", "Payment Integration"],
//             budget_min: 800.00,
//             budget_max: 1200.00,
//             timeline_days: 30,
//             project_scope: "one_time",
//             is_urgent: true,
//             applied_freelancers: 12,
//             selected_freelancer: null,
//             status: "open",
//             is_active: true,
//             created_at: "2024-01-20"
//         },
//         {
//             id: 2,
//             title: "Content Writing for Tech Blog",
//             description: "Need a skilled content writer to create engaging articles for our technology blog. Topics include AI, web development, and digital marketing. Looking for someone who can deliver 4-5 articles per week.",
//             category: "Writing & Translation",
//             required_skills: ["Content Writing", "SEO", "Tech Writing", "Research"],
//             budget_min: 200.00,
//             budget_max: 400.00,
//             timeline_days: 60,
//             project_scope: "ongoing",
//             is_urgent: false,
//             applied_freelancers: 8,
//             selected_freelancer: "John Doe",
//             status: "in_progress",
//             is_active: true,
//             created_at: "2024-01-15"
//         }
//     ]);

//     const [showModal, setShowModal] = useState(false);
//     const [editingProject, setEditingProject] = useState(null);
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         category: '',
//         required_skills: [],
//         budget_min: '',
//         budget_max: '',
//         timeline_days: '',
//         project_scope: '',
//         status: 'open',
//         is_urgent: false,
//         is_active: true
//     });

//     const categories = [
//         "Web Development",
//         "Mobile Development",
//         "Writing & Translation",
//         "Design & Creative",
//         "Digital Marketing",
//         "Programming & Tech",
//         "Business",
//         "Data Science",
//         "Video & Animation"
//     ];

//     const availableSkills = [
//         "React", "JavaScript", "Python", "Node.js", "CSS", "HTML", "PHP", "WordPress",
//         "Content Writing", "Copywriting", "SEO", "Social Media", "Graphic Design",
//         "UI/UX Design", "Logo Design", "Photoshop", "Figma", "MongoDB", "MySQL",
//         "Payment Integration", "E-commerce", "Mobile App", "Flutter", "Swift"
//     ];

//     const projectScopeOptions = [
//         { value: "one_time", label: "One-time" },
//         { value: "ongoing", label: "Ongoing" }
//     ];

//     const statusOptions = [
//         { value: "open", label: "Open" },
//         { value: "in_progress", label: "In Progress" },
//         { value: "completed", label: "Completed" },
//         { value: "cancelled", label: "Cancelled" }
//     ];

//     const statusColors = {
//         open: "bg-blue-500/20 text-blue-400 border-blue-400/20",
//         in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-400/20",
//         completed: "bg-green-500/20 text-green-400 border-green-400/20",
//         cancelled: "bg-red-500/20 text-red-400 border-red-400/20"
//     };

//     const statusIcons = {
//         open: Eye,
//         in_progress: Clock,
//         completed: CheckCircle,
//         cancelled: X
//     };

//     const handleCreateNew = () => {
//         setEditingProject(null);
//         setFormData({
//             title: '',
//             description: '',
//             category: '',
//             required_skills: [],
//             budget_min: '',
//             budget_max: '',
//             timeline_days: '',
//             project_scope: '',
//             status: 'open',
//             is_urgent: false,
//             is_active: true
//         });
//         setShowModal(true);
//     };

//     const handleEdit = (project) => {
//         setEditingProject(project);
//         setFormData({
//             title: project.title,
//             description: project.description,
//             category: project.category,
//             required_skills: project.required_skills,
//             budget_min: project.budget_min.toString(),
//             budget_max: project.budget_max.toString(),
//             timeline_days: project.timeline_days.toString(),
//             project_scope: project.project_scope,
//             status: project.status,
//             is_urgent: project.is_urgent,
//             is_active: project.is_active
//         });
//         setShowModal(true);
//     };

//     const handleSubmit = () => {
//         const projectData = {
//             ...formData,
//             budget_min: parseFloat(formData.budget_min),
//             budget_max: parseFloat(formData.budget_max),
//             timeline_days: parseInt(formData.timeline_days)
//         };

//         if (editingProject) {
//             setProjects(projects.map(project =>
//                 project.id === editingProject.id
//                     ? { ...project, ...projectData }
//                     : project
//             ));
//         } else {
//             const newProject = {
//                 id: Date.now(),
//                 ...projectData,
//                 applied_freelancers: 0,
//                 selected_freelancer: null,
//                 created_at: new Date().toISOString().split('T')[0]
//             };
//             setProjects([...projects, newProject]);
//         }

//         setShowModal(false);
//     };

//     const handleSkillToggle = (skill) => {
//         setFormData(prev => ({
//             ...prev,
//             required_skills: prev.required_skills.includes(skill)
//                 ? prev.required_skills.filter(s => s !== skill)
//                 : [...prev.required_skills, skill]
//         }));
//     };

//     const getStatusIcon = (status) => {
//         const IconComponent = statusIcons[status];
//         return <IconComponent size={14} />;
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h3 className="text-2xl font-bold text-white">My Projects</h3>
//                 <button
//                     onClick={handleCreateNew}
//                     className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
//                 >
//                     <Plus size={18} />
//                     <span>New Project</span>
//                 </button>
//             </div>

//             {projects.length === 0 ? (
//                 <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
//                     <Briefcase size={48} className="text-white/30 mx-auto mb-4" />
//                     <h4 className="text-xl font-semibold text-white mb-2">No Projects Yet</h4>
//                     <p className="text-white/70 mb-6">Post your first project to find talented freelancers</p>
//                     <button
//                         onClick={handleCreateNew}
//                         className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
//                     >
//                         Post Your First Project
//                     </button>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {projects.map((project) => (
//                         <div key={project.id} className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-black/30 transition-all duration-200 group">
//                             <div className="flex items-start justify-between mb-4">
//                                 <div className="flex-1">
//                                     <div className="flex items-center space-x-3 mb-2">
//                                         <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm shadow-lg border ${statusColors[project.status]}`}>
//                                             <span className="flex items-center space-x-1">
//                                                 {getStatusIcon(project.status)}
//                                                 <span className="ml-1">{project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}</span>
//                                             </span>
//                                         </span>
//                                         {project.is_urgent && (
//                                             <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-600/80 text-white border border-red-400/50 flex items-center backdrop-blur-sm shadow-lg">
//                                                 <AlertCircle size={12} className="mr-1" />
//                                                 Urgent
//                                             </span>
//                                         )}
//                                     </div>
//                                     <h5 className="text-white font-semibold text-lg mb-2 line-clamp-1">
//                                         {project.title}
//                                     </h5>
//                                 </div>
//                                 <button
//                                     onClick={() => handleEdit(project)}
//                                     className="opacity-0 group-hover:opacity-100 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200"
//                                 >
//                                     <Edit size={16} />
//                                 </button>
//                             </div>

//                             <p className="text-white/70 text-sm mb-4 line-clamp-3">
//                                 {project.description}
//                             </p>

//                             <div className="space-y-3 mb-4">
//                                 <div className="flex items-center justify-between text-sm">
//                                     <span className="text-white/60">Category:</span>
//                                     <span className="text-white">{project.category}</span>
//                                 </div>

//                                 <div className="flex items-center justify-between text-sm">
//                                     <span className="text-white/60 flex items-center">
//                                         <DollarSign size={14} className="mr-1" />
//                                         Budget:
//                                     </span>
//                                     <span className="text-green-400 font-semibold">
//                                         ${project.budget_min} - ${project.budget_max}
//                                     </span>
//                                 </div>

//                                 <div className="flex items-center justify-between text-sm">
//                                     <span className="text-white/60 flex items-center">
//                                         <Clock size={14} className="mr-1" />
//                                         Timeline:
//                                     </span>
//                                     <span className="text-white">{project.timeline_days} days</span>
//                                 </div>

//                                 <div className="flex items-center justify-between text-sm">
//                                     <span className="text-white/60">Scope:</span>
//                                     <span className="text-white capitalize">{project.project_scope?.replace('_', '-')}</span>
//                                 </div>

//                                 <div className="flex items-center justify-between text-sm">
//                                     <span className="text-white/60 flex items-center">
//                                         <Users size={14} className="mr-1" />
//                                         Applications:
//                                     </span>
//                                     <span className="text-cyan-400 font-semibold">{project.applied_freelancers}</span>
//                                 </div>

//                                 {project.selected_freelancer && (
//                                     <div className="flex items-center justify-between text-sm">
//                                         <span className="text-white/60">Assigned to:</span>
//                                         <span className="text-purple-400 font-semibold">{project.selected_freelancer}</span>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="flex flex-wrap gap-1 mb-4">
//                                 {project.required_skills.slice(0, 3).map((skill) => (
//                                     <span
//                                         key={skill}
//                                         className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-400/20"
//                                     >
//                                         {skill}
//                                     </span>
//                                 ))}
//                                 {project.required_skills.length > 3 && (
//                                     <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-400/20">
//                                         +{project.required_skills.length - 3} more
//                                     </span>
//                                 )}
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <span className="text-white/50 text-xs">
//                                     Posted: {new Date(project.created_at).toLocaleDateString()}
//                                 </span>
//                                 <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
//                                     <Eye size={16} />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Create/Edit Project Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//                     <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//                         <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex items-center justify-between">
//                             <h4 className="text-xl font-bold text-white">
//                                 {editingProject ? 'Edit Project' : 'Post New Project'}
//                             </h4>
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 className="text-white/60 hover:text-white transition-colors"
//                             >
//                                 <X size={24} />
//                             </button>
//                         </div>

//                         <div className="p-6 space-y-6">
//                             <div>
//                                 <label className="block text-white font-medium mb-2">Project Title</label>
//                                 <input
//                                     type="text"
//                                     value={formData.title}
//                                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                                     className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
//                                     placeholder="I need a professional website for my business..."
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-white font-medium mb-2">Project Description</label>
//                                 <textarea
//                                     value={formData.description}
//                                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                                     className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 h-32 resize-none"
//                                     placeholder="Describe your project requirements in detail..."
//                                     required
//                                 />
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 <div>
//                                     <label className="block text-white font-medium mb-2">Category</label>
//                                     <select
//                                         value={formData.category}
//                                         onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                                         className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
//                                         required
//                                     >
//                                         <option value="">Select Category</option>
//                                         {categories.map((category) => (
//                                             <option key={category} value={category}>{category}</option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-white font-medium mb-2">Project Scope</label>
//                                     <select
//                                         value={formData.project_scope}
//                                         onChange={(e) => setFormData({ ...formData, project_scope: e.target.value })}
//                                         className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
//                                         required
//                                     >
//                                         <option value="">Select Scope</option>
//                                         {projectScopeOptions.map((option) => (
//                                             <option key={option.value} value={option.value}>{option.label}</option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-white font-medium mb-2">Project Status</label>
//                                     <select
//                                         value={formData.status}
//                                         onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                                         className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
//                                         required
//                                     >
//                                         {statusOptions.map((option) => (
//                                             <option key={option.value} value={option.value}>{option.label}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 <div>
//                                     <label className="block text-white font-medium mb-2">Min Budget ($)</label>
//                                     <input
//                                         type="number"
//                                         value={formData.budget_min}
//                                         onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
//                                         className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
//                                         placeholder="100"
//                                         min="10"
//                                         step="0.01"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-white font-medium mb-2">Max Budget ($)</label>
//                                     <input
//                                         type="number"
//                                         value={formData.budget_max}
//                                         onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
//                                         className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
//                                         placeholder="500"
//                                         min="10"
//                                         step="0.01"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-white font-medium mb-2">Timeline (days)</label>
//                                     <input
//                                         type="number"
//                                         value={formData.timeline_days}
//                                         onChange={(e) => setFormData({ ...formData, timeline_days: e.target.value })}
//                                         className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
//                                         placeholder="14"
//                                         min="1"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-white font-medium mb-3">Required Skills</label>
//                                 <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
//                                     {availableSkills.map((skill) => (
//                                         <button
//                                             key={skill}
//                                             type="button"
//                                             onClick={() => handleSkillToggle(skill)}
//                                             className={`px-3 py-1 rounded-full text-sm transition-colors ${formData.required_skills.includes(skill)
//                                                     ? 'bg-cyan-500 text-white'
//                                                     : 'bg-black/20 border border-white/10 text-white/70 hover:bg-black/30'
//                                                 }`}
//                                         >
//                                             {skill}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="flex items-center space-x-6">
//                                 <div className="flex items-center space-x-3">
//                                     <input
//                                         type="checkbox"
//                                         id="is_urgent"
//                                         checked={formData.is_urgent}
//                                         onChange={(e) => setFormData({ ...formData, is_urgent: e.target.checked })}
//                                         className="w-4 h-4 text-red-600 bg-black/20 border-white/10 rounded focus:ring-red-500"
//                                     />
//                                     <label htmlFor="is_urgent" className="text-white font-medium flex items-center">
//                                         <AlertCircle size={16} className="mr-1 text-red-400" />
//                                         Urgent Project
//                                     </label>
//                                 </div>

//                                 <div className="flex items-center space-x-3">
//                                     <input
//                                         type="checkbox"
//                                         id="is_active"
//                                         checked={formData.is_active}
//                                         onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
//                                         className="w-4 h-4 text-cyan-600 bg-black/20 border-white/10 rounded focus:ring-cyan-500"
//                                     />
//                                     <label htmlFor="is_active" className="text-white font-medium">
//                                         Active Project
//                                     </label>
//                                 </div>
//                             </div>

//                             <div className="flex items-center justify-end space-x-4 pt-4">
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowModal(false)}
//                                     className="px-6 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={handleSubmit}
//                                     className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
//                                 >
//                                     {editingProject ? 'Update Project' : 'Post Project'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProposalsSection;