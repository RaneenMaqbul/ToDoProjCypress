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
      steps { checkout scm }
    }

    stage('Install') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm ci'
          } else {
            bat 'call npm ci'
          }
        }
      }
    }

    stage('Clean Reports') {
      steps {
        script {
          if (isUnix()) {
            sh '''
              rm -rf cypress/reports || true
              mkdir -p cypress/reports/register cypress/reports/todo cypress/reports/merged
            '''
          } else {
            bat '''
              if exist cypress\\reports rmdir /s /q cypress\\reports
              mkdir cypress\\reports
              mkdir cypress\\reports\\register
              mkdir cypress\\reports\\todo
              mkdir cypress\\reports\\merged
            '''
          }
        }
      }
    }

    stage('Run Cypress (Parallel)') {
      steps {
        script {
          def branches = [:]

          if (params.TEST_SUITE == 'both' || params.TEST_SUITE == 'register') {
            branches['Register Specs'] = {
              script {
                if (isUnix()) {
                  sh """
                    export REPORT_DIR=cypress/reports/register
                    npx cypress run --spec "cypress/e2e/register.cy.js" --browser "${params.BROWSER}"
                  """
                } else {
                  bat """
                    set "REPORT_DIR=cypress/reports/register"
                    call npx cypress run --spec "cypress/e2e/register.cy.js" --browser "${params.BROWSER}"
                  """
                }
              }
            }
          }

          if (params.TEST_SUITE == 'both' || params.TEST_SUITE == 'todo') {
            branches['Todo Specs'] = {
              script {
                if (isUnix()) {
                  sh """
                    export REPORT_DIR=cypress/reports/todo
                    npx cypress run --spec "cypress/e2e/todo.cy.js" --browser "${params.BROWSER}"
                  """
                } else {
                  bat """
                    set "REPORT_DIR=cypress/reports/todo"
                    call npx cypress run --spec "cypress/e2e/todo.cy.js" --browser "${params.BROWSER}"
                  """
                }
              }
            }
          }

          parallel branches
        }
      }
    }

    stage('Merge Reports') {
      steps {
        script {
          if (isUnix()) {
            sh '''
              ls -R cypress/reports || true
              test -n "$(find cypress/reports -name '*.json' -print -quit)" || (echo "No mochawesome JSON found" && exit 1)

              npx mochawesome-merge "cypress/reports/**/*.json" > cypress/reports/merged/merged.json
              npx marge cypress/reports/merged/merged.json -f index -o cypress/reports/merged

              test -f cypress/reports/merged/index.html
            '''
          } else {
            bat '''
              REM Debug: show files
              dir cypress\\reports /s /b

              REM Merge ONLY where mochawesome writes jsons in your project (.jsons folder)
              call npx mochawesome-merge "cypress/reports/**/.jsons/*.json" > cypress\\reports\\merged\\merged.json

              REM Generate HTML
              call npx marge cypress\\reports\\merged\\merged.json -f index -o cypress\\reports\\merged

              REM Fail if report not created
              if not exist cypress\\reports\\merged\\index.html exit /b 1
            '''
          }
        }
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
