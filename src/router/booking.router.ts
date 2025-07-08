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
    async (req, res, next) => {
      try {
        await createBookingController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.route("/bookings").get(
    async (req, res, next) => {
      try {
        await getBookingController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.route("/booking/:id").get(
    async (req, res, next) => {
      try {
        await getBookingByIdController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.route("/bookings/customer/:customerID").get(
    async (req, res, next) => {
      try {
        await getBookingsByCustomerIdController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.route("/booking/:id").put(
    async (req, res, next) => {
      try {
        await updateBookingController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.route("/booking/:id").delete(
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
