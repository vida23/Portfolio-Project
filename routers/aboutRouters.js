const express = require('express')
const db = require('../mydb')
const router = express.Router()

router.get("/", function (request, response) {

    db.getAllAboutInfo(function (error, aboutInfo) {
        if (error) {
            const model = {
                databaseError: true
            }
            response.render("about.hbs", model)
        } else {
            const model = {
                databaseError: false,
                aboutInfo,
                csrfToken: request.csrfToken()

            }
            response.render("about.hbs", model)
        }
    })
}) //Tested done

router.get("/add", function (request, response) {
    const authorizationError = []

    if (!request.session.isLoggedIn) {
        authorizationError.push("This function is limited for admin only. Please log in to access this.")
        const model = {
            authorizationError,
            csrfToken: request.csrfToken()
        }
        response.render("add-aboutInfo.hbs", model)
    }
    response.render("add-aboutInfo.hbs")
}) //Tested done

router.post("/add", function (request, response) {

    const aboutInfoContent = request.body.aboutInfoContent

    const validationErrors = []
    const authorizationError = []

    if (!request.session.isLoggedIn) {
        authorizationError.push("This function is limited for admin only. Please log in to access this.")
        const model = {
            authorizationError
        }
        response.render("about.hbs", model)
        return
    }

    if (aboutInfoContent == "") {
        validationErrors.push("All fields must be filled!")
    }

    if (validationErrors.length == 0) {
        db.createAboutInfo(aboutInfoContent, function (error) {
            if (error) {
                const model = {
                    databaseError: true
                }
                response.render("about.hbs", model)
            } else {
                response.redirect("/about")
            }
        })
    } else {
        const model = {
            validationErrors,
            databaseError: false,
            aboutInfoContent
        }
        response.render("add-aboutInfo.hbs", model)
    }
}) //Tested done

// router.get("/:aboutInfoID", function (request, response) {
//     const aboutInfoID = request.params.aboutInfoID

//     db.getAboutInfoByID(aboutInfoID, function (error, aboutInfo) {
//         if (error) {
//             const model = {
//                 databaseError: true
//             }

//             response.render("about.hbs", model)
//         } else {
//             const model = {
//                 databaseError: false,
//                 aboutInfo,
//                 csrfToken: request.csrfToken()
//             }
//             response.render("about.hbs", model)
//         }
//     })
// })             !!!!!!!!!!!  NOT USED !!!!!!!!!!!

router.get("/updateAboutInfo/:aboutInfoID", function (request, response) {
    const aboutInfoID = request.params.aboutInfoID
    const authorizationError = []

    if (!request.session.isLoggedIn) {
        authorizationError.push("This function is limited for admin only. Please log in to access this.")
        const model = {
            authorizationError
        }
        response.render("updateAboutInfo.hbs", model)
        return
    }

    db.getAboutInfoByID(aboutInfoID, function (error, aboutInfo) {
        if (error) {
            const model = {
                databaseError: true
            }

            response.render("about.hbs", model)

        } else {
            const model = {
                databaseError: false,
                aboutInfo,
                csrfToken: request.csrfToken()
            }

            response.render("updateAboutInfo.hbs", model)
        }
    })
}) //tested done

router.post("/updateAboutInfo/:aboutInfoID", function (request, response) {

    const aboutInfoID = request.params.aboutInfoID
    const newAboutInfoContent = request.body.aboutInfoContent

    const validationErrors = []
    const authorizationError = []

    if (!request.session.isLoggedIn) {
        authorizationError.push("This function is limited for admin only. Please log in to access this.")
        const model = {
            authorizationError
        }
        response.render("updateAboutInfo.hbs", model)
        return
    }

    if (newAboutInfoContent == "") {
        validationErrors.push("All fields must be filled!")
    }

    if (validationErrors.length > 0) {
        const model = {
            validationErrors,
            aboutInfo: {
                aboutInfoID,
                aboutInfoContent: newAboutInfoContent
            }
        }
        response.render("updateAboutInfo.hbs", model);
    }

    db.updateAboutInfoByID(aboutInfoID, newAboutInfoContent, function (error) {
        if (error) {
            const model = {
                databaseError: true
            }
            response.render("updateAboutInfo.hbs", model)
        } else {
            response.redirect("/about")
        }
    })
})//TEsted done

router.post("/deleteAboutInfo/:aboutInfoID", function (request, response) {

    const aboutInfoID = request.params.aboutInfoID
    const authorizationError = []

    if (!request.session.isLoggedIn) {
        authorizationError.push("This function is limited for admin only. Please log in to access this.")
        const model = {
            authorizationError
        }
        response.render("about.hbs", model)
        return
    }

    db.deleteAboutInfo(aboutInfoID, function (error) {
        if (error) {
            const model = {
                databaseError: true
            }
            response.render("about.hbs", model)
        } else {
            response.redirect("/about")
        }
    })

}) //Tested done


module.exports = router


