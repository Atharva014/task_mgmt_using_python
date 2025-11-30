pipeline{
    agent any

    environment{
        SONAR_HOME = tool "sonar"
    }
    parameters {
        string(name: 'ECR_BACKEND_REPO', defaultValue: '390403867534.dkr.ecr.ap-south-1.amazonaws.com/task-mgmt-backend', description: 'Backend ECR Repository URL')
        string(name: 'ECR_FRONTEND_REPO', defaultValue: '390403867534.dkr.ecr.ap-south-1.amazonaws.com/task-mgmt-frontend', description: 'Frontend ECR Repository URL')
        string(name: 'ALB_URL', defaultValue: 'k8s-default-taskappi-08814a3a18-662897624.ap-south-1.elb.amazonaws.com', description: 'ALB URL')
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
                sh "docker build -t ${params.ECR_BACKEND_REPO}:${env.IMAGE_TAG} ./backend"
                sh "docker build --build-arg REACT_APP_API_URL=http://${params.ALB_URL} -t ${params.ECR_FRONTEND_REPO}:${env.IMAGE_TAG} ./frontend"
            }
        }
        stage('Trivy Images scan'){
            steps{
                sh """
                    trivy image --exit-code 0 --severity CRITICAL,HIGH ${params.ECR_BACKEND_REPO}:${env.IMAGE_TAG}
                    trivy image --exit-code 0 --severity CRITICAL,HIGH ${params.ECR_FRONTEND_REPO}:${env.IMAGE_TAG}
                """
            }
        }
        stage('Push Docker Images'){
            steps{
                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials'
                    ]
                ]) {
                    script {
                        // Login to ECR
                        sh """
                            aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ${params.ECR_BACKEND_REPO.split('/')[0]}
                        """
                        
                        // Push images
                        sh "docker push ${params.ECR_BACKEND_REPO}:${env.IMAGE_TAG}"
                        sh "docker push ${params.ECR_FRONTEND_REPO}:${env.IMAGE_TAG}"
                    }
                }
            }
        }
        stage('Apply k8s manifests'){
            steps{
                dir('terraform-eks-setup'){
                    sh """
                    sed -i 's|{{image_name}}|${params.ECR_BACKEND_REPO}:${env.IMAGE_TAG}|g' k8s/backend-deployment.yaml
                    sed -i 's|{{image_name}}|${params.ECR_FRONTEND_REPO}:${env.IMAGE_TAG}|g' k8s/frontend-deployment.yaml
                    """
                    withCredentials([
                        [
                            $class: 'AmazonWebServicesCredentialsBinding',
                            credentialsId: 'aws-credentials'
                        ]
                    ])
                    {
                        sh 'terraform init'
                        sh 'terraform apply -target="module.k8s-manifests" --auto-approve'
                    }
                }
            }
        }
        stage('Run Database migrations'){
            steps{
                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials'
                    ]
                ])
                {
                    script {
                        sh 'aws eks update-kubeconfig --region ap-south-1 --name task-mgmt-cluster'
                        sh 'kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment'
                        sh 'kubectl exec deploy/backend-deployment -- python manage.py migrate --noinput'
                        sh 'echo "Migration applied"'
                    }
                }
            }
        }
        stage('Setup Monitoring'){
            steps{
                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials'
                    ]
                ]) 
                {
                    script{
                        sh 'aws eks update-kubeconfig --region ap-south-1 --name task-mgmt-cluster'
                        dir('monitoring'){
                            sh"""
                            chmod +x install-monitoring.sh
                            helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
                            helm repo add grafana https://grafana.github.io/helm-charts
                            helm repo update
                            """
                            // Install monitoring stack
                            sh './install-monitoring.sh'
                            sh 'echo "Installed."'
                            
                            sleep(60)
                            def prometheusUrl = sh(
                                script: "kubectl get svc -n monitoring prometheus-server -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'",
                                returnStdout: true
                            ).trim()
                            
                            def grafanaUrl = sh(
                                script: "kubectl get svc -n monitoring grafana -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'",
                                returnStdout: true
                            ).trim()
                            
                            echo "Prometheus URL: http://${prometheusUrl}"
                            echo "Grafana URL: http://${grafanaUrl}"
                            echo "Grafana Username: admin"
                            echo "Grafana Password: admin123"
                        }
                    }
                }    
            }
        }
    }
}