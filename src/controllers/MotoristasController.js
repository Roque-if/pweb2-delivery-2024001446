import { validationResult } from 'express-validator';

export class MotoristasController {
  constructor(service) {
    this.service = service;
  }

  listar = async (req, res, next) => {
    try {
      const motoristas = await this.service.listar();
      res.render('motoristas/index', { titulo: 'Motoristas', motoristas });
    } catch (erro) {
      next(erro);
    }
  };

  novo = (req, res) => {
    res.render('motoristas/novo', { titulo: 'Novo Motorista', erros: [], valores: {} });
  };

  criar = async (req, res, next) => {
    const { nome, cpf, placaVeiculo } = req.body;
    const valores = { nome, cpf, placaVeiculo };

    const invalidos = validationResult(req);
    if (!invalidos.isEmpty()) {
      const erros = invalidos.array().map((e) => e.msg);
      return res.status(400).render('motoristas/novo', { titulo: 'Novo Motorista', erros, valores });
    }

    try {
      await this.service.criar(valores);
      req.flash('sucesso', 'Motorista cadastrado com sucesso!');
      res.redirect('/motoristas');
    } catch (erro) {
      if (erro.status === 400 || erro.status === 409) {
        return res.status(erro.status).render('motoristas/novo', { titulo: 'Novo Motorista', erros: [erro.message], valores });
      }
      next(erro);
    }
  };
}
