#!/bin/bash

# Update kubeconfig
aws eks update-kubeconfig --region ap-south-1 --name task-mgmt-cluster

# Create namespace
kubectl apply -f namespace.yaml

# Install Prometheus
helm upgrade --install prometheus prometheus-community/prometheus \
  --namespace monitoring \
  --values prometheus-values.yaml \
  --wait

# Install Grafana
helm upgrade --install grafana grafana/grafana \
  --namespace monitoring \
  --values grafana-values.yaml \
  --wait

# Get Grafana admin password
echo "Grafana Admin Password:"
kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode
echo ""

# Get LoadBalancer URLs
echo "Waiting for LoadBalancers..."
sleep 30

echo "Prometheus URL:"
kubectl get svc -n monitoring prometheus-server -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
echo ""

echo "Grafana URL:"
kubectl get svc -n monitoring grafana -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
echo ""