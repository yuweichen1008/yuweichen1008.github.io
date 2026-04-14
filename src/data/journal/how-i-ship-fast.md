---
title: "How I Ship Fast: Habits from Silicon Valley"
date: "2026-04-15"
slug: "how-i-ship-fast"
categories: [Work, Learning]
mood: "Excited"
summary: "Four years in Silicon Valley rewired how I think about speed. These are the habits I kept when I left."
featured: true
---

# How I Ship Fast: Habits from Silicon Valley

The Valley has many things wrong with it. The housing crisis. The monoculture. The optimism that occasionally tips into delusion.

But it has one thing deeply right: it treats speed as a discipline, not a personality trait.

I spent four years learning that. Here's what stuck.

## 1. Write the deploy commit before you write the code

Before I start any significant feature, I write the commit message I want to end up with. "Add user auth via magic link — removes password reset flow, reduces support tickets."

This is not a planning ceremony. It takes two minutes. What it does is force you to be clear about the *outcome* before you get lost in the implementation. If you can't write a clean commit message before you start, you don't know what you're building yet.

## 2. Ship ugly, iterate fast

The first version of anything should be embarrassing. Not broken — embarrassing. If you're proud of v1, you waited too long.

The distinction matters: embarrassing means "I could do better, but this is sufficient to learn." Broken means "this doesn't work yet." The first is a feature. The second is a delay.

## 3. Cut scope, not quality

When a deadline is tight — which is always — the instinct is to do everything worse. Reduce test coverage. Skip the edge cases. Write the comment "TODO: fix this properly" and move on.

The better move: cut scope. Do three things completely instead of seven things half-heartedly. Users notice quality. They rarely notice what's missing if what's there works.

## 4. Make the feedback loop as short as possible

My laptop setup is optimized entirely around reducing the time between "I changed something" and "I see the result." Hot reload. Local databases with realistic seed data. Automated test runs on save.

Each second you spend waiting for feedback is a second where you've lost the thread. The best engineers I worked with in the Valley had feedback loops measured in milliseconds, not minutes.

## 5. Time-box everything

If a task takes more than a day, break it into tasks that each take less than a day. If you can't break it, you don't understand it well enough yet. Understanding is the prerequisite for speed.

## 6. Read the user data before writing a line

Every feature I've ever built without looking at what users actually do has been the wrong feature. Every time.

User data is uncomfortable because it shows you that your assumptions were wrong. Correct your assumptions first. Then build.

## The caveat

Speed without direction is just motion. I've seen — and been guilty of — building fast in the wrong direction. The habits above only matter if you're pointed at the right problem.

Figuring out the right problem is its own skill, and it's slower work. No shortcuts there.
