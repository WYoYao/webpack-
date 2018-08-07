# Webpack

## 核心概念

>- Entry：入口，Webpack执行构建的第一步将从Entry开始，可抽象成输入。
>- Module：模块，在Webpack里一切皆模块，一个模块对应一个文件。Webpack会从配置的Entry开始递归找出所有依赖的模块。
>- Chunk：代码块，一个Chunk由多个模块组合而成，用于代码合并与分割。
>- Loader:模块转换器，用于将模块的原内容按照需求转换成新内容。
>- Plugin:扩展插件，在Webpack构建流程中的特定时机注入扩展逻辑，来改变构建结果或做我们想要的事情。
>- Output:输出结果，在Webpack经过一系列处理并得出最终想要的代码后输出结果。

> Webpack在启动后会从Entry里配置的Module开始，递归解析Entry依赖的所有Module。每找到一个Module，就会根据配置的Loader去找出对应的转换规则，对Module进行转换后，再解析出当前Module依赖的Module这些模块会以Entry为单位进行分组，一个Entry及其所有依赖的Module被分到一个组也就是一个Chunk。最后，Webpack会将所有Chunk转换成文件输出。在整个流程中，Webpack会在恰当的时机执行Plugin里定义的逻辑。

## 配置

> 配置Webpack的方式有如下两种：
> 1.通过一个JavaScript文件描述配置，例如使用webpack.config.js文件里的配置。
> 2.执行Webpack可执行文件时通过命令行参数传入，例如webpack --devtool source-map。
> 这两种方式可以相互搭配，例如执行Webpack时通过命令webpack --config webpack-dev.config扣指定配置文件，再去webpack-dev.config.js文件里描述部分配置。

> 按照配置所影响的功能来划分，可分为如下内容。
>- Entry:配置模块的入口。
>- Output:配置如何输出最终想要的代码。
>- Module:配置处理模块的规则。
>- Resolve:配置寻找模块的规则。
>- Plugins:配置扩展插件。
>- DevServer:配置DevServer。

### Entry

> entry:是配置模块的入口，可抽象成输入，Webpack执行构建的第一步将从入口开始，搜寻及递归解析出所有入口依赖的模块。
> context:Webpack在寻找相对路径的文件时会以context为根目录，context默认为执行启动Webpack时所在的当前工作目录。

```javascript
// context 必须是一个绝对路径的字符串。除此之外还可以通过启动webpack 时带上参数 webpack --context 来配置context
module.exports={
    context:path.resolve(__dirname,'app')
}
```

> **Entry的类型**

类型|例子|含义
--|--|--
String|"./src/app"|入口模块的文件路径，可以是相对路径
Array|["./src/app","./src/app1"]|入口模块的文件路径，可以是相对路径
Object|{a:"./src/app",b:"./src/app1"}|配置多个入口，每个入口生成一个Chunk

### Chunk

> Webpack 会为每一个Chunk取一个名字，Chunk 的名字跟 Entry 的配置相关。
>- 如果Entry 的配置是 Strign 或 Array  则只会有一个 Chunk。 
>- 如果Entry 的配置是 Object ,则会有多个Chunk 同时Chunk的名称是object键值对中键的名称。

### Output

> output配置如何输出最终想要的代码。output是一个object，里面包含一系列配置项。

> **filename**: 配置文件输出的名称，为String 类型。
>- 如果只有一个Chunk要输出的时候则可以写一个静态不变。
>- 如果有多个Chunk需要输出的时候的则需要借助模版。(Entry的类型的时候说过 Entry 的类型为Object 的时候,每个Chunk 的名字就是Object对应的每个键值)我们需要根据Chunk的名称来区分对应文件名。

```javascript
module.exports={
    output:{
        filename:"[name].js"
    }
}
```

> 代码里的［name］代表用内置的name变量去替换［name］,这时我们可以将它看作一个字符串模块函数，每个要输出的Chunk都会通过这个函数去拼接出输出的文件名称。
> 内置变量除了包括name，还有如下变量。

变量名|含义
--|--
id|Chunk的唯一标识，从0开始
name|Chunk的名称
hash|Chunk的唯一标识的Hash值,长度可指定 [hash:8],默认20位。
chunkhash|Chunk内容的Hash值 [chunkhash:8],默认20位。

> **path**
> output.path配置输出文件存放在本地的目录，必须是string类型的绝对路径。

```javascript
module.exports={
    output:{
        path:path.resolve(__dirname,"./dist")
    }
}
```

### Module

> module配置处理模块的规则。

> **配置Loader**

> rules配置模块的读取和解析规则，通常用来配置Loader。其类型是一个数组，数组里的每一项都描述了如何处理部分文件。

> 条件匹配
> 1.test    测试,可以传入正则或数组。
> 2.include 包括,可以传入正则或数组。
> 3.exclude 排除,可以传入正则或数组。 
> 当传入数组的时候之间的关系都是或只需要满足其中一项就可以出发对应的操作。

```javascript
{
    test:[/\.jsx$/,/\.tsx$/],
    include:[
        path.resolve(__dirname,'src'),
        path.resolve(__dirname,'tests'), 
    ],
    exclude:[
        path.resolve(__dirname,'node_modules'),
        path.resolve(__dirname,'bower_modules'),
    ]
}
```

> 应用规则
> 对选中的文件通过use配置项来应用Loader，可以只应用一个Loader或者按照从后往前的顺序应用一组Loader，同时可以分别向Loader传入参数。

```javascript
module.exports={
    module:{
        noParse:/jquery/
        rules:[
            {
                //  匹配 以 .js 结尾的文件
                test:/\.js$/,
                //? cacheDirectory表示传给babel-loader的参数，用于缓存babel的编译结果，加快重新编译的速度
                use:["babel-loader?cacheDirectory"],
                // 只命中src目录里的JavaScript文件，加快Webpack的搜索速度
                include:path.resolve(__dirname,'./src')
            },
            {   
                // 匹配 scss 文件
                test:/\.scss$/,
                //  从右到左执行 先执行sass-loader 然后传递给 css-loader 再传递给style-loader
                use:['style-loader','css-loader','sass-loader']
                //  排除node_modules目录下的文件
                exclude:path.resolve(__dirname,'node_modules')
            }
        ]
    }
}
```

> noParse配置项可以让Webpack忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。原因是一些库如jQuery、ChartJS庞大又没有采用模块化标准，让Webpack去解析这些文件既耗时又没有意义。

> ==注意，被忽略的文件里不应该包含import、require、define等模块化语句，不然会导致在构建出的代码中包含无法在浏览器环境下执行的模块化语句。 ==

###### 47
###### 57