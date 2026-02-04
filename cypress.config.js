const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "kpj6do",

  // ✅ Mochawesome Reporter (مرة واحدة فقط)
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",   // ✅ بدون .jsons
    reportFilename: "[name]-report",
    overwrite: false,
    html: false,                    // نخلي HTML يتولد بعد الدمج
    json: true,                     // نخلي JSON ينولد لكل spec
    charts: true,
    reportPageTitle: "Automation Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    quiet: true
  },

  e2e: {
    downloadsFolder: "cypress/downloads",
    chromeWebSecurity: false,

    env: {
      email: "raneen-test@gmail.com",
      password: "Raneen@123456",
    },

    setupNodeEvents(on, config) {
      // ✅ plugin لازم يكون جوّا setupNodeEvents
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },
});

