const express = require('express')
const db = require('../mydb')
const router = express.Router()

router.get("/", function (request, response) {

  db.getAllProjects(function (error, projects) {
    if (error) {

      const model = {
        databaseError: true
      }
      response.render("projects.hbs", model)
    } else {

      const model = {
        projects,
        databaseError: false
      }
      response.render("projects.hbs", model)
    }
  })
}) //Tested

router.get("/add", function (request, response) {
  const authorizationError = []

  if (!request.session.isLoggedIn) {
    authorizationError.push("This function is limited for admin only. Please log in to access this.")
  }

  const model = {
    authorizationError,
    csrfToken: request.csrfToken()
  }
  response.render("add-project.hbs", model)
}) //Tested

router.post("/add", function (request, response) {

  const dateFinished = request.body.dateFinished
  const projectContent = request.body.projectContent
  const projectTitle = request.body.projectTitle

  const validationErrors = []
  const authorizationError = []

  if (!request.session.isLoggedIn) {
    authorizationError.push("This function is limited for admin only. Please log in to access this.")
    const model = {
      authorizationError
    }
    response.render("add-project.hbs", model)
    return
  }

  if (dateFinished == "" || projectTitle == "" || projectContent == "") {
    validationErrors.push("All fields must be filled!")
  }

  if (validationErrors.length == 0) {
    db.addProject(dateFinished, projectTitle, projectContent, function (error, projectID) {
      if (error) {
        const model = {
          databaseError: true
        }
        response.render("add-project.hbs", model)

      } else {
        response.redirect("/projects/" + projectID)
      }
    })
  } else {
    const model = {
      databaseError: false,
      validationErrors,
      projectTitle,
      dateFinished,
      projectContent
    }
    response.render("add-project.hbs", model)
  }
}) //Tested done

router.get("/:projectID", function (request, response) {
  const projectID = request.params.projectID

  db.getProjectByID(projectID, function (error, project) {
    if (error) {
      const model = {
        databaseError: true
      }
      response.render("showProject.hbs", model)
    } else if (project == undefined) {
      const model = {
        projectNotFound: true
      }
      response.render("showProject.hbs", model)
      return
    } else {
      const model = {
        databaseError: false,
        project
      }
      response.render("showProject.hbs", model)
    }
  })
}) //Tested done

router.get("/updateProject/:projectID", function (request, response) {
  const projectID = request.params.projectID
  const authorizationError = []

  if (!request.session.isLoggedIn) {
    authorizationError.push("This function is limited for admin only. Please log in to access this.")

    const model = {
      authorizationError,
      csrfToken: request.csrfToken()
    }
    response.render("updateProject.hbs", model)
    return
  }

  db.getProjectByID(projectID, function (error, project) {
    if (error) {
      const model = {
        databaseError: true
      }
      response.render("updateProject.hbs", model)
    } else {
      const model = {
        databaseError: false,
        project,
        csrfToken: request.csrfToken()
      }
      response.render("updateProject.hbs", model)
    }
  })

}) //Tested done

router.post("/updateProject/:projectID", function (request, response) {

  const projectID = request.params.projectID
  const newDateFinished = request.body.dateFinished
  const newProjectTitle = request.body.projectTitle
  const newProjectContent = request.body.projectContent

  const validationErrors = []
  const authorizationError = []

  if (!request.session.isLoggedIn) {
    authorizationError.push("This function is limited for admin only. Please log in to access this.")
    const model = {
      authorizationError
    }
    response.render("updateProject.hbs", model)
    return
  }

  if (newDateFinished == "" || newProjectTitle == "" || newProjectContent == "") {
    validationErrors.push("All fields must be filled!")
  }

  if (validationErrors.length != 0) {
    const model = {
      validationErrors,
      project: {
        projectID,
        dateFinished: newDateFinished,
        projectTitle: newProjectTitle,
        projectContent: newProjectContent
      }
    }
    return response.render("updateProject.hbs", model)
  }

  db.updateProjectByID(projectID, newDateFinished, newProjectTitle, newProjectContent, function (error) {
    if (error) {
      const model = {
        databaseError: true
      }
      response.render("updateProject.hbs", model)
    } else {
      response.redirect("/projects/" + projectID)
    }

  })

}) //Tested done

router.post("/deleteProject/:projectID", function (request, response) {

  const projectID = request.params.projectID
  const authorizationError = []

  if (!request.session.isLoggedIn) {
    authorizationError.push("This function is limited for admin only. Please log in to access this.")
    const model = {
      authorizationError
    }
    response.render("showProject.hbs", model)
    return
  }

  db.deleteProjectById(projectID, function (error) {
    if (error) {
      const model = {
        databaseError: true
      }
      response.render("showProject.hbs", model)
    } else {
      response.redirect("/projects")
    }
  })

}) //Tested done

module.exports = router
