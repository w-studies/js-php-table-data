const form = document.querySelector('form')

const booksTable = document.querySelector('table')

const databaseBooks = []

/**
 * FORM DATA TO JSON
 * @param {*} form
 * @returns
 */
const formDataToJson = (form) => {
  const jsonObj = {
    id: Math.random().toString(16).slice(2)
  }
  const formData = new FormData(form)

  for (const [key, value] of formData) {
    jsonObj[key] = value
  }

  return jsonObj
}

const generateTableRows = (data) => {
  for (const index in data) {
    const bookData = data[index]

    const row = booksTable.querySelector('tbody').insertRow(index)

    // define a ordem dos dados
    const cells = ['id', 'livro', 'edicao', 'autor']

    for (const key in cells) {
      row.insertCell(key).innerHTML = bookData[cells[key]]
    }

    row.insertCell().innerHTML = `<button class='remove-btn' onclick='editBook("${bookData.id}")'>Editar</button>`

    row.insertCell().innerHTML = `<button class='remove-btn' onclick='deleteBook("${bookData.id}")'>Deletar</button>`
  }

  if (data.length) {
    const row = booksTable.querySelector('tbody').insertRow()
    console.log('row :>> ', row)
    row.innerHTML =
      '<td colspan="4"></td><td colspan="2"><button class="save-data" onclick="saveData()">Salvar</button></td>'
  }
}

function addBookToTable(bookData) {
  generateTableRows([bookData])
}

const refreshTable = () => {
  booksTable.querySelector('tbody').innerHTML = ''
  generateTableRows(databaseBooks)
}

/**
 * GET BOOK BY ID
 * @param {*} id
 * @returns
 */
const getBook = (id) => {
  return databaseBooks.filter((book) => book.id === id)[0]
}

const getBookIndex = (id) => {
  const index = databaseBooks.findIndex((book) => book.id === id)
  if (index < 0) throw new Error(`Book with Id ${id} not found on the databaseBooks`)

  return index
}

/**
 * DELETE BOOK BY ID
 * @param {*} id
 */
const deleteBook = (id) => {
  const index = getBookIndex(id)
  // remove o objeto do array
  databaseBooks.splice(index, 1)
  formReset()
  refreshTable()
}

const formReset = () => {
  form.reset()
  form.removeAttribute('data-edit')
  form.querySelector('[type="submit"]').value = 'Salvar'
}

/**
 * EDIT BOOK BY ID
 * @param {*} id
 */
const editBook = (id) => {
  const book = getBook(id)

  const data = ['livro', 'edicao', 'autor']

  for (const index of data) {
    form.querySelector(`[name="${index}"]`).value = book[index]
  }
  form.dataset.edit = book.id
  form.querySelector('[type="submit"]').value = 'Atualizar'
}

const saveBook = (book, id) => {
  // se for atualização
  if (id) {
    const index = getBookIndex(id)
    databaseBooks[index] = { ...databaseBooks[index], ...book }
    formReset()
  } else {
    databaseBooks.push(book)
  }
}

// quando o form for submetido
form.addEventListener('submit', (e) => {
  e.preventDefault()
  // prepare data
  const newBook = formDataToJson(form)

  // se for edição
  if (form.dataset.hasOwnProperty('edit')) {
    // save book to databaseBooks
    saveBook(newBook, form.dataset.edit)
  } else {
    // save book to databaseBooks
    saveBook(newBook)
    // add book to table
    addBookToTable(newBook)
  }

  form.reset()
  refreshTable()
})

const saveData = async () =>
  await fetch('api/', {
    method: 'POST',
    body: JSON.stringify(databaseBooks)
  }).then(async (response) => {
    const data = await response.json()
    fillPre(data)
  })

const fillPre = (data) => {
  const jsonString = JSON.stringify(data, null, 2)
  const pre = document.querySelector('pre')
  if (pre) {
    pre.innerHTML = jsonString
  } else {
    booksTable.insertAdjacentHTML('afterend', `<pre>${jsonString}</pre>`)
  }
}
