const con = require("../config/config");

const getAllData = (tableName, condition) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} WHERE ? ORDER BY id`;

    con.query(query, [condition], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.length ? result : null);
      }
    });
  });
};

const getMultiCondition = (tableName, condition) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM ${tableName} WHERE`;
    let newCond = [];
    for (const [key, value] of Object.entries(condition)) {
      if (value instanceof Object) {
        for (const [op, val] of Object.entries(value)) {
          query += " " + op + " = " + "?";
          newCond.push(val);
        }
      } else {
        query += " " + value;
      }
    }

    con.query(query, newCond, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.length ? result : null);
      }
    });
  });
};

const insertdatatable = (tableName, condition) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO ${tableName} SET ?`;
    con.query(query, condition, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const updatedatacondition = (tableName, dataToUpdate, condition) => {
  return new Promise((resolve, reject) => {
    let query = `UPDATE ${tableName} SET ? WHERE ?`;
    con.query(query, [dataToUpdate, condition], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const updateMultiCondition = (
  tableName,
  dataToUpdate,
  condition1,
  condition2
) => {
  return new Promise((resolve, reject) => {
    let query = `UPDATE ${tableName} SET ? WHERE ? AND ?`;
    con.query(query, [dataToUpdate, condition1, condition2], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getAllData,
  getMultiCondition,
  insertdatatable,
  updatedatacondition,
  updateMultiCondition,
};
