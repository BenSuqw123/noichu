# Sử dụng Node.js 18 làm base image
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cài đặt dependencies
RUN npm install

# Mở cổng 3000 để truy cập ứng dụng
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]
