import * as THREE from 'three';

class BackgroundAnimation {
    constructor() {
        this.container = document.querySelector('.background-animation');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.particles = [];
        this.starCount = 1500;
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('Background animation container not found');
            return;
        }

        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0x000000, 0);

        // Setup camera
        this.camera.position.z = 800;

        // Create particles
        const starGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.starCount * 3);
        const colors = new Float32Array(this.starCount * 3);
        const sizes = new Float32Array(this.starCount);

        // Create a star shape texture
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.5, 'rgba(128, 128, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 64, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        const texture = new THREE.CanvasTexture(canvas);

        for (let i = 0; i < this.starCount; i++) {
            const i3 = i * 3;
            // Create stars in a spherical distribution
            const radius = Math.random() * 1200; // Increased radius
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Random star sizes - increased further
            sizes[i] = Math.random() * 4 + 3;

            // Color with slight variations
            const brightness = Math.random() * 0.2 + 0.8;
            const color = new THREE.Color(0x74b9ff);
            color.multiplyScalar(brightness);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const starMaterial = new THREE.PointsMaterial({
            size: 6,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            map: texture,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(starField);
        this.particles.push(starField);

        // Event listeners
        window.addEventListener('resize', this.handleResize.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));

        // Start animation
        this.animate();
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    handleMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.time += 0.002;

        // Update star field
        this.particles.forEach(starField => {
            // Slow rotation
            starField.rotation.y += 0.0002;
            
            // Mouse interaction
            starField.rotation.x += this.mouseY * 0.0001;
            starField.rotation.y += this.mouseX * 0.0001;

            // Twinkle effect
            const sizes = starField.geometry.attributes.size;
            for(let i = 0; i < this.starCount; i++) {
                sizes.array[i] = Math.max(
                    2,
                    Math.sin(this.time + i * 0.5) * 1.0 + 2.5
                );
            }
            sizes.needsUpdate = true;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

export default BackgroundAnimation;