use bestnid;

insert into usuario set 
	nombreUsuario = 'admin',
	nombre = 'admin',
	apellido = 'admin',
	password = '12345678',
	mail = 'admin@admin.com',
	foto = '/imagenes/perfilDefault.png',
	esAdmin = true,
	fechaRegistro = curdate();

insert into usuario set 
	nombreUsuario = 'publicador',
	nombre = 'publicador',
	apellido = 'publicador',
	password = '12345678',
	mail = 'publicador@publicador.com',
	foto = '/imagenes/perfilDefault.png',
	fechaRegistro = curdate();

insert into usuario set 
	nombreUsuario = 'ofertador1',
	nombre = 'ofertador',
	apellido = 'ofertador',
	password = '12345678',
	mail = 'ofertador@ofertador.com',
	foto = '/imagenes/perfilDefault.png',
	fechaRegistro = curdate();

insert into usuario set 
	nombreUsuario = 'ofertador2',
	nombre = 'ofertador',
	apellido = 'ofertador',
	password = '12345678',
	mail = 'ofertador@ofertador.com',
	foto = '/imagenes/perfilDefault.png',
	fechaRegistro = curdate();

insert into usuario set 
	nombreUsuario = 'ofertador3',
	nombre = 'ofertador',
	apellido = 'ofertador',
	password = '12345678',
	mail = 'ofertador@ofertador.com',
	foto = '/imagenes/perfilDefault.png',
	fechaRegistro = curdate();

insert into usuario set 
	nombreUsuario = 'normal',
	nombre = 'normal',
	apellido = 'normal',
	password = '12345678',
	mail = 'normal@normal.com',
	foto = '/imagenes/perfilDefault.png',
	fechaRegistro = curdate();

insert into categoria set 
	nombre = 'Celulares';

insert into categoria set 
	nombre = 'Electrónica, Audio y Video';

insert into categoria set 
	nombre = 'Animales';

insert into publicacion set 
	titulo = 'Samsung Galaxy Core 2 G355 Libres Quad Core Dual Sim',
	descripcion = "Pantalla de 4.5 pulgadas a 480 x 800 pixels de resolución. Procesador quad-core a 1.2GHz, 
Memoria RAM 768MB  
4GB de almacenamiento interno, mas expansion mediante microsd
Camara trasera de 5 MP, cámara frontal VGA, HSPA+
Sistema operativo Android 4.4 KitKat.",
	foto = '/foto/celular.jpg',
	fechaInicio = curdate(),
	fechaFin = curdate() + interval 15 day,
	idCategoria = 1,
	idUsuario= 2;

insert into publicacion set 
	titulo = 'Ovejeros Alemanes Cachorros Cria De Seleccion',
	descripcion = "LOS PADRES CON DCF 0, DE ESPLENDIDO CARACTER Y TEMPERAMENTO.
AMBOS ESTAN SELECCIONADOS.
SON 5 CACHORROS MACHOS NACIDOS EL 24/03/15
PROVIENEN DE UNA MUY BUENA LINEA DE SANGRE ESTAN TATUADOS, VACUNADOS Y DESPARASITADOS ACORDE A SU EDAD.
SON SANOS, ACTIVOS Y JUGUETONES.",
	foto = '/foto/perro.jpg',
	fechaInicio = curdate(),
	fechaFin = curdate() + interval 15 day,
	idCategoria = 3,
	idUsuario = 2;

insert into publicacion set 
	titulo = 'Gatos Peterbald ~ Peterbald Sphynx ~ Chamoise Y Velour',
	descripcion = "Hermosos ejemplares de raza Peterbald (fotos ilustrativas) La raza Peterbald es una raza relativamente nueva, con no mas de 15 años de historia.Son Gatos con expresion gradual de alopecia. CMC Cattery es el primer criadero de la raza en el hemisferio sur, en América Latina y A. de Sur y en Argentina! Estamos orgullosos de haber sido parte fundamental dentro de los criadores formadores en el proyecto de raza PETERBALD a nivel mundial. Desde sus inicios hemos empezado en un trabajo arduo en base a F1, ayudando a que los mimos logren su reconocimiento de raza y colaborando para lleguen el status de campeonato dentro de TICA, para que luego sea tambien aceptados en CFA, FIFe y otras asociaciones.",
	foto = '/foto/gato.jpg',
	fechaInicio = curdate(),
	fechaFin = curdate() + interval 15 day,
	idCategoria = 3,
	idUsuario = 2;

insert into publicacion set 
	titulo = 'Llamas De La Mejor Calidad',
	descripcion = "Hermosos ejemplares de raza Peterbald LLAMAS DE TODAS LAS EDADES A ELECCION.
EXCELENTES ANIMALES DE COMPAÑIA.
VARIOS COLORES.
FLETE A CARGO DEL OFERTADOR.",
	foto = '/foto/llama.jpg',
	fechaInicio = curdate(),
	fechaFin = curdate() + interval 15 day,
	idCategoria = 3,
	idUsuario = 2;

insert into publicacion set 
	titulo = 'Samsung Galaxy S4 Mini Dual Core Libre',
	descripcion = "SAMSUNG S4 PARA MOVISTAR CON CAJA EN PERFECTO ESTADO 16GB 
CONTENIDO DE LA OFERTA :
CELULAR SAMSUNG S4 GRANDE ORIGINAL 
CAJA ORIGINAL CON MANUALES
AURICULARES
CARADOR Y CABLE USB
MEMORIA MICRO SD HC 16 GB
FILM PROTECTOR
FUNDA NEO HIBRYD COLOR AZUL.",
	foto = '/foto/celulars4.jpg',
	fechaInicio = curdate(),
	fechaFin = curdate() + interval 15 day,
	idCategoria = 1,
	idUsuario = 2;

insert into publicacion set 
	titulo = 'Tv Led 24 Bgh Monitor Ble2414d Hd Hdmi Usb Tda Vga',
	descripcion = "El TV LED TDA BLE2414D BGH tiene una pantalla de 24 con un ángulo de visión de 176º y un diseño ultra delgado para que disfruten en familia los programas y películas favoritas. Además viene con un sintonizador digital incorporado con el cual se tendrá acceso a los canales de transmisión abierta. SKU 502758.",
	foto = '/foto/tele.jpg',
	fechaInicio = curdate() - interval 16 day,
	fechaFin = curdate() - interval 1 day,
	terminada = true,
	idCategoria = 1,
	idUsuario = 2;


insert into oferta set 
	texto = 'hola lo quiero para ver futbol para todos',
	monto = 100,
	fechaOferta = curdate() - interval 5 day,
	idPublicacion = 6,
	idUsuario = 3;

insert into oferta set 
	texto = 'hola lo quiero para ver documentales',
	monto = 5,
	fechaOferta = curdate() - interval 5 day,
	idPublicacion = 6,
	idUsuario = 4;

insert into oferta set 
	texto = 'hola lo quiero para ver showmatch',
	monto = 150,
	fechaOferta = curdate() - interval 5 day,
	idPublicacion = 6,
	idUsuario = 5;

insert into oferta set 
	texto = 'hola la quiero para pasear',
	monto = 100,
	fechaOferta = curdate() - interval 5 day,
	idPublicacion = 4,
	idUsuario = 3;

insert into oferta set 
	texto = 'hola lo quiero para ver ir al colegio',
	monto = 5,
	fechaOferta = curdate() - interval 5 day,
	idPublicacion = 4,
	idUsuario = 4;

insert into oferta set 
	texto = 'hola lo quiero para arar mi campo',
	monto = 150,
	fechaOferta = curdate() - interval 5 day,
	idPublicacion = 4,
	idUsuario = 5;


insert into pregunta set
	textoPregunta = 'hola es mansa?',
	fechaPregunta = curdate(),
	idUsuario = 3,
	idPublicacion = 4,
	idRespuesta = 1;


insert into pregunta set
	textoPregunta = 'viene en bordo?',
	fechaPregunta = curdate(),
	idUsuario = 4,
	idPublicacion = 4,
	idRespuesta = 2;


insert into pregunta set
	textoPregunta = 'hola una mas mansa no tenes?',
	fechaPregunta = curdate(),
	idUsuario = 5,
	idPublicacion = 4,
	idRespuesta = 3;

insert into pregunta set
	textoPregunta = 'hola posta que es mansa?',
	fechaPregunta = curdate(),
	idUsuario = 5,
	idPublicacion = 4;

insert into respuesta set
	textoRespuesta = 'hola si es mansa',
	fechaRespuesta = curdate();

insert into respuesta set
	textoRespuesta = 'no, solo blanca',
	fechaRespuesta = curdate();

insert into respuesta set
	textoRespuesta = 'hola no hay mas mansa',
	fechaRespuesta = curdate();
