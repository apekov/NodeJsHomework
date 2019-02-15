const fs = require('fs');
const path = require('path');

let array = [];
// Составление массива из путей ко всем изображениям
function arrayImage(dir) {
    let dirSpace = fs.readdirSync(dir);

    dirSpace.forEach(element => {
        let pathImage = path.join(dir, element);
        let state = fs.statSync(pathImage);

        if (state.isDirectory()) {
            arrayImage(pathImage);
        } else {
            array.push(pathImage);
        }
    });
}
// Сортировка массива, получение всех необходимых данным в виде объекта
function sortArray(array) {
    let arrayObject = array.map((element) => {
        let fileName = element.split(path.sep);

        return {
            filePath: element,
            fileName: fileName[fileName.length - 1],
            newDirName: fileName[fileName.length - 1][0].toUpperCase()
        }
    })

    let sort = arrayObject.sort(function(a, b) {
        if (a.fileName.toLowerCase() < b.fileName.toLowerCase()) { return -1; }
        if (a.fileName.toLowerCase() > b.fileName.toLowerCase()) { return 1; }
        return 0;
    })
    return sort;
}
// Создание новой структуры папок
function createNewDir(sortArray, dirBegin) {
    if (!fs.existsSync(`./${dirBegin}`)) {
        fs.mkdirSync(`./${dirBegin}`);
    }
    sortArray.map((element) => {
        if (!fs.existsSync(`./${dirBegin}/${element.newDirName}`)) {
            if (element.newDirName != '.') {
                fs.mkdirSync(`${dirBegin}/${element.newDirName}`);
            }
        }
        if (element.newDirName != '.') {
            fs.link(element.filePath, `${dirBegin}/${element.newDirName}/${element.fileName}`, (err, data) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
            });
        }
    })
}
// Удаление старой структуры папок
function deleteOldDir(dir) {
    let dirSpace = fs.readdirSync(dir);

    dirSpace.forEach(element => {
        let pathImage = path.join(dir, element);
        let state = fs.statSync(pathImage);

        if (state.isDirectory()) {
            deleteOldDir(pathImage);
        } else {
            fs.unlink(pathImage, err => {
                if (err) {
                    console.log(err);
                    return;
                }
                fs.unlinkSync(pathImage);
            });
        }
    });
    fs.rmdir(dir, err => {
        if (err) {
            console.log(err);
            return;
        }
    });
}
// Получение данных из значений вводимы при запуске
const dir = process.argv[2] ? `./${process.argv[2]}` : './img-dir';
const newDir = process.argv[3] ? `${process.argv[3]}` : 'sortImg';
const del = process.argv[4];

arrayImage(dir);
let newPathArray = sortArray(array);
createNewDir(newPathArray, newDir);

if (del) {
    deleteOldDir(dir);
}