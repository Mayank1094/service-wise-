export interface PredictionRequest {
  vehicle_type: string;
  vehicle_age: number;
  kilometers_driven: number;
  fuel_type: string;
  engine_type: string;
  service_type: string;
  previous_service_cost?: number;
  previous_services?: number;
}

export interface PredictionResponse {
  predicted_cost: number;
  model_used: string;
  accuracy_estimate: string;
}

/**
 * Mock prediction service to simulate connecting to a Python ML backend.
 * Replace the contents of this function with an actual `fetch` call to the FastAPI backend later.
 */
export async function predictServiceCost(data: PredictionRequest): Promise<PredictionResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log("Mock API received:", data);

  // Generate a somewhat realistic dummy cost based on inputs
  let baseCost = 2000;
  
  if (data.vehicle_type === 'SUV') baseCost += 3000;
  if (data.vehicle_type === 'Car') baseCost += 1500;
  
  if (data.service_type === 'Major') baseCost *= 2.5;
  if (data.service_type === 'Repair') baseCost *= 3;
  
  baseCost += (data.vehicle_age * 500);
  baseCost += (data.kilometers_driven * 0.05);

  if (data.fuel_type === 'Diesel') baseCost += 1000;

  // Add some randomness
  const finalCost = Math.round(baseCost + (Math.random() * 1000 - 500));

  return {
    predicted_cost: Math.max(500, finalCost), // Ensure it's not negative or too low
    model_used: 'RandomForestRegressor_v1',
    accuracy_estimate: '~85%' // Honest representation as requested
  };
}
