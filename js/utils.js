// 공격이 닿았는지 안닿았는지
function rectangularCollision({ rectangel1, rectangel2 }) {
  return (
    rectangel1.attackBox.position.x + rectangel1.attackBox.width >=
      rectangel2.position.x &&
    rectangel1.attackBox.position.x <=
      rectangel2.position.x + rectangel2.width &&
    rectangel1.attackBox.position.y + rectangel1.attackBox.height >=
      rectangel2.position.y &&
    rectangel1.attackBox.position.y <= rectangel2.position.y + rectangel2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector('#displayText').style.display = 'flex';

  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
  }
}
//타이머 설정
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }
  if (timer == 0) {
    determineWinner({ player, enemy, timerId });
  }
}
