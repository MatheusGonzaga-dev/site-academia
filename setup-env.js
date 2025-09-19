#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando variáveis de ambiente...\n');

// Verificar se .env.local já existe
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('⚠️  Arquivo .env.local já existe!');
  console.log('   Se você quiser recriar, delete o arquivo primeiro.\n');
  process.exit(0);
}

// Ler o arquivo de exemplo
const envExamplePath = path.join(process.cwd(), 'env.example');
if (!fs.existsSync(envExamplePath)) {
  console.log('❌ Arquivo env.example não encontrado!');
  process.exit(1);
}

// Copiar env.example para .env.local
try {
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  fs.writeFileSync(envLocalPath, envContent);
  
  console.log('✅ Arquivo .env.local criado com sucesso!');
  console.log('📝 Suas credenciais do Supabase já estão configuradas:');
  console.log('   - URL: https://rzojanygdumtbafpnhxy.supabase.co');
  console.log('   - Chave: [configurada]');
  console.log('\n🎯 Próximos passos:');
  console.log('   1. Execute: npm run dev');
  console.log('   2. Configure o banco de dados no Supabase');
  console.log('   3. Acesse: http://localhost:3000');
  
} catch (error) {
  console.log('❌ Erro ao criar .env.local:', error.message);
  process.exit(1);
}



