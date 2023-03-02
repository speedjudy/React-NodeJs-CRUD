const express = require("express");
const md5 = require("md5");
const router = express.Router();
var database = require("../config/database.js");

module.exports = function () {
    router.route("/save").post(async function (req, res) {
        if (req.body.flag=="update") {
            await database.update("tst_users", {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            }, {
                id: req.body.id
            });
            res.send({
                status: 'success',
            })
        } else {
            let checkEmail = await database.select("tst_users", {
                email: req.body.email,
            });
            if (checkEmail.data.length > 0) {
                await database.update("tst_users", {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                }, {
                    email: req.body.email
                });
                res.send({
                    status: 'success',
                })
            } else {
                if (req.body.email) {
                    await database.insert("tst_users", {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    });
                }
                res.send({
                    status: 'success',
                })
            }
        }
    });
    router.route("/get").get(async function (req, res) {
        let getData = await database.select("tst_users");
        res.send({
            status: 'success',
            data: getData
        })
    });
    router.route("/delete").post(async function (req, res) {
        await database.delete("tst_users", req.body.id);
        res.send({
            status: 'success',
        })
    });
    return router;
}