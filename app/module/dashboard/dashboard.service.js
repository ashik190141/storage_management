const fileModel = require("../file/file.model");
const folderModel = require("../folder/folder.model");
const userModel = require("../auth/auth.model")

const formatStorage = (bytes) => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(2)} GB`;
  } else if (bytes >= MB) {
    return `${(bytes / MB).toFixed(2)} MB`;
  } else if (bytes >= KB) {
    return `${(bytes / KB).toFixed(2)} KB`;
  } else {
    return `${bytes} Bytes`;
  }
};

const overView = async (email) => {
  try {
    const userInfo = await userModel.findOne({ email: email });
    if (!userInfo) {
      throw new Error("user not found");
    }

    let files = await fileModel.find({ email: email });
    let folders = await folderModel.find({ email });
    let result = [];

    let pdf = 0,
      note = 0,
      image = 0;
    let pdfS = 0,
      noteS = 0,
      imageS = 0,
      folderS = 0;

    for (let i = 0; i < files.length; i++) {
      if (files[i]?.folder) {
        folderS += files[i]?.size;
      }
      if (files[i]?.type == "pdf") {
        pdf++;
        pdfS += files[i]?.size;
      } else if (files[i]?.type == "image") {
        image++;
        imageS += files[i]?.size;
      } else {
        note++;
        noteS += files[i]?.size;
      }
    }

    let pdfResult = {
      name: "PDF",
      fileNo: pdf,
      storage: formatStorage(pdfS),
    };

    let imageResult = {
      name: "IMAGE",
      fileNo: image,
      storage: formatStorage(imageS),
    };

    let noteResult = {
      name: "NOTE",
      fileNo: note,
      storage: formatStorage(imageS),
    };

    let folderResult = {
      name: "FOLDER",
      fileNo: folders.length,
      storage: formatStorage(folderS),
    };

    result.push(folderResult ,pdfResult, imageResult, noteResult);

    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const recent = async (email) => {
  try {
    const userInfo = await userModel.findOne({ email: email });
    if (!userInfo) {
      throw new Error("user not found");
    }

    let pdfFiles = await fileModel
      .find({ email: email, type: "pdf" })
      .sort({ createdAt: -1, _id: -1 });

    // console.log(pdfFiles);

    let imageFiles = await fileModel
      .find({ email: email, type: "image" })
      .sort({ createdAt: -1, _id: -1 });

    let noteFiles = await fileModel
      .find({ email: email, type: "note" })
      .sort({ createdAt: -1, _id: -1 });

    let recentFolder = await folderModel
      .find({ email: email })
      .sort({ createdAt: -1, _id: -1 });

    let result = [pdfFiles[0], imageFiles[0], noteFiles[0], recentFolder[0]];

    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const getCalenderInfo = async(req) => {
  try {
    const userInfo = await userModel.findOne({ email: req.user });
    if (!userInfo) {
      throw new Error("user not found");
    }

    const date = req.query.date
    if (!date) {
      throw new Error("Date is required");
    }

    const specificDate = new Date(date);
    const nextDay = new Date(specificDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const files = await fileModel.find({
      createdAt: {
        $gte: specificDate,
        $lt: nextDay,
      },
      email: req.user,
    });

    const folders = await folderModel.find({
      createdAt: {
        $gte: specificDate,
        $lt: nextDay,
      },
      email: req.user,
    });

    return [...files, ...folders]
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

module.exports = {
  overView,
  recent,
  getCalenderInfo,
};
