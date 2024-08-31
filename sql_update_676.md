update thid previosly update user

//update after merge
UPDATE `employee` SET `emp_skill_level_id` = '56' WHERE `employee`.`emp_email` = 'ashish.bhardwaj@gmail.com'

//check the role mapping id of user and update
UPDATE `employee_role_mapping` SET `erm_role_id` = '25' WHERE `employee_role_mapping`.`erm_id` = 125;