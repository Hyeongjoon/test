DROP DATABASE IF exists lotto;
CREATE DATABASE lotto DEFAULT CHARACTER SET utf8;

use lotto;

SET foreign_key_checks = 0;
set sql_safe_updates=0;

	DROP TABLE IF exists all_history;
create table all_history
		(5th smallint unsigned default 0,
        4th smallint unsigned default 0,
        3rd smallint unsigned default 0,
        2nd smallint unsigned default 0,
        1st smallint unsigned default 0,
        no bigint unsigned default 0
) Engine =InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF exists temp;
create table temp
		(5th smallint unsigned default 0,
        4th smallint unsigned default 0,
        3rd smallint unsigned default 0,
        2nd smallint unsigned default 0,
        1st smallint unsigned default 0,
        total_num smallint unsigned default 0
) Engine =InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF exists last_week_history;
create table last_week_history
		(5th smallint unsigned default 0,
        4th smallint unsigned default 0,
        3rd smallint unsigned default 0,
        2nd smallint unsigned default 0,
        1st smallint unsigned default 0,
        total_num smallint unsigned default 0
) Engine =InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF exists history_log;
create table history_log
		(id smallint unsigned auto_increment,
        5th smallint unsigned default 0,
        4th smallint unsigned default 0,
        3rd smallint unsigned default 0,
        2nd smallint unsigned default 0,
        1st smallint unsigned default 0,
        total_num smallint unsigned default 0,
        draw_no smallint unsigned NOT NULL default 0,
        draw_date datetime NOT NULL default now(),
        primary key(`id`)
) Engine =InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF exists num_log;
create table num_log
		(
        id bigint unsigned auto_increment NOT NULL,
        no1 tinyint unsigned NOT NULL,
        no2 tinyint unsigned NOT NULL,
        no3 tinyint unsigned NOT NULL,
        no4 tinyint unsigned NOT NULL,
        no5 tinyint unsigned NOT NULL,
        no6 tinyint unsigned NOT NULL,
        drawno smallint unsigned NOT NULL default 0,
        primary key(id)
) Engine =InnoDB DEFAULT CHARSET = utf8;
    
DROP TABLE IF exists current_draw_no;
create table current_draw_no
		(id tinyint default 1,
        no smallint unsigned NOT NULL default 0,
        primary key(id)
) Engine =InnoDB DEFAULT CHARSET = utf8;

	DROP EVENT IF exists add_current_draw;
DELIMITER |
create event add_current_draw
	ON SCHEDULE
		EVERY 1 week
        STARTS '2017-11-18 20:00:00'
	DO
	 BEGIN
     update current_draw_no SET no = no +1 WHERE id = 1;
     END|
    DELIMITER ;
    
    DROP EVENT IF exists reset_temp;
DELIMITER |
create event reset_temp
	ON SCHEDULE
		EVERY 1 week
        STARTS '2017-11-18 20:05:00'
	DO
	 BEGIN
    update temp a
	set a.1st = 0, 
	a.2nd = 0, 
	a.3rd = 0, 
	a.4th = 0, 
	a.5th = 0,
    a.total_num = 0;
    END|
    DELIMITER ;
    
    DROP EVENT IF exists delete_last_num_log;
DELIMITER |
create event delete_last_num_log
	ON SCHEDULE
		EVERY 1 week
        STARTS '2017-11-18 23:59:00'
	DO
	 BEGIN
     delete a from num_log as a inner join current_draw_no as b WHERE a.drawno =  (b.no -1);
     update all_history a inner join temp b
	set a.1st = a.1st + b.1st, 
	a.2nd = a.2nd +b.2nd, 
	a.3rd = a.3rd +b.3rd, 
	a.4th = a.4th +b.4th, 
	a.5th = a.5th +b.5th,
    a.no = a.no + b.total_num;
    update last_week_history a inner join temp b
	set a.1st = b.1st, 
	a.2nd = b.2nd, 
	a.3rd = b.3rd, 
	a.4th = b.4th, 
	a.5th = b.5th,
    a.total_num = b.total_num;
     END|
    DELIMITER ;
    
    DROP PROCEDURE IF exists set_draw;
    DELIMITER //
CREATE PROCEDURE set_draw(IN no1 tinyint unsigned,
							no2 tinyint unsigned,
							no3 tinyint unsigned,
                            no4 tinyint unsigned,
                            no5 tinyint unsigned,
                            no6 tinyint unsigned)
 BEGIN
 INSERT INTO num_log(`no1`,`no2`,`no3`,`no4`,`no5`,`no6`) 
 values(no1,no2,no3,no4,no5,no6);
 update `num_log` set drawno=(   
    SELECT no from current_draw_no WHERE current_draw_no.id = 1
)   WHERE `id` = last_insert_id();
 END //
DELIMITER ;
    
    	DROP TRIGGER IF EXISTS add_history_log;
DELIMITER |
create TRIGGER add_history_log AFTER update ON  last_week_history
	for each row
    BEGIN
		insert into history_log(`5th`,`4th`,`3rd`,`2nd`,`1st`,`total_num`) values(new.5th, new.4th, new.3rd, new.2nd, new.1st, new.total_num);
		update `history_log` set draw_no=((   
		SELECT no from current_draw_no WHERE current_draw_no.id = 1
		) - 1)  WHERE `id` = last_insert_id();
	END|
    DELIMITER ;
        
SET foreign_key_checks = 1;
set sql_safe_updates=0;

insert into current_draw_no values(1 , 781); # 리셋할때 셋팅 해놓을것
insert into all_history values(0,0,0,0,0);
insert into last_week_history values(0,0,0,0,0,0);
insert into temp values(0,0,0,0,0,0);