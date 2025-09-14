-- Day 4: Content Management System Database Schema
-- Articles table for storing financial journalism content

CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    category VARCHAR(50) DEFAULT 'general',
    tags TEXT[], -- Array of tags
    featured_image_url TEXT,
    reading_time INTEGER, -- Estimated reading time in minutes
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_prompt TEXT, -- Store the AI prompt used if applicable
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table for organizing content
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article views for analytics
CREATE TABLE IF NOT EXISTS article_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    view_date TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- User bookmarks/favorites
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
    ('Markets', 'Stock market analysis and trends', '#10B981'),
    ('Economy', 'Economic news and analysis', '#F59E0B'),
    ('Tech', 'Technology and fintech news', '#8B5CF6'),
    ('Crypto', 'Cryptocurrency and blockchain', '#F97316'),
    ('Analysis', 'In-depth financial analysis', '#3B82F6'),
    ('News', 'Breaking financial news', '#EF4444'),
    ('Education', 'Financial education and guides', '#06B6D4')
ON CONFLICT (name) DO NOTHING;

-- Row Level Security (RLS) Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Articles policies
CREATE POLICY "Articles are viewable by everyone" ON articles
    FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Users can insert their own articles" ON articles
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own articles" ON articles
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own articles" ON articles
    FOR DELETE USING (auth.uid() = author_id);

-- Categories policies (read-only for most users)
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Article views policies
CREATE POLICY "Users can view their own article views" ON article_views
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert article views" ON article_views
    FOR INSERT WITH CHECK (true);

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks" ON bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bookmarks" ON bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- Functions and Triggers
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for articles
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to calculate reading time (rough estimate: 200 words per minute)
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN GREATEST(1, (array_length(string_to_array(content_text, ' '), 1) / 200.0)::INTEGER);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate reading time
CREATE OR REPLACE FUNCTION set_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reading_time = calculate_reading_time(NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_article_reading_time BEFORE INSERT OR UPDATE ON articles
    FOR EACH ROW EXECUTE PROCEDURE set_reading_time();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(
        regexp_replace(title_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
    ));
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);