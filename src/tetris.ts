import p5 from "p5";

/**
 * テトラミノを構成するブロック要素
 */
class Block {
  /**
   * ブロックのX座標
   */
  x: number;
  /**
   * ブロックのY座標
   */
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * ブロックを描画する
   * @param p 
   */
  draw(p: p5): void {
    p.push();
    let s = 25;
    p.rect(s * this.x, s * this.y, s, s);
    p.pop();
  }
}

/**
 * テトラミノ
 */
class Mino {
  /**
   * ミノのX座標
   */
  x: number;
  /**
   * ミノのY座標
   */
  y: number;
  /**
   * ミノの回転数(90度単位)
   */
  rot: number;
  /**
   * ミノの形
   */
  shape: number;

  constructor(x: number, y: number, rot: number, shape: number) {
    this.x = x;
    this.y = y;
    this.rot = rot;
    this.shape = shape;
  }

  /**
   * ミノを構成しているブロックを演算する
   * @returns 
   */
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

  /**
   * ミノをコピーする
   * @returns 
   */
  copy(): Mino {
    return new Mino(this.x, this.y, this.rot, this.shape);
  }

  /**
   * ミノを描画する
   * @param p 
   */
  draw(p: p5): void {
    const blocks = this.calcBlocks();
    for (let b of blocks) {
      b.draw(p);
    }
  }
}

/**
 * テトリスの盤面
 */
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

  /**
   * フィールド内の１タイルを取得する
   * @param x 
   * @param y 
   * @returns 
   */
  tileAt(x: number, y: number): number {
    return this.tiles[y][x];
  }

  /**
   * フィールドにブロックを置く
   * @param x 
   * @param y 
   * @returns 
   */
  putBlock(x: number, y: number): number {
    return (this.tiles[y][x] = 1);
  }

  /**
   * 消去できる行インデックスを取得する
   * @returns 
   */
  findLineFilled(): number {
    for (let y = 0; y < 20; y++) {
      let isFilled = this.tiles[y].every((t: number) => t === 1);
      if (isFilled) return y;
    }
    return -1;
  }

  /**
   * 行を削除して1行詰める
   * @param y 
   */
  cutLine(y: number) {
    this.tiles.splice(y, 1);
    this.tiles.unshift([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
  }

  /**
   * フィールドを描画する
   * @param p 
   */
  draw(p: p5): void {
    for (let y = 0; y < 21; y++) {
      for (let x = 0; x < 12; x++) {
        if (this.tileAt(x, y) === 0) continue;
        new Block(x, y).draw(p);
      }
    }
  }
}

/**
 * テトリスのゲームロジック本体
 */
export class Game {
  /**
   * 操作中ミノ
   */
  mino: Mino;
  /**
   * 操作中ミノのx座標
   */
  minoVx: number;
  /**
   * 操作中ミノの回転角度
   */
  minoVr: number;
  /**
   * テトリス盤面
   */
  field: Field;
  /**
   * フレームカウント
   */
  fc: number;

  constructor(p: p5) {
    this.mino = Game.makeMino(p);
    this.minoVx = 0;
    this.minoVr = 0;
    this.field = new Field();
    this.fc = 0;
  }

  /**
   * 新しいミノを生成する
   * @param p 
   * @returns 
   */
  static makeMino(p: p5): Mino {
    return new Mino(5, 2, 0, p.floor(p.random(0, 7)));
  }

  /**
   * ミノが移動可能かを判定する
   * @param mino 
   * @param field 
   * @returns 
   */
  static isMinoMovable(mino: Mino, field: Field): boolean {
    let blocks = mino.calcBlocks();
    return blocks.every((b) => field.tileAt(b.x, b.y) === 0);
  }

  /**
   * メインループ
   * @param p 
   */
  proc(p: p5) {
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
          this.mino = Game.makeMino(p);
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
    this.mino.draw(p);
    this.field.draw(p);

    this.fc++;
  }
}
