const isValidNumber = (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (Number.isNaN(userId)) {
    return res.status(400).json({
      error: {
        message: 'Your request ID is invalid'
      },
      status: 'error'
    });
  }
  return null;
};

export default isValidNumber;
