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
const dotenv = require('dotenv');

// ENV variable config
const result = dotenv.config()
if(result.error) throw result.error
// Express()
const app = express();

// compress all responses
app.use(compression());

// Middlewares
app.use(express.static(path.join(__dirname, 'public'),{ maxAge : 7 * 24 * 3600 * 1000}));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

const { SECRET_SESSION, MONGO_URL_CONNECT } = process.env

app.use(session({
	store: new MongoStore({ url: MONGO_URL_CONNECT }),
	secret: SECRET_SESSION, 
	saveUninitialized: false, 
	resave: true,
	unset:'destroy'
}));

// Custom Middlewares
app.use(validarCookie);

// CORS
app.use(cors());

// Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routers
const mainRouter = require("./routes/main");
const catalogoRouter = require("./routes/catalogo");
const clientesRouter = require("./routes/clientes");
const viajantesRouter = require("./routes/viajantes");
const adminRouter = require("./routes/admin");

app.use("/", mainRouter);
app.use("/catalogo", catalogoRouter);
app.use("/catalogos", catalogoRouter);
app.use("/clientes", clientesRouter);
app.use("/viajantes", viajantesRouter);
app.use("/admin", adminRouter);

// API
const APIcomprobantes = require("./Api/v1/routes/comprobantes");
const APIarticulos = require("./Api/v1/routes/articulos");
const APIcarrito = require("./Api/v1/routes/carrito");
const APIviajantes = require("./Api/v1/routes/viajantes");

app.use("/api/comprobantes", APIcomprobantes);
app.use("/api/articulos", APIarticulos);
app.use("/api/carrito", APIcarrito);
app.use("/api/viajantes", APIviajantes);

const v2usuarios = require('./Api/v2/routes/usuarios');
const v2clientes = require('./Api/v2/routes/clientes');
const v2comprobantes = require('./Api/v2/routes/comprobantes');
const v2pedidos = require('./Api/v2/routes/pedidos');
const v2pendientes = require('./Api/v2/routes/pendientes');
const v2viajantes = require('./Api/v2/routes/viajantes');
const v2articulos = require('./Api/v2/routes/articulos');
const v2carritos = require('./Api/v2/routes/carritos');
const v2lineas = require('./Api/v2/routes/lineas');
const v2rubros = require('./Api/v2/routes/rubros');

app.use('/api/v2/usuarios', v2usuarios);
app.use('/api/v2/clientes', v2clientes);
app.use('/api/v2/comprobantes', v2comprobantes);
app.use('/api/v2/pedidos', v2pedidos);
app.use('/api/v2/pendientes', v2pendientes);
app.use('/api/v2/viajantes', v2viajantes);
app.use('/api/v2/articulos', v2articulos);
app.use('/api/v2/carritos', v2carritos);
app.use('/api/v2/lineas', v2lineas);
app.use('/api/v2/rubros', v2rubros);

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
