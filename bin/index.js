#!/usr/bin/env node
/* eslint-disable no-console */

//@ts-ignore
const figlet = require("figlet");
const chalk = require("chalk").default;
const yargs = require("yargs");
const {ProntoWebpack} = require("vue-pronto");
const {GetConfig} = require("../lib/utils/config.utils");
const path = require("path");

//@ts-ignore
// tslint: disable - next - line; : no - console;
console.log(
    chalk.green(
        figlet.textSync("Express Vue"),
    ),
);

// tslint:disable-next-line:no-unused-expression
yargs
    .command("build [configPath]", "Build project", (yarg) => {
        return yarg
            .positional("configPath", {
                type: "string",
                default: process.cwd(),
                normalize: true,
                describe: "The path where expressvue.config.js lives",
            })
            .coerce("configPath", (arg) => {
                return path.join(process.cwd(), arg);
            })
            .option("verbose", {
                alias: "v",
                default: false,
                boolean: true,
            });
    }, async (argv) => {
        try {
            if (argv.verbose) {
                console.info("Loading config from " + argv.configPath);
            }
            const config = await GetConfig(argv.configPath);
            if (argv.verbose) {
                console.info(config);
            }
            const renderer = new ProntoWebpack(config);
            return await renderer.Bootstrap(true);
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    })
    .help()
    .argv;
