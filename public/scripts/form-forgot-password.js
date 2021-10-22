const FormForgot = {
  field_forgot: document.getElementById('email-forgot'),

  getValue() {
    const field_value = document.getElementById('email-forgot').value

    return field_value
  },

  loading() {
    const form = document.getElementById('form-forgot')

    document.getElementById('btn-forgot').addEventListener('click', () => {
      const email_forgot = FormForgot.getValue()

      form.submit()

      if (email_forgot !== '') {
        DBForgot.verifyUser(email_forgot)
      }
    })
  },

  clearFields() {
    FormForgot.field_forgot.value = ''
  }
}

//Funções do Modal de Alteração de Senha
const FormRecover = {
  field_recover_password: document.getElementById('recover-password'),

  getValue() {
    const field_recover = document.getElementById('recover-password').value

    return field_recover
  },

  loading() {
    const form = document.getElementById('form-recover')

    document.getElementById('btn-recover').addEventListener('click', () => {
      const pass = FormRecover.getValue()

      form.submit()

      if (pass !== '') {
        DBForgot.updateUser(pass)
      }
    })
  },

  clearFields() {
    FormRecover.field_recover_password.value = ''
  }
}



const ModalRecover = {
  close() {
    document
      .querySelector('.modal-recover-password .close')
      .addEventListener('click', () => {
        document
          .querySelector('.modal-recover-password')
          .classList.remove('active')
      })
  }
}

const AppForgot = {
  init() {
    FormForgot.loading()
    FormRecover.loading()
    ModalRecover.close()
  }
}

AppForgot.init()
