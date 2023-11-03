#!/bin/sh
cd /Users/koukeshitone/Desktop/技术相关/2023/node/blog-system/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log