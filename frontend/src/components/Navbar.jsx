import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-sm fixed w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                            SkillConnect
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-center space-x-8">
                                <Link to="/services" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Services</Link>
                                <span className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">How It Works</span>
                                <span className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Pricing</span>
                                <span className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">About Us</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user && user.email ? (
                            <>
                                {user.role === 'worker' && (
                                    <Link to="/create-service" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                                        Create Service
                                    </Link>
                                )}
                                <button onClick={logout} className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Login</Link>
                                <Link to="/register">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transform transition hover:-translate-y-0.5">
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg rounded-b-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/services" className="block text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium">Services</Link>
                        <div className="block text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium cursor-pointer">How It Works</div>
                        <div className="block text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium cursor-pointer">Pricing</div>
                        <div className="block text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium cursor-pointer">About Us</div>

                        {user && user.email ? (
                            <>
                                {user.role === 'worker' && (
                                    <Link to="/create-service" className="block text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium">
                                        Create Service
                                    </Link>
                                )}
                                <button onClick={logout} className="block w-full text-left text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium">
                                    Login
                                </Link>
                                <Link to="/register">
                                    <button className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-base font-medium mt-2">
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
