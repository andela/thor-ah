module.exports = {
  secret:
        process.env.NODE_ENV === 'production' ? process.env.JWT_KEY : 'secret'
};
