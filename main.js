import Vue from 'vue'
import App from './App'
// 1. 导入 store 的实例对象
import store from './store/store.js'

Vue.config.productionTip = false

// 按需导入 $http 对象
import {
	$http
} from '@escook/request-miniprogram'

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// $http.baseUrl = 'https://www.uinav.com/api/public/v1'
$http.baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'

//请求拦截器请求开始之前做一些事情
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...',
		mask: true
	});
	// 只有在登录之后才允许调用支付相关的接口，所以必须为有权限的接口添加身份认证的请求头字段 判断请求的是否为有权限的 API 接口
	if (options.url.indexOf('/my/') !== -1) {
		// 为请求头添加身份认证字段
		options.header = {
			// 字段的值可以直接从 vuex 中进行获取
			Authorization: store.state.m_user.token,
		}
	}
}

// 响应拦截器请求完成之后做一些事情
$http.afterRequest = function() {
	uni.hideLoading()
}
// 封装一个消息弹窗
uni.$showMsg = function(params) {
	uni.showToast({
		title: "数据请求失败",
		duration: 1500,
		icon: "none",
		mask: true,
		...params,
	})
}

App.mpType = 'app'

const app = new Vue({
	...App,
	// 2. 将 store 挂载到 Vue 实例上
	store,
})
app.$mount()
