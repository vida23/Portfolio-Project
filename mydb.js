const sqlite3 = require('sqlite3')

const db = new sqlite3.Database("mydb.db")
/////////////////////////////////////////////////////////////////////////
db.run(`
CREATE TABLE IF NOT EXISTS projects (
  projectID INTEGER PRIMARY KEY AUTOINCREMENT,
  dateFinished INTEGER,
  projectTitle TEXT NOT NULL,
  projectContent TEXT NOT NULL
  )
`)

db.run(`
CREATE TABLE IF NOT EXISTS blogposts (
  blogpostID INTEGER PRIMARY KEY AUTOINCREMENT,
  datePublished INTEGER,
  blogpostTitle TEXT NOT NULL,
  blogpostContent TEXT NOT NULL
  )
`)

db.run(`
CREATE TABLE IF NOT EXISTS aboutInfo (
  aboutInfoID INTEGER PRIMARY KEY AUTOINCREMENT,
  aboutInfoContent TEXT NOT NULL
  )
`)

db.run(`
CREATE TABLE IF NOT EXISTS contactRequests (
  contactReqID INTEGER PRIMARY KEY AUTOINCREMENT,
  contactName TEXT,
  contactEmail TEXT,
  contactTel INTEGER,
  requestSubject TEXT, 
  requestContent TEXT
  )
`)


// BLOGPOSTS CRUD OPERATIONS//////////////////////////////////////////////////////////////// 
exports.getAllBlogposts = function (callback) {

  const query = "SELECT * FROM blogposts ORDER BY datePublished DESC"
  db.all(query, function (error, blogposts) {
    callback(error, blogposts)
  })
}

exports.getBlogpostById = function (blogpostID, callback) {
  const query = "SELECT * FROM blogposts WHERE blogpostID = ?"
  const values = [blogpostID]

  db.get(query, values, function (error, blogpost) {
    callback(error, blogpost)
  })
}

exports.createBlogpost = function (datePublished, blogpostTitle, blogpostContent, callback) {

  const query = "INSERT INTO blogposts (datePublished, blogpostTitle, blogpostContent) VALUES (?, ?, ?)"
  const values = [datePublished, blogpostTitle, blogpostContent]

  db.run(query, values, function (error) {
    callback(error, this.lastID)
  })
}

exports.updateBlogpostById = function (blogpostID, newPublicationDate, newBlogpostTitle, newBlogpostContent, callback) {
  const query = `
    UPDATE 
      blogposts 
    SET 
      datePublished = ?,
      blogpostTitle = ?,
      blogpostContent = ?
    WHERE 
      blogpostID = ?
  `
  const values = [newPublicationDate, newBlogpostTitle, newBlogpostContent, blogpostID] //Must be in order to match query

  db.run(query, values, function (error) {
    callback(error)
  })
}

exports.deleteBlogpostById = function (blogpostID, callback) {
  const query = "DELETE FROM blogposts WHERE blogpostID = ?"
  const values = [blogpostID]

  db.run(query, values, function (error) {
    callback(error)
  })
}


//PROJECT CRUD OPERATIONS//////////////////////////////////////////////////////////////// 
exports.getAllProjects = function (callback) {

  const query = "SELECT * FROM projects ORDER BY dateFinished DESC"
  db.all(query, function (error, projects) {
    callback(error, projects)
  })
}

exports.getProjectByID = function (projectID, callback) {
  const query = "SELECT * FROM projects WHERE projectID = ?"
  const values = [projectID]

  db.get(query, values, function (error, project) {
    callback(error, project)
  })
}

exports.addProject = function (dateFinished, projectTitle, projectContent, callback) {

  const query = "INSERT INTO projects (dateFinished, projectTitle, projectContent) VALUES (?, ?, ?)"
  const values = [dateFinished, projectTitle, projectContent]

  db.run(query, values, function (error) {
    callback(error, this.lastID)
  })
}

exports.updateProjectByID = function (projectID, newDateFinished, newProjectTitle, newProjectContent, callback) {
  const query = `
    UPDATE 
      projects 
    SET
      dateFinished = ?,
      projectTitle = ?,
      projectContent = ?
    WHERE
      projectID = ?
  `
  const values = [newDateFinished, newProjectTitle, newProjectContent, projectID]

  console.log(values)

  db.run(query, values, function (error) {
    callback(error)
  })
}

exports.deleteProjectById = function (projectID, callback) {
  const query = "DELETE FROM projects WHERE projectID = ?"
  const values = [projectID]

  db.run(query, values, function (error) {
    callback(error)
  })
}

//ABOUT INFO CRUD OPERATIONS //////////////////////////////////////////////////////////////// 
exports.getAllAboutInfo = function (callback) {
  const query = "SELECT * FROM aboutInfo"
  db.all(query, function (error, aboutInfo) {
    callback(error, aboutInfo)
  })
}

exports.getAboutInfoByID = function (aboutInfoID, callback) {
  const query = "SELECT * FROM aboutInfo WHERE aboutInfoID = ?"
  const values = [aboutInfoID]

  db.get(query, values, function (error, aboutInfo) {
    callback(error, aboutInfo)
  })
}

exports.createAboutInfo = function (aboutInfoContent, callback) {

  const query = "INSERT INTO aboutInfo (aboutInfoContent) VALUES (?)"
  const values = [aboutInfoContent]

  db.run(query, values, function (error) {
    callback(error, this.lastID)
  })
}

exports.updateAboutInfoByID = function (aboutInfoID, newAboutInfoContent, callback) {
  const query = `
    UPDATE 
      aboutInfo 
    SET 
      aboutInfoContent = ?
    WHERE 
      aboutInfoID = ?
  `
  const values = [newAboutInfoContent, aboutInfoID]

  db.run(query, values, function (error) {
    callback(error)
  })
}

exports.deleteAboutInfo = function (aboutInfoID, callback) {
  const query = "DELETE FROM aboutInfo WHERE aboutInfoID = ?"
  const values = [aboutInfoID]

  db.run(query, values, function (error) {
    callback(error)
  })
}

//CONTACT CRUD OPERATIONS //////////////////////////////////////////////////////////////// 
exports.getAllContactRequests = function (callback) {
  const query = "SELECT * FROM contactRequests ORDER BY contactReqID ASC"
  db.all(query, function (error, contactRequests) {
    callback(error, contactRequests)
  })
}

exports.createContactRequest = function (contactName, contactEmail, contactTel, requestSubject, requestContent, callback) {
  const query = "INSERT INTO contactRequests (contactName, contactEmail, contactTel, requestSubject, requestContent) VALUES (?, ?, ?, ?, ?)"
  const values = [contactName, contactEmail, contactTel, requestSubject, requestContent]

  db.run(query, values, function (error) {
    callback(error, this.lastID)
  })
}

exports.deleteRequestByID = function (contactReqID, callback) {
  const query = "DELETE FROM contactRequests WHERE contactReqID = ?"
  const values = [contactReqID]

  db.run(query, values, function (error) {
    callback(error)
  })
}


