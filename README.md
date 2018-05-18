# Couch Hopper

## Overview
Interactively create and restore backups of couch databases from the command line

```
npm i -g couch-hopper
```

## Examples
```
$ couch-hopper backup

$ couch-hopper restore
```

![example](https://media.giphy.com/media/3ohjUYJU8w4BUim7hm/giphy.gif)

You can also do everything from a single command, so you can automate backup/restore procedures.

### Backup
```
$ couch-hopper backup|b [options]

  Options:

    -r, --url <remote>         Remote database you want to backup
    -u, --username <username>  Username for remote database
    -p, --password <password>  Password for remote database
    -s, --https                Use https
    -d, --dbs [databases]      Databases to backup (comma-delimited list; leave blank to backup all)
    -l, --backupDir <local>    Location to save backups
    -h, --help                 output usage information
```

### Restore
```
$ couch-hopper restore|r [options]

Options:

  -r, --url <remote>         Remote database you want to restore to
  -u, --username <username>  Username for remote database
  -p, --password <password>  Password for remote database
  -s, --https                Use https
  -d, --dbs [databases]      Backup json files to restore (comma-delimited list, exclude .json file extension; leave blank to restore all)
  -l, --backupDir <local>    Location of backups
  -h, --help                 output usage information

```

## License

The MIT License (MIT)

Copyright (c) 2018 Management Systems International.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
