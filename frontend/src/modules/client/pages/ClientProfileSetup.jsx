import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Building, User, Target, CreditCard } from 'lucide-react';
import Stepper from '../components/clientProfileSetup/Stepper';
import AccountTypeStep from '../components/clientProfileSetup/AccountTypeStep';
import BusinessInfoStep from '../components/clientProfileSetup/BusinessInfoStep';
import ProjectNeedsStep from '../components/clientProfileSetup/ProjectNeedsStep';
import BudgetPaymentStep from '../components/clientProfileSetup/BudgetPaymentStep';
import CompletionStep from '../components/clientProfileSetup/CompletionStep';
import NavigationButtons from '../components/clientProfileSetup/NavigationButtons';

function mapClientFrontendToBackend(frontendData) {
    return {
        account_type: frontendData.accountType || '',
        first_name: frontendData.firstName || '',
        last_name: frontendData.lastName || '',
        company_name: frontendData.companyName || '',
        profile_picture: frontendData.profileImageFile || null,
        about: frontendData.about || '',
        location: frontendData.location || '',
        industry: frontendData.industry || '',
        company_size: frontendData.companySize || '',
        website: frontendData.website || '',
        project_types: frontendData.projectTypes || [],
        budget_range: frontendData.budgetRange || '',
        project_frequency: frontendData.projectFrequency || '',
        preferred_communications: frontendData.preferredComms || [],
        working_hours: frontendData.workingHours || '',
        business_goals: frontendData.businessGoals || [],
        current_challenges: frontendData.currentChallenges || [],
        previous_experiences: frontendData.previousExperiences || '',
        expected_timeline: frontendData.expectedTimeline || '',
        quality_importance: frontendData.qualityImportance || '',
        payment_method: frontendData.paymentMethod || '',
        monthly_budget: frontendData.monthlyBudget || 0,
        project_budget: frontendData.projectBudget || 0,
        payment_timing: frontendData.paymentTiming || '',
        verification: {
            email_verified: frontendData.emailVerified || false,
            phone_verified: frontendData.phoneVerified || false,
            id_verified: frontendData.idVerified || false,
            video_verified: frontendData.videoVerified || false,
        }
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
        firstName: '',
        lastName: '',
        companyName: '',
        accountType: '', // 'personal' or 'business'
        industry: '',
        companySize: '',
        website: '',
        location: '',
        description: '',

        // Project Preferences
        projectTypes: [],
        budgetRange: '',
        projectFrequency: '',
        preferredCommunication: [],
        workingHours: '',

        // Requirements & Goals
        businessGoals: [],
        currentChallenges: [],
        previousExperience: '',
        expectedTimeline: '',
        qualityImportance: '',

        // Payment & Budget
        paymentMethod: '',
        monthlyBudget: '',
        projectBudget: '',
        paymentTiming: ''
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

    // const timezones = [
    //     'UTC-12:00 Baker Island', 'UTC-11:00 American Samoa', 'UTC-10:00 Hawaii',
    //     'UTC-09:00 Alaska', 'UTC-08:00 Pacific Time', 'UTC-07:00 Mountain Time',
    //     'UTC-06:00 Central Time', 'UTC-05:00 Eastern Time', 'UTC-04:00 Atlantic Time',
    //     'UTC-03:00 Argentina', 'UTC-02:00 Mid-Atlantic', 'UTC-01:00 Azores',
    //     'UTC+00:00 London/Dublin', 'UTC+01:00 Paris/Berlin', 'UTC+02:00 Cairo',
    //     'UTC+03:00 Moscow', 'UTC+04:00 Dubai', 'UTC+05:00 Pakistan',
    //     'UTC+05:30 India', 'UTC+06:00 Bangladesh', 'UTC+07:00 Thailand',
    //     'UTC+08:00 Singapore', 'UTC+09:00 Japan', 'UTC+10:00 Australia',
    //     'UTC+11:00 Solomon Islands', 'UTC+12:00 New Zealand'
    // ];

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setClientData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayInput = (field, value) => {
        setClientData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    // const removeArrayItem = (field, index) => {
    //     setClientData(prev => ({
    //         ...prev,
    //         [field]: prev[field].filter((_, i) => i !== index)
    //     }));
    // };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => setFormStep(prev => prev + 1);
    const prevStep = () => setFormStep(prev => prev - 1);

    const validateStep = () => {
        const newErrors = {};

        switch (formStep) {
            case 0: // Account Type
                if (!clientData.accountType) newErrors.accountType = 'Please select account type';
                else if (!['personal', 'business'].includes(clientData.accountType)) {
                    newErrors.accountType = 'Account type must be personal or business';
                }
                break;

            case 1: // Personal/Business Info
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
                // Optional: Add website validation
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

            case 2: // Project Info
                if (clientData.projectTypes.length === 0) newErrors.projectTypes = 'Select at least one project type';
                if (!clientData.budgetRange) newErrors.budgetRange = 'Budget range is required';
                // Optional: Validate budgetRange is a string (though likely always is)
                if (clientData.budgetRange && typeof clientData.budgetRange !== 'string') {
                    newErrors.budgetRange = 'Budget range must be a string';
                }
                if (!clientData.projectFrequency) newErrors.projectFrequency = 'Project frequency is required';
                else if (!['one-time', 'weekly', 'monthly', 'quarterly', 'annually'].includes(clientData.projectFrequency)) {
                    newErrors.projectFrequency = 'Project frequency must be one of: one-time, weekly, monthly, quarterly, annually';
                }
                if (clientData.workingHours && !clientData.workingHours.toString().match(/^\d+$/)) {
                    newErrors.workingHours = 'Working hours must be a number';
                }
                break;

            case 3: // Payment Info
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
        setErrors(null);
        setFieldErrors({});

        try {
            // 1. Map frontend data to backend format
            const backendData = mapClientFrontendToBackend(clientData);

            // 2. Prepare FormData
            const formData = new FormData();
            formData.append('account_type', backendData.account_type);
            formData.append('first_name', backendData.first_name);
            formData.append('last_name', backendData.last_name);
            formData.append('company_name', backendData.company_name);
            formData.append('company_description', backendData.company_description);
            formData.append('location', backendData.location);
            formData.append('industry', backendData.industry);
            formData.append('company_size', backendData.company_size);
            formData.append('website', backendData.website);
            formData.append('project_types', JSON.stringify(backendData.project_types));
            formData.append('budget_range', backendData.budget_range);
            formData.append('project_frequency', backendData.project_frequency);
            formData.append('preferred_communications', JSON.stringify(backendData.preferred_communications));
            formData.append('working_hours', backendData.working_hours);
            formData.append('business_goals', JSON.stringify(backendData.business_goals));
            formData.append('current_challenges', JSON.stringify(backendData.current_challenges));
            formData.append('previous_experiences', backendData.previous_experiences);
            formData.append('expected_timeline', backendData.expected_timeline);
            formData.append('quality_importance', backendData.quality_importance);
            formData.append('payment_method', backendData.payment_method);
            formData.append('monthly_budget', backendData.monthly_budget);
            formData.append('project_budget', backendData.project_budget);
            formData.append('payment_timing', backendData.payment_timing);
            formData.append('email_verified', backendData.verification.email_verified);
            formData.append('phone_verified', backendData.verification.phone_verified);
            formData.append('id_verified', backendData.verification.id_verified);
            formData.append('video_verified', backendData.verification.video_verified);

            if (clientData.profileImageFile) {
                formData.append('profile_picture', clientData.profileImageFile);
            }

            // 4. Add authentication token
            const authtoken = localStorage.getItem('access');

            await axios.post('http://localhost:8000/api/v1/profiles/client/profile-setup/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(authtoken && { Authorization: `Bearer ${authtoken}` }),
                },
            });

            setErrors(null);
            setFieldErrors({});
            setIsCompleted(true);
        } catch (error) {
            if (error.response && error.response.data) {
                setFieldErrors(error.response.data);
                setErrors('Failed to submit profile. Please check the errors and try again.');
            }
            console.error('Error:', error);
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
                clientData={clientData}
                errors={errors}
                handleInputChange={handleInputChange} />;
            default: return null;
        }
    };

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    <CompletionStep
                        clientData={clientData}
                        onRestart={() => {
                            setIsCompleted(false);
                            setFormStep(0);
                            setClientData({
                                firstName: '', lastName: '', companyName: '', accountType: '',
                                industry: '', companySize: '', website: '', location: '',
                                description: '', projectTypes: [], budgetRange: '', projectFrequency: '',
                                preferredCommunication: [], workingHours: '', businessGoals: [],
                                currentChallenges: [], previousExperience: '', expectedTimeline: '',
                                qualityImportance: '', paymentMethod: '', monthlyBudget: '',
                                projectBudget: '', paymentTiming: ''
                            });
                            setProfileImage(null);
                        }}
                        onDashboard={() => navigate('/dashboard')} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
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