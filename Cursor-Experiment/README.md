# Phaser 3 TypeScript Game

A Phaser 3 game built with TypeScript featuring Arcade Physics, pixel-art rendering, and a complete scene system.

## Features

- **Game Resolution**: 960×540 pixels
- **Physics**: Arcade Physics with gravity (y=2000)
- **Rendering**: Pixel-art mode enabled
- **Scenes**: PreloadScene for asset loading, MainScene for gameplay
- **Controls**: Arrow keys or WASD for movement and jumping

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:9000`

## Building for Production

```bash
npm run build
```

## Project Structure

- `main.ts` - Main game configuration and entry point
- `scenes/PreloadScene.ts` - Asset loading scene
- `scenes/MainScene.ts` - Main gameplay scene
- `webpack.config.js` - Webpack configuration for bundling
- `tsconfig.json` - TypeScript configuration

## Controls

- **Arrow Keys** or **WASD**: Move and jump
- **Space**: Jump (when touching ground)

## Game Configuration

The game is configured with:
- Arcade Physics system with gravity pointing downward
- Pixel-art rendering for crisp, retro-style graphics
- Responsive scaling that fits the game to the screen
- Debug mode can be enabled in the physics configuration
