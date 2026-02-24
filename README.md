# Projeto Certificação Next.js

Este projeto foi desenvolvido com foco em performance, escalabilidade e arquitetura de nível sênior, utilizando as melhores práticas do **Next.js (App Router)** e **SCSS**.

Abaixo estão detalhadas todas as estratégias e decisões arquiteturais tomadas para cumprir os requisitos da certificação:

## 1. Arquitetura de Renderização e Cache (Requisitos da Avaliação)

A aplicação foi rigorosamente dividida para extrair a melhor performance possível do servidor Node.js e garantir a aprovação nos requisitos de renderização estática e dinâmica do Next.js 15:

### Requisito 1: Página Home (Renderização Estática - SSG)

- A listagem principal de produtos na rota `/` foi construída baseada no padrão **SSG (Static Site Generation)**.
- Ao utilizarmos a Fetch API em nosso Server Component (`page.tsx`) com a flag nativa `cache: "force-cache"`, o Next.js foi instruído a bater no banco de dados Mockado apenas uma única vez, durante o momento de _Build_.
- O resultado é um arquivo HTML pré-renderizado, garantindo carregamento instantâneo (0ms de latência em requisições futuras) e SEO (Crawlers) impecável.

### Requisito 2: Página de Detalhes Dinâmica (Renderização sob Demanda - SSR)

- Para a rota dinâmica `/products/[slug]`, a abordagem adotada foi o **SSR (Server-Side Rendering)**.
- **Justificativa:** Em um e-commerce real, as páginas individuais de produtos sofrem variações críticas (alterações repentinas de preço, finalização relâmpago de estoque ou mudanças na descrição feitas pelo lojista). Se optássemos pelo SSG (via `generateStaticParams`), correríamos o risco de um cliente visualizar e comprar um produto pelo cache estático configurado no build de um preço desatualizado.
- Utilizando a flag de cache `no-store` no fetch do serviço individual (`getProductBySlug`), garantimos que o Node.js renderize o HTML sob demanda em tempo real a cada novo acesso, batendo na API no momento exato do request para exibir os dados 100% atualizados, cumprindo as ordens diretas do requisito 2.

### Requisito Bônus: Integração Híbrida com TanStack Query (Prefetching & Hydration)

Apesar do uso massivo de Server Components, não abandonamos as vantagens do lado do cliente (Mutações reativas sem reload nativos do SPA).

- Utilizamos a técnica avaçada de **HydrationBoundary** na Home e Detalhes.
- O servidor (`QueryClient.prefetchQuery`) interceptita o tempo de conexão, processa o Request das APIs e embrulha o JSON retido dentro do estado de Hidratação desidratada do HTML para o Javascript do cliente.
- O componente Client-Side desperta no navegador com o Hook do React Query `useProducts/useProductBySlug` instantaneamente populado (`isLoading: false`), sem a tela piscar, unindo a força do SEO do pre-rendering Next.js com a reatividade do React Query!

---

## 2. Requisito 3: Perfil do Usuário e Autenticação (CSR)

- A página de Perfil (`/user-profile`) foi designada inteiramente como **CSR (Client-Side Rendering)**, utilizando a diretriz `'use client'`.
- Como exigido, simulamos uma *autenticação leve* orientada ao Estado Local do navegador. Construímos um `AuthContext` que checa o `localStorage` no Mount (dentro do `useEffect`) e armazena os dados provisórios ali.
- Implementei edição simples do perfil associando o Contexto com a biblioteca `react-hook-form` e o validador `zod` para extrema segurança dos campos submetidos (schema validation).

### Credenciais para Teste (Mock User):
Para acessar a área restrita na simulação ("Login"), utilize os dados abaixo conforme definidos no mock do projeto:
- **E-mail:** `cliente@itau.com.br`
- **Senha:** `123456`

---

## 3. Requisito 4: API Routes e Microserviço Mock

A aplicação atua como um ecossistema completo Full-Stack no Next.js:
- Foram criados os **dois endpoints requeridos** de listagem e detalhamento dentro da pasta `app/api/products/route.ts` e `app/api/products/[slug]/route.ts`.
- Essas rotas interagem com um "banco de dados estático" mockado em memória e devolvem respostas autênticas simuladas em formato JSON, atuando como o verdadeiro backend que é consumido pelos Server Components.

---

## 4. Requisito 5: Arquitetura de Estilos (SCSS, Flexbox e Grid)

Optamos por utilizar a extensão **Sass (SCSS)** com **CSS Modules**, baseando toda a arquitetura sob o lendário padrão **7-1 Pattern**, garantindo escopo fechado e separação inteligente a longo prazo:
- **Folders Globais:** `/styles/base`, `/styles/components`, `/styles/helpers` (ex: calculo rem), e `/styles/layout`.
- **Flexbox e Grid Layout:** Como ordenado na especificação, o HTML jamais foi posicionado através de práticas antigas (float/block margin). Todos os cartões de produtos, formulários e barras institucionais usam propriedades modernas como `display: grid` ou `display: flex` combinados a cálculos em `gap` e responsividade garantida nativamente via Container Queries ou _Media Queries_ enxutas.

A estilização modular evita vazamento de propriedades entre telas diferentes (CSS global lock).

---

## 5. Requisito 6: Qualidade e Organização do Código

- **TypeScript Strict:** O projeto não submete nenhum dado desprotegido. O TypeScript foi empregado maciçamente para a garantia estática de retornos (Tipando Produto, Formato de Resposta do Node e o AuthContext).
- **ESLint e Prettier:** Configuramos na infraestrutura global as regras essenciais de linters da vercel (`eslint-config-next`) alinhadas às formatações de quebra de página de fim de linha impostas pelo Prettier de forma automática.
- **Route Groups (Estrutura de Features):** O projeto foi fatiado usando as poderosas abstrações do App Router via caminhos interceptados, como as pastas limpas `(root)` e `(core)`, segregando o que é Autenticação do que é E-commerce de maneira cirúrgica.

---

## 6. Requisitos 7: Bônus Extras (Diferenciais Arquiteturais)

As cerejas do bolo arquitetural inseridas para maximizar o escore do projeto:
- **Testes Unitários:** O setup inicial de TDD e automação foi contemplado utilizando **Vitest** (ex: verificador da função transformadora para Moedas em `/shared/utils/format-currency.spec.ts`).
- **Lazy Loading (Suspense):** Na Home e Detalhe, aplicamos instâncias de proteção a demoras da API envolvendo blocos com `Suspense Boundaries` assíncronos dinâmicos (`<Suspense fallback="...">`).
- **Acessibilidade de Classe A (a11y):** Fomos além do *tabIndex*. Usamos atributos cirúrgicos do WCAG como **`role="alert"`**, **`aria-live="polite"`**, **`aria-invalid`** e semântica pura (labels nativas interativas e identificação visual invisível de seções do teclado). O usuário é alertado em áudio se o carregamento falhar ou o mock travar.
- **Formato Otimizado (WebP):** Utilização do formato de imagem moderno `.webp` em todos os _assets_ e _mocks_ fotográficos. Essas imagens super leves maximizam a performance real (LCP e FCP) em conjunto com a otimização automática do componente `next/image` (com *placeholdings* em *blur* implementados).

---

## 7. Como rodar a aplicação localmente

Para o avaliador ou desenvolvedor que deseja testar este projeto localmente, siga as instruções abaixo:

### Pré-requisitos
Certifique-se de ter o **Node.js** instalado na sua máquina (versão 18.17 ou superior).

### Passo a passo

1. **Acesse a pasta do projeto:**
   ```bash
   cd projeto-certificacao-next
   ```

2. **Instale as dependências:**
   Você pode usar o gerenciador de pacotes de sua preferência (`npm`, `yarn`, `pnpm` ou `bun`).
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra o seu navegador e acesse a URL: [http://localhost:3000](http://localhost:3000)

### Outros comandos disponíveis

- **Rodar os Lints:** `npm run lint` ou `npm run lint:fix` para corrigir erros e formatos.
- **Rodar a bateria de Testes (Vitest):** `npm run test`
- **Compilar para Produção (Build SSG/SSR):** `npm run build`
- **Iniciar o servidor de produção local:** `npm run start`
