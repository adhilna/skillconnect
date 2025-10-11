import React from 'react';

export default function ProjectNeedsStep({
    clientData,
    errors,
    projectTypes,
    budgetRanges,
    businessGoals,
    challenges,
    handleArrayInput,
    handleInputChange
}) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Project Needs & Preferences</h2>
                <p className="text-white/70">Help us match you with the right freelancers</p>
            </div>

            <div>
                <label className="block text-white/80 text-sm font-medium mb-3">What type of projects do you typically hire for?</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {projectTypes.map(type => (
                        <div
                            key={type}
                            onClick={() => handleArrayInput('projectTypes', type)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all text-sm transform hover:scale-105 ${clientData.projectTypes.includes(type)
                                ? 'border-green-500 bg-green-500/20 text-green-300 shadow-lg shadow-green-500/20'
                                : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                                }`}
                        >
                            {type}
                        </div>
                    ))}
                </div>
                {errors.projectTypes && <p className="text-red-400 text-sm mt-1">{errors.projectTypes}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Typical Budget Range</label>
                    <select
                        name="budgetRange"
                        value={clientData.budgetRange}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                    >
                        <option value="" className="bg-gray-800">Select budget range</option>
                        {budgetRanges.map(range => (
                            <option key={range} value={range} className="bg-gray-800">{range}</option>
                        ))}
                    </select>
                    {errors.budgetRange && <p className="text-red-400 text-sm mt-1">{errors.budgetRange}</p>}
                </div>
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Project Frequency</label>
                    <select
                        name="projectFrequency"
                        value={clientData.projectFrequency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                    >
                        <option value="" className="bg-gray-800">How often do you hire?</option>
                        <option value="one-time" className="bg-gray-800">This is my first time</option>
                        <option value="weekly" className="bg-gray-800">Weekly</option>
                        <option value="monthly" className="bg-gray-800">Monthly</option>
                        <option value="quarterly" className="bg-gray-800">Quarterly</option>
                        <option value="annually" className="bg-gray-800">Annually</option>
                    </select>
                    {errors.projectFrequency && <p className="text-red-400 text-sm mt-1">{errors.projectFrequency}</p>}
                </div>
            </div>

            <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Working Hours Preference</label>
                <select
                    name="workingHours"
                    value={clientData.workingHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                >
                    <option value="" className="bg-gray-800">Select preference</option>
                    <option value="business-hours" className="bg-gray-800">Business hours (9 AM - 5 PM)</option>
                    <option value="flexible" className="bg-gray-800">Flexible hours</option>
                    <option value="24-7" className="bg-gray-800">24/7 availability needed</option>
                    <option value="overlap" className="bg-gray-800">Some timezone overlap required</option>
                </select>
                {errors.workingHours && <p className="text-red-400 text-sm mt-1">{errors.workingHours}</p>}
            </div>

            <div>
                <label className="block text-white/80 text-sm font-medium mb-3">Business Goals (Select all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {businessGoals.map(goal => (
                        <div
                            key={goal}
                            onClick={() => handleArrayInput('businessGoals', goal)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all text-sm transform hover:scale-105 ${clientData.businessGoals.includes(goal)
                                ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/20'
                                : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                                }`}
                        >
                            {goal}
                        </div>
                    ))}
                    {errors.businessGoals && <p className="text-red-400 text-sm mt-1">{errors.businessGoals}</p>}
                </div>
            </div>

            <div>
                <label className="block text-white/80 text-sm font-medium mb-3">Current Challenges (Select all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {challenges.map(challenge => (
                        <div
                            key={challenge}
                            onClick={() => handleArrayInput('currentChallenges', challenge)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all text-sm transform hover:scale-105 ${clientData.currentChallenges.includes(challenge)
                                ? 'border-orange-500 bg-orange-500/20 text-orange-300 shadow-lg shadow-orange-500/20'
                                : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                                }`}
                        >
                            {challenge}
                        </div>
                    ))}
                    {errors.currentChallenges && <p className="text-red-400 text-sm mt-1">{errors.currentChallenges}</p>}
                </div>
            </div>
        </div>
    );
}