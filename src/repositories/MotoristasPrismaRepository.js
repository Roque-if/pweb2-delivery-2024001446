function idValido(id) {
  return Number.isInteger(id) && id > 0 && id <= 2147483647;
}

/** @implements {import('./contratos.js').IMotoristasRepository} */
export class MotoristasPrismaRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  listarTodos() {
    return this.prisma.motorista.findMany({ orderBy: { id: 'asc' } });
  }

  async buscarPorId(id) {
    if (!idValido(id)) {
      return null;
    }
    return this.prisma.motorista.findUnique({ where: { id } });
  }

  buscarPorCpf(cpf) {
    return this.prisma.motorista.findUnique({ where: { cpf } });
  }

  criar(dados) {
    return this.prisma.motorista.create({ data: dados });
  }
}
