import { DuplicidadeError, EntradaInvalidaError, NaoEncontradoError } from '../utils/errors.js';

export class MotoristasService {
  /**
   * @param {import('../repositories/contratos.js').IMotoristasRepository} motoristasRepo
   * @param {import('../repositories/contratos.js').IEntregasRepository} entregasRepo
   */
  constructor(motoristasRepo, entregasRepo) {
    this.motoristasRepo = motoristasRepo;
    this.entregasRepo = entregasRepo;
  }

  criar({ nome, cpf, placaVeiculo }) {
    if (!nome || !cpf) {
      throw new EntradaInvalidaError('nome e cpf são obrigatórios');
    }
    if (this.motoristasRepo.buscarPorCpf(cpf)) {
      throw new DuplicidadeError(`já existe um motorista cadastrado com o CPF ${cpf}`);
    }

    return this.motoristasRepo.criar({
      nome,
      cpf,
      placaVeiculo: placaVeiculo || null,
      status: 'ATIVO',
    });
  }

  listar() {
    return this.motoristasRepo.listarTodos();
  }

  buscarPorId(id) {
    const motorista = this.motoristasRepo.buscarPorId(id);
    if (!motorista) {
      throw new NaoEncontradoError('motorista não encontrado');
    }
    return motorista;
  }

  listarEntregas(id, status) {
    this.buscarPorId(id);
    return this.entregasRepo.listarTodos(status ? { motoristaId: id, status } : { motoristaId: id });
  }
}
