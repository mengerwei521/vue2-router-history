import Vue from 'vue';
export declare class routerHistory {
  constructor(options: Object);
  /**
   * 初始化 
   */
  static init();

  /**
   * @param value  路由名
   * @desc 暂存要返回的路由[一定得是push路由数组中的]
   */
  static setBackRoute(value:string);

  /**
   * @desc 跳转到要返回的路由 [调用该方法前，必须之前页面调用过setBackRoute方法]
   */
   static JumpBackRoute();

   /**
    * 清空路由跳转
    * @param {*} value 路由名
    * @param {*} query 路由参数
    */
   static reLaunchRoute( value:string, query ?:Object);
   

}
declare module 'vue/types/vue'{
  interface Vue {
    $routerHistory: routerHistory<any>;
  }
}