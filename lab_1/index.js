'use strict';

const $inputSetElements = document.getElementById('input-set-elements');

document.addEventListener('SET_HAS_BEEN_UPDATED', (event) => {
  console.log('SET_HAS_BEEN_UPDATED!!!', event);
})

const baseSet = new BaseSet($inputSetElements);
