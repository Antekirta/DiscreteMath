<!--
 Компонент для рендера графа и вывода его сильно связаных компонент
 -->
<template>
  <div class="graph-builder">
    <p><b>Компоненты сильной связности:</b></p>
    
    <section v-if="trees">
      <p
        v-for="(tree, i) in trees"
        :key="i"
      >
        {{ tree }}
      </p>
    </section>
    
    <canvas
      v-if="isVisible"
      id="canvas"
      width="1000"
      height="1000"
    />

    <p v-if="!isVisible">
      Рендеринг графом с числом вершин более десяти не поддерживается.
    </p>
  </div>
</template>

<script>

import { Kosaraju } from "@/helpers/kosaraju";
import 'springy/springyui';

export default {
  name: 'GraphBuilder',
  props: {
    /** @type {Array<Array<number>>} */
    adjacencyMatrix: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isVisible: true,
      trees: null
    }
  },
  watch: {
    adjacencyMatrix() {
      this.run();

      this.drawGraph();
    }
  },
  mounted() {
    this.run();

    this.drawGraph();
  },
  methods: {
   /**
    * Для рендеринга графа мы используем сторонню библиотеку, но для ее использования нужно представить граф в виде
    * набора вершин и ребер как отдельных объектов. Мы создадим этот набор сами на основе матрицы смежности.
    */
   async drawGraph() {
     const canvas = window.$('#canvas')[0];

     if (canvas) {
       const context = canvas.getContext('2d');

       context.clearRect(0, 0, canvas.width, canvas.height);

       await this.$nextTick();
     }

     if (this.adjacencyMatrix.length <= 10) {
       this.isVisible = true;

       await this.$nextTick();

       /* eslint-disable */
       const graph = new Springy.Graph();

       const nodes = this.adjacencyMatrix.map((_, key) =>  graph.newNode({label: key}));

       this.adjacencyMatrix.forEach((row, u) => {
         row.forEach((hasEdge, v) => {
           if (hasEdge) {
             graph.newEdge(nodes[u], nodes[v]);
           }
         });
       });

       window.$('#canvas').springy({ graph });
       /* eslint-disable */
     } else {
       this.isVisible = false;

       this.$forceUpdate();
     }
    },
    run() {
      const kosaraju = new Kosaraju(this.adjacencyMatrix);

      this.trees = [...kosaraju.getStronglyConnectedComponents()];
    }
  }
}
</script>

<style lang="scss">
.graph-builder {
  pointer-events: none;

  &__title {
    display: inline-block;
    border-bottom: 2px #222 solid;
  }

  min-width: 60vw;
}
</style>