

var grid = [
    [0, 0, 7, 0, 3, 0, 8, 0, 0],
    [0, 0, 0, 2, 0, 5, 0, 0, 0],
    [4, 0, 0, 9, 0, 6, 0, 0, 1],
    [0, 4, 3, 0, 0, 0, 2, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 5],
    [0, 5, 8, 0, 0, 0, 6, 7, 0],
    [5, 0, 0, 1, 0, 8, 0, 0, 9],
    [0, 0, 0, 5, 0, 3, 0, 0, 0],
    [0, 0, 2, 0, 9, 0, 5, 0, 0]
];

// recursive algo
function solveSudoku(grid, row, col) {
	row = col = 0;
    var cell = findUnassignedLocation(grid, row, col);
    row = cell[0];
    col = cell[1];
    // base case: if no empty cell  
    if (row == -1) {
        return true;
    }
    for (var num = 1; num <= 9; num++) {
        if ( noConflicts(grid, row, col, num) ) {   
            grid[row][col] = num;

            if ( solveSudoku(grid, row, col) ) {                
                return grid;
            }

                    // mark cell as empty (with 0)    
            grid[row][col] = 0;
        }
    }

    // trigger back tracking
    return false;
}


function findUnassignedLocation(grid, row, col) {
    for (i = 0; row < 9 ; col = 0, row++)
        for (i = 0; col < 9 ; col++)
            if (grid[row][col] == 0)
                return [row, col];
    return [-1, -1];
}


function isSafe(grid, row, col, num) {
    return !usedInRow(grid, row, num) &&
        !usedInColumn(grid, col, num) &&
        !usedInBox(grid, row - row % 3, col - col % 3, num);
}

function usedInRow(grid, row, num) {
    return grid[row].indexOf(num) == -1 ? false : true;
}

function usedInColumn(grid, col, num) {
    var column = []; //Lấy ra hàng 
    for(var i = 0; i < N; i++){
        column.push(grid[i][col]); // Gộp hàng và cột vào 1 mảng
    }
    return column.indexOf(num) == -1 ? false : true;
}

function usedInBox(grid, boxStartRow, boxStartCol, num) {
    for (row = 0; row < 3; row++)
    for (col = 0; col < 3; col++)
        if (grid[row + boxStartRow][col + boxStartCol] == num)
        return true;
    return false;
}

function printGrid(grid) {
    var res = "";

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            res += grid[i][j];
        }
        res += "\n";
    }
    console.log(res);
}
console.log(solveSudoku(grid,0,0));
function generatePuzzle(){
	if (Number.isInteger(this.cellCount) && this.cellCount >= 0 && this.cellCount < 81) {
		if (cellCount === 0) {
			return this.generateEmptyPuzzle();
		} else {
			return [0,2,5,5,5];
		}
	}
};
function generateEmptyPuzzle(isReset = true){
	var elm = isReset == true ? '' : 0;
	return new Array(9).fill(new Array(9).fill(elm));
};


function fillToInputs(puzzle, inputs){
	var cell = 0;
	for(var i = 0; i < puzzle.length; i++){
		for(var j = 0; j < puzzle[i].length; j++){
			inputs[cell++].value = puzzle[i][j];
		}
	}
}

const inputs = document.getElementsByClassName('cell');

function setNewGame(level = 1) {
	level = parseInt(level);
	if (level == 1)
		cellCount = 25;
	else if (level == 2)
		cellCount = 20;
	else if (level == 3)
		cellCount = 15;
	else 
		return false;
	fillToInputs(generatePuzzle(), inputs);
}



function reset() {
	fillToInputs(generateEmptyPuzzle(), inputs);
}

function clickNewGame() {
	let level = document.getElementById('level_number').value;
	setNewGame(level);
}


// Check valid number
$(document).ready(function(){
	$('table input[type="number"]').keyup(function(){
		if ($(this).val() < 0 || $(this).val() > 9) {
			$(this).val(0);
		}
	});
});