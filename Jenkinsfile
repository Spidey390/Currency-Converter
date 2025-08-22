pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Spidey390/Currency-Converter.git'
            }
        }
        stage('Build') {
            steps {
                echo 'Nothing to build, static site.'
            }
        }
        stage('Deploy') {
            steps {
                archiveArtifacts artifacts: '**/*', fingerprint: true
            }
        }
    }
}
