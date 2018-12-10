
function Win_AppForm() {
    //缓存用户自定义配置
    var optionDiv = {},

    // 表单配置信息
    formConfig = formconfig,
    // 数据的配置信息
    config = formconfig.config.joindata,
    // 操作权限
    hasRight = keywordright[config["KeyWord"]],
    // 是否将要做删除操作
    isDelete = false;

    return {
        // ajax封装
        _ajax: function(url, params, type, cache, callback) {
            var that = this;

            that._loading();
            $.ajax({
                url: url,
                data: params,
                type: type,
                cache: cache,
                success: function(data) {
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
        _APIAjax: function(params, callback) {
            var that = this;

            var url = "/API/APIMessages";
            that._ajax(url, params, "POST", false, callback);
        },
        // 自定义时间格式 ：format
        // "yyyy-MM-dd HH:mm:ss";"yyyy-MM-dd-HH-mm-ss"
        // "yyyy-MM-ddTHH:mm:ss" ....
        _formatDate: function(time, format) {
            var t = new Date(time);
            var tf = function(i) {
                return (i < 10 ? '0' : '') + i;
            };
            if (!format) {
                format = "yyyy-MM-dd HH:mm:ss";
            }

            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(type) {
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
        _openDtPicker: function(option, callback) {
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
        _openPicker: function(arr, callback) {
            var picker = new mui.PopPicker();
            picker.setData(arr);
            picker.show(function(data) {
                if (callback) {
                    callback(data[0]);
                }
                picker = null;
            });
        },
        // 获取连接中的参数,只需要传进对应的名称
        // file:///E:/myProjects/myTools/test.html?id=1234567&name=john
        //如上面的例子，只需要传进"id"  或者 "name"
        _getLocaArg: function() {
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
                '<span class="text">'+ text +'</span>' +
                '</div>' +
                '</div>' +
                '</div>';

            var loadings = $(".loading-pop-content");
            if (loadings.size() == 0) {
                $(top.document.body).append(html);
            }
        },
        // 关闭loading
        _closeLoading: function() {
            var loadings = $(top.document.body).find(".loading-pop-content");
            
            loadings.each(function() {
                var $this = $(this);
                var name = $this.attr("name");

                if (name == "loading") {
                    $this.remove();
                }
            });
        },
        // comboboxdata数据解析
        encodeComboBoxData: function(keyword, key, id) {
            var result = "", item;
            var data = [];
            if (comboboxdata[keyword + "." + key]) {
                data = comboboxdata[keyword + "." + key].Data;
                for(var i = 0; i < data.length; i++) {
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
        decodeComboBoxData: function(keyword, key, text) {
            var result = "", item;
            var data = [];
            if (comboboxdata[keyword + "." + key]) {
                data = comboboxdata[keyword + "." + key].Data;
                for(var i = 0; i < data.length; i++) {
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
        //获取子表上，行的标题数据
        getTypeResult: function (htmlparams, row, type) {
            var that = this;
            var result = "";
            var num = "";

            if (htmlparams[type].value != "") {
                var format = htmlparams[type].format;
                //普通文本
                if (!format){
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
                                num = d[comb.ValueField];
                                break;
                            }
                        }
                    }
                } else if (format.indexOf("n") > -1 || format.indexOf("c") > -1 || format.indexOf("p") > -1) {
                    //数字
                    result = new Number( row[htmlparams[type].value]);
                } else if (format.indexOf("y") > -1) {
                    //日期
                    result =  that._formatDate(row[htmlparams[type].value], format);
                }
            }

            if (!result) {
                result = "暂无";
            }

            if (type == "tag" && !!result) {
                switch (num) {
                    case "0": 
                        return {
                            tagColor: "power-project-menu-bg7",
                            result: result
                        }
                    case "20": 
                        return {
                            tagColor: "power-project-menu-bg2",
                            result: result
                        }
                    case "35": 
                        return {
                            tagColor: "power-project-menu-bg3",
                            result: result
                        }
                    case "40": 
                        return {
                            tagColor: "power-project-menu-bg4",
                            result: result
                        }
                    case "50": 
                        return {
                            tagColor: "power-project-menu-bg0",
                            result: result
                        }
                }
            }
            
            return result.replace("null", "");
        },
        //GridPageLoad加载数据
        gridPageLoad: function (params, callback) {
            var that = this;
            var p = $.extend({}, params);

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

            that._ajax(url, p, "post", false, function(data) {
                var getData = JSON.parse(data);
                if (callback) {
                    callback(getData);
                }
            });
        },
        //打开表单
        openWebForm: function(formid, keyvalue, title) {
            var url = "";
            //直接由按钮是否是灰色的，来判断是查看还是编辑
            hasRight.bEdit += "";
            if (hasRight.bEdit !== "1") {
                url = "/Form/ValidForm/" + formid + "/view/" + keyvalue + "/";
            } else {
                url = "/Form/ValidForm/" + formid + "/edit/" + keyvalue + "/";
            }
            
            appPhysical.OpenWebView(url, title);
        },
        //新增一条记录
        addWebForm: function(formid) {
            var url = "/Form/AddForm/" + formid + "/";

            appPhysical.OpenWebView(url, "新增表单");
        },
        // 删除选中的表单
        deleteFormLists: function (keyword, keywordtype, lineRows, callback) {
            var that = this;
            var rows = [];

            lineRows.each(function() {
                var $this = $(this),
                id = $this.attr("data-id");
                
                var obj = {
                    "_state": "removed"
                };

                obj[optionDiv.htmlParams.idfield] = id;
                rows.push(obj);
            });

            if (rows.length == 0) {
                mui.alert("你没选中数据");
                return false;
            }
            
            var pack = {};
            pack[keyword] = {
                "KeyWordType": keywordtype || "BO"
            };

            pack[keyword].data = rows;
            var jdata = {
                formId: "",
                encode: "r4",
            };

            jdata.jsonData = JSON.stringify(pack);
            jdata.Params = Util.Base64Encode("");
            jdata.jsonData = Util.Base64Swhere(jdata.jsonData);

            that._ajax("/Form/SaveWebForm", jdata, "POST", false, function(data) {
                var getData = JSON.parse(data);
                if (getData.success) {
                    mui.toast("删除成功");
                    lineRows.remove();
                    if (callback) {
                        callback();
                    }
                } else {
                    var inputs = $("#" + optionDiv.htmlParams.gridid + " .mui-checkbox input:checked");
                    mui.alert(getData.message, function() {
                        inputs.prop("checked", false);
                        inputs.parent().toggleClass("checked");
                    });
                }
            });
        },
        // 加载窗体中表单列表
        loadMainFromLists: function(params, callback) {
            var that = this;

            params.select = params.select || config.select;
            params.KeyWord = params.KeyWord || config.KeyWord;
            params.KeyWordType = params.KeyWordType || config.KeyWordType;
            params.swhere = params.swhere || config.swhere;
            params.size = params.size || "0";
            params.index = params.index || "0";


            if (params.KeyWord == "") {
                mui.alert("第一个参数中KeyWord不能为空");
                return false;
            }
            
            that.gridPageLoad(params, function(data) {
                if (data.success) {
                    if(callback) {
                        callback(data.data.value);
                    }
                } else {
                    mui.alert(data.message);
                    return false;
                }
            });
        },
        // FormLists 的模板
        mainFormListTemp: function(data, htmlparams) {
            var html = '', item, that = this;

            var title, left, center, right, tag;

            data.sort(function(a, b) {
                return new Date(b.UpdDate).getTime() - new Date(a.UpdDate).getTime();
            });

            for(var i = 0; i < data.length; i++) {
                item = data[i];

                title = that.getTypeResult(htmlparams, item, "title");
                left =  that.getTypeResult(htmlparams, item, "left");
                right =  that.getTypeResult(htmlparams, item, "right");
                center =  that.getTypeResult(htmlparams, item, "center");
                tag =  that.getTypeResult(htmlparams, item, "tag");

                html += '<li data-id="'+ item.Id +'" data-title="'+ title +'" class="mui-table-view-cell">' +
                    '<div class="mui-slider-right mui-delete mui-disabled">' +
                    '<a class="mui-btn mui-btn-red">删除</a>' +
                    '</div>' +
                    '<div class="mui-slider-handle">' +
                    '<div class="mui-win-form text-row">' +
                    '<div class="mui-media-object mui-pull-left mui-checkbox">' +
                    '<input class="hide" name="checkbox" type="checkbox">' +
                    '</div>' +
                    '<div class="mui-media-body">' +
                    '<p class="mui-ellipsis list-title">' +
                    '<span>'+ title +'</span>' +
                    '</p>' +
                    '<div class="list-units">' +
                    '<div class="list-unit">'+ left +'</div>' +
                    '<div class="list-unit">'+ center +'</div>' +
                    '<div class="list-unit">'+ right +'</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="mui-tag '+ tag.tagColor +'">' +
                    '<span>'+ tag.result +'</span>' +
                    '</div>' +
                    '</div> ' +
                    '</div>' +
                    '</li>';
            }
            var htmlDomObj = $(html);
            var content = $("#" + optionDiv.htmlParams.gridid);
            content.empty();
            content.append( htmlDomObj );

            // 打开表单的操作
            htmlDomObj.find(".mui-media-body").on("tap", function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (hasRight.bView != "1") {
                    mui.alert("你没有权限查看");
                    return false;
                }

                var $this = $(this);
                var row = $this.closest(".mui-table-view-cell");
                var keyvalue = row.attr("data-id");
                var title = row.attr("data-title");
                var formid = OpenFormId;

                if (isDelete) {
                    row.find(".mui-checkbox").toggleClass("checked");
                    if (row.find(".mui-checkbox").hasClass("checked")) {
                        row.find(".mui-checkbox input").prop("checked", true);    
                    } else {
                        row.find(".mui-checkbox input").prop("checked", false);
                    }
                } else {
                    that.openWebForm(formid, keyvalue, title);
                }
            });

            // 行删除
            htmlDomObj.find(".mui-delete").on("tap", function(e) {
                e.preventDefault();
                e.stopPropagation();
                var $this = $(this);
                var rows = $this.parent();

                mui.confirm("确认删除?", "确认删除",["否", "是"], function(e) {
                    if (e.index == 1) {
                        that.deleteFormLists(optionDiv.dataParams.KeyWord, "BO", rows, function() {
                            rows.remove();
                        });
                    }
                });
            });
        },
        // 搜索方法
        loadMain: function( dataParams, callback, type) {
            var searchKey = $("#win_form_search").val();
            var obj = $.extend({}, dataParams);
            var that = this;

            if (searchKey && searchKey != "") {
                obj.swhere += " and "+ optionDiv.searchField +" like '%" + searchKey + "%'";
            }

            that.loadMainFromLists(obj, function(data) {
                var getData = [];
                if (!data) {
                    mui.toast('暂时没有数据');
                } else {
                    getData = JSON.parse(data);
                }

                if (callback) {
                    callback(getData);
                }
            });
        },
        // 初始化加载信息
        init: function(options, callback) {
            var that = this;

            mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						callback: function () {
                            that.load(function () {
                                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                            });
                        }
					},
					up: {
						contentrefresh: '',
						callback: function () {
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        }
					}
				}
			});

            optionDiv = options;
            
            //IOS下拉时触发
            PowerM3AppCallBack.loadpage = that.load;
            //android下拉时触发
            AndroidLoadPage = that.load;

            that.load();

            // 加载静态UI事件
            that.UIInit();

            // 过实施人员自定义了代码 则执行
            if (callback) {
                callback(that, optionDiv,formConfig, config, hasRight, isDelete);
            }
        },
        UIInit: function() {
            var that = this;

            // 执行搜索
            $("#win_form_search").on("change", function() {
                var $this = $(this);
                var dataParams = $.extend({},optionDiv.dataParams);
                that.loadMain(dataParams, function(data) {
                    var getData = [];
                    if (!data) {
                        mui.toast('暂时没有数据');
                    } else {
                        getData = data;
                    }
                    that.mainFormListTemp(getData, optionDiv.htmlParams);
                    mui.toast("加载完成");
                });
            });
            $(document.body).on("keydown", function(e) {
                if (e.keyCode == 13) {
                    $("#win_form_search").blur();
                }
            });


            // 新增表单
            $("#win_add_from").on("tap", function() {
                if (!hasRight.bAdd) {
                    mui.alert("你没有添加权限");
                    return false;
                }

                that.addWebForm(OpenFormId);
            });
            // 删除面板的显示
            $("#win_show_action_block").on("tap", function() {
                var $this = $(this);
                var parent = $this.parent();

                isDelete = true;
                parent.addClass("hide").removeClass("show");
                parent.next().addClass("show").removeClass("hide");

                $("#" + optionDiv.htmlParams.gridid + " .mui-checkbox input").removeClass("hide");
            });

            // 删除面板隐藏  返回
            $("#win_hide_action_block").on("tap", function() {
                var $this = $(this);
                var parent = $this.parent();

                isDelete = false;
                parent.addClass("hide").removeClass("show");
                parent.prev().addClass("show").removeClass("hide");
                $("#" + optionDiv.htmlParams.gridid + " .mui-checkbox input")
                    .addClass("hide").prop("checked", false);
            });
            // 执行删除操作
            $("#win_delete_form").on("tap", function() {
                var $this = $(this);
                var parent = $this.parent();

                var inputs = $("#" + optionDiv.htmlParams.gridid + " .mui-checkbox input:checked");
                var DomRows = inputs.closest(".mui-table-view-cell");

                mui.confirm("确认删除?", "确认删除",["否", "是"], function(e) {
                    if (e.index == 1) {
                        that.deleteFormLists(optionDiv.dataParams.KeyWord, "BO", DomRows, function() {
                            isDelete = false;
                            parent.addClass("hide").removeClass("show");
                            parent.prev().addClass("show").removeClass("hide");
        
                            $("#" + optionDiv.htmlParams.gridid + " .mui-checkbox input").prop("checked", false).addClass("hide");
                        });
                    }
                });
            });
        },
        load: function(callback) {
            var that = this;
            
            //加载信息
            that.loadMain(optionDiv.dataParams, function(data) {
                var getData = [];
                if (!data) {
                    mui.toast('暂时没有数据');
                } else {
                    getData = data;
                }

                that.mainFormListTemp(getData, optionDiv.htmlParams);

                if (callback) {
                    callback();
                }
            });
        }
    };
}