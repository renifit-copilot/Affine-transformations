/**
 * Главный модуль приложения
 * Соединяет модули трансформаций и отрисовки
 */

import { ORIGINAL_SHAPE, translate, rotate, scale } from './transformations.js';
import { CanvasManager } from './canvas.js';

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