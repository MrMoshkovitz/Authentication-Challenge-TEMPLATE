/* write the code to run app.js here */
const app = require("./app");
const { colorHelper } = require("./helpers/");
const { subject, status } = colorHelper.colorConfig

const port = process.env.PORT || 6060

app.listen(port, () => {
    const log = console.log
    log("")
    log(subject("App Is Listening On Port"), status(port))
    log("")
})