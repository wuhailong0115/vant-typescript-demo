<template>
	<div class="order">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-empty description="描述文字" v-if="finished&&orderList.length<=0"/>
		  <van-list
		    v-model="loading"
		    :finished="finished"
		    finished-text="没有更多了"
		    @load="getOrderList"
				v-else
		  >
				<van-panel v-for="item in orderList" :key="item.id" class="order-item">
					<div slot="header" class="flex-container order-item__header">
						<p class="x-auto textcut">{{item.orderName}}</p>
						<van-tag color="#7232dd" class="m-r-10">{{orderTags[item.orderTag]}}</van-tag>
						<van-tag :type="orderStates[item.orderState].color" plain>{{orderStates[item.orderState].name}}</van-tag>
					</div>
					<div class="order-item__main" @click="$router.push({path:'/order/detail', query: {id: item.id}})">
						<div class="flex-container">
							<p class="w-60">{{item.contacts}}</p>
							<p class="x-auto">{{item.mobile}}</p>
						</div>
						<p>地址：{{item.orderAddress}}</p>
						<p>送达时间：{{item.beginDate}}</p>
						<p>下单时间：{{item.createTime}}</p>
						<p>订单金额(以实际为准)：{{item.orderAmount}}</p>
						<p v-if="item.memo">备注：{{item.memo}}</p>
						<van-icon name="arrow" class="order-item__main-icon"/>
					</div>
					<div slot="footer" class="flex-container end">
						<van-button size="small" type="primary">按钮</van-button>
					</div>
				</van-panel>
		  </van-list>
		</van-pull-refresh>
	</div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class OrderIndex extends Vue {
	// data
	private orderList: Array<any> = []
	private orderTags: Array<string> = this.$store.state.DICTIONARY.orderTags
	private orderStates: Array<object> = this.$store.state.DICTIONARY.orderStates
	private loading: boolean = false
	private finished: boolean = false
	private refreshing: boolean = false
	
	// created
	
	// methods
	// 获取订单列表
	private async getOrderList() {
		if (this.refreshing) {
			this.orderList = []
			this.refreshing = false
		}
		const res: any = await this.$http.post(this.$urls.orderList)
		this.loading = false
		if (res.code == 0) {
			this.orderList = this.orderList.concat(res.data.list)
			if (this.orderList.length >= 40) {
				this.finished = true
			}
			if (this.orderList.length <= 0) {
				this.finished = true
			}
		}
	}
	// 下拉刷新
	private onRefresh() {
		// 清空列表数据
		this.finished = false
		// 将 loading 设置为 true，表示处于加载状态
		this.loading = true
		this.getOrderList()
	}
}
</script>
<style lang="scss">
.order {
	height: 100vh;
	box-sizing: border-box;
	overflow: auto;
	padding-bottom: 51px;
}
.order-item {
	padding: 0 10px;
	margin-bottom: 5px;
	.order-item__header {
		padding: 10px 0px;
		>p {
			font-size: 16px;
			width: 10px;
			margin-right: 10px;
		}
		&:after {
			position: absolute;
			box-sizing: border-box;
			content: ' ';
			pointer-events: none;
			width: 100%;
			right: 0;
			bottom: 0;
			border-bottom: 1px solid #ebedf0;
			transform: scaleY(0.5);
		}
	}
	.van-panel__footer {
		padding: 10px 0;
	}
	.order-item__main {
		line-height: 24px;
		padding: 10px 20px 10px 0px;
		color: #999;
		position: relative;
		.order-item__main-icon {
			position: absolute;
			right: 0px;
			top: 50%;
			font-size: 20px;
			transform: translateY(-50%);
		}
	}
}
</style>
