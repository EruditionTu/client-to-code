# @client-to-code/react-client

client-to-code在react开发环境下点击react组件跳转对应的文件。这个功能需要react-client的包裹，对组件绑定一些事件。

## 使用

``` 
npm i @client-to-code/react-client

import {Inspector} from '@client-to-code/react-client'
export default ()=>{
    return (
        <Inspector>
        <App/>
        </Inspector>
    )
}
```