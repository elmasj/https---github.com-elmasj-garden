// Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let baseImage = null; // Store the uploaded image

// Step 1: Upload and Display the First Image
document.getElementById('upload1').addEventListener('change', (event) => {
  const file = event.target.files[0]; // Get the selected file
  if (!file) {
    alert('Please upload an image!');
    return;
  }

  const url = URL.createObjectURL(file); // Create a URL for the file
  const img = new Image(); // Create an image element
  img.src = url;

  img.onload = () => {
    baseImage = img; // Store the uploaded image for later use

    // Clear the canvas and draw the uploaded image
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear existing drawings
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height); // Draw the image
  };

  img.onerror = () => {
    alert('Failed to load the image. Please try another file.');
  };
});
let isDrawing = false; // Flag to track drawing state
let overlayPath = []; // Array to store the overlay points

// Start drawing when the mouse is pressed
canvas.addEventListener('mousedown', () => {
  isDrawing = true; // Set flag to true
  overlayPath = []; // Reset overlay path
});

// Add points to the overlay path as the mouse moves
canvas.addEventListener('mousemove', (event) => {
  if (!isDrawing) return; // Ignore if not drawing

  const rect = canvas.getBoundingClientRect(); // Get canvas position
  const x = event.clientX - rect.left; // Calculate x position of mouse
  const y = event.clientY - rect.top; // Calculate y position of mouse

  overlayPath.push({ x, y }); // Add point to the path

  // Draw the path on the canvas
  ctx.strokeStyle = 'red'; // Set stroke color
  ctx.lineWidth = 2; // Set stroke width
  ctx.lineTo(x, y); // Add line to current position
  ctx.stroke(); // Draw stroke
});

// Stop drawing when the mouse is released
canvas.addEventListener('mouseup', () => {
  isDrawing = false; // Reset flag
  ctx.beginPath(); // Reset the path for next stroke
});
// Step 3: Upload and Apply the Second Image
document.getElementById('upload2').addEventListener('change', (event) => {
  const file = event.target.files[0]; // Get the selected file
  if (!file) {
    alert('Please upload a second image!');
    return;
  }

  const url = URL.createObjectURL(file); // Create a URL for the file
  const img = new Image(); // Create a new image object
  img.src = url;

  img.onload = () => {
    overlayImage = img; // Store the second image for later use
    alert('Second image uploaded successfully!');
  };

  img.onerror = () => {
    alert('Failed to load the second image. Please try another file.');
  };
});

document.getElementById('applyOverlay').addEventListener('click', () => {
  if (!baseImage || !overlayImage || overlayPath.length === 0) {
    alert('Please make sure both images are uploaded and the overlay area is drawn!');
    return;
  }

  // Clip the overlay area
  ctx.save(); // Save the current canvas state
  ctx.beginPath(); // Begin a new path for the overlay area
  overlayPath.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y); // Move to the first point in the path
    } else {
      ctx.lineTo(point.x, point.y); // Draw lines to subsequent points
    }
  });
  ctx.closePath(); // Close the path to form a complete area
  ctx.clip(); // Clip the drawing region to the overlay area

  // Draw the second image within the clipped region
  ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

  ctx.restore(); // Restore the original canvas state
});

