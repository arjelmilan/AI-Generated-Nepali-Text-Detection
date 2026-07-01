import subprocess, sys, time, requests, json

BASE = "http://localhost:8000"

def req(method, path, **kwargs):
    fn = getattr(requests, method)
    try:
        r = fn(BASE + path, **kwargs)
        return r
    except requests.ConnectionError:
        return None

# Wait for server
print("Waiting for server...")
for _ in range(30):
    r = req("get", "/health")
    if r and r.status_code in (200, 503):
        print("Server up:", r.status_code)
        break
    time.sleep(2)
else:
    print("Server not responding")
    sys.exit(1)

# Register
print("\n=== POST /register ===")
r = req("post", "/register", json={"email": "auth_test@nepdetect.com", "password": "secret123"})
print(r.status_code, r.json())
if r.status_code not in (201, 400):
    print("FAIL: register"); sys.exit(1)

# Login
print("\n=== POST /login ===")
r = req("post", "/login", json={"email": "auth_test@nepdetect.com", "password": "secret123"})
print(r.status_code, r.json())
assert r.status_code == 200, "Login failed"
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Me
print("\n=== GET /me ===")
r = req("get", "/me", headers=headers)
print(r.status_code, r.json())
assert r.status_code == 200, "/me failed"

# Stats (user scoped, empty is OK)
print("\n=== GET /stats ===")
r = req("get", "/stats", headers=headers)
print(r.status_code, r.json())
assert r.status_code == 200, "/stats failed"

# History (user scoped, empty is OK)
print("\n=== GET /history ===")
r = req("get", "/history", headers=headers)
print(r.status_code, r.json())
assert r.status_code == 200, "/history failed"

# Access without token should be 403
print("\n=== GET /history (no token) ===")
r = req("get", "/history")
print(r.status_code)
assert r.status_code == 403, "Should require auth"

print("\n✅ All auth tests passed!")
