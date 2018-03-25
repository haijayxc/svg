const SVGNS = 'http://www.w3.org/2000/svg';
const config = {
  defaultOption: {
    rect: {
      x: 20,
      y: 20,
      width: 100,
      height: 100,
      rx: 0,
      ry: 0,
      fill: '#ffffff',
      stroke: '#000000',
      'stroke-width': 1,
    },
    circle: {
      cx: 80,
      cy: 80,
      r: 50,
      fill: '#ffffff',
      stroke: '#000000',
      'stroke-width': 1,
    },
    ellipse: {
      cx: 80,
      cy: 80,
      rx: 50,
      ry: 30,
      fill: '#ffffff',
      stroke: '#000000',
      'stroke-width': 1,
    },
    line: {
      x1: 10,
      y1: 10,
      x2: 100,
      y2: 100,
      fill: '#ffffff',
      stroke: '#000000',
      'stroke-width': 1,
    },
  },
  toolsOption: {
    x: {
      min: 0,
      max: 1000,
      step: 5,
    },
    y: {
      min: 0,
      max: 1000,
      step: 5,
    },
    width: {
      min: 0,
      max: 1000,
      step: 5,
    },
    height: {
      min: 0,
      max: 1000,
      step: 5,
    },
    cx: {
      min: 10,
      max: 1000,
      step: 5,
    },
    cy: {
      min: 10,
      max: 1000,
      step: 5,
    },
    r: {
      min: 10,
      max: 1000,
      step: 5,
    },
    x1: {
      min: 0,
      max: 1000,
      step: 5,
    },
    y1: {
      min: 0,
      max: 1000,
      step: 5,
    },
    x2: {
      min: 0,
      max: 1000,
      step: 5,
    },
    y2: {
      min: 0,
      max: 1000,
      step: 5,
    },
  }
};
const utils = {
  hash() {
    return Math.random().toString(36).substr(2);
  }
}

class Stage {
  constructor(element, callback = _ => _) {
    this.element = element;
    this.bindEvent(callback);
    this.createSvg();
  }
  createSvg() {
    this.svg = document.createElementNS(SVGNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.element.appendChild(this.svg);
  }
  bindEvent(callback) {
    this.element.addEventListener('click', (e) => {
      callback(e);
    }, false);
  }
}

class Shap {
  constructor(tagName, container) {
    this.tagName = tagName;
    this.container = container;
    this.option = config.defaultOption[tagName];
    this.create();
    this.setOption();
    Shap.datas[this.id] = this;
  }
  create() {
    this.id = utils.hash();
    this.instance = document.createElementNS(SVGNS, this.tagName);
    this.instance.setAttribute('data-id', this.id);
    this.container.appendChild(this.instance);
  }
  setOption(patchOption = {}) {
    const option = Object.assign({}, this.option, patchOption);
    this.option = option;
    const shap = this.instance;
    for (let i in option) {
      shap.setAttribute(i, option[i]);
    }
  }
}
Shap.datas = {};

const tools = (function() {
  const toolsBox = document.getElementById('tools');
  const loopAttribute = (shap, callback = _ => _) => {
    const shapType = shap.tagName.toLowerCase();
    const option = shap.option || config.defaultOption[shapType];
    for (let i in option) {
      callback(i, option[i]);
    }
  };
  const getInputType = (item) => {
    switch (item) {
      case 'x':
      case 'y':
      case 'rx':
      case 'ry':
      case 'stroke-width':
        return 'range';
      case 'fill':
      case 'stroke':
        return 'color';
      default:
        return 'range';
    }
  };
  const updateTools = (shap) => {
    let toolsDom = '';
    loopAttribute(shap, (item, value) => {
      const option = config.toolsOption[item] || {};
      const input = `
      <div class="tools-item">
        <label>${item}: </label>
        <input
          type=${getInputType(item)}
          value="${value}"
          data-target="${item}"
          min=${option.min}
          max=${option.max}
          step=${option.step}
        />
      </div>`;
      toolsDom += input;
    });
    toolsBox.innerHTML = toolsDom;
  };
  return {
    toolsBox: toolsBox,
    currentShap: null,
    changeShap(shap) {
      this.currentShap = shap;
      updateTools(shap);
    },
    updateTools: updateTools,
  };
})();

const stageBox = document.getElementById('stage');

// 右侧显示区域
const stage = new Stage(stageBox, (e) => {
  const id = e.target.dataset.id;
  if (id) {
    tools.changeShap(Shap.datas[id]);
  }
});

const operationBtn = document.getElementById('operationBtn');
operationBtn.addEventListener('click', (e) => {
  const id = e.target.id;
  if (id && !!config.defaultOption[id]) {
    const shap = new Shap(id, stage.svg);
    tools.changeShap(shap);
  }
}, false);

tools.toolsBox.addEventListener('change', (e) => {
  const value = e.target.value;
  const item = e.target.dataset.target;
  tools.currentShap.setOption({
    [item]: value
  });
})
