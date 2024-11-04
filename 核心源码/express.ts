import express, { request, response } from 'express';
import dotenv from 'dotenv';
import bodyParser, { json } from 'body-parser';

import { studentSign } from './courseCode';







dotenv.config();
const app = express();
const serverPort = process.env.server_port!;



app.use(bodyParser.json());




app.put('/api/v1/StudentSignIn', async (req: express.Request, res: express.Response) => {
    const { coursePlanId, attendanceId } = req.body;
    const cookie = req.headers['cookie'];
    console.log(cookie);


    if (!coursePlanId || !attendanceId || !cookie) {
        res.status(401).json({ message: '缺少coursePlanId,attendanceId或Cookie' });
    } else {


       



        const signInInfo = await studentSign(coursePlanId, attendanceId, cookie);
        if (!signInInfo) {

            res.status(401).json({ message: '签到失败,请检查coursePlanId, attendanceId,是否正确' });
        } else {

            res.status(200).json({ message: '签到成功', '签到码': signInInfo });
        }


    }


});




app.listen(serverPort, () => {
    console.log(`服务器正在监听端口 ${serverPort}`);
});


