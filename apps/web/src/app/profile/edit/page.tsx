"use client";
import { useState } from "react";

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    bio: "",
    profile_picture: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/profiles/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Edit Profile</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={profile.name}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={profile.age}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={profile.gender}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={profile.bio}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="profile_picture"
          placeholder="Profile Picture URL"
          value={profile.profile_picture}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
