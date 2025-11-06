/**
 * 防抖函数工具类
 * 防抖（debounce）：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 */

/**
 * 防抖函数
 * 立即执行模式：第一次触发时立即执行，之后n秒内不再执行
 * 延迟执行模式：n秒内没有再次触发才执行
 * @param {Function} func 要执行的函数
 * @param {number} delay 延迟时间（毫秒）
 * @param {boolean} immediate 是否立即执行一次
 * @returns {Function} 防抖后的函数
 */

export function debounce(func, delay = 300, immediate = false) {
    let timer = null;

    return function (...args) {
        // 保存当前作用域
        const context = this;

        // 如果已经有定时器，清除它
        if (timer) {
            clearTimeout(timer);
        }

        if (immediate) {
            // 立即执行模式
            const callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, delay);

            if (callNow) {
                func.apply(context, args);
            }
        } else {
            // 延迟执行模式
            timer = setTimeout(() => {
                func.apply(context, args);
                timer = null;
            }, delay);
        }
    };
}

/**
 * 节流函数
 * 节流（throttle）：规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
 * @param {Function} func 要执行的函数
 * @param {number} delay 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, delay = 300) {
    let timer = null;
    let lastExecTime = 0;

    return function (...args) {
        const context = this;
        const currentTime = Date.now();

        if (currentTime - lastExecTime > delay) {
            func.apply(context, args);
            lastExecTime = currentTime;
        } else {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                func.apply(context, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

/**
 * 按钮点击防抖函数（专门为按钮点击优化，等待接口调用完成后再开始延迟计时）
 * @param {Function} func 点击回调函数
 * @param {number} delay 防抖延迟时间，默认500ms
 * @returns {Function} 防抖后的点击函数
 */
export function buttonDebounce(func, delay = 500) {
    let isExecuting = false;

    return function (...args) {
        if (isExecuting) {
            return;
        }

        isExecuting = true;

        // 执行函数
        const result = func.apply(this, args);

        // 如果返回Promise，等待Promise完成
        if (result && typeof result.then === 'function') {
            result
                .then(() => {
                    setTimeout(() => {
                        isExecuting = false;
                    }, delay);
                })
                .catch(() => {
                    setTimeout(() => {
                        isExecuting = false;
                    }, delay);
                });
        } else {
            // 普通函数，延迟后重置状态
            setTimeout(() => {
                isExecuting = false;
            }, delay);
        }

        return result;
    };
}

/**
 * 创建防抖实例类
 * 可以为不同的函数创建独立的防抖实例
 */
export class DebounceManager {
    constructor() {
        this.timers = new Map();
    }

    /**
     * 执行防抖函数
     * @param {string} key 防抖的唯一标识
     * @param {Function} func 要执行的函数
     * @param {number} delay 延迟时间
     * @param  {...any} args 函数参数
     */
    execute(key, func, delay = 300, ...args) {
        // 清除之前的定时器
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }

        // 设置新的定时器
        const timer = setTimeout(() => {
            func.apply(this, args);
            this.timers.delete(key);
        }, delay);

        this.timers.set(key, timer);
    }

    /**
     * 取消特定的防抖
     * @param {string} key 防抖的唯一标识
     */
    cancel(key) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
    }

    /**
     * 取消所有防抖
     */
    cancelAll() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
    }
}

// 导出一个默认的防抖管理器实例
export const defaultDebounceManager = new DebounceManager();