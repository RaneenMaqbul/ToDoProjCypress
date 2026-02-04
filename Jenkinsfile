pipeline {
    agent any

    tools {
        nodejs "NodeJS_18"
    }

    parameters {
        choice(name: 'TEST_SUITE', choices: ['both', 'register', 'todo'], description: 'Which specs to run?')
        choice(name: 'BROWSER', choices: ['chrome', 'edge', 'electron'], description: 'Browser for Cypress run')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean Reports') {
            steps {
                bat '''
                    if exist cypress\\reports rmdir /s /q cypress\\reports
                    mkdir cypress\\reports
                    mkdir cypress\\reports\\merged
                '''
            }
        }

        stage('Install') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Cypress') {
            steps {
                script {
                    def branches = [:]

                    if (params.TEST_SUITE == 'both' || params.TEST_SUITE == 'register') {
                        branches['Register Specs'] = {
                            // تم تبسيط الأمر وإزالة cmd /c والهروب المعقد
                            bat "set REPORT_DIR=cypress/reports/register && npx cypress run --spec cypress/e2e/register.cy.js --browser ${params.BROWSER}"
                        }
                    }

                    if (params.TEST_SUITE == 'both' || params.TEST_SUITE == 'todo') {
                        branches['Todo Specs'] = {
                            bat "set REPORT_DIR=cypress/reports/todo && npx cypress run --spec cypress/e2e/todo.cy.js --browser ${params.BROWSER}"
                        }
                    }

                    if (branches.size() == 0) {
                        echo "No specs selected."
                    } else {
                        // تشغيل متوازي إذا كان الخيار both، أو تشغيل فردي إذا كان واحداً فقط
                        parallel branches
                    }
                }
            }
        }

        stage('Merge Reports') {
            steps {
                bat '''
                    echo ====== MERGE JSONs ======
                    npx mochawesome-merge "cypress/reports/**/*.json" > cypress/reports/merged/merged.json
                    
                    echo ====== GENERATE HTML ======
                    npx marge cypress/reports/merged/merged.json -f index -o cypress/reports/merged
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**, cypress/videos/**', allowEmptyArchive: true
            
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'cypress/reports/merged',
                reportFiles: 'index.html',
                reportName: 'Cypress Mochawesome Report'
            ])
        }
    }
}
