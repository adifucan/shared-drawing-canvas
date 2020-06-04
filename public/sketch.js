// client code which sends messages to the server and also received messages from the server
let socket;
let color = '#000'
let strokeWidth = 4
let cv

function setup() {
    cv = createCanvas(400, 400);
    cv.background(200);

    // open connect to the server that has socket.io on it on 3001 port
    socket = io.connect('http://shared-drawing-canvas.test:3001/');

    // receive message
    socket.on('mouse', newDrawing);

    var cleanButton = document.getElementById('clean');
    cleanButton.addEventListener('click', clearCanvas);

    function clearCanvas() {
        clear();
    }

    // Handle color picker and width stroker
    const color_picker = document.getElementById('pickcolor');
    const color_btn = document.querySelector('#color-btn');
    const color_holder = document.querySelector('#color-holder');
    const stroke_width_picker = document.querySelector('#stroke-width-picker');
    const stroke_btn = document.querySelector('#stroke-btn');

    // Adding a mousePressed listener to the button
    color_btn.addEventListener('click', () => {
        // Checking if the input is a valid hex color
        if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color_picker.value)) {
            color = color_picker.value
            color_holder.style.backgroundColor = color
        } else {
            console.log('Enter a valid hex value')
        }
    })

    // Adding a mousePressed listener to the button
    stroke_btn.addEventListener('click', () => {
        const width = parseInt(stroke_width_picker.value)
        if (width > 0) strokeWidth = width
    })
}

// draw data received from server
function newDrawing(data) {
    stroke(data.color)
    strokeWeight(data.strokeWidth)
    line(data.x, data.y, data.px, data.py)
}

// sending out sketch
function mouseDragged() {
    // Draw
    stroke(color)
    strokeWeight(strokeWidth)
    line(mouseX, mouseY, pmouseX, pmouseY)

    // Send the mouse coordinates
    sendmouse(mouseX, mouseY, pmouseX, pmouseY)
}

// Sending data to the socket
function sendmouse(x, y, pX, pY) {
    const data = {
        x: x,
        y: y,
        px: pX,
        py: pY,
        color: color,
        strokeWidth: strokeWidth,
    }

    socket.emit('mouse', data)
}
