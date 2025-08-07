# Gunakan image node resmi
FROM node:18

# Buat folder kerja di dalam container
WORKDIR /app

# Salin file package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua file ke container
COPY . .

# Port yang digunakan oleh Express (ubah jika pakai port lain)
EXPOSE 5000

# Jalankan server
CMD ["npm", "start"]
