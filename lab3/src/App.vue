<template>
  <div
    id="app"
    class="app"
  >
    <header class="app__title">
      <h1>Лабораторная работа №3</h1>

      <h2>
        Поиск компонент связности графа
        <a
          target="_blank"
          href="https://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%9A%D0%BE%D1%81%D0%B0%D1%80%D0%B0%D0%B9%D1%8E"
        >алгоритмом Косарайю</a>
      </h2>
    </header>

    <div class="row">
      <adjacency-matrix v-model="adjacencyMatrix" />

      <graph-builder
        v-if="adjacencyMatrix"
        :adjacency-matrix="adjacencyMatrix"
        style="margin-left: 50px"
      />
    </div>
  </div>
</template>

<script>
import AdjacencyMatrix from "@/components/AdjacencyMatrix";
import GraphBuilder from "@/components/GraphBuilder";

export default {
  name: 'App',
  components: {
    AdjacencyMatrix,
    GraphBuilder
  },
  data() {
    return {
      adjacencyMatrix: null
    }
  }
}
</script>

<style lang="scss">
.app {
  text-align: left;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px;

  &__title {
    margin-bottom: 50px;
  }
}
</style>

<style>
.row {
  display: flex;
  flex-wrap: wrap;
}
</style>
