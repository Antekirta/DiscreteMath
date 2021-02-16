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
    illustrateReflexivity: false
  }
  #isReflexive;
  #isIrreflexive;
  #isSymmetric;
  #isAntiSymmetric;
  #isTransitive;

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

  checkReflexivity() {
    this.#isReflexive = this.#set.every(elem => {
      return this.#relationMap.has(elem) && this.#relationMap.get(elem).includes(elem);
    });

    this.#$isReflexiveFeature.innerText = this.#isReflexive
      ? 'рефлексивно'
      : 'не рефлексивно';

    console.log('isReflexive: ', this.#isReflexive);
  }

  illustrateReflexivity({ target }) {
    if (!this.#inProgress.illustrateReflexivity) {
      this.#inProgress.illustrateReflexivity = true;

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
      stroke-width="16"
      stroke-opacity="0.5"
      stroke-linecap="round"
      />`;

      this.#$svg.insertAdjacentHTML('beforeend', svg);

      const $line = this.#$svg.getElementById(id);

      const callback = () => {
        if (currentX < finishX) {
          currentX += step;
          currentY += step;
          $line.setAttribute('x2', currentX);
          $line.setAttribute('y2', currentY);

          requestAnimationFrame(callback)
        } else {
          setTimeout(() => {
            this.hideDrawnElement($line).then(() => this.#inProgress.illustrateReflexivity = false);
          }, 5000);
        }
      };

      requestAnimationFrame(callback);

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

  checkIrreflexivity() {
    this.#isIrreflexive = this.#set.every(elem => {
      return this.#relationMap.has(elem)
        ? !this.#relationMap.get(elem).includes(elem)
        : true;
    });

    this.#$isIrreflexiveFeature.innerText = this.#isIrreflexive
      ? 'антирефлексивно'
      : 'не антирефлексивно';

    console.log('isIrreflexive: ', this.#isIrreflexive);
  }

  checkSymmetry() {
    this.#isSymmetric = this.#set.every(elem => {
      return this.#relationMap.has(elem) && this.#relationMap.get(elem).every(innerElem => {
        return this.#relationMap.has(innerElem) && this.#relationMap.get(innerElem).includes(elem);
      })
    });

    this.#$isSymmetricFeature.innerText = this.#isSymmetric
      ? 'симметрично'
      : 'не симметрично';

    console.log('isSymmetric: ', this.#isSymmetric);
  }

  checkAntiSymmetry() {
    this.#isAntiSymmetric = this.#set.every(elem => {
      return this.#relationMap.has(elem) && this.#relationMap.get(elem).every(innerElem => {
        if (innerElem === elem) {
          return true;
        }

        return !this.#relationMap.has(innerElem) || !this.#relationMap.get(innerElem).includes(elem);
      })
    });

    this.#$isAntiSymmetricFeature.innerText = this.#isAntiSymmetric
      ? 'антисимметрично'
      : 'не антисимметрично';

    console.log('isAntiSymmetric: ', this.#isAntiSymmetric);
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

    console.log('isTransitive: ', this.#isTransitive);
  }
}