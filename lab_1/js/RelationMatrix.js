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
  #cellSize = 40;
  #size;

  constructor() {
    this.#$root = document.querySelector(`.${this.#baseClass}`);
    this.#$matrix = document.querySelector(`.${this.#baseClass}__matrix`);
    this.#$features = document.querySelector(`.${this.#baseClass}__features`);

    this.#$isReflexiveFeature = document.querySelector(`.${this.#baseClass}__features--reflexivity`);
    this.#$isIrreflexiveFeature = document.querySelector(`.${this.#baseClass}__features--irreflexivity`);
    this.#$isSymmetricFeature = document.querySelector(`.${this.#baseClass}__features--symmetry`);
    this.#$isAntiSymmetricFeature = document.querySelector(`.${this.#baseClass}__features--antisymmetry`);
    this.#$isTransitiveFeature = document.querySelector(`.${this.#baseClass}__features--transitivity`);
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

    this.checkReflexivity();
    this.checkIrreflexivity();
    this.checkSymmetry();
    this.checkAntiSymmetry();
    this.checkTransitivity();
  }

  checkReflexivity() {
    const isReflexive = this.#set.every(elem => {
      return this.#relationMap.has(elem) && this.#relationMap.get(elem).includes(elem);
    });

    this.#$isReflexiveFeature.innerText = isReflexive
      ? 'рефлексивно'
      : 'не рефлексивно';

    console.log('isReflexive: ', isReflexive);
  }

  checkIrreflexivity() {
    const isIrreflexive = this.#set.every(elem => {
      return this.#relationMap.has(elem)
        ? !this.#relationMap.get(elem).includes(elem)
        : true;
    });

    this.#$isIrreflexiveFeature.innerText = isIrreflexive
      ? 'антирефлексивно'
      : 'не антирефлексивно';

    console.log('isIrreflexive: ', isIrreflexive);
  }

  checkSymmetry() {
    const isSymmetric = this.#set.every(elem => {
      return this.#relationMap.has(elem) && this.#relationMap.get(elem).every(innerElem => {
        return this.#relationMap.has(innerElem) && this.#relationMap.get(innerElem).includes(elem);
      })
    });

    this.#$isSymmetricFeature.innerText = isSymmetric
      ? 'симметрично'
      : 'не симметрично';

    console.log('isSymmetric: ', isSymmetric);
  }

  checkAntiSymmetry() {
    const isAntiSymmetric = this.#set.every(elem => {
      return this.#relationMap.has(elem) && this.#relationMap.get(elem).every(innerElem => {
        if (innerElem === elem) {
          return true;
        }

        return !this.#relationMap.has(innerElem) || !this.#relationMap.get(innerElem).includes(elem);
      })
    });

    this.#$isAntiSymmetricFeature.innerText = isAntiSymmetric
      ? 'антисимметрично'
      : 'не антисимметрично';

    console.log('isAntiSymmetric: ', isAntiSymmetric);
  }

  checkTransitivity() {
    const isTransitive = this.#set.every(elem => {
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

    this.#$isTransitiveFeature.innerText = isTransitive
      ? 'транзитивно'
      : 'не транзитивно';

    console.log('isTransitive: ', isTransitive);
  }
}