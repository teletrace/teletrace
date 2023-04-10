# Helm Chart Deployment

## Introduction

This tutorial will guide you through the process of installing Teletrace, an open-source tracing system, using Helm chart. [Helm](https://helm.sh/) is a package manager for Kubernetes that makes it easy to install, upgrade, and manage applications in Kubernetes. The Teletrace Helm chart is available on the [official repository](https://github.com/teletrace/helm-charts) and makes it easy to install and configure Teletrace in a Kubernetes cluster.

## Prerequisites

- A Kubernetes cluster running version 1.11 or later.
- Helm installed and initialized in your cluster.
- Access to the Kubernetes cluster with sufficient privileges to create and manage resources.

<!-- prettier-ignore-start -->
## Steps

1. Add the Teletrace Helm repository to your local Helm installation:
```sh
helm repo add teletrace https://teletrace.github.io/helm-charts/
```

2. Update the Helm repository to ensure that you have the latest version of the Teletrace Helm chart:
```sh
helm repo update
```

3. Install Teletrace using Helm chart with the following command:
```sh
helm install teletrace teletrace/teletrace --namespace teletrace --create-namespace
```
This command will install Teletrace in your Kubernetes cluster using the default configuration values specified in the Helm chart.

4. Check the status of the Teletrace installation with the following command:
```sh
kubectl get pods -n teletrace
```
This command will show the list of pods running in your Kubernetes cluster. You should see Teletrace pod running in your cluster.

5. (Optional) Verify that Teletrace is running correctly by accessing the Teletrace UI. To access the UI, run the following command:
```sh
kubectl port-forward svc/teletrace 8080:8080 -n teletrace
```
This command will create a port-forward to the Teletrace UI. You can now access the UI by opening your web browser and navigating to http://localhost:8080.

6. (Optional) Customize the Teletrace installation by modifying the values in the Helm chart. You can modify the values in the Helm chart by creating a YAML file with your custom values and using the --values option when installing Teletrace. For example:
```sh
helm install teletrace teletrace/teletrace -f my-values.yml --namespace teletrace --create-namespace
```
<!-- prettier-ignore-end -->

## Conclusion

In this tutorial, you learned how to install Teletrace using Helm chart. Helm chart simplifies the installation and management of Teletrace in a Kubernetes cluster. You can customize the installation by modifying the values in the Helm chart. With Teletrace installed, you can now use it to trace the requests and responses of your microservices applications.
