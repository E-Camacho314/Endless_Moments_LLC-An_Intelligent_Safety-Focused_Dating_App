'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './profileSetup.css';

export default function ProfileSetupPage() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: '',
    gender: '',
    preferredGender: '',
    pronouns: '',
    age: '',
    height: '',
    location: '',
    interests: '',
    children: '',
    lookingFor: '',
    education: '',
    occupation: '',
    q1: '',
    q2: '',
    q3: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile created:', profile);
    router.push('/profile');
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-box">
        <h1>Create Your Profile</h1>
        <p>Tell us a bit about yourself so Lyra can help you connect better.</p>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Name and Age */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Enter your name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              name="age"
              type="number"
              placeholder="Enter your age"
              value={profile.age}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender Info */}
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={profile.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other / Prefer not to say</option>
                  required
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Gender</label>
            <select
              name="preferredGender"
              value={profile.preferredGender}
              onChange={handleChange}
              required
            >
              <option value="">Select Preferred Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Any">Any</option>
              required
            </select>
          </div>

          {/* Pronouns & Height */}
          <div className="form-group">
            <label>Pronouns</label>
            <select name="pronouns" value={profile.pronouns} onChange={handleChange}>
              <option value="">Select Pronouns</option>
              <option value="He/Him">He/Him</option>
              <option value="She/Her">She/Her</option>
              <option value="They/Them">They/Them</option>
            </select>
          </div>

          <div className="form-group">
            <label>Height (in cm)</label>
            <input
              name="height"
              placeholder="e.g., 175"
              value={profile.height}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              placeholder="Enter your city or country"
              value={profile.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Interests */}
          <div className="form-group">
            <label>Interests</label>
            <select name="interests" value={profile.interests} onChange={handleChange}>
              <option value="">Select Your Interests</option>
              <option value="Fitness">Fitness</option>
              <option value="Music">Music</option>
              <option value="Art">Art</option>
              <option value="Tech">Technology</option>
              <option value="Travel">Travel</option>
              <option value="Cooking">Cooking</option>
          
            </select>
            required
          </div>

          {/* Children / Looking For */}
          <div className="form-group">
            <label>Children</label>
            <select name="children" value={profile.children} onChange={handleChange}>
              <option value="">Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Looking For</label>
            <select name="lookingFor" value={profile.lookingFor} onChange={handleChange}>
              <option value="">Select Option</option>
              <option value="Long-term">Long-term Relationship</option>
              <option value="Short-term">Short-term / Casual</option>
              <option value="Friendship">Friendship</option>
            </select>
          </div>

          {/* Education & Occupation */}
          <div className="form-group">
            <label>Education</label>
            <input
              name="education"
              placeholder="Enter your education level"
              value={profile.education}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Occupation</label>
            <input
              name="occupation"
              placeholder="Enter your job title or field"
              value={profile.occupation}
              onChange={handleChange}
            />
          </div>

          {/* Fun Questions */}
          <h3>✨ Quick Fun Questions</h3>

          <div className="form-group">
            <label>What's your perfect weekend?</label>
            <textarea
              name="q1"
              placeholder="Tell us about your ideal weekend"
              value={profile.q1}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>What makes you laugh?</label>
            <textarea
              name="q2"
              placeholder="Share what brings a smile to you"
              value={profile.q2}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>If you could travel anywhere, where would you go?</label>
            <textarea
              name="q3"
              placeholder="Dream destination?"
              value={profile.q3}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            Finish & Save
          </button>
        </form>
      </div>
    </div>
  );
}
