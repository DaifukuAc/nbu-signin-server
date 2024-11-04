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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const courseCode_1 = require("./courseCode");
dotenv_1.default.config();
const app = (0, express_1.default)();
const serverPort = process.env.server_port;
app.use(body_parser_1.default.json());
app.put('/api/v1/StudentSignIn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { coursePlanId, attendanceId } = req.body;
    const cookie = req.headers['cookie'];
    console.log(cookie);
    if (!coursePlanId || !attendanceId || !cookie) {
        res.status(401).json({ message: '缺少coursePlanId,attendanceId或Cookie' });
    }
    else {
        res.status(401).json({ message: '获取任务锁失败' });
        const signInInfo = yield (0, courseCode_1.studentSign)(coursePlanId, attendanceId, cookie);
        if (!signInInfo) {
            res.status(401).json({ message: '签到失败,请检查coursePlanId, attendanceId,是否正确' });
        }
        else {
            res.status(200).json({ message: '签到成功', '签到码': signInInfo });
        }
    }
}));
app.listen(serverPort, () => {
    console.log(`服务器正在监听端口 ${serverPort}`);
});
