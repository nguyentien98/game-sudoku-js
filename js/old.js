var Sudoku = function(cellCount = 15){
	this.cellCount = cellCount;
	this.generatePuzzle = function(){
		if (Number.isInteger(this.cellCount) && this.cellCount >= 0 && this.cellCount < 81) {
			if (cellCount === 0) {
				return this.generateEmptyPuzzle();
			} else {
				return [0,2,5,5,5];
			}
		}
	};
	this.generateEmptyPuzzle = function(isReset = true){
		var elm = isReset == true ? '' : 0;
		return new Array(9).fill(new Array(9).fill(elm));
	};

	//getValidOptions dùng để tìm những phần tử mà chưa xuất hiện trong hàng, cột và 9 ô trong ô lớn.
	this.getValidOptions = function(clone, rowIndex, columnIndex){
		let string = JSON.stringify(clone);
		let grid = JSON.parse(string);
		var row_and_column = grid[rowIndex]; //Lấy ra hàng 
		for(var i = 0; i < 9; i++){
			row_and_column.push(grid[i][columnIndex]); // Gộp hàng và cột vào 1 mảng
		}
		// Tìm vị trí bắt đầu row của box
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

		var row_column_box = row_and_column.concat(firstRow, secondRow, thirdRow); 
		// Nó sẽ gộp mảng row và column với 3 hàng vừa cắt

		var invalid = row_column_box.filter(function(value, index){
			return row_column_box.indexOf(value) == index;
			// Xóa phần tử trùng 
		});
		var zeroToNine = [1,2,3,4,5,6,7,8,9];
		let stringZeroToNine = JSON.stringify(zeroToNine);
		let range = JSON.parse(stringZeroToNine);
		var valid = [];
		for(var j = 0; j < range.length; j++){
			if (invalid.indexOf(range[j]) < 0) {
				valid.push(range[j]);
			}
		}
		return shuffle(valid);
		
	};

	this.calculateSolution = function(puzzle){
		while (true) {

			var options = null;

			for(var i = 0; i < puzzle.length; i++){

				let columnIndex = puzzle[i].indexOf(0); // Tìm cột nào có 0 trong row

				if (columnIndex == -1) {
					// Nếu không tìm thấy thì nhảy ra.
					continue;
				}
				var validOptions = this.getValidOptions(puzzle, i, columnIndex);
				if (validOptions.length == 0) {
					return false;
				}
				options = {
					valid: validOptions,
					rowIndex: i,
					columnIndex: columnIndex
				}
				break;
			}
			if (options == null) {
				return puzzle;
			}


			if (options.valid.length == 1) {
				puzzle[options.rowIndex][options.columnIndex] = options.valid[0];
				continue;
			}
			for(var i = 0; i < options.valid.length; i++){
				var temp = puzzle;
				temp[options.rowIndex][options.columnIndex] = options.valid[i];
				var rs = this.calculateSolution(temp);
				if (rs != false) {
					return rs;
				}
			}
			return false;
		}
	}
}

var game = new Sudoku();
var x = game.calculateSolution([
	[0, 0, 7, 0, 3, 0, 8, 0, 0],
	[0, 0, 0, 2, 0, 5, 0, 0, 0],
	[4, 0, 0, 9, 0, 6, 0, 0, 1],
	[0, 4, 3, 0, 0, 0, 2, 1, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 5],
	[0, 5, 8, 0, 0, 0, 6, 7, 0],
	[5, 0, 0, 1, 0, 8, 0, 0, 9],
	[0, 0, 0, 5, 0, 3, 0, 0, 0],
	[0, 0, 2, 0, 9, 0, 5, 0, 0]
	]);
console.log(x);
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
	var game = new Sudoku(cellCount);
	fillToInputs(game.generatePuzzle(), inputs);
}

function displaySolution(){
	var game = new Sudoku();
	var x = game.calculateSolution([
		[0, 0, 7, 0, 3, 0, 8, 0, 0],
		[0, 0, 0, 2, 0, 5, 0, 0, 0],
		[4, 0, 0, 9, 0, 6, 0, 0, 1],
		[0, 4, 3, 0, 0, 0, 2, 1, 0],
		[1, 0, 0, 0, 0, 0, 0, 0, 5],
		[0, 5, 8, 0, 0, 0, 6, 7, 0],
		[5, 0, 0, 1, 0, 8, 0, 0, 9],
		[0, 0, 0, 5, 0, 3, 0, 0, 0],
		[0, 0, 2, 0, 9, 0, 5, 0, 0]
		]);
}

function reset() {
	var game = new Sudoku(0);
	fillToInputs(game.generateEmptyPuzzle(), inputs);
}

function clickNewGame() {
	let level = document.getElementById('level_number').value;
	setNewGame(level);
}

function shuffle(b) {
	let stringZeroToNine = JSON.stringify(b);
	let a = JSON.parse(stringZeroToNine);
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

// Check valid number
$(document).ready(function(){
	$('table input[type="number"]').keyup(function(){
		if ($(this).val() < 0 || $(this).val() > 9) {
			$(this).val(0);
		}
	});
});