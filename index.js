/* write the code to run app.js here */
const app = require("./app");
const { colorConfig } = require("./helpers/colorHelper");
const { subject, status } = colorConfig

const port = process.env.PORT || 6060

app.listen(port, () => {
    const log = console.log
    log("")
    log(subject("App Is Listening On Port"), status(port))
    log("")
})