export default {
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest"
    },
    testEnvironment: "node",
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    moduleDirectories: ["node_modules", "src"]
  };
  