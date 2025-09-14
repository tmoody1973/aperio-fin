import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center p-8">
        {/* Logo/Icon Placeholder */}
        <div className="mb-8">
          <div className="text-4xl mb-4">📊 📈 📰</div>
          <h1 className="text-3xl font-bold text-aperio-blue font-serif">
            Aperio.fin
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            AI-Powered Financial Journalism
          </p>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <p className="text-gray-700 text-center leading-relaxed">
            Transform raw market data into compelling stories you'll actually understand
          </p>
        </div>

        {/* Coming Soon Button */}
        <div className="space-y-4">
          <button className="w-full bg-aperio-blue text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
            Coming Soon
          </button>

          <p className="text-sm text-gray-500">
            We're building the future of financial journalism
          </p>
        </div>

        {/* Development Status */}
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            🚀 Development Status: Day 1 Complete!
          </p>
          <p className="text-green-600 text-xs mt-1">
            React + Tailwind CSS + Project Structure ✅
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
