export class MotoristasController {
  constructor(service) {
    this.service = service;
  }

  criar = async (req, res, next) => {
    try {
      const motorista = await this.service.criar(req.body || {});
      res.status(201).json(motorista);
    } catch (erro) {
      next(erro);
    }
  };

  listar = async (req, res, next) => {
    try {
      res.status(200).json(await this.service.listar());
    } catch (erro) {
      next(erro);
    }
  };

  buscarPorId = async (req, res, next) => {
    try {
      const motorista = await this.service.buscarPorId(Number(req.params.id));
      res.status(200).json(motorista);
    } catch (erro) {
      next(erro);
    }
  };

  listarEntregas = async (req, res, next) => {
    try {
      const entregas = await this.service.listarEntregas(Number(req.params.id), req.query.status);
      res.status(200).json(entregas);
    } catch (erro) {
      next(erro);
    }
  };
}
