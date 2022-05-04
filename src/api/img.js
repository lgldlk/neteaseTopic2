export function sendFile(file) {
    //模拟图片上传
    return new Promise(function(resolve) {
        let objectURL = URL.createObjectURL(file);
        resolve(objectURL);
    });
}