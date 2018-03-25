const SVGNS = 'http://www.w3.org/2000/svg';
class Wave {
  constructor(container) {
    this.container = container;
    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    this.o = 0;
    this.init();
  }
  init() {
    this.createSvg();
    this.createDefs();
    this.createGrid();
    this.addText();
    this.animate();
  }
  createEle(ele) {
    return document.createElementNS(SVGNS, ele);
  }
  createDefs() {
    this.defs = document.createElementNS(SVGNS, 'defs');
    this.svg.appendChild(this.defs);
  }
  createSvg() {
    this.svg = document.createElementNS(SVGNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttribute('xmln', SVGNS);
    this.container.appendChild(this.svg);
  }
  createGrid() {
    // 创建笔刷
    const gridPattern = document.createElementNS(SVGNS, 'pattern');
    gridPattern.setAttribute('id', 'pattern-grid');
    gridPattern.setAttribute('x', '0');
    gridPattern.setAttribute('y', '0');
    gridPattern.setAttribute('width', '20');
    gridPattern.setAttribute('height', '20');
    // 改变笔刷单位
    gridPattern.setAttribute('patternUnits', 'userSpaceOnUse');

    // 创建笔刷的内容--绘制网格单元
    const item = document.createElementNS(SVGNS, 'path');
    item.setAttribute('fill', 'none');
    item.setAttribute('stroke', '#f0f0f0');
    item.setAttribute('d', 'M0,0H20V20');
    gridPattern.appendChild(item);
    this.defs.appendChild(gridPattern);

    // 创建网格层
    const grids = document.createElementNS(SVGNS, 'rect');
    grids.setAttribute('x', '0');
    grids.setAttribute('y', '0');
    grids.setAttribute('width', this.width);
    grids.setAttribute('height', this.height);
    grids.setAttribute('fill', 'url(#pattern-grid)');
    this.grids = grids;
    this.svg.appendChild(grids);
  }
  addText() {
    const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const len = text.length;
    this.text = this.createEle('text');
    this.text.setAttribute('x', '10');
    this.text.setAttribute('y', '300');
    const dxArr = [];
    for (let i = 0; i < len; i++) {
      const tspan = this.createEle('tspan');
      tspan.textContent = text[i];
      dxArr.push(20);
      this.text.appendChild(tspan);
    }
    this.dxArr = dxArr;
    this.svg.appendChild(this.text);
  }
  animate() {
    this.o += 0.01;
    this.animationSin();
    this.text.setAttribute('dx', this.dxArr.join(' '));
    this.text.setAttribute('dy', this.dyArr.join(' '));
    requestAnimationFrame(this.animate.bind(this));
  }
  animationSin() {
    // f(x) = Asin(wx + o)
    const dyArr = [];
    const max = 120;
    const w = 0.02;
    let pre = 0;
    for (let i = 0; i < 26; i++) {
       const y = -max * Math.sin(w * i * 20 + this.o);
       dyArr.push(y - pre);
       pre = y;
    }
    this.dyArr = dyArr;
  }
}

const container = document.getElementById('container');

const wave = new Wave(container)
