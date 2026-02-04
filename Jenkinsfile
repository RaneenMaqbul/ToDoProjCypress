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

        stage('Run Cypress in Parallel') {
            parallel {

                stage('Chrome Tests') {
                    steps {
                        bat 'npx cypress run --browser chrome'
                    }
                }

                stage('Edge Tests') {
                    steps {
                        bat 'npx cypress run --browser edge'
                    }
                }

                // تقدري تضيفي كمان
                // stage('Electron Tests') {
                //     steps {
                //         bat 'npx cypress run --browser electron'
                //     }
                // }
            }
        }
    }

    post {
        always {

            // 📦 Archive artifacts
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**, cypress/videos/**', allowEmptyArchive: true

            // 📊 Publish HTML Report
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
