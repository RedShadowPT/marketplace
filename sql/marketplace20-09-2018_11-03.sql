# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.1.35-MariaDB-1~xenial)
# Database: marketplace
# Generation Time: 2018-09-20 10:03:33 +0000
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
	(10,'global','listenPort','3000','int','NodeJS Express Listen Port for API Backend','3000');

/*!40000 ALTER TABLE `config` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table geolocation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `geolocation`;

CREATE TABLE `geolocation` (
  `ip` varchar(50) NOT NULL,
  `providerName` varchar(100) DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `region` varchar(20) DEFAULT NULL,
  `region_code` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `country_name` varchar(100) DEFAULT NULL,
  `continent_code` varchar(11) DEFAULT NULL,
  `in_eu` tinyint(1) DEFAULT NULL,
  `latitude` mediumint(9) DEFAULT '0' COMMENT 'LAT*10000',
  `longitude` mediumint(9) DEFAULT NULL COMMENT 'LON*10000',
  `timezone` varchar(50) DEFAULT NULL,
  `asn` varchar(20) DEFAULT NULL,
  `org` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ip`),
  KEY `endpoint` (`endpoint`),
  KEY `country` (`country`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table nodes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `nodes`;

CREATE TABLE `nodes` (
  `provider` varchar(255) NOT NULL DEFAULT '' COMMENT 'Provider Hash ID',
  `id` varchar(20) DEFAULT NULL,
  `providerName` varchar(100) DEFAULT NULL,
  `providerWallet` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `cost` float DEFAULT NULL,
  `firstPrePaidMinutes` int(11) DEFAULT NULL,
  `firstVerificationsNeeded` int(11) DEFAULT NULL,
  `subsequentPrePaidMinutes` int(11) DEFAULT NULL,
  `subsequentVerificationsNeeded` int(11) DEFAULT NULL,
  `allowRefunds` tinyint(1) DEFAULT NULL,
  `downloadSpeed` int(22) DEFAULT NULL,
  `uploadSpeed` int(22) DEFAULT NULL,
  `mSpeed` float DEFAULT NULL,
  `mStability` float DEFAULT NULL,
  `disable` tinyint(1) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`provider`),
  KEY `providerName_index` (`providerName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table nodesProxy
# ------------------------------------------------------------

DROP TABLE IF EXISTS `nodesProxy`;

CREATE TABLE `nodesProxy` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `provider` varchar(255) NOT NULL DEFAULT '',
  `port` varchar(20) DEFAULT NULL,
  `endpoint` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `endpoint` (`endpoint`),
  KEY `provider` (`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table nodesVpn
# ------------------------------------------------------------

DROP TABLE IF EXISTS `nodesVpn`;

CREATE TABLE `nodesVpn` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `vpn` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
