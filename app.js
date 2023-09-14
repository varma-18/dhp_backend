const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
let cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const oauth2Router = require("./routes/oauth");
const patientsRouter = require("./routes/patients");
const providersRouter = require("./routes/providers");
const organizationRouter = require("./routes/organization");
const invitesRouter = require("./routes/invites");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/oauth", oauth2Router);
app.use("/patients", patientsRouter);
app.use("/providers", providersRouter);
app.use("/organization", organizationRouter);
app.use("/invites", invitesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (error, req, res, next) {
  console.log(error);
  //check the status code of the error messages and set response status
  res.status(error.status || 500);

  //Send the error message
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : null,
  });
});

const port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log("listening on port " + port + "!");
});

module.exports = app;
