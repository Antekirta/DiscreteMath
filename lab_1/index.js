'use strict';

const $inputSetElements = document.getElementById('input-set-elements');

const relationMatrix = new RelationMatrix();
new BaseSet($inputSetElements);

document.addEventListener('SET_HAS_BEEN_UPDATED', (event) => {
  const { data: { set, relationMap } } = event;

  relationMatrix.init(set, relationMap);
});
