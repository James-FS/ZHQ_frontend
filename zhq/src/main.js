import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import './static/styles/global.css';
import './static/iconfont/iconfont.css'
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
