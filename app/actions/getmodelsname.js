export async function getModelsName(brand){
    try {
        const response = await fetch(
          `/api/AddedProducts/modelname`
        );
        if (response.ok) {
          const data = await response.json();
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
          console.error("Failed to fetch model names");
        }
      } catch (error) {
        console.error("Error fetching model names:", error);
      } 
}

