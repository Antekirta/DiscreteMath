const COLORS = {
  WHITE: 'white',
  GRAY: 'gray',
  BLACK: 'black'
};

export class DFS {
  /**
   * @private
   * @type {[]}
   */
  adjacencyMatrix = []

  /**
   * @private
   * @type {[]}
   */
  vertices = []

  /**
   * @private
   * @type {Array<number>}
   */
  visitedVertices = []

  /** @private
   * @type {Map<number,COLORS>}
  **/
  colorsMap = new Map();

  /**
   * @private
   * @type {Map<number, number>}
   */
  backTraceMap = new Map();

  trees = []

  /**
   * Init
   * @param {Array<Array<number>>} adjacencyMatrix
   */
  init(adjacencyMatrix, vertices) {
    this.adjacencyMatrix = adjacencyMatrix;

    if (vertices) {
      this.vertices = [...vertices];

      this.vertices.forEach(vertex => this.colorsMap.set(vertex, COLORS.WHITE))
    } else {
      this.vertices = Object.keys(this.adjacencyMatrix[0]).map(v => {
        const vertex = +v;

        // Отметим все вершины белым как непосещённые
        this.colorsMap.set(vertex, COLORS.WHITE);

        return vertex;
      });
    }
  }

  /**
   * @public
   * @return {{trees: [], order: Array<number>}}
   */
  runDFS() {
    this.search();

    return {
      order: this.visitedVertices,
      trees: this.trees
    }
  }

  search() {
    const unvisited = this.vertices.reverse().filter(v => this.isWhite(v));

    if (unvisited.length) {
      this.runDFSOnVertex(unvisited[0]);

      this.trees.push([...this.visitedVertices]);

      this.search();
    }

    // console.log('visitedVertices: ', this.visitedVertices);
  }

  /**
   * @private
   * Run DFS on particular vertex
   * @param {number} u - vertex to start from
   */
  runDFSOnVertex(u) {
    console.log('u: ', u);

    this.paint(u, COLORS.GRAY);

    const adjacentUnvisited = this.getUnvisitedAdjacentVertex(u);

    if (adjacentUnvisited) {
      this.backTraceMap.set(adjacentUnvisited, u);

      this.runDFSOnVertex(adjacentUnvisited);
    } else {
      this.paint(u, COLORS.BLACK);

      this.visitedVertices.push(u);

      if (this.backTraceMap.get(u) !== undefined) {
        this.runDFSOnVertex(this.backTraceMap.get(u));
      }
    }
  }

  /**
   * @private
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
   * @private
   * Paint vertex
   * @param {number} v - vertex
   * @param {COLORS} color
   */
  paint(v, color) {
    this.colorsMap.set(v, color);
  }

  /**
   * @private
   * Whether vertex has never been visited
   * @param {number} v
   */
  isWhite(v) {
    return this.colorsMap.get(v) === COLORS.WHITE;
  }
}
