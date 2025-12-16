---
title: Iniciación - Usando IA
layout: post.njk
slug: post-2
image: /images/blog-post.svg
tags: post
date: 2025-07-19 23:43:00
---

## Introducción

Con el surgimiento del **modelo extenso de lenguaje** o LLM (*Large Language Model*) en 2018, definido formalmente como un modelo de lenguaje de aprendizaje profundo que consta de una red neuronal* con muchos parámetros (normalmente miles de millones o más) entrenados en grandes cantidades de texto sin etiquetar mediante aprendizaje autosupervisado o aprendizaje semisupervisado, entendiéndose esta definición como un tipo de **inteligencia artificial** (IA) entrenado con grandes cantidades de datos para entender y generar lenguaje humano de manera natural, se marca un hito en la historia y el inicio de un exponencial crecimiento, masividad y versatilidad de aplicaciones con IA generativa capaces de realizar tareas como escribir texto en lenguaje humano, traducir texto, responder preguntas, mantener diálogos, resumir, analizar y además escribir instrucciones y código en lenguajes de programación.
<br>

*(\*) El concepto de red neuronal surge en 1943 al desarrollarse el primer modelo matemático de una neurona, posteriormente aparecen los conceptos de perceptrón, perceptrón multicapa, red neuronal prealimentada, red neuronal convolucional (Neocognitron), esta última mejorada en 1998 (backpropagation algorithm) y con posterior refinamiento e implementación en unidades de procesamiento gráfico en 2012.*

## Parte I

### Usando IA para proponer mejoras

Pensemos el siguiente [escenario](## "⚠ El escenario planteado está basado en una actividad laboral real. Los nombres de los campos han sido modificados deliberadamente. ⚠")*: como empleado en una pyme tengo la tarea de recorrer un área y realizar una serie de verificaciones puntuales, para ello dispongo de una planilla de cálculo (en documento excel) que debo completar con mi trabajo diario, estructurado en un encabezado con filas y debajo un cuerpo con columnas, todas con sus campos claramente identificados: 

*(\*)⚠ El escenario planteado está basado en una actividad laboral real. Los nombres de los campos han sido modificados deliberadamente. ⚠*

### Estructura de la planilla de trabajo

### Filas
* Tipo de planilla:
* Fecha:
* Nombre empleado:
* Lugar de trabajo:
* Totales:

### Columnas
* Grupo
* Operador
* Código
* Máquina
* Hora
* Estado
* Cantidad/Cantidades
* Sector
* Observaciones

El campo Tipo de Planilla se completa con un nombre fijo "Planilla de Trabajo Diario". Fecha, Nombre de empleado y Lugar de Trabajo son campos triviales. Totales es el resultado de sumar los registros desde columna Cantidades. En la columna Grupo se coloca un código alfanumérico. En columna Operador, el nombre del operador. En Máquina el número identificador de máquina. En Hora la hora exacta de verificación. En Estado un estado en minutos y segundos, positivo o negativo o cero. En Cantidad un número entero mayor o igual a cero. En Sector una ubicación en palabras. Observaciones opcionalmente se completa con un breve texto de observaciones realizadas.

Al finalizar la jornada, <u>cada planilla completada es enviada por correo electrónico</u> a un encargado o superior, para ser descargadas una por una en una computadora y luego revisadas, nuevamente una por una...

¿Cómo podríamos proponer una mejora a este procedimiento? Podemos acercarnos a una solución creando una aplicación web que nos permita registrar o cargar las planillas de trabajo diario y procesarlas convenientemente. 

## Parte II

### Obteniendo una estructura de datos

>«Can you create a general data structure from this excel?»

Procedemos con un primer "prompt" (comando o instrucción) como el anterior, agregando el documento excel, todo dentro de una nueva conversación con herramienta conversacional IA (ChatGPT, Claude, Gemini, o la de preferencia) usando el navegador de una computadora o aplicación de teléfono móvil. La IA analiza el documento, genera los scripts para poder "leerlo" y responde con un primer resultado. 

### Estructura general de datos

Una **estructura de datos** es según la enciclopedia una forma particular de organizar información para que pueda ser utilizada de manera eficiente. Más precisamente, una estructura de datos es una <u>colección de valores, las relaciones entre ellos y las funciones y operaciones que se pueden aplicar a los datos</u>, es decir, es una estructura algebraica de datos. 
En este caso la denominamos *general* pues partimos de una representación de una planilla de cálculo en general hacia una estructura de datos más específica.

Continuando con el desarrollo, la IA tiene problemas al intentar analizar la planilla de cálculo...

> «I'll analyze the Excel file to understand its structure and create a general data structure representation for you.»

```
javascript

// Read and analyze the Excel file
import * as XLSX from 'xlsx';

const response = await window.fs.readFile('PLANILLA.xlsx');
const workbook = XLSX.read(response, {
    cellStyles: true,
    cellFormulas: true,
    cellDates: true,
    cellNF: true,
    sheetStubs: true
});

// Explore workbook structure
console.log("Workbook metadata:");
console.log(workbook.Workbook);

console.log("\nSheet names:");
console.log(workbook.SheetNames);

// Analyze each sheet
workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`\n=== Sheet ${index + 1}: ${sheetName} ===`);
    const worksheet = workbook.Sheets[sheetName];
    
    // Get sheet metadata (properties starting with '!')
    const metadata = {};
    Object.keys(worksheet).forEach(key => {
        if (key.startsWith('!')) {
            metadata[key] = worksheet[key];
        }
    });
    console.log("Sheet metadata:", metadata);
    
    // Convert to JSON to see structure
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
    console.log(`Dimensions: ${jsonData.length} rows`);
    
    if (jsonData.length > 0) {
        console.log("First few rows:");
        jsonData.slice(0, Math.min(10, jsonData.length)).forEach((row, i) => {
            console.log(`Row ${i}:`, row);
        });
    }
});
```

Mensajes de error mediante, la siguiente respuesta fue: 

> «I've created a general data structure template for inspection checklists based on the filename you provided. The structure covers the typical components found in daily work forms:»
> * Document metadata and identification
> * General information about the inspection (date, inspector, location)
> * Subject details (what's being inspected)
> * Inspection items with status tracking
> * Summary and assessment results
> * Required actions and follow-up
> * Signatures for validation


> «This structure is flexible and can accommodate various types of inspections (safety, health, quality, compliance, etc.). The data types and validation rules ensure consistency and proper integration with other systems.»

```
javascript

{
  // Document metadata
  inspectionForm: {
    documentInfo: {
      title: "Planilla de Trabajo",
      date: "2025-07-10",
      version: "string",
      formId: "string"
    },
    
    // General information section
    generalInfo: {
      inspectionId: "string",
      inspectionDate: "date",
      inspector: {
        name: "string",
        id: "string",
        certification: "string"
      },
      location: {
        address: "string",
        coordinates: "object",
        zone: "string"
      },
      inspectionType: "string", // routine, complaint-based, follow-up, etc.
      weather: "string"
    },
    
    // Subject being inspected
    inspectedEntity: {
      name: "string",
      type: "string", // business, facility, equipment, etc.
      license: "string",
      contact: {
        person: "string",
        phone: "string",
        email: "string"
      }
    },
    
    // Inspection items/checklist
    inspectionItems: [
      {
        category: "string",
        itemId: "string",
        description: "string",
        requirement: "string",
        status: "string", // compliant, non-compliant, not-applicable, pending
        observations: "string",
        photos: ["string"], // photo references
        correctionRequired: "boolean",
        deadline: "date"
      }
    ],
    
    // Overall assessment
    summary: {
      totalItems: "number",
      compliantItems: "number",
      nonCompliantItems: "number",
      overallStatus: "string",
      riskLevel: "string", // low, medium, high
      followUpRequired: "boolean",
      followUpDate: "date"
    },
    
    // Actions and recommendations
    actions: [
      {
        type: "string", // correction, warning, fine, closure
        description: "string",
        deadline: "date",
        responsible: "string",
        status: "string"
      }
    ],
    
    // Signatures and approvals
    signatures: {
      inspector: {
        name: "string",
        signature: "string",
        date: "date"
      },
      inspected: {
        name: "string",
        position: "string",
        signature: "string",
        date: "date"
      }
    }
  }
}
```

Esta estructura de datos puede ser útil pero resulta «genérica» para el caso. Se le vuelve a escribir, indicando cuáles son los campos de la planilla excel de trabajo:

> «Good job. In every DAILY WORK FORM we have: 
Title: DAILY WORK FORM. 
Employee name. 
Date of the day. 
Place of work (city or address). 
And we have a list of service checks, each entry containing the following fields:
Group number.
Operator name.
Service code.
Machine number.
Exact hour of control.
Status.
Quantities.
Address of sector.
Observations (if necessary).»

Su respuesta certera:

> «Perfect! Let me update the data structure to reflect the specific requirements for your DAILY WORK FORM for what appears to be a work inspection system.»

```
javascript

{
  dailyWorkForm: {
    // Form header information
    formHeader: {
      title: "DAILY WORK FORM",
      employeeName: "string",
      date: "YYYY-MM-DD", // Date of the day
      placeOfWork: "string" // City or address
    },
    
    // List of inspections
    serviceChecks: [
      {
        groupNumber: "string", // Group identifier
        operatorName: "string",
        serviceCode: "string", // Service identifier
        machineNumber: "string", // Macine number
        exactHourOfControl: "HH:MM:SS", // Time format
        status: {
          minutes: "number", // Positive for late, negative for early
          status: "string" // "on-time", "ahead", "late"
        },
        quantities: "number",
        addressOfSector: "string",
        observations: "string" // Optional field
      }
    ]
  }
}
```

Además de obtener como resultado la estructura de datos de la planilla de cálculo y mostrar un ejemplo con datos (ficticios), se puede pedir ampliar la respuesta con las especificaciones de qué datos maneja cada campo, validación de datos de cada campo y restricciones, lógicas o reglas de negocio, y una estructura adicional de estadísticas diarias basadas en la planilla original.

Con esto, estamos listos para avanzar al siguiente paso.

## Parte III

### Creando una aplicación web

Buscando alguna herramienta de IA que genera <u>componentes de interfaz de usuario</u> a partir de descripciones en lenguaje natural, se inicia un nuevo hilo de conversación pero esta vez con **Vercel V0**. Sin vueltas, se le pide que a partir de la <u>estructura de datos</u> creada anteriormente cree una aplicación web *mobile first* para registrar trabajo diario:

> Hey there. Can you make a web mobile first for register my daily work? The data structure I use is shown below.

Inmediatamente inserto la estructura de datos creada anteriormente:

```
{
  dailyWorkForm: {
    // Form header information
    formHeader: {
      title: "DAILY WORK FORM",
      employeeName: "string",
      date: "YYYY-MM-DD", // Date of the day
      placeOfWork: "string" // City or address
    },
    
    // List of inspections
    serviceChecks: [
      {
        groupNumber: "string", // Group identifier
        operatorName: "string",
        serviceCode: "string", // Service identifier
        machineNumber: "string", // Machine number
        exactHourOfControl: "HH:MM:SS", // Time format
        status: {
          minutes: "number", // Positive for late, negative for early
          status: "string" // "on-time", "ahead", "late"
        },
        quantities: "number",
        addressOfSector: "string",
        observations: "string" // Optional field
      }
    ]
  }
}
```

Y algunas condiciones:

> Status criteria: negative = late (yellow color), positive = early (from 2 onwards, red color), 0 = on-time (between 0 and 1min 59sec, green color).
Add a checkbox of non-compliance in the Observations attribute, and call it "Infracción". If the service has non-compliance, turn all the Service Check into red background. Under Service Inspections, add a counter for services checks recorded with non-compliance.

Viendo los resultados positivos, se le pide que permita cargar o subir directamente la planilla de cálculo excel y autocomplete los campos uno por uno, con persistencia de datos y base de datos mediante:

> Please, add a function to upload an .xlsx document with the spreadsheet fields: Nombre, Día, Lugar, Sentido, Grupo, Operador, Código, Máquina, Hora, Status, Cantidades, Sector, Observación. Nombre, Día, Lugar, Sentido, are rows in the xlsx document. Grupo, Operador, Código, Máquina, Hora, Status, Cantidades, Sector, Observación, are columns in the xlsx document. Please accept lowercase and uppercase field names indistinctly (field matching case-insensitive).
Fill automatically all the daily form in their respective attributes: Name, Date, Place of Work; and for every Service Inspection: Group Number, Service Code, Operator Name, Machine Number, Time, Status, Quantities, Address of Sector, Observations.

> Status Variance attribute has the format mm:ss. If the xlsx document uploaded has Status field in +mm, -mm, +mm:ss, -mm:ss, (+mm:ss), (-mm:ss), extract the exact values to fill the Status Variance. 
Examples: (+02:30) → 2 minutes 30 seconds early, (-01:45) → 1 minute 45 seconds late, +3:30  → 3 minutes 30 seconds early, -2:00 → 2 minutes 00 seconds late.

> Add a calendar to visualize saved forms in every day.
In Recent Inspections Forms add a Delete functionality for a selectd form.
In Recent Inspections Forms, in View Details, add Observations attribute, if it empty show "None". 
If the xlsx document uploaded have Observación field with a word "INFRACCIÓN" or "Infracción" or "infracción", check the non-compliance box in their respective services.

Se puede agregar algunas estadísticas en un panel de control o *dashboard*:

> In Dashboard, in overview show me the top 10 of most used lineOrRouteNumber, and the top 20 of most used addressOfStop, in the current month.

Esta conversación se puede extender tanto como uno quiera y crea necesario, corrigiendo errores de interpretación, aprendiendo a escribir de forma objetiva para reducir errores, proponiendo e intercambiando ideas... Con algunas instrucciones como las vistas, *prompts* claros y concisos se logran resultados sorprendentes. No hay límites para poner creatividad con estas herramientas.
