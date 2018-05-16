function getValues(){
	var cells = document.getElementsByClassName('cell');
	var collect = [];
	var current = 0;
	for(var i = 0; i < 9; i++){
		var row = [];
		for(var j = 0; j < 9; j++){
			let x = current++;
			if (cells[x].value != '' && cells[x].value != NaN) {
				row.push(parseInt(cells[x].value));
			} else {
				row.push(UNASSIGNED);
			}
		}
		collect.push(row);
	}
	return collect;
}

var sleep;

function fillToInputs(puzzle, inputs, time = 0){
	if (time == 0) {
		$('.cell').removeAttr('disabled');
		var cell = 0;
		for(var i = 0; i < puzzle.length; i++){
			for(var j = 0; j < puzzle[i].length; j++){
				inputs[cell++].value = puzzle[i][j];
			}
		}
	} else {
		$('.cell').attr('disabled', '');
		var merge = [];
		var count = 0;
		for(var i = 0; i < puzzle.length; i++){
			for(var j = 0; j < puzzle[i].length; j++){
				merge[count++] = puzzle[i][j];
			}
		}
		var cell = 0;
		sleep = setInterval(function(){
			var number = cell++;
			if (inputs[number].value == UNASSIGNED) {
				inputs[number].value = merge[number];
			}

			inputs[number].style.background = '#f60';
			if (number > 0) {
				var style = number-1;
				inputs[style].style.background = '#fff';
			}
			if (cell >= 81) {
				clearInterval(sleep);
				$('.cell').removeAttr('disabled', '');
				$('.cell').css({'background' : '#FFF'});
			}
		}, time * 1000);
	}
}
function setNewGame(level = 1) {
	level = parseInt(level);
	if (level == 1)
		cellCount = 50;
	else if (level == 2)
		cellCount = 35;
	else if (level == 3)
		cellCount = 25;
	else 
		return false;
	while (true) {
		let random  = randomPuzzle();
		if (solveSudoku(random, 0, 0)) {
			valid = random;
			break;
		}
	}
	var ge = generatePuzzle(cellCount);
	fillToInputs(ge, inputs);
}

function displaySolution(time){
	if (valid.length < 9) {
		$('.alert').each(function(){
			$(this).removeClass('alert-success');
			$(this).addClass('alert-danger');
			$(this).show();
			$(this).html('Bạn chưa tạo game mới!');
		});
		return false;
	}
	var solve = solveSudoku(valid, 0, 0);
	if (!solve) {
		$('.alert').each(function(){
			$(this).removeClass('alert-success');
			$(this).addClass('alert-danger');
			$(this).show();
			$(this).html('Game lỗi!');
		});
		return false;
	}
	fillToInputs(solve, inputs, time);
}

function reset() {
	$('.cell').removeAttr('disabled');
	clearInterval(sleep);
	$('.alert').hide();
	valid = [];
	$('.cell').css({'background': '#fff'});
	fillToInputs(generateEmptyPuzzle(), inputs);
}

function clickNewGame() {
	let level = document.getElementById('level_number').value;
	reset();
	setNewGame(level);
	window.alert('Tạo thành công!!!');
}

function check(){
	$('.cell').each(function(){
		if ($(this).val() == "" || $(this).val() == 0) {
			$('.alert').each(function(){
				$(this).removeClass('alert-success');
				$(this).addClass('alert-danger');
				$(this).show();
				$(this).html('Bạn chưa hoàn thành!');

			});
			return false;
		}
	});
	var checkSolve = isSovled(getValues());
	if (checkSolve === true) {
		$('.alert').removeClass('alert-danger');
		$('.alert').addClass('alert-success');
		$('.alert').show();
		$('.alert').html('Bạn đã giải thành công!');
	} else{
		$('.alert').removeClass('alert-success');
		$('.alert').addClass('alert-danger');
		$('.alert').show();
		$('.alert').html('Bạn giải chưa đúng!');
	}
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

$(document).ready(function(){
	$('table input[type="number"]').keyup(function(){
		if ($(this).val() < 0 || $(this).val() > 9) {
			$(this).val(0);
		}
	});
});