import React from 'react';
import { User, Upload } from 'lucide-react';



export default function BasicInfoStep({
    freelancerData,
    errors,
    handleInputChange,
    handleImageUpload
}) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Basic Information</h2>
                <p className="text-white/70">Tell us about yourself</p>
            </div>

            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20">
                        {freelancerData.profileImage ? (
                            <img src={freelancerData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={32} className="text-white/50" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                        <Upload size={16} className="text-white" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={freelancerData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="John Doe"
                />
                {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-white/80 text-sm font-medium mb-2">Location</label>
                    <input
                        type="text"
                        name="locationName"
                        value={freelancerData.locationName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="New York, USA"
                    />
                    {errors.locationName && <p className="text-red-400 text-sm mt-1">{errors.locationName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Lat</label>
                        <input
                            type="text"
                            name="latitude"
                            value={freelancerData.latitude}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                            placeholder="40.7128"
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Lng</label>
                        <input
                            type="text"
                            name="longitude"
                            value={freelancerData.longitude}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                            placeholder="-74.0060"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-white/80 text-sm font-medium mb-2">About/Bio</label>
                <textarea
                    name="bio"
                    value={freelancerData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 resize-none transition-colors"
                    placeholder="Tell us about yourself, your experience, and what makes you unique..."
                />
                {errors.bio && <p className="text-red-400 text-sm mt-1">{errors.bio}</p>}
            </div>
        </div>
    );
}