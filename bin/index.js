#!/usr/bin/env node
/* eslint-disable no-console */

//@ts-ignore
const figlet = require("figlet");
const chalk = require("chalk").default;
const yargs = require("yargs");
const {ProntoWebpack} = require("vue-pronto");
const {GetConfig} = require("../lib/utils/config.utils");

//@ts-ignore
// tslint: disable - next - line; : no - console;
console.log(
    chalk.green(
        figlet.textSync("Express Vue"),
    ),
);

// tslint:disable-next-line:no-unused-expression
yargs
    .command("build", "Build project", (yarg) => {
        return yarg
            .option("verbose", {
                alias: "v",
                default: false,
                boolean: true,
            });
    }, async (argv) => {
        try {
            const config = await GetConfig(process.cwd());
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
