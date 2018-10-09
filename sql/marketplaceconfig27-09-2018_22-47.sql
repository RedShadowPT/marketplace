# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.1.35-MariaDB-1~xenial)
# Database: marketplace
# Generation Time: 2018-09-27 21:47:07 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `config`;

CREATE TABLE `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module` varchar(32) DEFAULT NULL,
  `item` varchar(32) DEFAULT NULL,
  `item_value` mediumtext,
  `item_type` varchar(64) DEFAULT NULL,
  `Item_desc` varchar(512) DEFAULT NULL,
  `item_default_value` mediumtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_id_uindex` (`id`),
  UNIQUE KEY `config_module_item_uindex` (`module`,`item`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `config` WRITE;
/*!40000 ALTER TABLE `config` DISABLE KEYS */;

INSERT INTO `config` (`id`, `module`, `item`, `item_value`, `item_type`, `Item_desc`, `item_default_value`)
VALUES
	(1,'scheduler','fetchNodeDataEvery','5','int','Fetch Nodes Data from Lethean API every X minutes','5'),
	(2,'nodeAPI','url','https://sdp.staging.cloud.lethean.io/v1/services/search','string','Lethean API URL','https://slsf2fy3eb.execute-api.us-east-1.amazonaws.com/qa/v1/services/search'),
	(3,'geoAPI','url','https://ipapi.co/','string','geoAPI URL for IP Lookup','https://ipapi.co/'),
	(4,'mapsAPI','apikey','AIzaSyDe2QqXrbtaORvL-I0WHpiI72HxtfTz5Zo','string','GoogleMaps API Key','AIzaSyDe2QqXrbtaORvL-I0WHpiI72HxtfTz5Zo'),
	(6,'global','dnsServer1','1.1.1.1','string','DNS Server for FQDN resolution to IP','1.1.1.1'),
	(7,'global','dnsServer2','8.8.8.8','string','DNS Server for FQDN resolution to IP','8.8.8.8'),
	(10,'global','listenPort','3000','int','NodeJS Express Listen Port for API Backend','3000'),
	(12,'coinExchangeAPI','url','https://coinlib.io/api/v1/coin','string','coinlib.io Coin Data API URL','https://coinlib.io/api/v1/coin?key=b3e643cc87a81cc9&pref=USD&symbol=LTHN'),
	(13,'coinExchangeAPI','key','b3e643cc87a81cc9','string','coinlib.io API Key','Register at coinlib.io\n'),
	(14,'coinExchangeAPI','options','&pref=USD&symbol=LTHN','string','coinlib.io URL options','&pref=USD&symbol=LTHN');

/*!40000 ALTER TABLE `config` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
