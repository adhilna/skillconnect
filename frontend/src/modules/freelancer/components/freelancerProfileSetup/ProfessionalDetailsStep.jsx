import React from 'react';
import { Plus, Building, Skull, Trash2, Upload, FileCheck, GraduationCap } from 'lucide-react';

export default function ProfessionalDetailsStep({
    freelancerData,
    fieldErrors,
    availableSkills,
    handleArrayInput,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    handleExperienceCertificateUpload,
    handleEducationCertificateUpload
}) {


    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Professional Details</h2>
                <p className="text-white/70">Showcase your skills and experience</p>
            </div>
            {/* Skills Section */}
            <div>
                <h4 className="text-lg font-medium flex items-center text-white">
                    <Skull className="mr-2" />
                    Skills
                </h4>
                <br />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableSkills.map(skill => (
                        <button
                            key={skill.id}
                            type="button"
                            onClick={() => handleArrayInput('skills', skill)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all text-sm transform hover:scale-105 ${freelancerData.skills.some(s => s.id === skill.id)
                                ? 'border-green-500 bg-green-500/20 text-green-300 shadow-lg shadow-green-500/20'
                                : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                                }`}
                        >
                            {skill.name}
                        </button>
                    ))}
                </div>
                {fieldErrors.skills && <p className="text-red-500 text-sm">{fieldErrors.skills}</p>}
            </div>

            {/* Experience Section */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3 sm:gap-0">
                    <h4 className="text-lg font-medium flex items-center text-white">
                        <Building className="mr-2" size={20} />
                        Experience
                    </h4>

                    <button
                        onClick={addExperience}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm w-full sm:w-auto"
                    >
                        <Plus size={16} />
                        Add Experience
                    </button>
                </div>

                {freelancerData.experiences.map((exp, index) => (
                    <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-3 sm:p-4 mb-3">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-white font-medium text-sm sm:text-base">Experience #{index + 1}</h4>
                            <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="text-red-500 hover:text-red-400 p-1"
                            >
                                <Trash2 size={16} className="sm:hidden" />
                                <Trash2 size={18} className="hidden sm:block" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    value={exp.role}
                                    onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-white text-sm sm:text-base"
                                />
                                {fieldErrors.experiences?.[index]?.role && (
                                    <p className="text-red-500 text-sm">{fieldErrors.experiences[index].role}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">Company</label>
                                <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-white text-sm sm:text-base"
                                />
                                {fieldErrors.experiences?.[index]?.company && (
                                    <p className="text-red-500 text-sm">{fieldErrors.experiences[index].company}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">Start Date</label>
                                <input
                                    type="date"
                                    value={exp.start_date}
                                    onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-white text-sm sm:text-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">End Date</label>
                                <input
                                    type="date"
                                    value={exp.end_date}
                                    onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                                    disabled={exp.ongoing}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-white text-sm sm:text-base"
                                />
                                {fieldErrors.experiences?.[index]?.dates && (
                                    <p className="text-red-500 text-sm">{fieldErrors.experiences[index].dates}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center mb-4 gap-2">
                            <input
                                type="checkbox"
                                checked={exp.ongoing}
                                onChange={(e) => updateExperience(index, 'ongoing', e.target.checked)}
                                className="h-4 w-4 rounded border-white/30 bg-white/10 focus:ring-blue-500 text-blue-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <label className="text-sm font-medium text-white/80 cursor-pointer" onClick={() => updateExperience(index, 'ongoing', !exp.ongoing)}>
                                Currently working here
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-white/80">Description</label>
                            <textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 resize-none text-sm sm:text-base"
                            />
                            {fieldErrors.experiences?.[index]?.description && (
                                <p className="text-red-500 text-sm">{fieldErrors.experiences[index].description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">
                                Certificate (optional)
                            </label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <label className="flex items-center justify-center px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-md cursor-pointer hover:bg-purple-600 text-white focus:outline-none focus:border-green-400 transition-colors flex-1 sm:flex-initial">
                                    <Upload size={16} className="mr-2 flex-shrink-0" />
                                    {exp.certificate ? (
                                        <span className="flex items-center space-x-2 min-w-0">
                                            <FileCheck size={16} className="text-green-400 flex-shrink-0" />
                                            <span className="truncate text-sm" title={exp.certificate.name}>
                                                {exp.certificate.name}
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="text-sm">Upload Certificate</span>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                        onChange={(e) => handleExperienceCertificateUpload(index, e.target.files[0])}
                                    />
                                </label>
                                {exp.certificate && (
                                    <button
                                        type="button"
                                        onClick={() => handleExperienceCertificateUpload(index, null)}
                                        className="flex items-center justify-center px-3 py-2 text-red-400 hover:text-red-600 transition-colors border border-red-400/30 rounded-md hover:bg-red-400/10 sm:w-auto"
                                        title="Remove certificate"
                                    >
                                        <Trash2 size={16} />
                                        <span className="ml-2 text-sm sm:hidden">Remove</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Education Section */}
            <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h4 className="text-lg font-medium flex items-center text-white">
                        <GraduationCap className="mr-2 flex-shrink-0" /> Education
                    </h4>
                    <button
                        type="button"
                        onClick={addEducation}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm w-full sm:w-auto"
                    >
                        <Plus size={16} className="flex-shrink-0" /> Add Education
                    </button>
                </div>

                {freelancerData.educations.map((edu, index) => (
                    <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-3 sm:p-4 mb-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                            <h4 className="text-white font-medium">Education #{index + 1}</h4>
                            <button
                                type="button"
                                onClick={() => removeEducation(index)}
                                className="text-red-500 hover:text-red-400 self-start sm:self-auto"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                            <div className="sm:col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium mb-2 text-white/80">College/University</label>
                                <input
                                    type="text"
                                    value={edu.college}
                                    onChange={(e) => updateEducation(index, 'college', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-green-400"
                                />
                                {fieldErrors.educations?.[index]?.college && (
                                    <p className="text-red-500 text-sm">{fieldErrors.educations[index].college}</p>
                                )}
                            </div>

                            <div className="sm:col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium mb-2 text-white/80">Degree</label>
                                <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-green-400"
                                />
                                {fieldErrors.educations?.[index]?.degree && (
                                    <p className="text-red-500 text-sm">{fieldErrors.educations[index].degree}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">Start Year</label>
                                <input
                                    type="number"
                                    value={edu.start_year}
                                    onChange={(e) => updateEducation(index, 'start_year', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-green-400"
                                />
                                {fieldErrors.educations?.[index]?.years && (
                                    <p className="text-red-500 text-sm">{fieldErrors.educations[index].years}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">End Year</label>
                                <input
                                    type="number"
                                    value={edu.end_year}
                                    onChange={(e) => updateEducation(index, 'end_year', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-green-400"
                                />
                                {fieldErrors.educations?.[index]?.years && (
                                    <p className="text-red-500 text-sm">{fieldErrors.educations[index].years}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">
                                Certificate (optional)
                            </label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <label className="flex items-center px-4 py-2 bg-white/10 border-white/20 rounded-md cursor-pointer hover:bg-purple-600 text-white focus:outline-none focus:border-green-400 w-full sm:w-auto min-w-0">
                                    <Upload size={16} className="mr-2 flex-shrink-0" />
                                    {edu.certificate ? (
                                        <span className="flex items-center space-x-2 min-w-0">
                                            <FileCheck size={16} className="text-green-400 flex-shrink-0" />
                                            <span className="truncate max-w-[200px] sm:max-w-xs" title={edu.certificate.name}>
                                                {edu.certificate.name}
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="whitespace-nowrap">Upload Certificate</span>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                        onChange={(e) => handleEducationCertificateUpload(index, e.target.files[0])}
                                    />
                                </label>
                                {edu.certificate && (
                                    <button
                                        type="button"
                                        onClick={() => handleEducationCertificateUpload(index, null)}
                                        className="text-red-400 hover:text-red-600 transition-colors p-1 flex-shrink-0"
                                        title="Remove certificate"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
