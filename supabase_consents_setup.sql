-- Table pour stocker les consentements des participants
CREATE TABLE IF NOT EXISTS consents (
  id BIGSERIAL PRIMARY KEY,
  participant_id TEXT UNIQUE NOT NULL,
  validated BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ NOT NULL,
  date TEXT NOT NULL,
  lieu TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_consents_participant_id ON consents(participant_id);
CREATE INDEX IF NOT EXISTS idx_consents_validated ON consents(validated);

-- Activer Row Level Security
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous
CREATE POLICY "Allow public read access" ON consents
  FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion à tous
CREATE POLICY "Allow public insert access" ON consents
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre la mise à jour à tous
CREATE POLICY "Allow public update access" ON consents
  FOR UPDATE
  USING (true);
