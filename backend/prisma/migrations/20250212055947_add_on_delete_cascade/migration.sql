-- DropForeignKey
ALTER TABLE `DishIngredients` DROP FOREIGN KEY `DishIngredients_dish_id_fkey`;

-- DropForeignKey
ALTER TABLE `DishIngredients` DROP FOREIGN KEY `DishIngredients_ingredient_id_fkey`;

-- DropForeignKey
ALTER TABLE `MenuItem` DROP FOREIGN KEY `MenuItem_dish_id_fkey`;

-- DropIndex
DROP INDEX `DishIngredients_ingredient_id_fkey` ON `DishIngredients`;

-- DropIndex
DROP INDEX `MenuItem_dish_id_fkey` ON `MenuItem`;

-- AddForeignKey
ALTER TABLE `DishIngredients` ADD CONSTRAINT `DishIngredients_dish_id_fkey` FOREIGN KEY (`dish_id`) REFERENCES `Dish`(`dish_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DishIngredients` ADD CONSTRAINT `DishIngredients_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `Ingredients`(`ingredient_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_dish_id_fkey` FOREIGN KEY (`dish_id`) REFERENCES `Dish`(`dish_id`) ON DELETE CASCADE ON UPDATE CASCADE;
