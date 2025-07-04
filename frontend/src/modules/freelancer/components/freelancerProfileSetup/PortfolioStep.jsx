import React from 'react';
import { Plus, Trash2, Folder } from 'lucide-react';

export default function PortfolioStep({
    portfolio,
    addPortfolioItem,
    updatePortfolioItem,
    removePortfolioItem,
    fieldErrors
}) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h4 className="text-lg font-medium flex items-center text-white">
                    <Folder className="mr-2 flex-shrink-0" />
                    Portfolio projects
                </h4>
                <p className="text-white/70 text-sm sm:text-base order-last sm:order-none">
                    Showcase your best work
                </p>
                <button
                    type="button"
                    onClick={addPortfolioItem}
                    className="flex items-center justify-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm w-full sm:w-auto"
                >
                    <Plus size={16} className="flex-shrink-0" /> Add Project
                </button>
            </div>

            {portfolio.map((item, index) => (
                <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-3 sm:p-4 mb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <h4 className="text-white font-medium">Project #{index + 1}</h4>
                        <button
                            type="button"
                            onClick={() => removePortfolioItem(index)}
                            className="text-red-500 hover:text-red-400 self-start sm:self-auto"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">Title</label>
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">Description</label>
                            <textarea
                                value={item.description}
                                onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 resize-none min-h-[80px]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">Project Link</label>
                            <input
                                type="url"
                                value={item.project_link}
                                onChange={(e) => updatePortfolioItem(index, 'project_link', e.target.value)}
                                placeholder="https://example.com"
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-green-400"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {fieldErrors.portfolio && <p className="text-red-500 text-sm">{fieldErrors.portfolio}</p>}
        </div>
    );
};


//         <div className="space-y-6">
//             <div className="text-center">
//                 <h2 className="text-3xl font-bold text-white mb-2">Portfolio</h2>
//                 <p className="text-white/70">Showcase your best work</p>
//             </div>

//             <div>
//                 <div className="flex items-center justify-between mb-3">
//                     <label className="block text-white/80 text-sm font-medium">Portfolio Items</label>
//                     <button
//                         onClick={addPortfolioItem}
//                         className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
//                     >
//                         <Plus size={16} />
//                         Add Portfolio Item
//                     </button>
//                 </div>
//                 {portfolio.map((item, index) => (
//                     <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4 mb-3">
//                         <div className="flex justify-between items-start mb-3">
//                             <h4 className="text-white font-medium">Portfolio Item #{index + 1}</h4>
//                             <button
//                                 onClick={() => removePortfolioItem(index)}
//                                 className="text-red-400 hover:text-red-300"
//                             >
//                                 <X size={16} />
//                             </button>
//                         </div>
//                         <div className="space-y-3">
//                             <input
//                                 type="text"
//                                 placeholder="Project Title"
//                                 value={item.title}
//                                 onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
//                                 className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
//                             />
//                             <textarea
//                                 placeholder="Project Description"
//                                 value={item.description}
//                                 onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
//                                 rows={3}
//                                 className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 resize-none"
//                             />
//                             <input
//                                 type="url"
//                                 placeholder="Project Link (https://...)"
//                                 value={item.link}
//                                 onChange={(e) => updatePortfolioItem(index, 'link', e.target.value)}
//                                 className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400"
//                             />
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }