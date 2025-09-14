// Perplexity API Service
// Enhanced financial news search and context generation for AI content

class PerplexityService {
  constructor() {
    this.apiKey = process.env.REACT_APP_PERPLEXITY_KEY || 'demo';
    this.baseUrl = 'https://api.perplexity.ai';

    // Search templates for different types of financial content
    this.searchTemplates = {
      marketContext: "Latest financial news about {topic} today. Include market impact, analyst opinions, and key developments from the last 24 hours.",
      economicData: "Recent news and analysis about {indicator} economic indicator. Include expert commentary and market implications.",
      companyNews: "Breaking news and recent developments for {company} ({symbol}). Include earnings, analyst upgrades/downgrades, and business updates from the last week.",
      sectorAnalysis: "Current news and trends in the {sector} sector. Include major company movements, regulatory changes, and industry analysis.",
      breakingNews: "Breaking financial news in the last 2 hours about {topic}. Focus on market-moving events and immediate implications.",
      weeklyWrap: "Key financial news and market developments from the past week related to {theme}. Include major economic events and market reactions."
    };

    // Context enhancement prompts for different content types
    this.contextPrompts = {
      dailyBrief: "Provide context for a 3-minute daily financial brief about {topic}. Include 3-4 key points that would interest both beginners and experienced investors.",
      deepDive: "Provide comprehensive context for a 15-minute deep-dive analysis of {topic}. Include historical context, expert analysis, and different perspectives.",
      marketPulse: "Provide real-time context for a 2-minute market pulse update on {topic}. Focus on immediate market impact and what investors need to know right now.",
      economicLens: "Provide educational context explaining {topic} and its broader economic implications. Include real-world examples and clear explanations."
    };
  }

  // Enhanced search with financial context
  async searchFinancialNews(query, searchType = 'marketContext', options = {}) {
    try {
      const enhancedQuery = this.buildSearchQuery(query, searchType, options);

      const response = await this.callPerplexitySearch(enhancedQuery, {
        model: options.model || 'llama-3.1-sonar-large-128k-online',
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.2,
        top_p: options.top_p || 0.9,
        search_domain_filter: ['bloomberg.com', 'reuters.com', 'wsj.com', 'ft.com', 'marketwatch.com', 'cnbc.com'],
        search_recency_filter: options.recency || 'day'
      });

      return this.processSearchResults(response, searchType);

    } catch (error) {
      console.error('Perplexity search error:', error);
      return this.getFallbackContext(query, searchType);
    }
  }

  // Generate enhanced content context for AI script generation
  async generateContentContext(contentType, topic, additionalData = {}) {
    try {
      // Search for relevant news and context
      const newsContext = await this.searchFinancialNews(topic, 'marketContext', {
        recency: contentType === 'breakingNews' ? 'hour' : 'day'
      });

      // Get specific context based on content type
      const contextPrompt = this.contextPrompts[contentType] || this.contextPrompts.dailyBrief;
      const enhancedPrompt = contextPrompt.replace('{topic}', topic);

      const contextResponse = await this.callPerplexityChat(enhancedPrompt, {
        context: newsContext.summary,
        data: additionalData,
        focus: this.getContentFocus(contentType)
      });

      return {
        topic,
        contentType,
        newsContext: newsContext.summary,
        keyPoints: contextResponse.keyPoints,
        sources: newsContext.sources,
        marketImpact: contextResponse.marketImpact,
        audienceLevel: this.getAudienceLevel(contentType),
        suggestedNarrative: contextResponse.narrative,
        relatedTopics: contextResponse.relatedTopics,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Context generation error:', error);
      return this.getFallbackContentContext(contentType, topic);
    }
  }

  // Multi-source content enhancement
  async enhanceWithMultipleSources(topic, sources = ['general', 'market', 'analysis']) {
    const searchPromises = sources.map(async (source) => {
      const searchType = this.mapSourceToSearchType(source);
      return await this.searchFinancialNews(topic, searchType, {
        max_tokens: 500,
        recency: 'day'
      });
    });

    try {
      const results = await Promise.allSettled(searchPromises);
      const successfulResults = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

      return this.synthesizeMultiSourceContext(successfulResults, topic);

    } catch (error) {
      console.error('Multi-source enhancement error:', error);
      return this.getFallbackContext(topic, 'marketContext');
    }
  }

  // Real-time breaking news detection
  async detectBreakingNews(watchlist = ['SPY', 'QQQ', 'TSLA', 'AAPL', 'MSFT']) {
    try {
      const breakingNewsPromises = watchlist.map(async (symbol) => {
        return await this.searchFinancialNews(symbol, 'breakingNews', {
          recency: 'hour',
          max_tokens: 300
        });
      });

      const results = await Promise.allSettled(breakingNewsPromises);
      const breakingItems = results
        .filter(r => r.status === 'fulfilled' && r.value.isBreaking)
        .map(r => r.value);

      return {
        hasBreaking: breakingItems.length > 0,
        breakingCount: breakingItems.length,
        items: breakingItems,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Breaking news detection error:', error);
      return { hasBreaking: false, breakingCount: 0, items: [] };
    }
  }

  // Company-specific news enhancement
  async getCompanyNewsContext(symbol, companyName, analysisType = 'comprehensive') {
    try {
      const companyQuery = `${companyName} ${symbol}`;

      const [recentNews, analystViews, earnings] = await Promise.allSettled([
        this.searchFinancialNews(companyQuery, 'companyNews'),
        this.searchFinancialNews(`${companyQuery} analyst rating upgrade downgrade`, 'marketContext'),
        this.searchFinancialNews(`${companyQuery} earnings guidance`, 'marketContext')
      ]);

      return {
        symbol,
        companyName,
        recentNews: recentNews.status === 'fulfilled' ? recentNews.value : null,
        analystSentiment: analystViews.status === 'fulfilled' ? analystViews.value : null,
        earningsContext: earnings.status === 'fulfilled' ? earnings.value : null,
        overallSentiment: this.calculateSentiment([recentNews, analystViews, earnings]),
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Company context error:', error);
      return this.getFallbackCompanyContext(symbol, companyName);
    }
  }

  // Core Perplexity API methods
  async callPerplexitySearch(query, options = {}) {
    if (this.apiKey === 'demo') {
      return this.getMockSearchResponse(query, options);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: options.model || 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a financial journalism research assistant. Provide accurate, timely financial information with proper source attribution.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: options.max_tokens || 1000,
          temperature: options.temperature || 0.2,
          top_p: options.top_p || 0.9,
          search_domain_filter: options.search_domain_filter,
          search_recency_filter: options.search_recency_filter || 'day'
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Perplexity API call failed:', error);
      throw error;
    }
  }

  async callPerplexityChat(prompt, context = {}) {
    if (this.apiKey === 'demo') {
      return this.getMockChatResponse(prompt, context);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-huge-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an expert financial journalist and content strategist. Create engaging, accurate content for AI-powered financial journalism.'
            },
            {
              role: 'user',
              content: `${prompt}\n\nContext: ${JSON.stringify(context)}`
            }
          ],
          max_tokens: 1500,
          temperature: 0.3
        })
      });

      return await response.json();

    } catch (error) {
      console.error('Perplexity chat error:', error);
      throw error;
    }
  }

  // Helper methods
  buildSearchQuery(query, searchType, options) {
    const template = this.searchTemplates[searchType] || this.searchTemplates.marketContext;
    return template.replace('{topic}', query)
                  .replace('{symbol}', options.symbol || '')
                  .replace('{company}', options.company || '')
                  .replace('{sector}', options.sector || '')
                  .replace('{indicator}', options.indicator || '')
                  .replace('{theme}', options.theme || query);
  }

  processSearchResults(response, searchType) {
    // Process and structure the search results
    const content = response.choices?.[0]?.message?.content || '';

    return {
      summary: content,
      sources: this.extractSources(content),
      keyPoints: this.extractKeyPoints(content),
      isBreaking: this.detectBreakingIndicators(content),
      sentiment: this.analyzeSentiment(content),
      relevanceScore: this.calculateRelevance(content, searchType)
    };
  }

  extractSources(content) {
    // Extract source URLs and citations from Perplexity response
    const sourcePattern = /\[(.*?)\]\((https?:\/\/.*?)\)/g;
    const sources = [];
    let match;

    while ((match = sourcePattern.exec(content)) !== null) {
      sources.push({
        title: match[1],
        url: match[2],
        domain: new URL(match[2]).hostname
      });
    }

    return sources;
  }

  extractKeyPoints(content) {
    // Extract key points from the content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 4).map(s => s.trim());
  }

  detectBreakingIndicators(content) {
    const breakingKeywords = ['breaking', 'just announced', 'developing', 'urgent', 'alert', 'immediate'];
    return breakingKeywords.some(keyword =>
      content.toLowerCase().includes(keyword)
    );
  }

  analyzeSentiment(content) {
    const positiveWords = ['gained', 'rose', 'increased', 'positive', 'bullish', 'optimistic'];
    const negativeWords = ['fell', 'declined', 'dropped', 'negative', 'bearish', 'pessimistic'];

    const contentLower = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => contentLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => contentLower.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Mock responses for development
  getMockSearchResponse(query, options) {
    return {
      choices: [{
        message: {
          content: `Recent financial news about ${query}: Market analysts report mixed signals with moderate volatility. Key developments include regulatory updates and earnings adjustments. Sources indicate cautious optimism among institutional investors.`
        }
      }]
    };
  }

  getMockChatResponse(prompt, context) {
    return {
      keyPoints: [
        'Market showing mixed signals with moderate volatility',
        'Regulatory developments impacting sector performance',
        'Institutional investor sentiment remains cautiously optimistic',
        'Economic indicators suggest stable growth trajectory'
      ],
      marketImpact: 'moderate',
      narrative: 'balanced analysis with multiple perspectives',
      relatedTopics: ['market trends', 'economic policy', 'sector analysis']
    };
  }

  // Fallback methods
  getFallbackContext(query, searchType) {
    return {
      summary: `Financial context for ${query} based on general market conditions`,
      sources: [],
      keyPoints: ['Market data analysis', 'Economic indicator review', 'Sector performance update'],
      isBreaking: false,
      sentiment: 'neutral',
      relevanceScore: 0.5
    };
  }

  getFallbackContentContext(contentType, topic) {
    return {
      topic,
      contentType,
      newsContext: `Current market context for ${topic}`,
      keyPoints: ['Market overview', 'Economic indicators', 'Investment implications'],
      sources: [],
      marketImpact: 'moderate',
      audienceLevel: 'intermediate',
      suggestedNarrative: 'balanced market analysis',
      relatedTopics: [topic],
      timestamp: new Date().toISOString()
    };
  }

  // Utility methods
  mapSourceToSearchType(source) {
    const mapping = {
      'general': 'marketContext',
      'market': 'marketContext',
      'analysis': 'sectorAnalysis',
      'company': 'companyNews',
      'breaking': 'breakingNews'
    };
    return mapping[source] || 'marketContext';
  }

  getContentFocus(contentType) {
    const focuses = {
      dailyBrief: 'concise daily summary',
      deepDive: 'comprehensive analysis',
      marketPulse: 'real-time market impact',
      economicLens: 'educational explanation'
    };
    return focuses[contentType] || 'general financial news';
  }

  getAudienceLevel(contentType) {
    const levels = {
      dailyBrief: 'general',
      deepDive: 'advanced',
      marketPulse: 'intermediate',
      economicLens: 'beginner'
    };
    return levels[contentType] || 'intermediate';
  }

  synthesizeMultiSourceContext(results, topic) {
    return {
      topic,
      combinedSummary: results.map(r => r.summary).join(' '),
      allSources: results.flatMap(r => r.sources),
      consensusPoints: this.findConsensusPoints(results),
      sentiment: this.calculateOverallSentiment(results),
      confidence: results.length / 3 // Higher confidence with more sources
    };
  }

  findConsensusPoints(results) {
    // Find common themes across multiple search results
    const allPoints = results.flatMap(r => r.keyPoints);
    return allPoints.slice(0, 3); // Simplified for now
  }

  calculateOverallSentiment(results) {
    const sentiments = results.map(r => r.sentiment);
    const positive = sentiments.filter(s => s === 'positive').length;
    const negative = sentiments.filter(s => s === 'negative').length;

    if (positive > negative) return 'positive';
    if (negative > positive) return 'negative';
    return 'neutral';
  }

  calculateSentiment(results) {
    const successful = results.filter(r => r.status === 'fulfilled');
    if (successful.length === 0) return 'neutral';

    const sentiments = successful.map(r => r.value?.sentiment || 'neutral');
    return this.calculateOverallSentiment(sentiments.map(s => ({ sentiment: s })));
  }

  calculateRelevance(content, searchType) {
    // Simple relevance scoring based on content length and search type match
    const baseScore = Math.min(content.length / 1000, 1);
    return Math.round(baseScore * 100) / 100;
  }

  getFallbackCompanyContext(symbol, companyName) {
    return {
      symbol,
      companyName,
      recentNews: null,
      analystSentiment: null,
      earningsContext: null,
      overallSentiment: 'neutral',
      lastUpdated: new Date().toISOString()
    };
  }
}

// Create and export singleton instance
export const perplexityAPI = new PerplexityService();
export default perplexityAPI;