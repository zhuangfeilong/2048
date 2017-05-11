var board = new Array();
var score = 0;
var hasMerge = new Array();

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
$(document).ready(function () {
  prepareForMobile();
  newgame();
});

function newgame() {
  // 初始化游戏布局
  init();
  // 随机生成新的数字
  generatorNewNumber();
  generatorNewNumber();

}
function init() {
  // 初始化函数
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell = $('#grid-cell-' + i + "-" + j);
      gridCell.css('top', getPostTop(i, j));
      gridCell.css('left', getPostLeft(i, j));
    }
  }
  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    hasMerge[i] = new Array();
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0;
      hasMerge[i][j] = false;
    }
  }

  updateBoardView();
  score = 0;
}
// 针对移动端屏幕做像素尺寸调整以适应屏幕大小
function prepareForMobile() {
  if (documentWidth > 500) {
    containerWidth = 500;
    cellSideWidth = 100;
    cellSpace = 20;
  }
  $("#container").css('width', containerWidth - 2 * cellSpace);
  $("#container").css('height', containerWidth - 2 * cellSpace);
  $("#container").css('padding', cellSpace);
  $("#container").css('border-radius', containerWidth * 0.02);

  $(".grid-cell").css('width', cellSideWidth);
  $(".grid-cell").css('height', cellSideWidth);
  $(".grid-cell").css('border-radius', cellSideWidth * 0.02);
}
function updateBoardView() {

  $(".number-cell").remove();
  for (var i = 0; i < 4; i++)
    for (var j = 0; j < 4; j++) {
      $("#container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
      var theNumberCell = $('#number-cell-' + i + '-' + j);

      if (board[i][j] == 0) {
        theNumberCell.css('width', '0px');
        theNumberCell.css('height', '0px');
        theNumberCell.css('top', getPostTop(i, j) + cellSideWidth / 2);
        theNumberCell.css('left', getPostLeft(i, j) + cellSideWidth / 2);
      }
      else {
        theNumberCell.css('width', cellSideWidth);
        theNumberCell.css('height', cellSideWidth);
        theNumberCell.css('top', getPostTop(i, j));
        theNumberCell.css('left', getPostLeft(i, j));
        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
        theNumberCell.css('color', getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
      }
      hasMerge[i][j] = false;
    }
  $(".number-cell").css('line-height', cellSideWidth + 'px');
  $(".number-cell").css('font-size', 0.7 * cellSideWidth + 'px');
}

function generatorNewNumber() {
  if (nospace(board))
    return false;

  // 随机出一个数字的位置定位
  var randx = parseInt(Math.floor(Math.random() * 4));
  var randy = parseInt(Math.floor(Math.random() * 4));

  var times = 0;

  while (times < cellSideWidth / 2) {
    if (board[randx][randy] == 0)
      break;

    randx = parseInt(Math.floor(Math.random() * 4));
    randy = parseInt(Math.floor(Math.random() * 4));
  }
  if (times == cellSideWidth / 2) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (board[i][j] == 0) {
          randx = i;
          randy = j;
        }
      }
    }
  }

  // 随机出一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4;

  // 随机位置显示数字
  board[randx][randy] = randNumber;
  showNumberWithAnimation(randx, randy, randNumber);

  return true;
}

$(document).keydown(function (event) {
  event.preventDefault();
  switch (event.keyCode) {
    case 37: //left
      if (moveLeft()) {
        generatorNewNumber();
        isgameover();
      }
      break;
    case 38: //up
      if (moveUp()) {
        generatorNewNumber();
        isgameover();
      }
      break;
    case 39: //right
      if (moveRight()) {
        generatorNewNumber();
        isgameover();
      }
      break;
    case 40: //down
      if (moveDown()) {
        generatorNewNumber();
        isgameover();
      }
      break;
    default: //default
      break;
  }
});

// 监听移动端手势滑动的事件
document.addEventListener('touchstart', function (event) {
  startX = event.touches[0].pageX;
  startY = event.touches[0].pageY;
})
document.addEventListener('touchmove',function() {
  event.preventDefault();  
})
document.addEventListener('touchend', function (event) {
  endX = event.changedTouches[0].pageX;
  endY = event.changedTouches[0].pageY;

  var deltaX = endX - startX;
  var deltaY = endY - startY;
  if(Math.abs(deltaX) < 0.3*documentWidth && Math.abs(deltaY) < 0.3*documentWidth) {
    // 判断一次滑动的正常状态
    return;
  }

  // X轴上位移长，说明是横向滑动
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    if (deltaX > 0) {
      // 向右滑动
      if (moveRight()) {
        generatorNewNumber();
        isgameover();
      }
    } else {
      // 向左滑动
       if (moveLeft()) {
        generatorNewNumber();
        isgameover();
      }
    }
  } else {
    // Y轴上位移长，说明是竖向滑动
    if (deltaY > 0) {
      // 向下滑动
      if (moveDown()) {
        generatorNewNumber();
        isgameover();
      }
    } else {
      // 向上滑动
      if (moveUp()) {
        generatorNewNumber();
        isgameover();
      }
    }
  }
})

// 游戏结束的函数
function isgameover() {
  if (nospace(board) && nomove(board)) {
    gameover();
  }
}
// 游戏结束函数
function gameover() {
  alert("GameOver");
}
// 数字向左移动或合并时的变化
function moveLeft() {
  if (!canMoveLeft(board))
    return false;
  //moveLeft
  for (var i = 0; i < 4; i++)
    for (var j = 1; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < j; k++) {
          if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
            //move
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasMerge[i][k]) {
            //move
            showMoveAnimation(i, j, i, k);
            //add score
            board[i][k] += board[i][j];
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);

            hasMerge[i][k] = true;

            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}
// 数字向右移动或合并时的变化
function moveRight() {
  if (!canMoveRight(board))
    return false;
  //moveRight
  for (var i = 0; i < 4; i++)
    for (var j = 2; j >= 0; j--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > j; k--) {

          if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasMerge[i][k]) {
            showMoveAnimation(i, j, i, k);
            board[i][k] *= 2;
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            hasMerge[i][k] = true;
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}
// 数字向上移动或合并时的变化
function moveUp() {
  if (!canMoveUp(board))
    return false;
  //moveUp
  for (var j = 0; j < 4; j++)
    for (var i = 1; i < 4; i++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < i; k++) {

          if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasMerge[i][k]) {
            showMoveAnimation(i, j, k, j);
            board[k][j] *= 2;
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            hasMerge[i][k] = true;
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}
// 数字向下移动或合并时的变化
function moveDown() {
  if (!canMoveDown(board))
    return false;
  //moveDown
  for (var j = 0; j < 4; j++)
    for (var i = 2; i >= 0; i--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > i; k--) {

          if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasMerge[i][k]) {
            showMoveAnimation(i, j, k, j);
            board[k][j] *= 2;
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            hasMerge[i][k] = true;
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}
function updateScore(score) {
  $("#score").text(score);
}
