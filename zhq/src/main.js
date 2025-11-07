import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import './static/styles/global.css';
import CommonButton from './components/Button.vue';
import CommonInput from './components/Input.vue';

import './static/iconfont/iconfont.css'
export function createApp() {
	const app = createSSRApp(App);
	// 全局注册公共组件
	app.component('CommonButton', CommonButton);
	app.component('CommonInput', CommonInput);
	return {
		app,
	};
}
