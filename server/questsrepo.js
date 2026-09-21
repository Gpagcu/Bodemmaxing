// server/questsRepo.js
import pool from './db/pool.js';

// Pull weights among preset rarities (must sum to something reasonable; ratios matter, not the total).
const RARITY_WEIGHTS = {
  common: 45,
  uncommon: 28,
  rare: 15,
  epic: 9,
  legendary: 3,
};

// Chance that a spin pulls from the user's own added ("unique") quests instead
// of the rarity-weighted preset pool. Only applies if the user has added any.
const UNIQUE_PULL_CHANCE = 0.15;

function pickWeightedRarity(availableRarities) {
  // availableRarities: array of { rarity, count } from a DB query
  const pool = availableRarities.filter((r) => r.count > 0);
  if (pool.length === 0) return null;

  const totalWeight = pool.reduce((sum, r) => sum + (RARITY_WEIGHTS[r.rarity] || 0), 0);
  let roll = Math.random() * totalWeight;

  for (const r of pool) {
    roll -= RARITY_WEIGHTS[r.rarity] || 0;
    if (roll <= 0) return r.rarity;
  }
  return pool[pool.length - 1].rarity; // fallback for rounding edge cases
}

export async function getAllQuests({ userId, rarity, category } = {}) {
  const conditions = [];
  const values = [];

  if (rarity) {
    values.push(rarity);
    conditions.push(`rarity = $${values.length}`);
  }
  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }
  if (userId) {
    values.push(userId);
    conditions.push(`(is_preset = TRUE OR user_id = $${values.length})`);
  } else {
    conditions.push(`is_preset = TRUE`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT * FROM quests ${where} ORDER BY created_at DESC`,
    values
  );
  return rows;
}

export async function addUserQuest({ text, category, userId }) {
  const { rows } = await pool.query(
    `INSERT INTO quests (text, category, rarity, is_preset, user_id)
     VALUES ($1, $2, 'unique', FALSE, $3)
     RETURNING *`,
    [text, category || null, userId]
  );
  return rows[0];
}

export async function spinForQuest(userId) {
  // Decide whether to pull from the user's unique pool
  if (userId) {
    const { rows: uniqueRows } = await pool.query(
      `SELECT COUNT(*)::int AS count FROM quests WHERE user_id = $1 AND rarity = 'unique'`,
      [userId]
    );
    const hasUnique = uniqueRows[0].count > 0;

    if (hasUnique && Math.random() < UNIQUE_PULL_CHANCE) {
      const { rows } = await pool.query(
        `SELECT * FROM quests WHERE user_id = $1 AND rarity = 'unique'
         ORDER BY RANDOM() LIMIT 1`,
        [userId]
      );
      return rows[0];
    }
  }

  // Otherwise pull from the rarity-weighted preset pool
  const { rows: counts } = await pool.query(
    `SELECT rarity, COUNT(*)::int AS count
     FROM quests
     WHERE is_preset = TRUE
     GROUP BY rarity`
  );

  const chosenRarity = pickWeightedRarity(counts);
  if (!chosenRarity) return null;

  const { rows } = await pool.query(
    `SELECT * FROM quests WHERE is_preset = TRUE AND rarity = $1
     ORDER BY RANDOM() LIMIT 1`,
    [chosenRarity]
  );
  return rows[0];
}

export async function completeQuest(id, userId) {
  const { rows } = await pool.query(
    `UPDATE quests SET is_completed = TRUE, date_completed = NOW()
     WHERE id = $1 RETURNING *`,
    [id]
  );

  if (rows[0]) {
    await pool.query(
      `INSERT INTO quest_history (quest_id, user_id, completed_at) VALUES ($1, $2, NOW())`,
      [id, userId || null]
    );
  }

  return rows[0];
}

export async function getHistory(userId) {
  const { rows } = await pool.query(
    `SELECT qh.id, qh.completed_at, q.text, q.rarity, q.category
     FROM quest_history qh
     JOIN quests q ON q.id = qh.quest_id
     WHERE qh.user_id = $1
     ORDER BY qh.completed_at DESC`,
    [userId]
  );
  return rows;
}

export async function deleteUserQuest(id, userId) {
  const { rowCount } = await pool.query(
    `DELETE FROM quests WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return rowCount > 0;
}