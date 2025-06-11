import { VeggieType } from "@/lib/definitions";

export const validateVeggieForm = (formData: VeggieType) => {
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

// Add this helper function
export const flattenErrors = (errors: any): string => {
  if (typeof errors === "string") return errors;
  if (!errors) return "Please fix the errors in the form.";
  let messages: string[] = [];
  for (const key in errors) {
    if (typeof errors[key] === "string") {
      messages.push(errors[key]);
    } else if (typeof errors[key] === "object") {
      for (const subKey in errors[key]) {
        if (typeof errors[key][subKey] === "string") {
          messages.push(errors[key][subKey]);
        } else if (typeof errors[key][subKey] === "object") {
          for (const subSubKey in errors[key][subKey]) {
            if (typeof errors[key][subSubKey] === "string") {
              messages.push(errors[key][subSubKey]);
            }
          }
        }
      }
    }
  }
  return messages.join("\n");
};
