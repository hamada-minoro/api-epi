# **API de Consulta de Equipamentos de Proteção Individual (EPI)**

## 📌 Sobre o Projeto
Esta API permite a consulta de Equipamentos de Proteção Individual (EPIs) utilizando o número do Certificado de Aprovação (CA).  
Os dados são extraídos de um arquivo TXT oficial do Ministério do Trabalho e armazenados em um banco de dados para consulta rápida e eficiente.

## 🚀 Tecnologias Utilizadas
- **Node.js** + **Express.js**
- **TypeScript**
- **Sequelize (ORM)**
- **MySQL ou PostgreSQL** (configurável)
- **Nodemon** (para desenvolvimento)
- **Helmet, CORS e Morgan** (segurança e logs)

## 📂 Estrutura do Projeto

api-epi-ts/
│── node_modules/         # Dependências instaladas
│── src/                  # Código fonte
│   ├── config/           # Configurações gerais
│   │   ├── db.ts         # Conexão com o banco de dados
│   │   ├── env.ts        # Variáveis de ambiente
│   │   ├── logger.ts     # Configuração de logs
│   ├── controllers/      # Controladores das requisições
│   │   ├── epi.controller.ts
│   ├── models/           # Modelos de dados
│   │   ├── epi.model.ts
│   ├── routes/           # Definição das rotas
│   │   ├── epi.routes.ts
│   ├── services/         # Regras de negócio
│   │   ├── epi.service.ts
│   ├── utils/            # Funções auxiliares
│   │   ├── fileParser.ts # Conversão do TXT para JSON
│   ├── scripts/          # Scripts utilitários
│   │   ├── importData.ts # Importação de dados
│   ├── index.ts          # Inicialização do servidor
│── .env                  # Variáveis de ambiente
│── package.json          # Configuração do projeto
│── tsconfig.json         # Configuração do TypeScript
│── README.md             # Documentação do projeto
```

## 🛠️ Instalação
### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seu-usuario/api-epi-ts.git
cd api-epi-ts
```
### 2️⃣ Instalar dependências
```bash
npm install
```
### 3️⃣ Configurar variáveis de ambiente
Crie um arquivo **`.env`** na raiz do projeto e adicione:
```
PORT=3000
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_HOST=localhost
```
### 4️⃣ Rodar o servidor em desenvolvimento
```bash
npm run dev
```
## 🏗️ Como Usar a API
### 1️⃣ Importar os dados do arquivo TXT para o banco
```bash
npm run import-data
```
### 2️⃣ Consultar um EPI pelo número do CA
Faça uma requisição **GET**:
```
GET http://localhost:3000/api/epi/:ca_number
```
**Exemplo de resposta:**
```json
{
  "ca_number": 9027,
  "validade": "2015-05-24",
  "status": "VENCIDO",
  "codigo": "46000013121201001",
  "cnpj": "07951171000145",
  "empresa": "RECAMONDE ROUPAS PROFISSIONAIS LTDA"
}
```

## 📜 Licença
Este projeto é de código aberto e pode ser usado conforme necessário. 🚀

