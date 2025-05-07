import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold">
                    SkillConnect
                </Link>
                <div className="space-x-4">
                    <Link to="/services" className="text-white hover:text-gray-200">
                        Services
                    </Link>
                    {user && user.email ? (
                        <>
                            {user.role === 'worker' && (
                                <Link to="/create-service" className="text-white hover:text-gray-200">
                                    Create Service
                                </Link>
                            )}
                            <button onClick={logout} className="text-white hover:text-gray-200">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="text-white hover:text-gray-200">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;