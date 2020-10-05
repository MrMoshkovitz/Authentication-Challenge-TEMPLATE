const chalk = require("chalk");
const morgan = require("morgan");

const getTime = require('./getTime')
let {getCurrentTime, getCurrentDate} = getTime


const font_colors = {
	"red": chalk.red,
	// red: 'red',
	"green": chalk.green,
	"blue": chalk.blue,
	"magenta": chalk.magenta,
	"orange": chalk.keyword('orange'),
	"black": chalk.rgb(0, 0, 0),
	"white": chalk.rgb(255,255,255)
};

const bg_colors = {
	"bgRed": chalk.bgRgb(128,0,0),
	"bgWhite": chalk.bgRgb(255,255,255),
	"bgBlack": chalk.bgRgb(0,0,0),
    "bgGreen": chalk.bgRgb(32,128,0),
    "bgMagenta": chalk.bgMagenta
};


const colorConfig = {
    method: (...args) => chalk.bold.red(...args),
	error: (...args) => chalk.rgb(255, 255, 255).bgRgb(128, 0, 0)(...args),
	signs: (...args) => chalk.rgb(32, 128, 0).bold(...args),
	success: (...args) => chalk.rgb(255, 255, 255).bgRgb(32, 128, 0)(...args),
	status: (...args) => chalk.bold.greenBright(...args),
	links: (...args) => chalk.bold.blue(...args),
	stage: (...args) => chalk.bold.bgRgb(0, 0, 255).inverse(...args),
	subject: (...args) => chalk.bold.magenta.bold(...args),
	text: (...args) => chalk.keyword("orange")(...args),
    impText: (...args) => chalk.keyword("orange").inverse(...args),
    font_colors: font_colors,
    bg_colors: bg_colors
}


//Print Colors Map
const colorsMap = (type) => {
    const {method,error,signs,success,status,links,stage,subject,text,impText,font_colors,bg_colors} = colorConfig;
    const logs = console.log
    switch (type) {
        case "special":
            logs("")
            logs(impText("Special Colors Mapping"))
        
            logs(
                method("Method"), " || ",
                error("error"), " || ",
                signs("signs"), " || ",
                success("success"), " || ",
                status("status"), " || ",
                links("links"), " || ",
                stage("stage"), " || ",
                subject("subject"), " || ",
                text("text"), " || ",
                impText("impText")
            );
            break;
        
        case "regular":
            logs("")
            logs(impText("Rgular Colors Mapping"))
            logs(
                font_colors.red("red"), " || ",
                font_colors.green("green"), " || ",
                font_colors.blue("blue"), " || ",
                font_colors.orange("orange"), " || ",
                font_colors.black("black"), " || ",
                font_colors.white("white"), " || ",
                font_colors.magenta("magenta")
            );
            break;

        case "background":
            logs("")
            logs(impText("Background Colors Mapping"))
            logs(
                bg_colors.bgRed("bgRed"), " || ",
                bg_colors.bgWhite("bgWhite"), " || ",
                bg_colors.bgBlack("bgBlack"), " || ",
                bg_colors.bgGreen("bgGreen"), " || ",
                bg_colors.bgMagenta("bgMagenta")
            );
            logs("")
            break;

        default:
            logs("")
            logs(stage("Special Colors Mapping"))
        
            logs(
                method("Method"), " || ",
                error("error"), " || ",
                signs("signs"), " || ",
                success("success"), " || ",
                status("status"), " || ",
                links("links"), " || ",
                stage("stage"), " || ",
                subject("subject"), " || ",
                text("text"), " || ",
                impText("impText")
            )
            logs("")
            logs(success("Rgular Colors Mapping"))
            logs(
                font_colors.red("red"), " || ",
                font_colors.green("green"), " || ",
                font_colors.blue("blue"), " || ",
                font_colors.orange("orange"), " || ",
                font_colors.black("black"), " || ",
                font_colors.white("white"), " || ",
                font_colors.magenta("magenta")
            );
            logs("")
            logs(impText("Background Colors Mapping"))
            logs(
                bg_colors.bgRed("bgRed"), " || ",
                bg_colors.bgWhite("bgWhite"), " || ",
                bg_colors.bgBlack("bgBlack"), " || ",
                bg_colors.bgGreen("bgGreen"), " || ",
                bg_colors.bgMagenta("bgMagenta")
            );
            logs("")
        break;
    }

}






morgan.token("protocol", function (req, res) {
	return req.protocol;
});

morgan.token("host", function (req, res) {
	return req.get('host');
});
morgan.token("time", function (req, res) {
	return getCurrentTime();
});
morgan.token("date", function (req, res) {
	return getCurrentDate();
});

morgan.token("body", function (req, res) {
	return req.body;
});

morgan.token('type', function (req, res) {
	return `content-type: ${req.headers['content-type']}` 
})


morgan.token("originalUrl", function (req, res) {
	return req.originalUrl;
});

const coloredMorgan = morgan((tokens, req, res) => {
    let { subject, method, signs, status, text, impText, links } = colorConfig
	let coloredLogArr = [
		subject(`Request: `),
		method(tokens.method(req, res)),
		signs("=>"),
		method(tokens["protocol"](req, res) + '://') + links(tokens["host"](req, res)) + links(tokens.url(req, res)),
		status(tokens.status(req, res)),
		" ",
		text(tokens["time"](req, res)),
		status(tokens["response-time"](req, res))+ text("ms"),
		text(tokens["date"](req, res)),
	]
	let coloredLogText;
	switch (tokens.method(req,res)) {
		case "POST":
			coloredLogArr[1] = status(tokens.method(req, res))
			coloredLogArr.push(impText(tokens["body"](req,res)))
			coloredLogText = coloredLogArr.join(" ")
			break;
		case "PUT":
			coloredLogArr[1] = subjet(tokens.method(req, res))
			coloredLogArr.push(impText(tokens["body"](req,res)))
			coloredLogText = coloredLogArr.join(" ")
			
			break;
		case "DELETE":
			coloredLogArr[1] = error(tokens.method(req, res))
			coloredLogText = coloredLogArr.join(" ")
		break;

		default:
			coloredLogText = coloredLogArr.join(" ")
		break;
	}
	return coloredLogText;
});




module.exports = {colorConfig, coloredMorgan, colorsMap}
