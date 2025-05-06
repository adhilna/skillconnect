import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";



function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <>
            <nav className="bg-blue-600 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-white text-xl font-bold">
                        SkillConnect
                    </Link>
                    <div>
                        {user ? (
                            <button onClick={logout} className="text-white">
                                Logout
                            </button>
                        ) : (
                            <Link to={"/login"} className="text-white">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
