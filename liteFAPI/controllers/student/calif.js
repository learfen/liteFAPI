module.exports = req =>{
    return { calif: +req.params.calif < 6 ? 'Reprobado' : 'Aprobado' }
}