class Game {
  constructor() {
    this.timer_id = null;
    this.score = 0;

    this.interval = 1000;
    this.level = 1;

    this.glass = new Glass();

    this.next = new Next();
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
  }

  stop() {}

  run() {
    this.tick();
  }

  pause() {
    clearTimeout(this.timer_id);
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
      row.forEach(cell => (cell.style.backgroundColor = "white"))
    );
    shape.forEach(
      coord => (this.map[coord.y][coord.x].style.backgroundColor = "orange")
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

  check() {
    const indexes = [];

    const lasts = [];
    for (let i = 0; i < this.map.length; i++) {
      /* const is_filled = !this.map[i].reduce(
        (acc, item) => acc || item.value === 0,
        false
      ); */

      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j].value === 1) {
        }
      }

      if (is_filled) {
        console.log("IS_FILLED", i);
        //this.dropRow(i)
        indexes.push(i);
      }
    }
    indexes.length && dropRow(indexes);
  }

  dropRow(indexes) {}

  down() {
    this.shapeCoordinates.forEach(coord => {
      this.map[coord.y][coord.x].value = 1;
      this.map[coord.y][coord.x].cell.style.backgroundColor = "yellowgreen";
    });
    this.shapeCoordinates = undefined;
    this.check();
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
            (this.map[coord.y][coord.x].cell.style.backgroundColor =
              "gainsboro")
        );

      shape.forEach(
        coord =>
          (this.map[coord.y][coord.x].cell.style.backgroundColor = "orange")
      );

      this.shapeCoordinates = shape;
    }

    return is_draw;
  }
}

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
];

class Shape {
  constructor(glass) {
    this.x = 5;
    this.y = -1;
    this.position = 0;
    const rand = Math.floor(Math.random() * (5 + 1));
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
