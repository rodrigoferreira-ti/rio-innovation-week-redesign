# Estudo de Caso de QA & UX — Redesign & Otimização de Performance
### Rio Innovation Week 2026 • Prova de Conceito (PoC)

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen?style=flat-square&logo=github)](https://rodrigoferreira-ti.github.io/rio-innovation-week-redesign/)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](#)
[![Performance](https://img.shields.io/badge/Performance-<100ms_latência-00C853?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](#)

**Engenharia de Qualidade Orientada ao Usuário:** Como o papel de QA atua preventivamente na arquitetura de filtros, eliminação de atrito de UX e garantia de performance crítica ao manipular **1.479+ registros** no navegador.

---

## 🔗 Acesso Rápido

| Versão | Link | Cenário Avaliado |
| :--- | :--- | :--- |
| 🔴 **Original** | [rioinnovationweek.com.br/programacao](https://rioinnovationweek.com.br/programacao) | Plataforma legada: latência de carregamento e dependência de requisições de servidor. |
| 🟢 **PoC de QA** | [rodrigoferreira-ti.github.io/rio-innovation-week-redesign](https://rodrigoferreira-ti.github.io/rio-innovation-week-redesign/) | Solução estática otimizada, com processamento em client-side e zero dependências pesadas. |

---

## Matriz Comparativa de Qualidade

| Critério de Qualidade | 🔴 Versão Legada | 🟢 PoC Otimizada (QA & UX) |
| :--- | :--- | :--- |
| **Performance & Latência** | Carregamento assíncrono lento por requisições sucessivas a banco/CMS. | **Resposta instantânea (< 100ms)** ao filtrar e ordenar 1.479+ eventos. |
| **Prevenção de Falhas (Filtros)** | Seletores isolados que levam a combinações sem resultados (*Dead Ends*). | **Filtros Encadeados Inteligentes:** opções recalculadas dinamicamente para **eliminar combinações vazias**. |
| **Arquitetura & Overhead** | CMS com múltiplos scripts de terceiros e alto consumo de memória. | **Vanilla JS (ES6+) + CSS3 puro**: zero frameworks pesados, foco em tempo de execução mínimo. |
| **Ergonomia de Navegação** | Listas longas e densas sem agrupamento temporal claro. | **Abas Diárias com Badges** (`04/08` a `07/08`) com contadores de sessões ativas. |
| **Experiência do Usuário (UX)** | Exigência de cadastro/login para salvar programação do evento. | **Minha Agenda em 1 Clique (`localStorage`)**: persistência local com zero fricção. |
| **Mecanismo de Busca** | Busca restrita e dependente de retorno de API. | **Busca Global em Tempo Real** por título, palestrante, empresa, tema ou palco. |
| **UI & Acessibilidade** | Contraste variável e layouts estáticos. | **Dark Mode com Glassmorphism**, alta legibilidade e modais contextuais. |

---

## Recursos & Engenharia Defensiva

### 1. Performance como Requisito Não-Funcional (NFR)
* O dataset integral de **1.479 eventos** foi estruturado para consumo em memória no navegador sem degradação de FPS (*Frame Drop*).
* Hospedagem 100% estática (GitHub Pages), eliminando vulnerabilidade a picos de tráfego que costumam derrubar servidores durante grandes eventos.

### 2. Prevenção de Estados Inválidos (*Cascading Filters*)
* **Fluxo hierárquico:** `Data ➔ Categoria ➔ Subcategoria ➔ Local/Palco ➔ Turno ➔ Busca Textual`.
* O sistema recalcula o estado dos seletores subsequentes a cada alteração. Se uma categoria não tem sessões em determinado turno ou palco, essas opções são ocultadas ou desabilitadas automaticamente.

### 3. Persistência Local sem Coleta Desnecessária de Dados
* Implementação via **Web Storage API (`localStorage`)**, permitindo que o participante monte e revise sua agenda sem submeter dados pessoais ou enfrentar telas de login.

---

## 🛠️ Stack Tecnológica

- **Estrutura & Semântica:** HTML5 estruturado para leitura de tela e SEO.
- **Estilização:** CSS3 puro (Variáveis CSS, CSS Grid, Flexbox e efeitos de Glassmorphism).
- **Lógica e Estado:** JavaScript Vanilla moderno (ES6+ Modules, manipulação de arrays e eventos reativos).
- **Armazenamento:** Web Storage API (`localStorage`).

---

## Como Testar Localmente

Por ser uma aplicação pura em Vanilla JS, não há necessidade de instalação de dependências pesadas (`node_modules`):

```bash
# 1. Clone o repositório
git clone [https://github.com/rodrigoferreira-ti/rio-innovation-week-redesign.git](https://github.com/rodrigoferreira-ti/rio-innovation-week-redesign.git)

# 2. Acesse o diretório
cd rio-innovation-week-redesign

# 3. Execute com qualquer servidor estático local (opcional)
# Usando Python 3:
python3 -m http.server 8000

# Ou usando Node.js (npx):
npx serve
