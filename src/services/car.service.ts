import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TICar, CarTable } from "../Drizzle/schema";

export const createCarService = async (car: TICar) => {
  const inserted = await db.insert(CarTable).values(car).returning();

  if (!inserted || inserted.length === 0) {
    return null;
  }

  return "Car added successfully";
};

export const getCarService = async () => {
  const cars = await db.select().from(CarTable);
  return cars;
};

export const getCarByIdService = async (id: number) => {
  const car = await db.query.CarTable.findFirst({
    where: eq(CarTable.carID, id),
  });
  return car;
};

export const updateCarService = async (id: number, car: TICar) => {
  await db.update(CarTable).set(car).where(eq(CarTable.carID, id)).returning();
  return "Car updated successfully";
};

export const deleteCarService = async (id: number) => {
  const deletedCar = await db.delete(CarTable).where(eq(CarTable.carID, id)).returning();
  return deletedCar[0];
};
