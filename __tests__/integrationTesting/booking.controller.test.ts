import request from "supertest";
import express from "express";
import * as BookingService from "../../src/services/booking.service";
import {
  createBookingController,
  getBookingController,
  getBookingByIdController,
  getBookingsByCustomerIdController,
  updateBookingController,
  deleteBookingController
} from "../../src/controllers/booking.controller";

const app = express();
app.use(express.json());
app.post("/booking", createBookingController as any);
app.get("/booking", getBookingController as any);
app.get("/booking/:id", getBookingByIdController as any);
app.get("/booking/customer/:customerID", getBookingsByCustomerIdController as any);
app.put("/booking/:id", updateBookingController as any);
app.delete("/booking/:id", deleteBookingController as any);

jest.mock("../../src/services/booking.service");

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("Booking Controller", () => {
  test("POST /booking should create a booking", async () => {
    const booking = {
      customerID: 1,
      carID: 2,
      bookingDate: "2024-06-01",
      returnDate: "2024-06-05",
      totalAmount: 500
    };
    (BookingService.createBookingService as jest.Mock).mockResolvedValue(booking);
    const response = await request(app).post("/booking").send(booking);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Booking added successfully", data: booking });
  });

  test("GET /booking should return all bookings", async () => {
    const bookings = [{ bookingID: 1, customerID: 1 }];
    (BookingService.getBookingService as jest.Mock).mockResolvedValue(bookings);
    const response = await request(app).get("/booking");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: bookings });
  });

  test("GET /booking/:id should return a single booking", async () => {
    const booking = { bookingID: 1, customerID: 1 };
    (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(booking);
    const response = await request(app).get("/booking/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: booking });
  });

  test("GET /booking/customer/:customerID should return bookings for customer", async () => {
    const bookings = [{ bookingID: 1, customerID: 1 }];
    (BookingService.getBookingsByCustomerIdService as jest.Mock).mockResolvedValue(bookings);
    const response = await request(app).get("/booking/customer/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: bookings });
  });

  test("PUT /booking/:id should update booking", async () => {
    const updatedBooking = { customerID: 1, carID: 2, totalAmount: 600 };
    (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(true);
    (BookingService.updateBookingService as jest.Mock).mockResolvedValue(true);
    const response = await request(app).put("/booking/1").send(updatedBooking);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Booking updated successfully" });
  });

  test("DELETE /booking/:id should delete booking", async () => {
    (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(true);
    (BookingService.deleteBookingService as jest.Mock).mockResolvedValue(true);
    const response = await request(app).delete("/booking/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Booking deleted successfully" });
  });

  test("GET /booking/:id should return 404 if booking not found", async () => {
    (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(null);
    const response = await request(app).get("/booking/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Booking not found" });
  });

  test("PUT /booking/:id should return 404 if booking not found", async () => {
    (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(null);
    const response = await request(app).put("/booking/999").send({});
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Booking not found" });
  });

  test("DELETE /booking/:id should return 404 if booking not found", async () => {
    (BookingService.getBookingByIdService as jest.Mock).mockResolvedValue(null);
    const response = await request(app).delete("/booking/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Booking not found" });
  });

  test("GET /booking should return 500 on error", async () => {
    (BookingService.getBookingService as jest.Mock).mockRejectedValue(new Error("Something went wrong"));
    const response = await request(app).get("/booking");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Something went wrong" });
  });
});
