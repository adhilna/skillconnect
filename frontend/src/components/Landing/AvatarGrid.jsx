import React from 'react';
import { Star, Sparkles } from 'lucide-react';

export const AvatarGrid = ({ freelancers, loading, InitialsAvatar }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {loading && (
                <div className="col-span-4 text-center text-purple-200">Loading users...</div>
            )}
            {freelancers.map((user, index) => (
                <div
                    key={user.id}
                    className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
                    style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                >
                    {/* Online Status */}
                    <div className={`absolute top-2 right-2 w-3 h-3 ${user.is_available ? 'bg-green-400' : 'bg-gray-400'} rounded-full border-2 border-white animate-pulse`}></div>
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-3">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-16 h-16 rounded-full border-3 border-white shadow-lg object-cover"
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <InitialsAvatar name={user.name} id={user.id} size={64} />
                            )}
                            {/* Stats or badge placeholder */}
                            <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> {/* Or drop Star icon if you want */}
                                <span className="font-semibold">{user.projects}</span>
                            </div>
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-1 truncate">{user.name}</h3>
                        <p className="text-purple-200 text-xs mb-2">{user.title}</p>
                        {/* Optional: Short bio */}
                        {/* <div className="text-purple-300 text-xs line-clamp-2">{user.bio}</div> */}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end justify-center pb-3">
                        <button className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                            View Profile
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
