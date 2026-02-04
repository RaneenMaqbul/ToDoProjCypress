pipeline {
    agent any

    tools {
        nodejs "NodeJS_18"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Cypress & Generate Report') {
            steps {
                bat 'npm run test:report'
            }
        }
    }

    post {
        always {

            // 📦 Archive artifacts (reports, screenshots, videos)
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**, cypress/videos/**', allowEmptyArchive: true

            // 📊 Publish HTML Report inside Jenkins
            script {
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'cypress/reports',
                    reportFiles: 'index.html',
                    reportName: 'Cypress Mochawesome Report'
                ])
            }
        }
    }
}
