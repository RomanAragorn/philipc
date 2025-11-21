-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: philipc
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (1,1,3,14000.00,'Rejected','2025-11-21 12:07:08'),(2,1,4,15000.00,'Accepted','2025-11-21 12:07:08'),(3,2,5,1000.00,'Pending','2025-11-21 12:07:08'),(4,3,1,13000.00,'Rejected','2025-11-21 12:07:08'),(5,3,5,14000.00,'Accepted','2025-11-21 12:07:08');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'GPU','NVIDIA RTX 3060','Like New',15000.00,'Slightly used, no defects.','Metro Manila',0,'2025-11-21 12:04:51'),(2,1,'Peripherals','Logitech G502 Mouse','Well Used',1200.00,'Gaming mouse, still works great.','Makati',1,'2025-11-21 12:04:51'),(3,2,'Monitors','Samsung Odyssey G5 27\"','Brand New',14500.00,'Sealed, brand new.','Pasig',0,'2025-11-21 12:04:51'),(4,3,'CPU','Intel i7 12700K','Slightly Used',11000.00,'Clean condition.','Quezon City',1,'2025-11-21 12:04:51'),(5,4,'RAM','Corsair Vengeance 16GB 3200MHz','Brand New',2800.00,'Unused RAM.','Rizal',1,'2025-11-21 12:04:51');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,'Smooth transaction, seller is responsive',5,'2025-11-21 12:11:58'),(2,2,'Product is perfect and well-packaged',5,'2025-11-21 12:11:58');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,4,1,'2025-11-21 12:07:30'),(2,3,5,1,'2025-11-21 12:07:30');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ayse','Catampatan','ayse@gmail.com','9123456789','yazii','ayse123',NULL,NULL,'2025-11-21 12:04:01'),(2,'Denzel','Imperial','denzz@gmail.com','9234567890','redd','redd123',NULL,'https://www.facebook.com/denzel.red.imperial','2025-11-21 12:04:01'),(3,'Roman','Lopez','roman@yahoo.com','9456789012','romann','roman321',NULL,'https://www.facebook.com/romanaragorn','2025-11-21 12:04:01'),(4,'Joshua','Reyes','joshua@yahoo.com','9112233445','joshua','joshua123',NULL,NULL,'2025-11-21 12:04:01'),(5,'Joshua','Tanawan','toshh@gmail.com','9876543210','toshtosh','tosh123',NULL,'https://www.facebook.com/JoshuaCaliosTanawan','2025-11-21 12:04:01');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21 20:19:23
