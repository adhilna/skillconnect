import React from 'react';
import { Plus, X } from 'lucide-react';

export default function ProfessionalDetailsStep({
    freelancerData,
    errors,
    availableSkills,
    handleArrayInput,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation
}) {


    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Professional Details</h2>
                <p className="text-white/70">Showcase your skills and experience</p>
            </div>

            {/* Skills */}
            <div>
                <label className="block text-white/80 text-sm font-medium mb-3">Skills</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableSkills.map(skill => (
                        <div
                            key={skill}
                            onClick={() => handleArrayInput('skills', skill)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all text-sm transform hover:scale-105 ${freelancerData.skills.includes(skill)
                                ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20'
                                : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                                }`}
                        >
                            {skill}
                        </div>
                    ))}
                </div>
                {errors.skills && <p className="text-red-400 text-sm mt-1">{errors.skills}</p>}
            </div>

            {/* Experience */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-white/80 text-sm font-medium">Experience</label>
                    <button
                        onClick={addExperience}
                        className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        Add Experience
                    </button>
                </div>
                {freelancerData.experience.map((exp, index) => (
                    <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4 mb-3">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-white font-medium">Experience #{index + 1}</h4>
                            <button
                                onClick={() => removeExperience(index)}
                                className="text-red-400 hover:text-red-300"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                                type="text"
                                placeholder="Role/Position"
                                value={exp.role}
                                onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
                            />
                            <input
                                type="text"
                                placeholder="Company"
                                value={exp.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div className="flex gap-4 mb-3">
                            <div className="flex-1">
                                <label className="block text-white/80 text-sm mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={exp.start_date}
                                    onChange={e => updateExperience(index, 'start_date', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-white/80 text-sm mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={exp.end_date}
                                    onChange={e => updateExperience(index, 'end_date', e.target.value)}
                                    disabled={exp.ongoing}
                                    className={`w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 ${exp.ongoing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                <div className="flex items-center mt-1">
                                    <input
                                        type="checkbox"
                                        id={`ongoing-${index}`}
                                        checked={exp.ongoing}
                                        onChange={e => {
                                            updateExperience(index, 'ongoing', e.target.checked);
                                            if (e.target.checked) {
                                                updateExperience(index, 'end_date', ""); // Clear end_date if ongoing
                                            }
                                        }}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`ongoing-${index}`} className="text-white/70 text-sm">
                                        Ongoing
                                    </label>
                                </div>
                            </div>
                        </div>

                        <textarea
                            placeholder="Description of your role and achievements..."
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 resize-none"
                        />
                        <div className="mb-2">
                            <label className="block text-white/80 text-sm mb-1">Certificate (optional)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    id={`certificate-${index}`}
                                    className="hidden"
                                    onChange={e => updateExperience(index, 'certificate', e.target.files[0])}
                                />
                                <label
                                    htmlFor={`certificate-${index}`}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded cursor-pointer transition"
                                >
                                    {exp.certificate ? "Change Certificate" : "Add Certificate"}
                                </label>
                                {exp.certificate && (
                                    <span className="text-white/60 text-xs truncate max-w-[120px]">
                                        {exp.certificate.name}
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Education */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-white/80 text-sm font-medium">Education</label>
                    <button
                        onClick={addEducation}
                        className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        Add Education
                    </button>
                </div>
                {freelancerData.education.map((edu, index) => (
                    <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4 mb-3">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-white font-medium">Education #{index + 1}</h4>
                            <button
                                onClick={() => removeEducation(index)}
                                className="text-red-400 hover:text-red-300"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <input
                                type="text"
                                placeholder="Degree"
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
                            />
                            <input
                                type="text"
                                placeholder="College/University"
                                value={edu.college}
                                onChange={(e) => updateEducation(index, 'college', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
                            />
                            <input
                                type="number"
                                placeholder="Year"
                                value={edu.year}
                                onChange={(e) => updateEducation(index, 'year', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div className="mt-3">
                            <label className="block text-white/80 text-sm mb-1">Certificate (optional)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    id={`edu-certificate-${index}`}
                                    className="hidden"
                                    onChange={e => updateEducation(index, 'certificate', e.target.files[0])}
                                />
                                <label
                                    htmlFor={`edu-certificate-${index}`}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded cursor-pointer transition"
                                >
                                    {edu.certificate ? "Change Certificate" : "Add Certificate"}
                                </label>
                                {edu.certificate && (
                                    <span className="text-white/60 text-xs truncate max-w-[120px]">
                                        {edu.certificate.name}
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}