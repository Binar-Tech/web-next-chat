# Usa a imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários para o container
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copia o restante do código
COPY . .

# Faz o build do Next.js
RUN npm run build

# Instala o PM2 globalmente
RUN npm install -g pm2

# Expõe a porta 4001
EXPOSE 4001

# Inicia o servidor com PM2 na porta específica
CMD ["pm2-runtime", "start", "npm", "--", "start"]
