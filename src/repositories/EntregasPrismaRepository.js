const INCLUIR_HISTORICO = { historico: { orderBy: { id: 'asc' } } };

function idValido(id) {
  return Number.isInteger(id) && id > 0 && id <= 2147483647;
}

function paraEntrega(registro) {
  if (!registro) {
    return null;
  }
  return {
    ...registro,
    historico: registro.historico.map((evento) => ({
      data: evento.data.toISOString(),
      descricao: evento.descricao,
    })),
  };
}

function paraEventoDb(evento) {
  return { data: new Date(evento.data), descricao: evento.descricao };
}

/** @implements {import('./contratos.js').IEntregasRepository} */
export class EntregasPrismaRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async listarTodos(filtros = {}) {
    const { status, motoristaId } = filtros;
    const registros = await this.prisma.entrega.findMany({
      where: {
        ...(status !== undefined && { status }),
        ...(motoristaId !== undefined && { motoristaId }),
      },
      include: INCLUIR_HISTORICO,
      orderBy: { id: 'asc' },
    });
    return registros.map(paraEntrega);
  }

  async buscarPorId(id) {
    if (!idValido(id)) {
      return null;
    }
    const registro = await this.prisma.entrega.findUnique({
      where: { id },
      include: INCLUIR_HISTORICO,
    });
    return paraEntrega(registro);
  }

  async criar({ historico = [], ...dados }) {
    const registro = await this.prisma.entrega.create({
      data: { ...dados, historico: { create: historico.map(paraEventoDb) } },
      include: INCLUIR_HISTORICO,
    });
    return paraEntrega(registro);
  }

  async atualizar(id, { historico, ...dados }) {
    if (!idValido(id)) {
      return null;
    }
    try {
      const registro = await this.prisma.$transaction(async (tx) => {
        await tx.entrega.update({ where: { id }, data: dados });
        if (historico) {
          await tx.evento.deleteMany({ where: { entregaId: id } });
          await tx.evento.createMany({
            data: historico.map((evento) => ({ entregaId: id, ...paraEventoDb(evento) })),
          });
        }
        return tx.entrega.findUnique({ where: { id }, include: INCLUIR_HISTORICO });
      });
      return paraEntrega(registro);
    } catch (erro) {
      if (erro.code === 'P2025') {
        return null;
      }
      throw erro;
    }
  }
}
