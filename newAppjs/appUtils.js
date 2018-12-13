var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    },

    rc4: function (data) {
        var key = "PowerM3";
        var seq = Array(256);//int
        var das = Array(data.length);//code of data
        for (var i = 0; i < 256; i++)
            seq[i] = i;
        var j = 0;
        for (var i = 0; i < 256; i++) {
            var j = (j + seq[i] + key.charCodeAt(i % key.length)) % 256;
            var temp = seq[i];
            seq[i] = seq[j];
            seq[j] = temp;
        }
        for (var i = 0; i < data.length; i++)
            das[i] = data.charCodeAt(i);
        for (var x = 0; x < das.length; x++) {
            var i = (i + 1) % 256;
            var j = (j + seq[i]) % 256;
            var temp = seq[i];
            seq[i] = seq[j];
            seq[j] = temp;
            var k = (seq[i] + seq[j]) % 256;
            das[x] = String.fromCharCode(das[x] ^ seq[k]);
        }
        return das.join('');
    }
};

var Util = {
    //判断对象是否为数组
    isArray: function (source) {
        return '[object Array]' == Object.prototype.toString.call(source);
    },
    newGuid: function () {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    },
    //客户端Base64编码
    Base64Encode: function(str) {
        if (str == undefined || str.length == 0){
            return "";
        }
        return Base64.encode(str);
    },
    //客户端Base64解码
    Base64Decode: function(str) {
        if (str == undefined || str.length == 0){
            return "";
        }
        return Base64.decode(str);
    },
    Base64Swhere: function (str) {
        if (str == undefined || str.length == 0){
            return "";
        }
        return encodeURIComponent(Base64.rc4(str));
    },
    StrenCrypt: function (str) {
        if (str == undefined || str.length == 0) {
            return "";
        }
        return Base64.encode(Util.Base64Swhere(str));
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
    //获取子表上，行的标题数据
    getTableTypeResult: function (htmlparams, row, type) {
        var that = this;
        var result = "";

        if (htmlparams[type]) {
            if (htmlparams[type].value != "") {
                var format = htmlparams[type].format;
                var formatType = format;

                // 判断是否为number类型
                if (format.indexOf("n") > -1 || format.indexOf("c") > -1 || format.indexOf("p") > -1) {
                    formatType = "number";
                }

                // 判断是否为日期类型
                if (format.indexOf("yyyy") > -1) {
                    formatType = "datePicker";
                }

                // 判断是否为下拉框类型
                if (format == "combobox") {
                    formatType = "combobox";
                }

                switch (formatType) {
                    case 'combobox':
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
                        break;
                    case 'number':
                        var typeOf = typeof row[htmlparams[type].value];
                        var toFixed = htmlparams[type].toFixed;

                        if (typeOf == "number") {
                            result = row[htmlparams[type].value] + ''
                        } else {
                            result = new Number(row[htmlparams[type].value]);
                        }

                        if (toFixed) {
                            result = new Number(result).toFixed(toFixed);
                        } else {
                            result = new Number(result).toFixed(2);
                        }
                        break;
                    case 'datePicker':
                        result = that._formatDate(row[htmlparams[type].value], format);
                        break;
                    default:
                        result = row[htmlparams[type].value];    
                }
            }

            if (!result) {
                result = "暂无";
            } else {
                result = result.replace("null", "");
            }

            var name = htmlparams[type].name;

            switch (type) {
                case 'title':
                    return name ? '<span>' + name + ':' + result + '</span>' : '<span>' + result + '</span>';
                case 'left':
                    return name ? '<div class="list-unit mui-ellipsis">' + name + ':' + result + '</div>': '<div class="list-unit mui-ellipsis">' + result + '</div>';
                case 'right':
                    return name ? '<div class="list-unit mui-ellipsis">' + name + ':' + result + '</div>': '<div class="list-unit mui-ellipsis">' + result + '</div>';
                case 'center':
                    return name ? '<div class="list-unit mui-ellipsis">' + name + ':' + result + '</div>': '<div class="list-unit mui-ellipsis">' + result + '</div>';
                default:
                    return ''
            }
        } else {
            return result;
        }
    },
    // select封装 for显示
    formatSelectToView: function (keyword, key, id) {
        var result = id;
        var data = [];
        var thisSelect = {}

        // 如果在comboboxdata中没有找到 直接返回值
        if (!comboboxdata[keyword + "." + key]) {
            return result;
        }
        thisSelect = $.extend({}, comboboxdata[keyword + "." + key])
        data = thisSelect.Data;
        if (data && data.length != 0) {
            data = thisSelect.Data;
        } else {
            mui.alert("comboboxdata[" + keyword + "." + key + "]为空");
            return false;
        }

        var TextField = thisSelect.TextField;
        var ValueField = thisSelect.ValueField;

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (id == item[ValueField]) {
                result = item[TextField];
                break;
            }
        }

        return result;
    },
    // select封装 for保存
    formatSelectToSave: function (keyword, key, text) {
        var result = text;
        var data = [];
        var thisSelect = {};

        // 如果在comboboxdata中没有找到 直接返回值
        if (!comboboxdata[keyword + "." + key]) {
            return result;
        }
        thisSelect = $.extend({}, comboboxdata[keyword + "." + key])
        data = thisSelect.Data;
        if (data && data.length != 0) {
            data = thisSelect.Data;
        } else {
            mui.alert("comboboxdata[" + keyword + "." + key + "]为空");
            return false;
        }

        var TextField = thisSelect.TextField;
        var ValueField = thisSelect.ValueField;

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (text == item[TextField]) {
                result = item[ValueField];
                break;
            }
        }

        return result;
    },
    // 主子表数据显示 for显示
    fieldToView: function (dom, keyword, key, val) {
        var that = this;
        var value = val;
        if (dom.size() > 0) {
            // 日期类型
            if (dom.hasClass("btn-picker")) {
                var formatTime = dom.attr("data-format");
                dom.attr('data-value', val);
                value = that._formatDate(value, formatTime);
            }
            // 下拉框类型
            if (dom.hasClass("mui-select")) {
                value = that.formatSelectToView(keyword, key, value);
            }

            if (dom.hasClass('mui-rate')) {
                value = (Number(value) * 100 + '').toFixed(2);
            }

            // 数字类型
            var dataType = dom.attr("type");
            if (dataType == "number") {
                var numberToFixed = dom.attr('data-fix');
                if (numberToFixed) {
                    var ToFixed = new Number(numberToFixed);
                    value = new Number(value).toFixed(ToFixed);
                } else {
                    value = new Number(value).toFixed(2)
                }
            }
        }

        return value;
    },
    // 主子表数据显示 for保存
    fieldToSave: function (dom, keyword, key, val) {
        var that = this;
        var value = val;
        if (dom.size() > 0) {
            // 下拉框数据转换
            if (dom.hasClass("mui-select")) {
                value = that.formatSelectToSave(keyword, key, value);
            }

            // 税率类型数据转换
            if (dom.hasClass("mui-rate")) {
                value = Number(value.replace('%', ''));
                value = (value / 100) + "";
                value = value.toFixed(2);
            }

            // 如果是日期
            if (dom.hasClass("btn-picker")) {
                value = dom.attr('data-value');
            }
        }

        return value;
    }
};
