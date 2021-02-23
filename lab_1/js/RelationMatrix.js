class RelationMatrix {
  #set;
  #relationMap;
  #baseClass = 'relational-matrix';
  #$root;
  #$features;
  #$isReflexiveFeature;
  #$isIrreflexiveFeature;
  #$isSymmetricFeature;
  #$isAntiSymmetricFeature;
  #$isTransitiveFeature;
  #$matrix;
  #$svg;
  #cellSize = 40;
  #size;
  #inProgress = {
    illustrateReflexivity: false,
    illustrateIrreflexivity: false,
    illustrateSymmetry: false,
    illustrateAntiSymmetry: false,
    illustrateTransitivity: false
  }
  #isReflexive;
  #isIrreflexive;
  #isSymmetric;
  #isAntiSymmetric;
  #isTransitive;

  #checkNoTransitivityElements = [];

  constructor() {
    this.#$root = document.querySelector(`.${this.#baseClass}`);
    this.#$matrix = document.querySelector(`.${this.#baseClass}__matrix`);
    this.#$features = document.querySelector(`.${this.#baseClass}__features`);

    this.#$isReflexiveFeature = document.querySelector(`.${this.#baseClass}__features--reflexivity`);
    this.#$isIrreflexiveFeature = document.querySelector(`.${this.#baseClass}__features--irreflexivity`);
    this.#$isSymmetricFeature = document.querySelector(`.${this.#baseClass}__features--symmetry`);
    this.#$isAntiSymmetricFeature = document.querySelector(`.${this.#baseClass}__features--antisymmetry`);
    this.#$isTransitiveFeature = document.querySelector(`.${this.#baseClass}__features--transitivity`);

    this.#$isReflexiveFeature.addEventListener('click', this.illustrateReflexivity.bind(this));
    this.#$isIrreflexiveFeature.addEventListener('click', this.illustrateIrreflexivity.bind(this));
    this.#$isSymmetricFeature.addEventListener('click', this.illustrateSymmetry.bind(this));
    this.#$isAntiSymmetricFeature.addEventListener('click', this.illustrateAntiSymmetry.bind(this));
    this.#$isTransitiveFeature.addEventListener('click', this.illustrateTransitivity.bind(this));

    document.addEventListener('TOOLTIP_HAS_BEEN_CLOSED', () => {
      Object.keys(this.#inProgress).forEach(key => this.#inProgress[key] = false);
    })
  }

  init(set, relationMap) {
    this.#set = set;
    this.#relationMap = relationMap;
    this.#size = (this.#set.length + 2) * this.#cellSize;

    this.#relationMap.size ? this.showFeatures() : this.hideFeatures();

    this.drawMatrix();
  }

  renderAxis() {
    let axisPoints = '', text;
    let x, y;

    // draw axis
    for (let i = 0; i < this.#set.length; i++) {
      x = this.#cellSize / 2;
      y = this.#cellSize / 2 + (this.#cellSize * i)
      text = this.#set[i];

      axisPoints += `
        <text x="${x}" y="${y}" font-size="20" text-anchor="middle" fill="#222" font-weight="bolder">${text}</text>
      `;
    }

    for (let i = 0; i < this.#set.length; i++) {
      x = this.#cellSize * 3 / 2 + (this.#cellSize * i);
      y = this.#cellSize / 2 + (this.#cellSize * this.#set.length)
      text = this.#set[i];

      axisPoints += `
        <text x="${x}" y="${y}" font-size="20" text-anchor="middle" fill="#222" font-weight="bolder">${text}</text>
      `;
    }

    return axisPoints;
  }

  renderMatrixElements() {
    let matrixElements = '', text;
    let x, y, xValue, yValue;

    for (let i = 0; i < this.#set.length; i++) {
      xValue = this.#set[i];

      for (let j = 0; j < this.#set.length; j++) {
        x = this.#cellSize * 3 / 2 + (this.#cellSize * j);
        y = this.#cellSize / 2 + (this.#cellSize * i);
        yValue = this.#set[j];
        text = 0;

        if (this.#relationMap.has(xValue)) {
          text = this.#relationMap.get(xValue).includes(yValue) ? 1 : 0;
        }

        // text = `${xValue}_${yValue}`;

        matrixElements += `
          <text x="${x}" y="${y}" font-size="20" text-anchor="middle" fill="#222" font-weight="bolder">${text}</text>
        `;
      }
    }

    return matrixElements;
  }

  showFeatures() {
    this.#$features.style.display = 'block';
  }

  hideFeatures() {
    this.#$features.style.display = 'none';
  }

  drawMatrix() {
    this.#$matrix.innerHTML = `
    <svg version="1.1"
        baseProfile="full"
        width="${this.#size}" height="${this.#size}"
        xmlns="http://www.w3.org/2000/svg">
        ${this.renderAxis()}
        <rect x="${this.#cellSize}" y="0" width="1" height="${this.#size - this.#cellSize * 2}" fill="#222" />
        <rect x="${this.#cellSize}" y="${this.#size - this.#cellSize * 2}" width="${this.#size - this.#cellSize * 2}" height="1" fill="#222" />
        ${this.renderMatrixElements()}
    </svg>
    `;

    this.#$svg = this.#$matrix.querySelector('svg');

    this.checkReflexivity();
    this.checkIrreflexivity();
    this.checkSymmetry();
    this.checkAntiSymmetry();
    this.checkTransitivity();
  }

  /**
   * Return [x, y] coordinates
   * @param {number} i - index
   * @param {number} j - index
   * @return {number[]} coordinates
   */
  matrixElemAddressToCoords(i, j) {
    return [
      i * this.#cellSize - this.#cellSize / 2,
      j * this.#cellSize - this.#cellSize / 2
    ];
  }

  checkReflexivity() {
    this.#isReflexive = this.#set.every(elem => {
      return this.#relationMap.has(elem) && this.#relationMap.get(elem).includes(elem);
    });

    this.#$isReflexiveFeature.innerText = this.#isReflexive
      ? 'рефлексивно'
      : 'не рефлексивно';
  }

  checkIrreflexivity() {
    this.#isIrreflexive = this.#set.every(elem => {
      return this.#relationMap.has(elem)
        ? !this.#relationMap.get(elem).includes(elem)
        : true;
    });

    this.#$isIrreflexiveFeature.innerText = this.#isIrreflexive
      ? 'антирефлексивно'
      : 'не антирефлексивно';
  }

  checkSymmetry() {
    this.#isSymmetric = this.#set.every(elem => {
      if (!this.#relationMap.has(elem)) {
        return true;
      }

      return this.#relationMap.has(elem) && this.#relationMap.get(elem).every(innerElem => {
        return this.#relationMap.has(innerElem) && this.#relationMap.get(innerElem).includes(elem);
      })
    });

    this.#$isSymmetricFeature.innerText = this.#isSymmetric
      ? 'симметрично'
      : 'не симметрично';
  }

  checkAntiSymmetry() {
    this.#isAntiSymmetric = this.#set.every(elem => {
      if (!this.#relationMap.has(elem)) {
        return true;
      }

      return this.#relationMap.has(elem) && this.#relationMap.get(elem).every(innerElem => {
        if (this.#relationMap.has(innerElem) && this.#relationMap.get(innerElem).includes(elem)) {
          return elem === innerElem;
        }

        return true;
      })
    });

    this.#$isAntiSymmetricFeature.innerText = this.#isAntiSymmetric
      ? 'антисимметрично'
      : 'не антисимметрично';
  }

  checkTransitivity() {
    this.#isTransitive = this.#set.every(elem => {
      if (this.#relationMap.has(elem)) {
        return this.#relationMap.get(elem).every(innerElem => {
          if (this.#relationMap.has(innerElem)) {
            return this.#relationMap.get(innerElem).every(innerInnerElem => {
              return this.#relationMap.get(elem).includes(innerInnerElem);
            });
          }

          return true;
        })
      }

      return true;
    });

    this.#$isTransitiveFeature.innerText = this.#isTransitive
      ? 'транзитивно'
      : 'не транзитивно';
  }

  // ILLUSTRATE PROPERTIES

  illustrateReflexivity({target}) {
    if (!this.#inProgress.illustrateReflexivity) {
      this.#inProgress.illustrateReflexivity = true;

      this.drawMainDiagonal().then(() => this.#inProgress.illustrateReflexivity = false);

      const tooltip = new Tooltip(target);

      const message = {
        title: this.#isReflexive ? 'Почему отношение рефлексивно?' : 'Почему отношение не рефлексивно?',
        text: this.#isReflexive
          ? 'Мы можем сделать вывод о том, что отношение рефлексивно, на том основании, что все элементы главной диагонали матрицы равны единице.'
          : 'Мы можем сделать вывод о том, что отношение не рефлексивно, на том основании, что НЕ все элементы главной диагонали матрицы равны единице.'
      };

      tooltip.show(message);
    }
  }

  illustrateIrreflexivity({target}) {
    if (!this.#inProgress.illustrateIrreflexivity) {
      this.#inProgress.illustrateIrreflexivity = true;

      this.drawMainDiagonal().then(() => this.#inProgress.illustrateIrreflexivity = false);

      const tooltip = new Tooltip(target);

      const message = {
        title: this.#isIrreflexive ? 'Почему отношение антирефлексивно?' : 'Почему отношение не антирефлексивно?',
        text: this.#isIrreflexive
          ? 'Мы можем сделать вывод о том, что отношение антирефлексивно, на том основании, что все элементы главной диагонали матрицы равны нулю.'
          : 'Мы можем сделать вывод о том, что отношение не рефлексивно, на том основании, что НЕ все элементы главной диагонали матрицы равны нулю.'
      };

      tooltip.show(message);
    }
  }

  illustrateSymmetry({target}) {
    if (!this.#inProgress.illustrateSymmetry) {
      this.#inProgress.illustrateSymmetry = true;

      this.encircleSymmetricElements().then(() => this.#inProgress.illustrateSymmetry = false);

      const tooltip = new Tooltip(target);

      const message = {
        title: this.#isSymmetric ? 'Почему отношение симметрично?' : 'Почему отношение не симметрично?',
        text: this.#isSymmetric
          ? 'Мы можем сделать вывод о том, что отношение симметрично, на том основании, матрица симметрична относительно главной диагонали.'
          : 'Мы можем сделать вывод о том, что отношение не симметрично, на том основании, что матрица ассиметрична относительно главной диагонали.'
      };

      message.text += `
        <br>
        <div style="color: blue;">* Синим обведены симметричные элементы.</div>
        <div style="color: red;">* Красным обведены асимметричные элементы.</div>
      `;

      tooltip.show(message);
    }
  }

  illustrateAntiSymmetry({target}) {
    if (!this.#inProgress.illustrateAntiSymmetry) {
      this.#inProgress.illustrateAntiSymmetry = true;

      this.encircleAntiSymmetricElements().then(() => this.#inProgress.illustrateAntiSymmetry = false);

      const tooltip = new Tooltip(target);

      const message = {
        title: this.#isAntiSymmetric ? 'Почему отношение антисимметрично?' : 'Почему отношение не антисимметрично?',
        text: this.#isAntiSymmetric
          ? 'Мы можем сделать вывод о том, что отношение антисимметрично, на том основании, что симметричные относительно главной диагонали элементы матрицы располагаются ТОЛЬКО на главной диагонали матрицы.'
          : 'Мы можем сделать вывод о том, что отношение не антисимметрично, на том основании, что симметричные относительно главной диагонали матрицы элементы располагаются не только на самой главной диагонали.'
      };

      message.text += `
        <br>
        <div style="color: blue;">* Синим обведены симметричные элементы на главной диагонали.</div>
        <div style="color: red;">* Красным обведены симметричные элементы вне главной диагонали.</div>
      `;

      tooltip.show(message);
    }
  }

  illustrateTransitivity({target}) {
    if (!this.#inProgress.illustrateTransitivity) {
      this.#inProgress.illustrateTransitivity = true;

      const tooltip = new Tooltip(target);

      const message = {
        title: this.#isTransitive ? 'Почему отношение транзитивно?' : 'Почему отношение не транзитивно?',
        text: this.#isTransitive
          ? 'Мы можем сделать вывод о том, что отношение транзитивно, на том основании, что для любых трёх элементов a,b,c из выполнения отношений aRb и bRc следует выполнение отношения aRc.'
          : 'Мы можем сделать вывод о том, что отношение не транзитивно, на том основании, что не для любых трёх элементов a,b,c из выполнения отношений aRb и bRc следует выполнение отношения aRc.'
      };

      tooltip.show(message);
    }
  }

  // SVG HELPERS

  /**
   * Hide element smoothly
   * @param {ChildNode} $elem
   * @return {Promise<void>}
   */
  hideDrawnElement($elem) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        $elem.remove();

        resolve();
      }, 500);

      $elem.style.transition = '.3s';
      $elem.style.opacity = '0';
    });
  }

  drawMainDiagonal({strokeWidth = 16} = {}) {
    return new Promise((resolve) => {
      const [startX, startY] = this.matrixElemAddressToCoords(1, 0);
      const [finishX] = this.matrixElemAddressToCoords(this.#set.length + 1, this.#set.length);
      const id = `reflexivity-svg-id-${Math.random()}`;
      let currentX = startX + 35,
        currentY = startY + 30;
      const step = 5;

      const svg = `<line id="${id}"
      x1="${currentX}"
      y1="${currentY}"
      x2="${currentX}"
      y2="${currentY}"
      stroke="red"
      stroke-width="${strokeWidth}"
      stroke-opacity="0.5"
      stroke-linecap="round"
      />`;

      this.#$svg.insertAdjacentHTML('beforeend', svg);

      const $line = this.#$svg.getElementById(id);

      document.addEventListener('TOOLTIP_HAS_BEEN_CLOSED', () => {
        this.hideDrawnElement($line).then(resolve);
      });

      const callback = () => {
        if (currentX < finishX) {
          currentX += step;
          currentY += step;
          $line.setAttribute('x2', currentX);
          $line.setAttribute('y2', currentY);

          requestAnimationFrame(callback)
        } else {
          setTimeout(() => {
            this.hideDrawnElement($line).then(resolve);
          }, 5000);
        }
      };

      requestAnimationFrame(callback);
    });
  }

  drawCircle(x, y, $circlesGroup, {color} = {}) {
    const cx = this.#cellSize * (x + 1) + this.#cellSize / 2;
    const cy = this.#cellSize * y + this.#cellSize / 2 - this.#cellSize * 0.15;
    const radius = this.#cellSize / 3;

    const circle = `<circle cx="${cx}" cy="${cy}" r="${radius}" stroke="${color}" stroke-width="2" fill="none"/>`;

    $circlesGroup.insertAdjacentHTML('beforeend', circle);
  }

  encircleSymmetricElements() {
    return new Promise(resolve => {
      const id = `circles-group_${Math.random()}`;

      const group = `<g id="${id}"></g>`

      this.#$svg.insertAdjacentHTML('beforeend', group);

      const $circlesGroup = document.getElementById(id);

      this.drawMainDiagonal();

      const elements = [];

      this.#set.forEach((elem, row) => {
        if (this.#relationMap.has(elem)) {
          this.#set.forEach((innerElem, col) => {
            if (this.#relationMap.has(innerElem)) {
              if (this.#relationMap.get(innerElem).includes(elem)) {
                if (elem !== innerElem) {
                  elements.push({row, col, isSymmetric: this.#relationMap.get(elem).includes(innerElem)});
                }
              }
            } else if (this.#relationMap.get(elem).includes(innerElem)) {
              elements.push({row: col, col: row, isSymmetric: false});
            }
          });
        }
      });

      elements.forEach(({row, col, isSymmetric}) => {
        this.drawCircle(row, col, $circlesGroup, {
          color: isSymmetric ? 'blue' : 'red'
        });
      });

      document.addEventListener('TOOLTIP_HAS_BEEN_CLOSED', () => {
        this.hideDrawnElement($circlesGroup).then(resolve);
      });

      setTimeout(() => {
        this.hideDrawnElement($circlesGroup).then(resolve);
      }, 5000);
    });
  }

  encircleAntiSymmetricElements() {
    return new Promise(resolve => {
      const id = `circles-group_${Math.random()}`;

      const group = `<g id="${id}"></g>`

      this.#$svg.insertAdjacentHTML('beforeend', group);

      const $circlesGroup = document.getElementById(id);

      this.drawMainDiagonal();

      const elements = [];

      this.#set.forEach((elem, row) => {
        if (this.#relationMap.has(elem)) {
          this.#set.forEach((innerElem, col) => {
            if (this.#relationMap.has(innerElem)) {
              if (this.#relationMap.get(innerElem).includes(elem)) {
                if (elem === innerElem) {
                  elements.push({row, col, isAntiSymmetric: this.#relationMap.get(elem).includes(innerElem)});
                } else {
                  elements.push({row: col, col: row, isAntiSymmetric: false});
                }
              }
            }
          });
        }
      });

      elements.forEach(({row, col, isAntiSymmetric}) => {
        this.drawCircle(row, col, $circlesGroup, {
          color: isAntiSymmetric ? 'blue' : 'red'
        });
      });

      document.addEventListener('TOOLTIP_HAS_BEEN_CLOSED', () => {
        this.hideDrawnElement($circlesGroup).then(resolve);
      });

      setTimeout(() => {
        this.hideDrawnElement($circlesGroup).then(resolve);
      }, 5000);
    });
  }
}