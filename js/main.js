class Game {

  constructor() {
    this.timer_id = null;
    this.score = 0;

    this.interval = 1000;
    this.level = 1;

    this.glass = new Glass();
    //this.shape = new Shape(this.glass);
  }

  tick() {
    console.log("tick");

    if (!this.shape) {
      this.shape = new Shape(this.glass);
    }
    const step = this.shape.step('down');
    if(!step) {
      this.shape = undefined
    }
    this.timer_id = setTimeout(this.tick.bind(this), this.interval);
  }

  start() {
    this.run();
    document.addEventListener('keydown', event => {
      if(!this.shape) {
        return
      }
      if(event.code === 'ArrowUp') {
        this.shape.turn()
      }
      if(event.code === 'ArrowLeft') {
        this.shape.step('left')
      }
      if(event.code === 'ArrowRight') {
        this.shape.step('right')
      }
      if(event.code === 'ArrowDown') {
        const step = this.shape.step('down')
        if(!step) {
          this.shape = undefined
        }
      }
    })
  }

  stop() {}

  run() {
    this.tick();
  }

  pause() {
    clearTimeout(this.timer_id);
  }

}

class Glass {

  constructor() {
    this.width
    this.height = 20

    this.shapeCoordinates = undefined

    this.body = document.querySelector('#glass')

    this.map = []
    console.log("ROW", row_tpl)
    for(let i = 0; i < this.height; i++) {
      const list = []
      const row = row_tpl.content.cloneNode(true)
      const cells = Array.from(row.querySelectorAll('.cell'))
      this.width = cells.length
      for(let j = 0; j < this.width; j++) {
        list.push({
          cell: cells[j],
          value: 0
        })
      }
      this.body.appendChild(row)
      this.map.push(list)
    }

  }

  down() {
    this.shapeCoordinates.forEach(coord => {
      this.map[coord.y][coord.x].value = 1
      this.map[coord.y][coord.x].cell.style.backgroundColor = 'yellowgreen'
    })
    this.shapeCoordinates = undefined
  }

  draw(shape) {
    let is_draw = true

    for (let coord of shape) {
      if(!this.map[coord.y] || !this.map[coord.y][coord.x] || this.map[coord.y][coord.x].value === 1) {
        is_draw = false
        break
      }
    }
    if(is_draw) {
      this.shapeCoordinates && this.shapeCoordinates.length && this.shapeCoordinates.forEach(coord => {
        this.map[coord.y][coord.x].cell.style.backgroundColor = 'gainsboro'
      })
      shape.forEach(coord => {
        this.map[coord.y][coord.x].cell.style.backgroundColor = 'orange'
      })
      this.shapeCoordinates = shape
    }
    //else {
    //  down && this.down(this.shapeCoordinates)
    //}
    
    return is_draw
  }

}

const shapes = [
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
    ]
  ],
  [
    (x, y) => [
      { x: x, y: y },
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 }
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
    ],
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
]

function getRandom(max) {
  return Math.floor(Math.random() * (max + 1))
}

const VERTICAL = 0, HORIZONTAL = 1

class Shape {

  constructor(glass) {
    this.x = 5
    this.y = -1
    this.position = HORIZONTAL
    this.glass = glass;
    this.getShape = shapes[getRandom(5)]
  }

  step(direction) {
    return this[direction]()
  }

  down() {
    const shape = this.getShape[this.position](this.x, this.y + 1)
    const draw = this.glass.draw(shape)
    if(draw) {
      this.y++
    }
    else {
      this.glass.down()
    }
    return draw
  }

  left() {
    const shape = this.getShape[this.position](this.x - 1, this.y)
    const draw = this.glass.draw(shape)
    if(draw) {
      this.x--
    }
  }

  right() {
    const shape = this.getShape[this.position](this.x + 1, this.y)
    const draw = this.glass.draw(shape)
    if(draw) {
      this.x++
    }
  }

  turn() {
    const position = this.position === VERTICAL ? HORIZONTAL : VERTICAL
    const shape = this.getShape[position](this.x, this.y)
    const draw = this.glass.draw(shape)
    if(draw) {
      this.position = position
    }
  }

}

const game = new Game();
game.start();