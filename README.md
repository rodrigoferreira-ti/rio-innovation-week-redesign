# 🧪 Estudo de Caso de QA & UX — Redesign & Otimização de Performance (Rio Innovation Week)

Este repositório apresenta uma **Prova de Conceito (PoC) desenvolvida sob a ótica de Quality Assurance (QA)**, propondo uma reformulação completa da experiência de navegação e busca na programação da **Rio Innovation Week 2026**.

O objetivo deste projeto é demonstrar como o papel do **QA atua na prevenção de falhas, melhoria de usabilidade (UX) e entrega de valor**, transformando uma plataforma com gargalos em uma solução de **desempenho ultra-rápido, filtros encadeados à prova de erros (zero combinações nulas) e agenda pessoal sem atrito**.

---

## 🔗 Links para Comparação

| Versão | Link de Acesso | Abordagem & Perspectiva |
| :--- | :--- | :--- |
| 🔴 **Original** | <a href="https://rioinnovationweek.com.br/programacao" target="_blank" rel="noopener">rioinnovationweek.com.br/programacao</a> | Plataforma legada com pontos de atrito e latência de carregamento. |
| 🟢 **PoC de QA (GitHub Pages)** | <a href="https://rodrigoferreira-ti.github.io/rio-innovation-week-redesign/" target="_blank" rel="noopener">rodrigoferreira-ti.github.io/rio-innovation-week-redesign</a> | Solução otimizada pela Engenharia de Qualidade, 100% gratuita no GitHub Pages. |

---

## 📊 Matriz Comparativa de Qualidade: Original vs. PoC de QA

| Critério de Qualidade | 🔴 Versão Original | 🟢 PoC de QA (Melhoria Proposta) |
| :--- | :--- | :--- |
| **Performance & Latência** | Carregamento mais lento e dependente de requisições de servidor/WordPress. | **Zero Latência (< 100ms)**. Carrega 1.479+ eventos no navegador sem gargalos. |
| **Engenharia & Arquitetura** | CMS com alto consumo de memória e scripts de terceiros. | **Vanilla JS (ES6+) + CSS3 puro**. Leveza extrema, zero dependências complexas. |
| **Tratamento de Edge Cases (Filtros)** | Filtros isolados que permitem seleções sem resultados. | **Filtros Encadeados Inteligentes (Cascading)**. Seleções dinâmicas que **previnem combinações vazias**. |
| **Navegação & Ergonomia** | Menus ou filtros em lista tradicionais. | **Abas Diárias Visuais com Badges** (`TER — 04/08`, `QUA — 05/08`, `QUI — 06/08`, `SEX — 07/08`). |
| **Experiência do Usuário (UX)** | Exige criação de conta/login para guardar programação. | **Favoritos em 1 Clique (localStorage)**. Zero fricção, sem necessidade de cadastro. |
| **Acessibilidade na Busca** | Pesquisa restrita. | **Busca Global em Tempo Real** por título, palestrante, empresa, tema ou palco. |
| **Interface Visual (UI)** | Layout claro tradicional. | **Dark Mode Moderno com Glassmorphism**, modais responsivos e alta legibilidade. |

---

## ✨ Recursos & Melhorias de Qualidade Implementadas

### 1. ⚡ Performance como Requisito Não-Funcional de QA
* Dataset de **1.479 eventos** otimizado em client-side.
* Execução em qualquer hospedagem estática (como **GitHub Pages**), garantindo alta disponibilidade sem custos ou falhas de servidor.

### 2. 🎯 Prevenção de Erros com Filtros Encadeados (*Cascading Filters*)
* Hierarquia dinâmica: `Data ➔ Categoria ➔ Subcategoria ➔ Local/Palco ➔ Turno (Horário) ➔ Busca Textual`.
* As opções dos seletores são recalculadas em tempo real: ao escolher a Categoria *"Saúde"*, o filtro de *Local/Palco* exibe apenas os palcos com palestras ativas de Saúde. **Eliminação completa de telas/resultados vazios!**

### 3. ⭐ Agenda do Participante sem Fricção
* Marcação imediata de favoritos por estrela em cards e modais.
* O botão **"Minha Agenda"** consolida os eventos salvos de todos os dias em um só lugar.

### 4. 🎨 Modais Ricos em Informação
* Exibição detalhada de cada sessão: descrição completa, horário, local/palco, tags e avatares estilizados de palestrantes.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5 Semântico, CSS3 Moderno (Variáveis CSS, Flexbox, CSS Grid, Glassmorphic Design).
- **Lógica & Estado**: JavaScript Vanilla ES6+ (Sem frameworks pesados, foco em desempenho puro).
- **Persistência Local**: Web Storage API (`localStorage`).

---

## 🎯 A Perspectiva de QA & Engenharia de Qualidade

Este projeto foi concebido e desenvolvido sob a ótica de **Quality Assurance (QA)**, demonstrando como a atuação proativa de QA vai muito além de "encontrar bugs":

* **Garantia de Qualidade Orientada ao Usuário (UX-Driven QA):** Mapeamento e eliminação de atritos de navegabilidade, convertendo um fluxo complexo em uma experiência simples e intuitiva.
* **Prevenção de Erros & Casos de Borda (*Edge Cases*):** Arquitetura defensiva nos filtros que invalida opções incompatíveis em tempo real.
* **Performance como Pilar de QA:** Validação de tempo de resposta em cenários com grande volume de dados (+1.400 registros).
* **Visão Estratégica de Produto:** QA atuando como agente transformador da entrega de valor ao negócio e ao cliente final.

---

## 📄 Licença e Propósito

Este repositório serve como uma **Prova de Conceito (PoC) e Estudo de Caso de QA & UX**, demonstrando o impacto direto da cultura de qualidade na excelência de produtos digitais.
