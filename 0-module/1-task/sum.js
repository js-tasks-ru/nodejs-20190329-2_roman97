function sum(a, b) {
    [a, b].some(term => {
        if (typeof term !== 'number') {
            throw new TypeError('some term is not of type number');
        }
    });

    return a + b;
}

module.exports = sum;
