const Menu = {
  home: document.getElementById('home'),
  registrationAction: document.getElementById('registration-action'),
  profile: document.getElementById('profile'),
  logout: document.getElementById('logout'),

  clearMenu() {
    let sections = document.querySelectorAll('.sections')

    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.contains('active')
        ? sections[i].classList.remove('active')
        : null
    }
  },

  activeHome() {
    this.home.addEventListener('click', () => {
      Menu.clearMenu()

      document.querySelector('.section-list-action').classList.add('active')
    })
  },

  activeRegistrationAction() {
    this.registrationAction.addEventListener('click', () => {
      Menu.clearMenu()

      document
        .querySelector('.section-registration-action')
        .classList.add('active')
    })
  },

  activeProfile() {
    this.profile.addEventListener('click', () => {
      Menu.clearMenu()

      document.querySelector('.section-profile').classList.add('active')
    })
  },

  logoutHome() {
    this.logout.addEventListener('click', () => {
      window.location.replace('/src/index.html')
    })
  }
}

const SaveAction = {
  field_nameAction: document.getElementById('name-action'),
  field_descriptionAction: document.getElementById('description-action'),
  field_dataAction: document.getElementById('data-action'),
  field_hourAction: document.getElementById('hour-action'),
  field_localAction: document.getElementById('local-action'),
  field_addressAction: document.getElementById('address-action'),
  field_telAction: document.getElementById('tel-action'),

  getValues() {
    return {
      field_nameAction: document.getElementById('name-action').value,
      field_descriptionAction:
        document.getElementById('description-action').value,
      field_dataAction: document.getElementById('data-action').value,
      field_hourAction: document.getElementById('hour-action').value,
      field_localAction: document.getElementById('local-action').value,
      field_addressAction: document.getElementById('address-action').value,
      field_telAction: document.getElementById('tel-action').value
    }
  },

  loading() {
    var form = document.getElementById('form-save-action')

    document.getElementById('btn-save-action').addEventListener('click', () => {
      const {
        field_nameAction,
        field_descriptionAction,
        field_dataAction,
        field_hourAction,
        field_localAction,
        field_addressAction,
        field_telAction
      } = SaveAction.getValues()

      form.submit()

      if (
        field_nameAction !== '' &&
        field_descriptionAction !== '' &&
        field_dataAction !== '' &&
        field_hourAction !== '' &&
        field_localAction !== '' &&
        field_addressAction !== '' &&
        field_telAction !== ''
      ) {
        DBAction.saveAction(
          field_nameAction,
          field_descriptionAction,
          field_dataAction,
          field_hourAction,
          field_localAction,
          field_addressAction,
          field_telAction
        )
      }
    })
  },

  clearFields() {
    SaveAction.field_nameAction.value = ''
    SaveAction.field_descriptionAction.value = ''
    SaveAction.field_dataAction.value = ''
    SaveAction.field_hourAction.value = ''
    SaveAction.field_localAction.value = ''
    SaveAction.field_addressAction.value = ''
    SaveAction.field_telAction.value = ''
  }
}

const DBAction = {
  db: openDatabase('Envolveme', '2.0', 'Mybase', 4048),

  connect() {
    DBAction.db.transaction(function (create) {
      create.executeSql(
        'CREATE TABLE IF NOT EXISTS actions (id INTEGER PRIMARY KEY, name TEXT, description TEXT, date DATE, hour INTEGER, local TEXT, address TEXT, phone INTEGER)'
      )
    })
  },

  saveAction(
    field_nameAction,
    field_descriptionAction,
    field_dataAction,
    field_hourAction,
    field_localAction,
    field_addressAction,
    field_telAction
  ) {
    DBAction.connect()
    DBAction.db.transaction(async function (save) {
      await save.executeSql(
        'INSERT INTO actions (name, description, date, hour, local, address, phone) VALUES(?,?,?,?,?,?,?)',
        [
          field_nameAction,
          field_descriptionAction,
          field_dataAction,
          field_hourAction,
          field_localAction,
          field_addressAction,
          field_telAction
        ]
      )
      SaveAction.clearFields()
      DOMHome.modalSuccess()
    })
  },

  listAction() {
    DBAction.db.transaction(async function (save) {
      await save.executeSql(
        'SELECT * FROM actions',
        [],
        function (save, result) {
          let divCard = document.querySelector('.cards')

          let list = result.rows

          if (result.length < 0) {
            divCard.innerHTML =
              '<h1>Não temos nenhuma ação por enquanto, bora criar?</h1>'
          } else {
            for (let i = 0; i < list.length; i++) {
              let { name, description, date, hour, id } = list

              name = list[i].name
              description = list[i].description
              date = list[i].date
              hour = list[i].hour
              id = list[i].id

              divCard.innerHTML += DOMHome.listAction(
                name,
                description,
                date,
                hour,
                id
              )
            }
          }
        }
      )
    })
  }
}

const Categorys = {
  btn_all: document.getElementById('all'),
  btn_kids: document.getElementById('all'),
  btn_animal: document.getElementById('all'),
  btn_adults: document.getElementById('all'),
  btn_donation: document.getElementById('all'),
  all_li: document.querySelectorAll('.menu-category li'),

  activeBtnCategorys() {
    let li = document.querySelectorAll('.menu-category li')

    for (let i = 0; i < li.length; i++) {
      li[i].addEventListener('click', event => {
        console.log(event.target)
        Categorys.clearBtnCategory()
        event.target.classList.add('active')
      })
    }
  },

  clearBtnCategory() {
    let li = Categorys.all_li

    for (let i = 0; i < li.length; i++) {
      li[i].classList.contains('active')
        ? li[i].classList.remove('active')
        : null
    }
  }
}

const DOMHome = {
  modalSuccess() {
    let div = document.createElement('div')
    div.innerHTML = `
      <div class="modal modal-success">
      <div class="context-modal">         
      <div class="container">
      <h2> Sua <span>Ação Social</span> foi cadastrada com Sucesso! Agradecemos por fazer o bem :)
      </h2>
      </div>
      </div>
      </div>
    `
    document.body.appendChild(div)

    setTimeout(function () {
      document.body.removeChild(div)
    }, 5000)
  },

  listAction(name, description, date, hour, index) {
    html = `      
        <div class="card-context">
        <div class="corp">
        <h4>${name}</h4>
        <p>${description}</p>
        <div class="date">
        <img src="./../public/images/calendar.svg" alt="" />
        <span>${date} às ${hour}</span>
        </div>
        <button onclick="Transaction.remove(${index})">Mais detalhes</button>
        </div>
        </div>      
      `
    return html
  }
}

const AppHome = {
  init() {
    Menu.activeRegistrationAction()
    Menu.activeHome()
    Menu.activeProfile()
    Menu.logoutHome()
    SaveAction.loading()
    DBAction.listAction()
    Categorys.activeBtnCategorys()
  }
}

AppHome.init()
