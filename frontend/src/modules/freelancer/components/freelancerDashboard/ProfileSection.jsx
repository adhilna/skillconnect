import React, { useState, useEffect, useContext } from 'react';
import { User } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';

// const ProfileSection = ({ profile }) => {

//   if (!profile) {
// return (
//   <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
//     <User size={48} className="text-white/30 mx-auto mb-4" />
//     <h4 className="text-xl font-semibold text-white mb-2">Profile Loading...</h4>
//     <p className="text-white/50 text-sm">Profile data is not available yet.</p>
//   </div>
// );
//   }

const ProfileSection = () => {
  const { token } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get('http://localhost:8000/api/v1/profiles/freelancer/profile-setup/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('Profile data:', res.data); // <-- Add this
        setProfileData(res.data[0]);
        setEditData(res.data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleAddItem = (field, newItem) => {
    setEditData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  const handleRemoveItem = (field, index) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const authtoken = token;
      const formData = new FormData();
      // Add profile_picture and certificates if changed (not shown here for brevity)
      formData.append('data', JSON.stringify(editData));
      await axios.put('http://localhost:8000/api/v1/profiles/freelancer/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authtoken}`,
        },
      });
      setProfileData(editData);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to save profile');
      console.error(err?.response?.data || err.message);
    }
  };

  if (loading) return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
      <User size={48} className="text-white/30 mx-auto mb-4" />
      <h4 className="text-xl font-semibold text-white mb-2">Profile Loading...</h4>
      <p className="text-white/50 text-sm">Profile data is not available yet.</p>
    </div>
  );
  if (!profileData) return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
      <User size={48} className="text-white/30 mx-auto mb-4" />
      <h4 className="text-xl font-semibold text-white mb-2">Profile Loading...</h4>
      <p className="text-white/50 text-sm">Profile data is not available yet.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Freelancer Profile</h3>
        {isEditing ? (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-700/20 hover:bg-gray-700/30 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-purple-600/20 hover:bg-purple-600/30 px-4 py-2 rounded-lg text-purple-400 hover:text-white transition-colors"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-600/20 hover:bg-purple-600/30 px-4 py-2 rounded-lg text-purple-400 hover:text-white transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <div className="space-y-4">
          {/* Personal Info */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Name:</span>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  value={editData.first_name}
                  onChange={e => handleInputChange('first_name', e.target.value)}
                  className="bg-white/10 text-white rounded px-2 py-1 w-32"
                />
                <input
                  value={editData.last_name}
                  onChange={e => handleInputChange('last_name', e.target.value)}
                  className="bg-white/10 text-white rounded px-2 py-1 w-32"
                />
              </div>
            ) : (
              <span className="text-white">{profileData.first_name} {profileData.last_name}</span>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">About:</span>
            {isEditing ? (
              <textarea
                value={editData.about}
                onChange={e => handleInputChange('about', e.target.value)}
                className="bg-white/10 text-white rounded px-2 py-1 flex-1 ml-2"
              />
            ) : (
              <span className="text-white">{profileData.about || 'Not set'}</span>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Age:</span>
            {isEditing ? (
              <input
                type="number"
                value={editData.age}
                onChange={e => handleInputChange('age', e.target.value)}
                className="bg-white/10 text-white rounded px-2 py-1 w-20"
              />
            ) : (
              <span className="text-white">{profileData.age || 'Not set'}</span>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Location:</span>
            {isEditing ? (
              <input
                value={editData.location}
                onChange={e => handleInputChange('location', e.target.value)}
                className="bg-white/10 text-white rounded px-2 py-1 flex-1 ml-2"
              />
            ) : (
              <span className="text-white">{profileData.location || 'Not set'}</span>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Available:</span>
            {isEditing ? (
              <select
                value={editData.is_available}
                onChange={e => handleInputChange('is_available', e.target.value === 'true')}
                className="bg-white/10 text-white rounded px-2 py-1"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : (
              <span className="text-white">{profileData.is_available ? 'Yes' : 'No'}</span>
            )}
          </div>

          {/* Skills */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Skills:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {isEditing ? (
                <div className="w-full">
                  {editData.skills?.map((skill, idx) => (
                    <div key={skill.id || idx} className="flex gap-2 mb-2 items-center">
                      <input
                        value={skill.name}
                        onChange={e => handleArrayChange('skills', idx, { ...skill, name: e.target.value })}
                        className="bg-white/10 text-white rounded px-2 py-1 flex-1"
                      />
                      <button
                        onClick={() => handleRemoveItem('skills', idx)}
                        className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddItem('skills', { id: Date.now(), name: '' })}
                    className="bg-green-500/20 hover:bg-green-500/30 px-2 py-1 rounded text-green-300 text-sm mt-2"
                  >
                    Add Skill
                  </button>
                </div>
              ) : (
                profileData.skills?.map((skill, idx) => (
                  <span key={skill.id || idx} className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm">
                    {skill.name}
                  </span>
                ))
              )}
            </div>
          </div>


          {/* Educations */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Educations:</span>
            <div className="space-y-2 mt-2">
              {isEditing ? (
                <div className="space-y-2">
                  {editData.educations?.map((edu, idx) => (
                    <div key={edu.id || idx} className="flex flex-col gap-2 p-2 bg-white/5 rounded border border-white/10">
                      <input
                        value={edu.college || edu.institution}
                        onChange={e => handleArrayChange('educations', idx, { ...edu, college: e.target.value, institution: e.target.value })}
                        placeholder="Institution"
                        className="bg-white/10 text-white rounded px-2 py-1"
                      />
                      <input
                        value={edu.degree}
                        onChange={e => handleArrayChange('educations', idx, { ...edu, degree: e.target.value })}
                        placeholder="Degree"
                        className="bg-white/10 text-white rounded px-2 py-1"
                      />
                      <input
                        value={edu.year}
                        onChange={e => handleArrayChange('educations', idx, { ...edu, year: e.target.value })}
                        placeholder="Year"
                        className="bg-white/10 text-white rounded px-2 py-1"
                      />
                      <button
                        onClick={() => handleRemoveItem('educations', idx)}
                        className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-sm self-end"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddItem('educations', { id: Date.now(), college: '', degree: '', year: '' })}
                    className="bg-green-500/20 hover:bg-green-500/30 px-2 py-1 rounded text-green-300 text-sm"
                  >
                    Add Education
                  </button>
                </div>
              ) : (
                profileData.educations?.map((edu) => (
                  <div key={edu.id} className="flex flex-col">
                    <span className="text-white">{edu.college || edu.institution}</span>
                    <span className="text-white/60 text-sm">{edu.degree} ({edu.year})</span>
                  </div>
                ))
              )}
            </div>
          </div>


          {/* Experiences */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Experiences:</span>
            <div className="space-y-2 mt-2">
              {isEditing ? (
                <div className="space-y-2">
                  {editData.experiences?.map((exp, idx) => (
                    <div key={exp.id || idx} className="flex flex-col gap-2 p-2 bg-white/5 rounded border border-white/10">
                      <input
                        value={exp.company}
                        onChange={e => handleArrayChange('experiences', idx, { ...exp, company: e.target.value })}
                        placeholder="Company"
                        className="bg-white/10 text-white rounded px-2 py-1"
                      />
                      <input
                        value={exp.position || exp.role}
                        onChange={e => handleArrayChange('experiences', idx, { ...exp, position: e.target.value, role: e.target.value })}
                        placeholder="Position"
                        className="bg-white/10 text-white rounded px-2 py-1"
                      />
                      <div className="flex gap-2">
                        <input
                          value={exp.start_date}
                          onChange={e => handleArrayChange('experiences', idx, { ...exp, start_date: e.target.value })}
                          placeholder="Start Date"
                          className="bg-white/10 text-white rounded px-2 py-1 flex-1"
                        />
                        <input
                          value={exp.end_date}
                          onChange={e => handleArrayChange('experiences', idx, { ...exp, end_date: e.target.value })}
                          placeholder="End Date"
                          className="bg-white/10 text-white rounded px-2 py-1 flex-1"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveItem('experiences', idx)}
                        className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-sm self-end"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddItem('experiences', { id: Date.now(), company: '', position: '', start_date: '', end_date: '' })}
                    className="bg-green-500/20 hover:bg-green-500/30 px-2 py-1 rounded text-green-300 text-sm"
                  >
                    Add Experience
                  </button>
                </div>
              ) : (
                profileData.experiences?.map((exp) => (
                  <div key={exp.id} className="flex flex-col">
                    <span className="text-white">{exp.company}</span>
                    <span className="text-white/60 text-sm">
                      {exp.position || exp.role} (
                      {new Date(exp.start_date).getFullYear()}–
                      {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                      )
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>


          {/* Languages */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Languages:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {isEditing ? (
                <div className="w-full">
                  {editData.languages?.map((lang, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-center">
                      <input
                        value={lang.language}
                        onChange={e => handleArrayChange('languages', idx, { ...lang, language: e.target.value })}
                        placeholder="Language"
                        className="bg-white/10 text-white rounded px-2 py-1 flex-1"
                      />
                      <input
                        value={lang.proficiency}
                        onChange={e => handleArrayChange('languages', idx, { ...lang, proficiency: e.target.value })}
                        placeholder="Proficiency"
                        className="bg-white/10 text-white rounded px-2 py-1 flex-1"
                      />
                      <button
                        onClick={() => handleRemoveItem('languages', idx)}
                        className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddItem('languages', { language: '', proficiency: '' })}
                    className="bg-green-500/20 hover:bg-green-500/30 px-2 py-1 rounded text-green-300 text-sm mt-2"
                  >
                    Add Language
                  </button>
                </div>
              ) : (
                profileData.languages?.map((lang, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                    {lang.language} ({lang.proficiency})
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Portfolios */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Portfolios:</span>
            <div className="space-y-2 mt-2">
              {isEditing ? (
                <div className="space-y-2">
                  {editData.portfolios?.map((pf, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-2 bg-white/5 rounded border border-white/10">
                      <input
                        value={pf.title}
                        onChange={e => handleArrayChange('portfolios', idx, { ...pf, title: e.target.value })}
                        placeholder="Title"
                        className="bg-white/10 text-white rounded px-2 py-1"
                      />
                      <input
                        value={pf.link}
                        onChange={e => handleArrayChange('portfolios', idx, { ...pf, link: e.target.value })}
                        placeholder="Link"
                        className="bg-white/10 text-white rounded px-2 py-1"
                      />
                      <button
                        onClick={() => handleRemoveItem('portfolios', idx)}
                        className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-sm self-end"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddItem('portfolios', { title: '', link: '' })}
                    className="bg-green-500/20 hover:bg-green-500/30 px-2 py-1 rounded text-green-300 text-sm"
                  >
                    Add Portfolio
                  </button>
                </div>
              ) : (
                profileData.portfolios?.map((pf, idx) => (
                  <a key={idx} href={pf.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm">
                    {pf.title || pf.link}
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Social Links:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {isEditing ? (
                <div className="w-full">
                  {editData.social_links?.map((social, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-center">
                      <input
                        value={social.platform}
                        onChange={e => handleArrayChange('social_links', idx, { ...social, platform: e.target.value })}
                        placeholder="Platform"
                        className="bg-white/10 text-white rounded px-2 py-1 flex-1"
                      />
                      <input
                        value={social.link}
                        onChange={e => handleArrayChange('social_links', idx, { ...social, link: e.target.value })}
                        placeholder="Link"
                        className="bg-white/10 text-white rounded px-2 py-1 flex-1"
                      />
                      <button
                        onClick={() => handleRemoveItem('social_links', idx)}
                        className="bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddItem('social_links', { platform: '', link: '' })}
                    className="bg-green-500/20 hover:bg-green-500/30 px-2 py-1 rounded text-green-300 text-sm mt-2"
                  >
                    Add Social Link
                  </button>
                </div>
              ) : (
                profileData.social_links?.map((social, idx) => (
                  <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-green-500/20 rounded-full text-green-300 text-sm">
                    {social.platform}
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Verifications */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-white/80">Verifications:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-3 py-1 ${profileData.email_verified ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'} rounded-full text-sm`}>
                Email {profileData.email_verified ? '✓' : '✗'}
              </span>
              <span className={`px-3 py-1 ${profileData.phone_verified ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'} rounded-full text-sm`}>
                Phone {profileData.phone_verified ? '✓' : '✗'}
              </span>
              <span className={`px-3 py-1 ${profileData.id_verified ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'} rounded-full text-sm`}>
                ID {profileData.id_verified ? '✓' : '✗'}
              </span>
              <span className={`px-3 py-1 ${profileData.video_verified ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'} rounded-full text-sm`}>
                Video {profileData.video_verified ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



};

export default ProfileSection;
