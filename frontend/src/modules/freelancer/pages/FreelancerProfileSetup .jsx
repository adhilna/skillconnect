import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import {
    User, Code, Languages, FileText, Link, Shield, CheckCircle
} from 'lucide-react';
import BasicInfoStep from '../components/freelancerProfileSetup/BasicInfoStep';
import ProfessionalDetailsStep from '../components/freelancerProfileSetup/ProfessionalDetailsStep';
import LanguagesStep from '../components/freelancerProfileSetup/LanguagesStep';
import PortfolioStep from '../components/freelancerProfileSetup/PortfolioStep';
import SocialLinksStep from '../components/freelancerProfileSetup/SocialLinksStep';
import VerificationStep from '../components/freelancerProfileSetup/VerificationStep';
import AvailabilityStep from '../components/freelancerProfileSetup/AvailabilityStep';
import CompletionStep from '../components/freelancerProfileSetup/CompletionStep';
import Stepper from '../components/freelancerProfileSetup/Stepper';
import NavigationButtons from '../components/freelancerProfileSetup/NavigationButtons';
import {
    validateNonEmptyString,
    validateAge,
    validateCity,
    validateCountry,
    validateOptionalDateRange,
    validateOptionalYearRange,
} from '../../../utils/validation';
import { allowedCountriesArray } from '../../../utils/constants';




// Data mapping
const mapFrontendToBackend = (frontendData) => ({
    first_name: frontendData.first_name || '',
    last_name: frontendData.last_name || '',
    about: frontendData.about || '',
    country: frontendData.country || '',
    location: frontendData.location || '',
    age: frontendData.age || null,
    is_available: frontendData.is_available || false,
    profile_picture: frontendData.profile_picture || null,
    skills: (frontendData.skills || []).map(skill => ({
        id: skill.id,
        name: skill.name
    })),
    educations: (frontendData.educations || []).map(edu => ({
        college: edu.college || '',
        degree: edu.degree || '',
        start_year: Number(edu.start_year) || null,
        end_year: Number(edu.end_year) || null,
        certificate: edu.certificate || null,
    })),
    experiences: (frontendData.experiences || []).map(exp => ({
        role: exp.role || '',
        company: exp.company || '',
        start_date: exp.start_date || '',
        end_date: exp.ongoing ? null : exp.end_date,
        ongoing: exp.ongoing || false,
        description: exp.description || '',
        certificate: exp.certificate || null,
    })),
    languages: (frontendData.languages || []).map(lang => ({
        name: lang.name || '',
        proficiency: lang.proficiency || '',
    })),
    portfolios: (frontendData.portfolios || []).map(item => ({
        title: item.title || '',
        description: item.description || '',
        project_link: item.project_link || '',
    })),
    social_links: {
        github_url: frontendData.social_links?.github_url || '',
        linkedin_url: frontendData.social_links?.linkedin_url || '',
        twitter_url: frontendData.social_links?.twitter_url || '',
        facebook_url: frontendData.social_links?.facebook_url || '',
        instagram_url: frontendData.social_links?.instagram_url || '',
    },
    verification: {
        email_verified: frontendData.verification?.email_verified || false,
        phone_verified: frontendData.verification?.phone_verified || false,
        id_verified: frontendData.verification?.id_verified || false,
        video_verified: frontendData.verification?.video_verified || false,
    },
});

// ================== MAIN COMPONENT ==================
const FreelancerProfileSetup = () => {

    // Step definitions
    const steps = [
        { icon: User, title: 'Basic Info' },
        { icon: Code, title: 'Professional' },
        { icon: Languages, title: 'Languages' },
        { icon: FileText, title: 'Portfolio' },
        { icon: Link, title: 'Social Links' },
        { icon: Shield, title: 'Verification' },
        { icon: CheckCircle, title: 'Availability' },
    ];

    // State
    const [freelancerData, setFreelancerData] = useState({
        first_name: '',
        last_name: '',
        about: '',
        country: '',
        location: '',
        age: '',
        is_available: false,
        profile_picture: null,
        profile_picture_preview: null,
        skills: [],
        educations: [],
        experiences: [],
        languages: [],
        portfolio: [],
        social_links: {
            github_url: '',
            linkedin_url: '',
            twitter_url: '',
            facebook_url: '',
            instagram_url: '',
        },
        verification: {
            email_verified: false,
            phone_verified: false,
            id_verified: false,
            video_verified: false,
        },
    });

    const [formStep, setFormStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [ERRORS, setErrors] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);

    // Mock data for options
    const [availableSkills] = useState([
        // 1. Web Development
        { id: 1, name: "HTML & CSS" },
        { id: 2, name: "JavaScript" },

        // 2. Mobile Development
        { id: 3, name: "Flutter" },
        { id: 4, name: "React Native" },

        // 3. Writing & Translation
        { id: 5, name: "Content Writing" },
        { id: 6, name: "Technical Translation" },

        // 4. Design & Creative
        { id: 7, name: "Graphic Design" },
        { id: 8, name: "Adobe Illustrator" },

        // 5. Digital Marketing
        { id: 9, name: "SEO Optimization" },
        { id: 10, name: "Social Media Marketing" },

        // 6. Programming & Tech
        { id: 11, name: "Python" },
        { id: 12, name: "Java" },

        // 7. Business
        { id: 13, name: "Project Management" },
        { id: 14, name: "Business Analysis" },

        // 8. Lifestyle
        { id: 15, name: "Fitness Coaching" },
        { id: 16, name: "Personal Development" },

        // 9. Data Science & AI
        { id: 17, name: "Machine Learning" },
        { id: 18, name: "Data Visualization" },

        // 10. Video & Animation
        { id: 19, name: "Video Editing" },
        { id: 20, name: "3D Animation" },

        // 11. Music & Audio
        { id: 21, name: "Audio Mixing" },
        { id: 22, name: "Music Production" },

        // 12. Finance & Accounting
        { id: 23, name: "Financial Analysis" },
        { id: 24, name: "Bookkeeping" },

        // 13. Engineering & Architecture
        { id: 25, name: "AutoCAD Design" },
        { id: 26, name: "Structural Engineering" },

        // 14. Education & Training
        { id: 27, name: "Curriculum Design" },
        { id: 28, name: "E-Learning Development" },

        // 15. Legal
        { id: 29, name: "Contract Law" },
        { id: 30, name: "Legal Research" },
    ]);


    const [languageOptions] = useState([
        { value: 'english', label: 'English' },
        { value: 'malayalam', label: 'Malayalam' },
        { value: 'spanish', label: 'Spanish' },
        { value: 'french', label: 'French' },
        { value: 'german', label: 'German' },
        { value: 'chinese', label: 'Chinese' },
        { value: 'hindi', label: 'Hindi' },
    ]);

    const [proficiencyLevels] = useState([
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'native', label: 'Native' },
    ]);


    const navigate = useNavigate();

    // Handlers
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFreelancerData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value,
                }
            }));
        } else {
            setFreelancerData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFreelancerData(prev => ({
                    ...prev,
                    profile_picture: file,
                    profile_picture_preview: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleArrayInput = (field, item) => {
        const exists = freelancerData[field].some(i => i.id === item.id);
        setFreelancerData(prev => ({
            ...prev,
            [field]: exists
                ? prev[field].filter(i => i.id !== item.id)
                : [...prev[field], item],
        }));
    };

    const addExperience = () => {
        setFreelancerData(prev => ({
            ...prev,
            experiences: [...prev.experiences, {
                role: '',
                company: '',
                start_date: '',
                end_date: '',
                ongoing: false,
                description: '',
                certificate: null,
            }],
        }));
    };

    const updateExperience = (index, field, value) => {
        setFreelancerData(prev => {
            const newExperiences = [...prev.experiences];
            newExperiences[index][field] = value;
            return { ...prev, experiences: newExperiences };
        });
    };

    const removeExperience = (index) => {
        setFreelancerData(prev => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index),
        }));
    };

    const addEducation = () => {
        setFreelancerData(prev => ({
            ...prev,
            educations: [...prev.educations, {
                college: '',
                degree: '',
                start_year: '',
                end_year: '',
                certificate: null,
            }],
        }));
    };

    const updateEducation = (index, field, value) => {
        setFreelancerData(prev => {
            const newEducations = [...prev.educations];
            newEducations[index][field] = value;
            return { ...prev, educations: newEducations };
        });
    };

    const removeEducation = (index) => {
        setFreelancerData(prev => ({
            ...prev,
            educations: prev.educations.filter((_, i) => i !== index),
        }));
    };

    const handleExperienceCertificateUpload = (index, file) => {
        setFreelancerData(prev => {
            const newExperiences = [...prev.experiences];
            newExperiences[index].certificate = file;
            return { ...prev, experiences: newExperiences };
        });
    };

    const handleEducationCertificateUpload = (index, file) => {
        setFreelancerData(prev => {
            const newEducations = [...prev.educations];
            newEducations[index].certificate = file;
            return { ...prev, educations: newEducations };
        });
    };

    const addLanguage = () => {
        setFreelancerData(prev => ({
            ...prev,
            languages: [...prev.languages, { name: '', proficiency: '' }],
        }));
    };

    const updateLanguage = (index, field, value) => {
        setFreelancerData(prev => {
            const newLanguages = [...prev.languages];
            newLanguages[index][field] = value;
            return { ...prev, languages: newLanguages };
        });
    };

    const removeLanguage = (index) => {
        setFreelancerData(prev => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index),
        }));
    };

    const addPortfolioItem = () => {
        setFreelancerData(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, { title: '', description: '', project_link: '' }],
        }));
    };

    const updatePortfolioItem = (index, field, value) => {
        setFreelancerData(prev => {
            const newPortfolio = [...prev.portfolio];
            newPortfolio[index][field] = value;
            return { ...prev, portfolio: newPortfolio };
        });
    };

    const removePortfolioItem = (index) => {
        setFreelancerData(prev => ({
            ...prev,
            portfolio: prev.portfolio.filter((_, i) => i !== index),
        }));
    };

    const handleVerificationChange = (field, value) => {
        setFreelancerData(prev => ({
            ...prev,
            verification: {
                ...prev.verification,
                [field]: value
            }
        }));
    };

    // Submission logic
    const handleSubmit = async () => {
        setLoading(true);
        setFieldErrors({});

        try {
            const backendData = mapFrontendToBackend(freelancerData);
            const formData = new FormData();

            // 1. Append simple fields
            formData.append('first_name', backendData.first_name);
            formData.append('last_name', backendData.last_name);
            formData.append('about', backendData.about);
            formData.append('age', backendData.age);
            formData.append('country', backendData.country);
            formData.append('location', backendData.location);
            formData.append('is_available', backendData.is_available);

            // 2. Append nested arrays/objects as JSON strings
            formData.append('skills_input', JSON.stringify(freelancerData.skills));

            formData.append('educations_input', JSON.stringify(
                // eslint-disable-next-line no-unused-vars
                backendData.educations?.map(({ certificate, ...rest }) => rest)
            ));
            formData.append('experiences_input', JSON.stringify(
                // eslint-disable-next-line no-unused-vars
                backendData.experiences?.map(({ certificate, ...rest }) => rest)
            ));
            formData.append('languages_input', JSON.stringify(backendData.languages));
            formData.append('portfolios_input', JSON.stringify(backendData.portfolios));
            formData.append('social_links_input', JSON.stringify(backendData.social_links));
            formData.append('verification_input', JSON.stringify(backendData.verification));

            // Append profile picture if exists
            if (backendData.profile_picture && typeof backendData.profile_picture !== 'string') {
                formData.append('profile_picture', backendData.profile_picture);
            }

            // Append education certificates
            backendData.educations?.forEach((edu, index) => {
                if (edu.certificate && typeof edu.certificate !== 'string') {
                    formData.append(`education_certificate_${index}`, edu.certificate);
                }
            });

            // Append experience certificates
            backendData.experiences?.forEach((exp, index) => {
                if (exp.certificate && typeof exp.certificate !== 'string') {
                    formData.append(`experience_certificate_${index}`, exp.certificate);
                }
            });

            // Get auth token
            const authtoken = localStorage.getItem('access');
            if (!authtoken) {
                setFieldErrors({ submit: 'User is not authenticated. Please log in.' });
                setLoading(false);
                return;
            }

            console.log("backendData:", backendData);
            console.log("FormData entries:");
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }


            // Submit data
            const response = await api.post(`/api/v1/profiles/freelancer/profile-setup/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authtoken}`,
                },
            });

            console.log("API response:", response.data);

            // Success handling
            setErrors(null);
            setFieldErrors({});
            setIsCompleted(true);
        } catch (error) {
            // Error handling
            const responseData = error.response?.data || {};
            const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
            console.log('response error:', responseData)
            console.log('other errors:', errorMessage)

            setFieldErrors(responseData.errors || {});
            setErrors({ submit: `Failed to submit profile. ${errorMessage}` });
        } finally {
            setLoading(false);
        }
    };

    // Step navigation
    const prevStep = () => setFormStep(prev => Math.max(0, prev - 1));
    const nextStep = () => setFormStep(prev => Math.min(steps.length - 1, prev + 1));
    const isLastStep = formStep === steps.length - 1;

    const handleNext = () => {
        let errors = {};

        // Example: Validate current step (assume formStep 0 == basic info)
        if (formStep === 0) {
            errors.first_name = validateNonEmptyString(freelancerData.first_name, "First Name", 2);
            errors.last_name = validateNonEmptyString(freelancerData.last_name, "Last Name", 2);
            errors.country = validateCountry(freelancerData.country, allowedCountriesArray);
            errors.location = validateCity(freelancerData.location);
            errors.age = validateAge(freelancerData.age);
            errors.about = validateNonEmptyString(freelancerData.about, "About/Bio", 10, 2000);
        }
        else if (formStep === 1) {
            errors.skills = (freelancerData.skills.length === 0) ? "Select at least one skill." : null;
            errors.experiences = freelancerData.experiences.map((exp, index) => {
                const expErrors = {
                    role: validateNonEmptyString(exp.role, `Experience Role #${index + 1}`, 0, 100, true),
                    company: validateNonEmptyString(exp.company, `Experience Company #${index + 1}`, 0, 100, true),
                    description: validateNonEmptyString(exp.description, `Experience Description #${index + 1}`, 0, 1000, true),
                    dates: validateOptionalDateRange(exp.start_date, exp.end_date, exp.ongoing)
                };
                // remove null fields
                Object.keys(expErrors).forEach(k => expErrors[k] === null && delete expErrors[k]);
                return Object.keys(expErrors).length > 0 ? expErrors : null;
            }).filter(Boolean); // remove null experiences
            if (errors.experiences.length === 0) delete errors.experiences;
            errors.educations = freelancerData.educations.map((edu, index) => {
                const eduErrors = {
                    college: validateNonEmptyString(edu.college, `College/University #${index + 1}`, 0, 200, true),
                    degree: validateNonEmptyString(edu.degree, `Degree #${index + 1}`, 0, 100, true),
                    years: validateOptionalYearRange(edu.start_year, edu.end_year)
                };
                Object.keys(eduErrors).forEach(k => eduErrors[k] === null && delete eduErrors[k]);
                return Object.keys(eduErrors).length > 0 ? eduErrors : null;
            }).filter(Boolean);
            if (errors.educations.length === 0) delete errors.educations;
        }

        // Remove empty errors
        Object.keys(errors).forEach(key => {
            if (!errors[key]) delete errors[key];
        });

        setFieldErrors(errors);

        // If any error, don't proceed
        if (Object.keys(errors).length > 0) return;

        // If last step, call handleSubmit. Otherwise, proceed to next step.
        if (isLastStep) {
            handleSubmit();
        } else {
            nextStep();
        }
    };


    // Step component selector
    const getCurrentStepComponent = () => {
        switch (formStep) {
            case 0: return <BasicInfoStep
                freelancerData={freelancerData}
                handleInputChange={handleInputChange}
                handleImageUpload={handleImageUpload}
                fieldErrors={fieldErrors}
            />;
            case 1: return <ProfessionalDetailsStep
                freelancerData={freelancerData}
                fieldErrors={fieldErrors}
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
                fieldErrors={fieldErrors}
            />;
            case 3: return <PortfolioStep
                portfolio={freelancerData.portfolio}
                addPortfolioItem={addPortfolioItem}
                updatePortfolioItem={updatePortfolioItem}
                removePortfolioItem={removePortfolioItem}
                fieldErrors={fieldErrors}
            />;
            case 4: return <SocialLinksStep
                socialLinks={freelancerData.social_links}
                handleInputChange={handleInputChange}
                fieldErrors={fieldErrors}
            />;
            case 5: return <VerificationStep
                freelancerData={freelancerData}
                setFreelancerData={setFreelancerData}
                fieldErrors={fieldErrors}
                handleVerificationChange={handleVerificationChange}
            />;
            case 6: return <AvailabilityStep
                isAvailable={freelancerData.is_available}
                handleInputChange={handleInputChange}
                onComplete={() => setIsCompleted(true)}
            />;
            default: return null;
        }
    };

    // ================== RENDER ==================
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-2xl">
                    <Stepper steps={steps} formStep={formStep} />
                    {isCompleted ? (
                        <CompletionStep
                            freelancerData={freelancerData}
                            onDashboard={() => navigate('/freelancer/dashboard')} // or any route you want
                        />
                    ) : (
                        <>
                            {getCurrentStepComponent()}
                            <NavigationButtons
                                formStep={formStep}
                                stepsLength={steps.length}
                                loading={loading}
                                handleNext={handleNext}
                                prevStep={prevStep}
                                isLastStep={isLastStep}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FreelancerProfileSetup;
