import axios from 'axios'
// 响应时间
axios.defaults.timeout = 10000
// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 配置接口地址
axios.defaults.baseURL = '/api'

axios.defaults.withCredentials = true

// 请求拦截器
axios.interceptors.request.use(
	config => {
		return config
	},
	err => {
		return Promise.reject(err)
	}
)
// 响应拦截器
axios.interceptors.response.use(
	res => {
		return res.data
	},
	err => {
		return Promise.reject(err)
	}
)

export default {...axios}
