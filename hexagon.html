<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Hexagon WebGL</title>
  <style>
    body { margin: 0; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="canvas" width="800" height="600"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('WebGL not supported');
    }

    // Create hexagon using 6 triangles (18 vertices)
    const hexRadius = 0.5;
    const hexVertices = [];
    for (let i = 0; i < 6; i++) {
        const angle1 = (i / 6) * Math.PI * 2;
        const angle2 = ((i + 1) / 6) * Math.PI * 2;

        hexVertices.push(
            0.0, 0.0, 0.0,
            Math.cos(angle1) * hexRadius, Math.sin(angle1) * hexRadius, 0.0,
            Math.cos(angle2) * hexRadius, Math.sin(angle2) * hexRadius, 0.0
        );
    }
    const vertices = new Float32Array(hexVertices);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const vsSource = `
        attribute vec3 a_position;
        uniform float uTimeVert;
        void main() {
            mat3 matrixY;
            matrixY[0] = vec3(cos(uTimeVert), 0.0, sin(uTimeVert));
            matrixY[1] = vec3(0.0, 1.0, 0.0);
            matrixY[2] = vec3(-sin(uTimeVert), 0.0, cos(uTimeVert));
            vec3 translation = vec3(0.5*sin(uTimeVert), 0.5*cos(uTimeVert), 0);
            vec3 transformedP = matrixY * a_position + translation;
            gl_Position = vec4(transformedP, 1.0);
        }
    `;

    const fsSource = `
        precision mediump float;
        uniform float uTimeFrag;
        uniform vec2 screenSize;
        void main() {
            float colorR = abs(cos(uTimeFrag  * 2.0));
            float pixelCordX = gl_FragCoord.x / screenSize.x;
            float pixelCordY = gl_FragCoord.y / screenSize.y;
            vec2 cord = vec2(pixelCordX, pixelCordY);
            float timeNew = uTimeFrag;
            mat2 matrix;
            matrix[0] = vec2(cos(timeNew), sin(timeNew));
            matrix[1] = vec2(-sin(timeNew), cos(timeNew));
            cord = matrix * cord;
            float colorG = abs(sin(cord.x * 30.0));
            float colorB = abs(cos(cord.y * 30.0));
            gl_FragColor = vec4(colorR, colorG, colorB, 1.0);
        }
    `;

    function compileShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const uTimeVLocation = gl.getUniformLocation(program, "uTimeVert");
    const uTimeFLocation = gl.getUniformLocation(program, "uTimeFrag");
    const screenSizeLocation = gl.getUniformLocation(program, "screenSize");

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const screenWidth = canvas.width;
    const screenHeight = canvas.height;

    function render() {
        const currentTime = performance.now() * 0.001;
        gl.uniform1f(uTimeVLocation, currentTime);
        gl.uniform1f(uTimeFLocation, currentTime);
        gl.uniform2f(screenSizeLocation, screenWidth, screenHeight);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
        requestAnimationFrame(render);
    }

    render();
  </script>
</body>
</html>
