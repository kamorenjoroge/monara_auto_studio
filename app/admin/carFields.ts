import type { Car, CarCondition, CarStatus } from "@/lib/types";
import type { FieldConfig, FormValues } from "./EntityForm";

// THE LIST OF FIELDS for the car form.
// To add a field to the car form, you add one line here. Nothing else changes.
export function getCarFields(isAdmin: boolean): FieldConfig[] {
  const thisYear = new Date().getFullYear();

  const fields: FieldConfig[] = [
    { name: "title", label: "Title", type: "text", required: true, placeholder: "e.g. Toyota Land Cruiser V8", wide: true },
    { name: "make", label: "Make", type: "text", required: true, placeholder: "e.g. Toyota" },
    { name: "model", label: "Model", type: "text", required: true, placeholder: "e.g. Land Cruiser V8" },
    { name: "year", label: "Year", type: "number", required: true, min: 1980, max: thisYear + 1 },
    { name: "price", label: "Price (KES)", type: "number", required: true, min: 1, placeholder: "e.g. 5800000" },
    { name: "mileage", label: "Mileage (km)", type: "number", required: true, min: 0, placeholder: "e.g. 24000" },
    { name: "fuel", label: "Fuel", type: "select", options: ["Petrol", "Diesel", "Hybrid", "Electric"] },
    { name: "transmission", label: "Transmission", type: "select", options: ["Automatic", "Manual"] },
    {
      name: "bodyType",
      label: "Body type",
      type: "select",
      options: ["SUV", "Sedan", "Hatchback", "Coupe", "Pickup", "Van", "Wagon", "Convertible"],
    },
    { name: "engine", label: "Engine", type: "text", required: true, placeholder: "e.g. 2.4L Turbo Diesel" },
    { name: "drive", label: "Drive", type: "select", options: ["FWD", "RWD", "AWD", "4WD"] },
    { name: "color", label: "Color", type: "text", required: true, placeholder: "e.g. Pearl White" },
    { name: "condition", label: "Condition", type: "select", options: ["Local", "Imported", "Foreign Used"] },
    { name: "status", label: "Availability", type: "select", options: ["Available", "Reserved", "Sold", "Incoming"] },
    {
      name: "images",
      label: "Photos",
      type: "images",
      required: true,
      help: "Paste a link to a photo and press Add. The first photo is the cover. (Real uploads come with Cloudinary later.)",
    },
    {
      name: "features",
      label: "Features",
      type: "list",
      placeholder: "e.g. Leather seats (press Enter to add)",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder: "Describe the car: condition, history, what is included...",
    },
  ];

  // Only the admin can choose which cars are featured on the Home page
  if (isAdmin) {
    fields.push({
      name: "featured",
      label: "Show on the Home page (featured)",
      type: "checkbox",
    });
  }

  return fields;
}

// What the form looks like before anything is typed (for "Add car")
export function getEmptyCarValues(): FormValues {
  return {
    title: "",
    make: "",
    model: "",
    year: String(new Date().getFullYear()),
    price: "",
    mileage: "",
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    engine: "",
    drive: "FWD",
    color: "",
    condition: "Imported",
    status: "Available",
    images: [],
    features: [],
    description: "",
    featured: false,
  };
}

// A saved car → the values to put in the form (for "Edit car")
export function carToFormValues(car: Car): FormValues {
  return {
    title: car.title,
    make: car.make,
    model: car.model,
    year: String(car.year),
    price: String(car.price),
    mileage: String(car.mileage),
    fuel: car.fuel,
    transmission: car.transmission,
    bodyType: car.bodyType,
    engine: car.engine,
    drive: car.drive,
    color: car.color,
    condition: car.condition,
    status: car.status,
    images: [...car.images],
    features: [...car.features],
    description: car.description,
    featured: Boolean(car.featured),
  };
}

// The form's values → the fields of a car (numbers become real numbers)
export function carValuesToFields(values: FormValues, isAdmin: boolean): Partial<Car> {
  return {
    title: String(values.title).trim(),
    make: String(values.make).trim(),
    model: String(values.model).trim(),
    year: Number(values.year),
    price: Number(values.price),
    mileage: Number(values.mileage),
    fuel: String(values.fuel),
    transmission: String(values.transmission),
    bodyType: String(values.bodyType),
    engine: String(values.engine).trim(),
    drive: String(values.drive),
    color: String(values.color).trim(),
    condition: values.condition as CarCondition,
    status: values.status as CarStatus,
    images: values.images as string[],
    features: values.features as string[],
    description: String(values.description).trim(),
    // Only the admin can change "featured"
    ...(isAdmin ? { featured: Boolean(values.featured) } : {}),
  };
}