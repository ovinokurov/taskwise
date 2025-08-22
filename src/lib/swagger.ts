import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // This is the folder where your API routes are located
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'TaskWise API',
        version: '1.0',
      },
      security: [],
    },
  });
  return spec;
};
