function runPromiseInSequence(arr) {
    return arr.reduce(function(promiseChain, currentPromise) {
        return promiseChain.then(function(chainedResult) {
            return currentPromise(chainedResult)
                .then(function(res) {return res})
        })
    }, Promise.resolve());
}

module.exports = {
    runPromiseInSequence: runPromiseInSequence
};