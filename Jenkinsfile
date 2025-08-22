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
                echo 'Static site - nothing to build'
            }
        }
        stage('Publish Site') {
            steps {
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: 'index.html',
                    reportName: 'Currency Converter'
                ])
            }
        }
    }
}
