function showNumberWithAnimation(i, j, randNumber) {
  var numberCell = $('#number-cell-' + i + "-" + j);
  numberCell.css('background-color', getNumberBackgroundColor(randNumber));
  numberCell.css('color', getNumberColor(randNumber));
  numberCell.text(randNumber);
  numberCell.animate({
    width: '100px',
    height: '100px',
    top: getPostTop(i, j),
    left: getPostLeft(i, j)
  }, 50);
}

function showMoveAnimation(fromX, fromY, toX, toY) {
  var numberCell = $('#number-cell-' + fromX + "-" + fromY);
  numberCell.animate({
    top: getPostTop(toX, toY),
    left: getPostLeft(toX, toY)
  }, 200);
}