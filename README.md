# TarotParot

*A little birdie told me.*

TarotParot is a tarot reading app that installs to your home screen. Every shuffle is shaped by the person asking:

- their touch or mouse swirls, scrolling, and typing rhythm
- their phone's motion sensors
- the moment they ask, including the moon phase and the sun sign
- their question and, if they add it, their birthday

All of that is mixed with the device's secure random generator, and none of it leaves the device.

Readings pick up the topic and type of the question (love, work, money, yes-or-no, when, how, why). There are three spreads: Single Pull, Past · Present · Future, and Celtic Cross. All 78 cards are original watercolor-and-gold artwork drawn in SVG. Finished readings are saved to a journal on the device.

An [amaris ct](https://amarisct.github.io/Amaris/) project.

## Files

- `index.html`: the whole app, built from `src/`
- `manifest.webmanifest`, `sw.js`, `icons/`: home-screen install and offline support
- `src/`: source files (`deck.js` meanings, `question.js` question reading, `art.js` card art, `app.js` app logic, `style.css`, `index.template.html`)

To change the app, edit files in `src/`, then run `python3 build.py` to rebuild `index.html`.
