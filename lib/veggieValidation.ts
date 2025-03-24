import { VeggieForm } from "@/lib/definitions";

export const validateVeggieForm = (formData: VeggieForm) => {
  const { name, description, type, image, stages } = formData;
  let valid = true;
  let newErrors: any = {};

  if (!name) {
    newErrors.name = "Name is required.";
    valid = false;
  }
  if (!description) {
    newErrors.description = "Description is required.";
    valid = false;
  }
  if (!type) {
    newErrors.type = "Type is required.";
    valid = false;
  }
  if (!image) {
    newErrors.image = "Image is required.";
    valid = false;
  }
  if (stages.length < 1) {
    newErrors.stages = "Please add at least 3 stages.";
    valid = false;
  }
  stages.forEach((stage, index) => {
    if (!stage.title) {
      newErrors.stages = newErrors.stages || {};
      newErrors.stages[index] = newErrors.stages[index] || {};
      newErrors.stages[index].title = "Title is required.";
      valid = false;
    }
    if (!stage.description) {
      newErrors.stages = newErrors.stages || {};
      newErrors.stages[index] = newErrors.stages[index] || {};
      newErrors.stages[index].description = "Description is required.";
      valid = false;
    }
    if (!stage.imageUrl) {
      newErrors.stages = newErrors.stages || {};
      newErrors.stages[index] = newErrors.stages[index] || {};
      newErrors.stages[index].imageUrl = "Image is required.";
      valid = false;
    }
  });

  return { valid, newErrors };
};
