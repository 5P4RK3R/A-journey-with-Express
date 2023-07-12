-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: wt_database
-- ------------------------------------------------------
-- Server version	8.0.19

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
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` int NOT NULL,
  `Username` varchar(30) NOT NULL,
  `Fname` varchar(30) NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `useraddress` varchar(100) DEFAULT NULL,
  `userphoneno` varchar(10) DEFAULT NULL,
  `useremailId` varchar(20) DEFAULT NULL,
  `userlocation` varchar(10) DEFAULT NULL,
  `CID` int NOT NULL,
  `DID` int NOT NULL,
  `doctorFee` int NOT NULL,
  `DOV` date NOT NULL,
  `slot_id` int NOT NULL,
  `Timestamp` datetime NOT NULL,
  `Status` varchar(100) NOT NULL,
  `follow_up_id` int NOT NULL DEFAULT '0',
  `visit_type` varchar(25) NOT NULL,
  `appointment_type` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (1,1,'user','Kesavan','male',NULL,NULL,NULL,NULL,2,2,0,'2020-02-21',19,'2020-02-19 11:20:22','Booking Registered.Wait for the update',3,'firsttime','video'),(2,2,'thirumudi1','Hema','female',NULL,NULL,NULL,NULL,2,2,0,'2020-02-19',10,'2020-02-19 11:28:36','Booking Registered.Wait for the update',0,'firsttime','video'),(3,1,'user','fname','Male',NULL,NULL,NULL,NULL,2,2,0,'2020-02-19',3,'2017-11-05 16:43:48','book',0,'in person','video'),(4,1,'user','user','male',NULL,NULL,NULL,NULL,1,1,0,'2020-03-03',33,'2016-00-00 00:00:00','status',0,'firstTime','video'),(5,1,'user','user','male',NULL,NULL,NULL,NULL,1,1,0,'2020-03-01',32,'2020-03-01 15:30:00','status',0,'firstTime','clinic'),(6,1,'user','user','male',NULL,NULL,NULL,NULL,1,1,0,'2020-03-02',34,'2020-03-02 16:30:00','status',0,'firstTime','clinic'),(7,2,'thirumudi','thirumudi','male',NULL,NULL,NULL,NULL,0,2,0,'2020-03-02',35,'2020-03-02 17:00:00','status',0,'firstTime','ivf'),(8,2,'thirumudi','thirumudi','male',NULL,NULL,NULL,NULL,0,2,0,'2020-03-02',36,'2020-03-02 17:30:00','status',0,'firstTime','ivf'),(9,2,'thirumudi','thirumudi','male','wdawdaw','84446655','re szff','Chennai',0,2,0,'2020-03-05',27,'2020-03-05 13:00:00','status',0,'firstTime','ivf');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-02-28 21:14:13
