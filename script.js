var snake = [[10, 10, 8], [10, 10, 9], [10, 10, 10]];
var x = Math.floor(Math.random() * 20);
var y = Math.floor(Math.random() * 20);
var z = Math.floor(Math.random() * 20);
var d = 0;
var s = true;
var dead = false;
var score = 0;
var pause = true;
var game = false;
var AI = document.getElementById('ai').checked;
var nums = [];

document.getElementById('startbtn').onclick = () => {
  AI = document.getElementById('ai').checked;
  pause = false;

  if (dead) {
    snake = [[10, 10, 8], [10, 10, 9], [10, 10, 10]];
    dead = false;
    camera(-200, -220, -200,   // camera position (x, y, z)
      -100, -100, -100,   // camera target (look at position) (x, y, z)
      0, 1, 0);  // camera up axis: Y axis here
    a = 0;
  }
}
function getCycle() {
  var cycle = [];
  for (let i = 0; i < 8000; i++)
    cycle[i] = [0, 0, 0];
  dir = true;
  let p = 1;
  run = true;
  while (run) {
    if (dir) {
      if (cycle[p - 1][0] == 19) {
        cycle[p][0] = 19;
        cycle[p][2] = cycle[p - 1][2] + 1;
        dir = false;
      } else {
        cycle[p][0] = cycle[p - 1][0] + 1;
        cycle[p][2] = cycle[p - 1][2];
      }
    } else {
      if (cycle[p - 1][0] == 1) {
        if (cycle[p - 1][2] == 19) run = false;
        else {
          cycle[p][0] = 1;
          cycle[p][2] = cycle[p - 1][2] + 1;
          dir = true;
        }
      } else {
        cycle[p][0] = cycle[p - 1][0] - 1;
        cycle[p][2] = cycle[p - 1][2];
      }
    }
    p++;
  }
  p--;
  for (let i = 19; i > 0; i--) cycle[p++][2] = i;
  p = 0;
  for (let j = 399; j < 7900; j += 399) {
    for (let i = 1; i < 400; i++) {
      cycle[i + j][0] = cycle[i][(p & 1) == 0 ? 2 : 0];
      cycle[i + j][1] = p + 1;
      cycle[i + j][2] = cycle[i][(p & 1) == 0 ? 0 : 2];
    }
    p++;
  }
  p = 19;
  for (let i = 7981; i < 8000; i++) cycle[i][1] = p--;
  for (let i = 0; i < 20; i++) {
    nums[i] = [];
    for (let j = 0; j < 20; j++) {
      nums[i][j] = [];
      for (let k = 0; k < 20; k++) {
        nums[i][j][k] = 0;
      }
    }
  }
  for (let i = 0; i < 8000; i++) nums[cycle[i][0]][cycle[i][1]][cycle[i][2]] = i;
  return cycle;
}
var hamil = getCycle();
function forward() {
  snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1], snake[snake.length - 1][2]])
  if (s) snake[snake.length - 1][d]++;
  else snake[snake.length - 1][d]--;
  if (snake[snake.length - 1][d] === 20 || snake[snake.length - 1][d] === -1)
    dead = true;
  for (let i = 0; i < snake.length - 1; i++)
    if (snake[i][0] === snake[snake.length - 1][0]
      && snake[i][1] === snake[snake.length - 1][1]
      && snake[i][2] === snake[snake.length - 1][2])
      dead = true;
  if (snake[snake.length - 1][0] === x && snake[snake.length - 1][1] === y && snake[snake.length - 1][2] === z) {
    x = Math.floor(Math.random() * 20);
    y = Math.floor(Math.random() * 20);
    z = Math.floor(Math.random() * 20);
    score++;
  } else snake.shift();
}

function keyPressed() {
  if (key === 'p') {
    pause = !pause;
  }
  // 0 = x, 1 = y, 2 = z
  if (d === 0) {
    if (key === 'a' || keyCode === LEFT_ARROW) {
      d = 2;
      s = false;
    }
    if (key === 'd' || keyCode === RIGHT_ARROW) {
      d = 2;
      s = true;
    }
    if (keyCode === UP_ARROW) {
      d = 1;
      s = false;
    }
    if (keyCode === DOWN_ARROW) {
      d = 1;
      s = true;
    }
  }
  else if (d === 1) {
    if (key === 'a' || keyCode === LEFT_ARROW) {
      d = 2;
      s = false;
    }
    if (key === 'd' || keyCode === RIGHT_ARROW) {
      d = 2;
      s = true;
    }
    if (key === 'w') {
      d = 0;
      s = true;
    }
    if (key === 's') {
      d = 0;
      s = false;
    }
  }
  else if (d === 2) {
    if (key === 'w') {
      d = 0;
      s = true;
    }
    if (key === 's') {
      d = 0;
      s = false;
    }
    if (keyCode === UP_ARROW) {
      d = 1;
      s = false;
    }
    if (keyCode === DOWN_ARROW) {
      d = 1;
      s = true;
    }
  }
}
function inSnake(x1, y1, z1) {
  for (let i = 0; i < snake.length; i++) if (snake[i][0] === x1 && snake[i][1] === y1 && snake[i][2] === z1) return true;
  return false;
}
function works(x1, y1, z1) {
  if (x1 === 20 || x1 < 0 || y1 === 20 || y1 < 0 || z1 === 20 || z1 < 0) return false;
  for (let i = 0; i < snake.length; i++) if (x1 === snake[i][0] && y1 === snake[i][1] && z1 === snake[i][2]) return false;
  let e = nums[snake[snake.length - 1][0]][snake[snake.length - 1][1]][snake[snake.length - 1][2]]
  let s = nums[snake[0][0]][snake[0][1]][snake[0][2]];
  let n = nums[x1][y1][z1];
  let ap = nums[x][y][z];
  if (ap > e && n > e && n <= ap) return true;
  if (ap < e && n < e && n >= ap) return true;
  return false;
}
function causeDeath(x1, y1, z1) {
  if (x1 > 19 || x1 < 0 || y1 > 19 || y1 < 0 || z1 > 19 || z1 < 0) return false;
  for (let i = 0; i < snake.length; i++) if (snake[i][0] == x1 && snake[i][1] == y1 && snake[i][2] == z1) return false;
  return true;
}
function aiNext() {
  let ap = nums[x][y][z];
  let up = false;
  if (ap > nums[snake[snake.length - 1][0]][snake[snake.length - 1][1]][snake[snake.length - 1][2]]) up = true;
  var max = 0;
  var next = [];
  if (up) {
    if (works(snake[snake.length - 1][0] + 1, snake[snake.length - 1][1], snake[snake.length - 1][2]) && nums[snake[snake.length - 1][0] + 1][snake[snake.length - 1][1]][snake[snake.length - 1][2]] > max) {
      max = nums[snake[snake.length - 1][0] + 1][snake[snake.length - 1][1]][snake[snake.length - 1][2]];
      next = [snake[snake.length - 1][0] + 1, snake[snake.length - 1][1], snake[snake.length - 1][2]];
    }
    if (works(snake[snake.length - 1][0] - 1, snake[snake.length - 1][1], snake[snake.length - 1][2]) && nums[snake[snake.length - 1][0] - 1][snake[snake.length - 1][1]][snake[snake.length - 1][2]] > max) {
      max = nums[snake[snake.length - 1][0] - 1][snake[snake.length - 1][1]][snake[snake.length - 1][2]];
      next = [snake[snake.length - 1][0] - 1, snake[snake.length - 1][1], snake[snake.length - 1][2]];
    }

    if (works(snake[snake.length - 1][0], snake[snake.length - 1][1] + 1, snake[snake.length - 1][2]) && nums[snake[snake.length - 1][0]][snake[snake.length - 1][1] + 1][snake[snake.length - 1][2]] > max) {
      max = nums[snake[snake.length - 1][0]][snake[snake.length - 1][1] + 1][snake[snake.length - 1][2]];
      next = [snake[snake.length - 1][0], snake[snake.length - 1][1] + 1, snake[snake.length - 1][2]];
    }
    if (works(snake[snake.length - 1][0], snake[snake.length - 1][1] - 1, snake[snake.length - 1][2]) && nums[snake[snake.length - 1][0]][snake[snake.length - 1][1] - 1][snake[snake.length - 1][2]] > max) {
      max = nums[snake[snake.length - 1][0]][snake[snake.length - 1][1] - 1][snake[snake.length - 1][2]];
      next = [snake[snake.length - 1][0], snake[snake.length - 1][1] - 1, snake[snake.length - 1][2]];
    }

    if (works(snake[snake.length - 1][0], snake[snake.length - 1][1], snake[snake.length - 1][2] + 1) && nums[snake[snake.length - 1][0]][snake[snake.length - 1][1]][snake[snake.length - 1][2] + 1] > max) {
      max = nums[snake[snake.length - 1][0]][snake[snake.length - 1][1]][snake[snake.length - 1][2] + 1];
      next = [snake[snake.length - 1][0], snake[snake.length - 1][1], snake[snake.length - 1][2] + 1];
    }
    if (works(snake[snake.length - 1][0], snake[snake.length - 1][1], snake[snake.length - 1][2] - 1) && nums[snake[snake.length - 1][0]][snake[snake.length - 1][1]][snake[snake.length - 1][2] - 1] > max) {
      max = nums[snake[snake.length - 1][0]][snake[snake.length - 1][1]][snake[snake.length - 1][2] - 1];
      next = [snake[snake.length - 1][0], snake[snake.length - 1][1], snake[snake.length - 1][2] - 1];
    }
  } else {
    max = 1000000;
    if (works(snake[snake.length - 1][0] + 1, snake[snake.length - 1][1], snake[snake.length - 1][2]) && nums[snake[snake.length - 1][0] + 1][snake[snake.length - 1][1]][snake[snake.length - 1][2]] < max) {
      max = nums[snake[snake.length - 1][0] + 1][snake[snake.length - 1][1]][snake[snake.length - 1][2]];
      next = [snake[snake.length - 1][0] + 1, snake[snake.length - 1][1], snake[snake.length - 1][2]];
    }
    if (works(snake[snake.length - 1][0] - 1, snake[snake.length - 1][1], snake[snake.length - 1][2]) && nums[snake[snake.length - 1][0] - 1][snake[snake.length - 1][1]][snake[snake.length - 1][2]] < max) {
      max = nums[snake[snake.length - 1][0] - 1][snake[snake.length - 1][1]][snake[snake.length - 1][2]];
      next = [snake[snake.length - 1][0] - 1, snake[snake.length - 1][1], snake[snake.length - 1][2]];
    }

    if (works(snake[snake.length - 1][0], snake[snake.length - 1][1] + 1, snake[snake.length - 1][2]) && nums[snake[snake.length - 1][0]][snake[snake.length - 1][1] + 1][snake[snake.length - 1][2]] < max) {
      max = nums[snake[snake.length - 1][0]][snake[snake.length - 1][1] + 1][snake[snake.length - 1][2]];
      next = [snake[snake.length - 1][0], snake[snake.length - 1][1] + 1, snake[snake.length - 1][2]];
    }
    if (works(snake[snake.length - 1][0], snake[snake.length - 1][1] - 1, snake[snake.length - 1][2]) && nums[snake[snake.length - 1][0]][snake[snake.length - 1][1] - 1][snake[snake.length - 1][2]] < max) {
      max = nums[snake[snake.length - 1][0]][snake[snake.length - 1][1] - 1][snake[snake.length - 1][2]];
      next = [snake[snake.length - 1][0], snake[snake.length - 1][1] - 1, snake[snake.length - 1][2]];
    }

    if (works(snake[snake.length - 1][0], snake[snake.length - 1][1], snake[snake.length - 1][2] + 1) && nums[snake[snake.length - 1][0]][snake[snake.length - 1][1]][snake[snake.length - 1][2] + 1] < max) {
      max = nums[snake[snake.length - 1][0]][snake[snake.length - 1][1]][snake[snake.length - 1][2] + 1];
      next = [snake[snake.length - 1][0], snake[snake.length - 1][1], snake[snake.length - 1][2] + 1];
    }
    if (works(snake[snake.length - 1][0], snake[snake.length - 1][1], snake[snake.length - 1][2] - 1) && nums[snake[snake.length - 1][0]][snake[snake.length - 1][1]][snake[snake.length - 1][2] - 1] < max) {
      max = nums[snake[snake.length - 1][0]][snake[snake.length - 1][1]][snake[snake.length - 1][2] - 1];
      next = [snake[snake.length - 1][0], snake[snake.length - 1][1], snake[snake.length - 1][2] - 1];
    }
  }
  if (next.length == 0 || next[0] === 20 || next[0] === -1 || next[1] === 20 || next[1] === -1 || next[2] === 20 || next[2] === -1) {
    var pos = 0;
    for (let i = 0; i < 8000; i++) {
      if (hamil[i][0] == snake[snake.length - 1][0] && hamil[i][1] == snake[snake.length - 1][1] && hamil[i][2] == snake[snake.length - 1][2]) {
        pos = i;
        break;
      }
    }
    pos = (pos + 1) % 8000;
    next[0] = hamil[pos][0];
    next[1] = hamil[pos][1];
    next[2] = hamil[pos][2];
    for (let i = 0; i < snake.length; i++) if (snake[i][0] == next[0] && snake[i][1] == next[1] && snake[i][2] == next[2]) {
      pos = (pos + 7998) % 8000;
      break;
    }
    next[0] = hamil[pos][0];
    next[1] = hamil[pos][1];
    next[2] = hamil[pos][2];
  }
  for (let i = 0; i < snake.length; i++)
    if (snake[i][0] === next[0]
      && snake[i][1] === next[1]
      && snake[i][2] === next[2]) {
      var pos = 0;
      for (let i = 0; i < 8000; i++) {
        if (hamil[i][0] == snake[snake.length - 1][0] && hamil[i][1] == snake[snake.length - 1][1] && hamil[i][2] == snake[snake.length - 1][2]) {
          pos = i;
          break;
        }
      }
      pos = (pos + 1) % 8000;
      next[0] = hamil[pos][0];
      next[1] = hamil[pos][1];
      next[2] = hamil[pos][2];
      for (let i = 0; i < snake.length; i++) if (snake[i][0] == next[0] && snake[i][1] == next[1] && snake[i][2] == next[2]) {
        pos = (pos + 7998) % 8000;
        break;
      }
      next[0] = hamil[pos][0];
      next[1] = hamil[pos][1];
      next[2] = hamil[pos][2];
    }
  if (!causeDeath(next[0], next[1], next[2])) {
    next[0] = snake[snake.length - 1][0];
    next[1] = snake[snake.length - 1][1];
    next[2] = snake[snake.length - 1][2];
    if (causeDeath(next[0] + 1, next[1], next[2])) {
      next[0]++;
    } else if (causeDeath(next[0] - 1, next[1], next[2])) {
      next[0]--;
    } else if (causeDeath(next[0], next[1] + 1, next[2])) {
      next[1]++;
    } else if (causeDeath(next[0], next[1] - 1, next[2])) {
      next[1]--;
    } else if (causeDeath(next[0], next[1], next[2] + 1)) {
      next[2]++;
    } else if (causeDeath(next[0], next[1], next[2] - 1)) {
      next[2]--;
    }
  }
  if (!causeDeath(next[0], next[1], next[2])) dead = true;
  snake.push(next);
  if (snake[snake.length - 1][0] === x && snake[snake.length - 1][1] === y && snake[snake.length - 1][2] === z) {
    while (inSnake(x, y, z)) {
      x = Math.floor(Math.random() * 20);
      y = Math.floor(Math.random() * 20);
      z = Math.floor(Math.random() * 20);
    }
    score++;
  } else snake.shift();
}
function setup() {
  createCanvas(Math.min(screen.width, screen.height) - 165, Math.min(screen.width, screen.height) - 165, WEBGL);
  perspective(PI / 3);
  camera(-200, -220, -200,   // camera position (x, y, z)
    0, 0, 0,   // camera target (look at position) (x, y, z)
    0, 1, 0);  // camera up axis: Y axis here
  if (AI) frameRate(2000);
  else frameRate(8);
}

var radius = Math.sqrt(2) * 200;
// const interval = setInterval(forward, 200);
function draw() {
  if (!pause) {
    camera(-200, -200, -200, 100, 100, 100, 0, 1, 0);
    if (!dead) {
      if (frameCount % 2 === 0) {
        if (AI) aiNext();
        else forward();
      }
    }
    background(220);
    for (let a = 0; a < 20; a++) {
      for (let b = 0; b < 20; b++) {
        fill(color(149, 165, 166));
        push();
        // ground plane is XZ, not XY (front plane)   (bottom)
        // fill(color(0, 255, 0));
        if (a == snake[snake.length - 1][0]
          && b == snake[snake.length - 1][2])
          fill(color(0, 255, 0));
        else if (a == x && b == z) {
          // translate(a * 20, 400, b * 20);
          fill(color(255, 0, 0));
          // line(a * 20, 400 - (y * 20), b * 20, a * 20, 400, b * 20);
        }
        translate(a * 20, 400, b * 20);
        box(20, 20, 20);
        pop();
        fill(color(149, 165, 166));
        push();
        // ground plane is XZ, not XY (front plane) (right)
        if (a == snake[snake.length - 1][0]
          && b == snake[snake.length - 1][1])
          fill(color(0, 255, 0));
        else if (a == x && b == y)
          fill(color(255, 0, 0));
        translate(a * 20, b * 20, 400);
        box(20, 20, 20);
        pop();
        fill(color(149, 165, 166));
        push();
        // ground plane is XZ, not XY (front plane) (left)
        if (a == snake[snake.length - 1][1]
          && b == snake[snake.length - 1][2])
          fill(color(0, 255, 0));
        else if (a == y && b == z)
          fill(color(255, 0, 0));
        translate(400, a * 20, b * 20);
        box(20, 20, 20);
        pop();
        fill(color(149, 165, 166));
        push();
        if (a == snake[snake.length - 1][0]
          && b == snake[snake.length - 1][2])
          fill(color(0, 255, 0));
        else if (a == x && b == z)
          fill(color(255, 0, 0));
        translate(a * 20, 400, b * 20);
        box(20, 20, 20);
        pop();
      }
    }
    push();
    fill(color(255, 0, 0));
    translate(x * 20, y * 20, z * 20);
    box(12, 12, 12);
    pop();
    snake.forEach(point => {
      push();
      fill(color(0, 255, 0));
      translate(point[0] * 20 + 3, point[1] * 20 + 3, point[2] * 20 + 3);
      box(14, 14, 14);
      pop();
    });
  }

  if (AI) frameRate(1000);
  else frameRate(4);

  if (dead) document.getElementById("startbtn").innerHTML = "Restart";
  else document.getElementById("startbtn").innerHTML = "Start";

  document.getElementById("score").innerHTML = `Score: ${snake.length - 3}`;
}