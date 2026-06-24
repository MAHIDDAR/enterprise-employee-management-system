from fastapi import APIRouter
from fastapi.responses import StreamingResponse

import pandas as pd
from datetime import timedelta
import io
import os


forecast_router = APIRouter()


CSV_FILE_NAME = "grocery_chain_data.csv"


def get_csv_path():
    current_dir = os.getcwd()

    possible_paths = [
        CSV_FILE_NAME,
        os.path.join(current_dir, CSV_FILE_NAME),
        os.path.join(current_dir, "backend", CSV_FILE_NAME),
        os.path.join(current_dir, "data", CSV_FILE_NAME),
    ]

    for path in possible_paths:
        if os.path.exists(path):
            return path

    return CSV_FILE_NAME


def load_sales_data():
    csv_path = get_csv_path()

    data = pd.read_csv(csv_path)

    data["transaction_date"] = pd.to_datetime(
        data["transaction_date"],
        errors="coerce"
    )

    data = data.dropna(
        subset=[
            "transaction_date",
            "aisle",
            "product_name",
            "quantity"
        ]
    )

    data["quantity"] = pd.to_numeric(
        data["quantity"],
        errors="coerce"
    ).fillna(0)

    data["discount_amount"] = pd.to_numeric(
        data["discount_amount"],
        errors="coerce"
    ).fillna(0)

    data["final_amount"] = pd.to_numeric(
        data["final_amount"],
        errors="coerce"
    ).fillna(0)

    data["date"] = data["transaction_date"].dt.date

    data["month"] = data["transaction_date"].dt.month

    data["day_of_week"] = data["transaction_date"].dt.dayofweek

    data["is_promotion"] = data["discount_amount"].apply(
        lambda value: 1 if value > 0 else 0
    )

    return data


def calculate_forecast_value(history):
    if history.empty:
        return 0

    total_demand = history["quantity"].sum()

    unique_days = history["date"].nunique()

    if unique_days == 0:
        unique_days = 1

    average_daily_demand = total_demand / unique_days

    recent_history = history.sort_values(
        "transaction_date"
    ).tail(30)

    recent_average = recent_history["quantity"].mean()

    if pd.isna(recent_average):
        recent_average = average_daily_demand

    promotion_factor = 1

    if history["is_promotion"].mean() > 0.3:
        promotion_factor = 1.10

    forecast = (
        average_daily_demand * 0.6
        +
        recent_average * 0.4
    ) * promotion_factor

    if forecast < 1:
        forecast = 1

    return round(float(forecast))


def generate_forecast(category=None, product=None):
    data = load_sales_data()

    if category and category != "All Categories":
        data = data[
            data["aisle"].str.lower() == category.lower()
        ]

    if product and product != "All Products":
        data = data[
            data["product_name"].str.lower() == product.lower()
        ]

    if data.empty:
        return []

    last_date = data["transaction_date"].max().date()

    forecast_records = []

    categories = data["aisle"].dropna().unique()

    for category_name in categories:
        category_data = data[
            data["aisle"] == category_name
        ]

        products = category_data["product_name"].dropna().unique()

        for product_name in products:
            product_data = category_data[
                category_data["product_name"] == product_name
            ]

            daily_forecast = calculate_forecast_value(
                product_data
            )

            for day in range(1, 31):
                forecast_date = last_date + timedelta(days=day)

                seasonal_factor = 1

                if forecast_date.weekday() in [5, 6]:
                    seasonal_factor = 1.15

                predicted_demand = round(
                    daily_forecast * seasonal_factor
                )

                forecast_records.append({
                    "forecastPeriod": str(forecast_date),
                    "category": category_name,
                    "product": product_name,
                    "predictedDemand": predicted_demand,
                    "confidence": 85
                })

    return forecast_records


@forecast_router.get("/api/forecasts/demand")
def get_demand_forecast(
    category: str = "All Categories",
    product: str = "All Products"
):
    forecast_data = generate_forecast(
        category=category,
        product=product
    )

    total_predicted_demand = sum(
        item["predictedDemand"]
        for item in forecast_data
    )

    categories = sorted(
        list(
            set(
                item["category"]
                for item in forecast_data
            )
        )
    )

    products = sorted(
        list(
            set(
                item["product"]
                for item in forecast_data
            )
        )
    )

    demand_by_date = {}

    for item in forecast_data:
        date_value = item["forecastPeriod"]

        if date_value not in demand_by_date:
            demand_by_date[date_value] = 0

        demand_by_date[date_value] += item["predictedDemand"]

    trend_data = []

    for date_value, demand in demand_by_date.items():
        trend_data.append({
            "date": date_value,
            "predictedDemand": demand
        })

    trend_data = sorted(
        trend_data,
        key=lambda item: item["date"]
    )

    top_products = {}

    for item in forecast_data:
        product_name = item["product"]

        if product_name not in top_products:
            top_products[product_name] = 0

        top_products[product_name] += item["predictedDemand"]

    top_product_data = []

    for product_name, demand in top_products.items():
        top_product_data.append({
            "product": product_name,
            "predictedDemand": demand
        })

    top_product_data = sorted(
        top_product_data,
        key=lambda item: item["predictedDemand"],
        reverse=True
    )[:5]

    category_data = {}

    for item in forecast_data:
        category_name = item["category"]

        if category_name not in category_data:
            category_data[category_name] = 0

        category_data[category_name] += item["predictedDemand"]

    category_forecast = []

    for category_name, demand in category_data.items():
        category_forecast.append({
            "category": category_name,
            "predictedDemand": demand
        })

    return {
        "summary": {
            "next30DaysForecast": total_predicted_demand,
            "averageConfidence": 85,
            "productsTracked": len(products),
            "categories": len(categories)
        },
        "categories": categories,
        "products": products,
        "trendData": trend_data,
        "categoryForecast": category_forecast,
        "topProducts": top_product_data,
        "forecastDetails": forecast_data[:50]
    }


@forecast_router.get("/api/forecasts/category")
def get_category_forecast(category: str):
    return get_demand_forecast(
        category=category,
        product="All Products"
    )


@forecast_router.get("/api/forecasts/product")
def get_product_forecast(product: str):
    return get_demand_forecast(
        category="All Categories",
        product=product
    )


@forecast_router.get("/api/forecasts/export")
def export_forecast_report(
    category: str = "All Categories",
    product: str = "All Products"
):
    forecast_data = generate_forecast(
        category=category,
        product=product
    )

    dataframe = pd.DataFrame(forecast_data)

    stream = io.StringIO()

    dataframe.to_csv(
        stream,
        index=False
    )

    stream.seek(0)

    response = StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv"
    )

    response.headers["Content-Disposition"] = (
        "attachment; filename=demand-forecast-report.csv"
    )

    return response