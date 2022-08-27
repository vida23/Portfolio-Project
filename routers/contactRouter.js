const express = require('express')
const db = require('../mydb')
const router = express.Router()
const { readFile, promises: fsPromises, readFileSync } = require('fs')

router.get("/", function (request, response) {
    response.render("contactPage.hbs")
})

router.get("/contactRequests", function (request, response) {
    const authorizationError = []

    if (!request.session.isLoggedIn) {
        authorizationError.push("This function is limited for admin only. Please log in to access this.")
        const model = {
            authorizationError
        }
        response.render("contactRequests.hbs", model)
    }

    db.getAllContactRequests(function (error, contactRequests) {
        if (error) {
            const model = {
                databaseError: true
            }
            response.render("contactRequests.hbs", model)
        } else {
            const model = {
                databaseError: false,
                contactRequests,
                csrfToken: request.csrfToken()
            }
            response.render("contactRequests.hbs", model)
        }
    })
}) //Tested done

router.post("/", function (request, response) {

    const contactName = request.body.contactName
    const contactEmail = request.body.contactEmail
    const contactTel = request.body.contactTel
    const requestSubject = request.body.requestSubject
    const requestContent = request.body.requestContent

    const validationErrors = []

    if (contactName == "" || contactEmail == ""
        || contactTel == "" || requestSubject == ""
        || requestContent == "") {
        validationErrors.push("All fields must be filled!")
    } else if (isNaN(contactTel)) {
        validationErrors.push("Please enter a phone number")
    }

    if (validationErrors.length > 0) {
        const model = {
            validationErrors,
            contactName,
            contactEmail,
            contactTel,
            requestSubject,
            requestContent
        }
        response.render("contactPage.hbs", model)
        return
    }

    db.createContactRequest(contactName, contactEmail, contactTel, requestSubject, requestContent, function (error) {
        if (error) {
            const model = {
                databaseError: true
            }
            response.render("contactPage.hbs", model)
        } else {
            response.redirect("/contactPage/confirmationContact")
        }
    })

}) //Tested done

router.get("/confirmationContact", function (request, response) {

    // function syncReadFile(ContactReqConfirm) {
    //     const contents = readFileSync(ContactReqConfirm, 'utf-8')
    //     const array = contents.split()
    //     return array
    // }

    const contentRead = readFileSync('./ContactReqConfirm.txt')
    const model = {
        contentRead
    }
    response.render("confirmationContact.hbs", model)
}) //Tested done


router.post("/deleteRequest/:contactReqID", function (request, response) {

    const contactReqID = request.params.contactReqID

    if (!request.session.isLoggedIn) {
        const authorizationError = []

        authorizationError.push("This function is limited for admin only. Please log in to access this.")
        const model = {
            authorizationError
        }
        response.render("contactRequests.hbs", model)
        return
    }

    db.deleteRequestByID(contactReqID, function (error) {
        if (error) {
            const model = {
                databaseError: true
            }
            response.render("contactRequests.hbs", model)
        } else {
            response.redirect("/contactPage/contactRequests")
        }
    })

}) //Tested done

module.exports = router
