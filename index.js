const express = require('express')
const exphbs = require('express-handlebars')
const app = express()


const conn = require('./db/conn')
const User = require('./model/User')
const Address = require('./model/Address')

app.use(
  express.urlencoded({
    extended: true,
  }),
    )
    
app.use(express.json())
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', async (_request, response) => {
  //raw facilita o uso em trazer os dados de forma mais simples, 
  //sendo mais facil de trabalhar com o handlebars
  const users = await User.findAll({raw: true}) // SELECT * FROM 
  response.render('home',{ users: users})} //passa disponibilidade pelo engine para jogar em home
  )

app.get('/users/create', (_request, response) => {
  response.render('adduser')})

app.post('/users/create', async (request, response) => {
  // requisitando o dados da page
  const name = request.body.name
  const occupation = request.body.occupation
  let newsletter = request.body.newsletter //on
  
  if(newsletter === 'on') {
    newsletter = true
  }
  // criando valores para tabela user
  await User.create({name, occupation, newsletter})
  // console.log(request.body)
  //redicionar para home
  response.redirect('/')
})

app.get('/users/:id', async (request, response) => {
  const id = request.params.id // id da url

  const user = await User.findOne({raw: true, where: { id: id }})

  response.render('userview',{ user })
})

app.post('/users/delete/:id', async(request, response) => {
  const id = request.params.id
  await User.destroy({ where: { id: id } }) // querie DELETE
  response.redirect('/')
})

app.get('/users/edit/:id', async (request, response) => { // get para o useredit
  const id = request.params.id
  try{
  const user = await User.findOne({ include: Address, where: {id: id} })
  response.render('useredit', { user: user.get({ plain: true }) })
  }
  catch(error) {
    console.log(error)
  }
})

app.post('/users/update', async(request, response) => {
  const id = request.body.id
  const name = request.body.name
  const occupation = request.body.occupation
  let newsletter = request.body.newsletter

  if (newsletter === 'on') { newsletter = true }
  else { newsletter = false }

  const data = { id, name, occupation, newsletter, }

  await User.update(data, { where: {id: id } })
  .then((user) => {console.log(user)
    response.redirect('/')
  })
  .catch((error) => console.log(error))
})

app.post('/address/create', async (request, response) => {
  const UserId =  request.body.UserId
  const street = request.body.street
  const number = request.body.number
  const city = request.body.city

  const data = { UserId, street, number, city }
  await Address.create(data)

  response.redirect(`/users/edit/${UserId}`)
})

app.post('/address/delete', (request, response) => {
  const UserId =  request.body.UserId
  const id = request.body.id
  Address.destroy({
    where: {id: id}
  })
  response.redirect(`/users/edit/${UserId}`)
})

// aplicação é inicializada sincrona junto com a tabela
conn.sync().then(() => {
    app.listen(3001)
 })
 .catch((err) => console.log(err))