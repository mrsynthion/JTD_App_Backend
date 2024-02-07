import * as express from "express";
import { WorkLogController } from "../controller/work-log.controller";

const router = express.Router();

router.post("/task/:taskId", WorkLogController.addWorkLogByTaskId);

router.get("/task/:taskId", WorkLogController.getWorkLogListByTaskId);

router.put("/:id", WorkLogController.editWorkLog);

router.delete("/:id", WorkLogController.deleteWorkLog);

export { router as WorkLogRoutes };
