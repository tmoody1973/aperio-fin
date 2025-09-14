// Financial API Service Layer
// Primary integration with FRED and Alpha Vantage for Aperio.fin
// Powers economic indicators and market data for AI-generated audio content

class FinancialAPIService {
  constructor() {
    // API Keys (to be set via environment variables)
    this.alphaVantageKey = process.env.REACT_APP_ALPHA_VANTAGE_KEY || 'demo';
    this.fredKey = process.env.REACT_APP_FRED_KEY || 'demo'; // FRED is free but API key recommended

    // Base URLs
    this.alphaVantageBase = 'https://www.alphavantage.co/query';
    this.fredBase = 'https://api.stlouisfed.org/fred';

    // FRED Series IDs for key economic indicators (as per PRD)
    this.fredSeries = {
      gdp: 'GDP',                    // Gross Domestic Product
      inflation: 'CPIAUCSL',         // Consumer Price Index
      unemployment: 'UNRATE',        // Unemployment Rate
      federalRate: 'FEDFUNDS',       // Federal Funds Rate
      consumerSentiment: 'UMCSENT',  // Consumer Sentiment
      housingStarts: 'HOUST',        // Housing Starts
      industrialProduction: 'INDPRO', // Industrial Production Index
      retailSales: 'RSAFS',          // Retail Sales
      personalIncome: 'PI',          // Personal Income
      savingsRate: 'PSAVERT'         // Personal Savings Rate
    };
  }

  // STOCK PRICE DATA
  async getStockPrice(symbol) {
    try {
      // Try Alpha Vantage first
      const response = await fetch(
        `${this.alphaVantageBase}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`
      );
      const data = await response.json();

      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        return {
          symbol: quote['01. Symbol'],
          price: parseFloat(quote['05. Price']),
          change: parseFloat(quote['09. Change']),
          changePercent: quote['10. Change Percent'].replace('%', ''),
          high: parseFloat(quote['03. High']),
          low: parseFloat(quote['04. Low']),
          volume: parseInt(quote['06. Volume']),
          previousClose: parseFloat(quote['08. Previous Close']),
          timestamp: quote['07. Latest Trading Day']
        };
      }

      // Fallback to mock data if API fails
      return this.getMockStockPrice(symbol);
    } catch (error) {
      console.error('Error fetching stock price:', error);
      return this.getMockStockPrice(symbol);
    }
  }

  // Get multiple stock quotes
  async getMultipleStockPrices(symbols) {
    const promises = symbols.map(symbol => this.getStockPrice(symbol));
    return Promise.allSettled(promises).then(results =>
      results.map((result, index) => ({
        symbol: symbols[index],
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }))
    );
  }

  // MARKET INDICES
  async getMarketIndices() {
    const indices = ['SPY', 'QQQ', 'DIA', 'VTI']; // ETFs that track major indices
    try {
      const results = await this.getMultipleStockPrices(indices);
      return {
        sp500: results.find(r => r.symbol === 'SPY')?.data,
        nasdaq: results.find(r => r.symbol === 'QQQ')?.data,
        dow: results.find(r => r.symbol === 'DIA')?.data,
        total: results.find(r => r.symbol === 'VTI')?.data
      };
    } catch (error) {
      console.error('Error fetching market indices:', error);
      return this.getMockMarketIndices();
    }
  }

  // COMPANY INFORMATION
  async getCompanyInfo(symbol) {
    try {
      const response = await fetch(
        `${this.alphaVantageBase}?function=OVERVIEW&symbol=${symbol}&apikey=${this.alphaVantageKey}`
      );
      const data = await response.json();

      if (data.Symbol) {
        return {
          symbol: data.Symbol,
          name: data.Name,
          description: data.Description,
          sector: data.Sector,
          industry: data.Industry,
          marketCap: data.MarketCapitalization,
          pe: data.PERatio,
          dividend: data.DividendYield,
          beta: data.Beta,
          week52High: data['52WeekHigh'],
          week52Low: data['52WeekLow'],
          analyst: data.AnalystTargetPrice
        };
      }

      return this.getMockCompanyInfo(symbol);
    } catch (error) {
      console.error('Error fetching company info:', error);
      return this.getMockCompanyInfo(symbol);
    }
  }

  // FINANCIAL NEWS
  async getFinancialNews(category = 'general', limit = 10) {
    try {
      // Using Alpha Vantage News & Sentiment API
      const response = await fetch(
        `${this.alphaVantageBase}?function=NEWS_SENTIMENT&topics=${category}&limit=${limit}&apikey=${this.alphaVantageKey}`
      );
      const data = await response.json();

      if (data.feed) {
        return data.feed.map(article => ({
          title: article.title,
          summary: article.summary,
          url: article.url,
          source: article.source,
          publishedAt: article.time_published,
          sentiment: article.overall_sentiment_label,
          sentimentScore: article.overall_sentiment_score,
          relevanceScore: article.relevance_score,
          topics: article.topics?.map(t => t.topic) || []
        }));
      }

      return this.getMockNews(category, limit);
    } catch (error) {
      console.error('Error fetching financial news:', error);
      return this.getMockNews(category, limit);
    }
  }

  // CRYPTOCURRENCY DATA
  async getCryptoPrice(symbol = 'BTC') {
    try {
      // Using Alpha Vantage Digital Currency API
      const response = await fetch(
        `${this.alphaVantageBase}?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${this.alphaVantageKey}`
      );
      const data = await response.json();

      if (data['Realtime Currency Exchange Rate']) {
        const rate = data['Realtime Currency Exchange Rate'];
        return {
          symbol: rate['1. From_Currency Code'],
          name: rate['2. From_Currency Name'],
          price: parseFloat(rate['5. Exchange Rate']),
          timestamp: rate['6. Last Refreshed']
        };
      }

      return this.getMockCryptoPrice(symbol);
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      return this.getMockCryptoPrice(symbol);
    }
  }

  // ECONOMIC INDICATORS - Real FRED API Integration
  async getEconomicIndicators() {
    try {
      const indicators = {};

      // Fetch multiple economic indicators in parallel
      const promises = Object.entries(this.fredSeries).map(async ([key, seriesId]) => {
        try {
          const response = await fetch(
            `${this.fredBase}/series/observations?series_id=${seriesId}&api_key=${this.fredKey}&file_type=json&limit=2&sort_order=desc`
          );

          if (!response.ok) throw new Error(`FRED API error: ${response.status}`);

          const data = await response.json();

          if (data.observations && data.observations.length >= 2) {
            const latest = data.observations[0];
            const previous = data.observations[1];

            const currentValue = parseFloat(latest.value);
            const previousValue = parseFloat(previous.value);
            const change = currentValue - previousValue;
            const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;

            return {
              key,
              value: currentValue,
              change: change,
              changePercent: changePercent,
              date: latest.date,
              previousDate: previous.date
            };
          }

          return null;
        } catch (error) {
          console.error(`Error fetching ${key} from FRED:`, error);
          return null;
        }
      });

      const results = await Promise.allSettled(promises);

      // Process results and build indicators object
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const indicatorData = result.value;
          indicators[indicatorData.key] = {
            label: this.getFredLabel(indicatorData.key),
            value: indicatorData.value,
            change: indicatorData.change,
            changePercent: indicatorData.changePercent,
            date: indicatorData.date,
            unit: this.getFredUnit(indicatorData.key),
            description: this.getFredDescription(indicatorData.key)
          };
        }
      });

      // If no real data available, fall back to mock data
      if (Object.keys(indicators).length === 0) {
        return this.getMockEconomicIndicators();
      }

      return indicators;

    } catch (error) {
      console.error('Error fetching FRED economic indicators:', error);
      return this.getMockEconomicIndicators();
    }
  }

  // Get additional FRED series details
  async getFredSeriesInfo(seriesId) {
    try {
      const response = await fetch(
        `${this.fredBase}/series?series_id=${seriesId}&api_key=${this.fredKey}&file_type=json`
      );

      const data = await response.json();
      return data.seriess?.[0] || null;
    } catch (error) {
      console.error('Error fetching FRED series info:', error);
      return null;
    }
  }

  // Helper method to get human-readable labels for FRED indicators
  getFredLabel(key) {
    const labels = {
      gdp: 'Gross Domestic Product',
      inflation: 'Consumer Price Index',
      unemployment: 'Unemployment Rate',
      federalRate: 'Federal Funds Rate',
      consumerSentiment: 'Consumer Sentiment Index',
      housingStarts: 'Housing Starts',
      industrialProduction: 'Industrial Production',
      retailSales: 'Retail Sales',
      personalIncome: 'Personal Income',
      savingsRate: 'Personal Savings Rate'
    };
    return labels[key] || key;
  }

  // Helper method to get units for FRED indicators
  getFredUnit(key) {
    const units = {
      gdp: 'Billions of Dollars',
      inflation: 'Index 1982-84=100',
      unemployment: 'Percent',
      federalRate: 'Percent',
      consumerSentiment: 'Index',
      housingStarts: 'Thousands of Units',
      industrialProduction: 'Index 2017=100',
      retailSales: 'Millions of Dollars',
      personalIncome: 'Billions of Dollars',
      savingsRate: 'Percent'
    };
    return units[key] || 'Value';
  }

  // Helper method to get descriptions for FRED indicators
  getFredDescription(key) {
    const descriptions = {
      gdp: 'Total value of goods and services produced in the United States',
      inflation: 'Measure of average change in prices paid by consumers',
      unemployment: 'Percentage of labor force that is unemployed',
      federalRate: 'Interest rate at which banks lend to each other overnight',
      consumerSentiment: 'Measure of consumer confidence in economic conditions',
      housingStarts: 'Number of new residential construction projects begun',
      industrialProduction: 'Output of factories, mines, and utilities',
      retailSales: 'Total receipts of retail stores',
      personalIncome: 'Income received by persons from all sources',
      savingsRate: 'Personal savings as percentage of disposable income'
    };
    return descriptions[key] || 'Economic indicator from Federal Reserve Economic Data';
  }

  // SEARCH STOCKS
  async searchStocks(query) {
    try {
      const response = await fetch(
        `${this.alphaVantageBase}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${this.alphaVantageKey}`
      );
      const data = await response.json();

      if (data.bestMatches) {
        return data.bestMatches.map(match => ({
          symbol: match['1. Symbol'],
          name: match['2. Name'],
          type: match['3. Type'],
          region: match['4. Region'],
          currency: match['8. Currency'],
          matchScore: parseFloat(match['9. Match Score'])
        }));
      }

      return this.getMockSearchResults(query);
    } catch (error) {
      console.error('Error searching stocks:', error);
      return this.getMockSearchResults(query);
    }
  }

  // MOCK DATA METHODS (Fallbacks)
  getMockStockPrice(symbol) {
    const mockPrices = {
      'AAPL': { symbol: 'AAPL', price: 175.43, change: 2.34, changePercent: '1.35' },
      'GOOGL': { symbol: 'GOOGL', price: 138.21, change: -1.23, changePercent: '-0.88' },
      'MSFT': { symbol: 'MSFT', price: 378.85, change: 4.12, changePercent: '1.10' },
      'TSLA': { symbol: 'TSLA', price: 248.50, change: -3.25, changePercent: '-1.29' },
      'AMZN': { symbol: 'AMZN', price: 145.86, change: 0.95, changePercent: '0.66' }
    };

    return mockPrices[symbol] || {
      symbol,
      price: 100 + Math.random() * 200,
      change: (Math.random() - 0.5) * 10,
      changePercent: ((Math.random() - 0.5) * 5).toFixed(2),
      high: 105 + Math.random() * 200,
      low: 95 + Math.random() * 200,
      volume: Math.floor(Math.random() * 10000000),
      previousClose: 98 + Math.random() * 200,
      timestamp: new Date().toISOString().split('T')[0]
    };
  }

  getMockMarketIndices() {
    return {
      sp500: { symbol: 'SPY', price: 442.58, change: 5.23, changePercent: '1.20' },
      nasdaq: { symbol: 'QQQ', price: 378.91, change: 7.45, changePercent: '2.00' },
      dow: { symbol: 'DIA', price: 347.22, change: 2.18, changePercent: '0.63' },
      total: { symbol: 'VTI', price: 234.67, change: 3.12, changePercent: '1.35' }
    };
  }

  getMockCompanyInfo(symbol) {
    return {
      symbol,
      name: `${symbol} Corporation`,
      description: `${symbol} is a leading technology company focused on innovation and growth.`,
      sector: 'Technology',
      industry: 'Software',
      marketCap: '2.5T',
      pe: '28.5',
      dividend: '0.75%',
      beta: '1.2'
    };
  }

  getMockNews(category, limit) {
    const mockNews = [
      {
        title: 'Tech Stocks Rally Amid AI Optimism',
        summary: 'Technology stocks surged today as investors showed renewed confidence in AI developments.',
        source: 'Financial News Network',
        publishedAt: new Date().toISOString(),
        sentiment: 'Bullish',
        sentimentScore: 0.7
      },
      {
        title: 'Federal Reserve Hints at Rate Stability',
        summary: 'Central bank officials suggest interest rates may remain stable through next quarter.',
        source: 'Economic Times',
        publishedAt: new Date().toISOString(),
        sentiment: 'Neutral',
        sentimentScore: 0.1
      }
    ];
    return mockNews.slice(0, limit);
  }

  getMockCryptoPrice(symbol) {
    const cryptoPrices = {
      'BTC': { symbol: 'BTC', name: 'Bitcoin', price: 43250.00 },
      'ETH': { symbol: 'ETH', name: 'Ethereum', price: 2650.00 },
      'ADA': { symbol: 'ADA', name: 'Cardano', price: 0.45 }
    };
    return cryptoPrices[symbol] || { symbol, name: symbol, price: Math.random() * 1000 };
  }

  getMockEconomicIndicators() {
    return {
      gdp: { value: 2.3, change: 0.1, label: 'GDP Growth Rate' },
      inflation: { value: 3.2, change: -0.2, label: 'Inflation Rate' },
      unemployment: { value: 3.8, change: 0.0, label: 'Unemployment Rate' },
      interestRate: { value: 5.25, change: 0.0, label: 'Federal Funds Rate' }
    };
  }

  getMockSearchResults(query) {
    return [
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity', region: 'United States' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Equity', region: 'United States' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity', region: 'United States' }
    ].filter(stock =>
      stock.symbol.includes(query.toUpperCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Create and export singleton instance
export const financialAPI = new FinancialAPIService();
export default financialAPI;