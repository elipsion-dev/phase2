exports.errorHandler = (err, req, res, next) => {
  if (err.statusCode === 403) {
    res.status(403).json({ error: err.message });
  } else {
    console.log(err)
    !!err.statusCode ? err.statusCode : (err.statusCode = 500);
    return res.status(err.statusCode).json({
      message: err.statusCode === 500 ? "Unknown Error Occured" : err.message,
      status: false,
    });
  }
};
