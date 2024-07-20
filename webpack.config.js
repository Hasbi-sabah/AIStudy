module.exports = {
  module: {
    rules: [
      {
        test: /\.node$/, // Adjust the regex to match the file type
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
    ],
  },
};
