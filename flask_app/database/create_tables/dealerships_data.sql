CREATE TABLE IF NOT EXISTS `dealerships_data` (
`dealership_id`            int(11)       NOT NULL AUTO_INCREMENT 	COMMENT 'The unique id of the dealership',
`dealership_name`          varchar(100)  NOT NULL                	COMMENT 'The name of the dealership', 
`brand`                    varchar(100)  NOT NULL                	COMMENT 'The car brand',
`city`                     varchar(100)  NOT NULL            	    COMMENT 'City of the dealership - address',
`state`                    varchar(100)  NOT NULL            	    COMMENT 'State - address',
`country`                  varchar(100)  NOT NULL            	    COMMENT 'Country - address',
`last_year_sales`          int(11)  DEFAULT NULL            	COMMENT 'Cars sold by the dealership last year',
`units_in_operation`       int(11)   NOT NULL            	    COMMENT 'Cars of the brand present in the area',  
PRIMARY KEY  (`dealership_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Basic information on dealerships";