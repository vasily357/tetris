const SHAPES = [
    [
      (x, y) => [
        { x: x - 1, y: y },
        { x: x - 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x + 1, y: y + 1 }
      ],
      (x, y) => [
        { x: x, y: y },
        { x: x, y: y + 1 },
        { x: x, y: y + 2 },
        { x: x - 1, y: y + 2 }
      ],
      (x, y) => [
        { x: x, y: y },
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        { x: x + 1, y: y + 1 }
      ]
    ],
    [
      (x, y) => [
        { x: x - 1, y: y },
        { x: x, y: y },
        { x: x, y: y + 1 },
        { x: x + 1, y: y + 1 }
      ],
      (x, y) => [
        { x: x, y: y },
        { x: x, y: y + 1 },
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y + 2 }
      ]
    ],
    [
      (x, y) => [
        { x: x + 1, y: y },
        { x: x + 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x - 1, y: y + 1 }
      ],
      (x, y) => [
        { x: x - 1, y: y },
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y + 2 },
        { x: x, y: y + 2 }
      ],
      (x, y) => [
        { x: x, y: y },
        { x: x - 1, y: y },
        { x: x - 1, y: y + 1 },
        { x: x + 1, y: y }
      ]
    ],
    [
      (x, y) => [
        { x: x, y: y },
        { x: x + 1, y: y },
        { x: x, y: y + 1 },
        { x: x - 1, y: y + 1 }
      ],
      (x, y) => [
        { x: x - 1, y: y },
        { x: x - 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x, y: y + 2 }
      ]
    ],
    [
      (x, y) => [
        { x: x, y: y },
        { x: x - 1, y: y },
        { x: x - 1, y: y + 1 },
        { x: x, y: y + 1 }
      ]
    ],
    [
      (x, y) => [
        { x: x, y: y },
        { x: x, y: y + 1 },
        { x: x, y: y + 2 },
        { x: x, y: y + 3 }
      ],
      (x, y) => [
        { x: x - 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x + 1, y: y + 1 },
        { x: x + 2, y: y + 1 }
      ]
    ]
  ],
  GRAY = "gainsboro",
  ORANGE = "orange",
  GREEN = "yellowgreen",
  WHITE = "white";

class Game {
  constructor() {
    this.timer_id = null;
    this.score = 0;

    this.interval = 1000;
    this.level = 1;

    this.glass = new Glass();

    this.next = new Next();
    this.scoreLabel = document.querySelector("#score");
  }

  setScore(count) {
    this.score = this.score + count;
    this.scoreLabel.innerHTML = this.score * 100;
  }

  tick() {
    //console.log("tick");
    if (!this.shape) {
      this.shape = this.nextShape || new Shape(this.glass);
      this.nextShape = new Shape(this.glass);
      this.next.draw(this.nextShape.getShape[this.nextShape.position](1, 0));
    }
    if (!this.shape.step("down")) {
      this.shape = undefined;
    }
    this.timer_id = setTimeout(this.tick.bind(this), this.interval);
  }

  start() {
    this.run();
    document.addEventListener("keydown", event => {
      if (!this.shape) {
        return;
      }
      if (event.code === "ArrowUp") {
        this.shape.turn();
      }
      if (event.code === "ArrowLeft") {
        this.shape.step("left");
      }
      if (event.code === "ArrowRight") {
        this.shape.step("right");
      }
      if (event.code === "ArrowDown") {
        const step = this.shape.step("down");
        if (!step) {
          this.shape = undefined;
        }
      }
    });
    document.querySelector("#pause").addEventListener("click", () => {
      this.timer_id ? this.pause() : this.run();
    });
  }

  stop() {}

  run() {
    this.tick();
  }

  pause() {
    clearTimeout(this.timer_id);
    this.timer_id = null;
  }

  over() {
    this.pause();
    alert("GAME OVER!");
    this.glass.clear();
  }
}

class Next {
  constructor() {
    const cells = Array.from(document.querySelectorAll("#next .cell"));

    this.map = [
      [cells[0], cells[1], cells[2], cells[3]],
      [cells[4], cells[5], cells[6], cells[7]],
      [cells[8], cells[9], cells[10], cells[11]],
      [cells[12], cells[13], cells[14], cells[15]]
    ];
  }

  draw(shape) {
    this.map.forEach(row =>
      row.forEach(cell => (cell.style.backgroundColor = WHITE))
    );
    shape.forEach(
      coord => (this.map[coord.y][coord.x].style.backgroundColor = ORANGE)
    );
  }
}

class Glass {
  constructor() {
    this.width;
    this.height = 20;

    this.shapeCoordinates = undefined;

    const body = document.querySelector("#glass");

    this.map = [];
    for (let i = 0; i < this.height; i++) {
      const row = [];
      const node = row_tpl.content.cloneNode(true);
      const cells = Array.from(node.querySelectorAll(".cell"));
      this.width = cells.length;
      for (let j = 0; j < this.width; j++) {
        row.push({
          cell: cells[j],
          value: 0
        });
      }
      body.appendChild(node);
      this.map.push(row);
    }
  }

  checkRows() {
    const lastPositions = new Map();
    let count;

    for (let y = 0; y < this.map.length; y++) {
      let is_filled = true;
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x].value === 1 && !lastPositions.has(x)) {
          lastPositions.set(x, y);
        } else if (this.map[y][x].value === 0 && is_filled) {
          is_filled = false;
        }
      }
      if (is_filled) {
        if (!count) {
          count = 1;
        } else {
          count++;
        }
      }
    }
    count && this.dropRows(lastPositions, count);
  }

  dropRows(lastPositions, count) {
    for (let i = 0; i < count; i++) {
      lastPositions.forEach((y, x) => {
        this.map[y + i][x].value = 0;
        this.map[y + i][x].cell.style.backgroundColor = GRAY;
      });
    }
    game.setScore(count);
  }

  down() {
    this.shapeCoordinates.forEach(coord => {
      this.map[coord.y][coord.x].value = 1;
      this.map[coord.y][coord.x].cell.style.backgroundColor = GREEN;
    });
    this.shapeCoordinates = undefined;
    this.checkRows();
  }

  draw(shape) {
    let is_draw = true;

    for (let coord of shape) {
      if (
        !this.map[coord.y] ||
        !this.map[coord.y][coord.x] ||
        this.map[coord.y][coord.x].value === 1
      ) {
        is_draw = false;
        break;
      }
    }
    if (is_draw) {
      this.shapeCoordinates &&
        this.shapeCoordinates.length &&
        this.shapeCoordinates.forEach(
          coord =>
            (this.map[coord.y][coord.x].cell.style.backgroundColor = GRAY)
        );

      shape.forEach(
        coord =>
          (this.map[coord.y][coord.x].cell.style.backgroundColor = ORANGE)
      );

      this.shapeCoordinates = shape;
    }

    return is_draw;
  }

  clear() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.map[i][j].cell.style.backgroundColor = GRAY;
        this.map[i][j].value = 0;
      }
    }
  }
}

class Shape {
  constructor(glass) {
    this.x = 5;
    this.y = -1;
    this.position = 0;
    const rand = Math.floor(Math.random() * SHAPES.length);
    //const rand = 2
    this.getShape = SHAPES[rand];
    this.glass = glass;
  }

  step(direction) {
    return this[direction]();
  }

  down() {
    const shape = this.getShape[this.position](this.x, this.y + 1);
    const draw = this.glass.draw(shape);
    if (draw) {
      this.y++;
    } else {
      this.glass.down();
    }
    return draw;
  }

  left() {
    const shape = this.getShape[this.position](this.x - 1, this.y);
    if (this.glass.draw(shape)) {
      this.x--;
    }
  }

  right() {
    const shape = this.getShape[this.position](this.x + 1, this.y);
    if (this.glass.draw(shape)) {
      this.x++;
    }
  }

  turn() {
    const position = this.getShape[this.position + 1] ? this.position + 1 : 0;
    const shape = this.getShape[position](this.x, this.y);
    if (this.glass.draw(shape)) {
      this.position = position;
    }
  }
}

const game = new Game();
game.start();
