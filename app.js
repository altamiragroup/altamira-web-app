const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const express = require('express');
const session = require("express-session");
const mongoose = require('mongoose');
const MongoStore = require("connect-mongo")(session);
const validarCookie = require('./middlewares/validarCookie');
const cors = require('cors');
const compression = require('compression');

// Express()
const app = express();
// compress all responses
app.use(compression());

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
	store: new MongoStore({ url: 'mongodb://127.0.0.1/Altamira' }),
	secret: 'AltamiraSaenz351', 
	saveUninitialized: false, 
	resave: true,
	unset:'destroy'
}));

// Custom Middlewares
app.use(validarCookie);

// CORS
app.use(cors());

// Template Engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Routers
const mainRouter = require("./routes/main");
const catalogoRouter = require("./routes/catalogo");
const clientesRouter = require("./routes/clientes");
const viajantesRouter = require("./routes/viajantes");
const adminRouter = require("./routes/admin");
const APIcomprobantes = require("./Api/routes/comprobantes");
const APIarticulos = require("./Api/routes/articulos");
const APIcarrito = require("./Api/routes/carrito");

app.use("/", mainRouter);
app.use("/catalogo", catalogoRouter);
app.use("/catalogos", catalogoRouter);
app.use("/clientes", clientesRouter);
app.use("/viajantes", viajantesRouter);
app.use("/admin", adminRouter);

// API
app.use("/api/comprobantes", APIcomprobantes);
app.use("/api/articulos", APIarticulos);
app.use("/api/carrito", APIcarrito);

// Catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};	

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// Export App
module.exports = app;
