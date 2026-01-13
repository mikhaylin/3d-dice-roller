document.addEventListener('DOMContentLoaded', function() {
	// ========== THREE.JS SETUP ==========
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	
	const diceContainer = document.getElementById('diceScene');
	renderer.setSize(diceContainer.clientWidth, diceContainer.clientHeight);
	diceContainer.appendChild(renderer.domElement);
	
	// Lighting
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);
	const topLight = new THREE.DirectionalLight(0xffffff, 0.9);
	topLight.position.set(0, 10, 0);
	scene.add(topLight);
	const sideLight = new THREE.DirectionalLight(0xffffff, 0.4);
	sideLight.position.set(5, 3, 7);
	scene.add(sideLight);
	
	camera.position.set(4, 6, 8);
	camera.lookAt(0, 1, 0);

	// ========== CREATE 3D DICE ==========
	const diceSize = 3;
	const geometry = new THREE.BoxGeometry(diceSize, diceSize, diceSize);
	
	function getDotPositions(number) {
		const center = 128; const offset = 70;
		const positions = [];
		switch(number) {
			case 1: positions.push({x: center, y: center}); break;
			case 2:
				positions.push({x: center - offset, y: center - offset});
				positions.push({x: center + offset, y: center + offset}); break;
			case 3:
				positions.push({x: center - offset, y: center - offset});
				positions.push({x: center, y: center});
				positions.push({x: center + offset, y: center + offset}); break;
			case 4:
				positions.push({x: center - offset, y: center - offset});
				positions.push({x: center - offset, y: center + offset});
				positions.push({x: center + offset, y: center - offset});
				positions.push({x: center + offset, y: center + offset}); break;
			case 5:
				positions.push({x: center - offset, y: center - offset});
				positions.push({x: center - offset, y: center + offset});
				positions.push({x: center, y: center});
				positions.push({x: center + offset, y: center - offset});
				positions.push({x: center + offset, y: center + offset}); break;
			case 6:
				positions.push({x: center - offset, y: center - offset});
				positions.push({x: center - offset, y: center});
				positions.push({x: center - offset, y: center + offset});
				positions.push({x: center + offset, y: center - offset});
				positions.push({x: center + offset, y: center});
				positions.push({x: center + offset, y: center + offset}); break;
		}
		return positions;
	}

	const themes = {
		classic: {
			faceColor: '#ffffff',
			borderColor: '#333333',
			dotColor: '#333333'
		},
		dark: {
			faceColor: '#222222',
			borderColor: '#888888',
			dotColor: '#ffffff'
		}
	};
	// Function to create a canvas texture for each face
	function createFaceTexture(number, theme = 'classic') {
		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		const ctx = canvas.getContext('2d');
		
		// Use the themes object that should be defined elsewhere
		const themeConfig = themes[theme] || themes.classic;
		
		// Face background
		ctx.fillStyle = themeConfig.faceColor;
		ctx.fillRect(0, 0, 256, 256);
		
		// Face border
		ctx.strokeStyle = themeConfig.borderColor;
		ctx.lineWidth = 6;
		ctx.strokeRect(8, 8, 240, 240);
		
		// Draw dots based on the number (1-6)
		ctx.fillStyle = themeConfig.dotColor;
		const dotPositions = getDotPositions(number);
		dotPositions.forEach(pos => {
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
			ctx.fill();
		});
		
		return new THREE.CanvasTexture(canvas);
	}
	
	const faceMapping = [2, 5, 3, 4, 1, 6];
	// Create materials for all 6 faces
	const materials = [];
	let currentTheme = 'classic';
	
	for (let i = 0; i < 6; i++) {
		const ourFaceNumber = faceMapping[i];
		materials.push(new THREE.MeshLambertMaterial({ 
			map: createFaceTexture(ourFaceNumber, currentTheme)
		}));
	}
	const dice = new THREE.Mesh(geometry, materials);
	scene.add(dice);

	// ========== THEME MANAGEMENT ==========

	function switchTheme(themeName) {
		currentTheme = themeName;
		
		for (let i = 0; i < 6; i++) {
			const ourFaceNumber = faceMapping[i];
			dice.material[i].map = createFaceTexture(ourFaceNumber, currentTheme);
			dice.material[i].needsUpdate = true;
		}
		
		document.querySelectorAll('.theme-btn').forEach(btn => {
			btn.classList.toggle('active', btn.dataset.theme === themeName);
		});
	}

	document.querySelectorAll('.theme-btn').forEach(btn => {
		btn.addEventListener('click', () => {
			switchTheme(btn.dataset.theme);
		});
	});

	// ========== DICE ROLL LOGIC ==========
	const rollButton = document.getElementById('rollBtn');
	const resultElement = document.getElementById('result');
	let isRolling = false;
	let animationFrameId = null;
	
	function getTopFace() {
		const worldUp = new THREE.Vector3(0, 1, 0);
		const faceNormals = [
			new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
			new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
			new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
		];
		let maxDot = -Infinity;
		let topFaceIndex = 0;
		for (let i = 0; i < faceNormals.length; i++) {
			const worldNormal = faceNormals[i].clone().applyQuaternion(dice.quaternion);
			const dot = worldNormal.dot(worldUp);
			if (dot > maxDot) { maxDot = dot; topFaceIndex = i; }
		}
		return faceMapping[topFaceIndex];
	}

	// ========== CORRECTED ROLL FUNCTION ==========
	function rollDice() {
		if (isRolling) return;
		isRolling = true;
		rollButton.disabled = true;
		rollButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rolling...';
		let verticalPosition = 0;
		let verticalVelocity = 0.3;
		const gravity = -0.015;

		
		const targetFace = Math.floor(Math.random() * 6) + 1;
		console.log("Target:", targetFace);
		
		// FIXED: Store START rotation for interpolation
		const startRotation = {
			x: dice.rotation.x,
			y: dice.rotation.y,
			z: dice.rotation.z
		};
		
		// Target rotations
		const targetRotations = {
			1: { x: -Math.PI/2, y: 0, z: 0 },
			2: { x: -Math.PI/2, y: Math.PI/2, z: 0 },
			3: { x: 0, y: 0, z: 0 },
			4: { x: Math.PI, y: 0, z: 0 },
			5: { x: -Math.PI/2, y: -Math.PI/2, z: 0 },
			6: { x: Math.PI/2, y: Math.PI, z: 0 }
		};
		const target = targetRotations[targetFace];
		
		const startTime = Date.now();
		const totalDuration = 2800;
		
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
		
		function animate() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / totalDuration, 1);

			verticalVelocity += gravity;
			verticalPosition += verticalVelocity;
			if (verticalPosition < 0) {
				verticalPosition = 0;
				verticalVelocity = -verticalVelocity * 0.8;
			}
			dice.position.y = verticalPosition;
			
			if (progress >= 1) {
				dice.rotation.x = target.x;
				dice.rotation.y = target.y;
				dice.rotation.z = target.z;
				resultElement.textContent = getTopFace();
				isRolling = false;
				rollButton.disabled = false;
				rollButton.innerHTML = '<i class="fas fa-dice"></i> Roll Dice';
				renderer.render(scene, camera);
				return;
			}
			
			// ========== CLEAN SOLUTION: Single calculation method ==========
			
			// 1. Calculate how much EXTRA SPIN we need (fast at start, zero at end)
			const totalExtraSpin = 10; // Total extra rotations
			const extraSpin = totalExtraSpin * (1 - progress) * (1 - progress); // Quadratic deceleration
			
			// 2. Calculate the actual rotation for this frame
			//	We interpolate from startRotation to target, PLUS extra spin
			
			// Base interpolation (start -> target)
			const baseProgress = progress;
			
			// Current base rotation (without extra spin)
			const baseX = startRotation.x + (target.x - startRotation.x) * baseProgress;
			const baseY = startRotation.y + (target.y - startRotation.y) * baseProgress;
			const baseZ = startRotation.z + (target.z - startRotation.z) * baseProgress;
			
			// Add extra spin (decelerating)
			const currentSpin = extraSpin * 2 * Math.PI; // Convert to radians
			
			// Apply extra spin around X axis (UP direction)
			// The spin DECREASES over time because extraSpin decreases
			const finalX = baseX + currentSpin;
			const finalY = baseY + currentSpin * 0.3; // Some Y spin
			const finalZ = baseZ; // Minimal Z
			
			// 3. Add CHAOS only in first 50%, decreasing over time
			if (progress < 0.5) {
				const chaosStrength = 0.8 * (1 - (progress / 0.5)); // Chaos decreases
				
				// Apply chaos as small random offsets
				dice.rotation.x = finalX + (Math.random() - 0.5) * chaosStrength;
				dice.rotation.y = finalY + (Math.random() - 0.5) * chaosStrength * 0.6;
				dice.rotation.z = finalZ + (Math.random() - 0.5) * chaosStrength * 0.3;
			} else {
				// No chaos after 50%, pure decelerating spin
				dice.rotation.x = finalX;
				dice.rotation.y = finalY;
				dice.rotation.z = finalZ;
			}
			
			// 4. For the last 20%, ensure smooth alignment to exact target
			if (progress > 0.8) {
				const alignProgress = (progress - 0.8) / 0.2;
				const ease = alignProgress * alignProgress; // Quadratic easing
				
				dice.rotation.x = dice.rotation.x * (1 - ease) + target.x * ease;
				dice.rotation.y = dice.rotation.y * (1 - ease) + target.y * ease;
				dice.rotation.z = dice.rotation.z * (1 - ease) + target.z * ease;
			}
			
			renderer.render(scene, camera);
			animationFrameId = requestAnimationFrame(animate);
		}		
		animationFrameId = requestAnimationFrame(animate);
	}

	// Event listeners
	rollButton.addEventListener('click', rollDice);
	document.addEventListener('keydown', (event) => {
		if ((event.code === 'Space' || event.code === 'Enter') && !isRolling) {
			event.preventDefault();
			rollDice();
		}
	});

	function animateIdle() {
		if (!isRolling) dice.rotation.y += 0.0005;
		renderer.render(scene, camera);
		requestAnimationFrame(animateIdle);
	}
	
	// Initialize
	dice.rotation.x = 0; dice.rotation.y = 0; dice.rotation.z = 0;
	resultElement.textContent = getTopFace();
	animateIdle();
	
	window.addEventListener('resize', function() {
		camera.aspect = diceContainer.clientWidth / diceContainer.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(diceContainer.clientWidth, diceContainer.clientHeight);
	});
});