// eslint-disable-next-line @typescript-eslint/no-var-requires
const child_process = require("child_process");

const commitHash = child_process
  .execSync("git show -s --format=%h")
  // .execSync('git show -s --format=%H')H为 hash 值
  .toString()
  .trim();
const branchName = child_process
  .execSync("git rev-parse --abbrev-ref HEAD")
  .toString()
  .trim();
const commitDateObj = new Date(
  child_process.execSync("git show -s --format=%cd").toString()
);
const commitDate = `${
  commitDateObj.getFullYear() +
  "-" +
  (commitDateObj.getMonth() + 1) +
  "-" +
  commitDateObj.getDate() +
  "  " +
  commitDateObj.getHours() +
  ":" +
  commitDateObj.getMinutes()
}`;
const nowDate = new Date();
const buildDate = `${
  nowDate.getFullYear() +
  "-" +
  (nowDate.getMonth() + 1) +
  "-" +
  nowDate.getDate() +
  "  " +
  nowDate.getHours() +
  ":" +
  nowDate.getMinutes()
}`;

// webpack插件
class VersionWebpackPlugin {
  constructor(options) {
    // options 为调用时传的参数
  }
  /**
   * compiler: webpack 的实例 所有的内容
   * compilation: 本次打包的内容
   * */
  apply(compiler) {
    // 异步方法，生成打包目录时：生成文件
    compiler.hooks.emit.tapAsync("VersionWebpackPlugin", (compilation, cb) => {
      const versionInfo = `版本信息：${commitHash}, ${branchName}, ${commitDate}, ${buildDate}`;
      console.log(JSON.stringify(versionInfo));
      // compilation.assets["version.txt"] = {
      //   source: () => versionInfo,
      //   size: () => versionInfo.length,
      // };
      cb();
    });
  }
}

module.exports = VersionWebpackPlugin;
