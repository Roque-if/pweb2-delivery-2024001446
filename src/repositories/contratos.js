/**
 * Os métodos podem devolver o valor direto (repository em memória) ou uma Promise (Prisma).
 * Os services sempre usam `await`, então funcionam com os dois.
 *
 * @template T
 * @typedef {T | Promise<T>} Resultado
 */

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
 * @property {(filtros?: {status?: string, motoristaId?: number}) => Resultado<Entrega[]>} listarTodos
 * @property {(id: number) => Resultado<Entrega|null>} buscarPorId
 * @property {(dados: Omit<Entrega, 'id'>) => Resultado<Entrega>} criar
 * @property {(id: number, dados: Partial<Entrega>) => Resultado<Entrega>} atualizar
 */

/**
 * Contrato de persistência de motoristas.
 *
 * @typedef {Object} IMotoristasRepository
 * @property {() => Resultado<Motorista[]>} listarTodos
 * @property {(id: number) => Resultado<Motorista|null>} buscarPorId
 * @property {(cpf: string) => Resultado<Motorista|null>} buscarPorCpf
 * @property {(dados: Omit<Motorista, 'id'>) => Resultado<Motorista>} criar
 */

export {};
