import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BentoGridItem } from "../ui/bento-grid";

const CuriousLearnerCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const economicIndicators = [
    { name: "GDP Growth", value: "2.3%", trend: "stable" },
    { name: "Unemployment", value: "3.7%", trend: "down" },
    { name: "Inflation", value: "3.1%", trend: "up" }
  ];

  const communityDiscussion = {
    topic: "Why are interest rates affecting tech stocks?",
    responses: 23,
    trending: true
  };

  const historicalParallel = {
    title: "Similar to 1990s Tech Boom",
    relevance: "High"
  };

  return (
    <BentoGridItem
      className="persona-learner-card"
      icon={
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-lg">
          🔍
        </div>
      }
      title="Economic Insights"
      description="Discover how policy decisions shape markets. Connect economic theory to real-world impact."
    >
      {/* Today's Economic Lens */}
      <section role="region" aria-labelledby="economic-lens-heading" className="mb-4">
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h4 id="economic-lens-heading" className="text-sm font-semibold text-purple-800">Today's Economic Lens</h4>
            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full" aria-label="Estimated duration: 7 minutes">7 min</span>
          </div>
          <p className="text-xs text-purple-700">Federal Reserve Policy & Market Psychology</p>
        </div>
      </section>

      {/* Economic Indicators */}
      <section role="region" aria-labelledby="indicators-heading" className="mb-4">
        <h4 id="indicators-heading" className="text-xs font-medium text-gray-700 mb-2">Key Indicators This Week</h4>
        <div className="space-y-1" aria-live="polite">
          {economicIndicators.map((indicator, idx) => (
            <motion.div
              key={indicator.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex justify-between items-center text-xs"
              aria-label={`${indicator.name}: ${indicator.value}, trend ${indicator.trend}`}
            >
              <span className="text-gray-600">{indicator.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{indicator.value}</span>
                <div className={`w-2 h-2 rounded-full ${
                  indicator.trend === 'up' ? 'bg-red-400' :
                  indicator.trend === 'down' ? 'bg-green-400' : 'bg-gray-400'
                }`} aria-hidden="true"></div>
                <span className="sr-only">
                  {indicator.trend === 'up' ? 'trending up' :
                   indicator.trend === 'down' ? 'trending down' : 'stable'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Real-World Impact */}
      <section role="region" aria-labelledby="impact-heading" className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="impact-content"
          className="w-full text-left bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-2 border border-purple-100 hover:border-purple-200 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-purple-600"
        >
          <h4 id="impact-heading" className="text-xs font-medium text-purple-800 mb-1 flex items-center justify-between">
            Real-World Impact
            <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </h4>
          <div id="impact-content" className={`text-xs text-purple-600 ${isExpanded ? '' : 'line-clamp-1'}`}>
            How rising rates affect your mortgage, savings, and investments
          </div>
        </button>
      </section>

      {/* Community Discussion */}
      <section role="region" aria-labelledby="discussion-heading" className="mb-4">
        <div className="bg-gray-50 rounded-lg p-2 border border-gray-200" aria-live="polite">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 id="discussion-heading" className="text-xs font-medium text-gray-800 mb-1">{communityDiscussion.topic}</h4>
              <div className="text-xs text-gray-600">{communityDiscussion.responses} responses</div>
            </div>
            {communityDiscussion.trending && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full" aria-label="Trending discussion">Trending</span>
            )}
          </div>
        </div>
      </section>

      {/* Historical Parallel */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="font-medium text-gray-700">Historical Context</div>
            <div className="text-gray-600">{historicalParallel.title}</div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span className="text-amber-700 font-medium">{historicalParallel.relevance}</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-auto">
        <Link to="/generate" className="btn-featured-primary w-full text-center block">
          Explore Policy Impact
        </Link>
      </div>
    </BentoGridItem>
  );
};

export default CuriousLearnerCard;