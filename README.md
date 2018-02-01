# Cloudant Harvester
### Because IBM went all Charlie Murphy on us.

## Overview
Node script that backs up and restores couch db instances, executed from CLI.

## Arguments
- **f** : for *function*, valid values are `backup` or `restore`
- **d** : for *domain*, url pointing to source or target couch database
- **u** : for *username*
- **p** : for *password*
- **b** : for *backup directory*, local relative path to where backups are/should go
- **i** : for *protocol*, include flag if you **don't** want to use https

## Examples
Perform a backup of all the databases at cpg.cloudant.com, put them in a folder called `backups`:
```
node script.js -f backup -d cpg.cloudant.com -u cpg -p [MY_PASSWORD] -b backups
```
Restore the database snapshots in the `backups` folder to cpg.cloudant.com, over http:
```
node script.js -f restore -d cpg.cloudant.com -u cpg -p [MY_PASSWORD] -b backups -i
```
