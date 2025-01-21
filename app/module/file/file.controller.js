const catchAsync = require("../../shared/catchAsync");
const sendResponse = require("../../shared/sendResponse");
const { createFileServices, getFilesFromDbServices, renameFileNameServices, deleteFileService, duplicateFileService, addFavoriteServices, getAllFavorite, getSpecificFileFromDbServices } = require("./file.service");

const createFile = catchAsync(async (req, res) => {
  const result = await createFileServices(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `File Upload Successfully`,
    data: result,
  });
});

const GetFilesFromDB = catchAsync(async (req, res) => {
  const fileType = req.query.type;
  console.log(fileType);
  const result = await getFilesFromDbServices(fileType, req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `${fileType.toUpperCase()} Retrieved Successfully`,
    data: result,
  });
});

const GetSpecificFilesFromDB = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await getSpecificFileFromDbServices(id, req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `File Retrieved Successfully`,
    data: result,
  });
});

const UpdateFileNameFromDB = catchAsync(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await renameFileNameServices(payload, id, req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Filename is updated Successfully`,
    data: result,
  });
});

const DeleteFileFromDB = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await deleteFileService(id,req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `File deleted Successfully`,
    data: result,
  });
});

const DuplicateFileCreateInDB = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await duplicateFileService(id,req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `File Created Successfully`,
    data: result,
  });
});

const FileFavoriteFromDB = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await addFavoriteServices(id,req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `File Added to Favorite Successfully`,
    data: result,
  });
});

const GetAllFavoriteFileFromDB = catchAsync(async (req, res) => {
  const result = await getAllFavorite(req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Retrieve Favorite Successfully`,
    data: result,
  });
});

module.exports = {
  createFile,
  GetFilesFromDB,
  UpdateFileNameFromDB,
  DeleteFileFromDB,
  DuplicateFileCreateInDB,
  FileFavoriteFromDB,
  GetAllFavoriteFileFromDB,
  GetSpecificFilesFromDB,
};