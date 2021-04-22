<template>
  <div class="adjacency-matrix">
    <h3 class="adjacency-matrix__title">Матрица смежности</h3>

    <br>

    <label>
      Количество вершин:  <input v-model="rowsNumber" type="number" style="width: 50px">
    </label>

    <div class="adjacency-matrix__matrix">
      <div v-for="(row, i) in cells" :key="i" class="adjacency-matrix__row">
        <input v-model.number="cells[i][j]" v-for="(cell, j) in row" :key="j" type="text" class="adjacency-matrix__input">
      </div>
    </div>

    <button class="adjacency-matrix__btn" type="button" @click="generateRandomMatrix">Сгенерировать матрицу смежности</button>
  </div>
</template>

<script>
export default {
  name: 'AdjacencyMatrix',
  data() {
    return {
      rowsNumber: 5,
      /** @type {Array<Array<number>>} */
      cells: []
    }
  },
  methods: {
    generateRandomMatrix() {
      const cells = [];

      for (let i = 0; i < this.rowsNumber; i++) {
        const row = [];

        for (let j = 0; j < this.rowsNumber; j++) {
          row.push(Math.random() < 0.5 ? 0 : 1);
        }

        cells.push([...row]);
      }

      this.cells = [...cells];

      this.$emit('input', this.cells)
    }
  }
}
</script>

<style lang="scss">
.adjacency-matrix {
  text-align: left;

  &__title {
    display: inline-block;
    border-bottom: 2px #222 solid;
  }

  &__matrix {
    margin-top: 15px;
  }

  &__input {
    width: 30px;
    margin: 2px;
  }

  &__btn {
    margin-top: 15px;
  }
}
</style>