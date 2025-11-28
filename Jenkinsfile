pipeline{
    agent any

    stages{
        stage('Checkout from Git'){
            steps{
                git url: "https://github.com/Atharva014/task_mgmt_using_python.git", branch: "jenkins-deploy"
            }
        }
    }
}