# 🔎 DevFinder

![build](https://img.shields.io/github/actions/workflow/status/omurillorezende/devfinder-next/ci.yml?branch=main)
![license](https://img.shields.io/github/license/omurillorezende/devfinder-next)

Aplicação para **buscar perfis de desenvolvedores no GitHub** e visualizar seus **repositórios mais populares**.  
Feito com **Next.js 15, React, TypeScript e Tailwind CSS**, com deploy serverless na **Vercel**.

👉 [**Deploy online**](https://devfinder-next-one.vercel.app)

---

## ✨ Funcionalidades

- 🔍 Busca por qualquer usuário do GitHub  
- 👤 Exibição de avatar, bio, seguidores e repositórios públicos  
- 📊 Gráfico dos **Top 5 repositórios** com mais estrelas  
- 🎨 Design responsivo e moderno com Tailwind CSS  
- ⚡ Deploy contínuo via **Vercel + GitHub Actions (CI)**  

---

## 🛠 Tecnologias

- [Next.js 15](https://nextjs.org/) (App Router + Server Components)  
- [React](https://react.dev/) com Hooks e React Query  
- [TypeScript](https://www.typescriptlang.org/) para tipagem estática  
- [Tailwind CSS](https://tailwindcss.com/) para estilos  
- [Recharts](https://recharts.org/) para gráficos  
- [Vercel](https://vercel.com/) para deploy serverless  
- [GitHub Actions](https://github.com/features/actions) para CI/CD  

---

## 💻 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/omurillorezende/devfinder-next.git
cd devfinder-next

# Instale as dependências
pnpm install

# Rodar em modo desenvolvimento
pnpm dev

# Build de produção
pnpm build && pnpm start
