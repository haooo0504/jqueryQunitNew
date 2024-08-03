pipeline {
    agent any

    tools {
        nodejs 'NodeJS' // 假設你在 Jenkins 中安裝的 Node.js 名稱是 'NodeJS'
    }

    environment {
        DOCKER_TOOL_NAME = 'docker'
        IMAGE_NAME = 'my-jqunit1'
        CONTAINER_NAME = 'jqunit1'
    }

    stages {
        stage('Checkout') {
            steps {
                // 從版本控制系統中檢出代碼
                git 'https://github.com/haooo0504/jqueryQunitNew.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // 安裝 Puppeteer 所需的依賴項
                    sh '''
                        apt-get update
                        apt-get install -y libnss3
                    '''
                    // 安裝 Puppeteer
                    sh 'npm install puppeteer'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // 運行 Puppeteer 測試腳本
                    sh 'node html/test/runTest.js'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // 構建 Docker 映像
                    sh 'docker build -t ${IMAGE_NAME} .'
                }
            }
        }

        stage('Build and Run Docker') {
            when {
                expression {
                    // 只有當前一步成功時才會執行後續步驟
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            stages {
                stage('Build Docker Image') {
                    steps {
                        script {
                            // 構建 Docker 映像
                            sh "docker build -t ${IMAGE_NAME} ."
                        }
                    }
                }

                stage('Run Docker Container') {
                    steps {
                        script {
                            // 運行 Docker 容器
                            sh "docker run -d --name ${CONTAINER_NAME} -p 8086:80 ${IMAGE_NAME}"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // 總是執行的步驟，例如清理
                cleanWs()

                // 刪除 Docker 容器和映像
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
                sh "docker rmi ${IMAGE_NAME} || true"
            }
        }

        success {
            // 當構建成功時執行的步驟
            echo '所有測試通過，Docker 容器運行成功。'
        }

        failure {
            // 當構建失敗時執行的步驟
            echo '測試或構建失敗。'
        }
    }
}
