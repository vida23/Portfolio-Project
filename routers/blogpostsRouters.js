const express = require('express')
const db = require('../mydb')
const router = express.Router()

router.get("/", function (request, response) {

  db.getAllBlogposts(function (error, blogposts) {
    if (error) {

      const model = {
        databaseError: true
      }
      response.render("blogposts.hbs", model)
    } else {

      const model = {
        databaseError: false,
        blogposts
      }
      response.render("blogposts.hbs", model)
    }
  })
})



router.get("/add", function (request, response) {
  const authorizationError = []

  if (!request.session.isLoggedIn) {
    authorizationError.push("This function is limited for admin only. Please log in to access this.")
  }

  const model = {
    authorizationError,
    csrfToken: request.csrfToken()
  }
  response.render("add-blogpost.hbs", model)
})



router.post("/add", function (request, response) {

  const datePublished = request.body.datePublished
  const blogpostContent = request.body.blogpostContent
  const blogpostTitle = request.body.blogpostTitle

  const validationErrors = []

  if (!request.session.isLoggedIn) {
    validationErrors.push("Must be logged in!")
  }

  if (datePublished == "" || blogpostTitle == "" || blogpostContent == "") {
    validationErrors.push("All fields must be filled!")
  }

  if (validationErrors.length == 0) {
    db.createBlogpost(datePublished, blogpostTitle, blogpostContent, function (error, blogpostID) {
      if (error) {
        const model = {
          databaseError: true
        }
        response.render("add-blogpost.hbs", model)

      } else {
        response.redirect("/blogposts/" + blogpostID)
      }
    })
  } else {
    const model = {
      databaseError: false,
      validationErrors,
      datePublished,
      blogpostTitle,
      blogpostContent
    }
    response.render("add-blogpost.hbs", model)
  }
})

router.get("/:blogpostID", function (request, response) {
  const blogpostID = request.params.blogpostID

  db.getBlogpostById(blogpostID, function (error, blogpost) {
    if (error) {
      const model = {
        databaseError: true
      }
      response.render("showBlogpost.hbs", model)
    } else {
      const model = {
        databaseError: false,
        blogpost
      }
      response.render("showBlogpost.hbs", model)
    }
  })
})

router.get("/updateBlogpost/:blogpostID", function (request, response) {
  const blogpostID = request.params.blogpostID
  const authorizationError = []

  if (!request.session.isLoggedIn) {
    authorizationError.push("This function is limited for admin only. Please log in to access this.")

    const model = {
      authorizationError,
      csrfToken: request.csrfToken()
    }
    response.render("add-blogpost.hbs", model)
  } else {
    db.getBlogpostById(blogpostID, function (error, blogpost) {
      if (error) {
        const model = {
          databaseError: true
        }
        response.render("showBlogpost.hbs", model)
      } else {
        const model = {
          databaseError: false,
          blogpost,
          csrfToken: request.csrfToken()
        }

        response.render("updateBlogpost.hbs", model)
      }
    })
  }

})

router.post("/updateBlogpost/:blogpostID", function (request, response) {

  const blogpostID = request.params.blogpostID
  const newPublicationDate = request.body.datePublished
  const newBlogpostTitle = request.body.blogpostTitle
  const newBlogpostContent = request.body.blogpostContent

  const validationErrors = []
  const authorizationError = []

  if (!request.session.isLoggedIn) {
    authorizationError.push("This function is limited for admin only. Please log in to access this.")
    const model = {
      authorizationError
    }
    response.render("updateBlogpost.hbs", model)
    return
  }

  if (newPublicationDate == "" || newBlogpostTitle == "" || newBlogpostContent == "") {
    validationErrors.push("All fields must be filled!")
  }

  if (validationErrors.length != 0) {
    const model = {
      validationErrors,
      blogpost: {
        blogpostID,
        datePublished: newPublicationDate,
        blogpostTitle: newBlogpostTitle,
        blogpostContent: newBlogpostContent
      }
    }
    response.render("updateBlogpost.hbs", model)
    return
  } else {
    db.updateBlogpostById(blogpostID, newPublicationDate, newBlogpostTitle, newBlogpostContent, function (error) {
      if (error) {
        const model = {
          databaseError: true
        }
        response.render("updateblogpost.hbs", model)

      } else {
        response.redirect("/blogposts/" + blogpostID)
      }

    })
  }

})

router.post("/deleteBlogpost/:blogpostID", function (request, response) {

  const blogpostID = request.params.blogpostID
  const authorizationError = []

  if (!request.session.isLoggedIn) {
    authorizationError.push("This function is limited for admin only. Please log in to access this.")
    const model = {
      authorizationError
    }
    response.render("showBlogpost.hbs", model)
    return
  }

  db.deleteBlogpostById(blogpostID, function (error) {
    if (error) {
      const model = {
        databaseError: true
      }
      response.render("showblogpost.hbs", model)
    } else {
      response.redirect("/blogposts")
    }
  })

})

module.exports = router

