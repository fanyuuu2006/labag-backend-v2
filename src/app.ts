import express from "express"; // Web framework
import session from "express-session"; // 用於在伺服器端維護 session
import cors from "cors"; // 處理跨來源請求 (CORS)
import morgan from "morgan"; // HTTP 請求日誌中介軟體
import { router as v1Router } from "./routers/v1"; // 應用的版本 1 API 路由
import passport from "passport"; // 認證中介軟體（可搭配多種策略）
import { FRONTEND_URL, JWT_KEY } from "./libs/env"; // 從環境變數導出的密鑰或設定
import { globalRateLimit } from "./middlewares/rateLimit";

// 建立一個 Express 應用實例，並在其他模組中匯出以供 server 使用
export const app = express();

/*
  解析請求 JSON 主體
  - express.json() 會解析 Content-Type 為 application/json 的請求，
    並將解析後的物件放到 req.body 上，供後續中介軟體或路由處理。
*/
app.use(express.json());

app.use(globalRateLimit);

/*
  設定 CORS（跨來源資源共享）
  - origin: 允許的來源清單，通常用於限制可從哪些網域發出請求。
    這裡使用 process.env.WEBSITE_URL，確保瀏覽器僅在該網域允許跨域請求。
  - methods: 僅允許的 HTTP 方法（此專案暫時允許 GET, POST）。
  - credentials: 表示是否允許攜帶憑證（cookie、Authorization header 等），
    若為 true，前端需在 fetch/axios 設定中同時帶上 credentials。
  - allowedHeaders: 指定可以在請求中出現的自訂標頭（headers）。
    註：`Cookie` 並非標準的可自定義請求標頭，因此通常不在此列。
*/
app.use(
  cors({
    origin: [FRONTEND_URL],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/*
  請求日誌
  - morgan("dev") 在開發環境輸出簡潔易讀的請求資訊（方法、URL、狀態、回應時間）。
  - 在生產環境可考慮改成更詳細或輸出到檔案的設定。
*/
app.use(morgan("dev"));

/*
  Session 設定
  - 使用 express-session 在伺服器端管理 session
  - secret: 用來簽署 session id cookie 的字串（請勿公開，應從環境變數讀取）
  - resave: 若為 false，未修改的 session 不會每次都重新儲存（效能優化）
  - saveUninitialized: 若為 false，未初始化的 session（沒有任何資料）不會儲存
  注意：生產環境建議配合可信的 session store（例如 Redis）以避免 memory leak
*/
app.use(
  session({
    secret: JWT_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

/*
  Passport 初始化
  - passport.initialize(): 啟動 Passport 中介軟體（必需）
  - passport.session(): 如果使用 session 支援持久登入，需呼叫此方法以將
    Passport 的序列化/反序列化邏輯與 express-session 綁定。
  - 具體的策略（如 Google OAuth）與序列化/反序列化設定，會在其他檔案中註冊。
*/
app.use(passport.initialize());
app.use(passport.session());

/*
  健康檢查根路由
  - 提供一個簡單的回應以確認伺服器已啟動
  - 生產環境可擴充為更完整的健康檢查（DB 連線、外部服務狀態等）
*/
app.get("/", (_, res) => {
  res.send("The server is up and running!");
});

/*
  掛載 API 路由
  - 所有 /v1 開頭的路由會導向 ./routers/v1 中定義的子路由
  - 將路由分群（例如 v1、v2）方便版本管理與向後相容處理
*/
app.use("/v1", v1Router);
