import React from 'react';

const NotificationSettings = () => {
  return (
    <div className="bg-[#16192E] p-8 rounded-lg border border-gray-700/50 text-white">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <p className="text-gray-400">
        Choose how you want to be notified about contract updates, transactions, and other platform activity.
      </p>
      {/* Placeholder for notification toggles */}
      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-md">
          <p className="font-medium">Email Notifications</p>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-md">
          <p className="font-medium">Push Notifications</p>
          <label className="switch">
            <input type="checkbox" defaultChecked/>
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* Basic CSS for the toggle switch */}
      <style>{`
        .switch { position: relative; display: inline-block; width: 40px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #4a5568; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
        input:checked + .slider { background-color: #4299e1; }
        input:checked + .slider:before { transform: translateX(16px); }
        .slider.round { border-radius: 34px; }
        .slider.round:before { border-radius: 50%; }
      `}</style>
    </div>
  );
};

export default NotificationSettings;