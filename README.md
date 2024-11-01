# Conway's Game of Life

An interactive implementation of Conway's Game of Life using HTML5 Canvas with the following features:
- Responsive grid that adapts to window size
- Color-coded cells based on neighbor count
- Toroidal array implementation (edges wrap around)
- Page visibility optimization (pauses when tab is inactive)

## Implementation Details

The game is built using vanilla JavaScript with classes handling different aspects:
- [`GameState`](script.js): Manages the application state
- [`GridManager`](script.js): Handles grid initialization and game rules
- [`CanvasManager`](script.js): Controls canvas setup and resizing
- [`Renderer`](script.js): Responsible for drawing cells with dynamic coloring
- [`GameLoop`](script.js): Manages animation and page visibility

```mermaid
classDiagram
    class GameState {
        +canvas
        +ctx
        +width
        +height
        +grid
        +isPageVisible
        +animationFrameId
    }
    
    class CanvasManager {
        +init()
        +resize()
    }
    
    class GridManager {
        +init()
        +countNeighbors(x, y)
        +update()
    }
    
    class Renderer {
        +getColorForNeighbors(neighbors)
        +draw()
    }
    
    class GameLoop {
        +animate()
        +handleVisibilityChange()
    }
    
    GameState <.. CanvasManager : uses
    GameState <.. GridManager : uses
    GameState <.. Renderer : uses
    GameState <.. GameLoop : uses
    CanvasManager <.. GameLoop : uses
    GridManager <.. Renderer : uses
```

## Getting Started

1. Clone the repository
2. Open [index.html](index.html) in a web browser
3. Watch the Game of Life evolve!

## Contributing

Contributions are welcome! Here are some ways you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

The project uses a simple structure:
- [index.html](index.html): Main entry point
- [script.js](script.js): Game logic and classes
- [styles.css](styles.css): Basic styling
- [.github/workflows/main.yaml](.github/workflows/main.yaml): GitHub Pages deployment

## License

This project is open source and available under the MIT License.