# Secure Local MySQL Networking Guide for Cloud Backend (Render)

## 1. Architectural Mandate & Critical Network Constraint
Per project requirements, the Smart Campus Super App must **exclusively utilize the developer's own local MySQL engine** running on their local host (`127.0.0.1:3306`). No third-party cloud database service (e.g. Supabase, PlanetScale, Aiven) or in-memory DB replacements (H2/SQLite) are permitted.

### The 127.0.0.1 Fallacy
When the Spring Boot backend container runs in the cloud on **Render**:
- `127.0.0.1` refers **strictly to the Render container itself**, NOT your personal Windows laptop.
- Render resides in an isolated cloud VPC (e.g., in Oregon or Frankfurt), while your local MySQL runs inside your private home network behind residential NAT routers and Windows Defender Firewall.
- Therefore, a deployed Render backend **cannot directly connect to `127.0.0.1:3306`** on your laptop without an authenticated, encrypted TCP networking bridge.

> [!IMPORTANT]
> **Honest Operational Status**:
> Do not claim that the deployed Render backend connects to your local MySQL until an authenticated tunnel is actively running and tested.
> Until you establish this tunnel, **the complete application runs and functions 100% locally** (Spring Boot on localhost:8080 connecting directly to local MySQL on 127.0.0.1:3306, with React Vite on localhost:5173). Remote database connectivity remains an explicit deployment prerequisite.

---

## 2. Hard Requirements for Remote-to-Local Database Operation
For Render to communicate with your local MySQL database:
1. **Host Power State**: Your laptop must remain powered ON and awake (sleep/hibernate disabled).
2. **Network Connectivity**: Your laptop must maintain an active, uninterrupted internet connection.
3. **Local MySQL Service**: The local MySQL service (`mysqld`) must be actively running and bound to `127.0.0.1:3306` or `0.0.0.0:3306`.
4. **Secure Tunnel Established**: A secure, authenticated TCP tunnel (such as ngrok TCP or Cloudflare Tunnel) must remain open.
5. **Render Environment Variables**: The dynamic tunnel host and port must be configured in Render Dashboard environment variables (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`).
6. **Firewall & Security**: Never open port 3306 raw to the public internet. Use outbound-only tunneling clients that encrypt transport with TLS.

---

## 3. Option A: ngrok TCP Tunnel (Recommended for Viva / Evaluation)
`ngrok` establishes an authenticated outbound TCP proxy from your machine to ngrok's edge infrastructure, providing a unique public endpoint for Render.

### Step 1: Install ngrok on Windows
Open Windows PowerShell:
```powershell
winget install ngrok.ngrok
```
Or download directly from [ngrok.com](https://ngrok.com/download).

### Step 2: Authenticate with ngrok
Sign up for a free account at ngrok and add your authentication token:
```powershell
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```

### Step 3: Start TCP Tunnel for Port 3306
Run the following command in PowerShell:
```powershell
ngrok tcp 3306
```

### Step 4: Extract Forwarded Host and Port
The terminal output will display:
```text
Session Status                online
Account                       Your Name (Plan: Free)
Forwarding                    tcp://4.tcp.ngrok.io:19423 -> localhost:3306
```
In this example:
- **Host**: `4.tcp.ngrok.io`
- **Port**: `19423`

### Step 5: Configure Render Web Service Environment
In your Render Dashboard (`https://dashboard.render.com`) -> **smart-campus-backend** -> **Environment**:
```env
DB_HOST=4.tcp.ngrok.io
DB_PORT=19423
DB_NAME=smart_campus_db
DB_USERNAME=campus_app_user
DB_PASSWORD=Campus@Secure2026!
```
Click **Save Changes**. Render will automatically trigger a redeploy and connect securely to your local MySQL instance!

---

## 4. Option B: Cloudflare Tunnel (`cloudflared`)
Cloudflare Named Tunnels establish outbound TLS 1.3 tunnels without exposing any open ports.

### Step 1: Install `cloudflared` on Windows
```powershell
winget install --id Cloudflare.cloudflared
```

### Step 2: Authenticate & Create Named Tunnel
```powershell
cloudflared tunnel login
cloudflared tunnel create smart-campus-tunnel
```

### Step 3: Configure Ingress Rules (`config.yml`)
Create a configuration file `C:\Users\<YourUser>\.cloudflared\config.yml`:
```yaml
tunnel: <YOUR-TUNNEL-UUID>
credentials-file: C:\Users\<YourUser>\.cloudflared\<YOUR-TUNNEL-UUID>.json

ingress:
  - hostname: mysql.yourcustomdomain.com
    service: tcp://localhost:3306
  - service: http_status:404
```

### Step 4: Route DNS and Run Tunnel
```powershell
cloudflared tunnel route dns smart-campus-tunnel mysql.yourcustomdomain.com
cloudflared tunnel run smart-campus-tunnel
```

### Step 5: Configure Render Environment
In Render Dashboard:
```env
DB_HOST=mysql.yourcustomdomain.com
DB_PORT=3306
DB_NAME=smart_campus_db
DB_USERNAME=campus_app_user
DB_PASSWORD=Campus@Secure2026!
```

---

## 5. Option C: Tailscale WireGuard Mesh Network
Tailscale creates an encrypted point-to-point WireGuard mesh network connecting your laptop and cloud servers.

1. Install Tailscale on Windows and log in. Note your machine's 100.x.y.z Tailscale IP.
2. In the Render Docker container startup script, configure the Tailscale daemon with a one-time auth key (`TS_AUTHKEY`).
3. Set Render's `DB_HOST` to your machine's Tailscale IP (e.g. `100.82.14.90`).

---

## 6. Verifying Connection Health in Render Logs
When Render boots your Spring Boot backend, examine the deployment logs in the Render Dashboard. You must verify:
```text
HikariPool-1 - Starting...
HikariPool-1 - Added connection com.mysql.cj.jdbc.ConnectionImpl@...
HikariPool-1 - Start completed.
Flyway Community Edition 10.x.x by Redgate
Database: jdbc:mysql://<tunnel-host>:<port>/smart_campus_db (MySQL 8.x)
Current version of schema `smart_campus_db`: 2
Schema `smart_campus_db` is up to date. No migration necessary.
```
When this log sequence appears, Render is actively reading and writing to your local machine's MySQL database.

---

## 7. What Happens If the Tunnel Disconnects?
If your computer sleeps, Wi-Fi drops, or the tunnel process terminates:
1. Render will log `com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure`.
2. The Spring Boot application Actuator `/actuator/health` endpoint will report status `DOWN`.
3. Spring Boot logs the error safely without leaking credentials.
4. **Resolution**: Re-open the tunnel on your computer, ensure port 3306 is alive, and Render's connection pool will automatically reconnect once the TCP endpoint is reachable again.
