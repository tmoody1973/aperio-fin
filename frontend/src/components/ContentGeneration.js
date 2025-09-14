// Enhanced Content Generation Component
// Integrates all APIs to create AI-powered financial journalism content

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { scriptGenerationAPI } from '../services/scriptGenerationAPI';
import { perplexityAPI } from '../services/perplexityAPI';
import { visualContentAPI } from '../services/visualAPI';
import { financialAPI } from '../services/financialAPI';
import { useAudioPlayer, AudioTrackItem, AudioPlaylist } from './PersistentAudioPlayer';

const ContentGeneration = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { playTrack, addToPlaylist } = useAudioPlayer();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generatedTracks, setGeneratedTracks] = useState([]);
  const [contentConfig, setContentConfig] = useState({
    type: 'dailyBrief',
    topic: '',
    complexity: 'intermediate',
    includeVisuals: true,
    includeMarketData: true
  });

  const contentTypes = [
    { value: 'dailyBrief', label: 'Daily Brief (3-4 minutes)', description: 'Quick market overview with key insights' },
    { value: 'deepDive', label: 'Deep Dive (12-15 minutes)', description: 'Comprehensive analysis of specific topics' },
    { value: 'marketPulse', label: 'Market Pulse (90 seconds)', description: 'Breaking news and immediate market impact' },
    { value: 'economicLens', label: 'Economic Lens (8-10 minutes)', description: 'Educational content on economic concepts' }
  ];

  const complexityLevels = [
    { value: 'beginner', label: 'Beginner', description: 'Newcomers to finance' },
    { value: 'intermediate', label: 'Intermediate', description: 'General educated audience' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced investors' }
  ];

  const handleInputChange = (field, value) => {
    setContentConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateContent = async () => {
    if (!contentConfig.topic.trim()) {
      alert('Please enter a topic for your content');
      return;
    }

    setIsGenerating(true);

    try {
      // Step 1: Generate the multi-voice script
      console.log('Generating AI script...');
      const script = await scriptGenerationAPI.generateScript({
        type: contentConfig.type,
        topic: contentConfig.topic,
        complexity: contentConfig.complexity
      });

      let visuals = null;
      let marketData = null;

      // Step 2: Generate visuals if requested
      if (contentConfig.includeVisuals) {
        console.log('Generating story visuals...');
        const storyData = {
          title: contentConfig.topic,
          content: script.context?.enhanced?.newsContext || contentConfig.topic,
          category: 'markets'
        };

        visuals = await visualContentAPI.generateStoryImage(storyData);

        // Generate podcast cover if it's audio content
        if (['dailyBrief', 'deepDive', 'economicLens'].includes(contentConfig.type)) {
          const podcastCover = await visualContentAPI.generatePodcastCover({
            title: contentConfig.topic,
            type: contentConfig.type,
            theme: 'financial analysis'
          });
          visuals.podcastCover = podcastCover;
        }
      }

      // Step 3: Get current market data for context
      if (contentConfig.includeMarketData) {
        console.log('Fetching market context...');
        const [market, economic] = await Promise.allSettled([
          financialAPI.getMarketOverview(),
          financialAPI.getEconomicIndicators()
        ]);

        marketData = {
          market: market.status === 'fulfilled' ? market.value : null,
          economic: economic.status === 'fulfilled' ? economic.value : null
        };
      }

      // Combine all generated content
      const finalContent = {
        script,
        visuals,
        marketData,
        metadata: {
          generatedAt: new Date().toISOString(),
          config: contentConfig,
          estimatedReadTime: Math.ceil(script.productionNotes?.totalWordCount / 200) || 3
        }
      };

      setGeneratedContent(finalContent);

    } catch (error) {
      console.error('Content generation error:', error);
      alert('Error generating content. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGeneration = async (topic, type) => {
    setContentConfig(prev => ({ ...prev, topic, type }));

    // Auto-generate after setting config
    setTimeout(() => {
      if (topic && type) {
        generateContent();
      }
    }, 100);
  };

  const createAudioTrack = (content, config) => {
    // Create a mock audio URL (in production, this would be generated by ElevenLabs or similar)
    const mockAudioUrls = [
      'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
      'https://www.soundjay.com/misc/sounds/fail-buzzer-03.wav',
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
    ];

    const randomAudioUrl = mockAudioUrls[Math.floor(Math.random() * mockAudioUrls.length)];

    const characters = content.script.productionNotes?.voiceGeneration?.characters?.map(char => char.name) || ['Sarah', 'Marcus', 'Elena'];

    return {
      id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${config.topic} - ${config.type.replace(/([A-Z])/g, ' $1').trim()}`,
      description: `AI-generated financial journalism: ${config.topic}`,
      audioUrl: randomAudioUrl, // Mock audio URL
      duration: content.script.productionNotes?.targetDurationSeconds
        ? `${Math.floor(content.script.productionNotes.targetDurationSeconds / 60)}:${(content.script.productionNotes.targetDurationSeconds % 60).toString().padStart(2, '0')}`
        : '3:00',
      type: config.type,
      characters: characters,
      metadata: {
        generatedAt: content.metadata?.generatedAt || new Date().toISOString(),
        wordCount: content.script.productionNotes?.totalWordCount || 0,
        estimatedDuration: content.script.productionNotes?.estimatedDurationSeconds || 180,
        contentType: config.type,
        complexity: config.complexity,
        topic: config.topic
      }
    };
  };

  const playGeneratedContent = () => {
    if (generatedContent) {
      const audioTrack = createAudioTrack(generatedContent, contentConfig);
      setGeneratedTracks(prev => [audioTrack, ...prev]);
      playTrack(audioTrack);
    }
  };

  const exportContent = () => {
    if (!generatedContent) return;

    const exportData = {
      ...generatedContent,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aperio-content-${contentConfig.topic.replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-premium">
      {/* Premium Header */}
      <header className="premium-header">
        <div className="premium-container">
          <nav className="premium-nav">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="premium-logo">
                Aperio.fin
              </Link>
              <div className="meta-text">
                {currentDate}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="body-sans text-sm">
                Welcome, {user?.user_metadata?.first_name || user?.email?.split('@')[0]}
              </div>
              <button
                onClick={handleSignOut}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="premium-container animate-fade-in-up" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        {/* Hero Section */}
        <section className="mb-20 text-center max-w-4xl mx-auto">
          <h1 className="headline-primary mb-6 text-balance" style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '2rem' }}>
            AI Content Generation
          </h1>
          <p className="body-text text-lg max-w-3xl mx-auto text-balance" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--gray-600)' }}>
            Create NPR Marketplace-quality financial journalism with sophisticated multi-voice AI storytelling
            and real-time market intelligence integration.
          </p>
        </section>

        {/* Quick Actions Section */}
        <section className="mb-16">
          <div className="premium-card">
            <h2 className="headline-secondary mb-6">Quick Generate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleQuickGeneration('Market Close Analysis', 'dailyBrief')}
                className="premium-card p-4 text-left hover:shadow-lg transition-all duration-300"
                disabled={isGenerating}
              >
                <div className="subheading mb-2">Daily Market Close</div>
                <div className="caption">3-min market wrap-up</div>
              </button>

              <button
                onClick={() => handleQuickGeneration('Federal Reserve Policy Impact', 'deepDive')}
                className="premium-card p-4 text-left hover:shadow-lg transition-all duration-300"
                disabled={isGenerating}
              >
                <div className="subheading mb-2">Fed Policy Deep Dive</div>
                <div className="caption">15-min analysis</div>
              </button>

              <button
                onClick={() => handleQuickGeneration('Breaking: Market Volatility', 'marketPulse')}
                className="premium-card p-4 text-left hover:shadow-lg transition-all duration-300"
                disabled={isGenerating}
              >
                <div className="subheading mb-2">Market Pulse</div>
                <div className="caption">90-sec breaking news</div>
              </button>

              <button
                onClick={() => handleQuickGeneration('Understanding Inflation', 'economicLens')}
                className="premium-card p-4 text-left hover:shadow-lg transition-all duration-300"
                disabled={isGenerating}
              >
                <div className="subheading mb-2">Economic Education</div>
                <div className="caption">10-min explainer</div>
              </button>
            </div>
          </div>
        </section>

        {/* Configuration Panel */}
        <section className="mb-16">
          <div className="premium-card">
            <h2 className="headline-secondary mb-6">Custom Content Generation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Topic Input */}
              <div className="md:col-span-2">
                <label className="block subheading mb-3">
                  Topic or News Event
                </label>
                <input
                  type="text"
                  value={contentConfig.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="e.g., Tesla earnings impact on EV sector"
                  className="premium-input"
                  disabled={isGenerating}
                />
                <p className="caption mt-2">
                  Be specific for better AI-generated content
                </p>
              </div>

              {/* Content Type */}
              <div>
                <label className="block subheading mb-3">
                  Content Type
                </label>
                <select
                  value={contentConfig.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="premium-input"
                  disabled={isGenerating}
                >
                  {contentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="caption mt-2">
                  {contentTypes.find(t => t.value === contentConfig.type)?.description}
                </p>
              </div>

              {/* Complexity Level */}
              <div>
                <label className="block subheading mb-3">
                  Audience Level
                </label>
                <select
                  value={contentConfig.complexity}
                  onChange={(e) => handleInputChange('complexity', e.target.value)}
                  className="premium-input"
                  disabled={isGenerating}
                >
                  {complexityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                <p className="caption mt-2">
                  {complexityLevels.find(l => l.value === contentConfig.complexity)?.description}
                </p>
              </div>

              {/* Options */}
              <div className="md:col-span-2">
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={contentConfig.includeVisuals}
                      onChange={(e) => handleInputChange('includeVisuals', e.target.checked)}
                      className="mr-3"
                      disabled={isGenerating}
                    />
                    <span className="body-text">Generate story images & podcast covers</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={contentConfig.includeMarketData}
                      onChange={(e) => handleInputChange('includeMarketData', e.target.checked)}
                      className="mr-3"
                      disabled={isGenerating}
                    />
                    <span className="body-text">Include live market data context</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-8">
              <button
                onClick={generateContent}
                disabled={isGenerating || !contentConfig.topic.trim()}
                className={`btn-primary w-full ${
                  isGenerating || !contentConfig.topic.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Generating AI Content...
                  </div>
                ) : (
                  'Generate Multi-Voice Content'
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Generated Content Display */}
        {generatedContent && (
          <section className="mb-16">
            <div className="premium-card">
              <div className="flex justify-between items-start mb-6">
                <h2 className="headline-secondary">Generated Content</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={playGeneratedContent}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>🎙️</span>
                    <span>Play Audio</span>
                  </button>
                  <button
                    onClick={exportContent}
                    className="btn-secondary"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => setGeneratedContent(null)}
                    className="btn-secondary"
                  >
                    Clear
                  </button>
                </div>
              </div>

          {/* Script Preview */}
          <div className="space-y-6">
            {/* Metadata */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Duration</div>
                  <div className="text-gray-600">
                    {Math.floor(generatedContent.script.productionNotes?.estimatedDurationSeconds / 60)}:
                    {(generatedContent.script.productionNotes?.estimatedDurationSeconds % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Word Count</div>
                  <div className="text-gray-600">
                    {generatedContent.script.productionNotes?.totalWordCount || 0} words
                  </div>
                </div>
                <div>
                  <div className="font-medium">Characters</div>
                  <div className="text-gray-600">
                    {generatedContent.script.productionNotes?.voiceGeneration?.characters?.length || 0} voices
                  </div>
                </div>
                <div>
                  <div className="font-medium">Read Time</div>
                  <div className="text-gray-600">
                    {generatedContent.metadata.estimatedReadTime} min
                  </div>
                </div>
              </div>
            </div>

            {/* Script Segments */}
            {generatedContent.script.segments?.map((segment, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold capitalize">
                    {segment.segment.replace('_', ' ')}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {segment.duration}
                  </span>
                </div>

                <div className="space-y-2">
                  {segment.dialogue?.map((line, lineIndex) => (
                    <div key={lineIndex} className="flex">
                      <div className="font-medium text-blue-700 min-w-[100px]">
                        {line.speaker}:
                      </div>
                      <div className="text-gray-700 ml-3">
                        {line.text}
                      </div>
                    </div>
                  )) || (
                    <div className="text-gray-500 italic">
                      Dialogue content not available
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Visuals */}
            {generatedContent.visuals && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Generated Visuals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedContent.visuals.imageUrl && (
                    <div>
                      <div className="font-medium mb-2">Story Image</div>
                      <img
                        src={generatedContent.visuals.imageUrl}
                        alt={generatedContent.visuals.altText}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        {generatedContent.visuals.altText}
                      </p>
                    </div>
                  )}

                  {generatedContent.visuals.podcastCover?.imageUrl && (
                    <div>
                      <div className="font-medium mb-2">Podcast Cover</div>
                      <img
                        src={generatedContent.visuals.podcastCover.imageUrl}
                        alt={generatedContent.visuals.podcastCover.altText}
                        className="w-48 h-48 object-cover rounded-lg"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        {generatedContent.visuals.podcastCover.altText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Market Context */}
            {generatedContent.marketData && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Market Context</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {generatedContent.marketData.market && (
                    <div className="bg-gray-50 rounded p-3">
                      <div className="font-medium">Current Market</div>
                      <div className="mt-1 text-gray-600">
                        {JSON.stringify(generatedContent.marketData.market, null, 2)}
                      </div>
                    </div>
                  )}

                  {generatedContent.marketData.economic && (
                    <div className="bg-gray-50 rounded p-3">
                      <div className="font-medium">Economic Data</div>
                      <div className="mt-1 text-gray-600">
                        {JSON.stringify(generatedContent.marketData.economic, null, 2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* Generated Audio Tracks */}
        {generatedTracks.length > 0 && (
          <section className="mb-16">
            <div className="premium-card">
              <AudioPlaylist
                tracks={generatedTracks}
                title="Generated Audio Content"
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ContentGeneration;