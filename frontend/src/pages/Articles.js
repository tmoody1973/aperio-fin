import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      setCategories(categoriesData || []);

      // Build query for articles
      let query = supabase
        .from('articles')
        .select(`
          id,
          title,
          slug,
          excerpt,
          category,
          tags,
          status,
          reading_time,
          published_at,
          created_at,
          updated_at,
          author_id
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false });

      // Filter by category if selected
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      // Filter by search term if provided
      if (searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
      }

      const { data: articlesData, error } = await query.limit(50);

      if (error) throw error;
      setArticles(articlesData || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name.toLowerCase() === categoryName);
    return category?.color || '#3B82F6';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊 📈 📰</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aperio-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
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
              <div className="text-2xl mr-3">📊 📈 📰</div>
              <h1 className="text-2xl font-bold text-aperio-blue font-serif">
                Financial Articles
              </h1>
            </div>
            <Link
              to="/create-article"
              className="px-4 py-2 bg-aperio-blue text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Write Article
            </Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent"
              />
            </div>
            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name.toLowerCase()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Be the first to publish an article!'
              }
            </p>
            <Link
              to="/create-article"
              className="inline-block px-4 py-2 bg-aperio-blue text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Write First Article
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-block px-2 py-1 text-xs font-medium text-white rounded-full"
                      style={{ backgroundColor: getCategoryColor(article.category) }}
                    >
                      {article.category}
                    </span>
                    <div className="text-xs text-gray-500">
                      {article.reading_time} min read
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link
                      to={`/articles/${article.slug}`}
                      className="hover:text-aperio-blue transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{article.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-1">👤</span>
                      <span>Author</span>
                    </div>
                    <time dateTime={article.published_at}>
                      {formatDate(article.published_at)}
                    </time>
                  </div>
                </div>

                {/* Read More Footer */}
                <div className="px-6 py-3 bg-gray-50">
                  <Link
                    to={`/articles/${article.slug}`}
                    className="text-sm font-medium text-aperio-blue hover:text-blue-700 transition-colors"
                  >
                    Read Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}