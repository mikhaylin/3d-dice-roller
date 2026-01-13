# 3D Dice Roller

An interactive 3D dice simulator built with Three.js featuring realistic physics and smooth animations.

## Features
- **Realistic 3D dice** with all six faces correctly textured
- **Physics-based animation**: chaotic spin → gradual deceleration → smooth stop
- **Proper result detection**: shows the top face of the dice
- **Responsive design** works on all screen sizes
- **Keyboard support**: press Space or Enter to roll
- **Visual feedback**: rolling animation and instant result display

## How to Use
1. Open `index.html` in your browser
2. Click the "Roll Dice" button or press Space/Enter
3. Watch the dice roll with realistic physics
4. See the result displayed instantly

## Technologies Used
- **Three.js** for 3D rendering and physics
- **HTML5 Canvas** for dice face textures
- **CSS3** for styling and responsive layout
- **Vanilla JavaScript** for interactivity

## Project Structure
```
dice-roller/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── script.js       # 3D rendering and dice physics
└── README.md       # This documentation
```

## Accessibility Features
- **Screen reader support**: ARIA labels and live regions
- **Keyboard navigation**: Full tab navigation with focus indicators
- **Reduced motion**: Respects user's motion preferences
- **High contrast**: Clear visual feedback for all actions

## Performance Optimizations
- **GPU acceleration**: `will-change` for smooth animations
- **Efficient rendering**: Optimized Three.js render loop
- **Reduced layout thrashing**: Batched DOM updates
- **Image optimization**: Crisp rendering on all displays

## Recent Improvements
- **Performance optimization**: Added `will-change` CSS property and optimized Three.js rendering
- **Accessibility enhancements**: Full ARIA support, screen reader compatibility, keyboard navigation
- **Sound system**: Web Audio API with mute functionality and user preference persistence
- **Theme system**: Three color themes (classic, dark, neon) with localStorage persistence
- **Physics refinement**: Realistic dice roll physics with bounce effect and smooth deceleration

## Future Enhancements
- **Multiple dice**: Roll 2-5 dice simultaneously with combined results
- **Advanced statistics**: Roll history, frequency charts, and probability analysis
- **Custom dice**: Different dice types (d4, d8, d10, d20, d100)
- **3D environments**: Interactive tables and backgrounds
- **Multiplayer mode**: Online dice rolling with friends
- **Export functionality**: Save results as image or share via social media

## Accessibility
This project follows web accessibility best practices:
- **Screen reader support**: ARIA labels, live regions, and semantic HTML
- **Keyboard navigation**: Full tab navigation with visible focus indicators
- **Reduced motion**: Respects `@media (prefers-reduced-motion)` user preferences
- **Color contrast**: All themes meet WCAG AA contrast standards
- **Focus management**: Proper focus trapping during animations

## License
MIT