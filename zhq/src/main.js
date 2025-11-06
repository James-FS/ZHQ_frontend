import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import './static/styles/global.css';
import CommonButton from './components/Button.vue';

export function createApp() {
	const app = createSSRApp(App);
	// 全局注册公共组件
	app.component('CommonButton', CommonButton);
	return {
		app,
	};
}
