export class MotoristasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res, next) => {
    try {
      const motorista = this.service.criar(req.body || {});
      res.status(201).json(motorista);
    } catch (erro) {
      next(erro);
    }
  };

  listar = (req, res, next) => {
    try {
      res.status(200).json(this.service.listar());
    } catch (erro) {
      next(erro);
    }
  };

  buscarPorId = (req, res, next) => {
    try {
      const motorista = this.service.buscarPorId(Number(req.params.id));
      res.status(200).json(motorista);
    } catch (erro) {
      next(erro);
    }
  };

  listarEntregas = (req, res, next) => {
    try {
      const entregas = this.service.listarEntregas(Number(req.params.id), req.query.status);
      res.status(200).json(entregas);
    } catch (erro) {
      next(erro);
    }
  };
}
