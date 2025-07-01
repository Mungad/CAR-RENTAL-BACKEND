import { Express } from "express";
import { adminRoleAuth, bothRoleAuth } from "../middleware/bearerAuth";
import {
  createCarController,
  getCarController,
  getCarByIdController,
  updateCarController,
  deleteCarController,
} from "../controllers/car.controller";

const car = (app: Express) => {
  app.route("/car/register").post(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await createCarController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/cars").get(
    async (req, res, next) => {
    try {
      await getCarController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/car/:id").get(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await getCarByIdController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/car/:id").put(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await updateCarController(req, res);
    } catch (error: any) {
      next(error);
    }
  });

  app.route("/car/:id").delete(
    async (req, res, next) => {
    try {
      await deleteCarController(req, res);
    } catch (error: any) {
      next(error);
    }
  });
};

export default car;
