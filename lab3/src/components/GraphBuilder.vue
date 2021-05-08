<template>
  <div class="graph-builder">
    <p>Компоненты сильной связности: </p>
    
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

    <p v-else>
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
   drawGraph() {
     const canvas = window.$('#canvas')[0];

     const context = canvas.getContext('2d');

     context.clearRect(0, 0, canvas.width, canvas.height);

     if (this.adjacencyMatrix.length <= 10) {
       this.isVisible = true;

       /* eslint-disable */
       const graph = new Springy.Graph();

       const nodes = this.adjacencyMatrix.map((_, key) =>  graph.newNode({label: key}));

       this.adjacencyMatrix.forEach((row, u) => {
         row.forEach((hasEdge, v) => {
           if (hasEdge === 1) {
             graph.newEdge(nodes[u], nodes[v]);
           }
         });
       });

       window.$('#canvas').springy({ graph });
       /* eslint-disable */
     } else {
       this.isVisible = false;
     }
    },
    run() {
      const kosaraju = new Kosaraju(this.adjacencyMatrix);

      this.trees = kosaraju.getStronglyConnectedComponents();
    }
  }
}
</script>

<style lang="scss">
.graph-builder {
  &__title {
    display: inline-block;
    border-bottom: 2px #222 solid;
  }

  min-width: 60vw;
}
</style>