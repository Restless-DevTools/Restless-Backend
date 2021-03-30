import Console from 'console';

function printError(message) {
  Console.error('\x1b[31m', 'Error:', message);
}

function printWarning(message) {
  Console.warn('\x1b[33m', 'Warning:', message);
}

function printLog(message) {
  Console.log(message);
}

function addResponseError(res, error, status) {
  let errorMessage;
  if (error && error.details) {
    errorMessage = {
      code: error.details[0].path[0],
      message: error.details[0].message,
    };
  } else {
    errorMessage = {
      code: error.code,
      message: error.message,
    };
  }

  if (process.env.NODE_ENV !== 'test') {
    printError(errorMessage.message);
  }

  res.status(status || 400);
  return res.send(errorMessage);
}

export default {
  printError, printWarning, addResponseError, printLog,
};
