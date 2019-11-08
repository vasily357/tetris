class Game {
  constructor() {
    this.timer_id = null;
    this.score = 0;

    this.interval = 1000;

    this.field = new Field();
    this.shape = new Shape(this.field);
  }

  tick() {
    console.log("tick");

    if (!this.shape) {
      this.shape = new Shape(this.field);
    }
    this.shape.step();
    this.timer_id = setTimeout(this.tick.bind(this), this.interval);
  }

  start() {
    this.run();
  }

  stop() {}

  run() {
    this.tick();
  }

  pause() {
    clearTimeout(this.timer_id);
  }
}

class Field {
  constructor() {}
}

class Shape {
  constructor(field) {
    this.field = field;
  }

  step() {}

  left() {}

  right() {}

  turn() {}
}

const game = new Game();
game.start();
