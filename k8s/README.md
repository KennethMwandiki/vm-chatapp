# Kubernetes Deployment Guide for VM CHAT INTENG

## Prerequisites
- Kubernetes cluster (local or cloud, e.g., Minikube, AKS, GKE, EKS)
- `kubectl` installed and configured
- Docker images for backend and frontend (replace image names in YAMLs if needed)

## Files
- `mongo-deployment.yaml`: MongoDB deployment and service
- `backend-deployment.yaml`: Node.js backend deployment and NodePort service
- `frontend-deployment.yaml`: NGINX frontend deployment and LoadBalancer service
- `deploy.sh`: Bash script to deploy all resources

## Deployment Steps

1. **Navigate to the `k8s` directory:**
   ```sh
   cd k8s
   ```
2. **Run the deployment script:**
   ```sh
   bash deploy.sh
   ```
   This will apply all YAML files in order.

3. **Verify deployments:**
   ```sh
   kubectl get pods
   kubectl get svc
   ```

## About
-----

Broadcast to all major platforms at once — simple, fast, and reliable live streaming. Use these Kubernetes manifests to deploy the containerized frontend, backend, and MongoDB for production-grade live streaming with failover and scale.

4. **Access the services:**
   - **Backend:** NodePort (default: 30080 on your node IP)
   - **Frontend:** LoadBalancer (external IP, or `minikube service frontend-service` for Minikube)
   - **MongoDB:** Internal ClusterIP (used by backend)

## Customization
- Update environment variables in `backend-deployment.yaml` as needed.
- Replace Docker image names if you have custom builds.
- For production, consider using Kubernetes Secrets for sensitive data.

## Cleanup
To remove all resources:
```sh
kubectl delete -f mongo-deployment.yaml
kubectl delete -f backend-deployment.yaml
kubectl delete -f frontend-deployment.yaml
```

---

For further integration, API access, or platform-specific instructions, see the main project documentation or contact the maintainer.


---

## Regional Orchestration & Failover (No Downtime Policy)

To ensure high availability and zero downtime, deploy your services across multiple regions and configure global failover:

### 1. Multi-Region Kubernetes Clusters
- Deploy the same manifests (`backend-deployment.yaml`, `frontend-deployment.yaml`, `mongo-deployment.yaml`) to clusters in different cloud regions.
- Use a CI/CD pipeline to automate deployments to all regions.

### 2. Global Load Balancer
- Use a global load balancer (e.g., Azure Front Door, AWS Route 53, Google Cloud Load Balancer, Cloudflare) to route user traffic to the nearest healthy region.
- Configure health checks for each region’s frontend service.
- Enable automatic failover: if a region is down, traffic is routed to another healthy region.

### 3. Database Replication
- Use MongoDB replica sets with members in multiple regions for data redundancy and failover.
- Ensure your backend is configured to connect to the replica set string.

### 4. Example Workflow
1. Deploy all manifests to each region’s cluster.
2. Register each region’s frontend service endpoint with your global load balancer.
3. Set up health checks and failover policies in the load balancer.
4. Test failover by simulating a region outage and verifying traffic is rerouted.

> **Note:** For production, use managed database and load balancing services for best reliability.
