
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        is_available: frontendData.is_available || false,
        profile_picture: frontendData.profile_picture || null,
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
        })),
        social_links: {
            github_url: frontendData.social_links?.github_url || '',
            linkedin_url: frontendData.social_links?.linkedin_url || '',
            twitter_url: frontendData.social_links?.twitter_url || '',
            facebook_url: frontendData.social_links?.facebook_url || '',
            instagram_url: frontendData.social_links?.instagram_url || '',
        },
        verifications: {
            email_verified: frontendData.email_verified || false,
            phone_verified: frontendData.phone_verified || false,
            id_verified: frontendData.id_verified || false,
            video_verified: frontendData.video_verified || false,
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
        profile_picture_preview: null,

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
        verifications: {
            email_verified: false,
            phone_verified: false,
            id_verified: false,
            video_verified: false,
        },

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

    const proficiencyLevels = ['Beginner', 'Intermediate', 'Fluent', 'Native'];

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
                [name]: type === 'checkbox' ? checked : name === 'age' ? Number(value) || value : value
            }));
        }
    };

    const navigate = useNavigate();

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
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ profile_picture: 'File size must be less than 5MB' });
                return;
            }
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setErrors({ profile_picture: 'Only JPEG or PNG files are allowed' });
                return;
            }
            if (freelancerData.profile_picture_preview) {
                URL.revokeObjectURL(freelancerData.profile_picture_preview);
            }
            const previewUrl = URL.createObjectURL(file);
            setFreelancerData(prev => ({
                ...prev,
                profile_picture: file,
                profile_picture_preview: previewUrl
            }));
        }
    };

    const handleEducationCertificateUpload = (index, file) => {
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ [`education_certificate_${index}`]: 'File size must be less than 5MB' });
                return;
            }
            if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                setErrors({ [`education_certificate_${index}`]: 'Only PDF, JPEG, or PNG files are allowed' });
                return;
            }
            setFreelancerData(prev => ({
                ...prev,
                education: prev.education.map((edu, i) =>
                    i === index ? { ...edu, certificate: file } : edu
                )
            }));
        }
    };

    const handleExperienceCertificateUpload = (index, file) => {
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ [`experience_certificate_${index}`]: 'File size must be less than 5MB' });
                return;
            }
            if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                setErrors({ [`experience_certificate_${index}`]: 'Only PDF, JPEG, or PNG files are allowed' });
                return;
            }
            setFreelancerData(prev => ({
                ...prev,
                experience: prev.experience.map((exp, i) =>
                    i === index ? { ...exp, certificate: file } : exp
                )
            }));
        }
    };

    useEffect(() => {
        return () => {
            if (freelancerData.profile_picture_preview) {
                URL.revokeObjectURL(freelancerData.profile_picture_preview);
            }
        };
    }, [freelancerData.profile_picture_preview]);


    const nextStep = () => setFormStep(prev => prev + 1);
    const prevStep = () => setFormStep(prev => prev - 1);

    const validateStep = () => {
        const newErrors = {};

        switch (formStep) {
            case 0:
                if (!freelancerData.first_name) newErrors.first_name = 'First name is required';
                if (!freelancerData.last_name) newErrors.last_name = 'Last name is required';
                if (!freelancerData.location) newErrors.location = 'Location is required';
                if (!freelancerData.age || isNaN(freelancerData.age) || freelancerData.age < 18) {
                    newErrors.age = 'Valid age (18 or older) is required';
                }
                if (!freelancerData.about) newErrors.about = 'Bio is required';
                break;

            case 1:
                if (!freelancerData.skills || freelancerData.skills.length === 0) {
                    newErrors.skills = 'Select at least one skill';
                }
                freelancerData.experience.forEach((exp, index) => {
                    if (!exp.role) newErrors[`experience_${index}_role`] = 'Role is required';
                    if (!exp.company) newErrors[`experience_${index}_company`] = 'Company is required';
                    if (!exp.start_date) newErrors[`experience_${index}_start_date`] = 'Start date is required';
                    if (!exp.ongoing && !exp.end_date) newErrors[`experience_${index}_end_date`] = 'End date is required unless ongoing';
                    if (exp.ongoing && exp.end_date) newErrors[`experience_${index}_end_date`] = 'End date should not be set if ongoing';
                });
                freelancerData.education.forEach((edu, index) => {
                    if (!edu.degree) newErrors[`education_${index}_degree`] = 'Degree is required';
                    if (!edu.college) newErrors[`education_${index}_college`] = 'College is required';
                    if (!edu.year || isNaN(edu.year)) newErrors[`education_${index}_year`] = 'Valid year is required';
                });
                break;

            case 2:
                if (!freelancerData.languages || freelancerData.languages.length === 0) {
                    newErrors.languages = 'Add at least one language';
                } else {
                    freelancerData.languages.forEach((lang, index) => {
                        if (!lang.name) newErrors[`language_${index}_name`] = 'Language name is required';
                        if (!lang.proficiency) newErrors[`language_${index}_proficiency`] = 'Proficiency level is required';
                    });
                }
                break;


            case 5:
                if (!freelancerData.verifications.email_verified) {
                    newErrors.email_verified = 'Email verification is required';
                }
                break;

            case 6:
                if (typeof freelancerData.isAvailable !== 'boolean') {
                    newErrors.isAvailable = 'Availability status is required';
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    console.log("formStep:", formStep, "steps.length:", steps.length);
    console.log("HANDLE NEXT -- formStep:", formStep, "/", steps.length - 1);


    const handleNext = () => {
        const isValid = validateStep();
        console.log("validateStep result:", isValid);

        if (isValid) {
            if (formStep < steps.length - 1) {
                nextStep();
            } else {
                console.log("Calling handleSubmit...");
                handleSubmit();
            }
        } else {
            console.warn("Step validation failed. Submission stopped.");
        }
    };


    const handleSubmit = async () => {
        setLoading(true);
        setErrors(null);
        setFieldErrors({});

        console.log("Starting submission...");

        try {
            const backendData = mapFrontendToBackend(freelancerData);
            console.log("Mapped backendData:", backendData);

            // Prepare education and experience data (excluding certificates)
            // eslint-disable-next-line no-unused-vars
            const educationsData = backendData.educations.map(({ certificate, ...rest }) => ({
                ...rest,
                year: parseInt(rest.year, 10) || rest.year, // Ensure year is an integer if valid
            }));
            // eslint-disable-next-line no-unused-vars
            const experiencesData = backendData.experiences.map(({ certificate, ...rest }) => rest);

            // Build payload object
            const payload = {
                first_name: backendData.first_name,
                last_name: backendData.last_name,
                about: backendData.about,
                age: backendData.age,
                location: backendData.location,
                is_available: backendData.is_available,
                skills: backendData.skills.map(skill => {
                    if (typeof skill === 'string') return { name: skill };
                    if (skill && typeof skill.name === 'string') return { name: skill.name };
                    return {}; // fallback (or filter invalid ones separately)
                }),
                educations: educationsData,
                experiences: experiencesData,
                languages: backendData.languages.map(lang => ({
                    ...lang,
                    proficiency: lang.proficiency?.toLowerCase() || '',
                })),
                portfolios: backendData.portfolios.map(port => ({
                    title: port.title,
                    description: port.description,
                    project_link: port.project_link
                })),
                social_links: backendData.social_links,
                verifications: {
                    email_verified: backendData.verifications.email_verified,
                    phone_verified: backendData.verifications.phone_verified,
                    id_verified: backendData.verifications.id_verified,
                    video_verified: backendData.verifications.video_verified,
                }
            };
            console.log("Payload ready:", payload);
            console.log("Final skills payload:", payload.skills);
            payload.skills.forEach((s, i) => {
                console.log(`Skill ${i}:`, s, "typeof name:", typeof s.name);
            });


            // Construct FormData
            const formData = new FormData();
            formData.append('data', JSON.stringify(payload));

            // Append profile picture if exists
            if (backendData.profile_picture) {
                formData.append('profile_picture', backendData.profile_picture);
            }

            // Append education certificates
            backendData.educations.forEach((edu, index) => {
                if (edu.certificate) {
                    formData.append(`education_certificate_${index}`, edu.certificate);
                }
            });

            // Append experience certificates
            backendData.experiences.forEach((exp, index) => {
                if (exp.certificate) {
                    formData.append(`experience_certificate_${index}`, exp.certificate);
                }
            });

            // Optional: Debug log FormData (remove in production)
            // for (let [key, value] of formData.entries()) {
            //     console.log(`${key}:`, value);
            // }

            // API call
            const authtoken = localStorage.getItem('access');

            console.log("Auth token:", authtoken);

            if (!authtoken) {
                setErrors({ submit: 'User is not authenticated. Please log in.' });
                setLoading(false);
                return;
            }
            console.log("Sending API request...");
            await axios.post(`http://localhost:8000/api/v1/profiles/freelancer/profile-setup/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(authtoken && { Authorization: `Bearer ${authtoken}` }),
                },
            });

            // Success: clear errors and mark as completed
            setErrors(null);
            setFieldErrors({});
            console.log('Profile submitted successfully');
            setIsCompleted(true);

        } catch (error) {
            console.log("Server response data:", error.response?.data);
            const responseData = error.response?.data || {};
            const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';

            setFieldErrors(responseData);
            setErrors({ submit: `Failed to submit profile. ${errorMessage}` });

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
                onComplete={() => setIsCompleted(true)}
            />;
            default: return null;
        }
    };
    // console.log("isCompleted:", isCompleted);

    if (isCompleted) {
        console.log("Rendering CompletionStep...");
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    <CompletionStep
                        freelancerData={freelancerData}
                        onRestart={() => {
                            if (window.confirm('Are you sure you want to restart? All data will be lost.')) {
                                setIsCompleted(false);
                                setFormStep(0);
                                setFreelancerData({
                                    first_name: '',
                                    last_name: '',
                                    location: '',
                                    age: '',
                                    about: '',
                                    profile_picture: null,
                                    profile_picture_preview: null,
                                    skills: [],
                                    experience: [],
                                    education: [],
                                    languages: [],
                                    portfolio: [],
                                    social_links: {
                                        github_url: '',
                                        linkedin_url: '',
                                        twitter_url: '',
                                        facebook_url: '',
                                        instagram_url: '',
                                    },
                                    verifications: {
                                        email_verified: false,
                                        phone_verified: false,
                                        id_verified: false,
                                        video_verified: false,
                                    },
                                    is_available: true
                                });
                            }
                        }}
                        onDashboard={() => navigate('/freelancer/dashboard')}
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
