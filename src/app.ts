import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router as v1Router } from "./routers/v1";
export const app = express();

// 設置中介軟體，解析 JSON 請求體
app.use(express.json());


app.use(
  cors({
    origin: [process.env.WEBSITE_URL as string],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // `Cookie` 不是標準的請求標頭
  })
);

// 打印請求日誌
app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.send("The server is up and running!");
});

app.use("/v1", v1Router);