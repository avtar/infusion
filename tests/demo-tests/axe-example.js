/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");
var demos = fluid.registerNamespace("demos");

require("gpii-webdriver");
gpii.webdriver.loadTestingSupport();

demos.isOverviewPanelCollapsed = function (testEnvironment) {
    console.log("isOverviewPanelCollapsed");
    var locator = gpii.webdriver.By.css(".fl-overviewPanel-body");

    var closeControl = testEnvironment.webdriver.findElement(locator);

    var promise = closeControl.getSize().then(function (value) {
        var height = value.height;
        var width = value.width;
        console.log(height, width);
        var isCollapsed = height < 1 && width < 1;
        if(isCollapsed) {
            console.log("panel is collapsed, width and height < 1");
            return true;
        } else {
            console.log("panel is not yet fully collapsed, width / height > 1");
            return false;
        }
    });

    return promise;
};

fluid.defaults("demos.accessibilityReports", {
    gradeNames: ["gpii.test.webdriver.caseHolder", "gpii.test.webdriver.hasAxeContent"],
    invokers: {
        "isOverviewPanelCollapsed": {
            "funcName": "demos.isOverviewPanelCollapsed",
            "args": ["{testEnvironment}"]
        }
    },
    scriptPaths: {
        axe: "node_modules/axe-core/axe.js"
    },
    rawModules: [{
        name: "Building accessibility reports...",
        tests: [
            {
                name: "Running aXe report...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args:     ["http://localhost:7357/demos/keyboard-a11y/index.html"]
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
                        listener: "{testEnvironment}.webdriver.wait",
                        args:     ["{that}.isOverviewPanelCollapsed", 5000, "Timed out"]
                    },
                    {
                        event: "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args: ["{that}.options.scriptContent.axe"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args: [gpii.test.webdriver.axe.runAxe]
                    },
                    {
                        event: "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "gpii.test.webdriver.axe.checkResults",
                        args: ["{arguments}.0", "{that}.options.axeOptions"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("demos.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        accessibilityReports: {
            type: "demos.accessibilityReports"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "demos.environment" });
