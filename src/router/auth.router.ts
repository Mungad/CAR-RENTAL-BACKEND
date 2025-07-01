import { Express } from "express";
import {
  loginCustomerController,
  verifyCustomerController,
  registerCustomerController,
  getCustomerController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
  getCustomerBookingsAndPaymentsController,
  getAllCustomersBookingsAndPaymentsController,
} from '../controllers/auth.controller';

import { adminRoleAuth, bothRoleAuth } from "../middleware/bearerAuth";

const customer = (app: Express) => {
  // ✅ REGISTER (public route)
  app.route("/auth/register").post(
    async (req, res, next) => {
      try {
        await registerCustomerController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  // ✅ VERIFY (public route)
  app.route("/auth/verify").post(
    async (req, res, next) => {
      try {
        await verifyCustomerController(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // ✅ LOGIN (public route)
  app.route("/auth/login").post(
    async (req, res, next) => {
      try {
        await loginCustomerController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  // ✅ GET ALL CUSTOMERS (admin only)
  app.route("/customers").get(
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await getCustomerController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  // ✅ GET CUSTOMER BY ID (admin only)
  app.route("/customer/:id").get(
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await getCustomerByIdController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  // ✅ UPDATE CUSTOMER (admin only)
  app.route("/customer/:id").put(
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await updateCustomerController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  // ✅ DELETE CUSTOMER (admin only)
  app.route("/customer/:id").delete(
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await deleteCustomerController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  // ✅ GET CUSTOMER BOOKINGS & PAYMENTS (public or optionally protected)
  app.route("/customer/bookings-payments/:id").get(
    async (req, res, next) => {
      try {
        await getCustomerBookingsAndPaymentsController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );

  // ✅ GET ALL CUSTOMERS' BOOKINGS & PAYMENTS (public or optionally protected)
  app.route("/customers/bookings-payments").get(
    async (req, res, next) => {
      try {
        await getAllCustomersBookingsAndPaymentsController(req, res);
      } catch (error: any) {
        next(error);
      }
    }
  );
};

export default customer;
