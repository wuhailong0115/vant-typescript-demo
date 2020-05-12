<template>
	<div>
		<van-button loading type="info" loading-text="加food..." />
	</div>
</template>

<script lang="ts">
// @ is an alias to /src
const ARR: Array<any> = [
	{
		id: 1,
		orderName: '老3生日',
		orderTag: 0,
		beginDate: '2019-11-11',
		orderAddress: '上海市浦东新区',
		orderAmount: 372.5,
		orderState: 1,
		contacts: '吴XX',
		mobile: '13333333333',
		memo: '备注'
	}
]
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class OrderIndex extends Vue {
	// data
	private orderList: Array<any> = []
	private orderTags: Array<string> = []
	private orderStates: Array<string> = []
	private loading: boolean = false
	private finished: boolean = false
	private refreshing: boolean = false
	private active: number = 1
	// created
	private created() {
		this.refreshing = false
	}
	
	// methods
	// 获取订单列表
	// 下拉刷新
}
</script>
<style lang="scss">
</style>
