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
                <h4 className="text-lg font-medium flex items-center text-white">
                    <Languages className="mr-2 flex-shrink-0" />
                    Languages
                </h4>
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

            {fieldErrors.languages && (
                <p className="text-red-400 text-sm mb-2">{fieldErrors.languages}</p>
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
                        </div>
                    </div>
                </div>
            ))}

            {fieldErrors.languages && <p className="text-red-500 text-sm">{fieldErrors.languages}</p>}
        </div>
    );
};


//         <div className="space-y-6">
//             <div className="text-center">
//                 <h2 className="text-3xl font-bold text-white mb-2">Languages</h2>
//                 <p className="text-white/70">What languages do you speak?</p>
//             </div>

//             <div>
//                 <div className="flex items-center justify-between mb-3">
//                     <label className="block text-white/80 text-sm font-medium">Languages & Proficiency</label>
//                     <button
//                         onClick={addLanguage}
//                         className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
//                     >
//                         <Plus size={16} />
//                         Add Language
//                     </button>
//                 </div>
//                 {errors.languages && (
//                     <p className="text-red-400 text-sm mb-2">{errors.languages}</p>
//                 )}
//                 {freelancerData.languages.map((lang, index) => (
//                     <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4 mb-3">
//                         <div className="flex justify-between items-start mb-3">
//                             <h4 className="text-white font-medium">Language #{index + 1}</h4>
//                             <button
//                                 onClick={() => removeLanguage(index)}
//                                 className="text-red-400 hover:text-red-300"
//                             >
//                                 <X size={16} />
//                             </button>
//                         </div>
//                         <div className="grid grid-cols-2 gap-3">
//                             <select
//                                 value={lang.name}
//                                 onChange={(e) => updateLanguage(index, 'name', e.target.value)}
//                                 className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-blue-400"
//                             >
//                                 <option value="" className="bg-gray-800">Select Language</option>
//                                 {languageOptions.map(language => (
//                                     <option key={language} value={language} className="bg-gray-800">{language}</option>
//                                 ))}
//                             </select>
//                             {/* Validation error for language name */}
//                             {errors[`language_${index}_name`] && (
//                                 <p className="text-red-400 text-sm mt-1">{errors[`language_${index}_name`]}</p>
//                             )}
//                             <select
//                                 value={lang.proficiency}
//                                 onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
//                                 className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-blue-400"
//                             >
//                                 <option value="" className="bg-gray-800">Select Proficiency</option>
//                                 {proficiencyLevels.map(level => (
//                                     <option key={level} value={level} className="bg-gray-800">{level}</option>
//                                 ))}
//                             </select>
//                             {/* Validation error for proficiency */}
//                             {errors[`language_${index}_proficiency`] && (
//                                 <p className="text-red-400 text-sm mt-1">{errors[`language_${index}_proficiency`]}</p>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }