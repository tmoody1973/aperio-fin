import React from "react";
import { motion } from "framer-motion";
import { useAuth } from '../../hooks/useAuth';

const PersonalizedHero = ({ userPersona = 'financial_newbie', currentStreak = 7 }) => {
  const { user } = useAuth();

  // Get user's first name from metadata or email
  const firstName = user?.user_metadata?.first_name ||
                   user?.email?.split('@')[0]?.split('.')[0] ||
                   'there';

  // Persona-specific messaging
  const personaConfig = {
    financial_newbie: {
      greeting: `Welcome back, ${firstName}!`,
      dailyGoal: "Complete your 7-day learning streak today",
      motivation: "You're building financial confidence every day",
      bgGradient: "from-green-50 to-emerald-50",
      accentColor: "text-emerald-700",
      progressColor: "bg-emerald-500"
    },
    busy_professional: {
      greeting: `Good morning, ${firstName}`,
      dailyGoal: "Stay updated with today's 3-minute tech brief",
      motivation: "Efficient insights for smart professionals",
      bgGradient: "from-blue-50 to-cyan-50",
      accentColor: "text-blue-700",
      progressColor: "bg-blue-500"
    },
    curious_learner: {
      greeting: `Hello ${firstName}!`,
      dailyGoal: "Discover today's economic connections",
      motivation: "Understanding the world through financial lens",
      bgGradient: "from-purple-50 to-violet-50",
      accentColor: "text-purple-700",
      progressColor: "bg-purple-500"
    }
  };

  const config = personaConfig[userPersona] || personaConfig.financial_newbie;

  // Time-based recommendations
  const currentHour = new Date().getHours();
  const getTimeBasedContent = () => {
    if (currentHour < 9) {
      return "Start your day with financial insights";
    } else if (currentHour < 12) {
      return "Perfect time for a learning break";
    } else if (currentHour < 17) {
      return "Afternoon knowledge boost";
    } else {
      return "Evening learning session";
    }
  };

  return (
    <div className={`bg-gradient-to-r ${config.bgGradient} border border-gray-200 rounded-2xl p-8 mb-8`}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          {/* Welcome Message */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className={`text-2xl lg:text-3xl font-bold ${config.accentColor} mb-2`}
            >
              {config.greeting}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-gray-600 mb-1"
            >
              {config.dailyGoal}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-gray-500"
            >
              {getTimeBasedContent()} • {config.motivation}
            </motion.p>
          </div>

          {/* Progress & Quick Stats */}
          <div className="flex items-center gap-6">
            {/* Streak Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center"
            >
              <div className="relative">
                <div className={`w-16 h-16 ${config.progressColor} rounded-full flex items-center justify-center mb-2`}>
                  <span className="text-white text-xl font-bold">{currentStreak}</span>
                </div>
                <div className="absolute -top-1 -right-1">
                  <span className="text-lg">🔥</span>
                </div>
              </div>
              <div className="text-xs font-medium text-gray-600">Day Streak</div>
            </motion.div>

            {/* Today's Progress */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="text-xs font-medium text-gray-600">Today's Goal</div>
            </motion.div>

            {/* Quick Action */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button className="quick-action-btn quick-action-btn--primary px-6 py-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-6V9a2 2 0 00-2-2H5a2 2 0 00-2 2v1m0 4h18v4a2 2 0 01-2 2H5a2 2 0 01-2 2v-4z" />
                </svg>
                Start Today's Brief
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Weekly Progress</span>
            <span>{currentStreak}/7 days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`${config.progressColor} h-2 rounded-full`}
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStreak / 7) * 100}%` }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Quick Navigation Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-wrap gap-2 mt-6"
        >
          <button className="quick-action-btn text-xs">
            📈 Resume Last Episode
          </button>
          <button className="quick-action-btn text-xs">
            🔖 Saved for Later
          </button>
          <button className="quick-action-btn text-xs">
            ⚙️ Adjust Preferences
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalizedHero;