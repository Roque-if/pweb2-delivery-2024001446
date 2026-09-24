import { DuplicidadeError, EntradaInvalidaError, NaoEncontradoError, RegraDeNegocioError } from '../utils/errors.js';

const PROXIMO_STATUS = {
  CRIADA: 'EM_TRANSITO',
  EM_TRANSITO: 'ENTREGUE',
};

export class EntregasService {
  constructor(repository) {
    this.repository = repository;
  }

  criar({ descricao, origem, destino }) {
    if (!descricao || !origem || !destino) {
      throw new EntradaInvalidaError('descricao, origem e destino são obrigatórios');
    }
    if (origem === destino) {
      throw new EntradaInvalidaError('origem e destino não podem ser iguais');
    }
    if (this.repository.buscarAtivaPorChave(descricao, origem, destino)) {
      throw new DuplicidadeError('já existe uma entrega ativa com essa descrição, origem e destino');
    }

    return this.repository.criar({
      descricao,
      origem,
      destino,
      status: 'CRIADA',
      motoristaId: null,
      historico: [{ data: new Date().toISOString(), descricao: 'Entrega criada' }],
    });
  }

  listar(status) {
    const entregas = this.repository.listarTodas();
    return status ? entregas.filter((entrega) => entrega.status === status) : entregas;
  }

  buscarPorId(id) {
    const entrega = this.repository.buscarPorId(id);
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

    entrega.status = proximoStatus;
    entrega.historico.push({ data: new Date().toISOString(), descricao: `Status alterado para ${proximoStatus}` });
    return entrega;
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);
    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      throw new RegraDeNegocioError('entrega já finalizada não pode ser cancelada');
    }

    entrega.status = 'CANCELADA';
    entrega.historico.push({ data: new Date().toISOString(), descricao: 'Entrega cancelada' });
    return entrega;
  }

  buscarHistorico(id) {
    return this.buscarPorId(id).historico;
  }
}
