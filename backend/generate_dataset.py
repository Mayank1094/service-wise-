import csv
import random
import os

def generate_dataset(num_records=20000, output_path="data/vehicle_service_data.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    headers = [
        "vehicle_type",
        "service_type",
        "vehicle_age",
        "kilometers_driven",
        "fuel_type",
        "engine_type",
        "previous_services",
        "actual_cost"
    ]
    
    records = []
    
    vehicle_types = [
        "Car", 
        "SUV", 
        "Bike", 
        "Scooty", 
        "Electric Bike", 
        "Electric Scooter"
    ]
    # Realistic vehicle market distribution weights
    vehicle_weights = [0.35, 0.25, 0.18, 0.12, 0.04, 0.06]
    service_types = ["General", "Major", "Repair"]

    for _ in range(num_records):
        v_type = random.choices(vehicle_types, weights=vehicle_weights)[0]
        
        # Strictly enforce realistic fuel and transmission mappings per vehicle type
        if v_type == "Bike":
            f_type = "Petrol"
            e_type = random.choices(["Manual", "Automatic"], weights=[0.85, 0.15])[0]
            age = int(random.triangular(0, 15, 4))
            annual_km = random.randint(5000, 10000)
            km = min(int(max(500, age * annual_km + random.randint(-2000, 3000))), 160000)
            base_service_cost = random.randint(500, 1100)

        elif v_type == "Scooty":
            f_type = "Petrol"
            e_type = "Automatic"  # All modern scooties (Activa, Jupiter, Access) are gearless CVT
            age = int(random.triangular(0, 14, 4))
            annual_km = random.randint(4000, 8000)
            km = min(int(max(500, age * annual_km + random.randint(-1500, 2500))), 130000)
            base_service_cost = random.randint(400, 850)

        elif v_type == "Electric Bike":
            f_type = "EV"
            e_type = "Automatic"  # Direct drive / gearless
            age = int(random.triangular(0, 5, 2))  # EV bikes are relatively new
            annual_km = random.randint(5000, 9000)
            km = min(int(max(500, age * annual_km + random.randint(-1000, 2000))), 70000)
            base_service_cost = random.randint(400, 800)

        elif v_type == "Electric Scooter":
            f_type = "EV"
            e_type = "Automatic"  # Direct drive / gearless (Ola, Ather, TVS iQube)
            age = int(random.triangular(0, 5, 2))  # EV scooters are recent
            annual_km = random.randint(4000, 8000)
            km = min(int(max(500, age * annual_km + random.randint(-1000, 2000))), 65000)
            base_service_cost = random.randint(350, 750)

        elif v_type == "Car":
            f_type = random.choices(["Petrol", "Diesel", "EV", "Hybrid"], weights=[0.52, 0.32, 0.08, 0.08])[0]
            e_type = "Automatic" if f_type == "EV" else random.choices(["Manual", "Automatic"], weights=[0.60, 0.40])[0]
            age = int(random.triangular(0, 16, 5))
            annual_km = random.randint(8000, 16000)
            km = min(int(max(800, age * annual_km + random.randint(-3000, 5000))), 240000)
            base_service_cost = random.randint(2800, 4800)

        else:  # SUV
            f_type = random.choices(["Diesel", "Petrol", "EV", "Hybrid"], weights=[0.52, 0.32, 0.08, 0.08])[0]
            e_type = "Automatic" if f_type == "EV" else random.choices(["Manual", "Automatic"], weights=[0.50, 0.50])[0]
            age = int(random.triangular(0, 15, 4))
            annual_km = random.randint(10000, 20000)
            km = min(int(max(1000, age * annual_km + random.randint(-3000, 6000))), 280000)
            base_service_cost = random.randint(4500, 7800)

        # Service type distribution (55% General, 30% Major, 15% Repair)
        s_type = random.choices(service_types, weights=[0.55, 0.30, 0.15])[0]
        
        # Previous services count based on age (~1.5 per year)
        prev_services = max(0, int(age * random.uniform(1.2, 2.0)))

        # Fuel type cost variations
        cost = float(base_service_cost)
        if f_type == "Diesel":
            cost *= 1.25  # Diesel fuel filter, synthetic oil, particulate cleaning
        elif f_type == "Hybrid":
            cost *= 1.12
        elif f_type == "EV" and v_type in ["Car", "SUV"]:
            cost *= 0.70  # No engine oil/spark plugs, but diagnostics + brake/coolant

        # Transmission maintenance for cars/SUVs
        if e_type == "Automatic" and v_type in ["Car", "SUV"]:
            cost += random.randint(400, 1000)

        # Vehicle wear index based on age and usage
        is_two_wheeler = v_type in ["Bike", "Scooty", "Electric Bike", "Electric Scooter"]
        max_km_scale = 90000.0 if is_two_wheeler else 200000.0
        max_age_scale = 12.0 if is_two_wheeler else 15.0
        wear_index = min(1.0, (age / max_age_scale) * 0.5 + (km / max_km_scale) * 0.5)

        # Service scope multiplier
        if s_type == "General":
            cost *= random.uniform(0.97, 1.05)
        elif s_type == "Major":
            # Major service cost increases smoothly with wear/age of components
            major_mult = 2.4 + (wear_index * 0.8) + random.uniform(-0.06, 0.06)
            cost *= major_mult
        else:  # Repair
            # Real-world: older cars with higher wear experience higher-severity repairs (transmission/engine/suspension)
            repair_mult = 2.1 + (wear_index * 2.6) + random.uniform(-0.15, 0.15)
            cost *= repair_mult

        # Wear and tear aging factor on consumables and labor
        wear_factor = 1.0 + (age * (0.02 if is_two_wheeler else 0.025)) + ((km / max_km_scale) * 0.04)
        cost *= wear_factor

        # Add realistic workshop spread variance (±4%)
        cost += random.gauss(0, cost * 0.04)

        # Safety clamp minimums
        min_cost = 300 if is_two_wheeler else 1500
        final_cost = max(min_cost, round(cost, -1))

        records.append([
            v_type,
            s_type,
            age,
            km,
            f_type,
            e_type,
            prev_services,
            int(final_cost)
        ])

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(records)

    print(f"Successfully generated {num_records} real-world records in '{output_path}'")

if __name__ == "__main__":
    generate_dataset()
