<template>
	<van-skeleton :row="10" :loading="loading">
	  <div class="order-detail">
			<div class="order-detail__info">
				<div class="flex-container">
					<p class="w-60">{{orderDetail.contacts}}</p>
					<p class="x-auto">{{orderDetail.mobile}}</p>
				</div>
				<p>地址：{{orderDetail.orderAddress}}</p>
				<p>送达时间：{{orderDetail.beginDate}}</p>
				<p>下单时间：{{orderDetail.createTime}}</p>
				<p>订单金额(以实际为准)：{{orderDetail.orderAmount}}</p>
				<p v-if="orderDetail.memo">备注：{{orderDetail.memo}}</p>
			</div>
		</div>
	</van-skeleton>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class OrderIndex extends Vue {
	// data
	private orderDetail: object = {}
	private orderTags: Array<string> = this.$store.state.DICTIONARY.orderTags
	private orderStates: Array<object> = this.$store.state.DICTIONARY.orderStates
	private loading: boolean = true
	
	// created
	private created() {
		this.getOrderDetail(this.$route.query.id)
	}
	
	// methods
	// 获取订单详情
	private async getOrderDetail(id: any) {
		const res: any = await this.$http.post(this.$urls.orderDetail)
		if (res.code == 0) {
			this.loading = false
			this.orderDetail = res.data
		}
	}
}
</script>
<style lang="scss">
	.order-detail {
		padding: 10px;
		line-height: 24px;
	}
</style>
