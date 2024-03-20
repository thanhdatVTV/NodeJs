
const getHomepage = (req, res) => {
    //Process DATA => call Model
    res.render('sample.ejs')
}

const getABC = (req, res) => {
    res.send('getabc');
}

module.exports = {
    getHomepage, getABC
}
