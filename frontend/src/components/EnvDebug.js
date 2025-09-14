import React from 'react';

export default function EnvDebug() {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  return (
    <div className="p-4 bg-gray-100 rounded-lg text-xs">
      <h3 className="font-bold mb-2">Environment Variables Debug:</h3>
      <div className="space-y-1">
        <div>
          <strong>REACT_APP_SUPABASE_URL:</strong>{' '}
          {supabaseUrl ? '✅ Loaded' : '❌ Missing'}
          {supabaseUrl && <span className="text-gray-600 ml-2">({supabaseUrl.substring(0, 30)}...)</span>}
        </div>
        <div>
          <strong>REACT_APP_SUPABASE_ANON_KEY:</strong>{' '}
          {supabaseKey ? '✅ Loaded' : '❌ Missing'}
          {supabaseKey && <span className="text-gray-600 ml-2">(Key length: {supabaseKey.length})</span>}
        </div>
        <div className="mt-2 text-gray-600">
          NODE_ENV: {process.env.NODE_ENV}
        </div>
      </div>
    </div>
  );
}