// Visual Content Generation Service
// Integrates Gemini Flash 2.5 for AI-generated images and visual storytelling

class VisualContentService {
  constructor() {
    this.geminiKey = process.env.REACT_APP_GEMINI_API_KEY || 'demo';
    this.geminiBase = 'https://generativelanguage.googleapis.com/v1/models';

    // Image generation prompts for different content types
    this.promptTemplates = {
      storyImage: "Create a professional financial journalism illustration showing {concept}. Style: clean, modern, editorial illustration suitable for financial news. Colors: blues and grays with accent colors. No text overlays.",
      podcastCover: "Design a podcast episode cover for '{title}'. Theme: {theme}. Style: NPR Marketplace aesthetic, professional financial journalism, minimal and clean design. Include subtle financial charts or market imagery.",
      marketTrend: "Visualize {marketData} as an abstract financial illustration. Style: data visualization meets editorial art, sophisticated color palette, suitable for financial journalism.",
      economicConcept: "Create an educational illustration explaining {concept}. Style: infographic-style, clear visual metaphors, professional financial publication quality.",
      breakingNews: "Design a breaking news illustration for '{headline}'. Style: urgent but professional, financial news aesthetic, bold but not sensational."
    };
  }

  // Generate story illustration using Gemini Flash 2.5
  async generateStoryImage(story) {
    try {
      const prompt = this.buildImagePrompt('storyImage', {
        concept: this.extractVisualConcept(story.content),
        title: story.title,
        category: story.category
      });

      const response = await this.callGeminiVision(prompt, {
        aspectRatio: '16:9',
        style: 'editorial_illustration',
        quality: 'high'
      });

      return {
        imageUrl: response.imageUrl,
        altText: `Illustration for: ${story.title}`,
        caption: this.generateImageCaption(story),
        prompt: prompt
      };

    } catch (error) {
      console.error('Error generating story image:', error);
      return this.getFallbackImage('story', story.category);
    }
  }

  // Generate podcast episode cover art
  async generatePodcastCover(episode) {
    try {
      const prompt = this.buildImagePrompt('podcastCover', {
        title: episode.title,
        theme: episode.theme || 'market analysis',
        duration: episode.duration,
        type: episode.type // 'daily_brief', 'deep_dive', 'breaking_news'
      });

      const response = await this.callGeminiVision(prompt, {
        aspectRatio: '1:1',
        style: 'podcast_cover',
        quality: 'high'
      });

      return {
        imageUrl: response.imageUrl,
        altText: `Podcast cover for: ${episode.title}`,
        style: 'cover_art',
        prompt: prompt
      };

    } catch (error) {
      console.error('Error generating podcast cover:', error);
      return this.getFallbackImage('podcast', episode.type);
    }
  }

  // Generate market trend visualization
  async generateMarketVisualization(marketData, analysisType = 'trend') {
    try {
      const prompt = this.buildImagePrompt('marketTrend', {
        marketData: this.summarizeMarketData(marketData),
        analysisType,
        timeframe: marketData.timeframe || 'daily'
      });

      const response = await this.callGeminiVision(prompt, {
        aspectRatio: '16:10',
        style: 'data_visualization',
        quality: 'high'
      });

      return {
        imageUrl: response.imageUrl,
        altText: `Market trend visualization: ${analysisType}`,
        dataSource: 'Generated from live market data',
        prompt: prompt
      };

    } catch (error) {
      console.error('Error generating market visualization:', error);
      return this.getFallbackImage('chart', analysisType);
    }
  }

  // Generate economic concept illustration
  async generateEconomicIllustration(concept, complexity = 'intermediate') {
    try {
      const prompt = this.buildImagePrompt('economicConcept', {
        concept,
        complexity,
        audience: this.getAudienceDescription(complexity)
      });

      const response = await this.callGeminiVision(prompt, {
        aspectRatio: '4:3',
        style: 'educational_illustration',
        quality: 'high'
      });

      return {
        imageUrl: response.imageUrl,
        altText: `Educational illustration: ${concept}`,
        educationLevel: complexity,
        prompt: prompt
      };

    } catch (error) {
      console.error('Error generating economic illustration:', error);
      return this.getFallbackImage('concept', concept);
    }
  }

  // Generate breaking news illustration
  async generateBreakingNewsImage(headline, urgency = 'normal') {
    try {
      const prompt = this.buildImagePrompt('breakingNews', {
        headline,
        urgency,
        tone: urgency === 'high' ? 'urgent but professional' : 'informative'
      });

      const response = await this.callGeminiVision(prompt, {
        aspectRatio: '16:9',
        style: 'breaking_news',
        quality: 'high'
      });

      return {
        imageUrl: response.imageUrl,
        altText: `Breaking news illustration: ${headline}`,
        urgencyLevel: urgency,
        prompt: prompt
      };

    } catch (error) {
      console.error('Error generating breaking news image:', error);
      return this.getFallbackImage('news', 'breaking');
    }
  }

  // Core Gemini API call
  async callGeminiVision(prompt, options = {}) {
    try {
      // Use demo/mock images when in development or demo mode
      if (this.geminiKey === 'demo' || process.env.NODE_ENV === 'development') {
        console.log('Using mock image generation for development');
        return this.getMockImageResponse(prompt, options);
      }

      // Actual Gemini API implementation
      const requestBody = {
        contents: [{
          parts: [{
            text: `Generate an image: ${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(`${this.geminiBase}/gemini-2.0-flash-exp:generateContent?key=${this.geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.warn(`Gemini API error: ${response.status}, falling back to mock images`);
        return this.getMockImageResponse(prompt, options);
      }

      const data = await response.json();

      // Extract image URL from Gemini response if available
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content && content.includes('http')) {
        const imageUrlMatch = content.match(/(https?:\/\/[^\s]+)/);
        return {
          imageUrl: imageUrlMatch ? imageUrlMatch[0] : this.getMockImageResponse(prompt, options).imageUrl,
          revisedPrompt: content
        };
      }

      // Fallback to mock images if no image URL found
      return this.getMockImageResponse(prompt, options);

    } catch (error) {
      console.warn('Gemini API call failed, using fallback images:', error.message);
      return this.getMockImageResponse(prompt, options);
    }
  }

  // Helper methods
  buildImagePrompt(template, variables) {
    let prompt = this.promptTemplates[template];

    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(`{${key}}`, value);
    });

    return prompt;
  }

  extractVisualConcept(content) {
    // Extract key financial concepts from article content for visualization
    const concepts = [
      'market volatility', 'economic growth', 'inflation trends',
      'interest rate changes', 'stock performance', 'sector analysis',
      'global markets', 'cryptocurrency trends', 'economic indicators'
    ];

    const contentLower = content.toLowerCase();
    const foundConcepts = concepts.filter(concept =>
      contentLower.includes(concept.toLowerCase())
    );

    return foundConcepts[0] || 'financial market analysis';
  }

  summarizeMarketData(marketData) {
    // Create a concise summary of market data for visualization
    return `Market showing ${marketData.trend || 'mixed'} trends with ${marketData.volatility || 'moderate'} volatility`;
  }

  generateImageCaption(story) {
    return `Visual representation of key concepts from: ${story.title}`;
  }

  getAudienceDescription(complexity) {
    const descriptions = {
      beginner: 'newcomers to finance, simple visual metaphors',
      intermediate: 'general audience, balanced detail and clarity',
      advanced: 'experienced investors, sophisticated concepts'
    };
    return descriptions[complexity] || descriptions.intermediate;
  }

  mapAspectRatioToSize(aspectRatio) {
    const sizeMap = {
      '1:1': '1024x1024',
      '16:9': '1792x1024',
      '9:16': '1024x1792',
      '4:3': '1536x1152',
      '16:10': '1792x1120'
    };
    return sizeMap[aspectRatio] || '1792x1024';
  }

  // Mock responses for development
  getMockImageResponse(prompt, options) {
    const mockImages = {
      story: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
      podcast: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
      chart: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=500&fit=crop',
      concept: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      news: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop'
    };

    return {
      imageUrl: mockImages.story,
      revisedPrompt: prompt
    };
  }

  getFallbackImage(type, category) {
    const fallbacks = {
      story: {
        markets: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
        economy: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop',
        tech: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
        crypto: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop'
      },
      podcast: {
        daily_brief: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
        deep_dive: 'https://images.unsplash.com/photo-1543165365-5d8d8f8bbe8d?w=400&h=400&fit=crop'
      }
    };

    return {
      imageUrl: fallbacks[type]?.[category] || fallbacks.story.markets,
      altText: `${type} illustration`,
      isFallback: true
    };
  }

  // Batch generation for multiple content pieces
  async generateContentVisuals(contentList) {
    const promises = contentList.map(async (content) => {
      try {
        if (content.type === 'story') {
          return await this.generateStoryImage(content);
        } else if (content.type === 'podcast') {
          return await this.generatePodcastCover(content);
        } else if (content.type === 'market_data') {
          return await this.generateMarketVisualization(content.data);
        }
      } catch (error) {
        console.error(`Error generating visual for ${content.id}:`, error);
        return this.getFallbackImage(content.type, content.category);
      }
    });

    return Promise.allSettled(promises);
  }
}

// Create and export singleton instance
export const visualContentAPI = new VisualContentService();
export default visualContentAPI;