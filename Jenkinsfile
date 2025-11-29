pipeline{
    agent any

    environment{
        SONAR_HOME = tool "sonar"
    }
    parameters {
        string(name: 'ECR_BACKEND_REPO', defaultValue: '', description: 'Backend ECR Repository URL')
        string(name: 'ECR_FRONTEND_REPO', defaultValue: '', description: 'Frontend ECR Repository URL')
        string(name: 'ALB_URL', defaultValue: '', description: 'ALB URL')
    }
    stages{
        stage('Env Var'){
            steps{
                script{
                    echo "ECR_BACKEND = ${params.ECR_BACKEND_REPO}"
                    echo "ECR_FRONTEND = ${params.ECR_FRONTEND_REPO}"
                    echo "ALB_URL = ${params.ALB_URL}"
                }
            }
        }
        stage('Checkout from Git'){
            steps{
                git url: "https://github.com/Atharva014/task_mgmt_using_python.git", branch: "jenkins-deploy"
                script {
                    def scmVars = checkout([$class: 'GitSCM', 
                        branches: [[name: 'jenkins-deploy']],
                        userRemoteConfigs: [[url: 'https://github.com/Atharva014/task_mgmt_using_python.git']]
                    ])
                    env.IMAGE_TAG = "${BUILD_NUMBER}-${scmVars.GIT_COMMIT[0..7]}"
                    echo "Image Tag: ${env.IMAGE_TAG}"
                }
            }
        }
        stage('Sonarqube Analysis'){
            steps{
                withSonarQubeEnv("soanr-srv"){
                    sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=task_mgmt -Dsonar.projectKey=task_mgmt -Dsonar.sources=backend,frontend"
                }
            }
        }
        stage('Sonar Quality Gate Scan'){
            steps{
                timeout(time: 2, unit: "MINUTES") {
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        stage('Trivy Scan'){
            steps{
                sh 'trivy fs --format table -o trivy-backend.html --severity HIGH,CRITICAL backend/'
                sh 'trivy fs --format table -o trivy-frontend.html --severity HIGH,CRITICAL frontend/'
            }
        }
        stage('Build Docker Images'){
            steps{
                sh "docker build --build-arg REACT_APP_API_URL=${params.ALB_URL} -t ${params.ECR_BACKEND_REPO}:${IMAGE_TAG} ./backend"
                sh "docker build -t ${params.ECR_FRONTEND_REPO}:${IMAGE_TAG} ./frontend"
            }
        }
    }
}