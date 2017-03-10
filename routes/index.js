var express = require('express');
var fs = require('fs');
var nodePath = require('path');
var getFiles = require('./utils/getFiles');
var getPath = require('./utils/getPath');
var router = express.Router();

var separatorList = ["\\", "/"], title = '照片展示';

/* GET home page. */
router.get('/', function (req, res, next) {
    var result = JSON.parse(fs.readFileSync('public/configs/path.json'));
    var path = req.query.path ? req.query.path : result.path;
    if (!path) {
        res.render('setPath', {
            title: title,
            path: '',
            errorMsg: ''
        });
    }
    //读取文件
    var directoriesList = [], fileList = [], pathList = [];
    if (path) {
        for (var sepIndex in separatorList) {
            if (path.indexOf(separatorList[sepIndex]) != -1) {
                getPath(path, pathList, separatorList[sepIndex]);
                try {
                    fileList = getFiles.getImageFiles(path, directoriesList, separatorList[sepIndex]);
                } catch (e) {//可能存在文件夹不存在，则需要重新设置目录
                    res.render('setPath', {
                        title: title,
                        path: path,
                        errorMsg: '路径有误，请重新选择路径！'
                    });
                }
                break;
            }
        }
    }

    res.render('index', {
        title: title,
        fileList: fileList,
        directoriesList: directoriesList,
        pathList: pathList
    });
});

router.get('/show', function (req, res, next) {
    fs.readFile(req.query.path,'binary',function(err, file) {
        if (err) {
            console.log(err);
            return;
        }else{
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.write(file,'binary');
            res.end();
            return;
        }
    });
});

router.get('/showImg', function (req, res, next) {
    var path = req.query.path ? req.query.path : "/Users/sfy/Downloads/桌面壁纸";
    var stat = fs.lstatSync(path);
    if (!stat.isDirectory()) {
        path = nodePath.parse(path).dir;
    }
    var chooseImg = req.query.chooseImg;
    var directoriesList = [], fileList = [], pathList = [];
    if (path) {
        for (var sepIndex in separatorList) {
            if (path.indexOf(separatorList[sepIndex]) != -1) {
                fileList = getFiles.getImageFiles(path, directoriesList, separatorList[sepIndex]);
                getPath(path, pathList, separatorList[sepIndex]);
                break;
            }
        }
        pathList.push({name: chooseImg});
    }
    res.render('showImg', {
        title: title,
        fileList: fileList,
        chooseImg: chooseImg,
        pathList: pathList
    });
});

router.get('/setPath', function (req, res, next) {
    var result = JSON.parse(fs.readFileSync('public/configs/path.json'));
    res.render('setPath', {
        title: '设置路径',
        path: result.path,
        errorMsg: ''
    });
});
router.post('/setPath', function (req, res, next) {
    var path = {path: req.body.path};
    fs.writeFileSync('public/configs/path.json', JSON.stringify(path));
    res.redirect("/");
});

module.exports = router;

