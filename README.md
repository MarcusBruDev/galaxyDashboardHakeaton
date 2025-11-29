# 🌌 Galaxy Dashboard - Mars Colony Simulator

Un dashboard interactivo en tiempo real para monitorear y gestionar colonias en Marte. Este proyecto simula dinámicamente la producción de recursos, consumo poblacional, condiciones ambientales y eventos planetarios.

![Mars Colony Dashboard](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución del Proyecto](#-ejecución-del-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Modelo de Datos](#-modelo-de-datos)
- [Sistema de Simulación](#-sistema-de-simulación)
- [API Endpoints](#-api-endpoints)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)

## ✨ Características

### 🎯 Simulación en Tiempo Real
- **Actualización automática cada 10 segundos** de todos los parámetros del planeta
- **Producción dinámica de recursos** por colonia (agua, oxígeno, energía, comida, minerales)
- **Consumo realista** basado en la población de cada colonia
- **Variaciones ambientales** (temperatura, radiación, composición atmosférica)

### 🏗️ Gestión de Colonias
- Múltiples colonias con producción y almacenamiento independientes
- Transferencia automática del 50% de recursos producidos al almacenamiento global
- Eficiencia variable de producción que simula condiciones reales

### ⚡ Sistema de Eventos
- **Tormentas solares**: Reducen la producción de energía en un 30%
- **Descenso de temperatura**: Afecta la temperatura ambiente en -5°C
- **Tormentas de polvo**: Reducción adicional de energía del 15%
- Extensible para agregar nuevos tipos de eventos

### 📊 Dashboard Interactivo
- Visualización 3D del planeta con Three.js
- Gráficos en tiempo real con Recharts
- Interfaz moderna con React y TailwindCSS
- Monitoreo de recursos globales y por colonia

### 📜 Historial Completo
- Registro automático de cada actualización del planeta
- Almacenamiento de estados históricos en MongoDB
- Permite análisis de tendencias y evolución del planeta

## 🏛️ Arquitectura del Proyecto

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │ ◄─────► │  Express API    │ ◄─────► │    MongoDB      │
│  (Vite + React) │  HTTP   │  (Node.js)      │         │   Database      │
│                 │         │                 │         │                 │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     │
                            ┌────────▼────────┐
                            │   Cron Job      │
                            │ (cada 10 seg)   │
                            │                 │
                            │ - Actualiza     │
                            │   ambiente      │
                            │ - Procesa       │
                            │   colonias      │
                            │ - Gestiona      │
                            │   eventos       │
                            │ - Guarda        │
                            │   historial     │
                            └─────────────────┘
```

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (v9 o superior) - Viene con Node.js
- **MongoDB** (v6 o superior) - [Descargar](https://www.mongodb.com/try/download/community)
  - Puede ser una instancia local o MongoDB Atlas (cloud)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/galaxyDashboardHakeaton.git
cd galaxyDashboardHakeaton
```

### 2. Instalar dependencias del Frontend

```bash
npm install
```

### 3. Instalar dependencias del Backend

```bash
cd server
npm install
```

## ⚙️ Configuración

### Configurar MongoDB

1. **Opción A: MongoDB Local**
   ```bash
   # Iniciar MongoDB localmente
   mongod
   ```

2. **Opción B: MongoDB Atlas (Cloud)**
   - Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crea un cluster gratuito
   - Obtén tu connection string

### Configurar variables de entorno (Opcional)

Crea un archivo `.env` en la carpeta `server/` si necesitas personalizar la configuración:

```env
# server/.env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/galaxy-dashboard
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/galaxy-dashboard
```

Si no creas el archivo `.env`, el proyecto usará los valores por defecto:
- Puerto: `3000`
- MongoDB: `mongodb://localhost:27017/galaxy-dashboard`

### Crear datos iniciales (Opcional)

El sistema puede funcionar sin datos iniciales, pero si quieres poblar la base de datos con un planeta de ejemplo, puedes usar el endpoint POST `/planet` con el siguiente JSON:

```json
{
  "name": "Ares Prime",
  "description": "Colonia principal establecida en la zona templada del hemisferio norte.",
  "global_resources": {
    "water": 120000,
    "oxygen": 85000,
    "energy": 150000,
    "food": 60000,
    "minerals": 300000
  },
  "population": 12000,
  "environment": {
    "temperature": -32,
    "radiation_level": "medium",
    "atmosphere": {
      "co2": 95.32,
      "nitrogen": 2.7,
      "argon": 1.6,
      "oxygen": 0.13
    }
  },
  "colonies": [
    {
      "id": "col-1",
      "name": "Nova Habitat",
      "population": 3200,
      "production": {
        "energy_per_min": 500,
        "water_per_min": 120,
        "oxygen_per_min": 80,
        "food_per_min": 40,
        "minerals_per_min": 200
      },
      "storage": {
        "water": 20000,
        "oxygen": 15000,
        "energy": 30000,
        "food": 8000,
        "minerals": 50000
      }
    },
    {
      "id": "col-2",
      "name": "Aurora Base",
      "population": 2200,
      "production": {
        "energy_per_min": 300,
        "water_per_min": 90,
        "oxygen_per_min": 60,
        "food_per_min": 35,
        "minerals_per_min": 150
      },
      "storage": {
        "water": 15000,
        "oxygen": 10000,
        "energy": 20000,
        "food": 5000,
        "minerals": 30000
      }
    }
  ],
  "events": [
    {
      "id": "ev-1",
      "type": "solar_storm",
      "description": "Tormenta solar afectando temporalmente la producción energética.",
      "active": true
    },
    {
      "id": "ev-2",
      "type": "low_temperature",
      "description": "Descenso repentino de temperatura en la región sur.",
      "active": false
    }
  ]
}
```

## 🎮 Ejecución del Proyecto

### Modo Desarrollo (Recomendado)

Necesitarás **dos terminales** abiertas:

#### Terminal 1: Backend (API + Simulación)

```bash
cd server
npm run dev
```

Deberías ver:
```
[nodemon] starting `node src/index.js`
Database connected
⏳ Cron iniciado: actualización del planeta cada 10 segundos
Server is running on port 3000
✓ Actualización automática del planeta: 14:39:40
  Recursos globales: E:149975 W:119973 O:84976
  Temperatura: -32.5°C | Radiación: medium
  ⚠ Eventos activos: solar_storm
  Colonias: 2 | Población total: 12000
```

#### Terminal 2: Frontend (React App)

```bash
# Desde la raíz del proyecto
npm run dev
```

Deberías ver:
```
  VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Acceder a la aplicación

Abre tu navegador en: **http://localhost:5173**

## 📁 Estructura del Proyecto

```
galaxyDashboardHakeaton/
├── server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/            # Controladores de rutas
│   │   │   └── planet.controller.js
│   │   ├── models/                 # Modelos de MongoDB
│   │   │   └── planet.model.js
│   │   ├── routers/                # Definición de rutas
│   │   │   └── planet.routes.js
│   │   ├── Services/               # Lógica de negocio
│   │   │   ├── randomChange.js     # Sistema de simulación
│   │   │   └── triggers.js
│   │   ├── app.js                  # Configuración de Express
│   │   ├── db.js                   # Conexión a MongoDB
│   │   └── index.js                # Punto de entrada
│   └── package.json
│
├── src/                             # Frontend (React)
│   ├── components/                 # Componentes React
│   │   ├── ColonyCard.jsx
│   │   ├── EventsPanel.jsx
│   │   ├── Mars3D.jsx
│   │   ├── ResourceChart.jsx
│   │   └── ...
│   ├── context/                    # Context API
│   │   └── PlanetContext.jsx
│   ├── api/                        # Servicios API
│   │   └── planetApi.js
│   ├── App.jsx                     # Componente principal
│   ├── main.jsx                    # Punto de entrada
│   └── index.css                   # Estilos globales
│
├── public/                          # Archivos estáticos
├── package.json                     # Dependencias frontend
├── vite.config.js                  # Configuración de Vite
├── tailwind.config.js              # Configuración de Tailwind
└── README.md                        # Este archivo
```

## 🗄️ Modelo de Datos

### Planet Schema

```javascript
{
  name: String,                      // Nombre del planeta
  description: String,               // Descripción
  population: Number,                // Población total
  
  global_resources: {                // Recursos globales
    water: Number,
    oxygen: Number,
    energy: Number,
    food: Number,
    minerals: Number
  },
  
  environment: {                     // Condiciones ambientales
    temperature: Number,             // En °C
    radiation_level: String,         // "low", "medium", "high"
    atmosphere: {
      co2: Number,                   // Porcentaje
      nitrogen: Number,
      argon: Number,
      oxygen: Number
    }
  },
  
  colonies: [{                       // Array de colonias
    id: String,
    name: String,
    population: Number,
    production: {                    // Producción por minuto
      energy_per_min: Number,
      water_per_min: Number,
      oxygen_per_min: Number,
      food_per_min: Number,
      minerals_per_min: Number
    },
    storage: {                       // Almacenamiento actual
      water: Number,
      oxygen: Number,
      energy: Number,
      food: Number,
      minerals: Number
    }
  }],
  
  events: [{                         // Eventos activos
    id: String,
    type: String,                    // Tipo de evento
    description: String,
    active: Boolean
  }],
  
  createdAt: Date,                   // Auto-generado
  updatedAt: Date                    // Auto-generado
}
```

## 🔄 Sistema de Simulación

### Ciclo de Actualización (cada 10 segundos)

1. **Inicialización**
   - Verifica y crea datos por defecto si no existen

2. **Procesamiento de Eventos**
   - Detecta eventos activos
   - Calcula modificadores (energía, temperatura, etc.)

3. **Actualización Ambiental**
   - Varía la temperatura (±5%)
   - Cambia nivel de radiación (10% probabilidad)
   - Ajusta composición atmosférica (±2%)

4. **Procesamiento de Colonias**
   - **Producción**: Calcula recursos generados en 10 segundos
   - **Almacenamiento**: 50% va a la colonia, 50% al global
   - **Consumo**: Deduce recursos según población
   - **Eficiencia**: Varía tasas de producción (±3%)

5. **Consumo Global**
   - Deduce recursos del almacenamiento global según población total

6. **Persistencia**
   - Guarda estado actual en la base de datos
   - Crea registro en el historial

### Fórmulas de Cálculo

```javascript
// Producción en 10 segundos
producción_real = producción_por_minuto * (10 / 60) * modificador_evento

// Consumo por población
consumo = población * (10 / 60) * tasa_consumo

// Variación aleatoria
nuevo_valor = valor_actual * (1 + random(-variación, +variación))
```

## 🌐 API Endpoints

### GET `/planet`
Obtiene todos los planetas registrados.

**Respuesta:**
```json
[
  {
    "_id": "...",
    "name": "Ares Prime",
    "description": "...",
    "global_resources": { ... },
    "environment": { ... },
    "colonies": [ ... ],
    "events": [ ... ]
  }
]
```

### POST `/planet`
Crea un nuevo planeta.

**Body:** Ver ejemplo en [Crear datos iniciales](#crear-datos-iniciales-opcional)

**Respuesta:**
```json
{
  "message": "Planet created successfully",
  "planet": { ... }
}
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.2.0** - Framework UI
- **Vite 7.2.4** - Build tool y dev server
- **TailwindCSS 4.1.17** - Framework CSS
- **Three.js 0.181.2** - Renderizado 3D
- **@react-three/fiber** - React renderer para Three.js
- **@react-three/drei** - Helpers para Three.js
- **Recharts 3.5.1** - Gráficos y visualizaciones
- **Axios 1.13.2** - Cliente HTTP
- **Lucide React** - Iconos

### Backend
- **Node.js** - Runtime de JavaScript
- **Express 5.1.0** - Framework web
- **MongoDB 7.0.0** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **node-cron 4.2.1** - Scheduler para tareas periódicas
- **Morgan** - Logger HTTP
- **CORS** - Middleware para CORS
- **Nodemon** - Auto-restart en desarrollo

## 📝 Notas Adicionales

### Modificar el intervalo de actualización

Edita `/server/src/Services/randomChange.js`:

```javascript
const UPDATE_INTERVAL_SECONDS = 10; // Cambia este valor
```

### Ajustar tasas de consumo

Edita las constantes en `/server/src/Services/randomChange.js`:

```javascript
const COLONY_CONSUMPTION_RATES = {
    water: 0.1,    // Ajusta estos valores
    oxygen: 0.08,
    energy: 0.15,
    food: 0.05
};
```

### Agregar nuevos tipos de eventos

En la función `getEventModifiers()` en `/server/src/Services/randomChange.js`:

```javascript
case "nuevo_evento":
    modifiers.energyMultiplier *= 0.9;
    // Agrega tu lógica aquí
    break;
```

## 🐛 Troubleshooting

### El backend no se conecta a MongoDB
- Verifica que MongoDB esté corriendo: `mongod`
- Revisa la URI de conexión en `server/src/db.js`

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo en el puerto 3000
- Revisa la configuración de CORS en `server/src/app.js`

### Los datos no se actualizan
- Verifica que el cron job esté iniciado (debe aparecer en los logs)
- Revisa que exista al menos un planeta en la base de datos

## 📄 Licencia

ISC

## 👥 Autor

Desarrollado para el Galaxy Dashboard Hackathon

---

**¿Preguntas o problemas?** Abre un issue en el repositorio.
