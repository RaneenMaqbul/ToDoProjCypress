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
        // أضفت لك خيار تحديد عدد العمليات المتوازية
        choice(
            name: 'PARALLEL_STREAMS',
            choices: ['1', '2', '3'],
            description: 'Number of parallel streams to run'
        )
        string(
            name: 'SPEC',
            defaultValue: '',
            description: 'Optional: run specific spec(s). Example: cypress/e2e/todo.cy.js'
        )
        choice(
            name: 'HEADLESS',
            choices: ['true', 'false'],
            description: 'Run headless or not'
        )
        string(
            name: 'CYPRESS_ENV',
            defaultValue: '',
            description: 'Optional: Cypress env variables.'
        )
    }

    stages {
        stage('Setup') {
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
            }
        }

        stage('Run Cypress in Parallel') {
            steps {
                script {
                    // تعريف المهام المتوازية
                    def parallelRuns = [:]
                    int streams = params.PARALLEL_STREAMS.toInteger()

                    for (int i = 1; i <= streams; i++) {
                        def streamIndex = i // نحتاجه داخل الـ closure
                        parallelRuns["Stream-${streamIndex}"] = {
                            stage("Execution Stream ${streamIndex}") {
                                def cmd = "npm run test:report -- --browser ${params.BROWSER}"
                                
                                if (params.SPEC?.trim()) {
                                    cmd += " --spec \"${params.SPEC}\""
                                }
                                if (params.CYPRESS_ENV?.trim()) {
                                    cmd += " --env \"${params.CYPRESS_ENV}\""
                                }
                                if (params.HEADLESS == 'false') {
                                    cmd += " --headed"
                                }

                                bat cmd
                            }
                        }
                    }

                    // تشغيل المهام فعلياً
                    parallel parallelRuns
                }
            }
        }
    }

    post {
        always {
            // أرشفة التقارير
            archiveArtifacts artifacts: 'cypress/reports/index.html', allowEmptyArchive: true

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
