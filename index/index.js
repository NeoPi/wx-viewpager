const app = getApp()

Page({
  data: {
    tabs: [{
      title: "全部",
      url: "api.xxx.cox/all"
    }, {
      title: "癌症",
      url: "api.xxx.cox/ai"
    }, {
      title: "糖尿病",
      url: "api.xxx.cox/tang"
    }, {
      title: "海默症",
      url: "api.xxx.cox/mo"
    }]
  },
  onLoad() {
  },
})