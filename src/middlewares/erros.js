export function naoEncontrado(req, res) {
  res.status(404).render('erro', { titulo: 'Página não encontrada', status: 404, mensagem: 'A página que você procura não existe.' });
}

export function tratarErros(erro, req, res, next) {
  const status = erro.status || 500;
  const mensagem = status === 500 ? 'Ocorreu um erro inesperado no servidor.' : erro.message;
  if (status === 500) {
    console.error(erro);
  }
  res.status(status).render('erro', { titulo: status === 404 ? 'Não encontrado' : 'Erro', status, mensagem });
}
