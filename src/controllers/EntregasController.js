import { validationResult } from 'express-validator';

const STATUS_DISPONIVEIS = ['CRIADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA'];

export class EntregasController {
  constructor(service, motoristasService) {
    this.service = service;
    this.motoristasService = motoristasService;
  }

  listar = async (req, res, next) => {
    try {
      const filtro = typeof req.query.status === 'string' ? req.query.status : '';
      const entregas = await this.service.listar(filtro);
      res.render('entregas/index', { titulo: 'Entregas', entregas, filtro, statusDisponiveis: STATUS_DISPONIVEIS });
    } catch (erro) {
      next(erro);
    }
  };

  nova = (req, res) => {
    res.render('entregas/nova', { titulo: 'Nova Entrega', erros: [], valores: {} });
  };

  criar = async (req, res, next) => {
    const { descricao, origem, destino } = req.body;
    const valores = { descricao, origem, destino };

    const invalidos = validationResult(req);
    if (!invalidos.isEmpty()) {
      const erros = invalidos.array().map((e) => e.msg);
      return res.status(400).render('entregas/nova', { titulo: 'Nova Entrega', erros, valores });
    }

    try {
      await this.service.criar(valores);
      req.flash('sucesso', 'Entrega criada com sucesso!');
      res.redirect('/entregas');
    } catch (erro) {
      if (erro.status === 400 || erro.status === 409) {
        return res.status(erro.status).render('entregas/nova', { titulo: 'Nova Entrega', erros: [erro.message], valores });
      }
      next(erro);
    }
  };

  mostrar = async (req, res, next) => {
    try {
      const entrega = await this.service.buscarPorId(Number(req.params.id));
      const motoristas = await this.motoristasService.listar();
      const motorista = motoristas.find((m) => m.id === entrega.motoristaId) || null;
      const motoristasAtivos = motoristas.filter((m) => m.status === 'ATIVO');
      res.render('entregas/show', { titulo: `Entrega #${entrega.id}`, entrega, motorista, motoristasAtivos });
    } catch (erro) {
      next(erro);
    }
  };

  avancar = (req, res, next) =>
    this.executar(req, res, next, (id) => this.service.avancar(id), 'Status da entrega avançado com sucesso!');

  cancelar = (req, res, next) =>
    this.executar(req, res, next, (id) => this.service.cancelar(id), 'Entrega cancelada.');

  atribuir = (req, res, next) => {
    const invalidos = validationResult(req);
    if (!invalidos.isEmpty()) {
      req.flash('erro', invalidos.array()[0].msg);
      return res.redirect(`/entregas/${req.params.id}`);
    }
    return this.executar(
      req,
      res,
      next,
      (id) => this.service.atribuir(id, req.body.motoristaId),
      'Motorista atribuído com sucesso!',
    );
  };

  async executar(req, res, next, acao, mensagemSucesso) {
    const id = Number(req.params.id);
    try {
      await acao(id);
      req.flash('sucesso', mensagemSucesso);
      res.redirect(`/entregas/${id}`);
    } catch (erro) {
      if (erro.status && erro.status !== 404 && erro.status < 500) {
        req.flash('erro', erro.message);
        return res.redirect(`/entregas/${id}`);
      }
      next(erro);
    }
  }
}
