"use strict";
const express = require("express");
const items = express.Router();
const pool = require("./connection");
const format = require("pg-format");
items.get("/items", (req, res) => {
  let validAttr = [
    "item_name",
    "item_type",
    "ambience",
    "linkable",
    "dyeable",
    "item_cost",
  ];
  let keys = [];
  let counter = 0;
  let values = [];
  let base = `SELECT * FROM items WHERE`;
  let end = `ORDER BY item_name ASC`;
  const validQueryParams = Object.keys(req.query)
    .filter((key) => validAttr.includes(key))
    .map((v) => {
      const obj = {};
      obj[v] = req.query[v];
      keys.push(v);
      if (v === "item_cost") {
        values.push(parseInt(obj[v]));
      } else {
        values.push(obj[v]);
      }
      return obj;
    });
  if (values.length !== 0) {
    console.log(values);
    for (let i = 0; i < keys.length; i++) {
      let colName = keys[i];
      counter++;
      base += " " + colName + " = " + "$" + `${counter}`;
      if (counter < keys.length) {
        base += " AND";
      }
    }
    let query = base + " " + end;
    console.log(query);
    pool.query(query, values).then((response) => {
      res.json(response.rows);
    });
  } else {
    let query = `SELECT * FROM items ORDER BY item_name ASC`;
    pool.query(query).then((response) => {
      res.json(response.rows);
    });
  }
});

items.get("/items/:id", (req, res) => {
  let id = req.params.id;
  let query = `SELECT * FROM items WHERE id = ${id}`;
  pool.query(query).then((response) => {
    res.json(response.rows);
  });
});

items.put("/items/:id", (req, res) => {
  let id = req.params.id;
  let item_name = req.body.item_name;
  let item_type = req.body.item_type;
  let ambience = req.body.ambience;
  let linkable = req.body.linkable;
  let dyeable = req.body.dyeable;
  let item_cost = req.body.item_cost;
  let location = req.body.location;
  let specifics = req.body.specifics;
  let dlc = req.body.dlc;
  let data = [
    item_name,
    item_type,
    ambience,
    linkable,
    dyeable,
    item_cost,
    location,
    specifics,
    dlc,
  ];
  let query = `UPDATE items SET 
    item_name = $1,
    item_type = $2,
    ambience = $3,
    linkable = $4,
    dyeable = $5,
    item_cost = $6,
    location = $7,
    specifics = $8,
    dlc = $9
    WHERE id = ${id}
  `;

  pool.query(query, data).then((response) => {
    res.sendStatus(200);
  });
});

items.post("/items", (req, res) => {
  let item_name = req.body.item_name;
  let item_type = req.body.item_type;
  let ambience = req.body.ambience;
  let linkable = req.body.linkable;
  let dyeable = req.body.dyeable;
  let item_cost = req.body.cost;
  let location = req.body.location;
  let specifics = req.body.specifics;
  let dlc = req.body.dlc;
  let query = `INSERT INTO items (item_name, item_type, ambience, linkable, dyeable, cost, location, specifics, dlc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
  pool
    .query(query, [
      item_name,
      item_type,
      ambience,
      linkable,
      dyeable,
      item_cost,
      location,
      specifics,
      dlc,
    ])
    .then((response) => {
      res.status(201);
      res.json(req.body);
    });
});

items.delete("/items/:id", (req, res) => {
  let id = req.params.id;
  let query = `DELETE FROM items WHERE id = ${id}`;
  pool.query(query).then((response) => {
    res.status(200);
    res.send(`Item with id of ${id}, has been deleted!`);
  });
});

module.exports = items;
