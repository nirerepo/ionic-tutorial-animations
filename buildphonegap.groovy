def slurper = new groovy.json.JsonSlurper()
def baseURL = 'https://build.phonegap.com'
def TOKEN = 'zysLTJeEsj2oWg3QpinK'
def status = [android:'pending', ios:'pending']
println args
def extensions(platform) {
    [android:'apk', ios:'ipa', winphone:'xap'].get(platform)
}

def downloads = []
def APPID = args[0].toInteger()

while ('pending' in [status.android, status.ios]) {
  println "Asking for status..."
  sleep(10000)
  url = new URL("${baseURL}/api/v1/apps/?auth_token=${TOKEN}")
  data = slurper.parseText(url.text)
  app = data.apps.find { it.id == APPID }
  if (!app) {
    println "Application ${APPID} not found!!!"
    System.exit(1)
  }
  status = app.status
  println "Status: ${status}"
  status.each { platform, st ->
          if (st == 'complete' && !(platform in downloads)) {
              downloads << platform
              downloadPlatform(baseURL, TOKEN, platform)
          }
  }
}

def downloadPlatform(baseURL, TOKEN, platform) {
    def slurper = new groovy.json.JsonSlurper()
    def androidURL = "${baseURL}${app.download[platform]}?auth_token=${TOKEN}"
    def androidFileURL = slurper.parseText(new URL(androidURL).text).location
    println "Downloading ${extensions(platform)} binary from (${androidFileURL})"

    def file = new File("nire.${extensions(platform)}").newOutputStream()  
    file << new URL(androidFileURL).openStream()  
    file.close()
}