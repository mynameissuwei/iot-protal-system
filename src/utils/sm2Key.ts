// 加密 ： 由于sm2取不同的cipherMode会需要涉及到补位，这里 在加密后，前面加上 04 就表示补位的意思，后台返回的加密值也会是个前面带 04的，记得去掉后再解密
const sm2PublicKey = '044e394f85e0a5f7df9fad4b143fb2dbf2371f900abc4ed1ee15801aad06b5eae581bec1a231d9d44d7d54880699b6b017dee29d42dcaaeb68c1d6c53d3a56be3f'
// 解密
const sm2PrivateKey = '64ce9dd60b6eebdb0b5591f69569a2e93545819b5012d6933fef8503d7a2a9c8'
// sm2 加密配置
const cipherMode = 'C1C3C2'

export {
  cipherMode,
  sm2PublicKey,
  sm2PrivateKey}
