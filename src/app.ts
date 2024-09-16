import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import router from "./app/routes/index";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";

// parsers

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
// all routers here
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running............");
});

// global error handler function
app.use(globalErrorHandler);

// not found routes
app.use(notFound);

export default app;
