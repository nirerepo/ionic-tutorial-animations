#!/bin/sh
#
# To be used by Jenkins...
#
zip -r $1 . -x "plugins/**" -x "platforms/**" -x "node_modules/**" -x ".git/**" -x \*.ipa -x \*.xap -x \*.sh -x "**/*.sh" -x "bin/*" -x \*.apk -x "**/.svn**" -x "www/cordovareload" -x cordovareload

