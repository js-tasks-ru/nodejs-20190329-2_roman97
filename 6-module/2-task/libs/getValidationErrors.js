// eslint-disable-next-line require-jsdoc
function getValidationErrors(errors) {
  return Object.keys(errors).reduce((acc, errorKey) => {
    acc[errorKey] = errors[errorKey].message;

    return acc;
  }, {});
}

module.exports = getValidationErrors;
