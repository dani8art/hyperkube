FROM gcr.io/google_containers/hyperkube-amd64:v1.6.4

COPY ./kube-components/etcd-v3.json /etc/kubernetes/manifests/etcd.json

COPY ./addons/dashboard-controller-v1.6.1.yaml /etc/kubernetes/addons/singlenode/dashboard-controller.yaml
COPY ./addons/dashboard-service.yaml /etc/kubernetes/addons/singlenode/dashboard-service.yaml