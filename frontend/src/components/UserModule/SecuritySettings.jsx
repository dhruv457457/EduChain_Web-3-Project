import React from 'react';

const SecuritySettings = () => {
  return (
    <div className="bg-[#16192E] p-8 rounded-lg border border-gray-700/50 text-white">
      <h2 className="text-2xl font-bold mb-4">Security</h2>
      <p className="text-gray-400">
        Manage your account's security settings, such as two-factor authentication and connected devices.
      </p>
       {/* Placeholder for security options */}
       <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-md">
          <p className="font-medium">Two-Factor Authentication (2FA)</p>
          <button className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary_hover transition">Enable</button>
        </div>
        <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-md">
          <p className="font-medium">Password</p>
          <button className="px-4 py-2 text-sm font-semibold bg-gray-700 text-white rounded-md hover:bg-gray-600 transition">Change</button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;