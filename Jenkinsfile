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
                        // عزل Cypress/APPDATA لهذا الفرع + فصل فولدر التقرير
                        bat """
                        set "APPDATA=%WORKSPACE%\\_appdata_chrome"
                        set "LOCALAPPDATA=%WORKSPACE%\\_localappdata_chrome"
                        if not exist "%APPDATA%" mkdir "%APPDATA%"
                        if not exist "%LOCALAPPDATA%" mkdir "%LOCALAPPDATA%"

                        set "MOCHAWESOME_REPORTDIR=cypress\\reports\\chrome"
                        set "MOCHAWESOME_REPORTFILENAME=index"

                        npm run test:report -- --browser chrome
                        """
                    }
                }

                stage('Edge Tests') {
                    steps {
                        // عزل Cypress/APPDATA لهذا الفرع + فصل فولدر التقرير
                        bat """
                        set "APPDATA=%WORKSPACE%\\_appdata_edge"
                        set "LOCALAPPDATA=%WORKSPACE%\\_localappdata_edge"
                        if not exist "%APPDATA%" mkdir "%APPDATA%"
                        if not exist "%LOCALAPPDATA%" mkdir "%LOCALAPPDATA%"

                        set "MOCHAWESOME_REPORTDIR=cypress\\reports\\edge"
                        set "MOCHAWESOME_REPORTFILENAME=index"

                        npm run test:report -- --browser edge
                        """
                    }
                }
            }
        }

        // (اختياري لكنه ممتاز) Stage لدمج التقارير إذا بدك تقرير واحد
        stage('Merge Report') {
            steps {
                // إذا سكربت test:report عندك أصلاً بعمل merge عام،
                // ممكن تحذفي هالستيج. إذا بدك merge هنا، احكيلي شو مستخدمة بالضبط (marge/mochawesome-merge).
                echo 'Report folders: cypress/reports/chrome and cypress/reports/edge'
            }
        }
    }

    post {
        always {

            archiveArtifacts artifacts: 'cypress/reports/**, cypress/screenshots/**, cypress/videos/**', allowEmptyArchive: true

            // إذا بدك تعرض تقرير واحد ثابت:
            // - خلي reportDir على المسار اللي فيه index.html النهائي
            // حالياً إذا كل فرع بطلع index.html داخل chrome/edge لازم تختاري واحد
            script {
                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'cypress/reports/chrome',
                    reportFiles: 'index.html',
                    reportName: 'Cypress Mochawesome Report (Chrome)'
                ])
            }
        }
    }
}
