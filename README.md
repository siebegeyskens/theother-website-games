# Website Games - THE OTHER

Custom games/interactions for THE OTHER website. Live demo on [THEOTHER - Website Games](https://the-other-website-games.netlify.app/)

## Wheel Of Fortune

Displays different services based on where the wheel stops spinning.

### Usage

Adjustable default spinning options (`degreesMin`, `degreesMax`, `durationMin`, `durationMax`, `transitionTimingFunction`) at the top of `index.js` to fit your specific requirements.

## Slot Machine

- working simulation of a slot machine, with three reels rolling randomly and able to check for win lines.
- The slot machine uses symbols resembling THE OTHER's projects.
- Each second try the slot machine is set to win, allowing to show the project details.
- Each win guarantees to show a different project until all projects are shown.
- background is a canvas animation of ASCII characters in a matrix

### Usage

Loads in symbols and project information from a JSON file.

## Break The Glass

The user needs to break the emergency glass before reaching the contact details. The cursor turns into a custom image (hammer) which is animated on click, with each click the glass breaks by showing different images.
