import { DuplicidadeError, EntradaInvalidaError, NaoEncontradoError, RegraDeNegocioError } from '../utils/errors.js';

const PROXIMO_STATUS = {
  CRIADA: 'EM_TRANSITO',
  EM_TRANSITO: 'ENTREGUE',
};

const STATUS_FINAIS = ['ENTREGUE', 'CANCELADA'];

function novoEvento(descricao) {
  return { data: new Date().toISOString(), descricao };
}

export class EntregasService {
  /**
   * @param {import('../repositories/contratos.js').IEntregasRepository} entregasRepo
   * @param {import('../repositories/contratos.js').IMotoristasRepository} motoristasRepo
   */
  constructor(entregasRepo, motoristasRepo) {
    this.entregasRepo = entregasRepo;
    this.motoristasRepo = motoristasRepo;
  }

  criar({ descricao, origem, destino }) {
    if (!descricao || !origem || !destino) {
      throw new EntradaInvalidaError('descricao, origem e destino são obrigatórios');
    }
    if (origem === destino) {
      throw new EntradaInvalidaError('origem e destino não podem ser iguais');
    }

    const duplicada = this.entregasRepo
      .listarTodos()
      .find(
        (entrega) =>
          entrega.descricao === descricao &&
          entrega.origem === origem &&
          entrega.destino === destino &&
          !STATUS_FINAIS.includes(entrega.status),
      );
    if (duplicada) {
      throw new DuplicidadeError('já existe uma entrega ativa com essa descrição, origem e destino');
    }

    return this.entregasRepo.criar({
      descricao,
      origem,
      destino,
      status: 'CRIADA',
      motoristaId: null,
      historico: [novoEvento('Entrega criada')],
    });
  }

  listar(status) {
    return this.entregasRepo.listarTodos(status ? { status } : {});
  }

  buscarPorId(id) {
    const entrega = this.entregasRepo.buscarPorId(id);
    if (!entrega) {
      throw new NaoEncontradoError('entrega não encontrada');
    }
    return entrega;
  }

  avancar(id) {
    const entrega = this.buscarPorId(id);
    const proximoStatus = PROXIMO_STATUS[entrega.status];
    if (!proximoStatus) {
      throw new RegraDeNegocioError('não é possível avançar essa entrega a partir do status atual');
    }

    return this.entregasRepo.atualizar(id, {
      status: proximoStatus,
      historico: [...entrega.historico, novoEvento(`Status alterado para ${proximoStatus}`)],
    });
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);
    if (STATUS_FINAIS.includes(entrega.status)) {
      throw new RegraDeNegocioError('entrega já finalizada não pode ser cancelada');
    }

    return this.entregasRepo.atualizar(id, {
      status: 'CANCELADA',
      historico: [...entrega.historico, novoEvento('Entrega cancelada')],
    });
  }

  atribuir(id, motoristaId) {
    if (motoristaId === undefined || motoristaId === null) {
      throw new EntradaInvalidaError('motoristaId é obrigatório');
    }

    const entrega = this.buscarPorId(id);
    const motorista = this.motoristasRepo.buscarPorId(Number(motoristaId));
    if (!motorista) {
      throw new NaoEncontradoError('motorista não encontrado');
    }
    if (entrega.status !== 'CRIADA') {
      throw new RegraDeNegocioError('só é possível atribuir motorista a uma entrega CRIADA');
    }
    if (motorista.status !== 'ATIVO') {
      throw new RegraDeNegocioError('motorista INATIVO não pode ser atribuído');
    }

    return this.entregasRepo.atualizar(id, {
      motoristaId: motorista.id,
      historico: [...entrega.historico, novoEvento(`Motorista ${motorista.nome} atribuído`)],
    });
  }

  buscarHistorico(id) {
    return this.buscarPorId(id).historico;
  }
}
