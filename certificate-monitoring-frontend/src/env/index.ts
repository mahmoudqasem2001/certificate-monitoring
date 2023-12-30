const envConfig = {
  API_URL: () => process.env.REACT_APP_API_URL!,
}

export const getEnv = <T extends keyof typeof envConfig>(key: T) => {
  return envConfig[key]() as ReturnType<(typeof envConfig)[T]>
}
