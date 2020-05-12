//引入mockjs
import Mock from 'mockjs'
//延时200-600毫秒请求到数据
Mock.setup({
    timeout: '400-1000'
})
//使用mockjs模拟数据
Mock.mock('/api/order/getOrderList', {
	"code": 0,
	"data": {
		"page": 1,
		"pageSize": 10,
		"total": 11,
		"pages": 5,
		"list|5-10": [
			{
        "id|+1": 1,
				"contacts": '@cname',
				"orderName|2-20": '@ctitle',
				"orderTag|0-6": 0,
				"beginDate": '@date("yyyy-MM-dd HH:mm")',
				"createTime": '@date("yyyy-MM-dd HH:mm:ss")',
				"orderAddress": '@province' + '@city' + '@county',
				"orderAmount|1-1000.1-2": 1,
				"orderState|0-7": 1,
				"mobile": /^1[385][1-9]\d{8}/,
				"memo|0-10": '@cword'
			}
		]
	}
});
Mock.mock('/api/order/getOrderDetail', {
	"code": 0,
	"data": {
		"id|+1": 1,
		"contacts": '@cname',
		"orderName|2-20": '@ctitle',
		"orderTag|0-6": 0,
		"beginDate": '@date("yyyy-MM-dd HH:mm")',
		"createTime": '@date("yyyy-MM-dd HH:mm:ss")',
		"orderAddress": '@province' + '@city' + '@county',
		"orderAmount|1-1000.1-2": 1,
		"orderState|0-7": 1,
		"mobile": /^1[385][1-9]\d{8}/,
		"memo|0-10": '@cword'
	}
});
Mock.mock('/api/dictionary', {
	"code": 0,
	"data": {
		"orderTags": ['生日', '乔迁', '满月', '订婚', '结婚', '出嫁', '白事'],
		"orderStates": [
			{"name": '已下单', "color": 'danger'},
			{"name": '已接单', "color": 'success'},
			{"name": '已退回', "color": 'danger'},
			{"name": '已送达', "color": 'warning'},
			{"name": '待支付', "color": 'danger'},
			{"name": '已支付', "color": 'primary'},
			{"name": '转赊账', "color": 'primary'},
			{"name": '已归档', "color": 'default'}
		]
	}
});