SET GLOBAL event_scheduler = ON;

create procedure actualizacionBestnid() 
  update publicacion 
  set terminada = true
  where terminada = false and fechaFin <= curdate();

CREATE EVENT IF NOT EXISTS actualizadorBestnid 
ON SCHEDULE EVERY 1 DAY
STARTS '2015-04-30 00:00:00' ON COMPLETION PRESERVE ENABLE 
DO CALL actualizacionBestnid();
