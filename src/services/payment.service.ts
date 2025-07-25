import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIPayment, PaymentTable } from "../Drizzle/schema";

export const createPaymentService = async (payment: TIPayment) => {
  await db.insert(PaymentTable).values(payment).returning();
  return "Payment added successfully";
};

export const getPaymentService = async () => {
  const payments = await db.select().from(PaymentTable);
  return payments;
};

export const getPaymentByIdService = async (id: number) => {
  const payment = await db.query.PaymentTable.findFirst({
    where: eq(PaymentTable.paymentID, id),
  });
  return payment;
};

export const getPaymentsByBookingIdService = async (bookingId: number) => {
  const payments = await db.query.PaymentTable.findMany({
    where: eq(PaymentTable.bookingID, bookingId),
  });
  return payments;
};

export const updatePaymentService = async (id: number, payment: TIPayment) => {
  const result = await db
    .update(PaymentTable)
    .set(payment)
    .where(eq(PaymentTable.paymentID, id))
    .returning();

  if (result.length === 0) {
    return null;
  }

  return result[0];
};


export const deletePaymentService = async (id: number) => {
  const deleted = await db.delete(PaymentTable).where(eq(PaymentTable.paymentID, id)).returning();
  return deleted[0];
};