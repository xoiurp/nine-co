# Configuração do Google OAuth

## Instruções para configurar as credenciais do Google OAuth

### Passos para configuração:

1. **Copie o arquivo template:**
   ```bash
   cp client_secret_template.json client_secret_[SEU_CLIENT_ID].json
   ```

2. **Substitua os valores no arquivo:**
   - `YOUR_CLIENT_ID`: Seu ID real do Google OAuth
   - `your-project-id`: ID do seu projeto no Google Cloud
   - `YOUR_CLIENT_SECRET`: Sua chave secreta real

3. **Exemplo do arquivo final:**
   ```json
   {
     "web": {
       "client_id": "444264876041-s56uj6s0jt8v757dvm7ull123sp5rsu2.apps.googleusercontent.com",
       "project_id": "big-potential-459805-u2",
       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
       "token_uri": "https://oauth2.googleapis.com/token",
       "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
       "client_secret": "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"
     }
   }
   ```

### ⚠️ IMPORTANTE - SEGURANÇA:

- **NUNCA** commite arquivos `client_secret_*.json` no Git
- O arquivo real com credenciais deve existir apenas localmente
- Use variáveis de ambiente em produção quando possível
- Mantenha suas credenciais seguras e não as compartilhe

### Arquivos protegidos pelo .gitignore:

- `client_secret_*.json`
- `*.db` (bancos de dados)
- `.env*` (variáveis de ambiente)

### Como obter as credenciais:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para "APIs & Services" > "Credentials"
3. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
4. Configure as origens autorizadas
5. Baixe o arquivo JSON com as credenciais 