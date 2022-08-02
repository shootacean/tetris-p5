import p5 from 'p5';
import { Game } from './tetris';

const s = (p: p5) => {

  let game: Game;
  
  p.setup = function setup(): void {
    p.createCanvas(400, 600);
    p.background(64);
    game = new Game(p);
  }
  
  p.draw = function draw(): void {
    game.proc(p);
  }

  p.keyPressed = function keyPressed(): void {
    // Left
    if (p.keyCode === 65) game.minoVx = -1;
    if (p.keyCode === 37) game.minoVx = -1;

    // Right
    if (p.keyCode === 68) game.minoVx = 1;
    if (p.keyCode === 39) game.minoVx = 1;

    // Up
    // if (p.keyCode === 37);

    // Down
    // if (p.keyCode === 40);

    // Rotate Left
    if (p.keyCode === 81) game.minoVr = -1;

    // Rotate Right
    if (p.keyCode === 69) game.minoVr = 1;
  }
}
new p5(s);
