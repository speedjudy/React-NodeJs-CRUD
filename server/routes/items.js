const express = require("express");
const md5 = require("md5");
const router = express.Router();
var database = require("../config/database.js");

module.exports = function () {
    router.route("/save").post(async function (req, res) {
        let checkData = await database.select("tst_datalist", {
            name: req.body.item,
        });
        if (checkData.data.length > 0) {
            await database.update("tst_datalist", {
                name: req.body.item,
                description: req.body.description,
            }, {
                name: req.body.item
            });
            res.send({
                status: 'success',
            })
        } else {
            if (req.body.item) {
                await database.insert("tst_datalist", {
                    name: req.body.item,
                    description: req.body.description,
                });
            }
            res.send({
                status: 'success',
            })
        }
    });
    router.route("/get").get(async function (req, res) {
        let getData = await database.select("tst_datalist");
        res.send({
            status: 'success',
            data: getData
        })
    });
    router.route("/delete").post(async function (req, res) {
        let checkData = await database.select("tst_datalist", {
            id: req.body.id,
        });
        await database.insert("tst_auditlog", {
            data_id: checkData.data[0].id,
            action: "Item with ID "+checkData.data[0].id+" removed",
        });
        await database.delete("tst_datalist", req.body.id);
        res.send({
            status: 'success',
        })
    });
    return router;
}