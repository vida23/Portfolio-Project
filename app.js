const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const projectsRouter = require('./routers/projectsRouters')
const blogpostsRouter = require('./routers/blogpostsRouters')
const aboutRouter = require('./routers/aboutRouters')
const contactRouter = require('./routers/contactRouter')
const bcrypt = require('bcrypt')
const app = express()
const csrf = require("csurf")

///////////////////////////////////////////////////////////////////////////////
const ADMIM_USERNAME = "Vida"
const ADMIN_PASSWORD = "$2b$10$8qZX5EG37MP40q5trKq0G.r00Spf1ro3s.OWwey0/cEiG0WKu9ppO" 

//How the password was hashed
// const saltRounds = 10
// bcrypt.genSalt(saltRounds, function(error, salt){
//   bcrypt.hash(ADMIN_PASSWORD, salt, function (error, hash){
//     console.log(hash)
//   })
// })

//////////////////////////////////////////////////////////////////////////////

app.engine('hbs', expressHandlebars.engine({
  defaultLayout: 'main.hbs',
  extname: 'hbs'
}))

app.use(express.static("public"))

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(cookieParser())

app.use(csrf({ cookie: true }))

app.use(function (request, response, next) {
  const token = request.csrfToken()
  response.cookie("XSRF-TOKEN", token)
  response.app.locals.csrfToken = token
  next();
})

app.use(expressSession({
  secret: "ygfiygvkhvb", //controls how sessions ID's are generated; uses this string to generate sessionIDs
  saveUninitialized: false, //forget session that do not store anything
  resave: false, //ignore state of session that have not had any changes
  store: new SQLiteStore({
    db: "sessions.db"//where the sessions should be stored
  })
}))



app.use(function (request, response, next) {
  response.locals.isLoggedIn = request.session.isLoggedIn
  next()
})

////////////////////////////////////////////////////////////////////////////////

app.use("/projects", projectsRouter)
app.use("/blogposts", blogpostsRouter)
app.use("/about", aboutRouter)
app.use("/contactPage", contactRouter)

////////////////////////////////////////////////////////////////////////////////
app.get("/login", function (request, response) {
  const model = {
    csrfToken: request.csrfToken()
  }
  response.render("login.hbs", model)
})

app.post("/login", function (request, response) {

  const enteredUsername = request.body.username
  const enteredPassword = request.body.password

  const validationErrors = []

  if (enteredPassword == "" || enteredUsername == "") {
    validationErrors.push("Please enter credentials")
  }

  if (enteredUsername == ADMIM_USERNAME && bcrypt.compareSync(enteredPassword, ADMIN_PASSWORD) == true) {
    request.session.isLoggedIn = true
    response.redirect("/")
  } else {
    validationErrors.push("Password or username is incorrect.")
    const model = {
      validationErrors
    }
    response.render("login.hbs", model)
    return
  }
})

app.post("/logout", function (request, response) {
  request.session.isLoggedIn = false
  response.redirect("/")
})

///////////////////////////////////////////////////////////////////////

app.get("/", function (request, response) {
  response.render("home.hbs")
})

app.listen(8080);
console.log("Up!");
