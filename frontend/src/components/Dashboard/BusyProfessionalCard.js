import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BentoGridItem } from "../ui/bento-grid";

const BusyProfessionalCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSpeed, setCurrentSpeed] = useState("1.25x");

  const marketData = [
    { symbol: "S&P 500", value: "4,445", change: "+1.2%", positive: true },
    { symbol: "NASDAQ", value: "13,722", change: "+0.8%", positive: true },
    { symbol: "TECH", value: "2,890", change: "+2.1%", positive: true }
  ];

  const hasBreakingNews = true;
  const speedOptions = ['1x', '1.25x', '1.5x'];

  const handleSpeedChange = (speed) => {
    setCurrentSpeed(speed);
  };

  const handleKeyDown = (event, action, ...args) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action(...args);
    }
  };

  const handleSpeedKeyDown = (event, direction) => {
    const currentIndex = speedOptions.indexOf(currentSpeed);
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      const newIndex = Math.max(0, currentIndex - 1);
      handleSpeedChange(speedOptions[newIndex]);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      const newIndex = Math.min(speedOptions.length - 1, currentIndex + 1);
      handleSpeedChange(speedOptions[newIndex]);
    }
  };

  return (
    <BentoGridItem
      className="persona-professional-card"
      icon={
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-lg">
          💼
        </div>
      }
      title="Tech & Market Brief"
      description="3-minute focused updates for busy professionals. Tech sector insights and market moves."
    >
      {/* Breaking News Alert */}
      {hasBreakingNews && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div role="alert" aria-live="assertive" aria-atomic="true" className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
            <span className="text-xs font-medium text-red-800">Breaking: Fed announces rate decision</span>
          </div>
        </motion.div>
      )}

      {/* Today's Brief */}
      <div className="mb-4">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-800">Tech & Startups Brief</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">3 min</span>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{currentSpeed}</span>
            </div>
          </div>
          <p className="text-xs text-blue-700">AI Earnings Impact & Market Response</p>
        </div>
      </div>

      {/* Live Market Indicators */}
      <div role="table" aria-label="Live market indicators" className="space-y-2 mb-4">
        {marketData.map((item, idx) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            role="row"
            className="flex justify-between items-center p-2 rounded bg-gray-50"
          >
            <div role="cell" className="font-medium text-xs">{item.symbol}</div>
            <div role="cell" className="text-right">
              <div className="font-bold text-xs">{item.value}</div>
              <div
                className={`text-xs ${item.positive ? 'text-green-600' : 'text-red-600'}`}
                aria-label={`${item.symbol} ${item.change} ${item.positive ? 'up' : 'down'}`}
              >
                {item.change} <span className="sr-only">{item.positive ? 'up' : 'down'}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Speed Control */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span id="speed-label">Listening Speed</span>
          <span>Optimize for commute</span>
        </div>
        <div role="radiogroup" aria-labelledby="speed-label" className="flex gap-1">
          <div className="sr-only" aria-live="polite" id="speed-announcement"></div>
          {speedOptions.map((speed) => (
            <div
              key={speed}
              role="radio"
              aria-checked={speed === currentSpeed}
              tabIndex={speed === currentSpeed ? 0 : -1}
              onClick={() => handleSpeedChange(speed)}
              onKeyDown={(e) => handleSpeedKeyDown(e, speed)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 ${
                speed === currentSpeed
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={`Playback speed ${speed}${speed === currentSpeed ? ' (selected)' : ''}`}
            >
              {speed}
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Integration Teaser */}
      <div className="mb-4">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-blue-800">Portfolio Insights</div>
              <div className="text-xs text-blue-600">Custom analysis ready</div>
            </div>
            <div className="text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-auto">
        <Link to="/generate" className="btn-featured-primary w-full text-center block">
          Start Tech Brief
        </Link>
      </div>
    </BentoGridItem>
  );
};

export default BusyProfessionalCard;