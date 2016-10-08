# paginate
基于 vue.js 2.x 的翻页组件

### 特色功能
ajax 翻页 URL 同步更新，支持浏览器前进，后退按钮

### 用法

引用所需的 .js 文件

```html
<script type="text/javascript" src="./vue.min.js"></script>
<script type="text/javascript" src="./paginate.js"></script>
```

html 代码
```html
<div id="example">
    <paginate
        :last-page="lastPage"
        :current-page="currentPage"
        @turn="turn"
    ></paginate>
</div>
```

新建 vue.js 对象，并在对象里注册 paginate 组件

```javascript
var vm = new Vue({
    el: '#example',
    components: {
        paginate
    },
    data: {
        lastPage: 20,
        currentPage: 1
    },
    methods: {
        turn: function (page) {
            this.currentPage = page;
        }
    }
});
```

### API

![图示](https://raw.githubusercontent.com/pureghost/paginate/master/demo/1.png "图示")

- *side*: 中央显示区域边缘数量 (默认值: 1)
- *center-side*: 边缘数量 (默认值: 4)
- *prev-text*: 上一页文字显示 (默认值: «)
- *next-text*: 下一页文字显示 (默认值: »)
- *current-page*: 当前页 (必须)
- *last-page*: 总页数 (必须)
- *page-name*: URL 中页号变量名 (默认值: page)
- *url-sync*: 是否开启 URL 翻页同步更新 (默认值: true)