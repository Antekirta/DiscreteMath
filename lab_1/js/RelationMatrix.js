class RelationMatrix {
  #set;
  #relationMap;
  #baseClass = 'relational-matrix';
  #$root;
  #$matrix;
  #cellSize = 40;
  #size;

  constructor() {
    this.#$root = document.querySelector(`.${this.#baseClass}`);
    this.#$matrix = document.querySelector(`.${this.#baseClass}__matrix`);
  }

  init(set, relationMap) {
    this.#set = set;
    this.#relationMap = relationMap;
    this.#size = (this.#set.length + 2) * this.#cellSize;

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

    this.checkReflexivity();
    this.checkIrreflexivity();
    this.checkSymmetry();
  }

  checkReflexivity() {
    const isReflexive = this.#set.every(elem => {
      return this.#relationMap.has(elem) && this.#relationMap.get(elem).includes(elem);
    });

    console.log('isReflexive: ', isReflexive);
  }

  checkIrreflexivity() {
    const isIrreflexive = this.#set.every(elem => {
      return this.#relationMap.has(elem)
        ? !this.#relationMap.get(elem).includes(elem)
        : true;
    });

    console.log('isIrreflexive: ', isIrreflexive);
  }

  checkSymmetry() {
    const isSymmetric = this.#set.every(elem => {
      return this.#relationMap.has(elem) && this.#relationMap.get(elem).every(innerElem => {
        return this.#relationMap.has(innerElem) && this.#relationMap.get(innerElem).includes(elem);
      })
    })

    console.log('isSymmetric: ', isSymmetric);
  }
}