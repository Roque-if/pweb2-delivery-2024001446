/**
 * @typedef {Object} Evento
 * @property {string} data
 * @property {string} descricao
 */

/**
 * @typedef {Object} Entrega
 * @property {number} id
 * @property {string} descricao
 * @property {string} origem
 * @property {string} destino
 * @property {'CRIADA'|'EM_TRANSITO'|'ENTREGUE'|'CANCELADA'} status
 * @property {number|null} motoristaId
 * @property {Evento[]} historico
 */

/**
 * @typedef {Object} Motorista
 * @property {number} id
 * @property {string} nome
 * @property {string} cpf
 * @property {string|null} placaVeiculo
 * @property {'ATIVO'|'INATIVO'} status
 */

/**
 * Contrato de persistência de entregas. Os services só conhecem estes métodos.
 *
 * @typedef {Object} IEntregasRepository
 * @property {(filtros?: {status?: string, motoristaId?: number}) => Entrega[]} listarTodos
 * @property {(id: number) => Entrega|null} buscarPorId
 * @property {(dados: Omit<Entrega, 'id'>) => Entrega} criar
 * @property {(id: number, dados: Partial<Entrega>) => Entrega} atualizar
 */

/**
 * Contrato de persistência de motoristas.
 *
 * @typedef {Object} IMotoristasRepository
 * @property {() => Motorista[]} listarTodos
 * @property {(id: number) => Motorista|null} buscarPorId
 * @property {(cpf: string) => Motorista|null} buscarPorCpf
 * @property {(dados: Omit<Motorista, 'id'>) => Motorista} criar
 */

export {};
