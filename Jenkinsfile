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
            // unique report folder to avoid parallel conflict
            bat 'set REPORT_DIR=cypress/reports/register && npx cypress run --spec "cypress/e2e/register.cy.js" --browser chrome'
          }
        }

        stage('Run Todo Tests') {
          steps {
            // unique report folder to avoid parallel conflict
            bat 'set REPORT_DIR=cypress/reports/todo && npx cypress run --spec "cypress/e2e/todo.cy.js" --browser chrome'
          }
        }

      }
    }

    stage('Merge Mochawesome Reports') {
      steps {
        // Merge all JSON reports from both branches into one HTML report
        bat '''
          if exist cypress\\reports\\merged rmdir /s /q cypress\\reports\\merged
          mkdir cypress\\reports\\merged

          npx mochawesome-merge "cypress/reports/**/.jsons/*.json" > cypress/reports/merged/merged.json
          npx marge cypress/reports/merged/merged.json -f index -o cypress/reports/merged
        '''
      }
    }
  }

  post {
    always {
      // archive everything (including per-branch reports + merged report)
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
