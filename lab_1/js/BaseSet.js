function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class BaseSet {
  #$elem;
  #$textarea;
  #$relation;
  #$relationRows;
  #$addPairBtn;
  #$cardinality;
  #$createSetBtn;
  #set = [];
  #relationMap = new Map();
  #currentPairIndex = 0;
  #onPairInputChange;

  constructor($elem) {
    this.#$elem = $elem;
    this.baseClass = 'input-set-elements';

    this.initElements();

    this.hideRelations();

    this.setEventListeners();

    this.#onPairInputChange = this.validatePairInput.bind(this);
  }

  initElements() {
    this.#$textarea = this.#$elem.querySelector(`.${this.baseClass}__textarea`);
    this.#$relation = this.#$elem.querySelector(`.${this.baseClass}__relation`);
    this.#$relationRows = this.#$elem.querySelector(`.${this.baseClass}__relation-rows`);
    this.#$addPairBtn = this.#$elem.querySelector(`.${this.baseClass}__add-pair`);
    this.#$cardinality = this.#$elem.querySelector(`.${this.baseClass}__cardinality`);
    this.#$createSetBtn = this.#$elem.querySelector(`.${this.baseClass}__create-set`);

    this.disableCreateBtn();
  }

  setEventListeners() {
    this.#$textarea.addEventListener('change', this.onSetChange.bind(this))
    this.#$addPairBtn.addEventListener('click', this.addPair.bind(this))
    this.#$createSetBtn.addEventListener('click', this.generateRandomRelation.bind(this))
  }

  onSetChange() {
    this.buildSet();

    if (this.#set.length) {
      this.enableCreateBtn();

      this.showRelations();
    } else {
      this.disableCreateBtn();

      this.hideRelations();
    }
  }

  buildSet() {
    const textAreaValue = this.#$textarea.value;

    const rawElements = textAreaValue
      ? textAreaValue.replace(/\s+/g, ' ').split(' ')
      : [];

    const setElements = BaseSet.filterSetElements(rawElements);

    setElements.sort((a, b) => a < b ? -1 : 1);

    this.#set = [...setElements];

    this.#$textarea.value = this.#set.join(' ');

    this.renderCardinality();
  }

  renderCardinality() {
    this.#$cardinality.innerText = this.#set.length;
  }

  showRelations() {
    this.#$relation.style.display = 'block';
  }

  hideRelations() {
    this.#$relation.style.display = 'none';

    this.#$relationRows.innerHTML = null;
  }

  enableCreateBtn() {
    this.#$createSetBtn.disabled = false;
  }

  disableCreateBtn() {
    this.#$createSetBtn.disabled = true;
  }

  addPair() {
    const firstId = `pair_${this.#currentPairIndex}_1`;
    const secondId = `pair_${this.#currentPairIndex}_2`;
    const options = this.#set.reduce((acc, currentSetElem) => {
      return `
        ${acc}
        <option value="${currentSetElem}">${currentSetElem}</option>
      `;
    }, '')

    const row = `
      <div class="${this.baseClass}__pair-row row mb-15" data-pair-index="${this.#currentPairIndex}">
            <div class="col">
              <input class="${this.baseClass}__pair-input" placeholder="Выберите элемент" list="${firstId}">
              <datalist id="${firstId}">
                ${options}
              </datalist>
            </div>

            <div class="col">
              <input class="${this.baseClass}__pair-input" placeholder="Выберите элемент" list="${secondId}">
              <datalist id="${secondId}">
                ${options}
              </datalist>
            </div>
            
            <div class="${this.baseClass}__remove-pair col"
             data-index-to-remove="${this.#currentPairIndex}"
             title="Удалить пару">&#128465;</div>
          </div>
    `;

    this.#$relationRows.insertAdjacentHTML('beforeend', row);

    const $removeBtns = this.#$relationRows.querySelectorAll(`.${this.baseClass}__remove-pair`);

    for (const $removeBtn of $removeBtns) {
      $removeBtn.removeEventListener('click', BaseSet.removePair)
      $removeBtn.addEventListener('click', BaseSet.removePair)
    }

    const $pairInputs = this.#$relationRows.querySelectorAll(`.${this.baseClass}__pair-input`)

    for (const $pairInput of $pairInputs) {
      $pairInput.removeEventListener('change', this.#onPairInputChange);
      $pairInput.addEventListener('change', this.#onPairInputChange);
    }

    this.#currentPairIndex++;
  }

  validatePairInput({target}) {
    if (!this.#set.includes(+target.value)) {
      console.log('Error!');
      target.value = '';

      target.setAttribute('title', 'Элемент пары должен принадлежать множеству!');

      target.classList.add('error');
    } else {
      target.removeAttribute('title');

      target.classList.remove('error');
    }
  }

  createSetAndRelation() {
    this.#relationMap = new Map();

    const $rows = this.#$relationRows.querySelectorAll(`.${this.baseClass}__pair-row`);
    let $rowInputs, x, y;

    for (const $row of $rows) {
      $rowInputs = $row.querySelectorAll(`.${this.baseClass}__pair-input`);

      [x, y] = Object.values($rowInputs).map(input => +input.value);

      if (this.#relationMap.has(x)) {
        this.#relationMap.set(x, [...this.#relationMap.get(x), y])
      } else {
        this.#relationMap.set(x, [y]);
      }
    }

    document.dispatchEvent(new Event('SET_HAS_BEEN_UPDATED'));

    console.log('this.#relationMap: ', this.#relationMap);
  }

  generateRandomRelation() {
    this.#relationMap = new Map();

    let x, y;

    for (let i = 0; i < this.#set.length; i++) {
      [x, y] = [this.#set[getRandomInt(this.#set.length)], this.#set[getRandomInt(this.#set.length)]];

      if (this.#relationMap.has(x)) {
        this.#relationMap.set(x, [...this.#relationMap.get(x), y])
      } else {
        this.#relationMap.set(x, [y]);
      }
    }

    document.dispatchEvent(new Event('SET_HAS_BEEN_UPDATED'));

    console.log('this.#relationMap: ', this.#relationMap);
  }

  static removePair({target}) {
    const $row = target.parentNode;

    $row.parentNode.removeChild($row);
  }

  static filterSetElements(rawElements) {
    return rawElements
      .filter((elem, index) => {
        if (isNaN(elem)) {
          return false;
        }

        return !rawElements.slice(index + 1).includes(elem);
      })
      .map(elem => +elem);
  }
}