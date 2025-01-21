const mongoose = require("mongoose");
const { uploadToCloudinary } = require("../../helpers/fileUploader");
const fileUploadModel = require("../file/file.model");
const folderCreateModel = require("../folder/folder.model");
const userModel = require("../auth/auth.model")

const createFileServices = async (req) => {
  const userInfo = await userModel.findOne({ email: req.user });
  if (!userInfo) {
    throw new Error("user not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const file = req.file;
    const data = req.body;

    if (!file) {
      throw new Error("Please added a file")
    }

    if (file) {
      const uploadFile = await uploadToCloudinary(file);
      data.file = uploadFile?.secure_url;
      let fileName = uploadFile?.original_filename;
      const fileSize = uploadFile?.bytes;
      data.size = fileSize;
      if (uploadFile?.resource_type === "raw") {
        data.type = "note";
        fileName = fileName + ".docx";
      } else if (uploadFile?.format === "pdf") {
        data.type = "pdf";
        fileName = fileName + ".pdf";
      } else {
        data.type = "image";
        fileName = fileName + "." + uploadFile?.format;
      }
      data.name = fileName;
    }

    if (data.data) {
      let folder = JSON.parse(data.data)?.folder;
      data.folder = folder 
    }

    data.email = req.user;
    const result = await fileUploadModel.create([data], { session });

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new Error(`File creation failed: ${error.message}`);
  }
};

const getFilesFromDbServices = async (type, email) => {
  const userInfo = await userModel.findOne({ email });
  if (!userInfo) {
    throw new Error("user not found");
  }

  const allFiles = await fileUploadModel.find({ type: type, email: email }).exec();
  return allFiles;
};

const getSpecificFileFromDbServices = async (id, email) => {
  const userInfo = await userModel.findOne({ email: email });
  if (!userInfo) {
    throw new Error("user not found");
  }

  const allFiles = await fileUploadModel.find({ _id: id, email: email }).exec();
  return allFiles;
};

const renameFileNameServices = async (payload, id,email) => {
  try {
    const userInfo = await userModel.findOne({ email: email });
    if (!userInfo) {
      throw new Error("user not found");
    }

    const query = { _id: id };

    const findTargetName = await fileUploadModel.findOne({ name: payload?.name })
    if (findTargetName) {
      throw new Error("This filename is already exist")
    }

    const targetFile = await fileUploadModel.findOne(query);
    const updatedName = payload.name +'.'+ (targetFile.name).split('.')[1]
    const update = { $set: { name: updatedName } };

    const updatedFile = await fileUploadModel.findOneAndUpdate(
      query,
      update
    );

    if (!updatedFile) {
      throw new Error("File not found or could not be updated");
    }

    return await fileUploadModel.findOne(query);
  } catch (err) {
    console.log(err)
    throw new Error(err.message);
  }
};

const deleteFileService = async (id,email) => {
  try {
    const userInfo = await userModel.findOne({ email: email });
    if (!userInfo) {
      throw new Error("user not found");
    }

    const query = { _id: id,email };

    const fileToDelete = await fileUploadModel.findOne(query);

    if (!fileToDelete) {
      throw new Error("File not found");
    }

    const deletedFile = await fileUploadModel.deleteOne(query);

    if (deletedFile.deletedCount === 0) {
      throw new Error("Failed to delete the file");
    }

    return fileToDelete;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const duplicateFileService = async (id,email) => {
  try {
    const userInfo = await userModel.findOne({ email: email });
    if (!userInfo) {
      throw new Error("user not found");
    }

    const query = { _id: id, email };

    const fileToDuplicate = await fileUploadModel.findOne(query);

    if (!fileToDuplicate) {
      throw new Error("File not found");
    }

    const updatedName =
      fileToDuplicate.name.split(".")[0] +
      `_${new Date().toISOString()}.` +
      fileToDuplicate.name.split(".")[1];

    const duplicatedFile = new fileUploadModel({
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

const addFavoriteServices = async (id,email) => {
  try {
    const userInfo = await userModel.findOne({ email: email });
    if (!userInfo) {
      throw new Error("user not found");
    }

    const query = { _id: id };
    const isFavorite = await fileUploadModel.findOne(query);
    const update = { $set: { favorite: !(isFavorite?.favorite) } };

    const updatedFile = await fileUploadModel.findOneAndUpdate(query, update);

    if (!updatedFile) {
      throw new Error("File not found or could not be updated");
    }

    return await fileUploadModel.findOne(query);
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const getAllFavorite = async (email) => {
  try {
    const userInfo = await userModel.findOne({ email: email });
    if (!userInfo) {
      throw new Error("user not found");
    }

    let result = [];
    const allFiles = await fileUploadModel
      .find({ email: email, favorite: true })
      .exec();
    
    const allFolders = await folderCreateModel
      .find({ email: email, favorite: true })
      .exec();
    
    result = [...allFiles, ...allFolders]
    
    return result
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}


module.exports = {
  createFileServices,
  getFilesFromDbServices,
  renameFileNameServices,
  deleteFileService,
  duplicateFileService,
  addFavoriteServices,
  getAllFavorite,
  getSpecificFileFromDbServices,
};