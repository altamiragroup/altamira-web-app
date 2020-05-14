const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const express = require('express');
const session = require("express-session");
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
const validarCookie = require('./middlewares/validarCookie');
const cors = require('cors');

// Express()
const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
// Redis
redisClient.on("error", function(error) {
  console.error(error);
});

app.use(session({ 
	store: new redisStore({ client: redisClient }),
	secret: 'AltamiraSaenz351', 
	name: '_redisStorage',
	saveUninitialized: false, 
	resave: false,
}));

// Custom Middlewares
app.use(validarCookie);

// CORS
app.use(cors());
//app.use((req, res, next) => {
//	res.header('Access-Control-Allow-Origin' , '*');
//	res.header('Access-Control-Allow-Headers' , 'Authorization, X-API-KEY, Origin, X-Requested');
//	res.header('Access-Control-Allow-Methods' , 'GET, POST, OPTIONS, PUT, DELETE');
//	res.header('Allow' , 'GET, POST, OPTION, PUT, DELETE');
//	next()
//})

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

app.use("/", mainRouter);
app.use("/catalogo", catalogoRouter);
app.use("/catalogos", catalogoRouter);
app.use("/clientes", clientesRouter);
app.use("/viajantes", viajantesRouter);
app.use("/admin", adminRouter);

// API
app.use("/api/comprobantes", APIcomprobantes);
app.use("/api/articulos", APIarticulos);

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
