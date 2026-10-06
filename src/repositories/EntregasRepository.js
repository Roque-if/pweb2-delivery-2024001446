/** @implements {import('./contratos.js').IEntregasRepository} */
export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  listarTodos(filtros = {}) {
    const { status, motoristaId } = filtros;
    return this.database.entregas.filter(
      (entrega) =>
        (status === undefined || entrega.status === status) &&
        (motoristaId === undefined || entrega.motoristaId === motoristaId),
    );
  }

  buscarPorId(id) {
    return this.database.entregas.find((entrega) => entrega.id === id) ?? null;
  }

  criar(dados) {
    const entrega = { id: this.database.nextEntregaId++, ...dados };
    this.database.entregas.push(entrega);
    return entrega;
  }

  atualizar(id, dados) {
    const entrega = this.buscarPorId(id);
    if (!entrega) {
      return null;
    }
    return Object.assign(entrega, dados);
  }
}
