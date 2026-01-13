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

## Recent Improvements
- Migrated from CSS animations to Three.js for realistic 3D physics
- Implemented proper dice rotation with chaotic start and smooth deceleration
- Added accurate top-face detection for correct results
- Optimized camera and lighting for better visual presentation

## Future Enhancements
- Multiple dice rolling simultaneously
- Different dice themes and colors
- Sound effects for rolling and stopping
- Roll history and statistics

## License
MIT