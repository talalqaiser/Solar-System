// Vertex shader for single color drawing
var SOLID_VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    // 'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  vec4 a_Color = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Sphere color
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';



// Fragment shader for single color drawing
var SOLID_FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';


// Vertex shader for texture drawing
var TEXTURE_VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal;\n' +
    'attribute vec2 a_TexCoord;\n' +

    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal

    'varying vec3 v_Normal;\n' +
    'varying vec4 v_Position;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_Position = u_ModelMatrix * a_Position;\n' +
    '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '  v_TexCoord = a_TexCoord;\n' +
    '}\n';

// Fragment shader for texture drawing
var TEXTURE_FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sampler;\n' +

    'varying vec3 v_Normal;\n' +
    'varying vec4 v_Position;\n' +
    'varying vec2 v_TexCoord;\n' +

    'void main() {\n' +
    '  vec3 u_LightColor = vec3(0.8, 0.8, 0.8);\n' +
    '  vec3 u_LightPosition = vec3(0, 0, 0);\n' +
    '  vec3 u_AmbientLight = vec3(0.2, 0.2, 0.2);\n' +
    // Normalize the normal because it is interpolated and not 1.0 in length any more
    '  vec3 normal = normalize(v_Normal);\n' +
    // Calculate the light direction and make it 1.0 in length
    '  vec3 lightDirection = normalize(u_LightPosition - vec3(v_Position));\n' +
    // The dot product of the light direction and the normal
    '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
    // Calculate the final color from diffuse reflection and ambient reflection
    '  vec3 diffuse = u_LightColor * nDotL;\n' +
    '  vec3 ambient = u_AmbientLight;\n' +
    '  vec3 vLighting = ambient + diffuse;\n' +
    '  vec4 texelColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);\n' +
    '}\n';


// Vertex shader for texture drawing
var SUN_VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal;\n' +
    'attribute vec2 a_TexCoord;\n' +

    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
    'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal

    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_Position = vec3(u_ModelMatrix * a_Position);\n' +
    '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '  v_TexCoord = a_TexCoord;\n' +
    '}\n';

// Fragment shader for texture drawing
var SUN_FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sampler;\n' +

    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec2 v_TexCoord;\n' +

    'void main() {\n' +
    '  vec3 u_LightColor = vec3(0.8, 0.8, 0.8);\n' +
    '  vec3 u_LightPosition = vec3(0, 0, 1);\n' +
    '  vec3 u_AmbientLight = vec3(1, 1, 1);\n' +
    // Normalize the normal because it is interpolated and not 1.0 in length any more
    '  vec3 normal = normalize(v_Normal);\n' +
    // Calculate the light direction and make it 1.0 in length
    '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
    // The dot product of the light direction and the normal
    '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
    // Calculate the final color from diffuse reflection and ambient reflection
    '  vec3 diffuse = u_LightColor * nDotL;\n' +
    '  vec3 ambient = u_AmbientLight;\n' +
    '  vec3 vLighting = ambient + diffuse;\n' +
    '  vec4 texelColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);\n' +
    '}\n';


// Retrieve <canvas> element
var canvas = document.getElementById('webgl');

// Get the rendering context for WebGL
var gl = getWebGLContext(canvas);
if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
}

// Initialize shaders
var solidProgram = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);
var texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
var sunProgram = createProgram(gl, SUN_VSHADER_SOURCE, SUN_FSHADER_SOURCE);
if (!solidProgram || !texProgram || !sunProgram) {
    console.log('Failed to intialize shaders.');
}

// Get storage locations of attribute and uniform variables in program object for single color drawing
solidProgram.a_Position = gl.getAttribLocation(solidProgram, 'a_Position');
// solidProgram.a_Normal = gl.getAttribLocation(solidProgram, 'a_Normal');
solidProgram.u_MvpMatrix = gl.getUniformLocation(solidProgram, 'u_MvpMatrix');


// Get storage locations of attribute and uniform variables in program object for texture drawing
texProgram.a_Position = gl.getAttribLocation(texProgram, 'a_Position');
texProgram.a_Normal = gl.getAttribLocation(texProgram, 'a_Normal');
texProgram.a_TexCoord = gl.getAttribLocation(texProgram, 'a_TexCoord');
texProgram.u_MvpMatrix = gl.getUniformLocation(texProgram, 'u_MvpMatrix');
texProgram.u_NormalMatrix = gl.getUniformLocation(texProgram, 'u_NormalMatrix');
texProgram.u_ModelMatrix = gl.getUniformLocation(texProgram, 'u_ModelMatrix');
texProgram.u_Sampler = gl.getUniformLocation(texProgram, 'u_Sampler');

// Get storage locations of attribute and uniform variables in program object for Sun drawing
sunProgram.a_Position = gl.getAttribLocation(sunProgram, 'a_Position');
sunProgram.a_Normal = gl.getAttribLocation(sunProgram, 'a_Normal');
sunProgram.a_TexCoord = gl.getAttribLocation(sunProgram, 'a_TexCoord');
sunProgram.u_MvpMatrix = gl.getUniformLocation(sunProgram, 'u_MvpMatrix');
sunProgram.u_NormalMatrix = gl.getUniformLocation(sunProgram, 'u_NormalMatrix');
sunProgram.u_ModelMatrix = gl.getUniformLocation(sunProgram, 'u_ModelMatrix');
sunProgram.u_Sampler = gl.getUniformLocation(sunProgram, 'u_Sampler');

if (solidProgram.a_Position < 0 || !solidProgram.u_MvpMatrix ||
    texProgram.a_Position < 0 || texProgram.a_Normal < 0 || texProgram.a_TexCoord < 0 ||
    !texProgram.u_MvpMatrix || !texProgram.u_NormalMatrix || !texProgram.u_Sampler) {
    console.log('Failed to get the storage location of attribute or uniform variable');
    // return;
}

// Set the vertex information
var sphere = initVertexBuffers(gl);
if (!sphere) {
    console.log('Failed to set the vertex information');
    // return;
}

var orbits = initVertexBuffers_orbits(gl);
if (!orbits) {
    console.log('Failed to set the vertex information');
    // return;
}


// Set the clear color and enable the depth test
gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// Calculate the view projection matrix
var viewProjMatrix = new Matrix4();

function main() {
    // Start drawing
    var currentAngle = 0.0; // Current rotation angle (degrees)
    var tick = function () {
        currentAngle = animate(currentAngle);  // Update current rotation angle

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffers
        // Draw a sphere in single color
        draw(gl, sun, sphere, sun.texture, 0, currentAngle, camera.vp);
        // // Draw a sphere with texture
        draw(gl, mercury, sphere, mercury.texture, 0, currentAngle, camera.vp);
        draw(gl, venus, sphere, venus.texture, 0, currentAngle, camera.vp);
        draw(gl, earth, sphere, earth.texture, 0, currentAngle, camera.vp);
        draw(gl, mars, sphere, mars.texture, 0, currentAngle, camera.vp);
        draw(gl, jupiter, sphere, jupiter.texture, 0, currentAngle, camera.vp);
        draw(gl, saturn, sphere, saturn.texture, 0, currentAngle, camera.vp);
        draw(gl, uranus, sphere, uranus.texture, 0, currentAngle, camera.vp);
        draw(gl, neptune, sphere, neptune.texture, 0, currentAngle, camera.vp);

        drawSolidsphere(gl, solidProgram, orbits, mercury.translate_x, camera.vp)
        drawSolidsphere(gl, solidProgram, orbits, venus.translate_x, camera.vp)
        drawSolidsphere(gl, solidProgram, orbits, earth.translate_x, camera.vp)
        drawSolidsphere(gl, solidProgram, orbits, mars.translate_x, camera.vp)
        drawSolidsphere(gl, solidProgram, orbits, jupiter.translate_x, camera.vp)
        drawSolidsphere(gl, solidProgram, orbits, saturn.translate_x, camera.vp)
        drawSolidsphere(gl, solidProgram, orbits, uranus.translate_x, camera.vp)
        drawSolidsphere(gl, solidProgram, orbits, neptune.translate_x, camera.vp)


        window.requestAnimationFrame(tick, canvas);
    };
    tick();
}

function initVertexBuffers_orbits(gl) {
    const DISC_SIZE = 720;
    var vertices = new Float32Array(DISC_SIZE);
    var indices = new Uint8Array(DISC_SIZE);


    for (i = 0; i < DISC_SIZE; i += 3) {
        var j = (360 / DISC_SIZE) * i * Math.PI / 180;
        vertices[i] = Math.cos(j);
        vertices[i + 1] = 0;
        vertices[i + 2] = Math.sin(j);

        if (i % 3 == 0) {
            indices[i / 3] = i / 3;
        }
        // indices[i] = i;
    }

    var o = new Object(); // Utilize Object to return multiple buffer objects together
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);

    o.numIndices = indices.length;


    // // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;

}

function initVertexBuffers(gl) {

    var SPHERE_DIV = 36;

    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;

    var positions = [];
    var indices = [];
    var texPoints = []

    // Generate coordinates are evenly spaced on the (altitude)x(azimuth) grid, [0,π]x[0,2π].
    for (j = 0; j <= SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
            ai = i * 2 * Math.PI / SPHERE_DIV;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            positions.push(si * sj);  // X
            positions.push(cj);       // Y
            positions.push(ci * sj);  // Z

            texPoints.push(i / SPHERE_DIV);
            texPoints.push(1 - j / SPHERE_DIV);

        }
    }

    // for texture coordinates


    // Generate indices
    for (j = 0; j < SPHERE_DIV; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {
            p1 = j * (SPHERE_DIV + 1) + i;
            p2 = p1 + (SPHERE_DIV + 1);

            indices.push(p1);
            indices.push(p2);
            indices.push(p1 + 1);

            indices.push(p1 + 1);
            indices.push(p2);
            indices.push(p2 + 1);
        }
    }

    var vertices = new Float32Array(positions);
    var normals = new Float32Array(positions);
    var texCoords = new Float32Array(texPoints);
    var finalindices = new Uint16Array(indices);

    console.log(normals)


    var o = new Object(); // Utilize Object to return multiple buffer objects together

    // Write the vertex property to buffers (coordinates and normals)
    // Same data can be used for vertex and normal
    // In order to make it intelligible, another buffer is prepared separately

    // Write vertex information to buffer object
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, finalindices, gl.UNSIGNED_SHORT);
    if (!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer || !o.indexBuffer) return null;

    o.numIndices = indices.length;


    // // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

function initTextures(gl, program, source) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return null;
    }

    var image = new Image();  // Create a image object
    if (!image) {
        console.log('Failed to create the image object');
        return null;
    }
    // Register the event handler to be called when image loading is completed
    image.onload = function () {
        // Write the image data to texture object
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // Pass the texure unit 0 to u_Sampler
        gl.useProgram(program);
        gl.uniform1i(program.u_Sampler, 0);

        gl.bindTexture(gl.TEXTURE_2D, null); // Unbind texture
    };

    // Tell the browser to load an Image
    image.src = source;

    return texture;
}

function drawSolidsphere(gl, program, o, scale, viewProjMatrix) {
    gl.useProgram(program);   // Tell that this program object is used

    // Assign the buffer objects and enable the assignment
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
    // initAttributeVariable(gl, program.a_Normal, o.normalBuffer);   // Normal
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);  // Bind indices

    drawOrbits(gl, program, o, scale, viewProjMatrix);   // Draw
}

// Coordinate transformation matrix
var o_modelMatrix = new Matrix4();
var o_mvpMatrix = new Matrix4();
var o_normalMatrix = new Matrix4();

function drawOrbits(gl, program, o, scale, viewProjMatrix) {
    // Calculate a model matrix
    o_modelMatrix.setScale(scale, scale, scale);

    // Calculate model view projection matrix and pass it to u_MvpMatrix
    o_mvpMatrix.set(viewProjMatrix);
    o_mvpMatrix.multiply(o_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, o_mvpMatrix.elements);
    gl.drawElements(gl.LINE_LOOP, o.numIndices, o.indexBuffer.type, 0);   // Draw

}

function draw(gl, object, shape, texture, x, angle, viewProjMatrix) {
    gl.useProgram(object.programType);   // Tell that this program object is used
    initAttributeVariable(gl, object.programType.a_Position, shape.vertexBuffer);  // Vertex coordinates
    initAttributeVariable(gl, object.programType.a_Normal, shape.normalBuffer);    // Normal
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shape.indexBuffer); // Bind indices

    if (object.programType === texProgram || sunProgram) {
        initAttributeVariable(gl, object.programType.a_TexCoord, shape.texCoordBuffer);// Texture coordinates
        // Bind texture object to texture unit 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    }

    drawsphere(gl, object, object.programType, shape, object.scale, object.translate_x, angle, viewProjMatrix); // Draw

}

// Assign the buffer objects and enable the assignment
function initAttributeVariable(gl, a_attribute, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();

function drawsphere(gl, object, program, o, scale, x, angle, viewProjMatrix) {
    // Calculate a model matrix
    g_modelMatrix.setTranslate(0, 0.0, 0.0);

    g_modelMatrix.rotate(simulation_speed * ((1 * angle) / object.revolve_angle), 0.0, 1.0, 0.0).translate(x, 0, 0).rotate(simulation_speed * angle / object.rotate_angle, 0, 1, 0); //previous i used g_modelMatrix
    g_modelMatrix.scale(scale, scale, scale);
    // console.log(g_modelMatrix)


    gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
    // Calculate transformation matrix for normals and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
    // console.log(g_normalMatrix)

    // Calculate model view projection matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   // Draw
}


function initArrayBufferForLaterUse(gl, data, num, type) {
    var buffer = gl.createBuffer();   // Create a buffer object
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Keep the information necessary to assign to the attribute variable later
    buffer.num = num;
    buffer.type = type;

    return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
    var buffer = gl.createBuffer();　  // Create a buffer object
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    buffer.type = type;

    return buffer;
}

var ANGLE_STEP = 360 / 86400;   // The increments of rotation angle (degrees)

var last = Date.now(); // Last time that this function was called
function animate(angle) {
    var now = Date.now();   // Calculate the elapsed time
    var elapsed = now - last;
    last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    // return newAngle % 360;
    return newAngle;
}

class GameObject {
    constructor(name, programType, texture, scale, rotate_angle, revolve_angle, translate_x) {
        this.name = name;
        this.programType = programType;
        this.texture = texture;
        this.scale = scale / 2440;
        this.rotate_angle = rotate_angle / 1440;
        this.revolve_angle = revolve_angle;
        this.translate_x = translate_x * 6371 * 10 / 2440;
    }
}

var sun = new GameObject("Sun", sunProgram, "../textures/sun.jpg", 2 * 6371, 36000, 100000, 0);
var mercury = new GameObject("Mercury", texProgram, "../textures/mercury.jpg", 2440, 84480, 88, 0.39);
var venus = new GameObject("Venus", texProgram, "../textures/venus.jpg", 6052, 351480, 225, 0.723);
var earth = new GameObject("Earth", texProgram, "../textures/earth.jpg", 6371, 1436, 365, 1);
var mars = new GameObject("Mars", texProgram, "../textures/mars.jpg", 3390, 1476, 687, 1.524);
var jupiter = new GameObject("Jupiter", texProgram, "../textures/jupiter.jpg", 69911, 595, 4332, 5.203);
var saturn = new GameObject("Saturn", texProgram, "../textures/saturn.jpg", 58232, 633, 10746, 9.539);
var uranus = new GameObject("Uranus", texProgram, "../textures/uranus.jpg", 25362, 1034, 30590, 19.18);
var neptune = new GameObject("Neptun", texProgram, "../textures/neptune.jpg", 24622, 960, 59800, 30.06);


mercury.texture = initTextures(gl, mercury.programType, mercury.texture);
venus.texture = initTextures(gl, venus.programType, venus.texture);
earth.texture = initTextures(gl, earth.programType, earth.texture);
mars.texture = initTextures(gl, mars.programType, mars.texture);
jupiter.texture = initTextures(gl, jupiter.programType, jupiter.texture);
saturn.texture = initTextures(gl, saturn.programType, saturn.texture);
uranus.texture = initTextures(gl, uranus.programType, uranus.texture);
neptune.texture = initTextures(gl, neptune.programType, neptune.texture);
sun.texture = initTextures(gl, sun.programType, sun.texture);


var time_converter = 1 / ANGLE_STEP;
var simulation_speed = 360 * time_converter

function calculateSimSpeed() {
    simulation_speed = time_converter * parseFloat(document.getElementById("SimSpeed").value);
    objects = [sun, earth, mercury];
}


class Camera {
    constructor(location, pitch, yaw) {
        this.location = location;
        this.pitch = pitch;
        this.yaw = yaw;

        var ProjMatrix = new Matrix4();
        var viewMatrix = new Matrix4();
        var viewProjMatrix = new Matrix4();
        ProjMatrix.setPerspective(45.0, canvas.width / canvas.height, 0.1, 10000000.0);

        this.vm = viewMatrix;
        this.pm = ProjMatrix;
        this.vp = viewProjMatrix;
        this.compute_vm();
        this.compute_vp();
    }
    compute_vm() {
        this.vm.setRotate(this.pitch, 1, 0, 0);
        this.vm.rotate(this.yaw, 0, 1, 0);
        this.vm.translate(-this.location[0], -this.location[1], -this.location[2]);
    }
    compute_vp() {
        this.vp.set(this.pm).multiply(this.vm);
    }
}

let camera = new Camera([0, 30, 150], 1, 1);
// flythrough(camera);
initEventHandlers(canvas, camera);


function flythrough(camera) {

    document.onkeydown = (ev) => {
        var ivm = new Matrix4();
        var temp_mat = new Matrix4();
        ivm.setInverseOf(camera.vm);
        var transformedEyeDirection;
        var change;
        // console.log(camera.location);
        if (ev.key == "w") {
            change = [0, 0, -5, 0]

        }
        else if (ev.key == "s") {
            change = [0, 0, 5, 0]
        }
        else if (ev.key == "a") {
            change = [-5, 0, 0, 0]
        }
        else if (ev.key == "d") {
            change = [5, 0, 0, 0]
        }

        transformedEyeDirection = ivm.multiplyVector4(new Vector4(change));
        camera.location = [camera.location[0] + transformedEyeDirection.elements[0],
        camera.location[1] + transformedEyeDirection.elements[1],
        camera.location[2] + transformedEyeDirection.elements[2]]
        temp_mat.setTranslate(-transformedEyeDirection.elements[0], -transformedEyeDirection.elements[1], -transformedEyeDirection.elements[2]);
        camera.vm.multiply(temp_mat)
        camera.compute_vp()
    };
}

function initEventHandlers(canvas, camera) {
    var dragging = false;         // Dragging or not
    var lastX = -1, lastY = -1;   // Last position of the mouse

    canvas.onmousedown = function (ev) {   // Mouse is pressed
        var x = ev.clientX, y = ev.clientY;
        // Start dragging if a moue is in <canvas>
        var rect = ev.target.getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            lastX = x; lastY = y;
            dragging = true;
        }
        console.log(x, y)
    };

    canvas.onmouseup = function (ev) {
        dragging = false;
        console.log(dragging);
    }; // Mouse is released

    canvas.onmousemove = function (ev) { // Mouse is moved
        var x = ev.clientX, y = ev.clientY;
        if (dragging) {
            var factor = 100 / canvas.height; // The rotation ratio
            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);
            // Limit x-axis rotation angle to -90 to 90 degrees
            camera.pitch = Math.max(Math.min(camera.pitch - dy, 90.0), -90.0);
            camera.yaw = (camera.yaw - dx + 360.0) % 360.0;
            camera.compute_vm();
            camera.compute_vp();
        }
        lastX = x, lastY = y;
    };

    document.onkeydown = (ev) => {
        var ivm = new Matrix4();
        var temp_mat = new Matrix4();
        ivm.setInverseOf(camera.vm);
        var transformedEyeDirection;
        var change;
        if (ev.key == "w") {
            change = [0, 0, -5, 0.0]
        }
        else if (ev.key == "s") {
            change = [0, 0, 5, 0.0]
        }
        else if (ev.key == "a") {
            change = [-5, 0, 0, 0]
        }
        else if (ev.key == "d") {
            change = [5, 0, 0, 0]
        }

        transformedEyeDirection = ivm.multiplyVector4(new Vector4(change));
        camera.location = [camera.location[0] + transformedEyeDirection.elements[0],
        camera.location[1] + transformedEyeDirection.elements[1],
        camera.location[2] + transformedEyeDirection.elements[2]]
        temp_mat.setTranslate(-transformedEyeDirection.elements[0], -transformedEyeDirection.elements[1], -transformedEyeDirection.elements[2]);
        camera.vm.multiply(temp_mat)
        camera.compute_vp()
    };
}