import { Router } from 'express';
import { prisma } from '../config/database.js';
import { EntregasPrismaRepository } from '../repositories/EntregasPrismaRepository.js';
import { MotoristasPrismaRepository } from '../repositories/MotoristasPrismaRepository.js';
import { EntregasService } from '../services/EntregasService.js';
import { MotoristasService } from '../services/MotoristasService.js';
import { EntregasController } from '../controllers/EntregasController.js';
import { MotoristasController } from '../controllers/MotoristasController.js';

export function criarRotas() {
  const router = Router();

  const entregasRepo = new EntregasPrismaRepository(prisma);
  const motoristasRepo = new MotoristasPrismaRepository(prisma);
  const entregasService = new EntregasService(entregasRepo, motoristasRepo);
  const motoristasService = new MotoristasService(motoristasRepo, entregasRepo);
  const entregasController = new EntregasController(entregasService);
  const motoristasController = new MotoristasController(motoristasService);

  router.post('/entregas', entregasController.criar);
  router.get('/entregas', entregasController.listar);
  router.get('/entregas/:id/historico', entregasController.buscarHistorico);
  router.get('/entregas/:id', entregasController.buscarPorId);
  router.patch('/entregas/:id/avancar', entregasController.avancar);
  router.patch('/entregas/:id/cancelar', entregasController.cancelar);
  router.patch('/entregas/:id/atribuir', entregasController.atribuir);

  router.post('/motoristas', motoristasController.criar);
  router.get('/motoristas', motoristasController.listar);
  router.get('/motoristas/:id/entregas', motoristasController.listarEntregas);
  router.get('/motoristas/:id', motoristasController.buscarPorId);

  router.use((erro, req, res, next) => {
    res.status(erro.status || 500).json({ erro: erro.message || 'erro interno' });
  });

  return router;
}
