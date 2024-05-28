export async function getModelsName(brand){
    try {
        const response = await fetch(
          `/api/AddedProducts/modelname`
        );
        const data = await response.json();
        if (data.output !== null) {
          const models = data.output.filter(obj => obj.brandname === brand).reduce( (models, obj) => {
            models.push(obj.modelname);
            return models;
          },[]);

          const brands = data.output.reduce((brands ,obj) => {
            brands.push(obj.brandname);
            return brands;
          },[]);

          console.log(models);

          const uniquemodels = [...new Set(models)];
          const uniquebrands = [...new Set(brands)];

          const result= {
            uniquemodels,
            uniquebrands
          }

          return result;

          
        } else {
          console.error("output is null");
          
          const result={
            uniquemodels : null,
            uniquebrands: null
          }

          return result;
        }
      } catch (error) {
        console.error("Error fetching model names:", error);
      } 
}

