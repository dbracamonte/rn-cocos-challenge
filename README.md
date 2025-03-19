# COCOS Challenge - React Native

Una aplicación móvil desarrollada con React Native y TypeScript que permite visualizar y gestionar instrumentos financieros, portafolios y ejecutar órdenes de compra/venta.

## Características principales

- Listado de instrumentos financieros con información detallada (ticker, nombre, precio y retorno)
- Visualización de portafolio con métricas de rendimiento
- Buscador de activos por ticker
- Formulario para enviar órdenes de compra/venta con diferentes tipos (MARKET/LIMIT)
- Gestión de estados de órdenes (PENDING, FILLED, REJECTED)

## Tecnologías Principales

- Expo SDK 52
- React Native 0.76.7
- TypeScript
- Expo Router para navegación basada en archivos
- Zustand para manejo de estado
- React Hook Form para formularios
- AsyncStorage para almacenamiento local

## Estructura del Proyecto

```
├── app/             # Rutas y páginas principales
├── components/      # Componentes reutilizables
├── constants/       # Constantes y configuraciones
├── hooks/           # Hooks personalizados
├── services/        # Servicios y APIs
├── stores/          # Estados globales con Zustand
├── utils/           # Utilidades y helpers
└── assets/          # Recursos estáticos
```

## Requisitos Previos

- Node.js (versión LTS recomendada)
- npm o yarn
- Expo CLI
- iOS Simulator (para Mac) o Android Studio (para desarrollo Android)

## Instalación

1. Clonar el repositorio
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd RNCocosChallenge
   ```

2. Instalar dependencias
   ```bash
   npm install
   ```

3. Iniciar el proyecto
   ```bash
   npm start
   ```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo Expo
- `npm run ios` - Inicia la aplicación en el simulador de iOS
- `npm run android` - Inicia la aplicación en el emulador de Android
- `npm run web` - Inicia la aplicación en el navegador web
- `npm test` - Ejecuta las pruebas
- `npm run lint` - Ejecuta el linter

## Desarrollo

El proyecto utiliza una estructura basada en archivos para el enrutamiento, lo que significa que puedes crear nuevas páginas simplemente agregando archivos en el directorio `app/`.

## Decisiones técnicas

### Arquitectura y estructura

Decidí estructurar el proyecto siguiendo una arquitectura por capas, separando claramente las responsabilidades:

- **Componentes UI**: Elementos visuales reutilizables, sin lógica de negocio.
- **Componentes de dominio**: Componentes específicos del negocio financiero.
- **Servicios**: Encapsulamiento de la lógica de comunicación con APIs.
- **Stores**: Gestión de estado global mediante Zustand, separando los estados por dominio.

### Gestión de estado

Elegí Zustand por su simplicidad y rendimiento en comparación con alternativas como Redux. La estructura de stores está organizada por dominio (instrumentos, portfolio, órdenes) para mantener la separación de preocupaciones.

### Manejo de formularios

Implementé React Hook Form para gestionar los formularios de órdenes por su eficiencia en validación y control de estados, reduciendo re-renders innecesarios.

## Testing

El proyecto está configurado con Jest y React Native Testing Library para pruebas unitarias y de integración.

## API

La aplicación consume los siguientes endpoints:

- GET /instruments: Obtiene el listado de instrumentos financieros.
- GET /portfolio: Obtiene el portafolio del usuario.
- GET /search?query=<ticker>: Busca instrumentos por ticker.
- POST /orders: Envía órdenes de compra/venta.

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
