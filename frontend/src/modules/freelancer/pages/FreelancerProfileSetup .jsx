
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




















// import React from 'react';
// import { useState } from 'react';
// import { ChevronLeft, ChevronRight, Upload, X, Plus, Star, DollarSign, User, Briefcase, Image, Award } from 'lucide-react';

// export default function FreelancerProfileSetup() {
//     const [formStep, setFormStep] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [profileImage, setProfileImage] = useState(null);
//     const [portfolioImages, setPortfolioImages] = useState([]);

//     const [profileData, setProfileData] = useState({
//         // Personal Info
//         firstName: '',
//         lastName: '',
//         title: '',
//         description: '',
//         location: '',
//         languages: [],

//         // Skills & Experience
//         skills: [],
//         experience: '',
//         education: '',
//         certifications: [],

//         // Portfolio & Services
//         portfolioItems: [],
//         serviceTitle: '',
//         serviceDescription: '',
//         serviceCategory: '',
//         deliveryTime: '',

//         // Pricing
//         basicPrice: '',
//         standardPrice: '',
//         premiumPrice: '',
//         basicFeatures: [],
//         standardFeatures: [],
//         premiumFeatures: []
//     });

//     const steps = [
//         { title: 'Personal Info', icon: User },
//         { title: 'Skills & Experience', icon: Briefcase },
//         { title: 'Portfolio & Services', icon: Image },
//         { title: 'Pricing', icon: DollarSign }
//     ];

//     const categories = [
//         'Web Development', 'Mobile Development', 'UI/UX Design', 'Graphic Design',
//         'Content Writing', 'Digital Marketing', 'Video Editing', 'Photography',
//         'Translation', 'Data Entry', 'Virtual Assistant', 'Consulting'
//     ];

//     const skillOptions = [
//         'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'PHP', 'HTML/CSS',
//         'Photoshop', 'Illustrator', 'Figma', 'WordPress', 'SEO', 'Social Media',
//         'Copywriting', 'Video Editing', 'Photography', 'Translation', 'Data Analysis'
//     ];

//     const languageOptions = [
//         'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi'
//     ];

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProfileData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleArrayInput = (field, value) => {
//         setProfileData(prev => ({
//             ...prev,
//             [field]: [...prev[field], value]
//         }));
//     };

//     const removeArrayItem = (field, index) => {
//         setProfileData(prev => ({
//             ...prev,
//             [field]: prev[field].filter((_, i) => i !== index)
//         }));
//     };

//     const handleImageUpload = (e, type) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 if (type === 'profile') {
//                     setProfileImage(e.target.result);
//                 } else if (type === 'portfolio') {
//                     setPortfolioImages(prev => [...prev, e.target.result]);
//                 }
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const nextStep = () => setFormStep(prev => prev + 1);
//     const prevStep = () => setFormStep(prev => prev - 1);

//     const validateStep = () => {
//         const newErrors = {};

//         switch (formStep) {
//             case 0:
//                 if (!profileData.firstName) newErrors.firstName = 'First name is required';
//                 if (!profileData.lastName) newErrors.lastName = 'Last name is required';
//                 if (!profileData.title) newErrors.title = 'Professional title is required';
//                 if (!profileData.description) newErrors.description = 'Description is required';
//                 break;
//             case 1:
//                 if (profileData.skills.length === 0) newErrors.skills = 'At least one skill is required';
//                 if (!profileData.experience) newErrors.experience = 'Experience level is required';
//                 break;
//             case 2:
//                 if (!profileData.serviceTitle) newErrors.serviceTitle = 'Service title is required';
//                 if (!profileData.serviceCategory) newErrors.serviceCategory = 'Service category is required';
//                 break;
//             case 3:
//                 if (!profileData.basicPrice) newErrors.basicPrice = 'Basic price is required';
//                 break;
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleNext = () => {
//         if (validateStep()) {
//             if (formStep < steps.length - 1) {
//                 nextStep();
//             } else {
//                 handleSubmit();
//             }
//         }
//     };

//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 2000));
//             console.log('Profile setup completed:', profileData);
//             alert('Profile setup completed successfully!');
//         } catch (error) {
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const Stepper = () => (
//         <div className="flex items-center justify-between mb-8">
//             {steps.map((step, index) => {
//                 const Icon = step.icon;
//                 return (
//                     <div key={index} className="flex items-center">
//                         <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${index <= formStep
//                                 ? 'bg-blue-500 border-blue-500 text-white'
//                                 : 'border-white/30 text-white/50'
//                             }`}>
//                             <Icon size={20} />
//                         </div>
//                         {index < steps.length - 1 && (
//                             <div className={`w-12 h-0.5 mx-2 ${index < formStep ? 'bg-blue-500' : 'bg-white/30'
//                                 }`} />
//                         )}
//                     </div>
//                 );
//             })}
//         </div>
//     );

//     const PersonalInfoStep = () => (
//         <div className="space-y-6">
//             <div className="text-center">
//                 <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
//                 <p className="text-white/70">Tell us about yourself</p>
//             </div>

//             <div className="flex justify-center mb-6">
//                 <div className="relative">
//                     <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20">
//                         {profileImage ? (
//                             <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
//                         ) : (
//                             <User size={32} className="text-white/50" />
//                         )}
//                     </div>
//                     <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
//                         <Upload size={16} className="text-white" />
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => handleImageUpload(e, 'profile')}
//                             className="hidden"
//                         />
//                     </label>
//                 </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-white/80 text-sm font-medium mb-2">First Name</label>
//                     <input
//                         type="text"
//                         name="firstName"
//                         value={profileData.firstName}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
//                         placeholder="John"
//                     />
//                     {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
//                 </div>
//                 <div>
//                     <label className="block text-white/80 text-sm font-medium mb-2">Last Name</label>
//                     <input
//                         type="text"
//                         name="lastName"
//                         value={profileData.lastName}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
//                         placeholder="Doe"
//                     />
//                     {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
//                 </div>
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Professional Title</label>
//                 <input
//                     type="text"
//                     name="title"
//                     value={profileData.title}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
//                     placeholder="Full Stack Developer"
//                 />
//                 {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
//                 <textarea
//                     name="description"
//                     value={profileData.description}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 resize-none"
//                     placeholder="Describe your expertise and what makes you unique..."
//                 />
//                 {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Location</label>
//                 <input
//                     type="text"
//                     name="location"
//                     value={profileData.location}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
//                     placeholder="New York, USA"
//                 />
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Languages</label>
//                 <select
//                     onChange={(e) => {
//                         if (e.target.value && !profileData.languages.includes(e.target.value)) {
//                             handleArrayInput('languages', e.target.value);
//                             e.target.value = '';
//                         }
//                     }}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
//                 >
//                     <option value="">Select languages...</option>
//                     {languageOptions.map(lang => (
//                         <option key={lang} value={lang} className="bg-gray-800">{lang}</option>
//                     ))}
//                 </select>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                     {profileData.languages.map((lang, index) => (
//                         <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
//                             {lang}
//                             <X size={14} className="cursor-pointer" onClick={() => removeArrayItem('languages', index)} />
//                         </span>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );

//     const SkillsExperienceStep = () => (
//         <div className="space-y-6">
//             <div className="text-center">
//                 <h2 className="text-2xl font-bold text-white mb-2">Skills & Experience</h2>
//                 <p className="text-white/70">Showcase your expertise</p>
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Skills</label>
//                 <select
//                     onChange={(e) => {
//                         if (e.target.value && !profileData.skills.includes(e.target.value)) {
//                             handleArrayInput('skills', e.target.value);
//                             e.target.value = '';
//                         }
//                     }}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
//                 >
//                     <option value="">Add skills...</option>
//                     {skillOptions.map(skill => (
//                         <option key={skill} value={skill} className="bg-gray-800">{skill}</option>
//                     ))}
//                 </select>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                     {profileData.skills.map((skill, index) => (
//                         <span key={index} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
//                             {skill}
//                             <X size={14} className="cursor-pointer" onClick={() => removeArrayItem('skills', index)} />
//                         </span>
//                     ))}
//                 </div>
//                 {errors.skills && <p className="text-red-400 text-sm mt-1">{errors.skills}</p>}
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Experience Level</label>
//                 <select
//                     name="experience"
//                     value={profileData.experience}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
//                 >
//                     <option value="" className="bg-gray-800">Select experience level</option>
//                     <option value="entry" className="bg-gray-800">Entry Level (0-1 years)</option>
//                     <option value="intermediate" className="bg-gray-800">Intermediate (2-4 years)</option>
//                     <option value="expert" className="bg-gray-800">Expert (5+ years)</option>
//                 </select>
//                 {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience}</p>}
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Education</label>
//                 <textarea
//                     name="education"
//                     value={profileData.education}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 resize-none"
//                     placeholder="Your educational background..."
//                 />
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Certifications</label>
//                 <div className="flex gap-2">
//                     <input
//                         type="text"
//                         placeholder="Add certification..."
//                         onKeyPress={(e) => {
//                             if (e.key === 'Enter' && e.target.value.trim()) {
//                                 handleArrayInput('certifications', e.target.value.trim());
//                                 e.target.value = '';
//                             }
//                         }}
//                         className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
//                     />
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                     {profileData.certifications.map((cert, index) => (
//                         <span key={index} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
//                             <Award size={14} />
//                             {cert}
//                             <X size={14} className="cursor-pointer" onClick={() => removeArrayItem('certifications', index)} />
//                         </span>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );

//     const PortfolioServicesStep = () => (
//         <div className="space-y-6">
//             <div className="text-center">
//                 <h2 className="text-2xl font-bold text-white mb-2">Portfolio & Services</h2>
//                 <p className="text-white/70">Showcase your work and define your services</p>
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Portfolio Images</label>
//                 <div className="grid grid-cols-3 gap-4">
//                     {portfolioImages.map((image, index) => (
//                         <div key={index} className="relative aspect-square bg-white/10 rounded-lg overflow-hidden">
//                             <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
//                             <button
//                                 onClick={() => setPortfolioImages(prev => prev.filter((_, i) => i !== index))}
//                                 className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
//                             >
//                                 <X size={12} className="text-white" />
//                             </button>
//                         </div>
//                     ))}
//                     {portfolioImages.length < 6 && (
//                         <label className="aspect-square bg-white/10 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
//                             <Plus size={24} className="text-white/50" />
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => handleImageUpload(e, 'portfolio')}
//                                 className="hidden"
//                             />
//                         </label>
//                     )}
//                 </div>
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Service Title</label>
//                 <input
//                     type="text"
//                     name="serviceTitle"
//                     value={profileData.serviceTitle}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
//                     placeholder="I will create a responsive website for you"
//                 />
//                 {errors.serviceTitle && <p className="text-red-400 text-sm mt-1">{errors.serviceTitle}</p>}
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Service Category</label>
//                 <select
//                     name="serviceCategory"
//                     value={profileData.serviceCategory}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
//                 >
//                     <option value="" className="bg-gray-800">Select category</option>
//                     {categories.map(category => (
//                         <option key={category} value={category} className="bg-gray-800">{category}</option>
//                     ))}
//                 </select>
//                 {errors.serviceCategory && <p className="text-red-400 text-sm mt-1">{errors.serviceCategory}</p>}
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Service Description</label>
//                 <textarea
//                     name="serviceDescription"
//                     value={profileData.serviceDescription}
//                     onChange={handleInputChange}
//                     rows={4}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 resize-none"
//                     placeholder="Describe what you'll deliver and what makes your service special..."
//                 />
//             </div>

//             <div>
//                 <label className="block text-white/80 text-sm font-medium mb-2">Delivery Time</label>
//                 <select
//                     name="deliveryTime"
//                     value={profileData.deliveryTime}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
//                 >
//                     <option value="" className="bg-gray-800">Select delivery time</option>
//                     <option value="1" className="bg-gray-800">1 day</option>
//                     <option value="2" className="bg-gray-800">2 days</option>
//                     <option value="3" className="bg-gray-800">3 days</option>
//                     <option value="7" className="bg-gray-800">1 week</option>
//                     <option value="14" className="bg-gray-800">2 weeks</option>
//                     <option value="30" className="bg-gray-800">1 month</option>
//                 </select>
//             </div>
//         </div>
//     );

//     const PricingStep = () => (
//         <div className="space-y-6">
//             <div className="text-center">
//                 <h2 className="text-2xl font-bold text-white mb-2">Pricing Packages</h2>
//                 <p className="text-white/70">Set your service pricing tiers</p>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//                 {['Basic', 'Standard', 'Premium'].map((tier, /*index*/) => {
//                     const priceField = tier.toLowerCase() + 'Price';
//                     const featuresField = tier.toLowerCase() + 'Features';

//                     return (
//                         <div key={tier} className="bg-white/5 rounded-lg p-4 border border-white/10">
//                             <h3 className="text-white font-semibold text-center mb-3">{tier}</h3>

//                             <div className="mb-3">
//                                 <label className="block text-white/80 text-xs font-medium mb-1">Price ($)</label>
//                                 <input
//                                     type="number"
//                                     name={priceField}
//                                     value={profileData[priceField]}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
//                                     placeholder="0"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-white/80 text-xs font-medium mb-1">Features</label>
//                                 <div className="space-y-1">
//                                     {profileData[featuresField].map((feature, featureIndex) => (
//                                         <div key={featureIndex} className="flex items-center gap-1 text-xs text-white/70">
//                                             <Star size={10} className="text-yellow-400 fill-current" />
//                                             <span className="flex-1">{feature}</span>
//                                             <X
//                                                 size={10}
//                                                 className="cursor-pointer text-red-400"
//                                                 onClick={() => removeArrayItem(featuresField, featureIndex)}
//                                             />
//                                         </div>
//                                     ))}
//                                     <input
//                                         type="text"
//                                         placeholder="Add feature..."
//                                         onKeyPress={(e) => {
//                                             if (e.key === 'Enter' && e.target.value.trim()) {
//                                                 handleArrayInput(featuresField, e.target.value.trim());
//                                                 e.target.value = '';
//                                             }
//                                         }}
//                                         className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {errors.basicPrice && <p className="text-red-400 text-sm">{errors.basicPrice}</p>}
//         </div>
//     );

//     const renderCurrentStep = () => {
//         switch (formStep) {
//             case 0: return <PersonalInfoStep />;
//             case 1: return <SkillsExperienceStep />;
//             case 2: return <PortfolioServicesStep />;
//             case 3: return <PricingStep />;
//             default: return <PersonalInfoStep />;
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 px-4 py-12">
//             <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl w-full max-w-4xl shadow-2xl">
//                 <Stepper />

//                 {renderCurrentStep()}

//                 <div className="flex justify-between mt-8">
//                     <button
//                         onClick={prevStep}
//                         disabled={formStep === 0}
//                         className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${formStep === 0
//                                 ? 'bg-white/10 text-white/50 cursor-not-allowed'
//                                 : 'bg-white/20 text-white hover:bg-white/30'
//                             }`}
//                     >
//                         <ChevronLeft size={20} />
//                         Back
//                     </button>

//                     <button
//                         onClick={handleNext}
//                         disabled={loading}
//                         className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//                     >
//                         {loading ? (
//                             'Processing...'
//                         ) : formStep === steps.length - 1 ? (
//                             'Complete Setup'
//                         ) : (
//                             <>
//                                 Next
//                                 <ChevronRight size={20} />
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

