function AppForm() {
    // form表单的 formconfig
    var formConfig = formconfig;
    // 主表的config
    var config = {};
    // 获取所有子表配置项
    var configs = [];
    var configsMap = {};
    // 附件的权限
    var FileAttachRight = {};
    // 自定义的option配置
    var optionDiy = {};
    // 缓存主表信息
    var mainTableMap = {};
    // 缓存向导相关关键字
    var wizardCurrentKeyMap = {
        ComponentID: "",
        btnid: "",
        formid: "",
        config: {},
        data: [],
        selectWizard: {}
    };

    //信息状态，由该包判断是否所有的信息都准备完毕
    var dataStatus = {};
    //提交数据包
    var postInfo = {};
    // 登录人id
    var HumanId = "";
    // 评论缓存数据
    var commentObj = {};
    // at 人员缓存
    var selectedAtHuman = [];

    return appForm = {
        // ajax封装
        _ajax: function (url, params, type, cache, callback) {
            var that = this;

            that._loading();
            $.ajax({
                url: url,
                data: params,
                type: type,
                cache: cache,
                success: function (data) {
                    that._closeLoading();
                    if (callback) {
                        callback(data);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    that._closeLoading();
                    mui.alert(jqXHR.responseText, textStatus, errorThrown);
                }
            });
        },
        _APIAjax: function (params, callback, reUrl) {
            var that = this;

            var url = "/API/APIMessages";
            if (reUrl) {
                url = reUrl;
            }
            that._ajax(url, params, "POST", false, callback);
        },
        // 自定义时间格式 ：format
        // "yyyy-MM-dd HH:mm:ss";"yyyy-MM-dd-HH-mm-ss"
        // "yyyy-MM-ddTHH:mm:ss" ....
        _formatDate: function (time, format) {
            var t = new Date(time);
            if (t.getTime() == 0) {
                t = new Date();
            }

            var tf = function (i) {
                return (i < 10 ? '0' : '') + i;
            };
            if (!format) {
                format = "yyyy-MM-dd";
            }

            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (type) {
                switch (type) {
                    case 'yyyy':
                        return tf(t.getFullYear());
                    case 'MM':
                        return tf(t.getMonth() + 1);
                    case 'mm':
                        return tf(t.getMinutes());
                    case 'dd':
                        return tf(t.getDate());
                    case 'HH':
                        return tf(t.getHours());
                    case 'ss':
                        return tf(t.getSeconds());
                }
            })
        },
        // 打开日期组件
        _openDtPicker: function (option, callback) {
            var _self = this;
            var options = {
                type: "date"
            };

            if (option) {
                options = $.extend({}, options, option);
            }

            _self.picker = new mui.DtPicker(options);
            _self.picker.show(function (rs) {
                if (callback) {
                    callback(rs);
                }
                _self.picker.dispose();
                _self.picker = null;
            });
        },
        // 打开选择器组件
        _openPicker: function (arr, callback) {
            var picker = new mui.PopPicker();
            picker.setData(arr);
            picker.show(function (data) {
                if (callback) {
                    callback(data[0]);
                }
                picker = null;
            });
        },
        // 获取连接中的参数,只需要传进对应的名称
        // file:///E:/myProjects/myTools/test.html?id=1234567&name=john
        //如上面的例子，只需要传进"id"  或者 "name"
        _getLocaArg: function () {
            var name;

            if (arguments.length === 0 || arguments.length >= 2) {
                throw Error("arguments.length = 1");
            } else {
                name = arguments[0];
            }

            var pattern = new RegExp("[\?\&]" + name + "=([^\&]+)", "i"),
                result = location.search.match(pattern);

            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        },
        // loading
        _loading: function (text) {
            if (!text) {
                text = "";
            }
            var html = '<div name="loading" class="loading-pop-content">' +
                '<div class="loading-mask-bg"></div>' +
                '<div class="loading-main-content">' +
                '<div class="loading-icon">' +
                '<span class="mui-spinner"></span>' +
                '</div>' +
                '<div class="loading-text">' +
                '<span class="text">' + text + '</span>' +
                '</div>' +
                '</div>' +
                '</div>';

            var loadings = $(".loading-pop-content");
            if (loadings.size() == 0) {
                $(top.document.body).append(html);
            }
        },
        // 关闭loading
        _closeLoading: function () {
            var loadings = $(top.document.body).find(".loading-pop-content");

            loadings.each(function () {
                var $this = $(this);
                var name = $this.attr("name");

                if (name == "loading") {
                    $this.remove();
                }
            });
        },
        //获取附件的avatar
        _getAvatar: function (fileExt, id) {
            if (!fileExt) {
                fileExt = "";
            }
            fileExt = fileExt.toLowerCase();
            if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(fileExt)) {
                return {
                    url: "/PowerPlat/FormXml/FileViewer.aspx?online=1&fileid=" + id,
                    type: "picFiles"
                };
            } else if (/\.(mp4|webm|ogg|flv|mpg)(\?.*)?$/.test(fileExt)) {
                return {
                    url: "/Apps/images/fileVideo.png",
                    type: "mediaFiles"
                };
            } else if (/\.(mp3|wav|flac|aac)(\?.*)?$/.test(fileExt)) {
                return {
                    url: "/Apps/images/fileAudio.png",
                    type: "mediaFiles"
                };
            } else if (/\.(doc|docx|docm|dot|dotx|dotm)(\?.*)?$/.test(fileExt)) {
                return {
                    url: "/Apps/images/fileWord.png",
                    type: "docFiles"
                };
            } else if (/\.(pdf)(\?.*)?$/.test(fileExt)) {
                return {
                    url: "/Apps/images/filePdf.png",
                    type: "docFiles"
                };
            } else if (/\.(txt)(\?.*)?$/.test(fileExt)) {
                return {
                    url: "/Apps/images/filePdf.png",
                    type: "docFiles"
                };
            } else if (/\.(xls|xlsx|xlsm|xlt|xltx|xltm|csv)(\?.*)?$/.test(fileExt)) {
                return {
                    url: "/Apps/images/fileExcel.png",
                    type: "docFiles"
                };
            } else if (/\.(ppt|pptx|pptm|pot|potx|potm|pps|ppsx|ppsm)(\?.*)?$/.test(fileExt)) {
                return {
                    url: "/Apps/images/filePpt.png",
                    type: "docFiles"
                };
            } else {
                return {
                    url: "/Apps/images/fileZip.png",
                    type: "otherFiles"
                };
            }
        },
        _checkPlat: function (callback) {
            var u = navigator.userAgent;
            var tag;
            if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
                tag = "Android";
            } else if (u.indexOf('iPhone') > -1) {
                tag = "iPhone";
            }
            if (callback) {
                callback(tag);
            }
        },
        // stringify 参考了mini-ui的 decode语法
        // 处理后台返回的字符串中含有 "new Date(1223455667788)"的魔法字符串
        // "new Date(1223455667788)"这种格式的字符串在JSON.parse() 和 eval() 处理的时候会报错
        stringify: function (json, parseDate) {
            __js_dateRegEx = new RegExp("(^|[^\\\\])\\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\\"", "g");
            __js_dateRegEx2 = new RegExp("[\"']/Date\\(([0-9]+)\\)/[\"']", "g");

            var dateRe1 = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.*\d*)?)Z*$/
                , dateRe2 = new RegExp("^/+Date\\((-?[0-9]+).*\\)/+$", "g")
                , re = /[\"\'](\d{4})-(\d{1,2})-(\d{1,2})[T ](\d{1,2}):(\d{1,2}):(\d{1,2})(\.*\d*)[\"\']/g;

            if (json === "" || json === null || json === undefined)
                return json;
            if (typeof json == "object")
                json = this.encode(json);
            function evalParse(json) {
                if (parseDate !== false) {
                    json = json.replace(__js_dateRegEx, "$1new Date($2)");
                    json = json.replace(re, "new Date($1,$2-1,$3,$4,$5,$6)");
                    json = json.replace(__js_dateRegEx2, "new Date($1)")
                }
                return eval("(" + json + ")")
            }
            var data = null;
            if (window.JSON && window.JSON.parse) {
                var dateReviver = function ($, _) {
                    if (typeof _ === "string" && parseDate !== false) {
                        dateRe1.lastIndex = 0;
                        var A = dateRe1.exec(_);
                        if (A) {
                            _ = new Date(A[1], A[2] - 1, A[3], A[4], A[5], A[6]);
                            return _
                        }
                        dateRe2.lastIndex = 0;
                        A = dateRe2.exec(_);
                        if (A) {
                            _ = new Date(parseInt(A[1]));
                            return _
                        }
                    }
                    return _
                };
                try {
                    var json2 = json.replace(__js_dateRegEx, "$1\"/Date($2)/\"");
                    data = window.JSON.parse(json2, dateReviver)
                } catch (ex) {
                    data = evalParse(json)
                }
            } else
                data = evalParse(json);
            return data
        },
        //GridPageLoad加载数据
        gridPageLoad: function (params, callback) {
            var that = this;
            if (params) {
                var p = $.extend({}, params);
            }

            var url = p.url || "/Form/GridPageLoad";
            p.KeyWordType = p.KeyWordType || "BO";
            p.select = p.select || "";
            p.sort = p.sort || "";
            p.index = p.index || "0";
            p.size = p.size || "0";
            p.swhere = p.swhere || "";
            var _async = typeof (p.async) == "undefined" ? true : p.async;
            delete p.async;

            if (p.swhere) {
                var tmp = {};
                if (p.extparams) {
                    var str = Util.Base64Decode(p.extparams);
                    tmp = JSON.parse(str);
                }
                tmp.encodeswhere = "r4";
                p.extparams = Util.Base64Encode(JSON.stringify(tmp));
                p.swhere = Util.Base64Swhere(p.swhere);
            }

            that._ajax(url, p, "post", false, function (data) {
                var getData = JSON.parse(data);
                if (callback) {
                    callback(getData);
                }
            });
        },
        //判断业务流程状态已经批准
        WorkflowApproved: function () {
            //业务不需要走流程
            if (typeof (workflowdata) == "undefined" || !workflowdata) {
                return false;
            }

            //流程结束
            // FlowRecordStatus.Finish 50 = 办结
            if (workflowdata.RecordStatus == 50) {
                return true;
            }

            //状态=50,可能是手工批准的
            if (typeof (formConfig) != "undefined" && formConfig && formConfig.config && formConfig.config.joindata) {
                var config = formConfig.config.joindata;
                if (config.statusfield && config.currow && config.currow[config.statusfield] && config.currow[config.statusfield] == "50") {
                    return true;
                }
            }
            return false;
        },
        //判断是否当前录入人
        IsRegHuman: function (config, row) {
            if (!formConfig || !config || !row) {
                return false;
            }
            if (formConfig.FormState == "add") {
                return true;
            }
            if (sessiondata) {
                if (
                    config.reghumidfield &&
                    row &&
                    row[config.reghumidfield] == sessiondata.HumanId
                ) {
                    return true;
                }
            }
            return false;
        },
        //config数据处理
        formatConfig: function (config, getData) {
            var that = this;
            config.currow = $.extend({}, getData);
            config.oldcurrow = $.extend({}, getData);

            // 如果是表单的主表form，且有台账页面传递过来的新增默认值，
            // 且是新增状态，则需要赋值进去
            var miniid = formConfig.config.joindata.miniid;
            if (config.miniid == miniid && formConfig.FormState == "add") {
                formConfig.KeyValue = config.currow[config.keyfield];

                if (!KeyValue) {
                    KeyValue = config.currow[config.keyfield];
                }

                var sysfilter = that._getLocaArg("sysfilter");
                if (sysfilter) {
                    sysfilter = JSON.parse(Util.Base64Decode(sysfilter));
                    for (var fd in sysfilter) {
                        if (typeof (fd) == "function") {
                            continue
                        };
                        config.currow[fd] = sysfilter[fd];
                    }
                }
            }
        },
        //判断业务走流程的状态下控制只读，true只读
        WorkflowReadOnly: function () {
            var that = this;

            //业务不需要走流程
            if (!workflowdata) {
                return false;
            }

            if (that.WorkflowApproved()) {
                return true;
            }
            //FlowOperate.Active 参阅 FlowStatusSerials.js
            var flowActive = 4096;
            //新流程通过当前审批人和当前登录人来判断
            if (workflowdata.WorkFlowFlag && workflowdata.WorkFlowFlag == "workflows") {
                //如果没有  CanFlowOperate 说明当下此人无SequeID
                if (!workflowdata.CanFlowOperate) {
                    return false;
                }

                if (workflowdata.CanFlowOperate.UserType != 1 && (workflowdata.CanFlowOperate.UserType & 4) == 0) {
                    return true;
                } else {
                    return false;
                }
            }
            if ((workflowdata.CanFlowOperate & flowActive) != 0) {
                //处理当前业务上的送审按钮权限
                //只有编辑状态下显示，且只有录入人=当前用户才显示
                //如果已经执行生效操作，则 送审 按钮也不应该显示
                return false;
            }
            //走流程过程中，不是当前节点用户
            var flowUpdate = 4;   //FlowOperate.Update 参阅 FlowStatusSerials.js
            if ((workflowdata.CanFlowOperate & flowUpdate) == 0)
                return true;
            else
                return false;
        },
        //全局参数设置审批人不允许修改表单,起草者可修改
        WorkFlowUpdateForm: function () {
            var that = this;
            var config = that.getConfig(formConfig.config.joindata.KeyWord);
            if (
                enableform != undefined &&
                enableform == 0 && config &&
                config.currow &&
                config.statusfield &&
                config.currow[config.statusfield] != "0" &&
                (workflowdata.CurNodeType != 10 || !that.IsRegHuman(config, config.currow)) &&
                sessiondata.IsITAdmin == false
            ) {
                return true;
            } else {
                return false;
            }
        },
        //从formconfig中获取所有Config形成List返回
        ConfigToList: function (config) {
            var that = this;

            if (!config) {
                config = formconfig.config.joindata;
            }

            var rlt = [];
            rlt.push(config);

            //子表
            if (config.children && config.children.length > 0) {
                for (var i = 0; i < config.children.length; i++) {
                    var c = that.ConfigToList(config.children[i]);
                    if (c != undefined && c.length > 0) {
                        for (var j = 0; j < c.length; j++) {
                            rlt.push(c[j]);
                        }
                    }
                }
            }
            return rlt;
        },
        // 获取config方法
        getConfig: function (miniid, config) {
            var that = this;
            if (!config) {
                config = formConfig.config.joindata;
            }

            if (config.miniid == miniid) {
                return config;
            }

            var result = null;
            if (!config.children || config.children.length == 0) {
                return result;
            }

            for (var i = 0; i < config.children.length; i++) {
                result = that.getConfig(miniid, config.children[i]);
                if (result) {
                    return result;
                }
            }
            return result;
        },
        //从formconfig中获取 父级节点的config
        getParentConfig: function (miniid, config) {
            var that = this;
            if (!config) {
                config = formConfig.config.joindata;
            }

            var result = null;
            if (!config.children || config.children.length == 0) {
                return result;
            }

            for (var i = 0; i < config.children.length; i++) {
                var c = config.children[i];
                if (c.miniid == miniid) {
                    return config;
                }
                result = that.getParentConfig(miniid, c);
                if (result) {
                    return result;
                }
            }
            return result;
        },
        //获取子表上，行的标题数据
        getTableTypeResult: function (htmlparams, row, type) {
            var that = this;
            var result = "";

            if (htmlparams[type].value != "") {
                var format = htmlparams[type].format;
                //普通文本
                if (!format) {
                    result = row[htmlparams[type].value];
                } else if (format == "combobox") {
                    var comb = comboboxdata[htmlparams.gridid + "." + htmlparams[type].value];
                    if (comb) {
                        var ds = comb.Data;
                        var v = row[htmlparams[type].value];
                        for (var i = 0; i < ds.length; i++) {
                            var d = ds[i];
                            if (d[comb.ValueField] == v) {
                                result = d[comb.TextField];
                                break;
                            }
                        }
                    }
                } else if (format.indexOf("n") > -1 || format.indexOf("c") > -1 || format.indexOf("p") > -1) {
                    //数字
                    result = new Number(row[htmlparams[type].value]);
                } else if (format.indexOf("y") > -1) {
                    //日期
                    result = that._formatDate(row[htmlparams[type].value], format);
                }
            }

            if (!result) {
                result = "暂无";
            }
            return result.replace("null", "");
        },
        //form config 中 filter 转换成 where 条件
        filterToSWhere: function (filter) {
            var result = "";
            if (!filter) {
                return result
            };
            for (var fd in filter) {
                if (typeof (fd) == "function") {
                    continue;
                }
                result = result + " and " + fd + "='" + filter[fd] + "'";
            }
            return result;
        },
        // 状态封装
        formatStatus: function (keyword, key, id) {
            var result = id;
            var data = [];
            if (!comboboxdata[keyword + "." + key]) {
                return result;
            } else {
                if (comboboxdata[keyword + "." + key].Data && comboboxdata[keyword + "." + key].Data.length != 0) {
                    data = comboboxdata[keyword + "." + key].Data;
                } else {
                    mui.alert("comboboxdata{" + keyword + "." + key + "]为空");
                }
            }

            for (var i = 0; i < data.length; i++) {
                if (id == data[i].id) {
                    result = data[i].text;
                    break;
                }
            }

            return result;
        },
        // 获取主表数据
        getMainTable: function (formConfig, callback) {
            var url = "/Form/FormLoad";
            var params = {
                KeyWord: formConfig.config.joindata.KeyWord,
                KeyWordType: formConfig.config.joindata.KeyWordType || "BO",
                keyvalue: formConfig.KeyValue,
                select: "",
                formstate: formConfig.FormState
            };
            this._ajax(url, params, "get", false, function (data) {
                if (callback) {
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    if (data.success) {
                        callback(data.data.value);
                    } else {
                        mui.alert(data.message, 'message');
                    }
                }
            });
        },
        // 渲染主表数据  显示在页面上
        setMainTable: function (obj, config) {
            var that = this;
            var obj = $.extend({}, obj);
            var KeyWord = config.KeyWord;
            var form = $("#" + KeyWord);

            if (form.size() == 0) {
                //在主表的form元素上，给定form元素的id 为config中的KeyWord
                //否则，抛出错误，不能正确赋值
                throw new Error("Can not find form's KeyWord, please set it");
            }

            for (var key in obj) {
                if (key == "RegDate" || key == "UpdDate") {
                    obj[key] = that._formatDate(obj[key]);
                }
                obj[key] = that.formatStatus(KeyWord, key, obj[key]);
                var mainDom = form.find("#" + KeyWord + "_" + key);
                //在主表中input或者textarea元素上的id设置规则是 KeyWord + "_" + key的形式
                //原来的KeyWord + "." + key形式的，废弃

                if (mainDom.size() > 0 && mainDom.hasClass("btn-picker")) {
                    var formatTime = mainDom.attr("data-format");
                    obj[key] = that._formatDate(obj[key], formatTime);
                }

                form.find("#" + KeyWord + "_" + key).val(obj[key]);
            }
        },
        disabledRight: function () {
            var that = this;
            var effected = formConfig.Effected;

            return (formConfig.FormState == "view") ||
                (!workflowdata && !keywordright[config.KeyWord]) ||
                that.WorkflowReadOnly() ||
                effected == true ||
                that.WorkFlowUpdateForm() == true
        },
        // 权限处理
        setPermission: function (data, callback) {
            var that = this;
            var disabledRight = that.disabledRight();
            var table_children = optionDiy.childrenTables;

            if (disabledRight) {
                var obj = $.extend({}, data);
                var KeyWord = config.KeyWord;
                var form = $("#" + KeyWord);

                // 主表
                for (var key in obj) {
                    form.find("#" + KeyWord + "_" + key).prop("readonly", true);
                }

                // 子表
                for (var sub_key in table_children) {
                    $("#" + sub_key + "_Form").find("input.mui-input").prop("readonly", true);
                }

                if (callback) {
                    callback();
                }
            }
        },
        // comboboxdata数据解析
        encodeComboBoxData: function (keyword, key, id) {
            var result = "", item;
            var data = [];
            if (comboboxdata[keyword + "." + key]) {
                data = comboboxdata[keyword + "." + key].Data;
                for (var i = 0; i < data.length; i++) {
                    item = data[i];
                    if (item.id == id) {
                        result = item.text;
                        break;
                    }
                }
            }
            if (result) {
                return result;
            } else {
                return id;
            }
        },
        // comboboxdata数据反解析
        decodeComboBoxData: function (keyword, key, text) {
            var result = "", item;
            var data = [];
            if (comboboxdata[keyword + "." + key]) {
                data = comboboxdata[keyword + "." + key].Data;
                for (var i = 0; i < data.length; i++) {
                    item = data[i];
                    if (item.text == text) {
                        result = item.id;
                        break;
                    }
                }
            }
            if (result) {
                return result;
            } else {
                return text;
            }
        },
        // 获取附件数据
        getDocFiles: function (callback) {
            var that = this;

            var url = "/Form/GetDocFiles";
            var params = {
                BOKeyWord: formConfig.config.joindata.KeyWord,
                BOKeyValue: formConfig.KeyValue,
                select: "",
                swhere: "",
                sort: "",
                index: 0,
                size: 0
            };
            that._ajax(url, params, "get", true, function (data) {
                var getFileData = JSON.parse(data);
                FileAttachRight = getFileData.data.right;

                for (var key in FileAttachRight) {
                    FileAttachRight[key] += "";
                }

                if (getFileData.data.value != "") {
                    var files = JSON.parse(getFileData.data.value);
                    var dataMap = {
                        picFiles: [],
                        mediaFiles: [],
                        docFiles: [],
                        otherFiles: []
                    };

                    files.map(function (item, index) {
                        var fileAvatar = that._getAvatar(item.FileExt, item.Id);

                        dataMap[fileAvatar.type].push(item);
                        item.avatar = fileAvatar.url;
                        item.fileType = fileAvatar.type;
                        return item;
                    });

                    if (callback) {
                        callback(dataMap);
                    }
                }
            });
        },
        // 删除附件
        deleteAttach: function (id, callback) {
            var url = '/PowerPlat/Control/File.ashx?_type=default&action=delete&_fileid=' + id;
            $.getJSON(url, function (data) {
                if (callback) {
                    callback(data);
                }
            });
        },
        // 附件渲染模板
        docFilesTemp: function (dataMap) {
            var that = this;
            var attachNum = 0;

            if (dataMap) {
                for (var key in dataMap) {
                    var attachList = dataMap[key];
                    var fileItem, html = '';

                    //附件个数
                    attachNum += attachList.length;

                    if (attachList.length == 0) {
                        $("#" + key).prev().addClass("hide");
                    } else {
                        $("#" + key).prev().removeClass("hide");
                    }

                    for (var i = 0; i < attachList.length; i++) {
                        fileItem = attachList[i];
                        if (!fileItem.FileExt) {
                            fileItem.FileExt = "";
                        }
                        html += '<li data-id="' + fileItem.Id + '" data-fileext="' + fileItem.FileExt + '" data-name="' + fileItem.Name + '" data-type="' + fileItem.fileType + '" class="mui-table-view-cell mui-media">' +
                            '<a href="javascript:;">' +
                            '<img class="mui-media-object mui-pull-left"  src="' + fileItem.avatar + '">' +
                            '<div class="mui-media-body">' +
                            '<span>' + that._formatDate(fileItem.UpdDate, "yyyy-MM-dd") + '</span>' +
                            '<p class="mui-ellipsis">' + fileItem.Name + fileItem.FileExt + '</p>' +
                            '</div>' +
                            '<span class="mui-navigate-right-delete"></span>' +
                            '</a>' +
                            '</li>';
                    }

                    $("#" + key).html(html);

                    // 执行删除附件
                    $("#" + key).find(".mui-navigate-right-delete").on("tap", function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var $this = $(this);
                        var row = $this.closest(".mui-table-view-cell.mui-media");
                        var content = $this.closest(".mui-table-view");
                        var id = row.attr("data-id");

                        mui.confirm('确认删除此文件？', '注意', ["否", "是"], function (e) {
                            if (e.index == 1) {
                                if (FileAttachRight.bDocDel == "1") {
                                    that.deleteAttach(id, function (data) {
                                        if (data.success) {
                                            row.remove();
                                            mui.toast('删除成功');

                                            var lastAttachNum = content.find(".mui-table-view-cell.mui-media").size();
                                            if (lastAttachNum == 0) {
                                                content.prev().hide();
                                            }
                                        } else {
                                            mui.alert('删除失败');
                                        }
                                    });
                                } else {
                                    mui.alert("你没有删除权限");
                                }
                            }
                        });
                    });

                    // 点击查看附件
                    $("#" + key).find(".mui-table-view-cell").on("tap", function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var $this = $(this),
                            id = $this.attr("data-id"),
                            fileType = $this.attr("data-type"),
                            title = $this.attr("data-name"),
                            fileext = $this.attr("data-fileext");

                        if (FileAttachRight.bDocView != "1") {
                            if (fileType == "picFiles") {
                                mui.alert("你没有权限查看");
                            } else {
                                mui.alert("你没有权限下载");
                            }
                            return false;
                        }

                        appPhysical.OpenView(id, title + fileext, fileext);
                    });
                }
            }

        },
        // 附件上传事件
        upLoadAttachEvents: function (conf) {
            // 打开图库/相册
            $("#Gallery").on("tap", function (e) {
                e.preventDefault();
                if (FileAttachRight.bDocUp == "1") {
                    appPhysical.OpenGallery(conf);
                } else {
                    mui.alert("你没有权限上传附件");
                }
            });
            // 打开相机
            $("#Camera").on("tap", function (e) {
                e.preventDefault();
                if (FileAttachRight.bDocUp == "1") {
                    appPhysical.OpenCamera(conf);
                } else {
                    mui.alert("你没有权限上传附件");
                }
            });

            // 打开录像
            $("#RecordVideos").on("tap", function (e) {
                e.preventDefault();
                if (FileAttachRight.bDocUp == "1") {
                    appPhysical.RecordVideos(conf);
                } else {
                    mui.alert("你没有权限上传附件");
                }
            });
            // 上传视频
            $("#Videos").on("tap", function (e) {
                e.preventDefault();
                if (FileAttachRight.bDocUp == "1") {
                    appPhysical.OpenVideos(conf);
                } else {
                    mui.alert("你没有权限上传附件");
                }
            });

            // 打开音频
            $("#Audio").on("tap", function (e) {
                e.preventDefault();
                if (FileAttachRight.bDocUp == "1") {
                    appPhysical.OpenAudio(conf);
                } else {
                    mui.alert("你没有权限上传附件");
                }
            });
            // 打开上传文件
            $("#UploadFileAll").on("tap", function (e) {
                e.preventDefault();
                if (FileAttachRight.bDocUp == "1") {
                    appPhysical.UploadFile(conf);
                } else {
                    mui.alert("你没有权限上传附件");
                }
            });
        },
        // 子表配置初始化
        childrenTableCondigInit(configs, option) {
            var listConfig;
            var tableOptionMap;

            var defaultOption = {
                dataparams: {
                    KeyWord: "", //子表的KeyWord
                    select: "", // //需要查询哪些字段,默认空
                    KeyWordType: "BO",  //BO/ViewEntity;默认BO
                    swhere: "",//where条件，默认空
                    size: "0", //每页条数，默认0
                    index: "0", //当前多少页，默认0
                    order: "" //排序，默认空    
                },
                htmlparams: {
                    // 指定容器的id，把对应的html塞进指定的元素中
                    // 一般和子表的KeyWord相同
                    gridid: "",
                    idfield: "Id", //主键,
                    icon: "", //默认fa-plus-square-o
                    formid: "", //如果需要打开表单，表单的formid
                    title: {
                        value: "", // title显示的字段
                        format: ""
                    },
                    left: {
                        value: "", // 左侧显示的字段
                        format: "" // 如果是下拉框，就设置combobox
                    },
                    center: {
                        value: "",// 中间显示的字段
                        format: ""
                    },
                    right: {
                        value: "", // 右边显示的字段
                        format: ""
                    }
                }
            };

            if (option.childrenTables) {
                tableOptionMap = $.extend({}, option.childrenTables);
            }

            for (var i = 0; i < configs.length; i++) {
                listConfig = configs[i];
                if (tableOptionMap) {
                    // 使用$.extend，实现深度克隆
                    if (tableOptionMap[listConfig.KeyWord]) {
                        listConfig = $.extend({}, listConfig, tableOptionMap[listConfig.KeyWord]);
                    } else {
                        var defaultTableOpt = $.extend({}, defaultOption);

                        defaultTableOpt.dataparams = $.extend({}, defaultTableOpt.dataparams, {
                            KeyWord: listConfig.KeyWord
                        });
                        defaultTableOpt.htmlparams = $.extend({}, defaultTableOpt.htmlparams, {
                            gridid: listConfig.KeyWord
                        });

                        listConfig = $.extend({}, listConfig, defaultTableOpt);
                    }
                }
                configs[i] = listConfig;
                configsMap[listConfig.KeyWord] = listConfig;
            }
        },
        // 打开子表表单
        openChildForm: function (keyword, id, callback) {
            var that = this;
            var thisTableConfig = configsMap[keyword];
            var data = thisTableConfig.data;

            var row = "", item;
            for (var i = 0; i < data.length; i++) {
                item = data[i];
                if (item.UpdDate) {
                    item.UpdDate = that._formatDate(item.UpdDate);
                }
                if (id == item.Id) {
                    row = item;
                    break;
                }
            }

            if (callback) {
                callback(row);
            }
        },
        // 子表lists html渲染模板
        tableCellTemp: function (data, htmlparams) {
            var that = this;
            var html = '', item;

            var title,
                left,
                center,
                right;

            for (var i = 0; i < data.length; i++) {
                item = data[i];
                title = Util.getTableTypeResult(htmlparams, item, "title");
                left = Util.getTableTypeResult(htmlparams, item, "left");
                right = Util.getTableTypeResult(htmlparams, item, "right");
                center = Util.getTableTypeResult(htmlparams, item, "center");

                html += '<li data-id="' + item.Id + '" data-idfield="' + htmlparams.idfield + '" class="mui-table-view-cell">' +
                    '<div class="mui-slider-right mui-disabled">' +
                    '<a class="mui-btn mui-btn-delete mui-btn-red">删除</a>' +
                    '</div>' +
                    '<div class="mui-slider-handle">' +
                    '<div>' +
                    '<div class="mui-media-object mui-pull-left mui-checkbox">' +
                    '<input class="hide" name="checkbox" type="checkbox" >' +
                    '</div>' +
                    '<div class="mui-media-body">' +
                    '<p class="mui-ellipsis list-title">' + title + '</p>' +
                    '<div class="list-units">' +
                    left + center + right + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            }
            $("#" + htmlparams.gridid).html(html);

            // 打开子表表单
            $("#" + htmlparams.gridid).find(".mui-media-body, .mui-media-object").on("tap", function (e) {
                e.preventDefault();
                e.stopPropagation();

                var $this = $(this);
                var row = $this.closest(".mui-table-view-cell");
                var id = row.attr("data-id");
                var form = $("#" + htmlparams.gridid + "_Form");
                var checkBox = row.find("input[type=checkbox]");
                var idfield = row.attr("data-idfield");
                if (!checkBox.hasClass("hide")) {
                    row.toggleClass("selected");
                    if (row.hasClass("selected")) {
                        checkBox.prop("checked", true);
                    } else {
                        checkBox.prop("checked", false);
                    }
                    return false;
                } else {
                    formConfig.table_state = "modified";
                    formConfig.table_data_list_id = id;
                    formConfig.table_data_list_idfield = idfield;

                    that.openChildForm(htmlparams.gridid, id, function (row) {
                        if (row) {
                            for (var key in row) {
                                var value = that.encodeComboBoxData(htmlparams.gridid, key, row[key]);
                                var childDom = $("#" + htmlparams.gridid + "_" + key);

                                if (value !== row[key]) {
                                    if (formConfig.table_state != "added") {
                                        childDom.prop("readonly", true);
                                    }
                                }

                                if (childDom.hasClass("btn-picker")) {
                                    var formatTime = childDom.attr("data-format");
                                    value = that._formatDate(value, formatTime);
                                }

                                childDom.val(value);
                            }
                        }

                        form.addClass("move-animation-back").removeClass("move-animation-start");
                    });
                }
            });

            // 删除子表的对应数据
            $("#" + htmlparams.gridid + ' .mui-btn-delete').on('tap', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var $this = $(this);
                var row = $this.closest(".mui-table-view-cell");
                var keyword = row.parent().attr("id");

                mui.confirm("确认删除?", "确认删除", ["否", "是"], function (e) {
                    if (e.index == 1) {
                        that.deleteTableLists(keyword, "BO", function (data, lis) {
                            if (data.success) {
                                lis.remove();
                            } else {
                                mui.alert(data.message);
                            }
                        }, "inLine", row);
                    }
                });
            });
        },
        // 加载单个子表数据
        getChildrenTable: function (keyword) {
            var that = this;
            var thisTableConfig;
            var thisTableDiyConfig = optionDiy.childrenTables[keyword];

            thisTableConfig = configsMap[keyword];

            var swhere = "";
            if (formconfig.KeyValue == "") {
                swhere = " 1=0 ";
            } else {
                var pconfig = that.getParentConfig(keyword, null);
                swhere = " 1=1 " + that.filterToSWhere(thisTableConfig.filter);

                if (thisTableConfig.fields && pconfig) {
                    if (pconfig.currow) {
                        for (var fd in thisTableConfig.fields) {
                            if (typeof (fd) == "function") {
                                continue;
                            }

                            var pfd = thisTableConfig.fields[fd];
                            //是常量值
                            if (typeof (pconfig.currow[pfd]) == undefined) {
                                swhere = swhere + " and " + fd + "='" + pdf + "'";
                            } else {
                                if (pconfig.currow[pfd]) {
                                    swhere = swhere + " and " + fd + "='" + pconfig.currow[pfd] + "'";
                                } else {
                                    swhere = swhere + " and 1=0";
                                }
                            }
                        }
                    } else {
                        swhere = swhere + " and 1=0";
                    }
                }
                swhere = "1=1 and " + swhere;
            }

            if (
                thisTableDiyConfig &&
                thisTableDiyConfig.dataparams &&
                thisTableDiyConfig.dataparams.swhere
            ) {
                swhere += " and " + thisTableDiyConfig.dataparams.swhere
            }

            thisTableConfig.dataparams.swhere = swhere;

            that.gridPageLoad(thisTableConfig.dataparams, function (data) {
                var getData = [];
                if (data.success) {
                    if (data.data.value) {
                        getData = JSON.parse(data.data.value);
                    }
                    that.tableCellTemp(getData, thisTableConfig.htmlparams);
                    configsMap[keyword] = $.extend(configsMap[keyword], { data: getData });
                }
            });
        },
        // 循环加载指定的所有子表
        loadChildrenTable: function (optionDiy, type, callback) {
            var that = this;
            if (typeof optionDiy == "object") {
                if (optionDiy.childrenTables && type == "all") {
                    for (var key in optionDiy.childrenTables) {
                        if (callback) {
                            callback(key);
                        }
                    }
                }
            } else if (typeof optionDiy == "string") {
                if (type == "single") {
                    callback(optionDiy);
                }
            }
        },
        //表单子表的编辑html上，点击确定
        SaveChildrenTable: function (keyword, callback) {
            var that = this;
            var canGo = true;
            if (!keyword) {
                return false;
            }

            var thisTableConfig = configsMap[keyword];
            var form = $("#" + keyword + "_Form");

            var data = {};
            if (!!formConfig.table_data_list_id) {
                for (var i = 0; i < thisTableConfig.data.length; i++) {
                    if (thisTableConfig.data[i][formConfig.table_data_list_idfield] == formConfig.table_data_list_id) {
                        data = thisTableConfig.data[i];
                    }
                }
            }

            form.find("input,textarea").each(function () {
                var $this = $(this);
                var name = $this.attr("name");
                var value = $this.val();
                var required = $this.prop("required");

                if (required && value == "") {
                    canGo = false;
                    $this.parent().addClass("mui-required");
                }
            });

            if (!canGo) {
                mui.alert("必填信息不完整，请完善信息");
                return false;
            }

            form.find("input,textarea").each(function () {
                var $this = $(this);
                var name = $this.attr("name");
                var value = $this.val();
                var required = $this.prop("required");
                var text = $this.prev().text();

                data[name] = that.decodeComboBoxData(keyword, name, value);
                $this.parent().removeClass("mui-required");
                $this.val("");
            });

            //将向导中，选择的值，存入data中
            if (formConfig[keyword]) {
                for (var tofd in formConfig[keyword]) {
                    data[tofd] = formConfig[keyword][tofd];
                }
            }

            data["_state"] = formConfig.table_state;
            if (formConfig.table_state == "added") {
                data[thisTableConfig.keyfield] = Util.newGuid();
            }

            var pconfig = that.getParentConfig(keyword);
            if (pconfig && pconfig.currow) {
                for (var fd in thisTableConfig.fields) {
                    if (typeof fd == "function") {
                        continue;
                    }

                    data[fd] = pconfig.currow[thisTableConfig.fields[fd]];
                }
            }

            var pack = {};
            pack[keyword] = {
                KeyWordType: thisTableConfig.KeyWordType,
                data: [data]
            };


            $.ajax({
                url: "/Form/SaveWebForm",
                type: "POST",
                data: {
                    formId: FormId,
                    encode: "r4",
                    jsonData: Util.Base64Swhere(JSON.stringify(pack))
                },
                cache: false,
                success: function (text) {
                    var getData = JSON.parse(text);
                    if (getData.success) {
                        if (callback) {
                            callback();
                        }

                        that.loadChildrenTable(keyword, "single", function (table) {
                            that.getChildrenTable(table);

                            var form = $("#" + keyword + "_Form");
                            form.addClass("move-animation-start").removeClass("move-animation-back");
                        });
                    } else {
                        mui.alert("保存数据失败");
                    }
                }

            });
        },
        //子表删除事件
        deleteTableLists: function (keyword, keywordtype, callback, type, row) {
            var that = this;
            var rows = [];
            var lis = $("#" + keyword).find("input:checked").closest("li");

            if (type == "inLine" && row) {
                lis = row;
            }

            lis.each(function () {
                var $this = $(this);
                var id = $this.attr("data-id");
                var idfield = $this.attr("data-idfield");

                var obj = {
                    _state: "removed"
                };

                obj[idfield] = id;
                rows.push(obj);
            });

            if (lis.length == 0) {
                return;
            }

            var pack = {};
            pack[keyword] = {
                "KeyWordType": keywordtype || "BO",
                data: rows
            };

            that._loading("正在删除");
            $.ajax({
                url: "/Form/SaveWebForm",
                type: "POST",
                data: {
                    formId: "",
                    encode: "r4",
                    jsonData: Util.Base64Swhere(JSON.stringify(pack)),
                    Params: Util.Base64Encode("")
                },
                success: function (data) {
                    var getData = JSON.parse(data);
                    that._closeLoading();
                    if (callback) {
                        callback(getData, lis);
                    }
                },
                error: function (e) {
                    that._closeLoading();
                    mui.alert(e);
                }
            });
        },
        getWizardList: function (searchKey) {
            var that = this;
            var where = "";

            var obj = {
                url: "/Form/GridPageLoad",
                select: "",
                KeyWord: "Organize",//此处修改KeyWord
                KeyWordType: "BO", //此处修改KeyWordType
                size: "0",
                index: "0",
                order: "",
                swhere: " 1=1 "
            };

            if (wizardCurrentKeyMap.config && wizardCurrentKeyMap.config.filter) {
                where = wizardCurrentKeyMap.config.filter;
                obj.swhere += " and " + where;
            }

            if (searchKey) {
                obj.swhere += " and Name like '%" + searchKey + "%'";
            } else {
                obj.swhere += " and Name like '%" + "" + "%'";
            }

            that.gridPageLoad(obj, function (data) {
                var getData = [];
                if (data.data.value) {
                    getData = JSON.parse(data.data.value);
                }
                wizardCurrentKeyMap.data = getData;
                that.wizardListTemp(getData);
            });
        },
        // 向导列表的模板
        wizardListTemp: function (data) {
            var item, html = '';
            for (var i = 0; i < data.length; i++) {
                item = data[i];
                html += '<li data-id="' + item.Id + '" class="mui-table-view-cell mui-indexed-list-item mui-radio mui-left">' +
                    '<input type="radio" name="wizard"/>' +
                    '<span class="wizard-list-font">' + item.Name + '</span>' +
                    '<span class="wizard-list-font">  ' + item.Code + '</span>' +
                    '</li>';
            }

            $("#wizard_lists").html(html);
        },
        //执行向导操作
        openWizard: function (keyword, key) {
            var that = this;
            var actionId = keyword + "." + key;
            var thisActionConfig = formConfig[actionId];
            if (!thisActionConfig) {
                //通过xx找不到配置文件
                mui.alert(app_global_ResouceId["g_through"] + actionId + app_global_ResouceId["not_fined_config"]);
                return false;
            }

            var where = "";
            var title = "选择";
            if (thisActionConfig.ComponentName) {
                title += thisActionConfig.ComponentName;
            }

            wizardCurrentKeyMap.ComponentID = thisActionConfig.ComponentID;
            wizardCurrentKeyMap.btnid = actionId;
            wizardCurrentKeyMap.formid = FormId;
            wizardCurrentKeyMap.config = thisActionConfig;

            that.getWizardList();
        },
        //打开向导进行配置获取进行相关赋值
        openWizardBefore: function (option) {
            if (!option) {
                return false;
            }

            $("#wizard_title").text(option.title);
            $("#search_wizard").siblings(".mui-placeholder")
                .find("span:not(.mui-icon)").text(option.searchName);

            $("#complete_wizard").attr("data-target", option.target);
        },
        // 关闭向导进行配置获取进行相关去值
        closeWizardBefore: function () {
            $("#wizard_title").text("");
            $("#search_wizard").siblings(".mui-placeholder")
                .find("span:not(.mui-icon)").text("");

            $("#complete_wizard").attr("data-target", "");

            $(".mui-wizard-content")
                .addClass("move-animation-start")
                .removeClass("move-animation-back");
        },
        // 获取主表数据基本参数
        flowSaveValid: function (params) {
            var that = this;
            var keyword = formConfig.config.joindata.KeyWord;
            var isChange = false;

            // 获取form里面的数据
            // 给主表赋值
            $("#" + keyword).find("input,select,textarea").each(function () {
                var $this = $(this);
                var key = $this.attr("name");
                var value = $this.val();

                value = that.decodeComboBoxData(keyword, key, value);
                if (!$this.attr("readonly") || !$this.attr("disabled")) {
                    if (formConfig.config.joindata.currow[key] != value) {
                        formConfig.config.joindata.currow[key] = value;
                        isChange = true;
                    }
                }
            });

            // 如果没有 params参数
            if (params == undefined) {
                params = {};
            }

            var row = formConfig.config.joindata.currow;
            if (formConfig.FormState == "add") {
                row["_state"] = "added";
            } else if (formConfig.FormState == "edit") {
                row["_state"] = "modified";
            } else {
                row["_state"] = "view";
            }

            var pack = {};
            pack[keyword] = {
                KeyWordType: null,
                data: []
            };

            pack[keyword].data.push(row);

            //检查是否有修改，减少服务器交互
            var jdata = {
                formId: FormId,
                jsonData: JSON.stringify(pack)
            };

            //如果是审批处理，允许没有提交数据
            if (
                typeof (workflowdata) != "undefined" &&
                typeof (formConfig) != "undefined" &&
                !that.WorkflowReadOnly()) {

                if (!params) {
                    params = {};
                }

                params.IsWorkFlowHuman = "1";
            }

            //如果是新增状态数据，且是当前录入人
            var joindata = formConfig.config.joindata;
            if (joindata.statusfield &&
                joindata.currow[joindata.statusfield] == "0" &&
                that.IsRegHuman(joindata, joindata.currow)
            ) {
                params.IsRegHuman = "1";
            }

            if (!params) {
                jdata.Params = "";
            } else {
                jdata.Params = JSON.stringify(params);
            }

            return jdata;
        },
        //主表保存信息
        saveMainTable: function (params, callback) {
            var that = this;
            var jdata = that.flowSaveValid(params);
            var url = "/Form/SaveWebForm";

            jdata.Params = Util.Base64Encode(jdata.Params);
            // wsl 追加，如果表单参数中有  FromSource ,并且值等于 TransFlow ，
            // 说明是从事务流触发的表单新增，则URL重新定向
            if (params && params.ControlPath != undefined) {
                url = "/" + params.ControlPath + "/SaveWebForm";
            }

            that._ajax(url, jdata, "POST", false, function (data) {
                var getData = JSON.parse(data);
                if (getData.success) {
                    mui.toast("保存成功");
                    if (callback) {
                        callback();
                    }
                } else {
                    mui.alert("保存失败 " + getData.message);
                }
            });
        },
        // 操作启动操作按钮的时候，先保存主表数据
        saveFormWorkFlow: function (dataStatus, postInfo, callback) {
            var that = this;

            var params = {
                json: JSON.stringify(postInfo)
            };

            if (!(dataStatus || postInfo)) {
                mui.alert("参数错误");
                return false;
            }

            that._APIAjax(params, function (data) {
                if (callback) {
                    callback(data)
                }
            });
        },
        toggleActionSheet: function () {
            mui('#ActionSheet').popover('toggle');
        },
        // 过滤操作表
        fliterActions: function (actions) {
            var that = this;
            var result = [];
            var effected = formConfig.Effected;

            actions.forEach(function (item, index) {
                if (item.id == "saveMainTable") {
                    var isView = formConfig.FormState == "view";
                    var Approved = that.WorkflowApproved();
                    var sameMan = workflowdata.RecordRegHumId == workflowdata.UserID;
                    if (!isView && !Approved && sameMan) {
                        result.push(item);
                    }
                } else {
                    if (workflowdata && workflowdata.CanFlowOperate) {
                        var currentResult = workflowdata.CanFlowOperate;
                        var canFlowOperate = currentResult.CanFlowOperate;
                        var isDisabled = formConfig.FormState == "edit" && workflowdata.RecordRegHumId == workflowdata.UserID;

                        if ((canFlowOperate & appFlowsEnums.ECanFlowOperate[item.id]) > 0) {
                            result.push(item);
                        }
                    }
                }
            });

            return result;
        },
        //如果绑定了工作流体系，则设定工作流按钮 在操作表中 
        setFlowResult: function () {
            var that = this;
            // "HangUp", "UnHangUp", "DelayDate", "UnEndFlow"
            var Actions = [
                { id: "Active", text: "送审", type: "default" },
                { id: "Send", text: "同意", type: "default" },
                { id: "Return", text: "驳回", type: "default" },
                { id: "GetBack", text: "回收", type: "default" },
                // { id: "Stop", text: "终止", type: "default"},
                { id: "ShowMonitor", text: "监控", type: "default" },
                { id: "saveMainTable", text: "保存主表", type: "default" } // 这个不是审批流中的操作 但是要加进去
            ];

            var afterFliterAction = that.fliterActions(Actions);
            if (optionDiy.btnExtend && optionDiy.btnExtend.length > 0) {
                afterFliterAction = optionDiy.btnExtend.concat(afterFliterAction)
            }
            var html = '';
            afterFliterAction.forEach(function (item, index) {
                var id = item.id;
                if (id != "saveMainTable") {
                    id = "workFlow_action_" + item.id;
                }
                html += '<li class="mui-table-view-cell">' +
                    '<a id="' + id + '" href="javascript:void(0)">' + item.text + '</a>' +
                    '</li>';
            });

            $("#ActionSheetList").html(html);

            // 保存主表信息
            $("#saveMainTable").on("tap", function (e) {
                e.preventDefault();

                that.saveMainTable(null, function () {
                    var actionLink = "";
                    if (formConfig.FormState == "add") {
                        actionLink = "edit";
                    } else {
                        actionLink = formConfig.FormState;
                    }

                    var joindata = formConfig.config.joindata;
                    formConfig.KeyValue = joindata.currow[joindata.keyfield];
                    window.location.href = "/Form/ValidForm/"
                        + FormId + "/" + actionLink + "/" + formConfig.KeyValue + "/";
                    that.load(optionDiy);
                });
                that.toggleActionSheet();
            });

            //自定义按钮事件
            optionDiy.btnExtend.forEach(function (item, index) {
                $("#workFlow_action_" + item.id).on("tap", function (e) {
                    that.toggleActionSheet();
                    item.callback(e);
                });
            });

            // 绑定流程按钮事件
            that.workflowEvents();
        },
        getOperate: function (node) {
            var flowString = "";
            switch (node.FlowOperate) {
                case appFlowsEnums.EFlowOperate.Active:
                    flowString = "送审";
                    break;
                case appFlowsEnums.EFlowOperate.Send:
                    flowString = "同意";
                    break;
                case appFlowsEnums.EFlowOperate.Return:
                    flowString = "驳回";
                    break; //"退回"
                case appFlowsEnums.EFlowOperate.Stop:
                    flowString = "终止";
                    break; //终止
                case appFlowsEnums.EFlowOperate.CheckOut:
                    flowString = "等候签收";
                    break; //签收
                case appFlowsEnums.EFlowOperate.Delegate:
                    if (node.IsReturnDelegateRoot == false)
                        flowString = "委派";
                    else
                        flowString = "委派返回";
                    break;
                default:
                    flowString = "";
                    break;

            }
            return flowString;
        },
        // 获取流程监控的数据
        getMonitorLists: function (WorkInfoID, callback) {
            var that = this;
            if (!WorkInfoID) {
                mui.alert("WorkInfoID不可以为空");
                return false;
            }

            //获取流程意见
            var CurrentInfo = {
                SubOperate: "ReadConfig",
                Current: {
                    WorkInfoID: WorkInfoID
                },
                FlowOperate: appFlowsEnums.EFlowOperate.ShowMonitor
            };

            var msg = {
                MessageCode: "Power.WorkFlows.Actions.RecvFlowOperate",
                data: CurrentInfo
            };

            var params = {
                json: JSON.stringify(msg)
            };

            that._APIAjax(params, function (data) {
                var getData = JSON.parse(data);
                if (!getData.success) {
                    mui.alert(getData.message);
                    return false;
                }
                if (callback) {
                    callback(getData.data.ResultInfo);
                }

            }, "/API/APIMessage");
        },
        // 整合监控数据
        checkMonitorDataList: function (isEnd, histortMind, callback) {
            console.log(histortMind);
            var that = this;
            var dataArray = [];
            for (var i = 0; i < histortMind.length; i++) {
                var tmp = {};
                var item = histortMind[i];
                //隐藏的记录暂时不显示
                if (item.InboxStatus == appFlowsEnums.EFlowInboxStatus.Hidden) {
                    continue;
                }
                //流程还未结束，发送到结束节点的不显示
                if (isEnd == false && item.ActName == "结束") {
                    continue;
                }
                //忽略自动跳过的意见
                if (item.InboxStatus == appFlowsEnums.EFlowInboxStatus.WorkStop) {
                    continue;
                }
                //如果当前是结束节点，但是前面还有非结束节点，忽略
                if (item.ActName == "结束") {
                    for (var j = 0; j < i; j++) {
                        if (histortMind[j].ActName != "结束") {
                            break;
                        }
                    }
                    if (j != i) {
                        continue;
                    }
                }

                //如果是办结操作，则无视掉
                if (typeof (item["FlowOperate"]) != "undefined" && item.FlowOperate ==
                    appFlowsEnums.EFlowOperate.EndFlow) {
                    continue;
                }
                if (item.Alias != "MindRecord") {
                    continue;
                }

                tmp.time = item.MindDate.replace("年", '/').replace("月", '/').replace("日", '/');
                tmp.role = item.DeptPositionName;
                tmp.name = item.UserName;

                for (var iTmp = 0, len = histortMind.length; iTmp < len; iTmp++) {
                    if (histortMind[iTmp].BeforeSequeID == item.SequeID) {
                        tmp.opt = that.getOperate(histortMind[iTmp]);
                        break;
                    }
                }

                tmp.opt = tmp.opt == undefined ? "" : tmp.opt;
                if (tmp.opt == "驳回") {
                    tmp.static = "reject";
                } else {
                    tmp.static = "agree";
                }

                if (item.ActName == "结束" && tmp.opt == "") {
                    tmp.opt = "结束";
                } else if (item.InboxStatus == appFlowsEnums.EFlowInboxStatus.WorkEnd) {
                    tmp.text = '意见: ' + (item.Content ==
                        "" ? "同意" : item.Content);
                } else if (item.InboxStatus == appFlowsEnums.EFlowInboxStatus.WaitingSign) {
                    tmp.text = "等候签收"
                } else if (item.InboxStatus == appFlowsEnums.EFlowInboxStatus.Normal) {
                    tmp.text = "正在办理";
                } else {
                    tmp.text = '意见:' + (item.Content ==
                        "" ? "同意" : item.Content);
                }
                dataArray.push(tmp);
            }

            if (callback) {
                console.log(dataArray);
                callback(dataArray);
            }
        },
        // 监控数据的渲染模板
        monitorDataTemp: function (data) {
            if (!data || !data.length) {
                return false;
            }
            var html = '';
            data.forEach(function (item, index) {
                html += '<li class="mui-table-view-cell monitor-unit">' +
                    '<div class="list_monitor-wrap">' +
                    '<div class="list-monitor-title">' +
                    '<div class="list-monitor-icon"></div>' +
                    '<div class="time-tag">' +
                    '<span>' + item.time + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="list-monitor-content">' +
                    '<div class="monitor-line monitor-role">' +
                    '<span>' +
                    '<span>' + item.role + ': </span>' +
                    '<span>' + item.name + '</span>' +
                    '</span>' +
                    '<span class="mui-pull-right">' + item.opt + '</span>' +
                    '</div>' +
                    '<div class="monitor-line monitor-text">' +
                    '<span>' + item.text + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            });

            $("#lists_monitor").html(html);
        },
        // 触发送审流程
        showActionFlow: function (data, flowOperate) {
            var url = "/Form/OpenURL?url=/Apps/workflow/WorkNodeSelect.html?KeyWord="
                + data.KeyWord
                + "&KeyValue=" + data.KeyValue
                + "&FormID=" + data.FormId
                + "&flowOperate=" + flowOperate;

            appPhysical.OpenWebView(url, "流程审批");
        },
        // 触发同意流程
        showSendFlow: function (data, flowOperate) {
            var url = "/Form/OpenURL?url=/Apps/workflow/WorkNodeSelect.html?WorkInfoID="
                + data.WorkInfoID
                + "&SequeID=" + data.SequeID
                + "&flowOperate=" + flowOperate;

            appPhysical.OpenWebView(url, "流程审批");
        },
        showReturnFlow: function (data, flowOperate) {
            var url = "/Form/OpenURL?url=/Apps/workflow/WorkReturnSelect.html?WorkInfoID="
                + data.WorkInfoID
                + "&SequeID=" + data.SequeID
                + "&flowOperate=" + flowOperate;

            appPhysical.OpenWebView(url, "流程审批");
        },
        //选择流程
        selectWorkFlow: function (flowOperate) {
            var url = "/Form/OpenURL?url=/Apps/workflow/WorkNodeSelect.html?KeyWord="
                + formconfig.config.joindata.KeyWord
                + "&KeyValue=" + formconfig.KeyValue
                + "&FormID=" + FormId
                + "&flowOperate="
                + flowOperate;

            appPhysical.OpenWebView(url, "流程审批");
        },
        // 处理送审的参数
        checkActivesParams: function (params, flowOperate, callback) {
            var that = this;
            var data = that.flowSaveValid(params);
            var result = JSON.parse(data.jsonData);

            if (!data.params) {
                data.params = {};
            }

            //设置以流程参与人模式触发保存,外部规定
            data.params.IsWorkFlowHuman = 1;

            var formData = {};
            formData.formId = formconfig.FormId;
            formData.json = result;
            formData.params = Util.Base64Encode(JSON.stringify(data.params));

            var msg = {};
            msg.MessageCode = "Power.Controls.PMS.SaveWebForm";
            msg.data = formData;
            msg.data.FlowOperate = flowOperate;

            if (!postInfo) {
                postInfo = {};
            };
            //开启事务
            postInfo.OpenTrans = "true";
            //要保存的数据包 
            postInfo[flowOperate] = msg;

            dataStatus[flowOperate] = {};
            //数据已经准备完毕
            dataStatus[flowOperate].Complete = true;

            if (callback) {
                callback(dataStatus, postInfo);
            }
        },
        // 回收参数处理
        checkGetBackParams: function (params, flowOperate, callback) {
            var that = this;
            var data = that.flowSaveValid(params);
            var result = JSON.parse(data.jsonData);
            var current = that.getFlowParameter();

            if (!data.params) {
                data.params = {};
            }

            //设置以流程参与人模式触发保存,外部规定
            data.params.IsWorkFlowHuman = 1;

            var formData = {};
            formData.Current = current;

            var msg = {};
            msg.MessageCode = "Power.Controls.PMS.SaveWebForm";
            msg.data = formData;
            msg.data.FlowOperate = flowOperate;

            if (flowOperate == "GetBack") {
                msg.MessageCode = "Power.WorkFlows.Actions.RecvFlowOperate";
            }

            if (!postInfo) {
                postInfo = {};
            };
            //开启事务
            postInfo.OpenTrans = "true";
            //要保存的数据包
            postInfo[flowOperate] = msg;

            dataStatus[flowOperate] = {};
            //数据已经准备完毕
            dataStatus[flowOperate].Complete = true;

            if (callback) {
                callback(dataStatus, postInfo);
            }
        },
        // 获取送审的参数
        getFlowParameter: function () {
            var data = {
                FormId: formConfig.FormId,
                KeyValue: formConfig.KeyValue,
                KeyWord: formConfig.config.joindata.KeyWord,
                WorkInfoID: workflowdata.CanFlowOperate.WorkInfoID,
                SequeID: workflowdata.CanFlowOperate.SequeID
            };

            if (!data.KeyValue) {
                data.KeyValue =
                    formConfig.config.joindata.currow[formConfig.config.joindata.keyfield];
            }

            if (!data.WorkInfoID) {
                data.WorkInfoID = "";
                if (workflowdata.CanFlowOperate.CanFlowList.ShowMonitor) {
                    data.WorkInfoID = workflowdata.CanFlowOperate.CanFlowList.ShowMonitor.WorkInfoID;
                }
            }
            return data;
        },
        // 流程绑定事件
        workflowEvents: function () {
            var that = this;

            // 监控
            $("#workFlow_action_ShowMonitor").on("tap", function () {
                if (!formConfig.FormId ||
                    !formConfig.KeyValue) {
                    mui.alert("FormId和KeyValue不能为空");
                    return false;
                }
                var data = that.getFlowParameter();

                that.toggleActionSheet();
                that.getMonitorLists(data.WorkInfoID, function (ResultInfo) {
                    var histortMind = ResultInfo.HistoryMind;
                    //整个流程是否已结束时
                    var isEnd = true;
                    var node;
                    for (var i = 0; i < histortMind.length; i++) {
                        node = histortMind[i];
                        if (node.InboxStatus == (20 || 40)) {
                            isEnd = false;
                            break;
                        }
                    }

                    that.checkMonitorDataList(isEnd, histortMind, function (data) {
                        that.monitorDataTemp(data);
                        $(".monitor-content").addClass("move-animation-back").removeClass("move-animation-start");
                    });
                });
            });
            // 送审
            $("#workFlow_action_Active").on("tap", function () {
                if (!formConfig.FormId ||
                    !formConfig.KeyValue) {
                    mui.alert("FormId和KeyValue不能为空");
                    return false;
                }
                var data = that.getFlowParameter();

                that.toggleActionSheet();
                that.checkActivesParams(null, "Update", function (dataStatus, postInfo) {
                    that.saveFormWorkFlow(dataStatus, postInfo, function (returnData) {
                        var getData = JSON.parse(returnData);

                        if (getData.success) {
                            mui.toast("保存成功");
                            that.showActionFlow(data, "Active");
                        } else {
                            mui.alert(getData.message);
                            return false;
                        }
                    });
                });
            });
            // 同意
            $("#workFlow_action_Send").on("tap", function () {
                if (!formConfig.FormId ||
                    !formConfig.KeyValue) {
                    mui.alert("FormId和KeyValue不能为空");
                    return false;
                }
                var data = that.getFlowParameter();

                that.toggleActionSheet();
                that.checkActivesParams(null, "Update", function (dataStatus, postInfo) {
                    that.saveFormWorkFlow(dataStatus, postInfo, function (returnData) {
                        var getData = JSON.parse(returnData);

                        if (getData.success) {
                            mui.toast("保存成功");
                            that.showSendFlow(data, "Send");
                        } else {
                            mui.alert(getData.message);
                            return false;
                        }
                    });
                });
            });
            // 驳回
            $("#workFlow_action_Return").on("tap", function () {
                if (!formConfig.FormId ||
                    !formConfig.KeyValue) {
                    mui.alert("FormId和KeyValue不能为空");
                    return false;
                }
                var data = that.getFlowParameter();

                that.toggleActionSheet();
                that.checkActivesParams(null, "Update", function (dataStatus, postInfo) {
                    that.saveFormWorkFlow(dataStatus, postInfo, function (returnData) {
                        var getData = JSON.parse(returnData);

                        if (getData.success) {
                            mui.toast("保存成功");
                            that.showReturnFlow(data, "Return");
                        } else {
                            mui.alert(getData.message);
                            return false;
                        }
                    });
                });
            });
            // 回收
            $("#workFlow_action_GetBack").on("tap", function () {
                if (!formConfig.FormId ||
                    !formConfig.KeyValue) {
                    mui.alert("FormId和KeyValue不能为空");
                    return false;
                }
                var data = that.getFlowParameter();

                that.toggleActionSheet();
                that.checkGetBackParams(null, "GetBack", function (dataStatus, postInfo) {
                    that.saveFormWorkFlow(dataStatus, postInfo, function (returnData) {
                        var getData = JSON.parse(returnData);
                        if (getData.success) {
                            mui.toast("撤回成功");
                            window.location.href = "/Form/ValidForm/"
                                + FormId + "/" + formConfig.FormState + "/" + formConfig.KeyValue + "/";
                        } else {
                            mui.alert(getData.message);
                            return false;
                        }
                    });
                });
            });
        },
        // 获取报表数据
        getReport: function (callback) {
            var that = this;
            var formid = formConfig.FormId;
            var params = {
                FormId: formid
            };
            that._APIAjax(params, function (data) {
                var getData = JSON.parse(data);
                if (!!getData.data.value) {
                    if (callback) {
                        callback(JSON.parse(getData.data.value));
                    }
                }
            }, "/Form/GetReport");
        },
        // 报表数据处理
        checkReportData: function (data) {
            var that = this;
            var arr = [];
            var keyvalue = formconfig.config.joindata.currow[formconfig.config.joindata.keyfield];
            var keyword = formconfig.config.joindata.KeyWord;

            data.forEach(function (item, index) {
                var id = item.Id;
                var url = "/PowerPlat/FormXml/ReportView.aspx?rid=" + id +
                    "&KeyWord=" + keyword;
                var formKeys;

                if (item.FormKey) {
                    formKeys = item.FormKey.split(',');
                    formKeys.forEach(function (keyItem, keyIndex) {
                        //[@Id]\[@KeyWord.xx]
                        var pars = keyItem.split(".");
                        if (pars.length == 2) {
                            var this_config = configsMap[pars[0]];
                            if (this_config.currow) {
                                url += "&" + keyItem + "=" + this_config.currow[pars[1]];
                            } else {
                                url += "&" + keyItem + "=" + keyItem;
                            }
                        } else {
                            //如果能通过$("#xx")找到值，&xx=值
                            if ($("#" + pars[0]).size() > 0) {
                                url += "&" + keyItem + "=" + $("#" + pars[0]).val();
                            } else if (pars[0].toLowerCase() == "keyvalue") {
                                url += "&KeyValue=" + keyvalue;
                            } else {//如果找不到，&xx=xx;
                                url += "&" + keyItem + "=" + keyItem;
                            }
                        }
                    });
                    item.url = url;
                    arr.push(item);
                }
            });
            return arr;
        },
        // 报表的渲染模板
        reportListTemp: function (data, targetContent) {
            var html = '';
            data.forEach(function (item, index) {
                html += '<li data-title = "' + item.Name + "." + item.ExpType + '" data-link="' + item.url + '" class="mui-table-view-cell">' +
                    '<a class="mui-navigate-right report">' +
                    '<span>' + item.Name + "." + item.ExpType + '</span>' +
                    '</a>' +
                    '</li>';
            });

            $("#" + targetContent).html(html);

            $("#" + targetContent + " .mui-table-view-cell").on("tap", function () {
                var $this = $(this);
                var link = $this.attr("data-link");
                var title = $this.attr("data-title");

                appPhysical.OpenWebView(link, title);
            });
        },
        // 获取评论数据
        getComment: function (callback) {
            var that = this;
            var formid = formConfig.FormId;
            var params = {
                FormId: formid,
                KeyWord: formConfig.config.joindata.KeyWord,
                KeyValue: formConfig.KeyValue
            };
            that._APIAjax(params, function (data) {
                var getData = JSON.parse(data);
                if (getData.success) {
                    callback(getData);
                } else {
                    mui.alert(getData.message);
                }
            }, "/Form/GetComment");
        },
        // 评论列表渲染模板
        commentList: function (data, targetContent, callback) {
            var item, html = '';
            var that = this;
            var lists = data.data.value;
            var Subscribe = data.data.Subscribe;
            HumanId = data.data.HumanId;

            function atList(AtHumanList) {
                var atHtml = '';
                if (!AtHumanList || AtHumanList.length == 0) {
                    return atHtml;
                }

                AtHumanList.forEach(function (item, index) {
                    atHtml += '<span class="at-list" data-atid="' + item.HumanId + '">@' + item.HumanName + '</span>'
                });
                return atHtml;
            }
            // 订阅checkbox
            $("#subscribe").prop("checked", Subscribe == "Y");

            lists = lists.sort(function (a, b) {
                return new Date(a.RegDate).getTime() - new Date(b.RegDate).getTime();
            });

            lists.forEach(function (item, index) {
                var RegHumId = item.RegHumId;
                var AtHumanList = item.AtHumanList;

                if (!item.RegHeader) {
                    item.RegHeader = "/App_Themes/Default/assets/img/avatar1_small.jpg";
                }
                if (HumanId == RegHumId) {
                    html += '<div class="comment-history-list right">' +
                        '<p class="time-send">' +
                        '<span> ' + that._formatDate(item.RegDate) + '</span>' +
                        '<span>' + item.RegHumName + ' </span>' +
                        '</p>' +
                        '<div class="list-wrap">' +
                        '<div class="list-text">' +
                        '<span class="text right">' + atList(AtHumanList) + item.CommentText + ' </span>' +
                        '</div>' +
                        '<div class="avatar-wrap">' +
                        '<img src="' + item.RegHeader + '" alt="">' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                } else {
                    html += '<div class="comment-history-list left">' +
                        '<p class="time-send">' +
                        '<span>' + item.RegHumName + ' </span>' +
                        '<span >' + that._formatDate(item.RegDate) + '</span>' +
                        '</p>' +
                        '<div class="list-wrap">' +
                        '<div class="avatar-wrap">' +
                        '<img src="' + item.RegHeader + '" alt="">' +
                        '</div>' +
                        '<div class="list-text">' +
                        '<span class="text left">' + atList(AtHumanList) + item.CommentText + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }
            });

            $("#" + targetContent).html(html);

            if (callback) {
                callback(data);
            }
        },
        // 订阅功能
        onSubScribe: function (callback) {
            var that = this;
            var url = "/Form/SubscribeComment";
            var sub = $("#subscribe").prop("checked");

            var sub_value = "N";
            if (!sub) {
                sub_value = "Y";
            } else {
                sub_value = "N";
            }

            var params = {
                KeyWord: formConfig.config.joindata.KeyWord,
                KeyValue: formConfig.KeyValue,
                FormId: formConfig.FormId,
                Subscribe: sub_value
            }

            that._ajax(url, params, "get", false, function (data) {
                var getData = JSON.parse(data);
                if (callback) {
                    callback(getData, params.Subscribe);
                }
            });
        },
        // 发送评论
        onPostComment: function (callback) {
            var that = this;
            var Send_comment = $("#Send_comment_text");
            var send_comment_text = $.trim(Send_comment.val());

            if (!send_comment_text) {
                mui.alert("发送内容不能为空");
                return false;
            }
            Send_comment.blur();

            var json = {
                FormId: formConfig.FormId,
                KeyWord: formConfig.config.joindata.KeyWord,
                KeyValue: formConfig.KeyValue,
                CommentText: send_comment_text,
                AtHumanList: []
            };
            selectedAtHuman.forEach(function (item) {
                json.AtHumanList.push({
                    HumanId: item.Id,
                    HumanName: item.Name
                });
            });
            var params = {
                jsonData: JSON.stringify(json)
            }

            that._APIAjax(params, function (data) {
                var getData = that.stringify(data);
                if (getData.success) {
                    mui.toast("发送成功");
                    if (callback) {
                        callback(getData);
                    }
                } else {
                    mui.toast("发送失败");
                }
            }, "/Form/PostComment");
        },
        // 获取At 人员向导
        getAtHumans: function (where, callback) {
            var that = this;
            var params = {
                KeyWord: "Human",
                KeyWordType: "BO",
                index: "0",
                order: "",
                select: "",
                size: "0",
                swhere: " 1=1 ",
                sort: "",
                url: "/Form/GridPageLoad"
            };

            if (where) {
                params.swhere += " and " + where;
            }

            //此处修改上方查询字段
            var searchKey = $.trim($("#search_wizard").val());
            if (searchKey) {
                params.swhere += " and (Name like '%" + searchKey + "%' or Code like '%" + searchKey + "%')";
            }

            if (params.swhere) {
                var tmp = {};
                tmp.encodeswhere = "r4";
                params.extparams = Util.Base64Encode(JSON.stringify(tmp));
                params.swhere = Util.Base64Swhere(params.swhere);
            }

            that._loading("加载中");
            $.ajax({
                url: params.url,
                data: params,
                type: 'POST',
                success: function (data) {
                    that._closeLoading();
                    var getData = JSON.parse(data);
                    if (getData.success) {
                        $("#search_wizard").val("");
                        if (getData.data.value != "") {
                            callback(JSON.parse(getData.data.value));
                        }
                    }
                }
            });
        },
        filerSelectedAtHuman: function (id) {
            var arr = [];
            var can = true;
            selectedAtHuman.forEach(function (item) {
                if (id != item.Id) {
                    arr.push(item);
                } else {
                    can = false;
                }
            });
            return {
                arr: arr,
                can: can
            };
        },
        //At 人员向导模板
        atHumansTemp: function (data, targetId) {
            var html = '', item, that = this;
            data.forEach(function (item, index) {
                html += '<li data-code="' + item.Code + '" data-name="' + item.Name + '" data-id = "' + item.Id + '" class="mui-table-view-cell mui-media">' +
                    '<div>' +
                    '<div class="mui-media-object mui-checkbox mui-pull-left">' +
                    '<input name="checkbox" type="checkbox" >' +
                    '</div>' +
                    '<div class="mui-media-body">' +
                    '<span>' + item.Name + '</span>' +
                    '<p class="mui-ellipsis">' + item.Code + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            });

            $("#" + targetId).html(html);

            $("#" + targetId).find(".mui-media-body, .mui-checkbox").on("tap", function () {
                var $this = $(this);
                var row = $this.closest(".mui-table-view-cell");
                var id = row.attr("data-id");
                var obj = that.filerSelectedAtHuman(id);
                if (id == HumanId) {
                    mui.alert("不能选择自己");
                    row.removeClass("selected");
                    return false;
                }

                if (!obj.can) {
                    mui.alert("已经选择,不得重复选择");
                    row.removeClass("selected");
                    return false;
                }

                selectedAtHuman = obj.arr;
                row.toggleClass("selected");
                if (row.hasClass("selected")) {
                    row.find("input").prop("checked", true);
                } else {
                    row.find("input").prop("checked", false);
                }
            });

            $("#" + targetId).find("input").on("tap", function () {
                var $this = $(this);
                var row = $this.closest(".mui-table-view-cell");
                row.toggleClass("selected");
            });
        },
        //At 人员完成选择
        afterSelectedAtHuman: function (callback) {
            var arr = [], that = this;
            $("#wizard_lists > .mui-table-view-cell.selected").each(function () {
                var $this = $(this);
                var obj = {
                    Name: $this.attr("data-name"),
                    Code: $this.attr("data-code"),
                    Id: $this.attr("data-id")
                };

                arr.push(obj);
            });

            if ((selectedAtHuman.length + arr.length) > 3) {
                mui.alert("@人员名单超过三个,请重新选择");
                return false;
            }

            selectedAtHuman = selectedAtHuman.concat(arr);
            that.atSelectedLists(selectedAtHuman, "selected_lists");

            if (callback) {
                callback();
            }
        },
        // 删除At缓存中的人员
        deleteAtHuman: function (id) {
            var arr = [];
            selectedAtHuman.forEach(function (item) {
                if (id != item.Id) {
                    arr.push(item);
                }
            });

            selectedAtHuman = arr;
        },
        //At 人员选择后的渲染模板
        atSelectedLists: function (data, targetId) {
            var html = "", that = this;
            data.forEach(function (item, index) {
                html += '<span data-id="' + item.Id + '" data-code="' + item.Code + '" class="list-human">' +
                    '<label>' + item.Name + '</label>' +
                    '<i class="mui-icon mui-icon-closeempty"></i>' +
                    '</span>';
            });

            $("#" + targetId).html(html);
            $("#" + targetId).find(".mui-icon-closeempty").on("tap", function (e) {
                e.preventDefault();
                e.stopPropagation();

                var row = $(this).closest(".list-human");
                var id = row.attr("data-id");
                that.deleteAtHuman(id);
                that.atSelectedLists(selectedAtHuman, "selected_lists");
            });
        },
        // 初始化
        init: function (options, callback) {
            //初始化组件
            this.componentInit();

            //加载数据的入口
            this.load(options, function () {
                // 如果有自定义的回调 执行此回调
                if (callback) {
                    callback(formConfig, config, optionDiy, configsMap);
                }
            });
        },
        //打开向导面板
        openWizardIframeContent: function () {
            $(".mui-wizard-content.wizard-iframe").addClass("move-animation-back").removeClass("move-animation-start");
        },
        //关闭向导面板
        closeWizardIframeContent: function () {
            $(".mui-wizard-content.wizard-iframe").addClass("move-animation-start").removeClass("move-animation-back");
        },
        // 向导数据赋值
        WizardIframeDataAssign: function (isMainTable, data, wizard_origin) {
            var that = this;
            var fields = wizard_origin.fields;

            if (isMainTable) {
                for (var key in fields) {
                    mainTableMap[key] = data[fields[key]];
                }

                // 重新加载主表数据
                formConfig.config.joindata.currow = mainTableMap;
                that.setMainTable(mainTableMap, config);
            } else {

            }

            console.log(mainTableMap);
            that.closeWizardIframeContent();
        },
        // 关闭向导iframe之后的操作
        closeWizardIframe: function (data, wizard_origin_key, wizard_origin) {
            var that = appForm;
            var keyword = wizard_origin_key.split(".")[0];
            var key = wizard_origin_key.split(".")[1];
            var isMainTable = keyword == formConfig.config.joindata.KeyWord;
            // 如果是主表
            if (isMainTable) {
                that.WizardIframeDataAssign(isMainTable, data, wizard_origin);
            } else {

            }

            // console.log(data, wizard_origin_key, wizard_origin);
        },
        // 组件初始化 比如日期组件 mui的组件
        // 事件初始化
        componentInit: function () {
            mui.init();

            var that = this;

            that._checkPlat(function (tag) {
                if (tag == "iPhone") {
                    $("#UploadFileAll").addClass("hide");
                }
            });

            //打开日期选择器
            $(".btn-picker").on("tap", function () {
                var $this = $(this);
                $("input").blur();

                if ($this.prop("readonly")) {
                    return false;
                } else {
                    that._openDtPicker({}, function (data) {
                        $this.val(data.text).blur();
                    });
                }
            });
            //打开通用选择器
            $("input.mui-select").on("tap", function () {
                var $this = $(this);
                var readonly = $this.prop("readonly");
                var keyword = $this.attr("data-keyword");
                var key = $this.attr("name");
                var selectData = [];

                if (readonly) {
                    return false;
                }

                if (!keyword || !key) {
                    mui.alert("此选择器没有配置对应的data-keyword属性或name属性");
                    return false;
                }

                if (comboboxdata[keyword + "." + key]) {
                    selectData = comboboxdata[keyword + "." + key].Data;
                } else {
                    mui.alert("comboboxdata中没有对应的选项");
                    return false;
                }

                $("input").blur();

                that._openPicker(selectData, function (data) {
                    $this.val(data.text).blur();
                });
            });

            // 打开向导
            $(".mui-wizard").on("tap", function () {
                var $this = $(this);
                var readonly = $this.prop("readonly");
                var keyword = $this.attr("data-keyword");
                var key = $this.attr("name");
                var option = $this.attr("data-option");

                var url = $this.attr("data-url");
                var WizardIframe = $("#WizardContentIframe");

                $("input").blur();

                if (readonly) {
                    return false;
                }

                if (option) {
                    option = JSON.parse(option)
                }

                if (url) {
                    url += "?KeyWord=" + keyword + "&Name=" + key + "&EpsProjId=" + strEpsProjId;
                    window.closeWizardIframe = that.closeWizardIframe;
                    window.closeWizardIframeContent = that.closeWizardIframeContent;
                    WizardIframe.attr("src", url);

                    that._loading("加载中");
                    WizardIframe.on("load", function () {
                        that._closeLoading();
                        that.openWizardIframeContent();
                    });
                } else {
                    that.openWizardBefore(option);
                    that.openWizard(keyword, key);
                }
            });
            // 关闭向导
            $("#close_wizard").on("tap", function () {
                that.closeWizardBefore();
                $(".mui-wizard-content").addClass("move-animation-start").removeClass("move-animation-back");
            });
            // 向导搜索功能
            $("#search_wizard").on("change", function () {
                var $this = $(this);
                var searchKey = $.trim($this.val());
                var target = $("#complete_wizard").attr("data-target");
                if (target == "mainTable") {
                    that.getWizardList(searchKey);
                } else if (target == "atPeople") {
                    that.getAtHumans(null, function (data) {
                        $(".mui-wizard-content")
                            .addClass("move-animation-back")
                            .removeClass("move-animation-start");

                        that.atHumansTemp(data, "wizard_lists");
                    });
                }
            });
            // 完成向导选择
            $("#complete_wizard").on("tap", function () {
                var $this = $(this);
                var target = $this.attr("data-target");

                if (target == "atPeople") {
                    that.afterSelectedAtHuman(function () {
                        that.closeWizardBefore();
                    });
                }
            });

            // 子表点击关闭，关闭子表form显示面板, 面板上的数据清空
            $(".children-table-form .close-child-table").on("tap", function (e) {
                var $this = $(this);
                var form = $this.closest(".children-table-form");

                form.addClass("move-animation-start").removeClass("move-animation-back");
                form.find("input, textarea").each(function () {
                    $(this).parent().removeClass("mui-required");
                    $(this).val("");
                });
            });
            // 保存子表数据
            $(".children-table-form .save-child-table").on("tap", function (e) {
                var $this = $(this);
                var form = $this.closest(".children-table-form");
                var id = form.attr("id");
                var keyword = id.replace("_Form", "");

                that.SaveChildrenTable(keyword, function () {
                    // 子表配置数据获取
                    configs = that.ConfigToList(config);
                    // 初始化子表配置
                    that.childrenTableCondigInit(configs, optionDiy);
                });
            });

            // 点击新增按钮 新增子表 
            $(".add-table-list").on("tap", function () {
                var $this = $(this);
                var form = $this.closest(".mui-control-content").find(".children-table-form");

                if (formConfig.FormState != "view") {
                    form.addClass("move-animation-back").removeClass("move-animation-start");
                    form.find("input").prop("readonly", false);

                    formConfig.table_state = "added";
                    formConfig.table_data_list_id = "";
                } else {
                    mui.alert("您没有新增权限");
                }
            });
            // 点击删除按钮 显示checkbox 和确认删除面板
            $(".delete-table-list").on("tap", function () {
                var $this = $(this);
                var actionBlock = $this.closest(".action-table");
                var form = $this.closest(".mui-control-content").find(".mui-table-view");

                if (formConfig.FormState != "view") {
                    form.find("input[type=checkbox]").removeClass("hide");
                    actionBlock.addClass("hide").next().removeClass("hide");
                } else {
                    mui.alert("您没有删除权限");
                }
            });
            // 点击返回按钮 隐藏checkbox 和确认删除面板
            $(".delete-table-back").on("tap", function () {
                var $this = $(this);
                var actionBlock = $this.closest(".action-table");
                var form = $this.closest(".mui-control-content").find(".mui-table-view");

                form.find("input[type=checkbox]").addClass("hide");
                actionBlock.addClass("hide").prev().removeClass("hide");
            });
            // 点击确认删除按钮 执行删除子表数据
            $(".delete-table-lists").on("tap", function () {
                var $this = $(this);
                var actionBlock = $this.closest(".action-table");
                var form = $this.closest(".mui-control-content").find(".mui-table-view");
                var keyword = form.attr("id");
                var right = keywordright[keyword];
                var disabledRight = that.disabledRight();

                mui.confirm("确认删除?", "确认删除", ["否", "是"], function (e) {
                    if (e.index == 1) {
                        that.deleteTableLists(keyword, "BO", function (data, lis) {
                            if (data.success) {
                                lis.remove();
                            } else {
                                mui.alert(data.message);
                            }
                        }, "outLine");

                        form.find(".mui-icon").removeClass("hide");
                        form.find("input[type=checkbox]").addClass("hide");
                        actionBlock.addClass("hide").prev().removeClass("hide");
                    }
                });
            });

            // 点击附件按钮，加载附件
            $("#attach_action").on("tap", function (e) {
                // 加载附件
                that.getDocFiles(function (dataMap) {
                    that.docFilesTemp(dataMap);
                });
            });

            // 查看报表
            $("#report_action").on("tap", function () {
                that.getReport(function (data) {
                    var res = that.checkReportData(data);
                    that.reportListTemp(res, "ReportLists");
                });
            })

            // 操作表显示和隐藏
            $("#Action_btn").on("tap", function () {
                that.toggleActionSheet();
            });

            // 关闭监控面板
            $(".close-monitor-content").on("tap", function () {
                var $this = $(this);
                var top_block = $this.closest(".monitor-content");

                top_block.addClass("move-animation-start").removeClass("move-animation-back");
            });

            // 启用评论订阅功能
            $("#subscribe").on("tap", function () {
                that.onSubScribe(function (data, sub) {
                    if (data.success) {
                        if (sub == "Y") {
                            mui.toast("订阅成功");
                        } else {
                            mui.toast("取消订阅成功");
                        }
                    } else {
                        $("#subscribe").prop("checked", false);
                    }
                });
            });

            // 发送评论
            $("#send_btn").on("tap", function () {
                that.onPostComment(function (res) {
                    selectedAtHuman = [];
                    $("#Send_comment_text").val("");
                    that.atSelectedLists(selectedAtHuman, "selected_lists");
                    that.getComment(function (data) {
                        var commentObj = $.extend({}, data);
                        that.commentList(data, "comment_history", function () {
                            $("#comment_lists_wrap").scrollTop($("#comment_lists_wrap")[0].scrollHeight);
                        });
                    });
                });
            });

            // 点击评论tab页签，在加载评论内容
            $("#comment_action").on("tap", function () {
                that.getComment(function (data) {
                    var commentObj = $.extend({}, data);
                    that.commentList(data, "comment_history", function () {
                        $("#comment_lists_wrap").scrollTop($("#comment_lists_wrap")[0].scrollHeight);
                    });
                });
            });

            // 点击@，展开@人员向导
            $("#at_wizard").on("tap", function (e) {
                e.preventDefault();
                e.stopPropagation();

                var $this = $(this);
                var option = $this.attr("data-option");

                if (option) {
                    option = JSON.parse(option);
                    that.openWizardBefore(option);
                } else {
                    mui.alert("id为at_wizard的@按钮没有配置data-option属性中的信息");
                    return false;
                }

                that.getAtHumans(null, function (data) {
                    $(".mui-wizard-content.at-wizard")
                        .addClass("move-animation-back")
                        .removeClass("move-animation-start");

                    that.atHumansTemp(data, "wizard_lists");
                });
            });


            // 留给原生App上传附件成功之后调用
            window.MobileWebFormLoadFile = function () {
                that.getDocFiles(function (dataMap) {
                    that.docFilesTemp(dataMap);
                });
            };

            // 附件上传事件集合
            // 打开相册 打开相机 打开录像 等
            that.upLoadAttachEvents(formConfig);
        },
        // 加载 数据加载的入口
        load: function (options, callback) {
            var that = this;
            config = that.getConfig(formConfig.config.joindata.KeyWord);

            // 获取自定义的配置
            optionDiy = options;

            // 加载主表数据
            that.getMainTable(formConfig, function (data) {
                var getData = {};
                if (data) {
                    getData = JSON.parse(data);
                    mainTableMap = getData;
                    // config数据处理
                    that.formatConfig(config, getData);
                    // 加载主表数据
                    that.setMainTable(getData, config);

                    // 子表配置数据获取
                    configs = that.ConfigToList(config);
                    // 初始化子表配置
                    that.childrenTableCondigInit(configs, optionDiy);

                    // 设置编辑权限、按钮权限
                    that.setPermission(getData);

                    // 控制工作流按钮的显示和隐藏
                    that.setFlowResult();

                    // 获取子表数据
                    that.loadChildrenTable(optionDiy, "all", function (table) {
                        that.getChildrenTable(table);
                    });

                    if (callback) {
                        callback();
                    }
                } else {
                    mui.alert('主表数据为空', '警告');
                }
            });

        }
    }
}
