# Sugestões de Filtros e Funcionalidades — Rio Innovation Week

Este documento registra o levantamento inicial de filtros e opções de calendário sugeridas para a página web do evento **Rio Innovation Week**, com base na estrutura do arquivo `eventos_rio_innovation_week.json`.

---

## 1. Estrutura dos Dados Identificados

O arquivo de eventos contém os seguintes campos por registro:
- **ID**: Identificador único do evento.
- **Título**: Nome da palestra, painel ou workshop.
- **Categoria**: Trilha principal (ex: *Branding Experience, Saúde, Novas Tecnologias, Empreendedorismo, Esporte, E-gov*).
- **Subcategoria**: Subtrilha ou programa específico (ex: *LUXO CONTEMPORÂNEO, GLOBAL HEALTH, VC SQUARE, ARENA.RIO*).
- **Data**: Data de realização (ex: `04/08/2026`).
- **Horário**: Intervalo de tempo do evento (ex: `11:00 - 11:45`).
- **Local**: Espaço e palco onde ocorre (ex: `Armazém 5 — Palco 25`, `Kobra — Palco 33`).
- **Descrição**: Resumo do conteúdo e temas abordados.
- **Palestrantes**: Nomes, cargos e empresas dos convidados.

---

## 2. Filtros Sugeridos Inicialmente

| # | Filtro | Tipo de Componente | Descrição / Objetivo |
|---|---|---|---|
| 1 | **Data (Dia do Evento)** | Calendário / Abas Diárias | Permite filtrar a programação por dia específico (ex: 04/08, 05/08...). |
| 2 | **Dia da Semana** | Seletor / Chips (Seg, Ter, Qua...) | Permite pré-escolher ou filtrar eventos por dia específico da semana (ex: Terça-feira, Quarta-feira). |
| 3 | **Categoria (Trilha)** | Select / Chips Multiselect | Seleção de grandes áreas do conhecimento (Tecnologia, Saúde, Gestão, etc.). |
| 4 | **Subcategoria (Subtrilha)** | Select / Tags | Refinamento temático dentro da categoria selecionada. |
| 5 | **Local / Armazém / Palco** | Dropdown / Checkboxes | Filtro espacial para quem está navegando dentro dos armazéns do evento. |
| 6 | **Turno / Horário** | Botões de Rádio / Pílulas | Filtra por período (*Manhã*, *Tarde*, *Noite*) ou horário específico. |
| 7 | **Busca Textual Global** | Input de Pesquisa (`Search Bar`) | Pesquisa por palavra-chave em Título, Descrição, Palestrante ou Empresa. |
| 8 | **Meus Favoritos ("Minha Agenda")** | Toggle / Botão de Filtro | Exibe apenas os eventos marcados pelo usuário com estrela/coração. |

---

## 3. Formatos Sugeridos para o Filtro de Data (Calendário)

1. **Abas Diárias no Topo com Dia da Semana (Estilo Festival/Agenda)**:
   - Botões horizontais destacando o dia da semana e a data (ex: `TER - 04/08`, `QUA - 05/08`, `QUI - 06/08`, `SEX - 07/08`) + opção `"Todos os Dias"`. Permite pré-seleção imediata do dia da semana desejado.
2. **Mini-Calendário Pop-up (DatePicker Customizado)**:
   - Calendário visual onde as datas com palestras ficam em destaque.
3. **Visão de Timeline / Grade de Horários**:
   - Organização vertical ou horizontal por faixa horária combinada com o dia selecionado.

---

## 4. Requisitos do Cliente (Aguardando Definições)

> *Espaço reservado para inclusão dos requisitos específicos fornecidos pelo cliente.*

- [ ] *Aguardando envio dos requisitos...*
