import db from "../Drizzle/db";
import { MaintenanceTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";

export const createMaintenanceService = async (data: any) => {
  await db.insert(MaintenanceTable).values(data).returning();
  return "Maintenance added successfully";
};

export const getAllMaintenanceService = async () => {
  return await db.select().from(MaintenanceTable);
};

export const getMaintenanceByIdService = async (id: number) => {
  const result = await db.query.MaintenanceTable.findFirst({
    where: eq(MaintenanceTable.maintenanceID, id),
  });
  return result;
};

export const updateMaintenanceService = async (id: number, data: any) => {
  await db
    .update(MaintenanceTable)
    .set(data)
    .where(eq(MaintenanceTable.maintenanceID, id))
    .returning();
  return "Maintenance updated successfully";
};

export const deleteMaintenanceService = async (id: number) => {
  const deleted = await db
    .delete(MaintenanceTable)
    .where(eq(MaintenanceTable.maintenanceID, id))
    .returning();
  return deleted[0];
};
