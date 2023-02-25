# QA

* 对于一些第一次发npm包的同学，由于这是开源的公共组件，不涉及到公司内部软件包的隐私问题，记得在npm的官网上注册一下自己的账号，注意一个问题就是很多人配置了淘宝的镜像仓库，在npm login的时候可能会报错。
> 解决方法：
> 1.项目全局配置.npmrc registry = http://registry.npmjs.org/
> 2.发包时npm publish —registry=http://registry.npmjs.org/
> 3.在当前项目的 package.json 中通过 publishConfig 字段指定。
>   "publicConfig": {
>        "registry": "http://registry.npmjs.org/"
>      } 
> 4. 全局修改  npm config set registry= http://registry.npmjs.org/