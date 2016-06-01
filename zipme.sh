#!/bin/sh
#
# To be used by Jenkins...
#
npm install
gulp compile
zip -r $1 . -x "pushTest.groovy" -x "scss/**" -x ".git/**" -x "node-modules/**" -x "src/**" -x "plugins/**" -x "platforms/**" -x "node_modules/**" -x ".git/**" -x \*.ipa -x \*.xap -x \*.sh -x "**/*.sh" -x "bin/*" -x \*.apk -x "**/.svn**" -x "www/cordovareload" -x cordovareload

