import { Router } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "./user.validation";

const router = Router();

router.get("/me", auth("user", "admin"), UserControllers.getProfile);
router.put(
  "/me",
  auth("user"),
  validateRequest(userValidations.updateValidationSchema),
  UserControllers.UpdateProfile
);

export const UserRoutes = router;
