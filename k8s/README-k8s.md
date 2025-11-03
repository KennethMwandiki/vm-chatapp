# Kubernetes Deployment Structure

- `/k8s` — All Kubernetes manifests
  - `backend-deployment.yaml`, `frontend-deployment.yaml`, `mongo-deployment.yaml`, `deploy.sh`, `README.md`
- Optionally, reference or copy relevant manifests into `/backend` and `/frontend` for service-specific deployment.

## Usage
- Deploy all resources:
  ```sh
  cd k8s
  bash deploy.sh
  ```
- Clean up:
  ```sh
  kubectl delete -f mongo-deployment.yaml
  kubectl delete -f backend-deployment.yaml
  kubectl delete -f frontend-deployment.yaml
  ```
