import { Express } from "express";
import {
  createBookingController,
  getBookingController,
  getBookingByIdController,
  getBookingsByCustomerIdController,
  updateBookingController,
  deleteBookingController,
} from "../controllers/booking.controller";
import { adminRoleAuth, userRoleAuth, bothRoleAuth } from "../middleware/bearerAuth";

const booking = (app: Express) => {
  app.route("/booking/register").post(
    userRoleAuth,
    async (req, res, next) => {
      try {
        await createBookingController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.route("/bookings").get(
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await getBookingController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.route("/booking/:id").get(
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await getBookingByIdController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.route("/bookings/customer/:customerID").get(
    bothRoleAuth,
    async (req, res, next) => {
      try {
        await getBookingsByCustomerIdController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.route("/booking/:id").put(
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await updateBookingController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.route("/booking/:id").delete(
    userRoleAuth,
    async (req, res, next) => {
      try {
        await deleteBookingController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );
};

export default booking;
