// Constants
const GAME_CONFIG = {
    CELL_SIZE: 10,
    COLORS: {
        LOW_NEIGHBORS: '#9be9a8',    // 0-2 neighbors
        MEDIUM_NEIGHBORS: '#40c463',  // 3-4 neighbors
        HIGH_NEIGHBORS: '#30a14e',    // 5-6 neighbors
        MAX_NEIGHBORS: '#216e39'      // 7-8 neighbors
    }
};

// Game state
class GameState {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.grid = null;
        this.isPageVisible = true;
        this.animationFrameId = null;
    }
}

// Initialize game state
const gameState = new GameState();

// Canvas management
class CanvasManager {
    static init() {
        if (typeof document !== 'undefined') {
            gameState.canvas = document.getElementById('game');
            gameState.ctx = gameState.canvas?.getContext('2d');
        }
    }

    static resize() {
        gameState.width = Math.floor(window.innerWidth / GAME_CONFIG.CELL_SIZE);
        gameState.height = Math.floor(window.innerHeight / GAME_CONFIG.CELL_SIZE);
        
        if (gameState.canvas) {
            gameState.canvas.width = gameState.width * GAME_CONFIG.CELL_SIZE;
            gameState.canvas.height = gameState.height * GAME_CONFIG.CELL_SIZE;
        }
        
        if (!gameState.grid) GridManager.init();
    }
}

// Grid management
class GridManager {
    static init() {
        gameState.grid = new Array(gameState.width).fill().map(() => 
            new Array(gameState.height).fill().map(() => Math.random() > 0.7)
        );
    }

    /**
     * Counts the number of live neighbors for a cell at given coordinates.
     * Uses toroidal array (wrapping around edges) for boundary calculations.
     * @param {number} x - The x-coordinate of the cell
     * @param {number} y - The y-coordinate of the cell
     * @returns {number} The count of live neighboring cells (0-8)
     */
    static countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const nx = (x + i + gameState.width) % gameState.width;
                const ny = (y + j + gameState.height) % gameState.height;
                if (gameState.grid[nx][ny]) count++;
            }
        }
        return count;
    }

    static update() {
        const next = gameState.grid.map(arr => [...arr]);
        
        for (let x = 0; x < gameState.width; x++) {
            for (let y = 0; y < gameState.height; y++) {
                const neighbors = this.countNeighbors(x, y);
                next[x][y] = gameState.grid[x][y] 
                    ? (neighbors === 2 || neighbors === 3)
                    : (neighbors === 3);
            }
        }
        
        gameState.grid = next;
    }
}

// Renderer
class Renderer {
    static getColorForNeighbors(neighbors) {
        if (neighbors <= 2) return GAME_CONFIG.COLORS.LOW_NEIGHBORS;
        if (neighbors <= 4) return GAME_CONFIG.COLORS.MEDIUM_NEIGHBORS;
        if (neighbors <= 6) return GAME_CONFIG.COLORS.HIGH_NEIGHBORS;
        return GAME_CONFIG.COLORS.MAX_NEIGHBORS;
    }

    static draw() {
        if (!gameState.ctx) return;
        
        gameState.ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
        
        for (let x = 0; x < gameState.width; x++) {
            for (let y = 0; y < gameState.height; y++) {
                if (gameState.grid[x][y]) {
                    const neighbors = GridManager.countNeighbors(x, y);
                    gameState.ctx.fillStyle = this.getColorForNeighbors(neighbors);
                    gameState.ctx.beginPath();
                    gameState.ctx.roundRect(
                        x * GAME_CONFIG.CELL_SIZE,
                        y * GAME_CONFIG.CELL_SIZE,
                        GAME_CONFIG.CELL_SIZE - 1,
                        GAME_CONFIG.CELL_SIZE - 1,
                        2
                    );
                    gameState.ctx.fill();
                }
            }
        }
    }
}

// Game loop and event handlers
class GameLoop {
    static animate() {
        if (!gameState.isPageVisible) return;
        
        GridManager.update();
        Renderer.draw();
        gameState.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    static handleVisibilityChange() {
        gameState.isPageVisible = !document.hidden;
        document.title = gameState.isPageVisible ? "Conway's Game of Life" : "NOT ACTIVE";
        
        if (gameState.isPageVisible) {
            gameState.animationFrameId = requestAnimationFrame(() => this.animate());
        } else if (gameState.animationFrameId) {
            cancelAnimationFrame(gameState.animationFrameId);
            gameState.animationFrameId = null;
        }
    }
}

// Initialize game
window.addEventListener('resize', () => CanvasManager.resize());
document.addEventListener('visibilitychange', () => GameLoop.handleVisibilityChange());
CanvasManager.init();
CanvasManager.resize();
GameLoop.animate();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameState,
        CanvasManager,
        GridManager,
        Renderer,
        GameLoop,
        gameState
    };
}
