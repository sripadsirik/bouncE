# main.py
import os
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Alpaca & ML imports
import alpaca_trade_api as tradeapi
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.linear_model import Ridge
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit

load_dotenv()

# Get your Alpaca credentials from the environment
API_KEY = os.getenv("APCA_API_KEY_ID")
API_SECRET_KEY = os.getenv("APCA_API_SECRET_KEY")
BASE_URL = "https://paper-api.alpaca.markets"

app = FastAPI()

# Allow CORS for requests coming from your frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend domain in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a Pydantic model for the incoming request
class StockSymbol(BaseModel):
    symbol: str

@app.post("/predict")
async def predict(stock: StockSymbol):
    symbol = stock.symbol
    if not symbol:
        raise HTTPException(status_code=400, detail="Stock symbol is required")
    
    # Create Alpaca API clients
    try:
        api = tradeapi.REST(API_KEY, API_SECRET_KEY, BASE_URL, api_version='v2')
        stock_client = StockHistoricalDataClient(API_KEY, API_SECRET_KEY)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating Alpaca client: {str(e)}")
    
    # Fetch historical data (approximately 11 years of data)
    timeframe = TimeFrame.Day 
    start_date = (datetime.today() - timedelta(days=5000)).strftime("%Y-%m-%d")
    
    request_params = StockBarsRequest(
        symbol_or_symbols=symbol, 
        timeframe=timeframe,
        start=start_date
    )
    
    try:
        bars = stock_client.get_stock_bars(request_params).df
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving data for {symbol}: {str(e)}")
    
    if bars.empty:
        raise HTTPException(status_code=404, detail="No historical data found for this symbol.")
    
    # Prepare and clean the data
    bars.reset_index(inplace=True)
    bars['timestamp'] = pd.to_datetime(bars['timestamp'], utc=True).dt.tz_localize(None)
    bars['year'] = bars['timestamp'].dt.year
    bars['month'] = bars['timestamp'].dt.month
    bars['day'] = bars['timestamp'].dt.day
    bars['dayofweek'] = bars['timestamp'].dt.dayofweek
    bars.drop(columns=['timestamp'], inplace=True)
    bars = bars.drop(columns=['symbol'], errors='ignore')
    
    # Prepare features (X) and target (y)
    X = bars.drop(columns=['close'])
    y = bars['close']
    
    split_index = int(len(bars) * 0.8)
    X_train, _ = X.iloc[:split_index], X.iloc[split_index:]
    y_train, _ = y.iloc[:split_index], y.iloc[split_index:]
    
    # Create a pipeline for scaling, polynomial feature generation, and Ridge regression
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('poly', PolynomialFeatures()),
        ('ridge', Ridge())
    ])
    
    param_grid = {
        'poly__degree': [1, 2, 3],
        'ridge__alpha': [0.01, 0.1, 1.0, 10.0, 100.0]
    }
    
    tscv = TimeSeriesSplit(n_splits=5)
    grid_search = GridSearchCV(
        pipeline,
        param_grid,
        cv=tscv,
        scoring='neg_mean_squared_error',
        n_jobs=-1
    )
    
    grid_search.fit(X_train, y_train)
    
    # Define weighted moving average (WMA) helper function
    def weighted_moving_average(data, window_size):
        weights = np.arange(1, window_size + 1)  # More weight to recent data points
        return (data[-window_size:] * weights).sum() / weights.sum()
    
    window_size = 5   # last 5 days to calculate WMA
    trend_days = 3    # predict for next 3 trading days
    
    # Compute WMA for each expected feature.
    # (If a feature isn’t present, default to 0.)
    columns_needed = ['open', 'high', 'low', 'volume', 'trade_count', 'vwap']
    wma_features = {}
    for col in columns_needed:
        if col in bars.columns:
            wma_features[col] = weighted_moving_average(bars[col].values, window_size)
        else:
            wma_features[col] = 0
    
    # Determine the last trading date in the data and compute future business days.
    last_row = bars.iloc[-1]
    last_date = pd.Timestamp(year=int(last_row['year']),
                             month=int(last_row['month']),
                             day=int(last_row['day']))
    future_dates = pd.bdate_range(start=last_date + timedelta(days=1), periods=trend_days)
    
    # Build a DataFrame of features for future predictions.
    future_features_list = []
    for date in future_dates:
        future_features_list.append({
            'open': wma_features.get('open', 0),
            'high': wma_features.get('high', 0),
            'low': wma_features.get('low', 0),
            'volume': wma_features.get('volume', 0),
            'trade_count': wma_features.get('trade_count', 0),
            'vwap': wma_features.get('vwap', 0),
            'year': date.year,
            'month': date.month,
            'day': date.day,
            'dayofweek': date.dayofweek
        })
    
    future_features = pd.DataFrame(future_features_list)
    future_predictions = grid_search.predict(future_features)
    
    # Prepare the output with the date and predicted close price.
    predictions = []
    for date, pred in zip(future_dates, future_predictions):
        predictions.append({
            "date": date.strftime("%Y-%m-%d"),
            "predicted_close": round(float(pred), 2)
        })
    
    return {"predictions": predictions}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5174, reload=True)
