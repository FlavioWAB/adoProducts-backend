class FieldValidation {
    notEmpty(fields) {
        const errorArray = Object.keys(fields)
            .filter(key => typeof fields[key] === 'undefined' || fields[key] === '')
            .map((obj, key) => `Field '${obj}' can't be empty`);
        return errorArray.length === 0 ? false : { missingFields: errorArray };
    }
}

module.exports = new FieldValidation();