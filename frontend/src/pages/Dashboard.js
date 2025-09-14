import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { FinancialDashboardGrid } from '../components/FinancialDashboardGrid';
import PersonalizedHero from '../components/Dashboard/PersonalizedHero';
import DebugDashboard from '../components/Dashboard/DebugDashboard';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-clean">
      {/* Clean Header */}
      <header className="clean-header">
        <div className="premium-container">
          <nav className="premium-nav">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="premium-logo">
                Aperio.fin
              </Link>
              <div className="nav-pills">
                <Link to="/dashboard" className="nav-pill nav-pill--active">Dashboard</Link>
                <Link to="/articles" className="nav-pill">Articles</Link>
                <Link to="/market" className="nav-pill">Market</Link>
                <Link to="/ai-studio" className="nav-pill">AI Studio</Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="body-sans text-sm" style={{ color: 'var(--gray-600)' }}>
                {user?.user_metadata?.first_name || user?.email?.split('@')[0]}
              </div>
              <button
                onClick={handleSignOut}
                className="btn-clean"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="premium-container animate-fade-in-up" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Debug Component */}
        <DebugDashboard />

        {/* Personalized Hero Section */}
        <PersonalizedHero userPersona="financial_newbie" currentStreak={7} />

        {/* Interactive Financial Dashboard */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="subheading text-center mb-3" style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--gray-500)', textTransform: 'none', letterSpacing: 'normal' }}>
              Featured Content
            </h2>
            <p className="headline-secondary text-center max-w-2xl mx-auto text-balance">
              Discover our latest deep dive analysis and explore interactive financial content formats.
            </p>
          </div>

          {/* Modern Interactive Grid */}
          <FinancialDashboardGrid />
        </section>

        {/* Simple Status Footer */}
        <footer className="mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="body-text mb-6 text-balance">
              Your AI-powered financial journalism platform is ready for professional content creation.
              Advanced market intelligence and multi-voice storytelling tools are fully operational.
            </p>

            {/* Minimal Status Indicators */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="meta-text">All Systems Live</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="meta-text">AI Models Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="meta-text">Market Data Live</span>
              </div>
            </div>

            <div className="caption text-center">
              Premium Financial Intelligence Platform
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}