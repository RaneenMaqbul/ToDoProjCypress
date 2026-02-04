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
                    echo ===== CLEAN REPORTS =====
                    if exist cypress\\reports rmdir /s /q cypress\\reports
                    mkdir cypress\\reports
                    mkdir cypress\\reports\\register
                    mkdir cypress\\reports\\todo
                    mkdir cypress\\reports\\merged
                '''
            }
        }

        stage('Install') {
            steps {
                bat 'call npm ci'
            }
        }

        stage('Run Cypress (Parallel)') {
            steps {
                script {
                    def branches = [:]

                    if (params.TEST_SUITE == 'both' || params.TEST_SUITE == 'register') {
                        branches['Register Specs'] = {
                            bat """
                                echo ===== RUN REGISTER =====
                                set "REPORT_DIR=cypress/reports/register"
                                call npx cypress run --spec "cypress/e2e/register.cy.js" --browser "${params.BROWSER}"
                            """
                        }
                    }

                    if (params.TEST_SUITE == 'both' || params.TEST_SUITE == 'todo') {
                        branches['Todo Specs'] = {
                            bat """
                                echo ===== RUN TODO =====
                                set "REPORT_DIR=cypress/reports/todo"
                                call npx cypress run --spec "cypress/e2e/todo.cy.js" --browser "${params.BROWSER}"
                            """
                        }
                    }

                    if (branches.size() == 0) {
                        echo "No specs selected."
                    } else {
                        parallel branches
                    }
                }
            }
        }

        stage('Merge Reports') {
            steps {
                bat '''
                    echo ===== FIND JSON FILES =====
                    if not exist cypress\\reports (
                        echo "cypress\\reports not found!"
                        exit /b 1
                    )

                    dir cypress\\reports /s /b | findstr /i "\\.json$" > cypress\\reports\\merged\\_json_list.txt

                    for /f %%A in ('type cypress\\reports\\merged\\_json_list.txt ^| find /c /v ""') do set COUNT=%%A
                    echo Found JSON count: %COUNT%

                    if "%COUNT%"=="0" (
                        echo "No mochawesome JSON files found. Fail build to avoid broken merge."
                        exit /b 1
                    )

                    echo ===== MERGE JSONs (ROBUST GLOB) =====
                    :: This covers:
                    :: cypress/reports/register/.jsons/*.json
                    :: cypress/reports/todo/.jsons/*.json
                    :: and any accidental nesting like .jsons/.jsons/**/*.json
                    call npx mochawesome-merge "cypress/reports/**/.jsons/**/*.json" > cypress/reports/merged/merged.json

                    if not exist cypress\\reports\\merged\\merged.json (
                        echo "merged.json not created!"
                        exit /b 1
                    )

                    echo ===== GENERATE HTML =====
                    call npx marge cypress/reports/merged/merged.json -f index -o cypress/reports/merged

                    if not exist cypress\\reports\\merged\\index.html (
                        echo "index.html not created!"
                        exit /b 1
                    )

                    echo ===== DONE =====
                    dir cypress\\reports\\merged
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
