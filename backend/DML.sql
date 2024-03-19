/*
    Group 201 Project
    Data Manipulation Queries
    
    last edited: 2/22/24
    current source URL: https://web.engr.oregonstate.edu/~almalehb/cs340/index.html

*/
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------DELIVERIES--------------------------------------------
-- -----------------------------------------------------
-- Get delivery data
-- -----------------------------------------------------
SELECT deliveryId AS `did`, 
ingredientId AS `iid`, 
supplierId AS `sid`, 
restaurantId AS `rid`, 
deliveryDate AS `Delivery Date`
FROM Deliveries
WHERE deliveryId = :delivery_ID_Selected;

-- -----------------------------------------------------
-- Insert a new delivery
-- -----------------------------------------------------
INSERT INTO Deliveries (ingredientId, supplierId, restaurantId, deliveryDate)
VALUES (:iidInput, :sidInput, :ridInput, :deliveryDateInput);

-- -----------------------------------------------------
-- Update a delivery
-- -----------------------------------------------------
UPDATE Deliveries
SET ingredientId = :newIidInput,
supplierId = :newSidInput,
restaurantId = :newRidInput,
deliveryDate = :newDeliveryDate
WHERE deliveryId = :deliveryIdInput;

-- -----------------------------------------------------
-- Delete a delivery
-- -----------------------------------------------------
DELETE FROM Deliveries
WHERE deliveryId = :deliveryIdInput;

-- -------------------------------------DISHES------------------------------------------------
-- -----------------------------------------------------
-- get all Dishes and their main Ingredient names for a list Dishes page:
-- -----------------------------------------------------
SELECT Dishes.dishId, 
Dishes.dishName, 
Ingredients.ingName AS `main ingredient`
FROM Dishes
INNER JOIN DishIngredients ON Dishes.dishId = DishIngredients.dishId
INNER JOIN Ingredients ON DishIngredients.ingredientId = Ingredients.ingredientId;

-- -----------------------------------------------------
-- Insert a new dish
-- -----------------------------------------------------
INSERT INTO Dishes (dishName, dishType) 
VALUES (:dishNameInput, :dishTypeInput);

-- -----------------------------------------------------
-- Update a new dish
-- -----------------------------------------------------
UPDATE Dishes
SET dishName = :newDishName,
dishType = :newDishType
WHERE dishId = :dishIdInput;

-- -----------------------------------------------------
-- Delete a dish
-- -----------------------------------------------------
DELETE FROM Dishes
WHERE dishId = :dishIdInput;

-- -----------------------------------INGREDIENTS--------------------------------------------
-- -----------------------------------------------------
-- Get ingredients data
-- -----------------------------------------------------
SELECT ingredientId AS `iid`, 
ingName AS `ingredient name`, 
ingType AS `ingredient type`, 
amntOrdered AS `# ordered`, 
totalCost AS `total cost`
FROM Ingredients
WHERE ingredientId = :ingredientIdInput;

-- -----------------------------------------------------
-- Insert new ingredient
-- -----------------------------------------------------
INSERT INTO Ingredients (ingName, ingType, amntOrdered, totalCost) 
VALUES (:ingNameInput, :ingTypeInput, :amntOrderedInput, :totalCostInput);

-- -----------------------------------------------------
-- Update an ingredient
-- -----------------------------------------------------
UPDATE Ingredients
SET ingName = :newIngName,
ingType = :newIngType,
amntOrdered = :newamntOrdered,
totalCost = :newTotalCost
WHERE ingredientId = :ingredientIdInput;

-- -----------------------------------------------------
-- Delete an ingredient
-- -----------------------------------------------------
DELETE FROM Ingredients
WHERE ingredientId = :ingredientIdInput;

-- -----------------------------------------MENUS--------------------------------------------
-- -----------------------------------------------------
-- Get a menu's data
-- -----------------------------------------------------
SELECT restaurantId AS `rid`, 
menuType AS `menu type`, 
dateUpdated AS `last updated`
FROM Menus
WHERE menuId = :menuIdInput;

-- -----------------------------------------------------
-- Insert a new menu:
-- -----------------------------------------------------
INSERT INTO Menus (restaurantId, menuType, dateUpdated) 
VALUES (:restaurantIdInput, :menuTypeInput, :dateUpdatedInput);

-- -----------------------------------------------------
-- Update a menu
-- -----------------------------------------------------
UPDATE Menus
SET restaurantId = newrestaurantId, 
menuType = newMenuType, 
dateUpdated = newDateUpdated
WHERE menuId = :menuIdInput;

-- -----------------------------------------------------
-- delete a menu
-- -----------------------------------------------------
DELETE FROM Menus
WHERE menuId = :menuIdInput;

-- ------------------------------------RESTAURANTS--------------------------------------------
-- -----------------------------------------------------
-- Get a restaurant's data
-- -----------------------------------------------------
SELECT restaurantId AS `rid`, location, managerName AS `manager name`
FROM Restaurants
WHERE restaurantId = :restaurant_ID_Selected_From_Restaurant_Page;

-- -----------------------------------------------------
-- get all Restaurants with their associated Suppliers:
-- -----------------------------------------------------
SELECT Restaurants.restaurantId, Suppliers.supplierId, Restaurants.location AS RestaurantLocation, Suppliers.suppName AS Supplier 
FROM Restaurants 
INNER JOIN RestaurantSuppliers ON Restaurants.restaurantId = RestaurantSuppliers.restaurantId 
INNER JOIN Suppliers ON RestaurantSuppliers.supplierId = Suppliers.supplierId;

-- -----------------------------------------------------
-- Insert a new restaurant
-- -----------------------------------------------------
INSERT INTO Restaurants (location, managerName) 
VALUES (:locationInput, :managerNameInput);

-- -----------------------------------------------------
-- update a Restaurant's data based on submission of the update Restaurant form:
-- -----------------------------------------------------
UPDATE Restaurants 
SET location = :locationInput, 
managerName = :managerNameInput
WHERE restaurantId = :restaurant_Id_From_Update_Form;

-- -----------------------------------------------------
-- Delete a restaurant
-- -----------------------------------------------------
DELETE FROM Restaurants
WHERE restaurantId = :restaurantIdInput;

-- --------------------------------------SUPPLIERS--------------------------------------------
-- -----------------------------------------------------
-- Get a supplier's data
-- -----------------------------------------------------
SELECT SuppName AS `Supplier`, contactInfo AS `contact info`, specialty 
FROM Suppliers
WHERE supplierId = :supplierIdInput;

-- -----------------------------------------------------
-- get all suppliers with their specialties:
-- -----------------------------------------------------
SELECT SuppName, specialty 
FROM Suppliers;

-- -----------------------------------------------------
-- get all Supplier Ids and names to populate Suppliers dropdown:
-- -----------------------------------------------------
SELECT supplierId AS `sid`, suppName AS `Supplier` 
FROM Suppliers;

-- -----------------------------------------------------
-- Insert a new supplier
-- -----------------------------------------------------
INSERT INTO Suppliers (SuppName, contactInfo, specialty) 
VALUES (:suppNameInput, :contactInfoInput, :specialtyInput);

-- -----------------------------------------------------
-- Update a supplier
-- -----------------------------------------------------
UPDATE Suppliers
SET suppName = newSuppName,
contactInfo = newContactInfo,
specialty = newSpecialty
WHERE supplierId = :supplierIdInput;

-- -----------------------------------------------------
-- Delete a supplier
-- -----------------------------------------------------
DELETE FROM Suppliers
WHERE supplierId = :supplierIdInput;

-- --------------------------------------DISHINGREDIENTS--------------------------------------
-- -----------------------------------------------------
-- Get DishIngredients data
-- -----------------------------------------------------
SELECT dishId, ingredientId 
FROM DishIngredients
WHERE dishIngredientId = :dishIngredientIdInput;

-- -----------------------------------------------------
-- associate a dish with an ingredient (M:N relationship addition):
-- -----------------------------------------------------
INSERT INTO DishIngredients (dishId, ingredientId)
VALUES (:dishIdInput, :ingredientIdInput)

-- -----------------------------------------------------
-- Update a dishIngredient relationship
-- -----------------------------------------------------
UPDATE DishIngredients
SET dishId = :newDishId,
ingredientId = :newIngredientId
WHERE dishIngredientId = :dishIngredientIdInput;

-- -----------------------------------------------------
-- dis-associate an Ingredient from a Dish (M:N relationship deletion):
-- -----------------------------------------------------
DELETE FROM DishIngredients 
WHERE dishId = :dish_Id_Selected_From_Dish_Ingredient_List 
AND ingredientId = :ingredient_Id_Selected_From_Dish_Ingredient_List;

-- --------------------------------------MENUDISHES-------------------------------------------
-- -----------------------------------------------------
-- Get menuDish data
-- -----------------------------------------------------
SELECT menuId, dishId
FROM MenuDishes
WHERE menuDishId = :menudishIdInput;

-- -----------------------------------------------------
-- associate a dish with a menu (M:N relationship addition):
-- -----------------------------------------------------
INSERT INTO MenuDishes (menuId, dishId)
VALUES (:menuIdInput, :dishIdInput);

-- -----------------------------------------------------
-- Update a dishIngredient relationship
-- -----------------------------------------------------
UPDATE MenuDishes
SET menuId = :newMenuId,
dishId = :newDishId,
WHERE menuDishId = :menuDishIdInput;

-- --------------------------------------RESTAURANTSUPPLIERS---------------------------------
-- -----------------------------------------------------
-- Get restaurantSuppliers data
-- -----------------------------------------------------
SELECT restaurantId, supplierId 
FROM RestaurantSuppliers
WHERE restaurantSupplierId = :restaurantSupplierIdInput;

-- -----------------------------------------------------
-- associate a restaurant with a supplier (M:N relationship addition):
-- -----------------------------------------------------
INSERT INTO RestaurantSuppliers (restaurantId, supplierId)
VALUES (:restaurantIdInput, :supplierIdInput)

-- -----------------------------------------------------
-- Update a restaurantSuppliers relationship
-- -----------------------------------------------------
UPDATE RestaurantSuppliers
SET restaurantId = :newRestaurantId,
supplierId = :newSupplierId
WHERE restaurantSupplierId = :restaurantSupplierIdInput;

-- --------------------------------------SUPPLIERINGREDIENTS----------------------------------
-- -----------------------------------------------------
-- Get supplierIngredients data
-- -----------------------------------------------------
SELECT supplierId, ingredientId 
FROM SupplierIngredients
WHERE supplierIngredientId = :supplierIngredientIdInput;

-- -----------------------------------------------------
-- associate a supplier with an ingredient (M:N relationship addition):
-- -----------------------------------------------------
INSERT INTO SupplierIngredients (supplierId, ingredientId)
VALUES (:supplierIdInput, :ingredientIdInput)

-- -----------------------------------------------------
-- Update a supplierIngredient relationship
-- -----------------------------------------------------
UPDATE SupplierIngredients
SET supplierId = :newSupplierId,
ingredientId = :newIngredientId
WHERE supplierIngredientId = :supplierIngredientIdInput;

SET FOREIGN_KEY_CHECKS=1;



