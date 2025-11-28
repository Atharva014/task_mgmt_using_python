pipeline{
    agent any

    environment{
        SONAR_HOME = tool "sonar"
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
    }
}