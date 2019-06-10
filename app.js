const express=require('express');
const path=require('path');
const app= express();
const mongoose = require('mongoose');
const passport=require('passport');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const port=process.env.PORT || 3000;

const ideas=require('./routes/ideas');
const users=require('./routes/users');

require('./config/passport')(passport)

const db=require('./config/database');
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, {useNewUrlParser: true})
.then(() => {
    console.log('MongoDb connected...');
})
.catch(err => console.log(err));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    
    next();
});








app.get('/',(req,res) => {
    let title='WELCOME';
    res.render('index',{title:title});
});
app.get('/about',(req,res) => {
    res.render('about');
});







app.use('/ideas',ideas);
app.use('/users',users);

app.listen(port, ()=>{
console.log(`Server started on port : ${port}`);
});