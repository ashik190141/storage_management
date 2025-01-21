const catchAsync = require("../../shared/catchAsync");
const sendResponse = require("../../shared/sendResponse");
const { createFolderServices, getFoldersFromDbServices, addFavoriteFolderServices, renameFolderNameServices, deleteFolderService, duplicateFolderService, getSpecificFoldersFromDbServices, getFilesFromFolders } = require("./folder.service");

const createFolder = catchAsync(async (req, res) => {
  const result = await createFolderServices(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Folder Created Successfully`,
    data: result,
  });
});

const GetFoldersFromDB = catchAsync(async (req, res) => {
  const result = await getFoldersFromDbServices(req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Folders Retrieve Successfully`,
    data: result,
  });
});

const GetOneFoldersFromDB = catchAsync(async (req, res) => {
    const id = req.params.id;
  const result = await getSpecificFoldersFromDbServices(id,req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Folders Retrieve Successfully`,
    data: result,
  });
});

const GetFilesFromFolders = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await getFilesFromFolders(id, req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Files of folder retrieved Successfully`,
    data: result,
  });
});


const FolderFavoriteFromDB = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await addFavoriteFolderServices(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Folder Added to Favorite Successfully`,
    data: result,
  });
});

const UpdateFolderNameFromDB = catchAsync(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await renameFolderNameServices(payload, id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Foldername is updated Successfully`,
    data: result,
  });
});

const DeleteFolderFromDB = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await deleteFolderService(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Folder deleted Successfully`,
    data: result,
  });
});

const DuplicateFolderCreateInDB = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await duplicateFolderService(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Folder Created Successfully`,
    data: result,
  });
});


module.exports = {
  createFolder,
  GetFoldersFromDB,
  FolderFavoriteFromDB,
  UpdateFolderNameFromDB,
  DeleteFolderFromDB,
  DuplicateFolderCreateInDB,
  GetOneFoldersFromDB,
  GetFilesFromFolders,
};