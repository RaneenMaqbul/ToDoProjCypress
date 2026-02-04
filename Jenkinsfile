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

    stage('Clean Reports') {
      steps {
        bat '''
          if exist cypress\\reports rmdir /s /q cypress\\reports
          mkdir cypress\\reports
        '''
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
            bat 'set "REPORT_DIR=cypress/reports/register" && npx cypress run --spec "cypress/e2e/register.cy.js" --browser chrome'
          }
        }

        stage('Run Todo Tests') {
          steps {
            bat 'set "REPORT_DIR=cypress/reports/todo" && npx cypress run --spec "cypress/e2e/todo.cy.js" --browser chrome'
          }
        }

      }
    }

    stage('Merge Mochawesome Reports') {
      steps {
        bat '''
          if exist cypress\\reports\\merged rmdir /s /q cypress\\reports\\merged
          mkdir cypress\\reports\\merged

          echo ====== DEBUG: JSON FILES FOUND (.jsons) ======
          dir /s /b cypress\\reports\\.jsons\\*.json

          npx mochawesome-merge "cypress/reports/**/.jsons/*.json" > cypress/reports/merged/merged.json
          npx marge cypress/reports/merged/merged.json -f index -o cypress/reports/merged
        '''
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
          reportDir: 'cypress/reports/merged',
          reportFiles: 'index.html',
          reportName: 'Cypress Mochawesome Report'
        ])
      }
    }
  }
}
