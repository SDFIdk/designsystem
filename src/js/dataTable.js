export class DSDataTable extends HTMLElement {

  #tableHeaders = []
  #tableBody = []
  #tableBodyFiltered = []

  set data(payload) {
    this.#tableHeaders = payload.headers
    this.#tableBody = payload.body  
    this.#tableBodyFiltered = payload.body
    this.#render()
  }

  constructor() {
    super()
  }

  connectedCallback() {
    this.#setupListeners()
  }

  #render() {

    this.innerHTML = ''

    const filterElement = document.createElement('input')
    filterElement.type = 'search'
    filterElement.style.width = '10rem'

    const tableElement = document.createElement('table')
    tableElement.innerHTML = '<thead></thead><tbody></tbody>' 
    
    tableElement.querySelector('thead').append(this.#renderHeader())
    
    this.append(filterElement)
    this.append(tableElement)

    this.#renderBody()
  }

  #renderHeader() {
    const tableHeaderRow = document.createElement('tr')
    this.#tableHeaders.forEach((header) => {
      const tableHeaderCell = document.createElement('th')
      tableHeaderCell.innerText = header
      tableHeaderRow.append(tableHeaderCell)
    })
    return tableHeaderRow
  }

  #renderBody() {
    const tableBody = this.querySelector('tbody')
    tableBody.innerHTML = ''
    this.#tableBodyFiltered.forEach((rowData) => {
      tableBody.append(this.#renderCells(rowData))  
    })
  }

  #renderCells(rowData) {
    const rowElement = document.createElement('tr')
    rowData.forEach((cellData) => {
      const tableBodyCell = document.createElement('td')
      tableBodyCell.innerText = cellData
      rowElement.append(tableBodyCell)
    })
    return rowElement
  }

  #setupListeners() {
    this.addEventListener('input', (event) => {
      console.log('changed search', event.target.value)
      if (event.target.value === '' || !event.target.value) {
        this.#tableBodyFiltered = this.#tableBody  
      } else {
        this.#tableBodyFiltered = this.#filterData(this.#tableBody, event.target.value)
      }
      this.#renderBody()
    })
  }

  #filterData(data, query) {
    return data.filter((dataRow) => {
      console.log('check row')
      let gotHit = false
      dataRow.forEach((cell) => {
        if (cell.toString().includes(query)) {
          gotHit = true
        }
      })
      return gotHit
    })
  }

}