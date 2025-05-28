import React from "react";
import PropTypes from "prop-types";

export default function RoleSelection({ selectedRole, onSelect, onContinue, loading }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Choose your account type</h2>
      <div className="space-y-4 mb-8">
        {["CLIENT", "FREELANCER"].map((role) => (
          <div
            key={role}
            className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${selectedRole === role
              ? "border-purple-500 bg-purple-500/20"
              : "border-white/20 hover:border-purple-300"
              }`}
            onClick={() => onSelect(role)}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === role ? "border-purple-500" : "border-white/60"
                  }`}
              >
                {selectedRole === role && (
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-white">
                  {role === "CLIENT" ? "I'm a client" : "I'm a freelancer"}
                </h3>
                <p className="text-sm text-purple-200">
                  {role === "CLIENT"
                    ? "Looking to hire talented professionals"
                    : "Looking for work and projects"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={onContinue}
          disabled={!selectedRole || loading}
          className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center font-medium transition-all transform hover:scale-105 ${!selectedRole || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

RoleSelection.propTypes = {
  selectedRole: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
