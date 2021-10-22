const Form = {
  field_name: document.getElementById('name'),
  field_lastname: document.getElementById('last-name'),
  field_email: document.getElementById('email'),
  field_password: document.getElementById('password-register'),

  getValues() {
    return {
      field_name: document.getElementById('name').value,
      field_lastname: document.getElementById('last-name').value,
      field_email: document.getElementById('email').value,
      field_password: document.getElementById('password-register').value
    }
  },

  loading() {
    var form = document.getElementById('form-register')

    document.getElementById('btn-save').addEventListener('click', () => {
      const { field_name, field_lastname, field_email, field_password } =
        Form.getValues()

      form.submit()

      if (
        field_name !== '' &&
        field_lastname !== '' &&
        field_email !== '' &&
        field_password !== ''
      ) {
        DBRegister.verifyUser()
      }
    })
  },

  clearFields() {
    Form.field_name.value = ''
    Form.field_lastname.value = ''
    Form.field_email.value = ''
    Form.field_password.value = ''
  }
}

const DBRegister = {
  db: openDatabase('Envolveme', '2.0', 'Mybase', 4048),

  connect() {
    DBRegister.db.transaction(function (create) {
      create.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, lastname TEXT, email TEXT, password TEXT)'
      )
    })
  },

  verifyUser() {
    const field_email = document.getElementById('email').value

    DBRegister.db.transaction(function (query) {
      query.executeSql(
        'SELECT email FROM users WHERE email = ?',
        [field_email],
        function (query, result) {
          result.rows.length > 0
            ? alert('E-mail já existe em nossa base, favor adicionar um novo')
            : DBRegister.saveUser()
        }
      )
    })
  },

  saveUser(e) {
    DBRegister.db.transaction(async function (save) {
      await save.executeSql(
        'INSERT INTO users (name, lastname, email, password) VALUES(?,?,?,?)',
        [
          Form.field_name.value,
          Form.field_lastname.value,
          Form.field_email.value,
          Form.field_password.value
        ]
      )
      Form.clearFields()

      document.querySelector('.modal-register').classList.remove('active')

      DOM.modalSuccess()
      e.preventDefault()
    })
  }
}

const DOM = {
  modalSuccess() {
    let div = document.createElement('div')
    div.innerHTML = `
      <div class="modal modal-success">
      <div class="context-modal">         
      <div class="container">
      <h2>Agora você faz parte da <span>Comunidade do bem</span>!
      </h2>
      </div>
      </div>
      </div>
    `
    document.body.appendChild(div)

    setTimeout(function () {
      document.body.removeChild(div)
    }, 5000)
  }
}

const AppRegister = {
  init() {
    DBRegister.connect()
    Form.loading()
  }
}

AppRegister.init()
