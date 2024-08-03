# 使用官方的 Nginx 映像
FROM nginx:latest

# 將當前目錄下的所有文件複製到 Nginx 預設的靜態文件服務目錄
COPY html/ /usr/share/nginx/html

# 暴露 Nginx 默認的端口
EXPOSE 80

# 啟動 Nginx 服務
CMD ["nginx", "-g", "daemon off;"]
