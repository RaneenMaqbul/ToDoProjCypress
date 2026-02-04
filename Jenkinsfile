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

                stage('Run Register Tests') {
                    steps {
                        bat 'npx cypress run --spec "cypress/e2e/register.cy.js" --browser chrome'
                    }
                }

                stage('Run Todo Tests') {
                    steps {
                        bat 'npx cypress run --spec "cypress/e2e/todo.cy.js" --browser chrome'
                    }
                }

            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**, cypress/videos/**', allowEmptyArchive: true

            script {
                publishHTML(target: [
                    allowMissing: true,
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
