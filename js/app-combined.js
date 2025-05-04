/**
 * Объединенный JS файл со всей логикой приложения
 */

// =================== ТРАНСФОРМАЦИИ ===================

/**
 * Перенос фигуры
 * @param {Array} shape - Массив точек [(x, y), ...]
 * @param {Number} dx - Смещение по X
 * @param {Number} dy - Смещение по Y
 * @returns {Array} - Новый массив точек
 */
function translate(shape, dx, dy) {
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
function rotate(shape, angleDeg, cx, cy) {
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
function scale(shape, kx, ky, cx, cy) {
    return shape.map(([x, y]) => [
        (x - cx) * kx + cx,
        (y - cy) * ky + cy
    ]);
}

// Исходная фигура (вариант 23)
const ORIGINAL_SHAPE = [
    [350, 200], // верхняя середина
    [250, 150], // левая верхняя точка
    [300, 250], // нижняя левая точка
    [350, 220], // нижняя середина
    [400, 250], // правая нижняя точка
    [450, 150]  // правая верхняя точка
];

// =================== CANVAS ===================

/**
 * Класс для управления холстом
 */
class CanvasManager {
    /**
     * @param {HTMLCanvasElement} canvas - DOM элемент холста
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();
    }

    /**
     * Настройка холста для поддержки высокого разрешения (Retina display)
     */
    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        
        // Сбрасываем CSS размеры
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    /**
     * Отрисовка сетки координат
     */
    drawGrid() {
        const gridSize = 50;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 0.5;
        
        // Вертикальные линии
        for (let x = 0; x < width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
        
        // Горизонтальные линии
        for (let y = 0; y < height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
    }

    /**
     * Отрисовка фигуры
     * @param {Array} shape - Массив точек [(x, y), ...]
     */
    drawShape(shape) {
        // Очистка холста
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Отрисовка сетки координат
        this.drawGrid();
        
        // Отрисовка фигуры
        this.ctx.beginPath();
        shape.forEach(([x, y], i) => {
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        });
        this.ctx.closePath();
        
        // Стиль для фигуры
        this.ctx.strokeStyle = '#3a86ff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Добавим заливку с прозрачностью
        this.ctx.fillStyle = 'rgba(58, 134, 255, 0.1)';
        this.ctx.fill();
        
        // Отрисовка точек фигуры
        shape.forEach(([x, y]) => {
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffbe0b';
            this.ctx.fill();
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    /**
     * Обработчик изменения размера окна
     */
    handleResize() {
        this.setupCanvas();
    }
}

// =================== ОСНОВНОЙ КОД ПРИЛОЖЕНИЯ ===================

class AffineApp {
    constructor() {
        // Инициализация состояния
        this.shape = JSON.parse(JSON.stringify(ORIGINAL_SHAPE)); // Клонирование фигуры
        this.isTransforming = false;
        
        // Инициализация холста
        this.canvasManager = new CanvasManager(document.getElementById('canvas'));
        
        // Привязка обработчиков событий
        this.initEventHandlers();
        
        // Первоначальная отрисовка
        this.canvasManager.drawShape(this.shape);
    }
    
    /**
     * Инициализация обработчиков событий
     */
    initEventHandlers() {
        // Обработчики для кнопок преобразований
        document.querySelectorAll('button[data-op]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isTransforming) return;
                
                const op = btn.dataset.op;
                let params = {};
                
                if (op === 'translate') {
                    params.dx = +document.getElementById('dx').value;
                    params.dy = +document.getElementById('dy').value;
                    this.applyTransform(op, params);
                }
                
                if (op === 'rotate') {
                    params.angle = +document.getElementById('angle').value;
                    params.cx = +document.getElementById('cxr').value;
                    params.cy = +document.getElementById('cyr').value;
                    this.applyTransform(op, params);
                }
                
                if (op === 'scale') {
                    params.kx = +document.getElementById('kx').value;
                    params.ky = +document.getElementById('ky').value;
                    params.cx = +document.getElementById('cxs').value;
                    params.cy = +document.getElementById('cys').value;
                    this.applyTransform(op, params);
                }
            });
        });
        
        // Сброс фигуры к исходному состоянию
        document.getElementById('reset').addEventListener('click', () => {
            this.shape = JSON.parse(JSON.stringify(ORIGINAL_SHAPE));
            this.canvasManager.drawShape(this.shape);
        });
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            this.canvasManager.handleResize();
            this.canvasManager.drawShape(this.shape);
        });
    }
    
    /**
     * Применение трансформации
     * @param {String} op - Тип операции (translate, rotate, scale)
     * @param {Object} params - Параметры операции
     */
    applyTransform(op, params) {
        try {
            this.isTransforming = true;
            
            // Визуализация загрузки
            document.body.style.cursor = 'wait';
            this.disableButtons(true);
            
            // Применяем нужную трансформацию
            switch (op) {
                case 'translate':
                    this.shape = translate(this.shape, params.dx, params.dy);
                    break;
                case 'rotate':
                    this.shape = rotate(this.shape, params.angle, params.cx, params.cy);
                    break;
                case 'scale':
                    this.shape = scale(this.shape, params.kx, params.ky, params.cx, params.cy);
                    break;
                default:
                    throw new Error('Неизвестная операция');
            }
            
            // Обновляем отрисовку
            this.canvasManager.drawShape(this.shape);
        } catch (error) {
            console.error('Ошибка при преобразовании:', error);
            alert('Произошла ошибка: ' + error.message);
        } finally {
            this.isTransforming = false;
            document.body.style.cursor = 'default';
            this.disableButtons(false);
        }
    }
    
    /**
     * Включение/выключение кнопок
     * @param {Boolean} disabled - Флаг блокировки кнопок
     */
    disableButtons(disabled) {
        document.querySelectorAll('button').forEach(btn => btn.disabled = disabled);
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new AffineApp();
}); 