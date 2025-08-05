import React from 'react';

const ProfileSettings = () => {
  return (
    <div className="bg-[#16192E] p-8 rounded-lg border border-gray-700/50 text-white">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      <p className="text-gray-400">
        This is where users will be able to update their profile information, such as their display name, bio, and profile picture.
      </p>
      {/* Placeholder for form elements */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Display Name</label>
          <input
            type="text"
            placeholder="Your display name"
            className="mt-1 w-full p-3 rounded-md bg-gray-900/50 text-white border border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Bio</label>
          <textarea
            placeholder="Tell us about yourself"
            rows="3"
            className="mt-1 w-full p-3 rounded-md bg-gray-900/50 text-white border border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;