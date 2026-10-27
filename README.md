# 🌍 Yoté Digital (Web)

Bem-vindo ao repositório oficial do projeto de extensão **Yoté Digital**. Este projeto visa a digitalização do tradicional jogo de tabuleiro estratégico da África Ocidental (Yoté) através de uma aplicação Web moderna. O intuito é atuar como um instrumento pedagógico, de preservação da cultura africana e de estímulo ao raciocínio lógico, unindo a engenharia de software ao resgate histórico.

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando as seguintes tecnologias principais:
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **PostgreSQL** (com Supabase ou Prisma ORM)
- **Zustand / Context API** (Gerenciamento de Estado)

---

## 🏗️ Estrutura e Arquitetura (Clean Architecture)

O projeto está dividido em quatro frentes de trabalho rigorosamente desacopladas. Nossa estrutura de pastas dentro de `src/app/` obedece à Arquitetura Limpa, onde cada integrante é "dono" de uma camada específica:

| Integrante | Função e Responsabilidade | Camada |
| :--- | :--- | :--- |
| **Isac** | **O Cérebro do Jogo:** Regras, lógica matemática da matriz 5x6 e captura dupla. | `domain/` (TS puro) |
| **Glenda** | **A Guardiã da Memória:** Persistência no PostgreSQL e salvamento em formato JSONB. | `infrastructure/` |
| **Rebeca** | **A Artista das Telas:** Interface reativa, componentes visuais e UI/UX. | `presentation/` (React + Tailwind) |
| **Raí** | **O Maestro:** Integração, UseCases, orquestração e gerenciamento do Estado (React Context). | `application/` |

---

## 🌿 Padrão de Branches (Git)

Nós utilizamos a branch `dev` como a nossa linha central de desenvolvimento. Ninguém deve enviar código diretamente (commit direto) para a `main` ou `dev`.

Cada integrante deve criar a sua própria branch a partir da `dev` utilizando a nomenclatura oficial: `feat/nome-tarefa` ou `fix/nome-correcao`.

### 💡 Exemplos de Branches por Integrante:

*   **Isac (Domínio):** 
    *   `feat/isac-regras-matematicas`
    *   `feat/isac-validacao-captura`
*   **Glenda (Infraestrutura):** 
    *   `feat/glenda-postgres-repository`
    *   `feat/glenda-esquema-banco`
*   **Rebeca (Apresentação):** 
    *   `feat/rebeca-tabuleiro-ui`
    *   `feat/rebeca-placar-e-menus`
*   **Raí (Aplicação):** 
    *   `feat/rai-game-context`
    *   `feat/rai-usecase-mover-peca`

**Comandos básicos de fluxo diário:**
```bash
# Baixar atualizações da dev
git pull origin dev

# Criar sua própria branch a partir da dev
git checkout -b feat/seu_nome-sua_tarefa

# Salvar e enviar código
git add .
git commit -m "feat: adiciona funcionalidade X"
git push origin feat/seu_nome-sua_tarefa

```

## 📦 Dependências por Integrante
Como este é um projeto Web feito em Node.js (Vite + React), todos devem possuir o Node instalado. Não utilizamos um requirements.txt (comum no Python), mas sim o package.json. Após clonar o projeto, rode sempre o npm install.

Cada integrante lidará com dependências focadas em sua camada:

* **Integrante 1 - Isac (Domain)**: Nenhuma dependência externa. O código utiliza as bibliotecas nativas de TypeScript puro.

* **Integrante 2 - Glenda (Infrastructure)**: Instalação das bibliotecas de comunicação com o banco:

    * `Supabase: npm install @supabase/supabase-js (se usar Supabase).`

    * `Prisma (Alternativa): npm install prisma @prisma/client (requer npx prisma init).`

* **Integrante 3 - Rebeca (Presentation)**: Utilitários visuais e de CSS:

    * `Tailwind CSS (já configurado nativamente com o Vite).`

    * `Ícones (opcional): npm install lucide-react.`

* **Integrante 4 - Raí (Application)**: Biblioteca de gerenciamento de estado (se optar não usar o Context API puro):

    * `Zustand: npm install zustand`