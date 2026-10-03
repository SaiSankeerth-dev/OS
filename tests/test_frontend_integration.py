import os
import re
import pytest
from fastapi.testclient import TestClient
from web.server import app

def test_frontend_root_served():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
        html = response.text
        assert '<div id="root"></div>' in html
        assert "manifest.webmanifest" in html
        assert "apple-touch-icon" in html
        assert "/static/assets/" in html

def test_frontend_assets_served():
    with TestClient(app) as client:
        root_res = client.get("/")
        html = root_res.text
        
        # Extract asset links
        scripts = re.findall(r'src="(/static/assets/[^"]+)"', html)
        assert len(scripts) > 0, "No asset scripts found in index.html"
        
        for script_path in scripts:
            res = client.get(script_path)
            assert res.status_code == 200, f"Asset {script_path} failed to serve"
            assert len(res.content) > 1000

        styles = re.findall(r'href="(/static/assets/[^"]+\.css)"', html)
        assert len(styles) > 0, "No asset stylesheets found in index.html"
        for style_path in styles:
            res = client.get(style_path)
            assert res.status_code == 200, f"Style {style_path} failed to serve"
            assert len(res.content) > 1000

def test_api_endpoints_for_frontend():
    with TestClient(app) as client:
        # 1. Me endpoint
        me_res = client.get("/api/me")
        assert me_res.status_code == 200
        assert "name" in me_res.json()

        # 2. V1 Home endpoint
        home_res = client.get("/api/v1/home")
        assert home_res.status_code == 200
        assert isinstance(home_res.json(), dict)

        # 3. V1 Plan endpoint
        plan_res = client.get("/api/v1/plan")
        assert plan_res.status_code == 200
        assert "items" in plan_res.json()

        # 4. V1 Commitments endpoint
        comm_res = client.get("/api/v1/commitments")
        assert comm_res.status_code == 200
        assert "commitments" in comm_res.json()

        # 5. V1 Tasks endpoint
        tasks_res = client.get("/api/v1/tasks")
        assert tasks_res.status_code == 200
        assert "tasks" in tasks_res.json()

        # 6. V1 Approvals endpoint
        appr_res = client.get("/api/v1/approvals")
        assert appr_res.status_code == 200
        assert "pending_approvals" in appr_res.json()

        # 7. Connectors endpoint
        conn_res = client.get("/api/connectors")
        assert conn_res.status_code == 200
        assert "connectors" in conn_res.json()
