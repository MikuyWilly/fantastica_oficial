# Fantástica Oficial - Tienda de Ropa

Sitio web de la tienda de ropa femenina Fantástica Oficial con sistema de productos dinámico y funcionalidad de favoritos.

## 🚀 Características

- **Sistema de productos dinámico** desde archivo JSON
- **Página de productos completa** con filtros por categoría
- **Sistema de favoritos** funcional con persistencia
- **Diseño responsive** y moderno
- **Navegación fluida** entre páginas

## 📁 Estructura de Archivos

```
Fantástica Oficial/
├── index.html              # Página principal (6 productos más recientes)
├── productos.html          # Página completa de productos
├── favoritos.html          # Página de favoritos
├── productos.json          # Datos de productos (centralizado)
├── style.css              # Estilos CSS
├── script.js              # JavaScript general
├── favoritos.js           # Sistema de favoritos
├── productos-loader.js    # Cargador dinámico de productos
├── productos.js           # Filtros y funcionalidad de productos
└── assets/
    └── images/
        ├── Fantástica oficial.png
        └── Fantástica.png
```

## 🛍️ Sistema de Productos

### Archivo `productos.json`

El archivo `productos.json` contiene toda la información de productos de forma centralizada:

```json
{
  "productos": [
    {
      "id": 1,
      "nombre": "Nombre del Producto",
      "descripcion": "Descripción del producto",
      "precio": 29990,
      "precioAnterior": 34990,
      "imagen": "URL de la imagen",
      "categoria": "vestidos",
      "badge": "Nuevo",
      "esReciente": true,
      "stock": 15,
      "tallas": ["XS", "S", "M", "L", "XL"],
      "colores": ["Negro", "Blanco"]
    }
  ],
  "categorias": [...],
  "configuracion": {...}
}
```

### Cómo Agregar Productos

1. **Abrir `productos.json`**
2. **Agregar nuevo producto** en el array `productos`:
   ```json
   {
     "id": 13,
     "nombre": "Nuevo Producto",
     "descripcion": "Descripción del nuevo producto",
     "precio": 25000,
     "precioAnterior": null,
     "imagen": "https://ejemplo.com/imagen.jpg",
     "categoria": "vestidos",
     "badge": "Nuevo",
     "esReciente": true,
     "stock": 10,
     "tallas": ["S", "M", "L"],
     "colores": ["Azul"]
   }
   ```

3. **Configurar `esReciente`**:
   - `true`: Aparecerá en la página principal
   - `false`: Solo aparecerá en la página de productos completa

### Categorías Disponibles

- `vestidos` - Vestidos elegantes y casuales
- `tops` - Tops, blusas y camisetas
- `pantalones` - Jeans, pantalones y shorts
- `conjuntos` - Sets coordinados
- `abrigos` - Blazers, chalecos y abrigos

## ❤️ Sistema de Favoritos

- **Persistencia**: Los favoritos se guardan en `localStorage`
- **Sincronización**: Funciona en todas las páginas
- **Contador**: Muestra la cantidad de favoritos en el navbar
- **Página dedicada**: `favoritos.html` para ver todos los favoritos

## 🎨 Personalización

### Colores y Estilos

Los colores principales están definidos en `style.css` como variables CSS:

```css
:root {
    --primary: #ff66b3;
    --secondary: #ff99cc;
    --accent: #ff3385;
    --light: #ffe6f2;
    --dark: #33001a;
    --text: #4d0026;
    --white: #ffffff;
}
```

### Configuración

En `productos.json` puedes modificar:

```json
"configuracion": {
  "productosRecientes": 6,      // Productos en página principal
  "productosPorPagina": 12,     // Productos por página
  "moneda": "CLP",              // Moneda
  "formatoPrecio": "$#,##0"     // Formato de precio
}
```

## 🌐 Navegación

- **Página Principal**: `index.html` - 6 productos más recientes
- **Todos los Productos**: `productos.html` - Catálogo completo con filtros
- **Favoritos**: `favoritos.html` - Productos guardados

## 🚀 Instalación y Uso

1. **Clonar o descargar** el proyecto
2. **Abrir terminal** en la carpeta del proyecto
3. **Ejecutar servidor local**:
   ```bash
   python -m http.server 8000
   ```
4. **Abrir navegador** en `http://localhost:8000`

## 📱 Responsive Design

El sitio está optimizado para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔧 Mantenimiento

### Agregar Nuevos Productos

1. Editar `productos.json`
2. Agregar producto con ID único
3. Configurar `esReciente` según necesidad
4. Guardar archivo

### Modificar Categorías

1. Editar array `categorias` en `productos.json`
2. Actualizar filtros en `productos.html` si es necesario

### Cambiar Configuración

1. Editar objeto `configuracion` en `productos.json`
2. Los cambios se aplican automáticamente

## 📞 Contacto

- **Instagram**: [@fantastica.oficial](https://www.instagram.com/fantastica.oficial/)
- **WhatsApp**: +56 9 1234 5678
- **Email**: contacto@fantasticaoficial.cl

---

© 2025 Fantástica Oficial. Todos los derechos reservados. 