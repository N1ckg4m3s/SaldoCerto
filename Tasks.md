# 📋 Tasks.md – Sistema de Gestão Financeira

**Progresso:**

- Totais: 65
- Concluidas: 31
- Parciais: 3
**Conclusão: ~50%**

---

## 🧩 Índice de marcações

|       Símbolo     |         Significado           |
|-------------------|-------------------------------|
|        [x]        | Tarefa concluída              |
|        [-]        | Parcialmente concluída        |
|        [ ]        | Pendente                      |
|        [o]        | Em dúvida / requer análise    |

---

## 🧭 Estrutura Geral

- [x] - Criar estrutura base do projeto (HTML + CSS)
- [x] - Criar barra de navegação
- [x] - Definir estilo visual padrão (cores, fontes, espaçamento)
- [ ] - Integrar layout com React posteriormente
- [x] - Criar estrutura de rotas (React Router)

---

## 📊 Página 1 – Dashboard

- [x] - Layout básico (cards de resumo)
- [4/4] - Cards principais:  
  - [x] - Total de clientes  
  - [x] - Valor em aberto  
  - [x] - Valor vencido  
  - [x] - Últimos lançamentos  
- [x] - Responsividade e grid
- [3/3] - Funcionalidades dos cards:  
  - [x] - Clique no card Clientes em atrazo” → ir para página “Clientes em atrazo”  
  - [x] - Clique no card “Clientes” → ir para “Clientes cadastrados”  
  - [x] - Clique no card “Lançamentos” → ir para “Histórico geral”  
- [ ] - Adicionar atualização dinâmica (futuro backend)

---

## 👥 Página 2 – Clientes Cadastrados

- [x] - Layout base (cards de clientes)
- [x] - Exibir: Nome, Contato, Ciclo de pagamento, Situação
- [x] - Melhorar campo “Situação” (usar: “Em dia”, “Em atraso”, etc.)
- [x] - Adicionar input de filtro / busca
- [2/3] - Funcionalidades:  
  - [x] - Paginação (máx. 20 por página)  
  - [x] - Ordenação por nome ou situação  
  - [ ] - Ação de clique → abrir detalhes do cliente (página 3)

---

## 🧾 Página 3 – Cliente Individual

- [x] - Layout básico
- [x] - Exibir dados principais (Nome, Contato, Ciclo, Situação)
- [x] - Criar tabela de lançamentos do cliente  
  - [x] - Colunas: Tipo | Data | Vencimento | Valor | Código  
  - [x] - Máx. 20 itens + paginação  
- [ ] - Implementar ação de clique → abrir FloatGui com detalhes
- [ ] - Adicionar botão “Apagar lançamento” (sem edição)
- [ ] - Integrar cálculo de total do cliente (futuro backend)

---

## ⚠️ Página 4 – Vencidos (Detalhada)

- [x] - Layout inicial da tabela
- [x] - Colunas: Cliente | Total Vencido | Dias em Atraso | Nº de Lançamentos
- [3/3] - Funcionalidades:  
  - [x] - Ordenar por valor  
  - [x] - Ordenar por atraso  
  - [x] - Clique no cliente → abrir página individual  
- [0/2] - Exportação:  
  - [ ] - Gerar CSV  
  - [ ] - Gerar PDF  

---

## 📜 Página 5 – Lançamentos (Histórico Geral)

- [x] - Layout base (HTML + CSS)
- [ ] - Criar tabela cronológica  
  - [x] - Colunas: Data | Cliente | Tipo | Valor | Observações  
- [0/3] - Funcionalidades:  
  - [-] - Filtro por período  
  - [-] - Filtro por tipo (Compra/Pagamento)  
  - [-] - Filtro por cliente  
- [ ] - Adicionar botão “Adicionar lançamento manual”
- [0/2] - Exportação:  
  - [ ] - Gerar CSV  
  - [ ] - Gerar PDF  

---

## ⚙️ Integração e Refinamentos (Etapa Futura)

- [ ] - Conectar páginas ao backend (API real)
- [ ] - Sincronizar dados entre clientes, vencidos e lançamentos
- [ ] - Criar logs de auditoria (ações críticas)
- [ ] - Melhorar experiência visual (hover, animações, tooltips)
- [ ] - Testar  completa (mobile / desktop)

---

## 🧭 Auxiliares (Guidelines de UX)

Regras para definir se um botão deve abrir uma **FloatGui (modal)** ou **Nova Página**:

### 🔹 Ações leves → FloatGui

Usar quando a operação for rápida e contextual à página atual.

- [ ] Adicionar novo cliente → formulário curto (nome, contato, ciclo, data inicial)
- [ ] Exportar lista (CSV / PDF) → opções simples ("tudo" ou "filtro atual")
- [ ] Registrar pagamento → valor + data
- [ ] Editar cliente (caso exista) → dados pequenos, sem necessidade de rota

💡 *Justificativa:* mantém o fluxo contínuo e reduz tempo de navegação.

---

### 🔸 Ações complexas → Nova Página

Usar quando envolver navegação dedicada, filtros amplos ou histórico detalhado.

- [-] Abrir cliente individual → precisa de URL própria
- [ ] Ver vencidos / lançamentos → grandes tabelas e filtros próprios
- [ ] Relatórios ou exportações detalhadas → visualização separada

💡 *Justificativa:* melhora legibilidade e organiza dados extensos sem sobrecarregar o layout principal.
