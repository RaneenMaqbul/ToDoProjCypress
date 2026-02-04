const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "kpj6do",

reporter: 'cypress-mochawesome-reporter',
reporterOptions: {
  reportDir: process.env.REPORT_DIR || 'cypress/reports',
  overwrite: false,
  html: false,
  json: true,
},

  e2e: {
    env: {
      email: "raneen-test@gmail.com",
      password: "Raneen@123456",
    },
    downloadsFolder: "cypress/downloads",
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },
});
