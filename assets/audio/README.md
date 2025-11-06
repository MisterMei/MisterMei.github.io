# Audio Assets

## Background Music

Optional background music file for the website.

### File: `ambient.mp3`

- Calm, ambient music suitable for a running journal
- Low volume, non-intrusive
- Should loop seamlessly
- Recommended length: 2-3 minutes minimum
- User should have control to mute/unmute

## Recommendations

For calm, elegant background music:
- Nature sounds (waves, rain, forest)
- Ambient piano
- Soft acoustic guitar
- Instrumental meditation music

## Free Music Sources

- YouTube Audio Library
- Free Music Archive
- Incompetech
- Bensound

## Implementation Note

Background music is optional. If you prefer not to have auto-playing music (recommended for better UX), you can skip this entirely. Many users prefer websites without background music.

To add background music, add this to your HTML:

```html
<audio id="bgMusic" loop>
  <source src="assets/audio/ambient.mp3" type="audio/mpeg">
</audio>

<button id="musicToggle" aria-label="Toggle music">
  🔊
</button>
```

And control it with JavaScript:

```javascript
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.textContent = '🔊';
  } else {
    bgMusic.pause();
    musicToggle.textContent = '🔇';
  }
});
```

