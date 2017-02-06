/*

    Load the keyboard-a11y demo and confirm the overview panel closes properly.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("gpii-webdriver");
gpii.webdriver.loadTestingSupport();

var isOverviewPanelVisible = function () {
    return $(".fl-overviewPanel-closeControl").attr("aria-expanded");
};

fluid.defaults("demos.overviewPanel.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    rawModules: [{
        name: "Testing that the overview panel closes...",
        tests: [
            {
                name: "Access the keyboard-a11y demo...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args:     ["http://build.fluidproject.org/infusion/demos/keyboard-a11y/"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated({ css: ".fl-overviewPanel-closeControl"})]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [gpii.webdriver.By.css(".fl-overviewPanel-closeControl")]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{fn: "click", args: ["{arguments}.0"]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [isOverviewPanelVisible]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The overview panel is visible...", "{arguments}.0", "false"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("demos.webdriver.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "demos.overviewPanel.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "demos.webdriver.environment" });
