# 4Ward: API de Gestão de Consultas para Fisioterapeutas

API criada para um aplicativo que conecta pacientes e fisioterapeutas. A pessoa cadastra um perfil com a possibilidade de ser fisioterapeuta/paciente. O fisioterapeuta cria o perfil profissional e os horários disponíveis. O paciente encontra um profissional, agenda uma consulta e pode cancelar ou remarcar. Depois do atendimento, o fisioterapeuta registra se a consulta foi realizada ou se o paciente faltou.

Projeto desenvolvido por Alberto Neto, Gabriel Trentini e Wesley Triches

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/WesleyTriches/4Ward.git
cd 4Ward
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o arquivo .env

O arquivo .env guarda as configurações sensíveis do projeto e não é enviado para o GitHub. Por isso, cada pessoa que clonar o repositório precisa criar o seu.

Crie um arquivo chamado .env na raiz do projeto com este conteúdo:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="troque-por-uma-frase-secreta-grande"
```
A frase pode ser qualquer uma, mas troque pois se não definido, a API usa um valor padrão de desenvolvimento.

### 4. Criar o banco de dados

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Iniciar a API

```bash
npm run start:dev
```

A API sobe em http://localhost:3000/api e reinicia sozinha a cada arquivo salvo.
## Autenticação

Todas as rotas exigem um token, exceto POST /auth/register e POST /auth/login.

1. Faça login (send request). A resposta traz um access_token.
2. Envie o token no cabeçalho de todas as outras requisições:

O token vale por 1 dia. Depois disso, a API responde 401 Token inválido ou expirado e é preciso fazer login de novo.



## Fluxo básico

### Fisioterapeuta
1)  Ele registra como PHYSIOTHERAPIST;
2) Gera um token;
3) Cria um profile;
4) Cria um perfil profissional (physiotherapists);
5) Cadastra os horários;
6) Se precisar cancelar/remarcar, a qualquer momento antes da consulta;
7) Ele vê a agenda;
8) Depois do atendimento ele coloca complete ou no-show.

### Paciente
1) Ele registra como PATIENT;
2) Gera um token;
3) Cria um profile;
4) Escolhe um fisioterapeuta;
5) Olha os horários livres do fisio escolhido;
6) Marca um horário que vira uma consulta;
7) Consegue ver os seus horários marcados.
8) Se precisar cancelar/remarcar, com pelo menos 24h de antecedência.

## Rotas

Todas as rotas começam com /api.
Apenas as rotas de autenticação são públicas. Todas as outras exigem o token no cabeçalho:
Authorization Bearer: <access_token>

### Autenticação

- POST /auth/register: cria um usuário e devolve o token.
- POST /auth/login: faz login e devolve o token.

### Usuários

- PUT /users/:id: atualiza o nome e o email do usuário.
- DELETE /users/:id: remove o usuário.

### Perfis

- POST /profiles: cria o perfil do usuário logado.
- GET /profiles/me: mostra o perfil do usuário logado.
- PUT /profiles/me: atualiza o perfil do usuário logado.

### Especialidades

- POST /specialties: cria uma especialidade.
- GET /specialties: lista todas as especialidades.
- GET /specialties/:id: mostra uma especialidade.
- PUT /specialties/:id: atualiza uma especialidade.
- DELETE /specialties/:id: remove uma especialidade.

### Fisioterapeutas

- POST /physiotherapists: cria o perfil profissional do usuário logado. Usada pelo fisioterapeuta.
- GET /physiotherapists: lista os fisioterapeutas.
- GET /physiotherapists/:id: mostra um fisioterapeuta.

### Horários

- POST /schedules: cadastra um horário disponível. Usada pelo fisioterapeuta.
- GET /schedules?physiotherapistId=X: lista os horários livres de um fisioterapeuta.

### Consultas

- POST /appointments: agenda uma consulta em um horário livre. Usada pelo paciente.
- GET /appointments/me: lista as consultas do usuário logado. O paciente vê as dele e o fisioterapeuta vê as dos seus pacientes.
- GET /appointments/me?status=X: igual à anterior, filtrando pelo status (SCHEDULED, COMPLETED, CANCELLED ou NO_SHOW).
- GET /appointments/:id: mostra uma consulta. Só o paciente e o fisioterapeuta da consulta têm acesso.
- PATCH /appointments/:id/cancel: cancela a consulta. Exige o campo cancelReason. Pode ser usada pelo paciente ou pelo fisioterapeuta da consulta.
- POST /appointments/:id/reschedule: remarca a consulta para outro horário do mesmo fisioterapeuta. Exige o campo newScheduleId. Pode ser usada pelo paciente ou pelo fisioterapeuta da consulta.
- PATCH /appointments/:id/complete: marca a consulta como realizada. Aceita o campo sessionNotes. Usada pelo fisioterapeuta da consulta.
- PATCH /appointments/:id/no-show: marca a falta do paciente. Usada pelo fisioterapeuta da consulta.
## Regras de negócio das consultas

### Estados

Uma consulta começa como SCHEDULED (agendada) e pode ir para um dos três estados finais:

- SCHEDULED (agendada): estado inicial, quando o paciente agenda a consulta.
- CANCELLED (cancelada): definido pelo paciente ou pelo fisioterapeuta.
- COMPLETED (realizada): definido pelo fisioterapeuta, depois do horário da consulta.
- NO_SHOW (falta): definido pelo fisioterapeuta, depois do horário da consulta.

Consultas em estado final não podem mais ser alteradas.

### Regras

- Só pacientes agendam consultas.
- Um horário tem no máximo uma consulta ativa. Ao agendar, o horário fica indisponível; ao cancelar ou remarcar, volta a ficar disponível para outros pacientes. A verificação e a ocupação do horário acontecem em uma única transação, o que impede que dois pacientes agendem o mesmo horário ao mesmo tempo.
- O paciente não pode ter duas consultas no mesmo horário, mesmo com fisioterapeutas diferentes.
- Não é possível agendar horários que já passaram.
- O preço é registrado no momento do agendamento. Se o fisioterapeuta mudar o valor da sessão depois, as consultas já marcadas mantêm o valor combinado.
- Cada usuário só vê as próprias consultas: o paciente vê as dele, e o fisioterapeuta vê as dos seus pacientes. Tentar acessar a consulta de outra pessoa retorna 403.
- O paciente só pode cancelar ou remarcar com pelo menos 24 horas de antecedência. O fisioterapeuta pode cancelar a qualquer momento.
- Consultas que já começaram não podem ser canceladas nem remarcadas: o fisioterapeuta deve marcá-las como realizadas ou falta.
- Realizada e falta só podem ser marcadas pelo fisioterapeuta da consulta, depois do horário.
- Remarcar cancela a consulta atual e cria uma nova, ligada à anterior pelo campo rescheduledFromId. O novo horário precisa ser do mesmo fisioterapeuta.

### Por que um horário pode ter várias consultas no banco?

Antes, o modelo tinha appointment Appointment? no Schedule (uma ou nenhuma consulta por horário), e o scheduleId do Appointment era @unique. Com isso, um horário só podia aparecer em uma consulta para sempre. Se a Maria cancelasse a consulta das 17h, o João não conseguiria agendar nesse horário, mesmo com available = true, porque o scheduleId já estava sendo usado na consulta cancelada.

Agora a relação é 1:N (appointments Appointment[]) e o scheduleId não é mais único. Isso permite guardar o histórico: a consulta cancelada continua registrada com o motivo do cancelamento, e o horário pode receber uma nova consulta. Na regra de negócio, porém, o horário continua tendo no máximo uma consulta ativa por vez, garantido pelo campo available.

## Diagrama ER do projeto
![Diagrama ER do projeto](docs/diagrama-er.png)
