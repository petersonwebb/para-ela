-- Tabelas para o sistema de relacionamento
-- Execute este SQL no Supabase SQL Editor

-- Tabela para check-in de humor
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  mood TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_name, date)
);


-- Tabela para progresso da caça ao tesouro
CREATE TABLE IF NOT EXISTS treasure_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_name, date)
);

-- Tabela para quadro de arte (só um desenho por vez)
CREATE TABLE IF NOT EXISTS art_canvas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  canvas_data TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_canvas ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acesso público (para simplicidade)
CREATE POLICY "Allow all operations on mood_entries" ON mood_entries FOR ALL USING (true);
CREATE POLICY "Allow all operations on treasure_progress" ON treasure_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations on art_canvas" ON art_canvas FOR ALL USING (true);
