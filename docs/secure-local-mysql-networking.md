# Secure Local MySQL Networking Guide for Cloud Backend (Railway)

## 1. Architectural Mandate
Per project requirements, the Smart Campus Super App must **exclusively utilize the developer's own local MySQL engine** running on their local host (`127.0.0.1:3306`). No third-party managed database service (e.g. Railway MySQL plugin, Supabase, PlanetScale) or in-memory DB replacements (H2/SQLite) are permitted.

When deploying the Spring Boot backend container to **Railway**, Railway resides in the public cloud, while your MySQL instance resides on your personal computer behind residential NAT/firewalls.

This document details the three secure, verified networking options to bridge Railway to your local MySQL database without opening public router ports.

---

## 2. Option A: Cloudflare Tunnel (Recommended)
Cloudflare Named Tunnels establish an outbound-only TLS 1.3 encrypted connection between your local host and Cloudflare's global edge network.

### Step 1: Install `cloudflared`
- **Windows**:
  ```powershell
  winget install --id Cloudflare.cloudflared
  ```
- **macOS**:
  ```bash
  brew install cloudflare/cloudflare/cloudflared
  ```

### Step 2: Authenticate and Create Tunnel
```bash
cloudflared tunnel login
cloudflared tunnel create smart-campus-mysql
```

### Step 3: Configure Ingress Rules (`config.yml`)
Create `~/.cloudflared/config.yml`:
```yaml
tunnel: <TUNNEL_UUID>
credentials-file: /path/to/<TUNNEL_UUID>.json

ingress:
  - hostname: mysql.yourdomain.com
    service: tcp://127.0.0.1:3306
  - service: http_status:404
```

### Step 4: Route DNS and Start Tunnel
```bash
cloudflared tunnel route dns smart-campus-mysql mysql.yourdomain.com
cloudflared tunnel run smart-campus-mysql
```

### Step 5: Configure Railway Environment
On your Railway backend service dashboard, set:
```env
DB_HOST=mysql.yourdomain.com
DB_PORT=3306
DB_NAME=smart_campus_db
DB_USER=campus_app_user
DB_PASSWORD=CampusApp@Secure2026
```

---

## 3. Option B: ngrok TCP Tunnel (Zero-Configuration Quick Setup)
`ngrok` provides immediate TCP forwarding suitable for evaluations and demonstrations.

### Step 1: Install `ngrok`
Download from [ngrok.com](https://ngrok.com/) or install via package manager:
```powershell
winget install ngrok.ngrok
```

### Step 2: Authenticate Your Token
```bash
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```

### Step 3: Forward Port 3306
```bash
ngrok tcp 3306
```

### Step 4: Extract Host and Port
The output will display:
```
Forwarding                    tcp://0.tcp.ngrok.io:19423 -> localhost:3306
```

### Step 5: Configure Railway Environment
In your Railway backend project variables:
```env
DB_HOST=0.tcp.ngrok.io
DB_PORT=19423
DB_NAME=smart_campus_db
DB_USER=campus_app_user
DB_PASSWORD=CampusApp@Secure2026
```

---

## 4. Option C: Tailscale WireGuard Overlay Network
Tailscale creates an encrypted private mesh network connecting your personal computer and the Railway Docker container.

### Step 1: Install Tailscale on Local Computer
Install and log in at [tailscale.com](https://tailscale.com/). Obtain your machine's Tailscale IP (e.g., `100.82.14.90`).

### Step 2: Add Tailscale to Backend Dockerfile
Add the Tailscale client binary and authentication key `TS_AUTHKEY` to the Railway runtime script so the container joins your tailnet upon launch.

### Step 3: Configure Railway Environment
```env
DB_HOST=100.82.14.90
DB_PORT=3306
DB_NAME=smart_campus_db
DB_USER=campus_app_user
DB_PASSWORD=CampusApp@Secure2026
```

---

## 5. Verifying Connection Health
When your Spring Boot application boots on Railway, inspect the container deployment logs.
You should observe:
```
HikariPool-1 - Starting...
HikariPool-1 - Added connection com.mysql.cj.jdbc.ConnectionImpl@...
HikariPool-1 - Start completed.
Flyway Community Edition 10.x.x by Redgate
Database: jdbc:mysql://<tunnel-host>:<port>/smart_campus_db (MySQL 8.x)
Current version of schema `smart_campus_db`: 2
Schema `smart_campus_db` is up to date. No migration necessary.
```
This confirms that the cloud backend is successfully communicating with your local MySQL database.
