import React from 'react';
import {Plus, X} from 'lucide-react';
export default function LanguagesStep({
  freelancerData,
  languageOptions,
  proficiencyLevels,
  addLanguage,
  updateLanguage,
  removeLanguage
}) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Languages</h2>
                <p className="text-white/70">What languages do you speak?</p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-white/80 text-sm font-medium">Languages & Proficiency</label>
                    <button
                        onClick={addLanguage}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        Add Language
                    </button>
                </div>
                {freelancerData.languages.map((lang, index) => (
                    <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4 mb-3">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-white font-medium">Language #{index + 1}</h4>
                            <button
                                onClick={() => removeLanguage(index)}
                                className="text-red-400 hover:text-red-300"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <select
                                value={lang.name}
                                onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-blue-400"
                            >
                                <option value="" className="bg-gray-800">Select Language</option>
                                {languageOptions.map(language => (
                                    <option key={language} value={language} className="bg-gray-800">{language}</option>
                                ))}
                            </select>
                            <select
                                value={lang.proficiency}
                                onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-blue-400"
                            >
                                <option value="" className="bg-gray-800">Select Proficiency</option>
                                {proficiencyLevels.map(level => (
                                    <option key={level} value={level} className="bg-gray-800">{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}