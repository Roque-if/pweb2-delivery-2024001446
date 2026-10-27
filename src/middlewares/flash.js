export function mensagensFlash(req, res, next) {
  res.locals.sucesso = req.flash('sucesso');
  res.locals.erro = req.flash('erro');
  next();
}
