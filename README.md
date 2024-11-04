## 项目启动指南

### 环境要求
- Node.js 版本需大于 18
- npm 版本需大于 10

### 启动步骤
1. 打开终端。
2. 切换到项目根目录。
3. 运行以下指令启动项目：
   ```bash
   npm run start
   ```

## API 文档

### 签到接口

- **接口描述**: 学生签到接口，用于学生进行课程签到。
- **请求方式**: PUT
- **接口地址**: `/api/v1/StudentSignIn`

#### 请求参数

| 参数名        | 类型   | 是否必填 | 说明                |
|---------------|--------|----------|---------------------|
| coursePlanId  | string | 是       | 课程计划ID          |
| attendanceId  | string | 是       | 考勤ID              |
| cookie        | string | 是       | 用户Cookie信息      |

#### 请求示例

```json
{
    "coursePlanId": "123456",
    "attendanceId": "654321",
    "cookie": "session_token=abc123"
}
```

#### 响应参数

| 参数名  | 类型   | 说明                                       |
|---------|--------|--------------------------------------------|
| message | string | 响应信息                                   |
| 签到码  | string | 签到成功时返回的签到码（仅在签到成功时返回） |

#### 响应示例

- **签到成功**:
  ```json
  {
      "message": "签到成功",
      "签到码": "SUCCESS_CODE"
  }
  ```

- **缺少必要参数**:
  ```json
  {
      "message": "缺少coursePlanId,attendanceId或Cookie"
  }
  ```

- **获取任务锁失败**:
  ```json
  {
      "message": "获取任务锁失败"
  }
  ```

- **签到失败**:
  ```json
  {
      "message": "签到失败,请检查coursePlanId, attendanceId,是否正确"
  }
  ```

### 注意事项
- 确保请求头中包含正确的 `cookie` 信息。
- `coursePlanId` 和 `attendanceId` 必须为有效的ID。

---

**联系方式**: 如有疑问，请联系开发者。

---

**版本更新记录**:
- v1.0.0: 初始版本，实现基本签到功能。

---

**版权声明**:
- 本项目遵循 MIT 许可证。

---

**贡献者**:
- [Daifuku](开发者链接)

---

感谢使用本项目，祝您使用愉快！