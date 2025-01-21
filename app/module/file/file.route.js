const express = require("express");
const { upload } = require("../../helpers/fileUploader");
const { auth } = require("../../middleware/auth");
const { createFile, GetFilesFromDB, UpdateFileNameFromDB, DeleteFileFromDB, DuplicateFileCreateInDB, FileFavoriteFromDB, GetAllFavoriteFileFromDB, GetSpecificFilesFromDB, } = require("./file.controller");

const createFileRouter = express.Router();

createFileRouter.post("/upload", auth(), upload.single("file"), createFile);
createFileRouter.put("/:id", auth(), UpdateFileNameFromDB);
createFileRouter.delete("/:id", auth(), DeleteFileFromDB);
createFileRouter.patch("/:id", auth(), DuplicateFileCreateInDB);
createFileRouter.put("/:id/favorite", auth(), FileFavoriteFromDB);
createFileRouter.get("/get", auth(), GetFilesFromDB);
createFileRouter.get("/info/:id", auth(), GetSpecificFilesFromDB);
createFileRouter.get("/favorite", auth(), GetAllFavoriteFileFromDB);

module.exports = createFileRouter;
