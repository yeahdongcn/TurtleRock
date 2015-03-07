// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

// 计算总资产
AV.Cloud.define("calculateZZC", function(request, response) {
  response.success("ZZC");
});