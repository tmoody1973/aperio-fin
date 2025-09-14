// AI Script Generation Service
// Combines financial data, market context, and news analysis to generate multi-voice dialogue scripts

import { financialAPI } from './financialAPI.js';
import { perplexityAPI } from './perplexityAPI.js';

class ScriptGenerationService {
  constructor() {
    // Multi-voice AI characters with distinct personalities
    this.characters = {
      sarah: {
        name: "Sarah",
        role: "Host",
        personality: "Warm, accessible, guides conversations smoothly. NPR Marketplace style.",
        voiceStyle: "Professional but conversational, explanatory tone"
      },
      marcus: {
        name: "Marcus",
        role: "Market Analyst",
        personality: "Data-driven, analytical, provides technical insights with clear explanations.",
        voiceStyle: "Confident, numbers-focused, but approachable"
      },
      elena: {
        name: "Dr. Elena Rodriguez",
        role: "Economic Economist",
        personality: "Academic expertise made accessible, provides broader economic context.",
        voiceStyle: "Thoughtful, educational, connects dots between policy and markets"
      }
    };

    // Script templates for different content types
    this.scriptTemplates = {
      dailyBrief: {
        duration: "3-4 minutes",
        structure: ["intro", "market_highlights", "economic_context", "key_takeaway", "outro"],
        tone: "informative, accessible to general audience"
      },
      deepDive: {
        duration: "12-15 minutes",
        structure: ["intro", "topic_setup", "data_analysis", "expert_perspectives", "implications", "conclusion"],
        tone: "comprehensive analysis for engaged listeners"
      },
      marketPulse: {
        duration: "90 seconds",
        structure: ["urgent_intro", "breaking_context", "market_impact", "what_to_watch"],
        tone: "urgent but measured, breaking news style"
      },
      economicLens: {
        duration: "8-10 minutes",
        structure: ["concept_intro", "real_world_examples", "policy_connections", "future_outlook"],
        tone: "educational, builds understanding progressively"
      }
    };
  }

  // Generate comprehensive dialogue script
  async generateScript(contentConfig) {
    try {
      const { type, topic, targetDuration, complexity = 'intermediate' } = contentConfig;

      // Step 1: Gather comprehensive context
      const context = await this.gatherScriptContext(topic, type, complexity);

      // Step 2: Create script structure
      const structure = this.buildScriptStructure(type, context);

      // Step 3: Generate dialogue for each segment
      const script = await this.generateDialogueSegments(structure, context);

      // Step 4: Add production notes
      const finalScript = this.addProductionNotes(script, type, targetDuration);

      return finalScript;

    } catch (error) {
      console.error('Script generation error:', error);
      return this.getFallbackScript(contentConfig);
    }
  }

  // Gather all relevant context for script generation
  async gatherScriptContext(topic, contentType, complexity) {
    try {
      // Parallel data gathering for efficiency
      const [
        marketData,
        economicIndicators,
        newsContext,
        enhancedContext
      ] = await Promise.allSettled([
        financialAPI.getMarketOverview(),
        financialAPI.getEconomicIndicators(),
        perplexityAPI.searchFinancialNews(topic, 'marketContext', {
          recency: contentType === 'marketPulse' ? 'hour' : 'day'
        }),
        perplexityAPI.generateContentContext(contentType, topic, {
          complexity,
          audienceLevel: this.getAudienceLevel(complexity)
        })
      ]);

      return {
        market: marketData.status === 'fulfilled' ? marketData.value : null,
        economic: economicIndicators.status === 'fulfilled' ? economicIndicators.value : null,
        news: newsContext.status === 'fulfilled' ? newsContext.value : null,
        enhanced: enhancedContext.status === 'fulfilled' ? enhancedContext.value : null,
        topic,
        contentType,
        complexity,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Context gathering error:', error);
      return this.getFallbackContext(topic, contentType);
    }
  }

  // Build script structure based on content type
  buildScriptStructure(type, context) {
    const template = this.scriptTemplates[type] || this.scriptTemplates.dailyBrief;

    return {
      contentType: type,
      targetDuration: template.duration,
      tone: template.tone,
      segments: template.structure.map(segment => ({
        name: segment,
        purpose: this.getSegmentPurpose(segment),
        estimatedDuration: this.estimateSegmentDuration(segment, template.duration),
        keyPoints: this.extractSegmentKeyPoints(segment, context),
        characters: this.assignCharactersToSegment(segment, type)
      }))
    };
  }

  // Generate dialogue for each script segment
  async generateDialogueSegments(structure, context) {
    const dialoguePromises = structure.segments.map(async (segment) => {
      const prompt = this.buildDialoguePrompt(segment, context, structure.tone);

      try {
        const response = await perplexityAPI.callPerplexityChat(prompt, {
          context: context.enhanced?.newsContext,
          marketData: context.market,
          economicData: context.economic,
          characters: segment.characters,
          tone: structure.tone
        });

        return {
          segment: segment.name,
          dialogue: this.parseDialogueResponse(response),
          duration: segment.estimatedDuration,
          characters: segment.characters,
          keyPoints: segment.keyPoints
        };

      } catch (error) {
        console.error(`Error generating dialogue for ${segment.name}:`, error);
        return this.getFallbackDialogue(segment, context);
      }
    });

    const dialogueSegments = await Promise.allSettled(dialoguePromises);

    return {
      structure,
      context,
      segments: dialogueSegments
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value),
      metadata: {
        generatedAt: new Date().toISOString(),
        totalEstimatedDuration: this.calculateTotalDuration(structure.segments),
        wordCount: 0 // Will be calculated after dialogue generation
      }
    };
  }

  // Build dialogue generation prompt
  buildDialoguePrompt(segment, context, tone) {
    const characterList = segment.characters.map(char =>
      `${this.characters[char].name} (${this.characters[char].role}): ${this.characters[char].personality}`
    ).join('\n');

    return `Create a natural dialogue for a financial journalism segment titled "${segment.name}".

CHARACTERS:
${characterList}

SEGMENT PURPOSE: ${segment.purpose}
TONE: ${tone}
TARGET DURATION: ${segment.estimatedDuration}

KEY POINTS TO COVER:
${segment.keyPoints.map(point => `- ${point}`).join('\n')}

FINANCIAL CONTEXT:
- Market sentiment: ${context.enhanced?.marketImpact || 'mixed'}
- Recent news: ${context.news?.summary || 'general market conditions'}
- Economic backdrop: ${context.enhanced?.newsContext || 'stable conditions'}

REQUIREMENTS:
1. Natural conversational flow between characters
2. Each character speaks in their distinct voice and expertise area
3. Include specific data points and numbers when relevant
4. Make complex topics accessible to general audience
5. Maintain NPR Marketplace quality and style
6. Include natural transitions and reactions between speakers
7. Keep dialogue engaging and informative

Format the response as:
CHARACTER: [Dialogue text]
CHARACTER: [Dialogue text]
etc.`;
  }

  // Parse AI response into structured dialogue
  parseDialogueResponse(response) {
    const content = typeof response === 'string' ? response : response.choices?.[0]?.message?.content || '';

    const dialogueLines = content.split('\n')
      .filter(line => line.trim() && line.includes(':'))
      .map(line => {
        const [speaker, ...textParts] = line.split(':');
        return {
          speaker: speaker.trim(),
          text: textParts.join(':').trim(),
          timestamp: null // Will be added during audio generation
        };
      });

    return dialogueLines;
  }

  // Add production notes for audio generation
  addProductionNotes(script, contentType, targetDuration) {
    const wordCount = this.calculateWordCount(script);
    const readingSpeed = 150; // words per minute for natural speech
    const estimatedDuration = Math.round(wordCount / readingSpeed * 60); // seconds

    return {
      ...script,
      productionNotes: {
        contentType,
        targetDurationSeconds: this.parseDuration(targetDuration),
        estimatedDurationSeconds: estimatedDuration,
        totalWordCount: wordCount,
        averageWordsPerMinute: readingSpeed,
        voiceGeneration: {
          characters: Object.keys(this.characters).map(key => ({
            id: key,
            name: this.characters[key].name,
            voiceStyle: this.characters[key].voiceStyle,
            segments: script.segments.filter(seg =>
              seg.characters.includes(key)
            ).length
          }))
        },
        mixingNotes: [
          "Apply NPR-style EQ and compression",
          "Add subtle background music during transitions",
          "Ensure consistent audio levels between speakers",
          "Include brief pause between major segments"
        ]
      }
    };
  }

  // Helper methods
  getSegmentPurpose(segmentName) {
    const purposes = {
      intro: "Hook listeners and introduce today's focus",
      market_highlights: "Cover key market movements and trends",
      economic_context: "Provide broader economic perspective",
      key_takeaway: "Synthesize main insights for listeners",
      outro: "Wrap up and preview tomorrow's content",
      topic_setup: "Establish the issue and why it matters",
      data_analysis: "Deep dive into relevant numbers and trends",
      expert_perspectives: "Multiple viewpoints on implications",
      implications: "What this means for different stakeholders",
      conclusion: "Key insights and forward-looking perspective",
      urgent_intro: "Immediate attention grabber for breaking news",
      breaking_context: "Essential background context",
      market_impact: "Direct effects on markets and investors",
      what_to_watch: "Key indicators and next developments",
      concept_intro: "Introduce economic concept clearly",
      real_world_examples: "Concrete examples to illustrate concept",
      policy_connections: "How policy affects everyday economics",
      future_outlook: "Implications and what to expect"
    };

    return purposes[segmentName] || "Provide relevant financial context";
  }

  estimateSegmentDuration(segmentName, totalDuration) {
    // Parse duration string to seconds
    const totalSeconds = this.parseDuration(totalDuration);

    const segmentWeights = {
      intro: 0.15,
      market_highlights: 0.35,
      economic_context: 0.25,
      key_takeaway: 0.15,
      outro: 0.10,
      topic_setup: 0.20,
      data_analysis: 0.30,
      expert_perspectives: 0.25,
      implications: 0.15,
      conclusion: 0.10,
      urgent_intro: 0.25,
      breaking_context: 0.35,
      market_impact: 0.25,
      what_to_watch: 0.15,
      concept_intro: 0.25,
      real_world_examples: 0.35,
      policy_connections: 0.25,
      future_outlook: 0.15
    };

    const weight = segmentWeights[segmentName] || 0.20;
    const segmentSeconds = Math.round(totalSeconds * weight);

    return `${Math.floor(segmentSeconds / 60)}:${(segmentSeconds % 60).toString().padStart(2, '0')}`;
  }

  extractSegmentKeyPoints(segment, context) {
    const enhanced = context.enhanced;
    const news = context.news;

    // Generate segment-specific key points based on available context
    const basePoints = enhanced?.keyPoints || news?.keyPoints || [
      'Current market conditions',
      'Recent developments',
      'Key implications'
    ];

    return basePoints.slice(0, 3); // Limit to 3 key points per segment
  }

  assignCharactersToSegment(segment, contentType) {
    // Smart character assignment based on segment purpose
    const assignments = {
      intro: ['sarah'],
      market_highlights: ['sarah', 'marcus'],
      economic_context: ['elena', 'sarah'],
      key_takeaway: ['sarah'],
      outro: ['sarah'],
      topic_setup: ['sarah'],
      data_analysis: ['marcus', 'elena'],
      expert_perspectives: ['elena', 'marcus'],
      implications: ['sarah', 'elena'],
      conclusion: ['sarah'],
      urgent_intro: ['sarah'],
      breaking_context: ['marcus', 'sarah'],
      market_impact: ['marcus'],
      what_to_watch: ['sarah', 'marcus'],
      concept_intro: ['elena'],
      real_world_examples: ['sarah', 'elena'],
      policy_connections: ['elena'],
      future_outlook: ['elena', 'sarah']
    };

    return assignments[segment] || ['sarah'];
  }

  parseDuration(durationString) {
    // Convert "3-4 minutes" or "90 seconds" to seconds
    const minutes = durationString.match(/(\d+)(?:-\d+)?\s*minutes?/);
    const seconds = durationString.match(/(\d+)\s*seconds?/);

    if (minutes) {
      return parseInt(minutes[1]) * 60;
    } else if (seconds) {
      return parseInt(seconds[1]);
    }

    return 180; // Default 3 minutes
  }

  calculateWordCount(script) {
    return script.segments.reduce((total, segment) => {
      return total + segment.dialogue.reduce((segmentTotal, line) => {
        return segmentTotal + (line.text.split(' ').length);
      }, 0);
    }, 0);
  }

  calculateTotalDuration(segments) {
    const totalSeconds = segments.reduce((total, segment) => {
      return total + this.parseDuration(segment.estimatedDuration);
    }, 0);

    return `${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, '0')}`;
  }

  getAudienceLevel(complexity) {
    const levels = {
      beginner: 'newcomers to finance',
      intermediate: 'general educated audience',
      advanced: 'experienced investors and professionals'
    };
    return levels[complexity] || levels.intermediate;
  }

  // Fallback methods
  getFallbackContext(topic, contentType) {
    return {
      market: { trend: 'mixed', volatility: 'moderate' },
      economic: { outlook: 'stable', key_indicators: ['GDP', 'inflation', 'employment'] },
      news: { summary: `Current financial context for ${topic}`, sources: [] },
      enhanced: {
        keyPoints: ['Market overview', 'Economic indicators', 'Investment implications'],
        marketImpact: 'moderate'
      },
      topic,
      contentType
    };
  }

  getFallbackDialogue(segment, context) {
    return {
      segment: segment.name,
      dialogue: [
        {
          speaker: 'Sarah',
          text: `Welcome back. Today we're looking at ${context.topic}.`,
          timestamp: null
        },
        {
          speaker: 'Marcus',
          text: `The data shows some interesting trends in this area.`,
          timestamp: null
        }
      ],
      duration: segment.estimatedDuration,
      characters: segment.characters,
      keyPoints: segment.keyPoints
    };
  }

  getFallbackScript(contentConfig) {
    return {
      contentType: contentConfig.type,
      segments: [{
        segment: 'fallback',
        dialogue: [
          {
            speaker: 'Sarah',
            text: `Thanks for joining us for today's financial brief on ${contentConfig.topic}.`,
            timestamp: null
          }
        ],
        duration: '2:00',
        characters: ['sarah'],
        keyPoints: ['Market update', 'Key insights', 'Looking ahead']
      }],
      productionNotes: {
        contentType: contentConfig.type,
        estimatedDurationSeconds: 120,
        totalWordCount: 20,
        voiceGeneration: {
          characters: [{ id: 'sarah', name: 'Sarah', voiceStyle: 'Professional host' }]
        }
      }
    };
  }

  // Generate quick market pulse for breaking news
  async generateQuickPulse(breakingNews) {
    const context = await perplexityAPI.searchFinancialNews(breakingNews, 'breakingNews', {
      recency: 'hour',
      max_tokens: 300
    });

    return this.generateScript({
      type: 'marketPulse',
      topic: breakingNews,
      targetDuration: '90 seconds',
      complexity: 'intermediate'
    });
  }

  // Generate themed content series
  async generateContentSeries(theme, episodeCount = 5) {
    const episodes = [];

    for (let i = 0; i < episodeCount; i++) {
      const episodeTopic = `${theme} - Episode ${i + 1}`;
      const script = await this.generateScript({
        type: 'deepDive',
        topic: episodeTopic,
        targetDuration: '12-15 minutes',
        complexity: 'intermediate'
      });
      episodes.push(script);
    }

    return {
      theme,
      episodeCount,
      episodes,
      seriesMetadata: {
        totalDuration: episodes.reduce((total, ep) =>
          total + ep.productionNotes.estimatedDurationSeconds, 0),
        averageDuration: episodes.reduce((total, ep) =>
          total + ep.productionNotes.estimatedDurationSeconds, 0) / episodes.length
      }
    };
  }
}

// Create and export singleton instance
export const scriptGenerationAPI = new ScriptGenerationService();
export default scriptGenerationAPI;