const dotenv = require('dotenv').config()
const k8s = require('@kubernetes/client-node');
const CryptoJS = require('crypto-js');

//************************ */
async function main () {
    const kc = new k8s.KubeConfig();
    
    //const config = YAML.safeLoad((`fs.load my .kube/config file ...`)
    
    //kc.loadFromFile('./config/kconfig.yaml');
    //console.log(encrypt('dop_v1_871a224b71d9b3bb7bc855d3f8174efa9fc7173ec25a53af5bfd67c96f47e8f9')) 
    //console.log(decrypt('ZG9wX3YxXzg3MWEyMjRiNzFkOWIzYmI3YmM4NTVkM2Y4MTc0ZWZhOWZjNzE3M2VjMjVhNTNhZjViZmQ2N2M5NmY0N2U4Zjk='))   
    const cluster = {
        name: 'do-blr1-ts-cluster',
        server: 'https://7eec650e-e675-4f03-bfe8-a0838f2c60d6.k8s.ondigitalocean.com',      
        caData: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURKekNDQWcrZ0F3SUJBZ0lDQm5Vd0RRWUpLb1pJaHZjTkFRRUxCUUF3TXpFVk1CTUdBMVVFQ2hNTVJHbG4KYVhSaGJFOWpaV0Z1TVJvd0dBWURWUVFERXhGck9ITmhZWE1nUTJ4MWMzUmxjaUJEUVRBZUZ3MHlNakV4TURZeApNelE0TVRsYUZ3MDBNakV4TURZeE16UTRNVGxhTURNeEZUQVRCZ05WQkFvVERFUnBaMmwwWVd4UFkyVmhiakVhCk1CZ0dBMVVFQXhNUmF6aHpZV0Z6SUVOc2RYTjBaWElnUTBFd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0SUIKRHdBd2dnRUtBb0lCQVFEaEZNMmNwMHdoNE1Yb0ExaWZ4RVVwSTdIay9ia0JBWk9HV2ZjeEh5VUN0M01KcjhMRwp4UzVhRU9hdzlOOVhrOGxkcS82K2pIUzVxNVVoVE81SGhrQ25vU04yd1NrWnV1SEFYdVQyTUZ5OFI3NmZzUGRHCkxRRkRLOVR6aVJBRW9SSitnSEMyZXhxbnNMdTBNNCtDS1UzT04vU3J3cE9ONC8xSUhmNXFBNXM5djdab3JnWkYKcWtENzd0VlVkbFRBdWlwUUxVbm5iRi9ud0xOeGFUaWdFNFo2OFVNbXhRMHZsSFp5U3JSK3Z5enRIcVJyQnNlOQpYd1hzLy9jbHF5QmZNNFNuMjhlQnNvZW11dzFaSzN2a3VQc3MzL28yaWowOVc3UFdObGhyM1F1RDVqRk15azNGCnprK1VPcklxcTJjM3ArNDZDSHJ6Vnd3Vjl6MWF0MEpMOXdnbkFnTUJBQUdqUlRCRE1BNEdBMVVkRHdFQi93UUUKQXdJQmhqQVNCZ05WSFJNQkFmOEVDREFHQVFIL0FnRUFNQjBHQTFVZERnUVdCQlNKTkF3dFpyek5Oc2lhNzFIOQpsYVd5a2srOTd6QU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFzajRWd1paT2N6K2t1WlU3THBITGx3dk9PU2VKClN0M04vWTVmNUpHTkROUGdwaW45YVJYT0xKSm9YYWFKcnlRTVpXY2R5TVdPWlphMVo5b1hocnBMWEhuKzlZR3IKU3FiV0ZnY0IvM0l0ZzRMSEhOVU1aUTdjWS8vUVdOVkNScFg4c3hYV0dGYzFNNWVWRzd0OEpNY1RxcHpRZGN2eAppQzRKTU8ycUtvZExWZDRBU1hlQ29RNnNSZElXRUFaSVNuVmIvMkJrQTdTUVF6RHg4emJOeTRsWkozb0VZQTR3CnA3d2toUVdKaTNjek9mUTVOdnZ1ZXp2cFBKbWRRSXlGRnZNRGlwcGtyRFk5TzlvaEhoS2x6UUpFbGxnbVEzaloKV3R4NDhWOUozVVAyanJNVE9FdTlhZENIWjBnWHEvRXdEOVBsQkJPbGY4a1dDN1hkZkxiN2VXNEEvQT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K',  
    };
    
    const user = {
        name: 'do-blr1-ts-cluster-admin',
        token: CryptoJS.enc.Base64.parse(process.env.K8T).toString(CryptoJS.enc.Utf8)
    };

    kc.loadFromClusterAndUser(cluster,user)

    const context = {
        name: 'do-blr1-ts-cluster',
        user: user.name,
        cluster: cluster.name,
    };

    const conf = {
        clusters: [cluster],
        users: [user],
        contexts: [context],
        currentContext: context.name,
    }

    //kc.loadFromOptions(conf);
    
    //console.log(conf)
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
   
    // const pcontainer = new k8s.V1Container();
    // pcontainer.name = 'ts'
    // pcontainer.image= 'registry.digitalocean.com/metaquest/ts:6967d69'
    // pcontainer.env =[{name: 'BID', value : '6363668a5026731f4e001fb5'}]

    // const podSpec = new k8s.V1PodSpec
    // podSpec.containers = [pcontainer]

    // const meta = new k8s.V1ObjectMeta
    // meta.name =  "bot-6363668a5026731f4e001fb5"
    // meta.namespace = 'default'

    // const podBody = new k8s.V1Pod
    // podBody.kind = 'Pod'
    // podBody.metadata= meta

    // podBody.spec = podSpec
    
    //k8sApi.createNamespacedPod('default',podBody)

    // k8sApi.listNamespacedPod('default')
    // .then((res) => {
    //     res.body.items.forEach(pod => {
    //         console.log(pod.metadata.name)
    //     });
    // });

    const res = await k8sApi.listNamespacedPod('default')

    if(res)
    {
        const pods = res.body.items 
        pods.forEach(pod => {
            console.log(pod.metadata.name)
        });
    }

    //k8sApi.deleteNamespacedPod('bot-6363668a5026731f4e001fb5','default')
}

main()