-- MuseWave Database Schema
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  tokens INTEGER DEFAULT 5, -- 기본 5개 토큰 제공
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Music generations table
CREATE TABLE IF NOT EXISTS public.music_generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  prompt TEXT NOT NULL,
  generated_prompt TEXT, -- Gemini가 생성한 프롬프트
  music_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- 초 단위
  genre TEXT,
  mood TEXT,
  scene TEXT,
  use_case TEXT,
  instruments TEXT[],
  status TEXT CHECK (status IN ('generating', 'completed', 'failed')) DEFAULT 'generating',
  tokens_used INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token transactions table
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  transaction_type TEXT CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')) NOT NULL,
  amount INTEGER NOT NULL, -- 양수: 획득, 음수: 사용
  description TEXT NOT NULL,
  package_name TEXT, -- 구매한 패키지명 (purchase일 때)
  payment_method TEXT, -- 결제 수단 (purchase일 때)
  payment_amount DECIMAL(10,2), -- 실제 결제 금액 (purchase일 때)
  music_generation_id UUID REFERENCES public.music_generations(id), -- 음악 생성시 연결
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  favorite_genres TEXT[],
  favorite_moods TEXT[],
  favorite_instruments TEXT[],
  theme_preference TEXT CHECK (theme_preference IN ('light', 'dark', 'system')) DEFAULT 'system',
  language_preference TEXT DEFAULT 'ko',
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Music favorites table
CREATE TABLE IF NOT EXISTS public.music_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  music_generation_id UUID REFERENCES public.music_generations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, music_generation_id)
);

-- Music generation tasks table (for callback storage)
CREATE TABLE IF NOT EXISTS public.music_generation_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id TEXT UNIQUE NOT NULL,
  audio_url TEXT,
  title TEXT,
  duration INTEGER,
  image_url TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  raw_data JSONB
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_music_generations_user_id ON public.music_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_music_generations_status ON public.music_generations(status);
CREATE INDEX IF NOT EXISTS idx_music_generations_created_at ON public.music_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id ON public.token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_type ON public.token_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_music_favorites_user_id ON public.music_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_music_generation_tasks_task_id ON public.music_generation_tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_music_generation_tasks_status ON public.music_generation_tasks(status);
CREATE INDEX IF NOT EXISTS idx_music_generation_tasks_created_at ON public.music_generation_tasks(created_at DESC);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_generation_tasks ENABLE ROW LEVEL SECURITY;

-- Users 정책
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Music generations 정책
CREATE POLICY "Users can view own music generations" ON public.music_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own music generations" ON public.music_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own music generations" ON public.music_generations
  FOR UPDATE USING (auth.uid() = user_id);

-- Token transactions 정책
CREATE POLICY "Users can view own token transactions" ON public.token_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own token transactions" ON public.token_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User preferences 정책
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Music favorites 정책
CREATE POLICY "Users can manage own favorites" ON public.music_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Music generation tasks 정책 (공개 읽기 허용 - 콜백용)
CREATE POLICY "Public read access for music generation tasks" ON public.music_generation_tasks
  FOR SELECT USING (true);

CREATE POLICY "Public insert access for music generation tasks" ON public.music_generation_tasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access for music generation tasks" ON public.music_generation_tasks
  FOR UPDATE USING (true);

-- Functions for automatic user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- 기본 환경설정 생성
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- 회원가입 보너스 토큰 지급
  INSERT INTO public.token_transactions (user_id, transaction_type, amount, description)
  VALUES (NEW.id, 'bonus', 5, '회원가입 환영 보너스 토큰');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update user tokens
CREATE OR REPLACE FUNCTION public.update_user_tokens()
RETURNS TRIGGER AS $$
BEGIN
  -- 토큰 거래 후 사용자의 총 토큰 수 업데이트
  UPDATE public.users 
  SET tokens = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM public.token_transactions 
    WHERE user_id = NEW.user_id
  ),
  updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for token balance update
CREATE OR REPLACE TRIGGER on_token_transaction_change
  AFTER INSERT OR UPDATE OR DELETE ON public.token_transactions
  FOR EACH ROW EXECUTE PROCEDURE public.update_user_tokens();

-- Function to get user's music generation stats
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE (
  total_generations INTEGER,
  total_tokens_used INTEGER,
  total_tokens_purchased INTEGER,
  favorite_genre TEXT,
  favorite_mood TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(mg.id)::INTEGER as total_generations,
    COALESCE(SUM(mg.tokens_used), 0)::INTEGER as total_tokens_used,
    COALESCE(SUM(CASE WHEN tt.transaction_type = 'purchase' THEN tt.amount ELSE 0 END), 0)::INTEGER as total_tokens_purchased,
    MODE() WITHIN GROUP (ORDER BY mg.genre) as favorite_genre,
    MODE() WITHIN GROUP (ORDER BY mg.mood) as favorite_mood
  FROM public.music_generations mg
  LEFT JOIN public.token_transactions tt ON tt.user_id = mg.user_id
  WHERE mg.user_id = user_uuid
  GROUP BY mg.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 초기 토큰 패키지 데이터 (참고용)
COMMENT ON TABLE public.token_transactions IS 
'토큰 패키지 정보:
- 스타터 (1000원): 10 토큰
- 베이직 (3000원): 35 토큰 (16% 할인)
- 프리미엄 (5000원): 60 토큰 (20% 할인)  
- 프로 (10000원): 130 토큰 (30% 할인)
- 마스터 (20000원): 280 토큰 (40% 할인)';