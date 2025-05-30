
import React from 'react';
import { useState } from 'react';
import { Building, User, Target, CreditCard } from 'lucide-react';
import Stepper from '../components/clientProfileSetup/Stepper';
import AccountTypeStep from '../components/clientProfileSetup/AccountTypeStep';
import BusinessInfoStep from '../components/clientProfileSetup/BusinessInfoStep';
import ProjectNeedsStep from '../components/clientProfileSetup/ProjectNeedsStep';
import BudgetPaymentStep from '../components/clientProfileSetup/BudgetPaymentStep';
import CompletionStep from '../components/clientProfileSetup/CompletionStep';
import NavigationButtons from '../components/clientProfileSetup/NavigationButtons';

export default function ClientProfileSetup() {
    const [formStep, setFormStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

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
        timezone: '',
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

    const timezones = [
        'UTC-12:00 Baker Island', 'UTC-11:00 American Samoa', 'UTC-10:00 Hawaii',
        'UTC-09:00 Alaska', 'UTC-08:00 Pacific Time', 'UTC-07:00 Mountain Time',
        'UTC-06:00 Central Time', 'UTC-05:00 Eastern Time', 'UTC-04:00 Atlantic Time',
        'UTC-03:00 Argentina', 'UTC-02:00 Mid-Atlantic', 'UTC-01:00 Azores',
        'UTC+00:00 London/Dublin', 'UTC+01:00 Paris/Berlin', 'UTC+02:00 Cairo',
        'UTC+03:00 Moscow', 'UTC+04:00 Dubai', 'UTC+05:00 Pakistan',
        'UTC+05:30 India', 'UTC+06:00 Bangladesh', 'UTC+07:00 Thailand',
        'UTC+08:00 Singapore', 'UTC+09:00 Japan', 'UTC+10:00 Australia',
        'UTC+11:00 Solomon Islands', 'UTC+12:00 New Zealand'
    ];

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
            case 0:
                if (!clientData.accountType) newErrors.accountType = 'Please select account type';
                break;
            case 1:
                if (!clientData.firstName) newErrors.firstName = 'First name is required';
                if (!clientData.lastName) newErrors.lastName = 'Last name is required';
                if (clientData.accountType === 'business' && !clientData.companyName) {
                    newErrors.companyName = 'Company name is required for business accounts';
                }
                if (!clientData.location) newErrors.location = 'Location is required';
                break;
            case 2:
                if (clientData.projectTypes.length === 0) newErrors.projectTypes = 'Select at least one project type';
                if (!clientData.budgetRange) newErrors.budgetRange = 'Budget range is required';
                break;
            case 3:
                if (!clientData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
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
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Client profile setup completed:', clientData);
            setIsCompleted(true);
        } catch (error) {
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
                timezones={timezones}
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
                                industry: '', companySize: '', website: '', location: '', timezone: '',
                                description: '', projectTypes: [], budgetRange: '', projectFrequency: '',
                                preferredCommunication: [], workingHours: '', businessGoals: [],
                                currentChallenges: [], previousExperience: '', expectedTimeline: '',
                                qualityImportance: '', paymentMethod: '', monthlyBudget: '',
                                projectBudget: '', paymentTiming: ''
                            });
                            setProfileImage(null);
                        }}
                        onDashboard={() => console.log('Navigate to dashboard')} />
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