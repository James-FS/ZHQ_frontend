import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import './static/styles/global.css';
import './static/iconfont/iconfont.css'
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'
export function createApp() {
	const app = createSSRApp(App);
	app.component('mp-html', mpHtml);
	return {
		app,
	};
}
