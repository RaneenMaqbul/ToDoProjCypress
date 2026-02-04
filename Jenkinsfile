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
            // 1) نخلي ملف التقرير متوفر كـ Artifact (اختياري لكنه مفيد)
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**, cypress/videos/**', allowEmptyArchive: true

            // 2) نشر HTML Report داخل Jenkins (HTML Publisher)
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
