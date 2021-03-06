/**
 * Класс, представляющий множество
 */
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

  /**
   * Инициализируем ссылки на HTML элементы
   */
  initElements() {
    this.#$textarea = this.#$elem.querySelector(`.${this.baseClass}__textarea`);
    this.#$relation = this.#$elem.querySelector(`.${this.baseClass}__relation`);
    this.#$relationRows = this.#$elem.querySelector(`.${this.baseClass}__relation-rows`);
    this.#$addPairBtn = this.#$elem.querySelector(`.${this.baseClass}__add-pair`);
    this.#$cardinality = this.#$elem.querySelector(`.${this.baseClass}__cardinality`);
    this.#$createSetBtn = this.#$elem.querySelector(`.${this.baseClass}__create-set`);

    this.disableCreateBtn();
  }

  /**
   * Устанавливаем обработчики событий
   */
  setEventListeners() {
    // когда меняется содержимое текстового поля
    this.#$textarea.addEventListener('change', this.onSetChange.bind(this))
    // когда пользователь кликает кнопку "Добавить пару"
    this.#$addPairBtn.addEventListener('click', this.addPair.bind(this))
    // когда пользователь нажимает кнопку "Создать множество"
    this.#$createSetBtn.addEventListener('click', this.createSetAndRelation.bind(this))
  }

  /**
   * Создаем множество и показываем блко добавления пар
   */
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

  /**
   * Фильтруем содержимое текстового поля, преобразуем его в список элементов, сортируем
   * и высчитываем мощность получившегося множества
   */
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

  /**
   * Выводим мощность множества
   */
  renderCardinality() {
    this.#$cardinality.innerText = this.#set.length;
  }

  /**
   * Показываем блок добавления пар
   */
  showRelations() {
    this.#$relation.style.display = 'block';
  }

  /**
   * Скрываем блок добавления пар
   */
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

  /**
   * Добавляем поля, которые позволят пользователю добавить в отношение новую пару значений
   */
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

  /**
   * Валидируем ввод элементов пары
   * @param {HTMLElement} target
   */
  validatePairInput({target}) {
    if (!this.#set.includes(+target.value)) {
      target.value = '';

      target.setAttribute('title', 'Элемент пары должен принадлежать множеству!');

      target.classList.add('error');
    } else {
      target.removeAttribute('title');

      target.classList.remove('error');
    }
  }

  /**
   * Создаём отношение и уведомляем об этом остальные части приложения
   */
  createSetAndRelation() {
    this.#relationMap = new Map();

    const $rows = this.#$relationRows.querySelectorAll(`.${this.baseClass}__pair-row`);
    let $rowInputs, x, y;

    // Для каждого блока добавления пары в отношение...
    for (const $row of $rows) {
      // сохраняем два текстовых поля...
      $rowInputs = $row.querySelectorAll(`.${this.baseClass}__pair-input`);

      // берем их значения...
      [x, y] = Object.values($rowInputs).map(input => +input.value);

      // и добавляем их в отношение
      if (this.#relationMap.has(x)) {
        this.#relationMap.set(x, [...this.#relationMap.get(x), y])
      } else {
        this.#relationMap.set(x, [y]);
      }
    }

    const event = new Event('SET_HAS_BEEN_UPDATED');

    event.data = {
      set: this.#set,
      relationMap: this.#relationMap
    }

    document.dispatchEvent(event);
  }

  /**
   * Эта функция была необходима на этапе отладки, чтобы генерировать необходимые отношения
   * Удалять жалко
   */
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

    const event = new Event('SET_HAS_BEEN_UPDATED');

    event.data = {
      set: this.#set,
      relationMap: this.#relationMap
    }

    document.dispatchEvent(event);
  }

  /**
   * Удаляем пару из отношения
   * @param {HTMLElement} target
   */
  static removePair({target}) {
    const $row = target.parentNode;

    $row.parentNode.removeChild($row);
  }

  /**
   * Удаляем некорректные значения и дубликаты из списка элементов множества, введенных пользователем
   * @param {Array} rawElements
   * @return {Array}
   */
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

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}