/**
 * Модуль для работы с холстом и отрисовки
 */

/**
 * Класс для управления холстом
 */
export class CanvasManager {
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