pipeline {
  agent any

  tools {
    nodejs "NodeJS_18"
  }

  parameters {
    choice(name: 'BROWSER', choices: ['chrome', 'edge', 'electron'], description: 'Browser')
    choice(name: 'HEADLESS', choices: ['true', 'false'], description: 'Headless or headed')
    string(name: 'CYPRESS_ENV', defaultValue: '', description: 'Optional Cypress env')
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { bat 'npm ci' }
    }

    stage('Parallel Cypress Runs') {
      parallel {

        stage('Smoke') {
          steps {
            script {
              def cmd = "npx cypress run --browser ${params.BROWSER} --spec \"cypress/e2e/smoke/**/*.cy.js\""
              if (params.CYPRESS_ENV?.trim()) cmd += " --env \"${params.CYPRESS_ENV}\""
              if (params.HEADLESS == 'false') cmd += " --headed"
              // report folder unique
              cmd += " --config reporterOptions.reportDir=cypress/reports/smoke"
              bat cmd
            }
          }
        }

        stage('Regression') {
          steps {
            script {
              def cmd = "npx cypress run --browser ${params.BROWSER} --spec \"cypress/e2e/regression/**/*.cy.js\""
              if (params.CYPRESS_ENV?.trim()) cmd += " --env \"${params.CYPRESS_ENV}\""
              if (params.HEADLESS == 'false') cmd += " --headed"
              cmd += " --config reporterOptions.reportDir=cypress/reports/regression"
              bat cmd
            }
          }
        }

      }
    }

    stage('Merge Report (Optional)') {
      steps {
        // لو عندك mochawesome-merge + marge مثبتين بالـ package.json
        // رح يدمج التقارير من كل الفولدرات
        bat 'npm run merge:report'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'cypress/reports/**', allowEmptyArchive: true

      // اذا عندك report واحد نهائي بآخر مرحلة:
      publishHTML(target: [
        allowMissing: true,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'cypress/reports',
        reportFiles: 'index.html',
        reportName: 'Cypress Mochawesome Report'
      ])
    }
  }
}
