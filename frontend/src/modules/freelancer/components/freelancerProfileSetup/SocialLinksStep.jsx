import React from "react";

export default function SocialLinkStep({
    socialLinks,
    handleInputChange
}) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Social Links</h2>
                <p className="text-white/70">Connect your professional profiles</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">LinkedIn</label>
                    <input
                        type="url"
                        name="socialLinks.linkedin"
                        value={socialLinks.linkedin || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="https://linkedin.com/in/yourprofile"
                    />
                </div>
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">GitHub</label>
                    <input
                        type="url"
                        name="socialLinks.github"
                        value={socialLinks.github || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="https://github.com/yourusername"
                    />
                </div>
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Twitter</label>
                    <input
                        type="url"
                        name="socialLinks.twitter"
                        value={socialLinks.twitter || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="https://twitter.com/yourusername"
                    />
                </div>
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Facebook</label>
                    <input
                        type="url"
                        name="socialLinks.facebook"
                        value={socialLinks.facebook || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="https://facebook.com/yourusername"
                    />
                </div>
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Intsagram</label>
                    <input
                        type="url"
                        name="socialLinks.instagram"
                        value={socialLinks.instagram || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="https://instagram.com/yourusername"
                    />
                </div>
            </div>
        </div>
    );
}