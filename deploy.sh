#!/bin/bash

# 定義變數
HTML_SOURCE_DIR="./html"  # 假設 HTML 檔案在代碼庫的 html 目錄下
NGINX_CONF_SOURCE="./nginx.conf"  # 假設 Nginx 配置檔案在代碼庫根目錄下
CONTAINER_NAME="jqunit"  # 運行中的 Nginx 容器名稱
TARGET_HTML_DIR="/usr/share/nginx/html"
TARGET_NGINX_CONF="/etc/nginx/nginx.conf"
IMAGE_NAME="my-jqunit"

# 檢查是否已有運行中的容器
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    echo "停止並刪除已運行的容器..."
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
fi

# 運行新的Docker容器
echo "運行新的 Docker 容器..."
docker run -d --name ${CONTAINER_NAME} -p 8085:80 ${IMAGE_NAME}

# # 複製新的 HTML 檔案到 Docker 容器
# echo "正在將新的 HTML 檔案複製到 Docker 容器..."
# docker cp $HTML_SOURCE_DIR/. $CONTAINER_NAME:$TARGET_HTML_DIR

# 複製新的 Nginx 配置檔案到 Docker 容器
echo "正在將新的 Nginx 配置複製到 Docker 容器..."
docker cp $NGINX_CONF_SOURCE $CONTAINER_NAME:$TARGET_NGINX_CONF

# 重新設定 Docker 容器中的 Nginx 配置
echo "正在重新設定 Docker 容器中的 Nginx 配置..."
docker exec ${CONTAINER_NAME} sh -c 'rm /etc/nginx/nginx.conf && cp /usr/share/nginx/html/nginx.conf /etc/nginx/nginx.conf'

# 在容器中測試 Nginx 配置
echo "正在測試 Docker 容器中的 Nginx 配置..."
docker exec $CONTAINER_NAME nginx -t

# 在容器中重新加載 Nginx 服務
echo "正在重新加載 Docker 容器中的 Nginx 服務..."
docker exec $CONTAINER_NAME nginx -s reload

echo "部署成功完成。"
