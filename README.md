# wx-viewpager
微信小程序的viewpager

@[TOC]
# 微信小程序实现类似Android原生ViewPager的功能

## 先直接来看下效果图![9edfe25b51daec2d8846b39336e1265c.gif](en-resource://database/973:1)

## 再来说说我们要实现的功能
> * 类似tabbar的标题栏，还得支持滑动模式（scrollable）和固定模式（fixed）
> * tab item可点击并实现tabbar下的容器布局可跟随点击滑动
> * 不同tab item下的容器布局可以实现不同的业务逻辑（demo是加载不同的url）
> * 滑动容器布局tabbar跟着滑动

接下来我们就按照这些需求来进行开发

## 上代码
### 一.先实现可切换模式的tabbar
#### 1.创建小程序项目，可以在pages同级目录下创建组件文件夹components，
> 非固定，根据自己项目情况自行修改

#### 2.创建新组件viewpager
> 在撸代码前再梳理一下需求需要用到的控件
> ① 实现tabbar模式切换scrollable和fixed，我这里暂且在scrollable模式下使用的scroll-view控件，fixed模式下直接view+flex布局，用wx:if来完成区分，且tab-item可点击，点击后样式改变
> ②tabbar的标题可根据属性自定义
> ③可滑动容器布局我使用的是swiper+swiper-item
> 接下来我们就开始完成组件布局

##### viewpager.js
> 自定义tab标题的属性（tabs）和自定义显示模式的属性（mode）
```js
    /**
     * 组件的属性列表
     */
    properties: {
        mode: {
            type: String,
            value: "fixed"
        },
        tabs: {
            type: Array,
            value: []
        }
    },
```
> 为了实现点击标题可以进行切换tab的样式，我这里使用了一个新字段currentIndex，以及一个bindtap监听进行切换选中状态
```js
  /**
   * 组件的初始数据
   */
  data: {
      currentIndex: 0
  },
  
  
    /**
     * 组件的方法列表
     */
    methods: {
        onSelected: function (res) {
            var selectedIndex = Number(res.currentTarget.dataset.index);
            if (this.data.currentIndex == selectedIndex)
                return;
            this.setData({
                currentIndex: selectedIndex
            });
        },
     }
```

##### viewpager.wxml
```xml
<scroll-view wx:if="{{mode == 'scrollable'}}" scroll-x="true" class="h scroll-h " enable-flex="true">
    <view class="tab-item  scroll-tab-item {{currentIndex == index ?  'tab-active' : ''}}" wx:for="{{tabs}}"
        data-index="{{index}}" wx:key="index" bindtap="onSelected">{{item.title}} </view>
</scroll-view>
<view class="h fix-h" wx:else>
    <view class="tab-item fix-tab-item {{currentIndex == index ?  'tab-active' : ''}}" wx:for="{{tabs}}"
        data-index="{{index}}" wx:key="index" bindtap="onSelected">{{item.title}} </view>
</view>
```
**样式表我就不贴出来了，稍后直接上组件完整代码！**



**此时tabbar部分已经完成，看下效果图**
**mode="fixed"**
![f1cefdf6c3e8f31417ae7dacf068cda9.gif](en-resource://database/975:1)

**mode="scrollable"**
![2cef4c8f08a446a889230685df74f562.gif](en-resource://database/977:1)

##### 使用swiper+swiper-item实现可滑动容器布局
>组件既要实现左右滑动，还要实现tabbar选中跟随滑动改变选中样式，对swiper的监听bindchange来实现，而且为了保证swiper-item的数量跟tabbar保持一致，此处我们就使用了tab部分自定义的属性tabs的值

**修改viewpager.wxml布局,添加如下代码**
```xml
<swiper style="height: 100%;" bindchange="onSwiperChange" current="{{currentIndex}}">
    <block wx:for="{{tabs}}" wx:key="index" wx:key="index">
        <swiper-item style="height: 100%;background-color: brown;">
            <view >{{item.url}}</view>
        </swiper-item>
    </block>
</swiper>
```
**swiper滑动监听bindchange**
```js
methods: {
    
    ......
    
    onSwiperChange: function (res) {
            var selectedIndex = res.detail.current;
            if (this.data.currentIndex == selectedIndex)
                return;
            this.setData({
                currentIndex: selectedIndex
            });
        }
}
```
看效果图
![72ee72c3328c86c4f9d4f20de966afd7.gif](en-resource://database/979:1)

到此基本上功能已经实现的差不多了，但是其实在实际的应用过程中，做过Android开发的小伙伴肯定知道每一个tab绑定的是一个业务独立的fragment，但是我们这里没有fragment组件可用，而且为了业务独立，降低耦合度，我在demo中使用了**虚拟节点**+**业务组件**的模式来进行解耦，所有看到这里有细心的小伙伴就理解我在上面自定义viewpager的时候**为啥tabs属性的数据要传一个带url的对象数组了**，就是要曲线完成这部分功能，接下来我对这部分代码进行一下拆分讲解，有对小程序虚拟节点不了解的可以点击[【传送门】](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/generics.html)查看官方文档


### 二、实现业务组件解耦组件

#### 1.创建业务组件
> 组件名称自定义，demo中使用了fastmatch

##### fastmatch.js
> demo中只传递过来一个字段url，实际情况可根据项目自定义多少都可以
```js
// components/fastmatch/match.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        url:String
    },
    /**
     * 组件的初始数据
     */
    data: {
    },
    /**
     * 组件的方法列表
     */
    methods: {
    }
})

```
其他的json,wxml,wxss不做改变，这里就不列出了

#### 2.修改viewpager.json
> 为了使用虚拟节点 需要对这个配置文件里进行修改，添加配置
```json
    "componentGenerics": {
        "pager-item": true
    }
```

#### 3.修改viewpager.wxml
在使用该组件的时候需要修改viewpager.wxml,
```xml
<swiper style="height: 100%;" bindchange="onSwiperChange" current="{{currentIndex}}">
    <block wx:for="{{tabs}}" wx:key="index" wx:key="index">
        <swiper-item style="height: 100%;">
            <pager-item url="{{item.url}}"></pager-item>
        </swiper-item>
    </block>
</swiper>
```

**在使用viewpager组件的页面wxml布局文件中还需要添加一个属性generic:pager-item="fastmatch"**
```xml
<viewpager tabs="{{tabs}}" mode="fixed" generic:pager-item="fastmatch">

</viewpager>
```
**在使用viewpager组件的页面配置json文件中，也需要将fastmatch组件添加进去**
```json
 "usingComponents": {
    "viewpager":"./viewpager",
    "fastmatch":"./fastmatch"
  }
```

这样至此整个业务组件就算完成了，个人认为这种虚拟节点的方式不算最优方式，如果有小伙伴有更好的方式欢迎交流学习一下。
有兴趣的小伙伴整个项目的代码片段[【点我获取】](https://developers.weixin.qq.com/s/tQctcUm277u0)
Github项目地址[【点我Star】](https://github.com/NeoPi/wx-viewpager)
