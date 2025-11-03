#!/bin/bash
# Kubernetes Deployment Script for VM CHAT INTENG
# Usage: bash deploy.sh

set -e

echo "Applying MongoDB deployment..."
kubectl apply -f mongo-deployment.yaml

echo "Applying Backend deployment..."
kubectl apply -f backend-deployment.yaml

echo "Applying Frontend deployment..."
kubectl apply -f frontend-deployment.yaml

echo "All resources have been applied."

echo "\nCheck pod status:"
kubectl get pods

echo "\nCheck services:"
kubectl get svc
