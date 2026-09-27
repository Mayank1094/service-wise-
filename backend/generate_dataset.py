import csv
import random
import os
import math

def generate_dataset(num_records=100000, output_path="data/vehicle_service_data.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    headers = [
        "vehicle_type",
        "brand_segment",
        "vehicle_age",
        "kilometers_driven",
        "fuel_type",
        "engine_type",
        "service_type",
        "workshop_type",
        "city_tier",
        "service_history",
        "addon_brake_pads",
        "addon_ac_service",
        "addon_battery",
        "addon_wheel_care",
        "addon_clutch",
        "addon_suspension",
        "actual_cost"
    ]
    
    vehicle_types = ["Car", "SUV", "Bike", "Scooty", "Electric Bike", "Electric Scooter"]
    vehicle_weights = [0.36, 0.28, 0.17, 0.11, 0.03, 0.05]
    
    workshop_types = ["authorized_oem", "multibrand", "local_independent"]
    workshop_weights = [0.42, 0.38, 0.20]
    
    city_tiers = ["tier1_metro", "tier2", "tier3"]
    city_weights = [0.48, 0.36, 0.16]
    
    service_types = ["General", "Major", "Repair"]
    service_weights = [0.55, 0.30, 0.15]
    
    history_types = ["regular", "overdue", "first_service"]
    history_weights = [0.70, 0.20, 0.10]

    records = []

    for _ in range(num_records):
        v_type = random.choices(vehicle_types, weights=vehicle_weights)[0]
        is_2w = v_type in ["Bike", "Scooty", "Electric Bike", "Electric Scooter"]
        is_ev_vehicle = v_type in ["Electric Bike", "Electric Scooter"]

        # 1. Segment & Fuel / Transmission distributions per vehicle type
        if v_type == "Bike":
            segments = ["budget", "mid", "premium", "luxury"]
            seg_weights = [0.45, 0.35, 0.17, 0.03]
            segment = random.choices(segments, weights=seg_weights)[0]
            f_type = "Petrol"
            e_type = random.choices(["Manual", "Automatic"], weights=[0.88, 0.12])[0]
            age = int(random.triangular(0, 15, 3.5))
            annual_km = random.randint(5000, 11000)
            km = min(int(max(500, age * annual_km + random.randint(-2000, 3000))), 150000)

        elif v_type == "Scooty":
            segments = ["budget", "mid", "premium"]
            seg_weights = [0.55, 0.38, 0.07]
            segment = random.choices(segments, weights=seg_weights)[0]
            f_type = "Petrol"
            e_type = "Automatic"
            age = int(random.triangular(0, 14, 4))
            annual_km = random.randint(4000, 8500)
            km = min(int(max(500, age * annual_km + random.randint(-1500, 2500))), 120000)

        elif v_type == "Electric Bike":
            segments = ["budget", "premium"]
            segment = random.choices(segments, weights=[0.65, 0.35])[0]
            f_type = "EV"
            e_type = "Automatic"
            age = int(random.triangular(0, 5, 1.8))
            annual_km = random.randint(5000, 9500)
            km = min(int(max(500, age * annual_km + random.randint(-1000, 2000))), 65000)

        elif v_type == "Electric Scooter":
            segments = ["budget", "mid", "premium"]
            segment = random.choices(segments, weights=[0.35, 0.55, 0.10])[0]
            f_type = "EV"
            e_type = "Automatic"
            age = int(random.triangular(0, 5, 2))
            annual_km = random.randint(4000, 8500)
            km = min(int(max(500, age * annual_km + random.randint(-1000, 2000))), 60000)

        elif v_type == "Car":
            segments = ["budget", "mid", "premium", "luxury"]
            segment = random.choices(segments, weights=[0.42, 0.38, 0.14, 0.06])[0]
            if segment == "luxury":
                f_type = random.choices(["Petrol", "Diesel", "EV", "Hybrid"], weights=[0.45, 0.40, 0.08, 0.07])[0]
            else:
                f_type = random.choices(["Petrol", "Diesel", "EV", "Hybrid"], weights=[0.58, 0.28, 0.07, 0.07])[0]
            e_type = "Automatic" if f_type == "EV" else random.choices(["Manual", "Automatic"], weights=[0.58, 0.42])[0]
            age = int(random.triangular(0, 16, 4.5))
            annual_km = random.randint(8000, 16000)
            km = min(int(max(800, age * annual_km + random.randint(-3000, 5000))), 220000)

        else: # SUV
            segments = ["budget", "mid", "premium", "luxury"]
            segment = random.choices(segments, weights=[0.32, 0.44, 0.18, 0.06])[0]
            f_type = random.choices(["Diesel", "Petrol", "EV", "Hybrid"], weights=[0.52, 0.32, 0.08, 0.08])[0]
            e_type = "Automatic" if f_type == "EV" else random.choices(["Manual", "Automatic"], weights=[0.48, 0.52])[0]
            age = int(random.triangular(0, 15, 4))
            annual_km = random.randint(10000, 20000)
            km = min(int(max(1000, age * annual_km + random.randint(-3000, 6000))), 260000)

        s_type = random.choices(service_types, weights=service_weights)[0]
        w_type = random.choices(workshop_types, weights=workshop_weights)[0]
        c_tier = random.choices(city_tiers, weights=city_weights)[0]
        
        if age == 0:
            s_hist = "first_service"
        else:
            s_hist = random.choices(history_types, weights=history_weights)[0]

        # 2. Base Parts and Labor costs by segment
        if is_2w:
            if segment == "budget" or v_type == "Scooty":
                base_parts = random.uniform(350, 480)
                base_labor = random.uniform(250, 350)
            elif segment == "mid":
                base_parts = random.uniform(550, 750)
                base_labor = random.uniform(380, 500)
            elif segment == "premium":
                base_parts = random.uniform(1100, 1550)
                base_labor = random.uniform(650, 880)
            else:  # luxury 2W
                base_parts = random.uniform(2300, 3200)
                base_labor = random.uniform(1300, 1800)
        else:
            # 4-Wheelers
            if segment == "budget":
                base_parts = random.uniform(1700, 2200)
                base_labor = random.uniform(1100, 1500)
            elif segment == "mid":
                base_parts = random.uniform(3100, 3900)
                base_labor = random.uniform(1800, 2400)
            elif segment == "premium":
                base_parts = random.uniform(5200, 6800)
                base_labor = random.uniform(3000, 4100)
            else:  # luxury car
                base_parts = random.uniform(13500, 17500)
                base_labor = random.uniform(6800, 9200)

            if v_type == "SUV":
                base_parts *= 1.25
                base_labor *= 1.20

        # 3. Service Scope Multiplier
        if s_type == "General":
            service_mult = random.uniform(0.96, 1.04)
        elif s_type == "Major":
            service_mult = random.uniform(2.35, 2.65)
        else:  # Repair
            service_mult = random.uniform(1.55, 1.85)

        base_parts *= service_mult
        base_labor *= service_mult

        # 4. Fuel & Transmission adjustments
        if f_type == "Diesel":
            base_parts *= 1.26
            base_labor *= 1.14
        elif f_type == "Hybrid":
            base_parts *= 1.10
        elif f_type == "EV" or is_ev_vehicle:
            base_parts *= 0.55
            base_labor *= 0.75

        if e_type == "Automatic" and not (f_type == "EV" or is_ev_vehicle):
            base_parts += random.uniform(150, 250) if is_2w else random.uniform(700, 1100)

        # 5. Aging and Mileage Wear Multiplier
        age_factor = 1.0 + min(0.42, age * (0.024 if is_2w else 0.028))
        km_scale = 80000.0 if is_2w else 180000.0
        km_factor = 1.0 + min(0.35, (km / km_scale) * 0.25)

        parts_total = base_parts * age_factor * km_factor
        labor_total = base_labor * age_factor * km_factor

        # 6. Maintenance History
        if s_hist == "overdue":
            parts_total *= random.uniform(1.12, 1.20)
            labor_total *= random.uniform(1.20, 1.30)
        elif s_hist == "first_service":
            labor_total *= random.uniform(0.75, 0.88)

        # 7. Add-on Component Probabilities based on KM and Age
        # Realistic conditional probabilities
        prob_brake = min(0.65, max(0.08, (km / 35000.0) * 0.35 + (age / 10.0) * 0.2))
        prob_ac = 0.0 if is_2w else min(0.55, max(0.05, (age / 8.0) * 0.4 + (km / 45000.0) * 0.2))
        prob_battery = min(0.50, max(0.04, max(0, age - 2.5) * 0.22))
        prob_wheel = 0.0 if is_2w else min(0.60, max(0.12, (km / 30000.0) * 0.35))
        prob_clutch = min(0.45, max(0.03, (km / 60000.0) * 0.40)) if e_type == "Manual" else 0.0
        prob_susp = min(0.40, max(0.04, (km / 50000.0) * 0.35 + (age / 10.0) * 0.15))

        has_brake = 1 if random.random() < prob_brake else 0
        has_ac = 1 if random.random() < prob_ac else 0
        has_battery = 1 if random.random() < prob_battery else 0
        has_wheel = 1 if random.random() < prob_wheel else 0
        has_clutch = 1 if random.random() < prob_clutch else 0
        has_susp = 1 if random.random() < prob_susp else 0

        # Segment-specific addon pricing lookup
        addon_total = 0.0

        if has_brake:
            if is_2w:
                addon_total += {"budget": 350, "mid": 600, "premium": 1200, "luxury": 2400}.get(segment, 500)
            else:
                addon_total += {"budget": 1400, "mid": 2600, "premium": 4800, "luxury": 12000}.get(segment, 2500)

        if has_ac and not is_2w:
            addon_total += {"budget": 1400, "mid": 2100, "premium": 3400, "luxury": 6500}.get(segment, 2000)

        if has_battery:
            if is_2w:
                addon_total += {"budget": 1100, "mid": 1600, "premium": 2800, "luxury": 4500}.get(segment, 1400)
            else:
                addon_total += {"budget": 3600, "mid": 4800, "premium": 8200, "luxury": 16500}.get(segment, 4500)

        if has_wheel and not is_2w:
            addon_total += {"budget": 650, "mid": 950, "premium": 1500, "luxury": 2800}.get(segment, 900)

        if has_clutch:
            if is_2w:
                addon_total += {"budget": 950, "mid": 1600, "premium": 2900, "luxury": 4800}.get(segment, 1400)
            else:
                addon_total += {"budget": 3800, "mid": 6200, "premium": 12500, "luxury": 28000}.get(segment, 6000)

        if has_susp:
            if is_2w:
                addon_total += {"budget": 750, "mid": 1400, "premium": 2400, "luxury": 4200}.get(segment, 1200)
            else:
                addon_total += {"budget": 3200, "mid": 5800, "premium": 11000, "luxury": 26000}.get(segment, 5500)

        # 8. Workshop Multiplier
        if w_type == "authorized_oem":
            ws_parts_mult = 1.0
            ws_labor_mult = 1.0
            ws_addon_mult = 1.0
        elif w_type == "multibrand":
            ws_parts_mult = random.uniform(0.82, 0.88)
            ws_labor_mult = random.uniform(0.62, 0.68)
            ws_addon_mult = 0.82
        else: # local_independent
            ws_parts_mult = random.uniform(0.68, 0.75)
            ws_labor_mult = random.uniform(0.42, 0.48)
            ws_addon_mult = 0.68

        # 9. City Tier Labor Adjustment
        if c_tier == "tier1_metro":
            city_labor_mult = random.uniform(1.15, 1.20)
        elif c_tier == "tier2":
            city_labor_mult = 1.0
        else: # tier3
            city_labor_mult = random.uniform(0.82, 0.88)

        final_parts = parts_total * ws_parts_mult
        final_labor = labor_total * ws_labor_mult * city_labor_mult
        final_addon = addon_total * ws_addon_mult

        subtotal = final_parts + final_labor + final_addon
        tax_gst = subtotal * 0.18
        final_bill = subtotal + tax_gst

        # Add natural realistic Gaussian workshop noise (+/- 2.5%)
        final_bill += random.gauss(0, final_bill * 0.025)

        # Minimum cost safety bounds
        min_cost = 300 if is_2w else 1400
        actual_cost = max(min_cost, int(round(final_bill, -1)))

        records.append([
            v_type,
            segment,
            age,
            km,
            f_type,
            e_type,
            s_type,
            w_type,
            c_tier,
            s_hist,
            has_brake,
            has_ac,
            has_battery,
            has_wheel,
            has_clutch,
            has_susp,
            actual_cost
        ])

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(records)

    print(f"✓ Successfully generated {num_records:,} comprehensive records in '{output_path}'")

if __name__ == "__main__":
    generate_dataset(num_records=100000)
