const catchAsync = require("../../shared/catchAsync");
const sendResponse = require("../../shared/sendResponse");
const { overView, recent, getCalenderInfo } = require("./dashboard.service");


const GetOverviewFromDB = catchAsync(async (req, res) => {
  const result = await overView(req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Overview Info Retrieved Successfully`,
    data: result,
  });
});

const GetORecentFromDB = catchAsync(async (req, res) => {
  const result = await recent(req.user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Recent Added Files and Folder Retrieved Successfully`,
    data: result,
  });
});

const GetFileByDateFromDB = catchAsync(async (req, res) => {
  const result = await getCalenderInfo(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Files and Folder Retrieved Successfully`,
    data: result,
  });
});

module.exports = {
  GetOverviewFromDB,
  GetORecentFromDB,
  GetFileByDateFromDB,
};