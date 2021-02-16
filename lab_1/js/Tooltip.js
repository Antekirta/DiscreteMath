class Tooltip {
  #baseClass = 'tooltip';
  #$target;
  #$currentTooltip;
  #onOuterClickBound;

  constructor($target) {
    this.#$target = $target;

    this.#onOuterClickBound = this.onOuterClick.bind(this);
  }

  onOuterClick({target}) {
    const clickIsInside = target.classList.contains(this.#baseClass) || target.parentNode.classList.contains(this.#baseClass);

    if (!clickIsInside) {
      this.hide();
    }
  }

  /**
   * Show tooltip
   * @param {{
   *   title: string
   *   text: string
   * }} message
   * @param {number | null} timeout
   */
  show(message, timeout = null) {
    const { top, left } = this.#$target.getBoundingClientRect();
    const { offsetWidth } = this.#$target;

    const style = `
      position: absolute;
      top: ${top - 130}px;
      left: ${left + offsetWidth}px;
      z-index: 100;
      background: #fff;
      border: solid 1px #222;
      padding: 15px 10px 10px 10px;
      max-width: 350px;
      border-radius: 4px;
    `;

    const id = `tooltip-${Math.random()}`;

    const tooltip = `
      <div id="${id}" class="${this.#baseClass}" style="${style}">
        <header style="font-weight: bold;">${message.title}</header>
        
        <p>${message.text}</p>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', tooltip);

    this.#$currentTooltip = document.getElementById(id);

    if (timeout !== null) {
      setTimeout(() => {
        this.hide();
      }, timeout);
    }

    setTimeout(() => {
      document.body.addEventListener('click', this.#onOuterClickBound);
    }, 0);
  }

  hide() {
    document.body.removeEventListener('click', this.#onOuterClickBound);

    if (this.#$currentTooltip) {
      setTimeout(() => {
        this.#$currentTooltip.remove();
      }, 200)
      this.#$currentTooltip.style.transition = '.1s';
      this.#$currentTooltip.style.opacity = '0';
    }
  }
}