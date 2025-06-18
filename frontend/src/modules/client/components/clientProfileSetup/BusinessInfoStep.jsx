import React from 'react';
import { User, Upload } from 'lucide-react';
import CityAutocomplete from '../../../../components/Shared/CityAutoComplete';

export default function BusinessInfoStep({
    clientData,
    errors,
    industries,
    companySizes,
    handleInputChange,
    handleImageUpload,
    profileImage
}) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {clientData.accountType === 'business' ? 'Business Information' : 'Personal Information'}
                </h2>
                <p className="text-white/70">Help us understand your background</p>
            </div>

            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={32} className="text-white/50" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 cursor-pointer hover:bg-green-600 transition-colors">
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

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={clientData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={clientData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                </div>
            </div>

            {clientData.accountType === 'business' && (
                <>
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={clientData.companyName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                            placeholder="Acme Corporation"
                        />
                        {errors.companyName && <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Industry</label>
                            <select
                                name="industry"
                                value={clientData.industry}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                            >
                                <option value="" className="bg-gray-800">Select industry</option>
                                {industries.map(industry => (
                                    <option key={industry} value={industry} className="bg-gray-800">{industry}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Company Size</label>
                            <select
                                name="companySize"
                                value={clientData.companySize}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                            >
                                <option value="" className="bg-gray-800">Select size</option>
                                {companySizes.map(size => (
                                    <option key={size} value={size} className="bg-gray-800">{size}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Website (Optional)</label>
                        <input
                            type="url"
                            name="website"
                            value={clientData.website}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                            placeholder="https://www.company.com"
                        />
                    </div>
                </>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Location</label>
                    <CityAutocomplete
                        value={clientData.location}
                        onChange={handleInputChange}
                        onBlur={() => { }} // Add your onBlur logic if needed
                        errors={errors}
                    />
                </div>
            </div>

            <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                    {clientData.accountType === 'business' ? 'Company Description' : 'About You'}
                </label>
                <textarea
                    name="companyDescription"
                    value={clientData.companyDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 resize-none transition-colors"
                    placeholder={clientData.accountType === 'business'
                        ? "Tell us about your company and what you do..."
                        : "Tell us about yourself and your needs..."
                    }
                />
            </div>
        </div>
    )
}