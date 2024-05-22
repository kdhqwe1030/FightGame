//기본 canvas 설정
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.6;

// 플레이어 객체 구현
class Sprite {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset: offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack.box
    if (this.isAttacking) {
      c.fillStyle = 'green';
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height,
        this.isAttacking
      );
    }
  }
  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

//플레이어 1, 2 선언
const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

player.draw();

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0,
  },
});
enemy.draw();

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowUp: { pressed: false },
};

let lastKey;

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
decreaseTimer();
//애니메이션 구현 움직임 및 공격
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //플레이어와 적 움직이기
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  if (keys.a.pressed && lastKey === 'a') {
    player.velocity.x = -5;
  } else if (keys.d.pressed && lastKey === 'd') {
    player.velocity.x = 5;
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5;
  }

  //공격 감지
  if (
    rectangularCollision({
      rectangel1: player,
      rectangel2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  }

  if (
    rectangularCollision({
      rectangel1: enemy,
      rectangel2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector('#playerHealth').style.width = player.health + '%';
  }
  //체력을 다 잃는다면
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

//키 설정
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 'w':
      player.velocity.y = -20;
      break;
    case ' ':
      player.attack();
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      enemy.velocity.y = -20;
      break;
    case 'ArrowDown':
      enemy.isAttacking = true;
      break;
  }
});
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;

      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;

      break;
  }
});
