import { useState } from "react";
import axios from "axios";


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await axios.post("http://localhost:8000/api/v1/auth/password/reset/", { email });
            setSubmitted(true);
        } catch (err) {
            setError(
                err.response?.data?.email?.[0] ||
                "Failed to send reset email. Please try again."
            );
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 w-full max-w-md">
                <h2 className="text-xl font-bold text-white mb-6">Forgot Password?</h2>
                {submitted ? (
                    <div className="text-green-300">
                        If the email exists, a reset link has been sent. Please check your inbox!
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label className="block text-white mb-2">Enter your email address</label>
                        <input
                            type="email"
                            className="w-full py-3 px-4 rounded-xl bg-white/20 text-white mb-4 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                        {error && <div className="text-red-400 mb-3">{error}</div>}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
