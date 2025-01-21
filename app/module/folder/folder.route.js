const express = require("express");
const { auth } = require("../../middleware/auth");
const { createFolder, GetFoldersFromDB, FolderFavoriteFromDB, UpdateFolderNameFromDB, DeleteFolderFromDB, DuplicateFolderCreateInDB, GetOneFoldersFromDB, GetFilesFromFolders } = require("./folder.controller");

const createFolderRouter = express.Router();

createFolderRouter.post("/", auth(), createFolder);
createFolderRouter.get("/", auth(), GetFoldersFromDB);
createFolderRouter.put("/:id/favorite", auth(), FolderFavoriteFromDB);
createFolderRouter.put("/:id", auth(), UpdateFolderNameFromDB);
createFolderRouter.delete("/:id", auth(), DeleteFolderFromDB);
createFolderRouter.patch("/:id", auth(), DuplicateFolderCreateInDB);
createFolderRouter.get("/:id", auth(), GetOneFoldersFromDB);
createFolderRouter.get("/:id/files", auth(), GetFilesFromFolders);

module.exports = createFolderRouter;
