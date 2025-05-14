import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

function SplashScreen() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-blue-600 flex items-center justify-center">
            <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />
            <div className="text-center text-white animate-fade-in">
                <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                <h1 className="text-3xl font-bold mb-4">
                    Congratulations, your account has been created!
                </h1>
                <p className="text-lg">Redirecting to homepage in 5 seconds...</p>
            </div>
        </div>
    );
}

export default SplashScreen;