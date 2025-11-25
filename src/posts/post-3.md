---
title: Aplicación - Carga Pedidos v1
layout: post.njk
slug: post-3
image: /images/order.svg
tags: post
date: 2025-07-23 23:07:00
---

# APLICACIÓN - CARGANDO PEDIDOS I

<a name="introduction"></a>

1. [INTRODUCCIÓN](#introduction)
2. [ESTRUCTURA DE DATOS](#part-1-1)
3. [CREANDO CON IA](#part-2-1)

## Introducción

### Narrativa del caso

Un vendedor lleva una cartera de clientes de rubros ferretería, general y otros. Diariamente recibe pedidos de clientes los cuales consisten en: número de cliente, datos del cliente, detalle listando productos (título y descripción) con sus cantidades. 
Semanalmente los días miércoles el vendedor cierra los pedidos y ya no pueden modificarse, al mismo tiempo inicia otra semana de nuevos pedidos (de miércoles a miércoles). El origen de los productos es el stock y otros son pedidos a proveedores. Para cerrar el ciclo pedido-entrega-cobro se genera un remito con los productos que van a ser entregados, sus precios al cliente y la fecha probable de entrega del remito-pedido. Si los productos del remito-pedido abarcan exactamente los del pedido se marca con estado cerrado-completo, si los productos del remito-pedido abarcan cada uno de los productos pero no alcanzan en sus cantidades se marca con estado cerrado-limitado y si los productos del remito-pedido no cubren todos los productos del pedido se marca con estado cerrado-incompleto. En cada caso se deberá regitrar en pedidos-faltantes la diferencia entre el remito y su pedido relacionado (remito-pedido). 
El vendedor es responsable de crear, leer, modificar y eliminar las categorías codificadas de productos, las imágenes codificadas de productos, los proveedores codificados de productos, y los productos codificados los cuales deberán admitir subida masiva desde planilla de cálculo excel. 

<a name="part-1-1"></a>

## Parte I

### Estructura de datos

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

<a name="part-2-1"></a>

## Parte II

### Creando con IA

Se inicia una conversación con **V0**. Las instrucciones o *prompts* enviados son: 

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

1. [INTRODUCCIÓN](#introduction)
2. [ESTRUCTURA DE DATOS](#part-1-1)
3. [CREANDO CON IA](#part-2-1)