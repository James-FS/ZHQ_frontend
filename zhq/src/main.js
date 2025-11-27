import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import './static/styles/global.css';
import CommonButton from './components/Button.vue';
import CommonInput from './components/Input.vue';
import './static/iconfont/iconfont.css'
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'
global.API_BASE_URL="http://182.254.171.24:8080";
export function createApp() {
	const app = createSSRApp(App);
	app.component('mp-html', mpHtml);
	app.component('CommonButton', CommonButton);
	app.component('CommonInput', CommonInput);
	return {
		app,
	};
}
