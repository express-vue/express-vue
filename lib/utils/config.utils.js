const path = require("path");
const fs = require("fs");

/**
 * @param {string} pwd
 * @returns {Promise<object>}
 */
async function GetConfig(pwd) {
    const configPath = path.join(pwd, "./expressvue.config.js");
    const isFile = fs.statSync(configPath).isFile();
    if (!isFile) {
        const error = new Error(`ExpressVue cannot a file at ${configPath}`);
        console.error(error);
        throw error;
    } else {
        const config = require(configPath);
        return config;
    }

}

module.exports.GetConfig = GetConfig;
