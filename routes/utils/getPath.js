/**
 * Created by sfy on 2017/3/8.
 */

var fs = require('fs');
//获取路径显示到页面中
function getPathList (path, pathList, separator) {
    var result = JSON.parse(fs.readFileSync('public/configs/path.json'));

    var disc = separator, firstPath = result.path, pathTemp = path.substring(result.path.length);
    pathList.push({name: firstPath, url: firstPath});
    // if (pathTemp.indexOf(":" + separator) != -1) {
    //     disc = path.substring(0, path.indexOf(":" + separator) + 2);
    //     pathTemp = path.substr(path.indexOf(":" + separator) + 2);
    // }
    var pathArray = pathTemp.split(separator);
    for (var i = 0; i < pathArray.length; i++) {
        var obj = {};
        if (pathArray[i]) {
            obj.name = (i == 0 ? disc : "") + pathArray[i];
            var url = "";
            for (var j = 0; j <= i; j++) {
                if (pathArray[j]) {
                    url += firstPath + separator + pathArray[j];
                }
            }
            obj.url = url;
            pathList.push(obj);
        }
    }
}
module.exports = getPathList;