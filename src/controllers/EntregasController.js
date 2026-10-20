export class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = async (req, res, next) => {
    try {
      const entrega = await this.service.criar(req.body || {});
      res.status(201).json(entrega);
    } catch (erro) {
      next(erro);
    }
  };

  listar = async (req, res, next) => {
    try {
      const entregas = await this.service.listar(req.query.status);
      res.status(200).json(entregas);
    } catch (erro) {
      next(erro);
    }
  };

  buscarPorId = async (req, res, next) => {
    try {
      const entrega = await this.service.buscarPorId(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  };

  avancar = async (req, res, next) => {
    try {
      const entrega = await this.service.avancar(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  };

  cancelar = async (req, res, next) => {
    try {
      const entrega = await this.service.cancelar(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  };

  atribuir = async (req, res, next) => {
    try {
      const { motoristaId } = req.body || {};
      const entrega = await this.service.atribuir(Number(req.params.id), motoristaId);
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  };

  buscarHistorico = async (req, res, next) => {
    try {
      const historico = await this.service.buscarHistorico(Number(req.params.id));
      res.status(200).json(historico);
    } catch (erro) {
      next(erro);
    }
  };
}
