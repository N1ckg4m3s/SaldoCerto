# Saldo Certo

> Aplicativo Full Stack para gerenciamento de clientes, movimentações financeiras e controle de backups.

**Download:** [Clique aqui para baixar](https://drive.google.com/file/d/11rYqcU1nmRaevJB-yZJCEo8_RgqAbQiG/view?usp=drive_link)

---

## Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Uso](#uso)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Sobre

**Saldo certo** é um sistema local desenvolvido para comércios que trabalham com fiado, oferecendo controle completo sobre pedidos e pagamentos. Com ele, é possível registrar movimentações de clientes, acompanhar valores em aberto e vencidos, e saber exatamente quando cobrar cada cliente.

O aplicativo se destaca pela facilidade de uso, sendo intuitivo mesmo para quem não tem experiência com sistemas de gestão, e pela segurança, já que todos os dados ficam armazenados localmente. Além disso, permite definir diferentes tipos de contrato para cada cliente:

- Prazo: define o tempo em dias para pagamento;
- Fechamento: define o dia do mês em que o sistema lembrará de cobrar.

O **Saldo certo** é uma solução gratuita que simplifica o controle de fiados, evitando esquecimentos e auxiliando na gestão financeira do comércio.

---

## Funcionalidades

O **Saldo Certo** oferece controle completo sobre clientes e movimentações de fiado, com recursos pensados para facilitar o dia a dia de pequenos comércios:

- Gerenciamento de Clientes: Adicionar, atualizar e remover clientes. Cada cliente possui informações detalhadas, incluindo tipo de contrato e histórico de movimentações.
- Controle de Movimentações: Adicionar e remover pedidos e pagamentos. Cada movimentação fica registrada, permitindo acompanhar valores devidos e recebidos.
- Dashboard Completo: Visualização inicial com resumo do sistema, incluindo valor total em fiado, clientes com fiado ativo, próximas cobranças e últimas movimentações.
- Listagens Paginadas: Consulta detalhada de clientes cadastrados, movimentações, clientes em atraso e logs do sistema.
- Filtros e Pesquisa: Aplicação de filtros básicos por período e pesquisa rápida para encontrar clientes ou movimentações específicas.
- Notificações Internas: Alertas e lembretes dentro do próprio aplicativo para acompanhar prazos e vencimentos.
- Configurações e Backups: Definição do intervalo entre backups, tempo máximo de armazenamento de movimentações, além de configurações simples de aparência (tema e tamanho de fonte).
- Exportação de Dados: Permite exportar informações em JSON, CSV e PDF, facilitando compartilhamento e análise externa.

---

## Instalação

### Pré-requisitos

- Node.js (>= 18)
- npm (ou yarn)
- Sistema operacional compatível com Electron (Windows, macOS, Linux)

### Clonar o projeto

```bash
  git clone https://github.com/N1ckg4m3s/appfiados.git
  cd appfiados
```

### Instalar dependências

```bash
  npm install
```

### Rodar em modo desenvolvimento

```bash
  npm run dev
```

Isso vai:

- Inicializar o Vite para o front-end.
- Compilar o Electron.
- Abrir o app em modo desenvolvimento com hot reload.

### Gerar build do aplicativo

```bash
  npm run build
```

Gera a versão final do app para distribuição (release), incluindo o banco de dados, assets e arquivos .env necessários

### Build sem empacotar (unpacked)

```bash
  npm run build:unpacked
```

Útil para testes, não cria o instalador, apenas a pasta com todos os arquivos do app.

### Prisma (Banco de dados)

#### Gerar client do Prisma

```bash
  npm run prisma:generate
```

#### Aplicar migrations (criar esquema inicial)

```bash
  npm run prisma:migrate
```

**Observação**: O app usa um banco SQLite local (dev.db). O build já inclui uma cópia inicial pronta para uso.

---

## Uso

Após instalar ou gerar o build do aplicativo, você pode utilizá-lo da seguinte forma:

### Inicialização

- Em desenvolvimento:

```bash
  npm run dev
```

- Em produção (build):
- Execute o instalador ou abra o app na pasta `release`.

### Funcionalidades principais

1. **Clientes**
   - Adicionar novos clientes com tipo de contrato (Prazo ou Fechamento).
   - Remover clientes.
   - Visualizar clientes cadastrados em lista paginada.

2. **Movimentações**
   - Adicionar pedidos e pagamentos vinculados aos clientes.
   - Remover movimentações.
   - Consultar histórico de movimentações.

3. **Dashboard**
   - Visualizar valor total em fiado.
   - Clientes com fiado ativo.
   - Próxima cobrança.
   - Últimas movimentações registradas.

4. **Filtros e pesquisa**
   - Filtrar clientes e movimentações por período.
   - Pesquisar clientes por nome ou telefone.

5. **Exportação de dados**
   - Exportar dados de clientes e movimentações em formatos JSON, CSV e PDF.

6. **Configurações do sistema**
   - Definir intervalo entre backups automáticos.
   - Configurar tempo máximo que uma movimentação fica registrada.
   - Ajustar preferências de tema (dark mode) e tamanho da fonte.

### Notificações

- O app possui notificações internas para alertar sobre movimentações e vencimentos.
- Não há alertas sonoros.

---

## Tecnologias

O aplicativo utiliza tecnologias modernas para front-end, back-end, banco de dados e deploy, proporcionando performance, escalabilidade e facilidade de manutenção.

### Front-end

- **React.js** – Criação de interfaces reativas e componentes reutilizáveis.
- **Next.js** – Server-Side Rendering (SSR) e roteamento.
- **Styled Components** – Estilização.
- **HTML5 / CSS3 / JavaScript / TypeScript** – Fundamentos web modernos.

### Back-end

- **Node.js** – Runtime para executar JavaScript no servidor.
- **Express.js** – Framework para construção de APIs REST.
- **API REST** – Comunicação entre front-end e back-end.
- **Prisma** – ORM para integração com banco de dados SQLite.
- **DAO Pattern** – Organização de acesso a dados de forma modular e escalável.

### Banco de Dados

- **SQLite** – Banco de dados local para persistência do app.

### Ferramentas e Deploy

- **Electron** – Transformar a aplicação web em desktop.
- **Vite** – Build rápido e dev server.
- **Git / GitHub** – Controle de versão.
- **Electron Builder** – Deploy e publicação.

### Boas Práticas e DevOps

- **Clean Code / SOLID / JSDoc** – Código organizado, legível e documentado.
- **Logs e backup automático** – Monitoramento e persistência segura de dados.

---

## Arquitetura

O aplicativo segue uma arquitetura modular e escalável, combinando conceitos de **Full Stack** com boas práticas de desenvolvimento.

### Estrutura Geral

- **Electron** – Serve como shell da aplicação desktop, gerenciando janelas, preload scripts e integração com Node.js.
- **Front-end (Renderer)** – Desenvolvido em React/Next.js:
  - **Componentes reutilizáveis** – Dashboard, listas, formulários, notificações.
  - **Theme Context** – Gerencia dark mode e tamanhos de fonte.
  - **React Router (HashRouter)** – Roteamento interno da aplicação.
- **Back-end (Main Process)** – Node.js/Express:
  - **Controladores** – Responsáveis por iniciar e gerenciar funcionalidades do app.
  - **API interna** – Comunicação entre o renderer e main process via métodos remotos.
- **Banco de Dados (SQLite local)**:
  - **Prisma ORM** – Gerenciamento de esquema e queries.
  - **DAO Pattern** – Organização de acesso a dados para clientes, movimentações, logs e configurações.
  - **Backup automático** – Configurações de intervalos e quantidade máxima de backups.

### Fluxo de Dados

1. **Usuário interage** com a interface (adiciona cliente, registra pagamento, etc.).
2. **Renderer Process** envia requisição para **Main Process**.
3. **Controladores** processam a requisição e acessam o banco via **DAO/Prisma**.
4. Dados atualizados retornam para o **Renderer** e atualizam o **Dashboard / Listas**.
5. **Backups e logs** são gerenciados em segundo plano, garantindo persistência e rastreabilidade.

### Padrões e Boas Práticas

- **SRP (Single Responsibility Principle)** – Cada módulo tem uma responsabilidade única.
- **Modularidade** – Código separado em componentes, controladores e DAOs.
- **Clean Code / Documentação** – Legibilidade e manutenção facilitadas.
- **Theme Provider** – Isolamento de estilos e preferências do usuário.

---

## Contribuição

Contribuições para o projeto são bem-vindas! Você pode ajudar de diversas formas:

### Como Contribuir

1. **Relatar bugs** – Abra uma issue descrevendo o problema detalhadamente.
2. **Sugerir melhorias** – Abra uma issue ou pull request com ideias para novas funcionalidades.
3. **Código** – Se deseja contribuir com código:
   - Faça um fork do repositório.
   - Crie uma branch para sua feature: `git checkout -b minha-feature`.
   - Faça commits claros e concisos.
   - Abra um pull request explicando a mudança e a motivação.

### Padrões de Código

- Siga o padrão **Clean Code** e boas práticas já aplicadas no projeto.
- Mantenha a **modularidade** e o uso de **DAO** para manipulação de dados.
- Utilize **TypeScript** e componentes **React** consistentes com o restante do app.
- Documente funções importantes com **JSDoc**.

### Testes

- Teste suas alterações localmente antes de abrir um PR.
- Verifique se não há erros no **console** ou falhas de build.

### Contato

Para dúvidas sobre contribuição, use o GitHub Issues ou entre em contato com o autor do projeto.

---

## Licença

Este projeto está licenciado sob a **ISC License**.  

Você pode:

- Usar, copiar e modificar o projeto livremente.
- Redistribuir o projeto com ou sem alterações, desde que mantenha a licença original.

Para mais detalhes, veja o arquivo `LICENSE` no repositório
