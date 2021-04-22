<template>
  <div class="graph-builder">
    <h3 class="graph-builder__title">
      Граф
    </h3>

    <br>

    <svg
      version="1.1"
      baseProfile="full"
      :width="300"
      :height="300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        v-for="vertex in vertices"
        :key="vertex.id"
        :cx="getVertexCx(vertex.id)"
        :cy="getVertexCy(vertex.id)"
        r="10"
        stroke="red"
        stroke-width="2"
        fill="red"
      />
    </svg>
  </div>
</template>

<script>
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
      edges: []
     }
  },
  computed: {
    vertices() {
      return this.adjacencyMatrix.map((_, index) => ({
        id: index,
        color: 'white'
      }));
    }
  },
  methods: {
    getVertexCx(id) {
      return 20 * id + 20;
    },
    getVertexCy(id) {
      return 20 * id + 20;
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