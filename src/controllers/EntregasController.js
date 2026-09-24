export class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res, next) => {
    try {
      const entrega = this.service.criar(req.body || {});
      res.status(201).json(entrega);
    } catch (erro) {
      next(erro);
    }
  };

  listar = (req, res, next) => {
    try {
      const entregas = this.service.listar(req.query.status);
      res.status(200).json(entregas);
    } catch (erro) {
      next(erro);
    }
  };

  buscarPorId = (req, res, next) => {
    try {
      const entrega = this.service.buscarPorId(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  };

  avancar = (req, res, next) => {
    try {
      const entrega = this.service.avancar(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  };

  cancelar = (req, res, next) => {
    try {
      const entrega = this.service.cancelar(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  };

  buscarHistorico = (req, res, next) => {
    try {
      const historico = this.service.buscarHistorico(Number(req.params.id));
      res.status(200).json(historico);
    } catch (erro) {
      next(erro);
    }
  };
}
