# 📋 Tasks.md – Sistema de Gestão Financeira

**Progresso:**  

- Totais: 103
- Concluídas: 65
- Parciais: 12
**Conclusão: ~63%**

---

## 🧩 Índice de marcações

| Símbolo | Significado |
|---------|-------------|
| [x]     | Tarefa concluída |
| [-]     | Parcialmente concluída |
| [ ]     | Pendente |
| [o]     | Em dúvida / requer análise |

---

## 🧭 Estrutura Geral

- [x] Criar estrutura base do projeto (HTML + CSS)
- [x] Criar barra de navegação
- [x] Definir estilo visual padrão (cores, fontes, espaçamento)
- [x] Integrar layout com React posteriormente
- [x] Criar estrutura de rotas (React Router)

---

## 📊 Página 1 – Dashboard

- [x] Layout básico (cards de resumo)
- [4/4] Cards principais:
  - [x] Total de clientes  
  - [x] Valor em aberto
  - [x] Valor vencido
  - [x] Últimos lançamentos  
- [x] Responsividade e grid
- [3/3] Funcionalidades dos cards:
  - [x] Clique no card “Clientes em atraso” → ir para página “Clientes em atraso”
  - [x] Clique no card “Clientes” → ir para “Clientes cadastrados”
  - [x] Clique no card “Lançamentos” → ir para “Histórico geral”
- [x] Adicionar atualização dinâmica (valores reais do backend)

---

## 👥 Página 2 – Clientes Cadastrados

- [x] Layout base (cards de clientes)
- [x] Exibir: Nome, Contato, Ciclo de pagamento, Situação
- [x] Melhorar campo “Situação” (usar: “Em dia”, “Em atraso”, etc.)
- [x] Adicionar input de filtro / busca
- [3/3] Funcionalidades:
  - [x] Paginação (máx. 20 por página)
  - [x] Ordenação por nome ou situação
  - [x] Ação de clique → abrir detalhes do cliente (página 3)

---

## 🧾 Página 3 – Cliente Individual

- [x] Layout básico
- [x] Exibir dados principais (Nome, Contato, Ciclo, Situação)
- [x] Criar tabela de lançamentos do cliente
  - [x] Colunas: Tipo | Data | Vencimento | Valor | Código
  - [x] Máx. 20 itens + paginação
- [x] Implementar ação de clique → abrir FloatGui com detalhes
- [ ] Adicionar botão “Apagar lançamento” (sem edição)
- [x] Integrar cálculo de total do cliente (backend)

---

## ⚠️ Página 4 – Vencidos (Detalhada)

- [x] Layout inicial da tabela
- [x] Colunas: Cliente | Total Vencido | Dias em Atraso | Nº de Lançamentos  
- [3/3] Funcionalidades:
  - [x] Ordenar por valor  
  - [x] Ordenar por atraso
  - [x] Clique no cliente → abrir página individual  
- [0/2] Exportação:
  - [ ] Gerar CSV
  - [ ] Gerar PDF

---

## 📜 Página 5 – Lançamentos (Histórico Geral)

- [x] Layout base (HTML + CSS)
- [x] Criar tabela cronológica
  - [x] Colunas: Data | Cliente | Tipo | Valor | Observações  
- [3/3] Funcionalidades:
  - [x] Filtro por período
  - [x] Filtro por tipo (Compra/Pagamento)
  - [x] Filtro por cliente
- [x] Adicionar botão “Adicionar lançamento manual”
- [0/2] Exportação:
  - [ ] Gerar CSV
  - [ ] Gerar PDF

---

## ⚙️ Integração e Refinamentos (Etapa Futura)

- [x] Conectar páginas ao backend (API real)
- [x] Sincronizar dados entre clientes, vencidos e lançamentos  
- [ ] Criar logs de auditoria (ações críticas)
- [ ] Melhorar experiência visual (hover, animações, tooltips)

---

## 🧭 Auxiliares (Guidelines de UX)

### 🔹 Ações leves → FloatGui

- [x] Adicionar novo cliente → formulário curto (nome, contato, ciclo, data inicial)
- [ ] Exportar lista (CSV / PDF) → opções simples ("tudo" ou "filtro atual")
- [x] Registrar pagamento → valor + data
- [x] Editar cliente → dados pequenos, sem necessidade de rota

💡 Justificativa: mantém o fluxo contínuo e reduz tempo de navegação.

### 🔸 Ações complexas → Nova Página

- [x] Abrir cliente individual → precisa de URL própria
- [x] Ver vencidos / lançamentos → grandes tabelas e filtros próprios  
- [ ] Relatórios ou exportações detalhadas → visualização separada

💡 Justificativa: melhora legibilidade e organiza dados extensos sem sobrecarregar o layout principal.

---

## API → EndPoints

|             Endpoint                | Controller | Service | Repository |
|-------------------------------------|------------|---------|------------|
| cliente:list                        |    [x]     |   [x]   |    [x]     |
| cliente:getById                     |    [x]     |   [x]   |    [x]     |
| cliente:create                      |    [x]     |   [x]   |    [x]     |
| cliente:update                      |    [x]     |   [x]   |    [x]     |
| cliente:delete                      |    [x]     |   [x]   |    [x]     |
| cliente:getInadimplentesList        |    [ ]     |   [ ]   |    [ ]     |
| cliente:searchByName                |    [x]     |   [x]   |    [x]     |
| movimentacoes:list                  |    [x]     |   [x]   |    [x]     |
| movimentacoes:listByClient          |    [x]     |   [x]   |    [x]     |
| movimentacoes:create                |    [x]     |   [x]   |    [x]     |
| movimentacoes:delete                |    [ ]     |   [ ]   |    [ ]     |
| dashboard:getResumo               |    [x]     |   [x]   |    [x]     |
| dashboard:getResumoTabelas          |    [x]     |   [x]   |    [x]     |
