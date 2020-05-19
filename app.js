// ************ Require's ************
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const validarCookie = require('./middlewares/validarCookie');
// ************ express() - (don't touch) ************
const app = express();
// ************ Middlewares - (don't touch) ************
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(session({ 
	resave: true, 
	saveUninitialized: true, 
	secret: 'Altamira123'
	})
);
app.use(methodOverride('_method'));
app.use(validarCookie);
// ************ Template Engine - (don't touch) ************
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// ************ WRITE YOUR CODE FROM HERE ************

//--Traer los Routers y guardarlos en variables constantes--

const mainRouter = require("./routes/main");
const catalogoRouter = require("./routes/catalogo");
const clientesRouter = require("./routes/clientes");
const viajantesRouter = require("./routes/viajantes");
const adminRouter = require("./routes/admin");
const APIcomprobantes = require("./Api/routes/comprobantes");
const APIarticulos = require("./Api/routes/articulos");

// habilitar CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin' , '*');
	res.header('Access-Control-Allow-Headers' , 'Authorization, X-API-KEY, Origin, X-Requested');
	res.header('Access-Control-Allow-Methods' , 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow' , 'GET, POST, OPTION, PUT, DELETE');
	next()
})

// ROUTES
app.use("/", mainRouter);
app.use("/catalogo", catalogoRouter);
app.use("/catalogos", catalogoRouter);
app.use("/clientes", clientesRouter);
app.use("/viajantes", viajantesRouter);
app.use("/admin", adminRouter);

// API
app.use("/api/comprobantes", APIcomprobantes);
app.use("/api/articulos", APIarticulos);

// ************ DON'T TOUCH FROM HERE ************

// ************ catch 404 and forward to error handler ************
app.use(function(req, res, next) {
  next(createError(404));
});

// ************ error handler ************
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// ************ exports app - dont'touch ************
module.exports = app;
