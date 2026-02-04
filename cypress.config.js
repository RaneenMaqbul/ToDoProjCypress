const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "kpj6do",

  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    // يكتب JSONs داخل:
    // cypress/reports/register/.jsons
    // cypress/reports/todo/.jsons
    reportDir: `${process.env.REPORT_DIR || "cypress/reports"}/.jsons`,
    overwrite: false,
    html: false,   // مهم للـ parallel
    json: true,

    reportPageTitle: "Automation Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
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
