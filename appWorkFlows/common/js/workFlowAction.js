// 流程打开的通用方法
function WorkFlowAction() {
  var flowCommon = new WorkFlowCommon();
  return {
    // 1.送审
    Active: function (query) {
      var baseURL = "/Apps/appWorkFlows/Active.html";
      var url = flowCommon.createUrl(baseURL, query);
      appPhysical.OpenWebView(url, "送审");
    },
    // 2.同意
    Agree: function (query) {
      var baseURL = "/Apps/appWorkFlows/Agree.html";
      var url = flowCommon.createUrl(baseURL, query);
      appPhysical.OpenWebView(url, "同意");
    },
    // 3.撤回 回收
    GetBack: function (query) {
      var baseURL = "/Apps/appWorkFlows/GetBack.html";
      var url = flowCommon.createUrl(baseURL, query);
      appPhysical.OpenWebView(url, "撤销流程");
    },
    // 4.委派
    Delegate: function (query) {
      var baseURL = "/Apps/appWorkFlows/Delegate.html";
      var url = flowCommon.createUrl(baseURL, query);
      appPhysical.OpenWebView(url, "委派");
    },
    // 5.委派处理
    Delegating: function (query) {
      var baseURL = "/Apps/appWorkFlows/Delegating.html";
      var url = flowCommon.createUrl(baseURL, query);
      appPhysical.OpenWebView(url, "委派处理");
    },
    // 6.监控
    Monitor: function (query) {
      var baseURL = "/Apps/appWorkFlows/Monitor.html";
      var url = flowCommon.createUrl(baseURL, query);
      appPhysical.OpenWebView(url, "监控");
    },
    // 7.监控历史
    MonitorHistory: function (query) {
      var baseURL = "/Apps/appWorkFlows/History.html";
      var url = flowCommon.createUrl(baseURL, query);
      appPhysical.OpenWebView(url, "监控历史");
    },
    // 8.驳回
    Return: function (query) {
      var baseURL = "/Apps/appWorkFlows/Return.html";
      var url = flowCommon.createUrl(baseURL, query);
      appPhysical.OpenWebView(url, "驳回");
    },
    // 9.终止
    Stop: function (query) {
      var baseURL = "/Apps/appWorkFlows/Stop.html";
      var url = flowCommon.createUrl(baseURL, query);
      appPhysical.OpenWebView(url, "终止");
    }
  }
};