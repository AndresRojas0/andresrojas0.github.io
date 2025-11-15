---
title: INCURSIÓN EN EL USO DE IA
layout: post.njk
slug: post-1
image: /images/post-1.svg

---

## INTRODUCCIÓN

Con el surgimiento del **modelo extenso de lenguaje** o LLM (*Large Language Model*) en 2018, definido formalmente como un modelo de lenguaje de aprendizaje profundo que consta de una red neuronal* con muchos parámetros (normalmente miles de millones o más) entrenados en grandes cantidades de texto sin etiquetar mediante aprendizaje autosupervisado o aprendizaje semisupervisado, entendiéndose esto como un tipo de **inteligencia artificial** (IA) entrenado con grandes cantidades de datos para entender y generar lenguaje humano de manera natural, se marca un hito en la historia y el inicio de un exponencial crecimiento, masividad y versatilidad de aplicaciones con IA generativa capaces de realizar tareas como escribir texto en lenguaje humano, traducir texto, responder preguntas, mantener diálogos, resumir, analizar y además escribir instrucciones y código en lenguajes de programación.
<br>
*(\*) El concepto de red neuronal surge en 1943 al desarrollarse el primer modelo matemático de una neurona, posteriormente aparecen los conceptos de perceptrón, perceptrón multicapa, red neuronal prealimentada, red neuronal convolucional (Neocognitron), esta última mejorada en 1998 (backpropagation algorithm) y con posterior refinamiento e implementación en unidades de procesamiento gráfico en 2012.*

## PARTE I
### USANDO IA PARA PROPONER MEJORAS

Pensemos el siguiente escenario: como empleado en una pyme tengo la tarea de recorrer un área y realizar una serie de verificaciones puntuales, para ello dispongo de una planilla de cálculo (en documento excel) que debo completar con mi trabajo diario, estructurado en un encabezado con filas y debajo un cuerpo con columnas, todas con sus campos claramente identificados: 
<br>
Filas
* Tipo de planilla:
* Fecha:
* Nombre empleado:
* Lugar de trabajo:
* Totales:

Columnas
* Grupo
* Operador
* Código
* Máquina
* Hora
* Estado
* Cantidad/Cantidades
* Sector
* Observaciones

Al finalizar la jornada, <u>cada planilla completada es enviada por correo electrónico</u> a un encargado o superior, para ser descargadas una por una en una computadora y luego revisadas, nuevamente una por una...

>«Can you create a general data structure from this excel?»

Cómo podríamos proponer una mejora a este procedimiento? Con un primer "prompt" (comando o instrucción) como el anterior y agregando el documento excel, todo dentro de una nueva conversación con herramienta IA (ChatGPT, Claude, Gemini, o la de preferencia) usando el navegador de una computadora o aplicación de teléfono móvil. Inmediatamente la IA analiza el documento, genera los scripts para poder "leerlo" y responde con un primer resultado. 

### ESTRUCTURA GENERAL DE DATOS

En este caso, la IA tiene problemas al intentar analizar la planilla de cálculo...

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

Esta estructura de datos puede ser útil pero resulta «genérica» para el caso. Se le vuelve a escribir, indicando cuáles son los campos de la planilla de excel de trabajo:

> «Good job. In every DAILY WORK FORM we have: 
Title: DAILY WORK FORM. 
Employee name. 
Date of the day. 
Place of work (city or address). 
And we have a list of inspection checked, every with:
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

> «Perfect! Let me update the data structure to reflect the specific requirements for your DAILY INSPECTION FORM for what appears to be a transportation/bus service inspection system.»

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

Además de responder con exactamente la estructura de datos de la planilla de cálculo y mostrar un ejemplo con datos (ficticios), puede ampliar la respuesta con las especificaciones de qué datos maneja cada campo, lógicas o reglas de negocio, validación de datos de cada campo y restricciones, y una estructura adicional de estadísticas diarias basadas en la planilla original.
<br>
Con esto, estamos listos para avanzar al siguiente paso.

## PARTE II
### CREANDO CON IA