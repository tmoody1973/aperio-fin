import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';

export default function ArticleView() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug, user]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError('');

      // Load the article
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          slug,
          excerpt,
          content,
          category,
          tags,
          status,
          reading_time,
          published_at,
          created_at,
          updated_at,
          author_id
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (articleError) {
        if (articleError.code === 'PGRST116') {
          setError('Article not found');
        } else {
          setError('Error loading article');
        }
        return;
      }

      setArticle(articleData);

      // Record article view
      if (articleData) {
        recordView(articleData.id);
      }

      // Check if bookmarked (if user is logged in)
      if (user && articleData) {
        checkBookmarkStatus(articleData.id);
      }

      // Load related articles
      loadRelatedArticles(articleData.category, articleData.id);

    } catch (error) {
      console.error('Error loading article:', error);
      setError('Error loading article');
    } finally {
      setLoading(false);
    }
  };

  const recordView = async (articleId) => {
    try {
      await supabase
        .from('article_views')
        .insert([{
          article_id: articleId,
          user_id: user?.id || null,
          view_date: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const checkBookmarkStatus = async (articleId) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('article_id', articleId)
        .single();

      if (!error && data) {
        setIsBookmarked(true);
      }
    } catch (error) {
      // Not bookmarked or error - default to false
      setIsBookmarked(false);
    }
  };

  const loadRelatedArticles = async (category, excludeId) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          slug,
          excerpt,
          reading_time,
          published_at
        `)
        .eq('category', category)
        .eq('status', 'published')
        .neq('id', excludeId)
        .order('published_at', { ascending: false })
        .limit(3);

      if (!error) {
        setRelatedArticles(data || []);
      }
    } catch (error) {
      console.error('Error loading related articles:', error);
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', article.id);
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await supabase
          .from('bookmarks')
          .insert([{
            user_id: user.id,
            article_id: article.id
          }]);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content) => {
    // Simple markdown-style formatting
    return content
      .split('\n')
      .map((paragraph, index) => {
        if (paragraph.trim() === '') return null;

        // Handle headers
        if (paragraph.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>;
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>;
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{paragraph.slice(4)}</h3>;
        }

        // Handle bold text
        const boldFormatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        return (
          <p
            key={index}
            className="mb-4 text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: boldFormatted }}
          />
        );
      })
      .filter(element => element !== null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊 📈 📰</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aperio-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
          <p className="text-gray-600 mb-4">The article you're looking for could not be found.</p>
          <Link
            to="/articles"
            className="inline-block px-4 py-2 bg-aperio-blue text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/articles')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Articles
              </button>
              <div className="text-2xl mr-3">📊 📈 📰</div>
              <Link to="/" className="text-2xl font-bold text-aperio-blue font-serif">
                Aperio.fin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Article Header */}
          <div className="px-8 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-aperio-blue text-white rounded-full">
                {article.category}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{article.reading_time} min read</span>
                {user && (
                  <button
                    onClick={toggleBookmark}
                    className={`p-2 rounded-full transition-colors ${
                      isBookmarked
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {isBookmarked ? '★' : '☆'}
                  </button>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg text-gray-600 mb-6">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-1">👤</span>
                <span>Author</span>
                <span className="mx-2">•</span>
                <time dateTime={article.published_at}>
                  {formatDate(article.published_at)}
                </time>
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article Body */}
          <div className="px-8 py-8 prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed">
              {formatContent(article.content)}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((related) => (
                <div
                  key={related.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link
                        to={`/articles/${related.slug}`}
                        className="hover:text-aperio-blue transition-colors"
                      >
                        {related.title}
                      </Link>
                    </h3>
                    {related.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {related.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{related.reading_time} min read</span>
                      <time dateTime={related.published_at}>
                        {formatDate(related.published_at)}
                      </time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}