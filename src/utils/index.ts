/**
 * JS转换时间戳为“刚刚”、“1分钟前”、“2小时前”“1天前”等格式
 */
function formatDataDifference(time: Date): string {
		const timeStamp: any = new Date(time).getTime()
		const minute: any = 1000 * 60
		const hour: any = minute * 60
		const day: any = hour * 24
		const month: any = day * 30
		const now: any = new Date().getTime()
		const diffValue: any = now - timeStamp
		let text = '刚刚'
		if (diffValue < 0) {
			// 时间在当前之后
			text = '未来时间'
		}
		const monthC: any = diffValue / month
		const weekC: any = diffValue / (7 * day)
		const dayC: any = diffValue / day
		const hourC: any = diffValue / hour
		const minC: any = diffValue / minute
		if (monthC >= 1) text = `${parseInt(monthC, 10)}个月前`
		if (weekC >= 1) text = `${parseInt(weekC, 10)}周前`
		if (dayC >= 1) text = `${parseInt(dayC, 10)}天前`
		if (hourC >= 1) text = `${parseInt(hourC, 10)}个小时前`
		if (minC >= 1) text = `${parseInt(minC, 10)}分钟前`
		return text
}
/**
 * JS密码强度验证
 * * >=90:非常安全 >=80:安全(Secure) >=70:非常强 
 * >=60:强(Strong) >=50:一般(Average) >=25:弱(Weak) >=0:非常弱
 */
function countPwd(password: string, len: number): number {
	// 大小写数字字母分值
	let count1: number = 0
	let count2: number = 0
	let count3: number = 0
	let count4: number = 0
	let grade: number = 0
	for (let i: number = 0; i < len; i++) {
		const iN: number = password.charCodeAt(i)
		if (iN >= 48 && iN <= 57) {// 数字
			count1 += 1
		} else if (iN >= 65 && iN <= 90) {// 大写字母
			count2 += 1
		} else if (iN >= 97 && iN <= 122) {// 小写字母
			count3 += 1
		} else {// 符号
			count4 += 1
		}
	}
	
	if (count1 == 1) grade += 10
	else if (count1 >= 2) grade += 20
	
	if ((count2 >= 1 && count3 == 0) || (count3 >= 1 && count2 == 0)) grade += 10
	else if (count2 >= 1 && count3 >= 1) grade += 20
	
	if (count4 == 1) grade += 10
	else if (count4 >= 2) grade += 25
	
	const conut: number = count1 + count2 + count3 + count4
	if (conut >= 4) grade += 5
	// else if (conut>=3) grade += 3
	else if (conut >= 2) grade += 2
	return grade
}
function strengthPwd(password: string): number {
		let grade: number = 0
		const len: number = password.length
		// 长度分值
		if (len <= 4) grade += 5
		else if (len <= 7) grade += 10
		else grade += 25
		grade += countPwd(password, len)
		
		if (grade >= 90) return 6
		else if (grade >= 80) return 5
		else if (grade >= 70) return 4
		else if (grade >= 60) return 3
		else if (grade >= 50) return 2
		else if (grade >= 25) return 1
		else return 0
}

export default {
	formatDataDifference,
	strengthPwd
}
