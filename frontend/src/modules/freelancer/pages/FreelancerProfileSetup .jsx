
import React, { useState } from 'react';
import axios from 'axios';
import { User, Target, Code, Globe, CheckCircle, Shield, Link } from 'lucide-react';
import BasicInfoStep from '../components/freelancerProfileSetup/BasicInfoStep';
import ProfessionalDetailsStep from '../components/freelancerProfileSetup/ProfessionalDetailsStep';
import LanguagesStep from '../components/freelancerProfileSetup/LanguagesStep';
import PortfolioStep from '../components/freelancerProfileSetup/PortfolioStep';
import VerificationStep from '../components/freelancerProfileSetup/VerificationStep';
import AvailabilityStep from '../components/freelancerProfileSetup/AvailabilityStep';
import CompletionStep from '../components/freelancerProfileSetup/CompletionStep';
import SocialLinksStep from '../components/freelancerProfileSetup/SocialLinksStep';
import NavigationButtons from '../components/freelancerProfileSetup/NavigationButtons';
import Stepper from '../components/freelancerProfileSetup/Stepper';

function mapFrontendToBackend(frontendData) {

    return {
        first_name: frontendData.first_name || '',
        last_name: frontendData.last_name || '',
        about: frontendData.about || '',
        location: frontendData.location || '',
        age: frontendData.age || '',
        is_available: frontendData.isAvailable || false,
        profile_picture: frontendData.profileImageFile || null,
        skills: (frontendData.skills || []).map(skill => ({ name: skill })),
        educations: (frontendData.education || []).map(edu => ({
            college: edu.college,
            degree: edu.degree,
            year: edu.year,
            certificate: edu.certificate || null
        })),
        experiences: (frontendData.experience || []).map(exp => ({
            role: exp.role,
            company: exp.company,
            start_date: exp.start_date,
            end_date: exp.ongoing ? null : exp.end_date,
            description: exp.description,
            certificate: exp.certificate || null
        })),
        languages: (frontendData.languages || []).map(lang => ({
            name: lang.name,
            proficiency: lang.proficiency,
        })),
        portfolios: (frontendData.portfolio || []).map(item => ({
            title: item.title,
            description: item.description,
            project_link: item.link,
            github_url: item.github_url || '',
            linkedin_url: item.linkedin_url || ''
        })),
        social_links: {
            github_url: frontendData.socialLinks?.github || '',
            linkedin_url: frontendData.socialLinks?.linkedin || '',
            twitter_url: frontendData.socialLinks?.twitter || '',
            facebook_url: frontendData.socialLinks?.facebook || '',
            instagram_url: frontendData.socialLinks?.instagram || '',
        },
        verifications: {
            email_verified: frontendData.emailVerified || false,
            phone_verified: frontendData.phoneVerified || false,
            id_verified: frontendData.idVerified || false,
            video_verified: frontendData.videoVerified || false,
        }

    };
}

export default function FreelancerProfileSetup() {
    const [formStep, setFormStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const [freelancerData, setFreelancerData] = useState({
        // Basic Information
        first_name: '',
        last_name: '',
        location: '',
        age: '',
        about: '',
        profile_picture: null,

        // Professional Details
        skills: [],
        experience: [],
        education: [],

        // Languages
        languages: [],

        // Portfolio
        portfolio: [],

        // social media links
        socialLinks: {
            github_url: '',
            linkedin_url: '',
            twitter_url: '',
            facebook_url: '',
            instagram_url: '',
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
        { title: 'Social Links', icon: Link },
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
            experience: [...prev.experience, { role: '', company: '', start_date: '', end_date: '', ongoing: false, description: '', certificate: null }]
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
            education: [...prev.education, { degree: '', college: '', year: '', certificate: null }]
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
            const previewUrl = URL.createObjectURL(file);

            setFreelancerData(prev => ({
                ...prev,
                profileImageFile: file,
                profile_picture_preview: previewUrl
            }));
        }
    };

    const handleEducationCertificateUpload = (index, file) => {
        setFreelancerData(prev => ({
            ...prev,
            education: prev.education.map((edu, i) =>
                i === index ? { ...edu, certificate: file } : edu
            )
        }));
    };

    const handleExperienceCertificateUpload = (index, file) => {
        setFreelancerData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) =>
                i === index ? { ...exp, certificate: file } : exp
            )
        }));
    };


    const nextStep = () => setFormStep(prev => prev + 1);
    const prevStep = () => setFormStep(prev => prev - 1);

    const validateStep = () => {
        const newErrors = {};
        console.log('Validating step:', formStep);

        switch (formStep) {
            case 0:
                if (!freelancerData.first_name) newErrors.first_name = 'First name is required';
                if (!freelancerData.last_name) newErrors.last_name = 'Last name is required';
                if (!freelancerData.location) newErrors.location = 'Location is required';
                if (!freelancerData.age || isNaN(freelancerData.age)) {
                    newErrors.age = 'Valid age is required';
                }
                if (!freelancerData.about) newErrors.about = 'Bio is required';
                break;

            case 1:
                if (!freelancerData.skills || freelancerData.skills.length === 0) {
                    newErrors.skills = 'Select at least one skill';
                }
                break;

            case 2:
                if (!freelancerData.languages || freelancerData.languages.length === 0) {
                    newErrors.languages = 'Add at least one language';
                } else {
                    freelancerData.languages.forEach((lang, index) => {
                        if (!lang.name) {
                            newErrors[`language_${index}_name`] = 'Language name is required';
                        }
                        if (!lang.proficiency) {
                            newErrors[`language_${index}_proficiency`] = 'Proficiency level is required';
                        }
                    });
                }
                break;

            case 5:
                if (!freelancerData.emailVerified) newErrors.emailVerified = 'Email verification is required';
                break;

            default:
                // Optionally handle unknown steps
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
            const backendData = mapFrontendToBackend(freelancerData);
            // eslint-disable-next-line no-unused-vars
            const educationsData = backendData.educations.map(({ certificate, ...rest }) => rest);
            // eslint-disable-next-line no-unused-vars
            const experiencesData = backendData.experiences.map(({ certificate, ...rest }) => rest);

            const formData = new FormData();
            formData.append('first_name', backendData.first_name);
            formData.append('last_name', backendData.last_name);
            formData.append('about', backendData.about);
            formData.append('age', backendData.age);
            formData.append('location', backendData.location)
            formData.append('is_available', String(backendData.is_available));
            formData.append('skills', JSON.stringify(backendData.skills));
            formData.append('educations', JSON.stringify(educationsData));
            formData.append('experiences', JSON.stringify(experiencesData));
            formData.append('languages', JSON.stringify(backendData.languages));
            formData.append('portfolios', JSON.stringify(backendData.portfolios));
            formData.append('social_links', JSON.stringify(backendData.social_links));
            formData.append('email_verified', backendData.verifications.email_verified);
            formData.append('phone_verified', backendData.verifications.phone_verified);
            formData.append('id_verified', backendData.verifications.id_verified);
            formData.append('video_verified', backendData.verifications.video_verified);

            if (freelancerData.profileImageFile) {
                formData.append('profile_picture', freelancerData.profileImageFile);
            }
            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            // Retrieve authtoken from localStorage or context as needed
            const authtoken = localStorage.getItem('access');

            await axios.post('http://localhost:8000/api/v1/profiles/freelancer/profile-setup/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(authtoken && { Authorization: `Bearer ${authtoken}` }),
                },
            });


            setErrors(null);
            setFieldErrors({});
        } catch (error) {
            if (error.response && error.response.data) {
                setFieldErrors(error.response.data);
                setErrors('Failed to submit profile. Please check the errors and try again.');
                setErrors('Faliled to submit profile. ' + (error.message || 'unnknown error'));
            }
        } finally {
            setLoading(false);
        }
        setIsCompleted(true);
    };



    const getCurrentStepComponent = () => {
        switch (formStep) {
            case 0: return <BasicInfoStep
                freelancerData={freelancerData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleImageUpload={handleImageUpload}
                fieldErrors={fieldErrors}
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
                handleExperienceCertificateUpload={handleExperienceCertificateUpload}
                handleEducationCertificateUpload={handleEducationCertificateUpload}
            />;
            case 2: return <LanguagesStep
                freelancerData={freelancerData}
                languageOptions={languageOptions}
                proficiencyLevels={proficiencyLevels}
                addLanguage={addLanguage}
                updateLanguage={updateLanguage}
                removeLanguage={removeLanguage}
                errors={errors}
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
                handleInputChange={e =>
                    setFreelancerData(prev => ({
                        ...prev,
                        isAvailable: e.target.checked
                    }))
                }
            />;
            default: return null;
        }
    };

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
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
