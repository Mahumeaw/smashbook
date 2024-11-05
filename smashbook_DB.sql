-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 23, 2024 at 02:13 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smashbook`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--
DROP DATABASE IF EXISTS smashbook;
CREATE DATABASE smashbook;
USE smashbook;

CREATE TABLE `admin` (
  `username` char(30) NOT NULL,
  `password` char(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bad_court`
--

CREATE TABLE `bad_court` (
  `court_id` int(2) NOT NULL,
  `court_name` varchar(20) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `slot`
--

CREATE TABLE `slot` (
  `slot_id` int(6) NOT NULL,
  `court_id` int(2) NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `date` date NOT NULL ,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `player_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `bad_court`
--
ALTER TABLE `bad_court`
  ADD PRIMARY KEY (`court_id`);

--
-- Indexes for table `slot`
--
ALTER TABLE `slot`
  ADD PRIMARY KEY (`slot_id`),
  ADD KEY `court_id` (`court_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `slot`
--
ALTER TABLE `slot`
  MODIFY `slot_id` int(6) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `slot`
--
ALTER TABLE `slot`
  ADD CONSTRAINT `courtid_fkey` FOREIGN KEY (`court_id`) REFERENCES `bad_court` (`court_id`);
COMMIT;

INSERT INTO `admin` (`username`, `password`) VALUES
('BB', '6588062'),
('Bhurinat', '47386'),
('Chawanakorn', 'Izelnwza007'),
('Drive', '6588070'),
('IT999', '123456'),
('Ize', '6588084'),
('Mahumeaw', '6588150'),
('Nakarin', '6588888'),
('Punnut', '6588142'),
('Ski', '6588065');

--
-- Dumping data for table `bad_court`
--

INSERT INTO `bad_court` (`court_id`, `court_name`, `status`) VALUES
(1, NULL, 1),
(2, NULL, 1),
(3, NULL, 1),
(4, NULL, 1),
(5, NULL, 1),
(6, NULL, 1),
(7, NULL, 1),
(8, NULL, 1),
(9, NULL, 1),
(10, NULL, 1);

--
-- Dumping data for table `slot`
--

INSERT INTO `slot` (`slot_id`, `court_id`, `price`, `date`, `start_time`, `end_time`, `player_name`) VALUES
(14, 3, 200.00, '2024-03-28', '12:42:26', '14:42:26', 'Nakarin P'),
(15, 8, 240.00, '2024-03-29', '18:34:24', '21:34:24', 'Punnut G'),
(16, 5, 240.00, '2024-03-29', '18:34:24', '21:34:24', 'Nakarin'),
(17, 6, 240.00, '2024-03-29', '18:34:24', '21:34:24', 'Nakarin'),
(18, 7, 240.00, '2024-03-29', '18:34:24', '21:34:24', 'Nakarin P'),
(19, 1, 1200.00, '2024-03-29', '12:34:24', '18:34:24', 'Punnut G'),
(20, 4, 200.00, '2024-03-29', '13:54:15', '16:54:15', 'Bhurinat'),
(28, 3, 100.00, '2024-03-29', '13:54:00', '16:54:00', 'Bhurinat K'),
(31, 5, 100.00, '2024-03-29', '13:00:00', '17:00:00', 'Izezaza'),
(32, 5, 100.00, '2024-03-29', '12:00:00', '13:00:00', 'Izezaza'),
(34, 6, 100.00, '2024-03-29', '12:00:00', '13:00:00', 'Izezaza'),
(37, 5, 100.00, '2024-03-29', '11:00:00', '12:00:00', 'Izezaza'),
(38, 5, 100.00, '2024-03-29', '10:00:00', '11:00:00', 'Izezaza'),
(40, 5, 100.00, '2024-04-15', '18:31:00', '21:31:00', 'Garfield H'),
(41, 3, 100.00, '2024-04-14', '16:32:00', '17:32:00', 'Garfield'),
(42, 4, 100.00, '2024-04-16', '19:34:00', '21:34:00', 'Garfield'),
(44, 4, 100.00, '2024-04-14', '17:37:00', '19:37:00', 'Garfield'),
(45, 5, 100.00, '2024-04-04', '19:50:00', '20:45:00', 'Garfield Kung'),
(46, 10, 100.00, '2024-04-10', '18:42:00', '21:42:00', 'Garfield'),
(47, 10, 100.00, '2024-04-30', '18:42:00', '22:42:00', 'Garfield'),
(49, 8, 100.00, '2024-05-01', '16:00:00', '19:42:00', 'Gslotarfield'),
(50, 5, 100.00, '2024-05-01', '13:20:00', '16:21:00', 'Drive'),
(58, 6, 100.00, '2024-05-01', '12:00:00', '18:55:00', 'Drive'),
(59, 7, 100.00, '2024-05-01', '12:00:00', '18:00:00', 'Beam'),
(62, 8, 100.00, '2024-05-01', '12:00:00', '13:01:00', 'Focus'),
(66, 7, 100.00, '2024-05-01', '06:30:00', '12:00:00', 'James'),
(67, 8, 100.00, '2024-05-02', '09:34:00', '12:34:00', 'Bhurinat'),
(69, 8, 100.00, '2024-05-01', '09:00:00', '12:00:00', 'Nakarin P');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

SELECT * FROM slot;
SELECT * FROM admin;