
import React from 'react';
import { useState } from 'react';
import { User, Target, Code, Globe, CheckCircle, Shield } from 'lucide-react';
import BasicInfoStep from '../components/freelancerProfileSetup/BasicInfoStep';
import ProfessionalDetailsStep from '../components/freelancerProfileSetup/ProfessionalDetailsStep';
import LanguagesStep from '../components/freelancerProfileSetup/LanguagesStep';
import PortfolioStep from '../components/freelancerProfileSetup/PortfolioStep';
import SocialLinksStep from '../components/freelancerProfileSetup/SocialLinksStep';
import VerificationStep from '../components/freelancerProfileSetup/VerificationStep';
import AvailabilityStep from '../components/freelancerProfileSetup/AvailabilityStep';
import CompletionStep from '../components/freelancerProfileSetup/CompletionStep';
import NavigationButtons from '../components/freelancerProfileSetup/NavigationButtons';
import Stepper from '../components/freelancerProfileSetup/Stepper';

export default function FreelancerProfileSetup() {
    const [formStep, setFormStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);

    const [freelancerData, setFreelancerData] = useState({
        // Basic Information
        fullName: '',
        locationName: '',
        latitude: '',
        longitude: '',
        bio: '',

        // Professional Details
        skills: [],
        experience: [],
        education: [],
        certifications: [],

        // Languages
        languages: [],

        // Portfolio
        portfolio: [],

        // Social Links
        socialLinks: {
            linkedin: '',
            github: '',
            behance: '',
            dribbble: ''
        },

        // Verification
        emailVerified: false,
        phoneVerified: false,
        idVerified: false,
        videoVerified: false,

        // Availability
        isAvailable: true
    });

    const steps = [
        { title: 'Basic Info', icon: User },
        { title: 'Professional', icon: Code },
        { title: 'Languages', icon: Globe },
        { title: 'Portfolio', icon: Target },
        { title: 'Social Links', icon: Globe },
        { title: 'Verification', icon: Shield },
        { title: 'Availability', icon: CheckCircle }
    ];

    const availableSkills = [
        'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'PHP', 'C++', 'Swift',
        'UI/UX Design', 'Graphic Design', 'Photoshop', 'Illustrator', 'Figma',
        'Content Writing', 'Copywriting', 'SEO', 'Digital Marketing', 'Social Media',
        'Video Editing', 'Photography', 'Data Analysis', 'Machine Learning'
    ];

    const languageOptions = [
        'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
        'Chinese (Mandarin)', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch'
    ];

    const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Native'];

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFreelancerData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFreelancerData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleArrayInput = (field, value) => {
        setFreelancerData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    const addExperience = () => {
        setFreelancerData(prev => ({
            ...prev,
            experience: [...prev.experience, { role: '', company: '', duration: '', description: '' }]
        }));
    };

    const updateExperience = (index, field, value) => {
        setFreelancerData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const removeExperience = (index) => {
        setFreelancerData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const addEducation = () => {
        setFreelancerData(prev => ({
            ...prev,
            education: [...prev.education, { degree: '', college: '', year: '' }]
        }));
    };

    const updateEducation = (index, field, value) => {
        setFreelancerData(prev => ({
            ...prev,
            education: prev.education.map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const removeEducation = (index) => {
        setFreelancerData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const addLanguage = () => {
        setFreelancerData(prev => ({
            ...prev,
            languages: [...prev.languages, { name: '', proficiency: '' }]
        }));
    };

    const updateLanguage = (index, field, value) => {
        setFreelancerData(prev => ({
            ...prev,
            languages: prev.languages.map((lang, i) =>
                i === index ? { ...lang, [field]: value } : lang
            )
        }));
    };

    const removeLanguage = (index) => {
        setFreelancerData(prev => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index)
        }));
    };

    const addPortfolioItem = () => {
        setFreelancerData(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, { title: '', description: '', link: '' }]
        }));
    };

    const updatePortfolioItem = (index, field, value) => {
        setFreelancerData(prev => ({
            ...prev,
            portfolio: prev.portfolio.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const removePortfolioItem = (index) => {
        setFreelancerData(prev => ({
            ...prev,
            portfolio: prev.portfolio.filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFreelancerData(prev => ({
                    ...prev,
                    profileImage: e.target?.result
                }));
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
                if (!freelancerData.fullName) newErrors.fullName = 'Full name is required';
                if (!freelancerData.locationName) newErrors.locationName = 'Location is required';
                if (!freelancerData.bio) newErrors.bio = 'Bio is required';
                break;
            case 1:
                if (freelancerData.skills.length === 0) newErrors.skills = 'Select at least one skill';
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
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Freelancer profile setup completed:', freelancerData);
            setIsCompleted(true);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };



    const getCurrentStepComponent = () => {
        switch (formStep) {
            case 0: return <BasicInfoStep
                freelancerData={freelancerData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleImageUpload={handleImageUpload}
            />;
            case 1: return <ProfessionalDetailsStep
                freelancerData={freelancerData}
                errors={errors}
                availableSkills={availableSkills}
                handleArrayInput={handleArrayInput}
                addExperience={addExperience}
                updateExperience={updateExperience}
                removeExperience={removeExperience}
                addEducation={addEducation}
                updateEducation={updateEducation}
                removeEducation={removeEducation}
            />;
            case 2: return <LanguagesStep
                freelancerData={freelancerData}
                languageOptions={languageOptions}
                proficiencyLevels={proficiencyLevels}
                addLanguage={addLanguage}
                updateLanguage={updateLanguage}
                removeLanguage={removeLanguage}
            />;
            case 3: return <PortfolioStep
                portfolio={freelancerData.portfolio}
                addPortfolioItem={addPortfolioItem}
                updatePortfolioItem={updatePortfolioItem}
                removePortfolioItem={removePortfolioItem}
            />;
            case 4: return <SocialLinksStep
                socialLinks={freelancerData.socialLinks}
                handleInputChange={handleInputChange}
            />;
            case 5: return <VerificationStep
                freelancerData={freelancerData}
                setFreelancerData={setFreelancerData}
            />;
            case 6: return <AvailabilityStep
                isAvailable={freelancerData.isAvailable}
                handleInputChange={handleInputChange}
            />;
            default: return null;
        }
    };

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    <CompletionStep
                        freelancerData={freelancerData}
                        onRestart={() => {
                            setIsCompleted(false);
                            setFormStep(0);
                            setFreelancerData({
                                fullName: '', locationName: '', latitude: '', longitude: '', bio: '',
                                skills: [], experience: [], education: [], certifications: [],
                                languages: [], portfolio: [],
                                socialLinks: { linkedin: '', github: '', behance: '', dribbble: '' },
                                emailVerified: false, phoneVerified: false, idVerified: false, videoVerified: false,
                                isAvailable: true
                            });
                        }}
                        onDashboard={() => console.log('Navigate to dashboard')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
 flex items-center justify-center p-4">
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
                        isLastStep={formStep === steps.length - 1}
                    />}
                </div>
            </div>
        </div>
    );
}
