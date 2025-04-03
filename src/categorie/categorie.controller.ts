import { Request, Response } from "express";
import prisma from "../client";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categories.findMany();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getCategoryByName = async (req: Request, res: Response) => {
  try {
    const categorieName = String(req.params.cat_name);

    const categorie = await prisma.categories.findFirst({
      where: {
        cat_name: {
          equals: categorieName,
          mode: 'insensitive' 
        }
      }
    });

    if (!categorie) {
      res.status(404).send({ error: "Genre not found" });
    } else {
      res.status(200).send(categorie);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.cat_id);

    if (isNaN(categoryId)) {
      res.status(400).send({ error: "Invalid category ID" });
    } else {
      const category = await prisma.categories.findUnique({
        where: {
          cat_id: categoryId,
        },
      });
      if (!category) {
        res.status(404).send({ error: "Category not found" });
      } else {
        res.status(200).send(category);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { cat_name } = req.body;

    if (!cat_name) {
      res.status(400).send({ error: "Category name is required" });
    } else {
      const maxCategory = await prisma.categories.findFirst({
        orderBy: {
          cat_id: "desc",
        },
      });
      const nextId = maxCategory ? maxCategory.cat_id + 1 : 1;

      const category = await prisma.categories.create({
        data: {
          cat_id: nextId,
          cat_name,
        },
      });

      res.status(201).send(category);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.cat_id);
    const { cat_name } = req.body;

    if (isNaN(categoryId)) {
      res.status(400).send({ error: "Invalid category ID" });
    } else if (!cat_name) {
      res.status(400).send({ error: "Category name is required" });
    } else {
      const existingCategory = await prisma.categories.findUnique({
        where: {
          cat_id: categoryId,
        },
      });

      if (!existingCategory) {
        res.status(404).send({ error: "Category not found" });
      } else {
        const category = await prisma.categories.update({
          where: {
            cat_id: categoryId,
          },
          data: {
            cat_name,
          },
        });

        res.status(200).send(category);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.cat_id);

    if (isNaN(categoryId)) {
      res.status(400).send({ error: "Invalid category ID" });
    } else {
      const existingCategory = await prisma.categories.findUnique({
        where: {
          cat_id: categoryId,
        },
      });

      if (!existingCategory) {
        res.status(404).send({ error: "Category not found" });
      } else {
        // Vérifier s'il y a des principals associés à cette catégorie
        const associatedPrincipals = await prisma.principal.findMany({
          where: {
            cat_id: categoryId,
          },
        });

        if (associatedPrincipals.length > 0) {
          res.status(409).send({
            error: "Cannot delete category: it is associated with principals",
            count: associatedPrincipals.length,
          });
        } else {
          await prisma.categories.delete({
            where: {
              cat_id: categoryId,
            },
          });

          res.status(204).send([]);
        }
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
