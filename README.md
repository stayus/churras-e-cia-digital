
# 🍖 Churrasquinho & Cia - Sistema de Gestão e Delivery

Sistema completo para gestão e delivery da lanchonete Churrasquinho & Cia, desenvolvido com React, Vite, Supabase, shadcn-ui e Tailwind CSS.

## 🚀 Recursos

- **🔐 Autenticação diferenciada**: Funcionários acessam via `username/senha` e clientes via `email/senha`
- **👨‍💼 Painel Administrativo**: Gerenciamento completo de produtos, funcionários, pedidos, relatórios e configurações
- **👨‍🍳 Painel de Funcionários**: Visualização e atualização de pedidos em tempo real
- **🛵 Painel de Motoboys**: Gerenciamento de entregas 
- **👨‍👩‍👧‍👦 Portal do Cliente**: Catálogo de produtos, carrinho, checkout e acompanhamento de pedidos
- **💾 Banco de Dados Supabase**: Armazenamento seguro com tabelas para funcionários, clientes, produtos, pedidos e configurações
- **⚡ Edge Functions**: APIs serverless para autenticação, criação de usuários e atualização de status de pedidos
- **📊 Relatórios**: Exportação em PDF e análise de vendas por período

## 🧰 Tecnologias

- ⚛️ **React**: Biblioteca JavaScript para interfaces de usuário
- 🛠️ **Vite**: Build tool rápida para desenvolvimento moderno
- 🔥 **Supabase**: Banco de dados PostgreSQL com autenticação, APIs e Edge Functions
- 🎨 **shadcn/ui**: Componentes de UI reutilizáveis e personalizáveis
- 💅 **Tailwind CSS**: Framework CSS utilitário para design responsivo
- 🧩 **React Router**: Navegação entre páginas
- 📡 **Tanstack Query**: Gerenciamento de estado e sincronização com servidor
- 🗃️ **React Hook Form + Zod**: Validação de formulários

## 🏁 Primeiros passos

### Pré-requisitos

- Node.js (v14+)
- Conta no Supabase

### Instalação

1. Clone este repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente (veja `.env.example`)
4. Execute o script SQL no Supabase (veja `supabase/migrations/`)
5. Implante as Edge Functions (veja `DEPLOYMENT.md`)
6. Inicie o servidor de desenvolvimento: `npm run dev`

## 👥 Usuários do sistema

| Tipo | Credenciais | Permissões |
|------|-------------|------------|
| Administrador | `admin` / `Churr@squinhoAdm2025` | Todas |
| Funcionários | Via cadastro (troca senha no 1° acesso) | Baseadas no cargo |
| Clientes | Email/senha | Acesso ao catálogo e carrinho |

## 📝 Documentação

Para instruções detalhadas sobre configuração, implantação e manutenção, consulte `DEPLOYMENT.md`.

## 📷 Screenshots

[Em breve]

## 📄 Licença

Este projeto é proprietário e confidencial. Uso não autorizado é estritamente proibido.

## 👨‍💻 Autores

Desenvolvido por [Sua Empresa/Nome]

---

© 2025 Churrasquinho & Cia. Todos os direitos reservados.
