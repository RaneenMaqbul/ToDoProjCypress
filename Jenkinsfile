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
                // هذا الأمر يقوم بكل شيء (التشغيل + دمج التقارير + إنشاء HTML)
                // بناءً على الـ Logs الخاصة بك، هذا السكريبت كافٍ جداً
                bat 'npm run test:report'
            }
        }
    }

    post {
        always {
            // أرشفة التقرير النهائي بصيغة HTML والصور والفيديوهات إن وجدت
            archiveArtifacts artifacts: 'cypress/reports/index.html, cypress/screenshots/**, cypress/videos/**', allowEmptyArchive: true
            
            // إضافة رابط التقرير مباشرة في Jenkins (اختياري لكن مفيد جداً)
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'cypress/reports',
                reportFiles: 'index.html',
                reportName: 'Cypress Test Report'
            ])
        }
    }
}
