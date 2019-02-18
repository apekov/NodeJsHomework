const fs = require('fs');
const path = require('path');

const dirOld = process.argv[2] ? `${process.argv[2]}` : 'img-dir';
const newDir = process.argv[3] ? `${process.argv[3]}` : 'sortImg';
const del = process.argv[4] === 'del';

let readDirAsync = path => {
    return new Promise((res, rej) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                rej(err);
            } else {
                let array = [];
                files.forEach(file => {
                    if (file[0] !== '.') {
                        array.push(file);
                    }
                })
                res(array);
            }
        })
    })
}
let mkdirDirAsync = path => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, err => {
            if (err && err.code !== 'EEXIST') {
                reject(err)
            } else {
                resolve(true);
            }
        })
    })
}
let linkAsync = (basePath, newPathDir) => {
    return new Promise((resolve, reject) => {
        let fileName = basePath.split(path.sep);
        fs.link(`./${basePath}`, `./${newPathDir}/${fileName[fileName.length - 1]}`, err => {
            if (err) {
                reject(err)
            }
        })
    })
}

let recursionCopyFolder = async dirBase => {
    try {
        let dirSpace = await readDirAsync(dirBase);

        dirSpace.forEach(async element => {
            let dirSrc = path.join(dirBase, element);
            let newDirName = element[0].toUpperCase();

            if (element.includes('.')) {
                await mkdirDirAsync(path.join(newDir, newDirName));
                await linkAsync(dirSrc, path.join(newDir, newDirName));

            } else {
                recursionCopyFolder(dirSrc);
            }
            if (del) {
                console.log(dirSrc);
            }
        })
    } catch (err) {
        console.log(err);
    }
}
fs.stat(`./${newDir}`, (err, stats) => {
    if (err) {
        mkdirDirAsync(newDir).then();
    }
})
recursionCopyFolder(dirOld);

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
    process.exit(1);
});