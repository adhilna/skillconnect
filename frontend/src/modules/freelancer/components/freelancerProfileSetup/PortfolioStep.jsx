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
                            {fieldErrors.portfolio?.[index]?.title && (
                                <p className="text-red-500 text-sm">{fieldErrors.portfolio[index].title}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">Description</label>
                            <textarea
                                value={item.description}
                                onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 resize-none min-h-[80px]"
                            />
                            {fieldErrors.portfolio?.[index]?.description && (
                                <p className="text-red-500 text-sm">{fieldErrors.portfolio[index].description}</p>
                            )}
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
                            {fieldErrors.portfolio?.[index]?.project_link && (
                                <p className="text-red-500 text-sm">{fieldErrors.portfolio[index].project_link}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
