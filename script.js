document.addEventListener('DOMContentLoaded', function() {
    const dice = document.querySelector('.dice');
    const rollButton = document.getElementById('rollBtn');
    const resultElement = document.getElementById('result');
    
    // Dice faces with their corresponding value and rotation
    const diceFaces = [
        { value: 1, rotation: { x: 0, y: 0 } },        // Front
        { value: 6, rotation: { x: 0, y: 180 } },      // Back
        { value: 2, rotation: { x: 0, y: -90 } },      // Right
        { value: 5, rotation: { x: 0, y: 90 } },       // Left
        { value: 3, rotation: { x: -90, y: 0 } },      // Top
        { value: 4, rotation: { x: 90, y: 0 } }        // Bottom
    ];
    
    // Function to roll the dice
    function rollDice() {
        // Remove any previous animation class
        dice.classList.remove('rolling');
        
        // Trigger reflow to restart animation
        void dice.offsetWidth;
        
        // Add rolling animation
        dice.classList.add('rolling');
        
        // Disable button during roll
        rollButton.disabled = true;
        rollButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rolling...';
        
        // Generate random result after animation completes
        setTimeout(() => {
            // Get random face
            const randomFaceIndex = Math.floor(Math.random() * diceFaces.length);
            const selectedFace = diceFaces[randomFaceIndex];
            
            // Stop animation and apply final rotation
            dice.classList.remove('rolling');
            
            // Apply the rotation for the selected face
            dice.style.transform = `rotateX(${selectedFace.rotation.x}deg) rotateY(${selectedFace.rotation.y}deg)`;
            
            // Display result
            resultElement.textContent = selectedFace.value;
            
            // Re-enable button
            rollButton.disabled = false;
            rollButton.innerHTML = '<i class="fas fa-dice"></i> Roll Dice';
            
            // Log result to console
            console.log(`Dice rolled: ${selectedFace.value}`);
        }, 1500); // Match animation duration
    }
    
    // Add click event to roll button
    rollButton.addEventListener('click', rollDice);
    
    // Initialize with a random face
    const initialFaceIndex = Math.floor(Math.random() * diceFaces.length);
    const initialFace = diceFaces[initialFaceIndex];
    dice.style.transform = `rotateX(${initialFace.rotation.x}deg) rotateY(${initialFace.rotation.y}deg)`;
    resultElement.textContent = initialFace.value;
    
    // Add keyboard support (Space or Enter to roll)
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            if (!rollButton.disabled) {
                rollDice();
            }
        }
    });
});