-- Bordemmaxing (Side Quest Gashapon) — schema.sql

DROP TABLE IF EXISTS quest_history;
DROP TABLE IF EXISTS quests;

CREATE TABLE quests (
  id             SERIAL PRIMARY KEY,
  text           TEXT NOT NULL,
  category       TEXT,                          -- e.g. 'creative', 'physical', 'social', 'weird'
  rarity         TEXT NOT NULL CHECK (
                    rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'unique')
                 ),
  is_preset      BOOLEAN NOT NULL DEFAULT FALSE,
  user_id        TEXT,                          -- NULL for presets; set for user-added quests
  is_completed   BOOLEAN NOT NULL DEFAULT FALSE,
  date_completed TIMESTAMP,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Optional: lets a quest be completed more than once with a full log,
-- instead of a single boolean on the quest itself.
CREATE TABLE quest_history (
  id           SERIAL PRIMARY KEY,
  quest_id     INTEGER NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  user_id      TEXT,
  completed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quests_rarity ON quests(rarity);
CREATE INDEX idx_quests_is_preset ON quests(is_preset);
CREATE INDEX idx_quest_history_quest_id ON quest_history(quest_id);