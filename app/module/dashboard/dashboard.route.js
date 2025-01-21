const express = require("express");
const { auth } = require("../../middleware/auth");
const { GetOverviewFromDB, GetORecentFromDB, GetFileByDateFromDB } = require("./dashboard.controller");

const dashboardRouter = express.Router();

dashboardRouter.get("/overview", auth(), GetOverviewFromDB);
dashboardRouter.get("/recent", auth(), GetORecentFromDB);
dashboardRouter.get("/calender", auth(), GetFileByDateFromDB);

module.exports = dashboardRouter;
