# Shopsy Frontend

React + Vite frontend for:
- signup/login
- search
- product details page

## Local
```bash
npm install
npm run dev
```

## GKE deployment
Apply:
```bash
kubectl apply -f k8s/frontend-backendconfig.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress-frontend-and-api.yaml
```

## GitHub repo setup
Secrets:
- GCP_WORKLOAD_IDENTITY_PROVIDER
- GCP_SERVICE_ACCOUNT

Variables:
- GCP_PROJECT_ID=shopsy-nagp-2025
- GCP_REGION=asia-south1
- GAR_REPOSITORY=shopsy
- GKE_CLUSTER=shopsy
- GKE_ZONE=asia-south1-a
- K8S_NAMESPACE=shopsy
- DEPLOYMENT_NAME=shopsy-frontend
- IMAGE_NAME=shopsy-frontend

## One-time Cloud Shell binding
```bash
gcloud iam service-accounts add-iam-policy-binding   github-deployer@shopsy-nagp-2025.iam.gserviceaccount.com   --role="roles/iam.workloadIdentityUser"   --member="principalSet://iam.googleapis.com/projects/25031051050/locations/global/workloadIdentityPools/github-pool/attribute.repository/yankit-chauhan/shopsy-frontend"
```
