# Tar rename

```
Usage: tar-rename old-prefix new-prefix --source file --output file [--help|--replace]

Rename directories (and files) inside tar/tgz/tar.gz file from old-prefix to new-prefix.

Options:
  --help, -h     Show help
  --source, -s   Source file
  --output, -o   Output file
  --replace, -r  Replace output file if exists

Hint:
  1. You can use empty string as the second parameter.
     Example: tar-rename package "" -s source.tgz -o output.tgz
  2. Slashes does metter - to be sure that only directories are affected use them on the end.
```
