const success = (res, status, data) => {
  return res.status(status).json({ data });
};

const error = (res, status, code, message) => {
  return res.status(status).json({
    error: {
      code,
      message
    }
  });
};

module.exports = { success, error };