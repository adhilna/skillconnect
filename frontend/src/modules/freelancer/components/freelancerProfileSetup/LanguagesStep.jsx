import React from 'react';
import { Plus, Languages, Trash2 } from 'lucide-react';
export default function LanguagesStep({
    freelancerData,
    languageOptions,
    proficiencyLevels,
    addLanguage,
    updateLanguage,
    removeLanguage,
    fieldErrors
}) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-lg font-medium flex items-center text-white">
                    <Languages className="mr-2 flex-shrink-0" />
                    Languages
                </h2>
                <p className="text-white/70 text-sm sm:text-base order-last sm:order-none">
                    What languages do you speak?
                </p>
                <button
                    type="button"
                    onClick={addLanguage}
                    className="flex items-center justify-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm w-full sm:w-auto"
                >
                    <Plus size={16} className="flex-shrink-0" /> Add Language
                </button>
            </div>
            {fieldErrors.languages && typeof fieldErrors.languages === "string" && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.languages}</p>
            )}

            {freelancerData.languages.map((lang, index) => (
                <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-3 sm:p-4 mb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <h4 className="text-white font-medium">Language #{index + 1}</h4>
                        <button
                            type="button"
                            onClick={() => removeLanguage(index)}
                            className="text-red-500 hover:text-red-400 self-start sm:self-auto"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">Language</label>
                            <select
                                value={lang.name}
                                onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-white appearance-none"
                            >
                                <option value="">Select a language</option>
                                {languageOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {fieldErrors.languages?.[index]?.name && (
                                <p className="text-red-500 text-sm">{fieldErrors.languages[index].name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">Proficiency</label>
                            <select
                                value={lang.proficiency}
                                onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-white appearance-none"
                            >
                                <option value="">Select proficiency</option>
                                {proficiencyLevels.map(level => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                            {fieldErrors.languages?.[index]?.proficiency && (
                                <p className="text-red-500 text-sm">{fieldErrors.languages[index].proficiency}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
