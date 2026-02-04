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
  }

  post {
    always {
      archiveArtifacts artifacts: 'cypress/screenshots/**,cypress/videos/**', allowEmptyArchive: true
    }
  }
}
