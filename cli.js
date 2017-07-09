#!/usr/bin/env node

const colors = require('colors/safe');
const parseArgs = require('minimist');
const tarRename = require('./index');

function help() {
  console.info(`Usage: tar-rename old-prefix new-prefix --source file --output file [--help|--replace]

Rename directory inside tar/tgz/tar.gz file from old-prefix to new-prefix.

Options:
  --help, -h     Show help
  --source, -s   Source file
  --output, -o   Output file
  --replace, -r  Replace output file if exists

Hint:
  1. You can use empty string as the second parameter.
     Example: tar-rename package "" -s source.tgz -o output.tgz
  2. Slashes does metter - to be sure that only directories are affected use them on the end.
`);
}

function error(err) {
  console.error(colors.red(`${err.message}\n`));
  help();
  process.exit(err.code | 100);
}

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    help: 'h',
    source: 's',
    output: 'o',
    replace: 'r',
  },
});

if (argv.help || argv._.length === 0) {
  help();
  process.exit(0);
}

if (argv._.length == 1) {
  return error('Missing the argument new-prefix.', 1);
}

if (argv._.length > 2) {
  return error('Too many arguments.', 2);
}

if (!argv.source) {
  return error('The option source is required.', 3);
}

if (!argv.output) {
  return error('The option output is required.', 4);
}

const oldPrefix = argv._[0];
const newPrefix = argv._[1];
const sourceFile = argv.source;
const outputFile = argv.output;
const replace = argv.replace;

tarRename({
    oldPrefix,
    newPrefix,
    sourceFile,
    outputFile,
    replace
  })
  .then(() => process.exit(0))
  .catch((err) => error(err))
