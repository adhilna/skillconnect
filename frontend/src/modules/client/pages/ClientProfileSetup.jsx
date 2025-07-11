import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Building, User, Target, CreditCard } from 'lucide-react';
import Stepper from '../components/clientProfileSetup/Stepper';
import AccountTypeStep from '../components/clientProfileSetup/AccountTypeStep';
import BusinessInfoStep from '../components/clientProfileSetup/BusinessInfoStep';
import ProjectNeedsStep from '../components/clientProfileSetup/ProjectNeedsStep';
import BudgetPaymentStep from '../components/clientProfileSetup/BudgetPaymentStep';
import CompletionStep from '../components/clientProfileSetup/CompletionStep';
import NavigationButtons from '../components/clientProfileSetup/NavigationButtons';

// Utility function to map frontend state to backend field names
function mapClientFrontendToBackend(frontendData) {
    return {
        account_type: frontendData.accountType || '',
        first_name: frontendData.firstName || '',
        last_name: frontendData.lastName || '',
        company_name: frontendData.companyName || '',
        profile_picture: frontendData.profileImageFile || null,
        company_description: frontendData.companyDescription || '',
        country: frontendData.country || '',
        location: frontendData.location || '',
        industry: frontendData.industry || '',
        company_size: frontendData.companySize || '',
        website: frontendData.website || '',
        project_types: frontendData.projectTypes || [],
        budget_range: frontendData.budgetRange || '',
        project_frequency: frontendData.projectFrequency || '',
        preferred_communications: frontendData.preferredCommunication || [],
        working_hours: frontendData.workingHours || '',
        business_goals: frontendData.businessGoals || [],
        current_challenges: frontendData.currentChallenges || [],
        previous_experiences: frontendData.previousExperiences || '',
        expected_timeline: frontendData.expectedTimeline || '',
        quality_importance: frontendData.qualityImportance || '',
        payment_method: frontendData.paymentMethod || '',
        monthly_budget: frontendData.monthlyBudget || null,
        project_budget: frontendData.projectBudget || null,
        payment_timing: frontendData.paymentTiming || '',
    };
}

export default function ClientProfileSetup() {
    const [formStep, setFormStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const [clientData, setClientData] = useState({
        // Personal/Business Info
        accountType: '',
        firstName: '',
        lastName: '',
        companyName: '',
        profileImageFile: null,
        companyDescription: '',
        country: '',
        location: '',
        industry: '',
        companySize: '',
        website: '',

        // Project Preferences
        projectTypes: [],
        budgetRange: '',
        projectFrequency: '',
        preferredCommunication: [],
        workingHours: '',
        businessGoals: [],
        currentChallenges: [],
        previousExperiences: '',

        // Payment & Budget
        paymentMethod: '',
        monthlyBudget: '',
        projectBudget: '',
        paymentTiming: '',
        expectedTimeline: '',
        qualityImportance: '',
    });

    const steps = [
        { title: 'Account Type', icon: User },
        { title: 'Business Info', icon: Building },
        { title: 'Project Needs', icon: Target },
        { title: 'Budget & Payment', icon: CreditCard }
    ];

    const industries = [
        'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Real Estate',
        'Marketing & Advertising', 'Manufacturing', 'Food & Beverage', 'Fashion',
        'Travel & Tourism', 'Non-profit', 'Entertainment', 'Consulting', 'Other'
    ];

    const companySizes = [
        'Just me (1)', 'Small team (2-10)', 'Growing business (11-50)',
        'Medium company (51-200)', 'Large enterprise (200+)'
    ];

    const projectTypes = [
        'Web Development', 'Mobile App Development', 'UI/UX Design', 'Graphic Design',
        'Content Writing', 'Digital Marketing', 'SEO', 'Social Media Management',
        'Video Production', 'Photography', 'Translation', 'Data Entry',
        'Virtual Assistant', 'Consulting', 'Research', 'Other'
    ];

    const budgetRanges = [
        'Under $500', '$500 - $1,000', '$1,000 - $5,000',
        '$5,000 - $10,000', '$10,000 - $25,000', '$25,000+'
    ];

    const businessGoals = [
        'Increase online presence', 'Launch new product/service', 'Improve efficiency',
        'Scale business operations', 'Enter new markets', 'Reduce costs',
        'Improve customer experience', 'Digital transformation', 'Brand development'
    ];

    const challenges = [
        'Limited technical expertise', 'Tight deadlines', 'Budget constraints',
        'Finding reliable freelancers', 'Communication barriers', 'Quality control',
        'Project management', 'Time zone differences', 'Scope creep'
    ];

    const communicationMethods = [
        'Email', 'Slack', 'WhatsApp', 'Zoom', 'Skype', 'Microsoft Teams', 'Phone calls'
    ];

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setClientData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayInput = (field, value) => {
        setClientData(prev => {
            const arr = prev[field] || [];
            return {
                ...prev,
                [field]: arr.includes(value)
                    ? arr.filter(item => item !== value)
                    : [...arr, value]
            };
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setClientData(prev => ({ ...prev, profileImageFile: file }));
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => setFormStep(prev => prev + 1);
    const prevStep = () => setFormStep(prev => prev - 1);

    const validateStep = () => {
        const newErrors = {};

        switch (formStep) {
            case 0:
                if (!clientData.accountType) newErrors.accountType = 'Please select account type';
                else if (!['personal', 'business'].includes(clientData.accountType)) {
                    newErrors.accountType = 'Account type must be personal or business';
                }
                break;
            case 1:
                if (!clientData.firstName) newErrors.firstName = 'First name is required';
                else if (!/^[a-zA-Z]+$/.test(clientData.firstName)) {
                    newErrors.firstName = 'First name must contain only letters';
                }
                if (!clientData.lastName) newErrors.lastName = 'Last name is required';
                else if (!/^[a-zA-Z]+$/.test(clientData.lastName)) {
                    newErrors.lastName = 'Last name must contain only letters';
                }
                if (clientData.accountType === 'business' && !clientData.companyName) {
                    newErrors.companyName = 'Company name is required for business accounts';
                }
                if (!clientData.location) newErrors.location = 'Location is required';
                if (clientData.website && clientData.website.trim() !== '' && !clientData.website.startsWith('http://') && !clientData.website.startsWith('https://')) {
                    newErrors.website = 'Website must start with http:// or https://';
                }
                if (clientData.industry && !industries.includes(clientData.industry)) {
                    newErrors.industry = `Industry must be one of: ${industries.join(', ')}`;
                }
                if (clientData.companySize && !companySizes.includes(clientData.companySize)) {
                    newErrors.companySize = `Company size must be one of: ${companySizes.join(', ')}`;
                }
                break;
            case 2:
                if (!clientData.projectTypes || clientData.projectTypes.length === 0)
                    newErrors.projectTypes = 'Please select at least one project type.';
                if (!clientData.budgetRange)
                    newErrors.budgetRange = 'Budget range is required.';
                if (!clientData.projectFrequency)
                    newErrors.projectFrequency = 'Project frequency is required.';
                if (!clientData.preferredCommunication || clientData.preferredCommunication.length === 0)
                    newErrors.preferredCommunication = 'Select at least one communication method.';
                if (!clientData.workingHours)
                    newErrors.workingHours = 'Working hours preference is required.';
                break;
            case 3:
                if (!clientData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
                else if (!['credit-card', 'debit-card', 'paypal', 'bank-transfer', 'stripe', ''].includes(clientData.paymentMethod)) {
                    newErrors.paymentMethod = 'Payment method must be one of: credit-card, debit-card, paypal, bank-transfer, stripe';
                }
                if (clientData.monthlyBudget !== undefined && clientData.monthlyBudget !== null && clientData.monthlyBudget < 0) {
                    newErrors.monthlyBudget = 'Monthly budget must be positive';
                }
                if (clientData.projectBudget !== undefined && clientData.projectBudget !== null && clientData.projectBudget < 0) {
                    newErrors.projectBudget = 'Project budget must be positive';
                }
                if (!clientData.paymentTiming) newErrors.paymentTiming = 'Payment timing is required';
                else if (!['upfront', 'milestone-based', 'upon-completion', 'monthly'].includes(clientData.paymentTiming)) {
                    newErrors.paymentTiming = 'Payment timing must be one of: upfront, milestone-based, upon-completion, monthly';
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (formStep < steps.length - 1) {
                nextStep();
            } else {
                handleSubmit();
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setFieldErrors({});
        setErrors(null);

        try {
            // 1. Map frontend data to backend format
            const backendData = mapClientFrontendToBackend(clientData);
            const formData = new FormData();

            // 2. Append simple fields
            formData.append('first_name', backendData.first_name);
            formData.append('last_name', backendData.last_name);
            formData.append('account_type', backendData.account_type);
            formData.append('company_name', backendData.company_name || '');
            formData.append('company_description', backendData.company_description || '');
            formData.append('country', backendData.country || '');
            formData.append('location', backendData.location || '');
            formData.append('industry', backendData.industry || '');
            formData.append('company_size', backendData.company_size || '');
            formData.append('website', backendData.website || '');
            formData.append('budget_range', backendData.budget_range || '');
            formData.append('project_frequency', backendData.project_frequency || '');
            formData.append('working_hours', backendData.working_hours || '');
            formData.append('previous_experiences', backendData.previous_experiences || '');
            formData.append('expected_timeline', backendData.expected_timeline || '');
            formData.append('quality_importance', backendData.quality_importance || '');
            formData.append('payment_method', backendData.payment_method || '');
            formData.append('monthly_budget', backendData.monthly_budget || '');
            formData.append('project_budget', backendData.project_budget || '');
            formData.append('payment_timing', backendData.payment_timing || '');

            // 3. Append arrays/multi-selects as JSON strings
            formData.append('project_types', JSON.stringify(backendData.project_types || []));
            formData.append('preferred_communications', JSON.stringify(backendData.preferred_communications || []));
            formData.append('business_goals', JSON.stringify(backendData.business_goals || []));
            formData.append('current_challenges', JSON.stringify(backendData.current_challenges || []));

            // 4. Append profile picture if exists
            if (clientData.profileImageFile && typeof clientData.profileImageFile !== 'string') {
                formData.append('profile_picture', clientData.profileImageFile);
            }

            // 5. Get auth token
            const authtoken = localStorage.getItem('access');
            if (!authtoken) {
                setFieldErrors({ submit: 'User is not authenticated. Please log in.' });
                setLoading(false);
                return;
            }

            // 6. Debug: Log form data
            console.log("backendData:", backendData);
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            // 7. Submit data
            const response = await axios.post(
                `http://localhost:8000/api/v1/profiles/client/profile-setup/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${authtoken}`,
                        // Do NOT set Content-Type for FormData
                    },
                }
            );

            console.log("API response:", response.data);

            // Success handling
            setErrors(null);
            setFieldErrors({});
            setIsCompleted(true);
        } catch (error) {
            const responseData = error.response?.data || {};
            const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
            console.log('response error:', responseData);
            console.log('other errors:', errorMessage);

            setFieldErrors(responseData.errors || responseData);
            setErrors({ submit: `Failed to submit profile. ${errorMessage}` });
        } finally {
            setLoading(false);
        }
    };


    const getCurrentStepComponent = () => {
        switch (formStep) {
            case 0: return <AccountTypeStep
                clientData={clientData}
                setClientData={setClientData}
                errors={errors}
            />;
            case 1: return <BusinessInfoStep
                clientData={clientData}
                errors={errors}
                industries={industries}
                companySizes={companySizes}
                fieldErrors={fieldErrors}
                handleInputChange={handleInputChange}
                handleImageUpload={handleImageUpload}
                profileImage={profileImage} />;
            case 2: return <ProjectNeedsStep
                clientData={clientData}
                errors={errors}
                projectTypes={projectTypes}
                budgetRanges={budgetRanges}
                communicationMethods={communicationMethods}
                businessGoals={businessGoals}
                challenges={challenges}
                handleArrayInput={handleArrayInput}
                handleInputChange={handleInputChange} />;
            case 3: return <BudgetPaymentStep
                clientData={clientData || {}}
                errors={errors || {}}
                handleInputChange={handleInputChange} />;
            default: return null;
        }
    };

    if (isCompleted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="w-full max-w-4xl">
                    <CompletionStep
                        clientData={clientData}
                        onRestart={() => {
                            setIsCompleted(false);
                            setFormStep(0);
                            setClientData({
                                accountType: '',
                                firstName: '',
                                lastName: '',
                                companyName: '',
                                profileImageFile: null,
                                companyDescription: '',
                                country: '',
                                location: '',
                                industry: '',
                                companySize: '',
                                website: '',
                                projectTypes: [],
                                budgetRange: '',
                                projectFrequency: '',
                                preferredCommunication: [],
                                workingHours: '',
                                businessGoals: [],
                                currentChallenges: [],
                                previousExperiences: '',
                                paymentMethod: '',
                                monthlyBudget: '',
                                projectBudget: '',
                                paymentTiming: '',
                                expectedTimeline: '',
                                qualityImportance: '',
                            });
                            setProfileImage(null);
                        }}
                        onDashboard={() => navigate('/client/dashboard')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="w-full max-w-4xl">
                <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-2xl">
                    <Stepper steps={steps} formStep={formStep} />
                    {getCurrentStepComponent()}
                    {!isCompleted && <NavigationButtons
                        formStep={formStep}
                        stepsLength={steps.length}
                        loading={loading}
                        handleNext={handleNext}
                        prevStep={prevStep}
                        isLastStep={formStep === steps.length - 1} />}
                </div>
            </div>
        </div>
    );
}
