class FieldValidation {
    errorChecker(fields, errorTemplate, testingFunction) {

        const errorArray = Object.keys(fields)
            .filter(key => testingFunction(fields[key]))
            .map((obj) => errorTemplate(obj));
        return errorArray.length === 0 ? false : errorArray;
    }

    areEmpty(fields) {
        const errorTemplate = (obj) => {
            return `Field '${obj}' can't be empty`
        };

        const testingFunction = (item) => {
            return typeof item === 'undefined' || item === ''
        }

        return this.errorChecker(fields, errorTemplate, testingFunction)
    }

    areNotNumbers(fields) {
        const errorTemplate = (obj) => {
            return `Field '${obj}' must be a number`
        };

        const testingFunction = (item) => {
            return typeof item !== 'number'
        }

        return this.errorChecker(fields, errorTemplate, testingFunction)
    }
}

module.exports = new FieldValidation();