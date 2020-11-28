
export const rejectedPromise = (message) => {
    return new Promise((res,rej) => {
        rej(message);
    });
}

export const emptyPromise =  (defaultResponse) => new Promise(function(res, rej){
    res(defaultResponse);
});