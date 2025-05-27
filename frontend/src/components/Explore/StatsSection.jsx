export const StatsSection = () => (
    <div className="relative z-10 px-6 py-8 bg-white/5 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
                <div className="text-3xl font-bold text-white mb-2">50K+</div>
                <div className="text-purple-300">Active Services</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-white mb-2">25K+</div>
                <div className="text-purple-300">Freelancers</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-white mb-2">100K+</div>
                <div className="text-purple-300">Projects Completed</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-white mb-2">4.9★</div>
                <div className="text-purple-300">Average Rating</div>
            </div>
        </div>
    </div>
);