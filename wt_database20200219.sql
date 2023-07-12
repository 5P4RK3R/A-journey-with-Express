-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 18, 2020 at 05:52 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.1.27

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

CREATE TABLE `answer` (
  `patient_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` varchar(256) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `answer`
--

INSERT INTO `answer` (`patient_id`, `question_id`, `answer`) VALUES
(1, 1, 'answer 1 for p1'),
(1, 2, 'answer2 for p2'),
(2, 1, 'answer 1 for p2'),
(2, 2, 'answer 2 for p2');

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `Username` varchar(30) NOT NULL,
  `Fname` varchar(30) NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `CID` int(5) NOT NULL,
  `DID` int(5) NOT NULL,
  `DOV` date NOT NULL,
  `slot_id` int(11) NOT NULL,
  `Timestamp` datetime NOT NULL,
  `Time` time NOT NULL default CURRENT_TIMESTAMP,
  `Status` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`id`, `pid`, `Username`, `Fname`, `Gender`, `CID`, `DID`, `DOV`, `slot_id`, `Timestamp`, `Time`, `Status`) VALUES
(1, 1, 'user', 'patient', 'male', 1, 1, '2017-11-08', 25, '2017-11-05 16:43:48', '00:00:00', 'Booking Registered.Wait for the update'),
(2, 1, 'user', 'thiru', 'male', 2, 1, '2020-02-15', 6, '2020-02-12 09:41:59', '00:00:00', 'Booking Registered.'),
(3, 2, 'thirumudi1', 'thirumudi', 'male', 2, 2, '2020-02-12', 35, '2020-02-12 13:28:31', '00:00:00', 'Booking Registered.Wait for the update'),
(4, 2, 'thirumudi1', 'Thirumudi', 'male', 2, 2, '2020-02-19', 12, '2020-02-18 07:02:23', '00:00:00', 'Booking Registered.Wait for the update'),
(5, 1, 'user', 'kishore', 'male', 2, 2, '2020-02-18', 10, '2020-02-18 09:40:46', '00:00:00', 'Booking Registered.Wait for the update'),
(6, 1, 'user', 'kishore', 'male', 2, 2, '2020-02-14', 8, '2020-02-13 15:17:51', '16:30:00', 'Booking Registered.Wait for the update'),
(7, 1, 'user', 'Vinoth', 'male', 2, 1, '2020-02-19', 11, '2020-02-18 07:01:22', '00:00:00', 'Booking Registered.Wait for the update'),
(8, 1, 'user', 'kishore', 'male', 2, 2, '2020-02-19', 10, '2020-02-17 16:43:34', '00:00:00', 'Booking Registered.Wait for the update'),
(12, 1, 'user', 'fname', 'Male', 2, 2, '2020-02-19', 3, '2017-11-05 16:43:48', '00:00:00', 'book');

-- --------------------------------------------------------

--
-- Table structure for table `clinic`
--

CREATE TABLE `clinic` (
  `cid` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `address` varchar(100) NOT NULL,
  `town` varchar(30) NOT NULL,
  `city` varchar(30) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `mid` varchar(5) DEFAULT NULL
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

CREATE TABLE `doctor` (
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
  `region` varchar(30) NOT NULL
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

CREATE TABLE `doctor_advice` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `prescription` text COLLATE utf8_bin NOT NULL,
  `ivf` varchar(10) COLLATE utf8_bin NOT NULL,
  `followup` varchar(10) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `doctor_advice`
--

INSERT INTO `doctor_advice` (`id`, `booking_id`, `prescription`, `ivf`, `followup`) VALUES
(1, 1, 'sample1', 'no', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_availability`
--

CREATE TABLE `doctor_availability` (
  `cid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  `day` varchar(50) NOT NULL,
  `starttime` time NOT NULL,
  `endtime` time NOT NULL
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

CREATE TABLE `manager` (
  `mid` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `gender` varchar(30) NOT NULL,
  `dob` date NOT NULL,
  `contact` bigint(20) NOT NULL,
  `address` varchar(100) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `region` varchar(30) NOT NULL
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

CREATE TABLE `manager_clinic` (
  `cid` int(11) NOT NULL,
  `mid` int(11) NOT NULL
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

CREATE TABLE `patient` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `gender` varchar(30) NOT NULL,
  `dob` date NOT NULL,
  `contact` bigint(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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

CREATE TABLE `question` (
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

CREATE TABLE `slot` (
  `id` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `clinic`
--
ALTER TABLE `clinic`
  ADD PRIMARY KEY (`cid`,`name`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`did`);

--
-- Indexes for table `doctor_advice`
--
ALTER TABLE `doctor_advice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctor_availability`
--
ALTER TABLE `doctor_availability`
  ADD PRIMARY KEY (`cid`,`did`,`day`,`starttime`,`endtime`);

--
-- Indexes for table `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`mid`);

--
-- Indexes for table `manager_clinic`
--
ALTER TABLE `manager_clinic`
  ADD PRIMARY KEY (`cid`,`mid`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`email`,`username`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `slot`
--
ALTER TABLE `slot`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `doctor_advice`
--
ALTER TABLE `doctor_advice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `slot`
--
ALTER TABLE `slot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
