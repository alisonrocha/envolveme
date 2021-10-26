const db = openDatabase('Envolveme', '2.0', 'Mybase', 4048)

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
      localStorage.clear()
      window.location.replace('/src/index.html')
    })
  }
}

const Action = {
  field_category: document.getElementById('category'),
  field_nameAction: document.getElementById('name-action'),
  field_descriptionAction: document.getElementById('description-action'),
  field_dataAction: document.getElementById('data-action'),
  field_hourAction: document.getElementById('hour-action'),
  field_localAction: document.getElementById('local-action'),
  field_addressAction: document.getElementById('address-action'),
  field_telAction: document.getElementById('tel-action'),

  getValues() {
    return {
      field_category: document.getElementById('category').value,

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
        field_category,
        field_nameAction,
        field_descriptionAction,
        field_dataAction,
        field_hourAction,
        field_localAction,
        field_addressAction,
        field_telAction
      } = Action.getValues()

      console.log(field_category)

      form.submit()

      if (
        field_category !== '' &&
        field_nameAction !== '' &&
        field_descriptionAction !== '' &&
        field_dataAction !== '' &&
        field_hourAction !== '' &&
        field_localAction !== '' &&
        field_addressAction !== '' &&
        field_telAction !== ''
      ) {
        DBHome.Action(
          field_category,
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
    Action.field_category.value = ''
    Action.field_nameAction.value = ''
    Action.field_descriptionAction.value = ''
    Action.field_dataAction.value = ''
    Action.field_hourAction.value = ''
    Action.field_localAction.value = ''
    Action.field_addressAction.value = ''
    Action.field_telAction.value = ''
  },

  detailsActions(id) {
    DBHome.detailAction(id)
  }
}

const DBHome = {
  connect() {
    db.transaction(function (create) {
      create.executeSql(
        'CREATE TABLE IF NOT EXISTS actions (id INTEGER PRIMARY KEY, category TEXT, name TEXT, description TEXT, date DATE, hour INTEGER, local TEXT, address TEXT, phone INTEGER)'
      )
    })
  },

  Action(
    field_category,
    field_nameAction,
    field_descriptionAction,
    field_dataAction,
    field_hourAction,
    field_localAction,
    field_addressAction,
    field_telAction
  ) {
    DBHome.connect()
    db.transaction(async function (save) {
      await save.executeSql(
        'INSERT INTO actions (category, name, description, date, hour, local, address, phone) VALUES(?,?,?,?,?,?,?,?)',
        [
          field_category,
          field_nameAction,
          field_descriptionAction,
          field_dataAction,
          field_hourAction,
          field_localAction,
          field_addressAction,
          field_telAction
        ]
      )
      Action.clearFields()
      DOMHome.modalSuccess()
    })
  },

  listAction() {
    db.transaction(async function (save) {
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
  },

  profile() {
    let id = localStorage.getItem('id')
    db.transaction(async function (query) {
      await query.executeSql(
        'SELECT * FROM users WHERE id = ? ',
        [id],
        function (save, result) {
          let divProfile = document.getElementById('context-profile')
          let name = result.rows[0].name
          let lastname = result.rows[0].lastname
          let email = result.rows[0].email

          divProfile.innerHTML = DOMHome.showProfile(name, lastname, email, id)
        }
      )
    })
  },

  showlist(category) {
    db.transaction(function (query) {
      query.executeSql(
        'SELECT * FROM actions WHERE category = ? ',
        [category],
        function (query, result) {
          let divCard = document.querySelector('.cards')

          divCard.innerHTML = ''

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
  },

  detailAction(id) {
    console.log(id)
    db.transaction(function (query) {
      query.executeSql(
        'SELECT * FROM actions WHERE id = ? ',
        [id],
        function (query, result) {
          let div = document.body

          let category, name, description, date, hour, local, address, phone

          category = result.rows[0].category
          name = result.rows[0].name
          description = result.rows[0].description
          date = result.rows[0].date
          hour = result.rows[0].hour
          local = result.rows[0].local
          address = result.rows[0].address
          phone = result.rows[0].phone

          date = date.split('-').reverse().join('-')

          div.insertAdjacentHTML(
            'afterend',
            DOMHome.modalDetailAction(
              category,
              name,
              description,
              date,
              hour,
              local,
              address,
              phone
            )
          )
        }
      )
    })
  }
}

const Categorys = {
  btn_all: document.getElementById('all'),
  all_li: document.querySelectorAll('.menu-category li'),

  activeBtnCategorys() {
    let li = document.querySelectorAll('.menu-category li')

    for (let i = 0; i < li.length; i++) {
      li[i].addEventListener('click', event => {
        console.log(event.target.id)
        DBHome.showlist(event.target.id)
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
  },

  allAction() {
    this.btn_all.addEventListener('click', () => {
      DBHome.listAction()
    })
  }
}

const DOMHome = {
  name: document.getElementById('name'),
  email: document.getElementById('show-email'),
  initial_name: document.getElementById('show-initial'),

  close() {
    document.querySelector('.modal-detail-action').classList.remove('active')
  },

  showData() {
    DOMHome.name.innerHTML = localStorage.getItem('name')

    DOMHome.email.innerHTML = localStorage.getItem('email')

    DOMHome.initial_name.innerHTML =
      localStorage.getItem('name').substr(0, 1) +
      localStorage.getItem('lastname').substr(0, 1)
  },

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

  modalDetailAction(
    category,
    name,
    description,
    date,
    hour,
    local,
    address,
    phone
  ) {
    //let div = document.createElement('div')

    html = `
      <div class="modal modal-detail-action active">
      <div class="context-modal">  
      <div class="close" onclick="DOMHome.close()">X</div>       
      <div class="container">
      <p><span>Categoria da Ação: </span> ${category}</p>
      <p><span>Ação Social: </span> ${name}</p>
      <p><span>Detalhes da Ação Social: </span> ${description}</p>
      <p><span>Dia que vai ocorrer: </span> ${date}</p>
      <p><span>Horário: </span> ${hour}</p>
      <p><span>Local: </span> ${local}</p>
      <p><span>Endereço: </span> ${address}</p>
      <p><span>Whatsapp para contato: </span> ${phone}</p>
      <a href="https://api.whatsapp.com/send?phone=${phone}&text=Oi%20Gostaria%20de%20participar%20da%20ação%20social%20${name}">Entrar em contato</a>     
      </div>
      </div>
      </div>
    `
    return html
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
        <button onclick="Action.detailsActions(${index})">Mais detalhes</button>
        </div>
        </div>      
      `
    return html
  },

  showProfile(name, lastname, email, id) {
    html = `
      <p><span>Nome: </span>${name + ' ' + lastname}</p>

      <p><span>E-mail: </span> ${email}</p>

      <button id="btn-profile">Alterar</button>
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
    Action.loading()
    DBHome.listAction()
    DBHome.profile()
    DOMHome.showData()
    Categorys.activeBtnCategorys()
    Categorys.allAction()
  }
}

AppHome.init()
