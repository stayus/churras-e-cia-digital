
# Instruções de Implantação para Churrasquinho & Cia

Este documento contém instruções para configurar, testar e implantar o sistema Churrasquinho & Cia.

## Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- [Node.js](https://nodejs.org/) v14 ou superior
- [Supabase CLI](https://supabase.com/docs/reference/cli/introduction)
- Git

## Configuração local

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd churrasquinho-cia
npm install
```

### 2. Configure o Supabase

1. Crie um novo projeto no [Supabase Dashboard](https://app.supabase.com)
2. Copie a URL e a chave anônima do projeto

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Execute o SQL para criar tabelas

1. No Dashboard do Supabase, vá para a seção "SQL Editor"
2. Cole o conteúdo do arquivo `supabase/migrations/20250514000000_create_tables.sql`
3. Execute o script para criar as tabelas e o usuário administrador

## Deploy das Edge Functions

### 1. Faça login no Supabase CLI

```bash
supabase login
```

### 2. Inicialize o projeto Supabase localmente

```bash
supabase init
```

### 3. Vincule ao seu projeto Supabase

```bash
supabase link --project-ref <referencia_do_projeto>
```

### 4. Implante as Edge Functions

```bash
supabase functions deploy create-employee --no-verify-jwt
supabase functions deploy create-customer --no-verify-jwt
supabase functions deploy login --no-verify-jwt
supabase functions deploy update-order-status --no-verify-jwt
supabase functions deploy generate-report --no-verify-jwt
```

### 5. Configure CORS para as Edge Functions

```bash
supabase functions config set CORS_ALLOWED_ORIGINS="http://localhost:5173,https://seu-dominio.com"
```

## Testando as Edge Functions

### 1. Inicie o servidor local de funções para testes

```bash
supabase functions serve --debug
```

### 2. Teste a função de criação de funcionário

```bash
curl -X POST http://localhost:54321/functions/v1/create-employee \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","username":"joaosilva","role":"atendente","password":"Senha@123","permissions":{"manageStock":true,"viewReports":false,"changeOrderStatus":true}}'
```

### 3. Teste a função de login

```bash
curl -X POST http://localhost:54321/functions/v1/login \
  -H "Content-Type: application/json" \
  -d '{"credential":"admin","credentialType":"username","password":"Churr@squinhoAdm2025"}'
```

## Executando o frontend

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Credenciais de administrador

- Username: `admin`
- Senha: `Churr@squinhoAdm2025`

## Implantação em produção

### 1. Build do frontend

```bash
npm run build
```

### 2. Implante os arquivos da pasta `dist` em seu servidor web ou serviço de hospedagem

Recomendações:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

### 3. Atualize as variáveis de ambiente em produção

Configure as mesmas variáveis de ambiente do passo 3 da configuração local no seu serviço de hospedagem.

### 4. Configure o domínio e SSL

Siga as instruções do seu provedor de hospedagem para configurar seu domínio personalizado e certificado SSL.

## Solução de problemas comuns

### Erro de CORS nas Edge Functions

Certifique-se de que o domínio do seu frontend está na lista de origens permitidas:

```bash
supabase functions config set CORS_ALLOWED_ORIGINS="https://seu-dominio.com"
```

### Erros de autenticação

- Verifique se o usuário admin foi criado corretamente na tabela `employees`
- Verifique se o hash da senha está correto

Para atualizar a senha do admin manualmente:

```sql
UPDATE employees 
SET password = '$2a$10$VgIzXSMUwcoVcSMTu5SV9eYHJHoXYBGvoFdNBepU7UPwskXDQK.Ra'
WHERE username = 'admin';
```

## Manutenção

### Backup do banco de dados

Configure backups regulares através do painel do Supabase:

1. Vá para a seção "Project Settings" > "Database"
2. Configure a frequência dos backups

### Atualização de Edge Functions

Para atualizar uma Edge Function existente:

```bash
supabase functions deploy <nome-da-função>
```

## Recursos adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do React](https://reactjs.org/docs/getting-started.html)
- [Documentação do Vite](https://vitejs.dev/guide/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do shadcn/ui](https://ui.shadcn.com)
