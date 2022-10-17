// import fs from "fs"

export const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

/*
export const readDirectory = (dirName) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirName, (err, files) => {
            if (err) {
                reject(err)
            } else {
                resolve(files)
            }
        })
    })
}
*/