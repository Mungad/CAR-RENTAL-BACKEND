import request from "supertest";
import app from "../../src";
import db from "../../src/Drizzle/db";
import bcrypt from "bcryptjs";
import { CustomerTable, InsuranceTable, CarTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let adminToken: string;
let customerToken: string;
let adminId: number;
let customerId: number;
let testCarId: number;
let testInsuranceId: number;

const adminUser = {
  firstName: "Admin",
  lastName: "Tester",
  email: "admin@insurance.com",
  password: "AdminPass123",
  phoneNumber: "0711223344",
  address: "Admin St",
  role: "admin" as const,
  isVerified: true,
};

const customerUser = {
  firstName: "Customer",
  lastName: "Tester",
  email: "customer@insurance.com",
  password: "CustPass123",
  phoneNumber: "0700112233",
  address: "Customer Ave",
  role: "user" as const,
  isVerified: true,
};

beforeAll(async () => {
  const hashedAdminPassword = bcrypt.hashSync(adminUser.password, 10);
  const [admin] = await db.insert(CustomerTable).values({ ...adminUser, password: hashedAdminPassword }).returning();
  adminId = admin.customerID;

  const hashedCustomerPassword = bcrypt.hashSync(customerUser.password, 10);
  const [customer] = await db.insert(CustomerTable).values({ ...customerUser, password: hashedCustomerPassword }).returning();
  customerId = customer.customerID;

  const adminLogin = await request(app)
    .post("/auth/login")
    .send({ email: adminUser.email, password: adminUser.password });
  adminToken = adminLogin.body.token;

  const customerLogin = await request(app)
    .post("/auth/login")
    .send({ email: customerUser.email, password: customerUser.password });
  customerToken = customerLogin.body.token;

  const [car] = await db.insert(CarTable).values({
    carModel: "Toyota Premio",
    year: "2020-01-01",
    color: "White",
    rentalRate: "1000.00",
    availability: true,
  }).returning();
  testCarId = car.carID;
});

afterAll(async () => {
  await db.delete(InsuranceTable).where(eq(InsuranceTable.insuranceID, testInsuranceId));
  await db.delete(CarTable).where(eq(CarTable.carID, testCarId));
  await db.delete(CustomerTable).where(eq(CustomerTable.customerID, adminId));
  await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerId));
});

describe("Insurance Controller Integration Tests", () => {
  it("Should register insurance (admin only)", async () => {
    const res = await request(app)
      .post("/insurance/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        carID: testCarId,
        insuranceProvider: "Jubilee",
        policyNumber: "POL12345678",
        startDate: "2024-01-01",
        endDate: "2025-01-01"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBeDefined();

    const insurance = await db.query.InsuranceTable.findFirst({
      where: eq(InsuranceTable.policyNumber, "POL12345678")
    });

    expect(insurance).toBeTruthy();
    testInsuranceId = insurance!.insuranceID;
  });

  it("Should fail to register insurance without token", async () => {
    const res = await request(app)
      .post("/insurance/register")
      .send({
        carID: testCarId,
        insuranceProvider: "Britam",
        policyNumber: "POL99999999",
        startDate: "2024-01-01",
        endDate: "2025-01-01"
      });

    expect(res.statusCode).toBe(401);
  });

  it("Should fetch all insurances", async () => {
    const res = await request(app)
      .get("/insurances")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("Should get insurance by ID", async () => {
    const res = await request(app)
      .get(`/insurance/${testInsuranceId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("insuranceID", testInsuranceId);
  });

  it("Should update insurance", async () => {
    const res = await request(app)
      .put(`/insurance/${testInsuranceId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ insuranceProvider: "CIC Insurance" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Insurance updated successfully");
  });

  it("Should delete insurance", async () => {
    const res = await request(app)
      .delete(`/insurance/${testInsuranceId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  it("Should block customer from accessing insurance routes", async () => {
    const res = await request(app)
      .get("/insurances")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(401);
  });
});