class BaseSet {
  #$elem;
  #$textarea;
  #$relation;
  #$relationRows;
  #$addPairBtn;
  #$cardinality;
  #set = [];
  #relationMap = new Map();
  #pairIndex = 0;

  constructor($elem) {
    this.#$elem = $elem;
    this.baseClass = 'input-set-elements';

    this.initElements();

    this.hideRelations();

    this.setEventListeners();
  }

  initElements() {
    this.#$textarea = this.#$elem.querySelector(`.${this.baseClass}__textarea`);
    this.#$relation = this.#$elem.querySelector(`.${this.baseClass}__relation`);
    this.#$relationRows = this.#$elem.querySelector(`.${this.baseClass}__relation-rows`);
    this.#$addPairBtn = this.#$elem.querySelector(`.${this.baseClass}__add-pair`);
    this.#$cardinality = this.#$elem.querySelector(`.${this.baseClass}__cardinality`);
  }

  setEventListeners() {
    this.#$textarea.addEventListener('change', this.onSetChange.bind(this))
    this.#$addPairBtn.addEventListener('click', this.addRelationPair.bind(this))
  }

  onSetChange() {
    this.cleanSetElements();

    this.showRelations();
  }

  cleanSetElements() {
    const rawElements = this.#$textarea.value.replace(/\s+/g, ' ').split(' ');

    const setElements = rawElements
      .filter((elem, index) => {
        if (isNaN(elem)) {
          return false;
        }

        return !rawElements.slice(index + 1).includes(elem);
      })
      .map(elem => +elem);

    setElements.sort((a, b) => a < b ? -1 : 1);

    this.#set = [...setElements];

    this.#$cardinality.innerText = this.#set.length;

    this.#$textarea.value = this.#set.join(' ');
  }

  showRelations() {
    this.#$relation.style.display = 'block';
  }

  hideRelations() {
    this.#$relation.style.display = 'none';
  }

  addRelationPair() {
    const firstId = `pair_${this.#pairIndex}_1`;
    const secondId = `pair_${this.#pairIndex}_2`;
    const options = this.#set.reduce((acc, currentSetElem) => {
      return `
        ${acc}
        <option value="${currentSetElem}">${currentSetElem}</option>
      `;
    }, '')

    const row = `
      <div class="row mb-15" data-pair-index="${this.#pairIndex}">
            <div class="col">
              <input placeholder="Выберите элемент" list="${firstId}">
              <datalist id="${firstId}">
                ${options}
              </datalist>
            </div>

            <div class="col">
              <input placeholder="Выберите элемент" list="${secondId}">
              <datalist id="${secondId}">
                ${options}
              </datalist>
            </div>
          </div>
    `;

    this.#$relationRows.insertAdjacentHTML('beforeend', row);

    this.#pairIndex++;
  }
}