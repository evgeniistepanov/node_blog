-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 07, 2016 at 01:42 PM
-- Server version: 5.5.48
-- PHP Version: 5.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_blog`
--

-- --------------------------------------------------------

--
-- Table structure for table `post_category`
--

CREATE TABLE IF NOT EXISTS `post_category` (
  `post_id` bigint(20) unsigned NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `post_category`
--

INSERT INTO `post_category` (`post_id`, `category_id`) VALUES
(51, 4),
(50, 3),
(51, 1),
(49, 4),
(49, 2),
(49, 5),
(48, 1),
(47, 5),
(46, 4),
(46, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `post_category`
--
ALTER TABLE `post_category`
  ADD KEY `post_id` (`post_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `post_category`
--
ALTER TABLE `post_category`
  ADD CONSTRAINT `post_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  ADD CONSTRAINT `post_category_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
