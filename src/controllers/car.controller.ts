// import { Request, Response } from "express";
// import {
//   createCarService,
//   getAllCarsService,
//   getCarByIdService,
//   updateCarService,
//   deleteCarService
// } from "../services/car.service";

// export const createCarController = async (req: Request, res: Response) => {
//   try {
//     const car = req.body;
//     const newCar = await createCarService(car);
//     return res.status(201).json({ message: "Car created", data: newCar });
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// export const getAllCarsController = async (_: Request, res: Response) => {
//   try {
//     const cars = await getAllCarsService();
//     return res.status(200).json({ data: cars });
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// export const getCarByIdController = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const car = await getCarByIdService(id);
//     if (!car) return res.status(404).json({ message: "Car not found" });
//     return res.status(200).json({ data: car });
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// export const updateCarController = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const car = req.body;
//     const updated = await updateCarService(id, car);
//     return res.status(200).json({ message: "Car updated", data: updated });
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// export const deleteCarController = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     await deleteCarService(id);
//     return res.status(204).send();
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };

import { Request, Response } from "express";
import { createCarService, getCarService, getCarByIdService, updateCarService, deleteCarService } from '../services/car.service';

// create car controller
export const createCarController = async (req: Request, res: Response) => {
  try {
    const car = req.body;
    const created = await createCarService(car);
    if (!created) return res.json({ message: "Car not created" });
    return res.status(201).json({ message: created });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// get all cars controller
export const getCarController = async (_req: Request, res: Response) => {
  try {
    const cars = await getCarService();
    if (!cars || cars.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }
    return res.status(200).json(cars);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};


// get car by id controller
export const getCarByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const car = await getCarByIdService(id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    return res.status(200).json({ data: car });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// update car by id controller
export const updateCarController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const car = req.body;
    const existingCar = await getCarByIdService(id);
    if (!existingCar) return res.status(404).json({ message: "Car not found" });

    const updated = await updateCarService(id, car);
    if (!updated) return res.status(400).json({ message: "Car not updated" });
    return res.status(200).json({ message: "Car updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// delete car by id controller
export const deleteCarController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const existingCar = await getCarByIdService(id);
    if (!existingCar) return res.status(404).json({ message: "Car not found" });

    const deleted = await deleteCarService(id);
    if (!deleted) return res.status(400).json({ message: "Car not deleted" });

    return res.status(204).json({ message: "Car deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};