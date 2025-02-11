-- Script to create the temporary database used in the LCD screen connection.
DROP DATABASE IF EXISTS `locker`;
CREATE SCHEMA `locker`;

CREATE TABLE `locker`.`Locker` (
  `locker_id` INT NOT NULL AUTO_INCREMENT,
  `locker_status` VARCHAR(45) NULL,
  `locker_number` INT NOT NULL,
  PRIMARY KEY (`locker_id`),
  UNIQUE INDEX `locker_number_UNIQUE` (`locker_number` ASC)
);

CREATE TABLE `locker`.`Cable` (
  `cable_id` INT NOT NULL AUTO_INCREMENT,
  `cable_status` VARCHAR(45) NULL,
  `locker_id` INT NULL,
  `user_id` INT NULL,
  `check_out` DATETIME NULL,
  `check_in` DATETIME NULL,
  PRIMARY KEY (`cable_id`),
  INDEX `locker_id_idx` (`locker_id` ASC),
  INDEX `user_id_idx` (`user_id` ASC)
);

ALTER TABLE `locker`.`Cable` 
ADD CONSTRAINT `fk_locker_id`
  FOREIGN KEY (`locker_id`)
  REFERENCES `locker`.`locker` (`locker_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE `locker`.`User` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`)
);

ALTER TABLE `locker`.`Cable` 
ADD CONSTRAINT `fk_user_id`
  FOREIGN KEY (`user_id`)
  REFERENCES `locker`.`user` (`user_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

  
ALTER TABLE `locker`.`Cable` 
DROP COLUMN `check_in`,
DROP COLUMN `check_out`;

CREATE TABLE `locker`.`Transaction` (
  `transaction_id` INT NOT NULL,
  `check_out` DATETIME NULL,
  `check_in` DATETIME NULL,
  `cable_id` INT NULL,
  `user_id` INT NULL,
  PRIMARY KEY (`transaction_id`),
  INDEX `cable_id_idx` (`cable_id` ASC) VISIBLE,
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `cable_id`
    FOREIGN KEY (`cable_id`)
    REFERENCES `locker`.`Cable` (`cable_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `locker`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER TABLE `locker`.`Transaction` 
CHANGE COLUMN `transaction_id` `transaction_id` INT(11) NOT NULL AUTO_INCREMENT ;

INSERT INTO `locker`.`Locker` (`locker_id`, `locker_status`, `locker_number`) VALUES ('0', 'Taken', '1');
INSERT INTO `locker`.`Locker` (`locker_id`, `locker_status`, `locker_number`) VALUES ('1', 'Taken', '2');
INSERT INTO `locker`.`Locker` (`locker_id`, `locker_status`, `locker_number`) VALUES ('2', 'Free', '3');
INSERT INTO `locker`.`Locker` (`locker_id`, `locker_status`, `locker_number`) VALUES ('3', 'Free', '4');

INSERT INTO `locker`.`Cable` (`cable_id`, `cable_status`) VALUES ('0', 'Taken');
INSERT INTO `locker`.`Cable` (`cable_id`, `cable_status`) VALUES ('1', 'Free');
INSERT INTO `locker`.`Cable` (`cable_id`, `cable_status`) VALUES ('2', 'Taken');
INSERT INTO `locker`.`Cable` (`cable_id`, `cable_status`) VALUES ('3', 'Free');

INSERT INTO `locker`.`User` (`user_id`, `user_name`) VALUES ('0', 'Sam');
INSERT INTO `locker`.`User` (`user_id`, `user_name`) VALUES ('1', 'Rania');
INSERT INTO `locker`.`User` (`user_id`, `user_name`) VALUES ('2', 'Pierre');
INSERT INTO `locker`.`User` (`user_id`, `user_name`) VALUES ('3', 'Max');
INSERT INTO `locker`.`User` (`user_id`, `user_name`) VALUES ('4', 'Justine');
INSERT INTO `locker`.`User` (`user_id`, `user_name`) VALUES ('5', 'Ingmar');

INSERT INTO `locker`.`Transaction` (`transaction_id`, `check_out`, `check_in`, `cable_id`, `user_id`) VALUES ('0', '2024-11-18 14:59:00', '2024-11-20 16:00:00', '0', '0');
INSERT INTO `locker`.`Transaction` (`transaction_id`, `check_out`, `check_in`, `cable_id`, `user_id`) VALUES ('1', '2024-11-18 14:59:00', '2024-11-20 16:00:00', '1', '1');
INSERT INTO `locker`.`Transaction` (`transaction_id`, `check_out`, `check_in`, `cable_id`, `user_id`) VALUES ('2', '2024-11-18 14:59:00', '2024-11-20 16:00:00', '2', '2');
INSERT INTO `locker`.`Transaction` (`transaction_id`, `check_out`, `cable_id`, `user_id`) VALUES ('3', '2024-11-18 14:59:00', '3', '3');
INSERT INTO `locker`.`Transaction` (`transaction_id`, `check_out`, `cable_id`, `user_id`) VALUES ('4', '2024-12-04 14:59:00', '0', '4');

UPDATE `locker`.`Cable` SET `user_id` = '0' WHERE (`cable_id` = '0');
UPDATE `locker`.`Cable` SET `user_id` = '1' WHERE (`cable_id` = '1');
UPDATE `locker`.`Cable` SET `user_id` = '2' WHERE (`cable_id` = '2');
UPDATE `locker`.`Cable` SET `user_id` = '3' WHERE (`cable_id` = '3');

UPDATE `locker`.`Cable` SET `locker_id` = '0', `user_id` = NULL WHERE (`cable_id` = '1');
UPDATE `locker`.`Cable` SET `locker_id` = '1', `user_id` = NULL WHERE (`cable_id` = '3');

UPDATE `locker`.`Cable` SET `cable_status` = 'Taken', `locker_id` = NULL, `user_id` = '3' WHERE (`cable_id` = '3');
UPDATE `locker`.`Cable` SET `cable_status` = 'Free', `locker_id` = '1', `user_id` = NULL WHERE (`cable_id` = '2');
UPDATE `locker`.`Cable` SET `user_id` = '4' WHERE (`cable_id` = '0');

CREATE TABLE `locker`.`Admin` (
  `admin_id` INT NOT NULL AUTO_INCREMENT,
  `admin_name` VARCHAR(45) NULL,
  PRIMARY KEY (`admin_id`));

CREATE TABLE `locker`.`AdminTransaction` (
  `transaction_id` INT NOT NULL AUTO_INCREMENT,
  `changed_fields` VARCHAR(45) NULL,
  `change_date` DATETIME NULL,
  `locker_id` INT NULL,
  `admin_id` INT NULL,
  PRIMARY KEY (`transaction_id`),
  INDEX `locker_id_idx` (`locker_id` ASC) VISIBLE,
  INDEX `admin_id_idx` (`admin_id` ASC) VISIBLE,
  CONSTRAINT `locker_id`
    FOREIGN KEY (`locker_id`)
    REFERENCES `locker`.`Locker` (`locker_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `admin_id`
    FOREIGN KEY (`admin_id`)
    REFERENCES `locker`.`Admin` (`admin_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO `locker`.`Admin` (`admin_id`, `admin_name`) VALUES ('0', 'Jan');
INSERT INTO `locker`.`Admin` (`admin_id`, `admin_name`) VALUES ('1', 'John');

INSERT INTO `locker`.`AdminTransaction` (`transaction_id`, `change_date`, `locker_id`, `admin_id`) VALUES ('1', '2024-11-20 16:00:00', '1', '1');
INSERT INTO `locker`.`AdminTransaction` (`transaction_id`, `changed_fields`, `change_date`, `locker_id`, `admin_id`) VALUES ('1', 'locker_number', '2024-11-20 16:00:00', '1', '1');
INSERT INTO `locker`.`AdminTransaction` (`transaction_id`, `changed_fields`, `change_date`, `locker_id`, `admin_id`) VALUES ('2', 'locker_status', '2024-11-20 16:00:00', '2', '1');

ALTER TABLE `locker`.`Admin` 
ADD COLUMN `admin_password` VARCHAR(45) NULL AFTER `admin_name`;

UPDATE `locker`.`Admin` SET `admin_password` = '123' WHERE (`admin_id` = '0');
UPDATE `locker`.`Admin` SET `admin_password` = '123' WHERE (`admin_id` = '1');
UPDATE `locker`.`Admin` SET `admin_password` = '123' WHERE (`admin_id` = '2');

CREATE TABLE `locker`.`Reservation` (
  `reservation_id` INT NOT NULL AUTO_INCREMENT,
  `reservation_user_id` INT NULL,
  `reservation_cable_id` INT NULL,
  PRIMARY KEY (`reservation_id`),
  INDEX `cable_id_idx` (`reservation_cable_id` ASC) VISIBLE,
  INDEX `user_id_idx` (`reservation_user_id` ASC) VISIBLE,
  CONSTRAINT `reservation_cable_id`
    FOREIGN KEY (`reservation_cable_id`)
    REFERENCES `locker`.`Cable` (`cable_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `reservation_user_id`
    FOREIGN KEY (`reservation_user_id`)
    REFERENCES `locker`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER TABLE `locker`.`Reservation` 
ADD COLUMN `reservation_locker_id` INT NULL AFTER `reservation_cable_id`,
ADD INDEX `reservation_locker_id_idx` (`reservation_locker_id` ASC) VISIBLE;
;
ALTER TABLE `locker`.`Reservation` 
ADD CONSTRAINT `reservation_locker_id`
  FOREIGN KEY (`reservation_locker_id`)
  REFERENCES `locker`.`Locker` (`locker_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `locker`.`Reservation` 
ADD COLUMN `reservation_status` VARCHAR(45) NULL AFTER `reservation_locker_id`;

ALTER TABLE `locker`.`User` 
ADD COLUMN `card_id` VARCHAR(45) NULL AFTER `user_name`,
ADD UNIQUE INDEX `card_id_UNIQUE` (`card_id` ASC) VISIBLE;
;

UPDATE `locker`.`User` SET `card_id` = '7322C0D9' WHERE (`user_id` = '1');
INSERT INTO `locker`.`User` (`user_id`, `user_name`, `card_id`) VALUES ('7', 'SamOV', '313BC30C');
