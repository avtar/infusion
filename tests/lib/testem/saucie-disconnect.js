#!/usr/bin/env node

"use strict";

var saucie = require("saucie");
var pidFile = "/tmp/sc_client.pid";

saucie.disconnect(pidFile);
