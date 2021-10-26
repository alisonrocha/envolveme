const db = openDatabase('Envolveme', '2.0', 'Mybase', 4048)

const Login = {
  field_email: document.getElementById('user-email'),
  field_password: document.getElementById('user-password'),

  getValues() {
    return {
      field_email: document.getElementById('user-email').value,
      field_password: document.getElementById('user-password').value
    }
  },

  loading() {
    var form = document.getElementById('form-login')

    document
      .getElementById('btn-authentication')
      .addEventListener('click', () => {
        const { field_email, field_password } = Login.getValues()

        form.submit()

        if (field_email !== '' && field_password !== '') {
          Database.queryDB(field_email, field_password)
        }
      })
  },

  clearFields() {
    Login.field_email.value = ''
    Login.field_password.value = ''
  }
}

const Database = {
  queryDB(email, password) {
    db.transaction(function (query) {
      query.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ? ',
        [email, password],
        function (query, result) {
          if (result.rows.length > 0) {
            localStorage.setItem('id', result.rows[0].id)
            localStorage.setItem('name', result.rows[0].name)
            localStorage.setItem('email', result.rows[0].email)
            localStorage.setItem('lastname', result.rows[0].lastname)
            window.location.replace('/src/home.html')
          } else {
            alert('usuario não existe, favor tentar novamente!')
          }
        }
      )
    })
  }
}

const Modal = {
  modalForgot() {
    let modal = Utils.getElementAll('.forgotPsw')

    for (let i = 0; modal.length > i; i++) {
      modal[i].addEventListener('click', event => {
        Utils.getElement('.modal-forgot-password').classList.contains('active')
          ? Utils.getElement('.modal-forgot-password').classList.remove(
              'active'
            )
          : Utils.getElement('.modal-forgot-password').classList.add('active')
      })
    }
  },

  modalRegister() {
    let modal = Utils.getElementAll('.register')

    for (let i = 0; modal.length > i; i++) {
      modal[i].addEventListener('click', event => {
        Utils.getElement('.modal-register').classList.contains('active')
          ? Utils.getElement('.modal-register').classList.remove('active')
          : Utils.getElement('.modal-register').classList.add('active')
      })
    }
  }
}

const Utils = {
  getElementAll(element) {
    return document.querySelectorAll(element)
  },

  getElement(element) {
    return document.querySelector(element)
  }
}

const AppAuthentication = {
  init() {
    Modal.modalForgot()
    Modal.modalRegister()
    Login.loading()
  }
}

AppAuthentication.init()
