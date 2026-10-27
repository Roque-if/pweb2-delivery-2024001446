import { Router } from 'express';
import { prisma } from '../config/database.js';
import { EntregasPrismaRepository } from '../repositories/EntregasPrismaRepository.js';
import { MotoristasPrismaRepository } from '../repositories/MotoristasPrismaRepository.js';
import { EntregasService } from '../services/EntregasService.js';
import { MotoristasService } from '../services/MotoristasService.js';
import { EntregasController } from '../controllers/EntregasController.js';
import { MotoristasController } from '../controllers/MotoristasController.js';
import { validarAtribuicao, validarEntrega, validarMotorista } from '../middlewares/validacoes.js';

export function criarRotas() {
  const router = Router();

  const entregasRepo = new EntregasPrismaRepository(prisma);
  const motoristasRepo = new MotoristasPrismaRepository(prisma);
  const entregasService = new EntregasService(entregasRepo, motoristasRepo);
  const motoristasService = new MotoristasService(motoristasRepo, entregasRepo);
  const entregasController = new EntregasController(entregasService, motoristasService);
  const motoristasController = new MotoristasController(motoristasService);

  router.get('/', (req, res) => res.redirect('/entregas'));

  router.get('/entregas', entregasController.listar);
  router.get('/entregas/nova', entregasController.nova);
  router.post('/entregas', validarEntrega, entregasController.criar);
  router.get('/entregas/:id', entregasController.mostrar);
  router.patch('/entregas/:id/avancar', entregasController.avancar);
  router.patch('/entregas/:id/cancelar', entregasController.cancelar);
  router.patch('/entregas/:id/atribuir', validarAtribuicao, entregasController.atribuir);

  router.get('/motoristas', motoristasController.listar);
  router.get('/motoristas/novo', motoristasController.novo);
  router.post('/motoristas', validarMotorista, motoristasController.criar);

  return router;
}
