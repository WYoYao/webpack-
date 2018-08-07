### Resolve

Webpack 在启动后会从配置入口模块出发找出所有依赖的模块，Resolve 配置webpack 如果寻找模块对应的文件。

> resolve.alias 配置通过别名来将原导入路径映射成一个新的导入路径，例如使用以下配置

```javascript
{
    reoslve:{
        alias:{
            components:"./src/component"
        }
    }
}
```

> 当通过 import Button form 'components/button' 导入时，实际被alias 等价替换成为 import Button from './src/component/Button'

> **extensions**
> 在导入语句没带文件后缀时，webpack 会自动带上后缀去尝试访问文件是否存在。resolve.exetensions 用于配置在尝试过程中用到的后缀列表， 默认是：

```javascript
 extensions:['.js','.json']
```

> 也就是的当文件中出现 require('./data') 的时候，webpack 会自动尝试查询 data.js 如果没有再查找 data.json 如果还没有找到的就会进行报错。

> **modules**
> resolve.modules 配置Webpack去哪些模块寻找第三方模块，默认只会去node_modules目录下寻找，有时我们项目里会有一些模块被其他模块大量依赖和导入，由于其他模块的位置不定，针对不同的文件都要计算被导入的模块文件的相对路径， 这个路径有时候会很长， import '../../../../ccomponent/button',这时可以利用modules 配置项优化，假如哪些被大量导入的模块的都在 ./src/component 目录下，则将 modules 配置成 ['./src/components','node_modules'] 后就可以简单的通过 import 'button' 导入。

### Plugin

> Plugin 用于扩展Webpack 的功能，各种各样的Plugin 计划可以让Webpack做任何与构建相关的事情。
> Plugin 的配置很简单，plugins 配置项接受一个数组，数组里每一项都是一个要使用的Plugin 的实力， Plugin 需要的参数通过构造函数传入。

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports={
    plugins:[
        new MiniCssExtractPlugin({
            filename: "index.css",
            chunkFilename: "[id].css"
        })
    ]
}
```

> Plugin 的难点在于掌握Plugin 本身提供的配置项，而不是如何在Webpack 中接入Plugin。

### DevServer

> DevServer 用来提高开发效率，它提供的一些配置项可以用语言改变DevSrever 的默认行为。 要配置DevServer 可以通过配置的文件中的devServer传入的参数，还可以通过命令行传入的。但是只有通过DevServer 启动webpack 的时候，配置的文件的里面的devServer 才会生效因为这些参数对应的功能都是DevServer提供的。Webpack 本身并不识别devServer 的配置项。

> **hot**

>  hot 模块热替换的功能。 DevServer 的默认行为是发现源代码被更新后通过自动刷新整个页面来做到实时预览， 开启模块热替换功能后，将在不率先那个整个页面的情况下通过新模块替换老模块来做到实时预览，

> **host**

> devServer.host 配置御用配置DevServer 服务监听的地址，只能通过命令行参数传入。例如，想让局域网中的其他设备访问自己的本地的服务，可以启动DevServer 时带上 --host 0.0.0.0 。 host 的默认值的时127.0.0.1 , 即只有本地可以访问DevServer的 HTTP服务。

> **port**
> 设置启动服务的端口号的，默认的时8080 如果被占用的，会递增8081，以此类推。

> **Devtool**
> devtool 配置Webpack 如何生成的Source Map,默认值是 false，即不生成Source Map , 若想为够构建出的代码生成Source Map 以方便调试的，可以进行的如下配置。

```javascript
module.exports={
    devtool:'source-map'
}
```

> Watch 监听模式，它支持监听文件更新，在文件发生变化时重新编译，使用webpack时，监听模式默认是关闭的，若想打开可以进行如下配置

```javascript
module.export={
    watch:ture
}
```

> 在使用DevServer时，监听模式默认是开启的。

>  在实际项目开发过程中，我们可能不自觉的保存文件，比如我。
>  可以通过watchOptions 配置去更灵活的控制监听模式。

```javascript
 module.exports={
      //  只有开启监听模式的时候watchOptions 才有意义
    watch:true,
    watchOptions:{
        // 不监听的文件或文件夹， 支持正则匹配
        // 默认为空
        ignore:/node_modules/,
        //  监听到变化后等300ms再去执行动作， 防止文件更新太快导致重新编译平率太高
        aggregateTimeout:300,
        // 判断文件是否发生变化是通过不停的询问系统制定文件有没有变化实现的
        //  默认每秒询问1000次
        poll:1000
    }
 }
```

> **Externals**

>  如果我们的html 页面上面通过 <script src="path/to/jquery.js"></script> ,这个时候全局变量jQuery就会被注入网页的Javascript 运行环境里。
>  如果现在使用模块化的代码里导入使用jQuery, 则可能需要这样。
>  import $ from 'jqeury';

> 构建后我们会发现输出Chunk里包含的jQuery 库的内容，可能出现两次jQuery,浪费加载流量，最好是Chunk里不会包含jQuery 库的内容。

> Externals 的配置项就是用于解决这个问题的。

```
module.exports={
    externals:{
        jquery:'jQuery'
    }
}
```

### 实践

#### Babel

> Babel 是一个Javascript 编译器，能够就将ES6以上代码转换成为ES5 代码。让我们使用最新的语言特性而不用担心兼容性问题，并且可以通过插件机制根据需求灵活的扩展。
> 在Babel 执行的编译的过程中，会从项目根目录下的 .babelrc 文件中读取配置，.babelrc是一个JSON格式的文件。

```JSON
{
    "presets":[
        "env"
    ],
    "plugins":[
        "transform-runtime"
    ]
}
```

> plugins 告诉babel 要使用哪些插件，这些插件可以控制如何转换代码。
> 上面配置中的 transform-runtime 对应的插件全名叫做 babel-plugin-transform-runtime,即在前面加上babel-plugin-。 要让Babel 正常运行， 我们必须先安装这个插件。
> 同时 babel-plugin-transform-runtime 需要依赖 babel-runtime ,所以