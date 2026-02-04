pipeline {
  agent any

  tools {
    nodejs "NodeJS_18"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { bat 'npm ci' }
    }

    stage('Run Cypress') {
      steps { bat 'npx cypress run --browser chrome' }
    }

    stage('Merge Reports') {
      steps { bat 'npm run merge-reports' }
    }

    stage('Generate HTML Report') {
      steps { bat 'npm run generate-report' }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'cypress/reports/**,cypress/screenshots/**,cypress/videos/**', allowEmptyArchive: true
    }
  }
}

