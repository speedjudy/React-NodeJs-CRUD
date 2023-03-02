var mysql = require("mysql2/promise");
const dbInfo = require("./database.json");
let con;

module.exports = {
  select: async (table, params = null) => {
    con = await mysql.createConnection(dbInfo);
    var sql = "SELECT * FROM " + table + " WHERE 1 = 1";
    for (var i in params) sql += " AND " + i + " = ?";
    let rows;
    if (params) {
      [rows] = await con.query(sql, Object.values(params));
    } else {
      [rows] = await con.query(sql);
    }
    if (rows == null || rows == undefined) return { status: "failed" };
    else return { status: "success", data: rows };
  },
  selectOr: async (table, params = null) => {
    con = await mysql.createConnection(dbInfo);
    var sql = "SELECT * FROM " + table + " WHERE ";
    for (var i in params) sql += " OR " + i + " = ?";
    sql = sql.replace('OR','');
    let [rows] = await con.query(sql, Object.values(params));
    if (rows == null || rows == undefined) return { status: "failed" };
    else return { status: "success", data: rows };
  },
  insert: async (table, params) => {
    con = await mysql.createConnection(dbInfo);
    var sql = "INSERT INTO " + table + "(" + Object.keys(params).join(",") + ") VALUES(\"" + Object.values(params).join("\",\"") + "\")";
    let res = await con.query(sql);
    if (res[0].insertId !== undefined)
      return { status: "success", uID: res[0].insertId };
    else return { status: "failed" };
  },
  delete: async (table, params) => {
    con = await mysql.createConnection(dbInfo);
    var sql = "DELETE FROM " + table + " WHERE id=" + params;
    let res = await con.query(sql);
    if (res[0].insertId !== undefined)
      return { status: "success" };
    else return { status: "failed" };
  },
  update: async (table, params, where) => {
    con = await mysql.createConnection(dbInfo);
    var sql = "UPDATE " + table + " SET "
    var first = true;
    for (var i in params) {
      if (!first) {
        sql += ',';
      }
      sql += i + " = '" + params[i] + "'";
      first = false;
    }

    if (where) {
      sql += " WHERE ";
      first = true;
      for (var i in where) {
        if (!first) {
          sql += ',';
        }
        sql += i + " = '" + where[i] + "'";
        first = false;
      }
    }

    let res = await con.query(sql);
    if (res[0].insertId !== undefined)
      return { status: "success", uID: res[0].insertId };
    else return { status: "failed" };
  },
  plus: async (table, field, plus, where) => {
    con = await mysql.createConnection(dbInfo);
    var sql = "UPDATE " + table + " SET " + field + " = " + field + "+" + plus;
    var first = true;
    if (where) {
      sql += " WHERE ";
      first = true;
      for (var i in where) {
        if (!first) {
          sql += ',';
        }
        sql += i + " = '" + where[i] + "'";
        first = false;
      }
    }
    await con.query(sql);
  }
};
