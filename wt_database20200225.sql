-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 20, 2020 at 01:58 PM
-- Server version: 5.7.21
-- PHP Version: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wt_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
CREATE TABLE IF NOT EXISTS `answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` varchar(256) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `answer`
--

INSERT INTO `answer` (`id`, `patient_id`, `question_id`, `answer`) VALUES
(1, 2, 1, 'answer1'),
(2, 2, 2, 'answer2'),
(3, 2, 3, 'answer3'),
(4, 2, 4, 'answer1'),
(5, 2, 5, 'answer2'),
(6, 2, 6, 'answer3'),
(7, 2, 7, 'answer4'),
(8, 2, 8, 'answer5'),
(9, 2, 9, 'answer6'),
(10, 2, 10, 'answer7'),
(11, 2, 11, 'answer8'),
(12, 2, 12, 'answer9'),
(13, 2, 13, 'answer10');

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
CREATE TABLE IF NOT EXISTS `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `Username` varchar(30) NOT NULL,
  `Fname` varchar(30) NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `CID` int(5) NOT NULL,
  `DID` int(5) NOT NULL,
  `DOV` date NOT NULL,
  `slot_id` int(11) NOT NULL,
  `Timestamp` datetime NOT NULL,
  `Time` time NOT NULL,
  `Status` varchar(100) NOT NULL,
  `follow_up_id` int(11) NOT NULL,
  `visit_type` varchar(25) NOT NULL,
  `appointment_type` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`id`, `pid`, `Username`, `Fname`, `Gender`, `CID`, `DID`, `DOV`, `slot_id`, `Timestamp`, `Time`, `Status`, `follow_up_id`, `visit_type`, `appointment_type`) VALUES
(1, 1, 'user', 'Kesavan', 'male', 2, 2, '2020-02-21', 19, '2020-02-19 11:20:22', '00:00:00', 'Booking Registered.Wait for the update', 0, 'firsttime', 'video'),
(2, 2, 'thirumudi1', 'Hema', 'female', 2, 2, '2020-02-19', 10, '2020-02-19 11:28:36', '00:00:00', 'Booking Registered.Wait for the update', 0, 'firsttime', 'video');

-- --------------------------------------------------------

--
-- Table structure for table `clinic`
--

DROP TABLE IF EXISTS `clinic`;
CREATE TABLE IF NOT EXISTS `clinic` (
  `cid` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `address` varchar(100) NOT NULL,
  `town` varchar(30) NOT NULL,
  `city` varchar(30) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `mid` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`cid`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clinic`
--

INSERT INTO `clinic` (`cid`, `name`, `address`, `town`, `city`, `contact`, `mid`) VALUES
(1, 'Clinic', 'XYZ apartment, CST', 'CST', 'Mumbai', 9999988888, '1'),
(2, 'Ram', 'jvl plaza', 'cst', 'chennai', 9999999999, '2');

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
CREATE TABLE IF NOT EXISTS `doctor` (
  `did` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `gender` varchar(30) NOT NULL,
  `dob` date NOT NULL,
  `experience` int(11) NOT NULL,
  `specialization` varchar(30) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `address` varchar(100) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `region` varchar(30) NOT NULL,
  PRIMARY KEY (`did`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`did`, `name`, `gender`, `dob`, `experience`, `specialization`, `contact`, `address`, `username`, `password`, `region`) VALUES
(1, 'doctor', 'male', '1980-01-01', 10, 'Orthodontist', 9999999999, 'XYZ tower, CST', 'doctor', 'doctor', 'Mumbai'),
(2, 'velu', 'male', '2010-02-12', 2, 'Orthodonisht', 1212121121, 'jvl plaza', 'velu', 'velu', 'chennai');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_advice`
--

DROP TABLE IF EXISTS `doctor_advice`;
CREATE TABLE IF NOT EXISTS `doctor_advice` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `prescription` text COLLATE utf8_bin NOT NULL,
  `followup` varchar(10) COLLATE utf8_bin NOT NULL,
  `type` varchar(25) COLLATE utf8_bin NOT NULL,
  `clinic_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `doctor_advice`
--

INSERT INTO `doctor_advice` (`id`, `booking_id`, `prescription`, `followup`, `type`, `clinic_id`) VALUES
(1, 1, 'sample1', 'yes', 'clinic', 1);

-- --------------------------------------------------------

--
-- Table structure for table `doctor_availability`
--

DROP TABLE IF EXISTS `doctor_availability`;
CREATE TABLE IF NOT EXISTS `doctor_availability` (
  `cid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  `day` varchar(50) NOT NULL,
  `starttime` time NOT NULL,
  `endtime` time NOT NULL,
  PRIMARY KEY (`cid`,`did`,`day`,`starttime`,`endtime`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `doctor_availability`
--

INSERT INTO `doctor_availability` (`cid`, `did`, `day`, `starttime`, `endtime`) VALUES
(1, 1, 'Friday', '09:00:00', '16:00:00'),
(1, 1, 'Monday', '09:00:00', '16:00:00'),
(1, 1, 'Thursday', '09:00:00', '16:00:00'),
(1, 1, 'Tuesday', '14:00:00', '18:00:00'),
(1, 1, 'Wednesday', '14:00:00', '18:00:00'),
(2, 2, 'Friday', '04:30:00', '09:30:00'),
(2, 2, 'Monday', '04:30:00', '09:30:00'),
(2, 2, 'Saturday', '04:30:00', '09:30:00'),
(2, 2, 'Thursday', '04:30:00', '09:30:00'),
(2, 2, 'Tuesday', '04:30:00', '09:30:00'),
(2, 2, 'Wednesday', '04:30:00', '09:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
CREATE TABLE IF NOT EXISTS `manager` (
  `mid` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `gender` varchar(30) NOT NULL,
  `dob` date NOT NULL,
  `contact` bigint(20) NOT NULL,
  `address` varchar(100) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `region` varchar(30) NOT NULL,
  PRIMARY KEY (`mid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `manager`
--

INSERT INTO `manager` (`mid`, `name`, `gender`, `dob`, `contact`, `address`, `username`, `password`, `region`) VALUES
(1, 'Manager', 'male', '1990-01-01', 8888899999, 'XYZ complex CST', 'manager', 'manager', 'Mumbai'),
(2, 'Muthu', 'male', '1992-02-04', 9999999999, 'Jvl Plaza', 'muthu', 'muthu', 'chennai');

-- --------------------------------------------------------

--
-- Table structure for table `manager_clinic`
--

DROP TABLE IF EXISTS `manager_clinic`;
CREATE TABLE IF NOT EXISTS `manager_clinic` (
  `cid` int(11) NOT NULL,
  `mid` int(11) NOT NULL,
  PRIMARY KEY (`cid`,`mid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `manager_clinic`
--

INSERT INTO `manager_clinic` (`cid`, `mid`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
CREATE TABLE IF NOT EXISTS `patient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `gender` varchar(30) NOT NULL,
  `dob` date NOT NULL,
  `contact` bigint(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`id`, `name`, `gender`, `dob`, `contact`, `email`, `username`, `password`) VALUES
(1, 'user', 'male', '1985-01-01', 7897897897, 'user@test.com', 'user', 'user'),
(2, 'thirumudi', 'male', '2009-02-12', 9999999999, 'thirumudi@gmail.com', 'thirumudi1', 'thirumudi');

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
CREATE TABLE IF NOT EXISTS `question` (
  `id` int(11) DEFAULT NULL,
  `question` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `type` varchar(255) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`id`, `question`, `type`) VALUES
(1, 'Do you ride bikes for more than 3 hours in a day?', 'male'),
(2, 'Are you a driver or do you work in a hot environment?', 'male'),
(3, 'Do you wear tight underwear?', 'male'),
(4, 'Have you been diagnosed with Endometriosis?', 'female'),
(5, 'Have you been diagnosed with Thin Endometrium?', 'female'),
(6, 'Did you have repeated IVF failures in the past?', 'female'),
(7, 'Were you diagnosed with Poor Ovarian Reserve?', 'female'),
(8, 'Did you have Repeated Miscarriages in the past?', 'female'),
(9, 'Were you diagnosed with Asherman\'s Syndrome?', 'female'),
(10, 'Were you diagnosed with Hormonal Imbalance?', 'female'),
(11, 'Do you suffer from Irregular Periods?', 'female'),
(12, 'Do you suffer from Menopause issues?', 'female'),
(13, 'If your condition is not covered in any of the above, please describe?', 'female');

-- --------------------------------------------------------

--
-- Table structure for table `slot`
--

DROP TABLE IF EXISTS `slot`;
CREATE TABLE IF NOT EXISTS `slot` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `slot`
--

INSERT INTO `slot` (`id`, `start_time`, `end_time`) VALUES
(1, '00:00:00', '00:30:00'),
(2, '00:30:00', '01:00:00'),
(3, '01:00:00', '01:30:00'),
(4, '01:30:00', '02:00:00'),
(5, '02:00:00', '02:30:00'),
(6, '02:30:00', '03:00:00'),
(7, '03:00:00', '03:30:00'),
(8, '03:30:00', '04:00:00'),
(9, '04:00:00', '04:30:00'),
(10, '04:30:00', '05:00:00'),
(11, '05:00:00', '05:30:00'),
(12, '05:30:00', '06:00:00'),
(13, '06:00:00', '06:30:00'),
(14, '06:30:00', '07:00:00'),
(15, '07:00:00', '07:30:00'),
(16, '07:30:00', '08:00:00'),
(17, '08:00:00', '08:30:00'),
(18, '08:30:00', '09:00:00'),
(19, '09:00:00', '09:30:00'),
(20, '09:30:00', '10:00:00'),
(21, '10:00:00', '10:30:00'),
(22, '10:30:00', '11:00:00'),
(23, '11:00:00', '11:30:00'),
(24, '11:30:00', '12:00:00'),
(25, '12:00:00', '12:30:00'),
(26, '12:30:00', '13:00:00'),
(27, '13:00:00', '13:30:00'),
(28, '13:30:00', '14:00:00'),
(29, '14:00:00', '14:30:00'),
(30, '14:30:00', '15:00:00'),
(31, '15:00:00', '15:30:00'),
(32, '15:30:00', '16:00:00'),
(33, '16:00:00', '16:30:00'),
(34, '16:30:00', '17:00:00'),
(35, '17:00:00', '17:30:00'),
(36, '17:30:00', '18:00:00'),
(37, '18:00:00', '18:30:00'),
(38, '18:30:00', '19:00:00'),
(39, '19:00:00', '19:30:00'),
(40, '19:30:00', '20:00:00'),
(41, '20:00:00', '20:30:00'),
(42, '20:30:00', '21:00:00'),
(43, '21:00:00', '21:30:00'),
(44, '21:30:00', '22:00:00'),
(45, '22:00:00', '22:30:00'),
(46, '22:30:00', '23:00:00'),
(47, '23:00:00', '23:30:00'),
(48, '23:30:00', '24:00:00');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
