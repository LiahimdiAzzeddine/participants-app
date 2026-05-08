-- ============================================
-- Configuration Supabase pour Tournoi 2026
-- ============================================
-- Copiez-collez ce fichier dans le SQL Editor de Supabase
-- puis cliquez sur "Run" pour créer la table et les politiques

-- Créer la table presences
CREATE TABLE IF NOT EXISTS presences (
  id BIGSERIAL PRIMARY KEY,
  participant_id TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  time TEXT NOT NULL,
  date TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer un index sur participant_id pour des recherches rapides
CREATE INDEX IF NOT EXISTS idx_presences_participant_id ON presences(participant_id);

-- Activer Row Level Security (RLS)
ALTER TABLE presences ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Permettre lecture à tous" ON presences;
DROP POLICY IF EXISTS "Permettre insertion à tous" ON presences;
DROP POLICY IF EXISTS "Permettre mise à jour à tous" ON presences;
DROP POLICY IF EXISTS "Permettre suppression à tous" ON presences;

-- Créer une politique pour permettre la lecture à tous
CREATE POLICY "Permettre lecture à tous"
  ON presences
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Créer une politique pour permettre l'insertion à tous
CREATE POLICY "Permettre insertion à tous"
  ON presences
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Créer une politique pour permettre la mise à jour à tous
CREATE POLICY "Permettre mise à jour à tous"
  ON presences
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Créer une politique pour permettre la suppression à tous
CREATE POLICY "Permettre suppression à tous"
  ON presences
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Vérification : Afficher la structure de la table
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'presences'
ORDER BY ordinal_position;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Table presences créée avec succès !';
  RAISE NOTICE 'Vous pouvez maintenant configurer vos variables d''environnement.';
END $$;
