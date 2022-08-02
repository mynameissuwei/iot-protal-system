const { join } = require("path"); // eslint-disable-line
const CompressionPlugin = require("compression-webpack-plugin"); // eslint-disable-line
const resolve = (dir) => join(__dirname, dir);
const isProduction = process.env.NODE_ENV === "production";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { versionInfo } = require("./webpack-plugin/version-webpck-plugin");

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("_com", resolve("src/components"))
      .set("_ass", resolve("src/assets"))
      .set("_img", resolve("src/assets/images"))
      .set("_api", resolve("src/api"));

    // svg
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.include
      .add(resolve("src/assets/images/svg-icon/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "svg-[name]",
      })
      .end();
    // image exclude
    const imagesRule = config.module.rule("images");
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve("src/assets/images/svg-icon/icons"))
      .end();
    config.plugin("define").tap((args) => {
      args[0]["process.env"].VERSION = JSON.stringify(versionInfo);
      return args;
    });
  },

  configureWebpack(config) {
    // config.plugins.push(new VersionWebpackPlugin());
    if (isProduction) {
      // gzip
      config.plugins.push(
        new CompressionPlugin({
          algorithm: "gzip",
          test: /\.(js|css)$/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false, // 不删除源文件
          minRatio: 0.8, // 压缩比
        })
      );
    }
  },

  devServer: {
    // host: "localhost",
    // port: 8000, // 端口号
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    hotOnly: true, // 热更新
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        // secure: false,
      },
    },
  },
};
