---
title: PROYECTO GESTIÓN PEDIDOS
layout: post.njk
slug: post-2
image: /images/post-2.svg
tags: post
---
  
## INTRODUCCIÓN

> ⚠☢☣ ␀ EN CONSTRUCCIÓN ␀ ☣☢⚠

### ESTRUCTURA DE DATOS

Resumiendo, las instrucciones o prompts dados son:  

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

### CREANDO CON IA

Utilizando la herramienta V0 de Vercel para iniciar una conversación y adjuntar la estructura de datos anterior:

> Hola! Puedes hacer una aplicación web mobile first para: crear y modificar listas de productos desde archivo excel o manualmente, crear y actualizar lista de clientes, registrar y modificar pedidos de clientes, y generar reportes semanales usando como referencia la estructura de datos adjunta. Los reportes deberán ser almacenados y podrán consultarse en listados ordenados por fecha desde el más reciente hacia el menos reciente, ordenando también los pedidos.

> Además, al subir un archivo excel para crear o modificar la lista de productos, que sepa interpretar: un campo "Nº Artículo" o "Art." es equivalente a "Artículo" y se corresponde con el atributo "articulo_numero", un campo "Desc" o "Descripcion" o "Descripciom" es equivalente a "Descripción" y se corresponde con el atributo "descripcion", un campo "Cod" o "Codigo" es equivalente a "Código" y se corresponde con el atributo "producto_codigo".

> Si en el documento excel no se encuentra un campo, por ejemplo Codigo Producto, completar el atributo "producto_codigo" con espacio en blanco.

> Todos los productos en cuya descripción contenga la palabra "CABLE" o "cable" su atributo "unidad_medida" debe ser igual a "metros".

> Otros campos que se encuentren en el documento excel no serán tenidos en cuenta para llenar la lista de productos.
>

 