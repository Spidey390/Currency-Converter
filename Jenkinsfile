pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Spidey390/Currency-Converter.git'
            }
        }
        stage('Build') {
            steps {
                echo 'No build step needed (static site)'
            }
        }
        stage('Deploy') {
            steps {
                archiveArtifacts artifacts: '**/*', fingerprint: true
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished!'
        }
    }
}
