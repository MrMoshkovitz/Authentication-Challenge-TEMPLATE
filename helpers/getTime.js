
 const getCurrentTime = () => {
    let [hour, minute, second] = ( new Date() ).toLocaleTimeString().slice(0,7).split(":")
    hour = hour > 10 ? hour : `0${hour}`
    second = second > 10 ? second : `0${second}`
    minute = minute > 10 ? minute : `0${minute}`
    // return (`${hours}:${minutes}:${seconds}`)
    return (`${hour}:${minute}:${second}`)
}
 const getCurrentDate = () => {
    let date = new Date()
    return(date.toLocaleDateString())
}



module.exports = { getCurrentTime, getCurrentDate }