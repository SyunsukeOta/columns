class GameContainer {
  constructor() {
    this.app = new PIXI.Application();
    this.app.stage.interactive = true; 

    this.jewelSize = 30;
    this.jewelMax = 3;
    this.jewelTypes = [
      {name: 'red', number: 1, color: 0xff0000},
      {name: 'green', number: 2, color: 0x00ff00},
      {name: 'blue', number: 3, color: 0x0000ff},
      {name: 'yellow', number: 4, color: 0xffff00},
      {name: 'orange', number: 5, color: 0xffa500},
      {name: 'purple', number: 6, color: 0x800080}
    ];

    this.boardTop = 50;
    this.boardLeft = 50;   
    this.boardCellWidth = 6;
    this.boardCellHeight = 13;
    this.boardType = 0x999999;
    this.startCellLeft = 3;
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
        callback();
        e.preventDefault();
        return;
      }
    }, false);
  }
  addLeftKeyEvent(callback) {
    document.addEventListener("keydown", e => {
      if (e.keyCode == 37) {
        callback();
        e.preventDefault();
        return;
      }
    }, false);
  }
  addDownKeyEvent(callback) {
    document.addEventListener("keydown", e => {
      if (e.keyCode == 40) {
        callback();
        e.preventDefault();
        return;
      }
    }, false);
  }
  addGraphicChild(graphics) {
    this.app.stage.addChild(graphics);
  }
  removeGraphicChild(graphics) {
    this.app.stage.removeChild(graphics);
  }
  getRandomJewelType() {
    return this.jewelTypes[Math.floor(Math.random()*this.jewelTypes.length)];
  }
}

class Jewel {
  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    this.jewelType = gameContainer.getRandomJewelType();
    this.jewelSize = gameContainer.jewelSize;
    this.jewel = null;
  }
  draw(left, top) {
    if (this.jewel === null) {
      this.jewel = gameContainer.createGraphics();
      this.jewel.beginFill(this.jewelType.color);
      this.jewel.drawRect(0, 0, this.jewelSize, this.jewelSize);
      this.jewel.endFill();
      this.gameContainer.addGraphicChild(this.jewel);
    }
    this.jewel.x = left;
    this.jewel.y = top;
  }
  destroy() {
    this.gameContainer.removeGraphicChild(this.jewel);
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
  getJewels() {
    return this.jewels;
  }
  clearJewels() {
    this.jewels = [];
  }
}

class Board {
  constructor(gameContainer) {
    this.jewels = [];
    for(let i=0; i<gameContainer.boardCellHeight; i++) {
      this.jewels[i] = [];
      for(let j=0; j<gameContainer.boardCellWidth; j++) {
        this.jewels[i][j] = null;
      }
    }
    
    this.gameContainer = gameContainer;

    this.boardCellWidth = this.gameContainer.boardCellWidth;
    this.boardCellHeight = this.gameContainer.boardCellHeight;
    this.drawBackground();
    this.setKeyEvent();
  }
  drawBackground() {
    let background = this.gameContainer.createGraphics();
    background.beginFill(this.gameContainer.boardType);
    background.drawRect(0, 0, this.boardCellWidth*this.gameContainer.jewelSize, this.boardCellHeight*this.gameContainer.jewelSize);
    background.endFill();
    this.gameContainer.addGraphicChild(background);
    background.x = this.gameContainer.boardLeft;
    background.y = this.gameContainer.boardTop;
  }
  drawJewels() {
    for(let i=0; i<this.gameContainer.boardCellHeight; i++) {
      for(let j=0; j<this.gameContainer.boardCellWidth; j++) {
        if (this.jewels[i][j] !== null) {
          let x = this.gameContainer.boardLeft+this.gameContainer.jewelSize*j;
          let y = this.gameContainer.boardTop+this.gameContainer.jewelSize*i;
          this.jewels[i][j].draw(x, y);
        }
      }
    }
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
    this.block = new Block(this.gameContainer);
    this.drawBlock(this.gameContainer.startCellLeft, this.gameContainer.startCellTop);
  }
  moveRight() {
    if (this.cellLeft < this.gameContainer.boardCellWidth-1 && this.jewels[this.cellTop+2][this.cellLeft+1] === null) {
      this.drawBlock(this.cellLeft+1, this.cellTop);
    }
  }
  moveLeft() {
    if (this.cellLeft > 0 && this.jewels[this.cellTop+2][this.cellLeft-1] === null) {
      this.drawBlock(this.cellLeft-1, this.cellTop);      
    }
  }
  moveDown() {
    if (this.cellTop < this.gameContainer.boardCellHeight-this.gameContainer.jewelMax && this.jewels[this.cellTop+3][this.cellLeft] === null) {
      this.drawBlock(this.cellLeft, this.cellTop+1);
      
    } else {
      this.freezeBlock();
      
    }
  }
  checkJewels(checkCells) {
    console.log('*** checkCells ***');
    console.log(checkCells);
    let deleteCells = [];
    for(let j=0; j<checkCells.length; j++) {
      let checkCell = checkCells[j];
      for(let i=-1; i<=1; i++) {
        let baseLeft = checkCell.x+i;
        let baseTop = checkCell.y;
        let baseJewel = this.getJewel(baseLeft, baseTop);
        let leftJewel = this.getJewel(baseLeft-1, baseTop);
        let rightJewel = this.getJewel(baseLeft+1, baseTop);
        if (leftJewel && rightJewel && baseJewel && leftJewel.jewelType === baseJewel.jewelType && baseJewel.jewelType === rightJewel.jewelType) {
          deleteCells.push({x: baseLeft, y: baseTop});
          deleteCells.push({x: baseLeft-1, y: baseTop});
          deleteCells.push({x: baseLeft+1, y: baseTop});
        }
      }
      for(let i=-1; i<=1; i++) {
        let base2Left = checkCell.x;
        let base2Top = checkCell.y+i;
        let baseJewel = this.getJewel(base2Left, base2Top);
        let topJewel = this.getJewel(base2Left, base2Top-1);
        let bottomJewel = this.getJewel(base2Left, base2Top+1);
        if (topJewel && bottomJewel && baseJewel && topJewel.jewelType === baseJewel.jewelType && baseJewel.jewelType === bottomJewel.jewelType) {
          deleteCells.push({x: base2Left, y: base2Top});
          deleteCells.push({x: base2Left, y: base2Top+1});
          deleteCells.push({x: base2Left, y: base2Top-1});
          //console.log(deleteCells);
          
        }
      }
      for(let i=-1; i<=1; i++) {
        let base3Left = checkCell.x-i;
        let base3Top = checkCell.y+i;
        let base3Jewel = this.getJewel(base3Left, base3Top);
        let leftBottomJewel = this.getJewel(base3Left-1, base3Top+1);
        let rightTopJewel = this.getJewel(base3Left+1, base3Top-1);
        if (leftBottomJewel && rightTopJewel && base3Jewel && leftBottomJewel.jewelType === base3Jewel.jewelType && base3Jewel.jewelType === rightTopJewel.jewelType) {
          deleteCells.push({x: base3Left, y: base3Top});
          deleteCells.push({x: base3Left-1, y: base3Top+1});
          deleteCells.push({x: base3Left+1, y: base3Top-1});
          console.log(deleteCells);
          
        }
      }

      for(let i=-1; i<=1; i++) {
        let base4Left = checkCell.x+i;
        let base4Top = checkCell.y+i;
        let base4Jewel = this.getJewel(base4Left, base4Top);
        let leftTopJewel = this.getJewel(base4Left-1, base4Top-1);
        let rightBottomJewel = this.getJewel(base4Left+1, base4Top+1);
        if (leftTopJewel && rightBottomJewel && base4Jewel && leftTopJewel.jewelType === base4Jewel.jewelType && base4Jewel.jewelType === rightBottomJewel.jewelType) {
          deleteCells.push({x: base4Left, y: base4Top});
          deleteCells.push({x: base4Left-1, y: base4Top-1});
          deleteCells.push({x: base4Left+1, y: base4Top+1});
          console.log(deleteCells);
          
        }
      }
    }

    if (!deleteCells.length) return;
    deleteCells.sort((a, b) => {
      if (a.y < b.y) return -1;
      if (a.y > b.y) return 1;
      return 0;
    });
    console.log(deleteCells);
    //deleteCellsを同じものを含めないようにする
    let fallCells = [];
    for(let i=0; i<deleteCells.length; i++) {
      this.deleteCell(deleteCells[i]);
    }
    for(let i=0; i<deleteCells.length; i++) {
      fallCells = fallCells.concat(this.fallCell(deleteCells[i]));
    }
    this.drawJewels();
    console.log('*** changeJewels ***');
    this.printJewels();
    //console.log(this.jewels);
    if (fallCells.length) {
      this.checkJewels(fallCells);
    }
  }
  getJewel(left, top) {
    if (left >= this.gameContainer.boardCellWidth || left < 0) {
      return null;
    }
    if (top >= this.gameContainer.boardCellHeight || top < 0) {
      return null;
    }
    return this.jewels[top][left];
  }
  deleteCell(cell) {
    if (!this.jewels[cell.y][cell.x]) return;
    this.jewels[cell.y][cell.x].destroy();
    this.jewels[cell.y][cell.x] = null;
  }
  fallCell(cell) {
    let fallCells = [];
    if (this.jewels[cell.y][cell.x]) return fallCells;
    let fallCount = 0;
    let nullCount = 0;
    for(let i=cell.y-1; i>=0; i--) {
      fallCount++;
      if (this.jewels[i][cell.x] !== null) {
        break;
      }
      nullCount++;
    }
    if (fallCount === nullCount) {
      return fallCells;
    }
    //console.log(fallCount);
    
    for(let i=cell.y-fallCount; i>=0; i--) {
      this.jewels[i+fallCount][cell.x] = this.jewels[i][cell.x];
      if (this.jewels[i+fallCount][cell.x] !== null) {
        fallCells.push({x: cell.x, y: i+fallCount});
      }
    }
    //console.log(fallCells);
    
    return fallCells;
  }
  printJewels() {
    let jewelsStrings = [];
    for(let i=0; i<this.gameContainer.boardCellHeight; i++) {
      let jewelsString = '';
      for(let j=0; j<this.gameContainer.boardCellWidth; j++) {
        if (this.jewels[i][j] !== null) {
          jewelsString += this.jewels[i][j].jewelType.number;
        } else {
          jewelsString += '0';
        }
      }
      jewelsStrings.push(jewelsString);
    }
    console.log(jewelsStrings);
  }
  checkGameover() {
    if (this.jewels[0][0] !== null || this.jewels[0][1] !== null || this.jewels[0][2] !== null || this.jewels[1][3] !== null || this.jewels[0][4] !== null || this.jewels[0][5] !== null) {
      console.log('%c gameover', 'color: red;');
      alert('GAMEOVER');
      return true;
    }
    return false;
  }
  resetJewels() {
    for(let y=0; y<this.gameContainer.boardCellHeight; y++) {
      for(let x=0; x<this.gameContainer.boardCellWidth; x++) {
        this.deleteCell({x: x, y: y});
      }
    }
  }
  freezeBlock() {
    let blockJewels = this.block.getJewels();
    for(let i=0; i<3; i++) {
      this.jewels[this.cellTop+i][this.cellLeft] = blockJewels[i]
    }
    this.block.clearJewels();
    this.drawJewels();
    console.log('*** freezeBlock ***');
    this.printJewels();
    //console.log(this.jewels);
    let checkCells = [];
    for(let i=0; i<3; i++) {
      checkCells.push({x: this.cellLeft, y: this.cellTop+i});
    }
    this.checkJewels(checkCells);
    if (this.checkGameover()) {
      this.resetJewels();
    } 
    this.startBlock();
    
  }
}

let gameContainer = new GameContainer();
document.body.appendChild(gameContainer.app.view);

let board = new Board(gameContainer);
board.startBlock();
board.drawJewels();