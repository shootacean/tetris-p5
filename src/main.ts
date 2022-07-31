import p5 from 'p5';

const s = (p: p5) => {

  class Block {
    x: number;
    y: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    draw() {
      p.push();
      let s = 25;
      p.rect(s * this.x, s * this.y, s, s);
      p.pop();
    }
  }

  class Mino {
    x: number;
    y: number;
    rot: number;
    shape: number;

    constructor(x: number, y: number, rot: number, shape: number) {
      this.x = x;
      this.y = y;
      this.rot = rot;
      this.shape = shape;
    }

    calcBlocks() {
      let blocks: Block[] = [];
      switch (this.shape) {
        case 0:
          blocks = [
            new Block(-1, 0),
            new Block(0, 0),
            new Block(0, -1),
            new Block(1, 0),
          ];
          break; // T
        case 1:
          blocks = [
            new Block(-1, -1),
            new Block(0, -1),
            new Block(0, 0),
            new Block(1, 0),
          ];
          break; // Z
        case 2:
          blocks = [
            new Block(-1, 0),
            new Block(0, 0),
            new Block(0, -1),
            new Block(1, -1),
          ];
          break; // S
        case 3:
          blocks = [
            new Block(-1, -2),
            new Block(-1, -1),
            new Block(-1, 0),
            new Block(0, 0),
          ];
          break; // L
        case 4:
          blocks = [
            new Block(0, -2),
            new Block(0, -1),
            new Block(-1, 0),
            new Block(0, 0),
          ];
          break; // J
        case 5:
          blocks = [
            new Block(-1, -1),
            new Block(-1, 0),
            new Block(0, 0),
            new Block(0, -1),
          ];
          break; // O
        case 6:
          blocks = [
            new Block(-2, 0),
            new Block(-1, 0),
            new Block(0, 0),
            new Block(1, 0),
          ];
          break; // I
      }
      let rot = (40000000 + this.rot) % 4;
      for (let r = 0; r < rot; r++) {
        // rotate 90
        blocks = blocks.map((b) => new Block(-b.y, b.x));
      }
      blocks.forEach((b) => ((b.x += this.x), (b.y += this.y)));
      return blocks;
    }
    draw() {
      const blocks = this.calcBlocks();
      for (let b of blocks) {
        b.draw();
      }
    }
    copy() {
      return new Mino(this.x, this.y, this.rot, this.shape);
    }
  }
  class Field {
    tiles: Array<number[]>;
    constructor() {
      this.tiles = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ];
    }

    tileAt(x: number, y: number): number {
      return this.tiles[y][x];
    }

    putBlock(x: number, y: number) {
      return (this.tiles[y][x] = 1);
    }

    findLineFilled(): number {
      for (let y = 0; y < 20; y++) {
        let isFilled = this.tiles[y].every((t: number) => t === 1);
        if (isFilled) return y;
      }
      return -1;
    }

    cutLine(y: number) {
      this.tiles.splice(y, 1);
      this.tiles.unshift([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
    }

    draw() {
      for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 12; x++) {
          if (this.tileAt(x, y) === 0) continue;
          new Block(x, y).draw();
        }
      }
    }
  }
  
  class Game {
    mino: Mino;
    minoVx: number;
    minoVr: number;
    field: Field;
    fc: number;

    constructor() {
      this.mino = Game.makeMino();
      this.minoVx = 0;
      this.minoVr = 0;
      this.field = new Field();
      this.fc = 0;
    }

    static makeMino() {
      return new Mino(5, 10, 0, p.floor(p.random(0, 7)));
    }

    static isMinoMovable(mino: Mino, field: Field) {
      let blocks = mino.calcBlocks();
      return blocks.every((b) => field.tileAt(b.x, b.y) === 0);
    }

    proc() {
      // 落下
      if (this.fc % 20 === 19) {
        let futureMino = this.mino.copy();
        futureMino.y += 1;
        if (Game.isMinoMovable(futureMino, this.field)) {
          this.mino.y += 1;
        } else {
          // 接地
          for (let b of this.mino.calcBlocks()) {
            this.field.putBlock(b.x, b.y);
            this.mino = Game.makeMino();
          }
          // 消去
          let line;
          while ((line = this.field.findLineFilled()) !== -1) {
            this.field.cutLine(line);
          }
        }
      }
  
      // 左右移動
      if (this.minoVx !== 0) {
        let futureMino = this.mino.copy();
        futureMino.x += this.minoVx;
        if (Game.isMinoMovable(futureMino, this.field)) {
          this.mino.x += this.minoVx;
        }
        this.minoVx = 0;
      }
  
      // 回転
      if (this.minoVr !== 0) {
        let futureMino = this.mino.copy();
        futureMino.rot += this.minoVr;
        if (Game.isMinoMovable(futureMino, this.field)) {
          this.mino.rot += this.minoVr;
        }
        this.minoVr = 0;
      }
  
      p.background(64);
      this.mino.draw();
      this.field.draw();
  
      this.fc++;
    }
  }
  let game: Game;
  
  p.keyPressed = function keyPressed() {
    if (p.keyCode === 65) game.minoVx = -1;
    if (p.keyCode === 68) game.minoVx = 1;
    if (p.keyCode === 81) game.minoVr = -1;
    if (p.keyCode === 69) game.minoVr = 1;
  }
  
  p.setup = function setup() {
    p.createCanvas(400, 600);
    p.background(64);
    game = new Game();
  }
  
  p.draw = function draw() {
    game.proc();
  }
  
}
new p5(s);
