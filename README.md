# TaskFlow - Task Management System

A full-stack task management application built with Django REST Framework and React.

## 🚀 Tech Stack

**Backend:**
- Python 3.10+
- Django 5.2
- Django REST Framework
- PostgreSQL
- JWT Authentication

**Frontend:**
- React 19
- Tailwind CSS
- Axios
- React Router

## 📋 Features

- User Authentication (Signup/Login with JWT)
- Create, Read, Update, Delete Tasks
- Assign tasks to team members
- Filter & Search tasks by status, priority
- User Profile Management
- Team Member Dashboard
- Task Statistics & Analytics

## 🛠️ Quick Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 15
- Docker (for database)

### Run Application

**1. Start Database:**
```bash
docker-compose up -d
```

**2. Start Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**3. Start Frontend (new terminal):**
```bash
cd frontend
npm install
npm start
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin

## 📝 Notes

- CORS enabled for localhost:3000
- PostgreSQL runs on port 5432

## ☸️ Deployment on AWS EKS (Production Guide)

Below are the exact steps required before running the CI/CD pipeline.

### 🚀 1. Create EKS Cluster
```bash
eksctl create cluster \
  --name task-mgmt-cluster \
  --region ap-south-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3 \
  --managed
```

Verify the cluster:
```bash
kubectl get nodes
kubectl config current-context
```

### 🚦 2. Install AWS Load Balancer Controller (ALB)
(Mandatory for ALB Ingress)

**👉 Add OIDC Provider**
```bash
eksctl utils associate-iam-oidc-provider \
  --region ap-south-1 \
  --cluster task-mgmt-cluster \
  --approve
```

**👉 Download IAM policy**
```bash
curl -o iam-policy.json \
https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
```

**👉 Create IAM Policy**
```bash
aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam-policy.json
```

**👉 Create IAM Service Account**
```bash
eksctl create iamserviceaccount \
  --region ap-south-1 \
  --cluster task-mgmt-cluster \
  --namespace kube-system \
  --name aws-load-balancer-controller \
  --attach-policy-arn arn:aws:iam::<AWS_ACCOUNT_ID>:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve
```

**👉 Install ALB Controller**
```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=task-mgmt-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
```

Verify installation:
```bash
kubectl get deployment -n kube-system | grep load-balancer
```

### 🗄️ 3. Create ECR Repositories

**Backend Repo**
```bash
aws ecr create-repository \
  --repository-name task-mgmt-backend \
  --region ap-south-1
```

**Frontend Repo**
```bash
aws ecr create-repository \
  --repository-name task-mgmt-frontend \
  --region ap-south-1
```

**Login to ECR:**
```bash
aws ecr get-login-password --region ap-south-1 | \
docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com
```

### 🔐 4. Configure GitHub Repository Secrets

Navigate to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following 5 secrets:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | Your AWS Access Key ID | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Your AWS Secret Access Key | `wJalrXUtn...` |
| `BACKEND_API_URL` | Backend API endpoint | `http://backend-service:8000` |
| `DOCKER_USERNAME` | Docker Hub username | `your-username` |
| `DOCKER_PASSWORD` | Docker Hub password/token | `your-password` |

### 🎯 5. Deploy Application to EKS

After setting up the secrets, deploy the application using the following commands:
```bash
kubectl apply -f k8s/postgres-storage-class.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

**Verify deployments:**
```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

### 🌐 6. Configure Ingress and Update Backend URL

**Apply Ingress configuration:**
```bash
kubectl apply -f k8s/ingress.yaml
```

**Get ALB URL:**
```bash
kubectl get ingress
```

This will display the Application Load Balancer URL (it may take 2-3 minutes to provision).

**Update Backend URL:**

Once you have the ALB URL, you need to update the `BACKEND_API_URL` secret in GitHub:

1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Edit the `BACKEND_API_URL` secret
3. Replace the value with your ALB URL: `http://<ALB-URL>`
4. Re-run the CI/CD pipeline to update the frontend with the correct backend URL

**Verify application:**
```bash
# Check ingress status
kubectl describe ingress

# Access your application at the ALB URL
echo "Frontend: http://<ALB-URL>"
```
