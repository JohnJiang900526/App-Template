var PowerM3AppCallBack = PowerM3AppCallBack || {};
PowerM3AppCallBack.loadpage = function () {};
// ios

PowerM3AppCallBack.pagepullup = function () {
    PowerM3AppCallBack.loadpage(null, null);
}
//android下拉
var AndroidLoadPage = function () {
    PowerM3AppCallBack.loadpage(null, null);
}

 function CallAppFunction(name, params, url, callback, closeback) {
    closeback = closeback || "";
    if (window.m3app != undefined && typeof (window.m3app.AppCall) == "function") {
        if (closeback == "") {
            window.m3app.AppCall(name, params, callback);
        } else {
            window.m3app.AppCall(name, params, callback, closeback);
        }
    } else if (typeof (window.PowerM3AppCall) == "function") {
        window.PowerM3AppCall(name, params, callback, closeback);
    } else if (url != undefined && url != "") {
        window.open(url, "_self")
    }
}

var appPhysical = {
    //上传文件
    UploadFile: function(formConfig) {
        CallAppFunction("appTakeSelectFile", '{"uploadServer": {"keyword": "' + formConfig.config.joindata.KeyWord + '", "keyvalue": "' + formConfig.KeyValue + '","scale": 0.75,"upload":"true" }, "translateBase64": "false","filePath": "true"}', "", "MobileWebFormLoadFile");
    },
    //附件【打开相机】拍照并上传
    OpenCamera: function (formConfig) {
        CallAppFunction("appTakePhotos", '{"uploadServer": {"keyword": "' + formConfig.config.joindata.KeyWord + '", "keyvalue": "' + formConfig.KeyValue + '","scale": 0.75,"upload":"true" }, "translateBase64": "false","filePath": "true"}', "", "MobileWebFormLoadFile");
    },
    //附件【打开图库】选择照片并上传
    OpenGallery: function (formConfig) {
        CallAppFunction("appOpenImagesLibrary", '{"uploadServer": {"keyword": "' + formConfig.config.joindata.KeyWord + '", "keyvalue": "' + formConfig.KeyValue + '","scale": 0.75,"upload":"true" }, "translateBase64": "false","filePath": "true", "Number": "10"}', "", "MobileWebFormLoadFile");
    },
    //打开扫描二维码，fn是回调函数名称，二维码信息会在回调函数的参数中
    OpenQRCode: function (fn) {
        CallAppFunction("appOpenQRCode", '', '', fn);
    },
    //附件-【录像】并上传
    RecordVideos: function (formConfig) {
        CallAppFunction("appRecordVideos", '{"uploadServer": {"keyword": "' + formConfig.config.joindata.KeyWord + '", "keyvalue": "' + formConfig.KeyValue + '","width": 0,"height":0,"upload":"true" }, "translateBase64": "false","filePath": "true"}', "", "MobileWebFormLoadFile");
    },
    //附件-【选择视频文件】并上传
    OpenVideos: function (formConfig) {
        CallAppFunction("appOpenVideosLibrary", '{"uploadServer": {"keyword": "' + formConfig.config.joindata.KeyWord + '", "keyvalue": "' + formConfig.KeyValue + '","width": 0,"height":0,"upload":"true" }, "translateBase64": "false","filePath": "true"}', "", "MobileWebFormLoadFile");
    },
    //附件-【选择音频文件】并上传
    OpenAudio: function (formConfig) {
        CallAppFunction("appRecordAudio", '{"uploadServer": {"keyword": "' + formConfig.config.joindata.KeyWord + '", "keyvalue": "' + formConfig.KeyValue + '","scale": 0.75,"upload":"true" }, "translateBase64": "false","filePath": "true"}', "", "MobileWebFormLoadFile");
    },
    // 打开新的页面
    OpenWebView: function(url, title) {
        CallAppFunction("appOpenNewWebView", '{"url":"' + url + '","pullUp":"false","pullDown":"false","showTabbar":"false","title":"'+ title +'"}', url);
    },
    // //执行向导操作
    OpenWizard: function(url, where, btnid, title) {
        CallAppFunction("appOpenWizard", '{"url":"' + url + '","where":"' + where + '","btnid":"' + btnid + '","pullUp":"true","pullDown":"true","showTabbar":"false","title":"' + title + '"}', url);
    },
    // 打开附件
    OpenView: function (id, title, fileext) {
        if (title.toLowerCase().indexOf(".avi") > -1 || title.toLowerCase().indexOf(".mp4") > -1 || title.toLowerCase().indexOf(".mov") > -1) {
            CallAppFunction("appPlayVideos", '{"fileid":"' + id + '","filename":"' + title + '"}', "", "");
        } else {
            var url = "/PowerPlat/FormXml/FileViewer.aspx?online=1&fileid=" + id;
            CallAppFunction("appOpenNewWebView", '{"action":"openfile","fileext":"' + fileext + '","url":"' + url + '","pullUp":"false","pullDown":"false","showTabbar":"false","title":"' + title + '"}', url);
        }
    },
};