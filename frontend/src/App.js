import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AudioPlayerProvider } from './components/PersistentAudioPlayer';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import ArticleView from './pages/ArticleView';
import CreateArticle from './pages/CreateArticle';
import MarketDashboard from './pages/MarketDashboard';
import ContentGeneration from './components/ContentGeneration';
import FinancialCharts from './components/FinancialCharts';
import EnhancedArticleGenerator from './components/EnhancedArticleGenerator';

function App() {
  return (
    <AuthProvider>
      <AudioPlayerProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles"
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/:slug"
            element={
              <ProtectedRoute>
                <ArticleView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-article"
            element={
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <MarketDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <ContentGeneration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charts"
            element={
              <ProtectedRoute>
                <FinancialCharts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <EnhancedArticleGenerator />
              </ProtectedRoute>
            }
          />

          {/* Default Route - redirect to dashboard if authenticated, otherwise login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </Router>
      </AudioPlayerProvider>
    </AuthProvider>
  );
}

export default App;
