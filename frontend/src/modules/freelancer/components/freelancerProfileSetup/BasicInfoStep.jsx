import React from 'react';
import { User, Upload } from 'lucide-react';
import CityAutocomplete from '../../../../components/Shared/CityAutoComplete';
import CountryAutocomplete from '../../../../components/Shared/CountryAutocomplete';

export default function BasicInfoStep({
    freelancerData,
    fieldErrors,
    handleInputChange,
    handleImageUpload,
}) {
    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Basic Information</h2>
                <p className="text-white/70">Tell us about yourself</p>
            </div>

            <div className="flex justify-center mb-4 sm:mb-6">
                <div className="relative">
                    <label className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20 cursor-pointer">
                        {freelancerData.profile_picture_preview ? (
                            <img src={freelancerData.profile_picture_preview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={28} className="text-white/50 sm:hidden" />
                        )}
                        {!freelancerData.profile_picture_preview && (
                            <User size={32} className="text-white/50 hidden sm:block" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <Upload size={28} className="text-white absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 sm:p-2" />
                        {fieldErrors.profile_picture && (
                            <p className="text-red-400 text-xs sm:text-sm mt-1 text-center absolute top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                {fieldErrors.profile_picture}
                            </p>
                        )}
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={freelancerData.first_name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors text-sm sm:text-base"
                        placeholder="John"
                    />
                    {fieldErrors.first_name && <p className="text-red-400 text-xs sm:text-sm mt-1">{fieldErrors.first_name}</p>}
                </div>
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={freelancerData.last_name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors text-sm sm:text-base"
                        placeholder="Doe"
                    />
                    {fieldErrors.last_name && <p className="text-red-400 text-xs sm:text-sm mt-1">{fieldErrors.last_name}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="sm:col-span-1 lg:col-span-1">
                    <label className="block text-white/80 text-sm font-medium mb-2">Country</label>
                    <CountryAutocomplete
                        value={freelancerData.country || ''}
                        onChange={handleInputChange}
                        onBlur={() => { }}
                        errors={fieldErrors}
                    />
                </div>
                <div className="sm:col-span-1 lg:col-span-2">
                    <label className="block text-white/80 text-sm font-medium mb-2">City</label>
                    <CityAutocomplete
                        value={freelancerData.location || ''}
                        onChange={handleInputChange}
                        onBlur={() => { }}
                        fieldErrors={fieldErrors.location}
                    />
                </div>
                <div className="sm:col-span-1 lg:col-span-1">
                    <label className="block text-white/80 text-sm font-medium mb-2">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={freelancerData.age || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors text-sm sm:text-base"
                        placeholder="25"
                    />
                    {fieldErrors.age && <p className="text-red-400 text-xs sm:text-sm mt-1">{fieldErrors.age}</p>}
                </div>
            </div>

            <div>
                <label className="block text-white/80 text-sm font-medium mb-2">About/Bio</label>
                <textarea
                    name="about"
                    value={freelancerData.about || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 resize-none transition-colors text-sm sm:text-base"
                    placeholder="Tell us about yourself, your experience, and what makes you unique..."
                />
                {fieldErrors.about && <p className="text-red-400 text-xs sm:text-sm mt-1">{fieldErrors.about}</p>}
            </div>
        </div>
    )
}
