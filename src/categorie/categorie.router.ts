import { Router } from "express";
import { getCategories, getCategoryById, getCategoryByName, createCategory, updateCategory, deleteCategory } from "./categorie.controller";

export const categorieRouter = Router();

categorieRouter.get("/categories", getCategories);
categorieRouter.get("/categories/id/:cat_id", getCategoryById);
categorieRouter.get("/categories/name/:cat_name", getCategoryByName);
categorieRouter.post("/categories", createCategory);
categorieRouter.patch("/categories/:cat_id", updateCategory);
categorieRouter.delete("/categories/:cat_id", deleteCategory);
