CREATE DATABASE  IF NOT EXISTS `library` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `library`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: library
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authors` (
  `author_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`author_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authors`
--

LOCK TABLES `authors` WRITE;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` VALUES (13,'John','Doe','john.doe@example.com'),(14,'Jane','Doe','jane.doe@example.com'),(15,'Bob','Smith','bob.smith@example.com'),(16,'Alice','Johnson','alice.johnson@example.com'),(17,'David','Brown','david.brown@example.com'),(18,'Samantha','Wilson','samantha.wilson@example.com'),(19,'Michael','Davis','michael.davis@example.com'),(20,'Karen','Lee','karen.lee@example.com'),(21,'William','Nguyen','william.nguyen@example.com'),(22,'Jessica','Kim','jessica.kim@example.com');
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `book_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `publisher` varchar(100) DEFAULT NULL,
  `publish_date` date DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `author_id` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isbn` varchar(255) DEFAULT NULL,
  `price` int DEFAULT NULL,
  PRIMARY KEY (`book_id`),
  KEY `author_id_idx` (`author_id`),
  CONSTRAINT `author_id` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (15,'The Great Gatsby','Scribner','1925-04-10',10,13,NULL,NULL,NULL),(16,'To Kill a Mockingbird','J. B. Lippincott & Co.','1960-07-11',15,14,NULL,NULL,NULL),(17,'Pride and Prejudice','T. Egerton','1813-01-28',20,15,NULL,NULL,NULL),(18,'1984','Secker & Warburg','1949-06-08',12,16,NULL,NULL,NULL),(19,'Animal Farm','Secker & Warburg','1945-08-17',8,19,NULL,NULL,NULL),(20,'Brave New World','Chatto & Windus','1932-06-18',7,15,NULL,NULL,NULL),(21,'The Catcher in the Rye','Little, Brown and Company','1951-07-16',14,16,NULL,NULL,NULL),(22,'The Hobbit','George Allen & Unwin','1937-09-21',18,17,NULL,NULL,NULL),(23,'The Lord of the Rings','George Allen & Unwin','1954-07-29',5,17,NULL,NULL,NULL),(24,'The Hunger Games','Scholastic Corporation','2008-09-14',11,18,NULL,NULL,NULL),(25,'My title','publisher','2022-02-28',18,18,NULL,NULL,NULL);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `borrowed_books`
--

DROP TABLE IF EXISTS `borrowed_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `borrowed_books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `borrowed_date` date DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `book_id_idx` (`book_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `book_id` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `borrowed_books`
--

LOCK TABLES `borrowed_books` WRITE;
/*!40000 ALTER TABLE `borrowed_books` DISABLE KEYS */;
INSERT INTO `borrowed_books` VALUES (2,15,16,'2022-01-01','2022-01-15'),(3,16,17,'2022-02-02','2022-02-16'),(4,17,18,'2022-03-03','2022-03-17'),(5,18,19,'2022-04-04','2022-04-18'),(6,19,20,'2022-05-05','2022-05-19'),(7,20,21,'2022-06-06','2022-06-20'),(8,15,22,'2022-07-07','2022-07-21'),(9,16,16,'2022-08-08','2022-08-22'),(10,17,17,'2022-09-09','2022-09-23'),(11,18,18,'2022-10-10','2022-10-24'),(12,15,26,'2023-03-28','2023-03-28');
/*!40000 ALTER TABLE `borrowed_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `id` int NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (16,'John','Doe','john.doe@example.com','password123',0),(17,'Jane','Doe','jane.doe@example.com','abc123',0),(18,'Bob','Smith','bob.smith@example.com','pass1234',0),(19,'Alice','Johnson','alice.johnson@example.com','qwerty',0),(20,'David','Brown','david.brown@example.com','secret',0),(21,'Samantha','Wilson','samantha.wilson@example.com','password1',0),(22,'Michael','Davis','michael.davis@example.com','letmein',0),(23,'Karen','Lee','karen.lee@example.com','123abc',0),(24,'William','Nguyen','william.nguyen@example.com','changeme',0),(25,'Jessica','Kim','jessica.kim@example.com','password1234',0),(26,'Mohammed','Fawaz','mohammedfawaz507@gmail.com','fawaz',0),(27,'Ravi','Kumar','ravi.kumar@gmail.com','ravi2021',0),(28,'Ravi','Kumar','ravi.kumar@gmail.com','ravi2021',0),(29,'Ravi','Kumar','ravi.kumar@gmail.com','ravi2021',0),(30,'Ravi','Kumar','ravi.kumar@gmail.com','ravi2021',0),(31,'Ravi','Kumar','ravi.kumar@gmail.com','ravi2021',0),(33,'fawaz','moh','email@gmail.com','password',0);
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

-- Dump completed on 2023-04-18 15:31:33
