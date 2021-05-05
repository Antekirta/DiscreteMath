import { DFS } from "@/helpers/dfs";

export class Kosaraju {
  /**
   * @private
   * @type {Array<Array<number>>}
   */
  adjacencyMatrix = []

  constructor(adjacencyMatrix) {
    this.adjacencyMatrix = adjacencyMatrix;

    this.dfs = new DFS();
  }

  /**
   * Get strongly connected components
   * @return {Array<Array<number>>}
   */
  getStronglyConnectedComponents() {
    this.dfs.init(this.adjacencyMatrix);

    const { order } = this.dfs.runDFS();

    this.dfs.init(this.invertGraph(), order);

    const { trees } = this.dfs.runDFS();

    return trees;
  }

  /**
   * Get inverted orgraph
   * @return {Array<Array<number>>}
   */
  invertGraph() {
    const invertedMatrix = this.adjacencyMatrix.map(row => row.map(() => 0));

    this.adjacencyMatrix.forEach((row, rowIndex) => {
      row.forEach((hasEdge, v) => {
        if (hasEdge === 1) {
          invertedMatrix[rowIndex][v] = 0;

          invertedMatrix[v][rowIndex] = 1;
        }
      })
    });

    return invertedMatrix;
  }

  renderMatrix(matrix) {
    matrix.forEach((row) => {
      let str = '';
      row.forEach((hasEdge) => {
        str += ` ${hasEdge}`;
      })
      console.log(`${str}\n`)
    });
  }
}