module.exports = (req, res)=>{
    let { calif } = require (__dirname +'/../calif.js')( req )
    res.json({calif})
}