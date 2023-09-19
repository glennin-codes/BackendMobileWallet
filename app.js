const cookieParser = require("cookie-parser");
const express = require("express");
const httpErrors = require("http-errors");
const logger = require("morgan");
// const path = require('path');
const cors = require("cors");
require("dotenv").config();
const indexRouter = require("./routes/index");

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  // Extract and process data here
  const userId = req.body.userId;
  const amount = req.body.amount;

  // Store the data in res.locals to make it available to other middleware and routes
  res.locals.userId = userId;
  res.locals.amount = amount;

 
  next();
});

// app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", indexRouter);
app.get("/", (req, res) => {
  res.send("hi there");
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
