import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RoleSelectPage() {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleRegister = () => {
        navigate('/register', { state: { role: selectedRole } });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Choose Your Role
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Client Box */}
                    <div
                        onClick={() => handleRoleSelect('client')}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition ${selectedRole === 'client'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                    >
                        <svg
                            className="w-12 h-12 mx-auto mb-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-center">I’m a Client</h3>
                        <p className="text-gray-600 text-center mt-2">
                            Hire skilled freelancers for your projects.
                        </p>
                    </div>
                    {/* Freelancer Box */}
                    <div
                        onClick={() => handleRoleSelect('freelancer')}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition ${selectedRole === 'freelancer'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                    >
                        <svg
                            className="w-12 h-12 mx-auto mb-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-center">I’m a Freelancer</h3>
                        <p className="text-gray-600 text-center mt-2">
                            Offer your skills and find projects.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleRegister}
                    disabled={!selectedRole}
                    className={`w-full py-3 rounded-lg font-semibold transition ${selectedRole
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {selectedRole === 'client'
                        ? 'Join as a Client'
                        : selectedRole === 'freelancer'
                            ? 'Apply as a Freelancer'
                            : 'Select a Role'}
                </button>
            </div>
        </div>
    );
}

export default RoleSelectPage;