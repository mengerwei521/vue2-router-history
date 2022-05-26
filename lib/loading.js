import Vue from 'vue';
var _default = Vue.component('Loading', {
  functional: true,//无状态 (没有响应式数据)
  props: {},
  data: function data() {
    return {}
  },
  render(h) {
    return h('div', {
      'class': 'loading',
      'style': {
        position: 'fixed',
        top: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#fff',
        zIndex: "99999"
      }
    }

    )
  }
})
var queue = []; //创建loading数组个数
function createInstance() {

  queue = queue.filter(function (item) {
    return !item.$el.parentNode || document.body.contains(item.$el);
  });

  if (!queue.length) {
    var loading = new (Vue.extend(_default))({
      el: document.createElement('div')
    });
    document.body.appendChild(loading.$el) //在body子级添加
    queue.push(loading);
  }
  console.log(queue, 'queue')
  return queue[queue.length - 1];
}
function Loading() {
  var loading = createInstance();
  loading.clear = function () {
    //parentNode 以 Node 对象的形式返回指定节点的父节点
    if (loading.$el.parentNode) {
      loading.$el.parentNode.removeChild(loading.$el); //删除组件
      loading.$destroy(); //销毁实例
    }
  }
  return loading;
}
Loading.clear = function () {
  queue[0].clear();
  queue = []
};

export default Loading;