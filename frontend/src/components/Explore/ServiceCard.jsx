import { Heart, Star, Clock } from 'lucide-react';

export const ServiceCard = ({ service, isGridView, favorites, toggleFavorite }) => (
    <div className={`bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/20 transition-all transform hover:scale-105 hover:shadow-2xl group ${isGridView ? '' : 'flex'}`}>
        <div className={`relative ${isGridView ? 'h-48' : 'w-64 h-48'} overflow-hidden`}>
            <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <button
                onClick={() => toggleFavorite(service.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
                <Heart size={16} className={`${favorites.has(service.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            {service.featured && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs font-bold text-black">
                    Featured
                </div>
            )}
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-purple-500 rounded-full text-xs font-medium">
                {service.level}
            </div>
        </div>

        <div className={`p-4 ${isGridView ? '' : 'flex-1'}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-300">{service.category}</span>
                <div className="flex items-center text-yellow-400">
                    <Star size={14} className="fill-current" />
                    <span className="ml-1 text-sm font-medium text-white">{service.rating}</span>
                    <span className="ml-1 text-xs text-purple-300">({service.reviews})</span>
                </div>
            </div>

            <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                {service.title}
            </h3>

            <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {service.seller[0]}
                </div>
                <span className="ml-2 text-sm text-purple-200">{service.seller}</span>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-purple-300">
                    <Clock size={14} className="mr-1" />
                    {service.delivery}
                </div>
                <div className="text-right">
                    <span className="text-sm text-purple-300">Starting at</span>
                    <div className="font-bold text-lg text-white">${service.price}</div>
                </div>
            </div>
        </div>
    </div>
);