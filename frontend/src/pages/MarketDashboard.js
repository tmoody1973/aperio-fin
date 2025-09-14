import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import financialAPI from '../services/financialAPI';

export default function MarketDashboard() {
  const [marketIndices, setMarketIndices] = useState({});
  const [topStocks, setTopStocks] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [financialNews, setFinancialNews] = useState([]);
  const [economicIndicators, setEconomicIndicators] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      // Load all market data in parallel
      const [indices, stocks, crypto, news, indicators] = await Promise.all([
        financialAPI.getMarketIndices(),
        financialAPI.getMultipleStockPrices(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']),
        Promise.all([
          financialAPI.getCryptoPrice('BTC'),
          financialAPI.getCryptoPrice('ETH'),
          financialAPI.getCryptoPrice('ADA')
        ]),
        financialAPI.getFinancialNews('general', 5),
        financialAPI.getEconomicIndicators()
      ]);

      setMarketIndices(indices);
      setTopStocks(stocks.filter(s => s.data).map(s => s.data));
      setCryptoPrices(crypto);
      setFinancialNews(news);
      setEconomicIndicators(indicators);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const results = await financialAPI.searchStocks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change, changePercent) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <span className="mr-1">{isPositive ? '↗' : '↘'}</span>
        <span>{formatPrice(Math.abs(change))} ({Math.abs(changePercent)}%)</span>
      </span>
    );
  };

  const formatLargeNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    return formatPrice(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊 📈 📰</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aperio-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back
              </button>
              <div className="text-2xl mr-3">📈</div>
              <h1 className="text-2xl font-bold text-aperio-blue font-serif">
                Market Dashboard
              </h1>
            </div>
            <button
              onClick={loadMarketData}
              className="px-4 py-2 bg-aperio-blue text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stock Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Stock Search</h2>
          <form onSubmit={handleSearch} className="flex space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for stocks (e.g., AAPL, Apple, Microsoft)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-2 bg-aperio-blue text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Search Results:</h3>
              <div className="grid gap-2">
                {searchResults.map((stock, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSearchQuery(stock.symbol)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{stock.symbol}</span>
                        <span className="text-gray-600 ml-2">{stock.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{stock.region}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Market Indices */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Market Indices</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(marketIndices).map(([key, index]) => {
                  if (!index) return null;
                  return (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{index.symbol}</h3>
                        <span className="text-sm text-gray-500">
                          {key.toUpperCase().replace('500', ' 500')}
                        </span>
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {formatPrice(index.price)}
                      </div>
                      {formatChange(index.change, index.changePercent)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Stocks */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🚀 Top Stocks</h2>
              <div className="space-y-4">
                {topStocks.map((stock, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{stock.symbol}</h3>
                      <div className="text-2xl font-bold">{formatPrice(stock.price)}</div>
                    </div>
                    <div className="text-right">
                      {formatChange(stock.change, stock.changePercent)}
                      <div className="text-sm text-gray-500 mt-1">
                        Vol: {stock.volume?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial News */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📰 Financial News</h2>
              <div className="space-y-4">
                {financialNews.map((article, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{article.summary}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{article.source}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded ${
                          article.sentiment === 'Bullish' ? 'bg-green-100 text-green-800' :
                          article.sentiment === 'Bearish' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {article.sentiment}
                        </span>
                        {article.url && (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-aperio-blue hover:underline"
                          >
                            Read More →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cryptocurrency */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">₿ Cryptocurrency</h2>
              <div className="space-y-3">
                {cryptoPrices.map((crypto, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{crypto.symbol}</span>
                      <div className="text-sm text-gray-500">{crypto.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(crypto.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Economic Indicators */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📈 Economic Data</h2>
              <div className="space-y-3">
                {Object.entries(economicIndicators).map(([key, indicator]) => (
                  <div key={key} className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600">{indicator.label}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{indicator.value}%</div>
                      <div className="text-xs text-gray-500">
                        {indicator.change >= 0 ? '+' : ''}{indicator.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/articles"
                  className="block w-full px-4 py-2 text-center bg-aperio-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  📰 Browse Articles
                </Link>
                <Link
                  to="/create-article"
                  className="block w-full px-4 py-2 text-center border border-aperio-blue text-aperio-blue rounded-md hover:bg-blue-50 transition-colors"
                >
                  ✍️ Write Analysis
                </Link>
                <button
                  onClick={() => window.open('https://finance.yahoo.com', '_blank')}
                  className="w-full px-4 py-2 text-center border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  🔗 Yahoo Finance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}