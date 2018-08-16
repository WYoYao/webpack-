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
> 这两种方式可以相互搭配，例如执行Webpack时通过命令webpack --config webpack-dev.config 指定配置文件，再去webpack-dev.config.js文件里描述部分配置。

> Npm Script: Npm 是安装在Node.js 时，附带的包管理器，NpmScript 是Npm 的一个内置功能，允许在package.json 文件里使用scripts 字段定义任务。

```JSON
{
    "scripts":{
        "dev":"webpack-dev-server --config webpack-dev.config.js",
        "build":"webpack --config webpack.config.js"
    }
}
```

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
> 同时 babel-plugin-transform-runtime 需要依赖 babel-runtime ,所以需要下载对应的npm。

> presets presets属性告诉Babel要转换的源码使用了哪些新的语法特性，一个Presets对一组新语法的特性提供了支持，多个Presets可以叠加。Presets其实是一组Plugins的集合，每个Plugin完成一个新语法的转换工作。

>- ES2015 : 2015年加入的新特性。
>- ES2016 : 2016年加入的新特性。
>- ES2017 : 2017年加入的新特性。
>- Env 包含当前所有ECMAScript标准里的最新特性。

> 已经被社区提出来,但是还未被ECMAScript标准的特性。
>- stageO 只是一个美好激进的想法，一些Babel插件实现了对这些特性的支持，但是不确定是否会被定为标准。
>- stage1 值得被纳入标准的特性。
>- stage2 该特性规范己经被起草，将会被纳入标准里。
>- stage3 该特性规范已经定稿，各大浏览器厂商和Node.js社区己开始着手实现。
>- stage4 在接下来的一年里将会加入标准里。

> 在webpack 中调用Babel 需要使用 Babel-loader.

```javascript
module.exports={
     module:{
         rules:[
             {
                 test:/\.js$/,
                 use:'babel-loader'
             }
         ]
     },
     devtool:'source-map' 
}
```

> Webpack 介入Babel 的时候需要的模块
```
npm install --save-dev  babel-loader babel-core
// 然后根据我们选择的 presets 来选择对应的 Plugins 或 presets。
npm install --save-dev babel-preset-env
```

#### SCSS 

> 使用scss可以提升编码的效率，但是必须将scss源代码编译成可以直接在浏览器环境下运行的css代码。

```
module.exports={
    module:{
        rules:[
            {
                test:/\.scss$/,
                use:['style-loader','css-loader','sass-loader']
            }
        ]
    }
}
```

> 上面配置中需要的使用的 npm
```
npm install --save-dev  style-loader css-loader sass-loader
// 因为 sass-loader 本身依赖 node-sass 完成转换所以还要下载 noed-sass
npm install --save-dev node-sass
```

#### PostCSS

> PostCSS的用处非常多，包括向css自动加前缀、使用下一代css语法等。

> PostCSS和css的关系就像Babel和JavaScript的关系，它们解除了语法上的禁锢，通过插件机制来扩展语言本身，用工程化手段为语言带来了更多的可能性。

> 虽然使用了PostCSS 后CSS文件的后缀还是.css,但是还是应该先使用postCSS 先进行转换。代码如下

```
module.exports={
    module:{
        rules:[
            {
                test:/\.css/,
                use:['style-loader','css-loader','postcss-loader']
            }
        ]
    }
}
```

> 接入 postCSS 为项目带来新的依赖需要安装
```
npm install --save-dev postcss-loader style-loader css-loader
// 根据我们使用的postcss-loader 我们需要安装postcss-cssnext
npm install --save-dev postcss-cssnext
```

#### React
> 在使用了React的项目里，JSX和Class语法并不是必需的，但使用新语法写出的代码看上去更优雅(官方推荐)。
```
class Button extends Component{
    render(){
        return <h1>Hello World</h1>
    }
}
```
> jsx JSX语法是无法在任何现有的JavaScript引擎中运行的, 需要转换成为可以运行的 javascript。
> 我们直接通过 配置Babel 来接入 React.
> 修改 .babelrc 文件

```
{
    "presets": [
        "env","react"
    ],
    "plugins": [
        "transform-runtime"
    ]
}
```

> 我们要的安装 React 和 Babel 里面用到的presets

```
npm install --save-dev react react-dom 
npm install --save-dev babel-preset-react
```

#### Vue

> Vue的项目能用可直接运行在浏览器环境里的代码编写，但为了方便编码，大多数项目都会采用Vue官方的单文件组件。
> 在webpack 中接入我们的Vue 修改如下：

```
module.exports={
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:['vue-loader'],
            }
        ]
    }
}
```

> 下载需要的库

```
npm install --save vue
npm install --save-dev vue-loader css-loader vue-template-compiler
```

> 对应的依赖如下：
>- vue-loader : 解析和转换 .vue 文件，提取出其中的 js,css,template 代码，分别将他们交给对应Loader 去处理。
>- css-loader : 加载有vue-loader 提取出的CSS 代码。
>- vue-template-compilter:将vue-loader 提取出来的HTML 模板编译成对应的可执行JavaScript 代码，这和React 中的JSX 语法被编译成 JavaScript代码类似，预先编译好的HTML 模板相对于在浏览器中编译的HTML 模板，性能更好。

#### 检查代码 ESlint

> 在日益庞大，复杂的前端项目中，经常出现多人协同开发，这个时候代码的可读性显得极其重要。
> 检查代码中主要的重点：
>- 代码风格：统一代码风格，例如如何缩进，如果写注释等（保障代码的可读性）。
>- 潜在问题：分析代码在运行过程中可能出现的潜在Bug.

> **最常用的检查工具的是ESlint**,不仅内置大量检查规则，还可以通过插件的机制进行扩展。

> **ESlint使用**

> 可以通过 eslint-loader 可以方便的将ESLint 整合到 Webpack 中，使用方法如下：

```
module.exports={
    module:{
        rules:[
            {
                test:/\.js$/,
                // 不用检查 node_modules 目录下的代码
                include:/node_modules/,
                loader:'eslint-loader',
                // 将 eslint-loader 的执行顺序放在最前面，防止其他loader将处理后的代码交给eslint-loader 去检查
                enforce:'pre'
            }
        ]
    }
}
```

> 接入eslint-loader 后，就能在控制台中看到ESLint输出的错误日志了。


#### 加载图片

> 在网页中需要依赖图片资源，例如png,jpg,gif。
> 接下来讨论如何使用Webpack加载图片资源。

> **file-loader**可以将 JavaScript 和 CSS 中导入图片的语句替换成正确的地址，同时将文件输出到对应的位置。

> 例如，CSS源码是这样

```
#app{
    background-image:url(./imgs/a.png);
}
```

> 被file-loader 转换后输出的CSS会变成下面这样：

```
#app{
    background-image:url(556el251a78c5afda9ee7dd06ad109b.png);
}
```

> 并且在输出目录dist 中多出 ./imgs/a.png 对应的图片文件 556el251a78c5afda9ee7dd06ad109b.png,输出的文件名是根据文件的内容计算出来的hash值。

> 在webpack 中加入file-loader 非常简单，相关配置如下：

```
module.exports={
    module:{
        rules:[
            {
                test:/(\.png$|\.svg$)/,
                use:['file-loader']
            }
        ]
    }
}
```

> **url-loader**
> url-loader 可以将文件内容经过base64编码后注入Javascript 或者CSS 中。

```
#app{
    background-image:url(./imgs/a.png);
}
```

> 被url-loader转换后输出的CSS会变成下面这样：

```
#app{
    background-image:url(data:image/png;base64.aweagwhaefbzfgnrh...);
}
```

> 但是如果图片的体积过大的时候会大致Javascript，CSS 文件过大而带来的网页加载缓慢问题。
> 一般利用url-loader将网页需要用到的小图片资源注入代码中，以减少加载次数。
> url-loader考虑到上面的问题，提供了一个方便的选择：limit,该选项用于控制在的文件的大小下一limit时才使用url-loader,否则使用fallback选项中配置的loader。

```
module.exports={
    module:{
        rules:[
            {
                test:/\.png$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            //  30kb 以下的文件采用url-loader
                            limit:1024*30,
                            // 否则采用file-loader,默认值是file-loader
                            fallback:'file-loader',
                        }
                    }
                ]
            }
        ]
    }
}
```

#### 加载Source Map

> 我们在开发过程中，需要调试代码来定位问题，但是我们在调试的过程中我们会发现，所生成的代码可读性非常差,这为代码调试带来不便。

> Webpack 支持转换生成的代码输出对应的Source Map文件，以方便在浏览器中的通过源码调试。
> 控制Source Map 输出的Webpack 配置项是devtool。

> devtool 的取值可以由source-map,eval,inline,hidden,cheap,module 这6个关键字随意组合而成，这6个关键字每一个都代表一种特性:含义分别如下。

>- eval:用eval语句包裹需要安装的模块。
>- source-map:生成独立的Source Map文件。
>- hidden:不在JavasScipt 文件中指出SourceMap 文件所在，这样浏览器就不会自动加载SourceMap。
>- inline:将生成的Source Map 转换成base64格式内嵌在JavaScript文件中。
>- cheap:在生成的Source Map 中不会包含的列信息，这样计算量更小，输出的SourceMap 文件更小，同时Loader输出的Source Map 不会被采用。
>- module:来自Loader 的Source Map 被简单处理成每行一个模块。