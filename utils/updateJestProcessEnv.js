const updateJestProcessEnv = (jestProcessEnv) => ({
  ...JSON.parse(jestProcessEnv),
  MONGO_URL: "mongodb://localhost:27017/test"
});

export default updateJestProcessEnv;
