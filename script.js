const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const CELL_SIZE = 10;
let width, height;
let grid;

function resize() {
    width = Math.floor(window.innerWidth / CELL_SIZE);
    height = Math.floor(window.innerHeight / CELL_SIZE);
    canvas.width = width * CELL_SIZE;
    canvas.height = height * CELL_SIZE;
    if (!grid) initGrid();
}

function initGrid() {
    grid = new Array(width).fill().map(() => 
        new Array(height).fill().map(() => Math.random() > 0.7)
    );
}

function update() {
    const next = grid.map(arr => [...arr]);
    
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const neighbors = countNeighbors(x, y);
            if (grid[x][y]) {
                next[x][y] = neighbors === 2 || neighbors === 3;
            } else {
                next[x][y] = neighbors === 3;
            }
        }
    }
    
    grid = next;
}

function countNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const nx = (x + i + width) % width;
            const ny = (y + j + height) % height;
            if (grid[nx][ny]) count++;
        }
    }
    return count;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (grid[x][y]) {
                const neighbors = countNeighbors(x, y);
                // Map neighbor count to colors
                let color;
                if (neighbors <= 2) {
                    color = '#9be9a8'; // Lightest
                } else if (neighbors <= 4) {
                    color = '#40c463'; // Light
                } else if (neighbors <= 6) {
                    color = '#30a14e'; // Medium
                } else {
                    color = '#216e39'; // Darkest
                }
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.roundRect(
                    x * CELL_SIZE,
                    y * CELL_SIZE,
                    CELL_SIZE - 1,
                    CELL_SIZE - 1,
                    2
                );
                ctx.fill();
            }
        }
    }
}

let isPageVisible = true;
let animationFrameId = null;

function animate() {
    if (!isPageVisible) return;
    
    update();
    draw();
    animationFrameId = requestAnimationFrame(animate);
}

function handleVisibilityChange() {
    isPageVisible = document.hidden === false;
    document.title = isPageVisible ? "Conway's Game of Life" : "NOT ACTIVE";
    
    if (isPageVisible) {
        animationFrameId = requestAnimationFrame(animate);
    } else if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', handleVisibilityChange);
resize();
animate(); // Start the animation loop
