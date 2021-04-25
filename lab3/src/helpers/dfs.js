const COLORS = {
  WHITE: 'white',
  GRAY: 'gray',
  BLACK: 'black'
};

export class DFS {
  /** @private */
  adjacencyMatrix = []

  /** @private
   * Array<number>
   **/
  vertices = []

  /** @private
   * @type {Map<number,COLORS>}
  **/
  colorsMap = new Map();

  /**
   * @private
   * @type {Map<number, number>}
   */
  backTraceMap = new Map();

  /**
   * @param {Array<Array<number>>} adjacencyMatrix
   */
  constructor(adjacencyMatrix) {
    this.adjacencyMatrix = adjacencyMatrix;

    this.init();
  }

  init() {
    this.vertices = Object.keys(this.adjacencyMatrix[0]).map(v => {
      const vertex = +v;

      // Отметим все вершины белым как непосещённые
      this.colorsMap.set(vertex, COLORS.WHITE);

      return vertex;
    });
  }

  search() {
    const unvisited = this.vertices.filter(v => this.isWhite(v));

    if (unvisited.length) {
      this.runDFS(unvisited[0]);

      this.search();
    }
  }

  /**
   * Run DFS on particular vertex
   * @param {number} u - vertex to start from
   */
  runDFS(u) {
    console.log('u: ', u);
    this.paint(u, COLORS.GRAY);

    const adjacentUnvisited = this.getUnvisitedAdjacentVertex(u);

    if (adjacentUnvisited) {
      this.backTraceMap.set(adjacentUnvisited, u);

      this.runDFS(adjacentUnvisited);
    } else {
      this.paint(u, COLORS.BLACK);

      if (this.backTraceMap.get(u)) {
        this.runDFS(this.backTraceMap.get(u));
      }
    }
  }

  /**
   * Get adjacent unvisited vertex
   * @param {number} u - vertex
   * @return {number | null}
   */
  getUnvisitedAdjacentVertex(u) {
    let firstWhite = null;

    const adjacent = this.adjacencyMatrix[u];

    for (let v = 0; v < adjacent.length; v++) {
      if (adjacent[v] === 1 && this.isWhite(v)) {
        firstWhite = v;

        break;
      }
    }

    return firstWhite;
  }

  /**
   * Paint vertex
   * @param {number} v - vertex
   * @param {COLORS} color
   */
  paint(v, color) {
    this.colorsMap.set(v, color);
  }

  /**
   * Whether vertex has never been visited
   * @param {number} v
   */
  isWhite(v) {
    return this.colorsMap.get(v) === COLORS.WHITE;
  }
}
