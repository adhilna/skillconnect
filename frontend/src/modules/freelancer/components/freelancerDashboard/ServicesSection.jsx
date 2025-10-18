import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Eye, Clock, RefreshCw, DollarSign, X, Upload, Star, AlertCircle } from 'lucide-react';
import api from '../../../../api/api';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    skills_input: [],
    price: '',
    delivery_time: '',
    revisions: 1,
    image: null,
    is_active: true,
    is_featured: false
  });

  // const API_BASE_URL = "http://localhost:8000/api/v1/gigs/services/";

  const availableSkills = [
    "React", "JavaScript", "Python", "Node.js", "CSS", "HTML", "PHP", "WordPress",
    "Copywriting", "Content Writing", "SEO", "Social Media", "Graphic Design",
    "UI/UX Design", "Logo Design", "Photoshop", "Figma", "Vue.js", "Angular",
    "Django", "Flask", "MongoDB", "PostgreSQL", "MySQL", "AWS", "Docker"
  ];

  // Fetch services from backend
  const fetchServices = async () => {
    try {
      const response = await api.get('/api/v1/gigs/services/');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setServices(data.results || data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
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
      await Promise.all([fetchServices(), fetchCategories()]);
      setLoading(false);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateNew = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      category_id: '',
      skills_input: [],
      price: '',
      delivery_time: '',
      revisions: 1,
      image: null,
      is_active: true,
      is_featured: false
    });
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      category_id: service.category?.id || '',
      skills_input: service.skills_output?.map(skill => ({ name: skill.name })) || [],
      price: service.price?.toString() || '',
      delivery_time: service.delivery_time?.toString() || '',
      revisions: service.revisions || 1,
      image: null, // Reset image field for editing
      is_active: service.is_active ?? true,
      is_featured: service.is_featured ?? false
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category_id || !formData.price || !formData.delivery_time) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitLoading(true);
    setError(null);

    try {

      const submitData = new FormData();

      // Add text fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category_id', formData.category_id);
      submitData.append('price', parseFloat(formData.price));
      submitData.append('delivery_time', parseInt(formData.delivery_time));
      submitData.append('revisions', parseInt(formData.revisions));
      submitData.append('is_active', formData.is_active);
      submitData.append('is_featured', formData.is_featured);
      submitData.append('skills_input', JSON.stringify(formData.skills_input));


      // Add image if present
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const endpoint = editingService
        ? `/api/v1/gigs/services/${editingService.id}/`
        : `/api/v1/gigs/services/`;

      const method = editingService ? 'PATCH' : 'POST';

      const response = await api[method](endpoint, submitData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (editingService) {
        // Update existing service in state
        setServices(services.map(service =>
          service.id === editingService.id ? responseData : service
        ));
      } else {
        // Add new service to state
        setServices([responseData, ...services]);
      }

      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error submitting service:', err);
      setError(err.message || 'Failed to save service');
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

  // const getCategoryName = (categoryId) => {
  //   const category = categories.find(cat => cat.id === categoryId);
  //   return category ? category.name : 'Unknown Category';
  // };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">My Services</h3>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">My Services</h3>
        <button
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Create New Service</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {services.length === 0 ? (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
          <Briefcase size={48} className="text-white/30 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-white mb-2">No Services Yet</h4>
          <p className="text-white/70 mb-6">Create your first service to start earning</p>
          <button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Create Your First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:bg-black/30 transition-all duration-200 group">
              <div className="relative">
                <img
                  src={service.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(service)}
                    className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                </div>
                <div className="absolute top-3 left-3 flex space-x-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${service.is_active
                    ? 'bg-green-600/80 text-white border border-green-400/50 shadow-lg'
                    : 'bg-red-600/80 text-white border border-red-400/50 shadow-lg'
                    }`}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {service.is_featured && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/90 text-black border border-yellow-300/70 flex items-center backdrop-blur-sm shadow-lg">
                      <Star size={12} className="mr-1" />
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h5 className="text-white font-semibold text-lg mb-3 line-clamp-2">
                  {service.title}
                </h5>

                <p className="text-white/70 text-sm mb-4 line-clamp-3">
                  {service.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Category:</span>
                    <span className="text-white">{service.category?.name || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60 flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      Price:
                    </span>
                    <span className="text-green-400 font-semibold">${service.price}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60 flex items-center">
                      <Clock size={14} className="mr-1" />
                      Delivery:
                    </span>
                    <span className="text-white">{service.delivery_time} days</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60 flex items-center">
                      <RefreshCw size={14} className="mr-1" />
                      Revisions:
                    </span>
                    <span className="text-white">{service.revisions}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {service.skills_output?.slice(0, 3).map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-400/20"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {service.skills_output?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-400/20">
                      +{service.skills_output.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">
                    Created: {new Date(service.created_at).toLocaleDateString()}
                  </span>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex items-center justify-between">
              <h4 className="text-xl font-bold text-white">
                {editingService ? 'Edit Service' : 'Create New Service'}
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
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-white font-medium mb-2">Service Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                  placeholder="I will create a professional website..."
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 h-32 resize-none"
                  placeholder="Describe your service in detail..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Price ($) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                    placeholder="50.00"
                    min="5"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Delivery Time (days) *</label>
                  <input
                    type="number"
                    value={formData.delivery_time}
                    onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                    placeholder="7"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Revisions</label>
                  <input
                    type="number"
                    value={formData.revisions}
                    onChange={(e) => setFormData({ ...formData, revisions: parseInt(e.target.value) || 1 })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
                    placeholder="2"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Service Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 file:bg-purple-500 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-3">Skills</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableSkills.map((skill) => {
                    const isSelected = formData.skills_input.some(s => s.name === skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${isSelected
                          ? 'bg-purple-500 text-white'
                          : 'bg-black/20 border border-white/10 text-white/70 hover:bg-black/30'
                          }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-purple-600 bg-black/20 border-white/10 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="is_active" className="text-white font-medium">
                    Active Service
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-yellow-600 bg-black/20 border-white/10 rounded focus:ring-yellow-500"
                  />
                  <label htmlFor="is_featured" className="text-white font-medium flex items-center">
                    <Star size={16} className="mr-1 text-yellow-400" />
                    Featured Service
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {submitLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>
                    {submitLoading
                      ? (editingService ? 'Updating...' : 'Creating...')
                      : (editingService ? 'Update Service' : 'Create Service')
                    }
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesSection;