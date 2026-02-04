pipeline {
    agent any

    tools {
        nodejs "NodeJS_18"
    }

    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'edge', 'electron'],
            description: 'Choose which browser Cypress will run on'
        )

        string(
            name: 'SPEC',
            defaultValue: '',
            description: 'Optional: run specific spec(s). Example: cypress/e2e/todo.cy.js OR cypress/e2e/**/*.cy.js (leave empty to run all)'
        )

        choice(
            name: 'HEADLESS',
            choices: ['true', 'false'],
            description: 'Run headless or not (Cypress run is headless by default)'
        )

        string(
            name: 'CYPRESS_ENV',
            defaultValue: '',
            description: 'Optional: Cypress env variables. Example: baseUrl=https://qacart.com,token=123 (leave empty if not needed)'
        )
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
                script {
                    def cmd = "npm run test:report -- --browser ${params.BROWSER}"

                    if (params.SPEC?.trim()) {
                        cmd += " --spec \"${params.SPEC}\""
                    }

                    if (params.CYPRESS_ENV?.trim()) {
                        cmd += " --env \"${params.CYPRESS_ENV}\""
                    }

                    // لو بدك non-headless لازم تستخدم --headed (بس بشرط الجهاز/agent يدعم UI)
                    if (params.HEADLESS == 'false') {
                        cmd += " --headed"
                    }

                    bat cmd
                }
            }
        }
    }

    post {
        always {

            // Archive artifacts (reports, screenshots, videos)
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**, cypress/videos/**', allowEmptyArchive: true

            // Publish HTML Report inside Jenkins
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
