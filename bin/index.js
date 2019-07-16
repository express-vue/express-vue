#!/usr/bin/env node
/* eslint-disable no-console */

//@ts-ignore
const figlet = require("figlet");
const chalk = require("chalk").default;
const yargs = require("yargs");
const {ProntoWebpack} = require("vue-pronto");
const fs = require("fs");
const path = require("path");
//@ts-ignore
const findNodeModules = require("find-node-modules");

//@ts-ignore
console.log(
    chalk.green(
        figlet.textSync("Express Vue"),
    ),
);

/**
 * @param {String} cwdPath
 * @returns {String}
 */
function FindNodeModules(cwdPath) {
    const nodeModulesPath = findNodeModules({cwd: cwdPath});
    const nodeModulesPathResolved = path.join(cwdPath, nodeModulesPath[0]);
    return nodeModulesPathResolved;
}

// tslint:disable-next-line:no-unused-expression
yargs
    .command("build [config]", "Build project", (yarg) => {
        yarg
            .positional("config", {
                describe: "Config file location",
                default: "./expressvue.config.js",
            });
    }, (argv) => {
        if (argv.verbose) { console.info(`Building with ${argv.config}`); }

        const nodeModulesPath = FindNodeModules(__dirname);
        const rootPath = path.resolve(nodeModulesPath, "../");
        const configPath = path.join(rootPath, argv.config);
        fs.stat(configPath, function(err, stat) {
            if (err) {
                console.error(`ExpressVue cannot find the file at ${configPath}`);
                process.exit(1);
            }
            if (!stat.isFile()) {
                console.error(`ExpressVue cannot a file at ${configPath}`);
            } else {
                const config = require(configPath);
                const renderer = new ProntoWebpack(config);
                renderer.Bootstrap();
            }
        });
    })
    .option("verbose", {
        alias: "v",
        default: false,
        boolean: true,
    })
    .argv;
