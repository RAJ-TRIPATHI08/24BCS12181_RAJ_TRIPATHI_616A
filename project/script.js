// ===== LRU Cache Implementation =====
class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.cap = capacity;
        this.size = 0;
        this.maxCap = capacity;
        this.map = new Map();

        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    insert(node) {
        node.next = this.head.next;
        node.prev = this.head;

        this.head.next.prev = node;
        this.head.next = node;
    }

    makeRecentlyUsed(key) {
        let node = this.map.get(key);
        this.remove(node);
        this.insert(node);
    }

    get(key) {
        if (!this.map.has(key)) return -1;

        let node = this.map.get(key);
        this.makeRecentlyUsed(key);
        return node.value;
    }

    put(key, value) {
        let evictedKey = null;

        if (this.map.has(key)) {
            let node = this.map.get(key);
            node.value = value;
            this.makeRecentlyUsed(key);
        } else {
            let newNode = new Node(key, value);
            this.map.set(key, newNode);
            this.insert(newNode);
            this.size++;
        }

        if (this.size > this.maxCap) {
            let lru = this.tail.prev;
            evictedKey = lru.key;
            this.remove(lru);
            this.map.delete(lru.key);
            this.size--;
        }

        return evictedKey;
    }
}

// ===== Global State =====
let cache = null;

// ===== Particle Background =====
(function initParticles() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            // Random color from palette
            const colors = [
                [99, 102, 241],   // purple
                [139, 92, 246],   // violet
                [236, 72, 153],   // pink
                [34, 211, 238],   // cyan
                [52, 211, 153],   // green
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x -= dx * force * 0.01;
                this.y -= dy * force * 0.01;
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const count = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
})();

// ===== UI Functions =====

function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function addLog(message, type = 'info') {
    const container = document.getElementById('logContainer');
    // Remove "waiting" placeholder
    const placeholder = container.querySelector('.log-info .log-msg');
    if (placeholder && placeholder.textContent === 'Waiting for operations...') {
        container.innerHTML = '';
    }

    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.innerHTML = `
        <span class="log-time">${getTimestamp()}</span>
        <span class="log-msg">${message}</span>
    `;

    container.insertBefore(entry, container.firstChild);

    // Keep max 50 entries
    while (container.children.length > 50) {
        container.removeChild(container.lastChild);
    }
}

function clearLog() {
    const container = document.getElementById('logContainer');
    container.innerHTML = `
        <div class="log-entry log-info">
            <span class="log-time">—</span>
            <span class="log-msg">Log cleared</span>
        </div>
    `;
}

function setStatus(text, type = '') {
    const bar = document.getElementById('statusBar');
    const textEl = document.getElementById('statusText');
    bar.className = 'status-bar' + (type ? ` ${type}` : '');

    const icons = { success: '✅', error: '❌', warning: '⚠️', '': '💡' };
    bar.querySelector('.status-icon').textContent = icons[type] || '💡';
    textEl.textContent = text;
}

function updateUI() {
    const container = document.getElementById('cache');
    container.innerHTML = '';

    if (!cache) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>Cache is empty</p>
                <span>Set a capacity and add some key-value pairs!</span>
            </div>
        `;
        return;
    }

    let current = cache.head.next;
    let items = [];

    while (current !== cache.tail) {
        items.push(current);
        current = current.next;
    }

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>Cache is empty</p>
                <span>Use PUT to add key-value pairs</span>
            </div>
        `;
    }

    items.forEach((node, index) => {
        const div = document.createElement('div');
        div.classList.add('cache-item');
        div.style.animationDelay = `${index * 0.06}s`;

        // Position labels
        let posLabel = `#${index + 1}`;
        if (index === 0) {
            div.classList.add('mru');
            posLabel = 'MRU';
        }
        if (index === items.length - 1 && items.length > 1) {
            div.classList.add('lru');
            posLabel = 'LRU';
        }

        div.innerHTML = `
            <span class="item-position">${posLabel}</span>
            <span class="item-key">${node.key}</span>
            <span class="item-value">→ ${node.value}</span>
        `;

        container.appendChild(div);
    });

    // Update counter
    const countEl = document.getElementById('cacheCount');
    countEl.textContent = `${items.length} / ${cache.maxCap}`;
}

function setCapacity() {
    const input = document.getElementById('capacity');
    const cap = parseInt(input.value);

    if (isNaN(cap) || cap < 1 || cap > 20) {
        setStatus('Please enter a valid capacity between 1 and 20', 'error');
        addLog('Invalid capacity input', 'evict');
        input.parentElement.classList.add('shake');
        setTimeout(() => input.parentElement.classList.remove('shake'), 400);
        return;
    }

    cache = new LRUCache(cap);

    // Update badge
    const badge = document.getElementById('capDisplay');
    badge.textContent = cap;
    badge.parentElement.classList.add('pop');
    setTimeout(() => badge.parentElement.classList.remove('pop'), 300);

    setStatus(`Cache initialized with capacity ${cap}`, 'success');
    addLog(`Cache initialized — capacity set to <strong>${cap}</strong>`, 'success');
    input.value = '';
    updateUI();
}

function putValue() {
    const keyInput = document.getElementById('key');
    const valInput = document.getElementById('value');
    const key = keyInput.value.trim();
    const value = valInput.value.trim();

    if (!cache) {
        setStatus('Set a capacity first!', 'warning');
        addLog('Cannot PUT — cache not initialized', 'evict');
        document.getElementById('capacityCard').classList.add('shake');
        setTimeout(() => document.getElementById('capacityCard').classList.remove('shake'), 400);
        return;
    }

    if (!key || !value) {
        setStatus('Please enter both key and value', 'error');
        addLog('PUT failed — missing key or value', 'evict');
        document.getElementById('putCard').classList.add('shake');
        setTimeout(() => document.getElementById('putCard').classList.remove('shake'), 400);
        return;
    }

    const isUpdate = cache.map.has(key);
    const evictedKey = cache.put(key, value);

    if (isUpdate) {
        setStatus(`Updated key "${key}" with new value "${value}"`, 'success');
        addLog(`PUT (update): <strong>${key}</strong> → <strong>${value}</strong>`, 'put');
    } else {
        setStatus(`Added "${key}" : "${value}" to cache`, 'success');
        addLog(`PUT: <strong>${key}</strong> → <strong>${value}</strong>`, 'put');
    }

    if (evictedKey !== null) {
        addLog(`Evicted key <strong>"${evictedKey}"</strong> (LRU)`, 'evict');
        setStatus(`Added "${key}" : "${value}" — evicted "${evictedKey}"`, 'warning');
    }

    keyInput.value = '';
    valInput.value = '';
    updateUI();
}

function getValue() {
    const keyInput = document.getElementById('getKey');
    const key = keyInput.value.trim();

    if (!cache) {
        setStatus('Set a capacity first!', 'warning');
        addLog('Cannot GET — cache not initialized', 'evict');
        return;
    }

    if (!key) {
        setStatus('Please enter a key to get', 'error');
        addLog('GET failed — no key provided', 'evict');
        document.getElementById('getCard').classList.add('shake');
        setTimeout(() => document.getElementById('getCard').classList.remove('shake'), 400);
        return;
    }

    const result = cache.get(key);

    if (result === -1) {
        setStatus(`Key "${key}" not found in cache — Cache Miss!`, 'error');
        addLog(`GET <strong>"${key}"</strong> → <strong>MISS</strong> (-1)`, 'miss');
    } else {
        setStatus(`GET "${key}" → "${result}" — Cache Hit!`, 'success');
        addLog(`GET <strong>"${key}"</strong> → <strong>"${result}"</strong> (HIT)`, 'get');
    }

    keyInput.value = '';
    updateUI();
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active.id === 'capacity') setCapacity();
        else if (active.id === 'key' || active.id === 'value') putValue();
        else if (active.id === 'getKey') getValue();
    }
});
