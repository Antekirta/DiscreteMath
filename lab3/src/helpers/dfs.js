const COLORS = {
  WHITE: 'white',
  GRAY: 'gray',
  BLACK: 'black'
};

export class DFS {
  /** @private */
  adjacencyMatrix = []
  /** @private */
  blackVertices = [];
  counter = 0;
  /** @private */
  trees = [];
  /** @private
   * @type {Map<number,COLORS>}
   * */
  colorsMap = new Map();

  /**
   * @param {Array<Array<number>>} adjacencyMatrix
   */
  constructor(adjacencyMatrix) {
    this.adjacencyMatrix = adjacencyMatrix;

    this.init();
  }

  init() {
    // Отметим все вершины белым как непосещённые
    for (let v = 0; v < this.adjacencyMatrix.length; v++) {
      this.colorsMap.set(v, COLORS.WHITE);
    }
  }

  search() {
    // Обходим все вершины
    for (let v = 0; v < this.adjacencyMatrix.length; v++) {
      // если вершина еще не была посещена
      if (this.colorsMap.get(v) === COLORS.WHITE) {
        // и осуществляем поиск в глубину на соседях этой вершины
        this.searchOnComponent(v, null);
      }
    }

    console.log(this.blackVertices);
  }

  searchOnComponent(u) {
    if (this.colorsMap.get(u) === COLORS.WHITE) {
      this.counter++;

      this.colorsMap.set(u, COLORS.GRAY);
    }

      // отбираем смежные u и еще не посещенные вершины
      const unvisitedAdjacent = this.adjacencyMatrix[u]
        .filter(v =>  v === 1 && this.colorsMap.get(v) === COLORS.WHITE);

      // и осуществляем на каждой из них поиск в глубину
      unvisitedAdjacent.forEach(w => this.searchOnComponent(w, u));

      this.counter++;

      this.colorsMap.set(u, COLORS.BLACK);

      this.blackVertices.push(u);
  }

  // searchOnComponent(u, parent) {
  //   // помечаем вершину u как посещенную
  //   this.colorsMap.set(u, COLORS.GRAY);
  //
  //   this.counter++;
  //
  //   // отбираем смежные u и еще не посещенные вершины
  //   const unvisitedAdjacent = this.adjacencyMatrix[u]
  //     .filter(v =>  v === 1 && this.colorsMap.get(v) === COLORS.WHITE);
  //
  //   unvisitedAdjacent.forEach(w => {
  //     // и осуществляем на каждой из них поиск в глубину
  //     this.searchOnComponent(w, u);
  //   });
  //
  //   this.colorsMap.set(u, COLORS.BLACK);
  //
  //   if (parent !== null) {
  //     debugger
  //     this.colorsMap.set(u, COLORS.BLACK);
  //
  //     this.counter++;
  //
  //     this.searchOnComponent(parent, null);
  //   }
  //
  //   // // среди всех вершин графа...
  //   // this.adjacencyMatrix[u]
  //   //   // отбираем смежные u и еще не посещенные...
  //   //   .filter(v =>  v === 1 && this.colorsMap.get(v) === COLORS.WHITE)
  //   //
  //
  //   // больше работать с этой вершиной мы не будем...
  //
  //
  //   // так что добавим ее в спи
  //   // this.vertices.push(u);
  // }
}
