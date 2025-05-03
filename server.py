from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

# Исходная фигура (вариант 23)
ORIGINAL_SHAPE = [
    (50, 200), (150, 80), (250, 200),
    (350, 100), (450, 200), (370, 260),
    (250, 180), (130, 260),
]

def translate(shape, dx, dy):
    return [(x+dx, y+dy) for x, y in shape]

def rotate(shape, angle_deg, cx, cy):
    theta = math.radians(angle_deg)
    cos_t, sin_t = math.cos(theta), math.sin(theta)
    new = []
    for x, y in shape:
        x0, y0 = x-cx, y-cy
        x1 = x0*cos_t - y0*sin_t
        y1 = x0*sin_t + y0*cos_t
        new.append((x1+cx, y1+cy))
    return new

def scale(shape, kx, ky, cx, cy):
    return [((x-cx)*kx+cx, (y-cy)*ky+cy) for x, y in shape]

@app.route('/')
def index():
    # При первой загрузке отдадим оригинал
    return render_template('index.html', shape=ORIGINAL_SHAPE)

@app.route('/api/transform', methods=['POST'])
def api_transform():
    data = request.json
    shape = data.get('shape', ORIGINAL_SHAPE)
    op    = data['op']
    params= data['params']

    if op == 'translate':
        res = translate(shape, params['dx'], params['dy'])
    elif op == 'rotate':
        res = rotate(shape, params['angle'], params['cx'], params['cy'])
    elif op == 'scale':
        res = scale(shape, params['kx'], params['ky'], params['cx'], params['cy'])
    else:
        return jsonify(error="Unknown op"), 400

    return jsonify(shape=res)

if __name__ == '__main__':
    app.run(debug=True)
