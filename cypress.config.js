const { defineConfig } = require("cypress");

module.exports = defineConfig({
   projectId: "kpj6do",
   reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
       overwrite: false,
  html: false,
  json: true,
    charts: true,
    reportPageTitle: 'Automation Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
     env: {
      email: "raneen-test@gmail.com",
      password: "Raneen@123456",
    },
        downloadsFolder: 'cypress/downloads',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // تعريف بلجن التقرير لربط الصور والفيديوهات تلقائياً
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
  
  // إعدادات التقرير (خارج e2e)
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,                // يظهر رسوم بيانية في التقرير
    reportPageTitle: 'My Test Report',
    embeddedScreenshots: true,   // يضع لقطات الشاشة داخل ملف الـ HTML نفسه
    inlineAssets: true,          // يخلي ملف الـ HTML مستقل (ما يحتاج مجلدات جنبه)
    saveAllAttempts: false,
  },
});
