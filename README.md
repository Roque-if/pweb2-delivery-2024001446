# Delivery Tracker — Exercício do Capítulo 4

> **Programação Web II — IFAL/Maceió.** Este é o **projeto do semestre** (avaliado). No Cap. 4 você
> inicia a **Delivery Tracker API** com **arquitetura em camadas** e, depois, **Repository Pattern +
> injeção de dependência**. A correção é **automática** (autograder de conformidade) + arquitetura.

## Como usar este repositório

1. Clique em **"Use this template"** e crie **`pweb2-delivery-<matricula>`** (ex.: `pweb2-delivery-20231012345`).
   Este é o repositório que você usará o **semestre inteiro** (evolui a cada capítulo).
2. Clone, instale e rode:
   ```bash
   npm install
   npm start                                        # http://localhost:3000
   # em outro terminal — autograder:
   npm run check                                    # = BASE_URL=http://localhost:3000 node autograder/check.mjs
   ```
3. A cada `git push`, o **GitHub Actions** roda o autograder e mostra a nota na aba **Actions**
   (resumo do job). O `autograder/check.mjs` é **aberto** — leia para saber exatamente o que se espera.

## O que implementar (em `src/`)

```
src/
├── controllers/   # traduz HTTP ↔ service (sem regra de negócio)
├── services/      # TODA a regra de negócio
├── repositories/  # só acesso a dados
├── database/      # persistência SIMULADA em memória (sem banco real, sem ORM)
├── routes/        # composição das dependências (injeção) + monta em /api
└── utils/
```

- **Regra de negócio só no Service.** Injeção de dependência no **composition root** (`src/routes`).
- O `server.js` só configura o app (já traz o `GET /api/health` exigido — não remova).

## Duas etapas (ver os enunciados completos)

- **Atividade 05 — Entregas em camadas:** CRUD de `/api/entregas`, ciclo de status
  (`CRIADA → EM_TRANSITO → ENTREGUE`/`CANCELADA`), histórico. Meta: checagens de **Entregas** verdes.
- **Atividade 06 — Motoristas + Contratos + DI:** `/api/motoristas`, atribuição de motorista,
  contratos de repository (JSDoc) e composição num ponto único. Meta: **122/122**.

> O critério de **inversão de dependência** é verificado pelo professor **trocando o repository por
> um Mock** que respeita o contrato — programe contra o contrato desde o início.

## Contrato (resumo)

- Base `/api` · JSON · erro `{ "erro": "..." }` · `GET /api/health` → `{ "status": "ok" }`.
- Status: `201` criar · `400` entrada inválida · `404` não encontrado · `409` unicidade
  (duplicata/CPF) · `422` regra de estado (transição/atribuição inválida).
- Execução: `npm start`, respeita `process.env.PORT`, branch `main`.

Faça **um commit por avanço** (Conventional Commits, ex.: `feat(entregas): valida origem ≠ destino`).
Bom trabalho! 🚀

## Exemplos de uso (curl)

```bash
# criar entrega
curl -X POST http://localhost:3000/api/entregas \
  -H "Content-Type: application/json" \
  -d '{"descricao":"Pacote 1","origem":"Maceió","destino":"Arapiraca"}'

# listar entregas
curl http://localhost:3000/api/entregas

# listar entregas filtrando por status
curl "http://localhost:3000/api/entregas?status=CRIADA"

# buscar uma entrega por id
curl http://localhost:3000/api/entregas/1

# avançar o status (CRIADA -> EM_TRANSITO -> ENTREGUE)
curl -X PATCH http://localhost:3000/api/entregas/1/avancar

# cancelar uma entrega
curl -X PATCH http://localhost:3000/api/entregas/1/cancelar

# ver o histórico de uma entrega
curl http://localhost:3000/api/entregas/1/historico

# atribuir um motorista a uma entrega (só entrega CRIADA + motorista ATIVO)
curl -X PATCH http://localhost:3000/api/entregas/1/atribuir \
  -H "Content-Type: application/json" \
  -d '{"motoristaId":1}'

# cadastrar motorista
curl -X POST http://localhost:3000/api/motoristas \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","cpf":"123.456.789-00","placaVeiculo":"ABC1D23"}'

# listar motoristas / buscar um motorista
curl http://localhost:3000/api/motoristas
curl http://localhost:3000/api/motoristas/1

# entregas de um motorista (com filtro opcional por status)
curl http://localhost:3000/api/motoristas/1/entregas
curl "http://localhost:3000/api/motoristas/1/entregas?status=CRIADA"
```

## Rotas da API

| Método | Rota | Sucesso | Erros |
|---|---|---|---|
| GET | `/api/health` | 200 | - |
| POST | `/api/entregas` | 201 | 400 · 409 |
| GET | `/api/entregas` (`?status=`) | 200 | - |
| GET | `/api/entregas/:id` | 200 | 404 |
| PATCH | `/api/entregas/:id/avancar` | 200 | 404 · 422 |
| PATCH | `/api/entregas/:id/cancelar` | 200 | 404 · 422 |
| PATCH | `/api/entregas/:id/atribuir` | 200 | 400 · 404 · 422 |
| GET | `/api/entregas/:id/historico` | 200 | 404 |
| POST | `/api/motoristas` | 201 | 400 · 409 |
| GET | `/api/motoristas` | 200 | - |
| GET | `/api/motoristas/:id` | 200 | 404 |
| GET | `/api/motoristas/:id/entregas` (`?status=`) | 200 | 404 |

## Composição das dependências

Todo `new` acontece num único ponto, `criarRotas()` em `src/routes/index.js`. Os services
recebem os repositories pelo construtor e só conhecem os contratos documentados em
`src/repositories/contratos.js` (`IEntregasRepository` e `IMotoristasRepository`).

```
                      Database
                     /        \
        EntregasRepository   MotoristasRepository
             |        \         /        |
             |     EntregasService        |
             |           |                |
             |   EntregasController       |
             |                            |
             +----- MotoristasService ----+
                           |
                  MotoristasController
                           |
                    criarRotas() -> /api
```

`EntregasService` recebe `(entregasRepo, motoristasRepo)` e `MotoristasService` recebe
`(motoristasRepo, entregasRepo)`. A regra de motorista INATIVO não pode ser atribuído fica no
`EntregasService`.
