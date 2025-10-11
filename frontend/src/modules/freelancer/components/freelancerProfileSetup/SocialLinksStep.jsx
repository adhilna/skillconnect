import React from "react";
import { Link } from "lucide-react"; // Assuming you have a Link icon from lucide-react

export default function SocialLinkStep({
    socialLinks,
    handleInputChange,
    fieldErrors,
}) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h4 className="text-lg font-medium flex items-center justify-center text-white mb-2">
                    <Link className="mr-2 flex-shrink-0" />
                    Social Links
                </h4>
                <p className="text-white/70 text-sm sm:text-base">
                    Connect your professional profiles
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">GitHub URL</label>
                    <input
                        type="url"
                        name="social_links.github_url"
                        value={socialLinks.github_url}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    {fieldErrors.social_links?.github_url && (
                        <p className="text-red-500 text-sm">{fieldErrors.social_links.github_url}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">LinkedIn URL</label>
                    <input
                        type="url"
                        name="social_links.linkedin_url"
                        value={socialLinks.linkedin_url}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    {fieldErrors.social_links?.linkedin_url && (
                        <p className="text-red-500 text-sm">{fieldErrors.social_links.linkedin_url}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Twitter URL</label>
                    <input
                        type="url"
                        name="social_links.twitter_url"
                        value={socialLinks.twitter_url}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/username"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    {fieldErrors.social_links?.twitter_url && (
                        <p className="text-red-500 text-sm">{fieldErrors.social_links.twitter_url}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Facebook URL</label>
                    <input
                        type="url"
                        name="social_links.facebook_url"
                        value={socialLinks.facebook_url}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/username"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    {fieldErrors.social_links?.facebook_url && (
                        <p className="text-red-500 text-sm">{fieldErrors.social_links.facebook_url}</p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-white/80">Instagram URL</label>
                    <input
                        type="url"
                        name="social_links.instagram_url"
                        value={socialLinks.instagram_url}
                        onChange={handleInputChange}
                        placeholder="https://instagram.com/username"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                    />
                    {fieldErrors.social_links?.instagram_url && (
                        <p className="text-red-500 text-sm">{fieldErrors.social_links.instagram_url}</p>
                    )}
                </div>
                {typeof fieldErrors.social_links === "string" && (
                    <p className="text-red-500 text-sm mt-2">{fieldErrors.social_links}</p>
                )}

            </div>
        </div>
    );
};
