import { useState } from 'react';

// Simple AI integration framework
// In a real implementation, this would connect to OpenAI API or similar service
export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock AI article generation
  const generateArticleContent = async (prompt, category = 'general') => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock AI-generated content based on prompt
      const mockContent = generateMockContent(prompt, category);

      return {
        title: generateTitle(prompt),
        content: mockContent,
        excerpt: generateExcerpt(mockContent),
        tags: generateTags(category),
        ai_generated: true,
        ai_prompt: prompt
      };
    } catch (err) {
      setError('Failed to generate content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mock AI market analysis
  const generateMarketAnalysis = async (symbol) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        symbol,
        analysis: `Based on recent market trends, ${symbol} shows promising indicators with strong fundamentals and positive momentum. Technical analysis suggests potential upward movement in the coming weeks.`,
        sentiment: 'bullish',
        confidence: 0.78,
        key_points: [
          'Strong earnings growth',
          'Positive analyst sentiment',
          'Technical breakout pattern'
        ]
      };
    } catch (err) {
      setError('Failed to generate analysis');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mock content summarization
  const summarizeContent = async (content) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sentences = content.split('.').filter(s => s.trim().length > 0);
      const summary = sentences.slice(0, 2).join('.') + '.';

      return {
        summary,
        key_points: extractKeyPoints(content),
        reading_time: Math.max(1, Math.floor(content.split(' ').length / 200))
      };
    } catch (err) {
      setError('Failed to summarize content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateArticleContent,
    generateMarketAnalysis,
    summarizeContent
  };
}

// Helper functions for mock content generation
function generateTitle(prompt) {
  const titles = [
    "Market Analysis: Key Trends Shaping Today's Financial Landscape",
    "Breaking Down the Latest Economic Indicators",
    "Investment Insights: Navigating Current Market Conditions",
    "Financial Markets Update: What Investors Need to Know",
    "Economic Outlook: Trends and Opportunities Ahead"
  ];

  return titles[Math.floor(Math.random() * titles.length)];
}

function generateMockContent(prompt, category) {
  const baseContent = `
# Introduction

The financial markets continue to evolve at a rapid pace, driven by technological innovation, changing consumer behaviors, and global economic shifts. Understanding these dynamics is crucial for investors and financial professionals alike.

## Market Overview

Current market conditions reflect a complex interplay of factors including monetary policy, geopolitical events, and technological disruption. Key sectors showing significant activity include technology, healthcare, and renewable energy.

## Key Insights

**Technology Sector**: Innovation continues to drive growth, with artificial intelligence and cloud computing leading the charge. Companies investing in these areas are seeing substantial returns.

**Healthcare**: The sector remains resilient with breakthrough treatments and an aging population driving long-term growth prospects.

**Renewable Energy**: Government policies and environmental concerns are accelerating the transition to clean energy solutions.

## Investment Implications

For investors, diversification remains key. Consider:

- **Growth vs. Value**: Balance growth opportunities with stable value investments
- **Geographic Diversification**: Don't overlook international markets
- **Sector Rotation**: Stay alert to shifting sector dynamics
- **Risk Management**: Implement appropriate hedging strategies

## Conclusion

The current financial landscape presents both opportunities and challenges. Staying informed and maintaining a disciplined approach to investment decisions will be crucial for success in the coming months.

*This analysis is for informational purposes only and should not be considered as investment advice.*
  `;

  return baseContent.trim();
}

function generateExcerpt(content) {
  const firstParagraph = content.split('\n\n')[1];
  return firstParagraph ? firstParagraph.substring(0, 150) + '...' : '';
}

function generateTags(category) {
  const tagMap = {
    markets: ['stocks', 'trading', 'market-analysis'],
    economy: ['economy', 'gdp', 'inflation'],
    tech: ['technology', 'innovation', 'fintech'],
    crypto: ['cryptocurrency', 'bitcoin', 'blockchain'],
    analysis: ['analysis', 'research', 'insights'],
    news: ['breaking-news', 'updates', 'alerts'],
    education: ['education', 'learning', 'basics']
  };

  return tagMap[category] || ['finance', 'investment', 'analysis'];
}

function extractKeyPoints(content) {
  return [
    'Market volatility requires careful analysis',
    'Diversification remains a key strategy',
    'Technology sector shows continued strength',
    'Long-term perspective is important'
  ];
}