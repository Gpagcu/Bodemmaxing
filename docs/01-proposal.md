# Bordommaxing

# Overview

Bordemmaxing is a side-quest app for boredom. Instead of scrolling through a static to-do list, the user spins a gashapon-style machine and gets handed one random quest to do — anything from "drink a glass of water" to a rare "legendary" challenge — drawn from 50 built-in quests plus any the user adds themselves, weighted so rarer quests are genuinely rarer.

# Problem it solves

Boredom itself isn't the hard part to fix — deciding what to do about it is. A blank "what should I do" moment, or even a long list of options, adds friction and often ends in doing nothing (or just more scrolling). Bordemmaxing removes that decision entirely: one button, one quest, no browsing required. The rarity system also adds a small reward loop — most spins are low-effort and common, but every so often something rarer and more memorable comes up — which gives repeat use a reason to exist beyond simple utility.

# Main user flow
User opens the app and lands on the Spin screen.
They tap Spin — a random quest is drawn (rarity-weighted: mostly common, rarely legendary).
The drawn quest is shown with its rarity badge and category.
The user either does the quest and taps Mark as done (logged to history), or just spins again if it's not for them right now.
Separately, on the Add Quest screen, they can add their own custom quests, which join the pool with their own dedicated pull chance.
On the History screen, they can look back at everything they've completed and when.

# Core features
Weighted random spin — draw one quest at a time, with preset quests pulled according to rarity tier (common → legendary) and user-added quests pulled from their own separate unique pool.
Add your own quests — extend the pool beyond the 50 presets.
Mark quests complete — each completion is logged individually, so the same quest can be done more than once over time.
Completion history — a browsable log of what's been done and when.


# What the app is for, in one sentence

A side-quest app that gives a bored user a random, rarity-weighted quest to do — pulled from 50 preset quests plus any they've added themselves — by spinning a gashapon-style machine, rather than picking from a static list.

# Who is it for

Someone stuck in a boredom rut and looking for a small, low-stakes nudge to do something different — a student procrastinating between study sessions, someone scrolling their phone with nothing to do, or anyone who wants a low-effort way to break routine. In the moment they open it, they are trying to get one concrete, doable suggestion, not a long list to choose from — the random draw removes the "what do I even pick" friction of a normal to-do list.

# Sections or routes this app needs
#	Section / route	What it is for
1	Spin	The core interaction — spin a gashapon-style machine, get a random rarity-weighted quest, mark it done.
2	Add Quest	Add a custom quest to the pool; it gets its own unique rarity and its own chance to be drawn.
3	History	Browse everything the user has completed, with timestamps.

Kept to 3 screens, switched by tab state rather than a router — nothing here needs a bookmarkable URL, so a router would add a dependency for no benefit. Test: if History were removed, the user could still spin and complete quests — so it's the least core of the three, but still worth keeping since completion history is part of what makes the data model (and the app) worth having at all, rather than a stateless random-quote generator.

# State: what data does the app hold?

For the Spin screen, the most important one:

Data	Shape (rough)	Who owns it (which component)	Changes when...
quest	{ id, text, category, rarity, is_completed, ... } or null	SpinScreen	user spins (new quest drawn) or completes the current one
spinning	boolean	SpinScreen	a spin request is in flight
completing	boolean	SpinScreen	a complete request is in flight
error	Error or null	SpinScreen	a spin or complete request fails
activeTab	'spin' | 'add' | 'history'	App	user clicks a tab

Each screen (Spin, Add Quest, History) owns its own data independently — none of it needs to be shared upward into App, since no two screens read or write the same piece of state. App only owns which tab is active.

# What each screen contains

Screen: Spin

Block 1: Heading + short description ("Bored? Pull the lever and see what you get.")
Block 2: Spin button (label changes between "Spin" / "Spin again" / "Spinning...")
Block 3: Result card — rarity badge, quest text, category, and a "Mark as done" button (or a "✓ Completed" state once done)
Block 4: Inline error message with a retry button, shown only on failure

# Content you need to gather
50 preset quests, written across 5 rarity tiers — done, seeded into the database (server/db/seed.sql)
Rarity tier names and pull-weight values (common/uncommon/rare/epic/ legendary, plus unique for user-added quests) — done
Screenshots of the working UI, once styled
A short demo video for final submission — not started

# One risk
The part I was least sure how to build correctly was the weighted random spin logic — making common quests pull far more often than legendary ones, while also giving user-added quests their own separate pull chance without disrupting the preset odds. This turned out fine once the rarity weights were defined as plain numbers and the pick was done in two steps (rarity tier first, then a random quest within that tier) — but it was the one part of the whole build I'd never done before and wanted to get right rather than fudge. In hindsight, the bigger actual time-risk turned out to be environment/deployment setup (Postgres, Docker, and BIOS virtualization issues), not this logic — worth noting for future-me that "the part I'm unsure how to code" and "the part that costs the most time" aren't always the same thing.
