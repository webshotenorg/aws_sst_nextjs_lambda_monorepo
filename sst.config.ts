/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "nextjsapp",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const storage = new sst.aws.Bucket("MyBucket");
    const api = new sst.aws.Function("MyApi", {
      url: true,
      link: [storage],
      handler: "packages/functions/src/api.handler",
    });
    new sst.aws.Nextjs("MyWeb", {
      path: "packages/web",
      link: [storage, api],
    });

    return {
      MyBucket: storage,
      MyApi: api,
    };
  },
});
