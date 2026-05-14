# 🇪🇸 ¿A dónde van tus impuestos? - Simulador Fiscal

Una herramienta web moderna y visual para entender el impacto fiscal real sobre los salarios en España. A diferencia de otras calculadoras, esta herramienta muestra no solo el IRPF, sino también las cotizaciones a cargo de la empresa y los impuestos indirectos al consumo.

![Vista previa del proyecto](https://img.shields.io/badge/Status-Live-success)
![Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JS-blue)

## 🚀 Características

- **Cálculo de Cuña Fiscal:** Visualiza el coste total para la empresa (Sueldo "Súper-Bruto").
- **Desglose de Impuestos:**
  - IRPF (Tramos 2024).
  - Seguridad Social (Empleado y Empresa).
  - Estimación de Impuestos Indirectos (IVA, Hidrocarburos, etc.).
- **Distribución del Gasto Público:** Muestra cómo se reparte tu contribución en las partidas reales del Gasto Público Consolidado en España:
  - Pensiones y Protección Social.
  - Sanidad y Educación.
  - Intereses de la Deuda.
  - Seguridad, Defensa e Infraestructuras.
- **Diseño Moderno:** Interfaz con estética *Premium*, Glassmorphism y animaciones fluidas.

## 🧮 ¿Cómo se calcula?

El simulador utiliza la lógica de **Cuña Fiscal Total**:
1. **Base:** Salario Bruto + ~31% de SS a cargo de la empresa.
2. **Deducciones:** Se restan IRPF y SS del trabajador para obtener el Neto.
3. **Consumo:** Se aplica una estimación del 15% sobre el neto en concepto de impuestos indirectos.
4. **Reparto:** El total recaudado se distribuye según los porcentajes proporcionales del Gasto Público Consolidado (Estado + CCAA + SS).

## 🛠️ Tecnologías utilizadas

- **HTML5** (Estructura semántica)
- **CSS3** (Variables, Flexbox, Grid, Glassmorphism)
- **Vanilla JavaScript** (Lógica de cálculo y manipulación del DOM)

## 📖 Instalación y Uso

No requiere dependencias. Simplemente descarga los archivos y abre `index.html` en cualquier navegador moderno o súbelos a un hosting estático.

---
*Desarrollado con fines educativos e informativos sobre el sistema fiscal español.*
