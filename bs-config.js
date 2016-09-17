//config file for lite-server
module.exports = {
  server: {
    logLevel: "silent",
    files: ["./libs/**/*.{html,htm,css,js}","./demo/**/*.{html,htm,css,js}","./dist/**/*.{html,htm,css,js}"],
    index: "./demo/index.html",
    baseDir: "demo",
    "routes": {
      "/libs": "libs",
      "/dist": "dist"
    }
  }
};
