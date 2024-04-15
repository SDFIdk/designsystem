/** Web component to render table data with filter and sort features */
export class DSDataTable extends HTMLElement {

  #tableHeaders = []
  #tableBody = []
  #tableBodyFiltered = []

  set data(payload) {
    this.#tableHeaders = payload.headers
    this.#tableBody = payload.body  
    this.#tableBodyFiltered = payload.body
    this.render()
  }

  constructor() {
    super()
  }

  connectedCallback() {
    this.className = 'ds-data-table'
  }

  render() {
    this.innerHTML = ''

    this.append(this.renderFilterInput())

    const tableElement = document.createElement('table')
    tableElement.innerHTML = '<thead></thead><tbody></tbody>' 
    this.append(tableElement)

    this.renderHeader()
    this.renderBody()
  }

  renderFilterInput() {
    const filterElement = document.createElement('input')
    filterElement.type = 'search'
    filterElement.style.width = 'auto'
    filterElement.addEventListener('input', this.filterDataHandler.bind(this))
    return filterElement
  }

  renderHeader() {
    const tableHead = this.querySelector('thead')
    const tableHeaderRow = document.createElement('tr')
    this.#tableHeaders.forEach((header, index) => {
      tableHeaderRow.append(this.renderHeaderCell(header, index))
    })
    tableHead.append(tableHeaderRow)
  }

  renderHeaderCell(data, index) {
    const headerElement = document.createElement('th')
    headerElement.dataset.index = index
    if (typeof data === 'object') {
      if (data.type === 'number') {
        headerElement.style.textAlign = 'right'
      }
      if (!data.sortable) {
        headerElement.innerText = data.value
      } else {
        headerElement.innerHTML = this.renderSortButtons(data.value)
        headerElement.querySelector('button').addEventListener('click', this.sortHandler.bind(this))
      }
    } else {
      headerElement.innerHTML = this.renderSortButtons(data)
      headerElement.querySelector('button').addEventListener('click', this.sortHandler.bind(this))
    }
    return headerElement
  }

  renderSortButtons(title) {
    return `
      <button class="quiet button-sort">
        <svg class="icon-sort-ascend" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Sortér stigende</title>
          <path d="M6 14L12 8L18 14" stroke="var(--ds-icon-color, black)" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
        </svg>
        <svg class="icon-sort-descend" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Sortér faldende</title>
          <path d="M6 10L12 16L18 10" stroke="var(--ds-icon-color, black)" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
        </svg>
        ${ title }
      </button>
    `
  }

  renderBody() {
    const tableBody = this.querySelector('tbody')
    tableBody.innerHTML = ''
    this.#tableBodyFiltered.forEach((rowData) => {
      tableBody.append(this.renderCells(rowData))  
    })
  }

  renderCells(rowData) {
    const rowElement = document.createElement('tr')
    rowData.forEach((cellData) => {
      rowElement.append(this.renderCell(cellData))
    })
    return rowElement
  }

  renderCell(data) {
    const cellElement = document.createElement('td')
    if (typeof data === 'string') {

      cellElement.innerHTML = data
    
    } else if (typeof data === 'number') {
      
      cellElement.innerText = data
      cellElement.style.textAlign = 'right'

    } else if (typeof data === 'object') {

      if (data.type === 'number') {
        cellElement.style.textAlign = 'right'
      }

      if (data.editable && data.type === 'number') {
        cellElement.innerHTML = `<input type="number" value="${ data.value }" style="text-align: right; width: 100%;">`
      } else if (data.editable && data.type === 'string') {
        cellElement.innerHTML = `<input type="text" value="${ data.value }">`
      } else {
        cellElement.innerHTML = data.value
      }

      if (data.editCallback) {
        cellElement.querySelector('input').addEventListener('input', data.editCallback)
      }
      
    }
    return cellElement
  }

  filterDataHandler(event) {
    if (event.target.value === '' || !event.target.value) {
      this.#tableBodyFiltered = this.#tableBody  
    } else {
      this.#tableBodyFiltered = this.filterData(this.#tableBody, event.target.value)
    }
    this.renderBody()
  }

  filterData(data, query) {    
    return data.filter((dataRow) => {
      let match = false
      dataRow.forEach((cell) => {
        if (cell.toString().includes(query)) {
          match = true
        }
      })
      return match
    })
  }

  sortHandler(event) {
    let target = event.target
    if (event.target.tagName === 'SVG') {
      target = event.target.parentElement
    }
    target.classList.toggle('asc')
    const sortMode = target.className.includes('asc')
    const targetIndex = target.parentElement.dataset.index
    this.#tableBodyFiltered = this.sortData(this.#tableBodyFiltered, targetIndex, sortMode)
    this.renderBody()
  }

  sortData(data, columnIndex, direction) {
    return data.sort((a,b) => {
      let xVal, yVal
      if (direction) {
        xVal = a[columnIndex].value ? a[columnIndex].value : a[columnIndex]
        yVal = b[columnIndex].value ? b[columnIndex].value : b[columnIndex]
      } else {
        yVal = a[columnIndex].value ? a[columnIndex].value : a[columnIndex]
        xVal = b[columnIndex].value ? b[columnIndex].value : b[columnIndex] 
      }
      if (xVal > yVal) {
        return 1
      } else if (xVal > yVal) {
        return -1
      } else {
        return 0
      }
    })
  }

}