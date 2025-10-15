import React from 'react';
import { MapPin, Globe, Eye, Building, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientCard = ({ client }) => {
    const getInitials = (name) =>
        name?.split(' ').map(word => word[0]).join('').toUpperCase();

    return (
        <div className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6 hover:bg-white/10 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="relative flex-shrink-0">
                        {client.profilePicture ? (
                            <img
                                src={client.profilePicture}
                                alt={client.companyName}
                                className="w-16 h-16 rounded-xl object-cover shadow-lg ring-2 ring-white/10"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/10">
                                {getInitials(client.companyName)}
                            </div>
                        )}
                        {/* Status indicator for active clients */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 shadow-lg" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-white mb-1 truncate">{client.companyName}</h3>
                        <p className="text-white/60 text-sm truncate flex items-center">
                            <Building className="w-4 h-4 mr-1.5" />
                            {client.accountType === 'business' ? 'Business Client' : 'Personal Client'}
                        </p>

                    </div>
                </div>
                <div className="flex flex-col items-end space-y-2 w-full sm:w-auto">
                    <Link
                        to={`/freelancer/clients/${client.id}`}
                        state={{ from: 'browse' }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 text-sm justify-center group-hover:scale-105"
                    >
                        <Eye size={14} />
                        <span>View Profile</span>
                    </Link>
                    <div className="text-sm flex items-center font-medium text-green-200">
                        <Users size={14} className="mr-1.5" />
                        Active Client
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center text-white/60 text-sm">
                    <MapPin size={14} className="mr-1.5" />
                    <span className="truncate">{client.location}, {client.country}</span>
                </div>
                <div className="flex items-center text-white/60 text-sm">
                    <Globe size={14} className="mr-1.5" />
                    <span className="truncate">Global Operations</span>
                </div>
            </div>

            {/* Company description or additional info */}
            <p className="text-white/70 mb-4 text-sm line-clamp-2">
                Professional business client looking for quality freelance services.
                Committed to long-term partnerships and project success.
            </p>

            {/* Industry tags or company info */}
            <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 text-xs sm:text-sm rounded-lg font-medium border border-purple-500/20 hover:bg-purple-500/30 transition-colors">
                    Verified Client
                </span>
                <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs sm:text-sm rounded-lg font-medium border border-blue-500/20 hover:bg-blue-500/30 transition-colors">
                    Business
                </span>
                <span className="px-3 py-1.5 text-white/50 text-xs sm:text-sm font-medium bg-white/5 rounded-lg border border-white/10">
                    +2 more
                </span>
            </div>
        </div>
    );
};

const BrowseClientsSection = ({ clients, loading, error }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-white text-lg font-medium">Loading clients...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center space-y-6 p-8">
                <div className="text-red-500 text-6xl">⚠️</div>
                <div className="space-y-2">
                    <p className="text-red-400 text-xl font-semibold">{error}</p>
                    <p className="text-white/60">Something went wrong while loading clients</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!clients.length) {
        return (
            <div className="text-center space-y-6 p-8">
                <div className="text-white/40 text-6xl">🏢</div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">No clients found</h3>
                    <p className="text-white/60 italic">No clients are currently available to browse.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-white">
                    Explore{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                        Premium
                    </span>{' '}
                    Clients
                </h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                    Connect with verified business clients seeking quality freelance services
                </p>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {clients.map(client => (
                    <ClientCard key={client.id} client={client} />
                ))}
            </div>
        </div>
    );
};

export default BrowseClientsSection;