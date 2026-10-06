/** @implements {import('./contratos.js').IMotoristasRepository} */
export class MotoristasRepository {
  constructor(database) {
    this.database = database;
  }

  listarTodos() {
    return this.database.motoristas;
  }

  buscarPorId(id) {
    return this.database.motoristas.find((motorista) => motorista.id === id) ?? null;
  }

  buscarPorCpf(cpf) {
    return this.database.motoristas.find((motorista) => motorista.cpf === cpf) ?? null;
  }

  criar(dados) {
    const motorista = { id: this.database.nextMotoristaId++, ...dados };
    this.database.motoristas.push(motorista);
    return motorista;
  }
}
