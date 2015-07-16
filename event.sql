SET GLOBAL event_scheduler = ON;

create procedure actualizacionBestnid() 
  update publicacion, usuario
  set publicacion.terminada = true, usuario.tieneNotificaciones = 1
  where publicacion.terminada = false and publicacion.fechaFin <= curdate() and usuario.idUsuario = publicacion.idUsuario;

CREATE EVENT IF NOT EXISTS actualizadorBestnid 
ON SCHEDULE EVERY 1 DAY
STARTS '2015-04-30 00:00:00' ON COMPLETION PRESERVE ENABLE 
DO CALL actualizacionBestnid();
