/**
 * Created by sfy on 2017/3/8.
 */

var fs = require('fs');
//引用imageinfo模块
var image = require("imageinfo");

function readFileList(path, filesList, directoriesList, separator) {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        try {
            var stat = fs.statSync(path + separator + itm);
            if (stat.isDirectory()) {
                //递归读取文件
                // readFileList(path + "/" + itm + "/", filesList);
                var obj = {};//定义一个对象存放文件的路径和名字
                obj.path = path + separator + itm;//路径
                obj.filename = itm;//名字
                directoriesList.push(obj);
            } else {

                var obj = {};//定义一个对象存放文件的路径和名字
                obj.path = path + separator + itm;//路径
                obj.filename = itm;//名字
                filesList.push(obj);
            }
        } catch (e) {

        }

    })

}
module.exports = {
//获取文件夹下的所有文件
    getFileList: function (path, directoriesList, separator) {
        var filesList = [];
        readFileList(path, filesList, directoriesList, separator);
        return filesList;
    },
    //获取文件夹下的所有图片
    getImageFiles: function (path, directoriesList, separator) {
        var imageList = [];

        this.getFileList(path, directoriesList, separator).forEach(function(item) {
            var ms = image(fs.readFileSync(item.path));

            var obj = {};//定义一个对象存放文件的路径和名字
            obj.path = item.path;//路径
            obj.filename = item.filename;//名字
            ms.mimeType && (imageList.push(obj));
        });
        return imageList;

    }
};