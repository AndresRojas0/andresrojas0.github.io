---
title: Incursión - Creación de aplicación para carga de pedidos
layout: post.njk
slug: post-3
image: /images/order.svg
tags: post
date: 2025-07-23 23:07:00
---

## Introducción

### Contexto y problemática

Analizando las necesidades de una pyme dedicada a la venta de insumos de ferretería y, a partir de entrevistas realizadas a su vendedor, se detecta un problema en el registro y seguimiento del ciclo pedido–entrega–cobro.
Actualmente, los clientes realizan pedidos de productos al vendedor mediante contacto telefónico o durante visitas presenciales. El vendedor registra estos pedidos en una planilla, la cual puede sufrir modificaciones hasta un día y hora determinados de la semana. Una vez alcanzado ese momento, la planilla se considera cerrada.

La planilla cerrada se utiliza como base para generar los pedidos formales a los clientes y los remitos correspondientes, en los que se detalla el saldo a pagar. Además, el vendedor lleva registros separados de:

* los pedidos entregados,

* las diferencias entre lo pedido y lo efectivamente entregado según remito,

* y los pagos parciales o totales realizados por cada cliente.

Este manejo descentralizado de la información genera inconsistencias, duplicación de datos y dificultades en el control del proceso comercial.

## Objetivo

### Objetivo general

Utilizando inteligencia artificial generativa y lenguaje natural, se propone desarrollar una aplicación que, a partir de una narrativa del negocio, los requerimientos funcionales y los modelos representacionales de las entidades involucradas, permita generar una solución informática destinada a centralizar, estructurar y facilitar la gestión de la información necesaria para el vendedor.

### Alcance del sistema

El sistema propuesto está diseñado inicialmente para ser utilizado por un único vendedor, quien será responsable de la gestión integral de clientes, productos, pedidos, remitos y cobros.
Este alcance no limita futuras ampliaciones del sistema, tales como la incorporación de nuevos roles o funcionalidades adicionales, pero define el contexto actual del análisis.

## Dominio del negocio

### Narrativa del caso

Un vendedor administra una cartera de clientes pertenecientes a distintos rubros, tales como ferretería, comercio general y otros. Diariamente recibe pedidos de clientes mediante contacto telefónico o visitas presenciales. Cada pedido incluye el número de cliente, los datos identificatorios correspondientes y un detalle de productos solicitados, indicando título, descripción y cantidades requeridas.

Los pedidos se registran en un período semanal que se extiende de miércoles a miércoles. Durante dicho período, los pedidos pueden ser creados y modificados libremente. Al finalizar la semana, el vendedor realiza el cierre del período de pedidos, a partir del cual los pedidos registrados pasan a un estado cerrado y no admiten modificaciones.

Los productos solicitados pueden provenir del stock disponible o requerir la gestión de compras a proveedores. A partir de los pedidos cerrados, el vendedor genera los remitos correspondientes, los cuales constituyen el documento que respalda la entrega de los productos al cliente. Cada remito detalla los productos a entregar, las cantidades efectivamente entregadas, los precios acordados y una fecha estimada de entrega.

## Estados y reglas de negocio

### Estados del proceso comercial

Con el objetivo de formalizar el funcionamiento del sistema, se definen explícitamente los estados que pueden adoptar los pedidos y los remitos dentro del ciclo pedido–entrega–cobro.

#### Estados del pedido

Pedido abierto: corresponde a un pedido registrado dentro del período semanal vigente. Puede ser creado, modificado o eliminado.

Pedido cerrado: corresponde a un pedido perteneciente a un período semanal ya finalizado. No admite modificaciones y puede ser utilizado para la generación de remitos.

#### Estados del remito

Remito cerrado completo: el remito incluye todos los productos solicitados en el pedido, con las cantidades exactas requeridas.

Remito cerrado limitado: el remito incluye todos los productos solicitados, pero con cantidades inferiores a las indicadas en el pedido.

Remito cerrado incompleto: el remito no incluye todos los productos solicitados en el pedido original.

### Registro de pedidos faltantes

Cuando las cantidades entregadas en un remito no coinciden con las solicitadas en el pedido asociado, el sistema debe generar automáticamente un registro de pedidos faltantes. Dicho registro refleja la diferencia entre el pedido original y el remito emitido, permitiendo llevar un control preciso de los productos pendientes de entrega.

Este registro se aplica tanto en los casos de remitos cerrados limitados como de remitos cerrados incompletos, y forma parte de la trazabilidad del proceso comercial.

### Reglas operativas del negocio

Para garantizar un comportamiento consistente del sistema, se establecen las siguientes reglas operativas:

Los pedidos solo pueden ser modificados mientras se encuentren en estado abierto.

El cierre del período semanal bloquea automáticamente todos los pedidos asociados.

Un remito solo puede generarse a partir de un pedido cerrado.

El estado del remito se determina automáticamente a partir de la comparación entre las cantidades pedidas y las cantidades entregadas.

Toda diferencia detectada entre pedido y remito debe registrarse como pedido faltante.

Los pagos pueden registrarse de forma parcial o total y se asocian a remitos entregados.

## Conceptos clave

### Unificación de vocabulario

A fin de evitar ambigüedades y facilitar la comprensión del sistema, se establece el uso de un vocabulario unificado a lo largo de todo el documento:

Pedido: solicitud de productos realizada por un cliente.

Remito: documento que respalda la entrega de productos asociados a un pedido.

Período semanal: intervalo de tiempo comprendido entre dos cierres consecutivos (miércoles a miércoles).

Pedido faltante: diferencia entre lo solicitado en el pedido y lo entregado según el remito.

El uso consistente de estos términos resulta clave para el análisis, diseño e implementación del sistema.

## Modelo conceptual del sistema

### Entidades principales

CLIENTE =
* cliente_id (PK)
* nombre
* domicilio
* teléfono
* CUIL

PROVEEDOR =
* proveedor_id (PK)
* proveedor_nombre

PRODUCTO =
* articulo_numero (PK parcial)
* producto_codigo (PK parcial)
* descripción
* unidad_medida
* proveedor_id (FK → PROVEEDOR)
* 📌 Regla: articulo_numero + producto_codigo identifican unívocamente al producto.

PEDIDO =
* pedido_id (PK)
* cliente_id (FK → CLIENTE)
* fecha_pedido
* periodo_id (FK → PERIODO)
* 📌 Conceptualmente, PEDIDO no debe contener productos directamente, sino a través de un detalle.

DETALLE_PEDIDO (entidad implícita, pero necesaria)
* pedido_id (FK → PEDIDO)
* articulo_numero (FK → PRODUCTO)
* producto_codigo (FK → PRODUCTO)
* cantidad
* 📌 PK compuesta: (pedido_id, articulo_numero, producto_codigo)

REMITO =
* remito_id (PK)
* pedido_id (FK → PEDIDO)
* fecha_emision
* fecha_entrega_estimada
* estado_remito (completo | limitado | incompleto)

DETALLE_REMITO =
* remito_id (FK → REMITO)
* articulo_numero (FK → PRODUCTO)
* producto_codigo (FK → PRODUCTO)
* cantidad_entregada
* precio_unitario

PAGO =
* pago_id (PK)
* remito_id (FK → REMITO)
* fecha_pago
* monto
* tipo_pago (parcial | total)

PERIODO =
* periodo_id (PK)
* fecha_inicio
* fecha_fin
* estado_periodo (abierto | cerrado)
* 📌 Regla clave: Un pedido pertenece a un solo período.

REPORTE =
* reporte_id (PK)
* periodo_id (FK → PERIODO)
* tipo_reporte (general | pedidos | productos | productos_por_proveedor)
* fecha_generacion
* generado_automaticamente (boolean)
* 📌 Un período puede generar múltiples reportes.

### Relaciones entre entidades

CLIENTE — PEDIDO
* Un CLIENTE puede realizar uno o muchos PEDIDOS
* Un PEDIDO pertenece a un solo CLIENTE
* Cardinalidad:
CLIENTE (1) —— (N) PEDIDO

PEDIDO — DETALLE_PEDIDO — PRODUCTO
* Un PEDIDO contiene uno o muchos PRODUCTOS
* Un PRODUCTO puede estar en muchos PEDIDOS
* Cardinalidad:
PEDIDO (1) —— (N) DETALLE_PEDIDO —— (1) PRODUCTO

PROVEEDOR — PRODUCTO
* Un PROVEEDOR provee uno o muchos PRODUCTOS
* Un PRODUCTO pertenece a un solo PROVEEDOR
* Cardinalidad:
PROVEEDOR (1) —— (N) PRODUCTO

PEDIDO — REMITO
* Un PEDIDO puede generar uno o varios REMITOS
* Un REMITO pertenece a un solo PEDIDO
* Cardinalidad:
PEDIDO (1) —— (N) REMITO

REMITO — DETALLE_REMITO — PRODUCTO
* Un REMITO incluye uno o muchos PRODUCTOS
* Un PRODUCTO puede figurar en muchos REMITOS
* Cardinalidad:
REMITO (1) —— (N) DETALLE_REMITO —— (1) PRODUCTO

REMITO — PAGO
* Un REMITO puede tener uno o muchos PAGOS
* Un PAGO corresponde a un solo REMITO
* Cardinalidad:
REMITO (1) —— (N) PAGO

PERIODO — PEDIDO
* Un PERIODO contiene uno o muchos PEDIDOS
* Un PEDIDO pertenece a un solo PERIODO
* Cardinalidad:
PERIODO (1) —— (N) PEDIDO

PERIODO — REPORTE
* Un PERIODO puede generar uno o muchos REPORTES
* Un REPORTE corresponde a un solo PERIODO
* Cardinalidad:
PERIODO (1) —— (N) REPORTE

## Estructura de datos

### Consideraciones generales

En primera instancia se considera esencial el registro y control de los pedidos, dejando para una segunda etapa la inclusión de los remitos.

### Estructura de datos operativa

Se inicia una conversación con **ChatGPT**. La instrucción dada es: 

> Necesito una estructura de datos JSON a partir de esta información:
> Tabla CLIENTE = cliente_id + nombre + domicilio + teléfono + CUIL
> Tabla PRODUCTO = articulo_numero + producto_codigo + descripción + unidad_medida + proveedor_id
> Tabla PROVEEDOR = proveedor_id + proveedor_nombre
> Tabla PEDIDO = pedido_id + articulo_numero + producto_codigo + cantidad + cliente_id
> Una regla de negocio es que los productos se identifican por articulo_numero y producto_codigo, los cuales provienen de otro sistema y son cargados manualmente.
> Un CLIENTE puede realizar uno o mas pedidos durante la misma semana.
> Un PEDIDO tiene uno y solo un CLIENTE, pero contiene minimo un PRODUCTO.

> Necesito una estructura para REPORTE_PEDIDOS que sea una lista de todos los pedidos hasta una fecha límite de cierre, por ejemplo todos los miércoles a las 11hs AM UTC-3.

> Necesito una estructura para REPORTE_PRODUCTOS que sea una lista de todos los productos de los pedidos reportados en REPORTE_PEDIDOS hasta la misma fecha límite de cierre, con la cantidad total de cada uno de dichos productos.

La respuesta obtenida: 

```
{
  "fecha_corte": "2025-07-23T11:00:00-03:00",
  "pedidos": [
    {
      "pedido_id": 101,
      "cliente": {
        "cliente_id": 1,
        "nombre": "Juan Pérez",
        "domicilio": "Calle Falsa 123",
        "telefono": "123456789",
        "CUIL": "20-12345678-9"
      },
      "productos": [
        {
          "articulo_numero": 5001,
          "producto_codigo": "A-1001",
          "descripcion": "Caja de tornillos",
          "unidad_medida": "unidad",
          "cantidad": 5,
          "proveedor": {
            "proveedor_id": 10,
            "proveedor_nombre": "Acme S.A."
          }
        },
        {
          "articulo_numero": 5002,
          "producto_codigo": "A-1002",
          "descripcion": "Llave inglesa",
          "unidad_medida": "unidad",
          "cantidad": 2,
          "proveedor": {
            "proveedor_id": 11,
            "proveedor_nombre": "Herramientas SRL"
          }
        }
      ]
    },
    {
      "pedido_id": 102,
      "cliente": {
        "cliente_id": 2,
        "nombre": "María Gómez",
        "domicilio": "Av. Siempre Viva 742",
        "telefono": "987654321",
        "CUIL": "27-87654321-0"
      },
      "productos": [
        {
          "articulo_numero": 5001,
          "producto_codigo": "A-1001",
          "descripcion": "Caja de tornillos",
          "unidad_medida": "unidad",
          "cantidad": 10,
          "proveedor": {
            "proveedor_id": 10,
            "proveedor_nombre": "Acme S.A."
          }
        }
      ]
    }
  ]
}
{
  "fecha_corte": "2025-07-23T11:00:00-03:00",
  "productos": [
    {
      "articulo_numero": 5001,
      "producto_codigo": "A-1001",
      "descripcion": "Caja de tornillos",
      "unidad_medida": "unidad",
      "cantidad_total": 15,
      "proveedor": {
        "proveedor_id": 10,
        "proveedor_nombre": "Acme S.A."
      }
    },
    {
      "articulo_numero": 5002,
      "producto_codigo": "A-1002",
      "descripcion": "Llave inglesa",
      "unidad_medida": "unidad",
      "cantidad_total": 2,
      "proveedor": {
        "proveedor_id": 11,
        "proveedor_nombre": "Herramientas SRL"
      }
    }
  ]
}
```

## Uso de inteligencia artificial generativa

### Uso de V0

Generación de interfaz y aplicación base. Se inicia una conversación con **V0**. Las instrucciones o *prompts* enviados son: 

> Hola! Puedes hacer una aplicación web mobile first para: crear y modificar listas de productos desde archivo excel o manualmente, crear y actualizar lista de clientes, registrar y modificar pedidos de clientes, y generar reportes semanales usando como referencia la estructura de datos adjunta. Los reportes deberán ser almacenados y podrán consultarse en listados ordenados por fecha desde el más reciente hacia el menos reciente, ordenando también los pedidos.

![Inicio de la aplicación](/images/sistema-gestion-pedidos-inicio.svg "Una vista del inicio de la aplicación")

> Además, al subir un archivo excel para crear o modificar la lista de productos, que sepa interpretar: un campo "Nº Artículo" o "Art." es equivalente a "Artículo" y se corresponde con el atributo "articulo_numero", un campo "Desc" o "Descripcion" o "Descripciom" es equivalente a "Descripción" y se corresponde con el atributo "descripcion", un campo "Cod" o "Codigo" es equivalente a "Código" y se corresponde con el atributo "producto_codigo".

> Si en el documento excel no se encuentra un campo, por ejemplo Codigo Producto, completar el atributo "producto_codigo" con espacio en blanco.

> Todos los productos en cuya descripción contenga la palabra "CABLE" o "cable" su atributo "unidad_medida" debe ser igual a "metros".

> Otros campos que se encuentren en el documento excel no serán tenidos en cuenta para llenar la lista de productos.

![Importar Productos](/images/sistema-gestion-pedidos-importarproductos.svg "Sección Importar Productos desde planilla de cálculos")

Adjuntar la estructura obtenida en ChatGPT. También se le pide una base de datos para almacenar toda la información, y una barra de navegación simple y responsiva. 

Se le pide que muestre reportes: 

> Necesito un Reporte Semanal de Productos que contenga la totalidad de los productos pedidos con sus número de artículo y su descripción, la cantidad total de cada uno de ellos, ordenados por número artículo, separados por su proveedor con nombre de cada proveedor. Pedidos debe tener un atributo "fecha_pedido". Necesito un Reporte Semanal de Pedidos con los pedidos ordenados por su fecha, el nombre cliente y la lista de productos y cantidades en cada pedido. 

> Dentro de Reportes de Pedidos, necesito que se pueda leer el pedido completo de cada cliente, con todos sus productos. En Pedidos, al modificar o eliminar un Pedido, debe impactar y generar automaticamente los nuevos Reportes (General, de Productos y de Pedidos), modificando los valores de los pedidos o eliminandolos segun sea el caso.Crear el reporte en formato excel para descargar desde la flecha de descarga dentro de cada uno de los Reportes, usando la flecha del extremo superior derecho de los mismos.

> Todos los días miércoles a las 10:59AM necesito generar automáticamente el reporte general, el reporte de produtos por proveedor y el reporte de pedidos, en base a todos los pedidos generados desde las 11:00AM del miércoles anterior. 
Conserva las funcionalidades y botones actuales para generar reportes parciales. 
Todo pedido podrá ser modificado hasta que se cierre el reporte (ya sea cierre automático de miércoles 10:59AM o al generar reporte parcial desde el botón). 
Todo pedido incluido en un reporte generado, no deberá volver a incluirse en el reporte siguiente. 

## Resultados obtenidos

### Funciones básicas

Sección Productos: muestra todos los productos cargados tanto desde planilla de cálculo como aquellos subidos individualmente.

![Sección Productos](/images/sistema-gestion-pedidos-productos.svg "Sección Productos")

Sección Agregar Producto: es la que permite agregar un producto individualmente y sus atributos como Número de Artículo, Código del Producto, Descripción, Unidad de Medida, Proveedor.

![Agregar Productos](/images/sistema-gestion-pedidos-agregarproducto.svg "Sección Agregar Productos")

Sección Pedidos: muestra todos los pedidos cargados.

![Sección Pedidos](/images/sistema-gestion-pedidos-pedidos.svg "Sección Pedidos")

Sección Nuevo Pedido: es la que permite cargar un nuevo pedido con los atributos Código de Cliente, Fecha de Pedido, y una sección Agregar Productos para buscar y agregar los mismos.

![Nuevo Pedido](/images/sistema-gestion-pedidos-nuevopedido.svg "Sección Nuevo Pedido")

## Trabajo futuro

### Posibles extensiones
* Multiusuario
* Gestión de stock
* Integración contable
* Análisis predictivo
