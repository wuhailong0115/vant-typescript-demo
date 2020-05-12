<template>
	<el-container class="main">
		<!-- 侧边栏 -->
		<el-aside :class="{slideHide:isCollapse}" width="220px">
			<div class="flex-container c-fff h-60">
				<i :class="isCollapse ? 'iconfont icon-dianxin1 f-36':'iconfont icon-dianxin f-36'"></i>
			</div>
			<el-menu class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
			 :collapse="isCollapse" :unique-opened=true :default-active="$route.path">
				<template v-for="(item,index) in routers" v-if="!item.hidden">
					<!-- 有子菜单 -->
					<el-submenu :index="index+''" v-if="!item.sigleMenu">
						<template slot="title"><i class="iconfont" :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
						<el-menu-item v-for="child,index in item.children" :index="child.path" :key="index" v-if="!child.hidden" @click="()=>$router.push(child.path)">{{child.name}}</el-menu-item>
					</el-submenu>
					<!-- 主菜单 -->
					<el-menu-item v-if="item.sigleMenu&&item.children.length>0" :index="item.children[0].path" @click="()=>$router.push(item.children[0].path)">
						<i class="iconfont" :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>
					</el-menu-item>
				</template>
			</el-menu>
		</el-aside>
		<!-- 主要内容部分 -->
		<el-container class="page-right-first-container">
			<!-- 主要头部  -->
			<el-header>
				<el-row class="header flex-container">
					<div class="tools" @click.prevent="collapse">
						<i class="fa fa-align-justify"></i>
					</div>
					<div class="x-auto"></div>
					<el-button type="warning" size="mini" @click="openNew">大屏</el-button>
					<span class="f-15 m-l-20">欢迎登录：</span>
					<div class="w-200">
						<el-select v-model="roleId" @change="changeRole">
							<el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
						</el-select>
					</div>
					<el-dropdown trigger="hover" class="userinfo m-l-20" style="float: right;">
						<span class="el-dropdown-link userinfo-inner">个人中心：{{userName}} <i class="iconfont icon-xia"></i></span>
						<el-dropdown-menu slot="dropdown" style="padding: 12px 20px;">
							<el-dropdown-item @click.native="showQRCode">个人二维码</el-dropdown-item>
							<el-dropdown-item>帮助中心</el-dropdown-item>
							<el-dropdown-item @click.native="changePw">修改密码</el-dropdown-item>
							<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-row>
			</el-header>
			<el-main>
				<div class="flex-container column" style="height:100%">
					<div class="c-start">
						<el-breadcrumb separator="/" class="p-b-20">
							<el-breadcrumb-item v-for="item,index in $route.matched" :key="index">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</div>
					<transition name="fade" mode="out-in">
						<router-view class="x-auto" style="width:100%"></router-view>
					</transition>
				</div>
			</el-main>
			<el-dialog title="修改" :visible.sync="changePwFormVisible">
				<el-form :model="editForm" :label-position="labelPosition" label-width="100px" :rules="editFormRules" ref="editForm">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="登录名" prop="loginName">
								<el-input v-model="editForm.loginName" maxlength="50" disabled="disabled" :title="editForm.loginName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="原密码" prop="password">
								<el-input v-model="editForm.password" type="password" maxlength="50" :title="editForm.password"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="新密码" prop="newPassword">
								<el-input v-model="editForm.newPassword" type="password" maxlength="50" :title="editForm.newPassword"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="密码强度" prop="degree">
								<span v-model="editForm.degree" class="el-input__inner degree" aria-readonly="true">
									<em :class="{strength_L:idShow_L}">弱</em><em :class="{strength_M:idShow_M}">中</em><em :class="{strength_S:idShow_S}">强</em>
								</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="确认密码" prop="surePsd">
								<el-input v-model="editForm.surePsd" type="password" maxlength="50" :title="editForm.surePsd"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click.native="editSubmit('editForm')" size="medium">保存</el-button>
					<el-button type="default" @click.native="editClose('editForm')" size="medium">关闭</el-button>
				</div>
			</el-dialog>
			<el-dialog title="个人二维码" :visible.sync="showQRCodeVisible">
				<div id="qrcode" ref="qrcode" align="center"></div>
			</el-dialog>
			<!-- 主要底部-->
			<el-footer>中国电信股份有限公司上海公司</el-footer>
		</el-container>
	</el-container>
</template>

<script>
	const logout = "/omp/system/system_spring_security_logout"
	const showChangePassword = "/omp/system/showChangePassword"
	import {
		mapState
	} from 'vuex'
	import QRcode from 'qrcodejs2'

	import axios from 'axios';
	export default {
		data() {
			let validatePass = (rule, value, callback) => {
				let level = 0;
				let modes = 0;
				if (value.length >= 8) {
					for (let i = 0; i < value.length; i++) {
						//密码模式
						modes |= this.charMode(value.charCodeAt(i));
					}
					level = this.bitTotal(modes)
				}
				if (value === '') {
					callback(new Error('请输入密码'));
				} else if (value.length < 8) {
					callback(new Error('密码长度至少8位'));
				} else if (level < 3) {
					callback(new Error('密码需包括数字、小写字母、大写字母特殊符号4类中至少3类'));
				} else if (value.toLowerCase().indexOf(this.editForm.loginName.toLocaleLowerCase()) >= 0) {
					callback(new Error('密码需应与用户名无相关性，口令中不得包含用户名的完整字符串、大小写变位或形似变换的'));
				} else {
					if (this.editForm.surePsd !== '') {
						this.$refs.editForm.validateField('surePsd');
					}
					callback();
				}
			};
			let validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.editForm.newPassword) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				sysName: 'iconfont icon-dianxin',
				collName: 'iconfont icon-dianxin1',
				isCollapse: false,
				sysUserAvatar: '',
				changePwFormVisible: false,
				labelPosition: 'top',
				idShow_L: false,
				idShow_M: false,
				idShow_S: false,
				showQRCodeVisible: false,
				showQRCodeCount: 0,
				roleList: [],
				roleId: '',
				//编辑界面数据
				editForm: {
					loginName: '',
					newPassword: '',
					password: '',
					surePsd: '',
					degree: ''
				},
				editFormRules: {
					loginName: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入原密码',
						trigger: 'blur'
					}],
					newPassword: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}],
					surePsd: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}],
				},
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
			}
		},
		computed: {
			...mapState(['routers', 'userName', 'belongDeptId'])
		},
		watch: {
			'editForm.newPassword': function(newVal) {
				let level = 0;
				let modes = 0;
				if (newVal.length >= 6) {
					for (let i = 0; i < newVal.length; i++) {
						//密码模式
						modes |= this.charMode(newVal.charCodeAt(i));
					}
					level = this.bitTotal(modes)
				}
				if (level == 0 || level == 1) {
					this.idShow_L = true;
					this.idShow_M = false;
					this.idShow_S = false;
				} else if (level == 2) {
					this.idShow_L = false;
					this.idShow_M = true;
					this.idShow_S = false;
				} else if (level == 3) {
					this.idShow_L = false;
					this.idShow_M = false;
					this.idShow_S = true;
				}
			},
		},
		mounted() {
			this.roleList = this.$store.state.roleList;
			this.roleId = this.$store.state.roleId
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserAvatar = user.avatar || '';
			}
		},
		methods: {
			//退出登录
			logout() {
				this.$confirm('确认退出吗?', '提示', {
					closeOnClickModal: false
				}).then(() => {
					axios.post(logout).then(res => {
						sessionStorage.removeItem('token');
						window.location.reload()
					})
				}).catch(() => {});
			},
			openNew() {
				window.open('../bigScreen/#/screen?belongDeptId=' + this.belongDeptId);
			},
			changePw() {
				axios.get(showChangePassword).then(res => {
					this.editForm.loginName = res.data
				})
				this.changePwFormVisible = true
			},
			showQRCode() {
				this.showQRCodeVisible = true
				if (this.showQRCodeCount == 0) {
					let userId = this.$store.state.userId
					this.$nextTick(() => {
						let qrcode = new QRcode('qrcode', {
							width: 200,
							height: 200, // 高度
							text: userId, // 二维码内容
							image: ''
						})
						this.showQRCodeCount = 1
					})
				}
			},
			//折叠导航栏
			collapse() {
				this.isCollapse = !this.isCollapse;
			},
			//修改密码
			editSubmit(formName) {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						let url = "/omp/system/changePassword";
						let encrypt = new JSEncrypt();
						encrypt.setPublicKey("");
						let newPassword = this.editForm.newPassword;
						let password = this.editForm.password;
						let encrypted = encrypt.encrypt(password);
						let newEncrypted = encrypt.encrypt(newPassword);
						let para = {
							loginName: this.editForm.loginName,
							newPassword: newEncrypted,
							password: encrypted
						}
						axios.post(url, para).then((res) => {
							if (res.data.code == 0) {
								this.$message({
									message: res.data.message,
									type: 'success'
								});
								this.$refs[formName].resetFields();
								this.changePwFormVisible = false;
							} else {
								this.$message.error(res.data.message);
							}
						}).catch((error) => {})
					} else {
						return false
					}
				});
			},
			editClose(formName) {
				this.$refs[formName].resetFields();
				this.changePwFormVisible = false;
			},
			charMode(iN) {
				if (iN >= 48 && iN <= 57) //数字
					return 1;
				if (iN >= 65 && iN <= 90) //大写
					return 2;
				if (iN >= 97 && iN <= 122) //小写
					return 4;
				else
					return 8;
			},
			bitTotal(num) {
				let modes = 0;
				for (let i = 0; i < 4; i++) {
					if (num & 1) modes++;
					num >>>= 1;
				}
				return modes;
			},
			changeRole() {
				let url = "/omp/system/chooseDA";
				let para = {
					id: this.roleId
				}
				axios.post(url + '?id=' + this.roleId).then((res) => {
					let loginUrl = `/omp/system/system_spring_security`
					axios.post(loginUrl, {}).then(res => {
						if (res.data.code == "0") {
							sessionStorage.token = res.data.token;
							this.$store.dispatch('permission', true)
							window.location.reload();
						} else {
							this.$message({
								message: '切换授权失败',
								type: 'error'
							});
							axios.post(logout).then(res => {
								sessionStorage.removeItem('token');
								window.location.reload()
							})
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.main {
		height: 100%;

		.el-menu-item i,
		.el-submenu__title i {
			color: #f4f5f9 !important;
		}

		.el-aside {
			background-color: #545c64;

			.menu-title {
				height: 60px;
				line-height: 60px;
				color: #fff;
				padding: 0;
				text-align: center;
				font-size: 24px;

				.iconfont {
					font-size: 36px;
				}
			}

			.iconfont {
				margin-right: 5px;
			}
		}

		.el-main {
			background: #f1f2f7
		}

		.el-aside.slideHide {
			transition: all 0.6s;
			width: 64px !important;
		}

		ul.el-menu-vertical-demo.el-menu {
			border-right: none;
		}

		.el-header,
		.el-footer {
			background-color: #FFF;
			line-height: 60px;
			z-index: 2;
			color: #7A7676;
		}

		header.el-header {
			padding: 0;
			font-size: 20px;
		}

		.header {
			.tools {
				width: 60px;
				text-align: center;
				cursor: pointer;
			}

			.userinfo {
				text-align: right;
				margin-right: 35px;
				float: right;

				.userinfo-inner {
					cursor: pointer;
					color: #333;
					padding: 5px 10px;

					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}

					.iconfont {
						font-size: 15px;
					}
				}

				.userinfo-inner:hover {
					color: #fff;
					background-color: #409eff;
					padding: 5px 10px;
					border-radius: 3px;
				}
			}
		}
	}
</style>
