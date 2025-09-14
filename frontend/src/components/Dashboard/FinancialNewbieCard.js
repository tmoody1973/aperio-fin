import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BentoGridItem } from "../ui/bento-grid";

const FinancialNewbieCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const progressRing = {
    strokeDasharray: "251.2",
    strokeDashoffset: "125.6", // 50% progress
  };

  const progressPercent = 50;
  const currentDay = 7;

  const recentAchievements = [
    { name: "First Week", icon: "🏆", unlocked: true },
    { name: "Market Basics", icon: "📈", unlocked: true },
    { name: "Daily Streak", icon: "🔥", unlocked: false }
  ];

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Handle navigation or action
    }
  };

  return (
    <BentoGridItem
      className="persona-newbie-card accessible-card"
      icon={
        <div
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg"
          aria-hidden="true"
        >
          🎓
        </div>
      }
      title="Your Learning Journey"
      description="5-minute daily lessons designed for beginners. Build confidence with each completed brief."
      role="article"
      aria-labelledby="newbie-card-title"
      aria-describedby="newbie-card-description"
    >
      {/* Progress Ring */}
      <div className="flex items-center justify-center mb-4" role="region" aria-labelledby="progress-heading">
        <div className="sr-only" id="progress-heading">Learning Progress</div>
        <div
          className="relative w-16 h-16"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progressPercent}
          aria-label={`Learning progress: Day ${currentDay}, ${progressPercent}% complete`}
        >
          <svg
            className="w-16 h-16 transform -rotate-90 accessible-progress-ring"
            viewBox="0 0 80 80"
            aria-hidden="true"
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="var(--gray-200)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              stroke="#10b981"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: "251.2" }}
              animate={{ strokeDashoffset: "125.6" }}
              transition={{ duration: 1, delay: 0.3 }}
              style={progressRing}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700" aria-hidden="true">
              Day {currentDay}
            </span>
          </div>
        </div>
      </div>

      {/* Today's Brief */}
      <div className="mb-4" role="region" aria-labelledby="todays-brief-heading">
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h4 id="todays-brief-heading" className="text-sm font-semibold text-green-800">
              Today's Learn Mode Brief
            </h4>
            <span
              className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full"
              aria-label="Estimated duration: 5 minutes"
            >
              5 min
            </span>
          </div>
          <p className="text-xs text-green-700">Understanding Stock Market Basics</p>
        </div>
      </div>

      {/* Achievement Badges */}
      <ul
        className="flex justify-between items-center mb-4 list-none p-0"
        role="list"
        aria-labelledby="achievements-heading"
      >
        <div className="sr-only" id="achievements-heading">Recent Achievements</div>
        <div className="sr-only" aria-live="polite" id="achievement-announcements"></div>
        {recentAchievements.map((achievement, idx) => (
          <li key={achievement.name} className="list-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.5 }}
              className={`text-center interactive-element ${
                achievement.unlocked ? 'opacity-100' : 'opacity-30'
              }`}
              role="button"
              tabIndex={achievement.unlocked ? 0 : -1}
              aria-label={`Achievement: ${achievement.name} ${
                achievement.unlocked ? 'completed' : 'not yet unlocked'
              }`}
              onKeyDown={handleKeyDown}
            >
              <div className="text-lg mb-1" aria-hidden="true">
                {achievement.icon}
              </div>
              <div className="text-xs font-medium text-gray-600">{achievement.name}</div>
            </motion.div>
          </li>
        ))}
      </ul>

      {/* Confidence Meter */}
      <div className="mb-4" role="region" aria-labelledby="confidence-heading">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span id="confidence-heading">Financial Confidence</span>
          <span aria-label="Status: Growing confidence">Growing!</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar"
             aria-label="Financial confidence level: 60% and growing"
             aria-valuemin="0"
             aria-valuemax="100"
             aria-valuenow="60">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "60%" }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </div>
      </div>

      {/* Learning Streak Widget */}
      <section role="region" aria-labelledby="streak-heading" className="mb-4">
        <h4 id="streak-heading" className="sr-only">Learning streak</h4>
        <div className="streak-counter" aria-live="polite" aria-label={`Learning streak: 7 days`}>
          <div className="streak-number">7</div>
          <div className="streak-label">Day streak</div>
        </div>
      </section>

      {/* CTA Button */}
      <div className="mt-auto">
        <Link
          to="/generate"
          className="btn-featured-primary accessible-button w-full text-center focus-visible-ring block"
          aria-describedby="newbie-card-description"
          onClick={(e) => {
            if (isLoading) {
              e.preventDefault();
            }
          }}
          aria-label="Continue Learning Path - Navigate to next lesson"
        >
          {isLoading ? (
            <span className="loading-skeleton" aria-label="Loading next lesson">
              Loading...
            </span>
          ) : (
            "Continue Learning Path"
          )}
        </Link>
        {error && (
          <div className="error-state mt-2 text-xs text-red-600" role="alert">
            {error}
          </div>
        )}
      </div>
    </BentoGridItem>
  );
};

export default FinancialNewbieCard;