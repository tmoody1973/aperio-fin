// Enhanced Written Content Generation Service
// Creates multimedia articles with embedded charts and rich financial journalism

import { perplexityAPI } from './perplexityAPI.js';
import { financialAPI } from './financialAPI.js';
import { visualContentAPI } from './visualAPI.js';

class EnhancedContentService {
  constructor() {
    // Content templates for different article types
    this.contentTemplates = {
      featuredArticle: {
        structure: ['headline', 'lead', 'context', 'analysis', 'data_visualization', 'expert_quotes', 'implications', 'conclusion'],
        targetLength: '1200-1500 words',
        chartTypes: ['market_performance', 'economic_indicators'],
        tone: 'authoritative yet accessible financial journalism'
      },
      marketAnalysis: {
        structure: ['headline', 'executive_summary', 'market_overview', 'key_movers', 'data_deep_dive', 'sector_analysis', 'outlook'],
        targetLength: '800-1000 words',
        chartTypes: ['market_performance', 'sector_performance', 'risk_return'],
        tone: 'analytical and data-driven'
      },
      educationalContent: {
        structure: ['headline', 'introduction', 'concept_explanation', 'real_world_examples', 'interactive_examples', 'key_takeaways', 'further_reading'],
        targetLength: '1000-1200 words',
        chartTypes: ['economic_indicators', 'concept_illustration'],
        tone: 'educational and explanatory for general audience'
      },
      breakingNews: {
        structure: ['headline', 'breaking_lead', 'immediate_context', 'market_impact', 'quick_analysis', 'what_to_watch'],
        targetLength: '400-600 words',
        chartTypes: ['market_performance', 'breaking_impact'],
        tone: 'urgent but measured breaking news style'
      },
      weeklyWrap: {
        structure: ['headline', 'week_overview', 'major_events', 'market_movements', 'economic_data', 'looking_ahead'],
        targetLength: '1000-1300 words',
        chartTypes: ['market_performance', 'economic_indicators', 'sector_performance'],
        tone: 'comprehensive weekly summary'
      }
    };

    // Chart embedding strategies
    this.chartStrategies = {
      market_performance: {
        placement: 'after_market_overview',
        caption_template: 'Market performance over the {timeframe} shows {trend} with {key_insight}',
        context_integration: 'reference specific data points in surrounding text'
      },
      economic_indicators: {
        placement: 'after_economic_context',
        caption_template: 'Key economic indicators reveal {pattern} suggesting {implication}',
        context_integration: 'explain what the data means for readers'
      },
      sector_performance: {
        placement: 'within_sector_analysis',
        caption_template: 'Sector breakdown highlights {winner} outperforming while {laggard} faces headwinds',
        context_integration: 'tie sector performance to broader themes'
      },
      risk_return: {
        placement: 'within_analysis',
        caption_template: 'Risk-return analysis shows {insight} for current market positioning',
        context_integration: 'help readers understand investment implications'
      }
    };
  }

  // Generate comprehensive article with embedded charts
  async generateEnhancedArticle(config) {
    try {
      const { contentType, topic, complexity = 'intermediate', includeCharts = true } = config;

      console.log(`Generating ${contentType} article on: ${topic}`);

      // Step 1: Gather comprehensive context
      const context = await this.gatherArticleContext(topic, contentType, complexity);

      // Step 2: Generate article structure and content
      const article = await this.generateArticleContent(context, contentType);

      // Step 3: Generate and embed charts if requested
      let chartData = null;
      if (includeCharts) {
        chartData = await this.generateArticleCharts(context, contentType, article);
      }

      // Step 4: Create final enhanced article
      const enhancedArticle = this.assembleEnhancedArticle(article, chartData, context, contentType);

      return enhancedArticle;

    } catch (error) {
      console.error('Enhanced article generation error:', error);
      return this.getFallbackArticle(config);
    }
  }

  // Gather comprehensive context for article generation
  async gatherArticleContext(topic, contentType, complexity) {
    try {
      const [
        newsContext,
        marketData,
        economicData,
        enhancedContext
      ] = await Promise.allSettled([
        perplexityAPI.searchFinancialNews(topic, this.mapContentTypeToSearchType(contentType), {
          recency: contentType === 'breakingNews' ? 'hour' : 'day',
          max_tokens: 800
        }),
        financialAPI.getMarketOverview(),
        financialAPI.getEconomicIndicators(),
        perplexityAPI.generateContentContext(contentType, topic, {
          complexity,
          focus: 'written_content'
        })
      ]);

      return {
        topic,
        contentType,
        complexity,
        news: newsContext.status === 'fulfilled' ? newsContext.value : null,
        market: marketData.status === 'fulfilled' ? marketData.value : null,
        economic: economicData.status === 'fulfilled' ? economicData.value : null,
        enhanced: enhancedContext.status === 'fulfilled' ? enhancedContext.value : null,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Context gathering error:', error);
      return this.getFallbackContext(topic, contentType);
    }
  }

  // Generate structured article content
  async generateArticleContent(context, contentType) {
    const template = this.contentTemplates[contentType] || this.contentTemplates.featuredArticle;

    const prompt = this.buildArticlePrompt(context, template);

    try {
      const response = await perplexityAPI.callPerplexityChat(prompt, {
        context: context.enhanced?.newsContext,
        marketData: context.market,
        economicData: context.economic,
        tone: template.tone,
        targetLength: template.targetLength
      });

      return this.parseArticleResponse(response, template.structure);

    } catch (error) {
      console.error('Article content generation error:', error);
      return this.getFallbackArticleContent(context, contentType);
    }
  }

  // Build comprehensive article generation prompt
  buildArticlePrompt(context, template) {
    return `Write a comprehensive financial journalism article about "${context.topic}".

ARTICLE SPECIFICATIONS:
- Type: ${context.contentType}
- Target Length: ${template.targetLength}
- Tone: ${template.tone}
- Audience Level: ${context.complexity}

REQUIRED STRUCTURE:
${template.structure.map((section, index) => `${index + 1}. ${section.replace(/_/g, ' ').toUpperCase()}`).join('\n')}

CONTEXT TO INCORPORATE:
- Recent News: ${context.news?.summary || 'General market conditions'}
- Market Data: ${context.market ? JSON.stringify(context.market) : 'Standard market metrics'}
- Economic Context: ${context.enhanced?.newsContext || 'Current economic environment'}

WRITING REQUIREMENTS:
1. Start with a compelling headline that captures the key insight
2. Write in NPR Marketplace style - authoritative yet accessible
3. Include specific data points and numbers where relevant
4. Incorporate quotes and expert perspectives naturally
5. Reference current market conditions and recent developments
6. Include clear section breaks for chart placement
7. End with actionable insights or forward-looking perspective
8. Write for ${context.complexity} level readers

CHART INTEGRATION NOTES:
- Include natural breaks where charts would enhance the story
- Reference data that could be visualized
- Set up chart context with phrases like "as the data shows..." or "the numbers reveal..."

Format the response as structured sections clearly marked for easy parsing.`;
  }

  // Generate charts specifically for the article
  async generateArticleCharts(context, contentType, article) {
    const template = this.contentTemplates[contentType] || this.contentTemplates.featuredArticle;
    const chartTypes = template.chartTypes;

    const chartPromises = chartTypes.map(async (chartType) => {
      try {
        const chartData = await this.createContextualChartData(context, chartType, article);
        return {
          type: chartType,
          data: chartData,
          placement: this.chartStrategies[chartType]?.placement || 'after_context',
          caption: this.generateChartCaption(chartType, chartData, context),
          insight: this.extractChartInsight(chartType, chartData, context)
        };
      } catch (error) {
        console.error(`Error generating ${chartType} chart:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(chartPromises);
    return results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);
  }

  // Create contextual chart data based on article content
  createContextualChartData(context, chartType, article) {
    switch (chartType) {
      case 'market_performance':
        return this.createMarketPerformanceData(context);
      case 'economic_indicators':
        return this.createEconomicIndicatorData(context);
      case 'sector_performance':
        return this.createSectorPerformanceData(context);
      case 'risk_return':
        return this.createRiskReturnData(context);
      default:
        return this.createGenericChartData(context, chartType);
    }
  }

  // Specific chart data generation methods
  createMarketPerformanceData(context) {
    // Generate realistic market performance data based on context
    const baseData = [
      { id: "S&P 500", data: this.generateTimeSeriesData(4200, 4650, 9) },
      { id: "NASDAQ", data: this.generateTimeSeriesData(13200, 14920, 9) },
      { id: "DOW", data: this.generateTimeSeriesData(33500, 36100, 9) }
    ];

    // Adjust data based on market sentiment from context
    if (context.news?.sentiment === 'negative') {
      baseData.forEach(series => {
        series.data = series.data.map(point => ({
          ...point,
          y: point.y * (0.95 + Math.random() * 0.1)
        }));
      });
    }

    return baseData;
  }

  createEconomicIndicatorData(context) {
    const indicators = [
      { indicator: "GDP Growth", value: 2.3, color: '#3b82f6' },
      { indicator: "Unemployment", value: 3.8, color: '#ef4444' },
      { indicator: "Inflation Rate", value: 3.2, color: '#f59e0b' },
      { indicator: "Fed Funds Rate", value: 5.25, color: '#8b5cf6' },
      { indicator: "Consumer Confidence", value: 102.5, color: '#10b981' }
    ];

    // Adjust indicators based on economic context
    if (context.economic) {
      // Use real data if available
      return indicators.map(indicator => ({
        ...indicator,
        value: context.economic[indicator.indicator.toLowerCase().replace(/\s+/g, '_')] || indicator.value
      }));
    }

    return indicators;
  }

  createSectorPerformanceData(context) {
    return [
      { id: "Technology", value: 28.5, color: "#3b82f6" },
      { id: "Healthcare", value: 15.2, color: "#10b981" },
      { id: "Finance", value: 18.7, color: "#f59e0b" },
      { id: "Energy", value: 8.9, color: "#ef4444" },
      { id: "Consumer", value: 12.3, color: "#8b5cf6" },
      { id: "Industrial", value: 9.8, color: "#06b6d4" },
      { id: "Other", value: 6.6, color: "#6b7280" }
    ];
  }

  createRiskReturnData(context) {
    return [{
      id: "stocks",
      data: [
        { x: 15.2, y: 8.5, symbol: 'AAPL' },
        { x: 18.7, y: 12.3, symbol: 'TSLA' },
        { x: 12.1, y: 6.8, symbol: 'MSFT' },
        { x: 22.5, y: 15.2, symbol: 'NVDA' },
        { x: 8.9, y: 4.2, symbol: 'JNJ' },
        { x: 25.8, y: 18.9, symbol: 'AMZN' },
        { x: 14.3, y: 7.6, symbol: 'GOOGL' },
        { x: 19.4, y: 11.8, symbol: 'META' }
      ]
    }];
  }

  // Generate time series data with realistic patterns
  generateTimeSeriesData(startValue, endValue, points) {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const baseValue = startValue + (endValue - startValue) * progress;
      const volatility = baseValue * 0.05; // 5% volatility
      const randomFactor = (Math.random() - 0.5) * volatility;

      data.push({
        x: `2024-${months[i]}`,
        y: Math.round(baseValue + randomFactor)
      });
    }

    return data;
  }

  // Generate contextual chart captions
  generateChartCaption(chartType, chartData, context) {
    const strategy = this.chartStrategies[chartType];
    if (!strategy) return `Chart showing ${chartType.replace('_', ' ')} data`;

    switch (chartType) {
      case 'market_performance':
        const marketTrend = this.analyzeMarketTrend(chartData);
        return strategy.caption_template
          .replace('{timeframe}', 'past 9 months')
          .replace('{trend}', marketTrend.direction)
          .replace('{key_insight}', marketTrend.insight);

      case 'economic_indicators':
        const economicInsight = this.analyzeEconomicIndicators(chartData);
        return strategy.caption_template
          .replace('{pattern}', economicInsight.pattern)
          .replace('{implication}', economicInsight.implication);

      case 'sector_performance':
        const sectorInsight = this.analyzeSectorPerformance(chartData);
        return strategy.caption_template
          .replace('{winner}', sectorInsight.winner)
          .replace('{laggard}', sectorInsight.laggard);

      default:
        return `Analysis of ${chartType.replace('_', ' ')} reveals important market patterns`;
    }
  }

  // Analyze chart data for insights
  analyzeMarketTrend(chartData) {
    const sp500Data = chartData.find(series => series.id === "S&P 500");
    if (!sp500Data) return { direction: 'mixed', insight: 'varied performance across indices' };

    const firstValue = sp500Data.data[0].y;
    const lastValue = sp500Data.data[sp500Data.data.length - 1].y;
    const change = ((lastValue - firstValue) / firstValue) * 100;

    return {
      direction: change > 0 ? 'upward momentum' : 'downward pressure',
      insight: `${Math.abs(change).toFixed(1)}% ${change > 0 ? 'gain' : 'decline'} year-to-date`
    };
  }

  analyzeEconomicIndicators(indicators) {
    const inflationRate = indicators.find(i => i.indicator === "Inflation Rate");
    const unemployment = indicators.find(i => i.indicator === "Unemployment");

    if (inflationRate && inflationRate.value > 3) {
      return {
        pattern: 'elevated inflation persists',
        implication: 'continued monetary policy tightening likely'
      };
    }

    return {
      pattern: 'mixed economic signals',
      implication: 'cautious optimism among policymakers'
    };
  }

  analyzeSectorPerformance(sectors) {
    const sorted = sectors.sort((a, b) => b.value - a.value);
    return {
      winner: sorted[0].id,
      laggard: sorted[sorted.length - 1].id
    };
  }

  // Assemble final enhanced article with embedded charts
  assembleEnhancedArticle(article, chartData, context, contentType) {
    const template = this.contentTemplates[contentType] || this.contentTemplates.featuredArticle;

    return {
      id: `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      headline: article.headline,
      subheadline: article.subheadline,
      content: article.content,
      charts: chartData || [],
      metadata: {
        contentType,
        topic: context.topic,
        complexity: context.complexity,
        generatedAt: new Date().toISOString(),
        wordCount: this.calculateWordCount(article.content),
        readTime: Math.ceil(this.calculateWordCount(article.content) / 200),
        targetLength: template.targetLength,
        sources: context.news?.sources || [],
        hasCharts: chartData && chartData.length > 0,
        chartCount: chartData ? chartData.length : 0
      },
      seo: {
        metaDescription: this.generateMetaDescription(article.headline, article.content),
        keywords: this.extractKeywords(context.topic, article.content),
        canonicalUrl: `/articles/${this.generateSlug(article.headline)}`
      },
      publishing: {
        status: 'draft',
        publishedAt: null,
        updatedAt: new Date().toISOString(),
        featured: contentType === 'featuredArticle',
        category: this.mapContentTypeToCategory(contentType)
      }
    };
  }

  // Helper methods
  parseArticleResponse(response, structure) {
    const content = typeof response === 'string' ? response : response.choices?.[0]?.message?.content || '';

    // Extract headline (first line or section)
    const lines = content.split('\n').filter(line => line.trim());
    const headline = lines[0]?.replace(/^#+\s*/, '') || 'Financial Market Analysis';

    return {
      headline,
      subheadline: lines[1] || '',
      content: content,
      sections: this.parseSections(content, structure)
    };
  }

  parseSections(content, structure) {
    const sections = {};
    structure.forEach((sectionName, index) => {
      // Simple section parsing - in production, this would be more sophisticated
      const sectionStart = content.indexOf(sectionName.replace(/_/g, ' '));
      const nextSectionStart = structure[index + 1]
        ? content.indexOf(structure[index + 1].replace(/_/g, ' '))
        : content.length;

      if (sectionStart !== -1) {
        sections[sectionName] = content.slice(sectionStart, nextSectionStart).trim();
      }
    });
    return sections;
  }

  mapContentTypeToSearchType(contentType) {
    const mapping = {
      featuredArticle: 'marketContext',
      marketAnalysis: 'marketContext',
      educationalContent: 'economicData',
      breakingNews: 'breakingNews',
      weeklyWrap: 'weeklyWrap'
    };
    return mapping[contentType] || 'marketContext';
  }

  mapContentTypeToCategory(contentType) {
    const mapping = {
      featuredArticle: 'featured',
      marketAnalysis: 'markets',
      educationalContent: 'education',
      breakingNews: 'news',
      weeklyWrap: 'analysis'
    };
    return mapping[contentType] || 'general';
  }

  calculateWordCount(content) {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  }

  generateMetaDescription(headline, content) {
    const firstSentence = content.split('.')[0] + '.';
    return firstSentence.length > 160
      ? firstSentence.substring(0, 157) + '...'
      : firstSentence;
  }

  extractKeywords(topic, content) {
    const commonFinancialTerms = [
      'market', 'stock', 'economy', 'inflation', 'GDP', 'Fed', 'investment',
      'earnings', 'revenue', 'growth', 'analysis', 'forecast', 'trend'
    ];

    const contentWords = content.toLowerCase().split(/\s+/);
    const keywords = [topic.toLowerCase()];

    commonFinancialTerms.forEach(term => {
      if (contentWords.includes(term) && !keywords.includes(term)) {
        keywords.push(term);
      }
    });

    return keywords.slice(0, 10);
  }

  generateSlug(headline) {
    return headline
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  // Fallback methods
  getFallbackContext(topic, contentType) {
    return {
      topic,
      contentType,
      news: { summary: `Current financial context for ${topic}`, sources: [] },
      market: { trend: 'mixed', volatility: 'moderate' },
      economic: { outlook: 'stable' },
      enhanced: { newsContext: 'General market conditions' }
    };
  }

  getFallbackArticle(config) {
    return {
      id: `fallback-${Date.now()}`,
      headline: `Financial Analysis: ${config.topic}`,
      subheadline: 'Market insights and economic perspective',
      content: `This is a comprehensive analysis of ${config.topic} in the current market environment...`,
      charts: [],
      metadata: {
        contentType: config.contentType,
        topic: config.topic,
        generatedAt: new Date().toISOString(),
        wordCount: 500,
        readTime: 3,
        hasCharts: false
      }
    };
  }

  getFallbackArticleContent(context, contentType) {
    return {
      headline: `Market Analysis: ${context.topic}`,
      subheadline: 'Expert insights on current market conditions',
      content: `Current market analysis shows mixed signals regarding ${context.topic}...`,
      sections: {
        headline: `Market Analysis: ${context.topic}`,
        lead: 'Market conditions show continued uncertainty...',
        analysis: 'Key factors to consider include...'
      }
    };
  }

  // Batch generate multiple articles
  async generateArticleSeries(topics, contentType = 'featuredArticle') {
    const promises = topics.map(topic =>
      this.generateEnhancedArticle({
        contentType,
        topic,
        complexity: 'intermediate',
        includeCharts: true
      })
    );

    const results = await Promise.allSettled(promises);
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
  }
}

// Create and export singleton instance
export const enhancedContentAPI = new EnhancedContentService();
export default enhancedContentAPI;