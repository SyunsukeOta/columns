const jewelTop = 50;
const jewelLeft = 50;

class GameContainer {
  constructor() {
    this.app = new PIXI.Application();
    this.app.stage.interactive = true;
  
    this.jewelSize = 100;
    this.jewelMax = 3;
    this.jewelTypes = [
      {name: 'red', color: 0xff0000},
      {name: 'green', color: 0x00ff00},
      {name: 'blue', color: 0x0000ff},
      {name: 'yellow', color: 0xffff00},
      {name: 'orange', color: 0xffa500},
      {name: 'purple', color: 0x800080}
    ];
  }
  createGraphics() {
    return new PIXI.Graphics();
  }
  addClickEvent(callback) {
    this.app.renderer.plugins.interaction.on('pointerdown', callback);
  }
  addGraphicChild(graphics) {
    this.app.stage.addChild(graphics);
  }
  getRandomJewelType() {
    return this.jewelTypes[Math.floor(Math.random()*this.jewelTypes.length)];
  }
}

class Jewel {
  constructor(GameContainer) {
    this.jewelType = GameContainer.getRandomJewelType();
    this.jewelSize = GameContainer.jewelSize;
    this.jewel = GameContainer.createGraphics();
    this.jewel.beginFill(this.jewelType.color);
    this.jewel.drawRect(0, 0, this.jewelSize, this.jewelSize);
    this.jewel.endFill();
    GameContainer.addGraphicChild(this.jewel);
  }
  draw(left, top) {
    this.jewel.x = left;
    this.jewel.y = top;
  }
}

class Block {
  constructor(GameContainer) {
    this.jewels = [];
    this.jewelMax = GameContainer.jewelMax;
    this.jewelSize = GameContainer.jewelSize;
    for(let i=0; i<this.jewelMax; i++) {
      this.jewels[i] = new Jewel(GameContainer);
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
let g = new GameContainer();
document.body.appendChild(g.app.view);

var b = new Block(g);
b.draw(jewelLeft, jewelTop);

g.addClickEvent(() => b.rotate());