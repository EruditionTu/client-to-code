# client-to-code

一款通用于webpack，vite，rollup等前端打包编译工具的插件，在前端开发阶段可以通过点击前端页面跳转对应的文件，目前已经完成使用react开发时点击跳转文件的vite插件 `@client-to-code/vite-plugin-react`。

## 子包

### @client-to-code/middleware

该软件包是用于client-to-code的一个中间件，作用是正确的解析链接中的query参数。

### @client-to-code/react-client

client-to-code在react开发环境下点击react组件跳转对应的文件。这个功能需要react-client的包裹，对组件绑定一些事件。

### @lient-to-code/vite-plugin-react

当我们使用react开发web app时，使用vite作为构建工具时，通过引入这个插件，可以实现开发环境下点击UI跳转对应文件的效果。


## 优化记录
### react-client 拆分第三方库，包体积优化36KB

>算是自己一个疏忽吧

前：
index.esm.js 46.93KB
index.cjs.js 46.93KB
后：
index.esm.js 10.3KB
index.cjs.js 10.3KB

### react-client 启用cache，时间优化50%
前：4226ms
后：2000ms



## 补充

* 对于一些第一次发npm包的同学，由于这是开源的公共组件，不涉及到公司内部软件包的隐私问题，记得在npm的官网上注册一下自己的账号，注意一个问题就是很多人配置了淘宝的镜像仓库，在npm login的时候可能会报错。

> 解决方法：
>
> 1.项目全局配置.npmrc registry = http://registry.npmjs.org/
> 
> 2.发包时npm publish —registry=http://registry.npmjs.org/
> 
> 3.在当前项目的 package.json 中通过 publishConfig 字段指定。
>
>   "publicConfig": {
>        "registry": "http://registry.npmjs.org/"
>      } 
>
>4. 全局修改  npm config set registry= http://registry.npmjs.org/

* `react-dev-utils`react开发环境的工具库

> react-dev-utils是专门为CRA服务的工具库。像client-to-code这个插件的功能是点击UI跳转编辑器，就需要这个工具库的一些功能，react-dev-utils/errorOverlayMiddleware中就封装了一个express中间件，作用是 判断以launchEditorEndpoint开头的url就调用launchEditor中封装的方法，这个方法中将各个平台的各个编辑器做了适配