-- Bordemmaxing — seed.sql
-- 50 preset quests. Rarity distribution: common(18) uncommon(14) rare(10) epic(6) legendary(2)
 
INSERT INTO quests (text, category, rarity, is_preset) VALUES
-- COMMON (18) — easy, everyday
('Drink a full glass of water right now', 'physical', 'common', TRUE),
('Text a friend you haven''t talked to in a week', 'social', 'common', TRUE),
('Do 10 jumping jacks', 'physical', 'common', TRUE),
('Tidy up one corner of your room for 5 minutes', 'physical', 'common', TRUE),
('Write down 3 things you''re grateful for', 'creative', 'common', TRUE),
('Take a 5-minute walk outside', 'physical', 'common', TRUE),
('Doodle whatever comes to mind for 3 minutes', 'creative', 'common', TRUE),
('Listen to a song you haven''t heard in months', 'creative', 'common', TRUE),
('Stretch for 2 minutes', 'physical', 'common', TRUE),
('Compliment someone nearby (in person or online)', 'social', 'common', TRUE),
('Organize your desktop icons or phone home screen', 'weird', 'common', TRUE),
('Look out a window for one full minute without your phone', 'weird', 'common', TRUE),
('Name 5 things you can see, hear, and feel right now', 'weird', 'common', TRUE),
('Do 15 squats', 'physical', 'common', TRUE),
('Write a one-sentence review of the last thing you watched', 'creative', 'common', TRUE),
('Send a meme to someone who''ll appreciate it', 'social', 'common', TRUE),
('Refill your water bottle', 'physical', 'common', TRUE),
('Plan tomorrow''s outfit right now', 'weird', 'common', TRUE),
 
-- UNCOMMON (14) — a bit more effort or creativity
('Cook or prepare a snack you''ve never made before', 'creative', 'uncommon', TRUE),
('Write a short poem about your current mood', 'creative', 'uncommon', TRUE),
('Call (not text) someone just to say hi', 'social', 'uncommon', TRUE),
('Rearrange one piece of furniture in your room', 'physical', 'uncommon', TRUE),
('Learn 3 words in a language you don''t speak', 'creative', 'uncommon', TRUE),
('Do a 10-minute room declutter — bag anything you don''t need', 'physical', 'uncommon', TRUE),
('Draw your pet, or a pet you wish you had', 'creative', 'uncommon', TRUE),
('Write a letter to your future self, 1 year from now', 'creative', 'uncommon', TRUE),
('Try to solve a riddle or puzzle online for 10 minutes', 'weird', 'uncommon', TRUE),
('Take a photo of something that made you smile today', 'creative', 'uncommon', TRUE),
('Do a 15-minute workout video you''ve never tried', 'physical', 'uncommon', TRUE),
('Message an old friend a favorite memory you shared', 'social', 'uncommon', TRUE),
('Reorganize your bookmarks or downloads folder', 'weird', 'uncommon', TRUE),
('Try writing with your non-dominant hand for a minute', 'weird', 'uncommon', TRUE),
 
-- RARE (10) — more obscure / a bit of a stretch
('Learn and perform a magic trick for someone', 'creative', 'rare', TRUE),
('Write a 6-word story about your day', 'creative', 'rare', TRUE),
('Cold-message someone whose work you admire online', 'social', 'rare', TRUE),
('Recreate a scene from a movie using only household objects', 'creative', 'rare', TRUE),
('Go somewhere in your home you never sit and sit there for 5 minutes', 'weird', 'rare', TRUE),
('Teach yourself a simple card trick or knot', 'weird', 'rare', TRUE),
('Have a full conversation using only questions', 'social', 'rare', TRUE),
('Make up a short theme song for your day', 'creative', 'rare', TRUE),
('Do a plank until you physically can''t anymore', 'physical', 'rare', TRUE),
('Write a fake movie trailer script for your current mood', 'creative', 'rare', TRUE),
 
-- EPIC (6) — genuinely obscure/ambitious
('Learn to say "hello, how are you" in 5 different languages', 'creative', 'epic', TRUE),
('Host a 10-minute impromptu talk show interviewing a family member/friend', 'social', 'epic', TRUE),
('Build a blanket fort and sit in it for 10 minutes', 'weird', 'epic', TRUE),
('Write and record a 30-second jingle about your day', 'creative', 'epic', TRUE),
('Give a stranger (safely, online or IRL) a genuine compliment', 'social', 'epic', TRUE),
('Attempt a handstand against a wall', 'physical', 'epic', TRUE),

-- LEGENDARY (2) — rare, memorable, a real commitment
('Text your ex I miss you', 'creative', 'legendary', TRUE),
('Stop being so shy come on confess to your crush', 'creative', 'legendary', TRUE);