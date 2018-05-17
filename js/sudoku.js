const N = 9;
const UNASSIGNED = "";

const inputs = document.getElementsByClassName('cell');
const alert = document.getElementById('alert');
var valid = [];
var oldgame = '';
var fillCell = [];
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

function isSafe(grid, row, col, num) {
    return !usedInRow(grid, row, num) &&
        !usedInColumn(grid, col, num) &&
        !usedInBox(grid, row - row % 3, col - col % 3, num);
}


function conrrectElementInRow(grid, row, num) {
    return grid[row].indexOf(num) != grid[row].lastIndexOf(num) ? false : true;
}

function conrrectElementInColumn(grid, col, num) {
	var column = []; //Lấy ra hàng 
	for(var i = 0; i < N; i++){
		column.push(grid[i][col]); // Gộp hàng và cột vào 1 mảng
	}
    return column.indexOf(num) != column.lastIndexOf(num) ? false : true;
}

function conrrectElementInBox(grid, rowIndex, columnIndex, num) {
    if (rowIndex % 3 == 0)
		startRow = rowIndex; // Nếu chia hết cho 3 thì chính là nó
	else
		startRow = rowIndex - rowIndex % 3; // Nếu không tìm vị trí bắt đầu

	// Tìm vị trí bắt đầu column của box. Tương tự
	if (columnIndex % 3 == 0)
		startColumn = columnIndex;
	else
		startColumn = columnIndex - columnIndex % 3;

	var firstRow = grid[startRow].slice(startColumn, startColumn + 3);
	var secondRow = grid[startRow + 1].slice(startColumn, startColumn + 3);
	var thirdRow = grid[startRow + 2].slice(startColumn, startColumn + 3);
	var boxGrid = firstRow.concat(secondRow, thirdRow);
	return boxGrid.indexOf(num) != boxGrid.lastIndexOf(num) ? false : true;
}

function correct(grid, row, col, num){
	return conrrectElementInRow(grid, row, num) && conrrectElementInColumn(grid, col, num) && conrrectElementInBox(grid, row, col, num);
}

function findUnassignedLocation(grid, row, col) {
    for (row = 0; row < N; row++)
    for (col = 0; col < N; col++)
        if (grid[row][col] == UNASSIGNED)
        return [row, col];
    return false;
}

function solveSudoku(grid, row, col) {
    row = col = 0;
    var unAssignedLocation = findUnassignedLocation(grid, row, col);
    if (!unAssignedLocation)
    	return grid; 
    row = unAssignedLocation[0];
    col = unAssignedLocation[1];
    for (var num = 1; num <= N; num++) {
	    if (isSafe(grid, row, col, num)) {
	        grid[row][col] = num; 
	        if (solveSudoku(grid, row, col))
	        return grid; 
	        grid[row][col] = UNASSIGNED;  
	    }
    }
    return false; 
}


function randomPuzzle(){
	var empty = this.generateEmptyPuzzle();
	var firstRow = shuffle([...Array(10).keys()]);
	firstRow.shift();
	empty[0] = firstRow;
	for (var x = 1; x < 9; x++) {
		var validRow = [];
		for(var i = 0; i < 9; i++){
			let ba = Math.floor(Math.random() * 8) + 0;
			if (validRow.indexOf(ba) == -1 && isSafe(empty, x, i, ba)) 
				validRow.push(ba);
			else
				validRow.push(UNASSIGNED);
			if (validRow.length >= 9) {
				break;
			}
		}
		empty[x] = validRow;
	}
	return empty;
}


function generatePuzzle(cellCount){
	if (Number.isInteger(cellCount) && cellCount >= 0 && cellCount < 81) {
		if (cellCount === 0) {
			return generateEmptyPuzzle();
		} else {
			var cells = Array.apply(null, 
							Array(cellCount)).map(function() { 
								return Math.floor(Math.random() * 79) + 0; 
						});
			var count = 0;
			for(var row = 0; row < 9; row++){
				for(var column = 0; column < 9; column++){
					var i = count++;
					if (cells.indexOf(i) == -1) {
						fillCell.push(i);
						valid[row][column] = UNASSIGNED;
					}
				}
			}
			return valid;
		}
	}
};
function generateEmptyPuzzle(isReset = true){
	var elm = isReset == true ? '' : 0;
	return new Array(9).fill(new Array(9).fill(elm));
};

function isSovled(puzzle){
	var cell = 0;
	var incorrect = [];
	for(var i = 0; i < 9; i++){
		for(var j = 0; j < 9; j++){
			var num = puzzle[i][j];
			var pos = cell++;
			if (!correct(puzzle, i, j, num) || num == UNASSIGNED) {
				incorrect.push(pos);
			}
		}
	}
	if (incorrect.length > 0) {
		return incorrect;
	}
	return true;
}

