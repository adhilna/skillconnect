import React from 'react';

export const FooterSection = () => {
    const categories = ['Design', 'Development', 'Marketing', 'Writing'];

    return (
        <footer className="relative z-10 px-6 py-8 bg-indigo-900/50 backdrop-blur-lg">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 className="font-bold mb-4">Categories</h4>
                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <a href="#" className="text-purple-300 hover:text-white">{cat}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">About</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-purple-300 hover:text-white">Careers</a></li>
                            <li><a href="#" className="text-purple-300 hover:text-white">Press</a></li>
                            <li><a href="#" className="text-purple-300 hover:text-white">Partnerships</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-purple-300 hover:text-white">Help Center</a></li>
                            <li><a href="#" className="text-purple-300 hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="text-purple-300 hover:text-white">FAQs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Follow Us</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-purple-300 hover:text-white">Instagram</a></li>
                            <li><a href="#" className="text-purple-300 hover:text-white">LinkedIn</a></li>
                            <li><a href="#" className="text-purple-300 hover:text-white">Twitter</a></li>
                        </ul>
                    </div>
                </div>
                <p className="text-center text-purple-300 text-sm">
                    &copy; {new Date().getFullYear()} FreelanceHub. All rights reserved.
                </p>
            </div>
        </footer>
    );
};