# 📌 Guia Rápido: Publicando o Estudo de Caso de QA no GitHub & GitHub Pages

Guia passo a passo com todas as configurações, tags e instruções necessárias para publicar a proposta de melhoria da **Rio Innovation Week** sob a ótica de **Quality Assurance (QA)** no GitHub.

---


## 📋 1. Configurações Iniciais do Repositório (No GitHub)

Ao criar o repositório no GitHub:

* **Nome do Repositório (*Repository Name*):** `rio-innovation-week-redesign`
* **Descrição (*Description*):**
  > Estudo de caso de QA & UX: Proposta de melhoria de alta performance e usabilidade para a programação da Rio Innovation Week 2026. Demonstração de como a Engenharia de Qualidade previne atritos, elimina falhas de filtro e agrega valor ao produto final.
* **Visibilidade:** Público (*Public*).

---

## 🏷️ 2. Tópicos / Tags do Repositório (Seção "About")

Na página inicial do repositório, clique na engrenagem ao lado de **About** no canto direito e adicione as seguintes tags:

```text
quality-assurance, qa-engineering, software-testing, ux-quality, performance-testing, rio-innovation-week, vanilla-js, redesign, ui-ux, frontend, github-pages
```


---

## 📂 3. Lista de Arquivos a Subir

### ✅ Obrigatórios (Suba estes arquivos):
1. `index.html` — Estrutura da página.
2. `styles.css` — Estilos visuais oficiais (Dark, Laranja e Ciano).
3. `app.js` — Lógica dos filtros, avatares e modais.
4. `events-data.js` — Base de dados dos 1.479 eventos (Zero CORS).
5. `speakers-data.js` — Mapeamento completo de fotos dos palestrantes (Zero CORS).
6. `logo-riw.png` — Logotipo oficial da RIW.
7. `palestrantes/` — Pasta com as fotos otimizadas dos palestrantes.
8. `README.md` — Apresentação da proposta para quem visita seu repositório.
9. `.gitignore` — Arquivo de controle de envios.

### 🟡 Opcionais (Pode subir se desejar):
* `robots.txt` — Regras de privacidade e SEO.
* `documentacao_alteracoes.md` — Registro das correções técnicas.
* `sugestoes_filtros.md` — Estudo inicial de filtros.
* `eventos_rio_innovation_week.json` — Backup dos dados brutos.

### ❌ Não precisa subir:
* `.htaccess` (O GitHub Pages ignora arquivos do servidor Apache).

---

## 🌐 4. Como Ativar o GitHub Pages (Site Online Gratuito)

Depois de subir os arquivos para o repositório:

1. Acesse a aba **Settings** (Configurações) no topo do seu repositório no GitHub.
2. No menu lateral esquerdo, clique em **Pages** (seção *Code and automation*).
3. Na seção **Build and deployment**:
   * **Source:** Selecione `Deploy from a branch`.
   * **Branch:** Selecione a branch `main` (ou `master`) e a pasta `/ (root)`.
   * Clique em **Save** (Salvar).
4. Aguarde cerca de 1 a 2 minutos. O GitHub exibirá o link do seu site online:
   `https://<seu-usuario>.github.io/rio-innovation-week-redesign/`

---

## 🔗 5. Adicionar o Link do Site no Topo do Repositório

1. Volte para a página principal do seu repositório.
2. No painel **About** (canto direito), clique no ícone de engrenagem.
3. No campo **Website**, cole o link gerado pelo GitHub Pages.
4. Clique em **Save changes**.
