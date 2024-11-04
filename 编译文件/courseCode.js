"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentSign = studentSign;
const axios_1 = __importDefault(require("axios"));
function studentSign(coursePlanId, attendanceId, Cookie) {
    return __awaiter(this, void 0, void 0, function* () {
        // 设置并发连接数
        const CONCURRENT_LIMIT = 50;
        // 创建一个标识符，用于标记是否成功签到
        let signedCourseCode = null;
        // 创建并发控制函数
        const limitConcurrency = (tasks, limit) => __awaiter(this, void 0, void 0, function* () {
            const results = [];
            const executing = new Set();
            for (const task of tasks) {
                if (signedCourseCode) {
                    // 如果已经找到正确的课程码，则跳出循环结束函数执行
                    break;
                }
                const p = Promise.resolve().then(task).catch((error) => {
                    // 当请求发生错误时，也记录下来
                    console.error('Request failed:', error);
                });
                results.push(p);
                executing.add(p);
                p.then(() => executing.delete(p));
                if (executing.size >= limit) {
                    // 等待某个任务完成以释放空间
                    yield Promise.race(executing);
                }
            }
            // 等待所有任务完成
            yield Promise.all(results);
        });
        // 测试请求，检查参数是否有效
        try {
            const testResponse = yield axios_1.default.get("https://attendance.nbu.edu.cn/api/coursePlan/signByCourseCode", {
                params: {
                    timeNow: Date.now().toString(),
                    courseCode: '0000', // 测试请求使用固定的课程码
                    coursePlanId,
                    attendanceId,
                    lng: '0',
                    lat: '0',
                },
                headers: {
                    'Cookie': `${Cookie}`,
                }
            });
            if (testResponse.data && testResponse.data.code === 30009) {
                // 测试请求失败，返回false
                console.log('Test request failed:', testResponse.data.msg);
                return false;
            }
        }
        catch (error) {
            // 测试请求发生错误，返回false
            console.error('Test request failed:', error);
            return false;
        }
        // 构造任务数组
        const tasks = [];
        for (let i = 0; i < 10000; i++) {
            const courseCode = i.toString().padStart(4, '0');
            tasks.push(() => __awaiter(this, void 0, void 0, function* () {
                if (signedCourseCode) {
                    // 如果已经成功签到，就不需要进一步执行其他请求
                    return;
                }
                try {
                    const response = yield axios_1.default.get("https://attendance.nbu.edu.cn/api/coursePlan/signByCourseCode", {
                        params: {
                            timeNow: Date.now().toString(),
                            courseCode,
                            coursePlanId,
                            attendanceId,
                            lng: '0',
                            lat: '0',
                        },
                        headers: {
                            'Cookie': `${Cookie}`,
                        }
                    });
                    if (response.data && response.data.code === 20000) {
                        // 签到成功
                        console.log(`Signed in successfully with code ${courseCode}:`, response.data);
                        signedCourseCode = courseCode; // 设置成功的课程码
                    }
                    else {
                        // 签到失败，记录错误的课程码
                        console.log(`Failed to sign in with code ${courseCode}:`, response.data.msg);
                    }
                }
                catch (error) {
                    // 如果请求失败，打印错误信息
                    console.error(`Error with code ${courseCode}:`, error);
                }
            }));
        }
        // 使用自定义的并发控制函数执行所有任务
        yield limitConcurrency(tasks, CONCURRENT_LIMIT);
        // 返回签到结果
        return signedCourseCode ? signedCourseCode : false;
    });
}
