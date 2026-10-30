# TarotParrot

*A little birdie told me.*

TarotParrot is a tarot reading app that installs to your home screen. Every shuffle is shaped by the person asking: touch or mouse swirls, scrolling, typing rhythm, phone motion, the moment they ask (moon phase and sun sign), their question, and their birthday if they add it. All of that is mixed with the device's secure random generator and never leaves the device.

An [amaris ct](https://amarisct.github.io/Amaris/) project.

## Features

- **Readings that answer the question.** The app reads the topic (love, work, money, health, family, friends, home, studies, creative work, life path) and the kind of question: yes-or-no, when, how, why, how someone feels, how something will turn out, or a choice between two options. Each reading opens with a direct answer, then explains it through the cards' positions.
- **Spreads:** Single Pull, Yes or No, Past · Present · Future, Love, Career, Decision, Personal Growth, Celtic Cross, plus New Moon and Full Moon spreads that appear during those phases.
- **Clarifier cards** to add detail to one position without redrawing.
- **Card of the day** with a streak counter, plus birth and personal year cards from your birthday.
- **Learn the cards:** browse and search all 78 original watercolor-and-gold cards, upright and reversed.
- **Tap any card** to see it full-screen with its meaning.
- **Journal** on the device, with notes, "did it come true?", stats on your most-drawn cards, and backup/restore.
- **Share as image:** a story-sized picture of the reading, with the question hidden unless you choose to show it.
- **Sound and vibration** synthesized live, with one switch; a battery-saver switch for the moving background.
- **Link previews** (`og-image.jpg`) and promo loops in `promo/`.

## Files

- `index.html`: the whole app, built from `src/`
- `manifest.webmanifest`, `sw.js`, `icons/`: home-screen install and offline support
- `src/`: `deck.js` meanings, `question.js` question reading and answers, `art.js` card art, `app.js` app logic, `style.css`, `index.template.html`

To change the app, edit files in `src/`, then run `python3 build.py` to rebuild `index.html`.
