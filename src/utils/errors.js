export class EntradaInvalidaError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.status = 400;
  }
}

export class NaoEncontradoError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.status = 404;
  }
}

export class DuplicidadeError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.status = 409;
  }
}

export class RegraDeNegocioError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.status = 422;
  }
}
