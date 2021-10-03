'use strict'

const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const moduleFileExtensions = ['js', 'ts', 'json']

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) => fs.existsSync(resolveFn(`${filePath}.${extension}`)))

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

function getPublicUrlOrPath(isEnvDevelopment, homepage, envPublicUrl) {
  const stubDomain = 'https://create-react-app.dev'

  if (envPublicUrl) {
    envPublicUrl = envPublicUrl.endsWith('/') ? envPublicUrl : envPublicUrl + '/'
    const validPublicUrl = new URL(envPublicUrl, stubDomain)
    return isEnvDevelopment ? (envPublicUrl.startsWith('.') ? '/' : validPublicUrl.pathname) : envPublicUrl
  }

  if (homepage) {
    homepage = homepage.endsWith('/') ? homepage : homepage + '/'
    const validHomepagePathname = new URL(homepage, stubDomain).pathname
    return isEnvDevelopment ? (homepage.startsWith('.') ? '/' : validHomepagePathname) : homepage.startsWith('.') ? homepage : validHomepagePathname
  }

  return '/'
}

const publicUrlOrPath = getPublicUrlOrPath(process.env.NODE_ENV === 'development', require(resolveApp('package.json')).homepage, process.env.PUBLIC_URL)

module.exports = {
  //appPath: resolveApp("../.."),
  appPath: appDirectory,
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTest: resolveApp('test'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  appWebpackCache: resolveApp('node_modules/.cache'),
  appBrowserListRc: resolveApp('.browserslistrc'),
  dotenv: resolveApp('.env'),
  appTsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
  //appswSrc: resolveModule(resolveApp, "src/service-worker"),
  publicUrlOrPath,
}
