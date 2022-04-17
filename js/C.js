class GameContainer {
  constructor() {
    this.app = new PIXI.Application();
    this.app.stage.interactive = true; 

    this.jewelSize = 20;
    this.jewelMax = 3;
    this.jewelTypes = [
      {name: 'red', color: 0xff0000},
      {name: 'green', color: 0x00ff00},
      {name: 'blue', color: 0x0000ff},
      {name: 'yellow', color: 0xffff00},
      {name: 'orange', color: 0xffa500},
      {name: 'purple', color: 0x800080}
    ];

    this.boardTop = 50;
    this.boardLeft = 50;   
    this.boardCellWidth = 6;
    this.boardCellHeight = 13;
    this.boardType = 0x999999;
    this.startCellLeft = 2;
    this.startCellTop = 0;
  }
  createGraphics() {
    return new PIXI.Graphics();
  }
  addSpaceKeyEvent(callback) {
    // this.app.renderer.plugins.interaction.on('pointerdown', callback);
    document.addEventListener("keydown", e => {
      if (e.keyCode == 32) {
        callback();
        e.preventDefault();
        return;
      }
    }, false);
  }
  addRightKeyEvent(callback) {
    document.addEventListener("keydown", e => {
      if (e.keyCode == 39) {
        console.log(e.keyCode);
        callback();
        e.preventDefault();
        return;
      }
    }, false);
  }
  addLeftKeyEvent(callback) {
    document.addEventListener("keydown", e => {
      if (e.keyCode == 37) {
        console.log(e.keyCode);
        callback();
        e.preventDefault();
        return;
      }
    }, false);
  }
  addDownKeyEvent(callback) {
    document.addEventListener("keydown", e => {
      if (e.keyCode == 40) {
        console.log(e.keyCode);
        callback();
        e.preventDefault();
        return;
      }
    }, false);
  }
  addGraphicChild(graphics) {
    this.app.stage.addChild(graphics);
  }
  getRandomJewelType() {
    return this.jewelTypes[Math.floor(Math.random()*this.jewelTypes.length)];
  }
}

class Jewel {
  constructor(gameContainer) {
    this.jewelType = gameContainer.getRandomJewelType();
    this.jewelSize = gameContainer.jewelSize;
    this.jewel = gameContainer.createGraphics();
    this.jewel.beginFill(this.jewelType.color);
    this.jewel.drawRect(0, 0, this.jewelSize, this.jewelSize);
    this.jewel.endFill();
    gameContainer.addGraphicChild(this.jewel);
  }
  draw(left, top) {
    this.jewel.x = left;
    this.jewel.y = top;
  }
}

class Block {
  constructor(gameContainer) {
    this.jewels = [];
    this.jewelMax = gameContainer.jewelMax;
    this.jewelSize = gameContainer.jewelSize;
    for(let i=0; i<this.jewelMax; i++) {
      this.jewels[i] = new Jewel(gameContainer);
    }
  }

  draw(jewelLeft, jewelTop) {
    this.drawLeft = jewelLeft;
    this.drawTop = jewelTop;
    for(let i=0; i<this.jewelMax; i++) {
      this.jewels[i].draw(this.drawLeft, this.drawTop+this.jewelSize*i);
    }
  }

  rotate() {
    let j = this.jewels[this.jewelMax-1];
    for(let i=this.jewelMax-1; i>0; i--) {
      this.jewels[i] = this.jewels[i-1];
    }
    this.jewels[0] = j;
    this.draw(this.drawLeft, this.drawTop);
  }
}

class Board {
  constructor(gameContainer) {
    this.gameContainer = gameContainer;

    this.boardCellWidth = this.gameContainer.boardCellWidth;
    this.boardCellHeight = this.gameContainer.boardCellHeight;
    this.drawBackground();
    this.block = new Block(this.gameContainer);
    this.setKeyEvent();
  }
  drawBackground() {
    this.board = this.gameContainer.createGraphics();
    this.board.beginFill(this.gameContainer.boardType);
    this.board.drawRect(0, 0, this.boardCellWidth*this.gameContainer.jewelSize, this.boardCellHeight*this.gameContainer.jewelSize);
    this.board.endFill();
    this.gameContainer.addGraphicChild(this.board);
    this.board.x = this.gameContainer.boardLeft;
    this.board.y = this.gameContainer.boardTop;
  }
  drawBlock(cellLeft, cellTop) {
    this.cellLeft = cellLeft;
    this.cellTop = cellTop;
    let x = this.gameContainer.boardLeft+this.gameContainer.jewelSize*cellLeft;
    let y = this.gameContainer.boardTop+this.gameContainer.jewelSize*cellTop;
    this.block.draw(x, y);
  }
  setKeyEvent() {
    this.gameContainer.addSpaceKeyEvent(() => this.block.rotate());
    this.gameContainer.addRightKeyEvent(() => this.moveRight());
    this.gameContainer.addLeftKeyEvent(() => this.moveLeft());
    this.gameContainer.addDownKeyEvent(() => this.moveDown());
  }
  startBlock() {
    board.drawBlock(this.gameContainer.startCellLeft, this.gameContainer.startCellTop);
  }
  moveRight() {
    if (this.cellLeft < this.gameContainer.boardCellWidth-1) {
      this.drawBlock(this.cellLeft+1, this.cellTop);
    }
  }
  moveLeft() {
    if (this.cellLeft > 0) {
      this.drawBlock(this.cellLeft-1, this.cellTop);
    }
  }
  moveDown() {
    if (this.cellTop < this.gameContainer.boardCellHeight-this.gameContainer.jewelMax) {
      this.drawBlock(this.cellLeft, this.cellTop+1);
    }
  }
  
}

let gameContainer = new GameContainer();
document.body.appendChild(gameContainer.app.view);

let board = new Board(gameContainer);
board.startBlock();