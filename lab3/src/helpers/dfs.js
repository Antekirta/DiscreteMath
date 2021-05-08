import diff from 'lodash/difference';

const COLORS = {
  WHITE: 'white',
  GRAY: 'gray'
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
  previouslyVisitedVertices = []

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
   * Инициализируем матрицу смежности, очищаем список DFS деревье и посещенных вершин,
   * инициализируем массив вершин
   * @param {Array<Array<number>>} adjacencyMatrix
   * @param {Array<number>} vertices
   */
  init(adjacencyMatrix, vertices) {
    this.adjacencyMatrix = adjacencyMatrix;

    this.trees = [];
    this.visitedVertices = [];
    this.previouslyVisitedVertices = [];

    // Если массив вершин уже предоставлен (в случае второго запуска DFS)
    if (vertices) {
      this.vertices = [...vertices].reverse();

      // Отметим все вершины белым как непосещённые
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
   * Запустим поиск в глубину на графе
   * Функция вернёт порядок выхода из вершин графа, а также деревья
   * @public
   * @return {{trees: [], order: Array<number>}}
   */
  runDFS() {
    this.search();

    return {
      order: this.visitedVertices,
      trees: [...this.trees]
    }
  }

  /**
   * Запустим поиск в глубина на первой непосещенной вершине графа
   * Функция будет вызывать сама себя до тех пор, пока не останется непосещенных вершин
   */
  search() {
    // собираем массив смежных вершин...
    const unvisited = this.vertices.filter(v => this.isWhite(v));

    if (unvisited.length) {
      // и на первой из непосещенных запускаем на ней DFS
      this.runDFSOnVertex(unvisited[0]);

      // обновляем список деревьев
      this.trees.push( diff([...this.visitedVertices], [...this.previouslyVisitedVertices]));

      // сохраняем список посещенных вершин с тем, чтобы не включать их в список будущих деревьев
      this.previouslyVisitedVertices = [...this.visitedVertices];

      // возможно, еще остались непосещенные вершины, снова запускаем поиск
      this.search();
    }
  }

  /**
   * Запускаем поиск в глубину на конкретной вершине
   * @private
   * @param {number} u - vertex to start from
   */
  runDFSOnVertex(u) {
    // помечаем вершину как посещенную
    this.paint(u, COLORS.GRAY);

    // берем первую непосещенную вершину
    const adjacentUnvisited = this.getUnvisitedAdjacentVertex(u);

    if (adjacentUnvisited) { // если такая имеется...
      // добавляем текущую вершину в качестве родителя для вершины, на которой мы сейчас снова запустим DFS
      this.backTraceMap.set(adjacentUnvisited, u);

      // запускаем поиск на еще не посещенной смежной вершине
      this.runDFSOnVertex(adjacentUnvisited);
    } else { // иначе...
      // добавляем вершину в список посещенных
      this.visitedVertices.push(u);

      // если имеется родитель
      if (this.backTraceMap.get(u) !== undefined) {
        // снова запускаем поиск на нем - а в эту вершину мы уже больше не вернемся
        this.runDFSOnVertex(this.backTraceMap.get(u));
      }
    }
  }

  /**
   * Получим первую смежную непосещенную вершину
   * @private
   * @param {number} u - vertex
   * @return {number | null}
   */
  getUnvisitedAdjacentVertex(u) {
    let firstWhite = null;

    const adjacent = this.adjacencyMatrix[u];

    // идём по списку всех вершин...
    for (let v = 0; v < adjacent.length; v++) {
      // если существует ребро...
      if (adjacent[v] === 1 && this.isWhite(v)) {
        firstWhite = v;

        // немедленно покидаем цикл, нет смысла доводить его до конца
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
