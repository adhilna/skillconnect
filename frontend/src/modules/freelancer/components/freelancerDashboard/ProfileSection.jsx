import React from 'react';
import { User } from 'lucide-react';

const ProfileSection = ({ profile }) => {

  if (!profile) {
    return (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
        <User size={48} className="text-white/30 mx-auto mb-4" />
        <h4 className="text-xl font-semibold text-white mb-2">Profile Loading...</h4>
        <p className="text-white/50 text-sm">Profile data is not available yet.</p>
      </div>
    );
  }

  // Destructure and prepare data for display
  const {
    first_name,
    last_name,
    about,
    age,
    location,
    skills = [],
    is_available,
    educations = [],
    experiences = [],
    languages = [],
    portfolios = []
  } = profile;

  const fullName = `${first_name} ${last_name}`;
  const availableStatus = is_available ? "Available" : "Not Available";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Profile</h3>
        <div className="flex items-center space-x-2">
          <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
            <User size={16} />
            <span>Edit</span>
          </button>
        </div>
      </div>
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
            {first_name ? first_name.charAt(0) : "A"}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{fullName}</h3>
            <p className="text-white/70">Status: {availableStatus}</p>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-white/70">About</span>
            <span className="text-white">{about}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Age</span>
            <span className="text-white">{age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Location</span>
            <span className="text-white">{location}</span>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="font-medium text-white/80 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h4 className="font-medium text-white/80 mb-2">Education</h4>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <p className="text-white font-medium">{edu.degree}, {edu.college} ({edu.year})</p>
              {edu.certificate && (
                <a href={edu.certificate} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm">
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="mb-6">
          <h4 className="font-medium text-white/80 mb-2">Experience</h4>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <p className="text-white font-medium">{exp.role}, {exp.company}</p>
              <p className="text-white/70 text-sm">{exp.start_date} to {exp.end_date}</p>
              <p className="text-white/60 text-sm">{exp.description}</p>
              {exp.certificate && (
                <a href={exp.certificate} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm">
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="mb-6">
          <h4 className="font-medium text-white/80 mb-2">Languages</h4>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <span key={lang.id} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                {lang.name} ({lang.proficiency})
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-white/80 mb-2">Portfolio</h4>
          {portfolios.map((project) => (
            <div key={project.id} className="mb-3">
              <p className="text-white font-medium">{project.title}</p>
              <p className="text-white/60 text-sm">{project.description}</p>
              {project.project_link && (
                <a href={project.project_link} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm">
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
