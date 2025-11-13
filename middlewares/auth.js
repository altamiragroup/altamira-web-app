module.exports = {
  cliente: (req, res, next) => {
    if (req.session.user.tipo == 'cliente' || req.session.user.tipo == 'prueba') {
      return next();
    } else {
      res.status(401).send('No posees permisos para ver esta sección');
    }
  },
  prueba: (req, res, next) => {
    if (req.session.user.tipo == 'prueba') {
      return next();
    } else {
      res.status(401).send('No posees permisos para ver esta sección');
    }
  },
  viajante: (req, res, next) => {
    if (req.session.user.tipo == 'viajante') {
      return next();
    } else {
      res.status(401).send('No posees permisos para ver esta sección');
    }
  },
  admin: (req, res, next) => {
    if (req.session.user.tipo == 'admin') {
      return next();
    } else {
      res.status(401).send('No posees permisos para ver esta sección');
    }
  },
}