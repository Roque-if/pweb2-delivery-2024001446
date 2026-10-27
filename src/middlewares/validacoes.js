import { body } from 'express-validator';

export const validarEntrega = [
  body('descricao').trim().notEmpty().withMessage('A descrição é obrigatória'),
  body('origem').trim().notEmpty().withMessage('A origem é obrigatória'),
  body('destino').trim().notEmpty().withMessage('O destino é obrigatório'),
];

export const validarMotorista = [
  body('nome').trim().notEmpty().withMessage('O nome é obrigatório'),
  body('cpf').trim().notEmpty().withMessage('O CPF é obrigatório'),
  body('placaVeiculo').trim(),
];

export const validarAtribuicao = [
  body('motoristaId').trim().notEmpty().withMessage('Selecione um motorista'),
];
