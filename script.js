const cells = document.querySelectorAll('.cell');
const emptyCell = document.querySelector('.empty-cell');

// Array to track the order of cells
let cellOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
shuffleArray(cellOrder);

// Assign background images to cells
cells.forEach((cell, index) => {
    cell.style.backgroundImage = `url('image_part_${cellOrder[index]}.jpg')`;
    cell.addEventListener('click', () => moveCell(index));
});

// Function to shuffle array elements
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to handle cell movement
function moveCell(index) {
    if (isAdjacent(index, cellOrder.indexOf(8))) {
        // Swap cell positions
        [cellOrder[index], cellOrder[cellOrder.indexOf(8)]] = [cellOrder[cellOrder.indexOf(8)], cellOrder[index]];
        updateCellPositions();
    }
}

// Function to check if cells are adjacent
function isAdjacent(index1, index2) {
    // Logic to check adjacency based on grid layout
}

// Function to update cell positions on the game board
function updateCellPositions() {
    cells.forEach((cell, index) => {
        cell.style.backgroundImage = `url('image_part_${cellOrder[index]}.jpg')`;
    });
}

// Initial cell positions update
updateCellPositions();
