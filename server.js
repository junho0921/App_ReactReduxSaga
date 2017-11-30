/**
 * Created by jiajunhe on 2016/12/6.
 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// 引入现有 webpack 设置
const config = require('./webpack.config');
const port = 3000;

// 在 webpack config 中将需要的模块的 entry 中增加下面两条设置
config.entry.testModule.unshift(
  `webpack-dev-server/client?http://localhost:${port}`,
  // `webpack-dev-server/client?http://0.0.0.0:${port}`,

  'webpack/hot/only-dev-server'// 采用的 only-dev-server 而不是 dev-server 是为了在语法出错的时候不会重载浏览器页面
);

// publicPath 必须设置，这是在现有 HTML 页面中嵌入 script的 路径
// 如果不设置，热加载生成的一些内部脚本将会无处依存
config.output.publicPath = `http://localhost:${port}/assets/`;

// 在 webpack 配置中增加热加载插件
// 这个必须有，否则即使下面的 hot: true 设置了也没用
// 但是也要注意一下源配置文件中是否已经设置过了，不要重复设置
// 我的建议是原配置中不要牵扯任何跟热加载有关的东西，保持纯净
config.plugins.push(new webpack.HotModuleReplacementPlugin());


const compiler = webpack(config);

// 下面是具体的服务设置
const server   = new WebpackDevServer(compiler, {
  // 这个显然必须有
  // 需要注意的是这儿的这个属性和命令行中的同名属性有所区别
  // 这儿设置了并不会自动增加 HotModuleReplacementPlugin
  // 所以上面才需要设置一个
  hot: true,

  // 注意：这个属性也必须设置，且与上面的 publicPath 中的相应位置一致
  // 否则也不起作用
  publicPath: config.output.publicPath,

  stats: { colors: true }
  //historyApiFallback: true
});

server.listen(port, 'localhost', function (err, result) {
  if (err) console.log(err);
  console.log('开启服务器 localhost:3000');
});