// index/viewpager.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        mode: {
            type: String,
            value: "fixed"
        },
        tabs: {
            type: Array,
            value: [{
                title: "你的",
                url: ""
            }, {
                title: "我的",
                url: ""
            }, {
                title: "大家的",
                url: ""
            }]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentIndex: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onSelected: function (res) {
            var selectedIndex = Number(res.currentTarget.dataset.index);
            if (this.data.currentIndex == selectedIndex)
                return;
            this.setData({
                currentIndex: selectedIndex
            });
        },
        onSwiperChange: function (res) {
            var selectedIndex = res.detail.current;
            if (this.data.currentIndex == selectedIndex)
                return;
            this.setData({
                currentIndex: selectedIndex
            });
        }
    }
})