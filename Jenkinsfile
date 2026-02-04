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

    stage('Run Cypress (with reporter)') {
      steps {
        // مهم: شغّلي سكربت package.json عشان يتفعّل mochawesome reporter
        bat 'npm run test:report'
      }
    }

    stage('Debug Reports Folder') {
      steps {
        // حتى نشوف فعلياً شو انولد داخل reports
        bat 'if exist cypress\\reports (dir /s cypress\\reports) else (echo "No cypress\\reports folder found")'
      }
    }

    stage('Merge Reports') {
      steps {
        // ما نكسر البيلد لو ما في jsons لأي سبب
        bat 'npm run merge-reports || echo "Merge skipped: no JSON report files found"'
      }
    }

    stage('Generate HTML Report') {
      steps {
        // ما نكسر البيلد لو merge ما عمل output.json
        bat 'npm run generate-report || echo "HTML report skipped: output.json not found"'
      }
    }
  }

  post {
    always {
      // أرشفة كل شيء متعلق بالتقرير + screenshots/videos
      archiveArtifacts artifacts: 'cypress/reports/**,cypress/screenshots/**,cypress/videos/**', allowEmptyArchive: true
    }
  }
}

