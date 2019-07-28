const asyncHandler = fn => (...args) => {
  const response = fn(...args);
  const next = args[args.length - 1];

  return Promise.resolve(response).catch(next);
};

module.exports = asyncHandler;
