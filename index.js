import Loading from './lib/loading'
//要求1 路由列表的命名必须有name
class routerHistory {
  constructor(options) {
    this.router = options.router;
    this._historyList = []; //暂存push跳转的页面和首次进入的页面的仓库
    this.isPush = false; // 是不是push路由跳转
    this.isGo_num = 0; //是不是back / go(-x)回退
    this.back_route_name = ''; //返回的路由
    this.isConsole = options.isConsole || false;//是否打开console调试
    this.init()
  }
  /**
   * 初始化
   */
  init() {
    window.onbeforeunload = () => {
      this.setStoreHouse()
    }
    window.onload = () => {
      if (window.sessionStorage.getItem('_historyList')) {
        this._historyList = JSON.parse(window.sessionStorage.getItem('_historyList'))
      }
    }

    /**
     * @desc push跳转【压栈】
     */
    const pushRouter = this.router.push.bind(this.router)
    this.router.push = (location, onComplete, onAbort) => {
      this.isPush = true;
      return pushRouter(location, onComplete, onAbort);
    }
    /**
     * @desc back或者go(-x)跳转 出栈
     */
    const goRouter = this.router.go.bind(this.router)
    this.router.go = (value) => {
      console.log(value, 'goRouter')
      if (value < 0) {
        this.isGo_num = value
      }
      return goRouter(value);
    }
    /**
     * 路由全局后置守卫
     */
    this.router.afterEach((to, from) => {
      if (to.name !== from.name) {
        let name = from.name || ''
        if (this.isPush) {
          if (name) {
            this._historyList.push(name);
          }
          this.isPush = false;

          if (this.isConsole) {
            console.log('%c 所有push进入的路由↓', 'color:yellow;background:green;')
            console.log(this._historyList)
            console.log('%c 所有push进入的路由↑', 'color:yellow;background:green;')
          }

        }
        if (this._historyList.length > 0) {
          //如果回退层级过高，则不处理
          if (this._historyList.includes(to.name) && this.isGo_num < 0) {
            //代表单页面使用了 back() 或者 go(-x) 
            if (this._historyList.length >= Math.abs(this.isGo_num)) {

              if (this.isConsole) {
                console.log('%c back() 或者 go(-x) 被清除前的路由↓', 'color:yellow;background:green;')
                console.log(this._historyList, Math.abs(this.isGo_num))
                console.log('%c back() 或者 go(-x) 被清除前的路由↑', 'color:yellow;background:green;')
              }

              this._historyList.splice(this._historyList.length - Math.abs(this.isGo_num))

              if (this.isConsole) {
                console.log('%c back() 或者 go(-x) 被清除后的路由↓', 'color:yellow;background:green;')
                console.log(this._historyList)
                console.log('%c back() 或者 go(-x) 被清除后的路由↑', 'color:yellow;background:green;')
              }

            }
          }
        }
      }
      this.isGo_num = 0;
    })

  }
  /**
   * 设置仓库数据
   */
  setStoreHouse() {
    window.sessionStorage.setItem('_historyList', JSON.stringify(this._historyList))
  }
  /**
   * 暂存要返回的路由 一定是在_historyFileterList数组中的
   * @param {必填} value 路由名
   */
  setBackRoute(value) {
    this.back_route_name = value
  }
  /**
   * 跳转到要返回的路由 【没有多减1 是因为当前页面路由并未存储】
   *  @param {选填} route_name 路由名
   */
  JumpBackRoute(route_name) {
    if (route_name) {
      this.setBackRoute(route_name)
    }
    try {
      if (this.back_route_name) {
        let index = this._historyList.findIndex((item) => { return item == this.back_route_name })
        if (index == -1) {
          throw `${this.back_route_name}路由不存在`
        }
        let D_value = this._historyList.length - index;

        this.router.go(-`${D_value}`)

        this._historyList.splice(this._historyList.length - D_value);

        if (this.isConsole) {
          console.log('%c 调用JumpBackRoute（）后被清除后的路由↓', 'color:yellow;background:green;')
          console.log(this._historyList)
          console.log('%c 调用JumpBackRoute（）后被清除后的路由↑', 'color:yellow;background:green;')
        }

      }
    } catch (error) {
      console.log(error)

    }

  }
  /**
   * 清空路由跳转
   * @param {必填} value 路由名
   * @param {选填} query 路由参数
   */
  reLaunchRoute(value, query) {
    Loading(); //蒙层
    let D_value = this._historyList.length;
    if (D_value) {
      this.router.go(-`${D_value}`)
    }
    if (this.isConsole) {
      console.log('%c back() 或者 go(-x) 返回层级↓', 'color:yellow;background:green;')
      console.log(D_value)
      console.log('%c back() 或者 go(-x) 返回层级↑', 'color:yellow;background:green;')
    }
    setTimeout((
    ) => {
      this.router.replace({
        name: value,
        query: query || {}
      })
      this._historyList = []
      Loading.clear();//关闭蒙层
    }, 500)


  }

}

export default {
  install(Vue, options) {
    let vueRouterHistory = new routerHistory(options)
    Vue.prototype.$routerHistory = vueRouterHistory
  }
}