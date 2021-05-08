import { DFS } from "@/helpers/dfs";

/**
 * Реализация алгоритма Косарайю
 */
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
   * Вернём список (списков) вершин, представляющих собой сильно связные компоненты графа
   * @return {Array<Array<number>>}
   */
  getStronglyConnectedComponents() {
    // Сперва запускаем список в глубину на исходном графе
    // порядок обхода будет определён автоматически, поэтому второй аргумент не передаем
    this.dfs.init(this.adjacencyMatrix, null);

    // сейчас нам интересует только список вершин - то есть порядок, в котором будут обходиться вершины
    // на второй итерации DFS
    const { order } = this.dfs.runDFS();

    // теперь запустим поиск в глубину на инвертированном графе
    this.dfs.init(this.invertGraph(), order);

    // полученные деревья и являются компонентами сильной связности
    const { trees } = this.dfs.runDFS();

    return trees;
  }

  /**
   * Инвертируем орграф, то есть обратим направление каждого его ребра
   * На матрице смежности нужный эффект обеспечивается её транспонированием
   * @return {Array<Array<number>>}
   */
  invertGraph() {
    const invertedMatrix = this.adjacencyMatrix.map(row => row.map(() => 0));

    this.adjacencyMatrix.forEach((row, rowIndex) => {
      row.forEach((hasEdge, v) => {
        if (hasEdge) {
          invertedMatrix[rowIndex][v] = 0;

          invertedMatrix[v][rowIndex] = 1;
        }
      })
    });

    return invertedMatrix;
  }

  /**
   * Служебная функция для вывода отладочной информации о матрице смежности
   * @param matrix
   */
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