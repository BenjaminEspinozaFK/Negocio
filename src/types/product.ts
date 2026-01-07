export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    image?: string; // URL o base64 de la imagen del producto
}

export const categories = [
    "Verduras",
    "Frutas",
    "Otros",
    "Bebidas",
    "Fiambreria",
    "Congelados"
];

export const units = ["kg", "unidad", "paquete", "litro"];
