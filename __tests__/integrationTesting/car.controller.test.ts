// import request from "supertest";
// import express from "express";
// import * as CarService from "../../services/car.service";
// import { 
//     createCarController,
//     getCarController,
//     getCarByIdController,
//     updateCarController,
//     deleteCarController } from "../../controllers/car.controller";

// // Step 1: Set up a minimal Express app for testing
// const app = express();
// app.use(express.json());
// app.get("/cars", getCarController as any);
// app.get("/cars/:id", getCarByIdController as any);
// app.post("/cars", createCarController as any);
// app.put("/cars/:id", updateCarController as any);
// app.delete("/cars/:id", deleteCarController as any);

// // Step 2: Mock the car service
// jest.mock("../../services/car.service")

// describe("Car Controller", () => {
//     //testing getting all cars
//     test("GET /cars should return all cars", async () => {
//         (CarService.getCarService as jest.Mock).mockResolvedValue([
//             {
//                 carID: 1,
//                 carModel: "Toyota Corolla",
//                 year: "2020-01-01",
//                 color: "Red",
//                 rentalRate: "50.00",
//                 availability: true,
//                 locationID: 1,
//             },
//         ]);

//         const res = await request(app).get("/cars");

//         expect(res.status).toBe(200);
//         expect(res.body).toEqual([
//             {
//                 carID: 1,
//                 carModel: "Toyota Corolla",
//                 year: "2020-01-01",
//                 color: "Red",
//                 rentalRate: "50.00",
//                 availability: true,
//                 locationID: 1,
//             },
//         ]);
//     });

//     //testing get car by id
//     test("GET /cars/:id should return one car", async () => {
//         (CarService.getCarByIdService as jest.Mock).mockResolvedValue({
//             carID: 1,
//             carModel: "Toyota Corolla",
//             year: "2020-01-01",
//             color: "Red",
//             rentalRate: "50.00",
//             availability: true,
//             locationID: 1,
//         });

//         const res = await request(app).get("/cars/1");

//         expect(res.status).toBe(200);
//         expect(res.body).toEqual({data:{
//             carID: 1,
//             carModel: "Toyota Corolla",
//             year: "2020-01-01",
//             color: "Red",
//             rentalRate: "50.00",
//             availability: true,
//             locationID: 1,
//         }});
//     });

//     //testing if no car is found
//     test("GET /cars/:id should return 404 if car not found", async () => {
//         if ((CarService.getCarById as jest.Mock).mockResolvedValue(null)) {
//             const response = await request(app).get("/cars/999");
//             expect(response.status).toBe(404);
//             expect(response.body).toEqual({ message: "Car not found" });
//         }
//         if ((CarService.updateCar as jest.Mock).mockResolvedValue(null)) {
//             const response = await request(app).put("/cars/999");
//             expect(response.status).toBe(404);
//             expect(response.body).toEqual({ error: "Car not found" });
//         }
//         if ((CarService.deleteCar as jest.Mock).mockResolvedValue(null)) {
//             const response = await request(app).delete("/cars/999");
//             expect(response.status).toBe(404);
//             expect(response.body).toEqual({ error: "Car not found" });
//         }
//     });

//     //testing if an error occured
//     test("GET /cars/:id should return 500 if an error occurs", async () => {
//         if ((CarService.getAllCars as jest.Mock).mockRejectedValue(new Error("Failed to fetch car"))) {
//             const response = await request(app).get("/cars");
//             expect(response.status).toBe(500);
//             expect(response.body).toEqual({ error: "Failed to fetch cars" });

//         }
//         if ((CarService.getCarById as jest.Mock).mockRejectedValue(new Error("Failed to fetch car"))) {
//             const response = await request(app).get("/cars/999");
//             expect(response.status).toBe(500);
//             expect(response.body).toEqual({ error: "Failed to fetch car" });
//         }
//         if((CarService.createCar as jest.Mock).mockRejectedValue(new Error("Failed to create car"))){
//             const response = await request(app).post("/cars");
//             expect(response.status).toBe(500);
//             expect(response.body).toEqual({ error: "Failed to create car" });
//         }
//         if((CarService.updateCar as jest.Mock).mockRejectedValue(new Error("Failed to update car"))){
//             const response = await request(app).put("/cars/999");
//             expect(response.status).toBe(500);
//             expect(response.body).toEqual({ error: "Failed to update car" });
//         }
//         if((CarService.deleteCar as jest.Mock).mockRejectedValue(new Error("Failed to delete car"))){
//             const response = await request(app).delete("/cars/999");
//             expect(response.status).toBe(500);
//             expect(response.body).toEqual({ error: "Failed to delete car" });
//         }
//     });

//     //testing adding a new car
//     test("POST /cars should create a new car", async () => {
//         const newCar = {
//             carModel: "Subaru Outback",
//             year: "2022-05-01",
//             color: "Blue",
//             rentalRate: "65.00",
//             availability: true,
//             locationID: 3,
//         };

//         // Mock the service call
//         (CarService.createCar as jest.Mock).mockResolvedValue({
//             carID: 10,
//             ...newCar,
//         });

//         app.post("/cars", (req, res) => {
//             return createCar(req, res);
//         });

//         const res = await request(app).post("/cars").send(newCar);

//         expect(res.status).toBe(201);
//         expect(res.body).toEqual({
//             carID: 10,
//             ...newCar,
//         });
//     });

//     //testing updating a car information
//     test("PUT /cars/:id should update an existing car", async () => {
//         const updatedCar = {
//             carModel: "Subaru Outback",
//             year: "2022-05-01",
//             color: "Black",
//             rentalRate: "70.00",
//             availability: false,
//             locationID: 3,
//         };

//         // Mock the service method
//         (CarService.updateCar as jest.Mock).mockResolvedValue({
//             carID: 10,
//             ...updatedCar,
//         });

//         const res = await request(app).put("/cars/1").send(updatedCar);

//         expect(res.status).toBe(200);
//         expect(res.body).toEqual({
//             carID: 10,
//             ...updatedCar,
//         });
//     });

//     //testing deleting a car
//     test("DELETE /cars/:id should delete a car", async () => {
//         // Mock the deleteCar service method
//         (CarService.deleteCar as jest.Mock).mockResolvedValue(true);

//         const res = await request(app).delete("/cars/10");

//         expect(res.status).toBe(200);
//         expect(res.body).toEqual({ message: "Car deleted successfully" });
//     });

//     // testing failed deletion
//     test("DELETE /cars/:id should return 404 if car not found", async () => {
//         // failed deletion
//         (CarService.deleteCar as jest.Mock).mockResolvedValue(false);

//         const res = await request(app).delete("/cars/999");

//         expect(res.status).toBe(404);
//         expect(res.body).toEqual({ error: "Car not found" });
//     });
// });

import request from "supertest";
import app from "../../src";
import db from "../../src/Drizzle/db";
import bcrypt from "bcryptjs";
import { CarTable } from "../../src/Drizzle/schema";
import { CustomerTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let adminToken: string;
let customerToken: string;
let adminId: number;
let customerId: number;
let testCarId: number;

const adminUser = {
  firstName: "Admin",
  lastName: "Tester",
  email: "admin@car.com",
  password: "AdminPass123",
  phoneNumber: "0712345678",
  address: "Admin Ave",
  role: "admin" as const,
  isVerified: true,
};

const customerUser = {
  firstName: "Customer",
  lastName: "Tester",
  email: "customer@car.com",
  password: "CustPass123",
  phoneNumber: "0700112233",
  address: "Customer Rd",
  role: "user" as const,
  isVerified: true,
};

beforeAll(async () => {
  await db.delete(CarTable);
  await db.delete(CustomerTable);

  // Create admin
  const hashedAdminPassword = bcrypt.hashSync(adminUser.password, 10);
  const [admin] = await db
    .insert(CustomerTable)
    .values({ ...adminUser, password: hashedAdminPassword })
    .returning();
  adminId = admin.customerID;

  // Create customer
  const hashedCustomerPassword = bcrypt.hashSync(customerUser.password, 10);
  const [customer] = await db
    .insert(CustomerTable)
    .values({ ...customerUser, password: hashedCustomerPassword })
    .returning();
  customerId = customer.customerID;

  // Login admin
  const adminLogin = await request(app)
    .post("/auth/login")
    .send({ email: adminUser.email, password: adminUser.password });
  adminToken = adminLogin.body.token;

  // Login customer
  const customerLogin = await request(app)
    .post("/auth/login")
    .send({ email: customerUser.email, password: customerUser.password });
  customerToken = customerLogin.body.token;
});

afterAll(async () => {
  await db.delete(CarTable).where(eq(CarTable.carID, testCarId));
  await db.delete(CustomerTable).where(eq(CustomerTable.customerID, adminId));
  await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerId));
});

describe("Car Controller Integration Tests", () => {
  it("Should create a car", async () => {
    const carData = {
      carModel: "Honda Fit",
      year: "2019-05-01",
      color: "Silver",
      rentalRate: "1200.00",
      availability: true,
    };

    const res = await request(app)
      .post("/car/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(carData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    const createdCar = await db.query.CarTable.findFirst({
      where: eq(CarTable.carModel, carData.carModel),
    });
    expect(createdCar).toBeTruthy();
    testCarId = createdCar!.carID;
  });

  it("Should fail to create a car without token", async () => {
    const res = await request(app).post("/car/register").send({
      carModel: "Mazda Demio",
      year: "2020-02-02",
      color: "Blue",
      rentalRate: "1100.00",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("Should get all cars", async () => {
    const res = await request(app)
      .get("/cars")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("Should get a car by ID", async () => {
    const res = await request(app)
      .get(`/car/${testCarId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("carID", testCarId);
  });

    it("Should return 404 for non-existent car", async () => {
        const res = await request(app)
        .get("/car/999999")
        .set("Authorization", `Bearer ${adminToken}`);
    
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Car not found");
    });

  it("Should update a car", async () => {
    const res = await request(app)
      .put(`/car/${testCarId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        color: "Black",
        rentalRate: "1350.00",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Car updated successfully");
  });

  it("Should delete a car", async () => {
    const res = await request(app)
      .delete(`/car/${testCarId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  it("Should block access without token", async () => {
    const res = await request(app).get("/cars");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });
});