import React from "react";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { Link } from "react-router-dom";
import FinancialNewbieCard from "./Dashboard/FinancialNewbieCard";
import BusyProfessionalCard from "./Dashboard/BusyProfessionalCard";
import CuriousLearnerCard from "./Dashboard/CuriousLearnerCard";

// Financial Icons (using Unicode symbols for now)
const FinancialIcons = {
  ContentGeneration: () => (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg">
      🎙️
    </div>
  ),
  MarketData: () => (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg">
      📈
    </div>
  ),
  Articles: () => (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-lg">
      📰
    </div>
  ),
  Analytics: () => (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg">
      📊
    </div>
  ),
  Audio: () => (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-lg">
      🎧
    </div>
  ),
  Intelligence: () => (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg">
      🧠
    </div>
  ),
};

// Interactive Market Data Visualization
const MarketDataSkeletonComponent = () => {
  const marketData = [
    { symbol: "S&P 500", value: "4,445", change: "+1.2%", positive: true },
    { symbol: "NASDAQ", value: "13,722", change: "+0.8%", positive: true },
    { symbol: "DOW", value: "34,678", change: "-0.3%", positive: false },
    { symbol: "GDP", value: "2.3%", change: "Q3", positive: true },
  ];

  return (
    <div className="h-full w-full p-4">
      <div className="space-y-3">
        {marketData.map((item, idx) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex justify-between items-center p-2 rounded-lg bg-gray-50"
          >
            <span className="font-medium text-sm">{item.symbol}</span>
            <div className="text-right">
              <div className="font-bold text-sm">{item.value}</div>
              <div className={`text-xs ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                {item.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Content Creation Showcase
const ContentCreationSkeleton = () => {
  const contentTypes = [
    "Daily Briefs (3-4 min)",
    "Deep Dives (12-15 min)",
    "Market Pulse (90 sec)",
    "Economic Lens (8-10 min)"
  ];

  return (
    <div className="h-full w-full p-4">
      <div className="space-y-2">
        {contentTypes.map((type, idx) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.15 }}
            className="flex items-center justify-between p-2 rounded border border-gray-100"
          >
            <span className="text-xs font-medium text-gray-700">{type}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Article Showcase with Animation
const ArticleShowcase = () => {
  const articles = [
    "Federal Reserve Policy Update",
    "Market Volatility Analysis",
    "Cryptocurrency Trends",
    "Economic Growth Indicators"
  ];

  return (
    <div className="h-full w-full p-4 overflow-hidden">
      <div className="space-y-2">
        {articles.map((title, idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 cursor-pointer"
          >
            <h4 className="text-xs font-semibold text-blue-900 truncate">{title}</h4>
            <p className="text-xs text-blue-600 mt-1">Professional Analysis</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Audio Experience Visualization
const AudioExperienceSkeleton = () => {
  return (
    <div className="h-full w-full p-4 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="text-2xl text-white">🎧</div>
        </motion.div>
        <p className="text-xs text-gray-600">Multi-voice AI</p>
        <p className="text-xs text-gray-600">Audio Experience</p>
      </div>
    </div>
  );
};

// Analytics Dashboard Mini
const AnalyticsSkeleton = () => {
  return (
    <div className="h-full w-full p-4">
      <div className="grid grid-cols-2 gap-3 h-full">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200">
          <div className="text-lg font-bold text-amber-700">47</div>
          <div className="text-xs text-amber-600">Articles Published</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
          <div className="text-lg font-bold text-blue-700">1.2k</div>
          <div className="text-xs text-blue-600">Audio Plays</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-3 border border-purple-200">
          <div className="text-lg font-bold text-purple-700">23</div>
          <div className="text-xs text-purple-600">AI Generations</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
          <div className="text-lg font-bold text-green-700">98%</div>
          <div className="text-xs text-green-600">System Uptime</div>
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroCard = () => {
  return (
    <div className="col-span-full lg:col-span-2 row-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 relative overflow-hidden">
      <div className="relative z-10 h-full flex flex-col">
        <div className="mb-4">
          <span className="caption text-blue-600 mb-2 block">Financial Intelligence Platform</span>
          <h2 className="headline-primary text-3xl lg:text-4xl text-gray-900 mb-4 leading-tight">
            AI-Powered Financial<br />Journalism Studio
          </h2>
          <p className="body-text text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
            Generate multi-voice content, analyze market data, and create professional financial journalism with advanced AI capabilities.
          </p>
        </div>

        <div className="mt-auto">
          <Link
            to="/generate"
            className="btn-primary inline-block mb-4 px-6 py-3 text-sm"
          >
            Launch AI Studio
          </Link>

          <div className="flex items-center gap-4 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Multi-voice AI Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Real-time Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -translate-y-32 translate-x-32 opacity-60"></div>
    </div>
  );
};

export function FinancialDashboardGrid() {
  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto">
        {/* Explore Section */}
        <div className="mb-8">
          <h3 className="headline-secondary text-2xl mb-2">Explore the story</h3>
          <p className="body-text text-gray-600">Financial intelligence transformed into interactive content formats.</p>
        </div>

        {/* Content Grid */}
        <BentoGrid>
          {/* Featured Content Card - Large 2x2 */}
          <BentoGridItem
            className="md:col-span-2 col-span-2 row-span-2 featured-content-card"
            href="/generate"
            icon={<FinancialIcons.ContentGeneration />}
            title="Understanding Money in the Race"
            description="We turn things into clear stories. Explore a deep dive, listen to a short brief, skim the key takeaways, or review the source pack."
          >
            <div className="featured-content-header">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">Understanding Money in the Race</h3>
                <div className="flex items-center gap-2">
                  <span className="difficulty-indicator difficulty-indicator--beginner">Beginner</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">12 min</span>
                </div>
              </div>
              <div className="text-sm text-blue-600 mb-4 font-medium">
                Perfect for building financial confidence • Recommended for you
              </div>
            </div>
            <div className="featured-content-description">
              <p className="text-gray-600 mb-4 leading-relaxed">
                We turn complex financial data into clear, digestible stories. This deep dive explores how economic policies shape market dynamics, perfect for curious minds ready to understand the bigger picture.
              </p>
              <div className="bg-blue-50 rounded-lg p-3 mb-6 border border-blue-100">
                <div className="text-sm font-medium text-blue-800 mb-1">Why this matters to you:</div>
                <div className="text-sm text-blue-700">
                  Learn how Federal Reserve decisions directly impact your savings, investments, and daily financial choices.
                </div>
              </div>
            </div>
            <div className="featured-content-actions">
              <button className="btn-featured-primary mb-3 w-full">
                Open Deep Dive
              </button>
              <div className="flex gap-2">
                <button className="btn-featured-secondary flex-1">
                  Share
                </button>
                <button className="btn-featured-secondary flex-1">
                  Add to playlist
                </button>
              </div>
            </div>
          </BentoGridItem>

          {/* Financial Newbie Learning Card */}
          <FinancialNewbieCard />

          {/* Busy Professional Tech Card */}
          <BusyProfessionalCard />

          {/* Articles - 2 columns wide */}
          <BentoGridItem
            className="md:col-span-2"
            href="/write"
            icon={<FinancialIcons.Articles />}
            title="Enhanced Articles"
            description="Professional financial journalism with interactive charts and real-time data."
          >
            <div className="space-y-2 mb-4">
              <div className="h-2 bg-blue-100 rounded w-full"></div>
              <div className="h-2 bg-blue-50 rounded w-3/4"></div>
              <div className="h-2 bg-gray-100 rounded w-1/2"></div>
            </div>
          </BentoGridItem>

          {/* Curious Learner Insights Card */}
          <CuriousLearnerCard />

          {/* Intelligence - Single */}
          <BentoGridItem
            href="/insights"
            icon={<FinancialIcons.Intelligence />}
            title="AI Insights"
            description="Advanced market analysis and predictions."
          >
            <div className="space-y-1 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Accuracy</span>
                <span className="text-xs font-bold text-purple-600">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Confidence</span>
                <span className="text-xs font-bold text-purple-600">High</span>
              </div>
            </div>
          </BentoGridItem>
        </BentoGrid>

        {/* Understanding Section */}
        <div className="mt-16 mb-8">
          <h3 className="headline-secondary text-2xl mb-2">Understand the data</h3>
          <p className="body-text text-gray-600">Sharpen your skills with quick explainers.</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="premium-card p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-3 flex items-center justify-center">📊</div>
            <h4 className="subheading text-sm mb-2">Deep Dive</h4>
            <p className="caption text-xs">10 min read</p>
          </div>

          <div className="premium-card p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-3 flex items-center justify-center">🎙️</div>
            <h4 className="subheading text-sm mb-2">Podcast Episode</h4>
            <p className="caption text-xs">11 min listen</p>
          </div>

          <div className="premium-card p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-3 flex items-center justify-center">📋</div>
            <h4 className="subheading text-sm mb-2">Key Takeaways</h4>
            <p className="caption text-xs">2 min read</p>
          </div>

          <div className="premium-card p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-3 flex items-center justify-center">⚡</div>
            <h4 className="subheading text-sm mb-2">Quick Start</h4>
            <p className="caption text-xs">3 min guide</p>
          </div>
        </div>
      </div>
    </div>
  );
}