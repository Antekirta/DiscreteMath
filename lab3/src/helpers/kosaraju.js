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
    // inverted
    this.dfs.init([
      [0,0,1,0,0,0],
      [1,0,0,0,0,0],
      [0,1,0,0,0,0],
      [1,0,0,0,0,0],
      [0,1,0,1,0,0],
      [0,0,1,0,1,0]
    ]);

    const { order } = this.dfs.runDFS();

    console.log('order: ', order);

    // initial
    this.dfs.init([
      [0,1,0,1,0,0],
      [0,0,1,0,1,0],
      [1,0,0,0,0,0],
      [0,0,0,0,1,0],
      [0,0,0,0,0,1],
      [0,0,1,0,0,0],
    ], order);

    const { trees } = this.dfs.runDFS();

    // console.log('order: ', order)
    console.log('trees: ', trees)

    return [
      [],
      []
    ];
  }

  /**
   * Get inverted orgraph
   * @return {Array<Array<number>>}
   */
  invertGraph() {
    const invertedMatrix = [...this.adjacencyMatrix];

    this.adjacencyMatrix.forEach((row, rowIndex) => {
      row.forEach((hasEdge, v) => {
        if (hasEdge === 1) {
          invertedMatrix[rowIndex][v] = 0;

          invertedMatrix[v][rowIndex] = 1;
        }
      })
    });

    console.log('invertedMatrix: ', invertedMatrix)

    return invertedMatrix;
  }
}