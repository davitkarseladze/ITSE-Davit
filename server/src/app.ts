import express, { Express, Request, Response } from "express";
import path from "path";

const app: Express = express();
const port = 8000;

app.get("/", (req: Request, res: Response) => {
  const filePath = path.join(
    "C:\\Users\\Students\\Desktop\\soft\\ITSEPC-Problem-sets\\PS0\\output.html"
  );
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});