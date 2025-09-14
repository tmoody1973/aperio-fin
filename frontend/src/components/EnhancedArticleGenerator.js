// Enhanced Article Generator Component
// Creates multimedia financial journalism with embedded interactive charts

import React, { useState } from 'react';
import { enhancedContentAPI } from '../services/enhancedContentAPI';
import { MarketPerformanceChart, EconomicIndicatorsChart, SectorPerformanceChart, RiskReturnChart } from './FinancialCharts';

const EnhancedArticleGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const [generatedArticles, setGeneratedArticles] = useState([]);
  const [articleConfig, setArticleConfig] = useState({
    contentType: 'featuredArticle',
    topic: '',
    complexity: 'intermediate',
    includeCharts: true
  });

  const articleTypes = [
    {
      value: 'featuredArticle',
      label: 'Featured Article',
      description: '1200-1500 words with comprehensive analysis and multiple charts',
      icon: '📰'
    },
    {
      value: 'marketAnalysis',
      label: 'Market Analysis',
      description: '800-1000 words focused on market data and trends',
      icon: '📈'
    },
    {
      value: 'educationalContent',
      label: 'Educational Content',
      description: '1000-1200 words explaining financial concepts with examples',
      icon: '🎓'
    },
    {
      value: 'breakingNews',
      label: 'Breaking News',
      description: '400-600 words for immediate market developments',
      icon: '🚨'
    },
    {
      value: 'weeklyWrap',
      label: 'Weekly Wrap-up',
      description: '1000-1300 words summarizing week\'s major events',
      icon: '📅'
    }
  ];

  const complexityLevels = [
    { value: 'beginner', label: 'Beginner', description: 'Accessible to newcomers' },
    { value: 'intermediate', label: 'Intermediate', description: 'General educated audience' },
    { value: 'advanced', label: 'Advanced', description: 'Financial professionals' }
  ];

  const handleInputChange = (field, value) => {
    setArticleConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateArticle = async () => {
    if (!articleConfig.topic.trim()) {
      alert('Please enter a topic for your article');
      return;
    }

    setIsGenerating(true);

    try {
      console.log('Generating enhanced article...');
      const article = await enhancedContentAPI.generateEnhancedArticle(articleConfig);

      setGeneratedArticle(article);
      setGeneratedArticles(prev => [article, ...prev]);

    } catch (error) {
      console.error('Article generation error:', error);
      alert('Error generating article. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGeneration = async (topic, contentType) => {
    setArticleConfig(prev => ({ ...prev, topic, contentType }));

    setTimeout(async () => {
      if (topic && contentType) {
        setIsGenerating(true);
        try {
          const article = await enhancedContentAPI.generateEnhancedArticle({
            contentType,
            topic,
            complexity: 'intermediate',
            includeCharts: true
          });

          setGeneratedArticle(article);
          setGeneratedArticles(prev => [article, ...prev]);
        } catch (error) {
          console.error('Quick generation error:', error);
        } finally {
          setIsGenerating(false);
        }
      }
    }, 100);
  };

  const renderChart = (chart) => {
    const chartProps = {
      data: chart.data,
      title: chart.caption || `${chart.type.replace('_', ' ')} Analysis`
    };

    switch (chart.type) {
      case 'market_performance':
        return <MarketPerformanceChart {...chartProps} />;
      case 'economic_indicators':
        return <EconomicIndicatorsChart {...chartProps} />;
      case 'sector_performance':
        return <SectorPerformanceChart {...chartProps} />;
      case 'risk_return':
        return <RiskReturnChart {...chartProps} />;
      default:
        return (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-gray-600">Chart: {chart.type.replace('_', ' ')}</p>
            <p className="text-sm text-gray-500 mt-2">{chart.caption}</p>
          </div>
        );
    }
  };

  const exportArticle = (article) => {
    const exportData = {
      ...article,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `article-${article.metadata.topic.replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📰 Enhanced Article Generator
        </h1>
        <p className="text-gray-600">
          Create comprehensive financial journalism with embedded interactive charts
        </p>
      </div>

      {/* Quick Generation Templates */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Article Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleQuickGeneration('Federal Reserve Interest Rate Decision Impact', 'featuredArticle')}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left"
            disabled={isGenerating}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">📰</span>
              <div className="font-medium">Fed Policy Deep Dive</div>
            </div>
            <div className="text-sm text-gray-600">Featured article with market analysis</div>
          </button>

          <button
            onClick={() => handleQuickGeneration('Tech Sector Performance Q3 2024', 'marketAnalysis')}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left"
            disabled={isGenerating}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">📈</span>
              <div className="font-medium">Sector Analysis</div>
            </div>
            <div className="text-sm text-gray-600">Market performance breakdown</div>
          </button>

          <button
            onClick={() => handleQuickGeneration('Understanding Inflation and Your Portfolio', 'educationalContent')}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left"
            disabled={isGenerating}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🎓</span>
              <div className="font-medium">Educational Guide</div>
            </div>
            <div className="text-sm text-gray-600">Concept explanation with charts</div>
          </button>

          <button
            onClick={() => handleQuickGeneration('Market Volatility Spikes After Economic Data', 'breakingNews')}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left"
            disabled={isGenerating}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🚨</span>
              <div className="font-medium">Breaking News</div>
            </div>
            <div className="text-sm text-gray-600">Immediate market reaction</div>
          </button>

          <button
            onClick={() => handleQuickGeneration('Weekly Market Wrap: Key Themes and Trends', 'weeklyWrap')}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left"
            disabled={isGenerating}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">📅</span>
              <div className="font-medium">Weekly Summary</div>
            </div>
            <div className="text-sm text-gray-600">Comprehensive week review</div>
          </button>

          <button
            onClick={() => handleQuickGeneration('Cryptocurrency Market Trends and Traditional Finance', 'marketAnalysis')}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left"
            disabled={isGenerating}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">₿</span>
              <div className="font-medium">Crypto Analysis</div>
            </div>
            <div className="text-sm text-gray-600">Digital assets market view</div>
          </button>
        </div>
      </div>

      {/* Custom Article Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Custom Article Generator</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topic Input */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Article Topic
            </label>
            <input
              type="text"
              value={articleConfig.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              placeholder="e.g., Impact of AI on Financial Services Industry"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            />
            <p className="text-sm text-gray-500 mt-1">
              Be specific and newsworthy for better AI-generated content
            </p>
          </div>

          {/* Article Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Article Type
            </label>
            <select
              value={articleConfig.contentType}
              onChange={(e) => handleInputChange('contentType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            >
              {articleTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {articleTypes.find(t => t.value === articleConfig.contentType)?.description}
            </p>
          </div>

          {/* Complexity Level */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Audience Level
            </label>
            <select
              value={articleConfig.complexity}
              onChange={(e) => handleInputChange('complexity', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            >
              {complexityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {complexityLevels.find(l => l.value === articleConfig.complexity)?.description}
            </p>
          </div>

          {/* Options */}
          <div className="lg:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={articleConfig.includeCharts}
                onChange={(e) => handleInputChange('includeCharts', e.target.checked)}
                className="mr-2"
                disabled={isGenerating}
              />
              <span className="text-sm">Generate and embed interactive charts</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={generateArticle}
            disabled={isGenerating || !articleConfig.topic.trim()}
            className={`w-full py-4 rounded-lg font-semibold transition-all ${
              isGenerating || !articleConfig.topic.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02]'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Enhanced Article...
              </div>
            ) : (
              '📰 Generate Enhanced Article with Charts'
            )}
          </button>
        </div>
      </div>

      {/* Generated Article Display */}
      {generatedArticle && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Article Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {generatedArticle.headline}
                </h2>
                {generatedArticle.subheadline && (
                  <p className="text-lg text-gray-600 mb-3">
                    {generatedArticle.subheadline}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>📊 {generatedArticle.metadata.wordCount} words</span>
                  <span>⏱️ {generatedArticle.metadata.readTime} min read</span>
                  <span>📈 {generatedArticle.metadata.chartCount} charts</span>
                  <span className="capitalize bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {generatedArticle.metadata.contentType.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => exportArticle(generatedArticle)}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Export
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {generatedArticle.content}
              </div>
            </div>

            {/* Embedded Charts */}
            {generatedArticle.charts && generatedArticle.charts.length > 0 && (
              <div className="mt-8 space-y-8">
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-6 text-center">
                    📊 Interactive Data Visualizations
                  </h3>
                  {generatedArticle.charts.map((chart, index) => (
                    <div key={index} className="mb-8">
                      {renderChart(chart)}
                      {chart.insight && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-sm text-blue-800">
                            <strong>Key Insight:</strong> {chart.insight}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Article Metadata */}
            <div className="mt-8 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Generated:</strong>
                  <br />
                  {new Date(generatedArticle.metadata.generatedAt).toLocaleString()}
                </div>
                <div>
                  <strong>Category:</strong>
                  <br />
                  <span className="capitalize">{generatedArticle.publishing.category}</span>
                </div>
                <div>
                  <strong>Audience:</strong>
                  <br />
                  <span className="capitalize">{generatedArticle.metadata.complexity}</span>
                </div>
              </div>

              {generatedArticle.seo.keywords.length > 0 && (
                <div className="mt-4">
                  <strong className="text-sm text-gray-600">Keywords:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {generatedArticle.seo.keywords.map((keyword, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generated Articles History */}
      {generatedArticles.length > 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Generated Articles ({generatedArticles.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedArticles.map((article, index) => (
              <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-sm line-clamp-2 mb-2">
                  {article.headline}
                </h4>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>📊 {article.metadata.wordCount} words • ⏱️ {article.metadata.readTime} min</div>
                  <div>📈 {article.metadata.chartCount} charts</div>
                  <div className="capitalize">{article.metadata.contentType.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
                <button
                  onClick={() => setGeneratedArticle(article)}
                  className="mt-3 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  View Article
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedArticleGenerator;