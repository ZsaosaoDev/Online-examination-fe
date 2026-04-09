# Stage 1: Xây dựng (Build) React App
FROM node:18-alpine AS builder

WORKDIR /app

# Copy file cấu hình package và cài đặt dependencies
COPY package.json package-lock.json ./
# Dùng npm ci thay vì npm install trên CI/CD để đảm bảo version chính xác từ package-lock
RUN npm ci

# Copy toàn bộ mã nguồn
COPY . .

# Cấu hình biến môi trường tại thời điểm build (để chèn URL server thật vào build)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Quá trình Build (tạo ra thư mục build/)
RUN npm run build

# Stage 2: Chạy React App với Nginx (vì React khi build ra chỉ là các file tĩnh HTML/CSS/JS)
FROM nginx:alpine

# Tùy chỉnh cấu hình Nginx để hoạt động với React-Router-DOM
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy file tĩnh từ quá trình build (Stage 1) sang nginx
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
