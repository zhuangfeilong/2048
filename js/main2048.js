/**
 * Created by liuyubobobo on 14-4-11.
 * my site: http://www.liuyubobobo.com
 */
var board = new Array();
var score = 0;
$(document).ready(function () {
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
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell = $("#grid-cell-" + i + "-" + j);
      gridCell.css('top', getPostTop(i, j));
      gridCell.css('left', getPostLeft(i, j));
    }
  }
  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0;
    }
  }

  updateBoardView();
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
        theNumberCell.css('top', getPostTop(i, j) + 50);
        theNumberCell.css('left', getPostLeft(i, j) + 50);
      }
      else {
        theNumberCell.css('width', '100px');
        theNumberCell.css('height', '100px');
        theNumberCell.css('top', getPostTop(i, j));
        theNumberCell.css('left', getPostLeft(i, j));
        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
        theNumberCell.css('color', getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
      }
    }
}
// function updateBoardView() {
//   $(".number-cell").remove();
//   for (var i = 0; i < 4; i++) {
//     for (var j = 0; j < 4; j++) {
//       $("#container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
//       //numberCellBlock += numberCellBlock;
//       //$("#container").append(numberCellBlock)
//       var theNumberCell = $('#number-cell-' + i + '-' + j);
//       if (board[i][j] == 0) {
//         theNumberCell.css('width', '0px');
//         theNumberCell.css('height', '0px');
//         theNumberCell.css('top', getPostTop(i, j) + 50);
//         theNumberCell.css('left', getPostLeft(i, j) + 50);
//       } else {
//         theNumberCell.css('width', '100px');
//         theNumberCell.css('height', '100px');
//         theNumberCell.css('top', getPostTop(i, j));
//         theNumberCell.css('left', getPostLeft(i, j));
//         theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
//         theNumberCell.css('color', getNumberColor(board[i][j]));
//         theNumberCell.text(board[i][j]);
//       }
//     }
//   }
//   // $("#container").append(numberCellBlock);
// }

function generatorNewNumber() {
  if (nospace(board)) {
    return false;
  }
  // 随机出一个数字的位置定位
  var ranX = parseInt(Math.floor(Math.random() * 4));
  var ranY = parseInt(Math.floor(Math.random() * 4));
  while (true) {
    if (board[ranX][ranY] == 0)
      break;

    ranX = parseInt(Math.floor(Math.random() * 4));
    ranY = parseInt(Math.floor(Math.random() * 4));
  }

  // 随机出一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4;

  // 随机位置显示数字
  board[ranX][ranY] == randNumber;
  showNumberWithAnimation(ranX, ranY, randNumber);

  return true;
}

$(document).keydown(function (event) {
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

// 游戏结束的函数
function isgameover() {

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
          else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {
            //move
            showMoveAnimation(i, j, i, k);
            //add
            board[i][k] += board[i][j];
            board[i][j] = 0;

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
          else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board)) {
            showMoveAnimation(i, j, i, k);
            board[i][k] *= 2;
            board[i][j] = 0;

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
          else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] *= 2;
            board[i][j] = 0;

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
          else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] *= 2;
            board[i][j] = 0;

            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}

