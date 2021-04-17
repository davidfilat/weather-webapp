class Table {
  #columnHeaderTemplate = (content) => `<th>${content}</th>`;
  #rowCellTemplate = (content) => `<td>${content}</td>`;
  #rowTemplate = (content) => `<tr>${content}</tr>`;
  #tableContentTemplate = (content) => `<table>${content}</table>`;
  constructor({ header, rows = [] }) {
    this.header = header;
    this.rows = rows;
  }
  #buildHeader() {
    let htmlString = '';
    this.header.forEach(
      (columnName) => (htmlString += this.#columnHeaderTemplate(columnName))
    );
    return this.#rowTemplate(htmlString);
  }

  #buildRow(row) {
    let rowString = '';
    row.forEach(
      (cellContent) => (rowString += this.#rowCellTemplate(cellContent))
    );
    return this.#rowTemplate(rowString);
  }

  #buildContentRows() {
    let htmlString = '';
    this.rows.forEach((row) => (htmlString += this.#buildRow(row)));
    return htmlString;
  }
  push(row) {
    this.rows.push(row);
  }
  toHTMLString() {
    const htmlString = this.#buildHeader() + this.#buildContentRows();
    return this.#tableContentTemplate(htmlString);
  }
}
