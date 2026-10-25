import subprocess
import time
import json
import urllib.request
import urllib.error

# Start server
proc = subprocess.Popen(['node', 'server/dist/index.js'])
time.sleep(2)

def req(url, method='GET', data=None, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req_obj = urllib.request.Request('http://localhost:8080' + url, method=method, headers=headers)
    if data:
        req_obj.data = json.dumps(data).encode('utf-8')
    try:
        with urllib.request.urlopen(req_obj) as resp:
            body = resp.read().decode('utf-8')
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        return e.code, json.loads(body) if body else {}

try:
    print('1. Testing Login Aditi...')
    st, res = req('/api/auth/login', 'POST', {'email': 'aditi@filmin.demo', 'password': 'password123'})
    aditi_id = res.get('id')
    print(f"   Status: {st}, User ID: {aditi_id}")
    assert st == 200, f"Expected 200, got {st}"

    print('2. Submitting Application to Opp 1 (Lead Actress)...')
    st, res = req('/api/opportunities/1/applications', 'POST', {'coverMessage': 'I would love to audition!'}, token=aditi_id)
    print(f"   Status: {st}, Response: {res}")
    assert st == 201, f"Expected 201, got {st}"

    print('3. Testing Duplicate Application Prevention...')
    st, res = req('/api/opportunities/1/applications', 'POST', {'coverMessage': 'Second apply'}, token=aditi_id)
    print(f"   Status: {st}, Code: {res.get('code')}")
    assert st == 409 and res.get('code') == 'DUPLICATE_APPLICATION', f"Duplicate failed: {st}, {res}"

    print('4. Testing Self-Application Prevention (Vikram applying to Vikram)...')
    st, res = req('/api/opportunities/1/applications', 'POST', {'coverMessage': 'Self apply'}, token=2)
    print(f"   Status: {st}, Code: {res.get('code')}")
    assert st == 400 and res.get('code') == 'SELF_APPLICATION', f"Self apply failed: {st}, {res}"

    print('5. Testing IDOR Protection (Aditi reviewing Vikram opp 1 applicants)...')
    st, res = req('/api/opportunities/1/applications', 'GET', token=aditi_id)
    print(f"   Status: {st}, Code: {res.get('code')}")
    assert st == 403 and res.get('code') == 'FORBIDDEN', f"IDOR failed: {st}, {res}"

    print('6. Testing Creator Reviewing Opp 1 Applicants (Vikram reviewing Opp 1)...')
    st, res = req('/api/opportunities/1/applications', 'GET', token=2)
    print(f"   Status: {st}, Total applicants: {len(res)}")
    assert st == 200 and len(res) >= 1

    print('7. Testing Status Transition (Accepting Aditi application)...')
    app_id = res[0]['id']
    st, res = req(f'/api/applications/{app_id}/status', 'PATCH', {'status': 'ACCEPTED'}, token=2)
    print(f"   Status: {st}, New App Status: {res.get('status')}")
    assert st == 200 and res.get('status') == 'ACCEPTED'

    print('8. Testing Terminal Status Immutability (Cannot change ACCEPTED to REJECTED)...')
    st, res = req(f'/api/applications/{app_id}/status', 'PATCH', {'status': 'REJECTED'}, token=2)
    print(f"   Status: {st}, Code: {res.get('code')}")
    assert st == 400 and res.get('code') == 'INVALID_STATUS_TRANSITION'

    print('\n======================================================')
    print('>>> ALL 8 CRITICAL PRD PATH TESTS PASSED PERFECTLY! <<<')
    print('======================================================')

finally:
    proc.terminate()
