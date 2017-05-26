# HOW TO DEPLOY a KUBERNETES CLUSTER WITH darteaga/hyperkube

## Update flags on docker.service

```
DOCKER_CONF=$(systemctl cat docker | head -1 | awk '{print $2}')
sed -i.bak 's/^\(MountFlags=\).*/\1shared/' $DOCKER_CONF
systemctl daemon-reload
systemctl restart docker
```

If these command does not work change it by hand:
```
nano $(systemctl cat docker | head -1 | awk '{print $2}')
```

and add
```
MountFlags=shared
```

## RUN darteaga/hyperkube container

First export the version of kubernetes that will be used by the container. 

```
export K8S_VERSION=v1.6.4
```

Run docker run command

```
docker run \
  --volume=/:/rootfs:ro \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:rw \
  --volume=/var/lib/kubelet/:/var/lib/kubelet:rw,shared \
  --volume=/var/run:/var/run:rw \
  --volume=/run/xtables.lock:/run/xtables.lock:rw \
  --net=host \
  --pid=host \
  --privileged=true \
  --name=kubelet \
  -d \
  darteaga/hyperkube:${K8S_VERSION} \
    /hyperkube kubelet \
      --hostname-override=127.0.0.1 \
      --address=0.0.0.0 \
      --api-servers=http://localhost:8080 \
      --pod-manifest-path=/etc/kubernetes/manifests \
      --allow-privileged=true \
      --cluster-dns=10.0.0.10 \
      --cluster-domain=cluster.local \
      --v=2
```

Download `kubectl` binary

```
sudo curl -sSL "https://storage.googleapis.com/kubernetes-release/release/$K8S_VERSION/bin/linux/amd64/kubectl" > /usr/bin/kubectl
```

Give it permissions

```
chmod +x /usr/bin/kubectl	
```

## Check kubernetes is running

```
kubectl --namespace=kube-system get all
```

It must show the following

```
NAME                                       READY     STATUS    RESTARTS   AGE
po/k8s-etcd-127.0.0.1                      1/1       Running   0          2h
po/k8s-master-127.0.0.1                    4/4       Running   0          2h
po/k8s-proxy-127.0.0.1                     1/1       Running   0          2h
po/kube-addon-manager-127.0.0.1            2/2       Running   0          2h
po/kube-dns-806549836-n11kf                3/3       Running   0          2h
po/kubernetes-dashboard-4278721175-9vm46   1/1       Running   0          51m

NAME                       CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
svc/kube-dns               10.0.0.10    <none>        53/UDP,53/TCP   2h
svc/kubernetes-dashboard   10.0.0.172   <nodes>       80:30000/TCP    7s

NAME                          DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/kube-dns               1         1         1            1           2h
deploy/kubernetes-dashboard   1         1         1            1           51m

NAME                                 DESIRED   CURRENT   READY     AGE
rs/kube-dns-806549836                1         1         1         2h
rs/kubernetes-dashboard-2487936616   0         0         0         51m
rs/kubernetes-dashboard-4278721175   1         1         1         51m
```