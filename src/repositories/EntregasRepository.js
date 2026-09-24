export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  criar(dadosEntrega) {
    const entrega = { id: this.database.nextEntregaId++, ...dadosEntrega };
    this.database.entregas.push(entrega);
    return entrega;
  }

  listarTodas() {
    return this.database.entregas;
  }

  buscarPorId(id) {
    return this.database.entregas.find((entrega) => entrega.id === id);
  }

  buscarAtivaPorChave(descricao, origem, destino) {
    return this.database.entregas.find(
      (entrega) =>
        entrega.descricao === descricao &&
        entrega.origem === origem &&
        entrega.destino === destino &&
        entrega.status !== 'ENTREGUE' &&
        entrega.status !== 'CANCELADA',
    );
  }
}
