"use strict";
const express = require("express");
const items = express.Router();
const pool = require("./connection");
items.get("/items", (req, res) => {
  let query = `SELECT * FROM items ORDER BY  item_name ASC`;
  pool.query(query).then((response) => {
    res.json(response.rows);
  });
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
  let found = pool
    .query(`SELECT * FROM items WHERE id = ${id}`)
    .then((response) => {
      res.json(response.rows);
    });
  let item_name = req.body.item_name;
  let item_type = req.body.item_type;
  let ambience = req.body.ambience;
  let linkable = req.body.linkable;
  let dyeable = req.body.dyeable;
  let cost = req.body.cost;
  let location = req.body.location;
  let specifics = req.body.specifics;
  let dlc = req.body.dlc;
  let query = `UPDATE items SET 
    dlc = dlc
    WHERE id = id`;
  pool.query(query).then((response) => {
    res.status(200);
    res.json(req.body);
  });
});

items.post("/items", (req, res) => {
  let item_name = req.body.item_name;
  let item_type = req.body.item_type;
  let ambience = req.body.ambience;
  let linkable = req.body.linkable;
  let dyeable = req.body.dyeable;
  let cost = req.body.cost;
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
      cost,
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
