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
                // التشغيل وإصدار التقرير
                bat 'npm run test:report'
            }
        }
    }

    post {
        always {
            // أرشفة التقرير النهائي والصور والفيديوهات
            // رح تلاقي الملفات في قسم الـ Last Successful Artifacts على يمين الصفحة في جينكنز
            archiveArtifacts artifacts: 'cypress/reports/index.html, cypress/screenshots/**, cypress/videos/**', allowEmptyArchive: true
        }
    }
}
