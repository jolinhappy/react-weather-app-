import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg'


import { ThemeProvider } from '@emotion/react';
import dayjs from 'dayjs';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`
const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: color: ${({ theme }) => theme.textColor};
  svg {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => isLoading ? '1.5s' : '0s'}
  }
  @keyframes rotate {
    from{
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  `
const AUTHORIZATION_KEY = 'CWB-1C47322D-578A-4E28-8809-8436255ACD97';
const LOCATION_NAME = '臺北';
const LOCATION_NAME_FORECAST = '臺北市'

function App() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [weatherElement, setWeatherElement] = useState({
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: '0',
    comfortability: '0',
    weatherCode: 0,
    isLoading: true,
  });
  const {
    locationName, 
    description,
    windSpeed,
    temperature,
    rainPossibility,
    observationTime,
    comfortability,
    isLoading,
  } = weatherElement;
  const fetchCurrentWeather = () => {
    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
    )
    .then((response) => response.json())
    .then((data) => {
      setWeatherElement((prevState) => ({
        ...prevState,
        isLoading: true
      }))
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        // 第一個參數是最後被整理完成的新物件，因為initialValue設定為{}，所以這裡的第一個參數代表物件
        // 第二個參數是現在比對中的參數(遍歷)
        if (['WDSD', 'TEMP'].includes(item.elementName)) {
          // 如果符合條件，就塞進neededElement這個物件
          // 用對應的WDSD和TEMP當作KEY，對應的value當作值塞入物件(下方這句)
          neededElements[item.elementName] = item.elementValue
        }
          return neededElements
        }, {}
      )
      // 把整理好的物件資料帶入setSomthing裡面
      setWeatherElement((prevState) => (
        {
          ...prevState,
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          isLoading: false
        }
      ));
    })
  }
  const fetchWeatherForecast = () => {
    fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`
    )
    .then((response) => response.json())
    .then((data) => {
      // setWeatherElement((prevState) => ({
      //   ...prevState,
      //   isLoading: true
      // }))
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        // 第一個參數是最後被整理完成的新物件，因為initialValue設定為{}，所以這裡的第一個參數代表物件
        // 第二個參數是現在比對中的參數(遍歷)
        if (['Wx', "PoP", 'CI'].includes(item.elementName)) {
          // 如果符合條件，就塞進neededElement這個物件
          // 用對應的WDSD和TEMP當作KEY，對應的value當作值塞入物件(下方這句)
          neededElements[item.elementName] = item.time[0].parameter;
        }
          return neededElements
        }, {}
      )
      
      // 把整理好的物件資料帶入setSomthing裡面
      setWeatherElement((prevState) => (
        {
          ...prevState,
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        }
      ));
    })
  }
  useEffect(() => {
    fetchCurrentWeather();
    fetchWeatherForecast();
  }, [])
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard>
          <Location>{locationName}</Location>
            <Description>{description} {comfortability}</Description>
            <CurrentWeather>
              <Temperature>
                {Math.round(temperature)} <Celsius>°C</Celsius>
              </Temperature>
              <DayCloudy />
            </CurrentWeather>
            <AirFlow>
              <AirFlowIcon /> {windSpeed} m/h
            </AirFlow>
            <Rain>
              <RainIcon /> {rainPossibility}%
            </Rain>
            <Refresh onClick={ () => {
              fetchCurrentWeather()
              fetchWeatherForecast()
            }} isLoading={isLoading} >
            最後觀測時間：
            {new Intl.DateTimeFormat('zh-TW', {
              hour: 'numeric',
              minute: 'numeric',
            }).format(dayjs(observationTime))}{' '}
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
          </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
