/**
 * Модуль трансформаций - содержит функции для аффинных преобразований
 * Адаптированная версия логики из server.py
 */

/**
 * Перенос фигуры
 * @param {Array} shape - Массив точек [(x, y), ...]
 * @param {Number} dx - Смещение по X
 * @param {Number} dy - Смещение по Y
 * @returns {Array} - Новый массив точек
 */
export function translate(shape, dx, dy) {
    return shape.map(([x, y]) => [x + dx, y + dy]);
}

/**
 * Вращение фигуры
 * @param {Array} shape - Массив точек [(x, y), ...]
 * @param {Number} angleDeg - Угол в градусах
 * @param {Number} cx - Центр вращения X
 * @param {Number} cy - Центр вращения Y
 * @returns {Array} - Новый массив точек
 */
export function rotate(shape, angleDeg, cx, cy) {
    const theta = angleDeg * Math.PI / 180;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    
    return shape.map(([x, y]) => {
        const x0 = x - cx;
        const y0 = y - cy;
        
        const x1 = x0 * cosT - y0 * sinT;
        const y1 = x0 * sinT + y0 * cosT;
        
        return [x1 + cx, y1 + cy];
    });
}

/**
 * Масштабирование фигуры
 * @param {Array} shape - Массив точек [(x, y), ...]
 * @param {Number} kx - Коэффициент масштабирования по X
 * @param {Number} ky - Коэффициент масштабирования по Y
 * @param {Number} cx - Центр масштабирования X
 * @param {Number} cy - Центр масштабирования Y
 * @returns {Array} - Новый массив точек
 */
export function scale(shape, kx, ky, cx, cy) {
    return shape.map(([x, y]) => [
        (x - cx) * kx + cx,
        (y - cy) * ky + cy
    ]);
}

// Исходная фигура (вариант 23)
export const ORIGINAL_SHAPE = [
    [350, 200], // верхняя середина
    [250, 150], // левая верхняя точка
    [300, 250], // нижняя левая точка
    [350, 220], // нижняя середина
    [400, 250], // правая нижняя точка
    [450, 150]  // правая верхняя точка
]; 