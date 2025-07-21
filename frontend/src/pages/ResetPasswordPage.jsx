import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ResetPasswordPage() {
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const query = useQuery();
    const uid = query.get("uid");
    const token = query.get("token");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!newPassword1 || !newPassword2) {
            setError("Please fill in both password fields.");
            return;
        }
        if (newPassword1 !== newPassword2) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await api.post("/api/v1/auth/password/reset/confirm/", {
                uid,
                token,
                new_password1: newPassword1,
                new_password2: newPassword2,
            });
            setSuccess("Password reset successful! You can now log in.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(
                err.response?.data?.new_password2?.[0] ||
                err.response?.data?.token?.[0] ||
                "Failed to reset password. The link may be invalid or expired."
            );
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 w-full max-w-md">
                <h2 className="text-xl font-bold text-white mb-6">Reset Password</h2>
                {success ? (
                    <div className="text-green-300">{success}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label className="block text-white mb-2">New Password</label>
                        <input
                            type="password"
                            className="w-full py-3 px-4 rounded-xl bg-white/20 text-white mb-4 outline-none"
                            value={newPassword1}
                            onChange={(e) => setNewPassword1(e.target.value)}
                            required
                        />
                        <label className="block text-white mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full py-3 px-4 rounded-xl bg-white/20 text-white mb-4 outline-none"
                            value={newPassword2}
                            onChange={(e) => setNewPassword2(e.target.value)}
                            required
                        />
                        {error && <div className="text-red-400 mb-3">{error}</div>}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
