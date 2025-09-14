import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAI } from '../hooks/useAI';
import { supabase } from '../services/supabase';

export default function CreateArticle() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const { user } = useAuth();
  const { loading: aiLoading, generateArticleContent } = useAI();
  const navigate = useNavigate();

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!title.trim() || !content.trim()) {
      setMessage('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const slug = generateSlug(title);
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const articleData = {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        author_id: user.id,
        category,
        tags: tagsArray,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();

      if (error) throw error;

      setMessage(`Article ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);

      // Reset form after successful submission
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error creating article:', error);
      if (error.code === '23505') {
        setMessage('An article with this title already exists. Please choose a different title.');
      } else {
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      setMessage('Please enter a prompt for AI generation');
      return;
    }

    try {
      const aiContent = await generateArticleContent(aiPrompt, category);

      // Update form with AI-generated content
      setTitle(aiContent.title);
      setContent(aiContent.content);
      setExcerpt(aiContent.excerpt);
      setTags(aiContent.tags.join(', '));

      // Close AI assistant
      setShowAiAssistant(false);
      setAiPrompt('');

      setMessage('AI content generated successfully! You can edit it before publishing.');
    } catch (error) {
      setMessage('Failed to generate AI content. Please try again.');
    }
  };

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
              <div className="text-2xl mr-3">📊 📈 📰</div>
              <h1 className="text-2xl font-bold text-aperio-blue font-serif">
                Create Article
              </h1>
            </div>
            <button
              onClick={() => setShowAiAssistant(!showAiAssistant)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              🤖 AI Assistant
            </button>
          </div>
        </div>
      </header>

      {/* AI Assistant Modal/Panel */}
      {showAiAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🤖 AI Content Assistant</h3>
                <button
                  onClick={() => setShowAiAssistant(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Describe what you'd like to write about, and AI will generate a complete article for you.
              </p>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Write an analysis about the current tech stock market trends and their impact on the economy..."
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowAiAssistant(false)}
                  className="flex-1 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAiGenerate}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className={`flex-1 px-4 py-2 text-sm text-white rounded-md transition-colors ${
                    aiLoading || !aiPrompt.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {aiLoading ? 'Generating...' : 'Generate Article'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Article Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent"
              placeholder="Enter article title..."
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt (Optional)
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent"
              placeholder="Brief summary of the article..."
            />
          </div>

          {/* Category and Tags */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent"
                >
                  <option value="general">General</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name.toLowerCase()}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent"
                  placeholder="stocks, market, analysis"
                />
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Article Content *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent font-mono text-sm"
              placeholder="Write your article content here... (Supports Markdown)"
            />
            <p className="text-xs text-gray-500 mt-2">
              Estimated reading time: {Math.max(1, Math.floor(content.split(' ').length / 200))} minutes
            </p>
          </div>

          {/* Status and Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={status === 'draft'}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Draft</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={status === 'published'}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Publish</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-aperio-blue hover:bg-blue-700 focus:ring-2 focus:ring-aperio-blue focus:ring-offset-2'
                  }`}
                >
                  {isSubmitting
                    ? (status === 'published' ? 'Publishing...' : 'Saving...')
                    : (status === 'published' ? 'Publish Article' : 'Save Draft')
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className={`rounded-md p-4 text-sm ${
              message.includes('successfully')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}