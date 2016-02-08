#
# Structure for table "company"
#

DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `txtCompanyNo` varchar(10) NOT NULL,
  `txtCompanyName` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `txtCompanyNo` (`txtCompanyNo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

#
# Structure for table "port"
#

DROP TABLE IF EXISTS `port`;
CREATE TABLE `port` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "product"
#

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `txtCompany` varchar(255) DEFAULT NULL,
  `txtCruise` varchar(255) DEFAULT NULL,
  `txtLine` varchar(255) DEFAULT NULL,
  `txtStartDate` varchar(255) DEFAULT NULL,
  `numDay` int(11) DEFAULT NULL,
  `numNight` int(11) DEFAULT NULL,
  `numPrice` int(11) DEFAULT NULL,
  `txtUrl` varchar(255) DEFAULT NULL,
  `txtSource` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=892 DEFAULT CHARSET=utf8;

#
# Structure for table "ship"
#

DROP TABLE IF EXISTS `ship`;
CREATE TABLE `ship` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `txtCompanyNo` varchar(10) NOT NULL,
  `txtShipName` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `txtShipNo` (`txtShipName`),
  KEY `FK_CRUISESHIP_CRUISECOMPANY` (`txtCompanyNo`),
  CONSTRAINT `FK_CRUISESHIP_CRUISECOMPANY` FOREIGN KEY (`txtCompanyNo`) REFERENCES `cruise_company` (`txtCompanyNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8;
