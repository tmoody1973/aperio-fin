-- Aperio.fin Database Setup
-- Run these commands in your Supabase SQL Editor

-- ============================================
-- Users table (extends auth.users)
-- ============================================
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- User Profile Info
  first_name VARCHAR(50),
  last_name VARCHAR(50),

  -- Aperio.fin Specific Fields
  subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  experience_level VARCHAR(20) DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  onboarding_completed BOOLEAN DEFAULT false,

  -- Listening Preferences
  preferred_brief_type VARCHAR(20) DEFAULT 'learn_mode' CHECK (preferred_brief_type IN ('learn_mode', 'tech_brief', 'market_pulse', 'personal')),
  listening_streak INTEGER DEFAULT 0,
  last_listened_at TIMESTAMP WITH TIME ZONE,

  -- Personalization Data
  interests TEXT[] DEFAULT '{}', -- Array of interest topics
  watchlist_symbols TEXT[] DEFAULT '{}', -- User's stock watchlist
  sectors_of_interest TEXT[] DEFAULT '{}'  -- Preferred sectors
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- Trigger for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Function to handle new user registration
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Test data (optional - remove for production)
-- ============================================
-- This will only work if you have a test user
-- Comment out these lines for now

-- INSERT INTO public.users (
--   id,
--   email,
--   first_name,
--   experience_level,
--   interests,
--   watchlist_symbols
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
--   'test@aperio.fin',
--   'Test User',
--   'beginner',
--   ARRAY['stocks', 'crypto', 'real estate'],
--   ARRAY['AAPL', 'TSLA', 'NVDA']
-- );