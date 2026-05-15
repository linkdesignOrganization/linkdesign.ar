# Requerimientos del proyecto

## Viewcase 01: Sistema integral para metalúrgica

Empresa ficticia: Tornos del Sur SA

Documento único de especificación para el equipo de desarrollo. Versión 2.

---

## 1. Resumen ejecutivo

Este es uno de los seis viewcases nuevos del portafolio de Link Design para el mercado argentino. Es un demo completamente funcional de un sistema de gestión a medida para una metalúrgica mediana. El sistema es navegable, interactúa con el usuario, persiste cambios en localStorage entre sesiones y deja al lead explorar una operación industrial viva durante cinco a diez minutos.

El objetivo no es vender el sistema. El objetivo es demostrar que Link Design entiende profundamente cómo trabaja una operación física, que puede traducir esa operación en software sólido, y que el resultado se ve y se siente como producto profesional, no como prototipo de agencia.

---

## 2. Objetivo de negocio para Link Design

Posicionar a Link Design como proveedor capaz de construir software a medida para sectores industriales físicos donde la competencia argentina es escasa o de baja calidad.

Calificar leads. Los que exploran cinco minutos o más son leads serios que entienden la diferencia entre enlatado y a medida.

Generar activos reutilizables para campañas en Google Ads, LinkedIn Ads y materiales de venta directa.

---

## 3. Empresa ficticia y narrativa

### Nombre

Tornos del Sur SA

### Nicho

Metalúrgica mediana que combina dos líneas de negocio: mecanizado a medida (torno, fresa, taladro, control numérico) y estructuras soldadas a medida. El nombre original surgió de la primera línea (torneado) pero la empresa expandió operaciones con los años. Esta amplitud es intencional. Permite que otras industrias afines (autopartes, talleres mecánicos, fabricantes de muebles metálicos, herrería industrial, mantenimiento industrial) se sientan identificadas con la operación.

### Operación

Veintiocho personas en planta más administración. Trabaja para clientes industriales de distintos rubros (autopartes, agroindustria, construcción, distribución). Recibe pedidos por cantidad o por pieza única. Cotiza, planifica, produce, controla calidad, despacha y factura.

### Ubicación

Planta principal en Avellaneda, provincia de Buenos Aires. Una segunda nave alquilada en Sarandí para almacenamiento de materia prima y producto terminado.

### Tamaño operativo aproximado

Entre veinte y cuarenta órdenes de trabajo activas en simultáneo. Facturación mensual entre ARS 80 millones y ARS 120 millones (referencia a fecha del demo, estos números pueden actualizarse cada cierto tiempo en el seed).

---

## 4. Usuario objetivo del viewcase

### Lead que aterriza en el viewcase

Dueño o gerente de planta de una empresa industrial argentina mediana. Tiene entre 35 y 60 años, opera su negocio principalmente desde la planta, conoce muy bien su operación pero no es técnico digital. Quiere ver si Link Design entiende lo que hace su empresa.

### Comportamiento esperado

El lead entra al viewcase desde el sitio principal de Link Design o desde una campaña de Ads. Explora primero el dashboard, después navega a OTs porque es lo que reconoce, abre una OT específica, explora la planificación, mira el inventario. Si engancha, profundiza en costos por OT y reportes. Tiempo total de exploración: entre tres y diez minutos.

### Dispositivos

Setenta por ciento desktop, treinta por ciento mobile. Mobile no necesita cubrir todos los flujos, pero las pantallas principales (dashboard, lista de OTs, detalle de OT) deben ser usables en celular.

---

## 5. Tecnología y arquitectura

### Stack

Frontend exclusivamente. El equipo elige el framework que prefiera (Angular, React, Vue, Svelte, Astro). Sin backend. Todo el estado vive en localStorage del navegador.

### Persistencia

localStorage del navegador. Las acciones del usuario (crear OT, marcar etapa, modificar inventario, generar factura mock) se guardan y se mantienen entre sesiones. Botón de reset disponible en alguna pantalla de configuración para volver al seed original.

### Deploy

Azure Static Web Apps. Dominio propio para este viewcase. Sugerencia de naming: algo neutral y profesional que no contenga "linkdesign" ni "viewcase" en la URL pública (para que parezca un producto real al lead que llega). El equipo propone tres opciones y validamos.

### Performance

Carga inicial bajo 3 segundos en conexión 4G. Bundle inicial bajo 500 KB gzipped. Lazy loading para módulos secundarios.

### Routing

Multi pantalla con rutas dedicadas. Cada módulo y cada acción importante vive en una ruta propia. No SPA con todo modal o accordions ocultos. La URL siempre refleja qué está viendo el usuario, y el botón atrás del navegador funciona correctamente.

### Navegadores soportados

Chrome, Safari, Firefox, Edge versiones actualizadas. No es necesario soportar Internet Explorer ni versiones legacy.

---

## 6. Estructura general del viewcase

### Pantalla de entrada

Login mock muy simple. Un solo botón "Ingresar como administrador". No formulario real. Detrás del botón se cargan los datos seed y se navega al dashboard. Hay también un link "Saltar login" para que el visitante curioso entre directo.

### Header persistente

Logo del sistema ficticio (lo crea el equipo, simple, sobrio), nombre del módulo activo, indicador de usuario (avatar con iniciales "AD" para administrador), badge discreto "Demo interactivo de Link Design" abajo a la derecha con link al sitio principal.

### Sidebar de navegación

Menú lateral con máximo siete secciones agrupadas. Sugerencia de agrupación:

- Operación: Dashboard, Órdenes de trabajo, Cotizaciones, Planificación
- Recursos: Inventario, Máquinas, Operarios
- Comercial: Clientes, Proveedores, Facturación
- Análisis: Reportes, Mermas y calidad

Cada grupo se expande y colapsa. Iconos a la izquierda de cada item con label visible siempre. No menú con solo íconos.

### Footer

Discreto. Versión, link al sitio principal de Link Design, link a "Resetear demo".

---

## 7. Módulos y funcionalidades detalladas

### 7.1 Dashboard

Pantalla de inicio después del login.

#### Componentes

KPIs en la parte superior, cuatro tarjetas: OTs activas (con número y delta respecto al mes anterior), OTs por entregar esta semana, OTs atrasadas (en rojo si las hay), facturación del mes en pesos con delta.

Bloque central con calendario o timeline visual de la semana, mostrando las OTs en curso ubicadas según fecha de entrega esperada. Click sobre una OT lleva al detalle.

Panel lateral derecho con alertas activas: materiales por debajo del mínimo (con link al material), OTs con desvío de costo mayor a 15 por ciento (con link a la OT), mantenimientos próximos de máquinas. Cada alerta es clickeable y lleva al item correspondiente.

Bloque inferior con ranking del mes: top 5 clientes por facturación, top 5 piezas o servicios por volumen.

#### Interacciones permitidas

Click en KPI lleva a la lista filtrada correspondiente. Click en OT del calendario abre el detalle. Click en alerta lleva al item. Click en cliente del ranking abre su ficha.

#### Estado inicial

Muestra datos del mes actual con histórico de 60 días previos. Dos o tres alertas activas para que el dashboard tenga señal de vida.

### 7.2 Órdenes de Trabajo

El centro del sistema. Múltiples pantallas asociadas.

#### Pantalla A: Lista de OTs

Tabla con columnas: número de OT, cliente, descripción corta, fecha de entrega, estado (badge con color), porcentaje de avance, monto cotizado.

Filtros arriba: estado (multi select), cliente (combo con búsqueda), rango de fechas, máquina asignada, vendedor responsable.

Búsqueda libre por número de OT, cliente o descripción.

Botón primario "Crear nueva OT" arriba a la derecha.

Cada fila clickeable que lleva al detalle. Hover destaca la fila.

Paginación clara con cantidad total visible. No infinite scroll.

#### Pantalla B: Detalle de OT

Header de la OT con número grande, cliente con link a su ficha, estado actual con badge.

Sección de información general: descripción del trabajo, plano adjunto (mock, link a PDF o imagen), fecha de creación, fecha de aprobación, fecha de entrega comprometida, vendedor responsable.

Sección de piezas a producir: lista con cantidad, descripción de la pieza, unidad de medida, precio unitario, subtotal. Suma total al final.

Sección de materiales: tabla con materiales asignados, cantidad estimada, cantidad consumida real, costo estimado, costo real.

Sección de etapas: workflow visual horizontal con los estados (cotizada, aprobada, planificada, en producción, terminada, despachada, facturada). Estado actual destacado. Cada etapa muestra fecha de transición. Botón "Avanzar etapa" disponible si la OT está activa.

Sección de tiempos: tabla con etapas internas de producción (corte, mecanizado, soldado, control, etc.), tiempo estimado por etapa, tiempo real, operario asignado, máquina utilizada.

Sección de costos: comparativa estimado contra real, breakdown por categoría (materia prima, mano de obra, máquina, indirectos). Margen calculado al final con alerta visual si está por debajo de un umbral.

Sección de archivos: adjuntos relacionados (plano, especificación, comprobantes). En OTs en estado terminada o despachada, una foto del producto terminado tomada en la planta como evidencia.

Sección de historial: log de cambios con quién y cuándo cambió qué.

Acciones disponibles según estado: editar, avanzar etapa, marcar como en pausa, cancelar, duplicar.

#### Pantalla C: Crear nueva OT

Flujo en tres pasos.

Paso uno, datos básicos: seleccionar cliente (combo con búsqueda, opción de crear cliente nuevo en modal corto), descripción, fecha de entrega esperada, vendedor responsable.

Paso dos, piezas y materiales: agregar piezas (cantidad, descripción, precio). Agregar materiales asignados con cantidad estimada. Cálculo automático del subtotal.

Paso tres, revisión: vista resumen de toda la OT con todos los datos cargados. Botón "Crear OT" que la guarda en estado cotizada. Botón "Atrás" en cada paso, botón "Cancelar" con confirmación.

Después de crear, navega al detalle de la OT recién creada.

#### Pantalla D: Avanzar etapa

Modal corto o pantalla dedicada que confirma el avance de etapa. Si la siguiente etapa requiere datos (por ejemplo, registrar consumo real de material), pide esos datos antes de avanzar.

### 7.3 Cotizaciones

#### Pantalla A: Lista de cotizaciones

Tabla con columnas: número de cotización, cliente, descripción, fecha de emisión, vigencia, monto total, estado (pendiente, aprobada, rechazada, vencida).

Filtros y búsqueda igual que en OTs.

Botón "Crear nueva cotización".

#### Pantalla B: Detalle de cotización

Vista similar al detalle de OT pero sin etapas de producción. Tiene botones "Aprobar y convertir a OT" (si está pendiente), "Rechazar", "Duplicar", "Descargar PDF mock".

Al aprobar, la cotización pasa a estado aprobada y se genera una OT automáticamente con los datos cargados. Toast confirmando con link a la OT creada.

#### Pantalla C: Crear cotización

Flujo de tres pasos similar a crear OT pero sin asignar materiales reales (la cotización es propuesta económica, no compromiso operativo).

### 7.4 Planificación

#### Pantalla principal

Vista Gantt o calendario por máquina. Las OTs activas se ubican como bloques de tiempo en cada máquina según la asignación. Eje horizontal es el tiempo (días, semanas). Eje vertical son las máquinas.

Detección visual de conflictos: cuando dos OTs se superponen en la misma máquina, se marcan en rojo.

Drag and drop para mover una OT a otra máquina o a otro horario. Confirmación de cambio.

Indicador de ocupación porcentual por máquina arriba o al lado.

Filtros por rango de fechas, por máquina específica, por estado de OT.

Click sobre un bloque de OT abre el detalle de la OT en una panel lateral o navega al detalle completo.

### 7.5 Inventario

#### Pantalla A: Lista de materiales

Tabla con columnas: nombre del material, código interno, tipo (materia prima, semielaborado, terminado), stock actual, stock mínimo, ubicación, costo unitario, valor total en stock.

Filtros por tipo, por ubicación, por estado (en rango, bajo mínimo).

Búsqueda por nombre o código.

Botón "Registrar movimiento" arriba.

Alertas visuales (rojo) en materiales bajo mínimo.

Importante: en esta pantalla los materiales se identifican por nombre y código, no por foto. Así trabajan los sistemas industriales reales.

#### Pantalla B: Detalle de material

Header con nombre y código. Información: stock actual, stock comprometido (asignado a OTs activas), stock libre, mínimo, máximo, ubicación, costo promedio.

Histórico de movimientos en tabla: fecha, tipo (ingreso, consumo, ajuste), cantidad, OT asociada si aplica, usuario que cargó, costo unitario.

OTs que actualmente usan este material con cantidades comprometidas.

Acciones: registrar ingreso, registrar consumo manual, ajustar stock, modificar mínimo.

#### Pantalla C: Registrar movimiento

Formulario con tipo de movimiento, material (combo con búsqueda), cantidad, OT asociada (opcional), proveedor si es ingreso, motivo si es ajuste, costo unitario.

### 7.6 Máquinas y centros de trabajo

#### Pantalla A: Lista de máquinas

Cards con foto de la máquina. Cada card muestra: foto, nombre, tipo, estado actual (operativa libre, ocupada con OT, en mantenimiento), porcentaje de uso del mes, próximo mantenimiento.

#### Pantalla B: Detalle de máquina

Header con foto grande, nombre y tipo.

Información general: tipo, marca, modelo, año, costo hora configurado, horas totales operadas.

Calendario de uso con OTs históricas y futuras.

Historial de mantenimientos: fecha, tipo (preventivo, correctivo), descripción, costo, técnico.

Próximo mantenimiento previsto con countdown si está próximo.

Acciones: programar mantenimiento, marcar en pausa, modificar configuración.

### 7.7 Operarios

#### Pantalla A: Lista de operarios

Cards con avatar (iniciales del operario sobre fondo de color asignado por hash determinístico del nombre), nombre, puesto, máquinas que opera, horas cargadas este mes, OTs activas asignadas.

#### Pantalla B: Detalle de operario

Información personal básica (nombre, puesto, fecha de ingreso, contacto).

Tabla de horas cargadas por OT y por día.

Productividad: horas estimadas contra reales en OTs cerradas.

Histórico de últimos meses con totales y jornal calculado.

### 7.8 Mermas y calidad

#### Pantalla A: Registro de mermas

Lista de mermas registradas con OT asociada, etapa donde ocurrió, cantidad, causa, costo.

Botón "Registrar nueva merma".

#### Pantalla B: Análisis

Reportes visuales: mermas por mes con tendencia, mermas por causa, mermas por operario, mermas por máquina. Filtros de rango de fechas.

#### Pantalla C: Control de calidad por OT

Checklist configurable por tipo de pieza. Inspector marca cada item al revisar. Resultado: pasa, falla, observado.

### 7.9 Clientes

#### Pantalla A: Lista

Tabla con nombre, CUIT, tipo (cliente activo, ex cliente, prospecto), cantidad de OTs totales, monto facturado total, saldo cuenta corriente.

#### Pantalla B: Detalle

Datos generales, contactos, condiciones particulares (precios especiales, descuentos por volumen, plazo de pago), historial de OTs con link, historial de cotizaciones, cuenta corriente con detalle de facturas y pagos.

### 7.10 Proveedores

#### Pantalla A: Lista

Tabla con nombre, CUIT, tipo (materia prima, servicios, mantenimiento), cantidad de compras, monto total comprado.

#### Pantalla B: Detalle

Datos generales, contacto, histórico de compras, comparativa de precios para materiales que también compramos a otros proveedores.

### 7.11 Facturación

Nota importante: en este viewcase no hay integración con ARCA ni AFIP. La facturación es solo el módulo interno de gestión de facturas, pero ninguna pantalla menciona ARCA, AFIP, ni integración con organismos fiscales. Las facturas se crean, listan, marcan como cobradas, y se descargan como PDF mock. Nada más.

#### Pantalla A: Lista de facturas

Tabla con número, cliente, fecha de emisión, fecha de vencimiento, monto, estado (emitida, cobrada, vencida).

Filtros por estado, por cliente, por rango de fechas.

#### Pantalla B: Detalle de factura

Información de la factura, OT que originó la factura (link), items facturados, totales con IVA calculado en mock, estado actual.

Acciones: marcar como cobrada (con fecha y método de pago en mock), descargar PDF mock, duplicar.

#### Pantalla C: Crear factura desde OT terminada

Flujo que parte de una OT en estado terminada y genera la factura con datos precargados. Confirmación antes de emitir.

### 7.12 Reportes ejecutivos

Pantalla con varios bloques de visualización:

Producción mensual: gráfico de barras con OTs terminadas por mes en los últimos seis meses.

Top clientes por facturación: ranking.

Top piezas o servicios por volumen: ranking.

Eficiencia por máquina: gráfico con uso porcentual mensual.

Tiempos promedio por etapa: histograma.

Margen promedio del mes: tarjeta con número grande y delta.

Mermas por mes: línea de tendencia.

Filtros generales de rango de fechas que afectan todos los bloques.

Botón "Descargar reporte" que genera PDF mock con todos los gráficos.

### 7.13 Notificaciones y alertas

Panel accesible desde el header (icono campana con contador). Lista de notificaciones activas con timestamp. Tipos:

OT con desvío de costo mayor a 15 por ciento.

Material bajo mínimo.

Mantenimiento de máquina próximo.

OT atrasada respecto a fecha de entrega.

Factura vencida sin cobro.

Cliente con saldo deudor mayor a X.

Cada notificación es clickeable y lleva al item correspondiente.

Botón "Marcar todas como leídas".

### 7.14 Configuración

Pantalla simple con tres tabs:

Tab uno, datos de la empresa: nombre (Tornos del Sur SA editable), CUIT, dirección, logo.

Tab dos, parámetros operativos: umbral de alerta de desvío de costo, vencimiento default de cotizaciones, formato de numeración de OTs, formato de numeración de facturas.

Tab tres, demo: botón "Resetear demo" que vuelve todos los datos al seed original. Confirmación previa.

---

## 8. Datos seed

### Empresa

Tornos del Sur SA, CUIT 30-71234567-8, dirección Avellaneda Provincia de Buenos Aires, logo simple a crear.

### Clientes

Mínimo seis clientes con perfiles distintos:

1. Distribuidora industrial mediana (compras recurrentes de piezas estandarizadas)
2. Empresa autopartista (lotes grandes, plazos exigentes)
3. Constructora boutique (pedidos ocasionales de estructuras soldadas)
4. Fábrica de muebles metálicos (compras recurrentes de chapa cortada y plegada)
5. Empresa de mantenimiento industrial (pedidos urgentes, piezas únicas)
6. Productor agroindustrial (estructuras a medida para silos y galpones)

Cada uno con CUIT plausible, dos a tres contactos, historial de entre cinco y veinte OTs, saldo en cuenta corriente variado (algunos al día, otros con deuda).

### Proveedores

Mínimo cuatro:

1. Acería mayorista (chapa, perfiles)
2. Distribuidor de soldadura y consumibles
3. Distribuidor de aceros especiales
4. Servicio de mantenimiento externo de máquinas

### Operarios

Seis operarios con nombres argentinos plausibles:

1. Jorge Méndez, tornero CNC, 12 años en la empresa
2. Marta Ríos, fresadora, 8 años
3. Diego Pereyra, soldador especializado, 15 años
4. Carlos Iturbe, operador de plegadora, 6 años
5. Lucas Brizuela, operario general, 3 años
6. Romina Sosa, control de calidad, 5 años

### Máquinas

Cinco a seis centros de trabajo:

1. Torno CNC marca Romi
2. Fresadora CNC marca Mazak
3. Plegadora hidráulica marca Durma
4. Equipo de soldadura MIG y TIG (varios puestos)
5. Cortadora laser fibra
6. Punzonadora

Cada una con costo hora plausible (entre ARS 25.000 y ARS 60.000 según máquina, valores referenciales para el demo).

### Materiales

Mínimo veinte materiales entre materia prima e insumos:

Materia prima: chapa de acero al carbono en distintos espesores (1.5mm, 2mm, 3mm, 6mm), chapa de acero inoxidable (1mm, 2mm), perfil ángulo (L), perfil U, perfil T, perfil cuadrado, perfil rectangular, barra redonda (12mm, 16mm, 25mm), barra cuadrada, tubo redondo, tubo estructural.

Insumos: electrodos de soldadura comunes, alambre MIG, gas argón, brocas, fresas, discos de corte, pintura epoxi industrial, antióxido.

Cada material con código interno, stock actual, mínimo, máximo, costo unitario plausible y ubicación física.

Mezcla de estados: dos materiales bajo mínimo, tres en máximo, el resto en rango normal.

### Órdenes de trabajo

Mínimo treinta y cinco OTs distribuidas en distintos estados:

8 facturadas y cobradas (cerradas)
6 facturadas pendientes de cobro
4 despachadas pendientes de facturar
8 en producción (con avance variado)
5 planificadas pendientes de empezar
3 aprobadas pendientes de planificar
1 con desvío de costo significativo (para mostrar alertas)
1 atrasada (para mostrar alerta de plazo)

Variadas en complejidad: algunas de una pieza única, otras de lotes de cien o doscientas piezas, algunas mixtas (mecanizado más soldado), algunas con cortes laser específicos.

### Cotizaciones

Mínimo doce cotizaciones:

4 pendientes de respuesta del cliente
3 aprobadas (con OT asociada visible)
3 rechazadas
2 vencidas

### Facturas

Mínimo dieciocho facturas en los últimos sesenta días:

10 cobradas
5 emitidas pendientes
2 vencidas
1 anulada

### Movimientos de inventario

Mínimo ochenta movimientos en los últimos sesenta días, distribuidos entre ingresos por compra, consumos por OT, ajustes manuales.

### Alertas activas en el dashboard

Tres a cinco alertas vivas:

- Una OT con desvío de costo mayor al umbral
- Una OT atrasada
- Dos materiales bajo mínimo
- Un mantenimiento de máquina próximo

---

## 9. Criterios de diseño estructural

### Estructura de flujos multi pantalla

Toda acción que crea, modifica o elimina algo importante vive en una pantalla dedicada, no en un modal. Los modales sirven solo para confirmaciones cortas o avisos.

Cada flujo de proceso debe tener mínimo cuatro pantallas: lista de items, detalle del item, formulario o acción específica, y pantalla de resultado o confirmación.

La navegación entre pantallas siempre permite volver atrás sin perder datos. El botón atrás del navegador funciona y no rompe el estado.

Breadcrumb visible en pantallas de detalle y subniveles.

### Densidad y jerarquía visual

Una pantalla, una acción primaria. El botón principal es visualmente único y no compite con otros.

Información por capas. La pantalla principal muestra lo crítico, los detalles complementarios se acceden por click, tab o expansión.

Listas con máximo siete columnas visibles. Si hay más datos relevantes, se accede entrando al detalle.

Sidebar de navegación con máximo siete secciones agrupadas. No listas planas de veinte items.

### Feedback del sistema

Antes de eliminar o cancelar algo importante, confirmación explícita.

Después de cada acción exitosa, toast o notificación clara.

Validaciones inline en formularios con mensaje específico por campo, no acumulado al final.

Cada lista, vista o panel tiene su estado vacío diseñado con guidance y un CTA para empezar.

Loading states con skeleton, no spinner solo.

### Consistencia transversal

Mismos componentes para mismas funciones en todo el sistema.

Spacing, tipografía y paleta unificados en design tokens definidos al inicio.

Iconografía consistente, un solo set.

Botones con texto explícito. No "Guardar" ni "Aceptar". Sí "Crear OT", "Aprobar cotización", "Marcar como despachada".

### Calidad de datos seed

Datos realistas y diversos. Nombres argentinos, CUITs con formato correcto, montos en pesos.

Mezcla de estados representativa de la realidad.

Cantidades variadas. Algunas OTs cortas, otras largas. Algunos clientes con muchas OTs, otros con pocas.

Histórico suficiente para que los reportes tengan datos. Mínimo dos meses.

Edge cases representados. Una OT con problema, un material agotado, un cliente con deuda, un operario sin OTs asignadas.

### Responsive y accesibilidad mínima

Desktop y mobile contemplados. Mobile no necesita cubrir todos los flujos, pero las pantallas principales sí.

Tamaños de touch en mobile mínimo 44 píxeles.

Contraste suficiente. Texto principal sobre fondo blanco o gris muy claro.

Estados de focus visibles para navegación por teclado.

### Patrones a evitar explícitamente

No modales gigantes que reemplazan pantalla.

No accordions anidados que esconden información crítica.

No tooltips para información que debería ser visible siempre.

No iconos sin label en navegación principal.

No paneles laterales que ocupan más del 25 por ciento de la pantalla en desktop.

No infinite scroll en listas operativas.

---

## 10. Criterios de UI

### Paleta y branding

El equipo elige paleta cromática y branding del sistema ficticio. Restricción importante: fondo principal debe ser blanco o gris muy claro (entre #ffffff y #f5f6f8). Esta es la única regla cromática no negociable porque define el look premium. Los acentos pueden ser del color que el equipo elija siempre que respete la regla anterior.

El branding del sistema ficticio no debe coincidir con la paleta morada de Link Design. Esto es para que se sienta un producto real entregado a Tornos del Sur, no un demo evidente. La conexión con Link Design queda solo en el badge discreto del header y en el footer.

### Espacio y respiración

Sistema de spacing basado en múltiplos de cuatro: 4, 8, 12, 16, 24, 32, 48, 64.

Padding generoso. Cards con mínimo 24 píxeles de padding interno. Secciones de página con mínimo 48 píxeles entre bloques.

Alineación consistente a una grilla. Formularios alineados a izquierda, no centrados.

### Tipografía

Una sola familia tipográfica sans serif moderna (Inter, DM Sans, Geist, Manrope o similar).

Máximo tres tamaños de texto por pantalla.

Solo dos pesos: regular (400) y medio o semibold (500 o 600). Nunca bold extremo ni light.

Line height generoso en cuerpo (1.5 a 1.7). Títulos más ajustados (1.2).

Letter spacing levemente negativo en títulos grandes (alrededor de -0.02em). Normal en cuerpo.

Jerarquía clara entre niveles con saltos visibles.

### Color de aplicación

Paleta restringida: color de marca del sistema ficticio (uno principal), neutros (de blanco a casi negro), semánticos para estados (verde éxito, rojo error, amarillo warning, azul info).

Color de marca solo en acciones primarias, badges destacados y elementos críticos. No para texto cuerpo, no para fondos generales.

Texto en grises oscuros (cercano a #1a1a2e). No negro puro, no color de marca.

Estados semánticos en versiones suaves para fondos y oscuras para texto.

### Iconografía

Un solo set (Tabler, Heroicons, Lucide, Phosphor).

Tres tamaños fijos: 16 píxeles para inline en texto, 20 píxeles para botones y filas, 24 píxeles para acciones primarias.

Íconos solo cuando aportan claridad. Heredan color del texto contiguo, excepto íconos de estado.

### Elevación y profundidad

Sombras sutiles o ninguna. Una sola familia consistente si se usan.

Preferir bordes sutiles (1 píxel, color tenue como #e5e3ee) sobre sombras pesadas.

Bordes redondeados consistentes en todo el sistema (recomendado 8 a 12 píxeles).

### Micro interacciones

Transitions entre 150 y 250 milisegundos en estados interactivos.

Hover visible en todo lo clickeable.

Focus rings visibles para navegación por teclado.

Animación de entrada para toasts y notificaciones.

Skeletons mientras cargan listas y tablas, no spinners centrales.

Estados disabled visualmente claros pero no agresivos.

### Detalles de pulido

Cursor pointer en clickeables, text en inputs, not-allowed en disabled.

Selección de texto con color de marca atenuado.

Inputs y botones con altura consistente.

Placeholder en gris claro que desaparece al escribir.

### Patrones de UI a evitar

Gradientes saturados de fondo.

Sombras pesadas tipo elevation 8.

Pills de colores estridentes.

Emojis dentro de la interfaz como decoración.

Border radius extremos.

Botones con sombras adentro o gradientes.

Inputs sin estados claros.

---

## 11. Imágenes y assets visuales

### Filosofía sobre imágenes

Los sistemas industriales reales son mayormente texto, tablas, badges y gráficos. No son image heavy. Esto incluye SAP, Calipso, Bind ERP y la mayoría de los ERPs verticales. Por eso este viewcase usa imágenes solo en los lugares donde aportan valor real. El resto se identifica por código y especificación, igual que en producción.

### Cantidad total

Dieciséis imágenes solamente. Seis máquinas y diez piezas terminadas. Las imágenes las descarga Roberth aparte y las entrega al equipo con la nomenclatura y carpetas definidas abajo.

### Logo del sistema ficticio

Lo crea el equipo. Sobrio, profesional, no usa el morado de Link Design, no usa los nombres "Link" ni "Design" en ningún lado.

### Categoría A: Máquinas (6 imágenes)

Una por cada centro de trabajo. Se usan en la lista de máquinas (cards) y en el detalle de cada máquina (foto grande del header).

| Nombre del archivo | Descripción |
|---|---|
| maquinas/maquina-torno-cnc-01.jpg | Torno CNC industrial |
| maquinas/maquina-fresadora-cnc-02.jpg | Fresadora CNC vertical |
| maquinas/maquina-plegadora-03.jpg | Plegadora hidráulica |
| maquinas/maquina-soldadora-mig-04.jpg | Soldadora MIG industrial |
| maquinas/maquina-laser-fibra-05.jpg | Cortadora laser de fibra |
| maquinas/maquina-punzonadora-06.jpg | Punzonadora CNC |

### Categoría B: Piezas terminadas (10 imágenes)

Se usan como archivos adjuntos en algunas OTs cerradas (estado terminada o despachada), simulando que el operario subió la foto del trabajo terminado como evidencia. Las diez imágenes se reutilizan en distintas OTs, no hay relación uno a uno.

| Nombre del archivo | Descripción |
|---|---|
| piezas/pieza-engranaje-01.jpg | Engranaje recto de acero |
| piezas/pieza-eje-mecanizado-02.jpg | Eje mecanizado de transmisión |
| piezas/pieza-brida-03.jpg | Brida de acero al carbono |
| piezas/pieza-laser-cut-04.jpg | Pieza compleja cortada con laser |
| piezas/pieza-estructura-soldada-05.jpg | Soporte o estructura soldada |
| piezas/pieza-plegada-06.jpg | Chapa plegada en forma U o L |
| piezas/pieza-mecanizado-custom-07.jpg | Pieza cilíndrica mecanizada custom |
| piezas/pieza-soporte-industrial-08.jpg | Soporte robusto pintado |
| piezas/pieza-tornillo-especial-09.jpg | Tornillo industrial mecanizado |
| piezas/pieza-polea-10.jpg | Polea de aluminio mecanizada |

### Categoría C: Avatares de operarios

No se descargan imágenes. El equipo implementa un componente Avatar que recibe un nombre y genera un círculo con las iniciales del operario sobre un color asignado deterministicamente por hash del nombre. Tamaños sugeridos: 40 píxeles para inline en filas, 56 píxeles para cards de operario, 80 píxeles para header de detalle.

Ventaja: cero gestión de imágenes, consistencia visual perfecta, sin riesgo de uso indebido de fotos de personas, look profesional.

### Categoría D: Materia prima

No usa imágenes. Cada material se identifica por nombre, código interno y especificación (por ejemplo: "Chapa acero al carbono SAE 1010, espesor 3mm, código CH-AC-3"). Así trabajan los sistemas industriales reales.

### Estructura de carpetas

```
public/imagenes/
├── maquinas/
│   ├── maquina-torno-cnc-01.jpg
│   ├── maquina-fresadora-cnc-02.jpg
│   ├── maquina-plegadora-03.jpg
│   ├── maquina-soldadora-mig-04.jpg
│   ├── maquina-laser-fibra-05.jpg
│   └── maquina-punzonadora-06.jpg
└── piezas/
    ├── pieza-engranaje-01.jpg
    ├── pieza-eje-mecanizado-02.jpg
    ├── pieza-brida-03.jpg
    ├── pieza-laser-cut-04.jpg
    ├── pieza-estructura-soldada-05.jpg
    ├── pieza-plegada-06.jpg
    ├── pieza-mecanizado-custom-07.jpg
    ├── pieza-soporte-industrial-08.jpg
    ├── pieza-tornillo-especial-09.jpg
    └── pieza-polea-10.jpg
```

### Manifest

Junto a las imágenes incluir un archivo `manifest.json` que el equipo lee programáticamente para cargar las imágenes en los componentes:

```
{
  "maquinas": [
    { "archivo": "maquinas/maquina-torno-cnc-01.jpg", "descripcion": "Torno CNC", "modulo": "maquinas" },
    { "archivo": "maquinas/maquina-fresadora-cnc-02.jpg", "descripcion": "Fresadora CNC vertical", "modulo": "maquinas" },
    { "archivo": "maquinas/maquina-plegadora-03.jpg", "descripcion": "Plegadora hidraulica", "modulo": "maquinas" },
    { "archivo": "maquinas/maquina-soldadora-mig-04.jpg", "descripcion": "Soldadora MIG industrial", "modulo": "maquinas" },
    { "archivo": "maquinas/maquina-laser-fibra-05.jpg", "descripcion": "Cortadora laser fibra", "modulo": "maquinas" },
    { "archivo": "maquinas/maquina-punzonadora-06.jpg", "descripcion": "Punzonadora CNC", "modulo": "maquinas" }
  ],
  "piezas": [
    { "archivo": "piezas/pieza-engranaje-01.jpg", "descripcion": "Engranaje recto", "tipo": "mecanizado" },
    { "archivo": "piezas/pieza-eje-mecanizado-02.jpg", "descripcion": "Eje mecanizado", "tipo": "mecanizado" },
    { "archivo": "piezas/pieza-brida-03.jpg", "descripcion": "Brida de acero", "tipo": "mecanizado" },
    { "archivo": "piezas/pieza-laser-cut-04.jpg", "descripcion": "Pieza laser cut", "tipo": "corte" },
    { "archivo": "piezas/pieza-estructura-soldada-05.jpg", "descripcion": "Estructura soldada", "tipo": "soldadura" },
    { "archivo": "piezas/pieza-plegada-06.jpg", "descripcion": "Pieza plegada", "tipo": "plegado" },
    { "archivo": "piezas/pieza-mecanizado-custom-07.jpg", "descripcion": "Mecanizado custom", "tipo": "mecanizado" },
    { "archivo": "piezas/pieza-soporte-industrial-08.jpg", "descripcion": "Soporte industrial", "tipo": "soldadura" },
    { "archivo": "piezas/pieza-tornillo-especial-09.jpg", "descripcion": "Tornillo especial", "tipo": "mecanizado" },
    { "archivo": "piezas/pieza-polea-10.jpg", "descripcion": "Polea mecanizada", "tipo": "mecanizado" }
  ]
}
```

Las piezas se asignan aleatoriamente o por orden a las OTs en estado terminada o despachada como archivos adjuntos. Los agentes pueden reutilizar las diez imágenes en distintas OTs.

### Comportamiento mientras no haya imágenes cargadas

Durante el desarrollo inicial, antes de recibir las imágenes finales, el equipo usa placeholders simples (rectángulos con el nombre de la imagen como texto centrado). Cuando las imágenes lleguen, basta con copiar los archivos a las carpetas indicadas para que aparezcan automáticamente sin tocar código.

---

## 12. Restricciones explícitas

### Lo que el viewcase NO incluye

No mención de ARCA, AFIP ni ninguna integración fiscal. La facturación es módulo interno mock.

No login real con autenticación contra backend. Solo selección de usuario mock.

No roles ni permisos. Solo vista master (administrador con acceso total).

No conexión a APIs externas. Todo es local.

No analytics ni tracking de usuario. Es un demo, no medimos comportamiento.

No formularios reales que envíen información a algún lado.

No menciones de la operación real de Link Design en lugares visibles más allá del badge discreto del header y el footer.

No imágenes de materia prima ni de operarios.

### Lo que el viewcase SÍ incluye

Persistencia en localStorage entre sesiones.

Botón de reset que vuelve al seed original.

Datos completamente ficticios pero realistas.

Cobertura mínima de cinco a diez minutos de exploración productiva.

Imágenes solo en máquinas y como adjuntos de algunas OTs terminadas.

---

## 13. Entregables esperados

Sitio web desplegado en Azure Static Web App con dominio propio configurado.

Repositorio Git con código fuente, README de cómo correr localmente, instrucciones de deploy.

Datos seed cargables y reseteables desde la pantalla de configuración.

Documentación mínima en el README:
- Stack tecnológico utilizado
- Cómo correr localmente
- Cómo modificar datos seed
- Cómo deployar a Azure
- Dónde van las imágenes y cómo se referencian desde el manifest

Validación visual del cumplimiento de criterios de diseño y UI antes de entregar.

---

## 14. Asunciones del documento

Plazo de entrega no definido por Link Design en este documento. El equipo propone cronograma con hitos.

Stack tecnológico final lo decide el equipo siguiendo los criterios.

Branding del sistema ficticio (logo, colores, nombre del producto interno si tiene) lo decide el equipo siguiendo los criterios.

Decisiones de copy interno (textos de botones, mensajes de error, tooltips) las redacta el equipo en español rioplatense neutro siguiendo los criterios de copy del proyecto general de Link Design.

Las imágenes finales las entrega Roberth en algún momento del desarrollo. Mientras tanto, placeholders.

---

## 15. Pendientes para definir antes de arrancar

Cronograma de entrega y hitos parciales.

Stack tecnológico definitivo elegido por el equipo.

Dominio definitivo del viewcase publicado.

Logo y branding del sistema ficticio (lo trae el equipo en primera iteración para validación).

---

Fin del documento
