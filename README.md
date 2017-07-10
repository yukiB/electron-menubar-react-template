# electron-menubar-react-template

Electron's menubar sample using react through gulp.

## Setup

Install packages,

```
npm install
```

then compile jsx and run Electron project

```
gulp
```

## App distribution

Install electron-packager,

```
npm i electron-packager -g
```

then package app for OSX

```
electron-packager . MenubarTemplate --platform=darwin --arch=x64 --version=0.31.0 
```