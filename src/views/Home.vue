<template>
  <div class="home">
		<router-view></router-view>
		<van-tabbar v-model="active" v-if="isFoot">
		  <van-tabbar-item name="/food" icon="home-o" to="/food">首页</van-tabbar-item>
		  <van-tabbar-item name="/order" icon="search" to="/order">订单管理</van-tabbar-item>
		  <van-tabbar-item name="/user" icon="friends-o" to="/user">个人中心</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue, Watch } from 'vue-property-decorator';
const routes: Array<string> = ['/food', '/order', '/user']

@Component
export default class Home extends Vue {
	private active: any = '/food'
	private isFoot: boolean = true
	
	// created
	private created() {
		this.isFoot = this.judgeFoot(this.$route.path)
	}
	
	@Watch('$route')
	private onChangeValue(newVal: any) {
		this.isFoot = this.judgeFoot(newVal.path)
	}
	
	// methods
	// 判断是否显示footer
	private judgeFoot(path: string): boolean {
		if (routes.includes(path)) {
			this.active = path
			return true
		}
		return false
	}
}
</script>
<style lang="scss">
	.home {
		height: 100%;
		width: 100%;
	}
</style>
