function WorkFlowCommon () {
  return {
    getQuery: function () {
      var queryStr = window.location.search.substr(1);
      var queryArr =queryStr.split('&');
      var query = {};
      queryArr.forEach(function (item) {
          var itemQuery = item.split('=');
          query[itemQuery[0]] = itemQuery[1];
      });
      return query;
    },
    getAPIMessage: function (params, callback, fail) {
      $.ajax({
          url: '/API/APIMessage',
          type: 'POST',
          data: params,
          dataType: 'json',
          success: function (res) {
              if (res.success) {
                callback && callback(res.data);
              } else {
                fail && fail(res.message);
              }
          }
      });
    },
    getAPIMessages: function (params, callback, fail) {
      $.ajax({
          url: '/API/APIMessages',
          type: 'POST',
          data: params,
          dataType: 'json',
          success: function (res) {
              if (res.success) {
                callback && callback(res.data);
              } else {
                fail && fail(res.message);
              }
          }
      });
    },
    showLoading: function (title) {
      var Etitle = title || '加载中...';
      var html = '';
      var topDocument = $(top.document.body);
      var hasLoading = topDocument.find(".mui-loading-content");

      if (hasLoading.size() > 0) {
        return false
      } else {
        html = '<div class="mui-loading-content">' +
          '<div class="mui-loading-content-wrap">' +
          '<div class="mui-loading-modal"></div>' +
          '<div class="mui-loading-main">' +
          '<h3 class="title">' + Etitle + '</h3>' +
          '<div class="loading-wrap">' +
          '<img src="/Apps/appWorkFlows/common/img/loading.gif" alt="loading">' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';

        topDocument.append(html);
      }
    },
    hideLoading: function() {
      var topDocument = $(top.document.body);
      var Loading = topDocument.find(".mui-loading-content");

      Loading.remove();
    },
    createUrl: function (baseUrl, query) {
      var url = baseUrl;
      if (query) {
        var keys = Object.keys(query);
        keys.forEach(function (item, index) {
          if (index == 0) {
            url += "?" + item + "=" + query[item];
          } else {
            url += "&" + item + "=" + query[item];
          }
        });
        return url;
      } else {
        return url;
      }
    },
    showToast: function (txt, callback) {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      mui.toast(txt);
      this.timer = setTimeout(function () {
        callback && callback();
      }, 2000);
    }
  }
}