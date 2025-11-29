pipeline{
    agent any

    environment{
        SONAR_HOME = tool "sonar"
    }
    parameters {
        string(name: 'ECR_BACKEND_REPO', defaultValue: '', description: 'Backend ECR Repository URL')
        string(name: 'ECR_FRONTEND_REPO', defaultValue: '', description: 'Frontend ECR Repository URL')
    }
    stages{
        stage('Checkout from Git'){
            steps{
                git url: "https://github.com/Atharva014/task_mgmt_using_python.git", branch: "jenkins-deploy"
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
                sh "docker build -t ${params.ECR_BACKEND_REPO}:${IMAGE_TAG} ./backend"
                sh "docker build -t ${params.ECR_FRONTEND_REPO}:${IMAGE_TAG} ./frontend"
            }
        }
    }
}