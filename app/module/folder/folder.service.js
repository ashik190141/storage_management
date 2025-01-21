const { mongoose } = require("mongoose");
const folderCreateModel = require("./folder.model");
const fileModel = require("../file/file.model");

const createFolderServices = async (req) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    req.body.email = req.user;

    const data = req.body;
    const result = await folderCreateModel.create([data], { session });

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new Error(`File creation failed: ${error.message}`);
  }
};

const getFoldersFromDbServices = async (email) => {
  const allFolders = await folderCreateModel.find({ email: email }).exec();
  return allFolders;
};

const getSpecificFoldersFromDbServices = async (id,email) => {
  const result = await folderCreateModel.find({ _id: id, email:email }).exec();
  return result;
};

const addFavoriteFolderServices = async (id) => {
  try {
    const query = { _id: id };
    const isFavorite = await folderCreateModel.findOne(query);
    const update = { $set: { favorite: !isFavorite?.favorite } };

    const updatedFile = await folderCreateModel.findOneAndUpdate(query, update);

    if (!updatedFile) {
      throw new Error("File not found or could not be updated");
    }

    return await folderCreateModel.findOne(query);
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const renameFolderNameServices = async (payload, id) => {
  try {
    const query = { _id: id };

    const findTargetName = await folderCreateModel.findOne({
      name: payload?.name,
    });
    if (findTargetName) {
      throw new Error("This filename is already exist");
    }

    const targetFile = await folderCreateModel.findOne(query);
    const updatedName = payload.name;
    const update = { $set: { name: updatedName } };

    const updatedFile = await folderCreateModel.findOneAndUpdate(query, update);

    if (!updatedFile) {
      throw new Error("File not found or could not be updated");
    }

    return await folderCreateModel.findOne(query);
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const deleteFolderService = async (id) => {
  try {
    const query = { _id: id };

    const fileToDelete = await folderCreateModel.findOne(query);

    if (!fileToDelete) {
      throw new Error("File not found");
    }

    const deletedFile = await folderCreateModel.deleteOne(query);

    if (deletedFile.deletedCount === 0) {
      throw new Error("Failed to delete the file");
    }

    return fileToDelete;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const duplicateFolderService = async (id) => {
  try {
    const query = { _id: id };

    const fileToDuplicate = await folderCreateModel.findOne(query);

    if (!fileToDuplicate) {
      throw new Error("File not found");
    }

    const updatedName =
      fileToDuplicate.name.split(".")[0] +
      `_${new Date().toISOString()}.`

    const duplicatedFile = new folderCreateModel({
      ...fileToDuplicate.toObject(),
      _id: undefined,
      name: updatedName,
    });

    const savedDuplicate = await duplicatedFile.save();

    return savedDuplicate;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const getFilesFromFolders = async (id,email) => {
  const files = await fileModel.find({ folder: id, email }).exec();
  return files
}

module.exports = {
  createFolderServices,
  getFoldersFromDbServices,
  addFavoriteFolderServices,
  renameFolderNameServices,
  deleteFolderService,
  duplicateFolderService,
  getSpecificFoldersFromDbServices,
  getFilesFromFolders,
};
