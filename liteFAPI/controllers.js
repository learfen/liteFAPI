/*
    ¿Como usar?
    Una carpeta llamada controllers
    controllers/
        students/
            view.js
            all.js
            books/
                all.js
                get.js
                stock-post.js
                stock-update.js
                stock.js
            books.js

    Las rutas que se crearan son

    /students/all
    /students/books/:books/all
    /students/books/:books/get

    :books es creado porque exite el archivo books.js en la misma carpeta que el directorio/carpeta book

    ¿Metodos?
    method por defecto es get
    action-method.js como el ejemplo stock dentro de books
*/
const fs = require("fs"), path = require("path");
module.exports = (app , config = {}) => {
        const urls = new Set
        var dirsEntity = []
        var actions = []

        function flatten(lists) { return lists.reduce((a, b) => a.concat(b), []) }
        function getDirectoriesRecursive(srcpath) { return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))] }
        function getDirectories(srcpath) {
            return fs.readdirSync(srcpath)
                .map(file => path.join(srcpath, file))
                .filter(path => {
                    if(fs.statSync(path).isDirectory()){
                        if(fs.existsSync(`${path}/../${path.split('/').pop()}.js`))
                            dirsEntity.push(path)
                        return true
                    }else{
                        if(!fs.existsSync(path.replace('.js', ''))){
                            let pathParent = path.split("/")
                            pathParent.pop()
                            pathParent = pathParent.join('/')
                            actions[pathParent] = actions[pathParent] == undefined  ? [ path.split('/').pop().replace('.js','') ] : [ ...actions[pathParent] ,  path.split('/').pop().replace('.js','') ]
                        }
                    }
                    return false
                    })
        }

        const paths = getDirectoriesRecursive('controllers')
        paths.forEach( val => {
            let url = dirsEntity.indexOf(val) > -1 ? val+'/:'+val.split('/').pop() : val
            if(actions[val] != undefined){
                actions[val].forEach( callback => {
                    let method = callback.search('-') > -1 ? callback.split('-')[1] : 'get'
                    let action = callback.search('-') > -1 ? callback.split('-')[0] : callback
                    let urlAction = url.replace('controllers','') + "/" + action
                    let callbackFn = require("./"+val+"/"+callback)
                    urls.add({ url:urlAction , method })
                    app[method]( urlAction , callbackFn)
                })
            }
        })

        if('jsonFileActive' in config){
            fs.writeFileSync('api.json' , JSON.stringify(Array.from(urls) ))
        }
        return Array.from(urls)
    }
