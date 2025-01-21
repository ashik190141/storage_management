const express = require("express");
const authRouter = require("../auth/auth.route");
const dashboardRouter = require("../dashboard/dashboard.route");
const createFileRouter = require("../file/file.route");
const createFolderRouter = require("../folder/folder.route");

const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/file",
    route: createFileRouter,
  },
  {
    path: "/folder",
    route: createFolderRouter,
  },
  {
    path: "/dashboard",
    route: dashboardRouter,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

module.exports = router;
