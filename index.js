let express = require('express');
let app = express();
var exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');
const moment = require("moment");
moment().format()
//const domlogic = require('./public/js/dom-logic');
//var actual = domlogic();
const settingsBill = SettingsBill();
//app.get("/", function(req, res){
  //res.send("Bill Settings WebApp " + Date());
//});
app.use(express.static("public"))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.engine('handlebars', exphbs({defaultLayout: "main", layoutsDir: 'views/layout'}));
app.set('view engine', 'handlebars');
app.get('/', function (req, res) {
 
    res.render('index', {
      settings: settingsBill.getSettings(),
      totals: settingsBill.totals(),
      level: settingsBill.levels(),
      change: settingsBill.change()
    });
    
    /*
    if(settingsBill.hasReachedWarningLevel()){
        actual.warningLevel()
    } else if(settingsBill.hasReachedCriticalLevel()){
      actual.dangerLevel()
    } */
});

app.get('/' , (req , res)=>{

})
app.post('/settings', (req, res)=>{
settingsBill.setSettings({
  callCost: req.body.callCost,
  smsCost: req.body.smsCost,
  warningLevel: req.body.warningLevel,
  criticalLevel: req.body.criticalLevel
})
res.redirect('/')
})
app.post('/action', (req, res)=>{
  settingsBill.recordAction(req.body.actionType)
  res.redirect('/')
})
app.get('/actions' , (req , res)=>{

const actions = settingsBill.actions()
for(let prop of actions){
  prop.ago = moment(prop.timestamp).fromNow()
}
res.render('actions', {actions: actions})
});

app.get('/actions/:actionType' , (req , res)=>{
  const actionType = req.params.actionType;
  const actions = settingsBill.actionsFor(actionType)
  for(let prop of actions){
    prop.ago = moment(prop.timestamp).fromNow()
  }
  res.render('actions', {actions: actions})
});

let PORT = process.env.PORT || 3009;

app.listen(PORT, function(){
  console.log("server started on port "+ PORT)
});