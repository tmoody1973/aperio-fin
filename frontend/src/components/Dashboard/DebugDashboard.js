import React from "react";

const DebugDashboard = () => {
  return (
    <div className="p-8 bg-red-50 border border-red-200 rounded-lg m-4">
      <h2 className="text-xl font-bold text-red-800 mb-4">Dashboard Debug Info</h2>
      <div className="space-y-2 text-sm">
        <p><strong>Component:</strong> DebugDashboard is rendering</p>
        <p><strong>Location:</strong> /components/Dashboard/DebugDashboard.js</p>
        <p><strong>Status:</strong> If you see this, the Dashboard components directory is working</p>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">
            <strong>Issue:</strong> The dashboard should show persona cards, not a news website.
            This suggests either:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-yellow-700">
            <li>You're on the wrong URL (should be /dashboard)</li>
            <li>There's a JavaScript error preventing the real dashboard from loading</li>
            <li>A routing issue is redirecting to a different page</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugDashboard;