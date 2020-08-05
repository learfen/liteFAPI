// Abre automaticamente una pestaña 
const url = 'http://localhost:3000';
const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
const openBrowser = true
// express para manejar las rutas
var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// para que se creen solas las rutas
let urls = require('./controllers')( app , {jsonFileActive:true})

app.get('/', function(req, res) {
  let links = {
    html:'',
    template:`
      <li><a href="$url">[$method] $url</a></li>
    `
  }
  urls.forEach( item=> {
    let html = links.template
    for(let key in item){
      html = html.replace('$'+key , item[key]).replace('$'+key , item[key])
    }
    links.html += html
  })
  res.send(`<ul>${links.html}</ul>`);
});

// lanzamos el server
app.listen(3000, function() {
  console.log('>:v Soy LiteFAPI y corro en el puerto 3000!');
  // abre pestaña
  if(openBrowser)
    require('child_process').exec(start + ' ' + url);
});