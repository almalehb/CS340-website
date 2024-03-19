-- Group 201 Restaurant Database
-- Host: classmysql.engr.oregonstate.edu  

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Deliveries`
--

DROP TABLE IF EXISTS `Deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Deliveries` (
  `deliveryId` int(11) NOT NULL AUTO_INCREMENT,
  `ingredientId` int(11) DEFAULT NULL,
  `supplierId` int(11) DEFAULT NULL,
  `restaurantId` int(11) DEFAULT NULL,
  `deliveryDate` date NOT NULL,
  PRIMARY KEY (`deliveryId`),
  KEY `ingredientId` (`ingredientId`),
  KEY `supplierId` (`supplierId`),
  KEY `restaurantId` (`restaurantId`),
  CONSTRAINT `Deliveries_ibfk_1` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredients` (`ingredientId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Deliveries_ibfk_2` FOREIGN KEY (`supplierId`) REFERENCES `Suppliers` (`supplierId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Deliveries_ibfk_3` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurants` (`restaurantId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Deliveries`
--

LOCK TABLES `Deliveries` WRITE;
/*!40000 ALTER TABLE `Deliveries` DISABLE KEYS */;
INSERT INTO `Deliveries` VALUES (1,1,4,1,'2024-02-07'),(2,2,2,2,'2024-02-06'),(3,3,1,3,'2024-02-05'),(4,5,1,1,'2024-02-04');
/*!40000 ALTER TABLE `Deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DishIngredients`
--

DROP TABLE IF EXISTS `DishIngredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DishIngredients` (
  `dishIngredientId` int(11) NOT NULL AUTO_INCREMENT,
  `dishId` int(11) NOT NULL,
  `ingredientId` int(11) NOT NULL,
  PRIMARY KEY (`dishIngredientId`),
  KEY `dishId` (`dishId`),
  KEY `ingredientId` (`ingredientId`),
  CONSTRAINT `DishIngredients_ibfk_1` FOREIGN KEY (`dishId`) REFERENCES `Dishes` (`dishId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `DishIngredients_ibfk_2` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredients` (`ingredientId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DishIngredients`
--

LOCK TABLES `DishIngredients` WRITE;
/*!40000 ALTER TABLE `DishIngredients` DISABLE KEYS */;
INSERT INTO `DishIngredients` VALUES (1,1,1),(2,2,2),(3,3,2),(4,4,2),(5,5,1),(6,6,4);
/*!40000 ALTER TABLE `DishIngredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Dishes`
--

DROP TABLE IF EXISTS `Dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Dishes` (
  `dishId` int(11) NOT NULL AUTO_INCREMENT,
  `dishName` varchar(50) NOT NULL,
  `dishType` varchar(50) NOT NULL,
  PRIMARY KEY (`dishId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Dishes`
--

LOCK TABLES `Dishes` WRITE;
/*!40000 ALTER TABLE `Dishes` DISABLE KEYS */;
INSERT INTO `Dishes` VALUES (1,'Quesadilla','Entree'),(2,'Empanadas','Entree'),(3,'Chicken Fingers','Entree'),(4,'Chicken Fries','Appetizer'),(5,'Mozzarella Sticks','Appetizer'),(6,'Popcorn Shrimp','Appetizer'),(7,'Cheese Cake','Dessert'),(8,'Vanilla Ice Cream','Dessert'),(9,'Mojito','Drink'),(10,'Margarita','Drink');
/*!40000 ALTER TABLE `Dishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ingredients`
--

DROP TABLE IF EXISTS `Ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Ingredients` (
  `ingredientId` int(11) NOT NULL AUTO_INCREMENT,
  `ingredientName` varchar(50) NOT NULL,
  `ingredientType` varchar(50) NOT NULL,
  `amountOrdered` int(11) NOT NULL,
  `totalCost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ingredientId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ingredients`
--

LOCK TABLES `Ingredients` WRITE;
/*!40000 ALTER TABLE `Ingredients` DISABLE KEYS */;
INSERT INTO `Ingredients` VALUES (1,'Oaxaca Cheese','Dairy',3,83.00),(2,'Chicken','Meat',5,66.00),(3,'Tequila','Alcohol',3,95.00),(4,'Shrimp','Seafood',20,81.00),(5,'Potatoes','Vegetable',30,89.00);
/*!40000 ALTER TABLE `Ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MenuDishes`
--

DROP TABLE IF EXISTS `MenuDishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MenuDishes` (
  `menuDishId` int(11) NOT NULL AUTO_INCREMENT,
  `menuId` int(11) NOT NULL,
  `dishId` int(11) NOT NULL,
  PRIMARY KEY (`menuDishId`),
  KEY `menuId` (`menuId`),
  KEY `dishId` (`dishId`),
  CONSTRAINT `MenuDishes_ibfk_1` FOREIGN KEY (`menuId`) REFERENCES `Menus` (`menuId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `MenuDishes_ibfk_2` FOREIGN KEY (`dishId`) REFERENCES `Dishes` (`dishId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MenuDishes`
--

LOCK TABLES `MenuDishes` WRITE;
/*!40000 ALTER TABLE `MenuDishes` DISABLE KEYS */;
INSERT INTO `MenuDishes` VALUES (1,1,1),(2,1,2),(3,1,4),(4,4,1),(5,4,2),(6,4,4),(7,6,1),(8,6,4);
/*!40000 ALTER TABLE `MenuDishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Menus`
--

DROP TABLE IF EXISTS `Menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Menus` (
  `menuId` int(11) NOT NULL AUTO_INCREMENT,
  `restaurantId` int(11) NOT NULL,
  `menuType` varchar(50) NOT NULL,
  `dateUpdated` date DEFAULT NULL,
  PRIMARY KEY (`menuId`),
  KEY `restaurantId` (`restaurantId`),
  CONSTRAINT `Menus_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurants` (`restaurantId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Menus`
--

LOCK TABLES `Menus` WRITE;
/*!40000 ALTER TABLE `Menus` DISABLE KEYS */;
INSERT INTO `Menus` VALUES (1,1,'Main','2024-02-05'),(2,1,'Desserts','2024-01-03'),(3,1,'Drinks','2023-03-24'),(4,2,'Main','2023-05-06'),(5,2,'Drinks','2023-06-11'),(6,3,'Main','2024-01-11'),(7,3,'Desserts','2021-01-09');
/*!40000 ALTER TABLE `Menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RestaurantSuppliers`
--

DROP TABLE IF EXISTS `RestaurantSuppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RestaurantSuppliers` (
  `restaurantSupplierId` int(11) NOT NULL AUTO_INCREMENT,
  `restaurantId` int(11) NOT NULL,
  `supplierId` int(11) NOT NULL,
  PRIMARY KEY (`restaurantSupplierId`),
  KEY `restaurantId` (`restaurantId`),
  KEY `supplierId` (`supplierId`),
  CONSTRAINT `RestaurantSuppliers_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurants` (`restaurantId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RestaurantSuppliers_ibfk_2` FOREIGN KEY (`supplierId`) REFERENCES `Suppliers` (`supplierId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RestaurantSuppliers`
--

LOCK TABLES `RestaurantSuppliers` WRITE;
/*!40000 ALTER TABLE `RestaurantSuppliers` DISABLE KEYS */;
INSERT INTO `RestaurantSuppliers` VALUES (1,1,1),(2,1,2),(3,2,3),(4,2,4),(5,3,1),(6,3,5);
/*!40000 ALTER TABLE `RestaurantSuppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Restaurants`
--

DROP TABLE IF EXISTS `Restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Restaurants` (
  `restaurantId` int(11) NOT NULL AUTO_INCREMENT,
  `location` varchar(200) NOT NULL,
  `managerName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`restaurantId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Restaurants`
--

LOCK TABLES `Restaurants` WRITE;
/*!40000 ALTER TABLE `Restaurants` DISABLE KEYS */;
INSERT INTO `Restaurants` VALUES (1,'154 Saint Street, Manhattan, NY 10016','Kevin Bacon'),(2,'65 King Avenue, Astoria, NY 10054','Maria Campbell'),(3,'14 Elephant Lane, Los Angeles, CA 90008','Jose Guiverra');
/*!40000 ALTER TABLE `Restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SupplierIngredients`
--

DROP TABLE IF EXISTS `SupplierIngredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SupplierIngredients` (
  `supplierIngredientId` int(11) NOT NULL AUTO_INCREMENT,
  `supplierId` int(11) NOT NULL,
  `ingredientId` int(11) NOT NULL,
  PRIMARY KEY (`supplierIngredientId`),
  KEY `supplierId` (`supplierId`),
  KEY `ingredientId` (`ingredientId`),
  CONSTRAINT `SupplierIngredients_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `Suppliers` (`supplierId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SupplierIngredients_ibfk_2` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredients` (`ingredientId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SupplierIngredients`
--

LOCK TABLES `SupplierIngredients` WRITE;
/*!40000 ALTER TABLE `SupplierIngredients` DISABLE KEYS */;
INSERT INTO `SupplierIngredients` VALUES (1,1,5),(2,2,2),(3,3,4),(4,4,1),(5,5,3);
/*!40000 ALTER TABLE `SupplierIngredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Suppliers`
--

DROP TABLE IF EXISTS `Suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Suppliers` (
  `supplierId` int(11) NOT NULL AUTO_INCREMENT,
  `supplierName` varchar(50) NOT NULL,
  `contactInfo` varchar(12) NOT NULL,
  `specialty` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`supplierId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Suppliers`
--

LOCK TABLES `Suppliers` WRITE;
/*!40000 ALTER TABLE `Suppliers` DISABLE KEYS */;
INSERT INTO `Suppliers` VALUES (1,'Jeffs Veges','915-345-6575','vegetables'),(2,'Carne Street','865-234-2334','Meats'),(3,'SeaFeed','765-176-4545','Seafood'),(4,'Farming Pros','980-456-2231','Fruits and Cheese'),(5,'Ice Temple','687-222-5555','Ice Cream');
/*!40000 ALTER TABLE `Suppliers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;