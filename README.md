# 更新说明

2.0.0 更新，在每次 afterEach 后 isGo_num 清零

# 安装

npm i vue2-router-history

# 使用

import routerHistory from 'vue2-router-history'

// router 指是是 vue-router isConsole：是否打开 console 调试

Vue.use(routerHistory, { router: router, isConsole: true });

# 插件说明

vue2-router-history 插件是在 vue2.x 和 vue-router3.x 版本下对 push 跳转的路由进行记录的

## 插件使用

在 H5 项目中

1,我们常常遇到 A > B > C > D , F > A > B > C > D [>代表 push 跳转],在 D 页面返回到 A/F 页面,当在 A/F 回退不想出现 C，B,等页面，就需要 go(-x),对 x 进行计算;针对计算的烦恼，出版了该插件【即对 x 的计算】。即 在 A/F 页面跳转时调用 setBackRoute(该页面路由名) API 缓存(该页面路由名)，在 D 页面跳转是使用 JumpBackRoute() API 就会自动计算出 X 值，该 API 也可以进行定向跳转 JumpBackRoute(定向路由名) 定向路由名如 B 页面 [定向路由名一定得是历史 push 过的路由]

2,在开发微信小程序中用到 wx.reLaunch [关闭所有页面，打开到应用内的某个页面] , 对此,插件 reLaunchRoute API 进行针对处理即 go(-x) --> replace() x 为 push 跳转记录的长度。

## 插件 API 描述

### 1,setBackRoute API 该 API 是为了记录本页面的路由名，当调用 JumpBackRoute() 进行 go(-x)的计算

this.$routerHistory.setBackRoute(route_name:路由名)

使用说明：调用该 API 的跳转一定是 push 跳转， API 参数：必填 该 API 只有和 JumpBackRoute API 共用才能生效

使用示例: this.$routerHistory.setBackRoute('A');

### 2,JumpBackRoute API 该 API 是针对 go(-x)计算的

this.$routerHistory.setBackRoute(route_name?：路由名)

使用说明：当我们需要回退之前 push 跳转的页面，在跳转处调用该 api，该 API 参数：route_name 是可选填的，当参数不存在时，则必须在 push 跳转页面列表中有一个使用了 setBackRoute API ，否则该 API 不生效，当参数存在时，该参数必须是 push 跳转页面列表的某个页面。

使用实例：

没有参数时： this.$routerHistory.setBackRoute('A'); --- > this.$routerHistory.JumpBackRoute();

有参数时： this.$routerHistory.JumpBackRoute('B');

### 3,reLaunchRoute API

this.$routerHistory.reLaunchRoute(route_name：路由名,query:路由参数)

使用说明：当我们需要清除所有 push 跳转的页面[go(-x)]，然后打开一个页面【replace】 API 参数：必填 。

使用实例： this.$routerHistory.reLaunchRoute('A') / this.$routerHistory.reLaunchRoute('A',query);

## 可能出现的问题说明

1，在微信开发者工具打开的网页，可能会导致插件 go(-x)的 X 计算出错，因为插件采用 sessionStorage 缓存 push 的路由，在工具除非清除缓存，否则多次复制相同网址加载会导致 push 记录过多。[目前再真机没有发现该问题]

2，对于特殊跳转问题: A > B > C > D > B > F > E [>代表 push 跳转]， 在 B 页面调用 setBackRoute API 在 E 页面调用 JumpBackRoute API，则返回第一个 B 页面，

3,对于 go(n) n>=0 不做处理

## 更新

### 已解决 1.1.0 调用 this.$routerHistory.reLaunchRoute('A') go(0) 问题

### 已解决 1.1.1 移动端物理回退，乱跳的问题

手机物理回退发现的问题【安卓 or 苹果】方法：路由跳转或 this.isGo_num 赋值为 null
使用物理回退， this.isGo_num 变量会莫名变化【比如默认是 null，使用物理回退变成-2】目前不知道原因
