
const builder = require("electron-builder");
const fs = require("fs");
const package = require("./package.json");

builder.build(
    {
        config: {
            "releaseInfo": {
                "releaseNotes": "XXXXの修正"
            },
            "win": {
                "target": "nsis",
                "publish": [
                    {
                        "provider": "generic",
                        "url": "https://daiyas.dev/client/win/",
                    },
                ],
            },
        },
    })
    .then(function (result) {
        //setup exe copy
        fs.copyFile(
            "./build/" + package.build.productName + " Setup " + package.version + ".exe",
            "../public/client/win/" + package.build.productName + " Setup " + package.version + ".exe",
            err => {
                if (err) {
                    console.log("exe copy failed", err);
                }
                else {
                    console.log("exe copy done");
                }
            }
        );
        //blockmap copy
        fs.copyFile(
            "./build/" + package.build.productName + " Setup " + package.version + ".exe.blockmap",
            "../public/client/win/" + package.build.productName + " Setup " + package.version + ".exe.blockmap",
            err => {
                if (err) {
                    console.log("blockmap copy failed", err);
                }
                else {
                    console.log("blockmap copy done");
                }
            }
        );
        //latest.yml copy
        fs.copyFile(
            "./build/latest.yml",
            "../public/client/win/latest.yml",
            err => {
                if (err) {
                    console.log("latest.yml copy failed", err);
                }
                else {
                    console.log("latest.yml copy done");
                }
            }
        );
        //setup exe renamed copy(for download)
        fs.copyFile(
            "./build/" + package.build.productName + " Setup " + package.version + ".exe",
            "../public/client/win/" + package.build.productName + "Setup.exe",
            err => {
                if (err) {
                    console.log("exe copy failed", err);
                }
                else {
                    console.log("exe copy done");
                }
            }
        );
    })
    .catch(function (e) {
        console.log("build error", e);
        throw e;
    });
